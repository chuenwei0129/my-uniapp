<template>
  <view class="contain">
    <view class="index-warp" v-if="isLoading">
      <view class="activities-cover">
        <cpp-navigation-bar
          :bgColor2="!isHeaderShow ? 'black' : 'white'"
          :bgColor="!isHeaderShow ? 'black' : 'white'"
        >
        </cpp-navigation-bar>
        <view class="activities-cover-img">
          <image class="img" mode="widthFix" :src="detailData.coverUrl"></image>
        </view>
        <view class="mask"></view>
      </view>
      <view class="flex-box">
        <view class="detail-info-out">
          <view class="detail-info">
            <view class="detail-info-badgeName" v-if="detailData.badgeName">
              {{ detailData.badgeName }}
            </view>
            <span class="detail-info-tagName" v-if="detailData.tagInfo.tagName">
              <image
                src="https://image.henhenchina.com/62691b131fd33e0001bf328e/2a2f2828f9c346009e78973e65eaf61b.png"
                alt=""
                class="tag-img"
              ></image>
              {{ detailData.tagInfo.tagName }}
            </span>
            <span class="detail-info-name">
              {{ detailData.activityName }}
            </span>
          </view>
          <view
            class="more iconfont icon-moreMenu"
            v-if="
              detailData.activityStatus == 'UP_SHELF' &&
              !isOriginator &&
              userInfo.token
            "
            @click="handleMore"
          ></view>
        </view>
        <!-- 价格 -->
        <view class="detail-price" v-if="detailData.activityType == 'PAY'">
          <view class="price1">¥</view>
          <view class="price2">{{ detailData.price }}</view>
          <view class="price3">起</view>
        </view>
        <!-- 时间 -->
        <view class="detail-info-time align-center" v-if="!timeStyleShow">
          <image
            src="https://image.henhenchina.com/62691b131fd33e0001bf328e/6df6f8b2ce2443d6bb97c7f910e00657.png"
            alt=""
            class="img"
          ></image>
          <view
            class="s time-tag"
            :class="[detailData.activityStatus == 'UP_SHELF' ? 's' : 'e']"
          >
            起
          </view>
          <view class="time-str">{{ detailData.startTime }}</view>
          <view class="line"></view>
          <view
            class="s time-tag"
            :class="[detailData.activityStatus == 'UP_SHELF' ? 's' : 'e']"
          >
            止
          </view>
          <view class="time-str">{{ detailData.endTime }}</view>
        </view>
        <view class="detail-info-time flex" v-else>
          <image
            src="https://image.henhenchina.com/62691b131fd33e0001bf328e/6df6f8b2ce2443d6bb97c7f910e00657.png"
            alt=""
            class="img"
          ></image>
          <view>
            <view class="align-center">
              <view
                class="time-tag"
                :class="[detailData.activityStatus == 'UP_SHELF' ? 's' : 'e']"
              >
                起
              </view>
              <view class="time-str">{{ detailData.startTime }}</view>
            </view>
            <view class="align-center mt-10">
              <view
                class="time-tag"
                :class="[detailData.activityStatus == 'UP_SHELF' ? 's' : 'e']"
              >
                止
              </view>
              <view class="time-str">{{ detailData.endTime }}</view>
            </view>
          </view>
        </view>
        <!-- 地址 -->
        <view class="detail-info-address ellipsis" @click="openAddress">
          <view class="items-center">
            <image
              src="https://image.henhenchina.com/62691b131fd33e0001bf328e/1cf1c00fe5194753ba9b880912501f1c.png"
              alt=""
              class="img"
            ></image>
            {{ detailData.province }}{{ detailData.city }}{{ detailData.county
            }}{{ detailData.detailAddress }}
          </view>
          <view class="iconfont icon-outlineArrowRight"></view>
        </view>
        <!-- 已参与 -->
        <view
          v-if="detailData.signUpUsers && detailData.signUpUsers.length != 0"
        >
          <view
            class="group-chat-title"
            @click="goActivesMemberList('/pagesF/activesMemberList/index')"
          >
            <view class="text">
              {{
                detailData.activityType == "FREE"
                  ? detailData.quantity +
                    "人已参与，还剩" +
                    (detailData.quantityLimit - detailData.quantity) +
                    "个名额"
                  : "已参与" + detailData.quantity
              }}
            </view>
            <view
              class="iconfont icon-outlineArrowRight"
              v-if="userInfo.token"
            ></view>
          </view>
          <view class="group-chat">
            <view class="group-chat-list">
              <view
                class="group-chat-item"
                v-for="item in detailData.signUpUsers"
                :key="item.userId"
              >
                <view class="img">
                  <image
                    class="picture-img"
                    :src="
                      item.userAvatar
                        ? item.userAvatar
                        : 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/morentouxiang.png'
                    "
                    alt=""
                  ></image>
                  <image
                    class="img-one"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/faqiren_2x.png"
                    alt=""
                    v-if="item.identityType == 1"
                  ></image>
                </view>
                <view class="ellipsis p">{{ item.userName }}</view>
              </view>
            </view>
          </view>
        </view>
        <!-- 描述 -->
        <view class="articleDes-title">活动描述：</view>
        <view
          class="articleDes"
          v-html="textRich"
          v-if="detailData.description"
        >
        </view>
        <view
          class="articleDes-imgs"
          v-if="
            detailData.activityObjectStorages &&
            detailData.activityObjectStorages.length != 0
          "
        >
          <image
            class="img"
            :src="item.url"
            mode="widthFix"
            v-for="item in detailData.activityObjectStorages"
            :key="index"
          ></image>
        </view>
        <!-- footer  底部按钮 -->
        <view class="footer">
          <view class="flex mb" v-if="!isOriginator">
            <view
              class="items-center"
              v-if="
                detailData.activityType == 'FREE' &&
                detailData.activityStatus == 'UP_SHELF' &&
                !detailData.isSignUp
              "
            >
              <view
                class="iconfont items-center ic-checked"
                @click="handleChecked"
                :class="[
                  pageState.noticeAgreed
                    ? 'icon-selected black'
                    : 'icon-unSelected',
                ]"
              >
                <view class="text2"> 已阅读并同意 </view>
              </view>
              <view class="checkbox flex">
                <view @click="jumpAgreement">《参加活动用户须知》</view>
              </view>
            </view>
            <!-- 付费协议   -->
            <view
              class="items-center"
              v-if="
                detailData.activityType == 'PAY' &&
                detailData.activityStatus == 'UP_SHELF' &&
                !detailData.isSignUp
              "
            >
              <view
                class="iconfont items-center ic-checked"
                @click="jumpAgreementPay"
                :class="[
                  pageState.noticeAgreedPay
                    ? 'icon-selected black'
                    : 'icon-unSelected',
                ]"
              >
                <view class="text2"> 已阅读并同意 </view>
              </view>
              <view class="checkbox flex">
                <view @click="jumpAgreement">《参加活动用户须知》</view>
              </view>
            </view>
          </view>

          <view
            class="sku-ticket"
            v-if="
              detailData.isSku == true &&
              detailData.isSignUp &&
              !detailData.isOwner
            "
          >
            <Text class="sku-ticket-t"> 票种：</Text>
            <Text class="sku-ticket-name"> {{ detailData.ticketName }}</Text>
          </view>

          <view class="fl-row-justy">
            <view
              class="want want1"
              @click="handleCollect"
              v-if="
                !isOriginator &&
                userInfo.token &&
                detailData.activityStatus == 'UP_SHELF'
              "
            >
              <view
                class="iconfont"
                :class="[
                  detailData.isWant
                    ? 'bright icon-collectHighlight'
                    : 'icon-collect',
                ]"
              >
              </view>
              <view
                class="text"
                :class="[detailData.wantQuantity ? 'bold' : '']"
              >
                {{ detailData.wantQuantity ? detailData.wantQuantity : "收藏" }}
              </view>
            </view>
            <view
              class="want want1"
              @click="setRouter('/pagesF/activesCollectList/index')"
              v-if="isOriginator"
            >
              <view class="iconfont icon-collect"></view>
              <view class="text">收藏列表</view>
            </view>
            <view
              class="share"
              v-if="!isOriginator && BtnStrShow.text !== '活动审核驳回'"
            >
              <image
                class="wx-img"
                src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/icoc_wechat.png"
              >
              </image>
              <view class="text">分享</view>
              <button open-type="share"></button>
            </view>
            <view class="btn" :class="BtnStrShow.class" @click="signUp()">
              {{ BtnStrShow.text }}
            </view>
            <view
              class="add-wx-btn"
              v-if="
                detailData.qrCode &&
                detailData.isSignUp &&
                (detailData.activityStatus == 'FINISHED' ||
                  detailData.activityStatus == 'UP_SHELF') &&
                !isOriginator
              "
              @click="handleAddWxPop()"
            >
              <image
                class="icon"
                src="https://image.henhenchina.com/61ee0fe4f58112000178d924/4bc242481fc8468688cf8330e1f4341a.png"
              ></image>
              <view class="text"> 活动群入口 </view>
            </view>
          </view>
        </view>
        <!--  -->
        <!--  -->
      </view>
      <!-- 活动已开始提示 -->
      <u-modal
        :show="timeShow"
        :title="timeShowStr.title"
        :content="timeShowStr.content"
        :closeOnClickOverlay="true"
        @close="timeShow = false"
        @confirm="
          timeShow = false;
          startTimeBtnConfirm = false;
        "
        confirmText="已知晓"
        confirmColor="#FEE900"
      >
      </u-modal>
      <!-- 取消报名二次提醒弹窗 -->
      <u-modal
        :show="cancelActivitySignup"
        :title="cancelActivitySignupObj.title"
        :closeOnClickOverlay="true"
        @close="cancelActivitySignup = false"
        @cancel="cancelActivitySignup = false"
        @confirm="cancelSignup"
        :cancelText="cancelActivitySignupObj.cancelText"
        :showCancelButton="true"
        :showConfirmButton="cancelActivitySignupObj.showConfirmButton"
        confirmColor="#FEE900"
        :cancelColor="cancelActivitySignupObj.cancelColor"
      >
        <template #default>
          <view class="c-modal-content text-center">
            {{ cancelActivitySignupObj.content }}
            <view
              class="c-modal-content fl-row-center text-center"
              v-if="cancelActivitySignupObj.content2"
            >
              可通过宠胖胖APP-我的-<view class="color-000">我的订单</view>查看
            </view>
          </view>
        </template>
      </u-modal>
      <!-- 参加活动协议须知 -->
      <u-modal
        title="活动协议须知"
        :show="instructionsPop"
        :show-cancel-button="true"
        :confirmText="detailData.activityType == 'PAY' ? '确定' : '同意'"
        confirmColor="#1F1F1F"
        :closeOnClickOverlay="true"
        @close="instructionsPop = false"
        @cancel="instructionsPop = false"
        @confirm="instructionsConfirm"
      >
        <view class="pop-agreement flex">
          参加活动需求接受
          <view>《参加活动用户须知》</view>
        </view>
      </u-modal>

      <!-- 不能取消参与提示 -->
      <u-modal
        :show="forbidCancelPop"
        :closeOnClickOverlay="true"
        :showConfirmButton="false"
      >
        <view class="forbid-box">
          <image
            class="forbid-img"
            src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/a_404.png"
          >
          </image>
          <view class="forbid-title"> 温馨提示 </view>
          <view class="forbid-content"> 活动开始前12小时不能取消参与哦 </view>
          <view class="forbid-content">
            若有疑惑，可去宠胖胖APP联系客服哦～
          </view>
          <view class="forbid-button" @click="forbidCancelPop = false"
            >知道了</view
          >
        </view>
      </u-modal>

      <!-- 选择票种弹窗 ChooseTicket-->
      <ChooseTicket
        ref="test1"
        v-if="chooseTicketPop"
        :ticketsData="ticketsData"
        :activityId="pageState.activityId"
        :type="isOriginator"
        @next="nextChoosePop"
        @close="closeChoosePop"
      />

      <!-- 参加付费活动协议弹窗 setNavigationBarTitle-->
      <PaidAgreementPop
        :show="paidAgreementPop"
        :num="seconds"
        :type="isOriginator"
        @ok="close"
        @close="closePop"
      />

      <!-- 更多操作弹窗 -->
      <MoreOperations
        :show="moreShowPop"
        :orderNo="detailData.orderNo"
        :isSignUp="detailData.isSignUp"
        :activityType="detailData.activityType"
        @close="closeMore"
        @event="cancelParticipation"
      >
      </MoreOperations>

      <!-- 举报原因弹窗 -->
      <ReasonReporting
        :show="reasonShowPop"
        :aid="detailData.id"
        @close="closeMore"
      />

      <!-- 排队提示弹窗 -->
      <QueuePrompt
        :show="orQueueShow"
        :msg="queuePromptContent"
        @cancel="orQueueShow = false"
      />

      <!-- 微信报名弹窗 -->
      <AddWxPop
        :show="addWxPop"
        :aid="pageState.activityId"
        @close="closeAddWxPop"
      />

      <PrivacyPop
        :isOpen.sync="isShowPrivacy"
        :protocol="protocol"
        source="act"
        @close="handlePrivacyClose"
      ></PrivacyPop>
      <!-- TODO -->
      <!-- <modalOrder
        :content="content"
        :isOpen.sync="OrderShow"
        :sureText="sureText"
        @sureFn="handleSubmit"
        :ifCancel="submitType == 'service'"
      /> -->
    </view>
    <view v-else></view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { mapState, mapMutations } from "vuex";
