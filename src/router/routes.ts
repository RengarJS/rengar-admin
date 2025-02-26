// 此文件由vite-plugin-routes自动生成，手动修改componet、meta的值不会被覆盖，其他请勿手动修改

import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'b',
    path: '/b',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: 'b'
    },
    children: [
      {
        name: 'b-c',
        path: 'c',
        component: () => import('@/views/b/c/index.vue'),
        meta: {
          title: 'b_c'
        },
      },
      {
        name: 'b-e',
        path: 'e',
        component: () => import('@/views/b/e/index.vue'),
        meta: {
          title: 'b_e'
        },
      },
      {
        name: 'b-f',
        path: 'f/:id',
        component: () => import('@/views/b/f/[id].vue'),
        meta: {
          title: 'b_f'
        },
      }
    ]
  },
  {
    name: 'c',
    path: '/c',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: 'c'
    },
    children: [
      {
        name: 'c-index',
        path: '',
        component: () => import('@/views/c/index.vue'),
        meta: {
          title: 'c'
        },
      }
    ]
  },
  {
    name: 'd',
    path: '/d/:id',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: 'd'
    },
    children: [
      {
        name: 'd-index',
        path: '',
        component: () => import('@/views/d/[id].vue'),
        meta: {
          title: 'd'
        },
      }
    ]
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: 'home'
    },
    children: [
      {
        name: 'home-index',
        path: '',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'home'
        },
      }
    ]
  },
  {
    name: 'user',
    path: '/user',
    component: () => import('@/layouts/base/index.vue'),
    meta: {
      title: 'user'
    },
    children: [
      {
        name: 'user-add',
        path: 'add/:id',
        component: () => import('@/views/user/add/[id].vue'),
        meta: {
          title: 'user_add'
        },
      },
      {
        name: 'user-list',
        path: 'list',
        component: () => import('@/views/user/list/index.vue'),
        meta: {
          title: 'user_list'
        },
        children: [
          {
            name: 'user-list-edit',
            path: 'edit/:id',
            component: () => import('@/views/user/list/edit/[id].vue'),
            meta: {
              title: 'user_list_edit'
            },
          },
          {
            name: 'user-list-show',
            path: 'show',
            component: () => import('@/views/user/list/show/index.vue'),
            meta: {
              title: 'user_list_show'
            },
          }
        ]
      }
    ]
  }
]
