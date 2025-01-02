<template>
  <view class="privacy-home">
    <!-- #ifdef H5 -->
    <NavBar
      :title="'用户协议'"
      navColor="#ffffff"
      :whiteBack="false"
      showBackBtn
      @navBackClickHandle="handleReturn"
      :customback="true"
      style="position: sticky; top: 0; left: 0; z-index: 99"
    >
    </NavBar>
    <!-- #endif -->
    <scroll-view
      style="width: 100vw; height: calc(100vh - topHeight); text-align: center"
    >
      <template v-if="bizType === 'image'">
        <image
          style="width: 100%; height: 100%"
          :src="content"
          mode="widthFix"
        ></image>
      </template>
      <template v-else>
        <view v-html="content"></view>
      </template>
    </scroll-view>
  </view>
</template>
<script>
import NavBar from "@/components/navBar/index.vue";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      bizType: "text",
      content: "",
      topHeight: getApp().globalData.h5NavBarFullHeight,
    };
  },
  onLoad(option) {
    const url = option.bizUrl;
    this.content = url;
    if (/^https:\/\/.*/g.test(url) || /^http:\/\/.*/g.test(url)) {
      this.bizType = "image";
    } else {
      this.bizType = "text";
    }
  },
  methods: {
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.privacy-home {
  width: 100vw;
  height: 100vh;
  word-break: break-all;
  overflow-y: scroll;
  background-color: #ffffff;
  display: flex;
  // justify-content: center;
  flex-direction: column;
}
</style>
