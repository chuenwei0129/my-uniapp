<template>
  <root-portal>
    <u-popup
      v-if="isOpen"
      :show="isOpen"
      mode="bottom"
      bgColor="transparent"
      @touchmove.stop.prevent
      :closeOnClickOverlay="true"
      :safeAreaInsetBottom="false"
      :overlay="true"
      @close="close"
    >
      <view class="content">
        <view class="header">
          <text>品种介绍</text>
          <view class="close-icon">
            <image class="icon" :src="close_icon" @click="close" />
          </view>
        </view>
        <view class="main">
          <scroll-view class="main-scroll" scroll-y>
            <view class="text">{{ speciesIntroduction || "" }}</view>
            <br />
            <view class="text">{{ disposition || "" }}</view>
          </scroll-view>
        </view>
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </u-popup>
  </root-portal>
</template>

<script>
export default {
  name: "popOfficial",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    speciesIntroduction: {
      type: String,
      default: "",
    },
    disposition: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      close_icon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_clear.png",
    };
  },
  methods: {
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100vw;
  // max-height: 1327rpx;
  max-height: 80vh;
  min-height: 808rpx;
  background: #f7f8fc;
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  .header {
    width: 100%;
    height: 115rpx;
    line-height: 115rpx;
    text-align: center;
    font-weight: 500;
    font-size: 35rpx;
    color: #1f1f1f;
    font-family: PingFangSC, PingFang SC;
    position: relative;
    .close-icon {
      width: 50rpx;
      height: 50rpx;
      background-color: #ecedf1;
      border-radius: 50%;
      // opacity: 0.5;
      position: absolute;
      top: 50%;
      right: 30rpx;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 31rpx;
        height: 31rpx;
        display: inline-block;
      }
    }
  }
  .main {
    padding: 0rpx 38rpx 30rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 300;
    font-size: 29rpx;
    color: #1f1f1f;
    line-height: 46rpx;
    .main-scroll {
      width: 100%;
      // max-height: calc(1327rpx - 115rpx - 20rpx);
      max-height: calc(80vh - 115rpx - 20rpx);
      min-height: 808rpx;
      overflow: hidden;
      .text {
        text-indent: 2em;
      }
    }
  }
}
</style>
