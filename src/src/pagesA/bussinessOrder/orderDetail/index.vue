<template>
  <view class="page-container">
    <view v-if="orderInfo.orderStatus !== 'WAIT_PAID'" class="title">{{
      topText
    }}</view>
    <view v-else class="title">
      剩
      <view style="display: inline-block; color: #ff5b05">
        <PayTimeCountDown
          :payValidDate="orderInfo.payValidDate"
          @updateOrderStatus="
            () => {
              handleTimeOut(orderInfo.orderNo);
            }
          "
      /></view>

      自动关闭
    </view>

    <scroll-view scroll-y class="scroll">
      <template v-if="orderInfo.orderStatus == 'CLOSED'">
        <Address
          :addressInfo="orderInfo.address"
          :orderStatus="orderInfo.orderStatus"
          :order-no="orderInfo.orderNo"
        />
        <ProductInfoCard :product-info="orderInfo.productInfo" />
      </template>
      <template
        v-if="['WAIT_SHIP', 'WAIT_PAID'].includes(orderInfo.orderStatus)"
      >
        <Address
          :addressInfo="orderInfo.address"
          :orderStatus="orderInfo.orderStatus"
          :order-no="orderInfo.orderNo"
        />
        <ProductInfoCard :product-info="orderInfo.productInfo" />
      </template>
      <template v-if="orderInfo.orderStatus == 'WAIT_RECEIVE'">
        <DeliveryInfoCard
          :trackingNo="orderInfo.trackingNo"
          :order-no="orderInfo.orderNo"
        />
        <ProductInfoCard :product-info="orderInfo.productInfo" />
      </template>
      <template v-if="orderInfo.orderStatus == 'COMPLETE'">
        <DeliveryInfoCard
          :trackingNo="orderInfo.trackingNo"
          :order-no="orderInfo.orderNo"
          :source="source"
        />
        <ProductInfoCard :product-info="orderInfo.productInfo" />
      </template>
      <!-- <DeliveryInfoCard /> -->
      <OrderAmountDetail :orderInfo="orderInfo" @show="isShowPopCall=true" />
    </scroll-view>

    <view class="bottom-zone">
      <view
        class="button"
        @click="
          () => {
            handlegoToCon(orderInfo.orderNo);
          }
        "
        >问诊详情</view
      >
      <template v-if="orderInfo.orderStatus == 'CLOSED'">
        <view
          class="button"
          @click.stop="
            isShowPopConfirm = true;
            popTitle = '确认删除订单？';
            popText = '删除后将从你的订单列表移除';
          "
          >删除订单</view
        >
      </template>
      <template v-if="orderInfo.orderStatus == 'WAIT_SHIP'">
        <view
          class="button"
          @click="
            isShowPopReasons = true;
            afterSaleType = 'refund';
          "
          >申请退款</view
        >
      </template>
      <template v-if="orderInfo.orderStatus == 'WAIT_RECEIVE'">
        <view
          class="button"
          @click.stop="
            () => {
              handleGoToDelivery(orderInfo.orderNo);
            }
          "
          >查看物流</view
        >
        <view
          class="button green"
          @click="
            isShowPopConfirm = true;
            popTitle = '请确认您已收到货';
            popText = '确认收货后钱款将打给商家';
          "
          >确认收货</view
        >
      </template>
      <template v-if="orderInfo.orderStatus == 'COMPLETE'">
        <view
          class="button"
          @click.stop="
            () => {
              handleGoToDelivery(orderInfo.orderNo);
            }
          "
          >查看物流</view
        >
      </template>
      <template v-if="orderInfo.orderStatus == 'WAIT_PAID'">
        <view
          class="button"
          @click="
            isShowPopReasons = true;
            afterSaleType = 'cancelOrder';
          "
          >取消订单</view
        >
        <view
          class="button green"
          @click="
            () => {
              handleGoToPay(orderInfo.orderNo);
            }
          "
          >去支付</view
        >
      </template>
      
      <!-- <view
        class="button"
        @click="
          isShowPopConfirm = true;
          popTitle = '请确认您已收到货';
          popText = '确认收货后钱款将打给商家';
        "
        >确认收货</view
      > -->
      <!-- <view class="button green" @click="isShowPopReasons = true">去支付</view> -->
    </view>
    <PopConfirm
      :is-open.sync="isShowPopConfirm"
      :title="popTitle"
      :text="popText"
      @confirm="handlePopConfirm"
    />
    <AfterSalesReasonPopUp
      :is-open.sync="isShowPopReasons"
      @confirm="handleConfirmReason"
      :type="afterSaleType"
    />
    <PopMakePhoneCall
      :is-open.sync="isShowPopCall"
      :phone-list="orderInfo.serviceTel"
    />
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import OrderAmountDetail from "./components/orderAmountDetail.vue";
import Address from "./components/address.vue";
import DeliveryInfoCard from "./components/deliveryInfoCard.vue";
import PopMakePhoneCall from "./components/popMakePhoneCall.vue";
import PopConfirm from "./components/popConfirm.vue";
import AfterSalesReasonPopUp from "./components/afterSalesReasonPopUp.vue";
import PayTimeCountDown from "../components/payTimeCountDown.vue";
import ProductInfoCard from "./components/productInfoCard.vue";
import {
  GET_ORDER_DETAIL,
  DELETE_ORDER,
  CONFIRM_RECEIPT,
  APPLY_AFTERSALE,
  CANCEL_ORDER,
  QUERY_SHEET_BY_ORDERNO,
  OrderPay,
  PRE_PAY
} from "@/api/pay";
import { mapState,mapMutations } from "vuex";
import { orderStatus, afterSaleStatus, afterSaleType } from "../lib/data";
import { thirdPartyLoginFun } from "@/utils/config";

