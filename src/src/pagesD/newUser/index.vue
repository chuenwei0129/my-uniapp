<template>
  <scroll-view
    class="newuser-homepage"
    scroll-y="true"
    @scroll="handleScroll"
    @scrolltolower="onLoadMoreData"
    :scroll-top="scrollTop"
  >
    <view class="bg"></view>
    <FixedNav
      :title="homeInfo.pageTitle"
      :headerShow="isHeaderShow"
      :backfc="handleBack"
    ></FixedNav>
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="top-bar" :style="{ height: navBarHeight }">
        <!-- 'top-bar', -->
        <view class="iconfont icon-back" @click="handleBack"></view>
        <view class="top-bar-t">{{ homeInfo.pageTitle }}</view>
        <view></view>
      </view>
    </view>
    <view class="rule-btn" @click="goRule"></view>
    <view class="topicon" @click="handleToTop" v-if="showTopIcon">
      <view class="toparrow"></view>
      <view class="text">顶部</view>
    </view>
    <template v-if="requestFlag">
      <template
        v-if="
          (homeInfo.newPersonRefList && homeInfo.newPersonRefList.length) ||
          (homeInfo.couponPackList && homeInfo.couponPackList.length)
        "
      >
        <view
          class="free-goods"
          v-if="homeInfo.newPersonRefList && homeInfo.newPersonRefList.length"
        >
          <view class="free-goods-title">{{
            homeInfo.newPersonActivityName
          }}</view>
          <view class="goodsList">
            <view
              class="good-item"
              v-for="(item, index) in homeInfo.newPersonRefList"
              :key="item.refId"
              @click="validate(item)"
            >
              <view class="good-image">
                <image :src="item.refImg"></image>
              </view>
              <view class="good-info">
                <view class="good-name">{{ item.refName }}</view>
                <view class="good-get">
                  <view class="good-price">{{ item.refPrice }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="coupon-part">
          <template
            v-if="homeInfo.couponPackList && homeInfo.couponPackList.length"
          >
            <CouponList
              :homeInfo="homeInfo"
              @refreshhome="refreshHome"
            ></CouponList>
          </template>
          <template v-else>
            <view class="used-guide">
              <view>
                <view class="used-tips"
                  >新人券包没有了～<br />即刻去下单享更多超值优惠！</view
                >
                <view class="guidebtn" @click="goMall">去商城选购</view>
              </view>
            </view>
          </template>
        </view>
        <view
          class="justify-goods"
          v-if="homeInfo.couponPackList && homeInfo.couponPackList.length"
        >
          <view
            class="tab-wrap"
            v-if="homeInfo.couponPackList && homeInfo.couponPackList.length > 1"
          >
            <view class="tabbg"></view>
            <view class="tabitem-list">
              <view
                :class="[
                  'tab-item',
                  `${index == activeTabIndex ? 'active' : ''}`,
                ]"
                v-for="(item, index) in homeInfo.couponPackList"
                :key="index"
                @click="changeTab(index, item)"
                >{{ item.prefectureDesc }}</view
              >
            </view>
          </view>
          <GoodsList
            :list="goodList"
            :active-info="activeTabInfo"
            :home-info="homeInfo"
            :loadmore="loadmore"
            @loadmoreupdate="updateLoadMore"
          ></GoodsList>
        </view>
      </template>
      <template v-else>
        <view class="empty">
          <NoData
            noDataText="您已享受新人专项礼"
            img="https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/emptyimage.png"
          ></NoData>
        </view>
      </template>
    </template>

    <!-- <view class="safebottom" :style="{ height: safebottomHeight }"></view> -->
    <u-toast ref="uToast"></u-toast>
  </scroll-view>
</template>
<script>
import FixedNav from "@/components/fixedNav/index.vue";
import CouponList from "./components/couponList.vue";
import GoodsList from "./components/goodsList.vue";
import NoData from "@/components/noData/index.vue";
import { action_report, display_report } from "@/utils/track";
import { QUERY_HOME_INFO, CHECK_NEWUSER } from "@/api/newUser";
import { debounce } from "@/utils";

