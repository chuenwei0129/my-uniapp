<template>
  <u-popup
    :safeAreaInsetBottom="false"
    :show="show"
    mode="bottom"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="customPopup">
      <view
        class="iconfont icon-closeMark notice-close"
        @click="jumpClose"
      ></view>
      <view class="customPopup-img"></view>
      <view class="customPopup-text">
        <view class="customPopup-text__main">已为您生成科学养宠计划</view>
        <view class="customPopup-text__sub"
          >权威院线宠物专家将对您宠物全生命周期贴心</view
        >
      </view>
      <view class="customPopup-btn">
        <view class="subscribe" @click="subscribeClick">开启订阅</view>
        <view class="jump" @click="jumpClose">跳过，进入养宠</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      checked: true,
    };
  },

  onLoad (options) { },
  onReady () { },
  methods: {
    handlepay () { },
    handleCheck () {
      // this.checked = !this.checked;
    },
    handleToUser () {
      uni.navigateTo({
        url: `/pages/webView/index?route=/meow-interface/html/quanyika.html&type=jump`,
      });
    },
    close () {
      this.$emit("update:show", false);
      this.$emit("close", false);
    },
    handleClose () {
      this.$emit("update:show", false);
      this.$emit("close", false);
    },
    handleOpenPay () {
      this.$emit("update:show", false);
      this.$emit("open");
    },
    subscribeClick(){
      this.$emit("calendarClick");
    },
    jumpClose(){
      this.$emit("jumpClose");
      
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.customPopup {
  position: relative;
  height: 100vh;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/improveDoneBg.png"
  );
  .notice-close {
    position: absolute;
    top: 113rpx;
    left: 23rpx;
    font-size: 42rpx;
  }
  .customPopup-img {
    width: 412rpx;
    height: 412rpx;
    margin: 0 auto;
    margin-top: 356rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/improveDoneImg.png"
    );
  }
  .customPopup-text {
    margin-top: 23rpx;
    text-align: center;
    &__main {
      height: 69rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 48rpx;
      color: #1f1f1f;
      line-height: 69rpx;
      letter-spacing: 2px;
      font-style: normal;
    }
    &__sub {
      margin-top: 4rpx;
      height: 35rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 25rpx;
      color: #1f1f1f;
      line-height: 35rpx;
      font-style: normal;
    }
  }
  .customPopup-btn {
    margin-top: 438rpx;
    padding: 0 38rpx;
    text-align: center;
    .subscribe {
      height: 85rpx;
      background: #fee900;
      border-radius: 42rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 31rpx;
      color: #1f1f1f;
      border: none;
      @include flex();
    }
    .jump {
      height: 40rpx;
      margin-top: 38rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 29rpx;
      color: #238cff;
      @include flex();
    }
  }
}
</style>
