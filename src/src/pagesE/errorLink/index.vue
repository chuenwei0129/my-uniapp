<template>
  <view class="noData-box">
    <!-- <view
      class="back-wrapper"
      :style="{ top: backButtonTop, left: '16px', height: navBarHeight }"
      @click="backClickHandle"
      ><image
        class="back-icon"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/detail_back.png"
    /></view> -->
    <image
      class="noData-img"
      src="https://frontend-cdn.chongpangpang.com/image/scan/error_link.png"
    />
    <text>{{ errorText }}</text>
  </view>
</template>

<script>
export default {
  name: "errorLink",

  data() {
    return {
      errorText: "无法打开非宠胖胖链接",
      backButtonTop: "",
      navBarHeight: "",
    };
  },
  onLoad(options) {
    if (options.errorText) {
      this.errorText = errorText;
    }
  },
  created() {
    this.backButtonTop = getApp().globalData.statusBarHeight + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
  },
  methods: {
    backClickHandle() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
