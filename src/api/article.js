/**
 * 获取文章相关接口模块
 */

import request from '@/utils/request'

/**
 * 获取当前用户文章列表
 */
export function getArticles (params) {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params

  })
}
