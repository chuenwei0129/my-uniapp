<template>
  <u-popup
    :show="isOpen"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="modal-suc-card">
      <view class="suc-topbg">
        <img :src="topPicUrl" />
      </view>
      <view class="dots1"></view>
      <view class="dots2"></view>
      <view class="dots3"></view>
      <view class="dots4"></view>
      <view class="modal-content">
        <view class="suc-title">恭喜您创建成功</view>
        <view class="suc-btn" @click="close">我知道了</view>
      </view>
    </view>
    <view class="tip-text">5s后自动关闭</view>
  </u-popup>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      topPicUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/createsuc_static.png",
    };
  },
  methods: {
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
  },
  mounted() {
    this.topPicUrl =
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/createsuc.png";
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
    setTimeout(() => {
      this.$emit("update:isOpen", false);
    }, 5000);
    setTimeout(() => {
      this.topPicUrl =
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/createsuc_static.png";
    }, 1000);
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";
.modal-suc-card {
  display: flex;
  flex-direction: column;
  width: 577rpx;
  height: 373rpx;
  position: relative;
  animation: bigScale 0.41s ease-in forwards;
  margin-top: 200rpx;
  &::before {
    content: "";
    @include absNormal(577rpx, 577rpx, $top: -290rpx, $left: 0);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/lightshine.png"
    );
    animation: rotateBackground 4s linear infinite;
    z-index: -1;
  }
  .modal-content {
    width: 577rpx;
    height: 373rpx;
    padding: 110rpx 38rpx 38rpx 38rpx;
    background: linear-gradient(172deg, #fff5a0 0%, #ffffff 100%);
    border-radius: 38rpx;
    backdrop-filter: blur(10rpx);
  }
  .suc-topbg {
    @include absNormal($w: 250rpx, $h: 250rpx, $top: -127rpx, $left: 50%);
    transform: translateX(-50%);
    z-index: 2;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .dots1 {
    @include absNormal(35rpx, 33rpx, $top: -70rpx, $left: 148rpx);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/dot1.png"
    );
    animation: dotshine 1.2s linear 0.75s infinite;
    z-index: 2;
  }
  .dots2 {
    @include absNormal(13rpx, 12rpx, $top: -128rpx, $left: 177rpx);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/dot2.png"
    );
    animation: dotshine 1.2s linear 1.01s infinite;
    z-index: 2;
  }
  .dots3 {
    @include absNormal(21rpx, 19rpx, $top: -111rpx, $right: 158rpx);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/dot3.png"
    );
    animation: dotshine 1.2s linear 0.97s infinite;
    z-index: 2;
  }
  .dots4 {
    @include absNormal(17rpx, 15rpx, $top: -27rpx, $right: 146rpx);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/dot4.png"
    );
    animation: dotshine 1.2s linear 0.87s infinite;
    z-index: 2;
  }
  .suc-title {
    @include textfclaw(46rpx, #1f1f1f, $align: center, $lineH: 56rpx);
    font-family: "AlimamaShuHeiTi-Bold";
    position: relative;
    &::before {
      content: "";
      @include absNormal(323rpx, 21rpx, $bottom: 0, $left: 50%);
      transform: translateX(-50%);
      background: #fee900;
      z-index: -1;
    }
  }
  .suc-btn {
    width: 500rpx;
    height: 85rpx;
    background: #fee900;
    border-radius: 42rpx;
    @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 85rpx);
    font-weight: bold;
    margin-top: 77rpx;
  }
  @keyframes rotateBackground {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes bigScale {
    0% {
      transform: scale(0);
    }
    73.1% {
      transform: scale(1.15);
    }
    92.6% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes dotshine {
    0% {
      opacity: 0;
    }
    12.5% {
      opacity: 1;
    }
    37.5% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
    62.5% {
      opacity: 1;
    }
    87.5% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
.tip-text {
  @include textfclaw(29rpx, #ffffff, $align: center, $lineH: 40rpx);
  margin-top: 90rpx;
  width: 100%;
  text-align: center;
}
</style>
