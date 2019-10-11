# one-piece

- 移动端项目

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 目录结构

```
├── babel.config.js	babel配置文件
├── package-lock.json	npm相关文件
├── package.json	npm相关文件
├── postcss.config.js	postcss配置文件
├── public	静态资源托管目录
│   ├── favicon.ico
│   └── index.html
├── README.md	项目说明文件
└── src	源码
    ├── App.vue	根组件
    ├── assets	资源目录
    ├── components	组件目录
    ├── main.js	入口文件
    ├── router.js	路由模块
    ├── store.js	vuex容器模块
    └── views  视图组件目录
```

### 调整目录结构

- 删除初始化的默认文件
- 新增我们需要的目录结构

```
├── babel.config.js	babel配置文件
├── package-lock.json	npm相关文件
├── package.json	npm相关文件
├── postcss.config.js	postcss配置文件
├── public	静态资源托管目录
│   ├── favicon.ico
│   └── index.html
├── README.md	项目说明文件
└── src	源码
    ├── api	请求接口封装模块
    ├── App.vue	根组件
    ├── assets	资源目录
    ├── components	组件目录
    ├── main.js	入口文件
    ├── router	路由模块
    ├── store	 Vuex容器模块
    ├── styles 样式目录
    ├── utils  工具模块目录
    └── views  视图组件目录
```

在 src 中创建几个目录：

- api
  - 存储请求函数模块
- router
  - 路由文件模块
- store
  - Vuex 容器模块
- styles
  - 样式文件模块
- utils
  - 工具函数模块

将 App.vue 修改为：

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script></script>

<style></style>
```

将 router.js 移动到 router 目录并重命名为 index.js，修改为如下代码：

```vue
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: []
})

export default router
```

将 store.js 移动到 store 目录重命名为 index.js（原来代码保持不变）。

删除默认生成的一些文件：

- components/HelloWorld.vue
- views/Home.vue
- views/About.vue
- assets/logo.png

Git 只能管理文件，对于空目录不会进行版本管理，所以建议在空目录中添加一个 `.gitkeep` 空文件以保持提交历史中的目录结构。

