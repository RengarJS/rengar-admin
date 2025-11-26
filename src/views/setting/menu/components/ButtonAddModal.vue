<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="parent ? '添加按钮' : '编辑按钮'"
    positive-text="确定"
    negative-text="取消"
    :loading
    @after-leave="handleClose"
    @positive-click="handleSubmit"
  >
    <NForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      class="my-8"
      size="small"
      label-placement="left"
      label-width="auto"
    >
      <NFormItem v-if="parent" label="上级菜单">
        <NInput :value="parent?.name" disabled />
      </NFormItem>

      <NFormItem label="按钮名称" path="name">
        <NInput v-model:value="formData.name" placeholder="按钮名称" />
      </NFormItem>

      <NFormItem label="排序" path="sort">
        <NInputNumber v-model:value="formData.sort" :min="1" :precision="0" placeholder="排序" />
      </NFormItem>

      <NFormItem label="状态" path="status">
        <NRadioGroup v-model:value="formData.status">
          <NRadio :value="1">启用</NRadio>
          <NRadio :value="0">禁用</NRadio>
        </NRadioGroup>
      </NFormItem>

      <NFormItem label="权限">
        <NSelect
          v-model:value="formData.permissionId"
          clearable
          :options="permissionOptions"
          label-field="path"
          value-field="id"
          filterable
        ></NSelect>
      </NFormItem>
    </NForm>
  </NModal>
</template>

<script setup lang="tsx">
import { menuAddApi, menuEditApi, menuDetailApi } from '@/api/setting/menu'
import { permissionEnabledListApi } from '@/api/setting/permission'

import { type FormRules, type FormInst } from 'naive-ui'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { parent, currentButton } = defineProps<{
  parent?: Api.Setting.Menu
  currentButton?: Api.Setting.Menu
}>()

const emit = defineEmits<{
  success: []
}>()

const permissionOptions = ref<Recordable[]>([])
async function getPermissionOptions() {
  const [err, res] = await to(permissionEnabledListApi())
  if (err) return
  permissionOptions.value = res ?? []
}
getPermissionOptions()

const formData = ref<Recordable>({
  type: 2,
})

watch(show, (val) => {
  if (val && currentButton) {
    getDetail()
  }
})

async function getDetail() {
  const [err, res] = await to(menuDetailApi(currentButton!.id))
  if (err) return
  formData.value = res
}

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
    currentButton
      ? menuEditApi(formData.value as Api.Setting.Menu)
      : menuAddApi({
          ...(formData.value as Api.Setting.Menu),
          parentId: parent!.id,
        }),
  )
  loading.value = false
  if (err) return false
  window.$message?.success(`${parent ? '新增' : '编辑'}成功`)
  emit('success')
  return true
}

function handleClose() {
  for (const key in formData.value) {
    formData.value[key] = null
  }
  formData.value.type = 2
}
</script>

<style scoped></style>
