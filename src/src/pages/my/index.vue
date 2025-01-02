<template>
  <view class="home-warp">
    <view :style="{ height: scrollViewHeight, overflowY: 'scroll' }">
      <view class="bg" :style="{ paddingTop: navBarHeight }">
        <scan-code />
      </view>
      <UserInfo :Info="DataInfo" :token="userInfo.token" />
      <MemberEntry :levelInfo="levelInfo_V2" />

      <view class="coupons-list">
        <view class="coupon-item coupon-item-one" @click="toMyCollection">
          <view class="consultation-item">
            <view class="consultation-text">收藏</view>
            <view class="consultation-num"
              >({{ formatNumber(collectNum) }})</view
            >
          </view>
        </view>
        <view class="coupon-item coupon-item-two" @click="handleMyWallet">
          <view class="consultation-item">
            <view class="consultation-text">卡包</view>
            <view class="consultation-num">({{ formatNumber(cardNum) }})</view>
          </view>
        </view>
        <view class="coupon-item coupon-item-three" @click="handleCouponList">
          <view class="consultation-item">
            <view class="consultation-text">券包</view>
            <view class="consultation-num"
              >({{ formatNumber(consultationCouponNum) }})</view
            >
          </view>
        </view>
        <view class="coupon-item coupon-item-four" @click="handleCouponCenter">
          <view class="consultation-item">
            <view class="consultation-text">领券中心</view>
          </view>
        </view>
      </view>

      <!-- banner 轮播图 -->
      <banner-swiper
        banner-key="BANNER_PERSONAL_CENTER_APPLE"
        bannerStyle="margin-top: 19rpx; margin-bottom: 19rpx;width: 719.23rpx;"
        moduleName="medical"
        actionName="mypage_banner_click"
        displayName="mypage_banner_show"
      />

      <order-info ref="orderInfo" marginLeft="15" marginRight="15"></order-info>

      <view class="my-order-box">
        <view class="my-order-title">
          <view>健康服务</view>
        </view>
        <view class="my-order-list">
          <view
            class="my-order-item"
            v-for="(item, index) in myOrderList"
            :key="index"
            @click="
              () => {
                handleGoToHealthService(index);
              }
            "
          >
            <image
              class="my-order-item-icon"
              :src="item.icon"
              mode="scaleToFill"
            >
            </image>
            <text> {{ item.title }} </text>
          </view>
        </view>
      </view>

      <view class="myPets">
        <view class="up">
          <view class="txt">我的宠物</view>
          <view class="pet-add" @click="handleAddPet" v-if="!petList.length">
            <view class="pet-add-img"></view>
            <view class="pet-add-txt">添加宠物</view>
          </view>
        </view>
        <view class="petList">
          <pet-view
            v-if="petList.length"
            :list="petList"
            pageName="petRecords"
            :petId="petId"
          />
        </view>

        <view class="overlay"></view>
      </view>

      <view class="my-contact-list">
        <view v-for="(item, index) in mySettingList" :key="index">
          <view
            class="my-contact-item"
            @click="
              () => {
                handleGoTo(item);
              }
            "
          >
            <view class="left">
              <image
                :src="item.icon"
                mode="aspectFill"
                class="my-contact-icon"
              ></image>
              <view class="my-contact-text">{{ item.name }}</view>
            </view>
            <image
              src="https://image.henhenchina.com/61ee0fe4f58112000178d924/f784004082f2411abdbeee795aefe662.png"
              mode="scaleToFill"
              class="my-contact-router"
            ></image>
          </view>
        </view>
      </view>
      <view :style="{ height: `20rpx` }"></view>
    </view>

    <!-- #ifdef MP-WEIXIN -->
    <view>
      <CustomTabbar />
    </view>
    <!-- #endif -->
    <MemberModal :show.sync="firstOpen" :levelInfo="levelInfo"></MemberModal>
    <DownModal
      :show.sync="downShow"
      :levelIndex="upDownInfo.levelIndex"
      :levelChangeDesc="upDownInfo.levelChangeDesc"
    ></DownModal>
    <UpgradeModal
      :show.sync="upgradeShow"
      :levelIndex="upDownInfo.levelIndex"
      :levelChangeDesc="upDownInfo.levelChangeDesc"
      :memberLevelId="upDownInfo.memberLevelId || levelInfo_V2.levelConfigId"
    ></UpgradeModal>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import UserInfo from "./components/user-info.vue";
