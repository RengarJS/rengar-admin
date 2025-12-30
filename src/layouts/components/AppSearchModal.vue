<template>
  <NModal
    v-model:show="show"
    preset="card"
    embedded
    title="搜索"
    :bordered="false"
    style="width: 100%; max-width: 600px; position: fixed; top: 20px; left: 0; right: 0; margin: 0 auto"
  >
    <div ref="modalRef">
      <NInput
        clearable
        size="large"
        v-model:value="searchContent"
        placeholder="搜索菜单页面"
        @keypress.enter="handleEnter"
        @keydown="handleKeyDown"
        @blur="isComposing = false"
      ></NInput>

      <div v-if="!searchContent && searchHistoryMenus.length" class="mt-6">
        <div class="flex items-center justify-between">
          <div>历史记录</div>
          <div class="text-gray-400">
            <NButton text size="small" type="primary" @click="menuStore.clearSearchHistoryMenus"> 清空 </NButton>
          </div>
        </div>
        <NCard
          v-for="(route, index) in searchHistoryMenus"
          :ref="(el) => setCardRef(el as CardInst, index)"
          size="small"
          hoverable
          :key="route.name"
          class="mt-3 cursor-pointer"
          :content-class="computedContentClass(index)"
          @click="handleClick(route)"
        >
          <div class="flex items-center gap-3 text-base">
            <SvgIcon v-if="route.meta?.icon" :icon="route.meta?.icon"></SvgIcon>
            <SvgIcon v-else-if="route.meta?.localIcon" :localIcon="route.meta?.localIcon"></SvgIcon>
            <SvgIcon v-else icon="ic:baseline-menu"></SvgIcon>

            <div>{{ route.meta?.title }}</div>
          </div>

          <SvgIcon @click.stop="menuStore.removeSearchHistoryMenu(route)" icon="ant-design:close-outlined"></SvgIcon>
        </NCard>
      </div>
      <NEmpty v-if="!searchHistoryMenus.length && !searchRoutes.length" description="暂无数据" class="mt-6"></NEmpty>
      <div v-if="searchRoutes.length" class="mt-6">
        <NCard
          v-for="(route, index) in searchRoutes"
          :ref="(el) => setCardRef(el as CardInst, index)"
          size="small"
          hoverable
          :key="route.name"
          :class="[index > 0 ? 'mt-3' : '']"
          class="cursor-pointer"
          :content-class="computedContentClass(index)"
          @click="handleClick(route)"
        >
          <div class="flex items-center gap-3 text-base">
            <SvgIcon v-if="route.meta?.icon" :icon="route.meta?.icon"></SvgIcon>
            <SvgIcon v-else-if="route.meta?.localIcon" :localIcon="route.meta?.localIcon"></SvgIcon>
            <SvgIcon v-else icon="ic:baseline-menu"></SvgIcon>

            <div>{{ route.meta?.title }}</div>
          </div>

          <SvgIcon icon="ant-design:enter-outlined"></SvgIcon>
        </NCard>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center gap-2 text-gray">
        <SvgIcon icon="ant-design:enter-outlined"></SvgIcon>
        <div class="mr-4">选择</div>
        <SvgIcon icon="ant-design:arrow-up-outlined"></SvgIcon>
        <SvgIcon icon="ant-design:arrow-down-outlined"></SvgIcon>
        <div class="mr-4">切换</div>

        <SvgIcon icon="ant-design:delete-outlined"></SvgIcon>
        <div>删除</div>
        <div class="ml-4">esc</div>
        <div>关闭</div>
      </div>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores'
import { useRouterHook } from '@/hooks/router'
import { useMagicKeys, whenever } from '@vueuse/core'
import type { RouteRecordRaw } from 'vue-router'
import type { NCard } from 'naive-ui'

type CardInst = InstanceType<typeof NCard>

const show = defineModel<boolean>('show', {
  required: true,
})

const menuStore = useMenuStore()

const { menuRoutes, searchHistoryMenus } = storeToRefs(menuStore)

const searchContent = ref('')
const activeIndex = ref(-1) // 修改默认值为-1，表示无选中项
const cardRefs = ref<CardInst[]>([])

let isComposing = false
function handleKeyDown(e: KeyboardEvent) {
  isComposing = e.isComposing
}

const {
  ArrowUp,
  ArrowDown,
  Enter,
  Delete: DeleteKey,
} = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (['ArrowUp', 'ArrowDown', 'Enter', 'Delete'].includes(e.key) && e.type === 'keydown') {
      e.preventDefault()
    }
  },
})

// 监听上下箭头键
whenever(ArrowUp!, () => {
  if (isComposing) {
    return
  }
  if (searchContent.value && searchRoutes.value.length > 0) {
    // 搜索模式
    activeIndex.value = (activeIndex.value - 1 + searchRoutes.value.length) % searchRoutes.value.length
  } else if (!searchContent.value && searchHistoryMenus.value.length > 0) {
    // 历史记录模式
    activeIndex.value = (activeIndex.value - 1 + searchHistoryMenus.value.length) % searchHistoryMenus.value.length
  }
})

whenever(ArrowDown!, () => {
  if (isComposing) {
    return
  }
  if (searchContent.value && searchRoutes.value.length > 0) {
    // 搜索模式
    activeIndex.value = (activeIndex.value + 1) % searchRoutes.value.length
  } else if (!searchContent.value && searchHistoryMenus.value.length > 0) {
    // 历史记录模式
    activeIndex.value = (activeIndex.value + 1) % searchHistoryMenus.value.length
  }
})

