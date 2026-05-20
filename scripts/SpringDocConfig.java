package com.surge.server.infra.doc.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.SimpleType;
import com.github.therapi.runtimejavadoc.ClassJavadoc;
import com.github.therapi.runtimejavadoc.FieldJavadoc;
import com.github.therapi.runtimejavadoc.RuntimeJavadoc;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.ArraySchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springdoc.core.customizers.PropertyCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SpringDoc + therapi-runtime-javadoc 配置。
 * <p>
 * 由于 Jimmer APT 编译期间生成的 DTO 类型在 Therapi 提取时尚未完全解析，
 * 导致 __Javadoc.json 中参数类型记录为短名（如 "UserSpec"）而非全限定名。
 * Therapi 运行时加载 JSON 时无法识别这些短名类型，会直接丢弃对应方法的文档。
 * <p>
 * 本配置通过直接读取 __Javadoc.json 文件并按方法名模糊匹配来绕过此问题。
 */
@Configuration
public class SpringDocConfig {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Map<String, String> AUDIT_FIELD_DESCRIPTIONS = createAuditFieldDescriptions();

    /**
     * 缓存：类全限定名 -> 该类的 Javadoc JSON 数据
     */
    private final Map<String, JavadocData> javadocCache = new ConcurrentHashMap<>();

    /**
     * 记录 tag 名称映射：默认名(如 user-controller) -> 类级 Javadoc 描述(如 用户相关接口)
     */
    private final Map<String, String> tagNameMapping = new ConcurrentHashMap<>();

    /**
     * 缓存：扫描到的 DTO/VO 类，简单类名 -> Class。延迟初始化，首次使用时填充。
     */
    private volatile Map<String, Class<?>> dtoClassCache;
    
    
    
    @Value("${sa-token.token-name}")
    String tokenName = "Authorization";
    
