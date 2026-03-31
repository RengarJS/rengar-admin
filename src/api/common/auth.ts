import { baseHttp } from '@/api/request'

export function authLoginApi(data: Api.Auth.LoginDTO) {
  return baseHttp.request<Api.Auth.LoginVO>({
    url: '/auth/login',
    method: 'POST',
    data,
  })
}

export function authDetailApi() {
  return baseHttp.request<Api.Auth.DetailVO>({
    url: '/auth/detail',
    method: 'post',
  })
}

export function authLoginOutApi() {
  return baseHttp.request<boolean>({
    url: '/auth/logout',
    method: 'post',
  })
}

export function authPasswordApi(data: Api.Auth.PasswordDTO) {
  return baseHttp.request<boolean>({
    url: '/auth/password',
    method: 'post',
    data,
  })
}
