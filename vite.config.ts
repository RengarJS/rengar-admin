import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import { setupVitePlugins } from './build/plugins'

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), '') as unknown as ImportMetaEnv
  return {
    base: viteEnv.VITE_BASE_URL, // 确保 base 配置正确
    server: {
      port: Number(viteEnv.VITE_APP_PORT),
      host: true,
      proxy: {
        '/api': {
          target: 'https://www.rengar.site/api',
          changeOrigin: true, // 必开，解决跨域
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    plugins: setupVitePlugins(),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            'naive-ui': ['naive-ui'],
          },
        },
      },
    },
  }
})
