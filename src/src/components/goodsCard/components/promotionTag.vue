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
      paddingRight: textSize > 23 ? '15rpx' : '6rpx',
      boxSizing: isQuanText ? 'border-box' : '',
    }"
  >
    <!-- height: isQuanText ? '31rpx' : 'auto', -->
    <view
      class="content_inside"
      :style="{ height: isQuanText ? '100%' : 'auto' }"
    >
      <view
        class="coupon-type"
        :style="{ height: isQuanText ? '100%' : 'auto' }"
      >
        <image
          v-if="isCu"
          :style="{ width: iconSize + 'rpx', height: iconSize + 'rpx' }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_coupon_tag_cu_1.png"
        />
        <image
          v-if="isQuan && !isQuanText"
          :style="{ width: iconSize + 'rpx', height: iconSize + 'rpx' }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_coupon_tag_quan_1.png"
        />
        <view
          v-else-if="isQuan && isQuanText"
          class="quan"
          :style="{ fontSize: iconSize + 'rpx' }"
          >券·</view
        >
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
  // border: 1rpx solid #ffcfd8;
  transform: rotateZ(360deg);
  // height: 100%;
  // overflow: hidden;
  .content_inside {
    display: flex;
    align-items: center;
    .coupon-type {
      // padding: 0 7rpx;
      background-color: white;
      // height: 100%;
      // line-height: 1;
      display: flex;
      align-items: center;
      // justify-content: center;
      flex-shrink: 0;
      // border-right: 1rpx solid #ffcfd8;
      .quan {
        color: #666;
        margin-right: 4rpx;
      }
    }
    .coupon-right {
      // padding-left: 8rpx;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      // height: 100%;
      align-items: center;
      // margin-top: 2rpx;
      // display: inline-flex;
      display: flex;
      // justify-content: center;

      .coupon-text {
        // max-width: 172rpx;
        display: inline-block;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
        overflow: hidden;
        // margin-left: 7rpx;
      }
    }
  }
  .liveLine {
    line-height: 30rpx !important;
    margin-top: 0 !important;
  }
}
</style>
