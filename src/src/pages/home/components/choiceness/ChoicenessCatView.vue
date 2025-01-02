<script>
export default {
  name: "ChoicenessCatView",
  props: {
    cat: {},
    index: 0,
  },
  emits: ["onClick"],
  computed: {
    catName() {
      const name = this.cat.name;
      return name.length > 4 ? name.substring(0, 4) : name;
    },
    catBg() {
      const bgList = [
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/choiceness_cat_1.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/choiceness_cat_2.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/choiceness_cat_3.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/choiceness_cat_4.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/choiceness_cat_all.png",
      ];
      if (this.cat.id === 0) {
        return bgList[4];
      }
      return bgList[this.index % 5];
    },
  },
};
</script>

<template>
  <view class="choiceness-cat-view-wrapper" @click="this.$emit('onClick')">
    <view class="cat-image-container">
      <image class="cat-bg" :src="catBg" />
      <image class="cat-image" :src="cat.picture" />
      <image class="cat-corner" v-if="!!cat.cornerIcon" :src="cat.cornerIcon" />
    </view>
    <text class="cat-name">{{ catName }}</text>
  </view>
</template>

<style scoped lang="scss">
.choiceness-cat-view-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .cat-image-container {
    position: relative;
    aspect-ratio: 1/1;
    width: calc(100% - 4rpx);
    display: flex;
    align-items: flex-end;
    .cat-bg {
      width: 100%;
      height: auto;
      aspect-ratio: 50/39;
    }
    .cat-image {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .cat-corner {
      position: absolute;
      height: 25rpx;
      aspect-ratio: 22/13;
      width: auto;
      top: -10rpx;
      right: -30rpx;
    }
  }
  .cat-name {
    color: #333333;
    font-size: 25rpx;
    text-align: center;
  }
}
</style>
