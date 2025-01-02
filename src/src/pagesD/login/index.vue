<template>
  <view class="index-warp">
    <cpp-navigation-bar bgColor="black"></cpp-navigation-bar>
    <view class="logo">
      <image
        class="img"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/login/login-new-logo-V2.png"
      ></image>
    </view>
    <!--       :class="[!noticeAgreed ? '' : 'checked']"  :class="[!noticeAgreed ? '' : 'checked']"-->
    <view class="G-Re">
      <view class="wx-login" v-if="!noticeAgreed" @click="promptPopUp"
        >手机号快捷登录</view
      >
      <view v-else>
        <button
          class="wx-login"
          open-type="getPhoneNumber"
          @getphonenumber="decryptPhoneNumber"
        >
          手机号快捷登录
        </button>
      </view>
    </view>

    <view class="agreement flex">
      <view
        class="iconfont flex ic-checked"
        @click="handleChecked"
        :class="[noticeAgreed ? 'icon-selected black' : 'icon-unSelected']"
      >
        <view class="text2">
          我已阅读并同意
          <text @click.stop="jumpAgreement(1)">《宠胖胖服务协议》</text> 和
          <text @click.stop="jumpAgreement(2)">《用户隐私政策》</text>
        </view>
      </view>
      <view class="checkbox"> </view>
    </view>

    <u-modal
      :show="show"
      title="温馨提示"
      confirmText="同意"
      confirmColor="#FF8315"
      :showCancelButton="true"
      @cancel="show = false"
      @confirm="confirm"
    >
      <view class="modal-content"
        >需要同意
        <text class="color" @click.stop="jumpAgreement(1)"
          >《宠胖胖用户服务协议》</text
        >和<text class="color" @click.stop="jumpAgreement(2)"
          >《宠胖胖用户隐私政策》</text
        >才能登录</view
      >
    </u-modal>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
