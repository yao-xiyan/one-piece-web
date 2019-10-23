/**
 * 频道相关接口模块
 */

import request from '@/utils/request'

/**
 *
 * 获取评论或评论回复
 */
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

/**
 *
 * 添加评论或评论回复
 */
export const addComments = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}

/**
 *
 * 对评论或评论回复点赞
 */
export const addCommentsLike = commentId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

/**
 *
 * 取消添加评论或评论回复点赞
 */
export const unCommentsLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}
