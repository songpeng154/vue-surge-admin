import fakeService from '@/service/request/fake'

// 系统相关的Api
class SystemApi {
  // 获取统计信息
  static getStatistics = () => fakeService.get<SystemModel.StatisticsModel>('/getSystemStatistics')

  // 获取使用数量
  static getUsageCount = () => fakeService.get<{ label: string, value: number }[]>('/getUsageCount')

  // 获取技术栈
  static getTechnologyStack = () => fakeService.get<{ name: string, value: number }[]>('/getTechnologyStack')

  // 获取访问量
  static getAccessCount = () => fakeService.get<{ label: string, value: number }[]>('/getAccessCount')
}

export default SystemApi
