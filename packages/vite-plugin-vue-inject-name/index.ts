import { parse } from 'vue/compiler-sfc'
import { createFilter } from '@rollup/pluginutils'
import type { Plugin } from 'vite'

import * as path from 'path'

export function injectFolderNamePlugin(entry = 'src/views'): Plugin {
  const entryPath = path.resolve(process.cwd(), entry)
  const filter = createFilter(/(index\.vue|\[[^/]+\]\.vue)$/)
  return {
    name: 'vite-plugin-vue-inject-name',
    enforce: 'pre',
    transform(code, id) {
      if (!id.startsWith(entryPath) || !filter(id)) return
      const { descriptor } = parse(code, {
        ignoreEmpty: false,
      })
      if (!descriptor.scriptSetup) return

      // 获取文件相对于 entry 的路径
      const relativePath = path.relative(entryPath, id)
      const dirs = relativePath.split(path.sep)

      // 去掉文件名，只保留文件夹层级
      dirs.pop()

      // 将文件夹名称用 - 连接
      let name = dirs.join('-')
      if (!name.includes('-')) {
        name = `${name}-index`
      }

      // 处理 <script setup> 的内容
      const scriptSetupContent = descriptor.scriptSetup.content

      // 检查是否已经定义了 defineOptions
      const hasDefineOptions = scriptSetupContent.includes('defineOptions')

      if (hasDefineOptions) {
        // 如果已经存在 defineOptions，修改或新增 name 属性
        const updatedCode = scriptSetupContent.replace(/defineOptions\((\{[\s\S]*?\})\)/, (_, options) => {
          // 解析 options 对象
          const updatedOptions = options.replace(/(name\s*:\s*)(['"][^'"]*['"]|[\w\.]+)/, `$1'${name}'`)

          // 如果 name 属性不存在，则新增
          if (!updatedOptions.includes('name:')) {
            return `defineOptions({
              ${options.trim().slice(1, -1)},
              name: '${name}',
            })`
          }

          return `defineOptions(${updatedOptions})`
        })

        return {
          code: code.replace(scriptSetupContent, updatedCode),
          map: null,
        }
      } else {
        // 如果没有 defineOptions，直接注入
        return {
          code: code.replace(
            /<script[\s\S]*?setup[\s\S]*?>([\s\S]*?)<\/script>/,
            `<script setup lang="ts">
          ${scriptSetupContent}
          defineOptions({
            name: '${name}',
          });
          </script>`,
          ),
          map: null,
        }
      }
    },
  }
}
