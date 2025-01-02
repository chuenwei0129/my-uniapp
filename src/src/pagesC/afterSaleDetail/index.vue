<template>
  <view class="after-sale-detail-content">
    <AfterSaleGiftBar v-if="hasGift" style="margin-bottom: 20rpx" />
    <view class="after-sale-detail-form">
      <view class="goods-item">
        <GoodsItem
          v-for="orderItem in orderItems"
          :item="orderItem"
          :key="orderItem.afterSaleOrderItemId"
        />
      </view>
      <view class="status-item">
        <AfterSaleStatusItem
          v-for="(item, index) in orderStatusItems"
          :key="item.id"
          :title="item.title"
          :subtitle="item.subtitle"
          :isSelected="index === 0"
          :hasUp="index > 0"
          :hasDown="hasDown(index)"
        />
      </view>
      <view class="info-item">
        <view class="sub-info-item">
          <view class="info-item-title">退款数量</view>
          <view class="info-item-value">{{ orderInfo.afterSaleNum }}</view>
        </view>
        <view class="sub-info-item">
          <view class="info-item-title">退款原因</view>
          <view class="info-item-value">{{
            orderInfo.applyReason ? orderInfo.applyReason : ""
          }}</view>
        </view>
        <view class="sub-info-item">
          <view class="info-item-title">退款金额</view>
          <GoodsPrice
            saleColor="#1F1F1F"
            salePriceIntegerFontSize="29"
            :salePrice="orderInfo.applyRefundAmount"
          />
        </view>
        <view
          class="sub-info-item"
          v-if="orderInfo.score && orderInfo.score > 0"
        >
          <view class="info-item-title">退还胖豆</view>
          <view>{{ orderInfo.score }}胖豆</view>
        </view>
        <view
          class="sub-info-item"
          v-if="
            orderInfo.afterSaleCouponList &&
            orderInfo.afterSaleCouponList.length > 0
          "
        >
          <view class="info-item-title">退还优惠券</view>
          <view class="right">
            <view class="tag" v-for="item in orderInfo.afterSaleCouponList">{{
              formatDiscount(
                item.rightType,
                item.couponRule,
                item.promotionName
              )
            }}</view>
            <view class="coupon"
              >{{ orderInfo.afterSaleCouponList.length }}张</view
            >
          </view>
        </view>
        <view class="sub-info-item" style="flex-direction: column">
          <view class="info-item-title">退款说明</view>
          <view class="info-item-value" style="margin-top: 6rpx">{{
            orderInfo.additionalDesc ? orderInfo.additionalDesc : ""
          }}</view>
        </view>
        <view class="sub-info-item">
          <view class="info-item-title">申请时间</view>
          <view class="info-item-value">{{ orderInfo.createTime }}</view>
        </view>
        <view class="sub-info-item">
          <view class="info-item-title">退款编号</view>
          <view class="info-item-value">{{ orderInfo.afterSaleOrderNo }}</view>
        </view>
        <view
          class="sub-info-item"
          style="justify-content: flex-start"
          v-if="
            orderInfo.buyerCertificateList &&
            orderInfo.buyerCertificateList.length > 0
          "
        >
          <Image
            class="info-item-image"
            v-for="pic in orderInfo.buyerCertificateList"
            :src="pic.url"
            mode="aspectFill"
            @click="handlePreview(pic.url)"
          />
        </view>
      </view>
    </view>
    <view
      class="after-sale-detail-footer"
      :style="{
        paddingBottom: safeAreaBottom + 'px',
      }"
    >
      <view class="after-sale-detail-footer-top">
        <!-- #ifdef MP-WEIXIN -->
        <CustomerService style="margin-left: 15rpx" />
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <view>
          <IconButton
            class="btn-icon"
            title="客服"
            :fontSize="20"
            position="top"
            :iconSize="43"
            height="44"
            color="transparent"
            :interval="1"
            fontClass="icon-chat"
            style="height: 44px; min-width: 58rpx; justify-content: flex-end"
            @onClick="$u.debounce(handleClick_chat, 500)"
          />
        </view>
        <!-- #endif -->
        <view class="footer-top-buttons" v-if="hasOrderButtons">
          <view
            class="footer-button-revoke"
            v-if="hasRevokeApplyButton"
            @click="isShowRevokePoShow"
            >撤销申请</view
          >
          <view
            class="footer-button-logistics"
            v-if="hasInputLogisticsButton"
            @click="handleInputLogistics"
            >填写寄回物流信息</view
          >
          <view
            class="footer-button-reApply"
            v-if="hasReApplyButton"
            @click="handleReApply"
            >重新申请</view
          >
          <view
            class="footer-button-delete"
            v-if="hasDeleteOrderButton"
            @click="this.isShowDeletePop = true"
            >删除售后单</view
          >
        </view>
      </view>
    </view>
    <PopConfirm
      :is-open.sync="isShowRevokePop"
      title="请确认撤销申请"
      text="撤销申请后，当前售后单将关闭，请谨慎处理～"
      @confirm="handleRevoke"
    />
    <PopConfirm
      :is-open.sync="isShowDeletePop"
      title="删除提醒"
      text="删除后将从你的售后列表移除，是否确认删除该售后单？"
      @confirm="handleDeleteOrder"
    />
  </view>
