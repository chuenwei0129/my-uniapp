<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    :mask-close-able="false"
    @touchmove.stop.prevent
  >
    <view class="openmember-modal">
      <view class="agreement">
        <view
          :class="['radiocheck', checked ? 'checked' : '']"
          @click="checkboxChange"
        ></view>
        <view class="agreement-text">
          <div>
            我已阅读并同意<span @click="goAgreement(1)"
              >《宠胖胖等级会员服务条款》</span
            >和<span @click="goAgreement(2)">《体验内测协议》</span>
          </div>
        </view>
      </view>
    </view>
    <view class="openbtn" @click="openMember">开启会员成长之旅</view>
    <view class="close-icon" @click="close"></view>
  </u-popup>
</template>
<script>
import { OPEN_LEVEL } from "@/api/member";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    goAgreement(linktype) {
      let str = "";
      if (linktype == 1) {
        str = `/pagesA/webView/index?route=/meow-interface/html/member-benefits-agreement.html&type=jump`;
      } else {
        str = `/pagesA/webView/index?route=/meow-interface/html/member-beta-agreement.html&type=jump`;
      }
      //TODO 协议

      uni.navigateTo({
        url: str,
      });
    },
    close() {
      this.$emit("update:show", false);
    },
    handleClose() {
      this.$emit("update:show", false);
    },
    checkboxChange() {
      let curstatus = this.checked;
      this.checked = !curstatus;
    },
    openMember() {
      if (!this.checked) return;
      OPEN_LEVEL().then((res) => {
        this.$emit("update:show", false);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";

.openmember-modal {
  width: 578rpx;
  height: 898rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/openmodalbg.png"
  );
  position: relative;

  .agreement {
    padding-left: 48rpx;
    padding-right: 48rpx;
    display: flex;
    @include absNormal(auto, auto, $bottom: 73rpx, $left: 0);
    .radiocheck {
      width: 29rpx;
      height: 29rpx;
      margin-right: 8rpx;
      flex-shrink: 0;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/radio.png"
      );
      &.checked {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/radiochecked.png"
        );
      }
    }

    .agreement-text {
      @include textfclaw(21rpx, #fcf8f5, $align: left, $lineH: 31rpx);
    }
  }
}
.openbtn {
  width: 370rpx;
  height: 85rpx;
  margin: -42rpx auto 0;
  z-index: 2;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/openbtn.png"
  );
  @include textfclaw(31rpx, #202020, $align: center, $lineH: 42rpx);
  @include flex();
  font-weight: bold;
}
.close-icon {
  width: 62rpx;
  height: 62rpx;
  margin: 68rpx auto 0;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/modalclose.png"
  );
}
</style>
