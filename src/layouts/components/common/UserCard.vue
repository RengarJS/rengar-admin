<template>
  <NDropdown trigger="hover" :options="options" @select="handleSelect">
    <div
      class="flex cursor-pointer items-center gap-2 rounded-2xl bg-primary-100 px-2 py-1 dark:bg-primary-800 hover:text-primary"
    >
      <SvgIcon icon="line-md:account" class="text-xl"></SvgIcon>
      <span class="max-w-20 truncate text-base">{{ authStore.user?.username }}</span>
    </div>
  </NDropdown>

  <PasswordModal v-model:show="showModal" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { to } from 'await-to-js'
import { useRouterHook } from '@/hooks/router'
import PasswordModal from './PasswordModal.vue'

const authStore = useAuthStore()

const options = [
  {
    label: '修改密码',
    key: 'password',
  },
  {
    label: '退出登录',
    key: 'loginout',
  },
]

function handleSelect(key: string) {
  switch (key) {
    case 'password':
      handleChangePassword()
      break
    case 'loginout':
      handleLoginOut()
      break
  }
}

const showModal = ref(false)
function handleChangePassword() {
  showModal.value = true
}

const { routerReplaceToLogin } = useRouterHook()

const router = useRouter()
function handleLoginOut() {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(authStore.authLoginOutAction())
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('退出登录成功')
      routerReplaceToLogin(router.currentRoute.value.fullPath)
      return true
    },
  })
}
</script>

<style scoped></style>
