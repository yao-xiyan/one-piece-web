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
    <!-- 如果 searchText 如果有内容为 true  显示联想建议 -->
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
      <!-- 删除状态显示 -->
      <van-cell title="历史记录">
        <template v-if="isDeleteShow">
          <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </template>
        <!-- 非删除状态显示 -->
        <van-icon v-else
                  name="delete"
                  @click="isDeleteShow = true" />
        <!-- <van-icon name="delete"
                  v-show="isDeleteShow" /> -->
      </van-cell>
      <van-cell v-for="(item, index) in searchHistories"
                :key="item"
                :title="item"
                @click="onSearch(item)">
        <!-- @click.stop 组织冒泡 -->
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
import { debounce } from 'lodash'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      searchSuggestions: [], // 联想建议列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false // 控制删除的显示状态
    }
  },

  watch: {
    searchHistories (newVal) {
      setItem('search-histories', newVal)
    }
  },

  methods: {
    onSearch (str) {
      if (!str.trim().length || this.isDeleteShow) {
        this.$toast.fail('搜索内容不能为空')
        return
      }
      // 存储搜索历史记录
      // 如果搜索历史记录中已存在，则直接移除
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 把最新的记录存储到数组的顶部
      this.searchHistories.unshift(str)

      // 必须在这里手动调用持久化存储，因为没来得及执行 watch ，当前页面就跳转了
      setItem('search-histories', this.searchHistories)

      // 跳转到搜索结果页面
      this.$router.push(`/search/${str}`)
    },

    // async onSearchInput () {
    // 函数防抖优化
    onSearchInput: debounce(async function () {
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
    }, 300),
    highlight (str) {
      const reg = new RegExp(this.searchText, 'g')

      return str.replace(reg, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style>
</style>
