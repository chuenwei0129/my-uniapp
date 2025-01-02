<script>
export default {
  name: "DeliveryTag",
  props: {
    textSize: {
      type: Number,
      default: 23,
    },
  },
};
</script>

<template>
  <view class="delivery-tag-wrapper">
    <text
      :style="{
        fontSize: textSize + 'rpx',
        lineHeight: textSize > 23 ? '41rpx' : '31rpx',
      }"
      >24h发货</text
    >
  </view>
</template>

<style scoped lang="scss">
.delivery-tag-wrapper {
  min-width: 94.23rpx;
  transform: rotateZ(360deg);
  height: 100%;
  background: white;
  // border-radius: 6rpx;
  // border: 1rpx solid #ffcfd8;
  padding-left: 8rpx;
  padding-right: 6rpx;
  display: flex;
  box-sizing: border-box;
  text-align: left;
  text {
    color: #666;
    height: 100%;
  }
}
</style>
