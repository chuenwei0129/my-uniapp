<template>
  <view class="mall-content">
    <!-- <pointsPage /> -->
    <view :style="{ top: safeAreaTop + 'px' }">
      <!-- marginBottom: changeBg ? '10px' : '', -->
      <view
        class="header-search-box"
        :style="{
          paddingTop: safeAreaTop + 'px',
        }"
      >
        <Location @changeAddress="queryData" />
        <top-search-bar
          ref="searchBarRef"
          @updateOpenSet="updateOpenSet"
          :isShowCar="false"
        />
        <image
          class="header-bottom-img"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/home_topbg.png"
          mode="widthFix"
        ></image>
      </view>
    </view>
    <view :style="[choicenessStyle]">
      <view class="choiceness-content">
        <scroll-view
          :scroll-y="enableScroll"
          class="choiceness-scroll-view"
          :refresher-enabled="true"
          :scroll-with-animation="false"
          :throttle="false"
          :scroll-top="scrollTop"
          :refresher-triggered="triggered"
          @refresherrefresh="myPullDownRefresh"
          @scrolltolower="handleScrollToLower"
          @scroll="scrollOperation"
        >
          <view class="cats-hots-container" id="cats">
            <!-- 个人信息展示区 -->
            <userInfoStatus :petList="petList" :userInfo="personInfo" />
          </view>
          <Choiceness
            :cats="cats"
            :hots="hots"
            :banners="banners"
            :tipsList="tipsList"
            :sectionGoods="sectionGoods"
            :goodsAds="goodsAds"
            :useSkeleton="true"
          ></Choiceness>
          <!-- 骨架屏 -->
          <!-- <template v-else>
            <view class="skeleton-jingang">
              <view class="jingang-box">
                <image
                  class="icon"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/skeleton_icon.png"
                />
              </view>
            </view>
            <view class="skeleton-goods">
              <view class="skeleton-evengoods" v-for="item in 2" :key="item">
                <view class="skeleton-item" v-for="item in 2" :key="item">
                  <image
                    class="icon"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/skeleton_icon.png"
                  />
                </view>
              </view>
            </view>
          </template> -->
        </scroll-view>
      </view>
      <!-- <Choiceness
        ref="choicenessRef"
        :opensetting="opensetting"
        :tipsList="tipsList"
        :shopId="curShopId"
        @handleOpenSetting="handleOpenSetting"
        @scrollTrue="scrollTrue"
        @scroll="handleChoicenessScroll"
        :safeAreaTop="safeAreaTop"
      /> -->
    </view>
    <!-- todo -->
    <advertisementPop
      v-if="imgData && imgData.length"
      :info="imgData"
      ref="adComponent"
      :show.sync="isShowPop"
    />
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
    <!-- 首页资源弹框 -->
    <resourcePop
      v-if="sourceData && sourceData.length"
      :show.sync="sourcePopShow"
      :info="sourceData"
    />
  </view>
</template>

