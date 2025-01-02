<script>
import { mapState } from "vuex";
import { action_report } from "@/utils/track";

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
  methods: {
    handleGoTo() {
      action_report({
        action_name: "home_pop_newcomers_click",
      });
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        this.$emit("update:show", false);
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
            if (path) {
              return uni.navigateTo({
                url: path,
              });
            }
          }
      }
    },
    open() {},
    close() {
      this.$emit("update:show", false);
      action_report({
        action_name: "home_pop_newcomers_close_click",
      });
      // this.$emit("close", false);
    },
  },
};
</script>

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
      <view class="view-wrapper">
        <view class="top-view">
          <image
            class="img"
            mode="aspectFit"
            :src="imgUrl"
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

<style scoped lang="scss">
@import "./index.scss";
</style>
