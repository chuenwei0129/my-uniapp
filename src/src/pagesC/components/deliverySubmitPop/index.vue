<template>
  <u-popup
    :show="isOpen"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="tip-card">
      <view class="pet-icon"></view>
      <view class="title"
        >当前门店：<span style="font-weight: bold">{{
          shopName
        }}</span></view
      >
      <view class="content"
        >距您约<span style="color: rgba(254, 36, 66, 1)"
          >{{ (selfCheckoutInfo.distance || "0") + "km" }} </span
        >，确认订单后将无法更改</view
      >
      <view class="button-group">
        <view class="button cancel" @click="close">返回</view>
        <view class="button confirm" @click="handleConfirm"> 确定门店 </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    selfCheckoutInfo: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  onLoad(options) {},
  onReady() {},
  computed:{
    shopName(){
      return this.selfCheckoutInfo?.selfCheckoutAddress?.shopName || ''
    }
  },
  methods: {
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleClose() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleConfirm() {
      this.$emit("update:isOpen", false);
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";

.tip-card {
  box-sizing: border-box;
  width: 577rpx;
  height: 473rpx;
  background: #ffffff;
  border-radius: 38rpx;
  backdrop-filter: blur(10px);
  padding: 38rpx;
  position: relative;
  .pet-icon {
    width: 165rpx;
    height: 165rpx;
    margin: 0 auto;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/shop-delivery-pop.png"
    );
  }
  .title {
    @include textfclaw(31rpx, #000);
    // font-weight: bold;
    line-height: 42rpx;
    margin-top: 23rpx;
  }
  .content {
    @include textfclaw(27rpx, #666);
    font-weight: 400;
    line-height: 42rpx;
    margin-top: 19rpx;
  }
  .button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96rpx;
    position: absolute;
    bottom: 0;
    .button {
      height: 100%;
      width: 250rpx;
      &.cancel {
        background-color: #fff;
        @include textfclaw(31rpx, #25252a, $align: center, $lineH: 96rpx);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &.confirm {
        @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 96rpx);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
