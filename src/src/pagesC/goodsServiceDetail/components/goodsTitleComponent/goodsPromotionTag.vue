<script>
import { formatFloat } from "@/utils";

export default {
  name: "PromotionTag",
  props: {
    promotionType: {
      type: Number | String,
      default: 1,
    },
    rightType: {
      type: Number | String,
      default: 0,
    },
    rule: {
      type: Object,
      default: {
        threshold: 0,
        discount: 0,
        amount: 0,
      },
    },
    name: {
      type: String,
      default: "",
    },
    iconSize: {
      type: Number,
      default: 23,
    },
    textSize: {
      type: Number,
      default: 23,
    },
    livingBody: {
      type: Boolean,
      default: false,
    },
    lineH: {
      type: String,
    },
    isQuanText: {
      type: Boolean,
      default: false,
    },
    isTextOverflow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedRightType() {
      return Number.parseInt(`${this.rightType}`);
    },
    // 是否优惠券
    isQuan() {
      return this.promotionType === "1" || this.promotionType === 1;
    },
    // 是否促销券
    isCu() {
      return !this.isQuan;
    },
    // 展示文本
    couponText() {
      if (this.formattedRightType === 201) {
        return "商品免费券";
      }
      if (this.formattedRightType === 216) {
        return `满${formatFloat(this.rule.threshold)}打${formatFloat(
          this.rule.discount * 10
        )}折`;
      }
      if (this.formattedRightType === 211) {
        return `满${formatFloat(this.rule.threshold)}减${formatFloat(
          this.rule.amount
        )}`;
      }
      return this.name;
    },
  },
};
</script>

<template>
  <view
    class="coupon-tag-wrapper"
    :style="{
      borderRadius: textSize > 23 ? '8rpx' : '6rpx',
      height: isQuanText ? '31rpx' : 'auto',
      boxSizing: isQuanText ? 'border-box' : '',
    }"
  >
    <view
      class="content_inside"
      :style="{ height: isQuanText ? '100%' : 'auto' }"
    >
      <view class="coupon-left">
        <view class="text">领</view>
        <view class="line">
          <view class="circle top"></view>
          <view class="dashed" v-for="item in 3" :key="item"></view>
          <view class="circle bottom"></view>
        </view>
      </view>
      <view
        class="coupon-right"
        :style="{
          fontSize: textSize + 'rpx',
        }"
        :class="{ liveLine: livingBody }"
      >
        <view
          class="coupon-text"
          :style="{ maxWidth: isTextOverflow ? '172rpx' : '' }"
        >
          {{ couponText }}
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.coupon-tag-wrapper {
  background: white;
  transform: rotateZ(360deg);
  padding: 0 7rpx;
  background: #fef5f5;
  border-radius: 4rpx;
  color: #fe2442;
  height: 34rpx;
  line-height: 34rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .content_inside {
    display: flex;
    align-items: center;
    font-size: 500;
    .coupon-type {
      padding: 0 7rpx;
      background-color: white;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-right: 1rpx solid #ffcfd8;
      .quan {
        color: #fe2442;
        margin-right: 4rpx;
      }
    }
    .coupon-right {
      color: #fe2442;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      align-items: center;
      display: flex;
      font-weight: 500;

      .coupon-text {
        display: inline-block;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
        overflow: hidden;
        // margin-left: 7rpx;
      }
    }
    .coupon-left {
      font-size: 21rpx;
      font-weight: 500;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-right: 7rpx;
      .line {
        width: 6rpx;
        height: 34rpx;
        // background-color: greenyellow;
        margin-left: 5rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .circle {
          width: 6rpx;
          height: 6rpx;
          border-radius: 50%;
          background-color: #fff;
        }
        .top {
          position: absolute;
          top: -3rpx;
          left: 0;
        }
        .bottom {
          position: absolute;
          bottom: -3rpx;
          left: 0;
        }
        .dashed {
          width: 2rpx;
          height: 4rpx;
          margin: 2rpx 0;
          background-color: #e0c3c3;
        }
      }
    }
  }
  .liveLine {
    line-height: 30rpx !important;
    margin-top: 0 !important;
  }
}
</style>
