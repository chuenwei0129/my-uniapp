<template>
  <view class="choiceness-cat-view-wrapper" @click="this.$emit('onClick')">
    <view class="cat-image-box">
      <u-image
        :src="cat.image"
        fade
        :lazy-load="true"
        width="92rpx"
        height="92rpx"
      >
      </u-image>
      <image class="hot-corner" v-if="!!cat.cornerIcon" :src="cat.cornerIcon" />
    </view>
    <text class="main-title">{{ cat.mainTitle || "" }}</text>
    <text class="cat-name">{{ cat.viceTitle || "" }}</text>
  </view>
</template>

<script>
export default {
  name: "CoreFunctionalArea",
  props: {
    cat: {
      type: Object,
      default: {},
    },
    index: 0,
  },
  emits: ["onClick"],
  computed: {
    // catName() {
    //   const name = this.cat.name;
    //   return name.length > 4 ? name.substring(0, 4) : name;
    // },
  },

  mounted() {
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
};
</script>

<style scoped lang="scss">
.choiceness-cat-view-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 92rpx;
  white-space: nowrap;
  overflow: visible;
  .main-title {
    margin-top: 7rpx;
    max-width: 118rpx;
    height: 35rpx;
    overflow: hidden;
    font-family: AlimamaShuHeiTi-Bold;
    font-size: 29rpx;
    color: #1f1f1f;
    line-height: 35rpx;
    text-align: center;
    font-style: normal;
  }
  .cat-name {
    max-width: 127rpx;
    height: 31rpx;
    overflow: hidden;
    line-height: 31rpx;
    font-weight: 300;
    font-size: 21rpx;
    color: #333333;
    text-align: center;
  }
  .cat-image-box {
    position: relative;
    .hot-corner {
      position: absolute;
      height: 25rpx;
      width: 42rpx;
      top: 0;
      left: 52rpx;
    }
  }
}
</style>
