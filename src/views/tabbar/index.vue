<template>
  <!-- tabbar 标签栏 -->
  <div class="tabbar">
    <!-- 子路由出口 -->
    <keep-alive>
      <router-view />
    </keep-alive>

    <!-- 底部导航 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o"
                       to="/tabbar">首页</van-tabbar-item>
      <van-tabbar-item icon="search">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o"
                       to="/my">{{ $store.state.user ? '我的' : '未登录' }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Tabbar'
}
</script>

<style>
</style>
