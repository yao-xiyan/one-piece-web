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
              animated
              swipeable
              v-model="active">

      <!-- 面包按钮 -->
      <div slot="nav-right"
           class="wap-nav"
           @click="isChannelShow = true">
        <van-icon name="wap-nav"
                  size="24" />
      </div>
      <!-- /面包按钮 -->

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
            <!-- 内容列表 -->
          </van-list>
        </van-pull-refresh>
        <!-- 文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- 频道列表 -->

    <!-- 频道管理 -->
    <van-popup v-model="isChannelShow"
               round
               position="bottom"
               :style="{ height: '95%' }"
               closeable
               close-icon-position="top-left">
      <div class="channel-container">
        <van-cell title="我的频道"
                  :border="false">
          <van-button type="danger"
                      size="mini"
                      @click="isEditShow = !isEditShow">{{ isEditShow ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="(channel, index) in channels"
                         :key="index"
                         :text="channel.name"
                         @click="onMyChannelClick(index)">
            <van-icon v-show="isEditShow"
                      class="close-icon"
                      slot="icon"
                      name="close" />
          </van-grid-item>
        </van-grid>

        <van-cell title="推荐频道"
                  :border="false" />
        <van-grid :gutter="10">
          <van-grid-item v-for="(channel, index) in recommondChannels"
                         :key="index"
                         :text="channel.name"
                         @click="onAddChannel(channel)" />
        </van-grid>
      </div>
    </van-popup>
    <!-- /频道管理 -->

  </div>
</template>

<script>
import { getDefaultChannels, getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { setItem, getItem } from '@/utils/storage'

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
      isChannelShow: false, // 这里先设置为 true 就能看到弹窗的页面了
      allChannels: [], // 所有频道列表
      isEditShow: false // 频道的编辑状态
    }
  },
  watch: {
    // 函数名就是要监视数据成员名称
    channels (newVal) {
      setItem('channels', newVal)
    }
  },
  // 计算属性获取剩余频道
  computed: {
    /**
 * 获取推荐频道列表
 */
    recommondChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        // 判断 channel 是否存在我的频道中
        // 如果不存在，就证明它是剩余推荐的频道

        // 数组的 find 方法
        // 它会遍历数组，每遍历一次，它就判定 item.id === channel.id
        // 如果 true，则停止遍历，返回满足该条件的元素
        // 如果 false，则继续遍历
        // 如果直到遍历结束都没有找到符合 item.id === channel.id 条件的元素，则返回 undefined
        const ret = this.channels.find(item => item.id === channel.id)
        if (!ret) {
          arr.push(channel)
        }
      })
      return arr
      // return 所有频道 - 我的频道
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
     * 加载我的频道列表
     */
    async loadChannels () {
      let channels = []

      // 读取本地存储中的频道列表
      const localChannels = getItem('channels')
      if (localChannels) {
        channels = localChannels
      } else {
        const { data } = await getDefaultChannels()
        channels = data.data.channels
      }

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
    },
    /**
 * 获取所有频道列表
 */
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    /**
 * 添加频道
 */
    onAddChannel (channel) {
      // 将频道添加到我的频道中
      this.channels.push(channel)
    },
    /**
 * 我的频道项点击处理函数
 */
    onMyChannelClick (index) {
      if (this.isEditShow) {
        // 如果是编辑状态，删除频道
        this.channels.splice(index, 1)
      } else {
        // 如果是非编辑状态，切换频道展示

        // 切换当前激活的频道
        this.active = index

        // 关闭频道弹层
        this.isChannelShow = false
      }
    }
  },
  created () {
    // 获取频道列表
    this.loadChannels()

    // 获取所有频道
    this.loadAllChannels()
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

  /** 展示频道的菜单按钮 */
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }

  /* 标签组件的根节点的类名 */
  .van-tabs {
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 15px;
    }

    /deep/ .van-tabs__content {
      margin-top: 90px;
      margin-bottom: 50px;
    }
  }

  .channel-container {
    padding-top: 30px;
    .close-icon {
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }
}
</style>
