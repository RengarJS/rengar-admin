import { tailwindColors } from './src/color'

export const primaryColorKey: TailwindColorKey = 'violet'

export const themeColors = generateThemeColor()

function generateThemeColor() {
  return {
    ...tailwindColors,
    primary: tailwindColors[primaryColorKey]
  }
}
