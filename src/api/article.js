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

/**
 * 获取文章详情
 */
export function getArticle (articleId) {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`

  })
}

/**
 * 对文章点赞
 */
export function addLike (articleId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}
/**
 * 取消对文章点赞
 */
export function unLike (articleId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}
