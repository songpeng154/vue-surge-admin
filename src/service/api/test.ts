import fakeService from '@/service/request/fake'

export class TestApi {
  static getTodoList = (query: PaginationParams<Recordable>) => fakeService.post('/getTodos', query)
}
