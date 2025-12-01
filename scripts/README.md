# 版本发布脚本使用说明

## 功能说明

本脚本用于自动化版本发布流程，包括：
1. 更新 package.json 中的版本号
2. 提交版本更新到 Git
3. 创建对应的 Git tag
4. 推送更改到远程仓库

## 使用方法

### 方法一：使用自定义 release 脚本（推荐）

```bash
# 发布补丁版本 (1.0.0 -> 1.0.1)
pnpm release patch

# 发布小版本 (1.0.1 -> 1.1.0)
pnpm release minor

# 发布大版本 (1.1.0 -> 2.0.0)
pnpm release major

# 发布指定版本
pnpm release 2.0.1
```

### 方法二：直接使用 pnpm version（会自动触发 postversion 钩子）

```bash
# 发布补丁版本 (1.0.0 -> 1.0.1)
pnpm version patch

# 发布小版本 (1.0.1 -> 1.1.0)
pnpm version minor

# 发布大版本 (1.1.0 -> 2.0.0)
pnpm version major

# 发布指定版本
pnpm version 2.0.1
```

## 工作原理

1. 当使用 `pnpm version` 命令时，会自动触发 `postversion` 钩子
2. `postversion` 钩子会执行 `git push && git push --tags` 命令
3. 当使用 `pnpm release` 命令时，会执行自定义的 release.js 脚本，提供更多控制和信息输出

## 注意事项

1. 确保当前 Git 工作区是干净的（没有未提交的更改）
2. 确保有足够的权限推送到远程仓库
3. 脚本会自动推送新的 commits 和 tags 到远程仓库，请确保网络连接正常