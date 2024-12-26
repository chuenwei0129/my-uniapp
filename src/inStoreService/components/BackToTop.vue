<template>
  <view class="container">
    <view class="content">
      <!-- 模拟长内容 -->
      <scroll-view
        scroll-y
        :scroll-top="scrollTop"
        @scroll="onScroll"
      >
        <view
          v-for="i in 100"
          :key="i"
          class="item"
        >
          内容 {{ i }}
        </view>
      </scroll-view>
    </view>

    <!-- 回到顶部按钮 -->
    <view
      v-if="showButton"
      class="back-to-top"
      :class="{ 'full-show': fullyVisible }"
      @click="scrollToTop"
    >
      ▲
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      scrollTop: 0, // 当前滚动高度
      oldScrollTop: 0,
      showButton: false, // 控制按钮显示
      fullyVisible: false, // 按钮是否完全显示
      timer: null, // 定时器，用于记录用户停留时间
    }
  },
  onScroll (e) {
    this.scrollTop = e.detail.scrollTop
    console.log('🚀 ~ onScroll ~ this.scrollTop:', this.scrollTop)

    // 判断是否超过750像素
    if (this.scrollTop > 750) {
      if (!this.showButton) {
        this.showButton = true // 半隐藏展示
      }

      // 如果已经展示，启动定时器
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.fullyVisible = true // 全部展示
        }, 5000) // 用户停留超过1秒
      }
    } else {
      // 重置按钮状态和计时器
      this.showButton = false
      this.fullyVisible = false
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  beforeDestroy () {
    // 清除计时器
    clearTimeout(this.timer)
  },
  methods: {
    // 回到顶部
    scrollToTop () {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      })
    },
  },
}
</script>

<style>
.container {
  position: relative;
  padding: 20px;
}

.content {
  height: 2000px; /* 模拟长内容 */
}

.item {
  margin: 10px 0;
}

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

.back-to-top.full-show {
  right: 20px; /* 全部展示 */
  opacity: 1;
  transform: scale(1.1);
}
</style>
