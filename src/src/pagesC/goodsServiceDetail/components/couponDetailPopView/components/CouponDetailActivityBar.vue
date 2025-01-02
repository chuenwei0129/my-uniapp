<script>
import CouponDetailActivityGiftPopView
  from "@/pagesC/goodsServiceDetail/components/couponDetailPopView/components/CouponDetailActivityGiftPopView.vue";
import {action_report} from "@/utils/track";

export default {
  name: "CouponDetailActivityBar",
  components: {CouponDetailActivityGiftPopView},
  props: {
    rightType: {
      type: Number,
      default: 0
    },
    promotionName: {
      type: String,
      default: ""
    },
    promotionId: {
      type: String,
      default: ""
    },
    shopId: {
      type: String,
      default: ""
    },
    skuIds: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isShowGiftPop: false,
    };
  },
  computed: {
    activityIconText() {
      if (this.isFullDeduction) {
        return "满减"
      }
      if (this.isFullGift) {
        return "满赠"
      }
      if (this.isFullDiscount) {
        return "满折"
      }
      if (this.isGift) {
        return "赠品"
      }
      if (this.isPromotion) {
        return "促销"
      }
      return "";
    },
    // 满减
    isFullDeduction() {
      return [301, 302, 312, 314, 321, 322].indexOf(this.rightType) > -1;
    },
    // 满赠
    isFullGift() {
      return [311].indexOf(this.rightType) > -1;
    },
    // 满折
    isFullDiscount() {
      return [303, 313, 315].indexOf(this.rightType) > -1;
    },
    // 赠品
    isGift() {
      return [331].indexOf(this.rightType) > -1;
    },
    // 促销
    isPromotion() {
      return [332].indexOf(this.rightType) > -1;
    },
    promotionNameText() {
      if ([331, 311].indexOf(this.rightType) > -1) {
        return this.promotionName + '，赠完为止';
      }
      return this.promotionName
    }
  },
  methods: {
    handleClick() {
      if (this.isFullGift || this.isGift) {
        this.isShowGiftPop = true;
      } else {
        uni.navigateTo({
          url: `/pagesC/promotionGoodsList/index?&shopId=${this.shopId}&activityId=${this.promotionId}`
        })
      }
      action_report({
        action_name: "Detailpage_preferential_promo_click",
        module_name: "Detailpage",
        extend: {
          promotion_id: this.promotionId
        }
      });
    },
    handleClose() {
      this.isShowGiftPop = false;
    }
  }
}
</script>

<template>
<view>
  <view class="coupon-detail-activity-bar-wrapper" @click="handleClick">
    <view class="activity-bar-icon">
      {{activityIconText}}
    </view>
    <view class="activity-bar-text">{{ promotionNameText }}</view>
    <span
        class="iconfont icon-arrowRight"
        style="font-size: 25rpx; color: #FE2442; margin-right: 22rpx;"
    ></span>
  </view>
  <CouponDetailActivityGiftPopView
    :show="isShowGiftPop"
    :shopId="shopId"
    :skuIds="skuIds"
    @onClose="handleClose"
  />
</view>
</template>

<style scoped lang="scss">
.coupon-detail-activity-bar-wrapper {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid #FF869C;
  height: 54rpx;
  .activity-bar-icon {
    width: 75rpx;
    height: 54rpx;
    background: #FFF2F0;
    border-right: 1rpx solid #FF869C;
    font-weight: 500;
    font-size: 25rpx;
    color: #FE2442;
    line-height: 35rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity-bar-text {
    flex: 1;
    padding: 0 18rpx;
    font-size: 25rpx;
    color: #FE2442;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>