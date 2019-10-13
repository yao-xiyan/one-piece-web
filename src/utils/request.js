import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'
// axios.create 方法
// 建议使用create方式，我们可以拥有
// 复制了一个axios， 拥有和axios完全一样的功能，但是配置可以不一样
// 例如我们可以创建多个请求对象，而不同的请求对象拥有不同的baseURL
// 我们可以有 a 请求的拦截器，也可以专门定制 b 请求的拦截器

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
/**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */

request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {} // 换了一个转化方法 使得计算更精确 保证id不失真
}]

/**
 * 请求拦截器,请求到达后台之前拦截
 */
request.interceptors.request.use(function (config) {
  // 在发起请求请做一些业务处理
  // config是要发送请求的配置信息
  const user = store.state.user
  if (user) {
    // Authorization 是后端要求的名字，不能瞎写
    // 数据值 "Bearer空格token" 也是后端要求的数据格式，不能瞎写
    // 千万!千万!千万!注意，Bearer 和 token 之间的空格不能少
    // 什么意义？这是后端要求的，我们决定不了。
    config.headers['Authorization'] = `Bearer ${user.token}` // 统一注入token 到headers属性 因为所有接口要求的token格式是一样的
  }
  return config
}, function (error) {
  // 对请求失败做处理
  return Promise.reject(error)
})

/**
 * 响应拦截器
 */

// 导出这个请求对象，哪里需要发送请求，哪里就加载使用
export default request
