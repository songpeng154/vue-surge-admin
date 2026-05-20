import type { PermissionType } from '#/openapi-types.ts'
import type { DefineSchema } from '@/components/common/schema-form/types/common.ts'

interface SearchDto {
  name?: string

  type?: PermissionType
}

function useMenuQueryFrom() {
  const params = ref<SearchDto>({
    name: '',
    type: undefined,
  })
  const schema = ref<DefineSchema<SearchDto>[]>([
    {
      field: 'name',
      label: '菜单名称',
      component: 'input',
    },
    {
      field: 'type',
      label: '菜单类型',
      component: 'select',
    },
  ])

  return { params, schema }
}

export default useMenuQueryFrom
