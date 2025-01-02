<template>
  <view class="panel-wrappper">
    <view class="title">
      <image :src="orderInfo.shopCover" mode="scaleToFill" />
      <view class="shop-name">{{ orderInfo.shopName }}</view>
      <view
        v-if="!isAfterSale"
        :class="[
          'status-tag',
          orderInfo.orderStatus == 'COMPLETE' ||
          orderInfo.orderStatus == 'CLOSED'
            ? 'gray-font'
            : 'theme-font',
        ]"
        >{{ orderStatusEnum[orderInfo.orderStatus] }}</view
      >
      <view v-else :class="['status-tag', 'gray-font']">
        {{ afterSaleStatusEnum[orderInfo.afterSaleStatus] }}
      </view>
    </view>
    <view
      v-for="(item, index) in orderInfo.orderProductList"
      :key="item.productId"
    >
      <view class="product-item">
        <view class="first-row">
          <view class="item-name">{{ item.productName }}</view>
          <view class="price"><span>¥</span>{{ item.price }}</view>
        </view>
        <view class="sec-row">
          <view>数量</view>
          <view>x{{ item.quantity }}</view>
        </view>
      </view></view
    >
    <view class="sum-up" v-if="!isAfterSale">
      <view class="text">实付款</view>
      <view class="num"><span>¥</span>{{ orderInfo.payPrice }}</view>
    </view>
    <view v-else class="sum-up">
      <view class="text">退款</view>
      <view class="num"><span>¥</span>{{ orderInfo.applyRefundAmount }}</view>
    </view>
    <view
      class="refund-success"
      v-if="
        orderInfo.afterSaleStatus == 'REFUND_SUCCESS' ||
        orderInfo.afterSaleStatus == 'REFUNDING'
      "
    >
      <view class="left">{{
        orderInfo.afterSaleStatus == "REFUND_SUCCESS" ? "退款成功" : "退款中"
      }}</view>
      <view class="right">
        <text>退款金额：</text>
        <text class="amount">¥{{ orderInfo.realRefundAmount }}</text>
      </view>
    </view>
    <view class="button-group">
      <!-- <view class="to-pay button">去支付00:15:00</view> -->
      <!-- <view class="button to-transport">查看物流</view>
      <view class="button to-pay">确认收货</view> -->
      <template v-if="orderInfo.orderStatus == 'WAIT_SHIP'">
        <view
          class="button to-transport"
          @click.stop="
            () => {
              handleGoToModAdd(orderInfo.orderNo);
            }
          "
          >修改地址</view
        >
      </template>
      <template v-if="orderInfo.orderStatus == 'WAIT_PAID'">
        <view class="to-pay button"
          >去支付
          <view style="display: inline-block"></view>
          <PayTimeCountDown
            :payValidDate="orderInfo.payValidDate"
            @updateOrderStatus="
              () => {
                handleTimeOut(orderInfo.orderNo);
              }
            "
          />
        </view>
      </template>
      <template v-if="orderInfo.orderStatus == 'WAIT_RECEIVE'">
        <view
          class="button to-transport"
          @click.stop="
            () => {
              handleGoToDelivery(orderInfo.orderNo);
            }
          "
          >查看物流</view
        >
        <view
          class="button to-pay"
          @click.stop="
            () => {
              handleButtonClick({ orderNo: orderInfo.orderNo, type: 'gain' });
            }
          "
          >确认收货</view
        >
      </template>
      <template v-if="orderInfo.orderStatus == 'COMPLETE'">
        <view
          class="button to-transport"
          @click.stop="
            () => {
              handleGoToDelivery(orderInfo.orderNo);
            }
          "
          >查看物流</view
        >
      </template>
      <template
        v-if="
          orderInfo.orderStatus == 'CLOSED' ||
          orderInfo.afterSaleStatus == 'REFUND_SUCCESS'
        "
      >
        <view
          class="button to-transport"
          @click.stop="
            () => {
              handleButtonClick({
                orderNo: orderInfo.orderNo,
                type: 'delete',
                afterSaleNo: isAfterSale ? orderInfo.afterSaleNo : '',
                isAfterSale: isAfterSale,
              });
            }
          "
          >删除订单</view
        >
      </template>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import { orderStatus, afterSaleStatus, afterSaleType } from "../lib/data";
