<template>
  <u-overlay
    :show="isOpen"
    zIndex="10082"
  >
    <view class="tip-card-wrapper">
      <view class="tip-card">
        <view class="content">
          <view class="title">
            <view>当前门店库存不足</view>
            <view>是否改为由胖胖云超发货？</view>
          </view>
          <view>注：胖胖云超发货时间为24小时内</view>
        </view>
        <view class="line"> </view>
        <view class="footer">
          <view class="cancel" @click="handleClose">{{ cancelText }} </view>
          <view class="line2"></view>
          <view class="confirm" @click="handleConfirm">{{ confirmText }} </view>
        </view>
      </view>
    </view>
  </u-overlay>
</template>

<script>
export default {
  name: "InventorySwitchPop",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
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
  computed: {},
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

.tip-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.tip-card {
  box-sizing: border-box;
  width: 577rpx;
  background: #ffffff;
  border-radius: 38rpx;
  backdrop-filter: blur(10px);
  padding: 0 38rpx;
  position: relative;
  .content {
    padding: 30rpx 0;
    font-size: 25rpx;
    color: #FF5B05;
    line-height: 38rpx;
    text-align: center;
    .title {
      @include textfclaw(27rpx, #333);
      font-weight: normal;
      margin-bottom: 25rpx;
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
      color: #333333;
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
      color: #FF5B05;
    }
  }
}
.goods-info {
  margin-top: 27rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .goods-list {
    display: flex;
    .goods-list-image {
      width: 96rpx;
      height: 96rpx;
      margin: 0 8rpx;
      border-radius: 8px;
      background: red;
    }
  }

  .goods-list-text {
    font-size: 27rpx;
    margin-top: 15rpx;
    font-weight: 400;
    color: #ff5b05;
    margin-bottom: 23rpx;
  }
  .more-dot {
    height: 96rpx;
    display: flex;
    align-items: center;
    margin-left: 15rpx;
    .dot {
      width: 6rpx;
      height: 6rpx;
      background: #666666;
      border-radius: 50%;
      margin-right: 8rpx;
    }
  }
}
</style>
