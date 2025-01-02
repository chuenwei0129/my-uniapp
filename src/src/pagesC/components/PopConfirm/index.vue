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
        <view v-if="dataInfo.length > 1" class="goods-info">
          <view class="goods-list">
            <view
              v-for="(item, index) in dataInfo.slice(0, 4)"
              :key="index"
              class="goods-list-image"
            >
              <img :src="item.imageUrl" alt="" />
            </view>
            <view v-if="dataInfo.length > 4" class="more-dot">
              <view class="dot"></view>
              <view class="dot"></view>
              <view class="dot"></view>
            </view>
          </view>
          <view class="goods-list-text">共{{ dataCount }}件商品</view>
        </view>
        {{ text }}
      </view>
      <view class="line"> </view>
      <view class="footer">
        <view class="cancel" @click="handleClose">{{ cancelText }} </view>
        <view class="line2"></view>
        <view class="confirm" @click="handleConfirm">{{ confirmText }} </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "PopConfirm",
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
    dataInfo: {
      type: Array,
    },
  },
  data() {
    return {};
  },

  onLoad(options) {},
  onReady() {},
  computed: {
    dataCount() {
      let count = 0;
      (this.dataInfo || []).forEach((e) => {
        count += e.skuQty || 1;
      });
      return count;
    },
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
      color: #ffb400;
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
