<template>
  <view class="warp">
    <web-view
      :src="shareUrl"
      :webview-styles="{ backgroundColor: '#ffffff' }"
      @message="getMessage"
    ></web-view>
  </view>
</template>

<script>
import { mapState } from "vuex";
const h5Domain = {
  dev: "https://cn-dev02-shareactivity.chongpangpang.com/#",
  jumpdev: "https://cn-dev02-shareactivity.chongpangpang.com",
  // dev: "http://172.16.200.41:3000/#",
  pro: "https://shareactivity.chongpangpang.com/#",
  jumppro: "https://shareactivity.chongpangpang.com",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/#",
  jumppre: "https://cn-test01-shareactivity.chongpangpang.com",
};

export default {
  data() {
    return {
      shareUrl: "",
      title: "",
      type: 1,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  onLoad(option) {
    //用于登陆完成返回原页面 last_route_params
    uni.removeStorageSync("last_route_params");
    const { route, type = "", title = "", needLogin } = option;
    console.log(title);
    const last_route_params = `?route=${route}&type=${type}&title=${title}&needLogin=${needLogin}`;
    uni.setStorageSync("last_route_params", last_route_params);
    console.log("option", option);
    if (needLogin && !this.userInfo.token) {
      //未登录,重定向到登录页面
      uni.navigateTo({
        url: "/pagesD/login/index",
      });
      return;
    }
    this.handleWebUrl(route, type);
    console.log("webview 地址", this.shareUrl);
    if (title) {
      uni.setNavigationBarTitle({
        title: title,
      });
    }
  },
  methods: {
    back() {
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },
    // 处理拼接url
    handleWebUrl(route, jumpType) {
      const env =
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
          ? "dev"
          : process.env.NODE_ENV === "pre"
          ? "pre"
          : "pro";

      if (jumpType && jumpType === "jump") {
        const jumpEnv =
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "test"
            ? "jumpdev"
            : process.env.NODE_ENV === "pre"
            ? "jumppre"
            : "jumppro";

        this.shareUrl = decodeURIComponent(h5Domain[jumpEnv] + route);
        return;
      }
      let from = "";

      // #ifdef MP-WEIXIN
      from = "mpWeixin";
      // #endif

      // #ifdef MP-ALIPAY
      from = "mpAlipay";
      // #endif

      let params = "";
      if (jumpType === "icon") {
        route = decodeURIComponent(route);
      }
      if (route.indexOf("lowcode") > -1) {
        route = decodeURIComponent(route);
      }
      if (route.indexOf("?") > -1) {
        params =
          route +
          `&originFrom=${from}&userId=${
            uni.getStorageSync("storage_info").userId
          }`;
      } else {
        params =
          route +
          `?originFrom=${from}&userId=${
            uni.getStorageSync("storage_info").userId
          }`;
      }
      // 是养狗政策的话
      if (route.indexOf("/petpolicy") > -1 || route === "/petMap") {
        let cityName = uni.getStorageSync("city");
        let cityCode = uni.getStorageSync("cityCode");
        //目前沟通的先写死杭州，用户自己切换城市，保证能先进入h5页面不报错
        // if (!cityName || !cityCode) {
        cityName = "杭州市";
        cityCode = "330100";
        // }
        params += `&cityCode=${cityCode}&cityName=${cityName}&lat=${uni.getStorageSync(
          "lat"
        )}&lon=${uni.getStorageSync("lon")}`;
      }
      //是物流详情
      if (route.indexOf("/buyerLogistics") !== -1) {
        params += `&token=${uni.getStorageSync("storage_info").token}`;
      }
      //低代码页面
      if (route.indexOf("/lowcode") !== -1) {
        params += `&token=${uni.getStorageSync("storage_info").token || ""}`;
      }
      //预约详情
      if (route.indexOf("/livingBody/reservationDetail") !== -1) {
        params += `&token=${uni.getStorageSync("storage_info").token || ""}`;
      }
      // 胖豆商城
      if (route.indexOf("/integral/index") !== -1) {
        params += `&token=${uni.getStorageSync("storage_info").token || ""}`;
      }
      if (jumpType == "icon") {
        this.shareUrl = decodeURIComponent(params);
      } else if (route.indexOf("/lowcode") !== -1) {
        //低代码页面
        this.shareUrl = decodeURIComponent(params);
      } else {
        this.shareUrl = decodeURIComponent(h5Domain[env] + params);
      }
    },
    getMessage(e) {
      console.log("触发title=>>>>>>>>>>", e);
      if (e?.detail?.data[e?.detail?.data - 1]?.title) {
        this.title = e.detail.data[0].title;
      }
      //{"type": "message", "target": {"dataset": {"eventOpts": [["message", [["getMessage", ["$event"]]]]]}, "id": "", "offsetTop": 11, "offsetLeft": 11, "data": [{"type": "signdone", "result": "success"}]}, "currentTarget": {"dataset": "<Circular: @.target.dataset>", "id": "", "offsetTop": 11, "offsetLeft": 11}, "timeStamp": 84502, "detail": {"data": "<Circular: @.target.data>"}, "mp": {"type": "message", "target": {"dataset": {"eventOpts": [["message", [["getMessage", ["$event"]]]]]}, "id": "", "offsetTop": 11, "offsetLeft": 11}, "currentTarget": {"dataset": {"eventOpts": [["message", [["getMessage", ["$event"]]]]]}, "id": "", "offsetTop": 11, "offsetLeft": 11}, "timeStamp": 84502, "detail": {"data": [{"type": "signdone", "result": "success"}]}}, "stopPropagation": "<Function: k>", "preventDefault": "<Function: k>"}
      // this.$store.dispatch("getSignStatus");
      uni.$emit("getSignStatus");
    },
  },
};
</script>

<style scoped>
.warp {
  padding: 20rpx;
  line-height: 36rpx;
  background-color: #fff !important;
}

span {
  margin-top: 20rpx;
  display: block;
}
</style>
