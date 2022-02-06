# monorepos-template

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

该 monorepos 项目模板适用于以下场景：

- Vue 组件、原生 js 组件
- 统一的版本号
- 统一的构建流程
- 统一的发布流程
- workspaces 协议
- 仅使用 pnpm

[toc]

## 项目结构

```bash
.
├── packages
│   ├── example1              // 包名
│   │   ├── src               // 包的源码
│   │   ├── stories           // 包的story文件
│   │   └── package.json      // 包声明
│   └── ...
├── scripts
│   ├── build.js              // 构建脚本
│   ├── dev-link.js           // 本地调试脚本
│   └── release.js            // 发布脚本
├── babel.config.js           // 构建时使用的babel配置
├── commitlint.config.js      // commit message校验
└── webpack.config.js
├── tsconfig.json             // 统一的typescript配置
├── pnpm-lock.yaml            // pnpm 依赖锁定文件
├── pnpm-workspace.yaml       // pnpm workspace配置
├── README.md                 // 项目文档
├── package.json
```

## CLI 脚本

- dev 使用 storybook 对 packages 进行本地调试
- build 构建生产环境
- release 发布包至生产环境
- dev-link 链接所有的 packages 到本地仓库，使得其他项目可以通过包管理器的 link 命令，在实际项目中调试本项目的包。

### dev 本地调试开发

本地调试开发使用的是 storybook 来作为本地组件调试。

对于纯 js 的包，应该采用 nodejs 来进行调试。

### build 生产环境构建

提供生产环境打包，生产环境打包使用**rollup**做为打包工具。

静态资源的打包策略：

- 输出目录：统一输出到每个 package 的**dist**文件夹下
- 输出格式：esm、umd 模块化方案
- 静态资源：统一输出到每个 package 的**dist**文件夹下

### release 版本发布

对仓库中的 packages 版本发布工作。

对于版本控制使用的策略为**全仓库统一版本号**，适用 workspace 的根 package.json 声明的**版本号**作为每个 workspace 的版本号。

release 脚本提供如下流程：

1. 选择一个要发布的版本类型
2. 执行单元测试
3. 执行构建操作
4. 更新所有将要发布包的版本号，以及依赖它们的 workspace 的版本号
5. git 分支打版本 tag，并提交到远程分支
6. 发布所有的包
