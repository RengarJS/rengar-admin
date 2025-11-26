<template>
  <div>
    <NGrid cols="1 800:2 1200:3" :x-gap="16" :y-gap="16">
      <NGridItem>
        <NSpin :show="menuLoading">
          <NCard title="菜单管理" size="small">
            <template #header-extra>
              <NButton type="primary" size="small" @click="handleAddMenu(1)">添加顶级菜单</NButton>
            </template>

            <div class="my-4">
              <NInput v-model:value="pattern" placeholder="搜索菜单" />
            </div>

            <NTree
              v-model:selected-keys="selectedKeys"
              :data="menuTree"
              :pattern
              block-line
              label-field="name"
              key-field="id"
              :render-suffix="renderSuffix"
              :show-irrelevant-nodes="true"
              :node-props="nodeProps"
            ></NTree>
          </NCard>
        </NSpin>
      </NGridItem>

      <NGridItem>
        <NCard size="small" :title="currentMenu?.name">
          <NAlert title="温馨提示" type="info">点击菜单开始</NAlert>
          <template v-if="currentMenu" #header-extra>
            <NSpace>
              <NButton type="primary" ghost size="small" @click="handleAddMenu(2)">添加子菜单</NButton>
              <NButton type="error" ghost size="small" @click="handleRemoveMenu">删除</NButton>
            </NSpace>
          </template>

          <NForm
            v-if="currentMenu"
            ref="formRef"
            :model="formData"
            :rules
            class="my-4"
            size="small"
            label-placement="left"
            label-width="auto"
          >
            <NFormItem label="菜单名称" path="name">
              <NInput v-model:value="formData.name" placeholder="菜单名称" />
            </NFormItem>
            <NFormItem label="菜单code" path="code">
              <div class="w-full flex items-center gap-4">
                <NInput v-model:value="formData.code" disabled placeholder="菜单code" class="flex-1" />
                <SvgIcon
                  icon="i-tabler:copy"
                  class="cursor-pointer text-base text-primary"
                  @click="handleCopy(formData.code)"
                ></SvgIcon>
              </div>
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

            <NFormItem>
              <div class="w-full flex-center">
                <NButton :loading="menuEditLoading" type="primary" attr-type="submit" size="small" @click="handleSubmit"
                  >保存</NButton
                >
              </div>
            </NFormItem>
          </NForm>
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard size="small" title="按钮管理">
          <NAlert v-if="!currentMenu" title="温馨提示" type="info">点击菜单开始</NAlert>
          <template v-if="currentMenu" #header-extra>
            <NSpace>
              <NButton type="primary" ghost size="small" @click="handleButtonAdd">添加按钮</NButton>
            </NSpace>
          </template>

          <NDataTable
            v-if="currentMenu"
            size="small"
            class="mt-4"
            :columns
            :data="buttonList"
            :loading="buttonLoading"
          ></NDataTable>
        </NCard>
      </NGridItem>
    </NGrid>

    <MenuAddModal v-model:show="showMemuModal" :type="addType" :parent="currentMenu" @success="getMenuTree" />
    <ButtonAddModal
      v-model:show="showButtonModal"
      :parent="currentMenu"
      :current-button="currentButton"
      @success="getButtonList"
    />
  </div>
</template>

<script setup lang="tsx">
import { menuTreeApi, menuEditApi, menuDeleteApi, buttonListApi } from '@/api/setting/menu'
import { type TreeOption, type FormRules, type FormInst, type DataTableColumns } from 'naive-ui'
import { withModifiers } from 'vue'
import { useClipboard } from '@vueuse/core'
import { to } from 'await-to-js'
import { cloneDeep } from 'es-toolkit'
import MenuAddModal from './components/MenuAddModal.vue'
import ButtonAddModal from './components/ButtonAddModal.vue'

const menuTree = ref<Api.Setting.MenuTree[]>([])
const menuLoading = ref(false)
const selectedKeys = ref<number[]>([])

const formData = ref<Api.Setting.Menu | Recordable>({})
const currentMenu = ref<Api.Setting.Menu>()

