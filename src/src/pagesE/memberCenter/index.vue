<template>
  <view class="home-warp">
    <scroll-view
      :class="['membercenter-page', `level${styleLevelIndex}_page`]"
      scroll-y="true"
      @scroll="handleScroll"
    >
      <view class="bg"></view>
      <FixedNav
        :title="naviTitle"
        :headerShow="isHeaderShow"
        :backfc="backNav"
      ></FixedNav>
      <view class="header">
        <view class="status-bar" :style="{ height: statusBarHeight }"></view>
        <view class="top-bar" :style="{ height: navBarHeight }">
          <view
            :class="[
              'iconfont',
              'icon-back',
              `level_${styleLevelIndex}_normal`,
            ]"
            @click="goBack"
          ></view>
          <view
            :class="[
              'iconfont',
              'icon-a-huiyuanzhongxin3x',
              `level_${styleLevelIndex}_deep`,
            ]"
          ></view>
          <view class="splitline"></view>
          <view
            :class="['titledesc', `level_${styleLevelIndex}_normal`]"
            @click="toRule"
            >规则</view
          >
          <view class="click" @click="goBack"></view>
        </view>
      </view>
      <template v-if="levelIndex_V2 == 0">
        <InitPage @tomall="toMall"></InitPage>
      </template>
      <template v-else>
        <view class="vippage">
          <view class="subbg"></view>
          <MemberInfo
            @changeIndex="changeIndex"
            :levelList="levelConfigList_V2"
            :isMemberLevelLock="isMemberLevelLock"
            :levelIndex="levelIndex_V2"
          ></MemberInfo>
          <!-- 权益卡片 -->
          <EquityCard
            v-if="levelBenefitInfoList_V2"
            :levelIndex="swiperActiveIndex + 1"
            :levelBenefitList="levelBenefitInfoList_V2"
          ></EquityCard>
          <!-- 任务模板  -->
          <TaskTemplate
            ref="childComponent"
            :levelIndex="levelIndex_V2"
          ></TaskTemplate>
        </view>
      </template>
    </scroll-view>
    <UpgradeModal
      :show.sync="upgradeShow"
      :levelIndex="upDownInfo.levelIndex"
      :levelChangeDesc="upDownInfo.levelChangeDesc"
      :memberLevelId="upDownInfo.memberLevelId"
    ></UpgradeModal>
  </view>
