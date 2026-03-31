import { faker } from '@faker-js/faker/locale/zh_CN'

// 响应结构
export function r(code: number, msg: string, data: any): Result {
  return {
    code,
    msg,
    result: data,
  }
}

// 操作成功
export const rSuccess = (data: unknown) => r(200, '操作成功', data)

// 操作失败
export const rFailure = (data: unknown) => r(500, '操作失败', data)

// 生成分页数据
export function generatePagedData(page: number = 1, pageSize: number = 10, total: number = 100) {
  // 假设我们总共有 100 条数据
  const totalItems = total
  const totalPages = Math.ceil(totalItems / pageSize)

  // 计算当前页的数据起始和结束索引
  const startIdx = (page - 1) * pageSize
  const endIdx = Math.min(startIdx + pageSize, totalItems)

  // 生成当前页的数据
  const data = Array.from({ length: endIdx - startIdx }).fill({
    id: faker.string.ulid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.secondaryAddress(),
  })

  return {
    list: data,
    total: totalItems,
    totalPages,
    page,
    pageSize,
  }
}