async function getMenuTree() {
  menuLoading.value = true
  const [err, data] = await to(menuTreeApi())
  menuLoading.value = false
  if (err) return
  menuTree.value = data
}
getMenuTree()

function renderSuffix(info: { option: TreeOption; checked: boolean; selected: boolean }) {
  return (
    <n-space align="center">
      <n-text class="text-sm" type="primary">
        {info.option.code}
      </n-text>
      <div
        class="i-tabler:copy text-base text-primary"
        onClick={withModifiers(() => {
          handleCopy(info.option.code as string)
        }, ['stop'])}
      ></div>
    </n-space>
  )
}

const { copy } = useClipboard()
async function handleCopy(text: string) {
  const [err] = await to(copy(text))
  if (err) {
    window.$message?.error('复制失败')
  } else {
    window.$message?.success('复制成功')
  }
}

const pattern = ref('')

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      if (option.id === currentMenu.value?.id) {
        currentMenu.value = undefined
        return
      }
      currentMenu.value = option as unknown as Api.Setting.Menu
      formData.value = cloneDeep(option)
    },
  }
}

function resetTreeSelect() {
  currentMenu.value = undefined
  selectedKeys.value = []
}

const showMemuModal = ref(false)
const addType = ref<1 | 2>(1)
function handleAddMenu(type: 1 | 2) {
  addType.value = type
  showMemuModal.value = true
}

const formRef = useTemplateRef<FormInst>('formRef')
const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: ['blur', 'input'] }],
  sort: [{ required: true, message: '请输入排序', type: 'number', trigger: ['blur', 'input'] }],
  status: [{ required: true, message: '请选择状态', type: 'number', trigger: ['blur', 'change'] }],
}

const menuEditLoading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return
  menuEditLoading.value = true
  const [err] = await to(menuEditApi(formData.value as Api.Setting.Menu))
  menuEditLoading.value = false
  if (err) return
  window.$message?.success('保存成功')
  getMenuTree()
}

function handleRemoveMenu() {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: `确定要删除“${currentMenu.value?.name}”吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(menuDeleteApi(currentMenu.value!.id))
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('删除成功')
      getMenuTree()
      resetTreeSelect()
      return true
    },
  })
}

const showButtonModal = ref(false)
const currentButton = ref<Api.Setting.Menu>()
const buttonList = ref<Api.Setting.Menu[]>([])

const columns: DataTableColumns<Api.Setting.Menu> = [
  {
    title: '按钮名称',
    key: 'name',
  },
  {
    title: '按钮code',
    key: 'code',
    render(row) {
      return (
        <n-space align="center">
          <n-text class="text-sm" type="info">
            {row.code}
          </n-text>
          <div
            class="i-tabler:copy cursor-pointer text-base text-primary"
            onClick={withModifiers(() => {
              handleCopy(row.code)
            }, ['stop'])}
          ></div>
        </n-space>
      )
    },
  },
  {
    title: '排序',
    key: 'sort',
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return <n-tag type={row.status === 1 ? 'success' : 'error'}>{row.status === 1 ? '启用' : '禁用'}</n-tag>
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    render(row) {
      return (
        <n-space>
          <n-button type="info" size="small" text onClick={() => handleButtonEdit(row)}>
            编辑
          </n-button>
          <n-button type="error" size="small" text onClick={() => handleButtonDelete(row)}>
            删除
          </n-button>
        </n-space>
      )
    },
  },
]

const buttonLoading = ref(false)
async function getButtonList() {
  buttonLoading.value = true
  const [err, data] = await to(buttonListApi(currentMenu.value!.id))
  buttonLoading.value = false
  if (err) {
    buttonList.value = []
    return
  }
  buttonList.value = data
}
function handleButtonAdd() {
  currentButton.value = undefined
  showButtonModal.value = true
}

watch(currentMenu, (val) => {
  if (!val) return
  getButtonList()
})

function handleButtonEdit(data: Api.Setting.Menu) {
  currentButton.value = data
  showButtonModal.value = true
}

function handleButtonDelete(data: Api.Setting.Menu) {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: `确定要删除“${data.name}”吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(menuDeleteApi(data.id))
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('删除成功')
      getButtonList()
      return true
    },
  })
}
</script>

<style scoped></style>
