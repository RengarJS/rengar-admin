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
        @keypress.enter.prevent="handleEnter"
        ref="inputRef"
      ></NInput>
      <NEmpty v-if="!searchRoutes.length" description="暂无数据" class="mt-6"></NEmpty>
      <div v-else class="mt-6">
        <NCard
          v-for="(route, index) in searchRoutes"
          :ref="(el) => setCardRef(el as CardInst, index)"
          size="small"
          hoverable
          :key="route.name"
          :class="[index > 0 ? 'mt-4' : '']"
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
        <div>切换</div>
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
import type { InputInst, NCard } from 'naive-ui'

type SearchRouteItem = Pick<RouteRecordRaw, 'name' | 'path' | 'meta'>
type CardInst = InstanceType<typeof NCard>

const show = defineModel<boolean>('show', {
  required: true,
})

const menuStore = useMenuStore()

const searchContent = ref('')
const activeIndex = ref(0) // 修改默认值为0，表示选中第一个
const cardRefs = ref<null[]>([])
const inputRef = ref<InputInst | null>(null)

const modalRef = ref<HTMLElement | null>(null)

// 使用 VueUse 的 useMagicKeys
const { ArrowUp, ArrowDown, Enter } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key) && e.type === 'keydown') {
      e.preventDefault()
    }
  },
})

// 监听上下箭头键
whenever(ArrowUp!, () => {
  if (searchRoutes.value.length > 0) {
    activeIndex.value = (activeIndex.value - 1 + searchRoutes.value.length) % searchRoutes.value.length
  }
})

whenever(ArrowDown!, () => {
  if (searchRoutes.value.length > 0) {
    activeIndex.value = (activeIndex.value + 1) % searchRoutes.value.length
  }
})

// 监听 Enter 键
whenever(Enter!, () => {
  if (activeIndex.value >= 0 && searchRoutes.value[activeIndex.value]) {
    handleClick(searchRoutes.value[activeIndex.value]!)
  } else if (searchRoutes.value.length > 0) {
    // 如果没有选择任何项，选择第一项
    handleClick(searchRoutes.value[0]!)
  }
})

const { routerPushByName } = useRouterHook()

function setCardRef(el: CardInst | null, index: number) {
  if (!cardRefs.value[index]) {
    cardRefs.value[index] = el as never
  }
}

function handleEnter() {
  if (activeIndex.value >= 0 && searchRoutes.value[activeIndex.value]) {
    handleClick(searchRoutes.value[activeIndex.value]!)
  } else if (searchRoutes.value.length > 0) {
    // 如果没有选择任何项，选择第一项
    handleClick(searchRoutes.value[0]!)
  }
}

function handleClick(route: SearchRouteItem) {
  routerPushByName(route.name as RouteRecordName)
  show.value = false
}

/**
 * 递归遍路由（包括嵌套 children），扁平化筛选出 meta.title 包含关键词的项，排除没有component 的项
 * 并仅返回 { name, path, meta } 字段。
 */
function flattenAndSearchRoutes(routes: RouteRecordRaw[], keyword: string): Array<SearchRouteItem> {
  if (!keyword.trim()) {
    return []
  }

  const lowerKeyword = keyword.toLowerCase()
  const results: Array<SearchRouteItem> = []

  function walk(items: RouteRecordRaw[]) {
    for (const item of items) {
      if (
        item.component &&
        typeof item.name === 'string' &&
        item.meta?.title &&
        typeof item.meta.title === 'string' &&
        item.meta.title.toLowerCase().includes(lowerKeyword)
      ) {
        results.push({
          name: item.name,
          path: item.path,
          meta: { ...item.meta },
        })
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
  const result = flattenAndSearchRoutes(menuStore.menuRoutes, searchContent.value)
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
    activeIndex.value = -1
    nextTick(() => {
      searchContent.value = ''
    })
  } else {
    if (searchRoutes.value.length > 0) {
      activeIndex.value = 0
    }
  }
})
</script>

<style scoped></style>
