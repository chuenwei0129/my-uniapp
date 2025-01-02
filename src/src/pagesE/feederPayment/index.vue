<template>
  <view>
    <view v-show="isLoading" style="height: 100vh; width: 100%">
      <u-loading-page
        :loading="true"
        bg-color="#1f1f1f"
        color="#fff"
        image="https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/loading.png"
      ></u-loading-page>
    </view>

    <view v-show="!isLoading">
      <Feed
        v-if="isPageVisible"
        ref="feedRef"
        :feederPaymentData="feederPaymentData"
        :feederPaymentInfo="feederPaymentInfo"
        :isLoading.sync="isLoading"
        :statusBarHeight="statusBarHeight"
        :strQuery="strQuery"
      />
      <Error
        v-else
        :errorImgUrl="errorImgUrl"
        :errorHint="errorHint"
        :statusBarHeight="statusBarHeight"
      />
    </view>
  </view>
</template>

<script>
import Feed from "./components/feed.vue";
import Error from "./components/error.vue";
import { mapState } from "vuex";

import { SEND_FEED_ORDER } from "@/api/feederPayment";

export default {
  components: {
    Feed,
    Error,
  },
  data() {
    return {
      isLoading: true,
      isPageVisible: true,
      feederPaymentInfo: undefined,
      feederPaymentData: {},
      errorHint: "",
      errorImgUrl: "",
      errorImgUrlMap: {
        1001: {
          url: "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/error_type1.png",
          hint: "哎呀，我们的小设备贪玩走丢了，晚点再试试~",
        },
        1002: {
          url: "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/error_type2.png",
          hint: "呀，我们的小设备还没有绑定它的专属门店，快联系工作人员给它找个温暖的家吧~",
        },
        1003: {
          url: "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/error_type3.png",
          hint: "哦豁，我们的食物传送门遇到了点小故障，快联系工作人员给小可爱准备好吃的吧~",
        },
        1004: {
          url: "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/error_type4.png",
          hint: "",
        },
        1005: {
          url: "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/error_type5.png",
          hint: "当前投喂人数过多，请稍后再试",
        },
      },
      statusBarHeight: getApp().globalData.statusBarHeight,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      // vuexFeederPaymentInfo: (state) => state.feederPaymentInfo,
    }),
  },
  onLoad(option) {
    if (option.id) {
    }
    console.log("🚀 ~ onLoad ~ option:", option);
    if (option.codeOrigin == "feedpay") {
      console.log("进入页面feed");
      const data = {
        codeOrigin: option.codeOrigin,
        deviceId: option.deviceId,
        shopId: option.shopId,
        skuId: option.skuId,
      };
      this.$store.commit("setFeederPaymentInfo", data);
      uni.setStorageSync("feederPaymentInfo", data);
      this.feederPaymentInfo = data;
      let strQuery = "";
      Object.keys(data).forEach((i) => {
        strQuery += `${i}=${data[i]}&`;
      });
      this.strQuery = strQuery.slice(0, strQuery.length - 1);
      console.log("🚀 ~ onLoad ~ this.strQuery :", this.strQuery);
    }
  },
  onReady() {},
  onShow() {
    if (!this.userInfo.token) {
      uni.navigateTo({
        url: `/pagesD/login/index?${this.strQuery}`,
      });
      return;
    }
    this.getFeederPaymentData();
  },
  mounted() {
    this.isCouponModelVisible = true;

    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        console.log(res, "--------------------------------------------");
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    //#endif

    //#ifdef H5
    console.log(getApp());
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    //#endif
  },
  methods: {
    // 获取设备信息
    async getFeederPaymentData() {
      try {
        this.isLoading = true;
        // const data = {
        //   ...this.feederPaymentInfo,
        // };
        const data = uni.getStorageSync("feederPaymentInfo");
        this.feederPaymentInfo = data;
        console.log("路由识别到feedpay", data);
        const res = await SEND_FEED_ORDER(data);
        console.log("SEND_FEED_ORDERSEND_FEED_ORDERSEND_FEED_ORDER", res);

        // this.isLoading = false;
        if (res.data.code == 0) {
          this.feederPaymentData = res.data.data;
          console.log(
            "SEND_FEED_ORDER------",
            res.data.data,
            this.feederPaymentData,
            this.$refs
          );
          this.$nextTick(() => {
            console.log(
              "SEND_FEED_ORDER------",
              res.data.data,
              this.feederPaymentData,
              this.$refs
            );
            this.$refs.feedRef.getCouponList(
              this.feederPaymentInfo,
              this.feederPaymentData
            );
          });
          return;
        }
        this.errorCode(res.data);
      } catch (error) {
        this.isLoading = false;
        console.log("🚀 ~ getAllGradeBenefit ~ error:", error);
      }
    },
    errorCode(res) {
      console.log("errorCode", res);
      if ([1001, 1002, 1003, 1004, 1005].includes(res.code)) {
        this.isPageVisible = false;
        this.isLoading = false;
        console.log(this.errorImgUrlMap, res.code);
        this.errorImgUrl = this.errorImgUrlMap[res.code].url;
        this.errorHint = this.errorImgUrlMap[res.code].hint;
        if (res.code == 1004) {
          this.errorHint = res.message;
        }
        console.log(this.errorImgUrl, this.errorHint);
      } else {
        uni.showToast({
          icon: "none",
          title: res.message,
          duration: 1000,
        });
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
