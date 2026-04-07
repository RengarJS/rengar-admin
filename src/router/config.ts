import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import HomeIcon from '~icons/mingcute/home-2-line'
import SettingIcon from '~icons/mingcute/settings-5-line'

interface ExtraConfig {
  icon?: Component
}

export type ExtrarouteConfig = Partial<
  Record<
    RouteRecordName,
    ExtraConfig & Omit<RouteRecordRaw, 'name' | 'path' | 'redirect' | 'meta' | 'children' | 'component' | 'meta'>
  >
>

export const isExtra = 'isExtra_'

export const extraRoutesConfig: ExtrarouteConfig = {
  home: {
    icon: HomeIcon,
  },
  setting: {
    icon: SettingIcon,
  },
}
