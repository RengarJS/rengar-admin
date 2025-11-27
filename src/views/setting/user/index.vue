<template>
  <NCard>
    <NButton v-role="'btn0016'" type="primary" @click="handleAdd"> 新增用户</NButton>
    <NDataTable class="mt-4" :columns :data="tableData" :loading remote :pagination :scroll-x="620"></NDataTable>
    <AddOrEditModal v-model:show="showModal" :record @success="getPageList" />
    <PasswordModal v-model:show="showPasswordModal" :record />
  </NCard>
</template>

<script setup lang="tsx">
import { NButton, NSpace, NTag, type DataTableColumns } from 'naive-ui'
import { userPageListApi, userDeleteApi } from '@/api/setting/user'
import { to } from 'await-to-js'
import AddOrEditModal from './components/AddOrEditModal.vue'
import PasswordModal from './components/PasswordModal.vue'

const loading = ref(false)
const tableData = ref<Api.Setting.User[]>([])
const columns: DataTableColumns<Api.Setting.User> = [
  {
    title: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '账户名',
    key: 'username',
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
          <NButton v-role={'btn0017'} type="primary" onClick={() => handleEdit(row)}>
            编辑
          </NButton>
          <NButton v-role={'btn0019'} type="primary" onClick={() => handlePassword(row)}>
            修改密码
          </NButton>
          <NButton v-role={'btn0018'} type="error" onClick={() => handleDelete(row)}>
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
    userPageListApi({
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
const record = ref<Api.Setting.User>()

function handleAdd() {
  record.value = undefined
  showModal.value = true
}

function handleEdit(row: Api.Setting.User) {
  record.value = row
  showModal.value = true
}

function handleDelete(data: Api.Setting.User) {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: `确定要删除“${data.username}”吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(userDeleteApi(data.id))
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('删除成功')
      getPageList()
      return true
    },
  })
}

const showPasswordModal = ref(false)
function handlePassword(data: Api.Setting.User) {
  record.value = data
  showPasswordModal.value = true
}
</script>

<style scoped></style>
