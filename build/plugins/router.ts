import { vitePluginRoutes } from '@rengar-admin/vite-plugin-vue-routes'

export function setupRouter() {
  return vitePluginRoutes({
    entry: 'src/views',
    output: 'src/router/routes.ts',
    typeDir: 'typings/app/vite-plugin-routes.d.ts',
  })
}
