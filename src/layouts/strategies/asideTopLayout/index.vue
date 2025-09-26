<template>
  <!-- 外层布局，包含全宽头部和下方内容区域 -->
  <NLayout style="height: 100vh">
    <NLayoutHeader
      bordered
      :style="{
        height: numberToPx(config.headerHeight),
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
        top: numberToPx(config.headerHeight),
      }"
    >
      <NLayoutSider
        v-if="showAppAside"
        bordered
        :style="{
          width: numberToPx(config.asideWidth),
        }"
        :collapsed="config.asideCollapse"
        :collapsed-width="config.asideCollapseWidth"
      >
        <NLayoutContent
          :native-scrollbar="false"
          position="absolute"
          :style="{
            top: 0,
            bottom: 0,
          }"
        >
          <SysMenu
            v-model:active="menuStore.activeMenu"
            :data="menuStore.subMenuRoutes"
            :collapsed="config.asideCollapse"
          />
        </NLayoutContent>
      </NLayoutSider>

      <NLayout>
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
const { config, showConfigDrawer, showMenuDrawer, showRouterView, isPc } = storeToRefs(appStore)

const layoutContentStyle = computed(() => {
  const style = {
    top: config.value.showTabs ? numberToPx(config.value.tabHeight) : '0px',
    bottom: config.value.showFooter ? numberToPx(config.value.footerHeight) : '0px',
    padding: numberToPx(config.value.gap),
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
