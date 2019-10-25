<template>
  <div>
    <van-nav-bar title="个人信息"
                 left-arrow
                 right-text="保存"
                 type="primary"
                 @click-left="$router.push('/my')"
                 @click-right="onSave" />
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
import { getProfile, updateUserPhoto } from '@/api/user'

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
    },

    /**
    * 编辑用户照片资料
    */
    async onSave () {
      // 如果 Content-Type 要求是application/json，则 data 传普通对象 {}
      // 如果 Content-Type 要求是multipart/form-data，则 data 传 FormData 对象
      // 纵观所有数据接口，你会发现大多数的接口都要求 Content-Type 要求是application/json
      // 一般只有涉及到文件上传的数据接口才要求Content-Type 要求multipart/form-data
      // 这个时候传递一个 FormData 对象

      /**
       * 加载提示
       */
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中···'
      })

      try {
        const formData = new FormData()
        //  formData.append('名字', 数据)
        formData.append('photo', this.$refs.file.files[0])
        await updateUserPhoto(formData)
        // 添加提示
        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        this.$toast.success('保存失败')
      }
    }
  }
}
</script>
