<template>
  <view class="call-app">
    <view class="guide-box">
      <view class="left">
        <view class="logo">
          <image class="img" :src="cppLogo" mode="widthFix"></image>
        </view>
        <view class="text-box">
          <view class="title">宠胖胖</view>
          <view class="desc">宠友扎堆 宠胖胖</view>
        </view>
      </view>
      <view class="right">
        <view class="btn" @click="toCpp">打开APP</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "callApp",
  data() {
    return {
      cppLogo:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/newCppLogo.png",
    };
  },
  methods: {
    toCpp() {
      console.log("点击--打开APP");
      this.$emit("toCallApp");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.call-app {
  width: 100%;
  // height: 100%;
  // background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  // pointer-events: none;
  .guide-box {
    width: 100%;
    height: 150rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    .left {
      display: flex;
      align-items: center;
      .logo {
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .text-box {
        .title {
          font-size: 32rpx;
          color: #000;
          font-weight: 500;
        }
        .desc {
          font-size: 24rpx;
          color: #999;
          margin-top: 5rpx;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .btn {
        padding: 15rpx 30rpx;
        background-color: #fe2442;
        border-radius: 42rpx;
        font-size: 32rpx;
        color: #fff;
        text-align: center;
      }
    }
  }
}
</style>
