<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar fixed
                 left-arrow
                 @click-left="$router.back()"
                 title="文章详情"></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading class="article-loading"
                 v-if="loading" />
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div class="detail"
         v-else-if="article.title">
      <!-- 文章标题 -->
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round
                   width="2rem"
                   height="2rem"
                   fit="fill"
                   :src="article.aut_photo" />
        <div class="text">
          <!-- 文章作者 -->
          <p class="name">{{ article.aut_name }}</p>
          <!-- 文章发布日期 -->
          <p class="time">{{ article.pubdate | relativeTime }}</p>
        </div>
        <van-button round
                    size="small"
                    @click="onFollow"
                    type="info">{{ article.is_followed ? '取消关注' : '+ 关注'}}</van-button>
      </div>
      <!-- 文章内容 -->
      <div class="content"
           v-html="article.content"></div>
      <div class="zan">
        <van-button round
                    size="small"
                    hairline
                    type="primary"
                    plain
                    :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'"
                    @click="
                    onLike()">{{ article.attitude === 1 ? '取消点赞' : '+ 点赞' }}</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round
                    size="small"
                    hairline
                    type="danger"
                    plain
                    icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败的消息提示 -->
    <div class="error"
         v-else>
      <!-- prevent 防止 a 链接的默认行为
            stop 阻止冒泡
      -->
      <p>网络超时，点击 <a href="#"
           @click.prevent="loadArticle">刷新</a> 试一试。</p>
    </div>
    <!-- /加载失败的消息提示 -->
  </div>
</template>

<script>
import { getArticle, addLike, unLike } from '@/api/article' // 引入获取文章详情请求
import { followUser, unFollowUser } from '@/api/user'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: { // 文章详情
        // title: 'hello world',
        // content: '<p>hello hello</p>',
        // aut_name: 'LPZ',
        // pubdate: '4天前',
        // aut_photo: 'http://toutiao.meiduo.site/FsyeQUotMscq-vji-2ZDiXrc44k5'
      }
    }
  },

  created () {
    this.loadArticle()
  },

  methods: {
    async loadArticle () {
      // 开启 loading
      this.loading = true
      try {
        const { data } = await getArticle(this.$route.params.articleId)

        console.log(data)

        this.article = data.data
      } catch (err) {
        // 如果请求出错就意味着获取请求数据失败了，我们这里可以提示用户加载失败
        console.log(err)
      }

      // 无论是加载成功还是失败， loading 都需要结束
      this.loading = false
    },

    // 关注
    async onFollow () {
      // if (this.article.is_followed) {
      //   // 如果已经关注，则取消关注
      //   await unFollowUser(this.article.aut_id)
      // } else {
      //   // 如果没有关注，则关注
      //   await followUser(this.article.aut_id)
      // }
      this.article.is_followed ? await unFollowUser(this.article.aut_id) : await followUser(this.article.aut_id)
      this.article.is_followed = !this.article.is_followed
    },

    // 点赞
    async onLike () {
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 1) {
        // 如果已赞，则取消点赞
        await unLike(articleId)
        this.article.attitude = -1
      } else {
        // 否则点赞
        await addLike(articleId)
        this.article.attitude = 1
      }
    }
  }
}
</script>

<style scoped lang='less'>
.article-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error {
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan {
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
  }
}
</style>
