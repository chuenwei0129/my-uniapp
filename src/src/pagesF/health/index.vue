<template>
  <view class="dad-wrapper" ref="dadRef">
    <view class="header">
      <view style="display: none">
        <CustomerService
          style="background-color: red; width: 20px; height: 20px"
        />
      </view>
      <!-- #ifdef H5 -->
      <!-- #endif -->
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="top-bar">
        <!-- 'top-bar', -->
        <view class="pet-box">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/back-black-tag.png"
            mode="scaleToFill"
            class="left-icon"
            @click="goBackToHome"
          />
          <view class="pet-left">
            <view class="avatar" @click="toMyPet">
              <template v-if="userInfo.token && petList[jumpIndex].avatarUrl">
                <image :src="petList[jumpIndex].avatarUrl" mode="aspectFill" />
              </template>
              <template v-else>
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/defaultavatar.png"
                  mode="scaleToFill"
                />
              </template>
            </view>
            <view class="petname" @click="toMyPet">{{
              !userInfo.token ? "未登录" : "爱宠"
            }}</view>
          </view>
        </view>
        <view class="tb-title">健康</view>
      </view>
    </view>
    <scroll-view
      class="scroll-wrap"
      @scroll="handleScroll"
      :scroll-top="scrollTop"
      scroll-y="true"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      @refresherrefresh="myPullDownRefresh"
      :style="{
        height: scrollHeight,
      }"
    >
      <view class="entry-wrap">
        <view class="slogan-entry">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/new_home_slogon_icon.png"
            style="
              margin-top: 5rpx;
              margin-right: 8rpx;
              width: 650rpx;
              height: 30.77rpx;
            "
            mode="aspectFit"
          />
        </view>

        <view class="content-entry">
          <view class="top-entry">
            <!-- <view class="doctor-title">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/home_pet_title_icon.png"
                style="width: 172rpx; height: 40rpx"
                mode="scaleToFill"
              />
              <view class="doctor-title-des">09:00-22:00在线</view>
            </view>
            <view class="doctor-info">在线专业解答养宠问题</view>
            <view class="doctor-dog">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/home_pet_dog.png"
                style="width: 174rpx; height: 195rpx"
                mode="scaleToFill"
              />
            </view> -->
            <view class="itemwrap">
              <view
                v-for="AiItem in entrInfo.slice(6)"
                class="entryitem-left"
                @click="$u.throttle(toAsk(AiItem), 500)"
                :style="{ 'background-image': 'url(' + AiItem.iconUrl + ')' }"
              >
                <view class="ai-entryitem-title"> {{ AiItem.name }} </view>
                <view class="ai-entryitem-time">{{ AiItem.introduction }}</view>
                <!-- <view
                  class="ai-entryitem-content"
                  v-for="(item, index) in aiContent"
                  :key="index"
                >
                  <u-icon name="checkmark" color="#7A3E00" size="12px"></u-icon>
                  <view class="ai-content">{{ item.name }}</view>
                </view> -->
              </view>
              <view class="entryitem-right">
                <view
                  class="entryitem"
                  @click="$u.throttle(toAsk(item), 500)"
                  v-for="(item, index) in entrInfo.slice(0, 2)"
                  :key="index"
                  :style="{
                    'background-image': 'url(' + item.iconUrl + ')',
                  }"
                >
                  <view class="entrytag" v-if="item.cornerMarkText">{{
                    item.cornerMarkText
                  }}</view>
                  <view class="desccontent">
                    <view
                      class="entryname"
                      :style="{
                        color:
                          index === 1
                            ? 'rgba(88, 56, 0, 1)'
                            : 'rgba(61, 56, 0, 1)',
                      }"
                      >{{ item.name }}</view
                    >
                    <view
                      class="des"
                      :style="{
                        color:
                          index === 1
                            ? 'rgba(88, 56, 0, 1)'
                            : 'rgba(61, 56, 0, 1)',
                      }"
                      >{{ item.introduction }}</view
                    >
                  </view>
                  <!-- <view class="entryicon"
                    ><image :src="item.iconUrl" mode="scaleToFill"
                  /></view> -->
                </view>
              </view>
            </view>
          </view>
          <view class="bottom-entry">
            <view
              :class="['entryicon', `${item.type}-entry`]"
              v-for="(item, index) in entrInfo.slice(2, 6)"
              @click="$u.throttle(toAsk(item), 500)"
              :key="index"
            >
              <view class="icon">
                <image :src="item.iconUrl" mode="scaleToFill" />
              </view>
              <view class="name">{{ item.name }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="banner-wrapper" v-if="bannerList.length">
        <Banner :banner-list="bannerList" />
      </view>
      <!-- 页面新增跳转框 -->
      <!-- #ifdef H5 -->
      <view class="newSkinContent">
        <view class="newSkinTitle">我的记录</view>
        <view class="newSkinBodyContent">
          <view
            class="newSkin"
            v-for="(item, index) in newSkinList"
            :key="index"
            @click="toAskNew(index)"
          >
            <image :src="item.iconUrl" mode="scaleToFill" class="newSkinIcon" />
            <view class="newSkinName">{{ item.name }}</view>
          </view>
        </view>
      </view>
      <!-- #endif -->
      <!-- <view class="doc-line" style="width: 100%; height: 1px"></view> -->
      <DocList
        :has-login="userInfo.token"
        :doc-list="docList"
        @docAsk="docAsk"
        @showtoast="showToast"
        :pet-list="petList"
      ></DocList>
    </scroll-view>
    <FloatingNotice></FloatingNotice>
    <view class="topicon" @click="handleToTop" v-if="showTopIcon">
      <view class="toparrow"></view>
      <view class="text">顶部</view>
    </view>
    <u-toast ref="uToast"></u-toast>
    <CouponChoosePop
      :isOpen.sync="isCouponShow"
      @close="handleCouponClose"
      :coupon-list="couponCommendList"
      :inquiry-type="inquiryTypeForPop"
      :doctorUserId="doctorUserId"
      :pet-list="petList"
    />
    <!-- <InvitePop :isOpen.sync="isInviteShow" @close="handleCouponClose" /> -->
    <GoToChatPage :show.sync="isShowGoTo"></GoToChatPage>
    <isGoToAiPopup
      :show.sync="isShowGoToAi"
      :isGoToAiList="isGoToAiList"
      :userSelectedPetId="userSelectedPetId"
      @skinToCust="skinToCust"
    ></isGoToAiPopup>
    <PrivacyPop
      :isOpen.sync="isShowPrivacy"
      :protocol="protocol"
      source="med"
      @close="handlePrivacyClose"
    ></PrivacyPop>
    <view class="toast-body" v-if="isShowSelfToast">
      {{ toastContent }}
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <!-- <view>
      <CustomTabbar />
    </view> -->
    <!-- #endif -->
  </view>
</template>

<script>
import isGoToAiPopup from "./components/isGoToAiPopup/index.vue";
import TopShop from "./components/topShop/topShop.vue";
import DocList from "./components/docList/docList.vue";
import Banner from "./components/banner/index.vue";
import CouponChoosePop from "@/components/couponChoosePop/index.vue";
import GoToChatPage from "@/components/goToChatPage/index.vue";
import InvitePop from "@/components/invitePop/index.vue";
import PrivacyPop from "@/components/privacyPop/index.vue";
import FloatingNotice from "./components/floatingNotice/floatingNotice.vue";
import { checkLocationAuth, getAuthLocation } from "../../utils/location";
import { mapState, mapMutations } from "vuex";
import CustomTabbar from "@/components/customTabbar/index.vue";
import { isGoToAIApi } from "@/pagesF/api/aiConsultation/index";
import {
  searchUserLocation,
  wxBurying,
  getAddressList,
  originCheckUserQualification,
} from "@/api/base/index";
import { debounce } from "@/utils/index";
import {
  GET_TOP_SHOP,
  GET_PET_LIST,
  GET_DOC_LIST,
  GET_DATA,
  GET_BANNER_INFO,
  CAN_I_ASK_V2,
  GET_RESOURCE_LIST_IN_POP,
  ENTRY_CONFIG,
  GET_ONLINE_STATUS,
  GET_NOTICE_INFO,
  CHANGE_NOTICE,
} from "@/api/index";
import { GET_IN_SERVICE, GET_IN_SERVICE_LAST } from "@/api/chat";
import { getSheetsList } from "@/api/sheets";
import { action_report, display_report } from "@/utils/track";
import { shopDetail } from "@/api/reservation";
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
const module_name = "medical";
export default {
  components: {
    TopShop,
    DocList,
    CouponChoosePop,
    Banner,
    InvitePop,
    GoToChatPage,
    PrivacyPop,
    FloatingNotice,
    CustomTabbar,
    isGoToAiPopup,
  },
  data() {
    return {
      aisheetlistState: 0, //单独处理ai问诊单
      isGoToAiList: {
        buttons: [],
      },
      aiContent: [
        { name: "科学检测" },
        { name: "精准定位" },
        { name: "快速计算" },
      ],
      opensetting: uni.getStorageSync("medicine_openSetting_first"),
      scrollTop: 0,
      scrollHeight: "",
      old: {
        scrollTop: 0,
      },
      isShowGoTo: false,
      isShowGoToAi: false,
      showTopIcon: false,
      statusBarHeight: getApp().globalData.statusBarHeight,
      pageScrollState: false,
      location: true, //定位相关标志位
      petList: [], //用户宠物信息
      docList: [], //医生列表
      pageNo: 1,
      pageSize: 20,
      isFinished: false, //无数据,禁止下拉刷新
      selectedPetId: "",
      isSelectedPetExotic: false,
      // lastSheetDetail: [],
      triggered: false,
      entrInfo: [],
      isCouponShow: false,
      isInviteShow: false,
      bannerList: [],
      couponCommendList: [],
      // cardCommendList: [],
      inquiryTypeForPop: "",
      jumpIndex: 0,
      doctorUserId: "",
      topShop: null,
      closet: false,
      isShowPrivacy: false,
      protocol:
        "若您确认点击同意，表示您已同意宠胖胖收集你的手机号用于注册登录账号、收集你选中的照片或视频、你选中的文件用于问诊过程中上传图片方便医生诊断与病情沟通、获取你选择的位置信息，用于快速添加收货地址、读取你的剪切板用于快捷复制内容",
      toastContent: "",
      isShowSelfToast: false,
      newIconUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/newHealthBg.png",
      newSkinList: [
        {
          iconUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/inquiry/message_icon.png",
          name: "我的问诊",
        },
        {
          iconUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/inquiry/eventAdd_icon.png",
          name: "我的处方",
        },
        {
          iconUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/inquiry/event_icon.png",
          name: "我的订单",
        },
        {
          iconUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/inquiry/eventEdit_icon.png",
          name: "我的卡券",
        },
      ],
    };
  },
  computed: {
    ...mapState([
      "userInfo",
      "userSelectedPetId",
      "userPetList",
      "lastSheetsMessage",
      "serviceSheetsList",
      "lastMesInfo",
      "selectPetItem",
    ]),
  },
  watch: {
    "userInfo.token": {
      handler: async function (val, old) {
        console.log("token: ", val);
        // 登录状态
        if (val && val != old) {
          this.handleLoginResult(val);
        }
      },
      deep: true,
    },
    lastSheetsMessage: {
      handler: async function (val) {
        if (!this.userInfo.token) return;
        this.handleMessage(val);
        console.log("消息处理处理====", this.lastMesInfo);
      },
      deep: true,
      immediate: false,
    },
  },
  mounted() {
    this.scrollHeight = `calc(100vh - ${
      getApp().globalData.bottomSafeAreaHeight
    }px - ${getApp().globalData.statusBarHeight}px)`;
  },
  onLoad(option) {
    console.log("11111111111111111111111111111", option);
    // #ifndef H5
    uni.setStorageSync("shareType", "APP");
    // #endif
    if (option.shareType) {
      uni.setStorageSync("shareType", option.shareType);
      display_report({
        display_name: "Share_onlineconsultation_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    } else {
      uni.setStorageSync("shareType", "WECHAT_XCX");
    }
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
        }
      },
      fail: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
    if (this.userInfo.token) {
    }

    // 登录状态，首次定位获取店铺信息
    this.handleLoginResult(this.userInfo.token, true);
  },
  onReady() {},
  onShow() {
    this.getSheetsListMethod();
    console.log(
      this.serviceSheetsList,
      "====================>store.state.serviceSheetsList"
    );
    this.getTheLastSheetInfo();
    //设置导航栏index
    this.setCustomTabbarIndex(1);
    // 展示事件
    display_report({
      display_name: "consultation_main_show",
      object_type: "store",
    });

    this.opensetting = uni.getStorageSync("medicine_openSetting_first");

    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    if (this.userInfo.token) {
      console.log("已登陆");
      if (!uni.getStorageSync("city")) {
        try {
          // this.getLocation();
        } catch (error) {}
      }
      this.city = uni.getStorageSync("city") || "北京市";
      this.getPetList();
      this.handleGetAddressList();
      this.handleMessage(this.lastSheetsMessage);
      setTimeout(() => {
        if (this.userSelectedPetId) {
          let index = this.petList.findIndex((i) => {
            return i.id == this.userSelectedPetId;
          });
          if (index === -1) {
            index = 0;
          }
          this.jumpIndex = index;
        }
        if (
          uni.getStorageSync("aientry") &&
          uni.getStorageSync("aientryLoginFlag")
        ) {
          this.toAsk({ type: "QUICK" });
        }
      }, 500);
    }
    this.getDocList(this.pageNo, this.pageSize);
    this.getEntrInfo();
    GET_BANNER_INFO({
      key: "BANNER_ONLINE_CONSULTATION_HOME_APPLE",
      cityCode: uni.getStorageSync("cityCode"),
    }).then((res) => {
      this.bannerList = res.data;
    });

    // 获取门店信息
    const selectShopInfo = uni.getStorageSync("selectShopInfo") || {};
    const ifCloset = selectShopInfo?.closet ?? false;
    // 只有已加载附近时，获取店铺信息
    if (
      this.userInfo.token &&
      this.opensetting &&
      this.topShop &&
      selectShopInfo?.shopId
    ) {
      this.getShopDetail(selectShopInfo.shopId, ifCloset);
    }
  },
  methods: {
    // 改版后新增顶部返回按钮
    goBackToHome() {
      uni.switchTab({ url: "/pages/home/index" });
    },
    // 新增我的记录跳转方式
    // #ifdef H5
    toAskNew(index) {
      if (!this.userInfo.token) {
        this.goLogin();
      } else if (index == 0) {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesA/sheetList/index?transparentTopbar=1`,
        });
      } else if (index == 1) {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesB/myPrescription/index?transparentTopbar=1`,
        });
      } else if (index == 2) {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesA/bussinessOrder/index?transparentTopbar=1`,
        });
      } else {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesB/couponPackage/index?transparentTopbar=1`,
        });
      }
      action_report({
        action_name: "consultation_main_myconsultation_clk",
        module_name: module_name,
      });
    },
    // #endif
    ...mapMutations([
      "setUserSelectedPetId",
      "setUserPetList",
      "setAddressId",
      "setlastMessInfo",
      "setCustomTabbarIndex",
      "setJumpModelShow",
      "setSelectPetItem",
    ]),
    handleScroll(e) {
      this.old.scrollTop = e.detail.scrollTop;
      this.showTopIcon = e.target.scrollTop > 500;
    },
    handleMessage: async function (val) {
      let noticeMsgInfo = {};
      const res = await GET_NOTICE_INFO();
      noticeMsgInfo = res?.data || {};
      console.log("noticeMsgInfo:", noticeMsgInfo);
      const { data } = await GET_IN_SERVICE_LAST({});
      const { groupId, doctorAvatarUrl, doctorUserName } = data;

      let prescriptMap = { id: "" };
      let msgMap = { id: "" };
      if (noticeMsgInfo?.status == "NOT_VIEW") {
        console.log("医疗tab-noticeMsgInfo --- NOT_VIEW");

        prescriptMap = {
          msgType: noticeMsgInfo?.type == "PRESCRIPTION_NOTICE" ? 2 : 3,
          id: noticeMsgInfo.id,
          consultationSheetId: noticeMsgInfo.consultationSheetId,
          fromtype: 2,
          content: noticeMsgInfo.content,
          time: noticeMsgInfo?.createTime,
        };
      }
      if (
        val[groupId]?.unreadMessageCount &&
        chatMsgType.includes(val[groupId].messageType)
      ) {
        msgMap = {
          doctorAvatarUrl: doctorAvatarUrl,
          doctorUserName: doctorUserName,
          msgType: 1,
          id: val[groupId].messageUId,
          time: val[groupId]?.time,
        };
      }
      const param = { PRESCRIPTION: prescriptMap, NEWCHAT: msgMap };
      console.log("医疗tab-param --- param:", param);
      this.setlastMessInfo(param);
      console.log("医疗tab-lastMesInfo --- lastMesInfo:", this.lastMesInfo);
      //埋点
      if (
        this.lastMesInfo["PRESCRIPTION"].id &&
        this.lastMesInfo["NEWCHAT"].id
      ) {
        if (
          this.lastMesInfo["PRESCRIPTION"].time >
          this.lastMesInfo["NEWCHAT"].time
        ) {
          display_report({
            display_name: "consultation_main_message_show",
            object_type: module_name,
            extend: {
              type:
                noticeMsgInfo?.type == "PRESCRIPTION_NOTICE"
                  ? "PRESCRIPTION_NOTICE"
                  : "PRESCRIPTION_EXPIRED_PRE_NOTICE",
            },
          });
        } else {
          display_report({
            display_name: "consultation_main_message_show",
            object_type: module_name,
            extend: {
              type: "NEW_CHAT",
            },
          });
        }
      } else {
        if (
          this.lastMesInfo["PRESCRIPTION"].id &&
          !this.lastMesInfo["NEWCHAT"].id
        ) {
          display_report({
            display_name: "consultation_main_message_show",
            object_type: module_name,
            extend: {
              type:
                noticeMsgInfo?.type == "PRESCRIPTION_NOTICE"
                  ? "PRESCRIPTION_NOTICE"
                  : "PRESCRIPTION_EXPIRED_PRE_NOTICE",
            },
          });
        } else {
          display_report({
            display_name: "consultation_main_message_show",
            object_type: module_name,
            extend: {
              type: "NEW_CHAT",
            },
          });
        }
      }
    },
    handleToTop() {
      action_report({
        action_name: "consultation_main_top_clk",
        module_name: module_name,
      });
      this.scrollTop = this.old.scrollTop;
      setTimeout(() => {
        this.$nextTick(() => {
          this.scrollTop = 0;
        });
      }, 150);
    },
    showToast() {
      this.$refs.uToast.show({
        type: "default",
        icon: false,
        message: "医生忙碌中",
      });
    },
    goLogin() {
      uni.navigateTo({
        url: "/pagesD/login/index",
      });
    },
    // 查询最后一条问诊单信息
    async getTheLastSheetInfo() {
      const token = this.userInfo.token;
      if (!token) return;
      const res = await GET_IN_SERVICE_LAST();
      this.aisheetlistState = res.data.state;
    },
    //获取初始化定位信息
    toAsk(item) {
      console.log("toAsk:", item);
      let type = item.type;
      let _index = this.entrInfo.findIndex((item, index) => item.type == type);
      action_report({
        action_name: "consultation_main_diamondposit_clk",
        module_name: module_name,
        extend: {
          position: _index + 1,
        },
      });

      // #ifdef MP-WEIXIN
      console.log("toAsk:", item);
      const typeList = [
        "QUICK",
        "EXPERT",
        "ONLINE_PRESCRIPTION",
        "REPORT_INTERPRETATION",
        "NUTRITION",
      ];
      if (typeList.includes(item.type)) {
        if (item.type === "EXPERT") {
          action_report({
            action_name: "onlineconsultation_expert_click",
            module_name: module_name,
            extend: {
              user_id: this.userInfo?.userId,
            },
          });
        }
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
        return;
      }
      // #endif
      this.inquiryTypeForPop = type;
      console.log("查询是否有正在进行的问诊单", this.serviceSheetsList.length);
      if (!this.userInfo.token) {
        this.goLogin();
      } else {
        if (
          type !== "ONLINE_PRESCRIPTION" &&
          type !== "CUTE_PET_CONSULTATION" &&
          type !== "EAT" &&
          type !== "YUYUEXIMEI" &&
          type !== "AI_INQUIRY"
        ) {
          if (this.serviceSheetsList.length) {
            this.isShowGoTo = true;
            return;
          }
        } else if (type === "AI_INQUIRY") {
          // let sheetListLength = 0;
          this.setSelectPetItem({});
          // this.getTheLastSheetInfo();
          if (this.aisheetlistState === -1 || this.aisheetlistState === 1) {
            this.isShowGoTo = true;
            return;
          }
        }

        if (item?.jumpType == 2) {
          //webview外链跳转
          let path = item.jumpUrl;
          if (path.indexOf("http") !== -1) {
            let newRoute = "";
            if (path.indexOf("h5/shareActivity/?random=123#") > -1) {
              newRoute = path.replace("h5/shareActivity/?random=123#", "#");
            } else if (path.indexOf("h5/shareActivity/?random=123/#/") > -1) {
              newRoute = path.replace("h5/shareActivity/?random=123/#/", "#/");
            } else if (path.indexOf("h5/shareActivity/?random=123") > -1) {
              newRoute = path.replace("h5/shareActivity/?random=123/", "");
            }
            let str = `/pagesA/webView/index?route=${encodeURIComponent(
              newRoute
            )}&type=icon`;
            console.log("str", newRoute);
            return uni.navigateTo({
              url: str,
            });
          } else {
            return uni.navigateTo({
              url: path,
            });
          }
        } else {
          if (type == "QUICK") {
            console.log('QUICK');
            
            //快速问诊
            // 1 直接问 2 有优惠券 3 啥也没有
            CAN_I_ASK_V2(type)
              .then((res) => {
                // this.$uma.trackEvent("quick_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                wxBurying({
                  appletsOpenId: this.userInfo.openId,
                  businessType: "APPLETS_MED_QUICKSTART",
                  appletsType: "WECHAT_MED",
                });
                if (res.data == 1) {
                  //没有宠物，跳转添加宠物
                  if (this.petList.length === 1 || !this.userSelectedPetId) {
                    uni.navigateTo({
                      url: "/pagesD/petInfo/index?transparentTopBar=1",
                    });
                    return;
                  }
                  // 通过企微进入，跳转到指定链接
                  if (uni.getStorageSync("aientry")) {
                    uni.navigateTo({
                      url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=QUICK&aientry=true`,
                    });
                  } else {
                    uni.navigateTo({
                      url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=QUICK`,
                    });
                  }
                } else if (res.data == 2) {
                  //请求优惠券数据
                  GET_RESOURCE_LIST_IN_POP(type).then((resCoupon) => {
                    this.couponCommendList = resCoupon.data;
                    this.isCouponShow = true;
                  });
                } else {
                  this.isInviteShow = true;
                }
              })
              .catch((err) => {
                console.log("err", err.message);
                this.toastContent = err.message;
                this.isShowSelfToast = true;
                setTimeout(() => {
                  this.isShowSelfToast = false;
                }, 2000);
              });
          } else if (type == "EXPERT") {
            //专家
            CAN_I_ASK_V2(type)
              .then((res) => {
                // this.$uma.trackEvent("professional_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                wxBurying({
                  appletsOpenId: this.userInfo.openId,
                  businessType: "APPLETS_MED_MASTERSTART",
                  appletsType: "WECHAT_MED",
                });
                console.log("CAN_I_ASK_V2", res);
                if (res.data == 1) {
                  //没有宠物，跳转添加宠物
                  if (this.petList.length === 1 || !this.userSelectedPetId) {
                    uni.navigateTo({
                      url: "/pagesD/petInfo/index?transparentTopBar=1",
                    });
                    return;
                  }
                  uni.navigateTo({
                    url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=EXPERT`,
                  });
                } else if (res.data == 2) {
                  //请求优惠券数据
                  GET_RESOURCE_LIST_IN_POP(type).then((resCoupon) => {
                    this.couponCommendList = resCoupon.data;
                    this.isCouponShow = true;
                  });
                } else {
                  this.isInviteShow = true;
                  uni.navigateTo({
                    url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=EXPERT&resourceType=CHARGE`,
                  });
                }
              })
              .catch((err) => {
                console.log("err", err.message);
                this.toastContent = err.message;
                this.isShowSelfToast = true;
                setTimeout(() => {
                  this.isShowSelfToast = false;
                }, 2000);
              });
          } else if (type == "ONLINE_PRESCRIPTION") {
            //在线开药
            uni.navigateTo({
              url: `/pagesB/prescribe/index?petId=${this.userSelectedPetId}`,
            });
          } else if (type == "REPORT_INTERPRETATION") {
            //报告解读
            CAN_I_ASK_V2(type)
              .then((res) => {
                // this.$uma.trackEvent("quick_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                wxBurying({
                  appletsOpenId: this.userInfo.openId,
                  businessType: "APPLETS_MED_QUICKSTART",
                  appletsType: "WECHAT_MED",
                });
                if (res.data == 1) {
                  //没有宠物，跳转添加宠物
                  if (this.petList.length === 1 || !this.userSelectedPetId) {
                    action_report({
                      action_name:
                        "Intelligentconsultation_Intelligentconsultation(add_pet)_click",
                      module_name: "ai_consultation",
                      extend: {
                        source:
                          uni.getStorageSync("umt_extend").umt_code ||
                          uni.getStorageSync("shareType"),
                      },
                    });
                    uni.navigateTo({
                      url: "/pagesD/petInfo/index?transparentTopBar=1",
                    });
                    return;
                  }
                  uni.navigateTo({
                    url:
                      "/pagesA/reportInterpretation/index?petId=" +
                      this.userSelectedPetId,
                  });
                } else if (res.data == 2) {
                  console.log("需要券");
                  return;
                } else {
                  this.isInviteShow = true;
                }
              })
              .catch((err) => {
                console.log("err", err.message);
                this.toastContent = err.message;
                this.isShowSelfToast = true;
                setTimeout(() => {
                  this.isShowSelfToast = false;
                }, 2000);
              });
          } else if (type == "CUTE_PET_CONSULTATION") {
            //萌宠咨询
            uni.navigateTo({
              url: "/pagesA/chatPageAi/index",
            });
          } else if (type == "NUTRITION") {
            //营养问诊
            CAN_I_ASK_V2(type)
              .then((res) => {
                // this.$uma.trackEvent("nutri_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                wxBurying({
                  appletsOpenId: this.userInfo.openId,
                  businessType: "APPLETS_MED_NUTRITIONSTART",
                  appletsType: "WECHAT_MED",
                });
                if (res.data == 1) {
                  //没有宠物，跳转添加宠物
                  if (this.petList.length === 1 || !this.userSelectedPetId) {
                    uni.navigateTo({
                      url: "/pagesD/petInfo/index?transparentTopBar=1",
                    });
                    return;
                  }
                  uni.navigateTo({
                    url: `/pagesA/nutritionDesc/index?petId=${this.userSelectedPetId}&inquiryType=NUTRITION`,
                  });
                } else if (res.data == 2) {
                  //请求优惠券数据
                  GET_RESOURCE_LIST_IN_POP(type).then((resCoupon) => {
                    this.couponCommendList = resCoupon.data;
                    this.isCouponShow = true;
                  });
                } else {
                  this.isInviteShow = true;
                }
              })
              .catch((err) => {
                console.log("err", err.message);
                this.toastContent = err.message;
                this.isShowSelfToast = true;
                setTimeout(() => {
                  this.isShowSelfToast = false;
                }, 2000);
              });
          } else if (type === "YUYUEXIMEI") {
            //预约美洗
            uni.navigateTo({
              url: `/pagesB/submitReservation/index`,
            });
          } else if (type === "AI_INQUIRY") {
            action_report({
              action_name: "onlineconsultation_Intelligentconsultation_click",
              module_name: "ai_consultation",
              extend: {
                source:
                  uni.getStorageSync("umt_extend").umt_code ||
                  uni.getStorageSync("shareType"),
              },
            });
            //没有宠物，跳转添加宠物
            if (this.petList.length === 1 || !this.userSelectedPetId) {
              uni.navigateTo({
                url: "/pagesD/petInfo/index?type=AI_INQUIRY&nopet=nopet&transparentTopBar=1",
              });
              return;
            } else {
              this.isGoToAI();
            }
            console.log("跳转智能问诊");
          }
        }
      }
    },
    async handleOpenSetting() {
      // const { latitude, longitude } = await this.getProgramLocation();
      // 授权 和 获取定位
      const { latitude, longitude } = await getAuthLocation();
      this.searchLocation({
        lon: longitude,
        lat: latitude,
      });
      console.log("lat", latitude, "lon", longitude);
      uni.setStorageSync("medicine_openSetting_first", true);
      this.opensetting = true;
      if (!latitude) {
        return;
      }
      uni.setStorageSync("lon", longitude);
      uni.setStorageSync("lat", latitude);
    },
    getProgramLocation() {
      let _this = this;
      return new Promise((resolves, reject) => {
        uni.authorize({
          scope: "scope.userLocation",
          success(res) {
            uni.getLocation({
              type: "gcj02", //设置type为gcj02
              isHighAccuracy: true,
              success: function (res) {
                let data = {
                  lon: res.longitude,
                  lat: res.latitude,
                };

                _this.searchLocation(data);
                // that.location = false;
                resolves(res);
              },
              fail: (error) => {
                // if (this.location) {
                //   uni.setStorageSync("city", "北京市");
                //   uni.setStorageSync("cityCode", 110100);
                // } else {
                //   uni.setStorageSync("city", this.$store.state.city);
                //   this.city = this.$store.state.city;
                // }
                console.log("获取定位失败了", error);
              },
            });
          },
          fail(err) {
            console.log("获取定位失败了", err);
            reject(err);
          },
        });
      });
    },
    getLocation() {
      let that = this;
      uni.getLocation({
        type: "gcj02", //设置type为gcj02
        isHighAccuracy: true,
        success: function (res) {
          let data = {
            lon: res.longitude,
            lat: res.latitude,
          };

          that.searchLocation(data);
          uni.setStorageSync("lon", res.longitude);
          uni.setStorageSync("lat", res.latitude);
          that.location = false;
          console.log("当前位置的经度：" + res.longitude);
          console.log("当前位置的纬度：" + res.latitude);
        },
        fail: (error) => {
          if (that.location) {
            uni.setStorageSync("city", "北京市");
            uni.setStorageSync("cityCode", 110100);
          } else {
            uni.setStorageSync("city", this.$store.state.city);
            this.city = this.$store.state.city;
          }
          console.log("获取定位失败了", error);
        },
      });
    },

    //根据经纬度查取地区
    async searchLocation(data) {
      const res = await searchUserLocation({ data });
      this.city = res.data.city;
      // let cityCode = res.data.adcode.slice(0, 4) + "00";
      let cityCode = res.data.adcode.slice(0, 4);
      console.log("city", cityCode);
      uni.setStorageSync("city", res.data.city);
      uni.setStorageSync("cityCode", cityCode);
      this.$store.commit("setCity", res.data.city);
      uni.setStorageSync("currentCity", res.data.city);
      // this.onloadComponents();
      this.handleLocation(data.lat, data.lon, cityCode);
    },
    async getTopShop(lat, lng, cityCode) {
      // 顶部店铺信息
      console.log("get top shop");
      return GET_TOP_SHOP({
        lat,
        lng,
        cityCode,
      });
    },
    async getShopDetail(shopId, closet) {
      console.log("get shop detail: ", shopId);
      try {
        //根据选中门店id查询信息
        const latitude = uni.getStorageSync("lat");
        const longitude = uni.getStorageSync("lon");
        const res = await shopDetail({
          currentLat: latitude,
          currentLng: longitude,
          shopId: shopId,
        });
        console.log("shop detail: ", res.data.data);
        this.topShop = res.data.data;
        this.closet = closet;
      } catch (err) {
        console.log(err);
      }
    },
    //获取宠物列表
    async getPetList(type) {
      try {
        const res = await GET_PET_LIST({
          userId: this.userInfo.userId,
        });
        //全局维护一份宠物信息，用来在医生列表内咨询
        this.petList = res.data.concat([{ type: "add" }]); //用于添加按钮
        this.setUserPetList(res.data.concat([{ type: "add" }]));
        if (res.data.length && !this.userSelectedPetId) {
          console.log("进入设置");
          this.selectedPetId = res.data[0].id;
          this.setUserSelectedPetId(res.data[0].id);
          uni.setStorageSync("petselectedid", res.data[0].id);
          this.isSelectedPetExotic = ![1, 50].includes(
            res.data[0].petCategoryId
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取问诊单
    async getSheetsListMethod() {
      if (!this.userInfo.token) return;
      const res = await getSheetsList();
      console.log(res, "获取问诊单");
      try {
        if (
          res.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length &&
          (res.data.data[0].state == 1 || res.data.data[0].state == -1)
        ) {
          this.$store.commit("setServiceSheetsList", [res.data.data[0]]);
        } else {
          this.$store.commit("setServiceSheetsList", []);
        }
        console.log("serviceList[0]", this.$store.state.serviceSheetsList);
        // 目前只有一个服务中的问诊单
        // res.data.data[0] &&
        //   store.state.ryConnectStatus &&
        //   getLastMes(res.data.data[0].groupId);
      } catch (error) {
        console.error("获取服务中的问诊单", error);
      }
    },
    //获取医生列表
    async getDocList() {
      if (this.isFinished) return;
      let params = {
        cityCode: uni.getStorageSync("cityCode") || "",
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      try {
        const res = await GET_DOC_LIST(params);
        if (Array.isArray(res.data.data) && res.data.data.length) {
          this.docList = res.data.data.slice(0, 20);
        }
      } catch (error) {}
    },
    //滚动到底
    scrolltolower() {
      console.log("到底");
      if (!this.isFinished && this.userInfo.token) {
        this.pageNo += 1;
        this.getDocList();
      }
    },

    myPullDownRefresh() {
      this.pageNo = 1;
      this.isFinished = false;
      var that = this;
      this.triggered = true;
      if (this.userInfo.token) {
        console.log("已登陆");
        if (!uni.getStorageSync("city")) {
          try {
            // this.getLocation();
          } catch (error) {}
        }
        this.city = uni.getStorageSync("city") || "北京市";
        this.getPetList();
        this.handleMessage(this.lastSheetsMessage);
        // this.getSheetInService();
        this.refreshTopShop();
      }
      GET_BANNER_INFO({
        key: "BANNER_ONLINE_CONSULTATION_HOME_APPLE",
        cityCode: uni.getStorageSync("cityCode"),
      }).then((res) => {
        this.bannerList = res.data;
      });
      this.getDocList(this.pageNo, this.pageSize);
      this.getEntrInfo();
      setTimeout(function () {
        that.triggered = false;
      }, 1000);
    },
    closeNotice() {
      this.opensetting = true;
    },
    //首页信息
    async getEntrInfo() {
      try {
        // #ifdef MP-WEIXIN
        const res = await ENTRY_CONFIG({ source: "WECHAT_XCX" });
        // #endif
        // #ifdef H5
        const res = await ENTRY_CONFIG({ source: "" });
        // #endif
        this.entrInfo = res.data;
        console.log("list: ", this.entrInfo);
      } catch (error) {}
    },
    handleCouponClose() {
      this.isCouponShow = false;
      this.isInviteShow = false;
    },
    handleGetAddressList() {
      let that = this;
      getAddressList().then((res) => {
        if (res.data.data.length) {
          that.setAddressId(
            res.data.data.find((i) => i.defaultFlag)?.userAddressStrId
          );
        }
      });
    },
    async docAsk(item) {
      //首页医生列表-问医生
      if (!this.userInfo.token) {
        this.goLogin();
      }
      action_report({
        action_name: "consultation_main_askdoctor_clk",
        module_name: module_name,
        extend: {
          id: item.userId,
        },
      });
      // // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      return;
      // // #endif
      this.doctorUserId = item.userId;
      if (this.serviceSheetsList.length) {
        this.isShowGoTo = true;
        return;
      }
      this.inquiryTypeForPop = "EXPERT";
      try {
        const res = await GET_ONLINE_STATUS(this.doctorUserId);
        if (res.data) {
          const param = {
            inquiryType: "EXPERT",
            source: "WECHAT_XCX",
          };

          //#ifdef H5
          param.source = this.$dsBridge.call("getAppInfo", "os");
          // #endif

          originCheckUserQualification(param, "v2")
            .then((res) => {
              if (res.data == 1) {
                if (this.userPetList.length === 1) {
                  uni.navigateTo({
                    url: `/pagesD/petInfo/index?doctorUserId=${this.doctorUserId}`,
                  });
                  return;
                }
                uni.navigateTo({
                  url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=EXPERT&doctorUserId=${item.userId}`,
                });
              } else if (res.data == 2) {
                //请求优惠券数据
                GET_RESOURCE_LIST_IN_POP("EXPERT").then((resCoupon) => {
                  this.couponCommendList = resCoupon.data;
                  this.isCouponShow = true;
                });
              } else {
                this.isInviteShow = true;
              }
            })
            .catch((err) => {
              console.log("err", err.message);
              this.toastContent = err.message;
              this.isShowSelfToast = true;
              setTimeout(() => {
                this.isShowSelfToast = false;
              }, 2000);
            });
        } else {
          return this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "当前医生已下班，请更换医生进行问诊",
          });
        }
      } catch (error) {}
    },

    async refreshTopShop() {
      // 只有没有店铺数据时，才刷新
      console.log("refresh top shop");
      if (this.topShop == null && this.opensetting) {
        const cityCode = uni.getStorageSync("cityCode");
        const lat = uni.getStorageSync("lat");
        const lon = uni.getStorageSync("lon");
        const auth = await checkLocationAuth();
        if (auth) {
          this.getProgramLocation();
        } else if (cityCode && lat && lon) {
          this.handleLocation(lat, lon, cityCode);
        }
      }
    },
    async handleLoginResult(token, loc = false) {
      // 不为空时，是登录成功
      console.log("login result: ", token);
      if (token) {
        // 获取定位，然后 获取结果
        try {
          const auth = await checkLocationAuth();
          console.log(`location auth: ${auth}`);
          if (this.opensetting) {
            if (loc && auth) {
              this.getProgramLocation();
            } else {
              const cityCode = uni.getStorageSync("cityCode");
              const lat = uni.getStorageSync("lat");
              const lon = uni.getStorageSync("lon");
              if (cityCode && lat && lon) {
                this.handleLocation(lat, lon, cityCode);
              } else if (auth) {
                this.getProgramLocation();
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    // 处理定位成功回调，获取接口
    async handleLocation(lat, lng, cityCode) {
      console.log(
        `handle location lat:${lat}, lng:${lng}, cityCode:${cityCode}`
      );
      try {
        const res = await this.getTopShop(lat, lng, cityCode);
        console.log(`get top shop: ${res.data.data}`);
        // 设置
        if (res.data.data) {
          this.topShop = res.data.data;
          this.closet = false;
          console.log("shop: ", this.topShop);
        }
      } catch (err) {
        console.log(err);
      }
    },
    //进入我的宠物
    toMyPet() {
      if (!this.userInfo.token) {
        this.goLogin();
        return;
      }
      // if (this.petList.length === 0) {
      //   action_report({
      //     action_name: "Intelligentconsultation_add_pet_click",
      //     module_name: "ai_consultation",
      //   });
      //   uni.navigateTo({
      //     url: "/pagesD/petInfo/index",
      //   });
      //   return;
      // }
      action_report({
        action_name: "consultation_main_mypet_clk",
        module_name: module_name,
      });
      uni.navigateTo({
        url: `/pagesA/caseDetail/index?petId=` + this.userSelectedPetId,
      });
    },
    //
    handlePrivacyClose() {
      // uni.showTabBar();
    },

    testRouter1() {
      uni.navigateTo({
        url: "/pagesD/inquiryOrderSubmit/index",
      });
    },
    testRouter2() {
      uni.navigateTo({
        url: "/pagesD/inquiryOrderDetail/index",
      });
    },
    // 能否智能问诊判断
    async isGoToAI() {
      const res = await isGoToAIApi();
      console.log("==============================", res);
      this.isGoToAiList = res.data;
      if (this.isGoToAiList.result == 0) {
        if (this.isGoToAiList.buttons == null) {
          this.isGoToAiList.buttons = [];
        }
        uni.navigateTo({
          url: `/pagesF/aiConsultation/index?petId=${this.userSelectedPetId}&inquiryType=AI_INQUIRY`,
        });
        this.setJumpModelShow(2);
      } else {
        this.isShowGoToAi = true;
      }
    },
    skinToCust() {
      uni.navigateTo({
        url: "plugin://myPlugin/chat",
      });
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
