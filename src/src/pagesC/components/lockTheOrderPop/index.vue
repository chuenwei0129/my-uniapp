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
      <!-- <view class="title">温馨提示</view> -->
      <view class="content">{{
        lockType
          ? "宠物已被其他买家锁单，如需选购，您可联系门店踢单"
          : `请先完成《${signStatu.tripartiteTemplateName}》签署`
      }}</view>
      <view class="heng"></view>
      <view class="button-group">
        <view class="button cancel" @click="close">放弃</view>
        <view class="suxian"></view>
        <view class="button confirm" @click="handleConfirm">
          {{ lockType ? "联系门店" : "去签署" }}
        </view>
        <!-- <view v-else class="button confirm" @click="handleConfirm">
          去签署
        </view> -->
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
    lockType: {
      type: Boolean,
      default: true,
    },
    signStatu: {
      type: Object,
      default: {},
    },
    // lockTheOrderValue: {
    //   type: Object,
    // },
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
  // box-sizing: border-box;
  width: 577rpx;
  height: 288rpx;
  background: #ffffff;
  border-radius: 38rpx;
  backdrop-filter: blur(10px);
  // padding: 38rpx;
  padding: 0 38rpx;
  padding-top: 67rpx;
  position: relative;
  .pet-icon {
    position: absolute;
    top: -143rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 346rpx;
    height: 231rpx;
    margin: 0 auto;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/pop.png"
    );
  }
  .title {
    width: 100%;
    height: 42rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 31rpx;
    color: #1f1f1f;
    line-height: 42rpx;
    text-align: center;
    font-style: normal;
  }
  .content {
    @include textfclaw(27rpx, #333, $align: center);
    font-weight: 400;
    line-height: 38rpx;
    // margin-top: 33rpx;
    // margin-bottom: 71rpx;
  }
  .heng {
    position: absolute;
    left: 38rpx;
    top: 190rpx;
    width: 500rpx;
    height: 2rpx;
    border: 1rpx solid #e6e6e6;
  }
  .button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    // height: 96rpx;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

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
    .suxian {
      width: 2rpx;
      height: 38rpx;
      border: 1rpx solid #e6e6e6;
    }
  }
}
</style>
