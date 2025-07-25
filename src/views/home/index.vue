<template>
  <div>
    <!-- 欢迎问候语 -->
    <NCard class="mb-4 from-primary-100 to-primary-50 bg-gradient-to-r dark:from-primary-500 dark:to-primary-200">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <SvgIcon icon="mdi:hand-wave" class="text-4xl text-yellow-500" />
          <div>
            <h2 class="text-xl font-bold">欢迎回来，{{ username || '管理员' }}！</h2>
            <p class="text-sm text-gray-600">今天是 {{ currentDate }}，祝您工作愉快！</p>
          </div>
        </div>
        <NButton type="primary" size="small" @click="refreshData">
          <template #icon>
            <SvgIcon icon="mdi:refresh" />
          </template>
          刷新数据
        </NButton>
      </div>
    </NCard>

    <!-- 待办事项 -->
    <NCard class="mb-4 from-blue-50 to-blue-100 bg-gradient-to-r dark:from-blue-800">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <SvgIcon icon="mdi:clipboard-check" class="text-3xl text-blue-500" />
          <h3 class="text-lg font-bold">今日待办</h3>
        </div>
        <div class="flex gap-2">
          <NButton quaternary size="small" @click="addTodo">
            <template #icon>
              <SvgIcon icon="mdi:plus" />
            </template>
            添加任务
          </NButton>
          <NButton quaternary size="small" @click="clearCompletedTodos">
            <template #icon>
              <SvgIcon icon="mdi:delete-sweep" />
            </template>
            清除已完成
          </NButton>
        </div>
      </div>

      <div class="custom-scrollbar max-h-60 overflow-y-auto">
        <TransitionGroup name="todo-list" tag="ul" class="space-y-2">
          <li v-for="(todo, index) in todos" :key="todo.id" class="group">
            <div
              class="flex items-center rounded-lg p-3 transition-all duration-200"
              :class="[
                todo.completed ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800',
                'hover:shadow-md',
              ]"
            >
              <NCheckbox v-model:checked="todo.completed" @update:checked="updateTodoStatus(index)" />
              <div class="ml-3 flex-1" :class="{ 'line-through text-gray-400': todo.completed }">
                {{ todo.text }}
              </div>
              <div class="mr-2 text-xs text-gray-400">{{ todo.date }}</div>
              <NButton
                quaternary
                circle
                size="small"
                class="opacity-0 transition-opacity group-hover:opacity-100"
                @click="removeTodo(index)"
              >
                <template #icon>
                  <SvgIcon name="mdi:delete" />
                </template>
              </NButton>
            </div>
          </li>
        </TransitionGroup>

        <div v-if="todos.length === 0" class="flex flex-col items-center justify-center py-6 text-gray-400">
          <SvgIcon name="mdi:clipboard-text" class="mb-2 text-5xl" />
          <p>暂无待办事项</p>
        </div>
      </div>

      <NModal
        v-model:show="showAddTodoModal"
        preset="dialog"
        title="添加新任务"
        positive-text="确认"
        negative-text="取消"
        @positive-click="confirmAddTodo"
        @negative-click="cancelAddTodo"
      >
        <NInput v-model:value="newTodoText" placeholder="请输入任务内容" @keyup.enter="confirmAddTodo" />
      </NModal>
    </NCard>

    <NGrid cols="1  600:2 1000:4" :x-gap="16" :y-gap="16">
      <!-- 统计卡片 -->
      <NGridItem class="col-span-24 lg:col-span-6 md:col-span-12 sm:col-span-12">
        <NCard class="h-full from-blue-50 to-blue-100 bg-gradient-to-r">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg text-black font-bold">项目总数</div>
              <div class="mt-2 text-3xl text-black font-bold">16</div>
            </div>
            <div class="size-16 flex-center rounded-full bg-blue-500 text-white">
              <SvgIcon icon="mdi:folder" class="text-3xl" />
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">较昨日 +2 个项目</div>
        </NCard>
      </NGridItem>

      <NGridItem class="col-span-24 lg:col-span-6 md:col-span-12 sm:col-span-12">
        <NCard class="h-full from-green-50 to-green-100 bg-gradient-to-r">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg text-black font-bold">活跃用户</div>
              <div class="mt-2 text-3xl text-black font-bold">3,856</div>
            </div>
            <div class="size-16 flex-center rounded-full bg-green-500 text-white">
              <SvgIcon icon="mdi:account" class="text-3xl" />
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">较昨日 +12%</div>
        </NCard>
      </NGridItem>

      <NGridItem class="col-span-24 lg:col-span-6 md:col-span-12 sm:col-span-12">
        <NCard class="h-full from-yellow-50 to-yellow-100 bg-gradient-to-r">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg text-black font-bold">系统消息</div>
              <div class="mt-2 text-3xl text-black font-bold">258</div>
            </div>
            <div class="size-16 flex-center rounded-full bg-yellow-500 text-white">
              <SvgIcon icon="mdi:bell" class="text-3xl" />
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">较昨日 +48 条</div>
        </NCard>
      </NGridItem>

      <NGridItem class="col-span-24 lg:col-span-6 md:col-span-12 sm:col-span-12">
        <NCard class="h-full from-red-50 to-red-100 bg-gradient-to-r">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg text-black font-bold">错误日志</div>
              <div class="mt-2 text-3xl text-black font-bold">12</div>
            </div>
            <div class="size-16 flex-center rounded-full bg-red-500 text-white">
              <SvgIcon icon="mdi:alert-circle" class="text-3xl" />
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">较昨日 -25%</div>
        </NCard>
      </NGridItem>
    </NGrid>

    <NGrid cols="1 600:2" :x-gap="16" :y-gap="16" class="mt-4">
      <!-- 图表区域 -->
      <NGridItem class="col-span-24 lg:col-span-16 md:col-span-24">
        <NCard title="访问量趋势" class="h-full">
          <VChart class="h-80 w-full" :option="visitOption" autoresize />
        </NCard>
      </NGridItem>

      <NGridItem class="col-span-24 lg:col-span-8 md:col-span-24">
        <NCard title="用户分布" class="h-full">
          <VChart class="h-80 w-full" :option="pieOption" autoresize />
        </NCard>
      </NGridItem>
    </NGrid>

    <NGrid>
      <!-- 项目依赖卡片 -->
      <NGridItem :span="24" :offset="0" class="col-span-24"> </NGridItem>
    </NGrid>

    <NCard title="技术栈" class="h-full">
      <NGrid cols="1 600:2  1000:4" :x-gap="16" :y-gap="16" class="mt-4">
        <NGridItem v-for="(tech, index) in techStacks" :key="index">
          <NCard class="h-full cursor-pointer transition-all duration-300 hover:shadow-lg" @click="openLink(tech.url)">
            <div class="flex items-center gap-3">
              <div class="text-3xl" :class="tech.color">
                <SvgIcon icon="material-symbols:tools-wrench-outline" class="text-primary" />
              </div>
              <div>
                <div class="text-lg font-bold">{{ tech.name }}</div>
                <div class="mt-3 text-sm text-gray-600">{{ tech.description }}</div>
              </div>
            </div>
          </NCard>
        </NGridItem>
      </NGrid>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ref, computed, onMounted, watch } from 'vue'

