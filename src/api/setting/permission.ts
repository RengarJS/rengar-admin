import { baseHttp } from '@/api/request'

export function permissionEnabledListApi() {
  return baseHttp.request<Api.Setting.Permission[]>({
    url: '/permission/list/enabled',
    method: 'post',
  })
}