//import { wxShareMethod } from "@/utils/wxShare";
import { appId, getCode, getPhoneNumber } from "@/utils/config";
// import { RyConnect, _getSheetsServerList } from "@/utils/ryConnect";
import { getDocDetail, getUserInfo } from "@/api/base/index";
export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: {},
  data() {
    return {
      jsCode: "",
      noticeAgreed: false,
      show: false,
      routeWhiteList: [
        "pagesA/webView/index",
        "pagesC/goodsServiceDetail/index",
        "pages/index/index",
        "pagesA/chatPageAi/index",
        "pagesB/inStoreService/index",
        "pagesE/memberCodePage/index",
        "pagesF/activityIndex/index",
        "pagesF/health/index",
        "pagesE/memberCenter/index",
        "pagesB/submitReservation/index",
        "pagesE/feederPayment/index",
        "pagesF/illnessReport/index",
        "pages/service/index",
      ],
    };
  },
  computed: {
    //   ...mapState(["openId", "alipayUserId", "channel"]),
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  onLoad(option) {
    getCode().then((code) => {
      this.jsCode = code;
    });
  },
  onReady() {},
  onShow() {
    let pages = getCurrentPages(); //页面对象
    console.log(pages, "pages");
    let prevpage = pages[pages.length - 1]; //上一个页面对象
    console.log(prevpage.route); //上一个页面路由地址
    let path = prevpage.route;
    console.log(
      path,
      "login path,",
      uni.getStorageSync("action_last_page_id"),
      this.routeWhiteList.includes(uni.getStorageSync("action_last_page_id"))
    );
  },

  methods: {
    ...mapMutations(["setUserInfo", "setUserDetail"]),
    async decryptPhoneNumber(e) {
      try {
        if (e.detail.errMsg !== "getPhoneNumber:ok") {
          console.error("getPhone Error", e);
          return;
        }
        console.log(
          "进入qian===",
          uni.getStorageSync("action_last_page_id"),
          this.routeWhiteList.includes(
            uni.getStorageSync("action_last_page_id")
          )
        );
        const res = await getPhoneNumber(e, this.jsCode, this.$store);
        this.setUserInfo(res);
        uni.setStorageSync("storage_info", res);
        console.log(
          "进入hou===",
          uni.getStorageSync("action_last_page_id"),
          this.routeWhiteList.includes(
            uni.getStorageSync("action_last_page_id")
          )
        );
        // 判断是否医生
        const isDoc = await this.judgeIdentity();
        if (isDoc) {
          uni.setStorageSync("storage_info", {});
          this.setUserInfo({});
          return;
        }

        // 获取用户信息
        await this.getUserInfoFun();

        let pages = getCurrentPages(); //页面对象
        console.log(pages, "pages");
        let prevpage = pages[pages.length - 1]; //上一个页面对象
        console.log(prevpage.route); //上一个页面路由地址
        let path = prevpage.route;
        console.log(
          "白名单===",
          this.routeWhiteList,
          uni.getStorageSync("action_last_page_id"),
          this.routeWhiteList.includes(
            uni.getStorageSync("action_last_page_id")
          )
        );

        // 登陆完成后返回页面
        if (
          this.routeWhiteList.includes(
            uni.getStorageSync("action_last_page_id")
          )
        ) {
          uni.reLaunch({
            url: "/pages/home/index",
          });
          //白名单内页面
          const url = `/${uni.getStorageSync("action_last_page_id")}${
            uni.getStorageSync("last_route_params") || ""
          }`;
          console.log("url====", url);
          if (url.indexOf("/pages/service/index") > -1) {
            console.log("进来了===");
            setTimeout(() => {
              uni.switchTab({
                url: url,
              });
            }, 500);
          } else {
            setTimeout(() => {
              uni.navigateTo({
                url: url,
              });
            }, 500);
          }
          console.log("url: ", url);
        } else {
          uni.reLaunch({
            url: "/pages/home/index",
          });
        }

        // 首页由电商改为 首页，修改

        // let obj = wx.getLaunchOptionsSync();
        // console.log(obj, " getLaunchOptionsSync ");
        // if (obj.path == "pagesA/chatPageAi/index") {
        //   console.log(obj, " getLaunchOptionsSync 1111");
        //   uni.reLaunch({
        //     url: "/pages/mall/index",
        //   });
        //   setTimeout(() => {
        //     uni.navigateTo({
        //       url: "/pagesA/chatPageAi/index",
        //     });
        //   }, 100);
        // } else {
        //   console.log(obj, " getLaunchOptionsSync 2222");
        //   uni.switchTab({
        //     url: "/pages/mall/index",
        //   });
        // }
      } catch (e) {
        console.error("手机号登录 error", e);
      } finally {
        getCode().then((code) => {
          this.jsCode = code;
        });
      }
    },

    // 判断是不是医生
    async judgeIdentity() {
      try {
        const docDetail = await getDocDetail();

        console.log("docDetail", docDetail);
        if (docDetail.data === "") {
          return false;
        }
        uni.showToast({
          icon: "none",
          title: "小程序暂不支持医生账号登入。",
        });

        return true;
      } catch (e) {
        throw new Error("获取医生信息失败");
      }
    },

    // 获取用户基本信息
    async getUserInfoFun() {
      // if (this.userInfo.nickName || this.userInfo.phone) {
      //   return;
      // }
      try {
        const res = await getUserInfo(true);
        let info = {
          ...this.userInfo,
          ...res,
        };
        this.setUserInfo(info);
        uni.setStorageSync("storage_info", info);
        // 进行融云连接
        // await RyConnect();
        // _getSheetsServerList();
      } catch (e) {
        throw new Error("获取用户信息失败");
      } finally {
      }
    },

    handleChecked() {
      this.noticeAgreed = !this.noticeAgreed;
    },
    promptPopUp() {
      this.show = true;
    },
    confirm() {
      this.show = false;
      this.noticeAgreed = true;
    },
    jumpAgreement(type) {
      if (type == 1) {
        uni.navigateTo({
          url: "/pagesA/webView/index?route=/meow-interface/html/agreement.html&type=jump",
        });
      }

      if (type == 2) {
        uni.navigateTo({
          url: "/pagesA/webView/index?route=/meow-interface/html/privacy.html&type=jump",
        });
      }
    },
    //
    handleAgreePrivacyAuthorization() {
      console.log("11");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
::v-deep .u-popup__content {
  border-radius: 38rpx !important;
}
button::after {
  border: none !important;
}
</style>
