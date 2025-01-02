<script>
import SkuGoodsItem from "@/pagesC/components/skuGoodsItem/index.vue";
import { formatFloat } from "@/utils";

export default {
  name: "ShopPromotionPopView",
  components: { SkuGoodsItem },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    cartShopList: {
      type: Array,
      default: [],
    },
  },
  computed: {
    shops() {
      const res = [];
      for (const cartShop of this.cartShopList) {
        const shopName = cartShop.shopName;
        const shopType = cartShop.shopType;
        const activityList = cartShop.activityList || [];
        const cartSkuList = cartShop.cartSkuList || [];
        const activities = [];
        for (const activityListElement of activityList) {
          const cartSkuRes = cartSkuList.filter(
            (e) =>
              e.activityId && e.activityId === activityListElement.activityId
          );
          const goodsAmount = cartSkuRes.reduce(function (
            accumulator,
            currentValue
          ) {
            return accumulator + currentValue.skuAmount;
          },
          0);
          activities.push({
            activityName: activityListElement.promotionName,
            activityAmount: formatFloat(activityListElement.activityAmount),
            goods: cartSkuRes,
            goodsAmount: formatFloat(goodsAmount),
          });
          console.log(goodsAmount);
        }
        if (activities.length > 0) {
          res.push({
            shopName,
            shopType,
            activities,
          });
        }
      }
      return res;
    },
  },
  methods: {
    close() {
      this.$emit("onClose");
    },
  },
};
</script>

<template>
  <view class="popup-wrapper">
    <u-popup
      :show="show"
      @close="close"
      mode="bottom"
      :overlay="true"
      :closeOnClickOverlay="true"
      round="38rpx"
      :safeAreaInsetBottom="false"
    >
      <view>
        <view class="popup-content-wrapper">
          <view class="top">
            <view class="title">店铺促销详情</view>
            <view class="right">
              <image
                mode="aspectFit"
                :style="{ width: '50rpx', height: '50rpx' }"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
                @click="close"
              />
            </view>
          </view>
          <view class="content-wrapper">
            <view class="shop-list">
              <view v-for="shop in shops" class="shop-info">
                <view v-if="shop.shopType !== 1" class="shop-name">{{
                  shop.shopName
                }}</view>
                <view v-if="shop.shopType === 1" class="shop-name">
                  <image
                    style="width: 120rpx; height: 32rpx"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/ppyc1.png"
                  />
                </view>
                <view v-for="activity in shop.activities" class="shop-activity">
                  <view class="shop-price">
                    <span class="price-promotion">{{
                      activity.activityName
                    }}</span>
                    小计￥{{ activity.goodsAmount }}，减￥{{
                      activity.activityAmount
                    }}
                  </view>
                  <view class="shop-goods">
                    <image
                      v-for="goodsItem in activity.goods"
                      class="goods-image"
                      :src="goodsItem.majorPicture"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style scoped lang="scss">
.popup-wrapper {
  .popup-content-wrapper {
    background: #ffffff;
    border-radius: 38rpx 38rpx 0 0;
    .top {
      padding: 25rpx 25rpx 0 25rpx;
      text-align: center;
      margin-bottom: 39rpx;
      .title {
        font-size: 35rpx;
        font-weight: 500;
        color: #000000;
      }
      .right {
        position: absolute;
        top: 26rpx;
        right: 26rpx;
      }
    }

    .content-wrapper {
      margin-bottom: 30rpx;
      max-height: 1000rpx;
      overflow-y: auto;
      .shop-list {
        display: flex;
        flex-direction: column;
        padding: 18rpx 38rpx;
        .shop-info {
          display: flex;
          flex-direction: column;
          .shop-name {
            color: #1f1f1f;
            font-size: 29rpx;
            font-weight: bold;
            line-height: 40rpx;
          }
          .shop-price {
            margin-top: 8rpx;
            font-size: 27rpx;
            color: #1f1f1f;
          }
          .price-promotion {
            color: #fe2442;
            margin-right: 20rpx;
          }
          .shop-goods {
            margin-top: 20rpx;
            background-color: #f3f3f4;
            padding: 13rpx 15rpx;
            display: flex;
            overflow: scroll;
            border-radius: 16rpx;
            .goods-image {
              width: 127rpx;
              height: 127rpx;
              border-radius: 12rpx;
              flex-shrink: 0;
            }
            .goods-image + .goods-image {
              margin-left: 12rpx;
            }
          }
          .shop-activity + .shop-activity {
            margin-top: 12rpx;
          }
        }
        .shop-info + .shop-info {
          margin-top: 32rpx;
        }
      }
    }
  }
}
</style>
