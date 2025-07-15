// 此文件由vite-plugin-routes自动生成，仅限meta、redirect属性手动修改
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hideInMenu: true,
      hideInTab: true,
      constant: true,
      layout: 'blank',
    },
  },
  {
    name: 'docs',
    path: '/docs',
    meta: {
      title: '文档',
      order: 3,
      icon: 'ep:document-copy',
    },
    children: [
      {
        name: 'docs-es-toolkit',
        path: 'es-toolkit',
        component: () => import('@/views/docs/es-toolkit/index.vue'),
        meta: {
          title: 'es-toolkit',
          order: 7,
        },
      },
      {
        name: 'docs-naive-ui',
        path: 'naive-ui',
        component: () => import('@/views/docs/naive-ui/index.vue'),
        meta: {
          title: 'naive-ui',
          order: 2,
        },
      },
      {
        name: 'docs-naive-ui-components',
        path: 'naive-ui-components',
        component: () => import('@/views/docs/naive-ui-components/index.vue'),
        meta: {
          title: 'naive-ui-components',
          order: 6,
        },
      },
      {
        name: 'docs-pinia',
        path: 'pinia',
        component: () => import('@/views/docs/pinia/index.vue'),
        meta: {
          title: 'pinia',
          order: 5,
        },
      },
      {
        name: 'docs-pnpm',
        path: 'pnpm',
        component: () => import('@/views/docs/pnpm/index.vue'),
        meta: {
          title: 'pnpm',
          order: 4,
        },
      },
      {
        name: 'docs-rengar-admin',
        path: 'rengar-admin',
        component: () => import('@/views/docs/rengar-admin/index.vue'),
        meta: {
          title: '项目文档',
        },
      },
      {
        name: 'docs-unocss',
        path: 'unocss',
        component: () => import('@/views/docs/unocss/index.vue'),
        meta: {
          title: 'unocss',
          order: 9,
        },
      },
      {
        name: 'docs-vite',
        path: 'vite',
        component: () => import('@/views/docs/vite/index.vue'),
        meta: {
          title: 'vite',
          order: 3,
        },
      },
      {
        name: 'docs-vue',
        path: 'vue',
        component: () => import('@/views/docs/vue/index.vue'),
        meta: {
          title: 'vue（外链）',
          href: 'https://cn.vuejs.org/',
          order: 1,
        },
      },
      {
        name: 'docs-vueuse',
        path: 'vueuse',
        component: () => import('@/views/docs/vueuse/index.vue'),
        meta: {
          title: 'vueuse',
          order: 8,
        },
      },
    ],
  },
  {
    name: 'example',
    path: '/example',
    meta: {
      title: '示例',
      order: 2,
      icon: 'iconamoon:cursor',
    },
    children: [
      {
        name: 'example-href',
        path: 'href',
        component: () => import('@/views/example/href/index.vue'),
        meta: {
          title: '外部链接',
          href: 'https://www.naiveui.com/zh-CN/os-theme',
          order: 2,
        },
      },
      {
        name: 'example-keep-alive',
        path: 'keep-alive',
        component: () => import('@/views/example/keep-alive/index.vue'),
        meta: {
          title: 'keep-alive',
          keepAlive: true,
          order: 1,
        },
      },
    ],
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      icon: 'mingcute:home-2-line',
      fixedInTab: true,
    },
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      layout: 'blank',
      hideInMenu: true,
    },
  },
  {
    name: 'setting',
    path: '/setting',
    meta: {
      title: '系统设置',
      roles: ['menu001'],
      order: 1,
      icon: 'mingcute:settings-5-line',
    },
    children: [
      {
        name: 'setting-menu',
        path: 'menu',
        component: () => import('@/views/setting/menu/index.vue'),
        meta: {
          title: '菜单设置',
          roles: ['menu002'],
          order: 1,
        },
      },
      {
        name: 'setting-role',
        path: 'role',
        redirect: '/setting/role/list',
        meta: {
          title: '角色管理',
          roles: ['menu003'],
          order: 2,
        },
        children: [
          {
            name: 'setting-role-config',
            path: 'config/:id',
            component: () => import('@/views/setting/role/config/[id].vue'),
            meta: {
              title: '角色配置',
              hideInMenu: true,
              roles: ['menu004'],
              activeMenu: 'setting-role',
            },
          },
          {
            name: 'setting-role-list',
            path: 'list',
            component: () => import('@/views/setting/role/list/index.vue'),
            meta: {
              title: '角色列表',
              roles: ['menu005'],
              hideInMenu: true,
              activeMenu: 'setting-role',
            },
          },
        ],
      },
      {
        name: 'setting-user',
        path: 'user',
        component: () => import('@/views/setting/user/index.vue'),
        meta: {
          title: '用户管理',
          roles: ['menu006'],
          order: 3,
        },
      },
    ],
  },
]
