<template>
  <view class="page-wrapper">
    <view class="top-bg">
      <view class="header">
        <view class="status-bar" :style="{ height: statusBarHeight }"></view>
        <view class="return">
          <view class="icon" @click="handleReturn"></view>
          <text>萌宠咨询</text>
        </view>
      </view>
    </view>
    <view
      class="chat-window-wrapper"
      :style="{
        height:
          isPageChatHalf || isPageEmojiHalf ? scrollViewHeight : initialHeight,
        marginTop: chatWindowTop,
        paddingBottom: '85rpx',
      }"
      @click="handleClickChatWindow"
    >
      <ChatWindow
        :chatMessage="chatMes"
        :key-board-height="keyboardHeight"
        @scrolltoupper="scrolltoupper"
        :has-more="hasMore"
        :sheetState="sheetState"
        :groupId="groupId"
        @sendSuccess="sendSuccess"
        @updateSuccess="updateSuccess"
        :ai-hot-problems="aiHotProblems"
        :ai-hot-problems-index="aiHotProblemsIndex"
        @handleStartQuick="handleStartQuick"
      ></ChatWindow>
      <view
        class="tag"
        @click="
          () => {
            toGuideApp();
          }
        "
      >
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/arti-tag.png"
          mode="scaleToFill"
        />
        <text>人工问诊</text>
      </view>
      <!-- 人工问诊进入头像 -->
      <view
        class="arti-avatar"
        v-if="isShowArtiAvatar"
        @click="handleGoToChatPage"
      ></view>
    </view>
    <ChatZone
      @keyBoardActive="keyBoardActive"
      :group-id="groupId"
      @sendSuccess="sendSuccess"
      @heightChange="handlekeyChange"
      :isPageEmojiHalf="isPageEmojiHalf"
    ></ChatZone>
    <!--  @handleEmojiPanel="handleEmojiPanel" -->
    <GoToChatPage :show.sync="isShowGoTo"></GoToChatPage>
    <CouponChoosePop
      :isOpen.sync="isCouponShow"
      @close="handleCouponClose"
      :coupon-list="couponCommendList"
      :inquiry-type="inquiryTypeForPop"
      :pet-list="petList"
      :CouponChooseFrom="CouponChooseFrom"
      @AICouponChoose="AICouponChoose"
    />
    <InvitePop :isOpen.sync="isInviteShow" @close="handleCouponClose" />

    <!-- <DiseaseDescPop
      :isOpen.sync="isDiseaseDescPop"
      :petId="petId"
      :resourceId="resourceId"
      :resourceType="resourceType"
      :selectPetInfo="selectPetInfo"
      inquiryType="QUICK"
    /> -->
    <PetSelectPop
      :petList="petList"
      :selectPetId="petId"
      :isOpen.sync="isPetShow"
      inquiryType="AI"
      :categoryId="categoryId"
      :categoryName="categoryName"
      :resourceId="resourceId"
      :resourceType="resourceType"
      :selectPetInfo="selectPetInfo"
      @confirm="handleSelectPet"
      @close="handlePetSelectPopClose"
      @closePetInfoPop="handleClosePetInfoPop"
      @setPetList="handleSetPetList"
    />
    <PetInfoPop
      :isOpen.sync="isPetInfoPop"
      :categoryId="categoryId"
      :categoryName="categoryName"
      @confirm="handleSPetInfoNewPet"
      @close="handlePetInfoPopClose"
      @clearcategory="handlePetInfoPopClearcategory"
      :inquiryType="petInfoPopInquiryType"
    />
    <view class="toast-body" v-if="isShowSelfToast">
      {{ toastContent }}
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import ChatWindow from "./components/chatWindow/index.vue";
import ChatZone from "./components/chatZone/index.vue";
import { rpxTopx } from "@/utils/index.js";
// import * as RongIMLib from "@rongcloud/imlib-next";
import {
  Events as RYEvents,
  addEventListener as RYaddEventListener,
  removeEventListener as RYremoveEventListener,
  ConversationType as RYConversationType,
  getHistoryMessages as RYgetHistoryMessages,
  TextMessage as RYTextMessage,
  sendMessage as RYsendMessage,
  ErrorCode as RYErrorCode,
  deleteMessages as RYdeleteMessages,
  init as RYinit,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import GoToChatPage from "@/components/goToChatPage/index.vue";
import CouponChoosePop from "@/components/couponChoosePop/index.vue";
import InvitePop from "@/components/invitePop/index.vue";
import PetInfoPop from "./components/petInfoPop/index.vue";
import { RyConnect } from "@/pagesA/components/rongyunCloud/ryConnect";
import { wxBurying } from "@/api/base/index";
import PetSelectPop from "./components/petSelectPop/index.vue";
import { debounce } from "@/utils/index";
import { getSheetsList } from "@/api/sheets";
import {
  GET_IN_SERVICE_LAST,
  GET_AICHAT_DETAIL,
  QUERY_AICHAT_TOP,
  GET_IN_SERVICE_FOR_AI,
} from "@/api/chat";
import {
  GET_BANNER_INFO,
  CAN_I_ASK_V2,
  GET_RESOURCE_LIST_IN_POP,
  GET_PET_LIST,
} from "@/api/index";
import { mapState, mapMutations } from "vuex";
const Events = RYEvents;
export default {
  //...wxShareMethod(),
  components: {
    ChatWindow,
    ChatZone,
    GoToChatPage,
    CouponChoosePop,
    InvitePop,
    PetInfoPop,
    PetSelectPop,
  },
  props: {
    messText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      statusBarHeight: "",
      chatMes: [],
      keyboardHeight: 0,
      scrollViewHeight: 0,
      // initialHeight: 0,
      isPageChatHalf: false,
      isPageEmojiHalf: false,
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
      aiHotProblemsIndex: {},
      aiHotProblems: [],
      isShowGoTo: false,
      isCouponShow: false,
      isInviteShow: false,
      couponCommendList: [],
      isPetInfoPop: false,
      isPetShow: false,
      petId: "",
      selectPetItem: {},
      petList: [],
      categoryId: "",
      categoryName: "",
      isShowArtiAvatar: false,
      CouponChooseFrom: "AI",
      resourceId: "",
      resourceType: "",
      chatzoneAreaHeight: "0px",
      selectPetInfo: {},
      petInfoPopInquiryType: "AI",
      toastContent: "",
      isShowSelfToast: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      userSelectedPetId: (state) => state.userSelectedPetId,
    }),
    ...mapState({
      lastSheetsMessage: (state) => state.lastSheetsMessage,
      isChooseImage: (state) => state.isChooseImage,
      lastMesSentTime: (state) => state.lastMesSentTime,
      serviceSheetsList: (state) => state.serviceSheetsList,
    }),
    // 172底部输入框加安全高度，${this.statusBarHeight} + 88rpx 顶部距离
    initialHeight() {
      return `calc(100vh - 172rpx - ${this.statusBarHeight} - 88rpx)`;
    },
    chatWindowTop() {
      return `calc(-577rpx + ${this.statusBarHeight} + 88rpx)`;
    },
  },
  watch: {},
  created() {
    // 92:顶部倒计时高度，172:底部输入框+安全距离
    this.emojiHeight = `calc(100vh - 92rpx - 108rpx - 450rpx)`;
  },
  mounted() {
    uni.$off();
    uni.$on("previewImgLock", (res) => {
      this.previewImgLock = true;
    });

    uni.$on("selectPetTypeAI", (option) => {
      console.log("selectPetTypeAI option ", option);
      this.categoryName = option.categoryName;
      this.categoryId = option.categoryId;
    });
  },
  watch: {
    chatMes: {
      handler(val, oldVal) {},
      // immediate: true,
    },
  },
  async onLoad(option) {
    // 融云初始化
    const logManager = wx.getRealtimeLogManager();
    const logger = logManager.tag("plugin-onUserTapSth");
    logger.info("实时日志获取消息", "消息值");
    await this.RYconnectMethod();
    RYaddEventListener(Events.EXPANSION, this.handleExpansionUpdate);
    QUERY_AICHAT_TOP();
    try {
      const res = await GET_AICHAT_DETAIL();
      console.log(res);
      this.groupId = res.data.groupId;
      this.doctorAvatar = res.data.robotUserAvatarUrl;
      this.getMesAndDelete();
    } catch (error) {}
  },
  async onShow() {
    this.getSheetsListMethod();
    console.log(
      this.serviceSheetsList,
      "====================>store.state.serviceSheetsList"
    );
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
        console.log(res.windowTop);
      },
    });
    if (!this.userInfo.token) {
      this.setRouter("/pagesD/login/index");
      return;
    }
    if (this.previewImgLock) {
      this.previewImgLock = false;
      return;
    }
    try {
      const res = await GET_IN_SERVICE_FOR_AI();
      this.isShowArtiAvatar =
        res.data.inquiryType == "QUICK" && res.data.entrance == "AI"
          ? true
          : false;
    } catch (error) {}
    console.log("chat onShow");
    if (!this.isChooseImage) {
      // 添加事件监听 消息的推送
      RYaddEventListener(Events.MESSAGES, this.handleMessages);
    }
    setTimeout(() => {
      // this.getMes();
    }, 300);

    setTimeout(() => {
      if (this.messText) {
        console.log("sendMessText ==");
        this.sendMessText(this.messText);
      }
    }, 300);
  },
  onHide() {
    console.log("chat onHide");
    if (!this.isChooseImage) {
      // 添加事件监听 消息的推送
      RYremoveEventListener(Events.MESSAGES, this.handleMessages);
    }
  },
  onUnload() {
    RYremoveEventListener(Events.MESSAGES, this.handleMessages);
    RYremoveEventListener(Events.EXPANSION, this.handleExpansionUpdate);
  },
  methods: {
    ...mapMutations(["setLastSheetsMessage", "setServiceSheetsList"]),
    ...mapMutations(["setRyConnectStatus", "setUserInfo"]),
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
    keyBoardActive(e) {
      this.keyboardHeight = e;
      const temp = this.rpxTopx(e);
      if (e !== 0) {
        this.isPageChatHalf = true;
        // 同步ui需要减少留白区域
        this.scrollViewHeight = `calc(100vh - 172rpx - ${this.statusBarHeight} - 88rpx - ${temp}rpx + 50rpx - ${this.chatzoneAreaHeight})`;
        //同时容器需要滚动到底部
      } else {
        this.isPageChatHalf = false;
        // this.chatzoneAreaHeight = "0px";
      }
      console.log("接受focus", e);
    },
    rpxTopx,
    //获取融云聊天历史
    getMes() {
      //更新当前会话信息
      var that = this;
      console.log(this.groupId);
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      // 从当前时间开始向前查询
      const option = {
        timestamp: 0,
        count: 20,
        order: 0,
      };
      let mesArr = [];
      RYgetHistoryMessages(conversation, option).then((res) => {
        // if (res.data.list.length < 3 && this.sheetState != -1) {
        //   return this.getMes();
        // }
        if (res.code === 0) {
          this.hasMore = res.data.hasMore;
          uni.setStorageSync("lastMesSentTime", res.data.list[0].sentTime);

          res.data?.list.map((i) => {
            //处理置顶卡片信息
            if (
              i.messageType == "RCAiCutePetChatMsg" &&
              JSON.parse(i.content.message).msgType ==
                "AI_MICRO_CHAT_HOT_PROBLEM"
            ) {
              this.$set(this.aiHotProblemsIndex, i.messageUId, 0);
              this.aiHotProblems = JSON.parse(
                JSON.parse(i.content.message).content
              ).hotProblemList;
            }
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
          this.chatMes = mesArr;
        } else {
        }
      });
    },
    /**
     * 成功发送文字消息
     */
    sendSuccess(e) {
      console.log("成功发送文字消息111", e);
      // 发送后键盘高度0
      this.chatzoneAreaHeight = 0 + "px";
      this.chatMes.push(e);
      let that = this;
      if (e.content.content == "人工问诊") {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
        //关闭人工问诊功能
        return;
        //开始校验 1.在途问诊单 2.问诊次数查询,走快速问诊 3.是否医生 4.是否有卡券
        if (that.serviceSheetsList.length) {
          that.isShowGoTo = true;
          return;
        }
        this.validateQuickAsk();
      }
    },
    /**
     * 获取新消息
     * */
    handleMessages(messages) {
      let that = this;
      messages.messages.forEach(async (item) => {
        if (
          item.messageType === "RC:CmdNtf" &&
          item.content.name === "CONSULTATION:QUICK_CONSULTATION_UPGRADE_NOTICE"
        ) {
          let result = JSON.parse(item.content.data);
          const { groupId, doctorAvatarUrl, doctorUserName } = result;
          const res = await GET_IN_SERVICE_LAST({ groupId });
          const { remainingTime, state } = res.data;
          uni.redirectTo({
            url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify({
              groupId,
              doctorAvatarUrl,
              doctorUserName,
              remainingTime,
              sheetState: state,
            })}&fromOrigin=new&inquiryType=EXPERT`,
          });
        }
        if (item.targetId !== this.groupId) return;
        // 医生未回复 不做任何处理
        if (
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
          // setTimeout(() => {

          // }, 500);
          that.$nextTick(() => {
            that.sheetState = 1;
            that.remainingTime = 1800;
          });
        }
        if (
          item.messageType == "RCAiCutePetChatMsg" &&
          JSON.parse(item.content.message).msgType ==
            "AI_MICRO_CHAT_HOT_PROBLEM"
        ) {
          this.$set(this.aiHotProblemsIndex, item.messageUId, 0);
          this.aiHotProblems = JSON.parse(
            JSON.parse(item.content.message).content
          ).hotProblemList;
        }
        //处理结束信息
        if (
          item.messageType === "RC:InfoNtf" &&
          item.content.message === "本次服务已结束，感谢您的使用！"
        ) {
          // getDocSheets(1, false);
          // pageInfo.objTMT[item.groupId] = null;
          this.sheetState = 2;
          this.isPageChatHalf = false;
          this.isPageEmojiHalf = false;
        }
        //处理超时信息
        if (
          item.messageType === "RC:InfoNtf" &&
          item.content.extra === "QUICK_CONSULTATION:TIMEOUT"
        ) {
          this.sheetState = 5;
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
          isNewMessage: true,
        };

        this.chatMes.push(data);

        // 将这条消息置为已读
        // this.handleReadStatus(item.targetId);
      });
    },

    /**
     * 处理拓展消息更新
     */
    handleExpansionUpdate({ updatedExpansion, deletedExpansion }) {
      if (updatedExpansion) {
        console.log("扩展消息更新：", updatedExpansion);
        this.chatMes = this.chatMes.map(function (item) {
          if (item.messageUId === updatedExpansion.messageUId) {
            if (item.expansion) {
              return {
                ...item,
                expansion: { ...item.expansion, ...updatedExpansion.expansion },
              };
            }
          } else {
            return item;
          }
        });
      }
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
            if (
              i.messageType == "RCAiCutePetChatMsg" &&
              JSON.parse(i.content.message).msgType ==
                "AI_MICRO_CHAT_HOT_PROBLEM"
            ) {
              this.$set(this.aiHotProblemsIndex, i.messageUId, 0);
              this.aiHotProblems = JSON.parse(
                JSON.parse(i.content.message).content
              ).hotProblemList;
            }
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
          this.chatMes = this.chatMes.map((i) => {
            return { ...i, isNewMessage: false };
          });
          this.chatMes = mesArr.concat(this.chatMes);
        } else {
          console.log(res.code, res.msg);
        }
      });
    },
    handlekeyChange(val) {
      const temp = this.rpxTopx(this.keyboardHeight);
      // const he = (val.height - 20) * 2;
      const he = (val.height - 30) * 2;
      // 多行输入时变高度
      this.chatzoneAreaHeight = he + "rpx";
      this.isPageChatHalf = true;
      if (val.height > 48) {
        this.scrollViewHeight = `calc(100vh - 172rpx - ${this.statusBarHeight} - 88rpx - ${temp}rpx - ${he}rpx + 50rpx)
`;
      } else {
        this.scrollViewHeight = `calc(100vh - 172rpx - ${this.statusBarHeight} - 88rpx - ${temp}rpx - ${he}rpx)
`;
      }
    },
    //点击聊天窗体通知表情看板收起
    handleClickChatWindow() {
      this.isPageEmojiHalf = false;
      // this.chatzoneAreaHeight = 0;
    },
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
    //人工问诊，选择问题交互
    sendMessText(content) {
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };

      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      const message1 = new RYTextMessage({
        // 文本内容
        content,
        extra: JSON.stringify({ nickName: this.userInfo.nickName }),
      });
      let options;
      RYsendMessage(conversation, message1, options).then((res) => {
        if (res.code === RYErrorCode.SUCCESS) {
          // 消息发送成功，可以根据返回结果中的 messageId 字段将列表中的该消息状态改为发送成功。
          // console.log("消息发送成功", res.data);
          let data = res.data;
          this.sendSuccess({
            content: { content: data?.content.content },
            messageType: data.messageType,
            userAvatarUrl: this.userInfo.avatarUrl,
            sentTime: data.sentTime,
            direction: data.messageDirection,
            messageUId: data.messageUId,
            state: 1,
          });
          //文本信息添加到当前的message列表内，已经保存了groupid
        } else {
          // message.error("消息发送失败");
          uni.showToast({
            title: "发送失败",
          });
        }
      });
    },
    // 人工问诊校验
    validateQuickAsk() {
      CAN_I_ASK_V2("QUICK")
        .then(async (res) => {
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
            //获取宠物列表
            this.resourceId = "";
            this.resourceType = "";
            this.validatePets();
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
    },
    // 从聊天页面触发人工问诊
    handleStartQuick() {
      let that = this;
      if (that.serviceSheetsList.length) {
        that.isShowGoTo = true;
        return;
      }
      this.validateQuickAsk();
    },
    handleCouponClose() {
      this.isCouponShow = false;
      this.isInviteShow = false;
    },
    handlePetPopClose(param1, param2) {
      console.log("handlePetPopClose ", param1, param2);
      this.isPetShow = false;
      if (param2 == "AI") {
        this.isPetInfoPop = true;
        this.PetInfoPopInquiryType = "petSelectPop";
      }
    },
    handleSelectPet(item, info) {
      // this.selectPetItem = item;
      // console.log("handleSelectPet item ", item);
      // this.petId = item.id;
      // this.isDiseaseDescPop = true;
      // this.selectPetInfo = info;
    },

    handlePetSelectPopClose() {
      console.log("handlePetSelectPopClose == ");
      this.isPetShow = false;
    },

    handlePetInfoPopClose() {
      this.isPetInfoPop = false;
      this.categoryId = "";
      this.categoryName = "";

      // if(this.PetInfoPopInquiryType == 'petSelectPop'){

      // }
    },

    handleClosePetInfoPop() {
      this.categoryId = "";
      this.categoryName = "";
    },

    handleSetPetList(petList) {
      this.petList = petList;
    },

    handlePetInfoPopClearcategory() {
      this.categoryId = "";
      this.categoryName = "";
    },
    handleSPetInfoNewPet(petInfo) {
      console.log("handleSPetInfoNewPet petInfo ", petInfo);
      // this.selectPetItem = item;
      this.petId = petInfo.petId;
      this.resourceId = "";
      this.resourceType = "";
      this.validatePets();
      // this.isPetShow = true;
    },
    // 进入当前发起的快速问诊聊天页面
    handleGoToChatPage: debounce(async function () {
      const res = await GET_IN_SERVICE_FOR_AI();
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
    }, 500),
    // 宠物校验逻辑
    async validatePets() {
      try {
        const res = await GET_PET_LIST({
          userId: this.userInfo.userId,
        });
        // //全局维护一份宠物信息，用来在医生列表内咨询
        // this.petList = res.data.concat([{ type: "add" }]);
        // this.setUserPetList(res.data.concat([{ type: "add" }]));
        console.log("chatPageAi : ", res);
        setTimeout(() => {
          if (!res.data.length) {
            // 没有宠物,展开新建逻辑
            this.isPetInfoPop = true;
          } else {
            // 展开选择宠物疾病描述逻辑
            this.petList = res.data;
            this.petId = this.petList[0].id;
            this.isPetShow = true;
          }
        }, 700);
      } catch (error) {
        console.log(error);
      }
    },
    // ai选择优惠券逻辑
    AICouponChoose() {
      console.log(e);
      // e:{
      // resourceId: this.selectedCouponNo,
      //     resourceType: this.selectResourceType,
      // }
      // this.$emit("AICouponChoose", {
      //     resourceId: this.selectedCouponNo,
      //     resourceType: this.selectResourceType,
      //   });
      this.resourceId = e.resourceId;
      this.resourceType = e.resourceType;
      this.validatePets();
    },
    //获取融云聊天历史,并删除
    getMesAndDelete() {
      //更新当前会话信息
      var that = this;
      console.log(this.groupId);
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      // 从当前时间开始向前查询
      const options = {
        timestamp: 0,
        count: 100,
        order: 0,
      };
      let mesArr = [];
      RYgetHistoryMessages(conversation, {
        timestamp: 0,
        count: 100,
        order: 0,
      }).then((res) => {
        if (res.code === 0) {
          res.data.list.map((i) => {
            if (
              i.messageType == "RCAiCutePetChatMsg" &&
              JSON.parse(i.content.message).msgType ==
                "AI_MICRO_CHAT_HOT_PROBLEM"
            ) {
              mesArr.push({
                messageUId: i.messageUId,
                sentTime: i.sentTime,
                messageDirection: i.messageDirection,
              });
            }
          });
        } else {
        }
        if (mesArr.length) {
          RYdeleteMessages(conversation, mesArr)
            .then((res) => {
              if (res.code === 0) {
                console.log("删除成功");
              } else {
                console.log(res.code, res.msg);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    // 融云初始化方法
    async RYconnectMethod() {
      let appkey =
        process.env.NODE_ENV === "production"
          ? "6tnym1br6ffr7"
          : "c9kqb3rdc22dj";

      // 融云初始化
      console.log("融云初始化");
      try {
        await RYinit({ appkey });
        await RyConnect();
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
        setTimeout(() => {
          this.getMes();
        }, 300);
      } catch (error) {
        console.log(error);
      }
    },
    //关闭人工问诊功能，跳转到引导页面
    toGuideApp() {
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
