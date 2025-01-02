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

      <view class="content">
        <view class="title">
          {{ title }}
        </view>
        {{ text }}
      </view>
      <view class="line"> </view>
      <view class="footer">
        <view class="cancel" @click="handleClose">取消 </view>
        <view class="line2"></view>
        <view class="confirm" @click="handleConfirm">确定 </view>
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
    title: {
      type: String,
    },
    text: {
      type: String,
      default: "",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
  },
  data() {
    return {};
  },
  onLoad(options) {},
  onReady() {},
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
  background: #ffffff;
  border-radius: 38rpx;
  backdrop-filter: blur(10px);
  padding: 0 38rpx;
  position: relative;
  .pet-icon {
    @include absNormal($w: 346rpx, $h: 192rpx, $top: -115rpx, $left: 50%);
    transform: translateX(-50%);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/pet-icon-top.png"
    );
  }
  .content {
    padding: 77rpx 0;
    font-size: 27rpx;
    color: #666;
    line-height: 38rpx;
    text-align: center;
    .title {
      @include textfclaw(31rpx, #000);
      font-weight: bold;
      margin-bottom: 31rpx;
    }
  }
  .line {
    width: 500rpx;
    height: 0.5px;
    background-color: #e6e6e6;
  }
  .footer {
    display: flex;
    align-items: center;
    .cancel {
      flex: 1;
      font-size: 31rpx;
      color: #25252a;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 94rpx;
    }
    .line2 {
      width: 2rpx;
      height: 38rpx;
      background-color: #e6e6e6;
    }
    .confirm {
      flex: 1;
      height: 94rpx;
      font-weight: bold;
      font-size: 31rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2dce80;
    }
  }
}
</style>
