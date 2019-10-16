<template>
  <div class="search">
    <!-- 搜索框 -->
    <van-search placeholder="请输入搜索关键词"
                show-action
                shap="round"
                v-model="searchText"
                @search="onSearch"
                @input="onSearchInput" />
    <div slot="action"
         @click="onSearch"></div>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell :title="item"
                v-for="(item,index) in searchSuggestions"
                :key="index"
                icon="search" />
    </van-cell-group>

    <!-- /联想建议 -->

  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      searchSuggestions: [] // 联想建议列表
    }
  },
  methods: {
    onSearch () {
      console.log('onSearch')
    },

    async onSearchInput () {
      // 字符串清除空格
      const searchText = this.searchText.trim()
      // 做优化 如果为空字符串直接返回
      if (!searchText) {
        return
      }

      const { data } = await getSearchSuggestions({
        q: this.searchText
      })

      this.searchSuggestions = data.data.options
    }
  }
}
</script>

<style>
</style>
