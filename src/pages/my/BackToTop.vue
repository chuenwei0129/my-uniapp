<!-- z-paging自定义的点击返回顶部view -->
<template>
  <view class="back-to-top" :class="{ 'back-to-top--full-show': type === 0 }">
    ▲
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 0：完全显示，1：半显示
      type: 0,
      // 当前定时器
      timeout: null,
    }
  },
  methods: {
    isScroll() {
      // 如果页面正在滚动，则半显示返回顶部图片
      if (this.type === 0) {
        this.type = 1
        this.timeout = setTimeout(() => {
          // 过1秒之后，完全显示返回顶部图片
          this.type = 0
        }, 1000)
      } else {
        if (this.timeout) {
          // 如果在1秒内，又触发了滚动事件，则清空定时器，重新计算时间
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.type = 0
          }, 1000)
        }
      }
    },
  },
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 60px;
  right: -30px; /* 初始状态，半隐藏（宽度为60px） */
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: center;
  line-height: 60px;
  border-radius: 50%;
  transition: right 0.3s, opacity 0.3s, transform 0.3s;
  opacity: 0.8;
}

.back-to-top--full-show {
  right: 20px; /* 全部展示 */
  opacity: 1;
  transform: scale(1.1);
}
</style>
