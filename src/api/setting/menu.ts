import { baseHttp } from '@/api/request'

export function menuTreeApi() {
  return baseHttp.request<Api.Setting.MenuTree[]>({
    url: '/menu/tree',
    method: 'post',
  })
}

export function menuButtonTreeApi() {
  return baseHttp.request<Api.Setting.MenuTree[]>({
    url: '/menu/tree/all',
    method: 'post',
  })
}

export function menuAddApi(data: Api.Setting.Menu) {
  return baseHttp.request<Api.Setting.Menu>({
    url: '/menu/add',
    method: 'post',
    data,
  })
}
export function menuEditApi(data: Api.Setting.Menu) {
  return baseHttp.request<Api.Setting.Menu>({
    url: '/menu/edit',
    method: 'post',
    data,
  })
}

export function menuDeleteApi(id: number) {
  return baseHttp.request<Api.Setting.Menu>({
    url: '/menu/delete',
    method: 'post',
    data: { id },
  })
}

export function menuDetailApi(id: number) {
  return baseHttp.request<Api.Setting.Menu>({
    url: '/menu/detail',
    method: 'post',
    data: { id },
  })
}

export function buttonListApi(parentId: number) {
  return baseHttp.request<Api.Setting.Menu[]>({
    url: '/menu/button/list',
    method: 'post',
    data: { parentId },
  })
}
