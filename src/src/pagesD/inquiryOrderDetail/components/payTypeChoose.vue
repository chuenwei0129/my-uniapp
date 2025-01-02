<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    :closeOnClickOverlay="true"
    round="38rpx"
  >
    <view class="pay-header">
      <view class="pay-header-title">支付方式</view>
      <image
        class="pay-header-close__close"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/Inquiry_order_cancle_close.png"
        mode="aspectFit"
        @click="close"
      ></image>
    </view>
    <view class="pay-box">
      <view class="pay-box-section-line"></view>
      <view class="pay-box-section-row" @click="wechatPay">
        <view class="pay-box-section-row-center">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-weixin.png"
            mode="aspectFit"
          ></image>
          <view class="pay-box-section-row-center-title">
            <view>微信</view>
          </view>
          <view style="color: #ffffff00">隐</view>
        </view>
      </view>
      <view class="pay-box-section-row" @click="aliPay">
        <view class="pay-box-section-row-center">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-alipay.png"
            mode="aspectFit"
          ></image>
          <view class="pay-box-section-row-center-title">支付宝</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "PayTypeChoosePopup",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    scene: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {};
  },

  methods: {
    close() {
      console.log("closeclose");
      this.$emit("update:isOpen", false);
      this.$emit("close", true);
    },

    wechatPay() {
      console.log("wechatPay-close");
      this.$emit("wechatPay");
      this.close();
    },

    aliPay() {
      console.log("aliPay-close");
      this.$emit("aliPay");
      this.close();
    },
  },
};
</script>

<style lang="scss">
.pay-header {
  padding: 38rpx 0;
  position: relative;
  display: flex;
  justify-content: center;
  &-title {
    font-size: 35rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #1f1f1f;
    line-height: 38rpx;
  }
  &-close__close {
    position: absolute;
    right: 30rpx;
    top: 32rpx;
    width: 50rpx;
    height: 50rpx;
    padding: 9rpx;
    background: #ecedf1;
    border-radius: 50%;
  }
}
.pay-box {
  padding: 0 36rpx 52rpx 38rpx;
  &-section {
    display: flex;
    flex-direction: column;
    &-row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 88rpx;
      &-center {
        display: flex;
        flex-direction: row;
        align-content: center;
        &-title {
          font-size: 30rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #1f1f1f;
          margin-left: 18rpx;
          padding-top: 2rpx;
        }
        image {
          width: 48rpx;
          height: 48rpx;
        }
      }
    }
    &-line {
      height: 1rpx;
      background: #f8f8f8;
      margin-bottom: 28rpx;
    }
  }
}
</style>
