<template>
  <view class="doc-detail-wrapper">
    <view class="color-bg"></view>
    <scroll-view
      class="scroll-warp"
      @scroll="handleScroll"
      @scrolltolower="scrolltolower"
      :scroll-y="!modalopen"
    >
      <!-- #ifdef MP-WEIXIN -->
      <view :class="[pageScrollState ? 'scroll-state' : 'top-bar']">
        <view
          @click="back"
          :class="[
            'back',
            pageScrollState ? 'scroll-state-back' : 'top-bar-back',
          ]"
        ></view>
        <view class="tb-title">医生主页</view>
      </view>
      <!-- #endif -->

      <view class="doc-info">
        <view class="top">
          <view
            :class="[
              'avatar',
              docDetail.workStatus == 'ONLINE' ? 'online' : 'online-not',
            ]"
          >
            <image :src="docDetail.avatarUrl" mode="scaleToFill" />
            <view class="online-tag" v-if="docDetail.workStatus == 'ONLINE'"
              >在线</view
            >
          </view>
          <view class="info-detail">
            <view class="name-info">
              <view class="name">{{
                docDetail.userName && docDetail.userName.slice(0, 10)
              }}</view>
            </view>
            <view class="pro-info">
              <view class="doctitle">
                <view class="icon"></view>
                <view class="pro-title">{{ docDetail.title }}</view>
              </view>
              <view>
                {{
                  docDetail.departmentNames &&
                  Array.isArray(docDetail.departmentNames)
                    ? docDetail.departmentNames.join("&nbsp|&nbsp")
                    : ""
                }}
              </view>
            </view>
            <view
              class="tag-wrap"
              v-if="docDetail.tags && docDetail.tags.length"
            >
              <view
                class="tagitem"
                v-for="(v, i) in docDetail.tags.slice(0, 9)"
                :key="i"
              >
                {{ v }}
              </view>
            </view>
            <view class="hospital" @click="showDescPop('hospitalDesShow')">
              <view class="hospitalicon"></view>
              <view>{{
                docDetail.hospitalName && docDetail.hospitalName.slice(0, 15)
              }}</view>
              <view class="expandarrow"></view>
            </view>
          </view>
        </view>
        <view class="mid">
          <view class="rate">
            <view class="miditem">
              <view class="scoreicon"></view>
              <view class="label">评分</view>
              <text class="num">{{ docDetail.avgScore }}</text>
            </view>
            <view class="miditem">
              <text class="name">累计接诊</text>
              <text class="num margin8">{{ docDetail.totalServiceCount }}</text>
            </view>
            <view class="miditem">
              <text class="name">响应时间</text>
              <text class="num margin8"
                >{{ docDetail.responseTime
                }}<text class="unit" v-if="docDetail.responseTime != '/'"
                  >分钟</text
                ></text
              >
            </view>
          </view>
          <view class="intro" v-if="docDetail.goodDirection">
            <view class="labeltitle">擅长:</view>
            <view class="desccontent"
              >{{ formmatIntro(docDetail.goodDirection)
              }}<view
                class="allicon"
                v-if="docDetail.goodDirection.length > 40"
                @click="showDescPop('goodShow')"
                >全部</view
              ></view
            >
          </view>
          <view class="descwrap" v-if="docDetail.introduction">
            <view class="labeltitle">简介:</view>
            <view class="desccontent"
              >{{ formmatIntro(docDetail.introduction)
              }}<view
                class="allicon"
                v-if="docDetail.introduction.length > 40"
                @click="showDescPop('introduceShow')"
                >全部</view
              ></view
            >
          </view>
        </view>
      </view>
      <view class="rate-list">
        <view class="title">用户评价</view>
        <template v-if="rateList.length">
          <view
            v-for="(item, index) in rateList"
            :key="index"
            class="rate-item"
          >
            <view class="avatar">
              <image :src="item.avatarUrl" mode="scaleToFill" />
            </view>
            <view class="info-detail">
              <view class="name-info">
                <view class="name">{{ item.userName }}的评价</view>
                <view class="time"
                  >{{ item.commentTime.replace(new RegExp("/", "g"), "-") }}
                </view>
              </view>
              <view class="text-content">
                {{
                  item.commentType == 1
                    ? "用户未评价，系统自动好评。"
                    : item.content
                    ? item.content
                    : ""
                }}
              </view>
              <view class="rate">
                <view class="scoreicon"></view>
                <view class="point">评分{{ item.score }}</view>
              </view>
              <view class="tag-list" v-if="item.tags">
                <view v-for="(i, index) in item.tags" class="tag" :key="index"
                  >{{ i.tagName }}
                </view>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="nodata-wrapper">
            <NoData :img="imgSrcNoData" no-data-text="暂无用户评价"></NoData>
          </view>
        </template>
      </view>
      <view style="margin-top: 1rpx; height: 38rpx"></view>
    </scroll-view>
    <view class="bot-card">
      <view
        class="button"
        v-if="docDetail.workStatus == 'ONLINE'"
        @click.stop="
          () => {
            docAsk(docDetail.userId);
          }
        "
        >咨询医生
      </view>
      <view v-if="docDetail.workStatus == 'AWAY'" class="button disabled"
        >暂时离开
      </view>
      <view
        v-if="docDetail.workStatus == 'BUSY'"
        class="button"
        @click="showToast"
        >忙碌中
      </view>
      <view v-if="docDetail.workStatus == 'OFFLINE'" class="button disabled"
        >离线
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
    <GoToChatPage :show.sync="isShowGoTo"></GoToChatPage>
    <CouponChoosePop
      :isOpen.sync="isCouponShow"
      @close="handleCouponClose"
      :coupon-list="couponCommendList"
      :inquiry-type="inquiryTypeForPop"
      :doctorUserId="doctorUserId"
    />
    <InvitePop :isOpen.sync="isInviteShow" @close="handleCouponClose" />
    <DocIntroducePop
      :content="docDetail.introduction"
      :isOpen.sync="descPop.introduceShow"
      @close="handleDescPop('introduceShow')"
    />
    <DocGoodPop
      :content="docDetail.goodDirection"
      :isOpen.sync="descPop.goodShow"
      @close="handleDescPop('goodShow')"
    />
    <HospitalDescPop
      :content="docDetail.hospitalIntroduction"
      :isOpen.sync="descPop.hospitalDesShow"
      @close="handleDescPop('hospitalDesShow')"
    />
    <view class="toast-body" v-if="isShowSelfToast">
      {{ toastContent }}
    </view>
  </view>
