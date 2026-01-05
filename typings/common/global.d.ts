export {}

declare global {
  type Recordable<T = any> = Record<string, T>
  type TailwindColorKey =
    | 'slate'
    | 'gray'
    | 'zinc'
    | 'neutral'
    | 'stone'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose'

  type ThemeColorKey = TailwindColorKey | 'primary'
  type ThemeColorValue =
    | 'DEFAULT'
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | '950'
  type ThemeColorItem = Record<ThemeColorValue, string>
  type TailWindColor = Record<TailwindColorKey, ThemeColorItem>
  type ThemeColor = Record<ThemeColorKey, ThemeColorItem>
  type Layout = 'base' | 'blank'
}