// 导入Naive UI组件
import { NCard, NButton, NGrid, NGridItem, NCheckbox, NModal, NInput } from 'naive-ui'

// 导入用户认证存储
import { useAuthStore } from '@/stores'

// 技术栈数据
const techStacks = [
  {
    name: 'Vue.js',
    version: 'v3.5.17',
    description: '渐进式JavaScript框架',
    url: 'https://vuejs.org/',
    icon: 'logos:vue',
    color: 'text-green-500',
  },
  {
    name: 'vite',
    version: 'v4.0.0',
    description: '构建工具',
    url: 'https://vitejs.dev/',
    icon: 'logos:vue',
    color: 'text-purple-500',
  },
  {
    name: 'TypeScript',
    version: 'v5.1.6',
    description: '静态类型检查工具',
    url: 'https://www.typescriptlang.org/',
    icon: 'logos:vue',
    color: 'text-blue-500',
  },
  {
    name: 'pnpm',
    version: 'v8.15.1',
    description: '快速、安全、可靠的包管理器',
    url: 'https://pnpm.io/',
    icon: 'logos:vue',
    color: 'text-purple-500',
  },
  {
    name: 'Naive UI',
    version: 'v2.42.0',
    description: 'Vue3组件库',
    url: 'https://www.naiveui.com/',
    icon: 'logos:vue',
    color: 'text-primary',
  },
  {
    name: 'UnoCSS',
    version: 'v66.3.3',
    description: '即时原子CSS引擎',
    url: 'https://unocss.dev/',
    icon: 'logos:vue',
    color: 'text-gray-800',
  },
  {
    name: 'Pinia',
    version: 'v3.0.3',
    description: 'Vue状态管理库',
    url: 'https://pinia.vuejs.org/',
    icon: 'logos:vue',
    color: 'text-yellow-500',
  },
  {
    name: 'Vue Router',
    version: 'v4.5.1',
    description: 'Vue.js官方路由',
    url: 'https://router.vuejs.org/',
    icon: 'logos:vue',
    color: 'text-blue-600',
  },
  {
    name: 'ECharts',
    version: 'v5.6.0',
    description: '可视化图表库',
    url: 'https://echarts.apache.org/',
    icon: 'logos:vue',
    color: 'text-purple-600',
  },
  {
    name: 'VueUse',
    version: 'v12.8.2',
    description: 'Vue组合式API工具集',
    url: 'https://vueuse.org/',
    icon: 'logos:vue',
    color: 'text-green-600',
  },
  {
    name: 'Axios',
    version: 'v1.10.0',
    description: '基于Promise的HTTP客户端',
    url: 'https://axios-http.com/',
    icon: 'logos:vue',
    color: 'text-blue-500',
  },
]

