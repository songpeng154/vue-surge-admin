/**
 * 根据 jspecify @NonNull 注解为 schema 补充 required 字段。
 * springdoc 不识别 jspecify 注解，Jimmer 生成的 DTO 全部属性都变成可选，这里兜底修复。
 */
@Bean
public OpenApiCustomizer nonNullRequiredCustomizer() {
    Map<String, Class<?>> classMap = scanDtoClasses("com.surge.server");

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

            List<String> required = new ArrayList<>();
            for (String propName : schema.getProperties().keySet()) {
                if (isNonNullProperty(clazz, propName)) {
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

private boolean isNonNullProperty(Class<?> clazz, String propName) {
    String getterName = "get" + Character.toUpperCase(propName.charAt(0)) + propName.substring(1);
    try {
        Method getter = clazz.getMethod(getterName);
        if (getter.getReturnType().isPrimitive()) {
            return true;
        }
        return getter.getAnnotatedReturnType().isAnnotationPresent(org.jspecify.annotations.NonNull.class);
    } catch (NoSuchMethodException e) {
        return false;
    }
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
