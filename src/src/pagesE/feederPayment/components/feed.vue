<template>
  <view class="page-wrapper">
    <view v-if="showOverlay" style="height: 100vh; width: 100%"
      ><u-loading-page
        :loading="true"
        loading-text="支付中，请稍等"
        bg-color="#1f1f1f"
        color="#fff"
        image="https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/loading.png"
      ></u-loading-page
    ></view>
    <template v-else>
      <view class="header">
        <view class="status-bar" :style="{ height: statusBarHeight }"></view>
        <view class="back-btn" @click="handleBack">
          <!-- #ifdef MP-WEIXIN -->
          <view class="home-btn">
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/home_btn.png"
            />
          </view>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <u-icon name="arrow-left" color="#fff"></u-icon>
          <!-- #endif -->
        </view>
      </view>

      <view class="main">
        <view class="status-bar" :style="{ height: statusBarHeight }"></view>
        <view class="header-style"></view>
        <view class="content-box">
          <view class="photo">
            <image :src="feederPaymentData.url || feedDefaultUrl" />
          </view>

          <view class="title-text">
            <view class="feed-num"> {{ feederPaymentData.title }} </view>

            <view class="feed-hint"> {{ feederPaymentData.content }} </view>
          </view>

          <view class="btn-container">
            <view class="pay-btn" @click="handleImmediatePay">
              立即支付{{ payInfo.payAmount }}元
            </view>
            <!-- <view class="pay-btn" @click="gotoFeeded"> gotoFeeded </view> -->
          </view>

          <view
            v-if="ableCouponList.length"
            class="coupon-hint"
            @click="handleCouponTouch"
          >
            <view class="coupon-container">
              <template v-if="payInfo.rightType == 201">
                <view class="coupon-text">
                  已使用一张免费券，可享受<text class="price-red">0元</text>支付
                </view>
                <u-icon
                  class="play-right-fill"
                  name="play-right-fill"
                  :color="couponIconColor"
                ></u-icon>
              </template>
              <template v-else>
                <template
                  v-if="!!couponPrice.price || currentCouponData.memberCouponId"
                >
                  <text class="coupon-text">已享优惠</text>
                  <view class="price-container">
                    <text class="price-icon">￥</text>
                    <text class="price-integer">{{ couponInteger }}</text>
                    <text class="price-decimal">{{ couponDecimal }}</text>
                  </view>
                </template>
                <view v-else class="coupon-text"> 未勾选使用优惠券 </view>
                <u-icon
                  class="play-right-fill"
                  name="play-right-fill"
                  :color="couponIconColor"
                ></u-icon>
              </template>
            </view>
          </view>
        </view>
        <CouponPop
          :isShowCouponPop.sync="isShowCouponPop"
          :ableCouponList="ableCouponList"
          :disableCouponList="disableCouponList"
          :radioValue="radioValue"
          @changeCouponInfo="changeCouponInfo"
        />
        <!-- #ifdef H5 -->
        <PayPop :isShowPayPop.sync="isShowPayPop" />
        <!-- #endif -->
        <u-safe-bottom></u-safe-bottom>
      </view>
    </template>
  </view>
</template>

<script>
import CouponPop from "./couponPop.vue";
import PayPop from "./payPop.vue";

import { GET_COUPON_LIST, CREATE_ORDER } from "@/api/feederPayment";
import { addCart } from "@/api/cart";
import { getUserInfo } from "@/api/base/index";
import { GET_ORDER_TRADE_DETAIL } from "@/api/mallv2";
import { PREPAY_WX_MP } from "@/api/mall";