import { getUserInfo } from "@/api/base";
//import { wxShareMethod } from "@/utils/wxShare";
import { GET_COUPON_PACK_QTY } from "@/api";
import {
  getCardNum,
  getCollectionNum,
  getActCollectionNum,
  getLiveBodyCollectionNum,
} from "@/api/my";
import { QUERY_LEVEL, QUERY_MEMBER_CONFIG } from "@/api/member";
import NavBar from "@/components/navBar/index.vue";
import OrderInfo from "./components/OrderInfo/index.vue";
import { action_report, display_report } from "@/utils/track";
import CustomTabbar from "@/components/customTabbar/index.vue";
// import OpenMember from "@/components/growthTravel/openMember.vue";
import scanCode from "@/components/scanCode/index.vue";
import { getPetList } from "@/api/base/index";
import PetView from "./components/petView/index.vue";
import MemberModal from "./components/modal/memberModal.vue";
import DownModal from "./components/modal/downModal.vue";
import UpgradeModal from "./components/modal/upgradeModal.vue";
import MemberEntry from "./components/memberEntry/index.vue";
import { GET_MY_MEMBER_GRADE, UP_DOWN_POP } from "@/api/memberV2";
import bannerSwiper from "@/components/bannerSwiper/index.vue";

const module_name = "medical";
export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: {
    // OpenMember,
    UserInfo,
    NavBar,
    OrderInfo,
    CustomTabbar,
    PetView,
    scanCode,
    MemberModal,
    DownModal,
    UpgradeModal,
    MemberEntry,
    bannerSwiper,
  },
  data() {
    return {
      // cacheDate: "",
      firstOpen: false,
      downShow: false,
      upgradeShow: false,
      openmember: false,
      DataInfo: {},
      totalCount: 0,
      collectNum: 0,
      cardNum: 0,
      scrollViewHeight: "",
      consultationCouponNum: 0,
      myOrderList: [
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_inquiry_v2.png",
          title: "我的问诊",
          active: 1,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_purchase_v2.png",
          title: "我的处方",
          active: 1,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_medicine_v2.png",
          title: "药品订单",
          active: 1,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_bookService_v2.png",
          title: "我的预约",
          active: 1,
        },
      ],
      levelInfo: {},
      // orderNum: undefined,
      petList: [],
      strlist: [
        "任意消费即可开启权益",
        "月月领券，最高可领69元",
        "领宠胖胖限定生日礼包",
      ],
      //顶部安全距离
      navBarHeight: "",
      mySettingList: [
        {
          name: "我的地址",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_address_v2.png",
          url: `/pagesA/addressManagement/index`,
        },
        {
          name: "我的活动",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_act.png",
          url: `/pagesF/myActives/index`,
        },
        {
          name: "活动订单",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_actorder.png",
          url: `/pagesF/activesOrderList/index`,
        },
        {
          name: "设置",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_setting_v2.png",
          url: `/pagesB/userSetting/index`,
        },
      ],
      levelInfo_V2: {},
      upDownInfo: {}, // 升降级别
      appVersion: "", // 小程序版本号
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
    isShowDot() {
      return function (index) {
        switch (index) {
          case 0:
            return this.orderNum.waitPayCount !== 0;
          case 1:
            return this.orderNum.waitShipCount !== 0;
          case 2:
            return this.orderNum.waitReceiveCount !== 0;
          case 3:
            return this.orderNum.afterOrderCount !== 0;

          default:
            break;
        }
      };
    },
  },
  mounted() {
    this.scrollViewHeight = `calc(100vh - ${
      getApp().globalData.bottomSafeAreaHeight
    }px - 50px)`;
    this.navBarHeight = getApp().globalData.navBarHeight + 12 + "px";
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  onLoad(option) {},
  onReady() {},
  async onShow() {
    //设置导航栏index
    this.setCustomTabbarIndex(4);
    // 展示事件
    display_report({
      display_name: "myinfo_display",
      object_type: "myinfo",
    });

    if (!this.userInfo.token) {
      return;
    }
    const myFirstOpen = uni.getStorageSync("myFirstOpen");
    // 升级/降级 弹层info
    uni.getSystemInfo({
      success: (res) => {
        console.log(res.appVersion, "APP版本号");
        this.appVersion = res.appVersion;
      },
    });
    if (this.appVersion === "2.3.1") {
      if (myFirstOpen) this.getUpDown();
      else this.firstOpen = true;
    } else {
      this.getUpDown();
    }

    // 获取用户信息
    this._getUserInfo();
    //获取宠物列表
    this._getPetList();
    // 获取用户收藏数量
    this._getCollectionNum();
    //获取卡包
    this._getCardNum();
    // 获取用户会员等级
    this._getUserLevel();

    this.getCouponPackQty();
    // 刷新角标数量
    this.$refs.orderInfo.queryBadge();
    this._getConfigInfo();
    this.$nextTick(() => {
      this.getMyMemberGrade(); // 我的页面【查询会员等级】
    });
  },
  onHide() {
    // this.isPageShow = false;
  },
  methods: {
    ...mapMutations(["setUserInfo", "setCustomTabbarIndex"]),
    // 升级 1/降级 2 -弹层info
    async getUpDown() {
      try {
        const { data } = await UP_DOWN_POP();
        const userInfo = uni.getStorageSync("storage_info");
        console.log("🚀 ~ getUpDown ~ userInfo:", userInfo);
        this.upDownInfo = data.data;
        const { levelUpDownStatus } = this.upDownInfo;
        if (levelUpDownStatus === 1) {
          // 升级
          display_report({
            display_name: "updowngrade_pop_display",
            module_name: "member",
            extend: {
              userId: userInfo.userId,
              memberLv: data.data.levelIndex,
            },
          });
          this.upgradeShow = true;
        } else if (levelUpDownStatus === 2) {
          // 降级
          display_report({
            display_name: "updowngrade_pop_display",
            module_name: "member",
            extend: {
              userId: userInfo.userId,
              memberLv: data.data.levelIndex,
            },
          });
          this.downShow = true;
        }
      } catch (error) {
        console.log("🚀 ~ getUpDown ~ error:", error);
      }
    },
    toMyMember() {
      uni.navigateTo({
        url: `/pagesE/memberCenter/index?levelConfigId=${this.levelInfo.levelConfigId}`,
      });
    },
    toSheetList() {
      uni.navigateTo({
        url: "/pagesA/sheetList/index",
      });
    },
    // 获取用户收藏数量
    async _getCollectionNum() {
      try {
        const res = await getCollectionNum({
          platformId: "1699310123233079297",
          appId: "1729776648698531840",
        });
        const num = res.data?.data?.collectNum ?? 0;
        const resAcNum = await getActCollectionNum();
        const resliveNum = await getLiveBodyCollectionNum({
          platformId: "1699310123233079297",
        });
        let numAc = resAcNum.data?.count ?? 0;
        let liveAc = resliveNum.data?.data?.collectNum ?? 0;
        this.collectNum = num + numAc + liveAc;
        console.log(num, numAc, liveAc, this.collectNum);
      } catch (e) {
        console.error("获取用户收藏数量错误", e);
      }
    },

    async _getCardNum() {
      try {
        const res = await getCardNum();
        this.cardNum = res?.data?.cardNum ?? 0;
      } catch (e) {}
    },

    async getUserMemberId() {
      let memberId = this.userInfo?.memberId;
      if (memberId) {
        console.log(`memberId: ${memberId}`);
        return memberId;
      }

      const user = await getUserInfo(true, true);
      if (this.userInfo) {
        this.userInfo.memberId = memberId;
      }
      console.log(`memberId: ${user.memberId}`);
      return user.memberId;
    },

    async getCouponPackQty() {
      try {
        const params = {
          memberId: await this.getUserMemberId(),
        };
        const res = await GET_COUPON_PACK_QTY(params);
        console.log("res ", res);
        this.consultationCouponNum = res.data.data.unusedCount;
      } catch (e) {
      } finally {
      }
    },

    async _getPetList() {
      try {
        this.petList = [];
        const res = await getPetList({
          userId: this.userInfo.userId,
        });

        this.petList = res.data;
      } catch (e) {
        console.error("获取宠物列表错误", e);
      }
    },

    async _getUserInfo() {
      try {
        const data = await getUserInfo(true);

        const userInfo = {
          ...this.userInfo,
          ...data,
        };
        this.setUserInfo(userInfo);
        this.DataInfo = data;
      } catch (e) {
        console.error("获取用户信息错误", e);
      }
    },
    //获取用户会员等级
    async _getUserLevel() {
      const { data } = await QUERY_LEVEL();
      this.levelInfo = data.data;
    },
    async _getConfigInfo() {
      if (!this.userInfo.token) {
        return;
      }
      let cacheDate = uni.getStorageSync("cacheDate");
      QUERY_MEMBER_CONFIG().then((res) => {
        const { openLevel } = res.data?.data;
        if (!openLevel) {
          //开启
          const today = new Date();
          if (
            cacheDate &&
            cacheDate.getDate() === today.getDate() &&
            cacheDate.getMonth() === today.getMonth() &&
            cacheDate.getFullYear() === today.getFullYear()
          ) {
            console.log("缓存日期是今天");
          } else {
            console.log("缓存日期不是今天");
            // 如果缓存日期不是今天，则将今天的日期存储到缓存中
            // this.cacheDate = today.toISOString(); // 将今天的日期转换为字符串并存储在cacheDate中
            console.log("已将今天的日期存储到缓存中:", this.cacheDate);
            uni.setStorageSync("cacheDate", today);
            this.openmember = true;
          }
        }
      });
    },
    setRouter(url, query) {
      uni.reLaunch({
        url,
      });
    },
    toMyCollection() {
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: "/pagesD/myCollection/index",
        });
      }, 500);
    },
    handleCouponList() {
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesB/couponPackage/index`,
        });
      }, 500);
    },
    //钱包
    handleMyWallet() {
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesD/myWallet/index`,
        });
      }, 500);
    },
    //领券中心
    handleCouponCenter() {
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesE/couponCenter/index`,
        });
        action_report({
          action_name: "mypage_couponcenter_area_click",
        });
      }, 500);
    },
    handleGoToHealthService(index) {
      switch (index) {
        case 0:
          this.toMyAsk();
          break;
        case 1:
          this.toMyPrescription();
          break;
        case 2:
          this.toMyOrder();
          break;
        case 3:
          this.toMyReservation();
          break;
      }
    },
    //进入问诊列表
    toMyAsk() {
      if (!this.userInfo.token) {
        this.goLogin();
      }
      action_report({
        action_name: "consultation_main_myconsultation_clk",
        module_name: module_name,
      });
      uni.navigateTo({
        url: `/pagesA/sheetList/index`,
      });
    },
    //进入我的处方
    toMyPrescription() {
      if (!this.userInfo.token) {
        this.goLogin();
      }
      action_report({
        action_name: "consultation_main_myprescription_clk",
        module_name: module_name,
      });
      uni.navigateTo({
        url: `/pagesB/myPrescription/index`,
      });
    },
    //进入我的订单
    toMyOrder() {
      if (!this.userInfo.token) {
        this.goLogin();
      }
      action_report({
        action_name: "consultation_main_myoder_clk",
        module_name: module_name,
      });
      uni.navigateTo({
        url: `/pagesA/bussinessOrder/index`,
      });
    },
    //进入我的预约
    toMyReservation() {
      if (!this.userInfo.token) {
        this.goLogin();
      }
      action_report({
        action_name: "consultation_main_order_myappointment_clk",
        module_name: "store",
      });
      // 去预约服务
      uni.navigateTo({
        url: `/pagesB/myReservation/index`,
      });
    },
    goLogin() {
      uni.navigateTo({
        url: "/pagesD/login/index",
      });
    },
    formatNumber(num) {
      if (num === null || num === undefined || num === "") {
        return "0"; // 或者返回任何你认为合适的默认值
      }
      // 判断 num 是否大于 10000
      if (num > 10000) {
        // 显示成 1.0w
        return Math.floor(num / 1000) / 10 + "w";
      } else {
        return num.toString(); // 不大于 10000 的数直接返回原值
      }
    },
    handleAddPet() {
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      uni.navigateTo({
        url: "/pagesD/petInfo/index?type=taskdesc&transparentTopBar=1",
      });
    },
    handleGoTo(i) {
      uni.navigateTo({ url: i.url });
    },
    async getMyMemberGrade() {
      const {
        data: { data },
      } = await GET_MY_MEMBER_GRADE(); // 接口请求
      this.levelInfo_V2 = data;
      // this.levelInfo_V2.isMemberLevelLock = 1
      const storage_info = uni.getStorageSync("storage_info");
      const params = {
        ...storage_info,
        levelIndex: data.levelIndex,
      };
      uni.setStorageSync("storage_info", params);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";

button::after {
  border: none;
}
</style>
