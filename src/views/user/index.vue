<template>
  <div>
    <van-nav-bar title="个人信息"
                 left-arrow
                 @click-left="$router.back()"
                 right-text="保存" />
    <van-cell-group>
      <van-cell title="头像"
                is-link>
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
    }
  }
}
</script>

<style lang="less">
</style>
