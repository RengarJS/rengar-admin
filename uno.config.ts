import { defineConfig, presetIcons, presetWind3 } from 'unocss'
import { presetRengarAdmin } from '@rengar-admin/unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import type { CustomIconLoader } from '@iconify/utils'
import path from 'node:path'

const svgFilePath = path.resolve(process.cwd(), 'src/assets/svg-icons')
export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  presets: [
    presetWind3,
    presetIcons({
      scale: 1,
      extraProperties: {},
      warn: true,
      collections: {
        local: FileSystemIconLoader(svgFilePath) as CustomIconLoader,
      },
    }),
    presetRengarAdmin(),
  ],
})
