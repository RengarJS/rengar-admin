import vueRouter from '@/router'
import type { RouteLocationRaw } from 'vue-router'
interface Option {
  params?: Recordable
  query?: Recordable
}

export function useRouterHook(setup = true) {
  const router = setup ? useRouter() : vueRouter
  function routerPushByName(name: RouteRecordName, option?: Option) {
    router.push({
      name,
      ...option,
    } as RouteLocationRaw)
  }

  function routerPushToHome() {
    routerPushByName('home')
  }

  function routerReplaceToHome() {
    routerPushByName('home')
  }

  function routerReplaceByName(name: RouteRecordName, option?: Option) {
    router.replace({
      name,
      ...option,
    } as RouteLocationRaw)
  }
  function routerReplaceToLogin(path?: string) {
    router.replace({
      name: 'login',
      query: {
        redirect: path ? encodeURIComponent(path) : undefined,
      },
    })
  }

  return {
    routerPushToHome,
    routerReplaceToHome,
    routerReplaceToLogin,
    routerReplaceByName,
    routerPushByName,
  }
}
