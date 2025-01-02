<template>
  <view>
    <u-popup
      :show="show"
      :round="10"
      mode="center"
      @close="close"
      @open="open"
      bg-color="transparent"
      :overlay="true"
      :closeOnClickOverlay="false"
    >
      <view class="pop-view-wrapper">
        <view class="top-view">
          <image
            class="img"
            mode="aspectFit"
            :src="info[0].content.material.url"
            @tap="$u.throttle(handleGoTo, 500)"
          />
        </view>
        <view class="bottom-view">
          <image
            @click="close"
            class="img"
            mode="aspectFit"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/close_new_person_activity_btn.png"
          />
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import { mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
import { adRouteGo } from "@/utils/index";
export default {
  name: "newComerGiftPopView",
  data() {
    return {};
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    info: {
      type: [Object, Array],
      default: {},
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    handleGoTo() {
      action_report({
        action_name: "shop_ad_popup_click",
        module_name: "shop",
      });
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        this.$emit("update:show", false);
        return;
      }
      let route = this.info[0].content.route;
      console.log("route", route);
      if (route) {
        adRouteGo(route);
      }
    },
    open() {},
    close() {
      this.$emit("update:show", false);
      // this.$emit("close", false);
    },
  },
  mounted() {
    display_report({
      display_name: "shop_ad_popup_show",
      object_type: "shop",
    });
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
