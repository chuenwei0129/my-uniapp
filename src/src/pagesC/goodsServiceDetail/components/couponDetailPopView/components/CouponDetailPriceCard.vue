<script>
import {formatFloat} from "@/utils";

export default {
  name: "CouponDetailPriceCard",
  methods: {formatFloat},
  props: {
    price: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: "#FF5B05"
    },
    prefix: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    }
  }
}
</script>

<template>
<view class="coupon-detail-price-card-wrapper">
  <view>
    <text class="price-sign" :style="{color: color}">¥</text>
    <text class="price" :style="{color: color}">{{ formatFloat(price) }}</text>
  </view>
  <view class="price-text" :style="{color: color}">
    <view>{{ prefix }}</view>
    <view>{{ text }}</view>
  </view>
</view>
</template>

<style scoped lang="scss">
.coupon-detail-price-card-wrapper {
  background-color: #FFF7F8;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 10rpx 8rpx;
  display: flex;
  flex-direction: column;
  width: 170rpx;
  height: 100%;
  .price-sign {
    font-family: "D-DIN-Bold";
    font-size: 27rpx;
    line-height: 29rpx;
    width: 27rpx;
    height: 38rpx;
  }
  .price {
    font-family: D-DIN-Bold;
    font-size: 35rpx;
    line-height: 39rpx;
  }
  .price-text {
    font-size: 23rpx;
    line-height: 33rpx;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
}
</style>