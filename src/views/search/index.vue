<template>
  <div class="search">
    <!-- 搜索框 -->
    <van-search placeholder="请输入搜索关键词"
                show-action
                shap="round"
                v-model="searchText"
                @search="onSearch(searchText)"
                @input="onSearchInput">
      <div slot="action"
           @click="onSearch(searchText)">搜索</div>
    </van-search>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell v-for="(item,index) in searchSuggestions"
                :key="index"
                @click="onSearch(item)"
                icon="search">
        <div v-html="highlight(item)"
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
      searchSuggestions: [] // 联想建议列表
    }
  },
  methods: {
    onSearch (str) {
      this.$router.push(`/search/${str}`)
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
      // const reg = new RegExp(searchText.toLowerCase(), 'g')

      // searchSuggestions.forEach((item, index) => {
      //   searchSuggestions[index] = item.toLowerCase().replace(reg, `<span style="color: red">${searchText}</span>`)
      // })
      this.searchSuggestions = searchSuggestions
    },
    highlight (str) {
      const reg = new RegExp(this.searchText.toLowerCase(), 'g')

      return str.toLowerCase().replace(reg, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style>
</style>
