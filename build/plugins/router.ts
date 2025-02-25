import { vitePluginRoutes } from '../../packages/router/src'

export function setupRouter() {
  return vitePluginRoutes({
    entry: 'src/views',
    output: 'src/router/routes.ts',
    layout: {
      base: '@/layouts/base/index.vue',
      blank: '@/layouts/blank/index.vue'
    }
  })
}
