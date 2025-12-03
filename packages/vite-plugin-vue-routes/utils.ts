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

export function generateRouteNameType(names: string[]): string {
  return `// 此文件由vite-plugin-routes自动生成，请勿手动修改

type RouteRecordName =
  ${names.map((name) => `| '${name}'`).join('\n  ')}
`
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
