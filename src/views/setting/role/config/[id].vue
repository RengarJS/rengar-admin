<template>
  <div class="max-w-[600px]">
    <NSpin :show="menuLoading">
      <NCard title="菜单管理" size="small">
        <template #header-extra>
          <NButton v-role="'btn0014'" type="primary" :loading="saveLoading" @click="handleSave"> 保存 </NButton>
        </template>

        <div class="my-4">
          <NInput v-model:value="pattern" placeholder="搜索菜单" />
        </div>

        <NTree
          v-model:checked-keys="checkedKeys"
          :data="menuTree"
          ref="treeRef"
          :pattern="pattern"
          label-field="name"
          key-field="id"
          checkable
          cascade
          block-line
          :show-irrelevant-nodes="true"
        />
      </NCard>
    </NSpin>
  </div>
</template>

<script setup lang="tsx">
import { menuButtonEnabledTreeApi } from '@/api/setting/menu'
import { roleConfigApi, roleConfigDetailApi } from '@/api/setting/role'
import { to } from 'await-to-js'
import { ref } from 'vue'
import type { TreeInst } from 'naive-ui'

// ====== Props & Refs ======
const route = useRoute<'setting-role-config'>()
const id = Number(route.params.id)
const checkedKeys = ref<number[]>([])
const menuTree = ref<Api.Setting.MenuTree[]>([])
const menuLoading = ref(false)
const saveLoading = ref(false)
const pattern = ref('')
const treeRef = ref<TreeInst | null>(null)

// ====== 工具函数：从原始 ID 列表中提取「叶子节点 ID」======
function extractLeafIds(nodes: Api.Setting.MenuTree[], rawIdSet: Set<number>): number[] {
  const leafIds: number[] = []

  function traverse(node: Api.Setting.MenuTree) {
    // 判断是否为叶子节点：没有 children 或 children 为空
    const isLeaf = !node.children || node.children.length === 0

    if (isLeaf) {
      if (rawIdSet.has(node.id)) {
        leafIds.push(node.id)
      }
    } else {
      // 非叶子节点：即使它在 rawIdSet 中，也不作为“权限节点”保留（仅用于 UI 分组）
      node.children!.forEach(traverse)
    }
  }

  nodes.forEach(traverse)
  return leafIds
}

// ====== 加载菜单树 + 角色已分配菜单 ======
async function getMenuTree() {
  menuLoading.value = true
  const [err, tree] = await to(menuButtonEnabledTreeApi())
  const [detailErr, menuIds] = await to(roleConfigDetailApi(id))
  menuLoading.value = false

  if (err || detailErr) return

  menuTree.value = tree

  // ✅ 关键：只保留叶子节点用于初始化 checkedKeys
  // 这样 NTree 才能正确计算父节点的半选/全选状态
  checkedKeys.value = extractLeafIds(tree, new Set(menuIds))
}

getMenuTree()

// ====== 保存逻辑：直接提交当前 checkedKeys（含父子）======
async function handleSave() {
  saveLoading.value = true
  const halfIds = treeRef.value!.getIndeterminateData().keys as number[]
  const [err] = await to(
    roleConfigApi({
      id,
      menuIds: [...new Set([...unref(checkedKeys), ...halfIds])],
    }),
  )

  saveLoading.value = false
  if (err) return
  window.$message.success('保存成功')
}
</script>

<style scoped></style>
