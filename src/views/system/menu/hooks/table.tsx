import type { DataTableColumns } from 'naive-ui'
import type { PermissionTreeView, PermissionType } from '#/openapi-types.ts'

function useMenuTable() {
  const columns = ref<DataTableColumns<PermissionTreeView>>([
    {
      title: '菜单名称',
      key: 'name',
    },
    {
      title: '菜单类型',
      key: 'type',
      render(row) {
        const typeMap: Record<PermissionType, string> = {
          MENU: '菜单',
          DIRECTORY: '目录',
          BUTTON: '按钮',
        }
        return typeMap[row.type]
      },
    },
    {
      title: '路径',
      key: 'path',
    },
    {
      title: '权限标示',
      key: 'permission',
      render(row): any {
        return row.permission || '--'
      },
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'actions',
      width: 150,
      render() {
        return (
          <NSpace>
            <NButton text type="primary">查看</NButton>
            <NButton text type="primary">修改</NButton>
            <NButton text type="primary">删除</NButton>
          </NSpace>
        )
      },
    },
  ])

  return { columns }
}

export default useMenuTable
