# Changelog

## 2.0.0

### Feats

- 路由 meta 新增`multipleTab`、`showBack`参数
- 后端 api 由原来的`apifox`mock 改为真实线上接口，[后端项目](https://github.com/RengarJS/rengar-admin-python)
- 新增 vite proxy 代理功能
- 新增多种路由动画

### Fixes

- 优化暗黑模式切换闪屏
- 修复菜单折叠问题
- axios 请求代码重构，修复 token 失效不能取消 api 的问题
- 修复登录成功后无法跳转到之前的页面

## 1.4.0

### Feats

-

### Breaking Changes

-

### Fixes

- 修复eslint在使用`unocss`的文件中报错的问题，该问题产生的原因是`unocss`各个依赖的版本不一致的问题。
