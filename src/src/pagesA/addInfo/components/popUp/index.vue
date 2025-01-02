<template>
  <u-popup :show="isShowPop" @close="close" :round="20" @touchmove.stop.prevent>
  </u-popup>
</template>

<script>
export default {
  props: { isShowPop },
  data() {
    return {
      checked: true,
    };
  },

  onLoad(options) {},
  onReady() {},
  methods: {
    handlepay() {},
    handleCheck() {
      // this.checked = !this.checked;
    },
    handleToUser() {
      uni.navigateTo({
        url: `/pages/webView/index?route=/meow-interface/html/quanyika.html&type=jump`,
      });
    },
    close() {
      this.$emit("update:isPayOpen", false);
      this.$emit("close", false);
    },
    handleClose() {
      this.$emit("update:isPayOpen", false);
      this.$emit("close", false);
    },
    handleOpenPay() {
      //   this.$uma.trackEvent("membershipCard", {
      //     type: "click_pay_open_close",
      //     city_id: this.$store.state.city,
      //     user_id: uni.getStorageSync("userId"),
      //     channel_type: this.$store.state.umengChannel,
      //   });
      this.$emit("update:isPayOpen", false);
      this.$emit("open");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
