import { createRouter, createWebHistory } from 'vue-router'
import { setupGlobalRouterGuard } from './guard'
import { routes } from './routes'
import { extraRoutesConfig } from './config'
import { mergeRouteConfig } from './utils'

import type { App } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home',
    },
    ...mergeRouteConfig(routes, extraRoutesConfig),
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/404',
    },
  ],
})

export default router

export async function setupRouter(app: App) {
  app.use(router)
  setupGlobalRouterGuard(router)
  await router.isReady()
}
