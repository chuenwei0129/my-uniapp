<script>
import CppPopup from "./cpp-popup.vue";
import { formatDiscount } from "@/utils/index";
export default {
  name: "couponDetailPopView",
  components: {
    CppPopup,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    couponInfo: {
      type: Object,
      default: () => {},
    },
    priceDetail: {
      type: Object,
      default: () => {},
    },
    picList: {
      type: Array,
      default: () => [],
    },
    shops: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formatDiscount,
      promotionContentShow: false,
      couponContentShow: false,
    };
  },
  computed: {
    promotionShow() {
      let needShow = false;
      for (const index in this.shops) {
        if (this.shops[index].alertSortSkuList.length) {
          needShow = true;
          break;
        }
      }
      return needShow;
    },
  },

  emits: ["onClose", "onSelectSpec"],
  methods: {
    close() {
      this.$emit("onClose");
    },
    moveHandle: function () {},
  },
};
</script>

<template>
  <view class="popup-wrapper">
    <CppPopup
      :show="show"
      @close="close"
      mode="bottom"
      :overlay="true"
      :closeOnClickOverlay="true"
      round="38rpx"
      bgColor="transparent"
      :safeAreaInsetBottom="false"
      overlayStyle="bottom:193rpx"
      @touchmove.stop.prevent
    >
      <view class="popup-content-wrapper">
        <view class="top">
          <view class="title"> 优惠明细 </view>
          <view class="right">
            <image
              mode="aspectFit"
              :style="{ width: '50rpx', height: '50rpx' }"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
              @click="close"
            />
          </view>
        </view>
        <scroll-view class="content-wrapper" scroll-y>
          <view class="item" style="margin: 0 32rpx">
            <view class="item-title"> 商品总额 </view>
            <view class="item-value"> ￥{{ priceDetail.skuAmount }} </view>
          </view>
          <view class="item" style="margin: 46rpx 32rpx 32rpx 32rpx">
            <view class="item-title"> 共优惠 </view>
            <view class="item-value" style="color: #fe2442">
              -￥{{ priceDetail.changeAmount }}
            </view>
          </view>
          <view
            v-if="promotionShow"
            style="
              background: #f3f3f4;
              margin: 23rpx 11rpx 0 11rpx;
              padding: 23rpx;
              border-radius: 15rpx;
            "
          >
            <view
              class="item"
              @click="promotionContentShow = !promotionContentShow"
            >
              <view class="item-title"> 店铺促销 </view>
              <view style="flex: 1"></view>
              <view class="item-value" style="color: #fe2442">
                ￥-{{ priceDetail.activityDiscountAmount }}
              </view>
              <view
                v-show="!promotionContentShow"
                class="iconfont icon-arrowDown"
              ></view>
              <view
                v-show="promotionContentShow"
                class="iconfont icon-arrowUp"
              ></view>
            </view>
            <view v-show="promotionContentShow" v-for="shop in shops">
              <view
                v-for="activityItem in shop.alertSortSkuList"
                style="margin-top: 27rpx"
              >
                <u--image
                  v-if="shop.shopType === 1"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/yunchaoicon.png"
                  width="115rpx"
                  height="30rpx"
                  mode="aspectFit"
                ></u--image>
                <view v-if="shop.shopType !== 1" class="promot-shop">{{
                  shop.shopName
                }}</view>
                <view class="promot-shop" style="margin-top: 15rpx">
                  <span class="promot-name"
                    >{{ activityItem.activity.promotionName + " " }}
                  </span>
                  小计￥{{
                    activityItem.skuList
                      .reduce(function (acc, obj) {
                        if (obj.identifier === 2 && obj.checked) {
                          return acc + 0;
                        }
                        return acc + obj.skuPrice * obj.skuQty;
                      }, 0)
                      .toFixed(2)
                  }}，减￥{{ activityItem.activity.activityAmount }}
                </view>
                <view class="img-card">
                  <image
                    class="img"
                    v-for="picUrl in activityItem.skuList
                      .filter((item) => item.checked)
                      .map((item) => item.majorPicture)"
                    :src="picUrl"
                    mode="aspectFit"
                  >
                  </image>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="priceDetail && priceDetail.couponDiscountAmount > 0"
            style="
              background: #f3f3f4;
              margin: 23rpx 11rpx 0 11rpx;
              padding: 23rpx;
              border-radius: 15rpx;
            "
          >
            <view class="item" @click="couponContentShow = !couponContentShow">
              <view class="item-title"> 优惠券 </view>
              <view style="flex: 1"></view>
              <view class="item-value" style="color: #fe2442">
                ￥-{{ priceDetail.couponDiscountAmount }}
              </view>
              <view
                v-show="!couponContentShow"
                class="iconfont icon-arrowDown"
              ></view>
              <view
                v-show="couponContentShow"
                class="iconfont icon-arrowUp"
              ></view>
            </view>
            <view v-show="couponContentShow" class="offers-card">
              <view class="offers-card-tag">
                {{
                  formatDiscount(
                    couponInfo.rightType,
                    couponInfo.couponRule,
                    couponInfo.promotionName
                  )
                }}
              </view>
            </view>
            <view v-show="couponContentShow" class="img-card">
              <image
                class="img"
                v-for="picUrl in picList"
                :src="picUrl"
                mode="aspectFit"
              >
              </image>
            </view>
          </view>
          <view class="item" style="margin: 58rpx 32rpx 0 32rpx">
            <view class="item-title"> 合计 </view>
            <view class="item-value"> ￥{{ priceDetail.payAmount }} </view>
          </view>
          <view class="alert">
            以上优惠不包含运费，实际优惠金额以确认订单页为准
          </view>
        </scroll-view>
      </view>
    </CppPopup>
  </view>
