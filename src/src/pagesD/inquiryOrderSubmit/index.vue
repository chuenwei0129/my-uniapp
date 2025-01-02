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
        const res = await GET_CONSULTATION_INFO(cid);
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
        const res = await SUBMIT_CONSULT_ORDER({
          ...this.consultInfo,
          resourceType: "CHARGE",
          sourceOrderType,
        });
        console.log("submit order result: ", res);
        // 获取到结果，使用订单号 支付
        // res.data.consultationOrderInfo.saleOrderNo
        if (res.data) {
          // consultResult 触发 加载中
          this.consultResult = res.data;
          const orderInfo = res.data.consultationOrderInfo;

          // 订单参数 payType 设置 微信 和 支付宝
          // this.payIndex == 0 ? 0 : 1
          // #ifdef H5
          const payType = this.payIndex;
          const tradeAmount = this.salePrice.toString();
          this.$dsBridge.call("commonPay", {
            orderNo: orderInfo.saleOrderNo,
            payType,
            productName: `宠胖胖-${orderInfo.saleOrderNo}`,
            tradeAmount,
            biz: "O2O",
          });
          // 直接查询
          this.checkOrderStatus(res.data);
          // #endif
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
      console.log("check order status");
      if (this.isCheckingOrder) return;

      const tickCount = process.env.NODE_ENV === "production" ? 15 : 30;
      const orderId = consultResult.consultationOrderInfo.id;
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

          // 获取 订单 详情，查询支付进度
          const res = await CHECK_ORDER_PAYMENT({
            orderId,
          });
          // 分配成功，群聊ID
          if (res.data.groupId) {
            this.navToChat(res.data.groupId, res.data.inquiryType);
            break;
          }

          // 已关闭，或 大概 3-5 分钟 跳订单详情
          if (res.data?.state === 6) {
            // 查看退款状态
            console.log("跳转详情");
            this.navToOrderDetail(consultResult.id);
            if (res.data.chargeRefundStatus === 1) {
              console.log("暂无接诊，已发起退款，你可以咨询其他医生哦~");
              setTimeout(() => {
                uni.showToast({
                  icon: "none",
                  title: "暂无接诊，已发起退款，你可以咨询其他医生哦~",
                  duration: 2000,
                });
              }, 200);
            } else if (res.data.chargeRefundStatus === 2) {
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
        url: `/pagesD/inquiryOrderDetail/index?consultationSheetId=${sheetId}`,
      });
    },

    // 跳转到 问诊 聊天
    navToChat(groupId, inquiryType) {
      // 测试  "ZXWZ1703952796941942784"
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
}
</style>
