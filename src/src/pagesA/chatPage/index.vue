<template>
  <view
    class="page-wrapper-chat"
    :style="{
      height: initialHeight,
    }"
  >
    <!-- #ifdef MP-WEIXIN -->
    <view class="chatPageNavBarWx">
      <NavBar
        :title="doctorName || '智能问诊'"
        titleColor="#000"
        :showBackBtn="true"
        :whiteBack="false"
        @navBackClickHandle="navBackClickHandle"
        :customback="true"
        navColor="#ffffff"
      />
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <view class="chatPageNavBar" v-if="!ispingAn">
      <view class="leftNavbar">
        <NavBar
          :title="doctorName || '智能问诊'"
          titleColor="#000"
          :showBackBtn="true"
          :whiteBack="false"
          @navBackClickHandle="navBackClickHandle"
          :customback="true"
          navColor="#ffffff"
        />
      </view>
      <view class="iconShare">
        <image
          @click="shareMedical"
          class="shareIcon"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/iconshare.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <!-- #endif -->
    <div class="time-count-wrapper">
      <TimeCount
        v-if="[1, -1, 5].includes(sheetState) && cancleImPage"
        :remainingTime="remainingTime"
        :group-id="groupId"
        :ispingAn="ispingAn"
        @handleEndSheet="handleEndSheet"
        @handleCancelMatch="handleCancelMatch"
        @handleReMatch="handleReMatch"
        @showAllSelect="showAllSelect"
        :sheetState="sheetState"
        @handleCancleSheet="handleCancleSheet"
      ></TimeCount>
      <view
        v-show="!isCoverDisplay"
        :class="[
          'top-drop-down',
          inquiryType == 'NUTRITION' ? 'nutri-tag' : 'desc-tag',
        ]"
        @click="handleDropDownClick"
      ></view>
      <view v-show="isCoverDisplay" class="cover" @click="handleCoverClick">
        <view class="dropDownContent">
          <DropDown
            :inquiryType="inquiryType"
            :sheet-id="sheetId"
            @closeUp="isCoverDisplay = false"
          ></DropDown>
        </view>
      </view>
    </div>
    <!-- <view>
      <DropDown :sheetState="sheetState" :sheetId="sheetId"></DropDown
    ></view> -->

    <view class="chat-window-wrapper" @click="handleClickChatWindow">
      <ChatWindow
        :isShowAllSelect="isShowAllSelect"
        :isShowLocalShop="isShowLocalShop"
        :isShowImages="isShowImages"
        :isShowVideos="isShowVideos"
        :inquiryType="inquiryType"
        @commentSuccess="commentSuccess"
        :entrInfo="entrInfo"
        :chatMessage="chatMes"
        :key-board-height="keyboardHeight"
        @scrolltoupper="scrolltoupper"
        :has-more="hasMore"
        :sheetState="sheetState"
        :sheetId="sheetId"
        :groupId="groupId"
        :source="sourcePA"
        @sendSuccess="sendSuccess"
        @updateSuccess="updateSuccess"
        v-model="diagnosticSheetId"
        @buyingMedicine="buyingMedicine"
        :petId="petId"
        :petIdStr="petIdStr"
        :isCancleSheet="isCancleSheet"
        :showThroughError="showThroughError"
        @closeErrorPopup="closeErrorPopup"
        :userAvatarUrl="userAvatarUrl"
        :location="location"
      ></ChatWindow>
      <!--    :lastMesSentTime="lastMesSentTime" -->
    </view>
    <view
      v-if="![1, -1, 5].includes(sheetState) && bannerList.length !== 0"
      class="banner-chat"
    >
      <Banner :banner-list="bannerList"
    /></view>
    <!-- <view class="showChatMes" @click="getMes">showChatMes</view> -->
    <view class="showKeyBand" v-if="inquiryType !== 'AI_INQUIRY'">
      <ChatZone
        v-if="sheetState == 1 || sheetState == -1"
        @keyBoardActive="keyBoardActive"
        :group-id="groupId"
        @sendSuccess="sendSuccess"
        @handleEmojiPanel="handleEmojiPanel"
        @heightChange="handlekeyChange"
        :isPageEmojiHalf="isPageEmojiHalf"
      ></ChatZone>
    </view>
    <AIChatZone
      @sendSuccess="sendSuccess"
      :quesMessage="quesMes"
      :group-id="groupId"
      :isMultiSelect="isMultiSelect"
      :quesId="quesId"
      :isShowAllSelect="isShowAllSelect"
      v-if="inquiryType === 'AI_INQUIRY' && showAnswerBox"
    />
    <view class="showRate" v-if="inquiryType !== 'AI_INQUIRY'">
      <Rate
        v-if="sheetState == 2 || sheetState == 3"
        :group-id="groupId"
        :sheet-state="sheetState"
      ></Rate>
    </view>
    <OutOfStockPop
      v-if="checkMedical"
      :isOpen.sync="isCouponShow"
      @close="handleCouponClose"
      :inStockProducts="checkMedical.inStockProducts"
      :outOfStockProducts="checkMedical.outOfStockProducts"
      :diagnosticSheetId="diagnosticSheetId"
    />
    <isCountie
      :show.sync="deliverShow"
      :isShowAllSelect.sync="isShowAllSelect"
      @handleEndSheet="handleEndSheet"
      @postStepOut="postStepOut"
      @back="back"
    ></isCountie>
    <intertErro :show="errorShow" @handleEndSheet="handleEndSheet" />

    <confirmPop
      :show="popShow"
      :pinganAuthData="pinganAuthData"
      @close="pinganPopClose"
      @success="pinganPopSuccess"
    />
  </view>
</template>

