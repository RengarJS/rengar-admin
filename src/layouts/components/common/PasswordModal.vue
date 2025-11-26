<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    positive-text="确定"
    negative-text="取消"
    :loading
    title="修改密码"
    @positive-click="handleSubmit"
  >
    <NForm :model="formValue" :rules label-placement="left" ref="formRef" label-width="auto" class="py-8">
      <NFormItem path="oldPassword" label="旧密码">
        <NInput v-model:value="formValue.oldPassword" type="password" placeholder="请输入旧密码" />
      </NFormItem>
      <NFormItem path="newPassword" label="新密码">
        <NInput v-model:value="formValue.newPassword" type="password" placeholder="请输入新密码" />
      </NFormItem>
      <NFormItem path="confirmPassword" label="确认密码">
        <NInput v-model:value="formValue.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </NFormItem>
    </NForm>
  </NModal>
</template>

<script setup lang="ts">
import { authPasswordApi } from '@/api/common/auth'
import { to } from 'await-to-js'
import { useRouterHook } from '@/hooks/router'
import { useLoading } from '@/hooks/loading'
import { useAuthStore } from '@/stores'
import type { FormInst, FormRules } from 'naive-ui'

const show = defineModel<boolean>('show', {
  required: true,
})

const rules: FormRules = {
  oldPassword: {
    required: true,
    message: '请输入旧密码',
    trigger: ['blur', 'input'],
  },
  newPassword: {
    required: true,
    message: '请输入新密码',
    trigger: ['blur', 'input'],
  },
  confirmPassword: {
    required: true,
    validator: (_, value: string) => {
      if (!value) {
        return new Error('请再次输入新密码')
      }
      if (value !== formValue.newPassword) {
        return new Error('两次输入的密码不一致')
      }
      return true
    },
    trigger: ['blur', 'input'],
  },
}

const formValue = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const formRef = useTemplateRef<FormInst>('formRef')

const { loading, startLoading, endLoading } = useLoading()
const { routerReplaceToLogin } = useRouterHook()
const authStore = useAuthStore()

const router = useRouter()
async function handleSubmit() {
  startLoading()
  const [err] = await to(formRef.value!.validate())

  if (err) {
    endLoading()
    return false
  }
  const [err1] = await to(authPasswordApi(toRaw(formValue)))
  endLoading()
  if (err1) {
    return false
  }
  window.$message.success('修改密码成功，请重新登录')
  authStore.reset()
  routerReplaceToLogin(router.currentRoute.value.fullPath)
  return true
}
</script>

<style scoped></style>
