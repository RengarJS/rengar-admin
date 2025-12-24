import { createServiceConfig } from '../../src/utils/service'
import type { ProxyOptions } from 'vite'
export function createViteProxy(env: ImportMetaEnv, mode: string): Record<string, ProxyOptions> | undefined {
  if (mode !== 'development' || env.VITE_HTTP_PROXY !== 'Y') return undefined

  const serivceConfigs = createServiceConfig(env)

  const proxy: Record<string, ProxyOptions> = {}

  for (const service of serivceConfigs) {
    proxy[service.proxyPattern] = {
      target: service.url,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${service.proxyPattern}`), ''),
    }
  }

  return proxy
}
