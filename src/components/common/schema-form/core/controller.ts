import type { ModelRef } from 'vue'
import type { SchemaFormCommonExpose, SchemaFormCommonProps } from '@/components/common/schema-form/types/common.ts'
import type { SchemaFormCoreOptions } from '@/components/common/schema-form/core/types'
import { useProvideSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import useCommonExpose from '@/components/common/schema-form/hooks/expose.ts'
import useOmitProps from '@/hooks/common/omit-props.ts'

export function useSchemaFormController<TProps extends SchemaFormCommonProps>(
  props: TProps,
  model: ModelRef<Recordable>,
  slots: Record<string, any>,
  options: SchemaFormCoreOptions<TProps> = {},
) {
  useProvideSchemaFormContext(props, model)

  const { formRef, commonExpose } = useCommonExpose()
  const formProps = useOmitProps(props, options.omitFormProps || [])
  const formContentSlots = useOmitProps(slots, options.omitContentSlots || [])

  return {
    formRef,
    commonExpose,
    formProps,
    formContentSlots,
  }
}

export function exposeSchemaForm<TExpose extends SchemaFormCommonExpose>(commonExpose: SchemaFormCommonExpose, extend?: Partial<TExpose>) {
  return {
    ...commonExpose,
    ...extend,
  } as TExpose
}
