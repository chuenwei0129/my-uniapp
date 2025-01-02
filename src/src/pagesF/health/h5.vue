<template>
  <view class="dad-wrapper" ref="dadRef">
    <!-- #ifdef MP-WEIXIN -->
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="top-bar">
        <!-- 'top-bar', -->
        <view class="avatar" @click="toMyPet">
          <template v-if="userInfo.token && petList[jumpIndex].avatarUrl">
            <image :src="petList[jumpIndex].avatarUrl" mode="scaleToFill" />
          </template>
          <template v-else>
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/defaultavatar.png"
              mode="scaleToFill"
            />
          </template>
        </view>
        <view class="petname" @click="toMyPet">{{
          !userInfo.token ? "未登录" : "我的宠物"
        }}</view>
        <view class="tb-title">宠胖胖</view>
      </view>
    </view>
    <view class="notice-msg" v-if="userInfo.token && !opensetting">
      <view class="iconfont icon-address indexaddressicon"></view>
      <view>开启定位，方便查找附近门店</view>
      <view class="openbtn" @click="handleOpenSetting">开启</view>
      <view
        class="iconfont icon-closeMark notice-close"
        @click="closeNotice"
      ></view>
    </view>
    <!-- #endif -->

    <scroll-view
      class="scroll-wrap"
      @scroll="handleScroll"
      :scroll-top="scrollTop"
      scroll-y="true"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      @refresherrefresh="myPullDownRefresh"
    >
      <!-- #ifdef H5 -->

      <view class="h5-header"> </view>
      <!-- #endif -->
      <view class="scroll-body">
        <TopShop
          v-if="userInfo.token && opensetting && topShop"
          :shop="topShop"
          :closet="closet"
        />

        <view class="entry-wrap">
          <view class="top-entry">
            <view class="doctor-title">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/online-doctor-title.png"
                style="width: 154rpx"
                mode="widthFix"
              />
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/online-doctor-desc.png"
                style="margin-top: 5rpx; width: 419rpx; height: 33rpx"
                mode="scaleToFill"
              />
            </view>
            <view class="itemwrap">
              <view
                class="entryitem"
                @click="toAsk(item)"
                v-for="(item, index) in entrInfo.slice(0, 2)"
                :key="index"
              >
                <view class="entrytag" v-if="item.cornerMarkText">{{
                  item.cornerMarkText
                }}</view>
                <view class="entryicon"
                  ><image :src="item.iconUrl" mode="scaleToFill"
                /></view>
                <view class="desccontent">
                  <view class="entryname">{{ item.name }}</view>
                  <view class="des">{{ item.introduction }}</view>
                  <view class="des subdesc">{{ item.serviceTimeDesc }}</view>
                </view>
              </view>
            </view>
          </view>
          <!-- #ifdef MP-WEIXIN -->
          <view class="bottom-entry">
            <view
              :class="['entryicon', `${item.type}-entry`]"
              v-for="(item, index) in entrInfo.slice(2)"
              @click="toAsk(item)"
              :key="index"
            >
              <view class="icon">
                <image :src="item.iconUrl" mode="scaleToFill" />
              </view>
              <view class="name">{{ item.name }}</view>
            </view>
          </view>
          <!-- #endif -->
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="banner-wrapper" v-if="bannerList.length">
          <Banner :banner-list="bannerList" />
        </view>
        <!-- #endif -->

        <view class="record-wrapper">
          <view class="record-title">我的记录</view>
          <view class="my-entrance">
            <view class="my-ask entranceitem" @click="toMyAsk">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/myask.png"
                mode="scaleToFill"
              />
              <view class="my-text">我的问诊</view>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <view
              class="my-prescription entranceitem"
              @click="toMyPrescription"
            >
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/myprescription.png"
                mode="scaleToFill"
              />
              <view class="my-text">我的处方</view>
            </view>
            <!-- #endif -->

            <view class="my-order entranceitem" @click="toMyOrder">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/myorder.png"
                mode="scaleToFill"
              />
              <view class="my-text">我的订单</view>
            </view>

            <!-- #ifdef MP-WEIXIN -->
            <view class="my-card entranceitem" @click="toMyReservation">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/myreservation.png"
                mode="scaleToFill"
              />
              <view class="my-text">我的预约</view>
            </view>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <view class="my-card entranceitem" @click="handleGoPetList">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/pet1-c.png"
                mode="scaleToFill"
              />
              <view class="my-text">我的宠物</view>
            </view>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <view class="my-card entranceitem" @click="handleGoAddress">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/address1-c.png"
                mode="scaleToFill"
              />
              <view class="my-text">我的地址</view>
            </view>
            <!-- #endif -->
          </view>
          <template
            v-if="lastMesInfo['PRESCRIPTION'].id && lastMesInfo['NEWCHAT'].id"
          >
            <template
              v-if="
                lastMesInfo['PRESCRIPTION'].time > lastMesInfo['NEWCHAT'].time
              "
            >
              <view
                class="notice"
                @click="viewNotice(lastMesInfo['PRESCRIPTION'])"
              >
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/notice.png"
                  mode="scaleToFill"
                  class="avatar"
                />
                <view class="msg">{{
                  lastMesInfo["PRESCRIPTION"].content
                }}</view>
                <view class="go-detailbtn">查看</view>
              </view>
            </template>
            <template v-else>
              <view class="notice" @click="continueSheet">
                <image
                  :src="lastMesInfo['NEWCHAT'].doctorAvatarUrl"
                  mode="scaleToFill"
                  class="avatar"
                />
                <view class="msg"
                  >{{
                    lastMesInfo["NEWCHAT"].doctorUserName
                  }}医生有新回复~</view
                >
                <view class="go-detailbtn">查看</view>
              </view>
            </template>
          </template>
          <template
            v-if="lastMesInfo['PRESCRIPTION'].id && !lastMesInfo['NEWCHAT'].id"
          >
            <view
              class="notice"
              @click="viewNotice(lastMesInfo['PRESCRIPTION'])"
            >
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/notice.png"
                mode="scaleToFill"
                class="avatar"
              />
              <view class="msg">{{ lastMesInfo["PRESCRIPTION"].content }}</view>
              <view class="go-detailbtn">查看</view>
            </view>
          </template>
          <template
            v-if="!lastMesInfo['PRESCRIPTION'].id && lastMesInfo['NEWCHAT'].id"
          >
            <view class="notice" @click="continueSheet">
              <image
                :src="lastMesInfo['NEWCHAT'].doctorAvatarUrl"
                mode="scaleToFill"
                class="avatar"
              />
              <view class="msg"
                >{{ lastMesInfo["NEWCHAT"].doctorUserName }}医生有新回复~</view
              >
              <view class="go-detailbtn">查看</view>
            </view>
          </template>
        </view>
        <DocList
          :has-login="userInfo.token"
          :doc-list="docList"
          @docAsk="docAsk"
          @showtoast="showToast"
          :pet-list="petList"
        ></DocList>
        <view style="margin-top: 1rpx; height: 38rpx"></view>
      </view>
    </scroll-view>
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
    <InvitePop :isOpen.sync="isInviteShow" @close="handleCouponClose" />
    <GoToChatPage :show.sync="isShowGoTo"></GoToChatPage>
    <PrivacyPop
      :isOpen.sync="isShowPrivacy"
      :protocol="protocol"
      source="med"
      @close="handlePrivacyClose"
    ></PrivacyPop>
    <view class="toast-body" v-if="isShowSelfToast">
      {{ toastContent }}
    </view>
  </view>
