<template>
  <view class="page-wrapper">
    <view class="color-bg"></view>
    <view class="header-top">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="return" @click="handleReturn"></view>
      <text>邀请好友</text>
    </view>
    <!-- <view>
      <button open-type="" hover-class="button-hover" @click="handleGoToRule">
        规则页面
      </button>
    </view> -->
    <view class="card-step">
      <view class="title-con">
        <view class="title-line"></view>
        <view class="title-text">参与步骤</view>
        <view class="title-line"></view>
      </view>

      <view class="step-con">
        <view class="step-item">
          <view class="icon icon1"></view>
          <view class="text-con">
            <text>分享链接</text>
            <text>给好友</text>
          </view>
        </view>
        <view class="step-right-con">
          <view class="step-right"></view>
        </view>
        <view class="step-item">
          <view class="icon icon2"></view>
          <view class="text-con">
            <text>好友</text>
            <text>成功注册</text>
          </view>
        </view>
        <view class="step-right-con">
          <view class="step-right"></view>
        </view>
        <view class="step-item">
          <view class="icon icon3"></view>
          <view class="text-con">
            <text>助力成功</text>
            <text>获得问诊券</text>
          </view>
        </view>
      </view>
    </view>
    <view class="invite-list">
      <view class="title-con">
        <view class="title-line"></view>
        <view class="title-text">邀请记录</view>
        <view class="title-line"></view>
      </view>
      <view class="invite-num">已成功邀请{{ shareSuccessNum }}人</view>
      <view class="list-wrapper">
        <template v-if="sharedList.length">
          <view class="item" v-for="item in sharedList" :key="index">
            <view class="img-con">
              <image :src="item.inviteeUserAvatar" mode="scaleToFill" />
            </view>
            <view class="item-content">
              <view class="header">
                <view class="phone">{{ item.inviteeUserNick }}</view>
                <view class="state">
                  <text>已助力</text>
                </view>
              </view>
              <view class="bottom">
                <view class="time">{{ item.createTime }}</view>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view>
            <NoData
              noDataText="列表为空，快去分享好友来助力"
              img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
            ></NoData>
          </view>
        </template>
      </view>
    </view>
    <view class="rule-button" @click="handleGoToRule"></view>
    <view class="share-zone">
      <button class="btn" open-type="share" hover-class="none">
        分享邀请好友
      </button>
    </view>
  </view>
</template>

<script>
//  //import { wxShareMethod } from "@/utils/wxShare";
import { GET_BE_SHARED } from "@/api/activity";
import NoData from "@/components/noData/index.vue";

export default {
  components: { NoData },
  data() {
    return {
      statusBarHeight: "",
      cppIcon:
        "https://image.henhenchina.com/61ee0fe4f58112000178d924/c5427b907df640be93f52778c0796603.png",
      isOpen: false,
      sharedList: [], //被分享人列表
      previousUserId: "", //推荐人的used
      shareSuccessNum: 0,
    };
  },

  onLoad(option) {},
  onReady() {},
  onShow() {
    const _this = this;
    uni.getSystemInfo({
      success: function (res) {
        _this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    const { userId } = uni.getStorageSync("storage_info");
    this.previousUserId = userId;
    GET_BE_SHARED({
      activeCode: "MEDICAL",
    }).then((res) => {
      console.log(res);
      this.sharedList = res.data.filter((i) => i.effective);
      for (let i of res.data) {
        if (i.effective) {
          this.shareSuccessNum++;
        }
      }
    });
  },
  //分享相关功能
  onShareAppMessage(res) {
    return {
      title: "您的好友急需您的助力！",
      path: `/pages/index/index?previousUserId=${this.previousUserId}`,
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/wxshare-img.png",
      desc: "您的好友急需您的助力！",
    };
  },
  methods: {
    handleGoToRule() {
      uni.navigateTo({
        url: "/pagesB/shareRule/index",
      });
    },
    handleReturn() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
