import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

export { useLayoutStore } from './modules/layout'
export { useThemeStore } from './modules/theme'
export { useAuthStore } from './modules/auth'
export { useTabStore } from './modules/tab'
export { useMenuStore } from './modules/menu'
export { useKeepAliveStore } from './modules/keepAlive'

export function setupPinia(app: App) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
