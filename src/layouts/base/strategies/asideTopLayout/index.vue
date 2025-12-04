<template>
  <!-- 外层布局，包含全宽头部和下方内容区域 -->
  <NLayout style="height: 100vh">
    <NLayoutHeader
      bordered
      :inverted="userConfig.invertedHeader"
      :style="{
        height: numberToPx(userConfig.headerHeight),
      }"
    >
      <AppHeader :show-logo="true" :show-aside-control="showAsideControl">
        <SysMenu
          v-if="isPc"
          :inverted="userConfig.invertedHeader"
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
        top: numberToPx(userConfig.headerHeight),
      }"
    >
      <NLayoutSider
        v-if="showAppAside"
        bordered
        :inverted="userConfig.invertedAside"
        :native-scrollbar="false"
        :width="userConfig.asideWidth"
        position="absolute"
        :style="{
          left: 0,
          bottom: 0,
        }"
        :collapsed="systemConfig.asideCollapse"
        :collapsed-width="systemConfig.asideCollapseWidth"
      >
        <SysMenu
          :inverted="userConfig.invertedAside"
          v-model:active="menuStore.activeMenu"
          :data="menuStore.subMenuRoutes"
          :collapsed="systemConfig.asideCollapse"
        />
      </NLayoutSider>

      <NLayout>
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
          <AppMain v-if="showRouterView" />
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
import SysMenu from '@/layouts/components/common/SysMenu.vue'

const appStore = useAppStore()
const { userConfig, systemConfig, showConfigDrawer, showMenuDrawer, showRouterView, isPc } = storeToRefs(appStore)

const layoutContentStyle = computed(() => {
  const style = {
    top: userConfig.value.showTabs ? numberToPx(userConfig.value.tabHeight) : '0px',
    bottom: userConfig.value.showFooter ? numberToPx(userConfig.value.footerHeight) : '0px',
    padding: numberToPx(userConfig.value.gap),
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