export default {
  components: {
    FixedNav,
    CouponList,
    GoodsList,
    NoData,
  },
  data() {
    return {
      isHeaderShow: false,
      naviTitle: "新人专享礼",
      statusBarHeight: "",
      navBarHeight: "",
      safebottomHeight: "",
      activeTabIndex: 0,
      goodList: [],
      homeInfo: {},
      activeTabInfo: {},
      requestFlag: false, //第一次请求标记
      first: true, //第一次请求标记
      loadmore: false,
      showTopIcon: false, //向上滑动icon
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
    };
  },
  onShow() {
    // 展示事件
    display_report({
      display_name: "newcomerspage_display",
      object_type: "",
    });
    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.safebottomHeight = getApp().globalData.bottomSafeAreaHeight + "px";
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    this.safebottomHeight = getApp().globalData.h5BottomSafeAreaHeight + "px";
    //#endif
    this.getHomeInfo();
  },
  onLoad() {
    // this.getHomeInfo();
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  methods: {
    handleToTop() {
      this.scrollTop = this.old.scrollTop;
      setTimeout(() => {
        this.$nextTick(() => {
          this.scrollTop = 0;
        });
      }, 150);
    },
    updateLoadMore() {
      console.log("解锁--");
      this.loadmore = false;
    },
    onLoadMoreData() {
      this.loadmore = true;
      console.log("到底了---");
    },
    refreshHome() {
      uni.redirectTo({
        url: "/pagesD/newUser/index",
      });
    },
    handleBack() {
      console.log("back back");
      //#ifdef H5
      if (this.isNative) {
        if (
          !this.homeInfo.newPersonRefList?.length &&
          !this.homeInfo.couponPackList?.length
        ) {
          this.$dsBridge.call("closeNewPersonBanner", {});
        }
        this.$dsBridge.call("closeCurrentWebview", {});
      } else {
        // router.go(-1);
      }
      //#endif
      //#ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      //#endif
    },
    goRule: debounce(function () {
      action_report({
        action_name: "newcomerspage_rule_click",
        module_name: "",
      });
      uni.navigateTo({
        url: "/pagesD/newUser/components/rule",
      });
    }, 500),
    goMall() {
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: "/app/main?locate_main_fragment=2&tab=online",
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.switchTab({
        url: `/pages/mall/index`,
      });
      //#endif
    },
    handleScroll(e) {
      if (e.detail.scrollTop >= 50) {
        this.isHeaderShow = true;
      }
      if (e.detail.scrollTop < 50) {
        this.isHeaderShow = false;
      }
      this.old.scrollTop = e.detail.scrollTop;
      this.showTopIcon = e.target.scrollTop > 500;
    },
    changeTab(index, item) {
      this.activeTabIndex = index;
      this.activeTabInfo = item;
    },
    async getHomeInfo() {
      const { data } = await QUERY_HOME_INFO();
      this.homeInfo = data.data;
      this.requestFlag = true;
      this.activeTabIndex = 0;
      if (data.data.couponPackList?.length) {
        this.activeTabInfo = data.data.couponPackList[this.activeTabIndex];
      }
      if (
        !this.homeInfo.newPersonRefList?.length &&
        !this.homeInfo.couponPackList?.length
      ) {
        //失败
        this.$refs.uToast.show({
          type: "default",
          icon: false,
          message: "已参与完活动，返回首页",
        });
        setTimeout(() => {
          //#ifdef H5
          this.$dsBridge.call("closeNewPersonBanner", {});
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `/home?homeSelectedIndex=0`,
            // query: {
            //   index: 0,
            // },
          });
          //#endif
          //#ifdef MP-WEIXIN
          uni.switchTab({
            url: "/pages/mall/index",
          });
          //#endif
        }, 1000);
      }
    },
    //校验是否可抢
    validate(item) {
      console.log("item--------", item);
      uni.$u.debounce(async () => {
        action_report({
          action_name: "newcomerspage_freegoods_click",
          module_name: "",
        });
        const { data } = await CHECK_NEWUSER();
        if (data?.success) {
          //#ifdef H5
          if (item.itemId) {
            this.$dsBridge.call("gotoPageThroughRoute", {
              page: `/flutter?entryPoint=goodsShopSpecialDetailPage&type=1&primaryId=${
                item.itemId
              }&skuId=${item.refId || ""}&shopId=${item.shopId}&activityId=${
                this.homeInfo?.newPersonActivityId
              }`,
            });
          }
          //#endif

          //#ifdef MP-WEIXIN
          if (item.itemId) {
            uni.navigateTo({
              url: `/pagesC/goodsServiceDetail/index?itemId=${
                item?.itemId || ""
              }&skuId=${item?.refId || ""}&shopId=${item?.shopId}&activityId=${
                this.homeInfo?.newPersonActivityId
              }`,
            });
          }
          //#endif
        }
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
