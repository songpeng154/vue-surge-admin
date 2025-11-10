import fakeService from '@/service/request/fake'

// 用户相关的Api
class UserApi {
  // 密码登录
  static passwordLogin = (data: UserModel.PasswordLoginParams) =>
    fakeService.post<UserModel.PasswordLoginModel>('/passwordLogin', data)

  // 获取用户信息
  static getUserinfo = () => fakeService.get<UserModel.UserDetailsModel>('/getUserinfo')

  // 获取用户路由
  static getRoutes = () => fakeService.get<UserModel.UserRoutesModel>('/getRoutes')

  // 退出登录
  static signOut = () => fakeService.get('/signOut')
}

export default UserApi
