<template>
  <NLayout embedded has-sider style="height: 100vh">
    <NLayoutSider
      v-if="isPc"
      bordered
      :style="{
        width: numberToPx(config.asideWidth),
      }"
      :collapsed="config.asideCollapse"
      :collapsed-width="config.asideCollapseWidth"
    >
      <AsideMenu />
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader
        bordered
        :style="{
          height: numberToPx(config.headerHeight),
        }"
      >
        <AppHeader :show-logo="!isPc" :show-aside-control="showAsideControl">
          <AppBreadcrumb v-if="showAppBreadcrumb" />
        </AppHeader>
      </NLayoutHeader>
      <NLayoutHeader
        v-if="config.showTabs"
        bordered
        :style="{
          height: numberToPx(config.tabHeight),
        }"
      >
        <AppTabs />
      </NLayoutHeader>

      <NLayoutContent
        embedded
        :native-scrollbar="false"
        :content-style="{
          height: '100%',
        }"
        position="absolute"
        :style="layoutContentStyle"
        :ref="(el) => el && appStore.setLayoutContentRef(el as HTMLElement)"
      >
        <AppMain v-if="showRouterView" />
      </NLayoutContent>
      <NLayoutFooter
        v-if="config.showFooter"
        bordered
        position="absolute"
        :style="{
          height: numberToPx(config.footerHeight),
        }"
      >
        <AppFooter />
      </NLayoutFooter>
    </NLayout>

    <AppConfigDrawer v-model:show="showConfigDrawer" />
    <AppMobieDrawer v-model:show="showMenuDrawer" />
  </NLayout>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import { numberToPx } from '@/utils/tools'
import AppFooter from '@/layouts/components/AppFooter.vue'
import AppTabs from '@/layouts/components/AppTabs.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'
import AppMain from '@/layouts/components/AppMain.vue'
import AsideMenu from './AsideMenu.vue'
import AppConfigDrawer from '@/layouts/components/AppConfigDrawer.vue'
import AppMobieDrawer from '@/layouts/components/AppMobieDrawer.vue'
import AppBreadcrumb from '@/layouts/components/AppBreadcrumb.vue'

const appStore = useAppStore()
const { config, showConfigDrawer, isMobile, showMenuDrawer, showRouterView, isPc } = storeToRefs(appStore)

const layoutContentStyle = computed(() => {
  const style = {
    top: `calc(${numberToPx(config.value.headerHeight)} + ${config.value.showTabs ? numberToPx(config.value.tabHeight) : '0px'})`,
    bottom: config.value.showFooter ? numberToPx(config.value.footerHeight) : '0px',
    padding: numberToPx(config.value.gap),
  }
  return style
})

const showAppBreadcrumb = computed(() => {
  if (!config.value.showBreadcrumb) return false
  if (isMobile.value) return false
  return true
})

const showAsideControl = computed(() => {
  if (!isPc.value) return false
  return true
})
</script>

<style scoped></style>