<script>
import Choiceness from "./components/choiceness/index.vue";
import TopSearchBar from "./components/topSearchBar/index.vue";
import store from "@/store";
import PrivacyPop from "@/components/privacyPop/index.vue";
import { mapMutations, mapState } from "vuex";
import { GET_NOTICE_INFO } from "@/api";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import { display_report } from "@/utils/track";
import CustomTabbar from "@/components/customTabbar/index.vue";
import {
  getNewPersonBannerPopUp,
  getCarouselList,
  getHomeNearestMall,
  getMemberAgg,
} from "@/api/home";
import { getRemindList } from "@/api/reservation";
import resourcePop from "./components/resourcePop/index.vue";
import Location from "./components/location/index.vue";
import advertisementPop from "./components/advertisementPop/index.vue";
import userInfoStatus from "./components/userInfoStatus/index.vue";
import {
  FECTH_NEAR_SHOP_STORE,
  GET_CART_TOTAL,
  featureArea,
  navigationArea,
  GET_RECOMMEND_GOODS,
} from "@/api/mallv2";
import {
  getAdvertisementPostion,
  getFloatPosition,
} from "@/api/advertisement.js";
import { GET_BANNER_INFO } from "@/api";
import { getCategoryTreeGoodsV2 } from "@/api/mall";
import { getPetList } from "@/api/base/index";
// import pointsPage from '../pointsPage/index.vue'
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
    resourcePop,
    Choiceness,
    TopSearchBar,
    PrivacyPop,
    CustomTabbar,
    Location,
    advertisementPop,
    userInfoStatus,
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
      topGradientY: 0,
      isShowPrivacy: false,
      // newComerGiftPopView: false, //新人礼弹窗
      newPersonPopUpPicUrl: "", //新人活动弹窗图片url
      newPersonPopUpRouteData: null, //新人活动弹窗数据
      protocol:
        "若您确认点击同意，表示您已同意宠胖胖收集你的手机号用于注册登录账号、收集你选中的照片或视频、你选中的文件用于问诊过程中上传图片方便医生诊断与病情沟通、获取你选择的位置信息，用于快速添加收货地址、读取你的剪切板用于快捷复制内容",
      sourcePopShow: false, // 资源弹框是否显示
      sourceData: null, // 资源数据
      triggered: false,
      footerTriggered: false,
      // 热门商品分类
      cats: [],
      // 金刚区热门
      hots: [],
      // 轮播
      bannerIndex: 1,
      banners: [],
      // 专区
      areas: [],
      // 推荐商品分类
      goodsCats: [],
      goodsAds: [],
      // 选中的推荐商品分类
      sectionGoodsIndex: 0,
      // 分区商品查询参数，第一个是推荐
      sectionGoodsParams: [
        {
          dbPageNo: 0,
          skipGoods: 0,
          pageNum: 1,
          pageSize: 10,
        },
      ],
      // 分类对应商品
      sectionGoods: [],
      isScrollChild: false,
      rootScrollTop: 0,
      goodsHeaderScrollTop: 0,
      fixLock: false,
      imgData: null,
      isShowPop: false,
      tipsList: {}, // 待使用券数据
      isMainPageOpenPosition: false,
      personInfo: {},
      petList: [],
      // 是/否 可以滚动
      enableScroll: false,
      scrollTop: 0,
      oldScrollTop: 0,
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
    async getFloatData() {
      try {
        const { data } = await getFloatPosition({ key: "FLOAT_HOME_APPLE" });
        if (data && data.length > 0) {
          this.isShowPop = true;
          this.imgData = data;
        }
      } catch (error) {
        console.log("悬浮广告数据获取失败", error);
      }
    },
    // 弹框资源
    async getPopData() {
      const info = uni.getStorageSync("storage_info") || {};
      // 没有登录不展示弹框
      if (!info.token) return;
      const { data } = await getAdvertisementPostion({
        key: "POPUP_CONSULTATION_HOME_APPLE",
      });
      this.sourceData = data;
      if (this.sourceData && this.sourceData.length) {
        let firstData = this.sourceData[0];
        let lastTime = uni.getStorageSync("storage_source_pop" + firstData.id);
        let nowTime = new Date().getTime();
        if (lastTime) {
          if (
            firstData.rule.exposure == "SAME_PROCESS" ||
            firstData.rule.exposure == "ONLY"
          ) {
            this.sourcePopShow = false;
          } else if (firstData.rule.exposure == "DAY") {
            let lt = this.getTodayTime(lastTime, 24);
            if (nowTime > lt) {
              this.sourcePopShow = true;
              uni.setStorageSync("storage_source_pop" + firstData.id, nowTime);
            }
          }
        } else {
          this.sourcePopShow = true;
          uni.setStorageSync("storage_source_pop" + firstData.id, nowTime);
        }
      }
    },
    // 获取待使用券数据
    async getRemindList() {
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) return;
      try {
        const { data } = await getRemindList();
        this.tipsList = data.data;
      } catch (error) {
        console.log("待使用消息提示框数据获取失败", error);
      }
    },

    scrollOperation(e) {
      this.oldScrollTop = e.detail.scrollTop;
      this.$refs.adComponent && this.$refs.adComponent.updatePosition();
    },

    handleSelectTitle(index) {
      this.titleIndex = index;
    },
    handleSwipe(e) {
      const { current } = e.detail;
      this.titleIndex = current;
    },
    updateOpenSet(flag) {
      this.opensetting = flag;
      this.queryGoods();
    },
    handleOpenSetting() {
      console.log("child ：", this.$refs.storeService);
      this.$refs.storeService.handleOpenSetting();
    },
    handlePrivacyClose() {
      // uni.showTabBar();
      // this.getNewComerGiftPopView();
    },
    async myPullDownRefresh() {
      console.log("上滑");
      this.hots = this.hots.splice(0, 5);
      await this.refresh(true);
      // 如果已经登陆才调用接口
      if (uni.getStorageSync("storage_info")?.token) {
        this.getPetList();
        this.getUserInfo();
      }
    },
    async refresh(showTriggered) {
      if (this.triggered) {
        return;
      }
      if (showTriggered) {
        this.triggered = true;
      }
      try {
        uni.$emit("skeleton-refresh", true); // 关闭骨架屏
        // 新版推荐类目
        const result = await featureArea();
        this.cats = result?.data?.data || [];

        // 更新分类商品查询数据
        const params = [
          {
            dbPageNo: 0,
            skipGoods: 0,
            pageNum: 1,
            pageSize: 10,
          },
        ];
        for (const goodsCat of this.goodsCats) {
          params.push({
            pageNum: 1,
            pageSize: 10,
            classifyId: goodsCat.id,
          });
        }
        this.sectionGoodsParams = params;
        this.sectionGoods = Array(params.length);
        // 查询金刚区
        // const res2 = await GET_RECOMMEND_HOT();
        // this.hots = res2?.data?.data || [];
        // 新版金刚区
        const res2 = await navigationArea();
        this.hots = res2?.data?.data || [];
        // 查询专区
        // const res3 = await GET_RECOMMEND_AREA({ version: 2, enabled: true });
        // this.areas = res3?.data?.data || [];
        // 查询广告
        const res4 = await getCarouselList({
          key: "CAROUSEL_PET_HOME_APPLE",
          cityCode: uni.getStorageSync("cityCode"),
        });
        this.goodsAds = res4?.data || [];
        this.goodsAds.forEach((banner) => {
          display_report({
            display_name: "newhome_adfeed_show",
            object_type: "home",
            extend: {
              ad_name: banner.content.title,
              ad_id: banner.content.id,
            },
          });
        });
        // 查询banner
        await this.queryBanner();
        // 查询分区商品
        // let item = uni.getStorageSync("mall_last_search_address_obj");
        // if (!(item.lat && item.lon)) {
        //   await this.queryGoods();
        // }
        await this.queryGoods();
        this.triggered = false;
      } catch (e) {
        console.log("商城刷新数据出错：", e);
        this.triggered = false;
      } finally {
        this.enableScroll = true;

        uni.$emit("skeleton-refresh", false); // 关闭骨架屏
      }
    },
    async queryGoods(data) {
      const params = this.sectionGoodsParams[this.sectionGoodsIndex];
      console.log("🚀 ~ queryGoods ~ params:", params);
      let goodData = [];
      let sectionGoods = uni.$u.deepClone(this.sectionGoods) ?? [];
      try {
        if (this.sectionGoodsIndex === 0) {
          console.log("***********", Object.assign(params, data));
          const res = await GET_RECOMMEND_GOODS({
            ...Object.assign(params, data),
            type: 1,
            // shopId: uni.getStorageSync("onlineCurMallId"),
            shopId: this.curShopId,
          });
          params.dbPageNo = res.data.data.dbPageNo;
          params.skipGoods = res.data.data.skipGoods;
          goodData = res.data.data.goodData ?? [];
        } else {
          const res = await getCategoryTreeGoodsV2({
            ...params,
            // shopId: uni.getStorageSync("onlineCurMallId"),
            shopId: this.curShopId,
          });
          goodData = res?.data?.data?.data || [];
        }
        if (params.pageNum === 1) {
          sectionGoods[this.sectionGoodsIndex] = goodData;
          if (this.isMainPageOpenPosition) {
            this.isMainPageOpenPosition = false;
            uni.$emit("goodsChange", { goodData, isWatch: true });
          }
        } else {
          sectionGoods[this.sectionGoodsIndex] = (
            sectionGoods[this.sectionGoodsIndex] ?? []
          ).concat(goodData);
          if (goodData.length === 0) {
            params.pageNum -= 1;
          }
        }
      } catch (error) {
        console.log("queryGoodserror", error);
      } finally {
        uni.$emit("skeleton-refresh", false); // 关闭骨架屏
      }
      // console.log("查询商品结束：", sectionGoods);
      this.sectionGoods = [...sectionGoods];
    },
    async queryBanner() {
      try {
        const res = await GET_BANNER_INFO({
          key: "BANNER_PET_SHOPPING_APPLE",
          cityCode: uni.getStorageSync("cityCode"),
        });
        this.banners = res.data;
        if (this.banners.length > 0) {
          const banner = this.banners[0];
          display_report({
            display_name: "shop_banner_display",
            object_type: "shop",
            extend: {
              ad_name: banner.content.title,
              ad_id: banner.content.id,
            },
          });
        }
      } catch (_) {
        this.banners = [];
      }
    },
    async handleScrollToLower() {
      console.log("下滑");
      console.log("");
      if (this.triggered || this.footerTriggered) {
        return;
      }
      this.footerTriggered = true;
      const params = this.sectionGoodsParams[this.sectionGoodsIndex];
      params.pageNum += 1;
      try {
        await this.queryGoods();
        this.footerTriggered = false;
      } catch (e) {
        console.log("商城上拉数据出错：", e);
        this.footerTriggered = false;
        params.pageNum -= 1;
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
      this.scrollTop = this.oldScrollTop;
      // 当调用此方法时，会先保存当前的滚动位置，并在下一个Vue的DOM更新周期开始时滚动到页面顶部
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
      let that = this;
      // that.location = params;
      console.log("附近门店1=======>");
      let lat = params.lat;
      let lon = params.lon;
      // 查询最近门店信息
      const res = await FECTH_NEAR_SHOP_STORE({
        errorNo: "4",
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
      // if (params.type === "mainPageOpenPosition") {
      //   this.isMainPageOpenPosition = true;
      //   this.queryGoods();
      // }
      const query = this.sectionGoodsParams[this.sectionGoodsIndex];
      query.pageNum = 1;
      this.sectionGoods = [];
      this.queryGoods(query);
      console.log("🚀 ~ queryData ~ params:", query);
    },
    async getPetList() {
      try {
        const userId = uni.getStorageSync("storage_info")?.userId;
        const res = await getPetList({ userId });
        this.petList = res.data || [];
        // 测试宠物的数量
        // this.petList = this.petList.slice(0, 3)
        // this.petList = []
      } catch (e) {
        console.error("获取宠物列表错误", e);
      }
    },
    async getUserInfo() {
      try {
        const res = await getMemberAgg();
        // this.isLogin = true;
        res.data && (this.personInfo = res.data?.data);
      } catch (e) {
        // this.isLogin = false;
        console.error("获取会员信息错误", e);
      }
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

    uni.$emit("skeleton-refresh", true); // 关闭骨架屏
    this.refresh(false);
  },
  async onShow() {
    uni.$emit("skeleton-refresh", true); // 关闭骨架屏
    this.getPopData();
    //设置导航栏index
    this.setCustomTabbarIndex(0);
    if (this.userInfo.token) {
      console.log("商场tab-已登陆");
      // this.handleMessage(this.lastSheetsMessage);
    }
    // this.$refs.searchBarRef.getCartCount();
    this.getRemindList();
    this.getFloatData();
    // this.refresh(false);
    // 如果已经登陆才调用接口
    if (uni.getStorageSync("storage_info")?.token) {
      this.getPetList();
      this.getUserInfo();
    }
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
.header-search-box {
  position: relative;
  padding-bottom: 15.38rpx;
  z-index: 1;
  // background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/home/home_topbg.png");
  // background-repeat: no-repeat;
  // // background-size: cover;
  // background-size: 100% 95%;
  .header-bottom-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 0;
  }
}
.mall-content {
  height: 100vh;
  position: inherit;
  background-color: #f7f8fc;
}
.choiceness-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  .cats-hots-container {
    // margin: 0 15.85rpx;
    position: relative;
    z-index: 1;
    width: 719rpx;
    margin: 0 auto;
    border-radius: 23rpx;
  }
}
.choiceness-scroll-view {
  height: 100%;
  overflow-y: scroll;
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
.skeleton-jingang {
  width: 100vw;
  padding: 0 15rpx;
  box-sizing: border-box;
  margin: 15rpx 0;
  .jingang-box {
    width: 100%;
    height: 358rpx;
    background: #ffffff;
    border-radius: 23rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .icon {
      display: block;
      width: 165rpx;
      height: 65rpx;
    }
  }
}

.skeleton-goods {
  width: 100%;
  padding: 0 15rpx;
  display: flex;

  .skeleton-evengoods {
    width: calc((100vw - 30rpx) / 2);
    box-sizing: border-box;
    .skeleton-item {
      width: 352rpx; // calc((100vw - 46rpx) / 2);
      height: 552rpx;
      background: #ffffff;
      border-radius: 23rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16rpx;
      .icon {
        display: block;
        width: 165rpx;
        height: 65rpx;
      }
    }
  }
  .skeleton-evengoods:nth-child(2) {
    margin-left: 10rpx;
  }
}
</style>
