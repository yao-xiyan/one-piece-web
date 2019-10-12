import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button, Cell, CellGroup, NavBar, Field, Toast } from 'vant'
import './styles/index.less'

Vue.use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Field)
  .use(Toast)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
