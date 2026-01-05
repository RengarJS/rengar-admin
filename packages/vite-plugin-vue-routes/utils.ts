import fs from 'node:fs'
import path from 'node:path'

import type { TreeNode, RouterMap } from './types'

export function parseExitsRouteFile(filePath: string) {
  const file = fs.readFileSync(filePath, 'utf-8')
  const routesRegex = /export\s+const\s+routes\s*:\s*RouteRecordRaw\[\]\s*=\s*(\[\s*{[\s\S]*?\n\])/
  const match = routesRegex.exec(file)

  const routerMap = new Map<string, RouterMap>()

  if (match) {
    // 替换动态导入函数为字符串
    const routesString = match[1]!.replace(/\(\)\s*=>\s*import\(('[^']+'|"[^"]+")\)/g, '$1')
    // 清理字符串中的换行符和多余空格
    const cleanedString = routesString.replace(/\n/g, '').replace(/\s+/g, ' ')

    // 使用 Function 构造函数将字符串转换为 JavaScript 对象
    const routes = new Function(`return ${cleanedString};`)()

    // 递归遍历路由配置并加入 routerMap
    function traverseRoutes(routes: TreeNode[]) {
      for (const route of routes) {
        const { name, meta, redirect, children } = route

        // 将当前路由节点加入 routerMap
        routerMap.set(name, {
          meta: meta,
          redirect,
        })

        // 如果有子路由，递归处理
        if (children && children.length > 0) {
          traverseRoutes(children)
        }
      }
    }

    // 开始遍历
    traverseRoutes(routes)

    return routerMap
  } else {
    throw new Error('Failed to parse routes')
  }
}
export function collectRouteNames(routes: TreeNode[]): string[] {
  const names: string[] = []

  function traverse(node: TreeNode) {
    if (node.name) {
      names.push(node.name)
    }
    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  routes.forEach(traverse)
  return names
}

// 从路径中提取参数信息
function extractParamsFromPath(path: string) {
  const params: { name: string; isOptional: boolean; isArray: boolean }[] = []
  // 匹配 :param, :param+, :param* 等动态参数
  const paramRegex = /:([a-zA-Z0-9_]+)(\+|\*)?/g
  let match
  while ((match = paramRegex.exec(path)) !== null) {
    const paramName = match[1]
    const modifier = match[2]
    if (paramName) {
      // 确保 paramName 不是 undefined
      params.push({
        name: paramName,
        isOptional: modifier === '*',
        isArray: modifier === '+',
      })
    }
  }
  return params
}

export function generateRouteNameType(routes: TreeNode[]): string {
  // 生成类型映射
  let result = `// 此文件由vite-plugin-routes自动生成，请勿手动修改
import type { RouteRecordInfo } from 'vue-router'
export {}

declare global {
  interface RouteNamedMap {`

  // 递归处理路由树，收集所有子路由名称
  function collectChildNames(nodes: TreeNode[]): string[] {
    const names: string[] = []
    for (const node of nodes) {
      names.push(node.name)
      if (node.children && node.children.length > 0) {
        names.push(...collectChildNames(node.children))
      }
    }
    return names
  }

  // 递归处理路由树，生成所有层级的路由类型定义
  function processRouteWithChildren(route: TreeNode, parentPath: string = ''): string {
    let routeResult = ''

    // 计算当前路由的完整路径
    let fullPath = route.path
    if (parentPath) {
      // 如果父路径以/开头且当前路径不是以/开头，说明是相对路径，需要拼接
      if (parentPath.startsWith('/') && !route.path.startsWith('/')) {
        fullPath = `${parentPath}/${route.path}`
      } else if (!parentPath.startsWith('/') && !route.path.startsWith('/')) {
        // 如果两者都不以/开头，拼接后添加/
        fullPath = `${parentPath}/${route.path}`
      } else {
        fullPath = route.path
      }
    }

    // 为当前路由生成类型定义
    // 提取路径参数
    const params = extractParamsFromPath(fullPath) // 使用完整路径提取参数

    // 生成原始参数类型（传递给 router.push 的参数）
    let rawParamsType = 'Record<never, never>'
    if (params.length > 0) {
      const paramFields = params
        .map((param) => {
          if (param.isArray) {
            return `      ${param.name}: string | number | (string | number)[]`
          } else {
            return `      ${param.name}: string | number`
          }
        })
        .join(',\n')
      rawParamsType = `{\n${paramFields}\n    }`
    }

    // 生成标准化参数类型（从 route 对象获取的参数）
    let normalizedParamsType = 'Record<never, never>'
    if (params.length > 0) {
      const paramFields = params
        .map((param) => {
          if (param.isArray) {
            return `      ${param.name}: string[]`
          } else {
            return `      ${param.name}: string`
          }
        })
        .join(',\n')
      normalizedParamsType = `{\n${paramFields}\n    }`
    }

    // 收集子路由名称
    const childNames =
      route.children && route.children.length > 0
        ? collectChildNames(route.children)
            .map((name) => `'${name}'`)
            .join(' | ')
        : 'never'

    routeResult += `\n    // ${route.meta.title || route.name}\n`
    routeResult += `    '${route.name}': RouteRecordInfo<\n`
    routeResult += `      '${route.name}',\n`
    routeResult += `      '${fullPath}',\n` // 使用完整路径
    routeResult += `      ${rawParamsType},\n`
    routeResult += `      ${normalizedParamsType},\n`
    routeResult += `      ${childNames}\n`
    routeResult += `    >`

    // 如果有子路由，递归处理它们
    if (route.children && route.children.length > 0) {
      for (const child of route.children) {
        routeResult += processRouteWithChildren(child, fullPath)
      }
    }

    return routeResult
  }

  for (const route of routes) {
    result += processRouteWithChildren(route)
  }

  result += '\n  }\n'

  // 恢复原有的 RouteRecordName 类型定义格式
  const routeNames = collectRouteNames(routes)
  result += `\n  type RouteRecordName =\n    ${routeNames.map((name) => `| '${name}'`).join('\n    ')}\n`

  result += '\n}\n'

  return result
}

export function generateRouteString(routes: TreeNode[], routerMap: Map<string, RouterMap>): string {
  const indent = '  '
  let result =
    "// 此文件由vite-plugin-routes自动生成，仅限meta、redirect属性手动修改\nimport type { RouteRecordRaw } from 'vue-router'\n\nexport const routes: RouteRecordRaw[] = [\n"

  function stringifyNode(node: TreeNode, level: number = 1): string {
    const spaces = indent.repeat(level)
    let str = spaces + '{\n'

    // 基本属性
    if (node.name) {
      str += `${spaces}${indent}name: '${node.name}',\n`
    }
    str += `${spaces}${indent}path: '${node.path}',\n`

    // 组件属性
    if (node.component) {
      str += `${spaces}${indent}component: () => import('${node.component}'),\n`
    }

    // redirect属性
    if (routerMap.get(node.name)?.redirect) {
      const redirect = routerMap.get(node.name)?.redirect
      if (typeof redirect === 'string') {
        str += `${spaces}${indent}redirect: '${routerMap.get(node.name)?.redirect}',\n`
      } else {
        str += `${spaces}${indent}redirect: {\n`
        for (const [key, value] of Object.entries(routerMap.get(node.name)?.redirect || {})) {
          const formattedValue =
            typeof value === 'string'
              ? `'${value}'`
              : Array.isArray(value)
                ? JSON.stringify(value).replace(/"/g, "'")
                : value
          str += `${spaces}${indent}${indent}${key}: ${formattedValue},\n`
        }
        str += `${spaces}${indent}},\n`
      }
    }

    if (routerMap.get(node.name)?.meta) {
      str += `${spaces}${indent}meta: {\n`
      for (const [key, value] of Object.entries(routerMap.get(node.name)?.meta || {})) {
        const formattedValue =
          typeof value === 'string'
            ? `'${value}'`
            : Array.isArray(value)
              ? JSON.stringify(value).replace(/"/g, "'")
              : value
        str += `${spaces}${indent}${indent}${key}: ${formattedValue},\n`
      }
      str += `${spaces}${indent}},\n`
    } else {
      // meta属性
      str += `${spaces}${indent}meta: {\n`
      str += `${spaces}${indent}${indent}title: '${node.meta.title}'\n`
      str += `${spaces}${indent}},\n`
    }

    // children属性
    if (node.children && node.children.length > 0) {
      str += `${spaces}${indent}children: [\n`
      str += node.children.map((child) => stringifyNode(child, level + 2)).join(',\n')
      str += `\n${spaces}${indent}]\n`
    }

    str += `${spaces}}`
    return str
  }

  result += routes.map((route) => stringifyNode(route)).join(',\n')
  result += '\n]\n'
  return result
}

export function generateRoutesTree(dir: string, rootDir: string): TreeNode[] {
  const root = process.cwd()
  const result: TreeNode[] = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const hasValidVueFile =
        fs.existsSync(path.join(fullPath, 'index.vue')) ||
        fs.readdirSync(fullPath).some((file) => file.match(/^\[.*?\]\.vue$/))
      const children = generateRoutesTree(fullPath, rootDir)
      const relativePath = path.relative(path.join(root, 'src/views'), fullPath)
      const pathSegments = relativePath.split(path.sep)

      // 修改为通过[xxx].vue文件来添加params
      const dynamicParam = fs
        .readdirSync(fullPath)
        .find((file) => file.match(/^\[.*?\]\.vue$/))
        ?.match(/\[(.*?)\]/)?.[1]
      const routePath = dynamicParam
        ? pathSegments.length === 1
          ? `/${file}/:${dynamicParam}`
          : `${file}/:${dynamicParam}`
        : pathSegments.length === 1
          ? `/${file}`
          : file

      // 移除动态参数部分，生成更清晰的name和title
      const cleanPathSegments = pathSegments.map((segment) => segment.replace(/\[.*?\]$/, ''))
      const name = cleanPathSegments.join('-')
      const title = cleanPathSegments.join('_')

      // 只处理有index.vue的叶子节点或者有子节点的目录
      if (hasValidVueFile || children.length > 0) {
        const isLeaf = !children.length

        const node: TreeNode = {
          path: routePath,
          name,
          level: pathSegments.length,
          meta: {
            title,
          },
        }

        const component = `@${path.relative(root, rootDir).replace('src', '').split(path.sep).join('/')}/${relativePath.split(path.sep).join('/')}/${dynamicParam ? `[${dynamicParam}].vue` : 'index.vue'}`

        if (isLeaf || hasValidVueFile) {
          node.component = component
        }

        node.children = children

        result.push(node)
      }
    }
  }

  return result
}
