<template>
  <div class="relative size-screen flex-center overflow-hidden bg-primary-100">
    <NCard class="w-[440px]" size="large" :bordered="false" round hoverable>
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
              borderRadius: '6px'
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
              borderRadius: '6px'
            }"
          />
        </NFormItem>
        <NFormItem>
          <NButton type="primary" round block @click="handleSubmit">登录</NButton>
        </NFormItem>
      </NForm>
    </NCard>
    <div class="absolute left-0 right-0 -top-[10%]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="var(--color-primary)"
          fill-opacity="1"
          d="M0,224L20,218.7C40,213,80,203,120,208C160,213,200,235,240,208C280,181,320,107,360,96C400,85,440,139,480,165.3C520,192,560,192,600,176C640,160,680,128,720,133.3C760,139,800,181,840,213.3C880,245,920,267,960,234.7C1000,203,1040,117,1080,106.7C1120,96,1160,160,1200,165.3C1240,171,1280,117,1320,117.3C1360,117,1400,171,1420,197.3L1440,224L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
        ></path>
      </svg>
    </div>
    <div class="absolute left-0 right-0 -bottom-[10%]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="var(--color-primary)"
          fill-opacity="1"
          d="M0,256L18.5,240C36.9,224,74,192,111,192C147.7,192,185,224,222,218.7C258.5,213,295,171,332,165.3C369.2,160,406,192,443,208C480,224,517,224,554,208C590.8,192,628,160,665,138.7C701.5,117,738,107,775,128C812.3,149,849,203,886,213.3C923.1,224,960,192,997,192C1033.8,192,1071,224,1108,218.7C1144.6,213,1182,171,1218,138.7C1255.4,107,1292,85,1329,106.7C1366.2,128,1403,192,1422,224L1440,256L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { to } from '@/utils'
import { useAuthStore } from '@/stores'
import { useRouterHook } from '@/hooks'
import type { FormInst, FormRules } from 'naive-ui'
const title = import.meta.env.VITE_APP_TITLE

const formData = reactive({
  username: '',
  password: ''
})
const formRef = useTemplateRef<FormInst>('formRef')
const rules: FormRules = {
  username: {
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入用户名'
  },
  password: {
    required: true,
    trigger: ['input', 'blur'],
    message: '请输入密码'
  }
}

const authStore = useAuthStore()

const { replaceByRouterName } = useRouterHook()
async function handleSubmit() {
  const [err] = await to(formRef.value!.validate())
  if (err) return
  const [loginErr] = await to(authStore.authLoginAction(formData))
  if (loginErr) return
  // 登录成功后先获取用户信息
  const [detailErr] = await to(authStore.authDetailAction())
  if (detailErr) return
  window.$message.success('登录成功')
  replaceByRouterName('home')
}
</script>

<style scoped></style>
