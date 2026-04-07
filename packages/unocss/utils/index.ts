// utils/unocss-icons.ts 或任意工具文件

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * 递归扫描本地 SVG 图标目录，生成 UnoCSS safelist 所需的图标类名数组
 * @param prefix UnoCSS 图标前缀，例如 'i-local-'
 * @param dirPath 图标根目录路径（相对于项目根目录），例如 './src/assets/icons'
 * @returns string[] 完整的图标类名列表，如 ['i-local-home', 'i-local-social-github']
 */
export function generateIconSafelist(prefix: string, dirPath: string): string[] {
  const icons: string[] = []

  function walk(currentDir: string, relativePath = '') {
    const files = readdirSync(currentDir)

    for (const file of files) {
      const fullPath = join(currentDir, file)
      const stats = statSync(fullPath)

      if (stats.isDirectory()) {
        // 进入子目录，更新相对路径（用 - 连接）
        const newRelative = relativePath ? `${relativePath}-${file}` : file
        walk(fullPath, newRelative)
      } else if (file.endsWith('.svg')) {
        // 提取文件名（不含 .svg）
        const iconName = file.replace(/\.svg$/, '')
        // 拼接完整类名：前缀 + 相对路径（如有）+ 文件名
        const fullClassName = relativePath ? `${prefix}${relativePath}-${iconName}` : `${prefix}${iconName}`
        icons.push(fullClassName)
      }
    }
  }

  walk(dirPath)
  return icons
}
