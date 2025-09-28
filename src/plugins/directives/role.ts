// src/directives/role.ts
import { useAuth } from '@/hooks/auth'
import type { App, Directive, DirectiveBinding } from 'vue'

interface RoleDirectiveBinding extends Omit<DirectiveBinding, 'modifiers'> {
  value: string | string[]
  modifiers?: {
    any?: boolean
    all?: boolean
  }
}

const RoleDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el: HTMLElement, binding: RoleDirectiveBinding) {
    const { value } = binding

    const hasPermission = useAuth(value)
    if (!hasPermission) {
      el.remove()
    }
  },
}

export function setupRoleDirective(app: App) {
  app.directive('role', RoleDirective)
}
