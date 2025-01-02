<template>
  <view style="width: 100%; height: 100%" class="customer-banner-wrap">
    <swiper
      class="swiper-box swiper"
      autoplay
      indicator-color="rgba(255, 255, 255, 0.40)"
      indicator-active-color="rgba(255, 255, 255, 1)"
      @change="handleAdChanged"
    >
      <!-- TODO 需要观察一下小程序轮播图是否有问题 -->
      <swiper-item v-for="(item, index) in bannerList" :key="index">
        <image
          :src="item.content.material.url"
          mode="scaleToFill"
          @click="
            () => {
              handleGoTo(item.content.route, index);
            }
          "
        />
      </swiper-item>
    </swiper>
    <!-- 面板指示点 -->
    <view v-if="bannerList.length > 1" class="ad-indicator">
      <view class="ad-indicator-wrapper">
        <view
          v-for="ad in bannerList"
          :class="[
            'indicator-item',
            bannerList[currentAdIndex].id === ad.id
              ? 'indicator-item-selected'
              : '',
          ]"
          :key="ad.id"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { action_report } from "@/utils/track";
import { adRouteGo } from "@/utils/index";
const module_name = "medical";
export default {
  props: {
    bannerList: {
      type: Array,
    },
  },
  computed: {},
  data() {
    return {
      current: 0,
      currentAdIndex: 0
    };
  },
  mounted() {},
  methods: {
    handleGoTo(route, index) {
      action_report({
        action_name: "consultation_main_banner_clk",
        module_name: module_name,
        extend: {
          position: 1 + index,
        },
      });
      adRouteGo(route);
    },
    handleAdChanged(e) {
      const { current } = e.detail;
      this.currentAdIndex = current;
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
