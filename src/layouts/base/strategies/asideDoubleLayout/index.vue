<template>
  <NLayout embedded has-sider class="h-screen">
    <NLayoutSider
      v-if="isPc"
      :inverted="userConfig.invertedAside"
      :width="systemConfig.doubleFirstAideWidth"
      bordered
      :style="{
        zIndex: 2,
      }"
      collapse-mode="width"
      :collapsed="systemConfig.asideCollapse"
      :collapsed-width="systemConfig.asideCollapseWidth"
      content-style="min-width: 0"
    >
      <div class="h-full w-full flex flex-col">
        <div
          :style="{
            height: numberToPx(userConfig.headerHeight),
          }"
        >
          <SysLogo :show-title="false" />
        </div>

        <div class="hidden-scrollbar min-h-0 flex-1 overflow-y-auto">
          <SysMenu
            :inverted="userConfig.invertedAside"
            v-model:active="menuStore.topActiveName"
            :data="menuStore.menuRoutes"
            @change="handleFirstLevenChange"
          />
        </div>
      </div>
    </NLayoutSider>

    <NLayoutSider
      v-if="isPc && userConfig.fixedSubMenu && showSecondAside"
      :inverted="userConfig.invertedAside"
      :width="userConfig.asideWidth"
      bordered
      :style="{
        zIndex: 2,
      }"
      collapse-mode="width"
      :collapsed="systemConfig.asideCollapse"
      :collapsed-width="systemConfig.asideCollapseWidth"
      content-style="min-width: 0"
    >
      <div class="h-full w-full flex flex-col">
        <div
          :style="{
            height: numberToPx(userConfig.headerHeight),
          }"
        >
          <div class="h-full flex items-center justify-between px-4">
            <SysLogo v-if="!systemConfig.asideCollapse" :show-logo="false" />
            <div class="px-2">
              <NTooltip placement="bottom">
                <template #trigger>
                  <div class="flex-center p-1">
                    <SvgIcon
                      icon="pixel:thumbtack-solid"
                      class="cursor-pointer text-xl text-primary"
                      @click="toggleFixedSubMenu(false)"
                    ></SvgIcon>
                  </div>
                </template>
                <span>取消固定</span>
              </NTooltip>
            </div>
          </div>
        </div>

        <div class="hidden-scrollbar min-h-0 flex-1 overflow-y-auto">
          <SysSubMenu
            :data="menuStore.subMenuRoutes"
            v-model:active="menuStore.activeMenu"
            :collapsed="appStore.systemConfig.asideCollapse"
          />
        </div>
      </div>
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

      <NLayout
        v-if="isPc && showSubMenu && !userConfig.fixedSubMenu && showSecondAside"
        ref="target"
        has-sider
        position="absolute"
        class="shadow-lg"
        :style="{
          left: 0,
          top: 0,
          width: numberToPx(userConfig.asideWidth),
        }"
      >
        <NLayoutHeader
          :inverted="userConfig.invertedAside"
          :style="{
            height: numberToPx(userConfig.headerHeight),
          }"
        >
          <div class="h-full flex items-center justify-between px-4">
            <SysLogo :show-logo="false" />
            <div class="px-2">
              <NTooltip placement="bottom">
                <template #trigger>
                  <div class="flex-center p-1">
                    <SvgIcon
                      icon="pixel:thumbtack"
                      class="cursor-pointer text-xl text-primary"
                      @click="toggleFixedSubMenu(true)"
                    ></SvgIcon>
                  </div>
                </template>
                <span>固定</span>
              </NTooltip>
            </div>
          </div>
        </NLayoutHeader>
        <NLayoutSider
          position="absolute"
          :style="{
            top: numberToPx(userConfig.headerHeight),
            bottom: 0,
          }"
          :inverted="userConfig.invertedAside"
          width="100%"
          :native-scrollbar="false"
        >
          <SysSubMenu
            :data="menuStore.subMenuRoutes"
            v-model:active="menuStore.activeMenu"
            @change="handleSubmenuChange"
          />
        </NLayoutSider>
      </NLayout>
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
import SysMenu from './components/SysMenu.vue'
import AppSearchModal from '@/layouts/components/AppSearchModal.vue'
import SysSubMenu from './components/SysSubMenu.vue'

import { onClickOutside } from '@vueuse/core'

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

const showSubMenu = ref(false)
const target = useTemplateRef<HTMLElement>('target')

onClickOutside(target, () => {
  showSubMenu.value = false
})

const showSecondAside = computed(() => {
  if (!isPc.value) return false
  if (menuStore.subMenuRoutes.length > 0) return true
  return false
})

function handleSubmenuChange() {
  showSubMenu.value = false
}

function toggleFixedSubMenu(fixed: boolean) {
  appStore.userConfig.fixedSubMenu = fixed
}

function handleFirstLevenChange(show: boolean) {
  showSubMenu.value = show
}
</script>

<style scoped></style>
