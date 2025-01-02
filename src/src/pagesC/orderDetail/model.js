import {
  CANCEL_ORDER,
  CHECK_STATUS,
  CONFIRM_ORDER,
  DELETE_ORDER,
  GET_ORDER_DETAIL_LOADING,
  PREPAY_WX_MP,
  APP_PREPAY,
} from "@/api/mall";
import { APPLY_AFTER_SALE } from "@/api/mallv2";
import { getUserInfo } from "@/api/base";
// #ifdef H5
import dsBridge from "dsbridge";
// #endif

class OrderDetailModel {
  userInfo;
  constructor() {
    this.data = {
      countDownTime: 0, ///倒计时
      deliveryInfo: {
        ///(订单配送信息响应对象)
        address: "", ///详细地址
        city: "", ///市
        cityCode: "", ///
        county: "", ///区
        countyCode: "", ///
        deliveryStatus: "", ///物流状态
        lat: 0, ///
        logisticsCompanyCode: "", ///物流公司code
        logisticsCompanyName: "", ///物流公司名
        logisticsNo: "", ///物流单号
        lon: 0, ///
        name: "", ///收件人姓名
        phone: "", ///收件人手机号
        province: "", ///省份
        provinceCode: "", ///
        shippingType: 1, /// 2快递 3自提
        userAddressId: 0, ///地址id
      },
      freight: 0, ///运费，单位：元
      orderAmount: 0, ///订单商品金额(商品零售价 * 商品数量)，单位：元
      orderId: 0, ///订单id
      orderItems: [
        ///(订单明细
        {
          imageUrl: "", ///sku主图资源链接 当为视频时 为视频的第一帧
          itemId: 0, ///商品id
          orderItemId: 0, ///订单明细Id
          price: 0, ///sku零售价
          propertyList: [
            ///订单sku属性信息响应对象
            {
              propertyId: 0, ///属性Id
              propertyName: "", ///属性值
            },
          ],
          realPayAmount: 0, ///应收金额(订单商品金额 + 折让金额)
          skuId: 0, ///skuId
          skuName: "", ///sku名称
          skuQty: 0, ///商品数量
        },
      ],
      orderNo: "", ///订单编号
      orderOperatorResponse: {
        ///用户订单操作响应对象
        canAfterSale: true, ///是否可申请售后, true: 可申请售后, false: 不可申请售后
        refundable: true, ///是否可退款； true: 可申请退款, false: 不可申请退款
        viewAfterSaleDetail: true, ///是否可查看售后详情, true: 可查看售后详情, false: 不可查看售后详情
      },
      orderStatus: 0, ///订单状态： 1-待支付、2-待发货、3-待收货、4-已签收、5-待核销、6-已核销、7-交易完成、8-交易关闭、9-已过期、12-支付中、14-退款中、15-已退款、16-退货退款、20-部分退款、21-部分退货退款
      orderStatusName: "", ///订单状态中文
      orderTime: "", ///下单时间
      orderType: "", ///订单类型 C端商城订单-020 、 C端服务订单-021
      orderTypeName: "", ///订单类型中文
      payAmount: 0, ///订单实付金额，单位：元
      payEndTime: "", ///支付结束时间 待付款倒计时展示
      payType: 0, ///支付方式 2微信 3支付宝
      realPayAmount: 0, ///应收金额(订单商品金额 + 折让金额 + 运费)
      remark: "", ///备注
      paySuccessTime: "", ///付款时间
      shopInfo: {
        ///核销订单门店信息响应对象
        businessEndTime: "", ///结束营业时间
        businessStartTime: "", ///开始营业时间
        shopAddressInfo: {
          ///订单配送信息响应对象
          address: "", ///
          city: "", ///
          cityCode: "", ///
          county: "", ///
          countyCode: "", ///
          deliveryStatus: "", ///
          lat: 0, ///
          logisticsCompanyCode: "", ///
          logisticsCompanyName: "", ///
          logisticsNo: "", ///
          lon: 0, ///
          name: "", ///
          phone: "", ///
          province: "", ///
          provinceCode: "", ///
          shippingType: 0, ///
          userAddressId: 0, ///
        },
        shopId: "", ///门店id
        shopName: "", ///门店名称
        shopPhone: "", ///门店电话
      },
      verifyInfoList: [
        ///订单核销信息响应对象
        {
          verifyCode: "", ///核销码
          verifyShopId: 0, ///核销门店Id
          verifyShopName: "", ///核销门店名称
          verifyTime: "", ///核销时间
          verifyValidEndTime: "", ///核销有效期结束时间
          verifyValidStartTime: "", ///核销有效期开始时间
        },
      ],
      afterSaleInfo: {
        afterSaleOrderId: "",
        afterSaleOrderNo: "",
        afterSaleStatus: 0,
      },
    };
  }

  secretPhone(phone) {
    return phone.substr(0, 3) + "****" + phone.substring(7);
  }

