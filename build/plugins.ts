// 导出vite插件
import type { PluginOption } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import compress from 'vite-plugin-compression'
import { vitePluginFakeServer } from 'vite-plugin-fake-server'
import { createHtmlPlugin } from 'vite-plugin-html'
import devTools from 'vite-plugin-vue-devtools'
import { getServicePrefixOrUrl } from '../src/utils/env'
// Vite 插件配置
export function createVitePlugins(viteEnv: ImportMetaEnv): PluginOption[] {
  return [
    // DevTools
    viteEnv.VITE_USE_DEV_TOOLS && devTools({
      launchEditor: 'webstorm',
    }),
    vue(),
    // Jsx 语法
    vueJsx(),
    // 原子Css
    UnoCSS(),
    // 配置 ejs
    createHtmlPlugin({
      // 生产环境压缩
      minify: true,
      inject: {
        data: {
          // index.html 标题
          title: viteEnv.VITE_APP_TITLE,
        },
      },
    }),
    // 组件自动导入
    Components({
      // 为全局组件生成 TypeScript 声明,并指定生成目录
      dts: 'types/components.d.ts',
      extensions: ['vue', 'tsx'], // 加上 tsx
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      resolvers: [
        NaiveUiResolver(),
      ],
    }),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'vue-router',
        'pinia',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
      dts: 'types/auto-imports.d.ts',
    }),
    // 打包压缩
    viteEnv.VITE_BUILD_COMPRESS !== 'none' && compress({
      algorithm: viteEnv.VITE_BUILD_COMPRESS,
    }),
    // 兼容一些旧版浏览器
    viteEnv.VITE_LEGACY && legacy({ targets: ['defaults', 'not IE 11'] }),
    // 数据模拟
    viteEnv.VITE_USE_FAKE && vitePluginFakeServer({
      basename: getServicePrefixOrUrl('FAKE', viteEnv),
      enableProd: true,
    }),
  ]
}
