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
    <van-cell-group v-if="searchText">
      <van-cell v-for="(item,index) in searchSuggestions"
                :key="index"
                @click="onSearch(item)"
                icon="search">
        <!--
          这里不能使用过滤器
          因为过滤器只能用于 {{}}、v-bind
         -->
        <div v-html="highlight(item)"
             solt="title"></div>
      </van-cell>
    </van-cell-group>

    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template v-if="isDeleteShow">
          <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </template>

        <van-icon v-else
                  name="delete"
                  @click="isDeleteShow = true" />
        <!-- <van-icon name="delete"
                  v-show="isDeleteShow" /> -->
      </van-cell>
      <van-cell v-for="item in searchHistories"
                :key="item"
                :title="item"
                @click="onSearch(item)">

        <van-icon name="close"
                  v-show="isDeleteShow"
                  @click.stop="searchHistories.splice(index, 1)" />
      </van-cell>
    </van-cell-group>

    <!-- /搜索历史记录 -->

  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      searchSuggestions: [], // 联想建议列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: [] // 控制删除的显示状态
    }
  },

  watch: {
    searchHistories (newVal) {
      setItem('search-histories', newVal)
    }
  },

  methods: {
    onSearch (str) {
      // 存储搜索历史记录
      // 如果搜索历史记录中已存在，则直接移除
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 把最新的记录存储到数组的顶部
      this.searchHistories.unshift(str)

      // 持久化存储
      setItem('search-histories', this.searchHistories)

      // 跳转到搜索结果页面
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
