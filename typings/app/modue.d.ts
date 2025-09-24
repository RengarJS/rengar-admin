export {}

import 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    vRole: {
      value: string | string[]
    }
  }
}
