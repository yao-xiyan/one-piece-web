import axios from 'axios'
import jsonBig from 'json-bigint'
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
// 导出这个请求对象，哪里需要发送请求，哪里就加载使用
export default request

/**
 * 请求拦截器
 */

/**
 * 响应拦截器
 */
