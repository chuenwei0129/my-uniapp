<template>
  <u-popup
    :show="isOpen"
    round="38rpx"
    mode="bottom"
    :closeOnClickOverlay="true"
  >
    <view class="cancle-header">
      <view class="cancle-header-title">取消订单</view>
      <image
        class="cancle-header-close__close"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/Inquiry_order_cancle_close.png"
        mode="aspectFit"
        @click="close"
        :style="{
          width: imgSize,
          height: imgSize,
        }"
      ></image>
    </view>
    <view class="cancle-box">
      <view
        v-for="(item, index) in items"
        :key="index"
        class="cancle-box-section"
      >
        <view class="cancle-box-section-row" @click="clickRow(index)">
          <view class="cancle-box-section-row-title">{{ item }}</view>
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/inquiry_order_cancle_selected.png"
            mode="aspectFill"
            v-if="selectedIndex === index"
          ></image>
        </view>
        <view class="cancle-box-section-line"></view>
      </view>
    </view>
    <view class="cancle-footer">
      <view class="cancle-footer-cancel" @click="handleClose">放弃</view>
      <view
        class="cancle-footer-confirm"
        :style="{
          backgroundColor: '#FFD41E',
          color: '#1F1F1F',
        }"
        @click="handleConfirm"
        >确定</view
      >
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "CancleOrderPopup",
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
    return {
      items: [
        "不想要了",
        "计划有变",
        "太贵了",
        "医生不在线",
        "有更好的选择",
        "其他",
      ],
      selectedIndex: 0,
      imgSize: "30rpx",
    };
  },

  mounted() {
    // #ifdef H5
    this.imgSize = "50rpx";
    // #endif
  },

  methods: {
    close() {
      console.log("closeclose");
      this.$emit("update:isOpen", false);
      this.$emit("close", true);
    },

    clickRow(index) {
      this.selectedIndex = index;
      console.log(this.selectedIndex);
    },

    handleClose() {
      console.log("handleClose");
      this.close();
    },
    handleConfirm() {
      console.log("handleConfirm");
      this.$emit("confirm", this.items[this.selectedIndex]);
      this.close();
    },
  },
};
</script>

<style lang="scss">
.cancle-header {
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
    top: 34rpx;
    //width: 50rpx;
    //height: 50rpx;
    padding: 9rpx;
    background: #ecedf1;
    border-radius: 50%;
  }
}
.cancle-box {
  padding: 0 36rpx 68rpx 38rpx;
  &-section {
    display: flex;
    flex-direction: column;
    &-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 96rpx;
      &-title {
        font-size: 29rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #1f1f1f;
        line-height: 40rpx;
      }
      image {
        max-width: 42rpx; // 设置一个最大宽度
        max-height: 42rpx; // 设置一个最大高度
      }
    }
    &-line {
      height: 1rpx;
      background: #f8f8f8;
    }
  }
}

.cancle-footer {
  width: 100%;
  display: flex;
  padding: 0 38rpx 16rpx 38rpx;
  justify-content: space-between;
  .footer-item {
    height: 85rpx;
    flex: 1;
    border-radius: 42.5rpx;
    font-size: 31rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
  &-cancel {
    @extend .footer-item;
    border: 2rpx solid #e6e6e6;
    color: #666666;
  }
  &-confirm {
    @extend .footer-item;
    margin-left: 20rpx;
  }
}
</style>
