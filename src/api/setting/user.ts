import { baseHttp } from '@/api/request'

export function userPageListApi(data: Api.Commom.PageRequest) {
  return baseHttp.request<Api.Commom.PageResponse<Api.Setting.User>>({
    url: '/user/list/page',
    method: 'post',
    data,
  })
}

export function userAddApi(data: Api.Setting.User) {
  return baseHttp.request<boolean>({
    url: '/user/add',
    method: 'post',
    data,
  })
}
export function userEditApi(data: Api.Setting.User) {
  return baseHttp.request<boolean>({
    url: '/user/edit',
    method: 'post',
    data,
  })
}

export function userDetailApi(id: number) {
  return baseHttp.request<Api.Setting.User>({
    url: '/user/detail',
    method: 'post',
    data: { id },
  })
}

export function userDeleteApi(id: number) {
  return baseHttp.request<boolean>({
    url: '/user/delete',
    method: 'post',
    data: { id },
  })
}

export function userPasswordApi(data: Api.Setting.PasswordParams) {
  return baseHttp.request<boolean>({
    url: '/user/password',
    method: 'post',
    data,
  })
}
