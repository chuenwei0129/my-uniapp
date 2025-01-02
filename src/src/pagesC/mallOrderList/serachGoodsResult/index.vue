<template>
  <view class="page">
    <!-- 头部搜索 -->
    <view
      class="header"
      :style="{
        paddingTop: statusBarHeight,
      }"
    >
      <!-- 顶部搜索 -->
      <view class="top-navbar">
        <view class="left-icon" @click="handleNavBack"></view>
        <view class="search">
          <u-search
            v-model="searchValue"
            :showAction="false"
            disabled
            placeholder="搜索门店/商品名"
            searchIcon="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/consultationBg-scroll.png"
            @click="handleNavBack"
          ></u-search>
        </view>
      </view>
    </view>

    <!-- 内容 -->
    <view class="main">
      <scroll-view
        scroll-y
        :style="{
          height: `calc(100vh - ${headerHeight}rpx)`,
        }"
        enable-flex="true"
        :scroll-top="newScrollTop"
        @scroll="scroll"
        @scrolltolower="scrollReachBottom"
      >
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { pxToRpx, rpxToPx } from "@/utils/index";
import { GET_SEARCH_ORDER_LIST } from "@/api/mallv2";
export default {
  onLoad(options) {
    this.searchValue = options.searchValue;
    this.getGoodsList();
  },
  data() {
    return {
      headerHeight: 0,
      statusBarHeight: 0,
      newScrollTop: 0,
      oldScrollTop: 0,
      searchValue: "",
      pageNum: 1,
      pageSize: 20,
      loading: false,
      finished: false,
      oldSerachList: [],
    };
  },
  computed: {
    isNative() {
      let isdefH5;
      //#ifdef H5
      isdefH5 = false;
      //#endif
      //#ifdef MP-WEIXIN
      isdefH5 = true;
      //#endif
      return isdefH5;
    },
  },
  mounted() {
    this.setPageHeight(); // 获取顶部安全区，设置scrollView的高度 滚动
  },
  methods: {
    handleNavBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    setPageHeight() {
      let height = 0;
      // 获取头部高度
      uni
        .createSelectorQuery()
        .in(this)
        .select(".header")
        .boundingClientRect((data) => {
          // 获取顶部安全区，计算list高度 方便滚动
          console.log("头部高度", data.height);

          //#ifdef MP-WEIXIN
          this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
          this.headerHeight =
            pxToRpx(Number(getApp().globalData.statusBarHeight)) +
            pxToRpx(data.height);
          console.log("height", height);
          //#endif

          //#ifdef H5
          this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
          this.headerHeight =
            pxToRpx(Number(getApp().globalData.h5StatusBarHeight)) +
            pxToRpx(data.height);
          console.log(this.headerHeight);
          //#endif
        })
        .exec();
    },
    // 获取订单数据
    async getGoodsList() {
      if (this.finished || this.loading) return;
      this.loading = true;
      try {
        const params = {
          page: this.pageNum,
          size: this.pageSize,
          channel: this.isNative ? 2 : 1,
          keyWord: this.searchValue,
        };
        const { data } = await GET_SEARCH_ORDER_LIST(params);
        if (this.pageNum === 1) {
          this.orderList = data.data.data || [];
        } else {
          this.orderList = [...this.orderList, ...data.data.data];
        }

        // 数据全部加载完成
        this.loading = false;
        if (data.data.data.length < 20) {
          this.finished = true;
        }
        if (this.firstLoading) {
          this.firstLoading = false;
        }
      } catch (error) {
        this.loading = false;
        this.firstLoading = false;
      }
    },
    // 触底加载
    scrollReachBottom() {
      console.log("触底加载");
      this.getGoodsList();
    },
    scroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>