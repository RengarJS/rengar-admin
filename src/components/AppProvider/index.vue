<template>
  <NConfigProvider
    :theme-overrides="appStore.themeOverrides"
    :theme="appStore.theme === 'light' ? lightTheme : darkTheme"
    :locale="zhCN"
  >
    <NMessageProvider>
      <NNotificationProvider>
        <NDialogProvider>
          <NLoadingBarProvider>
            <GlobalNaiveTool> </GlobalNaiveTool>
            <AppWaterMark />
            <App></App>
            <NGlobalStyle></NGlobalStyle>
          </NLoadingBarProvider>
        </NDialogProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme, zhCN } from 'naive-ui'
import { useAppStore } from '@/stores'
import { createTextVNode } from 'vue'
import App from '@/App.vue'
import AppWaterMark from '@/layouts/components/AppWaterMark.vue'

defineOptions({
  name: 'AppProvider',
})

const appStore = useAppStore()

const GlobalNaiveTool = defineComponent({
  name: 'GlobalNaiveTool',
  setup() {
    window.$loadingBar = useLoadingBar()
    window.$dialog = useDialog()
    window.$message = useMessage()
    window.$notification = useNotification()
    return () => createTextVNode()
  },
})
</script>

<style scoped></style>
