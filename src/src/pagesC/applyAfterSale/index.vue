<template>
  <view class="apply-after-sale-wrapper">
    <AfterSaleGiftBar v-if="hasGift" />
    <view class="apply-after-sale-content">
      <view class="refund-form">
        <view v-if="afterSaleRefundType === 2" class="refund-items">
          <AfterSaleGoodsItem :goods="orderItems" />
        </view>
        <view class="refund-amount">
          <view class="refund-title">退款金额</view>
          <view class="refund-input">
            <view class="refund-input-prefix">￥</view>
            <input
              class="refund-input-field"
              type="digit"
              :focus="inputFocus"
              v-model="totalPrice"
              :disabled="true"
              @blur="this.inputFocus = false"
            />
            <!-- <view class="refund-input-button" @click="this.inputFocus = true">

              <view class="iconfont icon-edit"></view>
              修改金额
            </view> -->
          </view>
        </view>
        <!-- 消费返胖豆 -->
        <view class="refund-pangdou" v-if="score > 0">
          <view class="refund-top">
            <view class="title">退还胖豆</view>
            <view class="value">{{ score }}胖豆</view>
          </view>
          <view class="refund-tip">按退款金额占订单金额比例退还积分</view>
        </view>
        <view
          class="refund-detail"
          :style="{ paddingTop: afterSaleRefundType === 2 ? '2rpx' : '29rpx' }"
        >
          <view class="refund-count" v-if="afterSaleRefundType !== 2">
            <view>退款数量</view>
            <GoodsNumBox
              min="1"
              :num="refundCount"
              :max="maxCount"
              :isShow="false"
              @change="(e) => (this.refundCount = e)"
            />
          </view>
          <view class="refund-reason">
            <view>退款原因</view>
            <view class="refund-reason-content" @click="handleClick">
              <view v-if="hasSelectReason" style="color: #1f1f1f">{{
                refundReason
              }}</view>
              <view v-else style="color: #999">点击选择申请原因</view>
            </view>
            <view class="iconfont icon-arrowRight" />
          </view>
          <view
            class="refound-coupon"
            v-if="
              afterSaleCouponList &&
              afterSaleCouponList.length > 0 &&
              returnCouponDesc.length === 0
            "
          >
            <view class="item">
              <view>优惠券</view>
              <view class="right">
                <view class="tag" v-for="item in afterSaleCouponList">{{
                  formatDiscount(
                    item.rightType,
                    item.couponRule,
                    item.promotionName
                  )
                }}</view>
                <view class="num"> {{ afterSaleCouponList.length }}张 </view>
              </view>
            </view>
            <view class="alert">
              注：使用了该优惠券的商品均退款完成，才退还
            </view>
          </view>
          <view class="refound-coupon" v-if="returnCouponDesc.length > 0">
            <view class="item" style="margin-bottom: 19rpx">
              <view>优惠券</view>
              <view class="right">
                <text style="font-size: 29rpx; color: #ff5b05">{{
                  returnCouponDesc
                }}</text>
              </view>
            </view>
          </view>
          <view class="refund-desc">
            <view class="refund-desc-title">
              <view>原因描述</view>
              <view class="refund-desc-count"
                >您还可以输入{{ remainingRefundDescCount }}字</view
              >
            </view>
            <textarea
              class="refund-desc-input"
              placeholder="请您详情填写申请说明"
              placeholder-style="color: #C9C9C9;"
              maxlength="170"
              v-model="refundDesc"
            />
          </view>
          <view class="refund-picture">
            <view v-for="pic in refundPictures" class="item-picture">
              <image
                style="width: 156rpx; height: 156rpx; border-radius: 6rpx"
                :src="pic"
                mode="aspectFill"
              />
              <view style="position: relative; width: 0; height: 0">
                <image
                  class="iconfont"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/apply_after_sale_pic_delete.png"
                  @click="handleDeletePicture(pic)"
                />
              </view>
            </view>
            <view v-if="refundPictures.length < 3">
              <image
                class="add-picture"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/after_sale_upload_pic.png"
                @click="this.isShowPhotoPop = true"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="refund-wainTitle" v-if="afterSaleType == 6 && !isExamine">
        本单退款金额超过极速退款限额，提交后需商家审核
      </view>
      <view class="refund-commit" @tap="$u.debounce(handleCommit, 500)">
        提交申请
      </view>
    </view>
    <PhotoPop :show.sync="isShowPhotoPop" @event="handlePhoto" />
    <SelectApplyAfterSaleReasonPop
      :show.sync="isShowReasonPop"
      @onSelect="handleSelectReason"
    />
  </view>
</template>