</template>

<style scoped lang="scss">
.popup-wrapper {
  .popup-content-wrapper {
    background: #ffffff;
    border-radius: 38rpx 38rpx 0 0;
    overflow-y: auto;
    // margin-bottom: 193rpx;
    .top {
      padding: 25rpx 25rpx 25rpx 25rpx;
      text-align: center;
      .title {
        font-size: 35rpx;
        font-weight: bold;
        color: #000000;
      }
      .right {
        position: absolute;
        top: 26rpx;
        right: 26rpx;
      }
    }

    .content-wrapper {
      padding: 17rpx 0;
      overflow-y: auto;
      max-height: 70vh;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-title {
          font-weight: 400;
          color: #1f1f1f;
          font-size: 29rpx;
        }
        .item-value {
          font-weight: 600;
          color: #1f1f1f;
          font-size: 25rpx;
          font-family: D-DIN-Bold;
        }
        .iconfont {
          color: #fe2442;
        }
      }
      .promot-shop {
        font-weight: 400;
        font-size: 27rpx;
        color: #1f1f1f;
        line-height: 38rpx;
        text-align: left;
        font-style: normal;
      }
      .promot-name {
        color: #fe2442;
      }
      .offers-card {
        margin-top: 12rpx;
      }
      .offers-card-tag {
        border-radius: 8rpx;
        border: 0.5px solid #ffcfd8;
        background-color: white;
        font-size: 21rpx;
        font-weight: 400;
        color: #fe2442;
        display: inline-block;
        padding: 0 8rpx;
        margin-right: 10rpx;
        vertical-align: top;
        line-height: 31rpx;
      }
      .img-card {
        background: #f3f3f4;
        border-radius: 15rpx;
        margin-top: 21rpx;
        overflow: hidden;
        overflow-x: auto;
        white-space: nowrap;
        .img {
          width: 127rpx;
          height: 127rpx;
          border-radius: 15rpx;
          margin-right: 15rpx;
          vertical-align: bottom;
        }
      }
      .alert {
        font-size: 27rpx;
        font-weight: 400;
        color: #999999;
        margin: 38rpx 32rpx;
      }
    }
  }
}
</style>
