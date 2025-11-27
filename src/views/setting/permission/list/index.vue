<template>
  <NCard>
    <NDataTable class="mt-4" :columns :data="tableData" :loading remote :pagination :scroll-x="620"></NDataTable>
  </NCard>
</template>

<script setup lang="tsx">
import { NTag, type DataTableColumns } from 'naive-ui'
import { permissionPageListApi } from '@/api/setting/permission'
import { to } from 'await-to-js'

const loading = ref(false)
const tableData = ref<Api.Setting.Permission[]>([])
const columns: DataTableColumns<Api.Setting.Permission> = [
  {
    title: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '权限名',
    key: 'name',
  },
  {
    title: '路由',
    key: 'path',
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render(row) {
      return <NTag type={row.status === 1 ? 'success' : 'error'}>{row.status === 1 ? '启用' : '禁用'}</NTag>
    },
  },
  // {
  //   title: '操作',
  //   key: 'operation',
  //   width: 260,
  //   fixed: 'right',
  //   render(row) {
  //     return (
  //       <NSpace>
  //         <NButton type="primary" onClick={() => handleEdit(row)}>
  //           编辑
  //         </NButton>
  //         <NButton type="primary" onClick={() => handlePassword(row)}>
  //           修改密码
  //         </NButton>
  //         <NButton type="error" onClick={() => handleDelete(row)}>
  //           删除
  //         </NButton>
  //       </NSpace>
  //     )
  //   },
  // },
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
    permissionPageListApi({
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
</script>

<style scoped></style>
