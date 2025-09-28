<template>
  <div class="h-full flex items-center gap-3">
    <VueDraggable
      v-model="tabsList"
      target=".sort-target"
      handle=".handle"
      class="scrollbar-hide min-w-0 flex-1 overflow-x-auto"
      v-dragscroll
    >
      <TransitionGroup
        type="transition"
        tag="div"
        name="fade"
        class="sort-target h-full w-max flex select-none gap-4 px-4 pt-2 text-sm"
      >
        <div
          v-for="(item, index) in tabsList"
          :key="item.name"
          class="tab-item px-3 py-1.5"
          :class="[
            item.name === activeRouteName ? 'text-primary dark:text-white bg-primary-100 dark:bg-primary-700' : '',
          ]"
          :ref="(el) => setItemRef(el as HTMLElement, item.name)"
          @click="handleJump(item.name)"
          @contextmenu.prevent="handleRightClick(item.name)"
        >
          <NDropdown
            trigger="manual"
            :options="renderOptions(item, index)"
            :show="dropdownVisible[item.name]"
            :on-clickoutside="handleCloseDropdown"
            @select="(key) => handleSelect(key, item)"
          >
            <div
              class="flex items-center gap-2 rounded-lg px-3 py-1"
              :class="[item.name === activeRouteName ? '' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700']"
            >
              <SvgIcon
                class="handle cursor-move"
                v-if="item.icon || item.localIcon"
                :icon="item.icon"
                :local-icon="item.localIcon"
              />
              <SvgIcon class="handle cursor-move" v-else icon="ic:baseline-menu" />
              <div class="w-max-[60px] overflow-hidden whitespace-nowrap">{{ item.title }}</div>
              <div
                v-if="!item.fixedInTab"
                class="i-material-symbols:close-rounded hover:i-material-symbols:cancel-rounded cursor-pointer text-lg"
                @click.stop="tabStore.removeTabsAction(item)"
              ></div>
            </div>
          </NDropdown>
        </div>
      </TransitionGroup>
    </VueDraggable>

    <div class="flex items-center gap-4 pr-4 text-lg">
      <NTooltip placement="bottom">
        <template #trigger>
          <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.refreshRouterView">
            <SvgIcon icon="ooui:reload"></SvgIcon>
          </div>
        </template>
        <span>刷新</span>
      </NTooltip>

      <NTooltip placement="bottom">
        <template #trigger>
          <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="toggle">
            <SvgIcon :icon="isFullscreen ? 'ooui:exit-fullscreen' : 'ooui:full-screen'"></SvgIcon>
          </div>
        </template>
        <span>内容全屏</span>
      </NTooltip>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { useTabStore, useAppStore } from '@/stores'
import { useWindowSize, useDebounceFn, useFullscreen } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'

import type { DropdownOption } from 'naive-ui'
import type { Directive } from 'vue'

interface DragScrollHTMLElement extends HTMLElement {
  _dragscroll?: {
    isDown: boolean
    startX: number
    scrollLeft: number
    handleMouseDown: (e: MouseEvent) => void
    handleMouseLeave: () => void
    handleMouseUp: () => void
    handleMouseMove: (e: MouseEvent) => void
  }
}

const vDragscroll: Directive<DragScrollHTMLElement> = {
  mounted(el) {
    let isDown = false
    let startX: number
    let scrollLeft: number

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
      el.style.cursor = 'grabbing'
    }

    const handleMouseLeave = () => {
      isDown = false
      el.style.cursor = 'grab'
    }

    const handleMouseUp = () => {
      isDown = false
      el.style.cursor = 'grab'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 2
      el.scrollLeft = scrollLeft - walk
    }

    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('mouseleave', handleMouseLeave)
    el.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('mousemove', handleMouseMove)

    // 保存引用以便卸载时使用
    el._dragscroll = {
      isDown,
      startX: 0,
      scrollLeft: 0,
      handleMouseDown,
      handleMouseLeave,
      handleMouseUp,
      handleMouseMove,
    }
  },
  unmounted(el) {
    // 清理事件监听
    const handlers = el._dragscroll
    if (handlers) {
      el.removeEventListener('mousedown', handlers.handleMouseDown)
      el.removeEventListener('mouseleave', handlers.handleMouseLeave)
      el.removeEventListener('mouseup', handlers.handleMouseUp)
      el.removeEventListener('mousemove', handlers.handleMouseMove)
    }
  },
}

