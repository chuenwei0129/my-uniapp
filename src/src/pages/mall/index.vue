<template>
  <view class="mall-content">
    <view :style="{ top: safeAreaTop + 'px' }">
      <view
        :style="{
          paddingTop: safeAreaTop + 'px',
        }"
        style="background-color: #fff"
      >
        <!--    marginBottom: changeBg ? '10px' : '', -->
        <Location @changeAddress="queryData" />
        <top-search-bar
          ref="searchBarRef"
          @updateOpenSet="updateOpenSet"
          :isShowCar="true"
        />
      </view>
    </view>
    <view :style="[choicenessStyle]">
      <Choiceness
        ref="choicenessRef"
        :opensetting="opensetting"
        :shopId="curShopId"
        @handleOpenSetting="handleOpenSetting"
        @scrollTrue="scrollTrue"
        @scroll="handleChoicenessScroll"
        :safeAreaTop="safeAreaTop"
        :useSkeleton="true"
      />
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view>
      <CustomTabbar />
    </view>
    <!-- #endif -->
    <PrivacyPop
      :isOpen.sync="isShowPrivacy"
      :protocol="protocol"
      source="med"
      @close="handlePrivacyClose"
    ></PrivacyPop>
    <!-- 首页弹窗广告 -->
    <AdPopView
      :show.sync="adPopViewShow"
      :info="popData"
      v-if="popData && popData.length"
    />
  </view>
</template>