<script>
import GoodsNumBox from "@/pagesC/components/goodsNumBox/index.vue";
import SelectApplyAfterSaleReasonPop from "@/pagesC/applyAfterSale/components/selectApplyAfterSaleReasonPop/index.vue";
import { BASR_URL } from "@/utils/http";
import { APPLY_AFTER_SALE, CALCULATE_MONEY } from "@/api/mallv2";
import { formatDiscount } from "@/utils/index";
import { REFUND_BENEFIT } from "@/api/member";
import PhotoPop from "@/pagesC/applyAfterSale/components/photoPop.vue";
import AfterSaleGiftBar from "@/pagesC/components/afterSaleGiftBar/index.vue";
import AfterSaleGoodsItem from "@/pagesC/components/afterSaleGoodsItem/index.vue";

export default {
  components: {
    AfterSaleGoodsItem,
    AfterSaleGiftBar,
    PhotoPop,
    GoodsNumBox,
    SelectApplyAfterSaleReasonPop,
  },
  data() {
    return {
      formatDiscount,
      inputFocus: false,
      isShowPhotoPop: false,
      isShowReasonPop: false,
      refundAmount: 0.0,
      refundCount: 1,
      refundReason: "",
      refundDesc: "",
      refundPictures: [],
      // 订单相关
      itemId: "",
      orderId: "",
      orderItemId: "",
      skuId: "",
      afterSaleType: "",
      totalPrice: 0,
      maxCount: 1,
      afterSaleCouponList: [],
      returnCouponDesc: "",
      // 售后退款类型： 1-单个sku退款 2-整单退
      afterSaleRefundType: 1,
      // 售后单商品列表
      orderItems: [],
      hasGift: false,
      //胖豆
      score: "",
      isExamine: false,
    };
  },
  computed: {
    hasSelectReason() {
      return this.refundReason && this.refundReason.length > 0;
    },
    remainingRefundDescCount() {
      const currentCount = this.refundDesc.length;
      return Math.max(170 - currentCount, 0);
    },
    // totalPrice() {
    //   return (this.refundAmount * this.refundCount).toFixed(2);
    // },
    // quota() {
    //   console.log("限额", this.totalPrice * this.maxCount);
    //   return this.totalPrice * this.maxCount;
    //},
  },
  watch: {
    refundCount() {
      this.calculteRefundAmount();
    },
  },
  beforeDestroy() {
    localStorage.removeItem("getOrderItems");
  },
  methods: {
    handleClick() {
      this.isShowReasonPop = true;
    },
    handleSelectReason(e) {
      this.refundReason = e;
    },
    handlePhoto(data) {
      this.isShowPhotoPop = false;
      const that = this;
      uni.chooseImage({
        count: Math.max(3 - this.refundPictures.length, 0),
        sizeType: ["original", "compressed"],
        sourceType: data === 1 ? ["camera"] : ["album"],
        success: function (res) {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            const url = process.env.NODE_ENV?.includes("local")
              ? "/api/"
              : BASR_URL;
            uni.uploadFile({
              url: url + "cpp-common-management/v1/file/upload",
              filePath: res.tempFilePaths[i],
              header: {
                Authorization: uni.getStorageSync("storage_info").token,
                fromChannel: "MP",
              },
              name: "file",
              formData: {
                file: res.tempFilePaths[i],
              },
              success: (uploadFileRes) => {
                if (uploadFileRes.data) {
                  that.refundPictures.push(uploadFileRes.data);
                }
              },
              fail: (res) => {
                console.log(res);
              },
            });
          }
        },
      });
    },
    handleDeletePicture(e) {
      const index = this.refundPictures.indexOf(e);
      let items = this.refundPictures;
      if (index > -1) {
        items.splice(index, 1);
      }
      this.refundPictures = items;
    },
    async handleCommit() {
      const amount = Number.parseFloat(this.refundAmount);
      if (
        !this.refundAmount ||
        this.refundAmount.length === 0 ||
        amount !== amount ||
        amount < 0.01
      ) {
        uni.showToast({
          title: "退款金额需大于0",
          icon: "none",
        });
        return;
      }
      if (!this.refundReason || this.refundReason.length === 0) {
        uni.showToast({
          title: "请选择退款原因",
          icon: "none",
        });
        return;
      }
      uni.showLoading({
        title: "",
        mask: true,
      });
      try {
        const res = await APPLY_AFTER_SALE({
          sourceOrderType: 5,
          source: 1,
          additionalDesc: this.refundDesc,
          afterSaleNum: this.refundCount,
          afterSaleReason: this.refundReason,
          afterSaleType: this.afterSaleType,
          refundAmount: this.totalPrice,
          APPLY_AFTER_SALE: "v2",
          buyerCertificateList: this.refundPictures.map((e) => {
            return {
              url: e,
              type: 1,
            };
          }),
          itemId: this.itemId,
          orderId: this.orderId,
          orderItemId: this.orderItemId,
          skuId: this.skuId,
        });
        uni.hideLoading();
        const resData = res.data.data;
        if (!resData) {
          uni.showToast({
            title: res.data.message ?? "未知错误",
            icon: "none",
          });
          return;
        }
        const afterSaleOrderId = resData.afterSaleOrderId;
        if (afterSaleOrderId) {
          uni.showToast({
            title: "退款申请提交成功",
            icon: "none",
          });
          setTimeout(() => {
            // #ifdef MP-WEIXIN
            uni.navigateTo({
              url: `/pagesC/afterSaleDetail/index?afterSaleOrderId=${afterSaleOrderId}`,
            });
            // #endif
            // #ifdef H5
            this.$dsBridge.call("gotoPageThroughRoute", {
              page: `${window.location.origin}/crm-medical-h5/#/pagesC/afterSaleDetail/index?afterSaleOrderId=${afterSaleOrderId}`,
            });
            // #endif
          }, 1500);
        }
      } catch (e) {
        console.log("申请售后报错：", e);
        uni.hideLoading();
      } finally {
      }
    },
    // 仅退款提交审核
    async searchRefundStatus(value) {
      const params = {
        isRefundEntranceQuery: false,
        refundAmount: value,
      };
      const { data } = await REFUND_BENEFIT({ ...params });
      this.isExamine = data.data.isCanInstantRefund;
      console.log("退款", data);
    },
    // 计算退款金额[优惠券 + 数量]
    async calculteRefundAmount() {
      console.log("this/oderItemId22222", this.orderItemId);
      try {
        let res = await CALCULATE_MONEY({
          afterSaleQty: this.refundCount,
          orderItemId: this.orderItemId,
          afterSaleType: this.afterSaleType,
          orderId: this.orderId,
        });
        let resData = res.data.data;
        let {
          availableAfterSaleTotalAmount,
          availableAfterSaleAmount,
          availableAfterSaleQty,
          afterSaleCouponList,
          returnCouponDesc,
          score,
        } = resData;
        this.score = score;
        this.totalPrice = availableAfterSaleAmount;
        this.maxCount = availableAfterSaleQty;
        this.afterSaleCouponList = afterSaleCouponList;
        this.returnCouponDesc = returnCouponDesc || "";
        this.searchRefundStatus(this.totalPrice);
        console.log("res===>", resData);
      } catch (e) {
        console.log("计算金额报错", e);
      }
      console.log("this/oderItemId33333", this.orderItemId);
    },
  },
  onLoad(e) {
    console.log(11111);
    let afterSaleType = e.afterSaleType ?? "7";
    let navTitle = "申请退货退款";
    if (afterSaleType === "6") {
      navTitle = "我要退款（无需退货）";
    }
    this.afterSaleType = afterSaleType;
    uni.setNavigationBarTitle({
      title: navTitle,
    });
    this.orderId = e.orderId;
    this.afterSaleRefundType = Number.parseInt(e.afterSaleRefundType || "1");
    this.hasGift = e.hasGift === "true";
    const eventChannel = this.getOpenerEventChannel();
    // #ifdef MP-WEIXIN
    eventChannel.on("getOrderItems", (data) => {
      console.log("明细======》", data[0]);
      if (data.length > 0) {
        const item = data[0];
        this.itemId = item.itemId;
        this.skuId = item.skuId;
        this.orderItemId = item.orderItemId || item.saleOrderItemId;
        this.refundAmount = item.price;
        if (this.afterSaleRefundType === 2) {
          let count = 0;
          data.forEach((e) => {
            count += e.availableAfterSaleQty || 0;
          });
          this.refundCount = count;
        } else {
          this.calculteRefundAmount();
          // this.searchRefundStatus(this.totalPrice);
        }
        this.orderItems = data;
      }
    });
    // #endif
    // #ifdef H5
    let getOrderItems = JSON.parse(localStorage.getItem("getOrderItems"));
    if (getOrderItems) {
      console.log("明细== H5 ====》", getOrderItems[0]);
      if (getOrderItems.length > 0) {
        const item = getOrderItems[0];
        this.itemId = item.itemId;
        this.skuId = item.skuId;
        this.orderItemId = item.orderItemId || item.saleOrderItemId;
        this.refundAmount = item.price;
        if (this.afterSaleRefundType === 2) {
          let count = 0;
          data.forEach((e) => {
            count += e.availableAfterSaleQty || 0;
          });
          this.refundCount = count;
        } else {
          this.calculteRefundAmount();
          // this.searchRefundStatus(this.totalPrice);
        }
        this.orderItems = data;
      }
    }

    // #endif
  },
};
</script>

