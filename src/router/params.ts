import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import HomeIcon from '~icons/mingcute/home-2-line'

interface CustomParams {
  icon?: Component
}

interface RoutesParams {
  [key in RouteRecordName]: CustomParams &
    Omit<RouteRecordRaw, 'name' | 'path' | 'redirect' | 'meta' | 'children' | 'component'>
}

export const routesParams: RoutesParams = {
  home: {
    icon: HomeIcon,
  },
}
