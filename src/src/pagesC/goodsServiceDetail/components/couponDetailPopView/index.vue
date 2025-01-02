<script>
import { GET_COUPON_RECEIVE } from "@/api/mall";
import CouponDetailPriceCard from "@/pagesC/goodsServiceDetail/components/couponDetailPopView/components/CouponDetailPriceCard.vue";
import { formatDiscount, formatFloat, getWidth, rpxToPx } from "@/utils";
import CouponDetailActivityBar from "@/pagesC/goodsServiceDetail/components/couponDetailPopView/components/CouponDetailActivityBar.vue";
import { action_report } from "@/utils/track";
export default {
  name: "couponDetailPopView",
  components: { CouponDetailActivityBar, CouponDetailPriceCard },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    couponList: {
      type: Array,
      default: () => [],
    },
    activityList: {
      type: Array,
      default: () => [],
    },
    minLowestPrice: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      safeBottomPadding: 0,
      couponFoldStatusList: [],
    };
  },
  watch: {
    couponList(newVal, oldVal) {
      this.couponFoldStatusList = (newVal ?? []).map((e) => {
        const w = getWidth(e.description || "", "11px sans-serif");
        const contentW =
          getApp().globalData.windowWidth - rpxToPx(28) * 2 - rpxToPx(38) * 2;
        const isShowFold = w > contentW;
        return {
          promotionId: e.promotionId,
          isFold: true,
          isShowFold,
        };
      });
    },
  },
  computed: {
    //是否存在最大券
    isMaxCoupon() {
      return this.couponList.find((item) => item.maxDiscountCoupons);
    },
    isMaxCountText() {
      if (this.isMaxCoupon) {
        return `${formatDiscount(
          this.isMaxCoupon.rightType,
          this.isMaxCoupon.rule,
          this.isMaxCoupon.promotionName
        )}`;
      }
      return "";
    },
    hasActivity() {
      return (
        this.activityList.length > 0 &&
        this.activityList[0].activities.length > 0
      );
    },
    isBetterActivity() {
      if (this.hasActivity) {
        const availableActivityResp = this.activityList[0];
        const activity = availableActivityResp.activities.find((e) => {
          return e.promotionId === availableActivityResp.betterActivityId;
        });
        return activity;
      }
      return null;
    },
    isBetterActivityText() {
      return `${this.isBetterActivity?.promotionName || ""}`;
    },
    isBetterActivityAmount() {
      if (this.activityList.length > 0) {
        const availableActivityResp = this.activityList[0];
        return availableActivityResp.betterActivityAmount || 0;
      }
      return 0;
    },
    specialPrice() {
      const price =
        (this.minLowestPrice * 1000 -
          (this.isMaxCoupon?.discountAmount ?? 0.0) * 1000 -
          this.isBetterActivityAmount * 1000) /
        1000;
      return price < 0 ? 0 : price;
    },
    shopId() {
      return (item) => {
        return item.shopId;
      };
    },
    skuIds() {
      return (item) => {
        if (item.rule) {
          const res = item.rule.gift?.appoint ?? [];
          return res.map((e) => {
            return e.skuId;
          });
        }
        return [];
      };
    },
    isShowDescription() {
      return (item) => {
        return (item.description || "").length > 0;
      };
    },
    isShowFold() {
      return (item) => {
        return (
          this.couponFoldStatusList.find(
            (e) => e.promotionId === item.promotionId
          )?.isShowFold ?? false
        );
      };
    },
    isFold() {
      return (item) => {
        return (
          this.couponFoldStatusList.find(
            (e) => e.promotionId === item.promotionId
          )?.isFold ?? false
        );
      };
    },
  },
  emits: ["onClose", "onRefresh"],
  methods: {
    formatFloat,
    formatDiscount,
    close() {
      this.$emit("onClose");
    },

    //立即领取
    handleReceive(item) {
      action_report({
        action_name: "Detailpage_preferential_coupon_click",
        module_name: "Detailpage",
        extend: {
          coupon_id: item.promotionId,
        },
      });
      uni.$u.debounce(async () => {
        const res = await GET_COUPON_RECEIVE({
          promotionId: item.promotionId,
        });
        uni.showToast({
          icon: "none",
          title: "领取成功",
          duration: 1000,
          success: () => {
            setTimeout(() => {
              this.$emit("onRefresh");
            }, 1000);
          },
        });
      }, 1000);
    },
    //去调末尾的0
    handleNum(num) {
      let str = num.toFixed(2) + "";
      return str.replace(/\.?0+$/, "");
    },
    handleCouponDescClick(item) {
      const foldStatus = this.couponFoldStatusList.find(
        (e) => e.promotionId === item.promotionId
      );
      if (foldStatus) {
        foldStatus.isFold = !foldStatus.isFold;
      }
    },
  },
  mounted() {
    const windowInfo = uni.getWindowInfo();
    this.safeBottomPadding = windowInfo.safeAreaInsets.bottom;
    this.couponFoldStatusList = (this.couponList ?? []).map((e) => {
      const w = getWidth(e.description || "", "11px sans-serif");
      const contentW =
        getApp().globalData.windowWidth - rpxToPx(28) * 2 - rpxToPx(38) * 2;
      const isShowFold = w > contentW;
      return {
        promotionId: e.promotionId,
        isFold: true,
        isShowFold,
      };
    });
  },
};
</script>

