<template>
  <NCard>
    <NButton v-role="'btn0011'" type="primary" @click="handleAdd"> 新增角色 </NButton>
    <NDataTable class="mt-4" :columns :data="tableData" :loading remote :pagination :scroll-x="620"></NDataTable>
    <AddOrEditModal v-model:show="showModal" :record @success="getPageList" />
  </NCard>
</template>

<script setup lang="tsx">
import { NButton, NSpace, NTag, type DataTableColumns } from 'naive-ui'
import { rolePageListApi, roleDeleteApi } from '@/api/setting/role'
import { to } from 'await-to-js'
import AddOrEditModal from './components/AddOrEditModal.vue'
import { useRouterHook } from '@/hooks/router'

const loading = ref(false)
const tableData = ref<Api.Setting.Role[]>([])
const columns: DataTableColumns<Api.Setting.Role> = [
  {
    title: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '角色名称',
    key: 'name',
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render(row) {
      return <NTag type={row.status === 1 ? 'success' : 'error'}>{row.status === 1 ? '启用' : '禁用'}</NTag>
    },
  },
  {
    title: '操作',
    key: 'operation',
    width: 260,
    fixed: 'right',
    render(row) {
      return (
        <NSpace>
          <NButton v-role={'btn0012'} type="primary" onClick={() => handleEdit(row)}>
            编辑
          </NButton>
          <NButton v-role={'btn0014'} type="primary" onClick={() => handleConfigPermmsion(row)}>
            权限配置
          </NButton>
          <NButton v-role={'btn0013'} type="error" onClick={() => handleDelete(row)}>
            删除
          </NButton>
        </NSpace>
      )
    },
  },
]

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange: (page: number) => {
    pagination.page = page
    getPageList()
  },
})

async function getPageList() {
  loading.value = true
  const [err, data] = await to(
    rolePageListApi({
      current: pagination.page,
      size: pagination.pageSize,
    }),
  )
  loading.value = false
  if (err) {
    tableData.value = []
    return
  }
  tableData.value = data.records
  pagination.itemCount = data.total
}

getPageList()

const showModal = ref(false)
const record = ref<Api.Setting.Role>()

function handleAdd() {
  record.value = undefined
  showModal.value = true
}

function handleEdit(row: Api.Setting.Role) {
  record.value = row
  showModal.value = true
}

function handleDelete(data: Api.Setting.Role) {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: `确定要删除“${data.name}”吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(roleDeleteApi(data.id))
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('删除成功')
      getPageList()
      return true
    },
  })
}

const { routerPushByName } = useRouterHook()
function handleConfigPermmsion(row: Api.Setting.Role) {
  routerPushByName('setting-role-config', {
    params: {
      id: row.id,
    },
  })
}
</script>

<style scoped></style>
