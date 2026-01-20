import { themeColorCssVariables, unocssPrimaryColor } from '@rengar-admin/color'
import type { Preset } from 'unocss'

export function presetRengarAdmin(): Preset {
  const preset: Preset = {
    name: 'rengar-admin',
    theme: {
      colors: {
        primary: unocssPrimaryColor,
      },
    },
    rules: [
      [
        /^h-(\d+)dvh$/,
        ([, d]) => {
          return [
            ['height', `${d}vh`],
            ['height', `${d}dvh`],
          ]
        },
      ],

      [
        /^w-(\d+)dvw$/,
        ([, d]) => {
          return [
            ['width', `${d}vw`],
            ['width', `${d}dvw`],
          ]
        },
      ],
      [
        'h-screen',
        [
          ['height', '100vh'],
          ['height', '100dvh'],
        ],
      ],
      [
        'w-screen',
        [
          ['width', '100vw'],
          ['width', '100dvw'],
        ],
      ],
      [
        'size-screen',
        [
          ['width', '100vw'],
          ['width', '100dvw'],
          ['height', '100vh'],
          ['height', '100dvh'],
        ],
      ],
    ],
    preflights: [
      {
        getCSS() {
          return `
           :root {
              ${themeColorCssVariables}
            }
          `
        },
      },
    ],
    shortcuts: [
      {
        'flex-center': 'flex justify-center items-center',
        'flex-center-x': 'flex items-center',
        'flex-center-y': 'flex justify-center',
        'flex-y': 'flex flex-col',
      },
      {
        'absolute-center-x': 'absolute left-1/2 -translate-x-1/2',
        'absolute-center-y': 'absolute top-1/2 -translate-y-1/2',
        'absolute-center': 'absolute-center-x absolute-center-y',
        'absolute-full': 'absolute top-0 left-0 right-0 bottom-0',
      },
      {
        'no-scrollbar': '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
      },
    ],
  }
  return preset
}