<template>
  <root-portal>
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
          <view
            class="popup-content-wrapper"
            :style="{ marginBottom: safeBottomPadding + 'px' }"
          >
            <view class="top">
              <view class="title"> 优惠 </view>
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
              <view style="height: 100%">
                <view
                  class="top-price-wrapper"
                  v-if="isMaxCoupon || isBetterActivity"
                >
                  <view class="top-price">
                    预估到手￥
                    <span class="price">{{ formatFloat(specialPrice) }} </span>
                  </view>
                </view>
                <view
                  v-if="isMaxCoupon || isBetterActivity"
                  class="top-calculate-wrapper"
                >
                  <image
                    class="calculator-top-bg"
                    mode="scaleToFill"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_calculate_top1.png"
                  />
                  <view class="calculator-mid-bg">
                    <CouponDetailPriceCard
                      :price="minLowestPrice"
                      color="#1F1F1F"
                      text="会员价"
                    />
                    <view v-if="!!isMaxCoupon" class="calculator-mid-operator">
                      <image
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/minus_sign1.png"
                      />
                    </view>
                    <CouponDetailPriceCard
                      v-if="!!isMaxCoupon"
                      :price="isMaxCoupon.discountAmount"
                      :text="isMaxCountText"
                      prefix="优惠券"
                      color="#FE2442"
                    />
                    <view
                      v-if="!!isBetterActivity"
                      class="calculator-mid-operator"
                    >
                      <image
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/minus_sign1.png"
                      />
                    </view>
                    <CouponDetailPriceCard
                      v-if="!!isBetterActivity"
                      :price="isBetterActivityAmount"
                      :text="isBetterActivityText"
                      prefix="店铺满减"
                      color="#FE2442"
                    />
                  </view>
                  <view style="margin-top: -3rpx">
                    <image
                      class="calculator-bottom-bg"
                      mode="scaleToFill"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_calculate_bottom1.png"
                    />
                    <view class="calculator-bottom-text-wrapper">
                      <text class="calculator-bottom-text"
                        >当前购买可使用以上优惠</text
                      >
                    </view>
                  </view>
                </view>
                <view v-if="hasActivity" class="coupon-list-header">
                  促销
                </view>
                <view v-if="hasActivity" class="activity-list">
                  <CouponDetailActivityBar
                    class="activity-bar"
                    v-for="item in activityList[0].activities"
                    :rightType="item.rightType"
                    :promotionName="item.promotionName"
                    :promotionId="item.promotionId"
                    :shopId="shopId(item)"
                    :skuIds="skuIds(item)"
                    :key="item.promotionId"
                  />
                </view>
                <view v-if="couponList.length > 0" class="coupon-list-header">
                  可领取优惠券
                </view>
                <view v-for="item in couponList" :key="item.promotionId">
                  <view
                    v-if="item.receiveStatus == 4"
                    class="item-no"
                    :style="{
                      marginBottom: isShowDescription(item) ? '0rpx' : '20rpx',
                    }"
                  >
                    <view class="content">
                      <view class="left">
                        <view v-if="item.rightType == 216" class="price"
                          >{{ handleNum(item.rule.discount * 10)
                          }}<span class="yuan">折</span></view
                        >
                        <view v-if="item.rightType == 201" class="price-text"
                          >免费</view
                        >
                        <view v-if="item.rightType == 211" class="price"
                          >{{ item.rule.amount }}<span class="yuan">元</span>
                        </view>
                        <view class="time" v-if="item.rightType != 201"
                          >满{{ item.rule.threshold }}可用</view
                        >
                      </view>
                      <view class="right">
                        <view class="info">
                          <view class="name">{{ item.promotionName }}</view>
                          <view v-if="item.validityType == 1" class="time"
                            >长期有效</view
                          >
                          <view v-if="item.validityType == 2" class="time">{{
                            "有效期至" + item.endTime
                          }}</view>
                          <view v-if="item.validityType == 3" class="time"
                            >领取{{ item.receiveValue }}天后生效</view
                          >
                        </view>
                        <view class="pick-btn-no"> 已抢完 </view>
                      </view>
                    </view>
                  </view>
                  <view
                    v-else
                    class="item"
                    :style="{
                      marginBottom: isShowDescription(item) ? '0rpx' : '20rpx',
                    }"
                  >
                    <view v-if="item.receiveCount > 0" class="tag">
                      限领{{ item.receiveCount }}张
                    </view>
                    <view class="left">
                      <view v-if="item.rightType == 216" class="price"
                        >{{ handleNum(item.rule.discount * 10)
                        }}<span class="yuan">折</span></view
                      >
                      <view v-if="item.rightType == 201" class="price-text"
                        >免费</view
                      >
                      <view v-if="item.rightType == 211" class="price"
                        >{{ item.rule.amount }}<span class="yuan">元</span>
                      </view>
                      <view class="time" v-if="item.rightType != 201"
                        >满{{ item.rule.threshold }}可用</view
                      >
                    </view>
                    <view class="right">
                      <view class="info">
                        <view class="name">{{ item.promotionName }}</view>
                        <view v-if="item.validityType == 1" class="time"
                          >长期有效</view
                        >
                        <view v-if="item.validityType == 2" class="time">{{
                          item.startTime + "至" + item.endTime
                        }}</view>
                        <view v-if="item.validityType == 3" class="time"
                          >领取{{ item.receiveValue }}天后生效</view
                        >
                      </view>
                      <view v-if="item.receiveStatus == 3" class="pick-btn-no">
                        已领取
                      </view>
                      <view
                        v-else
                        class="pick-btn"
                        @click="handleReceive(item)"
                      >
                        {{ item.receiveStatus == 1 ? "立即领取" : "继续领取" }}
                      </view>
                    </view>
                  </view>
                  <view
                    v-if="isShowDescription(item)"
                    :class="[
                      item.receiveStatus == 4
                        ? 'coupon-desc-disable'
                        : 'coupon-desc',
                    ]"
                    @click="handleCouponDescClick(item)"
                  >
                    <view
                      class="coupon-desc-content"
                      :style="{
                        whiteSpace: isFold(item) ? 'nowrap' : 'normal',
                      }"
                    >
                      {{ item.description || "" }}
                    </view>
                    <image
                      v-if="isShowFold(item)"
                      :src="
                        isFold(item)
                          ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_arrow_down.png'
                          : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_arrow_up.png'
                      "
                      mode="scaleToFill"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </u-popup>
    </view>
  </root-portal>
