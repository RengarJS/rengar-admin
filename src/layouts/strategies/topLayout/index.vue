<template>
  <NLayout embedded has-sider style="height: 100vh">
    <NLayout>
      <NLayoutHeader
        bordered
        :style="{
          height: numberToPx(layoutConfig.headerHeight),
        }"
      >
        <AppHeader :show-logo="true" :show-aside-control="showAsideControl">
          <SysMenu v-if="isPc" mode="horizontal" :data="menuStore.menuRoutes" v-model:active="menuStore.activeMenu">
          </SysMenu>
        </AppHeader>
      </NLayoutHeader>
      <NLayoutHeader
        v-if="layoutConfig.showTabs"
        bordered
        :style="{
          height: numberToPx(layoutConfig.tabHeight),
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
        v-if="layoutConfig.showFooter"
        bordered
        position="absolute"
        :style="{
          height: numberToPx(layoutConfig.footerHeight),
        }"
      >
        <AppFooter />
      </NLayoutFooter>
    </NLayout>

    <AppConfigDrawer v-model:show="showConfigDrawer" />
    <AppMobileDrawer v-model:show="showMenuDrawer" />
  </NLayout>
</template>

<script setup lang="ts">
import { useAppStore, useMenuStore } from '@/stores'
import { numberToPx } from '@/utils/tools'
import AppFooter from '@/layouts/components/AppFooter.vue'
import AppTabs from '@/layouts/components/AppTabs.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'
import AppMain from '@/layouts/components/AppMain.vue'
import AppConfigDrawer from '@/layouts/components/AppConfigDrawer.vue'
import AppMobileDrawer from '@/layouts/components/AppMobieDrawer.vue'
import SysMenu from '@/layouts/components/common/SysMenu.vue'

const appStore = useAppStore()

const { config: layoutConfig, showConfigDrawer, showMenuDrawer, showRouterView, isPc } = storeToRefs(appStore)

const layoutContentStyle = computed(() => {
  const style = {
    top: `calc(${numberToPx(layoutConfig.value.headerHeight)} + ${layoutConfig.value.showTabs ? numberToPx(layoutConfig.value.tabHeight) : '0px'})`,
    bottom: layoutConfig.value.showFooter ? numberToPx(layoutConfig.value.footerHeight) : '0px',
    padding: numberToPx(layoutConfig.value.gap),
  }
  return style
})

const menuStore = useMenuStore()

const showAsideControl = computed(() => {
  if (!isPc.value) return false
  return true
})
</script>

<style scoped></style>
