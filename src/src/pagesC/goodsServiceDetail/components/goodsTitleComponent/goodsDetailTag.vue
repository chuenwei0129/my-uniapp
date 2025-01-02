<script>
export default {
  name: "DeliveryTag",
  props: {
    textSize: {
      type: Number,
      default: 21,
    },
    lineH: {
      type: Number,
    },
    fontColor: {
      type: String,
      default: "#666666",
    },
    contentText: {
      type: String,
      default: "24小时发货",
    },
    marginLeft: {
      type: Number,
      default: 0,
    },
    marginRight: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<template>
  <view
    class="delivery-tag-wrapper"
    :style="{
      fontSize: textSize + 'rpx',
      lineHeight: lineH + 'rpx',
      color: fontColor,
      marginLeft: marginLeft + 'rpx',
      marginRight: marginRight + 'rpx',
    }"
  >
    {{ contentText }}
  </view>
</template>

<style scoped lang="scss">
@import "@/utils/fn.scss";
.delivery-tag-wrapper {
  padding: 8rpx;
  background: white;
  border-radius: 6rpx;
  border: 0.5px solid #e0e0e0;
  box-sizing: border-box;
  @include flex();
  text {
    color: #666666;
  }
}
</style>
