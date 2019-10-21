import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/datetime'
import { Button, Cell, CellGroup, NavBar, Field, Toast, Icon, Tabbar, TabbarItem, Tab, Tabs, List, PullRefresh, Grid, GridItem, Image, lazyload, Popup, Search, Loading } from 'vant'
import './styles/index.less'
// 表单验证
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate' // 核心组件
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules' // 中文包

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}

// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// 扩展自定义校验规则
// extend('规则名称',配置对象)
extend('phone', {
  // 验证方法， value是需要校验的数据，返回一个布尔值，表示验证成功与否
  validate: function (value) {
    return /^1\d{10}$/.test(value)
  },
  message: '请输入有效的手机号码'
})

// 全局注册 vant 组件
Vue.use(Button) // 按钮
  .use(Cell) // 单元格
  .use(CellGroup) // 单元格组件
  .use(NavBar) // 导航栏
  .use(Field) // 输入框
  .use(Toast) // 轻提示
  .use(Icon) // 字体图标
  .use(Tabbar) // 底部标签栏
  .use(TabbarItem) // 底部标签栏
  .use(Tab) // 标签栏
  .use(Tabs) // 标签栏
  .use(List) // 列表
  .use(PullRefresh) // 下拉列表
  .use(Grid) // 宫格
  .use(GridItem) // 宫格
  .use(Image) // 图片
  .use(lazyload) // 图片懒加载
  .use(Popup) // 弹出层
  .use(Search) // 搜索框
  .use(Loading) // 加载loading
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
