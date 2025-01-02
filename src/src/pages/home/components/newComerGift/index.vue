<script>
import { mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
import { adRouteGo } from "@/utils";

export default {
  name: "newComerGift",
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
    routeData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  mounted() {
    display_report({
      display_name: "home_banner_newcomers_display",
    });
  },
  methods: {
    handelBannerClick() {
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      if (this.routeUrl.length) {
        uni.navigateTo({
          url: this.routeUrl,
        });
      }
    },
    handleGoTo() {
      action_report({
        action_name: "home_banner_newcomers_click",
      });
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      const { route: path, routeType: route } = this.routeData;
      switch (route) {
        case "NATIVE":
          return uni.navigateTo({
            url: path,
          });
        case "APPLET":
          let appId = JSON.parse(path).menu;
          let pathReal = JSON.parse(path).function;
          const systemInfo = uni.getAccountInfoSync();
          if (systemInfo.miniProgram.appId == appId) {
            return uni.navigateTo({
              url: pathReal,
            });
          } else {
            return uni.navigateToMiniProgram({
              appId,
              path: pathReal,
              success(res) {
                // 打开成功
              },
            });
          }
        case "URL":
          if (path.indexOf("http") !== -1) {
            let newRoute = "";
            if (path.indexOf("h5/shareActivity/?random=123#")) {
              newRoute = path.replace("h5/shareActivity/?random=123#", "#");
            } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
              newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
            } else if (path.indexOf("h5/shareActivity/?random=123")) {
              newRoute = path.replace("h5/shareActivity/?random=123/", "");
            }
            let str = `/pagesA/webView/index?route=${encodeURIComponent(
              newRoute
            )}&type=icon`;
            return uni.navigateTo({
              url: str,
            });
          } else {
            return uni.navigateTo({
              url: path,
            });
          }
      }
    },
  },
};
</script>

<template>
  <view class="view-wrapper">
    <view class="new-comer-gift">
      <image
        class="img"
        mode="widthFix"
        :src="imgUrl"
        @tap="$u.throttle(handleGoTo, 500)"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
