import type { SchemaFormCommonExpose } from '@/components/common/schema-form/types/common.ts'

function useCommonExpose() {
  const formRef = ref<SchemaFormCommonExpose>()

  const commonExpose = {
    validate: (...args: Parameters<SchemaFormCommonExpose['validate']>) => {
      const validate = formRef.value?.validate
      if (!validate)
        return Promise.reject(new Error('SchemaForm: form instance is not ready.'))
      return validate(...args)
    },
    restoreValidation: (...args: Parameters<SchemaFormCommonExpose['restoreValidation']>) => {
      return formRef.value?.restoreValidation?.(...args)
    },
    resetFields: () => {
      return formRef.value?.resetFields?.()
    },
    scrollToField: (field: string) => {
      return formRef.value?.scrollToField?.(field)
    },
  } as SchemaFormCommonExpose

  return { formRef, commonExpose }
}

export default useCommonExpose
