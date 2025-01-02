<template>
  <view class="">
    <u-popup
      :show="show"
      :closeOnClickOverlay="true"
      @close="close"
      :orderNo="orderNo"
      :isSignUp="isSignUp"
      round="38"
      @touchmove.stop.prevent
    >
      <view class="content">
        <view class="m-item" @click="handleFn(1)">举报活动</view>
        <view class="m-item" @click="handleFn(2)" v-if="orderNo && isSignUp"
          >订单详情</view
        >
        <view
          class="m-item red"
          @click="handleFn(3)"
          v-if="isSignUp && activityType == 'PAY'"
          >取消参与</view
        >
        <view
          class="m-item red"
          @click="handleFn(4)"
          v-if="isSignUp && activityType == 'FREE'"
          >取消参与</view
        >
        <view class="m-close" @click="close">取消</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    orderNo: {
      type: String,
    },
    isSignUp: {
      type: Boolean,
    },
    activityType: {
      type: String,
    },
  },
  data() {
    return {
      current: 0,
    };
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("close", true);
    },
    handleFn(num) {
      this.$emit("event", num);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  // background: #F5F6F7;
  text-align: center;
  border-radius: 38rpx 38rpx 0 0;
  overflow: hidden;
}
.m-item {
  background: #ffffff;
  height: 96rpx;
  line-height: 96rpx;
  font-size: 31rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  &.red {
    color: #f3333c;
  }
}
.m-close {
  height: 130rpx;
  line-height: 111rpx;
  background: #ffffff;
  border-top: 19rpx solid #f5f6f7;
  font-size: 31rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
</style>
