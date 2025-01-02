<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view :class="['down-modal', `level${levelIndex}_down`]">
      <view class="pop-title">会员等级降为V{{ levelIndex }}会员</view>
      <view class="contentimage"></view>
      <view class="btn" @click="handleClose">好的 </view>
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
    levelIndex: {
      type: Number,
      default: 0,
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
.down-modal {
  width: 577rpx;
  height: 654rpx;
  background: #ffffff;
  box-shadow: inset 0rpx 0rpx 13rpx 0rpx rgba(255, 255, 255, 0.33);
  border-radius: 38rpx;
  text-align: center;
  padding-top: 58rpx;
  padding-bottom: 62rpx;
  .pop-title {
    font-size: 42rpx;
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
  &.level1_down {
    .pop-title {
      color: getDeepColor(1);
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
  }
  &.level2_down {
    .pop-title {
      color: getDeepColor(2);
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
  }
  &.level3_down {
    .pop-title {
      color: getDeepColor(3);
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
  }
  &.level4_down {
    .pop-title {
      color: getDeepColor(4);
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
  }
  &.level5_down {
    .pop-title {
      color: getDeepColor(5);
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
  }
  &.level6_down {
    .pop-title {
      color: #00061a;
    }
    .contentimage {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/poplevel6.png"
      );
    }
    .btn {
      background: linear-gradient(270deg, #01061a 0%, #000722 100%);
    }
  }
  &.level7_down {
    .pop-title {
      color: getDeepColor(7);
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
  }
}
</style>
