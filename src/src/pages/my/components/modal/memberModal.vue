<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="open-modal">
      <view class="bg-icon"></view>
      <view class="pop-title"></view>
      <view class="content">
        <view class="content-item" v-for="(str, index) in tipList" :key="index">
          • {{ str }}
        </view>
      </view>
      <view class="tip">原会员按照成长值数量对应至现有会员等级</view>
      <view class="btn" @click="$u.debounce(toMember, 500)">立即体验</view>
      <view class="close-btn" @click="close"></view>
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
    levelInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tipList: ["成长值全新上线", "会员权益升级"],
    };
  },
  methods: {
    close() {
      this.$emit("update:show", false);
      uni.setStorageSync("myFirstOpen", true);
    },
    toMember() {
      this.close();
      uni.navigateTo({
        url: `/pagesE/memberCenter/index?levelConfigId=${this.levelInfo.levelConfigId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
@import "@/utils/membertheme.scss";
.open-modal {
  width: 577rpx;
  height: 654rpx;
  background: #ffffff;
  border-radius: 38rpx;
  text-align: left;
  padding-top: 58rpx;
  padding-bottom: 62rpx;
  position: relative;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberCenterBg.png"
  );
  .bg-icon {
    width: 250rpx;
    height: 236rpx;
    position: absolute;
    top: -78rpx;
    right: -32rpx;
    z-index: -1;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberCenterp.png"
    );
  }
  .pop-title {
    font-size: 42rpx;
    margin: 20rpx 44rpx 38rpx;
    width: 250rpx;
    height: 102rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberCenterTitle.png"
    );
  }
  .content {
    width: 488rpx;
    height: 223rpx;
    margin: 0 auto 40rpx;
    background-color: rgba(255, 255, 255, 0.39);
    border-radius: 27rpx;
    padding: 36rpx 61rpx 41rpx 61rpx;
    text-align: left;
    color: #70361f;
    font-size: 28rpx;
    line-height: 40rpx;
    font-family: PingFangSC, PingFang SC;
    .content-item {
      margin: 25rpx 0;
    }
  }
  .tip {
    margin-bottom: 20rpx;
    text-align: center;
    font-size: 21rpx;
    color: rgba(112, 54, 31, 0.7);
    line-height: 31rpx;
    font-family: PingFangSC, PingFang SC;
  }
  .btn {
    width: 500rpx;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    border-radius: 48rpx;
    margin: 0 auto 18rpx;
    font-weight: bold;
    color: #70361f;
    background-color: #fff;
    font-size: 35rpx;
  }
  .close-btn {
    width: 61rpx;
    height: 61rpx;
    position: absolute;
    bottom: -120rpx;
    left: 50%;
    transform: translate(-50%, -50%);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/closeIcon.png"
    );
  }
}
</style>