  /// 删除订单
  async com_deleteOrder(orderId) {
    const res = await DELETE_ORDER({ orderId });
    console.log("删除订单:::::", res);
    if (res?.data?.code === 0) {
      uni.showToast({
        title: "删除成功",
        icon: "none",
      });
      uni.navigateBack();
    } else {
      uni.showToast({
        title: res?.data?.message,
        icon: "none",
      });
    }
  }
  /// 取消订单
  async com_cancelOrder(orderId, successCallback) {
    const res = await CANCEL_ORDER({ orderId });
    console.log("取消订单:::::", res);
    if (res?.data?.code === 0) {
      uni.showToast({
        title: "取消成功",
        icon: "none",
      });
      successCallback();
    } else {
      uni.showToast({
        title: "取消订单失败",
        icon: "none",
      });
    }
  }

  /// 确认收货
  async com_confirmOrder(orderId, isNavigateEvaluate, successCallback) {
    const res = await CONFIRM_ORDER({ orderId });
    console.log("确认收货:::::", res);
    if (res?.data?.code === 0) {
      uni.showToast({
        title: "确认收货成功",
        icon: "none",
      });
      if (isNavigateEvaluate) {
        successCallback();
      } else {
        uni.navigateBack();
      }
    } else {
      uni.showToast({
        title: "确认收货失败",
        icon: "none",
      });
    }
  }

