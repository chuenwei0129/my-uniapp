<template>
  <div>
    <swiper
      class="uni-swiper-wrapper"
      :autoplay="true"
      :circular="true"
      :indicator-dots="true"
      :indicator-position="center"
      :interval="3000"
      :duration="500"
      indicator-color="rgba(255, 255, 255, .4)"
      indicator-active-color="rgba(255, 255, 255, 1.0)"
    >
      <swiper-item v-for="(item, index) in info" :key="index">
        <img
          class="banner-img"
          :src="item.content.material.url"
          @click="setRouter(item)"
        />
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { adRouteGo } from "@/utils";

export default {
  props: {
    info: {
      type: Object | null,
    },
  },

  methods: {
    setRouter(item) {
      adRouteGo(item.content.route);
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.uni-swiper-wrapper {
  width: 342rpx;
  height: 385rpx;
  // margin: 27rpx 38rpx 31rpx 31rpx;
  border-radius: 19rpx;
  overflow: hidden;
  transform: translateY(0);

  :deep(.uni-swiper-dots) {
    bottom: 15rpx;
  }
}

// .swiper {
//   width: 342rpx;
//   height: 385rpx;
// }

.swiper-item {
  display: block;
  text-align: center;
}

.banner-img {
  width: 342rpx;
  height: 385rpx;
  border-radius: 19rpx;
}
</style>
