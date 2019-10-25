/**
 * 用户相关接口封装模块
 * 最佳实践：建议将所有请求都封装成一个一个的小函数，在需要的时候直接调用
 *   好处：1. 好维护，统一管理 2. 可重用
 * 遵循一个原则：不要直接在组件中发请求，都封装成函数进行调用
 */
import request from '@/utils/request'

export const login = (data) => {
  // 其它逻辑。。。
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

/**
 * 关注用户请求
 */

export const followUser = userId => {
  return request({
    // method 用来制定请求方法， 这是 axios 的固定 API，不能瞎写
    method: 'POST',
    // url 用来指定请求路径
    url: `/app/v1_0/user/followings`,
    // data 是 axios 请求要求的字段名，用来传递请求体数据的
    data: {
      // 用户参数 被关注的用户 Id
      target: userId
    }
  })
}

/**
 * 取消关注用户请求
 */

export const unFollowUser = (userId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

/**
 * 获取用户自己信息
 */

export const getSelf = (userId) => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user`
  })
}

/**
 * 获取用户个人资料
 */

export const getProfile = (userId) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}
