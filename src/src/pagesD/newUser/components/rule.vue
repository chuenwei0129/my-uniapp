<template>
  <view class="rule-wrap">
    <FixedNav title="活动规则" :headerShow="true"></FixedNav>
    <view class="rule-page">
      <image
        class="rule-image"
        src="https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/ruleinfoV3.png"
      ></image>
    </view>
  </view>
</template>
<script>
import FixedNav from "@/components/fixedNav/index.vue";
export default {
  components: {
    FixedNav,
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";

.rule-wrap {
  ::v-deep .header-fixed {
    position: sticky !important;
  }
  .rule-page {
    width: 750rpx;
    height: 3506rpx;
    overflow-y: scroll;

    .rule-image {
      width: 750rpx;
      height: 3371rpx;
    }
  }
}
</style>
