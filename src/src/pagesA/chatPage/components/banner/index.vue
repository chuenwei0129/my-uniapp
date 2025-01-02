<template>
  <view style="width: 100%; height: 100%">
    <swiper
      class="swiper-box"
      autoplay
      indicator-dots
      indicator-color="rgba(255, 255, 255, 0.40)"
      indicator-active-color="rgba(255, 255, 255, 1)"
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
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { action_report } from "@/utils/track";
import { adRouteGo } from "@/utils";
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
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
