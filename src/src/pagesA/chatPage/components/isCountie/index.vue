<template>
  <view class="popup">
    <u-popup
      :show="show"
      mode="center"
      @close="close"
      :overlay="isOverlay"
      :safeAreaInsetBottom="false"
      :round="10"
    >
      <view class="tip-card">
        <view class="pet-icon"></view>

        <view class="content">
          <view class="describe"
            >“暂时退出”将为您保存本次问诊信息10分钟，“结束问诊”将直接结束本次问诊。</view
          >
        </view>
        <view class="line"> </view>
        <view class="footer">
          <view class="confirm" @click="handleClose">暂时退出 </view>
          <view class="line2"></view>
          <view class="cancel" @click="handleConfirm">结束问诊 </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isShowAllSelect: {
      type: Boolean,
    },
  },
  data() {
    return {
      isOverlay: true,
    };
  },
  methods: {
    close() {
      this.$emit("update:show", false);
      this.$emit("update:isShowAllSelect", true);
    },
    handleConfirm() {
      // this.deliverShow = false;
      this.$emit("handleEndSheet");
      // this.close();
      this.$emit("update:show", false);
      this.$emit("update:isShowAllSelect", false);
    },
    handleClose() {
      // this.deliverShow = false;
      this.skinBack();
    },
    skinBack() {
      this.$emit("back");
      // this.$emit("postStepOut");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";
.popup {
  .tip-card {
    box-sizing: border-box;
    width: 577rpx;
    background: #ffffff;
    border-radius: 38rpx;
    backdrop-filter: blur(10px);
    padding: 0 38rpx;
    position: relative;
    .pet-icon {
      @include absNormal($w: 346rpx, $h: 230rpx, $top: -145rpx, $left: 50%);
      transform: translateX(-50%);
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/popovercutePet.png"
      );
    }
    .content {
      padding: 77rpx 0 18rpx;
      font-size: 27rpx;
      color: #666;
      line-height: 38rpx;
      text-align: center;
      .describe {
        height: 55rpx;
        font-size: 28rpx;
        color: #1f1f1f;
      }
      .agreement {
        display: flex;
        justify-content: center;
        margin: 0 auto;
        font-size: 23rpx;
        font-weight: 400;
        color: #666666;
        margin-top: 22rpx;
        width: 410rpx;
        .agreement-text {
          margin-top: -3rpx;
          text {
            color: #2e8eff;
          }
        }
      }
    }
    .line {
      margin-top: 41px;
      width: 500rpx;
      height: 0.5px;
      background-color: #e6e6e6;
    }
    .footer {
      display: flex;
      align-items: center;
      .confirm {
        flex: 1;
        font-size: 31rpx;
        color: #25252a;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 94rpx;
      }
      .line2 {
        width: 2rpx;
        height: 38rpx;
        background-color: #e6e6e6;
      }

      .cancel {
        flex: 1;
        height: 94rpx;
        font-weight: bold;
        font-size: 31rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        // color: $themeColor;
      }
    }
  }
}
</style>
