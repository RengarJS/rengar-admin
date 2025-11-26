export {}

declare global {
  namespace Api {
    namespace Commom {
      type EnableStatus = 0 | 1
      interface PageResponse<T> {
        current: number
        size: number
        pages: number
        total: number
        records: T[]
      }
      interface PageRequest {
        current: number
        size: number
        [key: string]: any
      }
    }

    namespace Captcha {
      interface GenerateResponse {
        captchaId: number
        image: string
      }
    }

    namespace Auth {
      interface LoginParams {
        username: string
        password: string
        captchaId: number
        captchaCode: string
      }

      interface LoginResponse {
        token: string
      }

      interface DetailResponse {
        username: string
        id: number
        codes: string[]
      }

      interface PasswordParams {
        oldPassword: string
        newPassword: string
      }
    }

    namespace Setting {
      interface Permission {
        id: number
        name: string
        path: string
        status: Commom.EnableStatus
      }

      interface Menu {
        id: number
        parentId: number
        code: string
        name: string
        type: 1 | 2
        status: Commom.EnableStatus
        sort: number
      }

      interface MenuTree extends Menu {
        children?: MenuTree[]
      }
      interface Button {
        id: number
        parentId: number
        code: string
        name: string
        status: Commom.EnableStatus
        sort: number
      }

      interface Role {
        id: number
        status: Commom.EnableStatus
        name: string
      }

      interface RoleConfigMenuItem {
        id: number
        isHalf: boolean
      }

      interface RoleConfigReq {
        id: number
        menuList: RoleConfigMenuItem[]
      }

      interface User {
        id: number
        username: string
        status: Commom.EnableStatus
        roleIds: string[]
      }

      interface UserBindRoleReq {
        id: number
        roleIds: number[]
      }

      interface PasswordParams {
        id: number
        newPassword: string
        confirmPassword: string
      }
    }
  }
}
