export {}

declare global {
  namespace Api {
    namespace Commom {
      type EnableStatus = 0 | 1
      interface PageVO<T> {
        current: number
        size: number
        pages: number
        total: number
        records: T[]
      }
      interface PageDTO {
        current: number
        size: number
        [key: string]: any
      }
    }

    namespace Captcha {
      interface GenerateVO {
        captchaId: number
        image: string
      }
    }

    namespace Auth {
      interface LoginDTO {
        username: string
        password: string
        captchaId: number
        captchaCode: string
      }

      interface LoginVO {
        token: string
      }

      interface DetailVO {
        username: string
        id: number
        codes: string[]
      }

      interface PasswordDTO {
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

      interface RoleConfigDTO {
        id: number
        menuIds: number[]
      }

      interface User {
        id: number
        username: string
        status: Commom.EnableStatus
        roleIds: number[]
      }

      interface PasswordDTO {
        id: number
        newPassword: string
        confirmPassword: string
      }
    }
  }
}