    @Bean
    @ConfigurationProperties(prefix = "springdoc.open-api.info")
    public Info getInfo() {
        return new Info();
    }
    
    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI();
        Components components = new Components()
                .addSecuritySchemes(
                        tokenName,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name(tokenName)
                );
        return openAPI.components(components)
                .addSecurityItem(new SecurityRequirement().addList(tokenName));
    }

    /**
     * 为枚举类型的 Schema 添加 OpenAPI 扩展字段，供前端类型生成脚本使用。
     * <p>
     * 添加的扩展字段：
     * <ul>
     *   <li>x-enum-name: 枚举类名</li>
     *   <li>x-enum-varnames: 枚举常量名列表</li>
     *   <li>x-enum-description: 枚举类的 Javadoc 注释</li>
     *   <li>x-enum-value-descriptions: 每个枚举常量的 Javadoc 注释列表</li>
     * </ul>
     */
    @Bean
    public PropertyCustomizer enumNamePropertyCustomizer() {
        return (schema, type) -> {
            if (schema.getEnum() == null || schema.getEnum().isEmpty()) {
                return schema;
            }
            
            Class<?> clazz = switch (type.getType()) {
                case Class<?> c -> c;
                case SimpleType st -> st.getRawClass();
                default -> null;
            };
            
            if (clazz == null || !clazz.isEnum()) {
                return schema;
            }
            
            Enum<?>[] constants = (Enum<?>[]) clazz.getEnumConstants();
            
            schema.addExtension("x-enum-name", clazz.getSimpleName());
            schema.addExtension("x-enum-varnames", Arrays.stream(constants).map(Enum::name).toList());
            
            ClassJavadoc classDoc = RuntimeJavadoc.getJavadoc(clazz);
            if (classDoc == null) {
                return schema;
            }
            
            String comment = classDoc.getComment().toString();
            if (!comment.isEmpty()) {
                schema.addExtension("x-enum-description", comment);
            }
            
            Map<String, String> fieldDocMap = new HashMap<>();
            for (FieldJavadoc fieldDoc : classDoc.getEnumConstants()) {
                String desc = fieldDoc.getComment().toString();
                if (!desc.isEmpty()) {
                    fieldDocMap.put(fieldDoc.getName(), desc);
                }
            }
            
            List<String> valueDescriptions = Arrays.stream(constants)
                    .map(e -> fieldDocMap.getOrDefault(e.name(), ""))
                    .toList();
            schema.addExtension("x-enum-value-descriptions", valueDescriptions);
            
            return schema;
        };
    }
    
    
    
    /**
     * Jimmer 当前不会把 @MappedSuperclass 上字段的 Javadoc 传播到生成 DTO/View 的
     * getter 描述中，这里在最终 OpenAPI 上对通用审计字段做一次全局兜底。
     * <p>
     * 不能使用 PropertyCustomizer 直接改属性 schema，因为 springdoc 在某些基础类型场景下
     * 可能复用同一个 Schema 实例，导致 createBy/updateBy 这类字段描述串值。
     */
    @Bean
    public OpenApiCustomizer auditFieldDescriptionCustomizer() {
        return openApi -> {
            if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
                return;
            }
            for (Schema<?> schema : openApi.getComponents().getSchemas().values()) {
                Map<String, Schema> properties = schema.getProperties();
                if (properties == null || properties.isEmpty()) {
                    continue;
                }
                for (Map.Entry<String, Schema> entry : properties.entrySet()) {
                    String description = AUDIT_FIELD_DESCRIPTIONS.get(entry.getKey());
                    if (description == null) {
                        continue;
                    }
                    Schema<?> property = entry.getValue();
                    if (property == null) {
                        continue;
                    }
                    if (description.equals(property.getDescription())) {
                        continue;
                    }
                    Schema<?> copiedProperty = copySchema(property);
                    copiedProperty.setDescription(description);
                    entry.setValue(copiedProperty);
                }
            }
        };
    }

    
    
    /**
     * 解决 Jimmer APT 编译期间 DTO 未决类型导致 Therapi 丢失包名，
     * 进而导致 SpringDoc 精确匹配方法签名失败的问题。
     * 直接读取 __Javadoc.json 文件，用方法名模糊匹配来兜底。
     */
    @Bean
    public OperationCustomizer jimmerJavadocOperationCustomizer() {
        return (operation, handlerMethod) -> {
            String methodName = handlerMethod.getMethod().getName();
            Class<?> controllerClass = handlerMethod.getBeanType();

            // 直接从 __Javadoc.json 文件读取，绕过 Therapi 的运行时类型解析
            JavadocData javadocData = getJavadocData(controllerClass);
            if (javadocData == null) {
                return operation;
            }

            // ---- 用类级 Javadoc 替换 tag 名称 ----
            String classDoc = extractSummary(javadocData.doc);
            if (!classDoc.isEmpty() && operation.getTags() != null) {
                List<String> newTags = new ArrayList<>();
                for (String tag : operation.getTags()) {
                    tagNameMapping.put(tag, classDoc);
                    newTags.add(classDoc);
                }
                operation.setTags(newTags);
            }

            // ---- 用方法级 Javadoc 填充 summary / description ----
            if (operation.getSummary() == null || operation.getSummary().trim().isEmpty()) {
                if (javadocData.methods != null) {
                    for (MethodDoc methodDoc : javadocData.methods) {
                        if (methodName.equals(methodDoc.name) && methodDoc.doc != null) {
                            String summary = extractSummary(methodDoc.doc);
                            if (!summary.isEmpty()) {
                                operation.setSummary(summary);
                                operation.setDescription(summary);
                            }
                            break;
                        }
                    }
                }
            }

            return operation;
        };
    }

    /**
     * 将顶层 tags 列表中的 name 也替换为类级 Javadoc 描述，与 operation 内的 tag 保持一致。
     */
    @Bean
    public OpenApiCustomizer tagRenamingCustomizer() {
        return openApi -> {
            if (openApi.getTags() == null) {
                return;
            }
            // 去重：多个旧 tag 可能映射到同一个新名字
            Map<String, io.swagger.v3.oas.models.tags.Tag> deduped = new HashMap<>();
            for (io.swagger.v3.oas.models.tags.Tag tag : openApi.getTags()) {
                String newName = tagNameMapping.getOrDefault(tag.getName(), tag.getName());
                tag.setName(newName);
                deduped.putIfAbsent(newName, tag);
            }
            openApi.setTags(new ArrayList<>(deduped.values()));
        };
    }

    /**
     * 直接从 classpath 加载 __Javadoc.json 文件，绕过 Therapi 的运行时解析。
     */
    private JavadocData getJavadocData(Class<?> clazz) {
        // computeIfAbsent 不能存 null，用空 JavadocData 作哨兵表示"已查找但不存在"
        JavadocData data = javadocCache.computeIfAbsent(clazz.getName(), className -> {
            String resourcePath = className.replace('.', '/') + "__Javadoc.json";
            try (InputStream is = clazz.getClassLoader().getResourceAsStream(resourcePath)) {
                if (is == null) return new JavadocData();
                return OBJECT_MAPPER.readValue(is, JavadocData.class);
            } catch (Exception e) {
                return new JavadocData();
            }
        });
        // doc 和 methods 均为 null 表示哨兵（文件不存在）
        return (data.doc == null && data.methods == null) ? null : data;
    }

    /**
     * 从 Javadoc 字符串中提取第一行有意义的描述文本（去掉 @param、@return 等标签行）。
     */
    private String extractSummary(String doc) {
        if (doc == null || doc.isBlank()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (String line : doc.split("\\n")) {
            String trimmed = line.trim();
            // 跳过 @param, @return, @throws 等标签行
            if (trimmed.startsWith("@")) {
                break;
            }
            if (!trimmed.isEmpty()) {
                if (!sb.isEmpty()) {
                    sb.append(" ");
                }
                sb.append(trimmed);
            }
        }
        return sb.toString();
    }

    /**
     * 对应 __Javadoc.json 的数据结构
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class JavadocData {
        public String doc;
        public List<MethodDoc> methods;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class MethodDoc {
        public String name;
        public List<String> paramTypes;
        public String doc;
    }

    private static Schema<?> copySchema(Schema<?> schema) {
        return (Schema<?>) OBJECT_MAPPER.convertValue(schema, schema.getClass());
    }

    private static Map<String, String> createAuditFieldDescriptions() {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("createBy", "创建者");
        descriptions.put("createTime", "创建时间");
        descriptions.put("updateBy", "更新者");
        descriptions.put("updateTime", "更新时间");
        return Collections.unmodifiableMap(descriptions);
    }
    
    // /**
    //  * 根据 jspecify @NonNull 注解为 schema 补充 required 字段。
    //  * springdoc 不识别 jspecify 注解，Jimmer 生成的 DTO 全部属性都变成可选，这里兜底修复。
    //  */
    // @Bean
    // public OpenApiCustomizer nonNullRequiredCustomizer() {
    //     Map<String, Class<?>> classMap = scanDtoClasses("com.surge.server");
    //
    //     return openApi -> {
    //         if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
    //             return;
    //         }
    //         for (var entry : openApi.getComponents().getSchemas().entrySet()) {
    //             Schema<?> schema = entry.getValue();
    //             if (schema.getProperties() == null || schema.getProperties().isEmpty()) {
    //                 continue;
    //             }
    //
    //             Class<?> clazz = classMap.get(entry.getKey());
    //             if (clazz == null) continue;
    //
    //             List<String> required = new ArrayList<>();
    //             for (String propName : schema.getProperties().keySet()) {
    //                 if (isNonNullProperty(clazz, propName)) {
    //                     required.add(propName);
    //                 }
    //             }
    //
    //             if (!required.isEmpty()) {
    //                 List<String> existing = schema.getRequired();
    //                 if (existing != null) {
    //                     Set<String> merged = new LinkedHashSet<>(existing);
    //                     merged.addAll(required);
    //                     schema.setRequired(new ArrayList<>(merged));
    //                 } else {
    //                     schema.setRequired(required);
    //                 }
    //             }
    //         }
    //     };
    // }
    //
    // private boolean isNonNullProperty(Class<?> clazz, String propName) {
    //     String getterName = "get" + Character.toUpperCase(propName.charAt(0)) + propName.substring(1);
    //     try {
    //         Method getter = clazz.getMethod(getterName);
    //         if (getter.getReturnType().isPrimitive()) {
    //             return true;
    //         }
    //         return getter.getAnnotatedReturnType().isAnnotationPresent(org.jspecify.annotations.NonNull.class);
    //     } catch (NoSuchMethodException e) {
    //         return false;
    //     }
    // }
    //
    // private Map<String, Class<?>> scanDtoClasses(String basePackage) {
    //     Map<String, Class<?>> map = new HashMap<>();
    //     ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
    //     scanner.addIncludeFilter((metadataReader, metadataReaderFactory) -> true);
    //
    //     for (var bd : scanner.findCandidateComponents(basePackage)) {
    //         try {
    //             Class<?> clazz = Class.forName(bd.getBeanClassName());
    //             map.put(clazz.getSimpleName(), clazz);
    //             for (Class<?> inner : clazz.getDeclaredClasses()) {
    //                 map.put(inner.getSimpleName(), inner);
    //             }
    //         } catch (ClassNotFoundException ignored) {
    //         }
    //     }
    //     return map;
    // }
    
    /**
     * 根据 jspecify 注解为 schema 补充 required 字段。
     * <p>
     * 支持两种方式：
     * <ul>
     *   <li>getter 返回类型上标注 @NonNull（Jimmer 生成的 DTO）</li>
     *   <li>类上标注 @NullMarked，则所有非 @Nullable 字段视为 required（手写 VO）</li>
     * </ul>
     */
    @Bean
    public OpenApiCustomizer nonNullRequiredCustomizer(ApplicationContext context) {
        String basePackage = context.getBeansWithAnnotation(SpringBootApplication.class)
                .values().iterator().next().getClass().getPackageName();
        Map<String, Class<?>> classMap = getDtoClassCache(basePackage);
        
        return openApi -> {
            if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
                return;
            }
            for (var entry : openApi.getComponents().getSchemas().entrySet()) {
                Schema<?> schema = entry.getValue();
                if (schema.getProperties() == null || schema.getProperties().isEmpty()) {
                    continue;
                }
                
                Class<?> clazz = classMap.get(entry.getKey());
                if (clazz == null) continue;
                
                boolean nullMarked = clazz.isAnnotationPresent(org.jspecify.annotations.NullMarked.class);
                
                List<String> required = new ArrayList<>();
                for (String propName : schema.getProperties().keySet()) {
                    if (isNonNullProperty(clazz, propName, nullMarked)) {
                        required.add(propName);
                    }
                }
                
                if (!required.isEmpty()) {
                    List<String> existing = schema.getRequired();
                    if (existing != null) {
                        Set<String> merged = new LinkedHashSet<>(existing);
                        merged.addAll(required);
                        schema.setRequired(new ArrayList<>(merged));
                    } else {
                        schema.setRequired(required);
                    }
                }
            }
        };
    }
    
    /**
     * 修复自引用类型（递归树结构）在 OpenAPI schema 中属性丢失的问题。
     * <p>
     * 当 DTO 包含对自身的引用（如 TreeView.children: List&lt;TreeView&gt;）时，
     * SpringDoc 在 schema 解析过程中可能跳过该属性以避免无限递归。
     * 此 customizer 在 schema 生成后扫描所有 DTO，补充缺失的自引用属性。
     */
    @Bean
    public OpenApiCustomizer selfReferenceFixCustomizer(ApplicationContext context) {
        String basePackage = context.getBeansWithAnnotation(SpringBootApplication.class)
                .values().iterator().next().getClass().getPackageName();
        Map<String, Class<?>> classMap = getDtoClassCache(basePackage);
        
        return openApi -> {
            if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
                return;
            }
            Map<String, Schema> schemas = openApi.getComponents().getSchemas();
            
            for (var entry : schemas.entrySet()) {
                Schema<?> schema = entry.getValue();
                Class<?> clazz = classMap.get(entry.getKey());
                if (clazz == null || schema.getProperties() == null) {
                    continue;
                }
                
                for (Method method : clazz.getMethods()) {
                    if (method.getParameterCount() != 0) {
                        continue;
                    }
                    String name = method.getName();
                    String propName = extractPropertyName(name);
                    if (propName == null) {
                        continue;
                    }
                    
                    Type genericType = method.getGenericReturnType();
                    Class<?> rawType = method.getReturnType();
                    
                    boolean selfRefList = List.class.isAssignableFrom(rawType)
                            && genericType instanceof ParameterizedType pt
                            && pt.getActualTypeArguments().length == 1
                            && pt.getActualTypeArguments()[0] == clazz;
                    boolean selfRefDirect = rawType == clazz;
                    
                    if (!selfRefList && !selfRefDirect) {
                        continue;
                    }
                    
                    Map<String, Schema> props = schema.getProperties();
                    Schema<?> existing = props.get(propName);
                    
                    String description = getMethodDescription(method);
                    if (description == null && existing != null) {
                        description = existing.getDescription();
                    }
                    
                    String ref = "#/components/schemas/" + entry.getKey();
                    props.remove(propName);
                    
                    Schema<?> newProp;
                    if (selfRefList) {
                        ArraySchema arraySchema = new ArraySchema();
                        arraySchema.setItems(new Schema<>().$ref(ref));
                        if (description != null) {
                            arraySchema.setDescription(description);
                        }
                        newProp = arraySchema;
                    } else {
                        newProp = new Schema<>();
                        newProp.set$ref(ref);
                        if (description != null) {
                            newProp.setDescription(description);
                        }
                    }
                    schema.addProperty(propName, newProp);
                }
            }
        };
    }
    
    private String extractPropertyName(String methodName) {
        if (methodName.startsWith("get") && methodName.length() > 3
                && Character.isUpperCase(methodName.charAt(3))) {
            return Character.toLowerCase(methodName.charAt(3)) + methodName.substring(4);
        }
        if (methodName.startsWith("is") && methodName.length() > 2
                && Character.isUpperCase(methodName.charAt(2))) {
            return Character.toLowerCase(methodName.charAt(2)) + methodName.substring(3);
        }
        return null;
    }
    
    private String getMethodDescription(Method method) {
        String fieldName = extractPropertyName(method.getName());
        if (fieldName == null) {
            return null;
        }
        ClassJavadoc classDoc = RuntimeJavadoc.getJavadoc(method.getDeclaringClass());
        if (classDoc != null) {
            for (FieldJavadoc fieldDoc : classDoc.getFields()) {
                if (fieldDoc.getName().equals(fieldName)) {
                    String comment = fieldDoc.getComment().toString().trim();
                    if (!comment.isEmpty()) {
                        return comment;
                    }
                }
            }
        }
        return null;
    }
    
    private boolean isNonNullProperty(Class<?> clazz, String propName, boolean nullMarked) {
        Method getter = findGetter(clazz, propName);
        if (getter == null) {
            return false;
        }
        if (getter.getReturnType().isPrimitive()) {
            return true;
        }
        var annotatedType = getter.getAnnotatedReturnType();
        if (annotatedType.isAnnotationPresent(org.jspecify.annotations.NonNull.class)) {
            return true;
        }
        if (nullMarked) {
            return !annotatedType.isAnnotationPresent(org.jspecify.annotations.Nullable.class);
        }
        return false;
    }

    private Method findGetter(Class<?> clazz, String propName) {
        String capitalized = Character.toUpperCase(propName.charAt(0)) + propName.substring(1);
        try {
            return clazz.getMethod("get" + capitalized);
        } catch (NoSuchMethodException ignored) {
        }
        try {
            return clazz.getMethod("is" + capitalized);
        } catch (NoSuchMethodException ignored) {
        }
        return null;
    }
    
    private Map<String, Class<?>> getDtoClassCache(String basePackage) {
        if (dtoClassCache == null) {
            synchronized (this) {
                if (dtoClassCache == null) {
                    dtoClassCache = scanDtoClasses(basePackage);
                }
            }
        }
        return dtoClassCache;
    }

    private Map<String, Class<?>> scanDtoClasses(String basePackage) {
        Map<String, Class<?>> map = new HashMap<>();
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter((metadataReader, metadataReaderFactory) -> true);
        
        for (var bd : scanner.findCandidateComponents(basePackage)) {
            try {
                Class<?> clazz = Class.forName(bd.getBeanClassName());
                map.put(clazz.getSimpleName(), clazz);
                for (Class<?> inner : clazz.getDeclaredClasses()) {
                    map.put(inner.getSimpleName(), inner);
                }
            } catch (ClassNotFoundException ignored) {
            }
        }
        return map;
    }
}
