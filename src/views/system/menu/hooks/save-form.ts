import type { PermissionSaveDto } from '#/openapi-types.ts'
import type { DefineSchema } from '@/components/common/schema-form/types/common.ts'
import { PermissionType } from '#/openapi-types.ts'

function useMenuSaveForm() {
  const form = ref<PermissionSaveDto>({
    name: '',
    type: PermissionType.DIRECTORY,
    parentId: undefined,
    path: undefined,
  })

  const pathVisible = computed(() => form.value.type !== PermissionType.BUTTON)

  const schema = ref<DefineSchema<PermissionSaveDto>[]>([
    {
      field: 'name',
      label: '名称',
      component: 'input',
      showRequireMark: true,
    },
    {
      field: 'type',
      label: '类型',
      component: 'select',
      options: [
        { label: '目录', value: PermissionType.DIRECTORY },
        { label: '菜单', value: PermissionType.MENU },
        { label: '按钮', value: PermissionType.BUTTON },
      ],
    },
    {
      field: 'parentId',
      label: '父级菜单',
      component: 'treeSelect',
    },
    {
      field: 'path',
      label: '路由地址 | 外链地址',
      component: 'input',
      tooltip: '目录可配置路由地址；菜单可同时配置路由地址和外链地址',
      placeholder: '例如：/system/user',
      hide: pathVisible,
    },
    {
      field: 'icon',
      label: '图标',
      component: 'iconSelect',
      tooltip: '目录可配置路由地址；菜单可同时配置路由地址和外链地址',
      hide: pathVisible,
    },

  ])

  return { form, schema }
}

export default useMenuSaveForm
