# Changelog

## [2.4.1] - 2026-03-20

### 🐛 Bug Fixes

- 修复布局问题

## [2.4.0] - 2026-03-20

### ✨ Features

- 添加`左侧双菜单`布局

### 🐛 Bug Fixes

- 修复`tsconfig.app.json`lib错误问题

## [2.1.0] - 2026-01-05

### ✨ Features

- 路由插件生成[类型化路由](https://router.vuejs.org/zh/guide/advanced/typed-routes.html)，路由导航的时候有类型提示

### 🐛 Bug Fixes

- 修复`pnpm type-check`类型报错问题

### ⚠️ BREAKING CHANGES

- 现在使用useRoute()获取路由参数params的时候需要明确加上泛型，例如：`useRoute<'home'>().params`，ts会自动校验参数是否存在

## 2.0.1

### ✨ Features

- 新增搜索功能
- 新增全局水印功能
- 新增色弱模式、灰色模式

## 2.0.0

### ✨ Features

- 路由 meta 新增`multipleTab`、`showBack`参数
- 后端 api 由原来的`apifox`mock 改为真实线上接口，[后端项目](https://github.com/RengarJS/rengar-admin-python)
- 新增 vite proxy 代理功能
- 新增多种路由动画

### 🐛 Bug Fixes

- 优化暗黑模式切换闪屏
- 修复菜单折叠问题
- axios 请求代码重构，修复 token 失效不能取消 api 的问题
- 修复登录成功后无法跳转到之前的页面

## 1.4.0

### 🐛 Bug Fixes

- 修复eslint在使用`unocss`的文件中报错的问题，该问题产生的原因是`unocss`各个依赖的版本不一致的问题。