import PayTimeCountDown from "./payTimeCountDown.vue";

export default {
  //...wxShareMethod(),
  components: { PayTimeCountDown },
  props: {
    orderInfo: {
      type: Object,
    },
    isAfterSale: {
      type: Boolean,
    },
    source: {
      type: Number,
    },
  },
  data() {
    return {
      orderStatusEnum: orderStatus,
      afterSaleStatusEnum: afterSaleStatus,
      isShowPopConfirm: false,
      popTitle: "",
      popText: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {},
      fail() {},
    });
  },
  methods: {
    handleGoToModAdd(orderNo) {
      uni.navigateTo({
        url: `/pagesA/addressManagement/index?orderNo=${orderNo}&source=${this.source}`,
      });
    },
    handleTimeOut(ordeNo) {
      this.$emit("timeout", ordeNo);
    },
    handleButtonClick(data) {
      this.$emit("openPop", data);
    },
    handleGoToDelivery(orderId) {
      uni.navigateTo({
        url: `/pagesA/webView/index?route=/buyerLogistics/${orderId}&source=${this.source}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

.panel-wrappper {
  width: 704rpx;
  margin: 0 auto;
  margin-bottom: 19rpx;
  position: relative;
  padding: 31rpx;
  background-color: #fff;
  border-radius: 15rpx;
  .title {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 31rpx;
    image {
      height: 38rpx;
      width: 38rpx;
      object-fit: cover;
      border-radius: 50%;
    }
    .gray-font {
      color: #999;
    }
    .theme-font {
      color: #ff5b05;
    }
    .shop-name {
      @include textfclaw(27rpx, #000);
      font-weight: bold;
      margin-left: 12rpx;
    }
    .status-tag {
      width: 81rpx;
      // @include textfclaw(27rpx, #ff5b05);
      font-size: 27rpx;
      flex: 1;
      text-align: right;
    }
  }
  .product-item {
    padding-left: 54rpx;
    margin-bottom: 40rpx;
    .first-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      .item-name {
        @include textfclaw(29rpx, #000);
        text-align: left;
        font-weight: bold;
        width: 438rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 2; //显示的行
        font-weight: bold;
      }
      .price {
        @include textfclaw(38rpx, #000);
        font-family: D-DIN-Bold;
        span {
          display: inline-block;
          font-size: 27rpx;
          margin-right: 5rpx;
        }
      }
    }
    .sec-row {
      display: flex;
      justify-content: space-between;
      @include textfclaw(27rpx, #999);
      font-weight: 400;
      align-items: flex-end;
    }
  }
  .sum-up {
    // text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 25rpx;
    .text {
      font-size: 27rpx;
      color: #000;
      margin-right: 20rpx;
      font-weight: bold;
    }
    .num {
      font-size: 38rpx;
      color: #000;
      font-family: D-DIN-Bold;
      span {
        display: inline-block;
        font-size: 27rpx;
        margin-right: 5rpx;
      }
    }
  }
  .refund-success {
    height: 77rpx;
    width: 665rpx;
    background-color: rgba(245, 246, 247, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    border-radius: 15rpx;
    padding: 0 25rpx;
    margin-bottom: 19rpx;
    .left {
      font-size: 27rpx;
      font-weight: bold;
    }
    .right {
      font-size: 23rpx;
      .amount {
        color: #ff5b05;
      }
    }
  }
  .button-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .button {
      height: 77rpx;
      border-radius: 40px;
      display: flex;
      align-items: center;
      padding: 17rpx 37rpx;
      margin-left: 19rpx;
    }
    .to-pay {
      @include textfclaw(31rpx, #fff);
      font-weight: bold;
      background: #2dce80;
    }
    .to-transport {
      border: 2rpx solid #e6e6e6;
    }
  }
}
</style>
