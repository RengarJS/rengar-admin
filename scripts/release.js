#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 获取命令行参数
const args = process.argv.slice(2);
const versionType = args[0];

if (!versionType) {
  console.error('请提供版本类型: major, minor, patch 或具体的版本号 (例如 1.2.3)');
  process.exit(1);
}

try {
  // 读取 package.json 获取当前版本
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;
  
  console.log(`当前版本: ${currentVersion}`);
  
  // 执行 pnpm version 命令
  console.log(`正在更新版本到: ${versionType}`);
  execSync(`pnpm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });
  
  // 读取新版本
  const newPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const newVersion = newPackageJson.version;
  
  console.log(`新版本: ${newVersion}`);
  
  // 创建 git commit
  execSync('git add package.json', { stdio: 'inherit' });
  execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: 'inherit' });
  
  // 创建 git tag
  execSync(`git tag -a v${newVersion} -m "v${newVersion}"`, { stdio: 'inherit' });
  
  // 推送到远程仓库
  execSync('git push', { stdio: 'inherit' });
  execSync('git push --tags', { stdio: 'inherit' });
  
  console.log(`✅ 版本 v${newVersion} 发布成功!`);
} catch (error) {
  console.error('❌ 版本发布失败:', error.message);
  process.exit(1);
}