</template>
<script>
import InitPage from "./components/initPage.vue";
import MemberInfo from "./components/memberInfo.vue";
import FixedNav from "@/components/fixedNav/index.vue";
import EquityCard from "./components/equityCard.vue";
import TaskTemplate from "./components/taskTemplate.vue";
import UpgradeModal from "./Modal/upgradeModal.vue";
import {
  GET_MEMBER_LV_CONFIG,
  ALLGRADE_BENEFIT_INFO_v3,
  GTE_RULES,
  UP_DOWN_POP,
} from "@/api/memberV2";
import {
  QUERY_MEMBER_CONFIG,
  QUERY_BENEFIT_CONFIG,
  QUERY_BENEFIT_DETAIL,
  RECEIVE_COUPON,
} from "@/api/member";
import { display_report, action_report } from "@/utils/track";
const titleArr = ["小银豚", "小金豚", "小钻豚", "黑金豚"];
export default {
  components: {
    InitPage,
    MemberInfo,
    FixedNav,
    EquityCard,
    TaskTemplate,
    UpgradeModal,
  },
  data() {
    return {
      upgradeShow: false,
      upDownInfo: {},
      openmember: false,
      downShow: false,
      popShow: false,
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV2/mainbg_",
      statusBarHeight: "",
      navBarHeight: "",
      isHeaderShow: false,
      naviTitle: "",
      levelIndex: 1,
      equityList: [],
      userLevelInfo: {},
      levelConfigId: "",
      receiveflag: false,
      levelBenefitDetailList: [],
      swiperActiveIndex: 0,
      levelConfigList_V2: [], // 轮播图=权益信息
      levelIndex_V2: 1,
      levelBenefitInfoList_V2: [], // 轮播图下卡片=权益详情
      memberOnlyDetail: {}, // 会员专属权益卡片信息
      isMemberLevelLock: 0,
    };
  },
  computed: {
    //设置页面样式index
    styleLevelIndex() {
      if (this.levelIndex_V2) {
        return this.swiperActiveIndex + 1;
      } else {
        return 0;
      }
    },
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  onShow() {
    this.getMemberLvConfig(); // 会员权益主页-查询会员等级配置
    this.getUpDown();
    // #ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        console.log("🚀 ~ onShow ~ res:", res);
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    // #endif
    // #ifdef H5
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    // #endif
  },
  onLoad(option) {
    // this.getMemberLvConfig(); // 会员权益主页-查询会员等级配置
    // #ifdef MP-WEIXIN
    this.levelConfigId = option.levelConfigId;
    // #endif
    if (this.levelConfigId && this.levelConfigId !== "null") {
      this.getGradeBenfitInfo(this.levelConfigId);
    }
  },
  mounted() {
    const userInfo = uni.getStorageSync("storage_info");
    display_report({
      display_name: "member_display",
      module_name: "member",
      extend: {
        userId: userInfo.userId,
        memberLv: this.levelIndex_V2,
      },
    });
  },
  methods: {
    handleScroll(e) {
      if (e && e.detail && e.detail.scrollTop >= 50) {
        this.isHeaderShow = true;
      }
      if (e && e.detail && e.detail.scrollTop < 50) {
        this.isHeaderShow = false;
      }
    },
    isCouponNumber(val) {
      return isNaN(val - 0) ? false : true;
    },
    goBack() {
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
        fail: (result) => {
          uni.switchTab({ url: "/pages/home/index" });
        },
      });
      // #endif
    },
    async toRule() {
      try {
        // const { data } = await GTE_RULES();
        // if (data.code === 0) {
        //   const userInfo = uni.getStorageSync("storage_info");
        //   console.log("🚀 ~ toRule ~ userInfo:", userInfo);
        //   action_report({
        //     action_name: "member_rule_click",
        //     module_name: "member",
        //     extend: {
        //       userId: userInfo.userId,
        //       memberLv: this.levelIndex_V2,
        //     },
        //   });
        // }
        // const path = data.data;
        // if (path.indexOf("http") !== -1) {
        //   let newRoute = "";
        //   if (path.indexOf("h5/shareActivity/?random=123#")) {
        //     newRoute = path.replace("h5/shareActivity/?random=123#", "#");
        //   } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
        //     newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
        //   } else if (path.indexOf("h5/shareActivity/?random=123")) {
        //     newRoute = path.replace("h5/shareActivity/?random=123/", "");
        //   }
        //   let str = `/pagesA/webView/index?route=${newRoute}&type=icon`;
        //   return uni.navigateTo({ url: str });
        // } else {
        //   return uni.navigateTo({ url: path });
        // }
        const userInfo = uni.getStorageSync("storage_info");
        action_report({
          action_name: "member_rule_click",
          module_name: "member",
          extend: {
            userId: userInfo.userId,
            memberLv: this.levelIndex_V2,
          },
        });
        const path = `/pagesE/memberCenter/components/rule`;
        if (this.isNative) {
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#${path}?transparentTopBar=1`,
          });
        } else {
          console.log(123456);
          uni.navigateTo({ url: path });
        }
      } catch (error) {
        console.log("err::", error);
      }
    },
    toMall(couponDetail) {
      if (couponDetail) {
        uni.navigateTo({
          url: `/pagesC/availableGoods/index?promotionId=${couponDetail.promotionId}`,
        });
      } else {
        uni.switchTab({
          url: "/pages/mall/index",
        });
      }
    },
    // receiveCoupon(id, item) {
    //   if (this.receiveflag) return;
    //   this.receiveflag = true;
    //   const _params = {
    //     levelConfigId: this.levelConfigId,
    //     benefitId: id,
    //     refId: item.couponId,
    //   };
    //   try {
    //     RECEIVE_COUPON(_params).then((res) => {
    //       if (res) {
    //         uni.showToast({
    //           title: "领取成功",
    //           icon: "none",
    //         });
    //         setTimeout(() => {
    //           this.receiveflag = false;
    //         }, 300);
    //         //更新列表
    //         this.getBenefitDetail();
    //       }
    //     });
    //   } catch (e) {
    //     this.receiveflag = false;
    //   }
    // },
    // async getBenefitDetail() {
    //   const { data } = await QUERY_BENEFIT_DETAIL({
    //     levelConfigId: this.levelConfigId,
    //   });
    //   this.levelBenefitDetailList = data.data.levelBenefitDetailList;
    // },
    // getConfigInfo() {
    //   QUERY_MEMBER_CONFIG().then((res) => {
    //     this.userLevelInfo = res.data?.data;
    //     this.levelIndex = this.userLevelInfo?.currentLevelIndex;
    //     if (this.levelIndex) {
    //       this.naviTitle = titleArr[this.levelIndex - 1];
    //     }
    //     if (!this.userLevelInfo?.openLevel) {
    //       //开启
    //       this.openmember = true;
    //     }
    //     if (this.userLevelInfo.levelUpDownStatus == 1) {
    //       //升级
    //       this.popShow = true;
    //     }
    //     if (this.userLevelInfo.levelUpDownStatus == 2) {
    //       //降级
    //       this.downShow = true;
    //     }
    //   });
    // },
    // async getEquityList(levelConfigId) {
    //   const { data } = await QUERY_BENEFIT_CONFIG({
    //     levelConfigId: levelConfigId,
    //   });
    //   this.equityList = data.data.levelBenefitList || [];
    // },
    changeIndex(index, first = false) {
      if (!first) {
        let item = this.levelConfigList_V2[index];
        this.getGradeBenfitInfo(item.levelConfigId);
      }
      this.swiperActiveIndex = index;
    },
    async getMemberLvConfig() {
      try {
        const {
          data: { data },
        } = await GET_MEMBER_LV_CONFIG();
        this.levelIndex_V2 = data.currentLevelIndex;
        this.isMemberLevelLock = data.isMemberLevelLock;
        // this.isMemberLevelLock = 1
        this.naviTitle = titleArr[this.levelIndex_V2 - 1];
        this.levelConfigList_V2 = data.levelConfigList;
        // #ifdef H5
        const info = uni.getStorageSync("currentLevelInfo");
        const query = {
          ...info,
          currentLevelIndex: this.levelIndex_V2,
        };
        uni.setStorageSync("currentLevelInfo", query);
        // #endif
        if (this.isNative) {
          this.levelConfigId =
            data.levelConfigList[data.currentLevelIndex - 1].levelConfigId;
          this.getGradeBenfitInfo(this.levelConfigId);
        }
      } catch (error) {
        console.log("🚀 ~ getMemberLvConfig ~ error:", error);
      }
    },
    async getUpDown() {
      try {
        const { data } = await UP_DOWN_POP();
        this.upDownInfo = data.data;
        const { levelUpDownStatus } = this.upDownInfo;
        if (levelUpDownStatus == 1) {
          this.upgradeShow = true;
        }
      } catch (error) {
        console.log("🚀 ~ getUpDown ~ error:", error);
      }
    },
    getGradeBenfitInfo(id) {
      const { levelConfigId } = uni.getStorageSync("currentLevelInfo");
      let _params = { levelConfigId: id || levelConfigId };
      if (!_params.levelConfigId) return;
      ALLGRADE_BENEFIT_INFO_v3(_params).then((res) => {
        this.levelBenefitInfoList_V2 = res.data.data.levelBenefitList;
      });
    },
    backNav() {
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
        fail: (result) => {
          uni.switchTab({ url: "/pages/home/index" });
        },
      });
      // #endif
      // #ifdef H5
      if (this.isNative) {
        this.$dsBridge.call("closeCurrentWebview", {});
      } else {
        // router.go(-1);
      }
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
