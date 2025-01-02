<template>
  <u-popup
    :show="show"
    mode="bottom"
    :overlay="true"
    :round="20"
    @close="close"
    @open="open"
    @tap.stop.prevent
    @touchmove.stop.prevent
  >
    <view class="pop-content">
      <view class="pop-content-title">支付方式</view>
      <view class="pop-content-close" @click="close">
        <u-image
          shape="circle"
          :width="'35rpx'"
          :height="'35rpx'"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/close_icon.png"
        ></u-image>
      </view>
      <view class="pop-content-footer">
        <view
          v-for="(item, index) in payWayList"
          :key="index"
          class="pop-content-footer-item"
          @click="handlePayWay(item.value)"
        >
          <view class="pop-content-footer-item-icon">
            <u-image
              :src="item.icon"
              mode="heightFix"
              width="auto"
              :height="'48rpx'"
              class="pop-content-footer-item-icon-img"
            ></u-image>
            <view class="">{{ item.label }}</view>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "PaymentPopup",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    payWayList: {
      type: Array,
      default: () => [],
    },
    selectedPayWay: {
      type: [String, Number],
      default: "",
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    open() {
      this.$emit("open");
    },
    handlePayWay(value) {
      this.$emit("select", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.pop-content {
  position: relative;
  text-align: center;
  .pop-content-title {
    margin: 38rpx auto;
    font-size: 35rpx;
    color: #1f1f1f;
  }

  .pop-content-close {
    position: absolute;
    top: 33rpx;
    right: 29rpx;
    height: 50rpx;
    width: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #ecedf1;
  }

  .pop-content-footer {
    overflow: scroll;
    height: 300rpx;
  }

  .pop-content-footer-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 96rpx;
    line-height: 96rpx;
    width: 100%;
    text-align: center;
    background: #ffffff;
    font-size: 29rpx;
    color: #1f1f1f;
  }

  .pop-content-footer-item-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 17rpx;
    min-width: 175rpx;
  }
}
</style>
