import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'child_process'
import { debounce } from 'es-toolkit'
import { generateRoutesTree, generateRouteString, generateRouteNameType, parseExitsRouteFile } from './utils'

import type { Plugin } from 'vite'
import type { Option, RouterMap } from './types'
export function vitePluginRoutes(option: Option): Plugin {
  const { entry, output, typeDir } = option
  const root = process.cwd()
  const viewsDir = path.resolve(root, entry)
  const outputPath = path.resolve(root, output)
  const typesDir = path.resolve(root, typeDir)
  let routerMap = new Map<string, RouterMap>()

  function generateFiles(isWatch = false) {
    if (isWatch) {
      console.log('监听到文件变化，重新生成路由...')
    }
    routerMap.clear()
    routerMap = parseExitsRouteFile(outputPath)
    const routes = generateRoutesTree(viewsDir, viewsDir)
    const routeContent = generateRouteString(routes, routerMap)
    fs.writeFileSync(outputPath, routeContent, 'utf-8')
    // 生成路由名称类型定义
    const typeContent = generateRouteNameType(routes)
    fs.writeFileSync(typesDir, typeContent, 'utf-8')
    execSync(`npx prettier --write ${outputPath} ${typesDir}`)

    console.log('\x1b[32mvite-plugin-vue-routes: 路由生成成功\x1b[0m')
  }

  const debouncedGenerateRoutes = debounce(generateFiles, 300)

  const watcher = fs.watch(viewsDir, { recursive: true }, (eventType) => {
    if (eventType === 'rename') {
      debouncedGenerateRoutes()
    }
  })

  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    buildStart() {
      generateFiles()
    },
    buildEnd() {
      watcher.close()
    },
  }
}
