/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  // 端口
  readonly VITE_PORT: number

  // 网站标题
  readonly VITE_APP_TITLE: string

  // OpenAPI 文档地址
  readonly VITE_OPENAPI_URL: string

  // 资源公共路径
  readonly VITE_PUBLIC_PATH: string

  // 是否删除console
  readonly VITE_DELETE_CONSOLE: boolean

  // 数据模拟
  readonly VITE_SERVICE_FAKE: string

  // 基础服务地址
  readonly VITE_SERVICE_BASE: string | ProxyType

  // 是否开启fake
  readonly VITE_USE_FAKE: boolean

  // 是否开发工具
  readonly VITE_USE_DEV_TOOLS: boolean

  // 打包压缩类型
  readonly VITE_BUILD_COMPRESS: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw' | 'none'

  // 是否兼容旧版浏览器。开启后打包时间会慢一倍左右。会多打出旧浏览器兼容包,且会根据浏览器兼容性自动使用相应的版本
  readonly VITE_LEGACY: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
