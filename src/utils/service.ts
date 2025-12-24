type ServiceKey = 'default'

interface ServiceConfig {
  key: ServiceKey
  url: string // 真实 API 地址
  proxyPattern: string // 代理匹配路径，如 /proxy-default
}
export function createServiceConfig(env: ImportMetaEnv): ServiceConfig[] {
  return [
    {
      key: 'default',
      url: env.VITE_API_URL,
      proxyPattern: '/proxy-default',
    },
  ]
}

export function getServiceConfig(key: ServiceKey, env: ImportMetaEnv) {
  const serviceConfig = createServiceConfig(env)
  const service = serviceConfig.find((item) => item.key === key)
  if (!service) {
    throw new Error(`Service ${key} not found`)
  }
  return service
}

export function getServiceBaseUrl(key: ServiceKey, env: ImportMetaEnv) {
  const service = getServiceConfig(key, env)
  return env.DEV && env.VITE_HTTP_PROXY === 'Y' ? service.proxyPattern : service.url
}
