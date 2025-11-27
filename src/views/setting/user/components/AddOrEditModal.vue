<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="record ? '编辑用户' : '新增用户'"
    positive-text="确定"
    negative-text="取消"
    :loading
    @after-enter="handleOpen"
    @after-leave="handleClose"
    @positive-click="handleSubmit"
  >
    <NForm ref="formRef" :model="formData" :rules class="my-8" size="small" label-placement="left" label-width="auto">
      <NFormItem label="账户名" path="username">
        <NInput v-model:value="formData.username" placeholder="账户名" />
      </NFormItem>
      <NFormItem v-if="!record" label="密码" path="password">
        <NInput v-model:value="formData.password" placeholder="密码" />
      </NFormItem>
      <NFormItem v-if="!record" label="确认密码" path="confirmPassword">
        <NInput v-model:value="formData.confirmPassword" placeholder="确认密码" />
      </NFormItem>
      <NFormItem label="角色绑定" path="roleIds">
        <NSelect
          v-model:value="formData.roleIds"
          :options="roleList"
          multiple
          label-field="name"
          value-field="id"
          placeholder="请绑定角色"
        />
      </NFormItem>
      <NFormItem label="状态" path="status">
        <NRadioGroup v-model:value="formData.status">
          <NRadio :value="1">启用</NRadio>
          <NRadio :value="0">禁用</NRadio>
        </NRadioGroup>
      </NFormItem>
    </NForm>
  </NModal>
</template>

<script setup lang="tsx">
import { userAddApi, userEditApi, userDetailApi } from '@/api/setting/user'
import { roleListEnabledApi } from '@/api/setting/role'

import { type FormRules, type FormInst } from 'naive-ui'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { record } = defineProps<{
  record?: Api.Setting.User
}>()

const emit = defineEmits<{
  success: []
}>()

const formData = ref<Recordable>({
  username: '',
  status: 1,
  roleIds: [],
})

const formRef = useTemplateRef<FormInst>('formRef')
const rules: FormRules = {
  username: [{ required: true, message: '请输入账户名', trigger: ['blur', 'input'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'input'] }],
  confirmPassword: [{ required: true, message: '请输入确认密码', trigger: ['blur', 'input'] }],
  roleIds: [{ required: true, type: 'array', message: '请绑定角色', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '请选择状态', type: 'number', trigger: ['blur', 'change'] }],
}

const roleList = ref<Api.Setting.Role[]>([])

async function getRoleList() {
  const [err, data] = await to(roleListEnabledApi())
  if (err) {
    roleList.value = []
    return
  }
  roleList.value = data
}

getRoleList()

function handleOpen() {
  if (record) {
    getDetail()
  }
}

async function getDetail() {
  const [err, res] = await to(userDetailApi(record!.id))
  if (err) return
  formData.value = res
}

function handleClose() {
  for (const key in formData.value) {
    formData.value[key] = null
  }
}

const loading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(
    record ? userEditApi(unref(formData) as Api.Setting.User) : userAddApi(unref(formData) as Api.Setting.User),
  )
  loading.value = false
  if (err) return
  window.$message?.success(`${record ? '编辑' : '新增'}成功`)
  emit('success')
  return true
}
</script>

<style scoped></style>
