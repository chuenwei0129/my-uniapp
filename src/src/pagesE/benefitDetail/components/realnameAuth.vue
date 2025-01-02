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
      <view class="content-top">
        <text v-if="status == 1"
          >请先完成实名认证，胖胖才能知道你的生日呀~</text
        >
        <text v-else-if="status == 2" class="birthday-2"
          >生日当月才可领取及使用</text
        >
      </view>
      <view class="content-bottom">
        <template v-if="status == 1">
          <view class="cancel" @click="close">取消</view>
          <view class="confirm" @click="handleClose">确定</view>
        </template>
        <view v-else-if="status == 2" class="know" @click="handleClose"
          >知道了</view
        >
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "RealnameAuth",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    status: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    handleClose() {
      this.close();
      if (this.status == 1) {
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/user/real-name/home`,
        });
        // #endif
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: "/pagesE/guideApp/index?type=3",
        });
        // #endif
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.content {
  width: 577rpx;
  height: 288rpx;
  background: #ffffff;
  border-radius: 38rpx;
  padding: 38rpx 38rpx 0 38rpx;
  box-sizing: border-box;
  position: relative;
  .contentImg {
    position: absolute;
    top: -27rpx;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 346rpx;
    height: 231rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/popupIcon.png"
    );
  }
  .content-top {
    width: 100%;
    height: 154rpx;
    border-bottom: 1rpx solid #e6e6e6;
    padding: 25rpx 30rpx;
    box-sizing: border-box;
    @include textfclaw(27rpx, #1f1f1f, $align: center, $lineH: 38rpx);
    .birthday-2 {
      padding-top: 20rpx;
      display: inline-block;
      box-sizing: border-box;
    }
  }
  .content-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 27rpx auto 28rpx;
    height: calc(100% - 154rpx);
    box-sizing: border-box;
    .cancel {
      width: 50%;
      @include textfclaw(31rpx, #25252a, $align: center, $lineH: 42rpx);
      border-right: 1rpx solid #e6e6e6;
    }
    .confirm {
      width: 50%;
      font-weight: 500;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
    .know {
      width: 100%;
      font-weight: 500;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
  }
}
</style>
