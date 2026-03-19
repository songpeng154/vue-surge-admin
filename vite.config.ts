import * as process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins } from './build/plugins'
import { proxyConfig } from './build/proxy'
import { getMetaEnv } from './src/utils/env'

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  // 获取并包装 .env 环境变量
  const viteEnv = getMetaEnv(loadEnv(mode, root))
  return {
    root,
    base: viteEnv.VITE_PUBLIC_PATH,
    plugins: createVitePlugins(viteEnv),
    server: {
      host: true,
      port: viteEnv.VITE_PORT,
      proxy: proxyConfig(viteEnv),
    },
    resolve: {
      // 别名
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      },
    },
    devtools: {
      enabled: true,
    },
    build: {
      reportCompressedSize: true,
      sourcemap: false,
      minify: 'terser',
      brotliSize: true,
      terserOptions: {
        compress: {
          // 删除所有 console
          drop_console: viteEnv.VITE_DELETE_CONSOLE,
          // 删除 所有 debugger
          drop_debugger: true,
        },
      },
    },
  }
})