</template>

<script>
import TopShop from "./components/topShop/topShop.vue";
import DocList from "./components/docList/docList.vue";
import Banner from "./components/banner/index.vue";
import CouponChoosePop from "@/components/couponChoosePop/index.vue";
import GoToChatPage from "@/components/goToChatPage/index.vue";
import InvitePop from "@/components/invitePop/index.vue";
import PrivacyPop from "@/components/privacyPop/index.vue";

//import { wxShareMethod } from "@/utils/wxShare";
import { checkLocationAuth, getAuthLocation } from "../../utils/location";
import { mapState, mapMutations } from "vuex";
import {
  searchUserLocation,
  wxBurying,
  getAddressList,
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
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // onShareAppMessage(res) {
  //   return {
  //     title: "在线问诊，限时免费",
  //     path: "/pages/index/index?aientry=true",
  //     imageUrl:
  //       "https://frontend-cdn.chongpangpang.com/image/medical-mp/share/share-img-logo.png",
  //     desc: "在线问诊，限时免费",
  //   };
  // },
  // #endif
  components: {
    TopShop,
    DocList,
    CouponChoosePop,
    Banner,
    InvitePop,
    GoToChatPage,
    PrivacyPop,
  },
  data() {
    return {
      opensetting: uni.getStorageSync("medicine_openSetting_first"),
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
      isShowGoTo: false,
      showTopIcon: false,
      statusBarHeight: "",
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
      lastMesInfo: {
        PRESCRIPTION: {
          id: "",
          consultationSheetId: "",
          doctorAvatarUrl: "",
          doctorUserName: "",
          read: "",
          content: "",
          time: "",
          fromtype: 1, //1融云消息 2接口
          msgType: 0, //1 会话消息 2 开具处方单 3 处方单即将过期
        },
        NEWCHAT: {
          id: "",
          consultationSheetId: "",
          doctorAvatarUrl: "",
          doctorUserName: "",
          read: "",
          content: "",
          time: "",
          fromtype: 1, //1融云消息 2接口
          msgType: 0, //1 会话消息 2 开具处方单 3 处方单即将过期
        },
      },
      topShop: null,
      closet: false,
      isShowPrivacy: false,
      protocol:
        "若您确认点击同意，表示您已同意宠胖胖收集你的手机号用于注册登录账号、收集你选中的照片或视频、你选中的文件用于问诊过程中上传图片方便医生诊断与病情沟通、获取你选择的位置信息，用于快速添加收货地址、读取你的剪切板用于快捷复制内容",
      toastContent: "",
      isShowSelfToast: false,
    };
  },
  computed: {
    ...mapState([
      "userInfo",
      "userSelectedPetId",
      "userPetList",
      "lastSheetsMessage",
      "serviceSheetsList",
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
        //清空
        // this.$set(this.lastMesInfo['PRESCRIPTION'], 'id', '');
        // this.$set(this.lastMesInfo['NEWCHAT'], 'id', '');
        console.log("消息处理处理====", this.lastMesInfo);
      },
      deep: true,
      immediate: false,
    },
  },
  onLoad(option) {
    if (option.previousUserId) {
      uni.setStorageSync("previousUserId", option.previousUserId);
    }

    // #ifdef MP-WEIXIN
    wx.getPrivacySetting({
      success: (res) => {
        console.log(res); // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
        if (res.needAuthorization) {
          // 需要弹出隐私协议
          uni.hideTabBar();
          this.isShowPrivacy = true;
        } else {
          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
          // wx.getUserProfile()
          // wx.chooseMedia()
          // wx.getClipboardData()
          // wx.startRecord()
        }
      },
      fail: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
    // #endif

    if (this.userInfo.token) {
    }

    // 登录状态，首次定位获取店铺信息
    this.handleLoginResult(this.userInfo.token, true);
  },
  onReady() {},
  onShow() {
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
    ...mapMutations(["setUserSelectedPetId", "setUserPetList", "setAddressId"]),
    handleScroll(e) {
      this.old.scrollTop = e.detail.scrollTop;
      this.showTopIcon = e.target.scrollTop > 500;
    },
    handleMessage: async function (val) {
      let noticeMsgInfo = {};
      const res = await GET_NOTICE_INFO();
      noticeMsgInfo = res?.data || {};
      const { data } = await GET_IN_SERVICE_LAST({});
      const { groupId, doctorAvatarUrl, doctorUserName } = data;
      if (noticeMsgInfo?.status == "NOT_VIEW") {
        this.$set(
          this.lastMesInfo["PRESCRIPTION"],
          "msgType",
          noticeMsgInfo?.type == "PRESCRIPTION_NOTICE" ? 2 : 3
        );
        this.$set(this.lastMesInfo["PRESCRIPTION"], "id", noticeMsgInfo.id);
        this.$set(
          this.lastMesInfo["PRESCRIPTION"],
          "consultationSheetId",
          noticeMsgInfo.consultationSheetId
        );
        this.$set(this.lastMesInfo["PRESCRIPTION"], "fromtype", 2);
        this.$set(
          this.lastMesInfo["PRESCRIPTION"],
          "content",
          noticeMsgInfo.content
        );
        this.$set(
          this.lastMesInfo["PRESCRIPTION"],
          "time",
          noticeMsgInfo?.createTime
        );
      } else {
        this.$set(this.lastMesInfo["PRESCRIPTION"], "id", "");
      }
      if (
        val[groupId]?.unreadMessageCount &&
        chatMsgType.includes(val[groupId].messageType)
      ) {
        this.$set(
          this.lastMesInfo["NEWCHAT"],
          "doctorAvatarUrl",
          doctorAvatarUrl
        );
        this.$set(
          this.lastMesInfo["NEWCHAT"],
          "doctorUserName",
          doctorUserName
        );
        this.$set(this.lastMesInfo["NEWCHAT"], "msgType", 1);
        this.$set(this.lastMesInfo["NEWCHAT"], "id", val[groupId].messageUId);
        this.$set(this.lastMesInfo["NEWCHAT"], "time", val[groupId]?.time);
      } else {
        this.$set(this.lastMesInfo["NEWCHAT"], "id", "");
      }
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
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
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
    //获取初始化定位信息
    toAsk: debounce(function (item) {
      let type = item.type;
      let _index = this.entrInfo.findIndex((item, index) => item.type == type);
      this.inquiryTypeForPop = type;

      if (!this.userInfo.token) {
        this.goLogin();
      } else {
        if (
          type !== "ONLINE_PRESCRIPTION" &&
          type !== "CUTE_PET_CONSULTATION" &&
          type !== "EAT"
        ) {
          if (this.serviceSheetsList.length) {
            this.isShowGoTo = true;
            return;
          }
        }

        // #ifdef MP-WEIXIN
        action_report({
          action_name: "consultation_main_diamondposit_clk",
          module_name: module_name,
          extend: {
            position: _index + 1,
          },
        });
        // #endif

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
            //快速问诊
            // 1 直接问 2 有优惠券 3 啥也没有
            CAN_I_ASK_V2(type)
              .then((res) => {
                // #ifdef MP-WEIXIN
                // this.$uma.trackEvent("quick_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                // #endif

                wxBurying({
                  appletsOpenId: this.userInfo.openId,
                  businessType: "APPLETS_MED_QUICKSTART",
                  appletsType: "WECHAT_MED",
                });
                if (res.data == 1) {
                  //没有宠物，跳转添加宠物
                  if (this.petList.length === 1 || !this.userSelectedPetId) {
                    uni.navigateTo({
                      url: "/pagesD/petInfo/index&transparentTopBar=1",
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
                // #ifdef MP-WEIXIN
                // this.$uma.trackEvent("professional_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                // #endif

                wxBurying({
                  appletsOpenId: this.userInfo.openId,
                  businessType: "APPLETS_MED_MASTERSTART",
                  appletsType: "WECHAT_MED",
                });
                if (res.data == 1) {
                  //没有宠物，跳转添加宠物
                  if (this.petList.length === 1 || !this.userSelectedPetId) {
                    uni.navigateTo({
                      url: "/pagesD/petInfo/index&transparentTopBar=1",
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
              url: "/pagesB/prescribe/index",
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
                    uni.navigateTo({
                      url: "/pagesD/petInfo/index&transparentTopBar=1",
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
                      url: "/pagesD/petInfo/index&transparentTopBar=1",
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
          }
        }
      }
    }, 500),
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
    //进入已有问诊单
    async continueSheet() {
      action_report({
        action_name: "consultation_main_message_clk",
        module_name: module_name,
        extend: {
          type: "NEW_CHAT",
        },
      });
      const res = await GET_IN_SERVICE_LAST({});
      const {
        groupId,
        remainingTime,
        doctorAvatarUrl,
        doctorUserName,
        state,
        remainingWaitingTime,
        id,
        inquiryType,
      } = res.data;
      let result = {
        groupId,
        remainingTime,
        remainingWaitingTime,
        doctorAvatarUrl,
        doctorUserName,
        sheetState: state,
        id,
        inquiryType,
      };
      uni.navigateTo({
        url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
          result
        )}&fromOrigin=continue&inquiryType=${res.data.inquiryType}`,
      });
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
        const res = await ENTRY_CONFIG({
          source: "H5",
        });
        this.entrInfo = res.data;
        console.log("list: ", this.entrInfo);
      } catch (error) {}
    },
    handleCouponClose() {
      this.isCouponShow = false;
      this.isInviteShow = false;
    },
    handleClickButton() {
      uni.navigateTo({
        url: `/pagesA/orderDetail/index`,
      });
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
      this.doctorUserId = item.userId;
      if (this.serviceSheetsList.length) {
        this.isShowGoTo = true;
        return;
      }
      this.inquiryTypeForPop = "EXPERT";
      try {
        const res = await GET_ONLINE_STATUS(this.doctorUserId);
        if (res.data) {
          CAN_I_ASK_V2("EXPERT")
            .then((res) => {
              if (res.data == 1) {
                if (this.userPetList.length === 1) {
                  uni.navigateTo({
                    url: `/pagesD/petInfo/index?doctorUserId=${this.doctorUserId}&transparentTopBar=1`,
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
    //查看处方消息通知
    async viewNotice(item) {
      if (item.fromtype == 2) {
        action_report({
          action_name: "consultation_main_message_clk",
          module_name: module_name,
          extend: {
            type: "PRESCRIPTION_NOTICE",
          },
        });
      } else {
        action_report({
          action_name: "consultation_main_message_clk",
          module_name: module_name,
          extend: {
            type: "PRESCRIPTION_EXPIRED_PRE_NOTICE",
          },
        });
      }
      const { data } = await CHANGE_NOTICE(item.id, "VIEWED");
      if (data) {
        this.$set(this.lastMesInfo["PRESCRIPTION"], "id", "");
      }
      //跳转电子处方笺
      uni.navigateTo({
        url: `/pagesA/electronPrescription/index?id=${item.consultationSheetId}`,
      });
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
      action_report({
        action_name: "consultation_main_mypet_clk",
        module_name: module_name,
      });
      uni.navigateTo({
        url: `/pagesA/caseDetail/index?petId=` + this.userSelectedPetId,
      });
    },
    handleGoPetList() {
      if (!this.userInfo.token) {
        this.goLogin();
        return;
      }
      uni.navigateTo({
        url: `/pagesA/caseDetail/index?petId=` + this.userSelectedPetId,
      });
    },
    handlePrivacyClose() {
      // uni.showTabBar();
    },
    handleGoAddress() {
      if (!this.userInfo.token) {
        this.goLogin();
        return;
      }
      uni.navigateTo({
        url: `/pagesA/addressManagement/index`,
      });
    },
  },
};
</script>

<style lang="scss">
@import "./h5.scss";
</style>
