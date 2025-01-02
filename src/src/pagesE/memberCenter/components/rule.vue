<template>
  <scroll-view class="rules" scroll-y @scroll="handleScroll">
    <view class="navbar">
      <FixedNav
        v-show="isHeaderShow"
        title="宠胖胖会员介绍"
        :headerShow="true"
        :backfc="navBackClickHandle"
      ></FixedNav>
      <NavBar
        v-show="!isHeaderShow"
        :showBackBtn="true"
        :customback="true"
        @navBackClickHandle="navBackClickHandle"
      />
    </view>
    <view v-for="(item, index) in imageList" :key="index">
      <image :src="item" mode="widthFix" style="width: 100%" />
    </view>
  </scroll-view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
import FixedNav from "@/components/fixedNav/index.vue";
export default {
  name: "memberCenterRule",
  components: {
    NavBar,
    FixedNav,
  },
  data() {
    return {
      statusBarHeight: "",
      imageList: [
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member-rule1.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member-rule2.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member-rule3.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member-rule4.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member-rule5.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member-rule6.png",
      ],
      isHeaderShow: false,
    };
  },
  methods: {},
  mounted() {},
  methods: {
    navBackClickHandle() {
      // #ifdef MP-WEIXIN
      uni.navigateBack();
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
      // this.$emit("handleEndSheet");
    },
    handleScroll(e) {
      console.log(e.detail.scrollTop);
      if (e && e.detail && e.detail.scrollTop >= 50) {
        this.isHeaderShow = true;
      }
      if (e && e.detail && e.detail.scrollTop < 50) {
        this.isHeaderShow = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.rules {
  position: relative;
  height: 100vh;
  overflow-y: scroll;
  font-size: 0;
  .navbar {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
}
.icon-back {
  position: absolute;
  top: 21.15rpx;
  left: 23.08rpx;
}
</style>
