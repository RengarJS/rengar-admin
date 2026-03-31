import { baseHttp } from '@/api/request'

export function generateCaptchaApi() {
  return baseHttp.request<Api.Captcha.GenerateVO>({
    url: '/captcha/generate',
    method: 'POST',
  })
}
