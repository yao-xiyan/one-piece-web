/**
 * 搜索相关接口模块
 */
import request from '@/utils/request'

/**
 * 获取联想词请求模块
 */
export function getSearchSuggestions (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })
}

/**
 * 获取请求搜索结果模块
 */
export function getSearch (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
