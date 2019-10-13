<template>
  <!-- tabbar 标签栏 -->
  <div class="tabbar">
    <!-- 子路由出口 -->
    <router-view />

    <!-- 底部导航 -->
    <van-tabbar>
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
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
