<template>
  <u-popup
    :show="isOpen"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="tip-card">
      <view class="pet-icon"></view>
      <view class="title">您尚未获得问诊权益券</view>
      <view class="content">邀请好友助力，即可获得1张免费优惠券</view>
      <view class="button-group">
        <view class="button cancel" @click="close">取消</view>
        <view class="button confirm" @click="handleInvite"> 去邀请 </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
  },
  data() {
    return {};
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleClose() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleConfirm() {
      this.$emit("update:isOpen", false);
      this.$emit("confirm");
    },
    handleInvite() {
      this.close();
      uni.navigateTo({
        url: "/pagesB/shareActivity/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
