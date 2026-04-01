import type { PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import { setupUnocssPlugin } from './unocss'
import { setupRouter } from './router'
import { setupAutoImportPlugin } from './auto-import'
import { setupInject } from './inject'
import { setupVersion } from './version'
import { setupIcon } from './icon'
export function setupVitePlugins() {
  const plugins: PluginOption[] = [
    setupIcon(),
    setupInject(),
    vue(),
    vueJsx(),
    vueDevTools(),
    setupRouter(),
    setupUnocssPlugin(),
    ...setupAutoImportPlugin(),
    setupVersion(),
  ]
  return plugins
}
