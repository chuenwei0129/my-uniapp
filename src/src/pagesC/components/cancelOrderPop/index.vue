<template>
  <u-popup
    :show="isOpen"
    mode="center"
    bgColor="transparent"
    @close="close"
    @tap.stop.prevent
    @touchmove.stop.prevent
  >
    <view class="cancel-order-pop-content">
      <view class="pop-content-title">{{ title }}</view>
      <view class="pop-content-subtitle">{{ subtitle }}</view>
      <scroll-view scroll-y class="pop-content-options">
        <view
          class="option-item"
          v-for="(reason, index) in reasons"
          :key="reason"
          @click="handleSelectReason(index)"
        >
          <view>{{ reason }}</view>
          <image
            class="option-item-image"
            v-if="selectedIndex === index"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/cancel_order_pop_selected.png"
          />
          <image
            class="option-item-image"
            v-if="selectedIndex !== index"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/cancel_order_pop_unselected.png"
          />
        </view>
        <view
          class="option-input"
          v-if="
            selectedIndex === reasons.length - 1 &&
            reasons[selectedIndex] === '其他原因'
          "
        >
          <textarea
            class="option-input-area"
            placeholder="请输入退款原因"
            placeholder-class="option-input-placeholder"
            v-model="customReason"
          />
        </view>
      </scroll-view>
      <view class="pop-content-footer">
        <view class="footer-cancel" @click="handleClose">{{
          cancelTitle
        }}</view>
        <view
          class="footer-confirm"
          :style="{
            backgroundColor: canConfirm ? '#FFD41E' : '#EEEEEE',
            color: canConfirm ? '#1F1F1F' : '#999999',
          }"
          @click="handleConfirm"
          >{{ confirmTitle }}</view
        >
      </view>
    </view>
  </u-popup>
</template>
<script>
import {
  GET_AFTER_SALE_CANCEL_REASON,
  GET_AFTER_SALE_REFUND_REASON,
} from "@/api/mall";

export default {
  name: "CancelOrderPop",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    scene: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      reasons: [],
      selectedIndex: 0,
      customReason: "",
    };
  },
  computed: {
    title() {
      if (this.scene === 1) {
        return "取消订单";
      }
      return "申请退款";
    },
    subtitle() {
      if (this.scene === 1) {
        return "取消后订单无法恢复";
      }
      return "退款预计在1-2小时原路返回您的账号";
    },
    cancelTitle() {
      if (this.scene === 1) {
        return "暂不取消";
      }
      return "取消";
    },
    confirmTitle() {
      if (this.scene === 1) {
        return "确定取消";
      }
      return "确定";
    },
    canConfirm() {
      if (this.reasons[this.selectedIndex] === "其他原因") {
        if (this.customReason.length === 0) {
          return false;
        }
      }
      return true;
    },
  },
  methods: {
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      this.selectedIndex = 0;
      this.customReason = "";
    },
    handleClose() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      this.selectedIndex = 0;
      this.customReason = "";
    },
    handleConfirm() {
      if (!this.canConfirm) {
        return;
      }
      this.$emit("update:isOpen", false);
      this.$emit("confirm", {
        reason: this.reasons[this.selectedIndex],
        additionalReason: this.customReason,
      });
      this.selectedIndex = 0;
      this.customReason = "";
    },
    handleSelectReason(e) {
      this.selectedIndex = e;
    },
  },
  watch: {
    isOpen(newVal, oldVal) {
      if (newVal) {
        GET_AFTER_SALE_CANCEL_REASON().then((res) => {
          this.reasons = res.data.data?.cancelOrderReasonList ?? [];
        });
      }
    },
  },
};
</script>
<style lang="scss">
.cancel-order-pop-content {
  padding: 29rpx 39rpx 45rpx 39rpx;
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 577rpx;
  border-radius: 38rpx;
  .pop-content-title {
    font-size: 31rpx;
    color: black;
    width: 100%;
    text-align: center;
    font-weight: bold;
  }
  .pop-content-subtitle {
    margin-top: 14rpx;
    width: 100%;
    color: #666;
    text-align: center;
    font-size: 29rpx;
  }
  .pop-content-options {
    margin-top: 52rpx;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 620rpx;
    .option-item {
      padding-top: 20rpx;
      padding-bottom: 27rpx;
      font-size: 31rpx;
      color: #333;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .option-item-image {
        width: 35rpx;
        height: 35rpx;
      }
    }
    .option-input {
      height: 170rpx;
      border-radius: 16rpx;
      background-color: #f7f8fc;
      padding: 23rpx 27rpx;
      .option-input-area {
        width: 100%;
        height: 100%;
        color: #1f1f1f;
        font-size: 29rpx;
      }
      .option-input-placeholder {
        color: #999;
        font-size: 29rpx;
      }
    }
  }
  .pop-content-footer {
    margin-top: 27rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .footer-item {
      height: 85rpx;
      flex: 1;
      border-radius: 42.5rpx;
      font-size: 31rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }
    .footer-cancel {
      @extend .footer-item;
      border: 2rpx solid #e6e6e6;
      color: #666666;
    }
    .footer-confirm {
      @extend .footer-item;
      margin-left: 20rpx;
    }
  }
}
</style>
