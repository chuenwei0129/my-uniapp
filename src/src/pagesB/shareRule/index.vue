<template>
  <view class="page-wrapper">
    <view class="rule-img"></view>
  </view>
</template>

<script>
//  //import { wxShareMethod } from "@/utils/wxShare";
export default {
  components: {},
  data() {
    return {};
  },

  onLoad(option) {},
  onReady() {},
  onShow() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
@import "utils/fn.scss";

.rule-img {
  width: 100%;
  height: 2294rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/rule-new-img.png"
  );
}
</style>
