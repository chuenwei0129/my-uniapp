<template>
  <view class="goods-detail-nav" :style="{ opacity: opacityNum }">
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="top-bar" :style="{ opacity: opacityNum }">
        <view :class="['iconfont', 'icon-back']" @click="goBack"></view>
        <view class="click" @click="goBack"></view>
        <view class="top-title">
          <view
            class="tab"
            v-for="(item, index) in navList"
            :key="index"
            @click="changeTab(index, item.value)"
          >
            <view
              :class="{
                appraise: index == 1,
                active: index == selectedIndex,
                isLiveNav: isLive && index !== 0,
              }"
              class="nav-name"
            >
              {{ item.name }}

              <view v-if="index == selectedIndex" class="line"></view>
            </view>
          </view>
        </view>
        <!-- #ifdef H5 -->
        <i class="iconfont icon-share" @click="share"></i>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "goodsDetailNav",
  props: {
    currentIndex: {
      type: Number,
      default: 0,
    },
    scrollTop: {
      type: [Number, String],
    },
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        this.selectedIndex = newVal;
      },
      immediate: true,
    },
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
    opacityNum() {
      // #ifdef MP-WEIXIN
      if (!this.viewportWidth)
        this.viewportWidth = uni.getSystemInfoSync().windowWidth;
      // #endif
      // #ifdef H5
      if (!this.viewportWidth)
        this.viewportWidth = document.documentElement.clientWidth;
      // #endif
      if (this.scrollTop / this.viewportWidth > 0.5) {
        return 1;
      } else {
        return this.scrollTop / this.viewportWidth + 0.5;
      }
    },
    navList() {
      return this.isLive ? this.liveList : this.list;
    },
  },
  mounted() {},
  data() {
    return {
      statusBarHeight: 0,
      navBarHeight: 0,
      list: [
        { name: "商品", value: "goodsDetail" },
        { name: "评价", value: "appraiseDetail" },
        { name: "详情", value: "goodsDetailInfo" },
      ],
      liveList: [
        { name: "商品", value: "goodslLive" },
        { name: "详情", value: "goodsDetailInfoLive" },
      ],
      selectedIndex: 0,
      viewportWidth: 0,
    };
  },
  mounted() {
    // #ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    // #endif
    // #ifdef H5
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    if (this.isNative) {
      this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    } else {
      this.statusBarHeight = "0px";
    }
    // #endif
  },
  methods: {
    changeTab(index, value) {
      this.selectedIndex = index;
      this.$emit("changeTab", value);
    },
    share() {
      this.$emit("shareDetail");
    },
    goBack() {
      this.$emit("goBack");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.goods-detail-nav {
  width: 100%;
  // height: 100rpx;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;

  .header {
    .top-bar {
      display: flex;
      align-items: center;
      // height: 62rpx;
      position: relative;
      background-color: #fff;

      .top-title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-style: normal;
        @include textfclaw(31rpx, #333, left, 46rpx);
        margin-left: 4rpx;
        @include flex();
        // #ifdef MP-WEIXIN
        width: 498rpx;
        // #endif
        // #ifdef H5
        width: calc(100% - 65rpx - 65rpx);
        // #endif
        box-sizing: border-box;
      }
      .tab {
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        @include textfclaw(27rpx, #1f1f1f, center, 85rpx);
        // position: relative;
        box-sizing: border-box;
        height: 85rpx;
        .nav-name {
          position: relative;
        }
      }
      .active {
        font-weight: 500;
        color: #333333;
      }
      .line {
        width: 38rpx;
        height: 4rpx;
        background: #1f1f1f;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .appraise {
        margin: 0 77rpx;
      }
      .isLiveNav {
        margin-right: 0rpx !important;
      }
      .click {
        position: absolute;
        left: 0;
        top: 0;
        width: 120rpx;
        height: 90rpx;
      }
      .icon-back {
        font-size: 42rpx;
        margin-left: 23rpx;
        font-size: 48rpx;
      }
      .iconfont {
        font-size: 42rpx;
      }
    }
  }
}
</style>
