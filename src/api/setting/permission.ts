import { baseHttp } from '@/api/request'

export function permissionPageListApi(data: Api.Commom.PageRequest) {
  return baseHttp.request<Api.Commom.PageResponse<Api.Setting.Permission>>({
    url: '/permission/list/page',
    method: 'post',
    data,
  })
}

export function permissionEnabledListApi() {
  return baseHttp.request<Api.Setting.Permission[]>({
    url: '/permission/list/enabled',
    method: 'post',
  })
}
