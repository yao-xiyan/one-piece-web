<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar title="路飞同学"
                 left-arrow
                 @click-left="$router.back()"
                 fixed />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list"
         ref="message-list">
      <div class="message-item"
           :class="{ reverse: item.isMe }"
           v-for="(item, index) in messages"
           :key="index">
        <van-image class="avatar"
                   slot="icon"
                   round
                   width="30"
                   height="30"
                   :src="item.photo" />
        <div class="title">
          <span>{{ item.message }}</span>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field v-model="message"
                 center
                 clearable>
        <van-button @click="onSendMessage"
                    slot="button"
                    size="small"
                    type="primary">发送</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'chatIndex',
  data () {
    return {
      message: '',
      socket: null,
      // [{ message: '消息数据', isMe: true, photo: '头像' }]
      messages: getItem('chat-messages') || []
    }
  },

  // 监视数据
  watch: {
    messages () {
      setItem('chat-messages', this.messages)

      // 让列表滚动到最底部
      const messageList = this.$refs[`message-list`]
      console.log('scrollTop: ', messageList.scrollTop)
      console.log('scrollHeight', messageList.scrollHeight)

      // 这里需要吧操作 DOM 的这个代码放到 $nextTick 中
      // 视图更新不是立即执行的
      //  如果立即操纵 DOM 那么必须写到 $nextTick 中，Vue提供的方法
      this.$nextTick(() => {
        messageList.scrollTop = messageList.scrollHeight
      })
    }
  },

  created () {
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn')

    // 吧 socket 存储到 data 中。然后就可以在 methods 中访问到
    this.socket = socket

    // 当客户端与服务器建立连接成功，触发 connect 事件
    socket.on('connect', () => {
      console.log('建立连接成功！')
    })

    // 监听接收服务端消息
    socket.on('message', data => {
      console.log('收到服务器消息', data)
      this.messages.push({
        message: data.msg,
        isMe: false,
        photo: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=119600296,925289645&fm=26&gp=0.jpg'
      })
    })
  },
  mounted () {
    // 列表滚动到最底部
    const messageList = this.$refs[`message-list`]
    messageList.scrollTop = messageList.scrollHeight
  },

  methods: {
    onSendMessage () {
      const message = this.message.trim()
      if (!message) {
        return
      }

      // socket.send()
      // 发送消息
      this.socket.emit('message', {
        msg: message,
        timestamp: Date.now()
      })

      // 吧消息存储到数据组中
      this.messages.push({
        message,
        isMe: true,
        photo: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1422385225,3371387042&fm=26&gp=0.jpg'
      })

      // 清空文本框
      this.message = ''
    }
  }
}
</script>

<style scoped lang='less'>
.chat-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px 0;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background: #f5f5f6;
  .message-list {
    height: 100%;
    overflow-y: scroll;
    .message-item {
      display: flex;
      align-items: center;
      padding: 10px;
      .title {
        background: #fff;
        padding: 5px;
        border-radius: 6px;
      }
      .avatar {
        margin-right: 5px;
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .title {
        margin-right: 5px;
      }
    }
  }

  .send-message {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f6 !important;
  }
}
</style>