// 监听 Enter 键
whenever(Enter!, () => {
  if (isComposing) {
    return
  }
  if (searchContent.value && searchRoutes.value.length > 0) {
    // 搜索模式
    if (activeIndex.value >= 0 && searchRoutes.value[activeIndex.value]) {
      handleClick(searchRoutes.value[activeIndex.value]!)
    } else if (searchRoutes.value.length > 0) {
      // 如果没有选择任何项，选择第一项
      handleClick(searchRoutes.value[0]!)
    }
  } else if (!searchContent.value && searchHistoryMenus.value.length > 0) {
    // 历史记录模式
    if (activeIndex.value >= 0 && searchHistoryMenus.value[activeIndex.value]) {
      handleClick(searchHistoryMenus.value[activeIndex.value]!)
    } else if (searchHistoryMenus.value.length > 0) {
      // 如果没有选择任何项，选择第一项
      handleClick(searchHistoryMenus.value[0]!)
    }
  }
})

// 监听 Delete 键，只在历史记录模式下有效
whenever(DeleteKey!, () => {
  if (isComposing) {
    return
  }
  if (!searchContent.value && searchHistoryMenus.value.length > 0 && activeIndex.value >= 0) {
    // 删除当前选中的历史记录项
    const currentRoute = searchHistoryMenus.value[activeIndex.value]
    handleRemove(currentRoute!)
  }
})

function handleRemove(route: RouteRecordRaw) {
  // 记录当前选中项的索引
  const currentIndex = activeIndex.value
  menuStore.removeSearchHistoryMenu(route)

  // 如果删除的是当前选中的项，需要重新设置选中状态
  nextTick(() => {
    if (searchHistoryMenus.value.length === 0) {
      // 如果历史记录为空，将选中索引设为-1
      activeIndex.value = -1
    } else if (currentIndex < searchHistoryMenus.value.length) {
      // 如果删除后还有历史记录且当前索引仍在范围内，保持当前索引
      activeIndex.value = currentIndex
    } else {
      // 如果当前索引超出范围，则选中最后一项
      activeIndex.value = Math.max(0, searchHistoryMenus.value.length - 1)
    }
  })
}

const { routerPushByName } = useRouterHook()

function setCardRef(el: CardInst | null, index: number) {
  if (!cardRefs.value[index]) {
    cardRefs.value[index] = el as never
  }
}

function handleEnter() {
  if (searchContent.value && searchRoutes.value.length > 0) {
    // 搜索模式
    if (activeIndex.value >= 0 && searchRoutes.value[activeIndex.value]) {
      handleClick(searchRoutes.value[activeIndex.value]!)
    } else if (searchRoutes.value.length > 0) {
      // 如果没有选择任何项，选择第一项
      handleClick(searchRoutes.value[0]!)
    }
  } else if (!searchContent.value && searchHistoryMenus.value.length > 0) {
    // 历史记录模式
    if (activeIndex.value >= 0 && searchHistoryMenus.value[activeIndex.value]) {
      handleClick(searchHistoryMenus.value[activeIndex.value]!)
    } else if (searchHistoryMenus.value.length > 0) {
      // 如果没有选择任何项，选择第一项
      handleClick(searchHistoryMenus.value[0]!)
    }
  }
}

function handleClick(route: RouteRecordRaw) {
  routerPushByName(route.name as RouteRecordName)
  show.value = false
  menuStore.addSearchHistoryMenu(route)
}

/**
 * 递归遍路由（包括嵌套 children），扁平化筛选出 meta.title 包含关键词的项，排除没有component 的项
 * 并仅返回 { name, path, meta } 字段。
 */
function flattenAndSearchRoutes(routes: RouteRecordRaw[], keyword: string): Array<RouteRecordRaw> {
  if (!keyword.trim()) {
    return []
  }

  const lowerKeyword = keyword.toLowerCase()
  const results: Array<RouteRecordRaw> = []

  function walk(items: RouteRecordRaw[]) {
    for (const item of items) {
      if (
        item.component &&
        typeof item.name === 'string' &&
        item.meta?.title &&
        typeof item.meta.title === 'string' &&
        item.meta.title.toLowerCase().includes(lowerKeyword)
      ) {
        results.push(item)
      }
      if (item.children) {
        walk(item.children)
      }
    }
  }

  walk(routes)
  return results
}

const searchRoutes = computed(() => {
  const result = flattenAndSearchRoutes(menuRoutes.value, searchContent.value)
  if (result.length > 0) {
    activeIndex.value = 0
  } else {
    activeIndex.value = -1
  }
  return result
})

function computedContentClass(index: number) {
  const classes = [
    'flex items-center justify-between',
    index === activeIndex.value ? 'bg-primary/20 dark:bg-primary/30 p-3 rounded' : '',
  ]
  return classes.filter(Boolean).join(' ')
}

watch(show, (value) => {
  if (!value) {
    // 关闭弹框时重置所有状态
    activeIndex.value = -1
    nextTick(() => {
      searchContent.value = ''
    })
  } else {
    // 打开弹框时，根据是否有搜索内容设置高亮项
    if (searchContent.value && searchRoutes.value.length > 0) {
      activeIndex.value = 0
    } else if (!searchContent.value && searchHistoryMenus.value.length > 0) {
      activeIndex.value = 0 // 默认高亮历史记录的第一项
    } else {
      activeIndex.value = -1
    }
  }
})

// 监听searchContent变化，当清空搜索内容时，自动高亮历史记录第一项
watch(
  searchContent,
  (newVal) => {
    if (!newVal && searchHistoryMenus.value.length > 0) {
      activeIndex.value = 0
    } else if (newVal && searchRoutes.value.length > 0) {
      activeIndex.value = 0
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
