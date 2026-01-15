// 导入 Vue 的 ESLint 插件
import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'

// 导入 Vue 和 TypeScript 的 ESLint 配置
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// 导入 Prettier 的跳过格式化配置
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// ✅ 新增：导入 eslint-plugin-prettier
import pluginPrettier from 'eslint-plugin-prettier'

import unocss from '@unocss/eslint-config/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,tsx,vue}'],
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'packages/**/*.js', '']),

  // 使用 Vue 的基本配置
  pluginVue.configs['flat/essential'],
  // 使用 Vue 和 TypeScript 的推荐配置
  vueTsConfigs.recommended,
  // 跳过 Prettier 的格式化冲突规则
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

  // ✅ 新增：注册 prettier 插件并启用规则
  {
    name: 'app/prettier',
    plugins: {
      // 注册插件：名称 'prettier' 对应 pluginPrettier 模块
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // 自定义规则
  {
    name: 'app/files-custom-rules',
    rules: {
      // 关闭.vue文件名多个单词校验
      'vue/multi-word-component-names': 'off',
      // 强制组件名称PascalCase风格
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
        },
      ],
      // .vue文件各个模块顺序
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: ['ts', 'tsx'],
          },
        },
      ],

      // 关闭any类型校验
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
