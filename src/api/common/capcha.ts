import { baseHttp } from '@/api/request'

export function generateCaptchaApi() {
  return baseHttp.request<Api.Captcha.GenerateResponse>({
    url: '/captcha/generate',
    method: 'POST',
  })
}
