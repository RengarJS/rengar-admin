// 此文件由vite-plugin-routes自动生成，请勿手动修改

import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/home',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: '首页',
    },
    children: [
      {
        name: 'home-index',
        path: '',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'home',
        },
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: 'login',
    },
    children: [
      {
        name: 'login-index',
        path: '',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: 'login',
        },
      },
    ],
  },
  {
    name: 'setting',
    path: '/setting',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: 'setting',
    },
    children: [
      {
        name: 'setting-menu',
        path: 'menu',
        component: () => import('@/views/setting/menu/index.vue'),
        meta: {
          title: 'setting_menu',
        },
      },
      {
        name: 'setting-role',
        path: 'role',
        meta: {
          title: 'setting_role',
        },
        children: [
          {
            name: 'setting-role-config',
            path: 'config/:id',
            component: () => import('@/views/setting/role/config/[id].vue'),
            meta: {
              title: 'setting_role_config',
            },
          },
          {
            name: 'setting-role-list',
            path: 'list',
            component: () => import('@/views/setting/role/list/index.vue'),
            meta: {
              title: 'setting_role_list',
            },
          },
        ],
      },
      {
        name: 'setting-user',
        path: 'user',
        component: () => import('@/views/setting/user/index.vue'),
        meta: {
          title: 'setting_user',
        },
      },
    ],
  },
]
