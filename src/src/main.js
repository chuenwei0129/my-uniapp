import Vue from "vue";
import App from "./App";
import store from "./store";
import uView from "uview-ui";

// #ifdef H5

import dsBridge from "dsbridge";

import VConsole from "vconsole";
import PinganPlugin from "./static/js/pingan.umd";

// 或者使用配置参数来初始化，详情见文档
const vConsole =
  process.env.NODE_ENV?.includes("development") ||
  process.env.NODE_ENV?.includes("test") ||
  process.env.NODE_ENV?.includes("pre")
    ? new VConsole({ theme: "dark" })
    : "";
// const vConsole = new VConsole({ theme: "dark" })
// #endif

Vue.use(uView);
Vue.prototype.$store = store;
// Vue.prototype.$switchTab = switchTab;
Vue.config.productionTip = false;
// #ifdef H5
Vue.prototype.$dsBridge = dsBridge;
Vue.prototype.$pinganPlugin = PinganPlugin;

// #endif

// 测试环境:63fc6e76ba6a5259c40c4b2c
// 生产环境:63fc6e12d64e686139394634
const appKey = process.env.NODE_ENV?.includes("development")
  ? "63fc6e76ba6a5259c40c4b2c"
  : "63fc6e12d64e686139394634";
// #ifdef MP-WEIXIN
// import uma from "umtrack-wx";
// uma.init({
//   appKey: appKey,
//   useOpenid: false,
//   autoGetOpenid: false,
//   debug: true,
// });
// uma.setUserid(uni.getStorageSync("userId"));
// Vue.prototype.$uma = uma;
import share from "./utils/wxShareMixin.js";
Vue.mixin(share);
// #endif
// #ifdef MP-ALIPAY
// import uma from "umtrack-alipay";
// uma.init({
//   appKey: appKey,
//   debug: false,
// });
// uma.setUserid(uni.getStorageSync("userId"));
// Vue.prototype.$uma = uma;
// #endif

App.mpType = "app";

const app = new Vue({
  store,
  ...App,
});

app.$mount();
