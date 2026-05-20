<script setup lang="tsx">
import type { PermissionSaveDto } from '#/openapi-types.ts'
import type { DefineSchema } from '@/components/common/schema-form/types/common.ts'
import { PermissionType } from '#/openapi-types.ts'
import { useApi } from '@/hooks/common/api.ts'
import sysMenuApi from '@/service/api/system/menu.ts'
import { useMenuContextProvider } from '@/views/system/menu/hooks/context.ts'
import useMenuTable from '@/views/system/menu/hooks/table.js'

interface SearchDto {
  name?: string

  type?: PermissionType
}

const params = ref<SearchDto>({
  name: '',
  type: undefined,
})

const form = ref<PermissionSaveDto>({
  name: '',
  type: PermissionType.DIRECTORY,
  parentId: undefined,
  path: undefined,
})

const [popupVisible, togglePopupVisible] = useToggle()
const { columns } = useMenuTable()

const { data, loading, run } = useApi(sysMenuApi.getTree)

const querySchema = ref<DefineSchema<SearchDto>[]>([
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

const pathVisible = computed(() => form.value.type !== PermissionType.BUTTON)

const saveSchema = ref<DefineSchema<PermissionSaveDto>[]>([
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
    options: data,
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
useMenuContextProvider({
  menuTree: data,
})
</script>

<template>
  <div class="flex flex-col gap-1 h-full">
    <n-card>
      <search-schema-form
        v-model:model="params"
        v-model:schema="querySchema"
        @submit="run()"
        @reset-after="run()"
      />
    </n-card>

    <n-card class="flex-1">
      <n-space class="mb-10px">
        <n-button type="primary" @click="togglePopupVisible()">
          创建
        </n-button>
        <n-button>批量删除</n-button>
        <n-button>导出</n-button>
      </n-space>
      <n-data-table
        key="id"
        :loading="loading"
        :row-key="(row) => row.id"
        :data="data"
        :columns="columns"
      />
    </n-card>
    <popup-schema-form
      v-model:visible="popupVisible"
      v-model:model="form"
      v-model:schema="saveSchema"
      :grid-item-props="12"
      popup-type="drawer"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
