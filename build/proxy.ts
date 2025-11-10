import type { ProxyOptions } from 'vite'
import { getAllServiceConfig } from '../src/utils/env.ts'

/**
 * 代理配置
 * @param viteEnv 环境变量
 * @param extra 额外的代理配置
 */
export function proxyConfig(viteEnv: ImportMetaEnv, extra?: Recordable<string | ProxyOptions>): Recordable<string | ProxyOptions> {
  const proxy = getAllServiceConfig(viteEnv).reduce((proxy, key) => {
    const server = viteEnv[key]
    if (typeof server === 'string') return proxy
    // 前缀
    const prefix = server[0]
    // api地址
    const api = server[1]

    proxy[prefix] = {
      target: api,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
    }

    return proxy
  }, { })
  return { ...proxy, ...extra }
}
