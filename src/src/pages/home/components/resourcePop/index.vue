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
      <view class="wrapper-pop">
        <view class="top-view">
          <image
            class="img"
            mode="aspectFit"
            :src="info[0].content.material.url"
            @tap="$u.throttle(handleGoTo(info[0].content), 500)"
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
import { adRouteGo } from "@/utils/index";
import { action_report, display_report } from "@/utils/track";
export default {
  name: "resourcePop",
  data() {
    return {};
  },
  props: {
    info: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    open() {},
    handleGoTo(val) {
      action_report({
        action_name: "newhome_popup_click",
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
      console.log("route", route);
      if (route) {
        adRouteGo(route);
      }
    },
    close() {
      this.$emit("update:show", false);
    },
  },
  mounted() {
    if (this.info.length) {
      display_report({
        display_name: "newhome_popup_show",
        object_type: "home",
        extend: {
          ad_name: this.info[0].content.title,
          ad_id: this.info[0].content.id,
        },
      });
    }
  },
};
</script>

<style scoped lang="scss">
.wrapper-pop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .top-view {
    .img {
      width: 597rpx;
      height: 720rpx;
      vertical-align: bottom;
    }
  }
  .bottom-view {
    .img {
      width: 62rpx;
      height: 62rpx;
      vertical-align: bottom;
    }
  }
}
</style>
