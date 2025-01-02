<template>
  <view class="page-wrapper">
    <block v-if="consultResult" style="height: 100vh; width: 100%">
      <u-loading-page
        :loading="true"
        loading-text="订单支付中，请稍等"
        bg-color="#e8e8e8"
        color="#000"
      ></u-loading-page>
    </block>
    <block v-else>
      <!-- 标题 -->
      <!-- #ifdef H5 -->
      <view
        class="nav-bar"
        :style="{
           paddingTop: `${ statusBarHeight }px`,
        }"
      >
        <view class="nav-wrapper">
          <view class="nav-back" @click="handleNavBack"></view>
          <view class="title-wrapper">
            <view class="title">确认订单</view>
          </view>
        </view>
      </view>
      <view class="empty-box" :style="{
           height: `${ statusBarHeight }px`,
        }"></view>
      <!-- #endif -->
      <InquiryPetInfo v-if="inquiryPetInfo" :item="inquiryPetInfo" />
      <view class="order-info">
        <view class="order-item">
          <view class="title">订单金额</view>
          <view class="content-wrapper">
            <GoodsPrice
              :salePrice="salePrice"
              :salePriceIntegerFontSize="35"
              :salePriceDecimalFontSize="23"
              :saleColor="'#1F1F1F'"
            ></GoodsPrice>
          </view>
        </view>
      </view>

      <view class="pay-info">
        <view
          v-for="(item, index) in payments"
          :key="item.name"
          class="pay-item"
          @click="handlePaymentClick(index)"
        >
          <image class="ico" :src="item.ico" mode="aspectFit"></image>
          <view class="name">{{ item.name }}</view>
          <view
            :class="['check', index == payIndex ? 'checked' : 'normal']"
          ></view>
        </view>
      </view>

      <view
        class="submit-placeholder"
        :style="{
          paddingBottom: safeAreaBottom,
        }"
      ></view>

      <view
        class="submit-wrapper"
        :style="{
          paddingBottom: safeAreaBottom,
        }"
      >
        <view class="price-wrapper">
          <GoodsPrice
            :salePrice="salePrice"
            :salePriceIntegerFontSize="46"
            :salePriceDecimalFontSize="35"
            :saleColor="'#FF5B05'"
          ></GoodsPrice>
        </view>
        <!-- <view class="submit-btn" @click="() => {consultResult = 'test'; navToChat();}">提交订单</view> -->
        <view class="submit-btn" @click="submitOrder">提交订单</view>
      </view>
    </block>
  </view>
</template>

<script>
import GoodsPrice from "@/components/goodsPrice/index.vue";
import InquiryPetInfo from "@/pagesD/inquiryOrderDetail/components/inquiryPetInfo.vue";
import {
  GET_CONSULTATION_INFO,
  SUBMIT_CONSULT_ORDER,
  CHECK_ORDER_PAYMENT,
  GET_CONSULTATION_INFO_V2,
  CHECK_ORDER_PAYMENT_V2,
} from "@/api/medical.js";
import { action_report, display_report } from "@/utils/track";

const module_name = "medical";

