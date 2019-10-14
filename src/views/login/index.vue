<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="标题"
                 sleft-arrow />

    <!-- 导航栏 -->
    <!-- 登录表单 -->
    <ValidationObserver ref="loginForm">
      <van-cell-group>
        <!--
          name 提示的文本
          rules 验证规则
          v-slot="{ errors }" 获取校验结果数据
          参考文档：https://logaretm.github.io/vee-validate/api/rules.html#alpha
          v-slot="{ errors }" 获取校验结果数据
        errors[0] 读取校验结果的失败信息
         -->
        <!-- <ValidationProvider name="手机号" rules="required|email|max:5"  v-slot="{ errors }"> -->
        <ValidationProvider name="手机号"
                            rules="required|phone"
                            v-slot="{ errors }">
          <van-field v-model="user.mobile"
                     clearable
                     label="用户名"
                     :error-message="errors[0]"
                     left-icon="phone-o"
                     placeholder="请输入用户名" />
        </ValidationProvider>
        <hr style="margin:0 29px;border: 0.5px solid #eee">
        <ValidationProvider name="验证码"
                            rules="required|max:6"
                            v-slot="{ errors }">
          <van-cell-group>
            <van-field type="password"
                       v-model="user.code"
                       label="验证码"
                       clearable
                       placeholder="请输入验证码"
                       left-icon="closed-eye"
                       :error-message="errors[0]" />
            <van-button slot="button"
                        size="small"
                        type="primary">发送验证码</van-button>
          </van-cell-group>

        </ValidationProvider>
      </van-cell-group>
    </ValidationObserver>

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
import { setItem } from '@/utils/storage'
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
      const isValid = await this.$refs.loginForm.validate()
      if (!isValid) {
        return
      }
      this.$toast.loading({
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
        // 清除loading
        // toast.clear()
        // 登录成功，将 token 存储到Vuex的容器中
        this.$store.commit('setUser', data.data)

        // 为了防止页面刷新数据丢失，我们需要吧数据放到本地存储
        setItem('user', data.data)

        this.$toast.success('登陆成功')
        this.$router.push('tabbar') // 跳转到首页
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // 清除loading
          // toast.clear()
          this.$toast.fail('登录失败，手机号或验证码错误！')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #f5f7f9;
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
