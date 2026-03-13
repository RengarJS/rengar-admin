import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import { setupVitePlugins } from './build/plugins'
import { createViteProxy } from './build/proxy'

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), '') as unknown as ImportMetaEnv
  return {
    base: viteEnv.VITE_BASE_URL, // 确保 base 配置正确
    server: {
      port: Number(viteEnv.VITE_APP_PORT),
      host: true,
      proxy: createViteProxy(viteEnv, mode),
    },

    plugins: setupVitePlugins(),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    build: {
      chunkSizeWarningLimit: 1500,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vue',
                test: /node_modules[\\/](vue|vue-router|pinia)/,
              },
              {
                name: 'naive-ui',
                test: /node_modules[\\/]naive-ui/,
              },
            ],
          },
        },
      },
    },
  }
})
