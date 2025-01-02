<template>
  <view class="share-modal" @touchmove.stop.prevent @click="closeModal">
    <view class="sharebg"></view>
  </view>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";
.share-modal {
  // @include absNormal(100vw, 100vh, 0, 0);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
}
.sharebg {
  @include absNormal(406rpx, 262rpx, 19rpx, $right: 55rpx);
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/activity/mbti/sharemodal.png"
  );
  // #ifdef MP-WEIXIN
  @include absNormal(406rpx, 262rpx, 19rpx, $right: 100rpx);
  // #endif
}
</style>
