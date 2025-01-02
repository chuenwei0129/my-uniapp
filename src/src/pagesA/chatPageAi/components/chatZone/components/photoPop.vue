<template>
  <view class="">
    <u-popup :show="show" round="19" @touchmove.stop.prevent>
      <view class="content">
        <view class="m-item" @click="handleFn(1)">拍照</view>
        <view class="m-item" @click="handleFn(2)">从手机相册选择</view>
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
  },
  data() {
    return {
      current: 0,
    };
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    handleFn(num) {
      this.$emit("event", num);
      this.$emit("update:show", false);
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
}
.m-close {
  height: 130rpx;
  line-height: 111rpx;
  background: #ffffff;
  border-top: 19rpx solid #f5f6f7;
  font-size: 31rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #333333;
}
</style>
