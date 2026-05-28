import type { FormValidateCallback, ShouldRuleBeApplied } from 'naive-ui/es/form/src/interface'
import type { SchemaFormCommonExpose } from '@/components/common/schema-form/types/common.ts'
import type { SchemaFormExposeControllerOptions } from '@/components/common/schema-form/core/types'
import { cloneDeep } from 'es-toolkit'
import { nextTick } from 'vue'
import { useSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'

function replaceReactiveObject(target: Recordable, source: Recordable) {
  Object.keys(target).forEach((key) => {
    delete target[key]
  })
  Object.assign(target, source)
}

function getScrollParent(element: HTMLElement) {
  let parent = element.parentElement
  while (parent) {
    const style = window.getComputedStyle(parent)
    const overflowY = style.overflowY
    const canScroll = /(auto|scroll|overlay)/.test(overflowY) && parent.scrollHeight > parent.clientHeight
    if (canScroll)
      return parent
    parent = parent.parentElement
  }
  return document.scrollingElement as HTMLElement | null
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function getElementScrollTop(scrollParent: HTMLElement) {
  return scrollParent === document.scrollingElement
    ? window.scrollY
    : scrollParent.scrollTop
}

function setElementScrollTop(scrollParent: HTMLElement, top: number) {
  if (scrollParent === document.scrollingElement) {
    window.scrollTo({ top, behavior: 'smooth' })
    return
  }
  scrollParent.scrollTo({ top, behavior: 'smooth' })
}

function getScrollParentClientHeight(scrollParent: HTMLElement) {
  return scrollParent === document.scrollingElement
    ? window.innerHeight
    : scrollParent.clientHeight
}

export function useSchemaFormExposeController(options: SchemaFormExposeControllerOptions) {
  const { props, formRef } = options
  const { model, itemsDataMap } = useSchemaFormContext()!
  const initialModel = cloneDeep(model.value)

  async function scrollToFormItem(element: HTMLElement) {
    await nextTick()
    await nextFrame()

    const scrollParent = getScrollParent(element)
    if (!scrollParent)
      return element.scrollIntoView({ behavior: 'smooth', block: 'start' })

    const elementRect = element.getBoundingClientRect()
    const parentRect = scrollParent === document.scrollingElement
      ? { top: 0 }
      : scrollParent.getBoundingClientRect()
    const parentStyle = window.getComputedStyle(scrollParent)
    const parentPaddingTop = Number.parseFloat(parentStyle.paddingTop) || 0
    const currentTop = getElementScrollTop(scrollParent)
    const relativeTop = elementRect.top - parentRect.top
    const relativeBottom = elementRect.bottom - parentRect.top
    const visibleTop = parentPaddingTop
    const visibleBottom = getScrollParentClientHeight(scrollParent)

    if (relativeTop >= visibleTop && relativeBottom <= visibleBottom)
      return

    const targetTop = currentTop + relativeTop - visibleTop

    setElementScrollTop(scrollParent, Math.max(targetTop, 0))
  }

  function scrollToField(field: string) {
    const item = [...itemsDataMap.values()].find(item => item.field === field)
    if (!item) {
      console.error(`SchemaForm: field "${field}" not found.`)
      return
    }
    void scrollToFormItem(item.el)
  }

  function restoreValidation() {
    formRef.value?.restoreValidation()
  }

  function resetFields() {
    replaceReactiveObject(model.value, cloneDeep(initialModel))
    restoreValidation()
  }

  async function validate(callback?: FormValidateCallback, shouldRuleBeApplied?: ShouldRuleBeApplied) {
    const form = formRef.value
    if (!form)
      return Promise.reject(new Error('SchemaForm: form instance is not ready.'))

    return form.validate((errors, extra) => {
      callback?.(errors, extra)
      if (props.scrollToFirstError) {
        const firstFailedField = errors?.[0]?.[0]?.field
        firstFailedField && scrollToField(firstFailedField)
      }
    }, shouldRuleBeApplied)
  }

  return {
    validate,
    restoreValidation,
    resetFields,
    scrollToField,
  } as SchemaFormCommonExpose
}
