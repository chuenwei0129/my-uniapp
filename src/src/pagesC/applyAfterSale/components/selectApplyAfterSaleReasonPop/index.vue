<template>
  <u-popup :show="show" round="19" @touchmove.stop.prevent>
    <view class="select-apply-after-sale-reason-pop">
      <view class="select-apply-after-sale-reason-title">
        <view style="width: 50rpx" />
        请选择申请原因
        <image
          class="popup-close"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popup_close.png"
          @click="handleClose"
        />
      </view>
      <scroll-view scroll-y class="select-apply-after-sale-reason-items">
        <view
          v-for="item in options"
          :key="item"
          class="select-apply-after-sale-reason-item"
          @click="handleSelect(item)"
        >
          {{ item }}
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script>
import { GET_AFTER_SALE_REFUND_REASON } from "@/api/mall";

export default {
  name: "SelectApplyAfterSaleReasonPop",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:show"],
  data() {
    return {
      options: [],
    };
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        GET_AFTER_SALE_REFUND_REASON().then((res) => {
          this.options = res.data.data?.refundReasonList ?? [];
        });
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:show", false);
    },
    handleSelect(e) {
      this.$emit("update:show", false);
      this.$emit("onSelect", e);
    },
  },
};
</script>

<style lang="scss">
.select-apply-after-sale-reason-pop {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding: 0 31rpx;
  min-height: 672rpx;
  .select-apply-after-sale-reason-title {
    height: 116rpx;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    font-size: 35rpx;
    font-weight: bold;
    color: black;
    .popup-close {
      width: 50rpx;
      height: 50rpx;
    }
  }
  .select-apply-after-sale-reason-items {
    max-height: 620rpx;
    .select-apply-after-sale-reason-item {
      color: #1f1f1f;
      font-size: 29rpx;
      width: 100%;
      height: 96rpx;
      border-bottom: 1px solid #f9f9f9;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .select-apply-after-sale-reason-item:last-child {
      border-bottom: none;
    }
  }
}
</style>
