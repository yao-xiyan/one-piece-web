<template>
  <div>
    <van-nav-bar title="个人信息"
                 left-arrow
                 @click-left="$router.back()"
                 right-text="保存" />
    <van-cell-group>
      <van-cell title="头像"
                is-link
                @click="onChangePhoto">
        <van-image round
                   width="30"
                   height="30"
                   :src="user.photo" />
      </van-cell>
      <van-cell title="昵称"
                :value="user.name"
                is-link />
      <van-cell title="性别"
                :value="user.gender"
                is-link />
      <van-cell title="生日"
                :value="user.birthday"
                is-link />
    </van-cell-group>
    <!--
      表单元素的 hidden 表示隐藏这个表单元素
      ref 进行 DOM 操作
     -->
    <input type="file"
           hidden
           ref="file"
           @change="onFileChange">
  </div>
</template>

<script>
import { getProfile } from '@/api/user'

export default {
  name: 'UserIndex',
  data () {
    return {
      user: {}
    }
  },

  created () {
    this.loadUserProfile()
  },

  methods: {
    async loadUserProfile () {
      const { data } = await getProfile()
      console.log(data)
      this.user = data.data
    },

    onChangePhoto () {
      this.$refs.file.click()
    },

    /**
     * 图片改变
     */
    onFileChange () {
      if (this.$refs.file.files[0]) {
        // this.$refs.file.files DOM 中的 files 对象
        this.user.photo = window.URL.createObjectURL(this.$refs.file.files[0])
      }
    }
  }
}
</script>

<style lang="less">
</style>