</template>

<style scoped lang="scss">
.popup-wrapper {
  .promotion-name {
    max-width: 105px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
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
      margin: 0 28rpx 30rpx 28rpx;
      max-height: 1000rpx;
      overflow-y: auto;
      .top-price-wrapper {
        display: flex;
        justify-content: center;
        .top-price {
          background: #fe2442;
          border-radius: 43rpx;
          padding: 8rpx 20rpx;
          padding-left: 22rpx;
          font-size: 23rpx;
          font-weight: 400;
          color: #ffffff;
          .price {
            font-size: 46rpx;
            font-family: D-DIN-Bold;
            font-weight: bold;
            line-height: 50rpx;
            height: 50rpx;
          }
        }
      }
      .top-calculate-wrapper {
        margin-top: 16rpx;
        .calculator-top-bg {
          width: 100%;
          height: calc((100vw - 56rpx) / (390 / 19));
          vertical-align: bottom;
        }
        .calculator-mid-bg {
          width: 100%;
          min-height: calc((100vw - 55rpx) / (390 / 69));
          display: flex;
          justify-content: center;
          background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_calculate_mid1.png");
          background-size: 100%, 100%;
          .calculator-mid-operator {
            width: 40rpx;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 35rpx;
            image {
              width: 18rpx;
              height: 6rpx;
              margin-bottom: 22rpx;
            }
          }
        }
        .calculator-mid-content-wrapper {
          position: relative;
          left: 0;
          top: 0;
          width: 100%;
          height: 0;
          .calculator-mid-content {
            position: absolute;
            left: 0;
            top: calc(0px - (100vw - 56rpx) / (390 / 69));
            width: 100%;
            min-height: calc((100vw - 56rpx) / (390 / 69));
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .calculator-bottom-bg {
          width: 100%;
          height: calc((100vw - 56rpx) / (390 / 35));
          margin-top: 0;
        }
        .calculator-bottom-text-wrapper {
          position: relative;
          left: 0;
          top: 0;
          width: 100%;
          height: 0;
          .calculator-bottom-text {
            position: absolute;
            left: 0;
            top: calc(0px - (100vw - 56rpx) / (390 / 35));
            width: 100%;
            height: calc((100vw - 56rpx) / (390 / 35));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22rpx;
            color: white;
          }
        }
      }
      .coupon-list-header {
        height: 75rpx;
        display: flex;
        align-items: center;
        color: #666666;
        font-size: 25rpx;
      }
      .activity-list {
        display: flex;
        flex-direction: column;
        .activity-bar + .activity-bar {
          margin-top: 20rpx;
        }
      }
      .item {
        width: 100%;
        height: 154rpx;
        background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_item_bg.png");
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
        .tag {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 19rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 27rpx;
          background: #fe2442;
          border-radius: 0rpx 15rpx 0rpx 15rpx;
          padding: 0 10rpx;
        }
        .left {
          width: 28%;
          text-align: center;
          .price {
            font-size: 54rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #fe2442;
            line-height: 50rpx;
            height: 50rpx;
          }
          .price-text {
            font-size: 38rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #fe2442;
            line-height: 50rpx;
            height: 50rpx;
          }
          .yuan {
            font-size: 23rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #fe2442;
          }
        }
        .right {
          width: 72%;
          padding: 0 30rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .info {
            width: 68%;
            .name {
              font-size: 29rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #fe2442;
              line-height: 50rpx;
              height: 50rpx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .pick-btn {
            background: #fe2442;
            border-radius: 27rpx;
            font-size: 25rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 35rpx;
            padding: 10rpx 20rpx;
          }
          .pick-btn-no {
            font-size: 25rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #fe2442;
            opacity: 0.59;
            margin-right: 10rpx;
          }
        }
        .time {
          margin-top: 5rpx;
          font-size: 25rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #fe2442;
          line-height: 35rpx;
        }
      }
      .item-no {
        height: 154rpx;
        background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/couponItemBgNo1.png");
        background-size: 100% 100%;
        z-index: 1;
        .content {
          height: 154rpx;
          display: flex;
          align-items: center;
          .left {
            width: 28%;
            text-align: center;
            .price {
              font-size: 54rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #666666;
              line-height: 50rpx;
              height: 50rpx;
            }
            .price-text {
              font-size: 38rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #666666;

              line-height: 50rpx;
              height: 50rpx;
            }
            .yuan {
              font-size: 23rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #666666;
            }
          }
          .right {
            width: 72%;
            padding: 0 30rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .info {
              width: 68%;
              .name {
                font-size: 29rpx;
                font-family: PingFangSC, PingFang SC;
                font-weight: 600;
                color: #666666;
                line-height: 50rpx;
                height: 50rpx;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .pick-btn-no {
              font-size: 25rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 500;
              color: #666666;
              margin-right: 10rpx;
            }
          }
          .time {
            margin-top: 5rpx;
            font-size: 25rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 35rpx;
          }
        }
      }
      .coupon-desc {
        color: #999999;
        font-size: 11px;
        line-height: 31rpx;
        padding: 27rpx 38rpx 12rpx 38rpx;
        border-bottom-left-radius: 15rpx;
        border-bottom-right-radius: 15rpx;
        border: 1rpx solid #ffcfd8;
        position: relative;
        top: -15rpx;
        z-index: 0;
        margin-bottom: 8rpx;
        display: flex;
      }
      .coupon-desc-disable {
        @extend .coupon-desc;
        border: 1rpx solid #e8e8e8;
      }
      .coupon-desc-content {
        margin-right: 21rpx;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      image {
        width: 25rpx;
        height: 25rpx;
        margin-top: 4rpx;
      }
    }
  }
}
</style>
