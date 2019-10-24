<template>
  <div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count + ' 条回复'">
      <van-icon slot="left"
                name="cross"
                @click="$emit('close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
      <van-image slot="icon"
                 round
                 width="30"
                 height="30"
                 style="margin-right: 10px;"
                 :src="comment.aut_photo" />
      <span style="color: #466b9d;"
            slot="title">{{ comment.aut_name }}</span>
      <div slot="label">
        <p style="color: #363636;">{{ comment.content }}</p>
        <p>
          <span style="margin-right: 10px;">{{ comment.pudate | relativeTime }}</span>
          <!-- <van-button size="mini"
                      type="default">回复 {{ comment.reply_count }}</van-button> -->
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->

    <van-cell title="全部评论" />

    <!-- 回复列表 -->
    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
      <van-cell v-for="(item, index) in list"
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
          </p>
        </div>
        <van-icon slot="right-icon"
                  :name="item.is_liking ? 'like' : 'like-o'"
                  @click="onCommentLike(item)" />
      </van-cell>
    </van-list>
    <!-- 回复列表 -->

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field v-model="commentText"
                 clearable
                 placeholder="请输入评论内容">
        <van-button slot="button"
                    size="mini"
                    type="info"
                    @click="onAddComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
  </div>
</template>

<script>
// 加载调用
import {
  getComments,
  addComments,
  addCommentsLike,
  unCommentsLike } from '@/api/comment'

export default {
  name: 'CommentReply',
  props: ['comment'],
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 默认没有东西
      commentText: '' // 评论内容
    }
  },

  methods: {
    /**
     * 展示评论列表
     */
    async onLoad () {
      const { data } = await getComments({
        // 1. 请求数据
        type: 'c', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.comment.com_id.toString(), // 源id，文章id或评论id
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
        target: this.comment.com_id.toString(), // 必须评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: commentText, // 必须评论内容
        art_id: this.$route.params.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })
      // 将最新添加的评论数据放到顶部展示
      this.list.unshift(data.data.new_obj)

      // 清空文本框
      this.commentText = ''

      // 更新当前评论的回复数量
      this.comment.reply_count++
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
