<script>
import GoodsPrice from "@/components/goodsPrice/index.vue";
import CouponCard from "./couponCard.vue";
import DeliveryTag from "@/components/goodsCard/components/deliveryTag.vue";
import PdCard from "./pdCard.vue";

import GoodsPriceV2 from "./goodsTitleComponent/goodsPriceV2.vue";
import GoodsDetailCoupon from "./goodsTitleComponent/goodsDetailCoupon.vue";
import GoodsDetailPd from "./goodsTitleComponent/goodsDetailPd.vue";
import GoodsDetailTag from "./goodsTitleComponent/goodsDetailTag.vue";
export default {
  name: "goodsServiceTitlePriceTags",
  components: {
    DeliveryTag,
    GoodsPrice,
    CouponCard,
    PdCard,
    // -----  v2  -----
    GoodsPriceV2,
    GoodsDetailCoupon,
    GoodsDetailPd,
    GoodsDetailTag,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    selectedSku: {
      type: Object,
      default: () => {},
    },
    couponList: {
      type: Array,
      default: () => [],
    },
    activityList: {
      type: Array,
      default: () => [],
    },
    upGradeDescObj: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    itemName() {
      return this.data?.itemName || "";
    },
    soldStockTag() {
      return this.data?.soldStockTag;
    },
    salePrice() {
      return this.selectedSku?.salePrice || "";
    },
    lowestPrice() {
      return this.selectedSku?.minLowestPrice || "";
    },
    drugClassify() {
      return this.data?.drugClassify || 0;
    },
    //是否存在最大券
    isMaxCoupon() {
      return this.couponList.find((item) => item.maxDiscountCoupons);
    },
    isTitleTag() {
      return !this.data?.virtualized && this.data?.itemTag == 1;
    },
    isTitleTag3() {
      return !this.data?.virtualized && this.data?.itemTag == 3;
    },
    // 是否新人免费商品
    isNewUserFreeGoods() {
      const { newPersonFlag, newPersonCountDownTime } = this.data;
      return newPersonFlag && newPersonCountDownTime > 0;
    },
    getMinPrice() {
      if (this.specialPrice >= 0) {
        return this.specialPrice;
      } else {
        return this.selectedSku?.minSalePrice;
      }
    },
    specialPrice() {
      if (this.isNewUserFreeGoods) {
        return "0";
      }
      const maxCoupon = this.couponList.find((item) => item.maxDiscountCoupons);
      const isMaxCoupon = !!maxCoupon;
      const isBetterActivity =
        this.activityList.length > 0 && !!this.activityList[0].betterActivityId;
      if (!isMaxCoupon && !isBetterActivity) {
        return "-1";
      }
      let price = Number.parseFloat(this.selectedSku?.minSalePrice);
      if (isMaxCoupon) {
        price = (
          this.selectedSku?.minSalePrice - (maxCoupon?.discountAmount || 0)
        ).toFixed(2);
      }
      if (isBetterActivity) {
        const availableActivityResp = this.activityList[0];
        price -= Number.parseFloat(
          availableActivityResp.betterActivityAmount || 0
        );
      }
      return price < 0 ? 0 : price;
      // return this.data.estimateAmount;
    },
    isCouponCard() {
      return (
        this.couponList.length > 0 ||
        (this.activityList.length > 0 &&
          this.activityList[0].activities.length > 0)
      );
    },
  },
  emits: ["onRefresh"],
  methods: {
    handleRefresh() {
      this.$emit("onRefresh");
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="price-title-tags-wrapper">
      <view>
        <!-- <GoodsPrice
          :salePrice="selectedSku.minSalePrice"
          salePriceIntegerFontSize="46"
          :specialPrice="specialPrice"
          :originPricePrefix="isNewUserFreeGoods ? '新人价' : '折后价'"
        /> -->

        <GoodsPriceV2
          :salePrice="data.minSalePrice"
          :specialPrice="data.minLowestPrice"
          :originPricePrefix="isNewUserFreeGoods ? '新人价' : '预估价'"
          :salesNum="soldStockTag"
        />
        <!-- <CouponCard
          v-if="isCouponCard"
          :minLowestPrice="selectedSku.minSalePrice"
          :couponList="couponList"
          :activityList="activityList"
          :itemId="data.itemId"
          @onRefresh="handleRefresh"
        ></CouponCard> -->
        <GoodsDetailCoupon
          v-if="isCouponCard"
          :minLowestPrice="selectedSku.minSalePrice"
          :couponList="couponList"
          :activityList="activityList"
          :itemId="data.itemId"
          @onRefresh="handleRefresh"
        ></GoodsDetailCoupon>
      </view>
      <view :class="['title']">
        <image
          v-if="isTitleTag"
          class="goods-tips"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_xiaoshida.png"
        />
        <image
          v-if="isTitleTag3"
          class="goods-tips"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/cirida.png"
        />
        <text v-if="isTitleTag3">{{ itemName }}</text>
        <text v-else :class="[!isTitleTag ? 'notext' : '']">{{
          itemName
        }}</text>
      </view>
      <GoodsDetailPd
        :minPrice="getMinPrice"
        :upGradeDescObj="upGradeDescObj"
        :itemData="data"
      ></GoodsDetailPd>
      <view class="tags-any">
        <GoodsDetailTag
          class="delivery-tips"
          v-if="!data.virtualized && data.itemTag == 2"
          :textSize="21"
          :lineH="19"
          :marginLeft="0"
          :marginRight="7.79"
        />
        <GoodsDetailTag
          v-if="isNewUserFreeGoods"
          class="delivery-tips"
          :textSize="21"
          :lineH="19"
          contentText="新人活动商品不支持退换"
          :marginLeft="0"
          :marginRight="7.79"
        />
        <GoodsDetailTag
          v-if="drugClassify"
          class="delivery-tips"
          :textSize="21"
          :lineH="19"
          contentText="特殊商品无质量问题不可退换"
          :marginLeft="0"
          :marginRight="7.79"
        />
      </view>
      <!-- <view class="tags">
        <text class="tag">已售{{ totalSaleQty }}</text>
        <text v-if="isNewUserFreeGoods" class="refund-desc">
          新人活动商品不支持退换
        </text>
      </view>
      <view v-if="drugClassify" class="desc">特殊商品无质量问题不可退换</view> -->
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "@/utils/fn.scss";
.page-wrapper {
  // margin: 33rpx 23rpx 0;
  margin: 15.38rpx;
  background-color: #fff;
  border-radius: 23rpx;
  padding: 28.85rpx 0 23rpx;

  .price-title-tags-wrapper {
    .title {
      // margin-top: 30rpx;
      margin-top: 15.38rpx;
      // font-size: 29rpx;
      // font-weight: bold;
      // color: #252525;
      // line-height: 40rpx;
      position: relative;
      font-weight: 500;
      @include textfclaw(31rpx, #1f1f1f, left, 44rpx);
      padding-left: 28.85rpx;
      margin-bottom: 12rpx;
      text {
        font-size: 31rpx;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-indent: 90rpx;
      }
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10rpx;
      align-items: center;

      .tag {
        margin-top: 8rpx;
        font-size: 25rpx;
        font-weight: 400;
        color: #666666;
        line-height: 35rpx;
      }

      .refund-desc {
        color: #fe2442;
        font-size: 25rpx;
        margin-top: 8rpx;
        margin-left: 24rpx;
      }
    }
    .tags-any {
      padding: 0 15rpx 0 28.85rpx;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .desc {
      margin-top: 8rpx;
      font-size: 25rpx;
      font-weight: 400;
      color: #ff5b05;
      line-height: 35rpx;
    }
  }
}
.goods-tips {
  width: 75rpx;
  height: 31rpx;
  position: absolute;
  left: 28.85rpx;
  top: 8rpx; //3rpx;
}
.delivery-tips {
  height: 35rpx;
  // width: 100rpx;
  white-space: nowrap;
  vertical-align: bottom;
  margin-top: 10rpx;
  display: inline-block;
}
.notext {
  text-indent: 0 !important;
}
</style>
