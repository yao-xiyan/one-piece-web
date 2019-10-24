<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
      <van-cell v-for="(item,index) in list"
                :key="index"
                :title="item.aut_name">
        <van-image slot="icon"
                   round
                   width="30"
                   height="30"
                   style="margin-right: 10px;"
                   :src="item.aut_photo" />
        <span style="color: #466b9d;"
              slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{ item.pubdate | relativeTime }}</span>
            <van-button size="mini"
                        @click="onReplyShow(item)"
                        type="default">回复 {{ item.reply_count }}</van-button>
          </p>
        </div>
        <!-- 已经点赞为实心  空心-o -->
        <van-icon slot="right-icon"
                  :name="item.is_liking ? 'like' : 'like-o'"
                  @click="onCommentLike(item)" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable
                 v-model="commentText"
                 placeholder="请输入评论内容">
        <van-button slot="button"
                    size="mini"
                    @click="onAddComment"
                    type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow"
               round
               position="bottom"
               :style="{ height: '90%' }">
      <!-- 弹层组件 -->
      <comment-reply :comment="currentComment"
                     v-if="isReplyShow"
                     @close="isReplyShow = false" />
    </van-popup>
    <!-- /评论回复 -->

  </div>
</template>

<script>
// 加载调用
import {
  getComments,
  addComments,
  addCommentsLike,
  unCommentsLike } from '@/api/comment'
import CommentReply from './comment-reply'

export default {
  name: 'ArticleComment',
  components: {
    CommentReply
  },
  props: {},
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 默认没有东西
      commentText: '', // 评论内容
      isReplyShow: false, // 控制弹层
      currentComment: {} // 查看回复的当前评论
    }
  },

  methods: {
    /**
     * 展示评论列表
     */
    async onLoad () {
      const { data } = await getComments({
        // 1. 请求数据
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.$route.params.articleId, // 源id，文章id或评论id
        offset: this.offset // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        // limit获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      console.log(data)

      // 2.将数据添加到数组中
      // 延展操作符
      this.list.push(...data.data.results)
      // 3.结束 loading
      this.loading = false
      // 4.判断是否加载结束
      data.data.results.length ? this.offset = data.data.last_id : this.finished = true
      // // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
    },

    /**
     * 发布评论
     */
    async onAddComment () {
      // 获取评论内容
      const commentText = this.commentText.trim()
      if (!commentText) {
        return
      }

      // 请求提交
      const { data } = await addComments({
        target: this.$route.params.articleId, // 必须评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: commentText // 必须评论内容
        // art_idinteger非必文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })
      // 将最新添加的评论数据放到顶部展示
      this.list.unshift(data.data.new_obj)

      // 清空文本框
      this.commentText = ''
    },

    /**
    * 评论点赞/取消点赞
    */
    async onCommentLike (comment) {
      // if (comment.is_liking) {
      // 如果点赞 则取消
      //   await unCommentsLike(comment.com_id.toString())
      // } else {
      //   await addCommentsLike(comment.com_id.toString())
      // }
      comment.is_liking ? await unCommentsLike(comment.com_id.toString()) : await addCommentsLike(comment.com_id.toString())

      // 更新视图
      comment.is_liking = !comment.is_liking
    },

    /**
        * 展示回复弹层
        */
    onReplyShow (comment) {
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
