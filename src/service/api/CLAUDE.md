# Project Guidelines

## 生成 API 请求函数规则

当需要为后端接口编写请求函数时，遵循以下规则：

### 文件结构

- 文件位置：`src/service/api/<模块名>.ts`
- 类型导入路径：`#/openapi-types.ts`
- 请求实例导入：`@/service/request`

### 代码风格

```ts
import type { XxxDto, XxxView } from '#/openapi-types.ts'
import service from '@/service/request'

const xxxApi = {
  /**
   * 接口描述（来自 OpenAPI summary）
   */
  方法名: (参数) =>
    service.method<响应类型>(路径, ...),
}

export default xxxApi
```

### 命名规则

- 对象名：模块名 + `Api`，如 `userApi`、`roleApi`
- 方法名：动词 + 资源名，如 `getUser`、`createUser`、`updateUser`、`deleteUser`
- 分页列表：`getXxxPage`
- 全量列表：`getXxxList`

### 参数顺序

1. 路径参数（如 `id: number`）
2. 请求体（如 `data: UserSaveDto`）
3. 查询参数（如 `params: PageParams<UserSpec>`）

### 响应类型

- 后端用 `R<T>` 包装响应，拦截器已拆包，直接写内层类型
- 返回实体：`service.get<UserView>(...)`
- 返回列表：`service.get<UserView[]>(...)`
- 返回分页：`service.get<PageResult<UserView>>(...)`
- 无返回值：不写泛型，如 `service.delete(...)`

### 路径处理

- 无路径参数：字符串 `'/system/user'`
- 有路径参数：模板字符串 `` `/system/user/${id}` ``

### 分页接口

使用全局类型 `PageParams<T>`，T 为查询条件 DTO：

```ts
getPage: (params: PageParams<UserSpec>) =>
  service.get<PageResult<UserView>>('/system/user/page', { params }),
```

### 完整示例

```ts
import type { PageResult, UserSaveDto, UserSpec, UserView } from '#/openapi-types.ts'
import service from '@/service/request'

const userApi = {
  /**
   * 获取用户分页列表
   */
  getPage: (params: PageParams<UserSpec>) =>
    service.get<PageResult<UserView>>('/system/user/page', { params }),

  /**
   * 获取用户详情
   */
  getUser: (id: number) =>
    service.get<UserView>(`/system/user/${id}`),

  /**
   * 创建用户
   */
  createUser: (data: UserSaveDto) =>
    service.post('/system/user', data),

  /**
   * 更新用户
   */
  updateUser: (id: number, data: UserSaveDto) =>
    service.put(`/system/user/${id}`, data),

  /**
   * 删除用户
   */
  deleteUser: (id: number) =>
    service.delete(`/system/user/${id}`),
}

export default userApi
```