export default {
  components: {
    InquiryPetInfo,
    GoodsPrice,
  },

  data() {
    return {
      safeAreaBottom: "0px",
      payIndex: 0,
      payments: [
        {
          ico: "https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-weixin.png",
          name: "微信支付",
        },
        {
          ico: "https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-alipay.png",
          name: "支付宝",
        },
      ],
      cid: null,
      skuId: null,
      originalPrice: null,
      discountedPrice: null,
      consultInfo: null,
      inquiryPetInfo: null,
      // 问诊结果
      consultResult: null,
      isSubmiting: false,
      isCheckingOrder: false,
      statusBarHeight: 0,
    };
  },

  computed: {
    salePrice() {
      if (!this.discountedPrice || this.discountedPrice === "") {
        return this.discountedPrice;
      } else {
        return this.originalPrice ?? "0";
      }
    },
  },

  onLoad(query) {
    this.cid = query.cid;
    this.skuId = query.skuId;
    this.discountedPrice = query.discountedPrice;
    this.originalPrice = query.discountedPrice;
    // console.log(`id: ${id}, skuId: ${skuId}`);

    this.cid && this.getConsultationInfo(this.cid);
  },

  mounted() {
    this.safeAreaBottom = getApp().globalData.h5BottomSafeAreaHeight + "px";
    //#ifdef MP-WEIXIN
    this.statusBarHeight = -45;
    //#endif
    //#ifdef H5
    this.statusBarHeight = Number(getApp().globalData.h5StatusBarHeight);
    //#endif
  },

  onReady() {
    // #ifdef H5
    this.$dsBridge.register("appDidBecomeActive", this.handlePageShow);
    // #endif
  },

  onShow() {
    this.handlePageShow();
    // 埋点
    display_report({
      display_name: "preorder_list_show",
      object_type: module_name,
    });
  },

  methods: {
    handleNavBack() {
      //#ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
      //#ifdef MP-WEIXIN
      // uni.navigateBack({
      //   delta: 1,
      // });
      //#endif
    },
    handlePageShow() {
      console.log("onPageShow");
      // 判断是否提交订单，
      // 如果有订单信息，查询 详情接口
      // 触发 刷新 接口，获取详情，进行下一步操作
      const result = this.consultResult;
      if (result) {
        // 获取 详情 信息
        this.checkOrderStatus(result);
      }
    },

    async getConsultationInfo(cid) {
      try {
        const res = await GET_CONSULTATION_INFO_V2({ cacheId: cid });
        this.consultInfo = res.data;
        this.inquiryPetInfo = {
          ...res.data,
          petInformation: res.data.preFilledInfo,
        };
        console.log("info: ", this.consultInfo);
      } catch (e) {
        console.log("get consultation info err: ", e);
      }
    },

    async submitOrder() {
      if (this.isSubmiting) return;

      // 提交
      action_report({
        action_name: "preorder_list_submit_clk",
        module_name: module_name,
      });

      this.isSubmiting = true;
      // 显示加载中
      uni.showLoading({
        title: "加载中...",
        mask: true,
      });
      console.log("submit order");
      try {
        let sourceOrderType = 5;
        // #ifdef H5
        sourceOrderType = 4;
        // #endif
        /**
         * 返回值：
         * {
         * "userGroupId":"QDCZSWZD1861651290942210048",
         * "preempt":null,
         * "consultationId":"6749d2991742130001cff62b",
         * "deadlineTime":null,
         * "cid":"380986865087844352_1732891289314",
         * "orderId":"1862507176093249538",
         * "orderNo":"CCO24112900034"}
         * */
        const submitParams = {
          ...this.consultInfo,
          resourceType: "CHARGE",
          sourceOrderType,
        }
        //#ifdef H5
        submitParams.source = this.$dsBridge.call("getAppInfo", "os");

        try {
          const local = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
            ? JSON.parse(
              this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
              {}
            )
            : {};
          console.log(local, "localJson");
          const {
            lat = "", // 无定位时默认城市中心点
            lon = "", // 无定位时默认城市中心点
            cityCode = "", // 城市编码
          } = local
          submitParams.lon = lon ? (lon == "0.0" ? "" : lon) : "";
          submitParams.lat = lat ? (lat == "0.0" ? "" : lat) : ""; //兼容ios空值返回0.0
        } catch (e) {
          console.log("获取定位信息失败");
        }
        // #endif
        const res = await SUBMIT_CONSULT_ORDER(
          submitParams,
          "v2"
        );
        console.log("submit order result: ", res);
        // 获取到结果，使用订单号 支付
        // res.data.consultationOrderInfo.saleOrderNo
        if (res.data) {
          // consultResult 触发 加载中
          this.consultResult = res.data;
          const saleOrderNo = res.data.orderNo;

          // 订单参数 payType 设置 微信 和 支付宝
          // this.payIndex == 0 ? 0 : 1
          console.log(
            "调用支付payType: ",
            this.payIndex,
            this.salePrice.toString(),
            saleOrderNo
          );
          // #ifdef H5
          const payType = this.payIndex;
          const tradeAmount = this.salePrice.toString();

          // 等待 2s 生成订单
          await this.delay(2000);

          this.$dsBridge.call("commonPay", {
            orderNo: saleOrderNo,
            payType,
            productName: `宠胖胖-${saleOrderNo}`,
            tradeAmount,
            biz: "O2O",
          });
          // #endif

          // 直接查询
          this.checkOrderStatus(res.data);
        } else {
          console.log("订单信息获取失败");
        }
      } catch (e) {
        console.log(e);
      } finally {
        uni.hideLoading();
        this.isSubmiting = false;
      }
    },

    delay(millisec) {
      return new Promise((resolve) => setTimeout(resolve, millisec));
    },

    async checkOrderStatus(consultResult) {
      // 检查进度
      console.log("check order status", consultResult);
      if (this.isCheckingOrder) return;

      const tickCount = process.env.NODE_ENV === "production" ? 15 : 30;
      const orderId = consultResult.consultationId;
      this.isCheckingOrder = true;
      let count = 0;
      while (true) {
        // 10 * 3s 跳订单详情
        if (count > tickCount) {
          this.navToOrderDetail(consultResult.id);
          break;
        }

        try {
          // 等待 3s
          await this.delay(2000);

          /**
           * 获取 订单 详情，查询支付进度
           * {
           * "consultationSheetState":-2,
           * "petId":"1850794657671471000",
           * "consultationId":"67488ad8b20ef400014cb334",
           * "inquiryType":"EXPERT"
           * }
           * */
          const res = await CHECK_ORDER_PAYMENT_V2(
            {
              consultationId: orderId,
            },
            "v2"
          );
          //
          // res.data.consultationSheetState = -1
          // 待接单-标识支付成功跳回等待
          if (res.data?.consultationSheetState === -1) {
            this.navToChat(res.data);
            break;
          }

          // 已关闭，或 大概 3-5 分钟 跳订单详情
          if (res.data?.consultationSheetState === 6) {
            // 查看退款状态
            console.log("跳转详情");
            this.navToOrderDetail(res.data?.consultationId);
            if (res.data.chargeRefundStatus === 1) {
              console.log("暂无接诊，已发起退款，你可以咨询其他医生哦~");
              setTimeout(() => {
                uni.showToast({
                  icon: "none",
                  title: "暂无接诊，已发起退款，你可以咨询其他医生哦~",
                  duration: 2000,
                });
              }, 200);
            } else if (res.data?.consultationSheetState === 2) {
              console.log("暂无接诊，请联系客服进行退款~");
              setTimeout(() => {
                uni.showToast({
                  icon: "none",
                  title: "暂无接诊，请联系客服进行退款~",
                  duration: 2000,
                });
              }, 200);
            }
            break;
          } else {
            // 异常场景如关闭未接单等回到咨询页，咨询页会获取消息处理异常场景
            this.navToChat(res.data);
            break;
          }

          // 待支付，继续查询
        } catch (e) {
          console.log(e);
        } finally {
          count++;
          console.log("查询次数：", count);
        }
      }
      this.isCheckingOrder = false;
    },

    // 返回后，查询 订单信息，跳转详情
    navToOrderDetail(sheetId) {
      // 问诊单ID，而非 支付单ID
      uni.redirectTo({
        url: `/pagesD/inquiryOrderDetail/v2/index?consultationSheetId=${sheetId}`,
      });
    },

    // 跳转到 问诊 聊天
    navToChat({ petId, consultationId, inquiryType }) {
      // 测试  "ZXWZ1703952796941942784"
      // #ifdef H5
      // this.$dsBridge.call("gotoPageThroughRoute", {
      //   page: "/medical/inquiry/chat",
      //   data: {
      //     groupId,
      //     inquiryType,
      //   },
      //   closeOldWebview: 1,
      // });
      // #endif
      // 直接返回问咨询页面
      // uni.redirectTo({
      //   url: `/pagesA/diseaseDesc/index?from=inquiryOrderSubmit&petId=${petId}&consultationId=${consultationId}&inquiryType=${inquiryType}`
      // })
      //#ifdef H5
      console.log('针对跳转场景，设置问诊单缓存信息，续接咨询页的查询历史记录', consultationId)
      uni.setStorageSync('submit_consultation_info', {
        from: 'inquiryOrderSubmitV2',
        consultationId
      });
      this.$dsBridge.call('closeCurrentWebview', {})
      //#endif
    },

    navBack() {
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif

      // #ifndef H5
      uni.navigateBack();
      // #endif
    },

    handlePaymentClick(index) {
      this.payIndex = index;
    },
  },
};
</script>

