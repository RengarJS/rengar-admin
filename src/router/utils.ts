import type { RouteRecordRaw } from 'vue-router'

import { type ExtrarouteConfig, isExtra } from './config'
import { cloneDeep } from 'es-toolkit'
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

export function mergeRouteConfig(routes: RouteRecordRaw[], extraconfig: ExtrarouteConfig): RouteRecordRaw[] {
  const config = cloneDeep(extraconfig)
  const walk = (routes: RouteRecordRaw[]) => {
    routes.forEach((route) => {
      // 检查当前路由的 name 是否在 config 中存在
      if (Reflect.has(config, route.name as RouteRecordName)) {
        const matchedConfig = config[route.name as RouteRecordName]

        // 合并meta
        if (matchedConfig?.icon) {
          route.meta!.icon = `${isExtra}${route.name as string}`
          Reflect.deleteProperty(matchedConfig, 'icon')
        }

        Object.assign(route, matchedConfig)
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
