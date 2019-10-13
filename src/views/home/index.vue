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
      <van-tab :title="item.name"
               v-for="item in channels"
               :key="item.id">
        <!-- 文章列表 -->
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad">
          <van-cell v-for="item in list"
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
      list: [], // 数据列表
      loading: false,
      finished: false,
      channels: [] // 频道列表
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 10) {
          this.finished = true
        }
      }, 500)
    },

    async loadChannels () {
      const { data } = await getDefaultChannels()
      console.log(data)
      this.channels = data.data.channels
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