export default {
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  components: {
    CouponPop,
    PayPop,
  },
  props: {
    feederPaymentData: {
      type: Object,
      default: {},
    },
    feederPaymentInfo: {
      type: Object,
      default: {},
    },
    statusBarHeight: {
      type: String,
      default: "",
    },
    strQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      petFoodMax: 100,
      petFoodNum: 10,
      feedPrice: 1,

      // 优惠券相关
      isCouponModelVisible: false,
      isShowCouponPop: false,
      couponPrice: { price: 0, memberCouponId: "" },
      isShowPayPop: false,
      memberId: "",
      tradeId: "",
      tradeNo: "",
      showOverlay: false,
      // 支付 金额信息
      payInfo: {
        payAmount: undefined,
        couponDiscountAmount: undefined,
        rightType: undefined,
      },
      feedDefaultUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/feed_default.png",
      ableCouponList: [],
      disableCouponList: [],
      radioValue: "",
      couponIconColor: "#fe2442",
      currentCouponData: {},
    };
  },
  computed: {
    // 转换优惠券整数部分
    couponInteger() {
      return Math.floor(this.couponPrice.price);
    },
    // 转换优惠券小数部分
    couponDecimal() {
      // console.log((this.couponPrice % 1).toFixed(2).toString().slice(1));
      return (this.couponPrice.price % 1).toFixed(2).toString().slice(1);
    },
  },
  methods: {
    // gotoFeeded() {
    //   uni.redirectTo({
    //     url: `/pagesE/feeded/index?petFoodNum=${this.feederPaymentData.unitWeight}`,
    //   });
    // },
    // 返回按钮
    handleBack() {
      console.log("click", "返回按钮");
      uni.navigateBack({
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
    },
    handleOrderStatus() {},
    // 立即支付
    async handleImmediatePay() {
      console.log("click", "立即支付");
      // #ifdef H5
      this.isShowPayPop = true;
      // #endif
      this.showOverlay = true;

      try {
        if (!this.memberId) {
          this.memberId = await this.getUserMemberId();
        }
        const addCartFlag = await this.addCartHandle();
        if (!addCartFlag) return;
        await this.submitOrder();
      } catch (err) {
        console.log("request err--handleImmediatePay:", err);
        this.showOverlay = false;
      }
      // uni.navigateTo({
      //   url: "/pagesE/feeded/index",
      // });
    },
    // 优惠券列表
    handleCouponTouch() {
      console.log("click", "优惠券展示");
      this.isShowCouponPop = true;
    },
    async addCartHandle() {
      try {
        const addData = {
          cartType: 2,
          memberId: this.memberId,
          shopId: this.feederPaymentInfo.shopId,
          skuId: this.feederPaymentInfo.skuId,
          skuQty: 1,
        };
        console.log("params:", addData);
        const res = await addCart(addData);
        console.log("addCart", res);
        return res.data.data?.isSuccess;
      } catch (err) {
        console.log("request err---addCart:", err);
        this.showOverlay = false;
      }
    },
    async getCouponList(params, feederPaymentData) {
      try {
        // if (!this.memberId) {
        //   this.memberId = await this.getUserMemberId();
        // }
        console.log(
          "getCouponList===========================>",
          this.feederPaymentData,
          feederPaymentData
        );

        const data = {
          channel: "MINI",
          list: [
            {
              skuId: params.skuId,
              shopId: this.feederPaymentInfo.shopId,
              // memberId: this.memberId,
              price: feederPaymentData.money,
              // price: 20,
              skuQty: 1,
              // platformId: "1699310123233079297",
            },
          ],
        };
        console.log("GET_COUPON_LIST---data", data);
        const {
          data: { data: couponList },
        } = await GET_COUPON_LIST(data);
        this.ableCouponList = couponList.filter((item) => item.isAvailable);
        this.disableCouponList = couponList.filter((item) => !item.isAvailable);
        // 此处写最大优惠获取逻辑
        this.getPayAmount(true);
        console.log("GET_COUPON_LIST---res", couponList);
      } catch (error) {
        console.log("🚀 request error:", error);
      }
    },
    async getUserMemberId() {
      let memberId = this.userInfo?.memberId;
      if (memberId) {
        console.log(`memberId: ${memberId}`);
        return memberId;
      }

      const user = await getUserInfo(true, true);
      if (this.userInfo) {
        this.userInfo.memberId = memberId;
      }
      console.log(`memberId: ${user.memberId}`);
      return user.memberId;
    },
    async createMallOrder() {
      const data = {
        cartType: 2,
        memberId: this.memberId,
        skuId: this.feederPaymentInfo.skuId,
        shopId: this.feederPaymentInfo.shopId,
        shopRemarkDTOList: [],
        memberCouponId: this.couponPrice.memberCouponId,
        sourceOrderType: 5,
        // 换接口新加参数
        feedingUuId: this.feederPaymentInfo.deviceId,
        feedingWeight: this.feederPaymentData.unitWeight, // 默认传10g
        storeId: this.feederPaymentData.storeId,
        feederId: this.memberId,
      };
      try {
        const res = await CREATE_ORDER(data);
        console.log("create order: ", res);
        if (res?.data && res?.data?.code == 0) {
          return {
            tradeId: res.data.data.tradeId,
            tradeNo: res.data.data.tradeNo,
          };
        } else {
          this.showOverlay = false;
          return uni.showToast({
            icon: "none",
            title: res.data.message,
          });
        }
      } catch (err) {
        console.log("request err--createMallOrder:", err, data);
        uni.showModal({
          title: "提示",
          content: err.message,
          confirmText: "确定",
          showCancel: false,
          success: () => {
            uni.reLaunch({
              url: `/pagesE/feederPayment/index?${this.strQuery}`, // 这里替换为你当前页面的路径
            });
          },
        });
      }
    },
    async submitOrder() {
      try {
        const { tradeId, tradeNo } = await this.createMallOrder();
        this.tradeId = tradeId;
        this.tradeNo = tradeNo;
        // 判断子单or整单 === 目前认为创建订单这里为整单，只有我的待付款才是子单
        console.log("orderInfo: ", tradeId, tradeNo);
        // 微信支付
        if (tradeId && tradeNo) {
          this.requestWxPay(tradeId, tradeNo);
        }
      } catch (err) {
        uni.hideLoading();
        this.showOverlay = false;
        console.log("submitOrder err ===================，", err);
      }
    },
    async requestWxPay(tradeId, tradeNo, payInfo) {
      // 通过 订单号，生成 微信支付 单号
      try {
        // 微信 预支付信息
        const res = await this.getWxMpPrepayInfo(
          tradeId,
          tradeNo,
          // this.feederPaymentData.money
          this.payInfo.payAmount
        );
        // 微信支付订单
        console.log("wx mp prepay info: ", res);
        const wxPayOrder = res?.data?.data;

        if (res?.data?.code != 0) {
          throw res.data?.message ?? "微信支付生成订单失败";
        }
        if (res?.data?.data?.zeroPayFlag) {
          console.log("0gou==", this.feederPaymentData.unitWeight);
          //0元购
          uni.redirectTo({
            url: `/pagesE/feeded/index?petFoodNum=${this.feederPaymentData.unitWeight}`,
          });
          return;
        }
        let that = this;
        // 通过微信单号，拉起 微信支付
        uni.requestPayment({
          provider: "wxpay",
          orderInfo: { ...wxPayOrder, package: wxPayOrder.packages },
          timeStamp: wxPayOrder.timeStamp,
          nonceStr: wxPayOrder.nonceStr,
          package: wxPayOrder.packages,
          signType: wxPayOrder.signType,
          paySign: wxPayOrder.paySign,
          success(res) {
            console.log("微信支付成功：", res);
            // 查询订单 状态
            that.nextOrder(tradeId, tradeNo);
          },
          fail(e) {
            console.log("支付失败：", e);
            console.log(that.showOverlay);
            that.showOverlay = false;
            console.log(that.showOverlay);
            uni.showToast({
              icon: "none",
              title: "支付失败",
            });
          },
        });

        uni.hideLoading();
      } catch (err) {
        console.log("wx prepay err: ", err);
        this.showOverlay = false;
        uni.hideLoading();
        let errMsg = "";
        if (typeof err === "string") {
          errMsg = err;
        } else {
          errMsg = err.message;
        }
        uni.showToast({
          icon: "none",
          title: errMsg,
        });
      }
    },
    async getWxMpPrepayInfo(tradeId, tradeNo, payAmount) {
      // 支付金额
      const that = this;
      const memberId = this.memberId;
      const { userId, openId } = uni.getStorageSync("storage_info");
      let data = {
        memberId,
        biz: "O2O",
        tradeNo: tradeNo,
        commodityName: `宠胖胖订单-${tradeNo}`,
        tradeAmount: payAmount,
        payType: "WX",
        payServiceType: "WECHAT_JSXCX",
        channelUserId: openId,
        payMode: "FULL_ORDER_PAY", // 整单
      };
      const discountAmount = this.payInfo?.couponDiscountAmount || 0;
      if (discountAmount > 0) {
        data = {
          ...data,
          discountAmount,
        };
      }
      const promotionAmount = this.payInfo?.activityDiscountAmount || 0;
      if (promotionAmount > 0) {
        data = {
          ...data,
          promotionAmount,
        };
      }
      return await PREPAY_WX_MP(data);
    },
    async nextOrder(tradeId, tradeNo) {
      console.log("order info: ", tradeId, tradeNo);
      let orderInfo = {};
      let isPaySucessful = false;
      // 轮询3次，查询是否支付成功，跳转支付成功页 或 详情
      uni.showLoading({
        mask: true,
      });
      // this.showOverlay = true;
      try {
        for (let i = 1; i <= 3; i++) {
          // 查询订单信息
          const res = await GET_ORDER_TRADE_DETAIL({
            tradeId: tradeId,
          });

          let { orderNo, orderType, payAmount, saleOrderId } = res.data.data;
          // this.score = res.data.data.score;
          orderInfo = {
            // orderNo: orderNo,
            orderId: saleOrderId,
            // orderType: orderType,
          };
          // 获取成功
          if (res.data?.code == 0 && res.data?.data?.paySuccessStatus) {
            isPaySucessful = true;
            break;
          }
        }
      } catch (err) {
        console.log(err);
        this.showOverlay = false;
      }
      uni.hideLoading();

      if (isPaySucessful) {
        // this.showOverlay = false;
        console.log("z支付成功");
        uni.redirectTo({
          url: `/pagesE/feeded/index?petFoodNum=${this.feederPaymentData.unitWeight}`,
        });
      } else {
        console.log("z支付失败");
        uni.showToast({
          icon: "none",
          title: "支付失败",
          duration: 1000,
        });
        this.showOverlay = false;
      }
    },
    // 网上找到的精确减法计算
    computeSub(a, b) {
      let c, d, e;
      try {
        c = a.toString().split(".")[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split(".")[1].length;
      } catch (f) {
        d = 0;
      }
      e = Math.pow(10, Math.max(c, d));
      return (this.computeMul(a, e) - this.computeMul(b, e)) / e;
    },
    computeMul(a, b) {
      let c = 0,
        d = a.toString(),
        e = b.toString();
      try {
        c += d.split(".")[1].length;
      } catch (f) {}
      try {
        c += e.split(".")[1].length;
      } catch (f) {}
      return (
        (Number(d.replace(".", "")) * Number(e.replace(".", ""))) /
        Math.pow(10, c)
      );
    },

    maxDiscountCoupons(isMax = true) {
      let maxCoupon;
      if (this.ableCouponList.length) {
        if (isMax) {
          maxCoupon = this.ableCouponList.find(
            (item) => item.maxDiscountCoupons
          );
        } else {
          maxCoupon = this.ableCouponList.find(
            (item) => item.memberCouponId == this.couponPrice.memberCouponId
          );
        }
        if (maxCoupon) {
          console.log("maxCoupon", maxCoupon);
          this.payInfo.couponDiscountAmount = maxCoupon.amount;
          this.payInfo.rightType = maxCoupon.rightType;
          this.couponPrice.price = maxCoupon.amount;
          this.couponPrice.memberCouponId = maxCoupon.memberCouponId;
          this.radioValue = maxCoupon.memberCouponId;
        }
      }
      console.log("maxCoupon2", maxCoupon);
      if (maxCoupon) {
        return maxCoupon.amount || 0;
      } else {
        return 0;
      }
    },
    getPayAmount(isFirst) {
      console.log(
        this.feederPaymentData.money,
        this.couponPrice.memberCouponId
      );

      if (this.couponPrice.memberCouponId || isFirst) {
        console.log("isFirst", isFirst);
        if (isFirst) {
          let maxCoupon;
          if (this.ableCouponList.length) {
            maxCoupon = this.ableCouponList.find(
              (item) => item.maxDiscountCoupons
            );
          }
          console.log("maxCoupon", maxCoupon);
          if (maxCoupon) {
            console.log("maxCoupon isFirst", maxCoupon);
            this.payInfo.rightType = maxCoupon.rightType;
            this.currentCouponData = maxCoupon;
            this.radioValue = maxCoupon.memberCouponId;
            this.couponPrice.memberCouponId = maxCoupon.memberCouponId; //todo
          } else {
            this.payInfo.payAmount = this.feederPaymentData.money;
          }
        }
        // 201为商品免费券
        if (this.payInfo.rightType == 201) {
          this.payInfo.payAmount = 0;
        }
        // 216为折扣券
        if (this.payInfo.rightType == 216) {
          this.payInfo.payAmount = this.ceilToTwoDecimals(
            this.computeMul(
              this.feederPaymentData.money,
              this.currentCouponData.discount
            )
          );
          // 计算打折后优惠金额
          this.couponPrice.price = this.computeSub(
            this.feederPaymentData.money,
            this.payInfo.payAmount
          );
          console.log(
            "this.payInfo.payAmount",
            this.payInfo.payAmount,
            this.couponPrice.price
          );
        }
        // 211为满减券
        if (this.payInfo.rightType == 211) {
          this.payInfo.payAmount = this.computeSub(
            this.feederPaymentData.money,
            this.maxDiscountCoupons(isFirst)
          );
          if (this.payInfo.payAmount < 0) {
            this.payInfo.payAmount = 0;
          }
        }
      } else {
        this.payInfo.payAmount = this.feederPaymentData.money;
      }
      this.$emit("update:isLoading", false);
    },
    // 折扣券保留两位向上取整
    ceilToTwoDecimals(number) {
      return Math.ceil(number * 100) / 100;
    },
    // 计算折扣券已减
    floorToTwoDecimals(number) {
      return Math.floor(number * 100) / 100;
    },
    changeCouponInfo(data) {
      console.log("changeCouponInfo:", data, this.ableCouponList);
      this.couponPrice.price = data.amount;
      this.couponPrice.memberCouponId = data.memberCouponId;
      this.radioValue = data.memberCouponId;
      this.currentCouponData = data;
      this.payInfo.couponDiscountAmount = data.amount;
      this.payInfo.rightType = data.rightType;
      this.getPayAmount(false);
      if (data.memberCouponId) {
        this.couponIconColor = "#fe2442";
      } else {
        this.couponIconColor = "rgb(153,153,153)";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  background-color: #1f1f1f;
  padding-bottom: 60rpx;
  position: relative;

  .header {
    margin-top: 4rpx;
    padding-left: 29rpx;
    height: 58rpx;
    position: fixed;
    top: 0;
    left: 0;

    .back-btn {
      .home-btn {
        width: 58rpx;
        height: 58rpx;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        image {
          width: 35rpx;
          height: 35rpx;
        }
      }
    }
  }

  .main {
    .photo {
      position: absolute;
      top: 5%;
      left: 0;
      width: 100%;
      text-align: center;

      image {
        width: 481rpx;
        height: 769rpx;
      }
    }

    .content-box {
      position: relative;
      min-height: 60vh;
    }

    .title-text {
      position: absolute;
      top: 80%;
      left: 0;
      width: 100%;
      margin-top: 150rpx;
    }

    .btn-container {
      position: absolute;
      top: 90%;
      left: 0;
      width: 100%;
    }

    .header-style {
      height: 58rpx;
    }

    .feed-num {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 38rpx;
      color: #ffffff;
      line-height: 54rpx;
      text-align: center;
      font-style: normal;

      margin-bottom: 19rpx;
    }

    .feed-hint {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: #999999;
      line-height: 35rpx;
      text-align: center;
      font-style: normal;
    }

    .pay-btn {
      width: 423rpx;
      height: 96rpx;
      background: #fe2442;
      color: #ffffff;
      border-radius: 48rpx;
      text-align: center;
      line-height: 96rpx;
      margin: 201rpx auto 96rpx auto;

      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 35rpx;
      line-height: 96rpx;
      text-align: center;
    }
    /* 当屏幕高度小于400px时 */
    @media screen and (min-height: 800px) {
      .pay-btn {
        margin-top: 151rpx;
      }
      .title-text {
        margin-top: 100rpx;
      }
      .coupon-hint {
        margin-top: 200rpx;
      }
    }

    .coupon-hint {
      display: flex;
      justify-content: center;
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 250rpx;
      width: 100%;

      .coupon-container {
        display: inline-flex;
        align-items: center;
        height: 77rpx;
        border-radius: 38rpx;
        border: 1rpx solid #333333;
        padding: 19rpx 29rpx;
      }

      .coupon-text {
        font-weight: 400;
        font-size: 25rpx;
        color: #999999;
        line-height: 38rpx;
      }
      .price-red {
        color: #fe2442;
      }
      .price-container {
        display: inline;
        margin-left: 10rpx;
        line-height: 32rpx;

        font-family: PingFangSC, PingFang SC;
        color: #fe2442;

        .price-icon,
        .price-integer {
          font-size: 25rpx;
          line-height: 35rpx;
        }
        .price-decimal {
          font-size: 21rpx;
          line-height: 35rpx;
        }
        .icon-right {
          font-size: 25rpx;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.coupon-container {
  ::v-deep .u-icon__icon {
    margin-left: 10rpx;
    margin-top: 4rpx;
    font-size: 20rpx !important;
  }
}
.back-btn {
  width: 58rpx;
  height: 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 50%;

  ::v-deep span {
    font-size: 30rpx;
  }
}
::v-deep .u-loading-page__warpper__loading-icon__img {
  width: 24px !important;
  height: 24px !important;
}
::v-deep .u-loading-page__warpper__text {
  font-size: 18px !important;
}
</style>
