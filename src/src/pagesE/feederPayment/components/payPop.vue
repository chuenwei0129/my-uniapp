<template>
  <u-popup
    :show="isShowPayPop"
    :round="20"
    @close="handleClose"
    bgColor="#fff"
    @touchmove.stop.prevent
  >
    <view class="wrapper">
      <view class="title">
        <view class="title-text">支付方式</view>
        <view class="title-close" @click="handleClose">
          <image
            src="http://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/close_white.png"
          />
        </view>
      </view>

      <view class="container">
        <view class="wechatpay">
          <view>
            <image
              src="http://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/wechatpay.png"
            />
          </view>
          <view class="text-desc">微信支付</view>
          <view class="icon">
            <u-icon name="arrow-right" color="rgb(102,102,102)"></u-icon>
          </view>
        </view>
        <view class="alipay">
          <view>
            <image
              src="http://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/alipay.png"
            />
          </view>
          <view class="text-desc">微信支付</view>
          <view class="icon">
            <u-icon name="arrow-right" color="rgb(102,102,102)"></u-icon>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isShowPayPop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("update:isShowPayPop", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0 29rpx;
}

.title {
  height: 115rpx;
  display: flex;
  align-items: center;
  position: relative;

  .title-text {
    margin: 0 auto;
  }
  .title-close {
    position: absolute;
    top: 29rpx;
    right: 0rpx;

    image {
      width: 50rpx;
      height: 50rpx;
    }
  }
}

.container {
  .wechatpay,
  .alipay {
    display: flex;
    align-items: center;
    padding: 40rpx;

    image {
      width: 58rpx;
      height: 58rpx;
    }
    .text-desc {
      margin-left: 12rpx;
    }
    .icon {
      margin-left: auto;
    }
  }
  .wechatpay {
    border-bottom: 2rpx #f8f8f8 solid;
  }
}
</style>
