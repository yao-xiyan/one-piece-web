<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />

    <!-- 导航栏 -->

    <!-- 频道列表 -->
    <van-tabs color="#3296fa"
              line-height="6px"
              line-width="30px"
              v-model="active">
      <van-tab :title="channel.name"
               v-for="channel in channels"
               :key="channel.id">
        <!-- 文章列表 -->
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
          <van-cell v-for="item in channel.articles"
                    :key="item"
                    :title="item" />
        </van-list>
        <!-- 文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- 频道列表 -->

  </div>
</template>

<script>
import { getDefaultChannels } from '@/api/channel'

export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 默认选中第几个
      // list: [], // 数据列表
      // loading: false,
      // finished: false,
      channels: [] // 频道列表
    }
  },
  methods: {
    onLoad () {
      const activeChannel = this.channels[this.active]
      // 1. 请求获取数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          // 2. 将数据添加到当前频道.articles 中
          activeChannel.articles.push(activeChannel.articles.length + 1)
        }
        // 3. 结束本次 loading
        activeChannel.loading = false
        // 4. 判断数据是否已全部加载结束，如果没有数据了，将finish 设置为 true
        if (activeChannel.articles.length >= 40) {
          activeChannel.finished = true
        }
      }, 2000)
    },
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

    async loadChannels () {
      const { data } = await getDefaultChannels()
      const channels = data.data.channels
      console.log(data)
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
      })
      this.channels = channels
    }

  },
  created () {
    // 获取频道列表
    this.loadChannels()
  }
}
</script>

<style>
</style>
