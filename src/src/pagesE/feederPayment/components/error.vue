<template>
  <view class="page-wrapper">
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="back-btn" @click="handleBack">
        <!-- #ifdef MP-WEIXIN -->
        <view class="home-btn">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/home_btn.png"
          />
        </view>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <u-icon name="arrow-left" color="#fff"></u-icon>
        <!-- #endif -->
      </view>
    </view>

    <view class="main">
      <view class="container">
        <image :src="errorImgUrl" />
        <p class="info">{{ errorHint }}</p>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    errorImgUrl: {
      type: String,
      default: "",
    },
    errorHint: {
      type: String,
      default: "",
    },
    statusBarHeight: {
      type: String,
      default: "",
    },
  },
  data() {},
  methods: {
    // 返回按钮
    handleBack() {
      console.log("click", "返回按钮");
      uni.navigateBack({
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  background-color: #1f1f1f;
  padding-bottom: 60rpx;

  .header {
    margin-top: 4rpx;
    padding-left: 29rpx;
    height: 58rpx;
    position: fixed;
    top: 0;
    left: 0;

    .back-btn {
      .home-btn {
        width: 58rpx;
        height: 58rpx;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        image {
          width: 35rpx;
          height: 35rpx;
        }
      }
    }
  }

  .main {
    .container {
      text-align: center;
      position: fixed;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
      width: 100%;

      image {
        width: 346rpx;
        height: 346rpx;
      }

      .info {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 25rpx;
        color: #999999;
        line-height: 35rpx;
        text-align: center;
        padding-left: 80rpx;
        padding-right: 80rpx;
      }
    }
  }
}
</style>

<style lang="scss">
.back-btn {
  width: 58rpx;
  height: 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 50%;

  ::v-deep span {
    font-size: 30rpx;
  }
}
</style>
