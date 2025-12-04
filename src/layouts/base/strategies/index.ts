import type { Component } from 'vue'
import asideLayout from './asideLayout/index.vue'
import topAside from './topLayout/index.vue'
import asideTopLayout from './asideTopLayout/index.vue'

export const layout: Record<App.LayoutMode, Component> = {
  aside: asideLayout,
  top: topAside,
  'top-aside': asideTopLayout,
}
