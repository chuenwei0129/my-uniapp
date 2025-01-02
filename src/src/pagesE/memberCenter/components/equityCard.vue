<template>
  <view :class="{ 'equity-container': isNative }">
    <!-- 卡片 -->
    <view
      :class="[
        'equity-card',
        (!noCardList || noCardList.length === 0) && cardList.length > 0
          ? 'mb32'
          : '',
      ]"
      v-if="cardList && cardList.length"
    >
      <view
        :class="['equity-card-item', `equity_LV${levelIndex}`]"
        v-for="(item, index) in cardList"
        :key="index"
        @click="goBenefitDetail(item)"
      >
        <image class="icon" :src="item.benefitIcon" />
        <view class="title color-lv">{{ item.benefitName }}</view>
        <view class="detail color-lv">{{
          item.benefitExplain.includes("null次") ? "0次" : item.benefitExplain
        }}</view>
      </view>
    </view>
    <!-- 非卡片 -->
    <scroll-view
      class="equityList"
      @scroll="onScroll"
      ref="scrollView"
      scroll-x="true"
      :scroll-left="cardScrollLeft"
      v-if="noCardList && noCardList.length"
    >
      <view
        class="equity-item"
        v-for="(item, index) in noCardList"
        :key="index"
        @click="goBenefitDetail(item)"
      >
        <view :class="['iconwrap', `${item.coming ? 'locked' : ''}`]">
          <image class="itemicon" :src="item.benefitIcon" />
        </view>
        <view class="iconname">{{ item.benefitName.slice(0, 5) }}</view>
        <view class="nextonline" v-if="item.coming">即将上线</view>
      </view>
    </scroll-view>
    <view
      class="progress"
      ref="progress"
      v-if="noCardList && noCardList.length > 5"
    >
      <view
        class="subbar"
        ref="subbar"
        :style="{
          width: (39 / noCardList.length) * 5 + 'rpx',
          left: scrollLeft + 'rpx',
        }"
      ></view>
    </view>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
import { pxToRpx } from "@/utils/index";
export default {
  name: "equityCard", // 权益卡片
  props: {
    levelIndex: {
      type: Number,
      default: 1,
    },
    levelBenefitList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/",
      cardList: [],
      noCardList: [],
      scrollLeft: 0,
      cardScrollLeftOld: 0,
      cardScrollLeft: 0,
    };
  },
  watch: {
    levelBenefitList(newVal, oldVal) {
      // this.cardList = this.levelBenefitList.filter(item => item.isHighlight)
      // this.noCardList = this.levelBenefitList.filter(item => !item.isHighlight)
      this.noCardList = [...this.levelBenefitList];
      this.cardScrollLeft = this.cardScrollLeftOld;
      this.$nextTick(() => {
        this.cardScrollLeft = 0;
      });
    },
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  mounted() {
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        "url('https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf')",
      // 'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")', //
      success() {
        console.log("success load otf");
      },
      fail() {
        console.log("fail load otf");
      },
    });
  },
  methods: {
    onScroll(event) {
      this.cardScrollLeftOld = event.detail.scrollLeft;
      const scrollLeft = pxToRpx(event.detail.scrollLeft);
      const parentWidth = pxToRpx(event.detail.scrollWidth);
      const sliderWidth = (39 / this.noCardList.length) * 5;
      const cha = 39 - sliderWidth;
      const rate = 39 / parentWidth;
      this.scrollLeft = scrollLeft * rate > cha ? cha : scrollLeft * rate;
    },

    goBenefitDetail(item) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "member_quanyi_click",
        module_name: "member",
        extend: {
          benefitName: item.benefitName,
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      //
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/benefitDetail/index?benefitId=${item.benefitId}&benefitType=${item.benefitType}`,
      });
      // #endif
      // #ifdef H5
      const path = `/pagesE/benefitDetail/index?benefitId=${item.benefitId}&benefitType=${item.benefitType}`;
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#${path}&transparentTopBar=1`,
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.mb32 {
  margin-bottom: 32rpx !important;
}
.equity-card {
  bottom: 0;
  width: 100vw;
  padding: 0 18rpx 0 20rpx;
  display: flex;
  flex-wrap: wrap;
  .equity-card-item {
    width: 215rpx;
    height: 250rpx;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 23rpx;
    border: 2rpx solid #ffffff;
    @include flex();
    flex-direction: column;
    margin-left: 19rpx;
    margin-bottom: 38rpx;
    box-sizing: border-box;
    .icon {
      width: 96rpx;
      height: 96rpx;
    }
    .title {
      font-family: AlimamaShuHeiTi, AlimamaShuHeiTi-Bold;
      // font-weight: bold;
      font-size: 27rpx;
      color: #275482;
      text-align: center;
      margin: 17rpx auto 11rpx;
    }
    .detail {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 23rpx;
      color: #275482;
      line-height: 33rpx;
      text-align: center;
    }
  }
  .equity_LV1 {
    .color-lv {
      color: #275482;
    }
  }
  .equity_LV2 {
    .color-lv {
      color: #6e4207;
    }
  }
  .equity_LV3 {
    .color-lv {
      color: #342068;
    }
  }
  .equity_LV4 {
    .color-lv {
      color: #1f2047;
    }
  }
}
.equityList {
  width: 100%;
  height: 134rpx;
  white-space: nowrap;
  margin-left: 26rpx;
  // padding-left: 40rpx;
  // display: flex;
  // flex-wrap: nowrap;
  // margin: 0 auto 0rpx;
  // animation: show .3s linear;
  // box-sizing: border-box;
  // overflow-x: scroll;
  .equity-item {
    width: 126rpx;
    margin-right: 15rpx;
    margin-bottom: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    display: inline-block;
    &:last-child {
      margin-right: 50rpx;
    }
    // margin-bottom: 47rpx;

    // &:nth-child(5n) {
    //   margin-right: 0rpx;
    // }

    .iconwrap {
      width: 85rpx;
      height: 85rpx;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/circlebg.png"
      );
      @include flex();
      margin: 0 auto;
      &.locked {
        position: relative;

        .iconwrap {
          opacity: 0.5;
        }

        &::after {
          content: "";
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/locked.png"
          );
          display: block;
          @include absNormal(27rpx, 31rpx, $top: 54rpx, $right: 0);
        }
      }
    }

    .itemicon {
      width: 43rpx;
      height: 43rpx;
    }

    .iconname {
      @include textfclaw(25rpx, #ffffff, $align: center, $lineH: 35rpx);
      margin-top: 10rpx;
      width: 127rpx;
    }

    .nextonline {
      @include textfclaw(
        21rpx,
        rgba(255, 255, 255, 0.8),
        $align: center,
        $lineH: 31rpx
      );
    }
  }
}
.progress {
  width: 39rpx;
  height: 6rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4rpx;
  backdrop-filter: blur(10px);
  position: relative;
  margin: 15rpx auto 0 auto;
  position: relative;
  overflow: hidden;
  .subbar {
    height: 100%;
    border-radius: 4rpx;
    background: #fff;
    opacity: 0.8;
    position: absolute;
    left: 12rpx;
  }
}
.equity-container {
  margin-top: -15rpx;
}
</style>
