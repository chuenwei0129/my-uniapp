<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
// import {
//   init as RYinit,
//   Events as RYEvents,
//   addEventListener as RYaddEventListener,
//   removeEventListener as RYremoveEventListener,
// } from "@rongcloud/imlib-next";

import { mapState, mapMutations } from "vuex";
// import {
//   RyConnect,
//   handleMessages,
//   getLastMes,
//   _getSheetsServerList,
// } from "@/utils/ryConnect";
import { enter_page, action_report, display_report } from "@/utils/track";
import { compareVersion, getBrowserInfo } from "@/utils";
import { wxShareMethod } from "@/utils/wxShare";
import { getSchemaByCode } from "@/api/index";
import { SEND_FEED_ORDER } from "@/api/feederPayment";
import { getUserInfo } from "@/api/base/index";

export default {
  // #ifdef MP-WEIXIN
  ...wxShareMethod(),
  // #endif
  globalData: {
    statusBarHeight: 0, // 状态导航栏高度
    navHeight: 0, // 总体高度
    navBarHeight: 0, // 导航栏高度(标题栏高度)
    h5NavBarFullHeight: 0, //H5 App导航栏高度(包含状态栏)
    h5NavBarHeight: 0, //H5 App导航栏高度(不包含状态栏)
    h5StatusBarHeight: 0, //H5 App状态栏高度
    windowWidth: 0, // 可使用窗口字宽度
    windowHeight: 0, // 可使用窗口高度
    menuButtonLeft: 0, //胶囊按钮X轴坐标
    MenuButtonPadding: 0, //胶囊按钮左右间距
    menuButtonWidth: 0, //胶囊按钮宽度(包含了左右间距)
    bottomSafeAreaHeight: 0, //底部安全距离
    h5BottomSafeAreaHeight: 0, //APP底部安全距离
    startTime: "",
  },
  computed: {
    ...mapState({
      ryConnectStatus: (state) => state.ryConnectStatus,
      userInfo: (state) => state.userInfo,
      isChooseImage: (state) => state.isChooseImage,
      serviceSheetsList: (state) => state.serviceSheetsList,
    }),
  },
  onLaunch: async function (option) {
    console.log("App Launch", option);
    uni.removeStorageSync("enter_page_last_id");
    uni.removeStorageSync("enter_page_last_page_id");
    uni.removeStorageSync("action_last_id");
    uni.removeStorageSync("action_last_page_id");
    uni.removeStorageSync("display_last_id");
    uni.removeStorageSync("enter_page_extend_info");
    let env = getBrowserInfo();
    uni.setStorageSync("browserEnv", env);
    console.log("🚀 ~ onShow ~ env:", env);
    /**
     * 获取进入小程序 scheme链接参数
     */
    if (option.query && option.query.channel) {
      console.log("App Launch - option.query.channel", option.query.channel);
      this.$store.commit("setChannel", option.query.channel);
    }
    if (option.query && option.query.mendian8) {
      const storeID = option.query.mendian8 + option.query.mendian5;
      console.log("App Launch - option.query.storeID", storeID);
      this.$store.commit("setStoreID", storeID);
    }

    // 状态栏高度
    this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.globalData.windowHeight = uni.getSystemInfoSync().windowHeight;
    this.globalData.windowWidth = uni.getSystemInfoSync().windowWidth;
    this.globalData.bottomSafeAreaHeight =
      uni.getSystemInfoSync().safeAreaInsets.bottom;
    // #ifdef MP-WEIXIN
    // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
    const custom = wx.getMenuButtonBoundingClientRect();
    this.globalData.menuButtonLeft = custom.left;
    this.globalData.menuButtonPadding =
      this.globalData.windowWidth - custom.right;
    this.globalData.menuButtonWidth =
      custom.width + this.globalData.menuButtonPadding * 2;

    console.log(
      "custom-----------",
      custom,
      this.globalData.menuButtonWidth,
      this.globalData.windowWidth
    );

    // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
    this.globalData.navBarHeight =
      custom.height + (custom.top - this.globalData.statusBarHeight) * 2;
    // console.log("导航栏高度："+this.globalData.navigationBarHeight)

    // 总体高度 = 状态栏高度 + 导航栏高度
    this.globalData.navHeight =
      this.globalData.navBarHeight + this.globalData.statusBarHeight;
    // uni.showModal({
    //   content: `${JSON.stringify(option)}`,
    //   success: (res) => {},
    // });
    if (option.query.umt_code) {
      //微信渠道码
      console.log("umt_code", option);
      getSchemaByCode({
        code: option.query.umt_code,
      })
        .then((res) => {
          let promotionUrlParam = res.data.data.promotionUrlParam;
          let objA = {};
          console.log("🚀 ~ res:", res, promotionUrlParam);
          promotionUrlParam.split("&").forEach((i) => {
            objA[i.split("=")[0]] = i.split("=")[1];
          });
          console.log("🚀 ~ objA:", {
            ...objA,
            umt_landing_page_id: option.path,
          });
          uni.setStorageSync(
            "umt_extend",
            Object.assign(objA, { umt_landing_page_id: option.path })
          );
          this.globalData.startTime = Date.now();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    wx.onAppRoute((route) => {
      console.log("route对象 ", route);
      uni.removeStorageSync("enter_page_extend_info");
      const {
        userId: user_id,
        sex,
        userType: user_type,
      } = uni.getStorageSync("storage_info") || {};
      enter_page({
        user_id,
        sex,
        user_type,
        page_id: route.path,
        last_page_id: uni.getStorageSync("enter_page_last_page_id") || "",
        last_id: uni.getStorageSync("enter_page_last_id") || "",
      });
    });
    // #endif
    console.log("this.globalData-------------", this.globalData);

    let appkey =
      process.env.NODE_ENV === "production" ? "6tnym1br6ffr7" : "c9kqb3rdc22dj";

    // // 融云初始化
    // // RongIMLib.init({ appkey });
    // RYinit({ appkey });
    // // 融云添加事件监听
    // // const Events = RongIMLib.Events;
    // const Events = RYEvents;
    // /**
    //  * 正在链接的事件状态
    //  */
    // RYaddEventListener(Events.CONNECTING, function () {
    //   console.log("正在链接服务器");
    // });
    //
    // /**
    //  * 链接到服务器会触发这个事件
    //  */
    // RYaddEventListener(Events.CONNECTED, () => {
    //   console.log("连接成功app");
    //   this.setRyConnectStatus(true);
    //   if (this.serviceSheetsList.length > 0) {
    //     getLastMes(this.serviceSheetsList[0].groupId);
    //   }
    // });
    // /**
    // //  * 手动调用 disconnect 方法或者用户被踢下线 会触发这个事件
    //  */
    //
    // RYaddEventListener(Events.DISCONNECT, () => {
    //   console.log("连接中断，需要业务层进行重连处理");
    //   this.setRyConnectStatus(false);
    //
    //   // #ifdef MP-WEIXIN
    //   // 中断跳转到融云连接页面
    //   uni.navigateTo({
    //     url: "/pagesA/ryConnect/index",
    //   });
    //   // #endif
    // });
    //
    // /**
    //  * 链接出问题时，内部进行重新链接，会触发这个事件
    //  */
    // RYaddEventListener(Events.SUSPEND, (code) => {
    //   console.log("链接中断，SDK 会尝试重连，业务层无需关心");
    //   // 5.1.2 版本开始，事件回调中会引起中断的 code 状态码
    //   console.log(`code -> ${code}`);
    // });

    //获取设备信息
    uni.getSystemInfoSync({
      success: function (res) {
        uni.setStorageSync("systemInfo", res);
      },
    });
    // #ifdef MP-WEIXIN
    // 隐私协议版本兼容检测
    const version = wx.getAppBaseInfo().SDKVersion;

    if (compareVersion(version, "2.32.3") >= 0) {
      // wx.openBluetoothAdapter();
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
    // #endif
  },
  onShow: async function (option) {
    let dataSource = option.query?.source || "";

    //#ifdef H5
    let user_info = {};
    if (dataSource && dataSource == 30) {
    } else {
      user_info = JSON.parse(
        this.$dsBridge.call("getUserInfo", "getUserInfo") | {}
      );
    }

    try {
      user_info;
    } catch (error) {
      console.log(error, "原生获取用户信息json转码失败");
    }
    if (!process.env.NODE_ENV?.includes("local")) {
      if (this.$dsBridge.call("getToken", "getToken")) {
        uni.setStorageSync("storage_info", {
          userInfo: user_info || {},
          token: this.$dsBridge.call("getToken", "getToken"),
          userId: this.$dsBridge.call("getUserId", "getUserId"),
        });
      }
      //假数据注释掉
      //  else {
      //   if (dataSource && dataSource == 30) {
      //   } else {
      //     const params = {
      //     age: null,
      //     appId: "wx49133dd26d6fc20b",
      //     avatarUrl: "https://image.henhenchina.com/account_10.png",
      //     city: null,
      //     isDoctorManage: false,
      //     isInquiryDoctor: false,
      //     isNewUser: false,
      //     isOfficial: null,
      //     levelIndex: 1,
      //     memberId: "370327755138179072",
      //     nickName: "宠友VFk8T4",
      //     oldUserId: "370327755138179072",
      //     openId: "ogGoH438js_eLSNjStRuzvEC2E6o",
      //     phone: "18590336302",
      //     ryId: "f8i+Z3Vq/ZRo/1JGK3YeEoJAjPjBHJM5yqhPlDD7al7ZRs5o1P+bdwlAdOMB0xTBqfjOnPsIZfU=@37xa.cn.rongnav.com;37xa.cn.rongcfg.com",
      //     ryUid: "meow_1720495814353_18590336302",
      //     sex: 0,
      //     showUserId: "9999973108",
      //     // token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJDUFAtSldUIiwib2xkVXNlcklkIjoiNDI3Mjc5ODg5MjcwMzU4MDE2IiwiaXNzIjoibWVvdy1rOHMtY24tZGV2MDIiLCJleHAiOjE3MzUyODc0NjEsImlhdCI6MTczMzQ3MzA2MSwidXNlcklkIjoiNDI3Mjc5ODg5MjcwMzU4MDE2IiwianRpIjoiNjc1MmIzMjU1OTkwN2MwMDAxYWUyMmFkIiwibWVtYmVySWQiOiI0MjcyNzk4ODkyNzAzNTgwMTYifQ.ic_jG4ctUfk2dLrZ6Lun4tDzGLDlGBQAkgik35MVdotrXCcAY1fj991MNuhUfjahQo6uVvtcvEMU3t5Z1VNC0A",
      //     // token:
      //     //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJDUFAtSldUIiwib2xkVXNlcklkIjoiMzcwMzI3NzU1MTM4MTc5MDcyIiwiaXNzIjoibWVvdy1rOHMtY24tZGV2MDEiLCJleHAiOjE3MjY2MjgzMDUsImlhdCI6MTcyNDgxMzkwNSwidXNlcklkIjoiMzcwMzI3NzU1MTM4MTc5MDcyIiwianRpIjoiNjZjZTkyNTE0MmMwMTgwMDAxYmJkNzY1IiwibWVtYmVySWQiOiIzNzAzMjc3NTUxMzgxNzkwNzIifQ.3kHIhTUCnDBLa6Giz0ADocFn-zc4Ayq15ukiqoXchp9Bg20OWGhRKDilQRFxmT5gfYWc4Ndo069JQCRfh0tSlw",
      //     unionId: "oTcb46VA8CEnd9xM9xQowZq7Smpc",
      //     userAvatarDecoration: null,
      //     // userId: "370327755138179072",
      //   };
      //   uni.setStorageSync("storage_info", params);
      //   }
      // }
      if (this.$dsBridge.call("getNavBarHeight", "getNavBarHeight")) {
        this.globalData.h5NavBarFullHeight = this.$dsBridge.call(
          "getNavBarHeight",
          "getNavBarHeight"
        );
      } else {
        this.globalData.h5NavBarFullHeight = "88";
      }
      if (this.$dsBridge.call("getStatusBarHeight", "getStatusBarHeight")) {
        this.globalData.h5StatusBarHeight = this.$dsBridge.call(
          "getStatusBarHeight",
          "getStatusBarHeight"
        );
      } else {
        this.globalData.h5StatusBarHeight = "44";
      }
      if (
        this.$dsBridge.call(
          "getBottomSafeAreaHeight",
          "getBottomSafeAreaHeight"
        )
      ) {
        this.globalData.h5BottomSafeAreaHeight = this.$dsBridge.call(
          "getBottomSafeAreaHeight",
          "getBottomSafeAreaHeight"
        );
      } else {
        this.globalData.h5BottomSafeAreaHeight = "16";
      }
      if (this.$dsBridge.call("getAppInfo", "version")) {
        this.globalData.appVersion = this.$dsBridge.call(
          "getAppInfo",
          "version"
        );
      } else {
        this.globalData.appVersion = "0.0.0";
      }
    } else {
      // uni.setStorageSync("storage_info", {
      //   token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJDUFAtSldUIiwib2xkVXNlcklkIjoiNDI3Mjc5ODg5MjcwMzU4MDE2IiwiaXNzIjoibWVvdy1rOHMtY24tZGV2MDIiLCJleHAiOjE3MzUyODc0NjEsImlhdCI6MTczMzQ3MzA2MSwidXNlcklkIjoiNDI3Mjc5ODg5MjcwMzU4MDE2IiwianRpIjoiNjc1MmIzMjU1OTkwN2MwMDAxYWUyMmFkIiwibWVtYmVySWQiOiI0MjcyNzk4ODkyNzAzNTgwMTYifQ.ic_jG4ctUfk2dLrZ6Lun4tDzGLDlGBQAkgik35MVdotrXCcAY1fj991MNuhUfjahQo6uVvtcvEMU3t5Z1VNC0A',
      //             openId: "ogGoH4yQB8bk99h0bPB2CmvhjpLs",
      //     userId: "300090098099134464",
      //     isNewUser: false,
      //     phone: "13003636137",
      //     appId: "wx49133dd26d6fc20b",
      //     unionId: "oTcb46S0o6nCXUjT99FOqhnMcUzo",
      //     avatarUrl: "https://image.henhenchina.com/account_21.png",
      //     nickName: "宠友cdnrAA",
      //     memberId: "300090098099134464",
      //     showUserId: "9999972342",
      //     oldUserId: "300090098099134464",
      //     city: '12344444',
      //     age: null,
      //     ryId: "f8i+Z3Vq/ZT1b0gjQSThUMHz17Inv6sv/+ygg9KvpBrVZ5Yu+jDMPDau6fUgC60pLhyWbnqX7+g=@37xa.cn.rongnav.com;37xa.cn.rongcfg.com",
      //     ryUid: "meow_1703145670856_13003636137",
      //     sex: 2,
      //     isOfficial: null,
      //     userAvatarDecoration: null,
      // });
      this.globalData.h5NavBarFullHeight = "88";
      this.globalData.h5StatusBarHeight = "44";
      this.globalData.h5BottomSafeAreaHeight = "16";
    }
    this.globalData.h5NavBarHeight =
      this.globalData.h5NavBarFullHeight - this.globalData.h5StatusBarHeight;

    if (dataSource && dataSource == 30) {
    } else {
      const data = await getUserInfo(true);
      const userInfo = {
        ...this.userInfo,
        ...data,
      };
      this.setUserInfo(userInfo);
      console.log("getUserInfo接口", { data });
    }

    //#endif
    console.log("App Show", option);
    //企微分享进入流程
    // #ifdef MP-WEIXIN
    if (option.query.aientry) {
      uni.setStorageSync("aientry", true);
      uni.setStorageSync("aientryLoginFlag", true);
      action_report({
        action_name: "AI_WECHATIM_XCX_CARD_CLK",
        module_name: "WECHATIM",
      });
    }
    //全局页面enter_page埋点
    if (!option.query.umt_code) {
    }

    // console.log("feedpay----------------------------------");
    // if (option.query.codeOrigin == "feedpay") {
    //   const data = {
    //     codeOrigin: option.query.codeOrigin,
    //     deviceId: option.query.deviceId,
    //     shopId: option.query.shopId,
    //     skuId: option.query.skuId,
    //   };
    //   this.$store.commit("setFeederPaymentInfo", data);
    //   uni.setStorageSync("feederPaymentInfo", data);
    //   console.log("feedpay", data);
    // }

    // #endif
    // #ifdef H5
    uni.hideTabBar();
    // #endif
    uni.removeStorageSync("city");

    // 埋点数据清除

    uni.removeStorageSync("province");

    //版本更新判断
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("version check", res.hasUpdate);
    });

    updateManager.onUpdateReady(function (res) {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });

    //不是选择图片造成的app show, 融云添加事件监听
    if (!this.isChooseImage) {
      // const Events = RYEvents;
      // RYaddEventListener(Events.MESSAGES, handleMessages);
      //
      // console.log("ryConnectStatus app show", this.ryConnectStatus);
      // // 连接接融云
      // await RyConnect();
      //
      // // 获取是否有正在服务中的问诊单
      //
      // _getSheetsServerList();
    }
  },
  onHide: function () {
    console.log("App Hide");
    console.log("ryConnectStatus hide", this.ryConnectStatus);
    // 不是选择图片造成的app hide,融云 去除事件监听
    if (!this.isChooseImage) {
      // const Events = RYEvents;
      // RYremoveEventListener(Events.MESSAGES, handleMessages);
      console.log("开启时间", this.globalData.startTime);
      if (this.globalData.startTime) {
        let stay_ms = Date.now() - this.globalData.startTime;
        display_report({
          display_name: "umt_stay_time",
          object_type: "WX",
          extend: {
            stay_ms,
          },
        });
      }
    }
  },

  methods: {
    ...mapMutations(["setRyConnectStatus", "setUserInfo"]),
  },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
@import "@/static/css/main.scss";
@import "@/static/css/flex.scss";
@import "@/static/css/iconfont.scss";
</style>