const tabStore = useTabStore()
const { tabsList, activeRouteName } = storeToRefs(tabStore)
const router = useRouter()

function renderOptions(tab: App.Tab, index: number): DropdownOption[] {
  return [
    {
      label: '关闭',
      key: 'closeCurrent',
      icon: () => <SvgIcon icon="ant-design:close-outlined"> </SvgIcon>,
      disabled: Boolean(tab.fixedInTab),
    },
    {
      label: '关闭其它',
      key: 'closeOther',
      icon: () => <SvgIcon icon="ant-design:column-width-outlined"> </SvgIcon>,
    },
    {
      label: '关闭左侧',
      key: 'closeLeft',
      icon: () => <SvgIcon icon="mdi:format-horizontal-align-left"> </SvgIcon>,
      disabled: index === 0,
    },
    {
      label: '关闭右侧',
      key: 'closeRight',
      icon: () => <SvgIcon icon="mdi:format-horizontal-align-right"> </SvgIcon>,
      disabled: index === tabsList.value.length - 1,
    },
    {
      label: '关闭所有',
      key: 'closeAll',
      icon: () => <SvgIcon icon="ant-design:line-outlined"> </SvgIcon>,
    },
  ]
}

const dropdownVisible = reactive<Record<string, boolean>>({})

function handleCloseDropdown() {
  // 隐藏其他下拉菜单
  Object.keys(dropdownVisible).forEach((key) => {
    dropdownVisible[key] = false
  })
}

function handleRightClick(fullPath: string) {
  handleCloseDropdown()

  // 显示当前下拉菜单
  dropdownVisible[fullPath] = true
}

function handleSelect(key: string, tab: App.Tab) {
  handleCloseDropdown()
  switch (key) {
    case 'closeCurrent':
      tabStore.removeTabsAction(tab)
      break
    case 'closeOther':
      tabStore.closeOtherTabsAction(tab)
      break
    case 'closeLeft':
      tabStore.closeLeftTabsAction(tab)
      break
    case 'closeRight':
      tabStore.closeRightTabsAction(tab)
      break
    case 'closeAll':
      tabStore.closeAllTabsAction()
      break
  }
}

const tabRefs = ref<Record<string | number, HTMLElement>>({})
function setItemRef(el: HTMLElement | null, path: string) {
  if (el) {
    tabRefs.value[path] = el
  }
}

function scrollIntoView() {
  nextTick(() => {
    const element = tabRefs.value[activeRouteName.value]
    if (!element) return
    element.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    })
  })
}

const debouncedScrollIntoView = useDebounceFn(scrollIntoView, 400)

watch(activeRouteName, () => debouncedScrollIntoView(), {
  immediate: true,
})

const { width } = useWindowSize()
function handleJump(name: string) {
  router.push({
    name,
  })
}
watch(width, () => scrollIntoView())

const appStore = useAppStore()
const { layoutContentRef } = storeToRefs(appStore)
const { isFullscreen, toggle } = useFullscreen(layoutContentRef)
</script>
<style scoped>
.tab-item {
  margin: 0 -16px;
  overflow: hidden;
  cursor: pointer;
  -webkit-mask-image:
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M100 100C44.772 100 0 55.228 0 0v100h100z' fill='%23F8EAE7'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 100c55.228 0 100-44.772 100-100v100H0z' fill='%23F8EAE7'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><rect rx='12' width='100%' height='100%' fill='%23F8EAE7'/></svg>");
  -webkit-mask-size:
    12px 12px,
    12px 12px,
    calc(100% - 24px) calc(100% + 12px);
  -webkit-mask-position:
    right bottom,
    left bottom,
    center top;
  -webkit-mask-repeat: no-repeat;
}

.tab-item.active {
  background: var(--color-primary-100);
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleX(0.1);
}

.fade-leave-active {
  position: absolute;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}
</style>
