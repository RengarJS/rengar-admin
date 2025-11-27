<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="record ? '编辑角色' : '新增角色'"
    positive-text="确定"
    negative-text="取消"
    :loading
    @after-enter="handleOpen"
    @after-leave="handleClose"
    @positive-click="handleSubmit"
  >
    <NForm ref="formRef" :model="formData" :rules class="my-8" size="small" label-placement="left" label-width="auto">
      <NFormItem label="角色名称" path="name">
        <NInput v-model:value="formData.name" placeholder="角色名称" />
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
import { roleAddApi, roleEditApi } from '@/api/setting/role'
import { type FormRules, type FormInst } from 'naive-ui'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { record } = defineProps<{
  record?: Api.Setting.Role
}>()

const emit = defineEmits<{
  success: []
}>()

const formData = ref<Api.Setting.Role>({
  id: 0,
  name: '',
  status: 1,
})

const formRef = useTemplateRef<FormInst>('formRef')
const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'input'] }],
  status: [{ required: true, message: '请选择状态', type: 'number', trigger: ['blur', 'change'] }],
}

function handleOpen() {
  if (record) {
    formData.value = record
  }
}

function handleClose() {
  formData.value = {
    id: 0,
    name: '',
    status: 1,
  }
}

const loading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(record ? roleEditApi(unref(formData)) : roleAddApi(unref(formData)))
  loading.value = false
  if (err) return false
  window.$message?.success(`${record ? '编辑' : '新增'}成功`)
  emit('success')
  return true
}
</script>

<style scoped></style>