<style lang="scss">
.apply-after-sale-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fc;
}
.apply-after-sale-content {
  // #ifdef MP-WEIXIN
  flex: 1;
  // #endif
  // #ifdef H5
  height: 100%;
  // #endif
  padding: 20rpx 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .refund-wainTitle {
    display: flex;
    justify-content: center;
    color: #fe2442;
    font-size: 27rpx;
    // margin: 10rpx 0;
  }
  .refund-form {
    // #ifdef H5
    margin-bottom: 150rpx;
    // #endif
    .refund-items {
      margin-bottom: 20rpx;
    }
    .refund-amount {
      padding: 29rpx 24rpx;
      background-color: white;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      .refund-title {
        color: #666;
        font-size: 29rpx;
      }
      .refund-input {
        display: flex;
        justify-content: space-between;
        margin-top: 12rpx;
        align-items: center;
        .refund-input-prefix {
          color: #1f1f1f;
          font-size: 54rpx;
          font-weight: 600;
        }
        .refund-input-field {
          color: #1f1f1f;
          font-size: 54rpx;
          font-weight: 600;
          height: 77rpx;
          flex: 1;
        }
        .refund-input-button {
          flex-shrink: 0;
          font-size: 29rpx;
          color: #999;
          display: flex;
          align-items: center;
          .iconfont {
            width: 25rpx;
            height: 24rpx;
            margin-right: 10rpx;
          }
        }
      }
    }
    .refund-pangdou {
      margin-top: 20rpx;
      padding: 29rpx 24rpx;
      background-color: white;
      border-radius: 16rpx;
      .refund-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;
        .title {
          color: #1f1f1f;
          font-size: 29rpx;
          line-height: 40rpx;
        }
        .value {
          color: #fe2442;
          font-size: 29rpx;
          line-height: 39rpx;
        }
      }
      .refund-tip {
        color: #999999;
        font-size: 25rpx;
        line-height: 35rpx;
      }
    }
    .refund-phone {
      padding: 29rpx 24rpx;
      background-color: white;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
    }
    .refund-detail {
      margin-top: 20rpx;
      padding: 29rpx 24rpx;
      background-color: white;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      color: #666;
      font-size: 29rpx;
      .refund-count {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 23rpx;
        border-bottom: 1px solid #efefef;
      }
      .refund-reason {
        display: flex;
        align-items: center;
        padding: 29rpx 0 31rpx 0;
        border-bottom: 1px solid #efefef;

        .refund-reason-content {
          margin-left: 39rpx;
          margin-right: 24rpx;
          flex: 1;
          height: 100%;
          text-align: right;
        }
        .iconfont {
          color: #999;
          width: 16px;
          height: 16px;
        }
      }
      .refound-coupon {
        padding: 29rpx 0 10rpx 0;
        border-bottom: 1px solid #efefef;
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .right {
          display: flex;
          align-items: center;
        }
        .tag {
          margin-right: 15rpx;
          background: white;
          border-radius: 8rpx;
          border: 1pt solid #ffcfd8;
          font-size: 23rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #fe2442;
          line-height: 33rpx;
          padding: 4rpx 13rpx;
        }
        .num {
          font-size: 29rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #1f1f1f;
        }
        .alert {
          font-size: 23rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #fe2442;
          text-align: right;
        }
      }
      .refund-desc {
        margin-top: 29rpx;
        .refund-desc-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #666;
          font-size: 29rpx;
          .refund-desc-count {
            color: #999;
          }
        }
        .refund-desc-input {
          color: #1f1f1f;
          font-size: 29rpx;
          font-weight: normal;
          height: 178rpx;
          margin: 14rpx 0;
        }
      }
      .refund-picture {
        display: flex;
        .add-picture {
          width: 154rpx;
          height: 154rpx;
        }
        .item-picture {
          margin-right: 20rpx;
          width: 154rpx;
          height: 154rpx;

          .iconfont {
            width: 35rpx;
            height: 35rpx;
            position: absolute;
            left: 137rpx;
            top: -178rpx;
            pointer-events: auto;
          }
        }
      }
    }
  }

  .refund-commit {
    height: 85rpx;
    background-color: #fe2442;
    border-radius: 42.5rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 31rpx;
    margin: 0 24rpx;
    margin-bottom: 95rpx;
  }
}
</style>