</template>

<script>
import {
  DELETE_AFTER_SALE,
  GET_AFTER_SALE_DETAIL,
  REVOKE_AFTER_SALE,
} from "@/api/mall";
import GoodsItem from "@/pagesC/orderDetail/componse/goodsItem.vue";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import AfterSaleStatusItem from "@/pagesC/afterSaleDetail/components/afterSaleStatusItem/index.vue";
import PopConfirm from "@/pagesC/components/PopConfirm/index.vue";
import { formatDiscount } from "@/utils/index";
import AfterSaleGiftBar from "@/pagesC/components/afterSaleGiftBar/index.vue";
import IconButton from "@/pagesC/components/iconButton/index.vue";

export default {
  components: {
    AfterSaleGiftBar,
    PopConfirm,
    AfterSaleStatusItem,
    GoodsPrice,
    GoodsItem,
    IconButton,
  },
  data() {
    return {
      formatDiscount,
      safeAreaBottom: 0,
      orderInfo: {},
      isShowRevokePop: false,
      isShowDeletePop: false,
    };
  },
  methods: {
    // 客服
    handleClick_chat() {
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/user/custom/service`,
      });
      // #endif
    },
    isShowRevokePoShow() {
      this.isShowRevokePop = true;
    },
    async queryData(afterSaleOrderId) {
      const res = await GET_AFTER_SALE_DETAIL({
        afterSaleOrderId: afterSaleOrderId,
      });
      if (res.data.data) {
        this.orderInfo = res.data.data;
        this.updateNavTitle();
      } else {
        uni.showToast({
          title: res.data.message ?? "未知错误",
          icon: "none",
        });
      }
    },
    updateNavTitle() {
      const afterSaleStatus = this.orderInfo?.afterSaleStatus;
      const afterSaleType = this.orderInfo?.afterSaleType;
      let navTitle = "";
      if (afterSaleStatus === 1) {
        if (afterSaleType === 6) {
          navTitle = "退款审核中"; //1
        } else if (afterSaleType === 7) {
          navTitle = "退货审核中"; //2
        }
      } else if (afterSaleStatus === 2) {
        navTitle = "售后关闭";
      } else if (afterSaleStatus === 3) {
        if (afterSaleType === 7) {
          navTitle = "待寄回商品";
        }
      } else if (afterSaleStatus === 4) {
        if (afterSaleType === 7) {
          navTitle = "待商家确认";
        }
      } else if (afterSaleStatus === 5) {
        if (afterSaleType === 6) {
          navTitle = "退款审核通过";
        } else if (afterSaleType === 7) {
          navTitle = "退款处理中";
        }
      } else if (afterSaleStatus === 6) {
        navTitle = "退款处理中";
      } else if (afterSaleStatus === 7 || afterSaleStatus === 11) {
        if (afterSaleType === 6) {
          navTitle = "退款成功";
        } else if (afterSaleType === 7) {
          navTitle = "退货退款成功";
        }
      } else if (
        afterSaleStatus === 8 ||
        afterSaleStatus === 9 ||
        afterSaleStatus === 11
      ) {
        navTitle = "退款失败";
      }
      uni.setNavigationBarTitle({
        title: navTitle,
      });
    },
    async handleRevoke() {
      const res = await REVOKE_AFTER_SALE({
        afterSaleOrderId: this.orderInfo.afterSaleOrderId,
      });
      if (res.data.success) {
        await this.queryData(this.orderInfo.afterSaleOrderId);
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("onChange", {
          type: "revoke",
        });
      } else {
        uni.showToast({
          title: res.data.message ?? "未知错误",
          icon: "none",
        });
      }
    },
    handleInputLogistics() {
      uni.navigateTo({
        url: `/pagesD/afterSaleInputLogistics/index?afterSaleOrderId=${this.orderInfo.afterSaleOrderId}&sellerId=${this.orderInfo.sellerId}&hasGift=${this.hasGift}`,
        events: {
          onCommit: () => {
            this.queryData(this.orderInfo.afterSaleOrderId);
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.emit("onChange", {
              type: "inputLogistics",
            });
          },
        },
      });
    },
    handleReApply() {
      const { orderId, storeId, afterSaleRefundType } = this.orderInfo;
      uni.navigateTo({
        url: `/pagesC/selectAfterSaleType/index?orderId=${orderId}&storeId=${storeId}&afterSaleRefundType=${afterSaleRefundType}&hasGift=${this.hasGift}`,
        success: (res) => {
          res.eventChannel.emit("getOrderItems", this.orderItems);
        },
      });
    },
    async handleDeleteOrder() {
      const res = await DELETE_AFTER_SALE({
        afterSaleOrderId: this.orderInfo.afterSaleOrderId,
      });
      if (res.data.success) {
        uni.navigateBack();
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("onChange", {
          type: "delete",
        });
      } else {
        uni.showToast({
          title: res.data.message ?? "未知错误",
          icon: "none",
        });
      }
    },
    handlePreview(e) {
      let urls =
        this.orderInfo?.buyerCertificateList?.map((v) => {
          return v.url;
        }) ?? [];
      uni.previewImage({
        urls,
        current: e,
      });
    },
  },
  computed: {
    orderStatusItems() {
      let items = [];
      if (this.orderInfo.afterSaleStatus === 1) {
        items.push({ id: 1, title: "等待商家处理中", subtitle: "" });
      } else if (this.orderInfo.afterSaleStatus === 2) {
        if (this.orderInfo.afterSaleClosedType === 1) {
          items.push({ id: 1, title: "买家已撤销售后申请", subtitle: "" });
        } else {
          items.push({ id: 1, title: "买家超时未寄回商品", subtitle: "" });
        }
        items.push({ id: 2, title: "等待商家处理中", subtitle: "" });
      } else if (this.orderInfo.afterSaleStatus === 3) {
        items.push({ id: 1, title: "商家已同意退款", subtitle: "" });
      } else if (this.orderInfo.afterSaleStatus === 4) {
        const companyName =
          this.orderInfo?.deliveryInfo?.logisticsCompanyName ?? "";
        const no = this.orderInfo?.deliveryInfo?.logisticsNo ?? "";
        let subtitle = "";
        if (companyName.length !== 0 && no.length !== 0) {
          subtitle = `物流公司：${companyName}\n物流单号：${no}`;
        }
        items.push(
          ...[
            { id: 1, title: "请等待商家处理", subtitle: "" },
            {
              id: 2,
              title: "退货退款审核通过，请填写寄回物流信息",
              subtitle: subtitle,
            },
            { id: 3, title: "等待商家处理中", subtitle: "" },
          ]
        );
      } else if (
        this.orderInfo.afterSaleStatus === 5 ||
        this.orderInfo.afterSaleStatus === 6
      ) {
        if (this.orderInfo.afterSaleType === 6) {
          items.push(
            ...[
              {
                id: 1,
                title: "退款审核通过，将在1~3个工作日退回",
                subtitle: "",
              },
              { id: 2, title: "等待商家处理中", subtitle: "" },
            ]
          );
        } else if (this.orderInfo.afterSaleType === 7) {
          const companyName =
            this.orderInfo?.deliveryInfo?.logisticsCompanyName ?? "";
          const no = this.orderInfo?.deliveryInfo?.logisticsNo ?? "";
          let subtitle = "";
          if (companyName.length !== 0 && no.length !== 0) {
            subtitle = `物流公司：${companyName}\n物流单号：${no}`;
          }
          items.push(
            ...[
              { id: 1, title: "商家同意退款，退款处理中", subtitle: "" },
              {
                id: 2,
                title: "退货退款审核通过，请填写寄回物流信息",
                subtitle: subtitle,
              },
              { id: 3, title: "等待商家处理中", subtitle: "" },
            ]
          );
        }
      } else if (
        this.orderInfo.afterSaleStatus === 7 ||
        this.orderInfo.afterSaleStatus === 11
      ) {
        items.push(
          ...[
            {
              id: 1,
              title: "退款已原路退回您的付款账号，请查收",
              subtitle: "",
            },
            { id: 2, title: "退款审核通过，将在1~3个工作日退回", subtitle: "" },
            { id: 3, title: "等待商家处理中", subtitle: "" },
          ]
        );
      } else if (this.orderInfo.afterSaleStatus === 8) {
        let reason = this.orderInfo?.refuseReason ?? "";
        if (reason.length > 0) {
          reason = `原因：${reason}`;
        }
        items.push({ id: 1, title: "商家已拒绝退款申请", subtitle: reason });
      } else if (this.orderInfo.afterSaleStatus === 9) {
        items.push(
          ...[
            { id: 1, title: "退款失败", subtitle: "" },
            { id: 2, title: "等待商家处理中", subtitle: "" },
          ]
        );
      } else if (this.orderInfo.afterSaleStatus === 10) {
        let reason = this.orderInfo?.refuseReason ?? "";
        if (reason.length > 0) {
          reason = `原因：${reason}`;
        }
        items.push(
          ...[
            { id: 1, title: "您的退款申请被拒绝", subtitle: reason },
            { id: 2, title: "等待商家处理中", subtitle: "" },
          ]
        );
      }
      return items;
    },
    orderItems() {
      return (
        this.orderInfo?.orderItems?.map((e) => {
          return {
            ...e,
            price: e.skuPrice,
          };
        }) || []
      );
    },
    hasOrderButtons() {
      return (
        this.hasRevokeApplyButton ||
        this.hasInputLogisticsButton ||
        this.hasReApplyButton ||
        this.hasDeleteOrderButton
      );
    },
    hasRevokeApplyButton() {
      return this.orderInfo.afterSaleStatus === 1;
    },
    hasInputLogisticsButton() {
      if (this.orderInfo.afterSaleType === 6) {
        // 仅退款没有物流
        return false;
      }
      return this.orderInfo.afterSaleStatus === 3;
    },
    hasReApplyButton() {
      return this.orderInfo.afterSaleStatus === 2;
    },
    hasDeleteOrderButton() {
      return (
        this.orderInfo.afterSaleStatus === 7 ||
        this.orderInfo.afterSaleStatus === 9 ||
        this.orderInfo.afterSaleStatus === 11
      );
    },
    hasGift() {
      return this.orderInfo.containGiftActivity || false;
    },
    hasDown() {
      return (index) => {
        return index < (this.orderStatusItems ?? []).length - 1;
      };
    },
  },
  mounted() {
    const windowInfo = uni.getWindowInfo();
    this.safeAreaBottom = windowInfo.safeAreaInsets.bottom;
  },
  onLoad(e) {
    const afterSaleOrderId = e.afterSaleOrderId;
    if (afterSaleOrderId) {
      this.queryData(afterSaleOrderId);
    }
  },
};
</script>

<style lang="scss">
.after-sale-detail-content {
  background-color: #f7f8fc;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .after-sale-detail-form {
    flex: 1;
    padding: 0 16rpx;
    padding-bottom: 20rpx;
    overflow: scroll;
    .goods-item {
      padding: 6rpx 24rpx;
      background-color: white;
      border-radius: 16rpx;
    }
    .info-item {
      padding: 15rpx 23rpx;
      background-color: white;
      border-radius: 16rpx;
      margin-top: 20rpx;
      display: flex;
      flex-direction: column;
      font-size: 29rpx;
      width: 100%;
      .sub-info-item {
        padding: 23rpx 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .info-item-title {
          color: #666666;
        }
        .right {
          display: flex;
          align-items: center;
        }
        .tag {
          margin-right: 15rpx;
          background: white;
          border-radius: 8rpx;
          border: 1rpx solid #ffcfd8;
          font-size: 23rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #fe2442;
          line-height: 33rpx;
          padding: 4rpx 13rpx;
        }
        .info-item-value {
          color: #1f1f1f;
        }
        .info-item-image {
          width: 154rpx;
          height: 154rpx;
          border-radius: 6rpx;
        }
        .info-item-image + .info-item-image {
          margin-left: 16rpx;
        }
      }
    }
    .status-item {
      padding: 0 7rpx;
      background-color: white;
      border-radius: 16rpx;
      margin-top: 20rpx;
      display: flex;
      flex-direction: column;
    }
  }
  .after-sale-detail-footer {
    background-color: white;
    display: flex;
    .after-sale-detail-footer-top {
      margin: 12rpx 25rpx;
      display: flex;
      justify-content: space-between;
      flex: 1;
      .footer-top-buttons {
        display: flex;
      }
      .footer-top-button {
        height: 70rpx;
        border-radius: 35rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #1f1f1f;
        font-size: 29rpx;
        padding: 0 27rpx;
      }
      .footer-button-revoke {
        @extend .footer-top-button;
        background-color: #fe2442;
        font-weight: bold;
      }
      .footer-button-logistics {
        @extend .footer-button-revoke;
      }
      .footer-button-reApply {
        @extend .footer-top-button;
        border: 2rpx solid #e6e6e6;
      }
      .footer-button-delete {
        @extend .footer-button-reApply;
      }
      .footer-top-button + .footer-top-button {
        margin-left: 16rpx;
      }
    }
  }
}
.btn-icon {
  justify-content: flex-end !important;
}
</style>
