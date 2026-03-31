<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    title="修改密码"
    positive-text="确定"
    negative-text="取消"
    :loading
    @after-enter="handleOpen"
    @after-leave="handleClose"
    @positive-click="handleSubmit"
  >
    <NForm ref="formRef" :model="formValue" :rules class="my-8" size="small" label-placement="left" label-width="auto">
      <NFormItem path="newPassword" label="新密码">
        <NInput v-model:value="formValue.newPassword" type="password" placeholder="请输入新密码" />
      </NFormItem>
      <NFormItem path="confirmPassword" label="确认密码">
        <NInput v-model:value="formValue.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </NFormItem>
    </NForm>
  </NModal>
</template>

<script setup lang="tsx">
import { userPasswordApi } from '@/api/setting/user'

import { type FormRules, type FormInst } from 'naive-ui'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { record } = defineProps<{
  record?: Api.Setting.User
}>()

const formValue = ref<Api.Setting.PasswordDTO>({
  id: 0,
  newPassword: '',
  confirmPassword: '',
})
const formRef = useTemplateRef<FormInst>('formRef')
const rules: FormRules = {
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
      if (value !== formValue.value.newPassword) {
        return new Error('两次输入的密码不一致')
      }
      return true
    },
    trigger: ['blur', 'input'],
  },
}

function handleClose() {
  formValue.value = {
    id: 0,
    newPassword: '',
    confirmPassword: '',
  }
}

function handleOpen() {
  if (record) {
    formValue.value.id = record.id
  }
}

const loading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(userPasswordApi(unref(formValue)))
  loading.value = false
  if (err) return
  window.$message?.success('修改密码成功')
  return true
}
</script>

<style scoped></style>
