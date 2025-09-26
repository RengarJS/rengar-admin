<template>
  <NDrawer v-model:show="show" :width="400" :native-scrollbar="true" :auto-focus="false">
    <NDrawerContent title="系统配置" :native-scrollbar="false" closable>
      <div>
        <NDivider>布局模式</NDivider>

        <NGrid :cols="3" :x-gap="16">
          <NGridItem>
            <div
              class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
              :class="[appStore.layoutMode === 'aside' ? ' border border-primary' : '']"
              @click="handleChangeLayout('aside')"
            >
              <div class="h-[80px] w-full flex gap-2">
                <div class="w-5 rounded bg-primary"></div>
                <div class="flex flex-1 flex-col gap-2">
                  <div class="h-5 rounded bg-primary-300"></div>
                  <div class="flex-1 rounded bg-primary-300"></div>
                </div>
              </div>
              <div>经典布局</div>
            </div>
          </NGridItem>
          <NGridItem>
            <div
              class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
              :class="[appStore.layoutMode === 'top' ? ' border border-primary' : '']"
              @click="handleChangeLayout('top')"
            >
              <div class="h-[80px] w-full flex flex-col gap-2">
                <div class="h-5 rounded bg-primary"></div>
                <div class="flex-1 rounded bg-primary-300"></div>
              </div>
              <div>顶部菜单布局</div>
            </div>
          </NGridItem>

          <NGridItem>
            <div
              class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
              :class="[appStore.layoutMode === 'top-aside' ? ' border border-primary' : '']"
              @click="handleChangeLayout('top-aside')"
            >
              <div class="h-[80px] w-full flex gap-2">
                <div class="w-5 rounded bg-primary"></div>
                <div class="flex flex-1 flex-col gap-2">
                  <div class="h-5 rounded bg-primary"></div>
                  <div class="flex-1 rounded bg-primary-300"></div>
                </div>
              </div>
              <div>一级菜单顶部</div>
            </div>
          </NGridItem>
        </NGrid>
      </div>

      <div>
        <NDivider>主题色</NDivider>
        <NColorPicker
          v-model:value="appStore.themeOverrides.common!.primaryColor"
          :show-alpha="false"
          @update:value="handleChangePrimaryColor"
        />
      </div>

      <div>
        <NDivider>网站配置</NDivider>
        <NSpace vertical :size="20">
          <div class="flex items-center justify-between">
            <div>头部高度</div>
            <NInputNumber v-model:value="appStore.config.headerHeight" :precision="0" />
          </div>
          <div class="flex items-center justify-between">
            <div>标签栏高度</div>
            <NInputNumber v-model:value="appStore.config.tabHeight" :precision="0" />
          </div>
          <div class="flex items-center justify-between">
            <div>侧边栏宽度</div>
            <NInputNumber v-model:value="appStore.config.asideWidth" :precision="0" />
          </div>

          <div class="flex items-center justify-between">
            <div>底部高度</div>
            <NInputNumber v-model:value="appStore.config.footerHeight" :precision="0" />
          </div>

          <div class="flex items-center justify-between">
            <div>间隙</div>
            <NInputNumber v-model:value="appStore.config.gap" :precision="0" />
          </div>

          <div class="flex items-center justify-between">
            <div>显示面包屑</div>
            <NSwitch v-model:value="appStore.config.showBreadcrumb" />
          </div>

          <div class="flex items-center justify-between">
            <div>显示标签栏</div>
            <NSwitch v-model:value="appStore.config.showTabs" />
          </div>

          <div class="flex items-center justify-between">
            <div>显示底部</div>
            <NSwitch v-model:value="appStore.config.showFooter" />
          </div>

          <div class="flex items-center justify-between">
            <div>头部反转</div>
            <NSwitch v-model:value="appStore.config.invertedHeader" />
          </div>
          <div class="flex items-center justify-between">
            <div>侧边栏反转</div>
            <NSwitch v-model:value="appStore.config.invertedAside" />
          </div>
        </NSpace>
      </div>

      <template #footer>
        <div class="w-full flex justify-between">
          <NButton type="primary" @click="handleCopy">复制</NButton>
          <NButton type="primary" ghost @click="handleReset">重置</NButton>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import { injectTailwindCssVarToGlobal } from '@/utils/theme'
import { useClipboard } from '@vueuse/core'

const show = defineModel<boolean>('show', {
  required: true,
})

const appStore = useAppStore()

function handleChangeLayout(layoutMode: App.LayoutMode) {
  appStore.layoutModeChangeAction(layoutMode)
}

function handleChangePrimaryColor(color: string) {
  injectTailwindCssVarToGlobal(color, 'primary')
}

const { copy } = useClipboard()

function handleCopy() {
  const copyStr = `
const appConfig: App.BaseConfig = {
  layout: {
    layoutMode: '${appStore.layoutMode}',
    asideWidth: ${appStore.config.asideWidth},
    headerHeight: ${appStore.config.headerHeight},
    footerHeight: ${appStore.config.footerHeight},
    tabHeight: ${appStore.config.tabHeight},
    gap: ${appStore.config.gap},
    showTabs: ${appStore.config.showTabs},
    showBreadcrumb: ${appStore.config.showBreadcrumb},
    showFooter: ${appStore.config.showFooter},
    invertedHeader: ${appStore.config.invertedHeader},
    invertedAside: ${appStore.config.invertedAside}

  },
  theme: {
    primaryColor: '${appStore.themeOverrides.common!.primaryColor!}',
  }
}
  `
  copy(copyStr.trim())

  window.$dialog.success({
    title: '复制成功',
    content: '请手动粘贴到 src/config/modules/app.ts 中，覆盖appConfig',
    positiveText: '我知道了',
  })
}

function handleReset() {
  appStore.resetLayoutAndTheme()
}
</script>

<style scoped></style>
