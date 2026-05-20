import type { ModelRef } from 'vue'
import type { SchemaFormCommonExpose, SchemaFormCommonProps } from '@/components/common/schema-form/types/common.ts'

function useCommonMethod(props: SchemaFormCommonProps, expose: SchemaFormCommonExpose, model: ModelRef<Recordable>) {
  const handleSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit(expose.validate, model.value)
    }

    else {
      expose.validate()
        .then(() => props.onFinish?.(model.value))
        .catch(err => props.onFinishFailed?.(err))
    }
  }

  const handleReset = () => {
    if (props.onReset) {
      props.onReset(expose.resetFields, model.value)
    }
    else {
      expose.resetFields()
    }
    props.onResetAfter?.(model.value)
  }
  return { handleSubmit, handleReset }
}

export default useCommonMethod
