<template>
  <div class="h-screen flex-center flex-y gap-8">
    <img :src="Icon" alt="" class="w-[280px]" />
    <span class="text-2xl text-gray">页面找不到了</span>
    <NSpace :size="40">
      <NButton type="primary" ghost @click="handleBack">返回上一页</NButton>
      <NButton type="primary" @click="handleHome">返回首页</NButton>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/assets/svg-icons/404.svg'

const router = useRouter()

function handleBack() {
  router.back()
}

function handleHome() {
  router.replace('/')
}
</script>

<style scoped></style>
