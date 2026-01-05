import type { RouteMeta } from 'vue-router'

export interface Layout {
  base: string
  blank: string
  [key: string]: string
}

export interface Option {
  entry: string
  output: string
  typeDir: string
}

export interface TreeNode {
  name: string
  path: string
  component?: string
  children?: TreeNode[]
  meta: RouteMeta
  level: number
  redirect?: string | Recordable
}

export interface RouterMap {
  component?: string
  meta: RouteMeta
  redirect?: string | Recordable
}
