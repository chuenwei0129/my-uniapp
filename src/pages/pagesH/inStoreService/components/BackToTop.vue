<template>
  <view
    class="back-to-top"
    :class="{'back-to-top--full-show' : type === 0} "
    @click="$emit('click')"
  >
    <slot name="icon">
      ▲
    </slot>
  </view>
</template>

<script>
export default {
  props: {
    // 用户传入的完全显示时间，默认2秒
    fullShowTime: {
      type: Number,
      default: 2000,
    },
  },
  data () {
    return {
      // 0：完全显示，1：半显示
      type: 0,
      // 当前定时器
      timeout: null,
    }
  },
  methods: {
    isScroll () {
      // 如果页面正在滚动，则半显示返回顶部图片
      if (this.type === 0) {
        this.type = 1
        this.timeout = setTimeout(() => {
          // 过指定时间之后，完全显示返回顶部图片
          this.type = 0
        }, this.fullShowTime)
      } else {
        if (this.timeout) {
          // 如果在指定时间内，又触发了滚动事件，则清空定时器，重新计算时间
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.type = 0
          }, this.fullShowTime)
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
  background-color: #ECDCD7;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: right 0.3s, opacity 0.3s, transform 0.3s, background-color 0.3s;
  opacity: 0.8;
}

.back-to-top--full-show {
  right: 20px; /* 全部展示 */
  opacity: 1;
  background-color: #FEFEFE;
  transform: scale(1.1);
}
</style>
