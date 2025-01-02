<template>
  <view
    v-if="show"
    class="ad-container"
    :style="{ transform: `translate3d(${right}, 0, 0)`, opacity }"
  >
    <!-- 内容 -->
    <view class="ad-content">
      <image
        mode="aspectFit"
        :src="info[0].content.material.url"
        @tap="$u.throttle(handleGoTo(info[0].content), 500)"
      />
    </view>
    <!-- 关闭按钮 -->
    <view class="close-btn" @click="handleCloseTap">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/close_btn.png"
      />
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { adRouteGo } from "@/utils/index";
import { action_report, display_report } from "@/utils/track";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      right: 0,
      opacity: 1,
      timer: null,
    };
  },
  mounted() {
    if (this.info.length) {
      display_report({
        display_name: "newhome_xuanfu_show",
        object_type: "home",
        extend: {
          ad_name: this.info[0].content.title,
          ad_id: this.info[0].content.id,
        },
      });
    }
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  destroyed() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    handleCloseTap() {
      this.$emit("update:show", false);
    },

    updatePosition() {
      clearTimeout(this.timer);
      this.right = "70rpx";
      this.opacity = 0.5;
      this.timer = setTimeout(() => {
        this.animateBack();
      }, 500);
    },

    handleGoTo(val) {
      action_report({
        action_name: "newhome_xuanfu_click",
        module_name: "home",
        extend: {
          ad_name: val.title,
          ad_id: val.id,
        },
      });
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        this.$emit("update:show", false);
        return;
      }
      let route = this.info[0].content.route;
      console.log("悬浮广告route", route);
      if (route) {
        adRouteGo(route);
      }
    },

    animateBack() {
      this.right = 0;
      this.opacity = 1;
    },
  },
};
</script>

<style scoped lang="scss">
.ad-container {
  position: fixed;
  bottom: 346rpx;
  width: 115rpx;
  height: 115rpx;
  right: 17rpx;
  transform: translate3d(0, 0, 0);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  z-index: 999;
  image {
    width: 115rpx;
    height: 115rpx;
  }
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 30rpx;
  height: 30rpx;
  image {
    width: 30rpx;
    height: 30rpx;
  }
}
</style>
