<template>
  <view class="container">
    <CountDownTime
      v-if="detail.state === -2"
      :payEndTime="detail.consultationOrderInfo.paymentCountdownTimes"
      @timeDeadLine="timeDeadLine"
    ></CountDownTime>
    <view class="box">
      <InquiryPetInfo :item="detail"></InquiryPetInfo>
      <InquiryOrderItem :item="detail"></InquiryOrderItem>
      <view
        class="box-placeholder"
        :style="{
          paddingBottom: safeAreaBottom,
        }"
      ></view>
    </view>
    <view
      v-if="detail.state === 6"
      class="bottom center"
      :style="{ paddingBottom: safeAreaBottom }"
    >
      <view class="bottom-center-button" @click="$u.debounce(retryChat, 500)">
        再次咨询
      </view>
    </view>
    <view
      v-else-if="detail.state === -2"
      class="bottom spcbwn"
      :style="{ paddingBottom: safeAreaBottom }"
    >
      <view class="bottom-left" @click="$u.debounce(serviceChat, 500)">
        <i class="iconfont icon-a-kefuxiangqingye3x"></i>
        <view class="bottom-left-title">客服</view>
      </view>
      <view>
        <view class="bottom-right">
          <view
            class="bottom-right-button"
            @click="$u.debounce(cancleOrder, 500)"
          >
            取消订单
          </view>
          <view
            class="bottom-right-button pay"
            @click="$u.debounce(goPay, 500)"
          >
            去支付
          </view>
        </view>
      </view>
    </view>

    <PayLoading
      :loading="isLoadingShow"
      loadingText="支付查询中..."
    ></PayLoading>

    <CancleOrderPopup
      :isOpen.sync="isCancelPopShow"
      @confirm="cancleHandleConfirm"
    ></CancleOrderPopup>
    <PayTypeChoosePopup
      :isOpen.sync="isPayTypePopShow"
      @wechatPay="wechatPay"
      @aliPay="aliPay"
    ></PayTypeChoosePopup>
  </view>
</template>

<script>
import CountDownTime from "@/pagesD/inquiryOrderDetail/components/countDownTime.vue";
import InquiryPetInfo from "@/pagesD/inquiryOrderDetail/components/inquiryPetInfo.vue";
import InquiryOrderItem from "@/pagesD/inquiryOrderDetail/components/inquiryOrderItem.vue";
import CancleOrderPopup from "@/pagesD/inquiryOrderDetail/components/cancleOrder.vue";
import {
  inquiryOrderCancle,
  inquiryOrderDetail,
  paymentAssignDoctor,
} from "@/api/inquiryOrder";
import { getSheetsDetail } from "@/api/sheets";
import PayTypeChoosePopup from "@/pagesD/inquiryOrderDetail/components/payTypeChoose.vue";
import PayLoading from "@/pagesD/inquiryOrderDetail/components/PayLoading.vue";

