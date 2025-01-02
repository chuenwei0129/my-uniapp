<script>
import { getCouponCenterList, receiveCoupon } from "@/api/coupon";
import CouponCenterNavBar from "@/pagesE/couponCenter/components/couponCenterNavBar/index.vue";
import NoData from "@/components/noData/index.vue";
import { action_report, display_report } from "@/utils/track";
import couponItem from "./components/couponItem/index.vue";
export default {
  name: "couponCenter",
  components: { NoData, CouponCenterNavBar, couponItem },
  data() {
    return {
      showNavBar: false,
      showOverlay: true,
      triggered: false,
      isCompleted: false,
      noMoreData: false,
      scrollTop: 0,
      oldScrollTop: 0,
      pageNum: 1,
      pageSize: 20,
      navHeight: "",
      bottomSafeAreaHeight: "",
      scrollWrapperHeight: "",
      couponList: [],
      params: {
        pageNum: 1,
        pageSize: 20,
      },
      showUnFoldButton: false,
      isUnfold: false,
    };
  },
  mounted() {
    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + "px";
    this.bottomSafeAreaHeight = getApp().globalData.bottomSafeAreaHeight + "px";
    // #endif

    // #ifdef H5
    this.navHeight = getApp().globalData.h5NavBarFullHeight + "px";
    this.bottomSafeAreaHeight =
      getApp().globalData.h5BottomSafeAreaHeight + "px";
    // #endif

    this.scrollWrapperHeight = `calc(100vh - ${this.navHeight} - ${this.bottomSafeAreaHeight})`;

    this.getCouponList();

    display_report({
      display_name: "couponcenter_display",
    });
  },
  methods: {
    async getCouponList() {
      if (!this.triggered) {
        //下拉加载，先让其变true再变false才能关闭
        this.triggered = true;
        try {
          const res = await getCouponCenterList({
            pageNum: this.params.pageNum,
            pageSize: this.params.pageSize,
          });
          if (this.params.pageNum === 1) {
            this.couponList = [];
            this.isCompleted = false;
          }
          const data = res?.data?.data || [];
          this.couponList = this.couponList.concat(data);

          this.showOverlay = false;
          this.triggered = false;
          this.isCompleted = true;
          this.noMoreData = data.length <= 0;
          if (this.params.pageNum === 1) {
            this.scrollTop = this.oldScrollTop;
            this.$nextTick(() => {
              this.scrollTop = 0;
            });
          }
          console.log("res---------", res);
          console.log("couponList---------", this.couponList);
        } catch (e) {
          this.showOverlay = false;
          this.triggered = false;
          this.isCompleted = true;
          this.noMoreData = false;
        }
      }
    },
    onPulling() {
      this.noMoreData = false;
      this.params.pageNum = 1;
      this.getCouponList();
      console.log("----------onPulling--------");
    },
    onLoadMoreData() {
      if (this.noMoreData) return;
      this.params.pageNum = this.params.pageNum + 1;
      this.getCouponList();
      console.log("----------loadMoreData--------");
    },
    onScrollHandle(scrollTop) {
      this.showNavBar = scrollTop > parseFloat(this.navHeight);
      this.oldScrollTop = scrollTop;
    },
    //领取
    handleReceive(item) {
      uni.$u.debounce(async () => {
        try {
          uni.showLoading({ title: "", mask: true });
          const res = await receiveCoupon({ promotionId: item.id });
          const code = res?.data?.code;
          uni.hideLoading();
          if (code === 0) {
            uni.showToast({ title: "领取成功", icon: "none" });
            this.onPulling();
          }
        } catch (e) {
          uni.hideLoading();
        }
      }, 500);
      action_report({
        action_name: "couponcenter_claimnow_click",
      });
    },
    //去使用
    handleUse(item) {
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/flutter?entryPoint=goodsAvailableWithCouponPage&promotionId=${item.id}`,
      });
      //#endif
      // #ifdef MP-WEIXIN
      if (
        item?.applyPlatform?.includes("APP") &&
        !item?.applyPlatform?.includes("MINI")
      ) {
        // app-专用券跳引导页
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=5`,
        });
        return;
      }
      uni.navigateTo({
        url: `/pagesC/availableGoods/index?promotionId=${item.id}`,
      });
      // #endif

      action_report({
        action_name: "couponcenter_usenow_click",
      });
    },
    //去调末尾的0
    handleNum(num) {
      let str = num.toFixed(2) + "";
      return str.replace(/\.?0+$/, "");
    },
    checkTextLines() {
      // 获取 <div> 标签的节点信息
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".bottom-desc-text")
        .boundingClientRect((data) => {
          // 获取文本内容的高度
          const height = data.height;
          // 假设行高为31rpx
          const lineHeight = 31;
          // 计算文本行数
          const lines = Math.ceil(height / lineHeight);
          console.log(height, lines);
          // 判断文本行数是否达到了2行
          if (lines >= 2) {
            console.log("文本达到了2行或以上");
            this.showUnFoldButton = true;
          } else {
            this.showUnFoldButton = false;
            console.log("文本没有达到2行");
          }
        })
        .exec();
    },
    handleClickUnfold() {
      this.isUnfold = !this.isUnfold;
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="bg-wrapper" v-if="!showNavBar">
      <view class="img-view"> </view>
    </view>
    <view class="navbar-wrapper" :style="{ height: navHeight }">
      <CouponCenterNavBar
        :showNavBar="showNavBar"
        class="navbar"
        showBackBtn
        title="领券中心"
        :titleColor="showNavBar ? '#000' : '#fff'"
        :showTitle="true"
        :navColor="showNavBar ? '#FFF' : 'transparent'"
      />
    </view>
    <view
      v-if="couponList.length"
      class="content-wrapper"
      :style="{ height: scrollWrapperHeight }"
    >
      <u-list
        :height="scrollWrapperHeight"
        :scrollTop="scrollTop"
        @scroll="onScrollHandle"
        @scrolltolower="onLoadMoreData"
      >
        <view class="list-wrapper" :style="{ height: scrollWrapperHeight }">
          <u-list-item v-for="item in couponList" :key="item.id">
            <couponItem
              :item="item"
              @handleUse="() => handleUse(item)"
              @handleReceive="() => handleReceive(item)"
            />
          </u-list-item>
        </view>
      </u-list>
    </view>
    <view>
      <u-loading-page
        v-if="showOverlay"
        :loading="true"
        loading-text="努力加载中…… "
        color="#333"
        font-size="16"
      ></u-loading-page>
    </view>
    <view v-if="!couponList.length && isCompleted" class="no-data-wrapper">
      <NoData
        noDataText="暂无优惠劵"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
