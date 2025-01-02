<script>
export default {
  name: "couponCenterNavBar",
  props: {
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "#000",
    },
    showBackBtn: {
      type: Boolean,
      default: false,
    },
    showNavBar: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    titleSize: {
      type: Number,
      default: 35,
    },
    navColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      statusBarHeight: "",
      navHeight: "",
      navBarHeight: "",
      menuButtonWidth: "",
      titleWidth: "",
    };
  },
  computed: {
    navColorStyle() {
      let style = {};
      if (this.$props.navColor.length) {
        style.backgroundColor = this.$props.navColor;
      }
      return style;
    },
  },
  methods: {
    navBackClickHandle() {
      //#ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
      // #endif
    },
  },
  mounted() {
    // #ifdef H5
    this.navHeight = getApp().globalData.h5NavBarFullHeight + "px";
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    // #endif

    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    // #endif

    this.menuButtonWidth = getApp().globalData.menuButtonWidth + "px";
    this.titleWidth = `calc(85vw - ${this.navBarHeight} - ${this.menuButtonWidth})`;
  },
};
</script>

<template>
  <view class="header" :style="[{ height: navHeight }, navColorStyle]">
    <view :style="{ height: statusBarHeight }"></view>
    <view
      class="navbar-wrapper"
      :style="{
        height: navBarHeight,
        color: titleColor,
        fontSize: titleSize,
      }"
    >
      <view v-if="showTitle" :style="{ maxWidth: titleWidth }" class="title">{{
        title
      }}</view>
      <view
        class="back-wrapper"
        v-if="showBackBtn"
        :style="{ width: `${navBarHeight}`, height: `${navBarHeight}` }"
        @click="navBackClickHandle"
      >
        <image
          mode="aspectFit"
          :src="
            showNavBar
              ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/index/back-black-tag.png'
              : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/index/back-white-tag.png'
          "
        />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.header {
  text-align: center;

  .navbar-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 35rpx;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .back-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      image {
        width: 22px;
        height: 22px;
      }
    }
  }
}
</style>
