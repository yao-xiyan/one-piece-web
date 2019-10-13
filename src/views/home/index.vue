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
      <van-tab title="推荐">
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
      <van-tab title="热门话题">热门话题</van-tab>
      <van-tab title="科技动态">科技动态</van-tab>
      <van-tab title="区块链">区块链</van-tab>
    </van-tabs>
    <!-- 频道列表 -->

  </div>
</template>

<script>
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 默认选中第几个
      list: [],
      loading: false,
      finished: false
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
    }
  }
}
</script>

<style>
</style>