<script>
import Choiceness from "./components/choiceness/index.vue";
import TopSearchBar from "@/pages/home/components/topSearchBar/index.vue";
import PrivacyPop from "@/components/privacyPop/index.vue";
import { mapMutations, mapState } from "vuex";
import { GET_NOTICE_INFO } from "@/api";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import { display_report } from "@/utils/track";
import CustomTabbar from "@/components/customTabbar/index.vue";
import { getNewPersonBannerPopUp } from "@/api/home";
import { getPopInfo } from "@/api/activityclube";
import AdPopView from "./components/adPop/index.vue";
import Location from "@/pages/home/components/location/index.vue";
import { FECTH_NEAR_SHOP_STORE, GET_CART_TOTAL } from "@/api/mallv2";
const module_name = "medical";
const chatMsgType = [
  "RCConsultationInfoMsg",
  "RCVeterinarianCardMessage",
  "RCVeterinarianDiagnosisMessage",
  "RCNutritionDiagnosisMsg",
  "RC:ImgMsg",
  "RC:HQVCMsg",
  "RC:FileMsg",
  "RC:SightMsg",
  "RC:TxtMsg",
  "RCMedicalCustomMsg",
];
export default {
  components: {
    Choiceness,
    TopSearchBar,
    PrivacyPop,
    CustomTabbar,
    AdPopView,
    Location,
  },

  data() {
    return {
      curShopId: "", //当前门店id
      safeAreaTop: getApp().globalData.statusBarHeight,
      safeAreaBottom: 0,
      titleIndex: 0,
      isYunchao: true,
      noStoreList: false,
      scrollData: {
        startY: 0,
        lastY: 0,
      },
      changeBg: false,
      topGradientY: 0,
      isShowPrivacy: false,
      // newComerGiftPopView: false, //新人礼弹窗
      adPopViewShow: false, //首页弹窗广告
      popData: undefined, //首页弹窗广告
      newPersonPopUpPicUrl: "", //新人活动弹窗图片url
      newPersonPopUpRouteData: null, //新人活动弹窗数据
      protocol:
        "若您确认点击同意，表示您已同意宠胖胖收集你的手机号用于注册登录账号、收集你选中的照片或视频、你选中的文件用于问诊过程中上传图片方便医生诊断与病情沟通、获取你选择的位置信息，用于快速添加收货地址、读取你的剪切板用于快捷复制内容",
    };
  },

  computed: {
    ...mapState(["userInfo", "lastSheetsMessage"]),
    opensetting: {
      get() {
        return (
          this.$store.state.openSetting ||
          uni.getStorageSync("medicine_openSetting_first")
        );
      },
      set() {},
    },
    choicenessStyle() {
      let headerHeight = "74rpx + 35px";
      if (!this.opensetting) {
        headerHeight += " + 77rpx + 20rpx";
      }
      return {
        height: `calc(100% - (${headerHeight}) - ${
          this.safeAreaTop
        }px - 50px - ${getApp().globalData.bottomSafeAreaHeight}px)`,
      };
    },
  },

  watch: {
    // lastSheetsMessage: {
    //   handler: async function (val) {
    //     if (!this.userInfo.token) return;
    //     await this.handleMessage(val, true);
    //     //清空
    //   },
    //   deep: true,
    //   immediate: false,
    // },
  },
  methods: {
    ...mapMutations(["setlastMessInfo", "setCustomTabbarIndex"]),
    handleSelectTitle(index) {
      this.titleIndex = index;
    },
    handleSwipe(e) {
      const { current } = e.detail;
      this.titleIndex = current;
    },
    updateOpenSet(flag) {
      this.opensetting = flag;
      this.$refs.choicenessRef.queryGoods();
    },
    handleOpenSetting() {
      console.log("child ：", this.$refs.storeService);
      this.$refs.storeService.handleOpenSetting();
    },
    handlePrivacyClose() {
      // uni.showTabBar();
      // this.getNewComerGiftPopView();
    },
    scrollTrue(flag) {
      this.changeBg = flag;
      this.$forceUpdate();
    },
    handleChoicenessScroll(offsetY) {
      let currY = 0;
      const windowInfo = uni.getWindowInfo();
      const ratio = 390 / 528;
      const maxH = windowInfo.screenWidth / ratio;
      if (offsetY < 0) {
        currY = 0;
      } else if (offsetY > maxH) {
        currY = -maxH;
      } else {
        currY = -offsetY;
      }
      this.topGradientY = currY;
    },
    //首页广告
    async getPopInfo() {
      const { data } = await getPopInfo({
        key: "POPUP_SHOPPING_APPLE",
      });
      this.popData = data;
      console.log("getPopInfo data1 : ", data);

      if (this.popData && this.popData.length) {
        let firstData = this.popData[0];
        let lastTime = uni.getStorageSync("storage_index_pop" + firstData.id);
        let nowTime = new Date().getTime();
        if (lastTime) {
          if (
            firstData.rule.exposure == "SAME_PROCESS" ||
            firstData.rule.exposure == "ONLY"
          ) {
            this.adPopViewShow = false;
          } else if (firstData.rule.exposure == "DAY") {
            let lt = this.getTodayTime(lastTime, 24);
            if (nowTime > lt) {
              this.adPopViewShow = true;
              uni.setStorageSync("storage_index_pop" + firstData.id, nowTime);
            } else {
              console.log("getPopInfo lastTime 111 : tan guo le ");
            }
          }
        } else {
          this.adPopViewShow = true;
          uni.setStorageSync("storage_index_pop" + firstData.id, nowTime);
        }
      }
    },
    /**
     * 根据时间戳获取当天0点时间
     * @param offHour 当天几点
     */
    getTodayTime(time, offHour) {
      let cutTime = new Date(time).toLocaleDateString();
      let todayTime = new Date(cutTime).getTime();
      console.log("getTodayTime : ", cutTime, todayTime, offHour);
      if (offHour) {
        todayTime += offHour * 3600 * 1000;
      }

      return todayTime;
    },
    async queryData(params) {
      let that = this;
      // that.location = params;
      console.log("附近门店1=======>");
      let lat = params.lat;
      let lon = params.lon;
      // 查询最近门店信息
      const res = await FECTH_NEAR_SHOP_STORE({
        errorNo: "5",
        lat: lat,
        lon: lon,
        cityCode: (params.cityCode || params.adcode).slice(0, 4) + "00",
      });

      const { shopId = "", onlineMallName = "" } = res.data?.data || {};

      if (shopId) {
        that.hasYunChao = false;
        uni.setStorageSync("onlineCurMallId", shopId);
        this.curShopId = shopId;
        console.log("门店id===", this.curShopId);
        uni.setStorageSync("isYunchao", false);
        console.log("存储shopid", uni.getStorageSync("onlineCurMallId"));
        // uni.$emit("reloadYunChao", that.hasYunChao);
      } else {
        console.log("没有门店信息，打开云超模式");
        that.hasYunChao = true;
        uni.setStorageSync("onlineCurMallId", "");
        this.curShopId = "";
        uni.setStorageSync("isYunchao", true);
        // uni.$emit("reloadYunChao", that.hasYunChao);
      }
      if (this.isYunchao !== res || res) {
        this.titleIndex = 0;
      }
      this.isYunchao = that.hasYunChao;
      //传递给自己的choiceness组件刷新数据,暂不需要
      // uni.$emit("refresh");
    },
  },
  mounted() {
    const windowInfo = uni.getWindowInfo();
    this.safeAreaTop = getApp().globalData.statusBarHeight;
    this.safeAreaBottom = windowInfo.safeAreaInsets.bottom + 49;

    // uni.$on("reloadYunChao", (res) => {
    //   if (this.isYunchao !== res || res) {
    //     this.titleIndex = 0;
    //   }
    //   this.isYunchao = res;
    // });
    uni.$on("noStoreList", (res) => {
      this.noStoreList = res;
    });
  },
  onShow() {
    //设置导航栏index
    this.setCustomTabbarIndex(1);
    if (this.userInfo.token) {
      console.log("商场tab-已登陆");
      // this.handleMessage(this.lastSheetsMessage);
    }
    this.$refs.searchBarRef.getCartCount();
    this.getPopInfo();
  },
  onShareAppMessage(e) {
    return {
      title: "品牌好物、爱宠服务，省钱省心超好逛！",
      path: `/pages/mall/index?titleIndex=${this.titleIndex}`,
    };
  },
  onShareTimeline(e) {
    return {
      title: "品牌好物、爱宠服务，省钱省心超好逛！",
      path: `/pages/mall/index?titleIndex=${this.titleIndex}`,
    };
  },
  onLoad(option) {
    this.opensetting = uni.getStorageSync("medicine_openSetting_first");

    setTimeout(() => {
      this.titleIndex = option.titleIndex ?? 0;
    }, 500);

    console.log("mall--titleIndex==", this.titleIndex);
    if (option.previousUserId) {
      uni.setStorageSync("previousUserId", option.previousUserId);
    }
    wx.getPrivacySetting({
      success: (res) => {
        console.log(res); // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
        if (res.needAuthorization) {
          // 需要弹出隐私协议
          uni.hideTabBar();
          this.isShowPrivacy = true;
        } else {
          //同意了隐私协议
          // this.getNewComerGiftPopView();
        }
      },
      fail: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  },
};
</script>

<style lang="scss">
.mall-content {
  height: 100vh;
  position: inherit;
  background-color: #f7f8fc;
}
.search-wrapper {
  font-size: 30rpx;
  position: relative;
}
.marginTopClass {
  margin-top: 0rpx;
}
.noMargin {
  margin-top: 0;
}
</style>
