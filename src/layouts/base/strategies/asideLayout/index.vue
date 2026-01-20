<template>
  <NLayout embedded has-sider class="h-screen">
    <NLayoutSider
      v-if="isPc"
      :inverted="userConfig.invertedAside"
      :width="userConfig.asideWidth"
      bordered
      :style="{
        zIndex: 2,
      }"
      :collapsed="systemConfig.asideCollapse"
      :collapsed-width="systemConfig.asideCollapseWidth"
    >
      <NLayout has-sider inverted position="absolute">
        <NLayoutHeader
          :inverted="userConfig.invertedAside"
          :style="{
            height: numberToPx(userConfig.headerHeight),
          }"
        >
          <SysLogo :show-title="!systemConfig.asideCollapse" />
        </NLayoutHeader>
        <NLayoutSider
          bordered
          :inverted="userConfig.invertedAside"
          width="100%"
          :native-scrollbar="false"
          position="absolute"
          :style="{
            top: numberToPx(userConfig.headerHeight),
            bottom: 0,
          }"
        >
          <SysMenu
            :inverted="userConfig.invertedAside"
            v-model:active="menuStore.activeMenu"
            :data="menuStore.menuRoutes"
            :collapsed="systemConfig.asideCollapse"
          />
        </NLayoutSider>
      </NLayout>
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader
        :inverted="userConfig.invertedHeader"
        bordered
        :style="{
          height: numberToPx(userConfig.headerHeight),
        }"
      >
        <AppHeader :show-logo="!isPc" :show-aside-control="showAsideControl">
          <AppBreadcrumb v-if="showAppBreadcrumb" />
        </AppHeader>
      </NLayoutHeader>
      <NLayoutHeader
        v-if="userConfig.showTabs"
        bordered
        :style="{
          height: numberToPx(userConfig.tabHeight),
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
        <AppRouterView v-if="showRouterView" />
      </NLayoutContent>
      <NLayoutFooter
        v-if="userConfig.showFooter"
        bordered
        position="absolute"
        :style="{
          height: numberToPx(userConfig.footerHeight),
        }"
      >
        <AppFooter />
      </NLayoutFooter>
    </NLayout>

    <AppConfigDrawer v-model:show="showConfigDrawer" />
    <AppMobieDrawer v-model:show="showMenuDrawer" />
    <AppSearchModal v-model:show="showSearchModal" />
  </NLayout>
</template>

<script setup lang="ts">
import { useAppStore, useMenuStore } from '@/stores'
import { numberToPx } from '@/utils/tools'
import AppFooter from '@/layouts/components/AppFooter.vue'
import AppTabs from '@/layouts/components/AppTabs.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'
import AppRouterView from '@/layouts/components/AppRouterView.vue'
import AppConfigDrawer from '@/layouts/components/AppConfigDrawer.vue'
import AppMobieDrawer from '@/layouts/components/AppMobieDrawer.vue'
import AppBreadcrumb from '@/layouts/components/AppBreadcrumb.vue'
import SysLogo from '@/layouts/components/common/SysLogo.vue'
import SysMenu from '@/layouts/components/common/SysMenu.vue'
import AppSearchModal from '@/layouts/components/AppSearchModal.vue'

const menuStore = useMenuStore()

const appStore = useAppStore()
const { userConfig, systemConfig, showConfigDrawer, isMobile, showMenuDrawer, showRouterView, isPc, showSearchModal } =
  storeToRefs(appStore)

const layoutContentStyle = computed(() => {
  const style = {
    top: `calc(${numberToPx(userConfig.value.headerHeight)} + ${userConfig.value.showTabs ? numberToPx(userConfig.value.tabHeight) : '0px'})`,
    bottom: userConfig.value.showFooter ? numberToPx(userConfig.value.footerHeight) : '0px',
    padding: numberToPx(userConfig.value.gap),
  }
  return style
})

const showAppBreadcrumb = computed(() => {
  if (!userConfig.value.showBreadcrumb) return false
  if (isMobile.value) return false
  return true
})

const showAsideControl = computed(() => {
  if (!isPc.value) return false
  return true
})
</script>

<style scoped></style>
