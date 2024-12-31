<template>
  <view class="location-fail">
    <view class="location-desc">
      <view>打开位置权限，查看附近的内容</view>
    </view>
    <view
      class="location-button"
      @tap="$u.debounce(handleOpenSetting, 500)"
    >
      开启
    </view>
  </view>
</template>
<script>
export default {
  methods: {
    handleOpenSetting () {
      this.$emit('openAppLocation')
    },
  },
}
</script>
<style scoped lang="scss">
.location-fail {
  position: relative;
  z-index: 1;
  height: 77rpx;
  font-size: 27rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16rpx;
  padding-right: 25rpx;
  // margin-bottom: 20rpx;
  background-color: rgba(254, 36, 66, 1);

  .location-desc {
    color: #fff;
    display: flex;
    align-items: center;

    image {
      width: 43rpx;
      height: 43rpx;
      margin-right: 16rpx;
    }
  }

  .location-button {
    font-weight: 500;
    color: rgba(254, 36, 66, 1);
    width: 100rpx;
    height: 50rpx;
    line-height: 50rpx;
    background: #fff;
    border-radius: 25rpx;
    text-align: center;
  }
}
</style>
