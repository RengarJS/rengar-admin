// 导入 Vue 的 ESLint 插件
import pluginVue from 'eslint-plugin-vue'

// 导入 Vue 和 TypeScript 的 ESLint 配置
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// 导入 Prettier 的跳过格式化配置
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
// import autoImport from './.eslintrc-auto-import.json'
// 使用 `defineConfigWithVueTs` 函数定义 ESLint 配置

import unocss from '@unocss/eslint-config/flat'

export default defineConfigWithVueTs(
  {
    // 配置名称
    name: 'app/files-to-lint',
    // 需要检查的文件类型
    files: ['**/*.{ts,tsx,vue}'],
  },

  {
    // 配置名称
    name: 'app/files-to-ignore',
    // 需要忽略的文件或目录
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // 使用 Vue 的基本配置
  pluginVue.configs['flat/essential'],
  // 使用 Vue 和 TypeScript 的推荐配置
  vueTsConfigs.recommended,
  // 跳过 Prettier 的格式化配置
  skipFormatting,
  unocss,

  // 配置 Vue 文件支持 JSX
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // 自定义规则
  {
    name: 'app/files-custom-rules',
    rules: {
      // 配置 .vue 文件中组件名称的单词数量
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', 'App', 'Register', '[id]', '[url]'],
        },
      ],
      // 配置 .vue 文件中组件名称的大小写
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
        },
      ],
      // 配置 .vue 文件中 <template>、<script> 和 <style> 标签的顺序
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      // 配置 .vue 文件中 <script> 标签的 lang 属性</script>
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: ['ts', 'tsx'],
          },
        },
      ],

      // any类型
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
