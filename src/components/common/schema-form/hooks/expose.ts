import type { SchemaFormCommonExpose } from '@/components/common/schema-form/types/common.ts'

function useCommonExpose() {
  const formRef = ref<SchemaFormCommonExpose>()
  const commonExpose: SchemaFormCommonExpose = {} as SchemaFormCommonExpose

  watchEffect(() => {
    const expose = formRef.value
    if (!expose)
      return
    Object.keys(expose).forEach((key) => {
      commonExpose[key] = expose[key]
    })
  })

  return { formRef, commonExpose }
}

export default useCommonExpose
