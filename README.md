# monorepos-template

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


vue组件的monorepos模板工程，适用于浏览器原生组件、Vue 2.x组件的开发，以及他们的混合开发。

**仅仅支持浏览器端的组件的开发**

[toc]


## 项目结构

```bash
.
├── README.md
├── babel.config.js
├── commitlint.config.js
├── package.json
├── packages
│   ├── example1
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── Example1.vue
│   │   │   ├── index.ts
│   │   │   └── shim.d.ts
│   │   ├── stories
│   │   │   └── example1.stories.ts
│   │   └── tsconfig.json
│   └── example2
│       ├── package.json
│       ├── src
│       │   ├── Example2.vue
│       │   ├── index.ts
│       │   └── shim.d.ts
│       ├── stories
│       │   └── example2.stories.ts
│       └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── scripts
│   ├── build.js
│   ├── dev-link.js
│   ├── release.js
│   └── utils
│       ├── build.js
│       └── workspaces.js
├── tsconfig.json
└── webpack.config.js
```

## CLI脚本

- dev 本地调试环境
- build 生产环境打包
- release 发包
- dev-link 链接所有的packages到本地仓库，使得其他项目可以通过包管理器的link命令，在实际项目中调试本项目的包。

### dev 本地调试开发

本地调试开发使用的是storybook来作为本地组件调试

### build 生产环境构建

提供生产环境打包，生产环境打包使用**rollup**做为打包工具。

静态资源的打包策略：

- 输出目录：统一输出到每个package的**dist**文件夹下
- 输出格式：esm、umd模块化方案
- 静态资源：统一输出到每个package的**dist**文件夹下

### release 版本发布

对仓库中的packages版本发布工作。

对于版本控制使用的策略为**全仓库统一版本号**，适用workspace的根package.json声明的**版本号**作为每个workspace的版本号。

release脚本提供如下流程：

  1. 选择一个要发布的版本类型
  2. 执行单元测试
  3. 执行构建操作
  4. 更新所有将要发布包的版本号，以及依赖它们的workspace的版本号
  5. git分支打版本tag，并提交到远程分支
  6. 发布所有的包
