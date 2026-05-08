import { createPagination, createRequest } from 'vue-rex'

export const useApi = createRequest()

export const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total',
  options: {
    initialPage: 1,
    initialPageSize: 10,
  },
})