// 注册ECharts组件
use([SVGRenderer, LineChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// 获取用户信息
const authStore = useAuthStore()
const username = computed(() => authStore.user.username)

// 获取当前日期
const currentDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// 刷新数据函数
const refreshData = () => {
  window.$message.success('数据已刷新')
  // 这里可以添加实际的数据刷新逻辑
}

// 打开外部链接函数
const openLink = (url: string) => {
  window.open(url, '_blank')
}

// 访问量趋势图表配置
const visitOption = ref({
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['访问量', '注册量', '活跃度'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      stack: '总量',
      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#409EFF',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.3)',
            },
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0)',
            },
          ],
        },
      },
    },
    {
      name: '注册量',
      type: 'line',
      stack: '总量',
      data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149],
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#67C23A',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(103, 194, 58, 0.3)',
            },
            {
              offset: 1,
              color: 'rgba(103, 194, 58, 0)',
            },
          ],
        },
      },
    },
    {
      name: '活跃度',
      type: 'line',
      stack: '总量',
      data: [150, 232, 201, 154, 190, 330, 410, 320, 332, 301, 334, 390],
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#E6A23C',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(230, 162, 60, 0.3)',
            },
            {
              offset: 1,
              color: 'rgba(230, 162, 60, 0)',
            },
          ],
        },
      },
    },
  ],
})

// 用户分布饼图配置
const pieOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
    },
  ],
})

// 待办事项功能
interface Todo {
  id: number
  text: string
  completed: boolean
  date: string
}

// 待办事项列表
const todos = ref<Todo[]>([
  {
    id: 1,
    text: '完成首页数据分析报告',
    completed: false,
    date: '09:30',
  },
  {
    id: 2,
    text: '参加项目周会',
    completed: true,
    date: '14:00',
  },
  {
    id: 3,
    text: '更新系统文档',
    completed: false,
    date: '16:30',
  },
])

// 新任务文本
const newTodoText = ref('')

// 添加任务对话框显示状态
const showAddTodoModal = ref(false)

// 添加任务
const addTodo = () => {
  showAddTodoModal.value = true
}

// 确认添加任务
const confirmAddTodo = () => {
  if (newTodoText.value.trim()) {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')

    todos.value.push({
      id: Date.now(),
      text: newTodoText.value.trim(),
      completed: false,
      date: `${hours}:${minutes}`,
    })

    newTodoText.value = ''
    showAddTodoModal.value = false
    window.$message.success('任务添加成功')
  } else {
    window.$message.warning('任务内容不能为空')
  }
}

// 取消添加任务
const cancelAddTodo = () => {
  newTodoText.value = ''
  showAddTodoModal.value = false
}

// 移除任务
const removeTodo = (index: number) => {
  todos.value.splice(index, 1)
  window.$message.success('任务已删除')
}

// 更新任务状态
const updateTodoStatus = (index: number) => {
  const todo = todos.value[index]
  if (todo.completed) {
    window.$message.success(`任务「${todo.text}」已完成`)
  }
}

// 清除已完成的任务
const clearCompletedTodos = () => {
  const completedCount = todos.value.filter((todo) => todo.completed).length
  if (completedCount === 0) {
    window.$message.info('没有已完成的任务')
    return
  }

  todos.value = todos.value.filter((todo) => !todo.completed)
  window.$message.success(`已清除 ${completedCount} 个已完成任务`)
}

// 从本地存储加载待办事项
onMounted(() => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    try {
      todos.value = JSON.parse(savedTodos)
    } catch (e) {
      console.error('Failed to parse saved todos', e)
    }
  }
})

// 监听待办事项变化，保存到本地存储
watch(
  todos,
  (newTodos) => {
    localStorage.setItem('todos', JSON.stringify(newTodos))
  },
  { deep: true },
)
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
}

.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
