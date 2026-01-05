// 此文件由vite-plugin-routes自动生成，请勿手动修改
import type { RouteRecordInfo } from 'vue-router'
export {}

declare global {
  interface RouteNamedMap {
    // 404
    '404': RouteRecordInfo<'404', '/404', Record<string, string | number>, Record<string, string>, never>
    // docs
    docs: RouteRecordInfo<
      'docs',
      '/docs',
      Record<string, string | number>,
      Record<string, string>,
      | 'docs-es-toolkit'
      | 'docs-naive-ui'
      | 'docs-naive-ui-components'
      | 'docs-pinia'
      | 'docs-pnpm'
      | 'docs-rengar-admin'
      | 'docs-unocss'
      | 'docs-vite'
      | 'docs-vue'
      | 'docs-vueuse'
    >
    // docs_es-toolkit
    'docs-es-toolkit': RouteRecordInfo<
      'docs-es-toolkit',
      '/docs/es-toolkit',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_naive-ui
    'docs-naive-ui': RouteRecordInfo<
      'docs-naive-ui',
      '/docs/naive-ui',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_naive-ui-components
    'docs-naive-ui-components': RouteRecordInfo<
      'docs-naive-ui-components',
      '/docs/naive-ui-components',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_pinia
    'docs-pinia': RouteRecordInfo<
      'docs-pinia',
      '/docs/pinia',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_pnpm
    'docs-pnpm': RouteRecordInfo<
      'docs-pnpm',
      '/docs/pnpm',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_rengar-admin
    'docs-rengar-admin': RouteRecordInfo<
      'docs-rengar-admin',
      '/docs/rengar-admin',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_unocss
    'docs-unocss': RouteRecordInfo<
      'docs-unocss',
      '/docs/unocss',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_vite
    'docs-vite': RouteRecordInfo<
      'docs-vite',
      '/docs/vite',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // docs_vue
    'docs-vue': RouteRecordInfo<'docs-vue', '/docs/vue', Record<string, string | number>, Record<string, string>, never>
    // docs_vueuse
    'docs-vueuse': RouteRecordInfo<
      'docs-vueuse',
      '/docs/vueuse',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // example
    example: RouteRecordInfo<
      'example',
      '/example',
      Record<string, string | number>,
      Record<string, string>,
      'example-href' | 'example-keep-alive'
    >
    // example_href
    'example-href': RouteRecordInfo<
      'example-href',
      '/example/href',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // example_keep-alive
    'example-keep-alive': RouteRecordInfo<
      'example-keep-alive',
      '/example/keep-alive',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // home
    home: RouteRecordInfo<'home', '/home', Record<string, string | number>, Record<string, string>, never>
    // login
    login: RouteRecordInfo<'login', '/login', Record<string, string | number>, Record<string, string>, never>
    // setting
    setting: RouteRecordInfo<
      'setting',
      '/setting',
      Record<string, string | number>,
      Record<string, string>,
      | 'setting-menu'
      | 'setting-permission'
      | 'setting-permission-list'
      | 'setting-role'
      | 'setting-role-config'
      | 'setting-role-list'
      | 'setting-user'
    >
    // setting_menu
    'setting-menu': RouteRecordInfo<
      'setting-menu',
      '/setting/menu',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // setting_permission
    'setting-permission': RouteRecordInfo<
      'setting-permission',
      '/setting/permission',
      Record<string, string | number>,
      Record<string, string>,
      'setting-permission-list'
    >
    // setting_permission_list
    'setting-permission-list': RouteRecordInfo<
      'setting-permission-list',
      '/setting/permission/list',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // setting_role
    'setting-role': RouteRecordInfo<
      'setting-role',
      '/setting/role',
      Record<string, string | number>,
      Record<string, string>,
      'setting-role-config' | 'setting-role-list'
    >
    // setting_role_config
    'setting-role-config': RouteRecordInfo<
      'setting-role-config',
      '/setting/role/config/:id',
      {
        id: string | number
      } & Record<string, string | number>,
      {
        id: string
      } & Record<string, string>,
      never
    >
    // setting_role_list
    'setting-role-list': RouteRecordInfo<
      'setting-role-list',
      '/setting/role/list',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
    // setting_user
    'setting-user': RouteRecordInfo<
      'setting-user',
      '/setting/user',
      Record<string, string | number>,
      Record<string, string>,
      never
    >
  }

  type RouteRecordName = keyof RouteNamedMap
}