  /// 申请退款
  async com_applyRefund(orderId, item, reason, additionalReason, payMount) {
    uni.showLoading({
      title: "",
      mask: true,
    });
    try {
      const res = await APPLY_AFTER_SALE({
        sourceOrderType: 5,
        source: 1,
        orderId: orderId, //订单id
        afterSaleType: 6, // 6-售后商城仅退款
        afterSaleReason: reason, //退款原因
        additionalDesc: additionalReason, //补充描述
        afterSaleNum: item.skuQty, //申请售后数量
        refundAmount: payMount, //退款金额
        itemId: item.itemId, //商品itemId
        orderItemId: item.orderItemId, //订单行id
        skuId: item.skuId, //skuId
        APPLY_AFTER_SALE: "v2",
      });
      uni.hideLoading();
      console.log("com_applyRefund::", res);
      const { code, data, message } = res?.data;
      console.log("res?.data::", res?.data);
      if (code !== 0) {
        uni.showToast({
          title: message ?? "未知错误",
          icon: "none",
        });
        return;
      }
      const afterSaleOrderId = data.afterSaleOrderId;
      if (afterSaleOrderId) {
        uni.showToast({
          title: "退款申请提交成功",
          icon: "none",
          duration: 1500,
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1500);
      }
    } catch (e) {
      console.log("申请退款报错：", e);
      uni.hideLoading();
    } finally {
    }
  }

  /// 申请售后 - 跳转界面
  com_applyAfterSale(
    orderId,
    orderItems,
    storeId,
    afterSaleRefundType,
    hasGift
  ) {
    uni.navigateTo({
      url: `/pagesC/selectAfterSaleType/index?orderId=${orderId}&storeId=${storeId}&afterSaleRefundType=${afterSaleRefundType}&hasGift=${hasGift}`,
      success: (res) => {
        res.eventChannel.emit("getOrderItems", orderItems);
      },
    });
  }

  /// 查看售后 - 跳转界面
  com_seeAfterSale(afterSaleOrderId) {
    // #ifdef MP-WEIXIN
    uni.navigateTo({
      url: `/pagesC/afterSaleDetail/index?afterSaleOrderId=${afterSaleOrderId}`,
    });
    // #endif
    // #ifdef H5
    dsBridge.call(
      `${window.location.origin}/crm-medical-h5/#/pagesC/afterSaleDetail/index?afterSaleOrderId=${afterSaleOrderId}`
    );
    // #endif
  }

  /// 查看物流
  com_seeLogistics(orderId) {
    // #ifdef MP-WEIXIN
    uni.navigateTo({
      url: `/pagesC/logisticsDetail/index?orderId=${orderId}`,
    });
    // #endif
    
    // #ifdef H5
    dsBridge.call(
      `${window.location.origin}/crm-medical-h5/#/pagesC/logisticsDetail/index?orderId=${orderId}`
    );
    // #endif
  }

  /// 去支付
  async com_requestWxPay(
    orderNo,
    itemName,
    payAmount,
    orderId,
    discountAmount,
    promotionAmount,
    payMode,
    successCallback,
    failCallback
  ) {
    // 通过 订单号，生成 微信支付 单号
    try {
      uni.showLoading({
        mask: true,
      });
      // 微信 预支付信息
      const res = await this.getWxMpPrepayInfo(
        orderNo,
        itemName,
        payAmount,
        payMode,
        discountAmount,
        promotionAmount
      );
      // 微信支付订单
      console.log("wx mp prepay info: ", res);
      const wxPayOrder = res?.data?.data;
      if (res?.data?.code != 0) {
        throw res.data?.message ?? "微信支付生成订单失败";
      }
      if (res?.data?.data?.zeroPayFlag) {
        successCallback();
      } else {
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
            uni.hideLoading();
            uni.showToast({
              icon: "none",
              title: "支付成功",
            });
            // 查询订单 状态
            that.nextOrder(
              orderId,
              () => {
                successCallback();
              },
              () => {
                failCallback();
              }
            );
          },
          fail(e) {
            console.log("支付失败：", e);
            uni.hideLoading();
            uni.showToast({
              icon: "none",
              title: "支付失败",
            });
            failCallback();
          },
        });
      }
    } catch (err) {
      console.log("wx prepay err: ", err);
      uni.hideLoading();
      if (typeof err === "string") {
        uni.showToast({
          icon: "none",
          title: err,
        });
      }
      failCallback();
    }
  }

  async getWxMpPrepayInfo(
    orderNo,
    itemName,
    payAmount,
    payMode,
    discountAmount,
    promotionAmount
  ) {
    // 支付金额
    const that = this;
    const memberId = await this.getUserMemberId();
    const { userId, openId } = uni.getStorageSync("storage_info");
    let data = {
      memberId,
      biz: "O2O",
      saleOrderNo: orderNo,
      commodityName: itemName,
      tradeAmount: payAmount,
      payType: "WX",
      payServiceType: "WECHAT_JSXCX",
      channelUserId: openId,
      payMode: "SUB_ORDER_PAY", // 子单
    };
    if (discountAmount > 0) {
      data = {
        ...data,
        discountAmount,
      };
    }
    if (promotionAmount > 0) {
      data = {
        ...data,
        promotionAmount,
      };
    }
    return await PREPAY_WX_MP(data);
  }

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
  }

  async nextOrder(orderId, successCallback, failCallback) {
    console.log("nextOrder");
    let isPaySucessful = false;
    // 轮询3次，查询是否支付成功
    uni.showLoading({
      mask: true,
    });
    for (let i = 0; i < 3; i++) {
      console.log(`查询订单，次数：${i + 1}`);
      try {
        await this.delay(3000);
        // 查询订单信息
        const res = await GET_ORDER_DETAIL_LOADING({
          orderId: orderId,
        });
        // 获取成功
        if (
          res.data?.code == 0 &&
          (res.data?.data?.orderStatus == 2 || res.data?.data?.orderStatus == 5)
        ) {
          isPaySucessful = true;
          break;
        }
      } catch (err) {
        console.log(err);
      }
    }
    uni.hideLoading();
    if (isPaySucessful) {
      // 支付成功
      successCallback();
    } else {
      // 支付失败
      failCallback();
    }
  }

  async delay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }
  //app支付流程
  async com_requestAppPay({ tradeInfo, successCallback, failCallback }) {
    const {} = tradeInfo;
    try {
      uni.showLoading({
        mask: true,
      });
      // 微信 预支付信息
      const res = await this.getAppPrePayInfo(
        // orderNo,
        // itemName,
        // payAmount,
        // payMode,
        // discountAmount,
        // promotionAmount
        tradeInfo
      );
      // 微信支付订单
      console.log("wx mp prepay info: ", res);
      const wxPayOrder = res?.data?.data;
      if (res?.data?.code != 0) {
        throw res.data?.message ?? "app支付生成订单失败";
      }
      if (res?.data?.data?.zeroPayFlag) {
        successCallback();
      } else {
        //唤起小程序进行支付流程
        const { appId, payOrderNo } = wxPayOrder;
        dsBridge.call("gotoPay", {
          appId,
          payOrderNo,
          type: tradeInfo.currentPayType,
        });
      }
    } catch (err) {
      console.log("app prepay err: ", err);
      uni.hideLoading();
      if (typeof err === "string") {
        uni.showToast({
          icon: "none",
          title: err,
        });
      }
      failCallback();
    }
  }
  //获取app预支付信息
  //tradeInfo= {orderNo:'',itemName:'',payAmount:'',discountAmount,promotionAmount,currentPayType}
  async getAppPrePayInfo(tradeInfo) {
    const {
      orderNo,
      itemName,
      payAmount,
      discountAmount,
      promotionAmount,
      currentPayType,
    } = tradeInfo;
    // 支付金额
    const that = this;
    const memberId = await this.getUserMemberId();
    const { userId, openId } = uni.getStorageSync("storage_info");
    let data = {
      memberId,
      biz: "O2O",
      saleOrderNo: orderNo,
      commodityName: itemName,
      tradeAmount: payAmount,
      payType: currentPayType,
      payServiceType: currentPayType == "WX" ? "WECHAT_JSXCX" : "ALIPAY_ALXCX",
      channelUserId: openId,
      payMode: "SUB_ORDER_PAY", // 子单
      tenantId: "default_tenant",
      platformId: "1699310123233079297",
      appId: "1719257571221630978",
    };
    // const discountAmount = this.payInfo?.couponDiscountAmount || 0;
    if (discountAmount > 0) {
      data = {
        ...data,
        discountAmount,
      };
    }
    // const promotionAmount = this.payInfo?.activityDiscountAmount || 0;
    if (promotionAmount > 0) {
      data = {
        ...data,
        promotionAmount,
      };
    }
    return await APP_PREPAY(data);
  }
}

const orderDetailModel = new OrderDetailModel();
export default orderDetailModel;
