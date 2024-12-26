<template>
  <view class="page">
    <view
      class="nav-bar"
      :class="{ 'nav-bar-scroll': scrolled }"
    >
      <text class="title">
        导航栏
      </text>
      <image
        v-if="scrolled || iconVisible"
        :class="{ 'search-icon-visible': scrolled, 'search-icon-hidden': !scrolled }"
        src="/static/search-icon.png"
        class="search-icon"
        mode="widthFix"
      />
    </view>
    <view
      v-show="!scrolled"
      class="search-box"
    >
      <input
        class="search-input"
        placeholder="请输入关键词"
      >
    </view>
    <scroll-view
      ref="scrollView"
      scroll-y
      class="content"
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <MyFilter />
      <view
        v-for="item in items"
        :key="item.id"
        class="content-item"
      >
        {{ item.text }}
      </view>
    </scroll-view>
    <button
      v-show="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
    >
      回到顶部
    </button>
  </view>
</template>

<script>
import MyFilter from './components/FilterOptions.vue'
export default {
  components: {
    MyFilter,
  },
  data () {
    return {
      scrollTop: 0,
      oldScrollTop: 0,
      scrolled: false,
      iconVisible: false,
      showBackToTop: false,
      items: Array.from({ length: 50 }, (_, index) => ({ id: index, text: `内容项 ${index + 1}` })),
    }
  },
  methods: {
    onScroll (event) {
      const {scrollTop} = event.detail
      this.scrolled = scrollTop > 100
      this.showBackToTop = scrollTop > 300
      if (scrollTop > 80) {
        this.iconVisible = true
      } else {
        this.iconVisible = false
      }
      this.oldScrollTop = scrollTop
    },
    scrollToTop () {
      const {scrollView} = this.$refs
      if (!scrollView) return

      //视图会发生重新渲染
      this.scrollTop = this.oldScrollTop
      //当视图渲染结束 重新设置为0
      this.$nextTick(() => {
      this.scrollTop = 0
      })

    },
  },
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.nav-bar {
  height: 70rpx;
  background-color: #007aff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  transition: background-color 0.3s;
}
.nav-bar-scroll {
  background-color: #0051a3;
}
.title {
  color: #fff;
  font-size: 32rpx;
}
.search-icon {
  width: 40rpx;
  height: 40rpx;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  transform: scale(0.8);
}
.search-icon-visible {
  opacity: 1;
  transform: scale(1);
}
.search-icon-hidden {
  opacity: 0;
  transform: scale(0.8);
}
.search-box {
  margin-top: 70rpx;
  padding: 20rpx;
  background-color: #f5f5f5;
}
.search-input {
  width: 100%;
  height: 60rpx;
  border: 1px solid #ccc;
  border-radius: 10rpx;
  padding: 0 20rpx;
}
.content {
  flex: 1;
  margin-top: 70rpx;
  overflow: auto;
  padding: 20rpx;
}
.content-item {
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  border-radius: 10rpx;
}
.back-to-top {
  position: fixed;
  bottom: 100rpx;
  right: 50rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.2);
  z-index: 20;
  transition: opacity 0.3s;
}
</style>
