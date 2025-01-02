<template>
  <view class="guide-browser">
    <view class="guide-browser__content">
      <view class="left">
        点击右上角按钮，然后在弹出的菜单中，点击在浏览器打开
      </view>
      <view class="right">
        <image :src="bightUrl" mode="widthFix" class="img" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "guideBrowser",
  data() {
    return {
      bightUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/new-guide.png",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.guide-browser {
  width: 100vw;
  height: 150rpx;
  display: flex;
  padding: 10rpx 30rpx;
  background-color: #343434;
  position: relative;
  z-index: 8;
  .guide-browser__content {
    color: #999999;
    display: flex;
    .left {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 31rpx;
    }
    .right {
      width: 60rpx;
      .img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
