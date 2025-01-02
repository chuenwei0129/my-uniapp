<template>
  <view class="dad-wrapper" ref="dadRef">
    <image
      src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
      mode="scaleToFill"
    />
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},

  mounted() {},

  onShow() {
    setTimeout(() => {
      uni.redirectTo({
        url: "/pagesF/health/index",
      });
    }, 100);
  },
};
</script>

<style lang="scss">
.dad-wrapper {
  height: 100vh;
  width: 750rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  image {
    width: 60rpx;
    height: 60rpx;
  }
}
</style>
