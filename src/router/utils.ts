import type { RouteRecordRaw } from 'vue-router'

import type { ExtrarouteConfig } from './config'
export function filterRoutes(
  routesTree: RouteRecordRaw[],
  callBack: (node: RouteRecordRaw) => boolean,
): RouteRecordRaw[] {
  function traverse(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    return routes.reduce<RouteRecordRaw[]>((acc, route) => {
      if (callBack(route)) {
        const filteredRoute = { ...route }

        // 如果有子路由，递归过滤
        if (route.children?.length) {
          const filteredChildren = traverse(route.children)
          if (filteredChildren.length) {
            filteredRoute.children = filteredChildren
          } else {
            delete filteredRoute.children
          }
        }

        acc.push(filteredRoute)
      }

      return acc
    }, [])
  }

  return traverse(routesTree)
}

export function traverseRoutes(routesTree: RouteRecordRaw[], callBack: (route: RouteRecordRaw) => void): void {
  function traverse(routes: RouteRecordRaw[]): void {
    routes.forEach((route) => {
      callBack(route)
      if (route.children?.length) {
        traverse(route.children)
      }
    })
  }

  traverse(routesTree)
}

export function mergeRouteConfig(routes: RouteRecordRaw[], config: ExtrarouteConfig): RouteRecordRaw[] {
  const walk = (routes: RouteRecordRaw[]) => {
    routes.forEach((route) => {
      // 检查当前路由的 name 是否在 config 中存在
      if (Reflect.has(config, route.name as RouteRecordName)) {
        const extraConfig = config[route.name as RouteRecordName]

        // 合并meta
        if (extraConfig?.meta && route.meta) {
          Object.assign(route.meta, extraConfig.meta)
          Reflect.deleteProperty(extraConfig, 'meta')
        }

        Object.assign(route, extraConfig)
      }

      // 如果有子路由，递归处理
      if (route.children && Array.isArray(route.children)) {
        walk(route.children)
      }
    })
  }

  walk(routes)
  return routes
}
