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
      <van-cell v-for="(item,index) in searchSuggestions"
                :key="index"
                icon="search">
        <div v-html="item"
             solt="title"></div>
      </van-cell>
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
      searchSuggestions: [], // 联想建议列表
      htmlStr: '<h1>Hello World</h1>'
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

      const searchSuggestions = data.data.options
      // 根据一个字符串创建一个正则表达对象
      // 动态创建正则表达式
      const reg = new RegExp(searchText.toLowerCase(), 'g')

      searchSuggestions.forEach((item, index) => {
        searchSuggestions[index] = item.toLowerCase().replace(reg, `<span style="color: red">${searchText}</span>`)
      })
      this.searchSuggestions = searchSuggestions
    }
  }
}
</script>

<style>
</style>