</template>

<script>
import NoData from "@/components/noData/index.vue";
import GoToChatPage from "@/components/goToChatPage/index.vue";
import CouponChoosePop from "@/components/couponChoosePop/index.vue";
import InvitePop from "@/components/invitePop/index.vue";
import DocIntroducePop from "../docIntroduce/index.vue";
import DocGoodPop from "../docGood/index.vue";
import HospitalDescPop from "../hospitalDesc/index.vue";
import { display_report, action_report } from "@/utils/track";
import {
  GET_DOC_DETAIL,
  GET_COMMENT_LIST,
  GET_ONLINE_STATUS,
  CAN_I_ASK_V2,
  GET_COUPON_LIST_IN_POP,
  GET_RESOURCE_LIST_IN_POP,
} from "@/api/index";
import { mapState, mapMutations } from "vuex";
const module_name = "medical";
export default {
  components: {
    NoData,
    GoToChatPage,
    CouponChoosePop,
    InvitePop,
    DocIntroducePop,
    DocGoodPop,
    HospitalDescPop,
  },
  data() {
    return {
      current: 0,
      pageScrollState: false,
      rateList: [],
      point: 3,
      imgSrcNoData:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/peiInfo/nodata-tag.png",
      docDetail: {},
      pageNo: 1,
      pageSize: 10,
      userId: "",
      isFinished: false, //无数据,禁止下拉刷新
      omit: true, //是否省略
      isShowGoTo: false,
      isCouponShow: false,
      isInviteShow: false,
      modalopen: false,
      descPop: {
        introduceShow: false,
        goodShow: false,
        hospitalDesShow: false,
      },
      couponCommendList: [],
      inquiryTypeForPop: "EXPERT",
      doctorUserId: "",
      toastContent: "",
      isShowSelfToast: false,
    };
  },
  mounted() {},
  onShow() {
    display_report({
      display_name: "doctor_detail_show",
      object_type: module_name,
      extend: {
        id: this.userId,
      },
    });
  },
  async onLoad(option) {
    console.log(option.userId, option.cityCode);
    this.userId = option.userId;
    const res = await GET_DOC_DETAIL({
      userId: option.userId,
      cityCode: option.cityCode,
    });
    this.docDetail = res.data;
    const res1 = await GET_COMMENT_LIST({ userId: option.userId });
    this.rateList = res1.data.data;
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {},
      fail() {},
    });
  },
  computed: {
    ...mapState([
      "userInfo",
      "userSelectedPetId",
      "userPetList",
      "serviceSheetsList",
    ]),
  },
  methods: {
    setRouter(url, query) {
      uni.navigateTo({
        url,
      });
    },
    showToast() {
      this.$refs.uToast.show({
        type: "default",
        icon: false,
        message: "医生忙碌中",
      });
    },
    formmatIntro(str) {
      let newStr = str.replace("擅长：", "").replace("擅长:");

      return newStr.length > 40 ? newStr.slice(0, 40) + "..." : newStr;
    },
    handleScroll(e) {
      if (e.detail.scrollTop >= 120) {
        this.pageScrollState = true;
      }
      if (e.detail.scrollTop < 120) {
        this.pageScrollState = false;
      }
    },
    showDescPop(type) {
      if (type == "hospitalDesShow") {
        action_report({
          action_name: "doctor_detail_hospital_clk",
          module_name: module_name,
        });
      } else if (type == "goodShow") {
        action_report({
          action_name: "doctor_detail_expert_clk",
          module_name: module_name,
        });
      } else if (type == "introduceShow") {
        action_report({
          action_name: "doctor_detail_brief_clk",
          module_name: module_name,
        });
      }
      this.$set(this.descPop, type, true);
      this.modalopen = true;
    },
    handleDescPop(type) {
      this.$set(this.descPop, type, false);
      this.modalopen = false;
    },
    handleCouponClose() {
      this.isCouponShow = false;
      this.isInviteShow = false;
    },
    async getCommentList() {
      let params = {
        userId: this.userId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        commentType: 2,
      };
      const res = await GET_COMMENT_LIST(params);
      if (this.pageNo > 1) {
        this.rateList = this.rateList.concat(res.data.data);
      } else {
        this.rateList = res.data.data;
      }
      if (res.data.data.length === 0) {
        this.isFinished = true;
      }
    },
    //滚动到底
    scrolltolower() {
      console.log("到底");
      if (!this.isFinished) {
        this.pageNo += 1;
        this.getCommentList();
      }
    },
    back() {
      uni.navigateBack({
        delta: 1, // 返回的页面数
      });
    },
    async docAsk(userId) {
      if (!this.userInfo.token) {
        this.setRouter("/pagesD/login/index");
        return;
      }

      action_report({
        action_name: "doctor_detail_consult_clk",
        module_name: module_name,
      });
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      return;
      // #endif
      console.log("这里是 是H5端");
      this.doctorUserId = userId;
      if (this.serviceSheetsList.length) {
        this.isShowGoTo = true;
        return;
      }
      try {
        const res = await GET_ONLINE_STATUS(userId);
        if (res.data) {
          CAN_I_ASK_V2("EXPERT")
            .then((res) => {
              if (res.data == 1) {
                // #ifdef MP-WEIXIN
                // this.$uma.trackEvent("professional_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                // #endif

                if (this.userPetList.length === 1) {
                  uni.navigateTo({
                    url: `/pagesD/petInfo/index?doctorUserId=${userId}`,
                  });
                  return;
                }
                uni.navigateTo({
                  url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=EXPERT&doctorUserId=${userId}`,
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
    handleOmit() {
      this.omit = !this.omit;
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
