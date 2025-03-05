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
type ThemeColorValue = 'DEFAULT' | '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
type TailWindColor = Record<TailwindColorKey, Record<ThemeColorValue, string>>
type ThemeColor = Record<ThemeColorKey, Record<ThemeColorValue, string>>
