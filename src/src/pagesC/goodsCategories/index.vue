<script>
import GoodsSearchBar from "@/pagesC/components/goodsSearchBar/index.vue";
import GoodsCategoriesItem from "@/pagesC/goodsCategories/components/goodsCategoriesItem/index.vue";
import { getGoodsCategoryTree } from "@/api/mallv2";
import NoData from "@/components/noData/index.vue";
import { action_report } from "@/utils/track";
import NavBar from "@/components/navBar/index.vue";
export default {
  name: "index",
  components: { NoData, GoodsCategoriesItem, GoodsSearchBar, NavBar },
  data() {
    return {
      navHeight: 0,
      scrollViewHeight: "",
      isCompleted: false,
      dataList: [],
    };
  },
  created() {
    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + 8;
    // #endif
    // #ifdef H5
    let h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight);
    // 搜索栏在盒子高度之外  需要加上搜索栏高度this.rpx2px(85)
    this.navHeight = h5NavHeight + Math.ceil(this.rpx2px(8));
    console.log("h5NavHeight", h5NavHeight);
    // #endif
    console.log("this.navHeight", this.navHeight);
    this.scrollViewHeight = `calc(100vh - ${this.navHeight + "px"})`;
  },
  methods: {
    handleReturn() {
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
      // #endif
    },
    rpx2px(rpx) {
      const systemInfo = uni.getSystemInfoSync();
      const screenWidth = systemInfo.screenWidth;
      const pxRatio = screenWidth / 750; // 750 是设计稿的宽度，可以根据实际情况修改
      return rpx * pxRatio;
    },
    onClickHandle() {
      uni.navigateTo({
        url: `/pagesC/searchGoods/index`,
      });
    },
    onGoodItem(item) {
      action_report({
        action_name: "Allcategories_class2_click",
        module_name: "shop",
        extend: {
          class2_name: item.name,
        },
      });
      console.log("item------------", item);
      // #ifdef H5
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/filterGoodsService/index?categoryId=${
            item?.id || ""
          }&title=${item?.name || ""}&source=h5`,
        });
      }, 500);
      // #endif
      // #ifdef MP-WEIXIN
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/filterGoodsService/index?categoryId=${
            item?.id || ""
          }&title=${item?.name || ""}`,
        });
      }, 500);
      // #endif
    },
    async getCategories() {
      try {
        const res = await getGoodsCategoryTree();
        this.dataList = res?.data?.data || [];
        this.isCompleted = true;
        console.log("res-------------", res);
      } catch (e) {
        this.isCompleted = true;
      }
    },
  },
  onLoad() {
    this.getCategories();
  },
};
</script>

<template>
  <view class="page-wrapper">
    <!-- #ifdef MP-WEIXIN -->
    <GoodsSearchBar
      isFixed
      navColor="#F7F8FC"
      disabled
      @onClick="onClickHandle"
    />
    <view :style="{ height: `${navHeight}px` }"></view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <NavBar
      :title="'全部分类'"
      navColor="#ffffff"
      :whiteBack="false"
      showBackBtn
      @navBackClickHandle="handleReturn"
      :customback="true"
      :style="{ position: 'sticky', top: 0, left: 0, zIndex: 999 }"
    >
    </NavBar>
    <!-- #endif -->

    <GoodsCategoriesItem
      v-if="dataList.length"
      :leeMarginTop="navHeight"
      :leeWrapHeight="scrollViewHeight"
      :list="dataList"
      @onGoodItem="onGoodItem"
    />
    <view
      v-if="!dataList.length && isCompleted"
      :style="{ height: scrollViewHeight }"
    >
      <NoData
        noDataText="暂无数据"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
