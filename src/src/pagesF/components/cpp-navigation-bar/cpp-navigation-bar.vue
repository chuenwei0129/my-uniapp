<template>
  <view class="fix" :class="[bgColor2 == 'black' ? 'bg-color' : '']">
    <view class="status-bar" :style="{ height: statusBarHeight }"></view>
    <view class="circle-header">
      <view class="circle fl-row-center" :class="[bgColor]" @click="back"
        ><view class="iconfont icon-back"></view>
      </view>
      <view class="title">{{ title }}</view>
    </view>
  </view>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "cpp-navigation-bar",
  props: {
    title: {
      type: String,
      default: "",
    },
    bgColor: {
      type: "",
      default: "white",
    },
    bgColor2: {
      type: "",
      default: "white",
    },
  },
  data() {
    return {
      statusBarHeight: "",
    };
  },
  mounted() {
    const _this = this;
    uni.getSystemInfo({
      success: function (res) {
        if (res.osName == "android") {
          _this.statusBarHeight = res.statusBarHeight + 8 + "px";
          return;
        }
        _this.statusBarHeight = res.statusBarHeight + 5 + "px";
      },
    });
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    back() {
      const pageNum = getCurrentPages();
      const { userId } = uni.getStorageSync("storage_info");
      if (pageNum.length == 1 || !userId) {
        if (!userId) {
          uni.removeStorageSync("storage_info");
          uni.removeStorageSync("userId");
          this.setUserInfo({});
        }
        uni.reLaunch({
          url: "/pagesF/activityIndex/index",
        });
        return;
      }
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fix {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  &.bg-color {
    background: #fff;
    padding-bottom: 20rpx;
  }
}
.status-bar {
  height: var(--status-bar-height);
  width: 100%;
}
.circle-header {
  width: 100%;
  height: 62rpx;
  // background: rgba(0,0,0, .3);
  padding: 0 31rpx;
  display: flex;
  align-items: center;
  .circle {
    width: 58rpx;
    height: 58rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
  .iconfont {
    // font-weight: bold;
    font-size: 40rpx;
  }
}
.white {
  color: #fff;
}
.black {
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}
.none {
  border: none !important;
  background: none !important;
}
</style>
