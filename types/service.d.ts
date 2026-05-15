// 代理类型 0:前缀 1:url
declare type ProxyType = [ string, string ]

/**
 * 服务环境变量
 * FAKE: 模拟数据
 * BASE: 基础服务
 */
declare type ServiceRecord = 'FAKE' | 'BASE'

// 后台响应结构
declare interface Result<Data = any> {
  // 系统状态
  code: number

  // 系统状态信息
  msg: string

  // data
  result?: Data
}

// 分页参数
declare type PageParams<DParams extends Recordable = Recordable> = {
  page: number
  pageSize: number
} & DParams
