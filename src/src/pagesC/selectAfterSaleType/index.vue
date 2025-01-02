<template>
  <view class="select-after-sale-type-content">
    <!-- #ifdef H5 -->
    <!-- <NavBar
      :title="'选择售后类型'"
      navColor="#ffffff"
      :whiteBack="false"
      showBackBtn
      @navBackClickHandle="handleReturn"
      :customback="true"
      :style="{ position: 'sticky', top: 0, left: 0, zIndex: 999 }"
    >
    </NavBar> -->
    <!-- #endif -->
    <AfterSaleGiftBar v-if="hasGift" />
    <view
      style="padding-left: 16rpx; padding-right: 16rpx"
      :style="{ marginTop: hasGift ? '18rpx' : '20rpx' }"
    >
      <AfterSaleGoodsItem :goods="orderItems" />
      <view class="refund-type">
        <view
          class="type-item"
          v-if="isShowRefund"
          @click="handleSelectType(7, item)"
        >
          <view class="type-item-info">
            <view class="type-item-title">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/returnGoodsIcon.png"
              />
              <text>我要退货退款</text>
            </view>
            <view class="type-item-icon">
              <text>已收到货，需要退还已收到的货物</text>
            </view>
          </view>
          <view class="iconfont icon-arrowRight"></view>
        </view>
        <view class="type-separate-line" />
        <view
          class="type-item"
          v-if="isCanInstantRefund"
          @click="handleSelectType(6, item)"
        >
          <view class="type-item-info">
            <view class="type-item-title">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/refundIcon.png"
              />
              <text>我要退款（无需退货）</text>
            </view>
            <view class="type-item-icon">
              <text
                >Lv{{ levelIndex
                }}{{ dictionary[levelIndex] }}会员可享受极速退款</text
              >
              <i class="iconfont icon-pointout" @click.stop="goRule" />
            </view>
          </view>
          <view class="iconfont icon-arrowRight"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { REFUND_BENEFIT } from "@/api/member";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import GoodsItem from "@/pagesC/orderDetail/componse/goodsItem.vue";
import AfterSaleGiftBar from "@/pagesC/components/afterSaleGiftBar/index.vue";
import AfterSaleGoodsItem from "@/pagesC/components/afterSaleGoodsItem/index.vue";
import { GTE_RULES } from "@/api/memberV2";
import NavBar from "@/components/navBar/index.vue";

