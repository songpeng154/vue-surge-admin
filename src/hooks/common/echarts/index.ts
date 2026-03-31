import type { RendererType } from 'echarts/types/src/util/types'
import type { EchartsInstance, ECOption } from './core'
import { ref, watch } from 'vue'
import useAppStore from '@/store/modules/app'
import { asyncWait, getCSSVariable } from '@/utils'
import echarts from './core'

function useEcharts(renderMode: RendererType = 'canvas') {
  const scope = effectScope()

  const echartsInstance = shallowRef<EchartsInstance>()
  const currentOptions = ref<ECOption>()
  const echartsDom = ref<HTMLElement>()

  const appStore = useAppStore()
  const { width, height } = useElementSize(echartsDom)

  const isInit = computed(() => echartsDom.value && echartsInstance.value)

  const initializeInstance = async () => {
    if (isInit.value)
      return

    await nextTick()

    echartsInstance.value = echarts.init(echartsDom.value, appStore.themeMode, {
      renderer: renderMode,
    })
  }

  const render = async (options: ECOption) => {
    currentOptions.value = options
    await asyncWait(0)
    if (!isInit.value)
      await initializeInstance()
    echartsInstance.value?.setOption(options)
  }

  const dispose = () => {
    if (!echartsInstance.value)
      return
    echartsInstance.value.dispose()
    echartsInstance.value = undefined
  }

  const showLoading = () => {
    echartsInstance.value?.showLoading({
      maskColor: getCSSVariable('fill-color-tertiary'),
      textColor: getCSSVariable('text-color-base'),
    })
  }

  const hideLoading = () => {
    echartsInstance.value?.hideLoading()
  }

  scope.run(() => {
    watch(() => appStore.themeMode, () => {
      if (!currentOptions.value)
        return
      dispose()
      void render(currentOptions.value)
    })

    watch([width, height], () => {
      echartsInstance.value?.resize({ width: 'auto', height: 'auto' })
    })
  })

  onScopeDispose(() => {
    echartsInstance.value?.dispose()
    scope.stop()
  })

  return { echartsDom, render, echartsInstance, showLoading, hideLoading }
}

export default useEcharts
