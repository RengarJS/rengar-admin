<template>
  <div class="max-w-[600px]">
    <NSpin :show="menuLoading">
      <NCard title="菜单管理" size="small">
        <template #header-extra>
          <NButton v-role="'btn0014'" type="primary" :loading="saveLoading" @click="handleSave">保存</NButton>
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
          key-field="id"
          
          
           block-line checkable cascade 
          :show-irrelevant-nodes="true"
        ></NTree>
      </NCard>
    </NSpin>
  </div>
</template>

<script setup lang="tsx">
import { menuButtonEnabledTreeApi } from '@/api/setting/menu'
import { roleConfigApi, roleConfigDetailApi } from '@/api/setting/role'

import { to } from 'await-to-js'

import type { TreeInst } from 'naive-ui'

const route = useRoute()
const id = Number(route.params.id)
const checkedKeys = ref<number[]>([])
const menuTree = ref<Api.Setting.MenuTree[]>([])
const menuLoading = ref(false)

async function getMenuTree() {
  menuLoading.value = true
  const [err, tree] = await to(menuButtonEnabledTreeApi())
  const [detailErr, menuList] = await to(roleConfigDetailApi(id))
  menuLoading.value = false

  if (err || detailErr) return
  menuTree.value = tree

  checkedKeys.value = menuList.filter((item) => !item.isHalf).map((item) => item.id)
}
getMenuTree()

const pattern = ref('')

const saveLoading = ref(false)

const treeRef = useTemplateRef<TreeInst>('treeRef')
async function handleSave() {
  saveLoading.value = true
  const { keys: menuIds } = treeRef.value!.getCheckedData() as { keys: number[] }
  const { keys: halfMenuIds } = treeRef.value!.getIndeterminateData() as { keys: number[] }

  const [err] = await to(
    roleConfigApi({
      id,
      menuList: [
        ...menuIds.map((item) => ({ id: item, isHalf: false })),
        ...halfMenuIds.map((item) => ({ id: item, isHalf: true })),
      ],
    }),
  )
  saveLoading.value = false
  if (err) return
  window.$message.success('保存成功')
}
</script>

<style scoped></style>
