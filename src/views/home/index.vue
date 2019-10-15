<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页"
                 fixed />

    <!-- 导航栏 -->

    <!-- 频道列表 -->
    <van-tabs color="#3296fa"
              line-height="6px"
              line-width="30px"
              v-model="active">

      <!-- 外层遍历频道 -->
      <van-tab :title="channel.name"
               v-for="channel in channels"
               :key="channel.id">
        <!-- 文章列表 -->

        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="channel.isPullDownLoading"
                          @refresh="onRefresh">
          <!--
          v-model="loading" 控制上拉加载更多的 loading 效果
          :finished="finished" 控制是否已加载结束
          finished-text="没有更多了"  加载结束的提示文本
          @load="onLoad" 上拉加载更多触发的事件

          列表组件会在初始化的时候自动触发 load 事件从而调用 onload 方法
         -->
          <van-list v-model="channel.loading"
                    :finished="channel.finished"
                    finished-text="没有更多了"
                    @load="onLoad">
            <!-- 列表内容 -->
            <!--
              key 只能是数字或者字符串，不能是数组或对象
             -->
            <!-- 内层遍历频道列表 -->
            <van-cell v-for="article in channel.articles"
                      :key="article.art_id.toString()"
                      :title="article.title">
              <div slot="label">
                <van-grid :border="false"
                          :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images"
                                 :key="index">
                    <van-image lazy-load
                               height="80"
                               :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime }}</span>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
        <!-- 文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- 频道列表 -->
    <!-- 编辑频道 -->
    <van-popup v-model="isChannelEditShow"
               position="bottom"
               :style="{ height: '95%' }"
               round />
    <!-- /编辑频道 -->

  </div>
</template>

<script>
import { getDefaultChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 默认选中第几个
      // 放到当前频道中
      // list: [], // 数据列表
      // loading: false,
      // finished: false,
      channels: [], // 频道列表
      isChannelEditShow: true // 这里先设置为 true 就能看到弹窗的页面了
    }
  },
  methods: {
    async onLoad () {
      // this.channels[this.active]
      // 当前激活的频道对象[下表索引相对应]
      const activeChannel = this.channels[this.active]
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: activeChannel.id, // 频道ID
        timestamp: activeChannel.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      console.log(data)

      // 2. 将数据添加到当前频道.articles 中
      activeChannel.articles.push(...data.data.results)
      // 3. 结束本次 loading
      activeChannel.loading = false
      // 4. 判断数据是否已全部加载结束，如果没有数据了，将finish 设置为 true
      if (data.data.pre_timestamp) {
        // 更新获取下一下数据的页码时间戳
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        // 如果没有下一页数据，就意味着后面没有数据了
        activeChannel.finished = true
      }
    },
    // onLoad () {
    //   // this.channels[this.active]
    //   // 当前频道[下表索引相对应]
    //   const activeChannel = this.channels[this.active]
    //   // 1. 请求获取数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       // 2. 将数据添加到当前频道.articles 中
    //       activeChannel.articles.push(activeChannel.articles.length + 1)
    //     }
    //     // 3. 结束本次 loading
    //     activeChannel.loading = false
    //     // 4. 判断数据是否已全部加载结束，如果没有数据了，将finish 设置为 true
    //     if (activeChannel.articles.length >= 40) {
    //       activeChannel.finished = true
    //     }
    //   }, 2000)
    // },
    // onLoad () {
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }
    //     // 加载状态结束
    //     // 每次数据加载完毕，列表组件都会判断数据是否满足一屏了
    //     // 如果当前数据不满足一屏， 它就继续 onload
    //     // this.loading = false
    //     this.loading = false

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 2000)
    // },

    /**
     * 加载频道
     */
    async loadChannels () {
      const { data } = await getDefaultChannels()
      const channels = data.data.channels
      console.log(data)
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
        channel.timestamp = null // 用于获取下一页数据的时间戳（页码）
        channel.isPullDownLoading = false // 下拉刷新的状态
      })
      this.channels = channels
    },

    /**
     * 下拉刷新
     */
    async onRefresh () {
      const activeChannel = this.channels[this.active]
      // 1. 请求获取最新推荐的文章列表
      const { data } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 2. 将数据添加到文章列表顶部
      activeChannel.articles.unshift(...data.data.results)
      // 3. 关闭下拉刷新的loading 的状态
      activeChannel.isPullDownLoading = false
      // 提示
      this.$toast('刷新成功')
    }
  },
  created () {
    // 获取频道列表
    this.loadChannels()
  }
}
</script>

<style lang="less">
.home {
  .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .meta span {
      margin-right: 10px;
    }
  }

  .van-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 15px;
    }

    .van-tabs__content {
      margin-top: 90px;
      margin-bottom: 50px;
    }
  }
}
</style>
