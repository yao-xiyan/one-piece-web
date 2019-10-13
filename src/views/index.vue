<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="标题"
                 left-arrow />

    <!-- 导航栏 -->
    <!-- 登录表单 -->
    <van-cell-group>
      <van-field required
                 v-model="user.mobile"
                 clearable
                 label="用户名"
                 placeholder="请输入用户名" />

      <van-field type="password"
                 v-model="user.code"
                 label="密码"
                 placeholder="请输入密码"
                 required />
    </van-cell-group>
    <!-- 登录表单 -->
    <!-- 登录按钮 -->
    <div class="btn-wrap">
      <van-button class="btn"
                  type="info"
                  @click="onLogin">登录</van-button>
    </div>
    <!-- 登录按钮 -->

  </div>
</template>

<script>
// import request from '@/utils/request'
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15001230123',
        code: '246810'
      }
    }
  },
  methods: {
    // 登录按钮事件
    async onLogin () {
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登录中···'
      })
      try {
        // 表单验证

        // 验证通过，loding，请求
        // 请求提交表单数据
        const { data } = await login(this.user)
        console.log(data)
        // 结束loading
        toast.clear()
        this.$toast.success('登陆成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // 结束loading
          toast.clear()
          this.$toast.fail('登录失败，手机号或验证码错误！')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .btn-wrap {
    padding: 20px;
    .btn {
      width: 100%;
      background-color: #6db4fb;
      color: #ffffff;
    }
  }
}
</style>
