import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
// import { login } from 'util'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储用户相关相关信息 （包括token）
    // user: null 写死了
    user: getItem('user')

  },
  mutations: {
    // 传入两个形参
    setUser (state, user) {
      state.user = user

      // 吧数据备份到本地存储防止页面刷新丢失
      setItem('user', user)
      console.log(getItem)
    }
  },
  actions: {

  }
})
