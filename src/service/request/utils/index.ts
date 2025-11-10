import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import ServiceConstant from '@/constant/service.ts'

// 用来解决重复错误提示
let lastMessage: string | undefined

// 解决重复提示
export function showMessage(message: string, type: keyof Omit<MessageApiInjection, 'destroyAll'> = 'error') {
  if (message === lastMessage && ServiceConstant.CLOSE_REPEAT_ERROR_MESSAGE) return
  void window.$message?.[type](message, { onAfterLeave: () => lastMessage = undefined })
  lastMessage = message
}
