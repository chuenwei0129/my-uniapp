<script>
export default {
  name: "ChoicenessHotView",
  props: {
    hot: {}
  },
  emits: ["onClick"],
  computed: {
    hotName() {
      const name = this.hot.title;
      return name.length > 4 ? name.substring(0, 4) : name;
    },
  }
}
</script>

<template>
<view class="choiceness-hot-view-wrapper" @click="this.$emit('onClick')">
  <view class="hot-image-container">
    <image class="hot-image" :src="hot.image" mode="aspectFit"/>
    <image class="hot-corner" v-if="!!hot.cornerIcon" :src="hot.cornerIcon" />
  </view>
  <text class="hot-name">{{ hotName }}</text>
</view>
</template>

<style scoped lang="scss">
.choiceness-hot-view-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .hot-image-container {
    position: relative;
    aspect-ratio: 1/1;
    width: calc(100% - 24rpx);
    display: flex;
    align-items: flex-end;
    margin-top: 10rpx;
    .hot-image {
      aspect-ratio: 1/1;
      width: 100%;
      height: auto;
    }
    .hot-corner {
      position: absolute;
      height: 25rpx;
      aspect-ratio: 22/13;
      width: auto;
      top: -10rpx;
      right: -30rpx;
    }
  }
  .hot-name {
    font-size: 25rpx;
    color: #333333;
    text-align: center;
  }
}
</style>