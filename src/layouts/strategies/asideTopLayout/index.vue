<template>
  <!-- 外层布局，包含全宽头部和下方内容区域 -->
  <NLayout style="height: 100vh">
    <NLayoutHeader
      bordered
      :style="{
        height: numberToPx(layoutConfig.headerHeight),
      }"
    >
      <AppHeader :show-logo="true" :show-aside-control="showAsideControl">
        <SysMenu
          v-if="isPc"
          mode="horizontal"
          :data="menuStore.menuRoutes"
          children-field="list"
          v-model:active="menuStore.topActiveName"
        />
      </AppHeader>
    </NLayoutHeader>

    <NLayout
      has-sider
      position="absolute"
      :style="{
        top: numberToPx(layoutConfig.headerHeight),
      }"
    >
      <NLayoutSider
        v-if="showAppAside"
        bordered
        :style="{
          width: numberToPx(layoutConfig.asideWidth),
        }"
        :collapsed="layoutConfig.asideCollapse"
        :collapsed-width="layoutConfig.asideCollapseWidth"
      >
        <AsideMenu />
      </NLayoutSider>

      <NLayout>
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
    </NLayout>

    <AppConfigDrawer v-model:show="showConfigDrawer" />
    <AppMobieDrawer v-model:show="showMenuDrawer" />
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
import AppMobieDrawer from '@/layouts/components/AppMobieDrawer.vue'
import AsideMenu from './AsideMenu.vue'
import SysMenu from '@/layouts/components/common/SysMenu.vue'

const appStore = useAppStore()
const { config: layoutConfig, showConfigDrawer, showMenuDrawer, showRouterView, isPc } = storeToRefs(appStore)

const layoutContentStyle = computed(() => {
  const style = {
    top: layoutConfig.value.showTabs ? numberToPx(layoutConfig.value.tabHeight) : '0px',
    bottom: layoutConfig.value.showFooter ? numberToPx(layoutConfig.value.footerHeight) : '0px',
    padding: numberToPx(layoutConfig.value.gap),
  }
  return style
})

const menuStore = useMenuStore()

const showAppAside = computed(() => {
  if (!isPc.value) return false
  if (menuStore.subMenuRoutes.length > 0) return true
  return false
})

const showAsideControl = computed(() => {
  if (!isPc.value) return false
  if (menuStore.subMenuRoutes.length === 0) return false
  return true
})
</script>

<style scoped></style>