export default {
  //...wxShareMethod(),
  components: {
    OrderAmountDetail,
    Address,
    DeliveryInfoCard,
    PayTimeCountDown,
    AfterSalesReasonPopUp,
    PopConfirm,
    PopMakePhoneCall,
    ProductInfoCard,
    isShowPopCall:false,
  },
  props: {},
  data() {
    return {
      isShowPopConfirm: false,
      popTitle: "",
      popText: "",
      isShowPopCall: false,
      isShowPopReasons: false,
      orderStatusEnum: orderStatus,
      orderInfo: {},
      orderNo: "",
      afterSaleType: "",
      handleSumbitLock: false,
      source: null, //30 平安app
      openId:'',
      consultationId:''
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
    topText() {
      switch (this.orderInfo.orderStatus) {
        case "CLOSED":
          return this.orderInfo.orderCloseReason;

        case "WAIT_SHIP":
          return "预计48小时内发货";
        case "WAIT_RECEIVE":
          return `${this.getLeftTime(
            this.orderInfo.confirmReceivingTime - new Date().getTime()
          )}后自确认收货`;
        case "COMPLETE":
          return "";
        default:
          return "订单详情";
          break;
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  onReady() {},
  onShow() {
    if(this.source == 30 && this.openId){
      thirdPartyLoginFun(
        {
          openId: this.openId,
          thirdType: 30,
        },
        () => {
          this.handleGetDetail(this.orderNo);
        }
      );
    }else{
      this.handleGetDetail(this.orderNo);
    }
  },
  onLoad(options) {
    this.source = options.source || "";
    this.openId = options.openId || ''
    this.consultationId = options.consultationId || ''
    if (options.orderNo) {
      this.orderNo = options.orderNo;
    }
    if (options.source) {
      this.source = Number(options.source);
    }
    if (options.openId) {
      uni.setStorageSync("pingan-data", options);
      this.setPinganOpenId(option.openId);
      // this.setPinganId(option.consultationId);
    }
  },
  methods: {
    ...mapMutations([
      "setPinganOpenId",
      "setPinganId",
    ]),
    handleSetTitle(title) {
      uni.setNavigationBarTitle({
        title,
      });
    },
    async handleGetDetail(orderNo) {
      console.log("查询详情");
      try {
        const res = await GET_ORDER_DETAIL(orderNo);
        this.orderInfo = res.data;
        this.handleSetTitle(this.orderStatusEnum[res.data.orderStatus]);
      } catch (error) {}
    },
    handleConfirmReason(item) {      
      let that = this;
      if (this.afterSaleType == "refund") {
        APPLY_AFTERSALE({
          applyReason: item.reason,
          orderNo: that.orderInfo.orderNo,
        })
          .then((res) => {
            console.log(res);
            //跳转到售后详情页面
            // that.handleGetDetail(that.orderInfo.orderNo);
            uni.redirectTo({
              url: `/pagesA/bussinessOrder/afterSaleOrderDetail/index?afterSaleNo=${res.data}&source=${this.source}`,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        //取消订单 ,参数需要确认
        CANCEL_ORDER(that.orderInfo.orderNo)
          .then((res) => {
            that.handleGetDetail(that.orderInfo.orderNo);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    getLeftTime(lefttime) {
      var time = lefttime / 1000;
      // 获取天、时、分、秒
      let d = parseInt(time / (60 * 60 * 24));
      let h = parseInt((time % (60 * 60 * 24)) / 3600);
      let m = parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
      if (d || h || m) {
        return `${d ? `${d}天` : ""}${h ? `${h}小时` : ""}${
          m ? `${m}分钟` : ""
        }`;
      } else {
        return "0小时1分钟";
      }
    },
    handlePopConfirm() {
      let that = this;
      if (this.popTitle == "确认删除订单？") {
        DELETE_ORDER(this.orderInfo.orderNo)
          .then((res) => {
            uni.redirectTo({
              url: `/pagesA/bussinessOrder/index?source=${this.source}`,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.popTitle == "请确认您已收到货") {
        CONFIRM_RECEIPT(this.orderInfo.orderNo)
          .then((res) => {
            that.handleGetDetail(that.orderInfo.orderNo);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleTimeOut(orderNo) {
      this.handleGetDetail(orderNo);
    },
    handlegoToCon(orderNo) {
      QUERY_SHEET_BY_ORDERNO(orderNo).then((res) => {
        let pages = getCurrentPages(); //页面对象
        let path = undefined;
        let path1 = undefined;
        if (pages.length > 3) {
          let prevpage = pages[pages.length - 3]; //上一个页面对象
          path = prevpage.route; //上个页面路由url字符串 比如：‘page/prevDetail/prevDetail’
        }
        if (pages.length > 2) {
          let prevpage1 = pages[pages.length - 2]; //上一个页面对象
          path1 = prevpage1.route;
        }

        console.log("path0: ", path);
        if (path && path === "pagesA/sheetDetail/index") {
          console.log("path: ", path);
          uni.navigateBack({ delta: 2 });
        } else if (path1 && path1 === "pagesA/sheetDetail/index") {
          console.log("path: ", path);
          uni.navigateBack({ delta: 1 });
        } else {
          uni.navigateTo({
            url: `/pagesA/sheetDetail/index?id=${res.data.id}&source=${this.source}`,
          });
        }
      });
    },
    handleGoToDelivery(orderId) {
      uni.navigateTo({
        url: `/pagesA/webView/index?route=/buyerLogistics/${orderId}&source=${this.source}`,
      });
    },
    handleGoPay(orderNo) {
      const { userId, openId } = this.userInfo;
      let that = this;

      //获取orderNo
      OrderPay({
        biz: "EC_ORDER",
        originAmount: that.orderInfo.realAmount,
        payServiceType: "WECHAT_JSXCX",
        payType: "WX",
        orderNo,
        paymentAmount: that.orderInfo.realAmount,
        userId: userId || "",
        discountAmount: 0,
        deductionAmount: 0,
        channelUserId: openId,
      })
        .then((resOP) => {
          console.log(resOP);
          // 微信
          uni.requestPayment({
            provider: "wxpay",
            orderInfo: { ...resOP.data, package: resOP.data.packages },
            timeStamp: resOP.data.timeStamp,
            nonceStr: resOP.data.nonceStr,
            package: resOP.data.packages,
            signType: resOP.data.signType,
            paySign: resOP.data.paySign,
            success: function (res1) {
              console.log("success:" + JSON.stringify(res1));
              uni.showToast({
                icon: "none",
                title: "支付成功",
              });
            },
            fail: function (err) {
              console.log("fail:" + JSON.stringify(err));
              uni.showToast({
                icon: "none",
                title: "支付失败",
              });
            },
            complete: () => {
              that.handleSumbitLock = false;
              that.handleGetDetail(orderNo);
            },
          });
        })
        .catch((e) => {
          that.handleSumbitLock = false;
        });
    },
    handleGoToPay(orderNo) {      
      let that = this;
      if (this.handleSumbitLock) return;
      this.handleSumbitLock = true;
      // #ifdef MP-WEIXIN
      uni.requestSubscribeMessage({
        tmplIds: [
          "kpa1ouWDsZJdsOvqIfW8JFUsczbgQgb5WRexLQsMM6Q",
          "H9qxI2om3vOSkOvmCpCd6Cc0tEY_iVOA6oms0COy4wo",
          "bznLfpYHkDIsId2Ia3fynALW2zkaf0RwCLczm3CrxCI",
        ],
        complete() {
          that.handleGoPay(orderNo);
        },
      });
      // #endif
      // #ifdef H5
      if (this.source == "30") {
        let prePayParams = {
          biz: "EC_ORDER",
          loginUserId: that.userInfo.userId,
          orderNo:  that.orderInfo.orderNo,
          payServiceType: "WECHAT_JSXCX",
          payType: "WX",
          productName:  that.orderInfo.productName || '药品商品',
          tradeAmount: that.orderInfo.realAmount,
        };
        that.prePayForPingan(prePayParams);
        return;
      }
      this.handleGoPay(orderNo);
      // #endif
    },
    async prePayForPingan(prePayParams) {
      console.log(prePayParams,'prePayParams');
      try {
        const resPrePay = await PRE_PAY(prePayParams);
        console.log(resPrePay, "resPrePay");

        const { token, userId } = this.userInfo;
        let payParams = {
          channelUserId: resPrePay.data.appId,
          // channelUserId: "WECHAT_JSXCX",
          loginUserId: this.userInfo.userId,
          payOrderNo: resPrePay.data.payOrderNo,
        };
        //唤起小程序去支付，
        const envJson = {
          development: "test",
          "development-local": "test",
          test: "test",
          pre: "pre",
          production: "prod",
        };
        const env = envJson[process.env.NODE_ENV];
        const options = {
          userName: payParams.channelUserId,
          path: `pages/pay/pay?tradeNo=${payParams.payOrderNo}&authorization=Bearer ${token}&loginUserId=${userId}&env=${env}`,
          miniProgramType:env === "prod" ? 0 : 2,//拉起小程序的类型 0-正式版 1-开发版 2-体验版
          miniprogramType:env === "prod" ? 0 : 2,
        };
        console.log(options, "参数");
        this.$pinganPlugin.openWXWMP(options);
        //轮训查询订单状态
        this.handleSumbitLock = false;
      } catch (error) {}
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
