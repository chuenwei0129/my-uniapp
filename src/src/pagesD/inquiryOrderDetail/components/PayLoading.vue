<template>
  <view v-if="loading" class="loading-mask">
    <view class="loading-content">
      <u-loading-icon
        :type="loadingIconType"
        class="loading-icon"
        color="#ffffff"
        size="30"
      ></u-loading-icon>
      <text class="loading-text">{{ loadingText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "PayLoading",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: "加载中...",
    },
    loadingIconType: {
      type: String,
      default: "circle", // 根据需求修改，可以是其他的图标类型
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0); /* 全透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 确保在最上层 */
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6); /* 半透明背景 */
  padding: 45rpx 60rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.loading-text {
  margin-top: 19rpx;
  font-size: 26rpx;
  color: #fff; /* 可以根据需要调整颜色 */
}
</style>
