<template>
  <u-popup
    :show="isOpen"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="tip-card">
      <!-- <view class="pet-icon"></view> -->
      <view class="title">温馨提示</view>
      <view class="content">
        <view class="modal-content">
          <text>今天是预约到店的日期，不允许取消。</text>
          <text>如需取消请联系客服</text>
          <text class="iphoneText" @click="makePhoneCall(shopPhone)">{{
            shopPhone
          }}</text>
        </view>
      </view>
      <view class="line"> </view>
      <view class="footer">
        <!-- <view class="cancel" @click="handleClose">取消 </view> -->
        <!-- <view class="line2"></view> -->
        <view class="confirm" @click="handleConfirm">好的 </view>
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
    shopPhone: {
      type: String,
      default: "取消",
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

    makePhoneCall(pNumber) {
      uni.makePhoneCall({
        phoneNumber: pNumber,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