export default {
  components: {
    AfterSaleGoodsItem,
    AfterSaleGiftBar,
    GoodsPrice,
    GoodsItem,
    NavBar,
  },
  data() {
    return {
      orderItems: [],
      orderId: "",
      levelIndex: 0,
      isShowRefund: true,
      afterSaleRefundType: 1,
      hasGift: false,
      isCanInstantRefund: false,
      dictionary: {
        1: "小银豚",
        2: "小金豚",
        3: "小钻豚",
        4: "黑金豚",
      },
      src: "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/icon-line-prompt.png",
    };
  },
  methods: {
    handleSelectType(e, item) {
      uni.$u.debounce(() => {
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/applyAfterSale/index?afterSaleType=${e}&orderId=${this.orderId}&storeId=${this.storeId}&afterSaleRefundType=${this.afterSaleRefundType}&hasGift=${this.hasGift}`,
          success: (res) => {
            res.eventChannel.emit("getOrderItems", this.orderItems);
          },
        });
        // #endif
        // #ifdef H5
        localStorage.setItem("getOrderItems", JSON.stringify(this.orderItems));
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesC/applyAfterSale/index?afterSaleType=${e}&orderId=${this.orderId}&storeId=${this.storeId}&afterSaleRefundType=${this.afterSaleRefundType}&hasGift=${this.hasGift}`,
        });
        // #endif
      }, 500);
    },
    async searchRefundStatus() {
      const { data } = await REFUND_BENEFIT({ isRefundEntranceQuery: true });
      this.levelIndex = data.data.levelIndex;
      this.isCanInstantRefund = data.data.isCanInstantRefund;
      console.log("退款", data);
    },
    async goRule() {
      try {
        const { data } = await GTE_RULES();
        const path = data.data;
        if (path.indexOf("http") !== -1) {
          let newRoute = "";
          if (path.indexOf("h5/shareActivity/?random=123#")) {
            newRoute = path.replace("h5/shareActivity/?random=123#", "#");
          } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
            newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
          } else if (path.indexOf("h5/shareActivity/?random=123")) {
            newRoute = path.replace("h5/shareActivity/?random=123/", "");
          }
          let str = `/pagesA/webView/index?route=${newRoute}&type=icon`;
          console.log("str::", str);
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${newRoute}`,
          });
          // #endif

          // #ifdef MP-WEIXIN
          return uni.navigateTo({ url: str });
          // #endif
        } else {
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${str}`,
          });
          // #endif
          // #ifdef MP-WEIXIN
          return uni.navigateTo({ url: path });
          // #endif
        }
      } catch (error) {
        console.log("err::", error);
      }
    },

    // #ifdef H5
    handleReturn() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          this.$dsBridge.call("closeCurrentWebview", {});
        },
      });
    },
    // #endif
  },
  onLoad(e) {
    this.storeId = e.storeId;
    this.orderId = e.orderId;
    this.afterSaleRefundType = Number.parseInt(e.afterSaleRefundType) || 1;
    this.hasGift = e.hasGift === "true";
    // #ifdef MP-WEIXIN
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("getOrderItems", (data) => {
      this.orderItems = data;
    });
    // #endif
    // #ifdef H5
    this.orderItems =
      localStorage?.getItem("getOrderItems") &&
      JSON.parse(localStorage.getItem("getOrderItems"));
    // #endif
    console.log("选择售后页面参数：", e, this.orderItems);
    this.searchRefundStatus();
  },
};
</script>

<style lang="scss">
.select-after-sale-type-content {
  background-color: #f7f8fc;
  height: 100vh;
  padding: 0 0 20rpx 0;
  display: flex;
  flex-direction: column;
  .order-items {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 16rpx;
    padding: 6rpx 24rpx;
    .order-item {
      display: flex;
      image {
        width: 156rpx;
        height: 156rpx;
        border-radius: 10rpx;
        background-color: #f7f8fc;
        flex-shrink: 0;
      }
      .goods-info {
        margin-left: 18rpx;
        width: calc(100% - 156rpx - 36rpx);
        display: flex;
        flex-direction: column;
        .goods-info-1 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #1f1f1f;
          width: 100%;
          .sku-name {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-right: 18rpx;
          }
        }
        .goods-info-2 {
          display: flex;
          justify-content: space-between;
          color: #666;
          margin-top: 4rpx;
          align-items: center;
          width: 100%;
        }
      }
    }
  }
  .refund-type {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    border-radius: 16rpx;
    background-color: white;
    width: 100%;
    .type-item {
      width: 100%;
      height: 230rpx;
      display: flex;
      align-items: center;
      padding: 0 18rpx;
      justify-content: space-between;
      .type-item-info {
        display: flex;
        flex-direction: column;
        .type-item-title {
          display: flex;
          align-items: center;
          image {
            width: 43rpx;
            height: 43rpx;
          }
          text {
            color: #1f1f1f;
            font-size: 35rpx;
            margin-top: 0;
            margin-left: 18rpx;
          }
        }
        .type-item-icon {
          display: flex;
          align-items: center;
          margin-top: 6rpx;
          // justify-content: flex-start;
          vertical-align: middle;
          .u-text {
            align-items: flex-start;
          }
          .u-text__suffix-icon {
            flex-direction: row;
          }
          .type-img {
            margin-top: 5rpx;
            width: 16px;
            height: 16px;
          }
        }
        text {
          // margin-top: 6rpx;
          margin-left: 61rpx;
          font-size: 27rpx;
          color: #999;
        }
      }
      .iconfont {
        width: 30rpx;
        height: 30rpx;
        color: #999;
        font-size: 30rpx;
      }
    }
    .type-separate-line {
      height: 2rpx;
      margin: 0 24rpx;
      background-color: #efefef;
    }
  }
}
</style>
