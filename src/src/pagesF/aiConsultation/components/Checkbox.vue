<template>
  <view class="check-box">
    <view @click="triggerClick" class="read-name-box">
      <!--  选中样式  -->
      <view class="checked" v-if="value">
        <image
          src="//frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/selectedIcon.png"
          mode="scaleToFill"
        />
      </view>
      <!--  未选中样式  -->
      <view class="checked" v-else>
        <image
          src="//frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/noChooesIcon.png"
          mode="scaleToFill"
        />
      </view>
      <view class="read-name">已阅读并同意</view>
    </view>
    <view @click="goAgreement" class="agreement-name">{{ agreementName }}</view>
  </view>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "CCheckbox",
  model: {
    event: "change",
  },
  props: {
    value: {
      type: Boolean,
    },
    agreementName: {
      type: String,
    },
  },
  methods: {
    ...mapMutations(["setSaveDeliverShow"]),
    triggerClick() {
      this.$emit("change", !this.value);
    },
    // 协议跳转
    goAgreement() {
      this.setSaveDeliverShow(false);
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pagesA/webView/index?route=/meow-interface/html/aiAgreement.html&type=jump",
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${
          window.location.origin
        }/crm-medical-h5/#/pagesA/webView/index?route=/meow-interface/html/aiAgreement.html&type=jump&title=${encodeURIComponent(
          "隐私协议"
        )}`,
      });
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
.check-box {
  height: 35rpx;
  font-size: 23rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  .read-name-box {
    margin-top: 2rpx;
    height: 35rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 10rpx;
    .checked {
      margin-right: 8rpx;
      image {
        margin-top: 8rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
    .read-name {
      line-height: 35rpx;
      color: #666666;
    }
  }
  .agreement-name {
    color: #2e8eff;
  }
}
</style>
