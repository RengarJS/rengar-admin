import { parse } from 'vue/compiler-sfc'
import { createFilter } from '@rollup/pluginutils'
import type { Plugin } from 'vite'

import path from 'node:path'

export function injectFolderNamePlugin(entry = 'src/views'): Plugin {
  const entryPath = path.resolve(process.cwd(), entry).replace(/\\/g, '/')
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
      const name = dirs.join('-')

      // 处理 <script setup> 的内容
      const { content } = descriptor.scriptSetup

      // 检查是否已经定义了 defineOptions
      const hasDefineOptions = content.includes('defineOptions')

      if (hasDefineOptions) {
        // 如果已经存在 defineOptions，修改或新增 name 属性
        const updatedCode = content.replace(/defineOptions\((\{[\s\S]*?\})\)/, (_, options) => {
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
          code: code.replace(content, updatedCode),
          map: null,
        }
      } else {
        // 如果没有 defineOptions，直接注入
        const scripSartTagtStr = code.match(/<script[\s\S]*?setup[\s\S]*?>/g)

        if (!scripSartTagtStr) {
          throw new Error('script setup 标签匹配错误')
        }
        return {
          code: code.replace(
            /<script[\s\S]*?setup[\s\S]*?>([\s\S]*?)<\/script>/,
            `${scripSartTagtStr[0]}
          ${content}
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
