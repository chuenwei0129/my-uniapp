<template>
  <view :class="['header-fixed', headerShow ? 'header-show' : '']">
    <view class="status-bar" :style="{ height: statusBarHeight }"></view>
    <view
      class="hender-frame"
      :style="{ height: navBarHeight }"
      v-if="!notFlexCenter"
    >
      <view class="left" v-if="isShowBack">
        <view class="iconfont icon-back" @click="goBack"></view>
      </view>
      <view
        class="title"
        :style="{
          height: navBarHeight,
          lineHeight: navBarHeight,
          fontWeight: navBarFontweight,
        }"
        >{{ title }}</view
      >
      <slot name="headercomponent" />
      <view class="right">
        <slot name="righticon" />
      </view>
    </view>
    <view class="header-frame-noflexcenter" v-else>
      <view class="top-icon">
        <image :src="shopIcon" mode="scaleToFill" />
      </view>
      <view
        class="title"
        :style="{ height: navBarHeight, lineHeight: navBarHeight }"
        >{{ title }}</view
      >
      <slot name="headercomponent" />
      <view class="right">
        <slot name="righticon" />
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    headerShow: {
      type: Boolean,
      default: false,
    },
    backfc: {
      type: Function,
    },
    isShowBack: {
      type: Boolean,
      default: true,
    },
    notFlexCenter: {
      type: Boolean,
      default: false,
    },
    shopIcon: { type: String, default: "" },
    navBarFontweight: { type: String },
  },
  data() {
    return {
      statusBarHeight: "",
      navBarHeight: "",
    };
  },
  mounted() {
    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    this.navBarHeight = (getApp().globalData.h5NavBarHeight) + "px";
    //#endif
  },
  methods: {
    goBack() {
      if (this.backfc) {
        this.backfc();
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-fixed {
  width: 100%;
  background: #ffffff;
  padding-bottom: 10rpx;
  top: 0;
  left: 0;
  z-index: 30;
  box-sizing: border-box;
  position: fixed;
  display: none;

  .icon-back {
    margin-left: 33rpx;
  }

  &.header-show {
    display: block;
    animation: toShow 0.7s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
  }

  .hender-frame {
    display: flex;
    flex-direction: row;
    //justify-content: flex-start;
    align-items: center;
    //margin-bottom: 50rpx;

    .left {
      flex: 2;
      display: flex;

      .iconfont {
        font-size: 40rpx;
      }

      .input-btn {
        color: #000;
        font-size: 34rpx;
        margin-left: 44rpx;
        //margin-right: 50rpx;
        height: 48rpx;
        line-height: 48rpx;
      }
    }

    .title {
      text-align: center;
      flex-shrink: 0;
      font-size: 35rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #1f1f1f;
    }

    .right {
      display: flex;
      justify-content: flex-end;
      flex: 2;
    }
  }

  .status-box {
    padding-left: 31rpx;
  }
}

@keyframes toShow {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
.header-frame-noflexcenter {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 29rpx;

  .top-icon {
    height: 38rpx;
    width: 38rpx;
    border-radius: 2rpx;
    margin-right: 10rpx;
    image {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 14rpx;
    }
  }

  .input-btn {
    color: #000;
    font-size: 34rpx;
    margin-left: 44rpx;
    //margin-right: 50rpx;
    height: 48rpx;
    line-height: 48rpx;
  }

  .title {
    width: 486.53rpx;
    // text-align: center;
    flex-shrink: 0;
    font-size: 31rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1f1f1f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    flex: 2;
  }
}
</style>
