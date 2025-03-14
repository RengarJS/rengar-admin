import { vitePluginRoutes } from '@rengar/vite-plugin-vue-routes'

export function setupRouter() {
  return vitePluginRoutes({
    entry: 'src/views',
    output: 'src/router/routes.ts',
    typeDir: 'typings/common/vite-plugin-routes.d.ts',
    layout: {
      base: '@/layouts/base/index.vue',
      blank: '@/layouts/blank/index.vue',
    },
  })
}
