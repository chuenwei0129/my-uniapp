<template>
  <view>
    <view v-if="showOverlay" style="height: 100vh; width: 100%"
      ><u-loading-page
        :loading="true"
        loading-text="订单支付中，请稍等"
        bg-color="#e8e8e8"
        color="#000"
      ></u-loading-page
    ></view>
    <view v-else class="page-container">
      <scroll-view scroll-y class="scroll">
        <Address
          :addressInfo="orderInfo.address"
          :order-no="orderInfo.orderNo"
        />
        <template v-for="(item, index) in orderInfo.productInfo">
          <ConfirmOrderCard :delivery="orderInfo.delivery" :productInfo="item"
        /></template>

        <OrderAmount :amountInfo="orderInfo.amountInfo" />
        <PayCard />
      </scroll-view>

      <view class="bottom-zone">
        <view class="inner-zone">
          <view class="amount">
            <view class="left">应付：</view>
            <view class="special-right"
              ><span>¥</span>{{ orderInfo.amountInfo.realPrice }}</view
            >
          </view>
          <view class="button green" @click="handleGoToPayNew">提交订单</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import { mapState } from "vuex";
import {
  CONFIRM_ORDER,
  SUBMIT_ORDER,
  OrderPay,
  GET_ORDER_DETAIL,
  PRE_PAY,
} from "@/api/pay";
import { getCheckMedical } from "@/api/sheets";
import OrderCard from "../components/ordercard.vue";
import ConfirmOrderCard from "../components/confirmOrderCard.vue";
import OrderAmount from "../components/orderAmount.vue";
import Address from "../orderDetail/components/address.vue";
import PayCard from "../components/payCard.vue";
import { action_report } from "@/utils/track";
import { thirdPartyLoginFun } from "@/utils/config";

