<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="type === 1 ? '添加顶级菜单' : '添加子菜单'"
    positive-text="确定"
    negative-text="取消"
    :loading
    @after-leave="handleClose"
    @positive-click="handleSubmit"
  >
    <NForm ref="formRef" :model="formData" :rules class="my-8" size="small" label-placement="left" label-width="auto">
      <NFormItem v-if="type === 2" label="上级菜单">
        <NInput :value="parent?.name" disabled />
      </NFormItem>

      <NFormItem label="菜单名称" path="name">
        <NInput v-model:value="formData.name" placeholder="菜单名称" />
      </NFormItem>

      <NFormItem label="排序" path="sort">
        <NInputNumber v-model:value="formData.sort" :min="1" :precision="0" placeholder="序号" />
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
import { menuAddApi } from '@/api/setting/menu'
import { type FormRules, type FormInst } from 'naive-ui'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { parent, type } = defineProps<{
  type: 1 | 2
  parent?: Api.Setting.Menu
}>()

const emit = defineEmits<{
  success: []
}>()

const formData = ref<Recordable>({
  type: 1,
})

const formRef = useTemplateRef<FormInst>('formRef')
const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: ['blur', 'input'] }],
  sort: [{ required: true, message: '请输入排序', type: 'number', trigger: ['blur', 'input'] }],
  status: [{ required: true, message: '请选择状态', type: 'number', trigger: ['blur', 'change'] }],
}

const loading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(
    menuAddApi({
      ...unref(formData as unknown as Api.Setting.Menu),
      parentId: type === 1 ? 0 : parent!.id,
    }),
  )
  loading.value = false
  if (err) return false
  window.$message?.success('新增成功')
  emit('success')
  return true
}

function handleClose() {
  for (const key in formData.value) {
    formData.value[key] = null
  }
  formData.value.type = 1
}
</script>

<style scoped></style>
