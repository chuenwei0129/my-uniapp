<template>
  <view class="initpage level0_page">
    <view class="current-card">
      <p class="initdesc">获取成长值升级，尊享多重权益</p>
      <view class="text-info">
        <view class="text-info-bg"></view>
        <!-- 父元素有opacity，必须分离 -->
        <view class="text-son">任意消费后可开启会员成长值玩法</view>
      </view>
    </view>
    <view class="initequityList"></view>
    <view class="toMallBtn" @click="toMall">逛逛商城</view>
    <view class="emptydesc"
      >去商城下单或到宠胖胖门店消费，完成后均可获得成长值哦</view
    >
  </view>
</template>
<script>
export default {
  methods: {
    toMall() {
      this.$emit("tomall");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";
@import "../../../utils/membertheme.scss";

.initpage {
  .current-card {
    width: 685rpx;
    height: 322rpx;
    margin: 44rpx auto 0;
    position: relative;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/mainbg_0.png"
    );

    .initdesc {
      @include textfclaw(25rpx, getNormalColor(0), $align: left, $lineH: 35rpx);
      position: absolute;
      top: 97rpx;
      left: 41rpx;
    }
    .text-info {
      position: relative;
      top: 58%;
      left: 50%;
      transform: translateX(-50%);
      height: 96rpx;
      width: 604rpx;
    }
    .text-info-bg {
      opacity: 0.32;
      background: #ffd000;
      backdrop-filter: blur(17px);
      height: 96rpx;
      width: 604rpx;
      border-radius: 21rpx;
    }
    .text-son {
      font-size: 25rpx;
      font-weight: normal;
      color: #8d5600;
      line-height: 35px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 385rpx;
    }
  }
  .initequityList {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/defaultlist.png"
    );
    width: 599rpx;
    height: 333rpx;
    margin: 39rpx auto 0;
    margin-left: 73rpx;
  }
  .toMallBtn {
    width: 674rpx;
    height: 93rpx;
    margin: 118rpx auto 24rpx;
    border-radius: 47rpx;
    background-image: linear-gradient(
      to right,
      getNormalColor(0),
      getDeepColor(0)
    );
    @include flex();
    @include textfclaw(31rpx, #ffffff);
  }

  .emptydesc {
    @include textfclaw(25rpx, getDeepColor(0), $align: center, $lineH: 35rpx);
  }
}
</style>
