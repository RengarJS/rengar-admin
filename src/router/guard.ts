import { useAuthStore, useMenuStore, useTabStore, useKeepAliveStore } from '@/stores'
import { to as awaitTo } from 'await-to-js'
import { useAuth } from '@/hooks/auth'
import type { RouteLocationGeneric, Router } from 'vue-router'

export function setupGlobalRouterGuard(router: Router) {
  const authStore = useAuthStore()
  const menuStore = useMenuStore()
  const tabStore = useTabStore()
  const keepAliveStore = useKeepAliveStore()

  // 判断路由是否需要权限
  function needPermission(to: RouteLocationGeneric) {
    if (!to.meta.roles) return false
    if (typeof to.meta.roles === 'string') return true
    return Array.isArray(to.meta.roles) && to.meta.roles.length > 0
  }

  // 检查用户是否有访问权限
  function hasPerssion(to: RouteLocationGeneric) {
    const roles = to.meta.roles
    return useAuth(roles!)
  }

  router.beforeEach(async (to) => {
    window.$loadingBar?.start() // 开始加载进度条

    // 如果是常量路由，直接放行
    if (to.meta.constant) {
      return true
    }

    const isLogin = Boolean(authStore.user.token) // 检查用户是否已登录
    const isUserDetail = Boolean(authStore.user.id) // 检查用户信息是否完整

    // 如果访问登录页，已登录则跳转到首页，否则放行
    if (to.path === '/login') {
      return isLogin ? '/' : true
    }

    // 如果未登录，跳转到登录页
    if (!isLogin) {
      return '/login'
    }

    // 如果已登录但没有用户信息，重新获取用户信息
    if (isLogin && !isUserDetail) {
      const [err] = await awaitTo(authStore.authDetailAction())
      if (err) {
        authStore.reset() // 重置用户状态
        return '/login' // 跳转到登录页
      }
      menuStore.generateMenus() // 生成菜单
      tabStore.initTabs() // 初始化标签页
      keepAliveStore.initKeepAliveData() // 初始化缓存数据
    }

    // 如果是重定向的路由，检查权限
    if (to.redirectedFrom) {
      if (!needPermission(to.redirectedFrom)) {
        return true
      } else {
        return hasPerssion(to.redirectedFrom) ? true : '/404' // 无权限跳转到404
      }
    }

    // 如果路由不需要权限，直接放行
    if (!needPermission(to)) {
      return true
    }

    // 如果没有权限，跳转到404
    if (!hasPerssion(to)) {
      return '/404'
    }

    return true // 放行
  })

  router.afterEach(() => {
    window.$loadingBar?.finish() // 完成加载进度条
  })

  router.onError(() => {
    window.$loadingBar?.error() // 加载进度条错误状态
  })
}
