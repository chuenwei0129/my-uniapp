<!-- LongImage.vue -->
<template>
  <view class="long-image-container">
    <scroll-view class="scroll-view" scroll-y="true">
      <image
        v-for="(item, index) in imgList"
        :key="index"
        :src="item.imgSrc"
        mode="widthFix"
        @click="jumpFlowPage"
      />
    </scroll-view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      imgList: [
        {
          imgSrc:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/Secret1.png",
        },
        {
          imgSrc:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/Secret2.png",
        },
        {
          imgSrc:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/Secret3.png",
        },
        {
          imgSrc:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/Secret4.png",
        },
      ],
    };
  },
  methods: {
    jumpFlowPage() {
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=1`,
      });
    },
  },
};
</script>

<style scoped>
.long-image-container {
  width: 750rpx;
  overflow: hidden;
}

.scroll-view {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
}

image {
  width: 100%;
}
</style>
