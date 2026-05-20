import type { PermissionTreeView } from '#/openapi-types.ts'

interface MenuContext {
  menuTree: ComputedRef<Undefinable<PermissionTreeView[]>>
}

const [useMenuContextProvider, useMenuContext] = createInjectionState((context: MenuContext) => {
  const { menuTree } = context

  return { menuTree }
})

export { useMenuContextProvider }
export { useMenuContext }