<style>
page {
  background-color: #f7f8fc;
}
</style>

<style lang="scss" scoped>
.page {
  height: 100%;
  width: 100%;
}

.page-wrapper {
  display: flex;
  flex-flow: column nowrap;
  // #ifdef H5
  padding-top: 100rpx;
  // #endif
  .order-info {
    display: flex;
    flex-flow: column nowrap;
    margin: 19rpx 15rpx 0;
    background: #ffffff;
    border-radius: 15rpx;
    padding: 11rpx 0px;

    .order-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 86rpx;
      padding: 0 23rpx;

      .title {
        font-size: 29rpx;
        color: #1f1f1f;
        flex: 1 1 0;
      }

      .content-wrapper {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
      }
    }
  }

  .pay-info {
    display: flex;
    flex-flow: column nowrap;
    margin: 19rpx 15rpx 0;
    background: #ffffff;
    border-radius: 15rpx;
    padding: 11rpx 0px;

    .pay-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 75rpx;
      box-sizing: content-box;
      padding: 0 23rpx;

      .ico {
        height: 48rpx;
        width: 48rpx;
      }

      .name {
        width: 115rpx;
        height: 40rpx;
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
        line-height: 40rpx;
        margin-left: 17rpx;
        flex: auto;
      }

      .check {
        height: 35rpx;
        width: 35rpx;

        &.normal {
          background-repeat: no-repeat;
          background-size: contain;
          background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-radio-normal.png");
        }

        &.checked {
          background-repeat: no-repeat;
          background-size: contain;
          background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-radio-checked.png");
        }
      }
    }
  }

  .submit-placeholder {
    width: 100%;
    height: 131rpx;
    margin-top: 32rpx;
  }

  .submit-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 131rpx;
    box-sizing: content-box;
    background-color: white;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .price-wrapper {
      flex: 1 1 0;
      margin-left: 31rpx;
    }

    .submit-btn {
      width: 250rpx;
      height: 85rpx;
      background: #ffd41e;
      border-radius: 42rpx;
      text-align: center;
      line-height: 85rpx;
      margin-right: 25rpx;
      font-size: 31rpx;
      font-weight: 500;
      color: #1f1f1f;
    }
  }

  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    box-sizing: content-box;
    background-color: #fff;
    background-size: cover;
    .nav-wrapper {
      position: relative;
      height: 90rpx;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      .nav-back {
        position: absolute;
        left: 31rpx;
        top: 21rpx;
        height: 42rpx;
        width: 42rpx;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/index/back-black-tag.png);
      }

      .title-wrapper {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        margin-top: 19rpx;

        .title {
          font-size: 35rpx;
          font-weight: 500;
          color: #1f1f1f;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: PingFangSC, PingFang SC;
        }
      }
    }
  }
}
</style>
