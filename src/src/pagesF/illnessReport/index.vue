<template>
  <view class="wapper">
    <!-- 报告页面背景色 -->
    <view class="illnessBg"></view>
    <view class="content">
      <!-- 顶部导航 -->
      <view class="chatPageNavBar">
        <NavBar
          :title="title"
          titleColor="#000"
          :showBackBtn="true"
          :whiteBack="false"
          @navBackClickHandle="navBackClickHandle"
          :customback="true"
        />
        <!-- #ifdef H5 -->
        <image
          @click="shareMedical"
          class="shareIcon"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/iconshare.png"
          mode="scaleToFill"
        />
        <!-- #endif -->
      </view>
      <!-- 切换tabs（最多三个） -->
      <view class="changeIllness" v-if="reportIllnessReportList.length > 1">
        <view
          class="tabsItem"
          v-for="(item, index) in reportIllnessReportList"
          :key="index"
          @click="checkItme(index)"
        >
          <view
            class="itemNmae tabsName"
            :class="{ activeItem: isTabsChecked(index) }"
            >{{ item.diseaseName }}</view
          >
          <view class="line" :class="{ active: isTabsChecked(index) }"></view>
        </view>
      </view>
    </view>

    <!-- 报告名称以及图表 -->
    <view class="illnessPic">
      <view class="illname">{{
        reportIllnessReportList[tabsChecked].diseaseName
      }}</view>
      <view class="line"></view>
      <view class="completed">匹配度：</view>
      <view class="levelImg" style="padding: 10px">
        <image
          style="width: 100%; height: 84px"
          :src="reportIllnessReportList[tabsChecked].rateImage"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="illness">
      <!-- 疾病定义 -->
      <view class="illnessInfo">
        <view class="illnessItem">
          <view class="itemTitle">疾病定义</view>
          <view class="itemContent">{{
            reportIllnessReportList[tabsChecked].definition
          }}</view>
        </view>
        <view class="illnessItem">
          <view class="itemTitle">常见临床表现</view>
          <view class="itemContent">{{
            reportIllnessReportList[tabsChecked].clinicalManifestation
          }}</view>
        </view>
        <view class="illnessItem">
          <view class="itemTitle">病因</view>
          <view class="itemContent">{{
            reportIllnessReportList[tabsChecked].causes
          }}</view>
        </view>
        <view class="illnessItem">
          <view class="itemTitle">治疗建议</view>
          <view class="itemContent">{{
            reportIllnessReportList[tabsChecked].treatmentSuggestions
          }}</view>
        </view>
        <view class="illnessItem">
          <view class="itemTitle">护理建议</view>
          <view class="itemContent">{{
            reportIllnessReportList[tabsChecked].careSuggestions
          }}</view>
        </view>
        <!-- 到底 -->
        <view class="reachBottom"> 已经到底了~ </view>
      </view>
    </view>
    <view class="safebottom"></view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
import { action_report, display_report } from "@/utils/track";
import { getAiDetail } from "@/pagesF/api/aiConsultation/index";
// #ifdef H5
import { secondShare } from "@/utils/secondshare";
// #endif
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
    NavBar,
  },
  data() {
    return {
      sheetId: "",
      title: "智能问诊报告",
      tabsChecked: 0,
      reportIllnessReportList: [],
    };
  },
  methods: {
    // 报告详情页
    async getAiDetailInfo() {
      try {
        const res = await getAiDetail({ id: this.sheetId });
        console.log(res);
        this.reportIllnessReportList = res.data.reportList;
      } catch (error) {
        console.log(error);
      }
    },
    checkItme(index) {
      this.tabsChecked = index;
    },
    isTabsChecked(index) {
      return this.tabsChecked === index;
    },
    navBackClickHandle() {
      // #ifdef MP-WEIXIN
      uni.navigateBack();
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },
    shareMedical() {
      console.log("点击分享事件", shareActivityUrl);
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
      // wxShareMethod();
    },
  },
  onShareAppMessage(e) {
    const { userId } = uni.getStorageSync("storage_info");
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
      path: `/pagesF/illnessReport/index?shareType=WECHAT_FRIEND&userId=${userId}&sheetId=${this.sheetId}`,
    };
  },
  onShareTimeline(e) {
    const { userId } = uni.getStorageSync("storage_info");
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
      path: `/pagesF/illnessReport/index?shareType=WECHAT_CIRCLE&userId=${userId}&sheetId=${this.sheetId}`,
    };
  },
  onShow() {
    // #ifdef H5
    setTimeout(() => {
      secondShare({
        title: "智能宠物医生、7×24小时在线",
        desc: "7×24小时在线",
        link: `${window.location.origin}/crm-medical-h5/#/pagesF/illnessReport/index?tabs=0&sheetId${this.sheetId}`,
        imgUrl:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/shareActive.png",
      });
    }, 500);
    // #endif
  },
  created() {
    console.log(1234567898765434567898765);
  },
  onLoad(options) {
    console.log(options);
    // #ifdef MP-WEIXIN
    this.sheetId = options.sheetId;
    if (options.shareType) {
      uni.setStorageSync("shareType", options.shareType);
    } else {
      uni.setStorageSync("shareType", "WECHAT_XCX");
    }
    // #endif
    // #ifdef H5
    this.sheetId = options.id || options.sheetId;
    uni.setStorageSync("shareType", "APP");
    // #endif
    this.getAiDetailInfo();
    this.tabsChecked = +options.tabs || 0;
    // 智能问诊页面报告页面曝光
    display_report({
      display_name: "IntelligentconsultationIM_ReportInterpretation_display",
      object_type: "ai_consultation",
      extend: {
        source:
          uni.getStorageSync("umt_extend").umt_code ||
          uni.getStorageSync("shareType"),
      },
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