export default {
  components: {
    PayLoading,
    PayTypeChoosePopup,
    CancleOrderPopup,
    InquiryOrderItem,
    InquiryPetInfo,
    CountDownTime,
  },
  data() {
    return {
      safeAreaBottom: "",
      isCancelPopShow: false,
      isPayTypePopShow: false,
      state: false,
      consultationSheetId: "",
      /// 问诊单状态：-1:待接诊 ；1：服务中；2：待评价；3：已完成；  4/5已取消 ;  -2待付款 ; 6已关闭(包含待支付主动取消和退款)
      detail: {},
      titles: {
        "-2": "待支付",
        6: "已关闭",
      },
      isLoadingShow: false, ///是否显示支付Loading
      loadingTimer: null, ///loading倒计时
    };
  },

  mounted() {
    this.safeAreaBottom = getApp().globalData.h5BottomSafeAreaHeight + "px";
  },

  onLoad(option) {
    console.log("onLoadonLoadonLoad:::", option);
    this.consultationSheetId = option.consultationSheetId;
  },

  onShow() {
    console.log("onShowonShowonShow:::", this.consultationSheetId);
    this.loadData();
  },

  onReady() {
    // #ifdef H5
    this.$dsBridge.register("inquiryPay", this.queryPaymentAssignDoctor);
    this.$dsBridge.register("appDidBecomeActive", this.cancelLoadingIfNeeded);
    // #endif
  },

  onUnload() {
    clearTimeout(this.loadingTimer);
  },

  methods: {
    ///可见刷新加载数据
    async loadData() {
      const consultationSheetId = this.consultationSheetId;
      try {
        const res = await inquiryOrderDetail({
          id: consultationSheetId,
        });
        this.detail = res.data;
        uni.setNavigationBarTitle({
          title: this.titles[this.detail.state.toString()] || "订单详情",
        });
        console.log("获取详情成功:");
        console.log(res);
        console.log(this.detail);
      } catch (e) {
        console.error("获取详情失败:", e);
      }
    },

    ///客服-调用原生交互，进入客服聊天
    serviceChat() {
      console.log("客服-调用原生交互，进入客服聊天");
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/user/custom/service`,
      });
      // #endif
    },

    cancleOrder() {
      this.isCancelPopShow = !this.isCancelPopShow;
    },

    cancleHandleConfirm(value) {
      console.log("确认回调，选中的值为:", value);
      this.isCancelPopShow = false;
      this.orderCancleRequest({
        id: this.consultationSheetId || "",
        orderId: this.detail?.consultationOrderInfo?.id || "",
        cancelReason: value || "",
      });
    },

    ///取消订单接口调用
    async orderCancleRequest(data) {
      try {
        const res = await inquiryOrderCancle(data);
        console.log("取消成功:", res);
        ///取消成功后，刷新界面
        await this.loadData();
      } catch (e) {
        console.error("取消失败:", e);
      }
    },

    // 再次咨询
    retryChat() {
      console.log("retryChatretryChat");
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      // #endif
      // #ifdef H5
      const petId = (this.detail?.petInformation?.petId || "").toString();
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: "/tool/inquiry/doctor",
        data: {
          inquiryType: this.detail?.inquiryType || "",
          doctorUserId: this.detail?.doctorInfo?.userId || "",
          petId: petId || "",
        },
        closeOldWebview: 1,
      });
      // #endif
    },

    ///倒计时结束，刷新界面
    timeDeadLine() {
      console.log("timeDeadLine倒计时结束，刷新界面:::");
      setTimeout(() => {
        this.loadData();
      }, 1500);
    },

    ///去支付按钮点击
    goPay() {
      this.isPayTypePopShow = !this.isPayTypePopShow;
    },

    ///微信支付
    wechatPay() {
      console.log("wechatPay");
      this.commonPay(0);
    },

    ///支付宝支付
    aliPay() {
      console.log("aliPay");
      this.commonPay(1);
    },

    ///支付
    commonPay(payIndex) {
      this.isLoadingShow = true;

      // 订单参数 payType 设置 微信 和 支付宝
      // payIndex == 0 ? 0 : 1
      // #ifdef H5
      const payType = payIndex;
      const tradeAmount =
        this.detail?.consultationOrderInfo?.realPayAmount.toString();
      //调用原生支付后，就等待融云通知执行后续
      this.$dsBridge.call("commonPay", {
        orderNo: this.detail?.consultationOrderInfo?.saleOrderNo || "",
        payType,
        productName: `宠胖胖-${this.detail?.consultationOrderInfo?.saleOrderNo}`,
        tradeAmount,
        biz: "O2O",
      });
      // #endif
    },

    ///取消加载Loading处理
    cancelLoadingIfNeeded() {
      // 如果标志为true，则经过了30秒 取消加载提示
      if (this.isLoadingShow) {
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer);
        }
        this.loadingTimer = setTimeout(() => {
          this.isLoadingShow = false;
        }, 30000);
      }
    },

    ///交互，收到支付结果通知，查询分派医生
    async queryPaymentAssignDoctor() {
      console.log(
        "在app问诊订单详情页进行支付后，收到该通知进行bradge交互后续处理"
      );
      try {
        const res = await paymentAssignDoctor({
          orderId: this.detail?.consultationOrderInfo?.id || "",
        });
        console.log("paymentAssignDoctor:", res);
        this.isLoadingShow = false; //隐藏Loading
        if (res?.data?.groupId) {
          ///groupId 存在，则是派单成功，跳往问诊聊天
          this.navToChat(res?.data?.groupId, this.detail?.inquiryType);
        } else {
          /// state === 6 已关闭状态
          if (res?.data?.state === 6) {
            ///问诊付费退款状态 0：未退款；1：退款成功；2退款失败
            if (res?.data?.chargeRefundStatus === 1) {
              uni.showToast({
                icon: "none",
                title: "暂无接诊，已发起退款，你可以咨询其他医生哦~",
              });
            } else if (res?.data?.chargeRefundStatus === 2) {
              uni.showToast({
                icon: "none",
                title: "暂无接诊，请联系客服进行退款~",
              });
            } else {
              ///刷新界面
              await this.loadData();
            }
          }
          ///其他情况，不处理
        }
      } catch (e) {
        console.error("查询分派医生失败:", e);
        this.isLoadingShow = false;
        await this.loadData();
      }
    },

    ///关闭webView,返回上级
    navBack() {
      setTimeout(() => {
        // #ifdef H5
        this.$dsBridge.call("closeCurrentWebview", {});
        // #endif

        // #ifndef H5
        uni.navigateBack();
        // #endif
      }, 1500);
    },

    // 跳转到 问诊 聊天
    navToChat(groupId, inquiryType) {
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: "/medical/inquiry/chat",
        data: {
          groupId,
          inquiryType,
        },
        closeOldWebview: 1,
      });
      // #endif
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
