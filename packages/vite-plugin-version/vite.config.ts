import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'node:path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'vite-plugin-vue-routes',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['node:fs', 'vite'],
    },
    outDir: 'lib',
  },
  plugins: [dts()],
})
