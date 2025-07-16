<template>
  <div class="relative size-screen overflow-hidden bg-primary-100">
    <NCard class="z-1 w-400px absolute-center" size="large" :bordered="false" round hoverable>
      <div class="flex-center gap-4 text-primary">
        <SvgIcon local-icon="i-local-logo" class="text-6xl text-primary"></SvgIcon>
        <div class="text-3xl">{{ title }}</div>
      </div>
      <NForm
        :model="formData"
        ref="formRef"
        :rules
        label-placement="left"
        label-width="auto"
        size="large"
        class="mt-12"
      >
        <NFormItem path="username">
          <NInput
            v-model:value="formData.username"
            placeholder="请输入用户名"
            clearable
            :theme-overrides="{
              borderRadius: '6px',
            }"
          />
        </NFormItem>
        <NFormItem path="password">
          <NInput
            v-model:value="formData.password"
            placeholder="请输入密码"
            clearable
            show-password-on="mousedown"
            type="password"
            :theme-overrides="{
              borderRadius: '6px',
            }"
          />
        </NFormItem>
        <NFormItem>
          <NButton type="primary" :loading attr-type="submit" round block @click="handleSubmit">登录</NButton>
        </NFormItem>
      </NForm>
    </NCard>
    <TopWave />
    <BottomWave />
  </div>
</template>

<script setup lang="ts">
import { to } from 'await-to-js'
import { useAuthStore } from '@/stores'
import { useLoading } from '@/hooks/loading'

import type { FormInst, FormRules } from 'naive-ui'
import BottomWave from './components/BottomWave.vue'
import TopWave from './components/TopWave.vue'
const title = import.meta.env.VITE_APP_TITLE

const formData = reactive({
  username: 'admin',
  password: '123456',
})
const formRef = useTemplateRef<FormInst>('formRef')
const rules: FormRules = {
  username: {
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入用户名',
  },
  password: {
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入密码',
  },
}

const authStore = useAuthStore()

const { loading, startLoading, endLoading } = useLoading()

const route = useRoute()
const router = useRouter()
const redirect = route.query.redirect ? decodeURIComponent(route.query.redirect as string) : undefined
async function handleSubmit() {
  startLoading()
  const [err] = await to(formRef.value!.validate())
  if (err) {
    endLoading()
    return
  }
  const [loginErr] = await to(authStore.authLoginAction(formData))
  if (loginErr) {
    endLoading()
    return
  }
  window.$message.success('登录成功')
  router.replace(redirect || '/')
}
</script>

<style scoped></style>
