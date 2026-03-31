import { baseHttp } from '@/api/request'

export function permissionPageListApi(data: Api.Commom.PageDTO) {
  return baseHttp.request<Api.Commom.PageVO<Api.Setting.Permission>>({
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
