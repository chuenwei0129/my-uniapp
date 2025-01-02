<template>
  <u-popup
    :show="show"
    mode="bottom"
    :safeAreaInsetBottom="false"
    overlayStyle="#1D2129"
    bgColor="transparent"
    @close="close"
    @tap.stop.prevent
    @touchmove.stop.prevent
  >
    <view class="content">
      <view class="nav">
        <text class="nav-title">订单追踪</text>
        <view class="nav-close" @click="close">
          <image :src="closeIcon" class="close"></image>
        </view>
      </view>
      <view class="content-main">
        <Steps :steps="orderDeliveryStatusList" :current-step="active" />
      </view>
    </view>
  </u-popup>
</template>

<script>
import Steps from "./steps.vue";
export default {
  name: "orderTracking",
  components: {
    Steps,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    orderDeliveryStatusList: {
      // 订单配送状态
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  data() {
    return {
      closeIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/block_close.png",
    };
  },
  computed: {
    active() {
      if (this.orderDeliveryStatusList.length) {
        console.log(
          "🚀 ~ active ~ this.orderDeliveryStatusList:",
          this.orderDeliveryStatusList
        );
        return this.orderDeliveryStatusList.length - 1;
      }
    },
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../../utils/fn.scss";
.content {
  width: 750rpx;
  max-height: 1025rpx;
  // min-height: 650rpx;
  background: #ffffff;
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  padding-bottom: 156rpx;
  overflow: auto;
  .nav {
    @include flex();
    width: 100%;
    height: 115rpx;
    position: relative;
    .nav-title {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      display: inline-block;
      @include textfclaw(35rpx, #1f1f1f, $align: center, $lineH: auto);
    }
    .nav-close {
      width: 50rpx;
      height: 50rpx;
      background-color: #ecedf1;
      border-radius: 50%;
      position: absolute;
      right: 29rpx;
      top: 50%;
      transform: translateY(-50%);
      @include flex();
      .close {
        width: 31rpx;
        height: 31rpx;
        display: inline-block;
      }
    }
  }
  .content-main {
    width: 100vw;
    padding: 0rpx 38rpx;
    margin-top: 25rpx;
    box-sizing: border-box;
  }
}
</style>