import {
  COMMUNITY_ACTIVITY_DETAIL,
  ACTIVITY_WANT,
  getOrderQueue,
  sendSignUpV2,
  ACTIVITY_CANCEL,
  againConfirm,
  getActivityTicket,
} from "@/api/activityclube";
import { showToast, sendFormId, formId, exchangeEl } from "@/utils/index";
import PaidAgreementPop from "./components/PaidAgreementPop.vue";
import ChooseTicket from "./components/ChooseTicket.vue";

import MoreOperations from "./components/MoreOperations.vue";
import ReasonReporting from "./components/ReasonReporting.vue";
import QueuePrompt from "./components/QueuePrompt.vue";
import AddWxPop from "./components/AddWxPop.vue";
import PrivacyPop from "@/components/privacyPop/index.vue";
import cppNavigationBar from "../components/cpp-navigation-bar/cpp-navigation-bar";
// import modalOrder from "../activesOrderList/components/modalOrder.vue";

export default {
  components: {
    PaidAgreementPop,
    MoreOperations,
    ReasonReporting,
    QueuePrompt,
    ChooseTicket,
    AddWxPop,
    PrivacyPop,
    cppNavigationBar,
    // modalOrder,
  },
  data() {
    return {
      isPayOpen: false,
      isLoading: false,
      pageState: {
        activityId: "63d883b2f4840e000148dc08", //638708b2f82d300001cd60da 63d883b2f4840e000148dc08
        shareUId: "",
        noticeAgreed: false,
        originatorId: "",
        random: 12345,
        noticeAgreedPay: false,
        paySuccess: "0",
      },
      detailData: {},
      weekList: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      startTimeNum: 0,
      // isReloadLogin: false,
      openAppPop: false, // 打开app弹窗
      startTimeBtnConfirm: true, //只提示一次活动已开始弹窗
      timeShow: false, // 活动开始提示弹窗
      instructionsPop: false, // 参加活动协议弹窗
      paidAgreementPop: false, // 参加付费活动协议弹窗
      chooseTicketPop: false, // 选择票种弹窗
      seconds: 3, //倒计时秒数
      timeShowStr: {
        title: "活动提示",
        content: "当前已开始，请注意活动时间，确保仍能正常参与，再决定是否参与",
      },
      moreShowPop: false, //更多操作
      reasonShowPop: false, //控制举报原因弹窗
      addWxPop: false, //添加官方微信弹窗
      orQueueShow: false,
      queuePromptContent: "",
      cancelActivitySignup: false, //付费活动取消参与
      cancelActivitySignupObj: {
        cancelColor: "#25252A",
        cancelText: "取消",
        title: "温馨提示",
        content: "确定取消参与该活动吗？",
        showConfirmButton: true,
      },
      forbidCancelPop: false,
      isHeaderShow: true,
      ticketsData: [],
      isShowPrivacy: false,
      protocol:
        "若您确认点击同意，表示您已同意宠胖胖收集你的手机号用于注册登录账号、收集你的微信昵称、头像用于完善用户基础信息、获取你的位置信息，用于优先展示附近活动、使用你的相册（仅写入）权限用于用户报名名片头像、收集你选中的照片或视频信息用于用户头像、咨询、评论等内容相关功能",
      content: "",
      OrderShow: false,
      submitType: "",
      sureText: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      userId: (state) => state.userId,
    }),
    BtnStrShow() {
      let str = this.detailData.activityStatus;
      /**
       * 已下架、活动已取消、活动已结束 权重高
       * 活动进行中，参与者 ：已参与和立即参与；创建者 ：报名进行中
       * 是创建者才显示，展示活动审核中、活动审核驳回、状态
       * */
      if (this.isOriginator) {
        if (str == "UP_SHELF") {
          str = "originator";
        }
        if (
          this.detailData.auditStatus == "REJECTED" &&
          this.detailData.activityStatus != "FINISHED"
        ) {
          str = "REJECTED";
        }
        if (
          this.detailData.auditStatus == "PENDING" &&
          this.detailData.activityStatus != "FINISHED"
        ) {
          str = "PENDING";
        }
      }
      if (this.detailData.isSignUp && str == "UP_SHELF" && !this.isOriginator) {
        str = "isSignUp";
      }
      // 如果是已报名的活动，二次编辑待审核显示 已参与
      // 二次编辑审核通过 显示 确认继续参与 showConfirm
      if (
        this.detailData.activityType == "PAY" &&
        this.detailData.showConfirm &&
        this.detailData.isAgain &&
        this.detailData.againAuditStatus == "SUCCESS" &&
        this.detailData.isAffirm === false &&
        !this.isOriginator &&
        this.detailData.activityStatus == "UP_SHELF"
      ) {
        str = "isAgain";
      }
      let strList = {
        UN_SHELF: { text: "活动已下架", class: "gray" },
        FINISHED: { text: "活动已结束", class: "isSignUp-gray" },
        CANCELED: { text: "活动已取消", class: "gray" },
        UP_SHELF: { text: "立即参与", class: "" },
        isAgain: { text: "确认继续参与", class: "" },
        originator: { text: "活动报名中", class: "" },
        REJECTED: { text: "活动审核驳回", class: "gray" },
        PENDING: { text: "活动审核中", class: "gray" },
        isSignUp: { text: "已参与", class: "isSignUp-gray" },
      };
      return strList[str];
    },
    // 起止时间展示
    timeStyleShow() {
      let startTime = this.detailData.startTime;
      let endTime = this.detailData.endTime;

      let startTimeStr = `${dayjs(startTime).format("MM/DD")} ${
        this.weekList[Number(dayjs(startTime).format("d"))]
      } ${dayjs(startTime).format("HH:mm")}`;
      let endTimeStr = `${dayjs(endTime).format("MM/DD")} ${
        this.weekList[Number(dayjs(endTime).format("d"))]
      } ${dayjs(endTime).format("HH:mm")}`;
      let startTimeStrYear = `${dayjs(startTime).format("YYYY/MM/DD")} ${
        this.weekList[Number(dayjs(startTime).format("d"))]
      } ${dayjs(startTime).format("HH:mm")}`;
      let endTimeStrYear = `${dayjs(endTime).format("YYYY/MM/DD")} ${
        this.weekList[Number(dayjs(endTime).format("d"))]
      } ${dayjs(endTime).format("HH:mm")}`;

      if (
        (dayjs(endTime).format("YYYY") || dayjs(startTime).format("YYYY")) !=
          String(dayjs().year()) ||
        dayjs(endTime).format("YYYY") != dayjs(startTime).format("YYYY")
      ) {
        this.detailData.startTime = startTimeStrYear;
        this.detailData.endTime = endTimeStrYear;
        return true;
      }

      this.detailData.startTime = startTimeStr;
      this.detailData.endTime = endTimeStr;
      return false;
    },
    // 判断是否是发起人
    isOriginator() {
      if (!this.userId) return false;
      // let str = '107361543954427904';
      let str = this.userId;

      if (this.pageState.random) {
        if (str == this.pageState.originatorId) {
          this.setOriginatorIdentity(true);
          return true;
        }
      }
      this.setOriginatorIdentity(false);
      return false;
    },
    //富文本
    textRich() {
      return exchangeEl(this.detailData.description);
    },
  },
  onLoad(option) {
    this.pageState.activityId = option.aid;
    this.pageState.paySuccess = option.paySuccess;

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
  },
  onUnload() {
    uni.removeStorageSync("noticeAgreed");
  },
  async onShow() {
    console.log("ac onShow", this.pageState.paySuccess);
    await this.getActivity();

    if (uni.getStorageSync("noticeAgreed")) {
      this.pageState.noticeAgreed = true;
    }
    //表单页填写回来调用报名
    if (uni.getStorageSync("storage_form_finsh") === "yes") {
      this.confirmSignUp();
      console.log("this.detailData.qrCode ", this.detailData.qrCode);
      if (this.detailData.qrCode) {
        this.paySuccess();
      }
    }

    if (this.pageState.paySuccess == 1) {
      console.log("this.detailData.qrCode1 ", this.detailData.qrCode);
      if (this.detailData.qrCode) {
        this.paySuccess();
      }
      this.pageState.paySuccess = 0;
    }
  },
  onShareAppMessage() {
    return {
      title: this.detailData.activityName,
      desc: `${this.detailData.quantity}人报名了这个活动`,
      path: `/pagesF/activityDetails/index?aid=${this.pageState.activityId}`,
      imageUrl: this.detailData.coverUrl,
    };
  },
  onPageScroll(e) {
    if (e.scrollTop >= 310) {
      this.isHeaderShow = false;
      return;
    }
    if (e.scrollTop == 0) {
      this.isHeaderShow = true;
    }
  },
  methods: {
    ...mapMutations(["setOriginatorIdentity"]),
    setRouter(url, query) {
      uni.navigateTo({
        url: `${url}?aid=${this.pageState.activityId}`,
      });
    },

    //跳转activesMemberList
    goActivesMemberList(url) {
      if (!this.userInfo.token) {
        // uni.navigateTo({
        // 	url: "/pagesD/login/index",
        // });
        // return;
      } else {
        this.setRouter(url);
      }
    },

    //详情信息
    async getActivity() {
      const { data } = await COMMUNITY_ACTIVITY_DETAIL({
        id: this.pageState.activityId,
      });
      if (data) {
        this.detailData = data;
        this.startTimeNum = data.startTime;
        this.isLoading = true;
        if (
          this.detailData.signUpUsers &&
          this.detailData.signUpUsers.length != 0 &&
          this.detailData.signUpUsers[0].identityType == 1
        ) {
          this.pageState.originatorId = this.detailData.signUpUsers[0].userId;
          this.pageState.random = new Date().getTime();
        }

        // 判断是否付费 ,登录后 已参与  拉起app
        // if (
        //   this.detailData.activityType == "PAY" &&
        //   this.isReloadLogin &&
        //   this.detailData.isSignUp
        // ) {
        //   this.openAppPop = true;
        //   return;
        // }
        // // 判断登录后是否已经参与，未参与 && 不是发起人调起报名接口
        // if (
        //   this.isReloadLogin &&
        //   !this.detailData.isSignUp &&
        //   !this.isOriginator
        // ) {
        //   signUp();
        // } else {
        //   this.pageState.noticeAgreed = this.detailData.isSignUp;
        // }
      } else {
        this.isLoading = false;
      }
    },
    // 点击收藏
    async handleCollect() {
      if (!this.detailData.isWant) {
        const { data } = await ACTIVITY_WANT({ id: this.pageState.activityId });
        if (data) {
          this.getActivity();
        }
      } else {
        const { data } = await ACTIVITY_WANT(
          { id: this.pageState.activityId },
          "DELETE"
        );
        if (data) {
          this.getActivity();
        }
      }
    },
    // 点击查看地址
    openAddress() {
      uni.openLocation({
        latitude: this.detailData.lat,
        longitude: this.detailData.lon,
        name: this.detailData.detailAddress,
      });
    },
    // 发送报名接口
    confirmSignUp() {
      const forms = JSON.parse(uni.getStorageSync("storage_form_extend"));
      const submitFormObj = {};
      for (const key in forms) {
        if (Object.prototype.hasOwnProperty.call(forms, key)) {
          if (!["realName", "phone"].includes(key)) {
            submitFormObj[key] = forms[key];
          }
        }
      }
      const params = {
        activityId: this.pageState.activityId,
        realName: forms.realName,
        phone: forms.phone,
        formExtend: JSON.stringify(submitFormObj),
      };
      sendSignUpV2(params).then((res) => {
        if (!res) {
          return;
        }

        uni.removeStorageSync("storage_form_finsh");
        uni.removeStorageSync("storage_form_extend");
        this.getActivity();
      });
    },
    // 点击立即参与
    async signUp() {
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      if (this.BtnStrShow.text == "确认继续参与") {
        againConfirm({ activityId: this.detailData.id });
        this.getActivity();
        return;
      }
      if (
        this.isOriginator ||
        this.detailData.activityStatus !== "UP_SHELF" ||
        this.detailData.isSignUp
      )
        return;
      // 活动已开始时， 提示弹窗 仅付费
      if (
        this.detailData.activityType == "PAY" &&
        this.startTimeNum <= Date.now() &&
        this.startTimeBtnConfirm
      ) {
        this.timeShow = true;
        return;
      }
      // 提示勾选协议

      if (this.detailData.activityType == "FREE") {
        if (!this.pageState.noticeAgreed) {
          this.instructionsPop = true;
          return;
        }
      } else {
        if (!this.pageState.noticeAgreedPay) {
          this.instructionsPop = true;
          return;
        }
      }

      if (this.detailData.isSku) {
        const { data } = await getActivityTicket({
          activityId: this.pageState.activityId,
        });
        if (data) {
          this.ticketsData = data;
          console.log("ticketsData123:", this.ticketsData);
          this.chooseTicketPop = true;
        }
      } else {
        this.nextChoosePop();
      }

      // sendFormId({
      // 	modelIdArr: [JSON.parse(formId).AEPP, JSON.parse(formId).BvLo, JSON.parse(formId).owjg],
      // 	path: '/pages/index/index',
      // }).then(() => {
      // 	if (this.detailData.orderNo) {
      // 		uni.redirectTo({
      // 			url: `/pages/activiesPayForm/index?aid=${this.detailData.id}`
      // 		});
      // 		return;
      // 	}

      // 	// 跳转表单页
      // 	this.getPlayerQueue().then((res) => {
      // 		uni.setStorageSync('noticeAgreed', true);
      // 		uni.redirectTo({
      // 			url: `/pages/activiesPayForm/index?aid=${this.detailData.id}`
      // 		});
      // 	});
      // });
    },
    // 跳转表单页
    getPlayerQueue() {
      return new Promise((resolve, reject) => {
        getOrderQueue({ activityId: this.pageState.activityId }).then((res) => {
          console.log(res, "---", this.detailData);
          if (this.detailData.isSku) {
            // this.detailData.quantityLimit = 99999999
            resolve();
            return;
          }
          if (
            res.data.queueNum &&
            res.data.participantsNum + res.data.queueNum >=
              this.detailData.quantityLimit
          ) {
            this.queuePromptContent = `当前有用户正在排队报名活动中，请稍后再来查看吧，排队人数：${res.data.queueNum}人`;
            this.orQueueShow = true;
            reject();
          } else if (
            res.data.participantsNum == this.detailData.quantityLimit
          ) {
            this.queuePromptContent = "当前活动报名人数已满，去看看其他活动吧~";
            this.orQueueShow = true;
            reject();
          } else {
            resolve();
          }
        });
      });
    },
    // 同意参与协议
    instructionsConfirm() {
      this.instructionsPop = false;
      if (this.detailData.activityType == "PAY") {
        return;
      }
      this.pageState.noticeAgreed = true;
      // this.signUp();
    },

    handleChecked() {
      this.pageState.noticeAgreed = !this.pageState.noticeAgreed;
    },

    paySuccess() {
      console.log("handleAddWxPop");
      this.addWxPop = true;
    },

    handleAddWxPop() {
      console.log("handleAddWxPop");
      uni.navigateTo({
        url: `/pagesF/welfareGroupTrends/index?aid=${this.pageState.activityId}`,
      });
    },
    jumpAgreement() {
      uni.navigateTo({
        url: "/pagesA/webView/index?route=/meow-interface/html/participate-activities.html&type=jump",
      });
    },

    jumpAgreementPay() {
      if (!this.pageState.noticeAgreedPay) {
        this.paidAgreementPop = true;
      } else {
        this.pageState.noticeAgreedPay = false;
      }
    },
    // 关闭付费协议弹窗 ,并同意
    close() {
      this.paidAgreementPop = false;
      this.pageState.noticeAgreedPay = true;
    },
    // 关闭付费协议弹窗,并取消同意
    closePop() {
      this.paidAgreementPop = false;
      this.pageState.noticeAgreedPay = false;
    },

    // 关闭付费协议弹窗,并取消同意
    closeChoosePop() {
      this.chooseTicketPop = false;
    },

    // 关闭票种选择弹窗,并取消同意
    nextChoosePop(tagIndex = -1, orderNo = "") {
      console.log("nextChoosePop:", tagIndex, orderNo);
      this.chooseTicketPop = false;

      sendFormId({
        modelIdArr: [
          JSON.parse(formId).AEPP,
          JSON.parse(formId).BvLo,
          JSON.parse(formId).owjg,
        ],
        path: "/pagesF/activityIndex/index",
      }).then(() => {
        if (this.detailData.orderNo || orderNo) {
          uni.redirectTo({
            url: `/pagesF/activiesPayForm/index?aid=${this.detailData.id}`,
          });
          return;
        }

        // 跳转表单页
        this.getPlayerQueue().then((res) => {
          uni.setStorageSync("noticeAgreed", true);
          uni.redirectTo({
            url: `/pagesF/activiesPayForm/index?aid=${this.detailData.id}&index=${tagIndex}`,
          });
        });
      });
    },

    handlePrivacyClose() {
      uni.showTabBar();
    },

    // 关闭更多操作
    closeMore(type) {
      this.moreShowPop = false;
      if (type && type == "close") {
        this.reasonShowPop = false;
      }
    },

    // 关闭添加官方微信
    closeAddWxPop(type) {
      this.addWxPop = false;
      if (type && type == "close") {
        this.addWxPop = false;
      }
    },

    //点击更多
    handleMore() {
      this.moreShowPop = true;
    },
    //点击更多-事件
    cancelParticipation(type) {
      console.log("type ", type);
      if (type == 1) {
        this.reasonShowPop = true;
      }
      if (type == 2) {
        uni.navigateTo({
          url: `/pagesF/activesPlaceOrder/index?isExist=${
            this.detailData.orderNo ? true : false
          }&aid=${this.detailData.id}&orderNos=${this.detailData.orderNo}`,
        });
      }
      if (type == 3) {
        // this.cancelSignup();
        if (this.detailData.canCancel == false) {
          this.content =
            "已过截止退款时间，不能进行退款，如有疑问，请联系在线客服。";
          this.OrderShow = true;
          this.submitType = "service";
          this.sureText = "知道了";
        } else {
          this.cancelActivitySignup = true;
        }
      }

      if (type == 4) {
        ACTIVITY_CANCEL(this.detailData.id).then((res) => {
          if (!res.data) return;
          showToast("取消参与成功").then(() => {
            uni.removeStorageSync("noticeAgreed");
            this.getActivity();
          });
        });
      }
      this.closeMore();
    },
    //取消报名
    cancelSignup() {
      this.cancelActivitySignup = false;
      console.log("cancelSignup ");
      if (this.detailData.activityType == "PAY") {
        ACTIVITY_CANCEL(this.detailData.id)
          .then((res) => {
            console.log("res ", res);
            if (!res.data) return;
            this.cancelActivitySignupObj = {
              title: "取消成功",
              content: "参与费用预计24小时内原路退回",
              content2: "可通过宠胖胖APP-我的-我的订单查看",
              cancelText: "确定",
              cancelColor: "#FEE900",
              showConfirmButton: false,
            };
            this.cancelActivitySignup = true;
            uni.removeStorageSync("noticeAgreed");
            this.getActivity();
          })
          .catch((err) => {
            // this.forbidCancelPop = true;
          });
      } else {
        ACTIVITY_CANCEL(this.detailData.id).then((res) => {
          if (!res.data) return;
          showToast("取消参与成功").then(() => {
            uni.removeStorageSync("noticeAgreed");
            this.getActivity();
          });
        });
      }
    },
    handleSubmit() {},
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";

::v-deep .u-popup__content {
  border-radius: 16px !important;
}
</style>
