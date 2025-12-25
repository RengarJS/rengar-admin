<template>
  <NDrawer v-model:show="show" :width="400" :native-scrollbar="true" :auto-focus="false">
    <NDrawerContent title="系统配置" :native-scrollbar="false" closable>
      <div>
        <NDivider>布局模式</NDivider>

        <NGrid :cols="3" :x-gap="16">
          <NGridItem>
            <div
              class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
              :class="[userConfig.layoutMode === 'aside' ? ' border border-primary' : '']"
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
              :class="[userConfig.layoutMode === 'top' ? ' border border-primary' : '']"
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
              :class="[userConfig.layoutMode === 'top-aside' ? ' border border-primary' : '']"
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
        <NDivider>路由动画</NDivider>
        <NRadioGroup v-model:value="userConfig.transitionName">
          <NGrid :cols="4" :x-gap="16" :y-gap="16">
            <NGridItem v-for="item in transitionOptions" :key="item.value">
              <NRadioButton :value="item.value" :label="item.label" />
            </NGridItem>
          </NGrid>
        </NRadioGroup>
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
            <NInputNumber v-model:value="userConfig.headerHeight" :precision="0" />
          </div>
          <div class="flex items-center justify-between">
            <div>标签栏高度</div>
            <NInputNumber v-model:value="userConfig.tabHeight" :precision="0" />
          </div>
          <div class="flex items-center justify-between">
            <div>侧边栏宽度</div>
            <NInputNumber v-model:value="userConfig.asideWidth" :precision="0" />
          </div>

          <div class="flex items-center justify-between">
            <div>底部高度</div>
            <NInputNumber v-model:value="userConfig.footerHeight" :precision="0" />
          </div>

          <div class="flex items-center justify-between">
            <div>间隙</div>
            <NInputNumber v-model:value="userConfig.gap" :precision="0" />
          </div>

          <div class="flex items-center justify-between">
            <div>显示面包屑</div>
            <NSwitch v-model:value="userConfig.showBreadcrumb" />
          </div>

          <div class="flex items-center justify-between">
            <div>显示标签栏</div>
            <NSwitch v-model:value="userConfig.showTabs" />
          </div>

          <div class="flex items-center justify-between">
            <div>显示底部</div>
            <NSwitch v-model:value="userConfig.showFooter" />
          </div>

          <div class="flex items-center justify-between">
            <div>头部反转</div>
            <NSwitch v-model:value="userConfig.invertedHeader" />
          </div>
          <div class="flex items-center justify-between">
            <div>侧边栏反转</div>
            <NSwitch v-model:value="userConfig.invertedAside" />
          </div>

          <div class="flex items-center justify-between">
            <div>全局水印</div>
            <NSwitch v-model:value="userConfig.showWaterMark" />
          </div>

          <div class="flex items-center justify-between">
            <div>灰色模式</div>
            <NSwitch v-model:value="userConfig.grayMode" />
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

const { userConfig } = storeToRefs(appStore)

function handleChangeLayout(layoutMode: App.LayoutMode) {
  appStore.layoutModeChangeAction(layoutMode)
}

const transitionOptions = [
  { label: '淡入淡出', value: 'fade' },
  { label: '从左滑入', value: 'slide-left' },
  { label: '从右滑入', value: 'slide-right' },
  { label: '从上滑入', value: 'slide-up' },
  { label: '从下滑入', value: 'slide-down' },
  { label: '缩放淡入', value: 'scale' },
  { label: '无动画', value: 'none' },
] as const

function handleChangePrimaryColor(color: string) {
  injectTailwindCssVarToGlobal(color, 'primary')
}

const { copy } = useClipboard()

function handleCopy() {
  const copyStr = `
const userConfig: App.UserConfig = {
  version: ${userConfig.value.version + 1},
  layoutMode: '${userConfig.value.layoutMode}',
  asideWidth: ${userConfig.value.asideWidth},
  headerHeight: ${userConfig.value.headerHeight},
  footerHeight: ${userConfig.value.footerHeight},
  tabHeight: ${userConfig.value.tabHeight},
  gap: ${userConfig.value.gap},
  showTabs: ${userConfig.value.showTabs},
  showBreadcrumb: ${userConfig.value.showBreadcrumb},
  showFooter: ${userConfig.value.showFooter},
  invertedHeader: ${userConfig.value.invertedHeader},
  invertedAside: ${userConfig.value.invertedAside}
}
  `
  copy(copyStr.trim())

  window.$dialog.success({
    title: '复制成功',
    content: '请手动粘贴到 src/config/modules/app.ts 中，覆盖userConfig',
    positiveText: '我知道了',
  })
}

function handleReset() {
  appStore.resetLayoutAndTheme()
}
</script>

<style scoped></style>
