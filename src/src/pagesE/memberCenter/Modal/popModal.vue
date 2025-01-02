<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view :class="['pop-modal', `level${levelIndex}_pop`]">
      <view class="pop-title"></view>
      <view class="contentimage"></view>
      <view class="btn" @click="handleClose">好的 </view>
      <view class="tips">快去看看解锁了哪些新权益吧</view>
    </view>
  </u-popup>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    levelIndex: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    handleClose() {
      this.$emit("update:show", false);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";
@import "../../../utils/membertheme.scss";

.pop-modal {
  width: 577rpx;
  height: 654rpx;
  padding-top: 58rpx;
  padding-bottom: 31rpx;
  text-align: center;
  box-shadow: inset 0rpx 0rpx 13rpx 0rpx rgba(255, 255, 255, 0.33);
  border-radius: 38rpx;
  .pop-title {
    width: 385rpx;
    height: 58rpx;
    margin: 0 auto 39rpx;
  }
  .contentimage {
    width: 389rpx;
    height: 289rpx;
    margin: 0 auto 47rpx;
  }
  .btn {
    width: 369rpx;
    height: 85rpx;
    border-radius: 42rpx;
    @include flex();
    margin: 0 auto 18rpx;
    @include textfclaw(31rpx, #ffffff, $align: center, $lineH: 42rpx);
    font-weight: bold;
  }
  .tips {
    font-size: 23rpx;
    line-height: 33rpx;
  }
  &.level1_pop {
    background: linear-gradient(180deg, #fcfeff 0%, #91c5ff 100%);
    .pop-title {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poptitle1.png"
      );
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel1.png"
      );
    }
    .btn {
      background: linear-gradient(
        90deg,
        getNormalColor(1) 0%,
        getDeepColor(1) 100%
      );
    }
    .tips {
      color: getDeepColor(1);
    }
  }
  &.level2_pop {
    background: linear-gradient(180deg, #fcfdf8 0%, #fbd7c3 100%);
    .pop-title {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poptitle2.png"
      );
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel2.png"
      );
    }
    .btn {
      background: linear-gradient(
        90deg,
        getNormalColor(2) 0%,
        getDeepColor(2) 100%
      );
    }
    .tips {
      color: getDeepColor(2);
    }
  }
  &.level3_pop {
    background: linear-gradient(177deg, #edf7fb 0%, #d2f7ff 100%);
    .pop-title {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poptitle3.png"
      );
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel3.png"
      );
    }
    .btn {
      background: linear-gradient(
        90deg,
        getNormalColor(3) 0%,
        getDeepColor(3) 100%
      );
    }
    .tips {
      color: getDeepColor(3);
    }
  }
  &.level4_pop {
    background: linear-gradient(180deg, #fef3ec 0%, #fdf6cd 100%);
    .pop-title {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poptitle4.png"
      );
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel4.png"
      );
    }
    .btn {
      background: linear-gradient(
        90deg,
        getNormalColor(4) 0%,
        getDeepColor(4) 100%
      );
    }
    .tips {
      color: getDeepColor(4);
    }
  }
  &.level5_pop {
    background: linear-gradient(180deg, #e4f8ff 0%, #c9a7e9 100%);
    .pop-title {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poptitle5.png"
      );
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel5.png"
      );
    }
    .btn {
      background: linear-gradient(
        90deg,
        getNormalColor(5) 0%,
        getDeepColor(5) 100%
      );
    }
    .tips {
      color: getDeepColor(5);
    }
  }
  &.level6_pop {
    background: linear-gradient(180deg, #342c34 0%, #060d17 100%);
    .pop-title {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poptitle6.png"
      );
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel6.png"
      );
    }
    .btn {
      background: linear-gradient(
        90deg,
        getNormalColor(6) 0%,
        getDeepColor(6) 100%
      );
      color: #202020;
    }
    .tips {
      color: getDeepColor(6);
    }
  }
  &.level7_pop {
    background: linear-gradient(180deg, #fef3ec 0%, #fdf6cd 100%);
    .pop-title {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poptitle7.png"
      );
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel7.png"
      );
    }
    .btn {
      background: linear-gradient(
        90deg,
        getNormalColor(7) 0%,
        getDeepColor(7) 100%
      );
    }
    .tips {
      color: getDeepColor(7);
    }
  }
}
</style>