<script>
import intertErro from "./components/intertErro/index.vue";
import TimeCount from "./components/timeCount/index.vue";
import ChatWindow from "./components/chatWindow/index.vue";
import ChatZone from "./components/chatZone/index.vue";
import Rate from "./components/rate/index.vue";
import DropDown from "./components/dropDown/index.vue";
import { rpxTopx } from "@/utils/index.js";
import confirmPop from "./components/confirmPop/index.vue";
// import * as RongIMLib from "@rongcloud/imlib-next";
import {
  Events as RYEvents,
  addEventListener as RYaddEventListener,
  removeEventListener as RYremoveEventListener,
  ConversationType as RYConversationType,
  clearMessagesUnreadStatus as RYclearMessagesUnreadStatus,
  sendSyncReadStatusMessage as RYsendSyncReadStatusMessage,
  getHistoryMessages as RYgetHistoryMessages,
  init as RYinit,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { END_SHEET, CANCEL_MATCH, GET_IN_SERVICE_LAST } from "@/api/chat";
import {
  getUserInfo,
  submitMessage,
  submitMessageQuick,
  getPinganDataRequest,
} from "@/api/base";
import { GET_BANNER_INFO, ENTRY_CONFIG } from "@/api/index";
import { mapState, mapMutations } from "vuex";
import Banner from "./components/banner/index.vue";
import OutOfStockPop from "@/pagesA/electronPrescription/components/outOfStockPop/index.vue";
import { action_report, display_report } from "@/utils/track";
import {
  getCheckMedical,
  getSheetsDetail,
  pinganConfirmRequest,
} from "@/api/sheets";
import { GET_IN_SERVICE_FOR_AI } from "@/api/chat";
import AIChatZone from "./components/aiChatzone/index.vue";
import NavBar from "@/components/navBar/index.vue";
import { postAICommentApi, postStepOutApi } from "@/pagesA/api/chatAi";
import isCountie from "@/pagesA/chatPage/components/isCountie/index.vue";
import { thirdPartyLoginFun } from "@/utils/config";
import {
  RyConnect,
  pinganRyConnect,
} from "@/pagesA/components/rongyunCloud/ryConnect";
import { uniqBy } from "lodash-es";
// #ifdef H5
import { secondShare } from "@/utils/secondshare";
// #endif
const Events = RYEvents;

/**
 * 区分环境接口请求地址
 */
const SHARE_BASR_URL =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test" ||
  process.env.NODE_ENV === "development-local"
    ? "https://cn-dev02-shareactivity.chongpangpang.com/"
    : "https://shareactivity.chongpangpang.com/";

const shareActivityUrl = `${SHARE_BASR_URL}h5/shareActivity/?random=123#/activity/medicalInquiryInvite?params=share&transparentTopBar=1`;

export default {
  components: {
    isCountie,
    OutOfStockPop,
    TimeCount,
    ChatWindow,
    ChatZone,
    Rate,
    Banner,
    DropDown,
    AIChatZone,
    NavBar,
    intertErro,
    confirmPop,
  },
  data() {
    return {
      errorShow: false,
      isAiQust: true,
      chatMes: [],
      quesMes: {},
      keyboardHeight: 0,
      scrollViewHeight: 0,
      isPageChatHalf: false,
      isPageEmojiHalf: false,
      statusBarHeight: 0,
      groupId: "",
      remainingTime: 0,
      hasMore: false, //是否还有未展示消息
      doctorAvatar: "",
      doctorName: "",
      sheetState: 1, //问诊单状态：-1：待接单；1：服务中；2：待评价；3：已完成；查询全部：0；
      previewImgLock: false,
      bannerList: [],
      isCoverDisplay: false, //遮罩层显隐
      sheetId: "", //当前问诊单id，查询详情使用
      inquiryType: "",
      diagnosticSheetId: "", //诊断id，查询诊断单使用
      isCouponShow: false,
      checkMedical: undefined,
      entrInfo: [],
      isMultiSelect: null, //AI问诊选项是否多选
      isShowAllSelect: null, //AI问诊选择框是否显示
      quesId: "", //AI问诊问题id
      commentData: {
        commentStampOut: 0,
        content: "",
        id: "",
      },
      deliverShow: false,
      ryCode: 0, //融云链接状态码
      petId: "", //当前宠物Id
      petIdStr: "", //当前宠物IdString类型
      sheetListInfo: {}, //问诊单详情
      isShowImages: true, //是否显示图片
      isShowVideos: true, //是否显示视频
      isShowLocalShop: false, //是否显示附近门店
      isCancleSheet: true,
      showThroughError: false, //抛出异常
      cancleImPage: true,
      userAvatarUrl: "", //用户头像备份
      showAnswerBox: false,
      popShow: false, //平安问诊弹窗
      pinganAuthData: {}, //平安弹窗入参
      ispingAn: false, //是否为平安来源
      pinganGroupID: "", //平安groupid记录
      pinganRyID: "", //平安融云id记录
      RYrequsetData: {}, //融云请求数据
      sourcePA: "",
      location: {
        cityCode: "",
        lon: 0,
        lat: 0,
      },
      createTime: "",
    };
  },
  computed: {
    ...mapState({
      lastSheetsMessage: (state) => state.lastSheetsMessage,
      isChooseImage: (state) => state.isChooseImage,
      lastMesSentTime: (state) => state.lastMesSentTime,
      serviceSheetsList: (state) => state.serviceSheetsList,
      pingAn: (state) => state.pingAn,
      PAgroupID: (state) => state.PAgroupID,
      pinganOpenId: (state) => state.pinganOpenId,
      pinganId: (state) => state.pinganId,
      userInfo: (state) => state.userInfo,
    }),
    initialHeight() {
      // temp是键盘每次弹出的高度。
      // 20是冗余，见./index.scss 对page-wrapper-chat 同样处理
      const temp = this.rpxTopx(this.keyboardHeight) || 20;
      return `calc(100vh - ${temp}rpx)`;
    },
  },
  onShareAppMessage(e) {
    action_report({
      action_name: "IntelligentconsultationIM_Share-on-WeChat_click",
      module_name: "model_name: ai_consultation",
      extend: {
        source: uni.getStorageSync("umt_extend").umt_code || "WECHAT_FRIEND",
      },
    });
    return {
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/shareActive.png",
      title: "智能宠物医生，7×24小时在线",
      desc: "7×24小时在线",
      path: `/pagesF/health/index?shareType=WECHAT_FRIEND`,
    };
  },
  onShareTimeline() {
    action_report({
      action_name: "IntelligentconsultationIM_Share-on-WeChatMoments_click",
      module_name: "model_name: ai_consultation",
      extend: {
        source: uni.getStorageSync("umt_extend").umt_code || "WECHAT_CIRCLE",
      },
    });
    return {
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/shareActive.png",
      title: "智能宠物医生，7×24小时在线",
      desc: "7×24小时在线",
      path: `/pages/index/index?shareType=WECHAT_CIRCLE`,
    };
  },
  created() {
    // 92:顶部倒计时高度，172:底部输入框+安全距离
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.statusBarHeight = statusBarHeight;
    this.emojiHeight = `calc(100vh - 92rpx - 108rpx - 450rpx)`;
  },
  mounted() {
    uni.$off();
    // uni.$on("previewImgLock", (res) => {
    //   this.previewImgLock = true;
    // });
    GET_BANNER_INFO({
      key: "BANNER_CONSULTATION_FINISH_PAGE_APPLE",
      cityCode: uni.getStorageSync("cityCode"),
    }).then((res) => {
      // console.log(
      //   res.data.length !== 0 && ![1, -1, 5].includes(this.sheetState)
      // );
      this.bannerList = res.data;
    });
  },
  watch: {},
  async onLoad(option) {
    console.log(option, ">>>>>>>>>跳转路径参数");

    //h5环境下,根据跳转路径(source=30),为平安进行授权弹窗展示
    // #ifdef H5
    if (option.source && option.source == "30") {
      try {
        this.ispingAn = true;
        this.sourcePA = option.source;
        this.setSourceRecord(option.source);
        this.setpingAnSource(true);
        //
        if (option.openId && option.consultationId) {
          uni.setStorageSync("pingan-data", option);
          this.setPinganOpenId(option.openId);
          this.setPinganId(option.consultationId);
        }
        const popData = {
          openId: option.openId ? option.openId : this.pinganOpenId,
          thirdType: option.source,
          isAuthorization: true,
        };

        //校验token是否存在,通过执行对应回调
        thirdPartyLoginFun(
          {
            openId: option.openId
              ? option.openId
              : uni.getStorageSync("pingan-data").openId,
            thirdType: Number(option.source),
          },
          () => this.onfirmaBelief(popData)
        );
        // 融云初始化
        // await this.RYconnectMethod();
      } catch (error) {
        console.log(error);
      }
    } else {
      this.ispingAn = false;
      this.setpingAnSource(false);
    }
    // #endif

    this.moveOutNetWork(false);
    this.moveOutNetWork(true);
    // #ifdef H5
    // const userInfo = this.$dsBridge.call("getUserInfo", "getUserInfo")
    //   ? JSON.parse(this.$dsBridge.call("getUserInfo", "getUserInfo"), {})
    //   : {};
    const { userId } = uni.getStorageSync("storage_info");
    // const { userInfo, avatarUrl } = store.state;

    const appNative = this.$dsBridge.call("getUserInfo", "getUserInfo");
    if (appNative) {
      this.userAvatarUrl = JSON.parse(appNative).avatarUrl;
    }
    // #endif
    // 微信禁止分朋友圈
    uni.hideShareMenu({
      // withShareTicket: true,
      menus: ["shareTimeline"],
      success: function () {
        console.log("分享菜单显示成功");
      },
      fail: function (err) {
        console.error("分享菜单显示失败", err);
      },
    });
    // 埋点页面曝光
    console.log("option", option);
    if (option.inquiryType === "AI_INQUIRY") {
      this.showAnswerBox = true;
      display_report({
        display_name: "IntelligentconsultationIM_Share_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    } else if (option.inquiryType === "QUICK") {
      display_report({
        display_name: "IntelligentconsultationIM_FreeClinic_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    } else if (option.inquiryType === "EXPERT") {
      display_report({
        display_name: "IntelligentconsultationIM_ExpertConsultation_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    } else if (option.inquiryType === "ONLINE_PRESCRIPTION") {
      display_report({
        display_name:
          "IntelligentconsultationIM_Online-medication-prescription_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    }
    this.getEntrInfo();
    //新建问诊单
    //区分快速和专家
    // if (option.fromOrigin == "new" || option.fromOrigin == "continue") {

    option.messageInfo = decodeURIComponent(option.messageInfo);
    console.log(
      "option.messageInfo=========================================>",
      option
    );
    if (option.sheetId != "") {
      this.sheetId = option.sheetId;
    }
    if (option.state) {
      this.sheetState = option.state;
    }

    if (option.messageInfo && option.messageInfo != "undefined") {
      // this.inquiryType = JSON.parse(option.messageInfo).inquiryType;

      // this.inquiryType =
      //   option.inquiryType ?? JSON.parse(option.messageInfo).inquiryType;
      let messageInfo = JSON.parse(option.messageInfo);

      if (messageInfo) {
        this.inquiryType = option.inquiryType;

        this.groupId = messageInfo.groupId;
        this.doctorAvatar = messageInfo.doctorAvatarUrl;
        this.doctorName = messageInfo.doctorUserName;
        this.sheetId = messageInfo.id;
        this.sheetState = messageInfo.sheetState;
        this.remainingTime = messageInfo.remainingTime;
        this.petId = option.petId;
        this.createTime = messageInfo.createTime;
        this.getTheNewSheetListInfo(this.groupId);
        console.log(
          "dfdsfdsfsdfsd",
          this.sheetId,
          messageInfo,
          this.inquiryType,
          this.remainingTime,
          this.petIdStr,
          this.userAvatarUrl,
          this.createTime
        );
      }

      // if (option.inquiryType !== "QUICK") {
      //   uni.setNavigationBarTitle({
      //     title: JSON.parse(option.messageInfo).doctorUserName,
      //   });
      // }
      if (messageInfo.doctorUserName) {
        uni.setNavigationBarTitle({
          title: messageInfo.doctorUserName,
        });
      } else {
        uni.setNavigationBarTitle({
          title: "匹配中",
        });
      }

      if (option.fromOrigin == "new" && option.inquiryType == "QUICK") {
        this.sheetState = -1;
      }

      // // this.getMes();
      // if (option.fromOrigin == "new") {
      //   if (option.inquiryType == "QUICK") {
      //     this.remainingTime = JSON.parse(
      //       option.messageInfo
      //     ).remainingWaitingTime;
      //     this.sheetState = -1;
      //   } else {
      //     //专家问诊或营养问诊
      //     this.remainingTime = JSON.parse(option.messageInfo).remainingTime;
      //     this.sheetState = 1;
      //   }
      // } else if (option.fromOrigin == "continue") {
      //   if (JSON.parse(option.messageInfo).sheetState == -1) {
      //     this.remainingTime = JSON.parse(
      //       option.messageInfo
      //     ).remainingWaitingTime;
      //     // this.sheetState = JSON.parse(option.messageInfo).sheetState;
      //   } else {
      //     this.remainingTime = JSON.parse(option.messageInfo).remainingTime;
      //     // this.sheetState = JSON.parse(option.messageInfo).sheetState;
      //   }
      // }
    } else {
      console.log("app跳转", 123456789);
      let groupId = option.groupId;
      this.groupId = option.groupId;
      //初始化userId没有不调用
      if (!this.ispingAn) {
        try {
          GET_IN_SERVICE_LAST({ groupId }).then((aaa) => {
            const {
              inquiryType,
              groupId,
              doctorAvatarUrl: doctorAvatar, // 重命名属性
              doctorUserName: doctorName, // 重命名属性
              id: sheetId, // 重命名属性
              state: sheetState, // 重命名属性
              remainingTime,
              petInformation: { petId, petIdStr }, // 嵌套解构
              userAvatarUrl,
              createTime,
            } = aaa.data;
            this.inquiryType = inquiryType;
            this.groupId = groupId;
            this.doctorAvatar = doctorAvatar;
            this.doctorName = doctorName;
            this.sheetId = sheetId;
            this.sheetState = sheetState;
            this.remainingTime = remainingTime;
            this.petId = petId;
            this.petIdStr = petIdStr;
            this.userAvatarUrl = userAvatarUrl;
            this.createTime = createTime;
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (option.inquiryType == "QUCIK") {
      display_report({
        display_name: "IntelligentconsultationIM_FreeClinic_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    } else if (option.inquiryType == "EXPERT") {
      display_report({
        display_name: "IntelligentconsultationIM_ExpertConsultation_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    } else if (option.inquiryType == "ONLINE_PRESCRIPTION") {
      display_report({
        display_name: "IntelligentconsultationIM_FollowUp_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      display_report({
        display_name:
          "IntelligentconsultationIM__Online-medication-prescription_display",
        object_type: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    }
    // }
    // #ifdef MP-WEIXIN
    // 融云初始化
    await this.RYconnectMethod();
    // const { userInfo } = store.state;
    this.userAvatarUrl = this.userInfo.avatarUrl;
    console.log(
      "store中获取userInfo",
      this.userInfo,
      this.userInfo.avatarUrl,
      this.userAvatarUrl
    );
    // #endif
    RYaddEventListener(Events.EXPANSION, this.handleExpansionUpdate);
  },
  async onShow() {
    //处理问诊中途跳转其它页面返回场景
    // #ifdef H5
    let that = this;
    if (this.ispingAn) {
      try {
        let pingAnData = uni.getStorageSync("pingan-data");
        const requsetData = {
          id: pingAnData.consultationId,
          openId: pingAnData.openId,
        };

        //根据路径参数获取groupid
        const RYdata = await getPinganDataRequest(requsetData);
        this.pinganGroupID = RYdata.data.groupId;
        this.pinganRyID = RYdata.data.userRyId;
        this.setpinganGroupID(this.pinganGroupID);
        console.log(this.userInfo, "this.userInfo.userId");

        // 确认userId来源属于平安
        if (!this.userInfo.userId && this.userInfo.thirdType != 30) {
          thirdPartyLoginFun(
            {
              openId: requsetData.openId,
              thirdType: 30,
            },
            () => {
              that.getSheetDetail(that.pinganGroupID);
            }
          );
        } else {
          that.getSheetDetail(that.pinganGroupID);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    // #endif

    // if (this.previewImgLock) {
    //   this.previewImgLock = false;
    //   return;
    // }
    let groupId = this.groupId;
    groupId && this.setCurrentMesInfo({ groupId });
    if (this.lastSheetsMessage[groupId]) {
      let lastMes = {
        ...this.lastSheetsMessage[groupId],
      };
      lastMes.unreadMessageCount = 0;

      this.setLastSheetsMessage({
        [groupId]: lastMes,
      });
    }
    // #ifdef H5
    await this.RYconnectMethod();
    setTimeout(() => {
      secondShare({
        title: "智能宠物医生、7×24小时在线",
        desc: "7×24小时在线",
        link: `${window.location.origin}/crm-medical-h5/#/pagesF/health/index`,
        imgUrl:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/shareActive.png",
      });
    }, 500);

    // #endif
    if (!this.isChooseImage) {
      // 添加事件监听 消息的推送
      RYaddEventListener(Events.MESSAGES, this.handleMessages);
    }

    if (!this.ispingAn) {
      try {
        const res = await GET_IN_SERVICE_LAST({ groupId });
        const { remainingTime, state, remainingWaitingTime } = res.data;
        console.log(res.data, "1234567899876543234567876543");
        this.sheetState = state;
        this.remainingTime = state == -1 ? remainingWaitingTime : remainingTime;
      } catch (error) {
        console.log("🚀 ~ onShow ~ error:", error);
      }
    }
  },
  onHide() {
    console.log("chat onHide");
    // this.chatMes = [];

    this.setCurrentMesInfo({ groupId: "" });

    if (!this.isChooseImage) {
      // 添加事件监听 消息的推送
      // RYremoveEventListener(Events.MESSAGES, this.handleMessages);
    }
  },
  onUnload() {
    let pages = getCurrentPages().length - 1;
    uni.navigateBack({
      delta: pages,
    });
    this.setCurrentMesInfo({ groupId: "" });
    this.setpingAnSource(false); //卸载置空平安标识
    // RYremoveEventListener(Events.MESSAGES, this.handleMessages);
    // RYremoveEventListener(Events.EXPANSION, this.handleExpansionUpdate);
  },
  methods: {
    ...mapMutations([
      "setRyConnectStatus",
      "setUserInfo",
      "setpingAnSource",
      "setpinganGroupID",
      "setSourceRecord",
      "setPinganOpenId",
      "setPinganId",
    ]),
    // 关闭异常弹框
    closeErrorPopup(type) {
      this.showThroughError = type;
      // this.cancleImPage = type;
    },
    // AI问诊评论接口
    async postAIComment(data) {
      if (data.id == "") {
        data.id = this.sheetId;
      }
      const res = await postAICommentApi(data);
      this.setConsultationShow(true);
      console.log(res);
    },
    async getEntrInfo() {
      try {
        // #ifdef MP-WEIXIN
        const res = await ENTRY_CONFIG({ source: "WECHAT_XCX" });
        // #endif
        // #ifdef H5
        const res = await ENTRY_CONFIG({ source: "" });
        // #endif
        this.entrInfo = res.data.slice(0, 3);
        console.log("list: ", this.entrInfo);
      } catch (error) {}
    },
    //测试
    showChatMes() {
      console.log("chatMes=====================>", this.chatMes);
    },
    // 时间框定时器控制下拉框显示
    showAllSelect(e) {
      console.log(e);
      this.isShowAllSelect = e;
      this.showAnswerBox = e;
    },
    // 新增分享按钮
    shareMedical() {
      console.log("点击分享事件");
      action_report({
        action_name: "IntelligentconsultationIM_share_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      // wxShareMethod();
      // #ifdef H5
      this.$dsBridge.call("openShare", {
        title: "智能宠物医生", //标题
        content: "7×24小时在线", //分享内容
        // shareUrl: `${window.location.origin}/crm-medical-h5/#/pagesF/health/index?transparentTopBar=1`, //分享链接
        shareUrl: shareActivityUrl,
        image:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/shareActive.png", // 分享的logo(微信)
        sharingChannels: ["WECHAT_FRIEND", "WXCHAT_FRIEND_CIRCLE"],
      });
      // #endif
    },
    navBackClickHandle() {
      //来源为平安调用平安方提交关闭方法
      if (this.ispingAn) {
        this.$pinganPlugin.back();
      } else {
        this.setConsultationShow(true);
        action_report({
          action_name: "IntelligentconsultationIM_ServiceStatusReturn_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
        if (!this.cancleImPage) {
          // #ifdef MP-WEIXIN
          uni.navigateBack();
          this.setConsultationShow(true);
          // #endif
          // #ifdef H5
          this.$dsBridge.call("closeCurrentWebview", {});
          // #endif
        }
        if (this.sheetState == -1 || this.sheetState == 1) {
          if (this.inquiryType == "AI_INQUIRY") {
            this.deliverShow = true;
            this.isShowAllSelect = false;
          } else {
            this.isShowAllSelect = true;
            // #ifdef MP-WEIXIN
            uni.navigateBack();
            // #endif
            // #ifdef H5
            this.$dsBridge.call("closeCurrentWebview", {});
            // #endif
          }
        } else if (this.inquiryType != "AI_INQUIRY") {
          // #ifdef MP-WEIXIN
          uni.navigateBack();
          this.setConsultationShow(true);
          // #endif
          // #ifdef H5
          this.$dsBridge.call("closeCurrentWebview", {});
          // #endif
        } else if (this.sheetState == 2) {
          // #ifdef MP-WEIXIN
          uni.navigateBack();
          this.setConsultationShow(true);
          // #endif
          // #ifdef H5
          this.$dsBridge.call("closeCurrentWebview", {});
          // #endif
          console.log(this.commentData);
        } else {
          // #ifdef MP-WEIXIN
          uni.navigateBack();
          this.setConsultationShow(true);
          // #endif
          // #ifdef H5
          this.$dsBridge.call("closeCurrentWebview", {});
          // #endif
        }
        console.log("问诊单状态", this.sheetState, this.deliverShow);
        // if (this.sheetState != 3 && this.inquiryType != "AI_INQUIRY") return;
      }
    },
    ...mapMutations([
      "setCurrentMesInfo",
      "setLastSheetsMessage",
      "setServiceSheetsList",
      "setConsultationShow",
    ]),
    keyBoardActive(e) {
      if (this.inquiryType == "AI_INQUIRY") {
        return;
      }
      this.keyboardHeight = e;
      // const temp = this.rpxTopx(e);
      if (e !== 0) {
        this.isPageChatHalf = true;
        // this.scrollViewHeight = `calc(100vh - ${temp}rpx)`;
        //同时容器需要滚动到底部
      } else {
        this.isPageChatHalf = false;
      }
      console.log("接受focus", e);
    },
    rpxTopx,
    //获取融云聊天历史
    async getMes() {
      console.log("获取融云聊天历史 this.groupId", this.groupId);
      if (!this.groupId) {
        return;
      }
      //更新当前会话信息
      var that = this;
      console.log(this.groupId);
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      // 从当前时间开始向前查询
      console.log("融云调用方法查询历史记录", conversation);
      const option = {
        timestamp: 0,
        count: 100,
        order: 0,
      };
      let mesArr = [];
      let quesArr = [];
      RYgetHistoryMessages(conversation, option).then((res) => {
        console.log(res, "查询融云历史记录");
        if (res.code !== 0) {
          this.errorShow = true;
          this.isShowAllSelect = false;
          this.showAnswerBox = false;
        } else {
          this.errorShow = false;
          this.isShowAllSelect = true;
          this.showAnswerBox = true;
        }
        this.ryCode = res.code;
        if (res.data.list.length === 0) return;
        if (
          res.data &&
          res.data.list &&
          res.data.list.length < 3 &&
          this.sheetState != -1
        ) {
          return this.getMes();
        }
        if (res.code === 0) {
          this.hasMore = res.data.hasMore;

          uni.setStorageSync("lastMesSentTime", res.data.list[0].sentTime);

          res.data?.list.map((i) => {
            // 如果messageType === RC:TxtMsg
            // if (i.messageType === "RC:TxtMsg") {
            //   i.content.content = handleTxtMsgToHtml(i.content.content || "");
            // }
            // 处理AI问诊问题答案

            if (
              i.messageType == "RCMedicalCustomMsg" &&
              JSON.parse(i.content.message).customType == "question"
            ) {
              that.isShowAllSelect = true;
              quesArr.push({ ...JSON.parse(i.content.message) });
              console.log("quesArr====================>", quesArr);
              that.isMultiSelect = JSON.parse(i.content.message).isMultiSelect;
              that.quesId = JSON.parse(i.content.message).uuid;
              // if (
              //   JSON.parse(i.content.message).questionDesc.images.length > 0
              // ) {
              //   this.isShowImages = true;
              // } else if (
              //   JSON.parse(i.content.message).questionDesc.videos.length > 0
              // ) {
              //   this.isShowVideos = true;
              // } else if (
              //   JSON.parse(i.content.message).questionDesc.images.length == 0
              // ) {
              //   this.isShowImages = false;
              // } else if (
              //   JSON.parse(i.content.message).questionDesc.videos.length == 0
              // ) {
              //   this.isShowVideos = false;
              // }
            }
            if (
              i.messageType == "RCMedicalCustomMsg" &&
              JSON.parse(i.content.message).customType == "report" &&
              this.inquiryType == "AI_INQUIRY"
            ) {
              this.isShowLocalShop = JSON.parse(
                i.content.message
              ).hasNearbyStore;
              this.location.cityCode = JSON.parse(i.content.message).cityCode;
              this.location.lon = JSON.parse(i.content.message).lon;
              this.location.lat = JSON.parse(i.content.message).lat;
              this.handleEndSheet();
            }
            if (
              i.messageType === "RC:CmdNtf" &&
              i.content.name ===
                "CONSULTATION:QUICK_CONSULTATION_UPGRADE_NOTICE"
            ) {
              let result = JSON.parse(i.content.data);
              const {
                groupId,
                doctorAvatarUrl,
                doctorUserName,
                remainingTime,
              } = result;
              // uni.redirectTo({
              //   url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify({
              //     groupId,
              //     doctorAvatarUrl,
              //     doctorUserName,
              //     remainingTime,
              //     sheetState: 1,
              //   })}&fromOrigin=new&inquiryType=EXPERT`,
              // });
            }
            //处理结束信息
            if (
              i.messageType === "RC:InfoNtf" &&
              i.content.message === "本次服务已结束，感谢您的使用！"
            ) {
              // getDocSheets(1, false);
              // pageInfo.objTMT[item.groupId] = null;
              // if (that.sheetState == 3) {
              //   that.sheetState = 3;
              // } else if(that.sheetState == 4){
              //   that.sheetState = 4;
              // }
              that.isPageChatHalf = false;
              that.isPageEmojiHalf = false;
              that.isShowAllSelect = false;
              this.showAnswerBox = false;
            }
            //处理超时信息
            if (
              i.messageType === "RC:InfoNtf" &&
              i.content.extra === "QUICK_CONSULTATION:TIMEOUT"
            ) {
              console.log("消息超时");
              that.sheetState = 5;
            }
            mesArr.push({
              ...i,
              userAvatarUrl: this.doctorAvatar,
              userName: this.doctorName,
              userAvaUrl: this.userAvatarUrl,
              // 1: 发送，2: 接收
              direction: i.messageDirection,
              //问诊单状态：1：服务中；2：待评价；3：已完成；
              // state: item.state,
            });
          });
          let quseArrLength = quesArr.length - 1;

          // 单独处理平安来源下失效处方单隐藏
          if (this.ispingAn) {
            mesArr.forEach((item, index) => {
              if (
                item.messageType == "RCMedicalCustomMsg" &&
                item.expansion &&
                item.expansion.status == "EXPIRED"
              ) {
                mesArr.splice(index, 1);
              }
            });
            console.log(mesArr, "失效处方消息不展示");
          }
          this.chatMes = uniqBy(mesArr, "messageUId");

          // console.log(this.chatMes, "失效问诊消息不展示");

          this.quesMes = quesArr[quseArrLength];
          this.handleReadStatus(this.groupId);
        } else {
        }
      });
    },
    // AI评价传值
    commentSuccess(commentStampOut) {
      this.commentData.commentStampOut = commentStampOut;
      this.commentData.id = this.sheetId;
      this.postAIComment(this.commentData);
    },
    /**
     * 成功发送文字消息
     */
    sendSuccess(e) {
      console.log("成功发送文字消息111", e);
      this.chatMes.push(e);
    },
    // 监听内容对应方法
    watchOutNetWork(res) {
      console.log(
        res.isConnected,
        this.isShowAllSelect,
        this.showAnswerBox,
        "网络监听"
      );
      if (res.isConnected) {
        this.showAllSelect(res.isConnected);
      } else {
        this.showAllSelect(res.isConnected);
      }
    },
    // 网络监听
    moveOutNetWork(type) {
      if (type) {
        uni.onNetworkStatusChange(this.watchOutNetWork);
      } else {
        uni.offNetworkStatusChange(this.watchOutNetWork);
      }
    },
    /**
     * 计时器时间结束用户取消
     */
    async handleCancleSheet(e) {
      this.isShowAllSelect = false;
      this.showAnswerBox = false;
      // const res = await END_SHEET({ groupId: this.groupId });
      // this.sheetState = 5;
      this.isCancleSheet = e;
      this.moveOutNetWork(false);
    },
    /**
     * 用户主动结束问诊单
     */
    async handleEndSheet() {
      this.isShowAllSelect = false;
      this.showAnswerBox = false;
      const res = await END_SHEET({ groupId: this.groupId });
      // this.sheetState = 2;
      this.moveOutNetWork(false);
    },
    /**
     * 用户主动取消匹配问诊单
     */
    async handleCancelMatch() {
      const res = await CANCEL_MATCH({ groupId: this.groupId });
      this.sheetState = 4;
      this.setServiceSheetsList([]);
      uni.navigateBack({
        delta: 1,
      });
      this.moveOutNetWork(false);
    },
    /**
     * 重新匹配
     */
    handleReMatch() {
      let params = {
        groupId: this.groupId,
        lon: uni.getStorageSync("lon") || "", //经度
        lat: uni.getStorageSync("lat") || "", //维度
      };
      submitMessageQuick(params).then((res) => {
        // that.$uma.trackEvent("pet_pre_ask", {
        //   user_id: uni.getStorageSync("userId"),
        // });
        uni.redirectTo({
          url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
            res.data
          )}&fromOrigin=new&inquiryType=QUICK`,
        });
      });
    },
    /**
     * 获取新消息
     * */
    handleMessages(messages) {
      let that = this;
      try {
        messages.messages.forEach(async (item) => {
          if (
            item.messageType === "RC:CmdNtf" &&
            (item.content.name ===
              "CONSULTATION:QUICK_CONSULTATION_UPGRADE_NOTICE" ||
              item.content.name === "CONSULTATION:CONSULTATION_REASSIGN_NOTICE")
          ) {
            let result = JSON.parse(item.content.data);
            const { groupId, doctorAvatarUrl, doctorUserName } = result;
            const res = await GET_IN_SERVICE_LAST({ groupId });

            const { remainingTime, state, inquiryType, id } = res.data;
            this.sheetId = id;
            uni.redirectTo({
              url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify({
                id,
                groupId,
                doctorAvatarUrl,
                doctorUserName,
                remainingTime,
                sheetState: state,
              })}&fromOrigin=new&inquiryType=${inquiryType}`,
            });
          }
          if (item.targetId !== this.groupId) return;
          // 医生未回复 不做任何处理
          if (
            item.messageType === "RC:SRSMsg" ||
            item.messageType === "RCVeterinarianNoReplyMessage" ||
            (item.messageType == "RC:CmdMsg" &&
              item.content.name == "CONSULTATION:DOCTOR-FORCED-OFFLINE")
          ) {
            return;
          }
          //内部匹配逻辑
          if (
            item.messageType === "RC:InfoNtf" &&
            item.content.extra === "CONSULTATION:START"
          ) {
            that.$nextTick(async () => {
              // that.sheetState = 1;
              // console.log('=======================', that.inquiryType);
              // that.remainingTime = that.inquiryType === "QUICK" ? 1200 : 1800;
              // console.log('=======================', that.remainingTime);
              const res = await GET_IN_SERVICE_LAST({ groupId: this.groupId });
              const { remainingTime, state, remainingWaitingTime } = res.data;
              this.sheetState = state;
              this.remainingTime =
                state == -1 ? remainingWaitingTime : remainingTime;
            });
          }
          //处理结束信息
          if (
            item.messageType === "RC:InfoNtf" &&
            item.content.message === "本次服务已结束，感谢您的使用！"
          ) {
            display_report({
              display_name: "IntelligentconsultationIM_Result_display",
              object_type: "ai_consultation",
              extend: {
                source:
                  uni.getStorageSync("umt_extend").umt_code ||
                  uni.getStorageSync("shareType"),
                id: this.sheetId,
                creatTime: this.createTime,
              },
            });
            // getDocSheets(1, false);
            // pageInfo.objTMT[item.groupId] = null;
            if (this.sheetState == 3) {
              this.sheetState = 3;
            } else {
              this.sheetState = 2;
            }
            this.isPageChatHalf = false;
            this.isPageEmojiHalf = false;
          }
          // 处理新消息的获得答案的
          if (
            item.messageType === "RCMedicalCustomMsg" &&
            JSON.parse(item.content.message).customType == "question"
          ) {
            console.log("AI获取最新消息", JSON.parse(item.content.message));
            that.quesMes = JSON.parse(item.content.message);
            that.isMultiSelect = JSON.parse(item.content.message).isMultiSelect;
            that.quesId = JSON.parse(item.content.message).uuid;
            that.isShowAllSelect = true;
            if (
              JSON.parse(item.content.message).questionDesc.images.length > 0
            ) {
              that.isShowImages = true;
            } else if (
              JSON.parse(item.content.message).questionDesc.videos.length > 0
            ) {
              that.isShowVideos = true;
            } else if (
              JSON.parse(item.content.message).questionDesc.images.length == 0
            ) {
              that.isShowImages = false;
            } else if (
              JSON.parse(item.content.message).questionDesc.videos.length == 0
            ) {
              that.isShowVideos = false;
            }
          }
          // 处理问诊异常
          if (
            item.messageType == "RCMedicalCustomMsg" &&
            JSON.parse(item.content.message).customType == "report" &&
            JSON.parse(item.content.message).hasReport == false
          ) {
            that.location.cityCode = JSON.parse(item.content.message).cityCode;
            that.location.lon = JSON.parse(item.content.message).lon;
            that.location.lat = JSON.parse(item.content.message).lat;
            that.isShowAllSelect = false;
            that.showAnswerBox = false;
            // this.handleEndSheet();
          }
          // 处理新的消息获得报告页后自动结束流程
          if (
            item.messageType === "RCMedicalCustomMsg" &&
            JSON.parse(item.content.message).customType == "report" &&
            that.inquiryType == "AI_INQUIRY"
          ) {
            console.log("AI获取报告", JSON.parse(item.content.message));
            that.location.cityCode = JSON.parse(item.content.message).cityCode;
            that.location.lon = JSON.parse(item.content.message).lon;
            that.location.lat = JSON.parse(item.content.message).lat;
            display_report({
              display_name: "IntelligentconsultationIM_Result_display",
              object_type: "ai_consultation",
              extend: {
                source:
                  uni.getStorageSync("umt_extend").umt_code ||
                  uni.getStorageSync("shareType"),
                id: that.sheetId,
                creatTime: that.createTime,
              },
            });
            display_report({
              display_name: "IntelligentconsultationIM_Consultation_display",
              object_type: "ai_consultation",
              extend: {
                source:
                  uni.getStorageSync("umt_extend").umt_code ||
                  uni.getStorageSync("shareType"),
              },
            });

            that.isShowLocalShop = JSON.parse(
              item.content.message
            ).hasNearbyStore;
            that.isShowAllSelect = false;
            that.showAnswerBox = false;
            that.handleEndSheet();
          }
          // 触发异常的消息提示
          if (
            item.messageType === "RCMedicalCustomMsg" &&
            JSON.parse(item.content.message).customType == "error" &&
            that.inquiryType == "AI_INQUIRY"
          ) {
            display_report({
              display_name: "IntelligentconsultationIM_Result_display",
              object_type: "ai_consultation",
              extend: {
                source:
                  uni.getStorageSync("umt_extend").umt_code ||
                  uni.getStorageSync("shareType"),
                id: that.sheetId,
                creatTime: that.createTime,
              },
            });
            that.showThroughError = true;
            that.isShowAllSelect = false;
            that.showAnswerBox = false;
            that.cancleImPage = false;
            // this.handleEndSheet();
          }
          //处理超时信息
          if (
            item.messageType === "RC:InfoNtf" &&
            item.content.extra === "QUICK_CONSULTATION:TIMEOUT"
          ) {
            this.sheetState = 5;
            that.$nextTick(async () => {
              //处理状态
              const res = await GET_IN_SERVICE_FOR_AI();

              this.setServiceSheetsList(res.data ? [res.data] : []);
            });
          }
          const data = {
            ...item,
            // content: {
            //   content: item?.content.content,
            //   message: item.content.message,
            //   remoteUrl: item.content.remoteUrl,
            //   imageUri: item.content.imageUri,
            // },
            // messageType: item.messageType,
            userAvatarUrl: this.doctorAvatar,
            // sentTime: item.sentTime,
            direction: item.messageDirection,
            // messageUId: item.messageUId,
            state: 1,
          };
          let nowAMes = JSON.parse(JSON.stringify(this.chatMes));
          nowAMes.push(data);
          // this.chatMes.push(data);
          this.chatMes = uniqBy(nowAMes, "messageUId");
          // 将这条消息置为已读
          this.handleReadStatus(item.targetId);
        });
      } catch (error) {
        const logManager = wx.getRealtimeLogManager();
        const logger = logManager.tag("plugin-onUserTapSth");
        logger.info("实时日志获取消息", "消息值", error);
      }
    },

    /**
     * 处理拓展消息更新
     */
    handleExpansionUpdate({ updatedExpansion, deletedExpansion }) {
      if (updatedExpansion) {
        console.log("扩展消息更新：", updatedExpansion);
        this.chatMes = this.chatMes.map(function (item) {
          if (item.messageUId === updatedExpansion.messageUId) {
            return {
              ...item,
              expansion: updatedExpansion.expansion,
            };
          } else {
            return item;
          }
        });
      }
    },
    /**
     * 将会话中的未读变为已读
     * @param targetId
     * @param conversationType
     */
    handleReadStatus(targetId, conversationType = RYConversationType.GROUP) {
      const options = {
        conversationType: conversationType,
        targetId,
      };
      // 将消息变为已读
      RYclearMessagesUnreadStatus(options).then((res) => {
        if (res.code === 0) {
          // console.log(res.code);
          // 发送多端同步未读数消息
          RYsendSyncReadStatusMessage(options, Date.now()).then(() => {});
        } else {
          console.log(res.code, res.msg);
        }
      });
    },
    /**
     * 消息拓展更新成功后回调刷新UI
     */
    updateSuccess(oldValue, newValue) {
      console.log("消息拓展更新成功", oldValue, newValue);
      this.chatMes = this.chatMes.map(function (item) {
        if (item.messageUId === newValue.messageUId) {
          return newValue;
        } else {
          return item;
        }
      });
    },
    /**
     * 到顶后继续加载历史信息
     */
    scrolltoupper() {
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      // 从当前时间开始向前查询
      const option = {
        timestamp: uni.getStorageSync("lastMesSentTime"),
        count: 20,
        order: 0,
      };
      let mesArr = [];
      RYgetHistoryMessages(conversation, option).then((res) => {
        if (res.code === 0) {
          this.hasMore = res.data.hasMore;
          res.data?.list.map((i) => {
            mesArr.push({
              ...i,
              userAvatarUrl: this.doctorAvatar,
              userName: this.doctorName,
              // 1: 发送，2: 接收
              direction: i.messageDirection,
              //问诊单状态：1：服务中；2：待评价；3：已完成；
              // state: item.state,
            });
          });
          this.chatMes = uniqBy(mesArr.concat(this.chatMes), "messageUId");
        } else {
          console.log(res.code, res.msg);
        }
      });
    },
    // AI问诊下拉框高度
    handleAiAnswer() {
      if (this.isMultiSelect) {
        // this.scrollViewHeight = `calc(100vh - 92rpx - 108rpx - 69rpx)`;
      } else {
        // this.scrollViewHeight = `calc(100vh - 92rpx - 54rpx - 69rpx)`;
      }
    },
    /**
     * 唤起表情面板
     */
    handleEmojiPanel(e) {
      this.isPageEmojiHalf = e;
      if (e) {
        // this.scrollViewHeight = `calc(100vh - 92rpx - 108rpx - 450rpx - 69rpx)`;
      }
    },
    handlekeyChange(val) {
      const temp = this.rpxTopx(this.keyboardHeight);
      const he = (val.height - 56) * 2;
      this.isPageChatHalf = true;
      // this.scrollViewHeight = `calc(100vh - ${temp}rpx - ${he}rpx - 92rpx - 108rpx - 59rpx)`;
    },
    //点击聊天窗体通知表情看板收起
    handleClickChatWindow() {
      this.isPageEmojiHalf = false;
    },
    handleCoverClick() {
      console.log("遮罩层点击");
      this.isCoverDisplay = false;
    },
    handleDropDownClick() {
      this.isCoverDisplay = true;
    },

    //电子处方笺购药流程
    async buyingMedicine(diaId) {
      this.diagnosticSheetId = diaId;
      console.log(
        "1111buyingMedicinebuyingMedicine11 = ",
        this.diagnosticSheetId
      );
      await this._getCheckDrug();
      action_report({
        action_name: "med_transaction",
        module_name: "transaction",
      });
      console.log("buyingMedicine ===== ", this.checkMedical);
      if (
        this.checkMedical.outOfStockProducts &&
        this.checkMedical.outOfStockProducts.length
      ) {
        this.isCouponShow = true;
      } else {
        uni.navigateTo({
          url: `/pagesA/bussinessOrder/confirmOrderPage/index?diagnosticSheetId=${this.diagnosticSheetId}&source=${this.sourcePA}`,
        });
      }
    },

    async _getCheckDrug() {
      console.log("_getCheckDrug", this.diagnosticSheetId);
      try {
        const res = await getCheckMedical({
          diagnosticSheetId: this.diagnosticSheetId,
        });
        this.checkMedical = res.data;
        console.log("_getCheckDrug ", this.checkMedical);
      } catch (e) {
        console.error("处方药品信息校验接口", e);
      }
    },
    back() {
      // this.postAIComment(this.commentData);
      // #ifdef MP-WEIXIN
      uni.navigateBack();
      this.setConsultationShow(true);
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },
    async postStepOut() {
      const res = await postStepOutApi(this.sheetId);
      console.log(res);
      this.sheetState = 3;
      // #ifdef H5
      this.$dsBridge.call("postEvent", {
        key: `refreshConsultationList`,
      });
      // #endif
    },
    async getTheNewSheetListInfo(id) {
      const res = await GET_IN_SERVICE_LAST({ groupId: id });
      console.log(res);
      this.sheetListInfo = res.data;
      this.petIdStr = this.sheetListInfo.petInformation.petIdStr;
      // this.userAvatarUrl = this.sheetListInfo.userAvatarUrl;
    },

    //平安来源问诊初次进入鉴权弹窗确认请求
    onfirmaBelief(data) {
      const requsetData = {
        // openId: data.openId,
        // thirdType: Number(data.thirdType),
      };
      pinganConfirmRequest(requsetData)
        .then((res) => {
          // false未授权
          if (!res.data) {
            this.popShow = true;
            this.pinganAuthData = { ...data };
          }
        })
        .catch((error) => {});
    },

    pinganPopClose() {
      this.popShow = false;
      this.$pinganPlugin.back();
    },
    //用户授权成功回调
    pinganPopSuccess() {
      this.popShow = false;
    },

    async getUserInfo() {
      try {
        const data = await getUserInfo();

        const userInfo = {
          ...this.userInfo,
          ...data,
        };
        this.setUserInfo(userInfo);
      } catch (e) {
        console.error("获取用户信息错误", e);
      }
    },
    // 融云初始化方法
    async RYconnectMethod() {
      let appkey =
        process.env.NODE_ENV === "production"
          ? "6tnym1br6ffr7"
          : "c9kqb3rdc22dj";

      try {
        // 初始化前移除监听
        // RYremoveEventListener(Events.MESSAGES, this.handleMessages);
        // RYremoveEventListener(Events.EXPANSION, this.handleExpansionUpdate);

        if (!this.ispingAn) {
          await this.getUserInfo();
        }

        await RYinit({ appkey });
        // 平安环境单独传递ryid
        console.log(this.pinganRyID, "this.pinganRyID");
        if (this.ispingAn) {
          await pinganRyConnect(this.pinganRyID);
        } else {
          await RyConnect();
        }
        RYaddEventListener(Events.CONNECTED, () => {
          console.log("连接成功app");
          this.setRyConnectStatus(true);
        });

        RYaddEventListener(Events.DISCONNECT, () => {
          console.log("连接中断，需要业务层进行重连处理");
          this.setRyConnectStatus(false);
        });
        /**
         * 正在链接的事件状态
         */
        RYaddEventListener(Events.CONNECTING, function () {
          console.log("正在链接服务器");
        });
        await this.getMes();
      } catch (error) {
        console.log(error);
        const logManager = wx.getRealtimeLogManager();
        const logger = logManager.tag("plugin-onUserTapSth");
        logger.info("实时日志", "融云初始化", error);
      }
    },
    //获取问诊单详情封装
    getSheetDetail(groupId) {
      GET_IN_SERVICE_LAST({ groupId }).then((aaa) => {
        const {
          inquiryType,
          groupId,
          doctorAvatarUrl: doctorAvatar, // 重命名属性
          doctorUserName: doctorName, // 重命名属性
          id: sheetId, // 重命名属性
          state: sheetState, // 重命名属性
          remainingWaitingTime,
          remainingTime,
          petInformation: { petId, petIdStr }, // 嵌套解构
          userAvatarUrl,
          createTime,
        } = aaa.data;

        // 将解构后的值赋值给组件的 data 属性
        this.inquiryType = inquiryType;
        this.groupId = groupId;
        this.doctorAvatar = doctorAvatar;
        this.doctorName = doctorName;
        this.sheetId = sheetId;
        this.sheetState = sheetState;
        this.remainingTime =
          sheetState === -1 ? remainingWaitingTime : remainingTime; // 条件赋值
        this.petId = petId;
        this.petIdStr = petIdStr;
        this.userAvatarUrl = userAvatarUrl;
        this.createTime = createTime;
      });
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