export default {
  //...wxShareMethod(),
  components: { OrderCard, ConfirmOrderCard, OrderAmount, Address, PayCard },
  props: {},
  data() {
    return {
      productList: [],
      orderInfo: {},
      diagnosticSheetId: "",
      handleSumbitLock: false,
      timer: null,
      timeCount: 0,
      showOverlay: false,
      source: "",
      openId: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      addressId: (state) => state.addressId,
    }),
  },
  watch: {},
  created() {},
  mounted() {
    // this.callbackTimeCount("CPP246823339184287745");
    // #ifdef H5
    document.title = "确认订单";
    // #endif
  },
  onReady() {},
  onShow() {
    if (this.source && this.source == 30 && this.openId) {
      thirdPartyLoginFun(
        {
          openId: this.openId,
          thirdType: this.source,
        },
        () => this.initDetail()
      );
    } else {
      this.initDetail();
    }
  },

  onLoad(options) {
    this.source = options.source || "";
    this.openId = options.openId || "";
    if (options.diagnosticSheetId) {
      this.diagnosticSheetId = options.diagnosticSheetId;
    }
  },
  methods: {
    initDetail() {
      if (this.diagnosticSheetId) {
        getCheckMedical({
          diagnosticSheetId: this.diagnosticSheetId,
        }).then((res) => {
          console.log(res);
          this.productList = res.data.inStockProducts.map((i) => {
            return {
              productId: i.productId,
              quantity: i.quantity,
              shopId: i.shopId,
              skuId: i.skuId,
            };
          });
          console.log(this.addressId);
          this.handleConfirmOrder({
            businessId: this.diagnosticSheetId,
            addressId: this.addressId || "",
          });
          console.log(this.productList);
        });
      }
    },
    handleSearchFocus() {
      uni.navigateTo({
        url: "/pagesA/orderSearchPage/index",
      });
    },
    async handleConfirmOrder(data) {
      try {
        const res = await CONFIRM_ORDER({
          orderType: "INQUIRY_ORDER",
          businessId: data.businessId,
          productList: this.productList,
          addressId: data.addressId || "",
        });
        this.orderInfo = res.data;
      } catch (error) {}
    },
    async callbackTimeCount(orderNo) {
      let that = this;
      this.showOverlay = true;
      // uni.showLoading();
      if (this.timer) {
        clearInterval(this.timer);
      }
      //轮训查询订单状态

      that.timer = setInterval(async () => {
        that.timeCount++;
        if (that.timeCount >= 3) {
          // uni.hideLoading();
          clearInterval(that.timer);
          that.timer = null;
          uni.redirectTo({
            url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${orderNo}&source=${this.source}`,
          });
          return;
        }
        //查询订单状态
        try {
          const orderRes = await GET_ORDER_DETAIL(orderNo);
          if (orderRes.data.orderStatus == "WAIT_SHIP") {
            clearInterval(that.timer);
            that.timer = null;
            // uni.hideLoading();
            uni.redirectTo({
              url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${orderNo}&source=${this.source}`,
            });
          }
        } catch (error) {}
      }, 3000);
    },
    // handleGoToPay() {
    //   if (this.handleSumbitLock) return;
    //   let that = this;
    //   if (!this.orderInfo.address) {
    //     return uni.showToast({
    //       title: "地址不能为空",
    //     });
    //   }
    //   let orderNo = "";
    //   let orderItems = [];
    //   this.orderInfo.productInfo.map(
    //     (i) => (orderItems = orderItems.concat(i.productList))
    //   );
    //   this.handleSumbitLock = true;
    //   SUBMIT_ORDER({
    //     orderType: "INQUIRY_ORDER",
    //     businessId: this.diagnosticSheetId,
    //     payType: "WX",
    //     shippingType: "NORMAL_DELIVERY",
    //     addressId: this.orderInfo.address.addressId,
    //     totalPrice: this.orderInfo.amountInfo.totalPrice,
    //     payAmount: this.orderInfo.amountInfo.realPrice,
    //     freight: this.orderInfo.amountInfo.freight,
    //     // freight: 0,
    //     orderItems,
    //   })
    //     .then(async (res) => {
    //       console.log(res);
    //       //获取orderNo
    //       orderNo = res.data.orderNo;
    //       let prePayParams = {
    //         biz: "EC_ORDER",
    //         loginUserId: this.userInfo.userId,
    //         orderNo: res.data.orderNo,
    //         payServiceType: "WECHAT_JSXCX",
    //         payType: "WX",
    //         productName: res.data.productName,
    //         tradeAmount: res.data.realAmount,
    //       };
    //       try {
    //         const resPrePay = await PRE_PAY(prePayParams);
    //         // console.log(resPrePay.data.payOrderNo);
    //         let payParams = {
    //           channelUserId: resPrePay.data.appId,
    //           // channelUserId: "WECHAT_JSXCX",
    //           loginUserId: that.userInfo.userId,
    //           payOrderNo: resPrePay.data.payOrderNo,
    //         };
    //         const resPay = await PAY(payParams);
    //         uni.requestPayment({
    //           provider: "wxpay",
    //           orderInfo: { ...that.orderInfo },
    //           timeStamp: resPay.data.timeStamp,
    //           nonceStr: resPay.data.nonceStr,
    //           package: resPay.data.packages,
    //           signType: resPay.data.signType,
    //           paySign: resPay.data.paySign,
    //           success: (result) => {

    //             uni.redirectTo({
    //               url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${res.data.orderNo}`,
    //             });
    //           },
    //           fail: (error) => {
    //             uni.redirectTo({
    //               url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${res.data.orderNo}`,
    //             });
    //           },
    //           complete: () => {
    //             this.handleSumbitLock = false;
    //           },
    //         });
    //       } catch (error) {
    //         //支付流程发生异常，跳转到详情页面
    //         uni.redirectTo({
    //           url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${res.data.orderNo}`,
    //         });
    //         this.handleSumbitLock = false;
    //       }
    //     })
    //     .catch((err) => {
    //       this.handleSumbitLock = false;
    //     });
    // },
    handleGoToPayNew() {
      if (this.handleSumbitLock) return;
      this.handleSumbitLock = true;

      if (!this.orderInfo.address) {
        return uni.showToast({
          title: "地址不能为空",
        });
      }

      // #ifdef MP-WEIXIN
      uni.requestSubscribeMessage({
        tmplIds: [
          "kpa1ouWDsZJdsOvqIfW8JFUsczbgQgb5WRexLQsMM6Q",
          "H9qxI2om3vOSkOvmCpCd6Cc0tEY_iVOA6oms0COy4wo",
          "bznLfpYHkDIsId2Ia3fynALW2zkaf0RwCLczm3CrxCI",
        ],
        complete: () => {
          this.handleSubmitOrder();
        },
      });
      // #endif
      // #ifdef H5
      this.handleSubmitOrder();

      // #endif
    },
    handleSubmitOrder() {
      // this.$pinganPlugin.openWXWMP(    {"userName": "gh_037ecb45fccc",
      // "path": "pages/pay/pay?tradeNo=DRUGP1866813158289350656&authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJDUFAtSldUIiwib2xkVXNlcklkIjoiNDA4Mzc5MzQ5ODI4OTcyNTQ0IiwiaXNzIjoibWVvdy1rOHMtY24tZGV2MDIiLCJleHAiOjE3MzU3MTgwNTUsImlhdCI6MTczMzkwMzY1NSwidXNlcklkIjoiNDA4Mzc5MzQ5ODI4OTcyNTQ0IiwianRpIjoiNjc1OTQ1Mjc1ODY5NWEwMDAxNmIyYzhhIiwibWVtYmVySWQiOiI0MDgzNzkzNDk4Mjg5NzI1NDQifQ.iO4wuZq9FxHor39V_6D3ubDswtv1kJ2F597LVP7QQVWyKRjy68LIeyWnhrWCaNVZcz-0JI2r1qYx31anGf0QNQ&loginUserId=408379349828972544&env=test",
      // "miniProgramType": 2}       );
      // return
      let that = this;

      const { userId, openId } = uni.getStorageSync("storage_info");

      let orderNo = "";
      let orderItems = [];

      this.orderInfo.productInfo.map(
        (i) => (orderItems = orderItems.concat(i.productList))
      );

      SUBMIT_ORDER({
        orderType: "INQUIRY_ORDER",
        businessId: that.diagnosticSheetId,
        payType: "WX",
        shippingType: "NORMAL_DELIVERY",
        addressId: that.orderInfo.address.addressId,
        totalPrice: that.orderInfo.amountInfo.totalPrice,
        payAmount: that.orderInfo.amountInfo.realPrice,
        freight: that.orderInfo.amountInfo.freight,
        // freight: 0,
        orderItems,
      })
        .then(async (res) => {
          console.log(res);
          //获取orderNo
          orderNo = res.data.orderNo;
          if (this.source == "30") {
            let prePayParams = {
              biz: "EC_ORDER",
              loginUserId: this.userInfo.userId,
              orderNo: res.data.orderNo,
              payServiceType: "WECHAT_JSXCX",
              payType: "WX",
              productName: res.data.productName,
              tradeAmount: res.data.realAmount,
            };
            that.prePayForPingan(prePayParams);
          } else {
            OrderPay({
              biz: "EC_ORDER",
              originAmount: res.data.realAmount,
              payServiceType: "WECHAT_JSXCX",
              payType: "WX",
              orderNo,
              paymentAmount: res.data.realAmount,
              userId: userId || "",
              discountAmount: 0,
              deductionAmount: 0,
              channelUserId: openId,
            }).then((resOP) => {
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
                  that.callbackTimeCount(orderNo);
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
                  uni.redirectTo({
                    url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${res.data.orderNo}`,
                  });
                },
                complete: () => {
                  action_report({
                    action_name: "click_ordersubmit",
                    module_name: "transaction",
                  });
                  that.handleSumbitLock = false;
                },
              });
            });
          }
        })
        .catch((err) => {
          that.handleSumbitLock = false;
        });
    },
    async prePayForPingan(prePayParams) {
      // prePayParams = {"biz":"EC_ORDER","loginUserId":"413198162584211456","orderNo":"DRUGP1866738635082866688","payServiceType":"WECHAT_JSXCX","payType":"WX","productName":"电商订单","tradeAmount":"0.11","appId":"1729776648698531840","tenantId":"default_tenant"}
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
          miniProgramType: env === "prod" ? 0 : 2, //拉起小程序的类型 0-正式版 1-开发版 2-体验版
          miniprogramType: env === "prod" ? 0 : 2,
        };
        console.log(options, "参数");
        this.$pinganPlugin.openWXWMP(options);
        //轮训查询订单状态
        this.callbackTimeCount(prePayParams.orderNo);
        this.handleSumbitLock = false;
      } catch (error) {}
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
