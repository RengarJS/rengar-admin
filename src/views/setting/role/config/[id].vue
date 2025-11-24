<template>
  <div class="max-w-[600px]">
    <NSpin :show="menuLoading">
      <NCard title="菜单管理" size="small">
        <template #header-extra>
          <NButton type="primary" :loading="saveLoading" @click="handleSave">保存</NButton>
        </template>

        <div class="my-4">
          <NInput v-model:value="pattern" placeholder="搜索菜单" />
        </div>

        <NTree
          v-model:checked-keys="checkedKeys"
          :data="menuTree"
          ref="treeRef"
          :pattern
          label-field="name"
          key-field="code"
          
          
           checkable cascade block-line 
          :show-irrelevant-nodes="true"
        ></NTree>
      </NCard>
    </NSpin>
  </div>
</template>

<script setup lang="tsx">
import { menuButtonTreeApi } from '@/api/setting/menu'
import { roleConfigApi, roleConfigDetailApi } from '@/api/setting/role'

import { to } from 'await-to-js'

import type { TreeInst } from 'naive-ui'

const route = useRoute()
const id = Number(route.params.id)
const checkedKeys = ref<string[]>([])
const menuTree = ref<Api.Setting.MenuTree[]>([])
const menuLoading = ref(false)

async function getMenuTree() {
  menuLoading.value = true
  const [err, tree] = await to(menuButtonTreeApi())
  const [detailErr, detail] = await to(roleConfigDetailApi(id))
  menuLoading.value = false

  if (err || detailErr) return
  menuTree.value = tree
  checkedKeys.value = detail.codes
}
getMenuTree()

const pattern = ref('')

const saveLoading = ref(false)

const treeRef = useTemplateRef<TreeInst>('treeRef')
async function handleSave() {
  saveLoading.value = true
  const { keys: codes } = treeRef.value!.getCheckedData()
  const { keys: halfCodes } = treeRef.value!.getIndeterminateData()

  const [err] = await to(
    roleConfigApi({
      id,
      codes: codes.filter((item) => !halfCodes.includes(item)) as string[],
      halfCodes: halfCodes as string[],
    }),
  )
  saveLoading.value = false
  if (err) return
  window.$message.success('保存成功')
}
</script>

<style scoped></style>
