import { baseHttp } from '@/api/request'

export function rolePageListApi(data: Api.Commom.PageRequest) {
  return baseHttp.request<Api.Commom.PageResponse<Api.Setting.Role>>({
    url: '/role/list/page',
    method: 'post',
    data,
  })
}

export function roleListEnabledApi() {
  return baseHttp.request<Api.Setting.Role[]>({
    url: '/role/list/enabled',
    method: 'post',
  })
}

export function roleAddApi(data: Api.Setting.Role) {
  return baseHttp.request<boolean>({
    url: '/role/add',
    method: 'post',
    data,
  })
}
export function roleEditApi(data: Api.Setting.Role) {
  return baseHttp.request<boolean>({
    url: '/role/edit',
    method: 'post',
    data,
  })
}

export function roleDeleteApi(id: number) {
  return baseHttp.request<boolean>({
    url: '/role/delete',
    method: 'post',
    data: { id },
  })
}

export function roleConfigApi(data: Api.Setting.RoleConfigReq) {
  return baseHttp.request<boolean>({
    url: '/role/config',
    method: 'post',
    data,
  })
}

export function roleConfigDetailApi(id: number) {
  return baseHttp.request<Api.Setting.RoleConfigMenuItem[]>({
    url: '/role/config/detail',
    method: 'post',
    data: { id },
  })
}
