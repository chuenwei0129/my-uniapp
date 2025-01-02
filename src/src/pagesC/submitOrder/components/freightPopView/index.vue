<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="content">
      <view class="contentImg"></view>
      <div class="content-title">配送运费规则</div>
      <scroll-view scroll-y class="content-top">
        <div class="content-item">
          {{ messagePop }}
        </div>
      </scroll-view>
      <view class="content-bottom">
        <view class="know" @click="close">好的</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "outdistance",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    messagePop: {
      type: String,
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../utils/fn.scss";
.content {
  width: 577rpx;
  height: 630rpx;
  background: #ffffff;
  border-radius: 38rpx;
  padding: 46rpx 38rpx 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  word-break: break-all;
  .contentImg {
    position: absolute;
    top: -27rpx;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 346rpx;
    height: 231rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/popovercutePet.png"
    );
  }
  .content-title{
    height: 42rpx;
    font-weight: 500;
    font-size: 31rpx;
    color: #1F1F1F;
    line-height: 42rpx;
    text-align: center;
  }
  .content-top {
    width: 100%;
    height: 448rpx;
    border-bottom: 1rpx solid #e6e6e6;
    padding: 30rpx 0 0;
    box-sizing: border-box;
    overflow-y: auto;
    @include textfclaw(27rpx, #333333, $align: left, $lineH: 38rpx);
    .content-item{
      margin-bottom: 40rpx;
      padding-bottom: 16px;
      white-space: pre-wrap;
    }
  }
  .content-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 94rpx;
    box-sizing: border-box;
    .know {
      width: 100%;
      font-weight: 500;
      text-align: center;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
  }
}
</style>
