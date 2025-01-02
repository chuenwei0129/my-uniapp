<template>
  <view class="tools-list">
    <nav-bar
      title="养宠工具"
      navColor="#F3F3F4"
      titleColor="#333333"
      showBackBtn
      :customback="true"
      @navBackClickHandle="backHandle"
    />
    <view class="texttip" v-if="tipShow"
      >更多养宠工具，可在APP内查看<view class="close" @click="closeTip"></view
    ></view>
    <scroll-view
      scroll-y
      v-if="toolsList.length"
      :style="{ height: `calc(100vh - ${h5Height})` }"
    >
      <view class="list-wrap">
        <view
          class="tool-item"
          v-for="(item, index) in toolsList"
          :key="index"
          @click="goTool(item)"
        >
          <image :src="item.icon" mode="aspectFill"></image>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import NavBar from "@/components/navBar/index.vue";
import { getToolsLis } from "@/api/tool.js";
import { action_report } from "@/utils/track";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      toolsList: [],
      // h5Height: this.isNative
      //   ? getApp().globalData.h5NavBarFullHeight + "px"
      //   : getApp().globalData.navBarHeight + "px",
      tipShow: false,
    };
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
    h5Height() {
      return this.isNative
        ? getApp().globalData.h5NavBarFullHeight + "px"
        : getApp().globalData.navBarHeight + "px";
    },
  },
  watch: {
    isNative: {
      immediate: true,
      handler(newValue, oldValue) {
        this.tipShow = newValue ? false : true;
      },
    },
  },
  methods: {
    closeTip() {
      this.tipShow = false;
    },
    backHandle() {
      // #ifdef H5
      if (this.isNative) {
        this.$dsBridge.call("closeCurrentWebview", {});
      } else {
        // router.go(-1);
      }
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
    },
    goNativeUrl(url) {
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: url,
      });
      //#endif
    },
    goNormalUrl(route) {
      // window.location.href = url;
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: route,
      });
      //#endif
      // #ifdef MP-WEIXIN
      let newRoute = "";
      if (route.indexOf("h5/shareActivity/?random=123#")) {
        newRoute = route.replace("h5/shareActivity/?random=123#", "#");
      } else if (route.indexOf("h5/shareActivity/?random=123/#/")) {
        newRoute = route.replace("h5/shareActivity/?random=123/#/", "#");
      } else if (route.indexOf("h5/shareActivity/?random=123")) {
        newRoute = route.replace("h5/shareActivity/?random=123/", "");
      }
      console.log("newRoute:  ", newRoute);

      let str = `/pagesA/webView/index?route=${encodeURIComponent(
        newRoute
      )}&type=icon`;
      uni.navigateTo({
        url: str,
      });
      //#endif
    },
    goTool(item) {
      action_report({
        action_name: "pettools_tools_click",
        module_name: "explore",
        extend: {
          tools_name: item.title,
          //#ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          //#endif
        },
      });
      if (!this.isNative) {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=4`,
        });
        return;
      }
      if (item.jumpType == 1) {
        this.goNormalUrl(item.url);
      } else {
        //原生
        this.goNativeUrl(item.url);
      }
    },
  },
  async onShow() {
    const _params = { petCategory: null };
    const res = await getToolsLis(_params);
    this.toolsList = res.data.data;
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
