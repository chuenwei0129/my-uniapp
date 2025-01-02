<script>
// 一个自定义导航栏，适用于不同的环境（如微信小程序和 H5）。它支持多种配置选项，包括标题文字、返回按钮的样式、导航栏的颜色等
import NavBar from "@/components/navBar/index.vue";
// 一个 商品价格显示组件，主要功能是动态展示商品的售价、原价、折后价，以及与购物车交互
// import GoodsPrice from "@/components/goodsPrice/index.vue";
// 瀑布流布局组件，实现了动态加载数据到左右两列的布局
import MyWaterFall from "@/components/waterfall/index.vue";
// 一个 无数据提示组件，主要用于展示在页面无数据时的友好提示，并为用户提供进一步的操作选项（如“联系客服”或“查看更多”）。
import NoData from "@/components/noData/index.vue";
// 展示一个商店的信息卡片，同时提供导航和拨打电话的操作
// import ApplicableStoreItem from "@/pagesC/applicableStores/components/applicableStoreItem.vue";
// 实现商品排序筛选功能，并显示购物车的数量和动画效果
import GoodsSortFilter from "@/pagesC/components/goodsSortFilter/index.vue";

//  商品筛选(v2新接口)
import { getCategoryTreeGoodsV2 } from "@/api/mall";
// 添加购物车
import { addCart } from "@/api/cart";

export default {
  name: "filterGoodsService",
  components: {
    NoData,
    MyWaterFall,
    // GoodsPrice,
    // ApplicableStoreItem,
    GoodsSortFilter,
    NavBar,
  },
  data() {
    return {
      navHeight: "",
      title: "",
      triggered: false,
      isCompleted: false,
      filterParams: {
        pageNum: 1,
        pageSize: 20,
        classifyId: "",
        sort: 1,
      },
      totalCount: 0,
      list: [],
      showNoMoreData: false,
      searchType: uni.getStorageSync("onlineCurMallId") ? 0 : 1, //有shopid  0 店铺模式  无 1云超模式
    };
  },
  methods: {
    /**
     * 初始化店铺ID
     *
     * 该方法根据不同的平台环境，获取并设置店铺ID
     * 在微信小程序环境中，从本地缓存中获取当前商城的ID
     * 在H5环境中，通过调用原生桥接方法获取店铺ID
     */
    initShopId() {
      // #ifdef MP-WEIXIN
      this.shopId = uni.getStorageSync("onlineCurMallId") || "";
      // #endif

      // #ifdef H5
      this.shopId = this.$dsBridge.call("getMallShopId", "getMallShopId") || "";
      // #endif
    },
    /**
     * 处理返回逻辑
     *
     * 此函数根据不同的平台环境执行不同的返回操作在微信小程序环境中，直接使用uni.navigateBack方法返回上一级页面
     * 在H5环境中，如果用户来自所有分类页面，则使用uni.navigateBack方法返回上一级页面；否则，通过调用dsBridge的closeCurrentWebview方法关闭当前webview页面
     */
    handleReturn() {
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      if (this.isFromAllCategories) {
        uni.navigateBack({
          delta: 1,
        });
        return;
      }
      this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
      // #endif
    },
    onChange(type) {
      this.filterParams.sort = type;
      this.filterParams.pageNum = 1;
      this.onLoadData();
      console.log("----------onChange--------");
    },
    onPulling() {
      this.filterParams.pageNum = 1;
      this.onLoadData();
      console.log("----------onPulling--------");
    },
    async onLoadData() {
      this.showNoMoreData = false;
      if (!this.triggered) {
        //下拉加载，先让其变true再变false才能关闭
        this.triggered = true;
        try {
          if (this.filterParams.pageNum === 1) {
            this.$refs?.waterfallFlow?.clear();
            this.list = [];
            this.isCompleted = false;
          }
          const res = await getCategoryTreeGoodsV2({
            pageNum: this.filterParams.pageNum,
            pageSize: this.filterParams.pageSize,
            classifyId: this.filterParams.classifyId,
            sort: this.filterParams.sort,
            shopId: this.shopId,
            // searchType: this.searchType,
          });
          this.triggered = false;
          // 将数据赋值给瀑布流 list 属性
          this.totalCount = Number(res?.data?.data?.totalCount || 0);
          const data = res?.data?.data?.data || [];

          // if (data.length === 0 && this.searchType === 0) {
          //   //切换云超模式
          //   this.searchType = 1;
          //   this.onLoadData();
          // }

          this.list = this.list.concat(data);
          this.isCompleted = true;
        } catch (e) {
          this.triggered = false;
          this.isCompleted = true;
        }
      }
      console.log("list-------------", this.list);
      console.log("----------onLoadData--------");
    },
    onLoadMoreData() {
      if (this.list.length === this.totalCount) {
        this.showNoMoreData = true;
        return;
      }
      this.filterParams.pageNum = this.filterParams.pageNum + 1;
      this.onLoadData();
      console.log("----------loadMoreData--------");
    },
    onClickItem(item) {
      console.log("item--------", item);
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/goodsServiceDetail/index?itemId=${
            item?.itemId || ""
          }&skuId=${item?.skuId || ""}&shopId=${item?.shopId}`,
        });
      }, 500);
    },
    waterfallFlowLoad() {},
    //购物车加购
    async addCardNum(item) {
      const res = await addCart({
        cartType: 1,
        shopId: item.shopId,
        skuId: item.skuId,
        skuQty: 1,
        tenantId: "default_tenant",
      });

      if (res.data.data.isSuccess) {
        uni.showToast({
          icon: "none",
          title: "加购成功",
          duration: 1000,
        });
        uni.$emit("addCardNumActive");
      }
    },
  },
  mounted() {
    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + "px";
    // #endif
    // #ifdef H5
    const h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight);
    this.navHeight = h5NavHeight + "px";
    // #endif
    uni.$off("addCardNum");
    uni.$on("addCardNum", (res) => {
      this.addCardNum(res);
    });
  },
  onShow() {
    this.$refs?.goodsSortFilter?.getCartNum();
  },
  onLoad(options) {
    // 初始化店铺id
    this.initShopId();
    // #ifdef H5
    // 判断是否来自所有分类页面，仅在H5环境下执行
    // 当前实例全局变量，非响应式变量
    this.isFromAllCategories = options?.source === "h5";
    // #endif
    this.title = options?.title || "";
    this.filterParams.classifyId = options?.categoryId || "";
    this.onLoadData();
  },
  onShareAppMessage() {
    return {
      title: "品牌好物、爱宠服务，省钱省心超好逛！",
      path: `/pagesC/filterGoodsService/index${uni.$u.queryParams({
        title: this.title,
        categoryId: this.filterParams.classifyId,
      })}`,
    };
  },
};
</script>
<template>
  <view class="page-wrapper filter-page-wrapper">
    <view class="top">
      <NavBar
        :title="title"
        navColor="#F7F8FC"
        showBackBtn
        @navBackClickHandle="handleReturn"
        :customback="true"
      />
      <view class="filter-wrapper">
        <GoodsSortFilter @onChange="onChange" ref="goodsSortFilter" />
      </view>
    </view>
    <scroll-view
      v-if="list.length"
      class="scroll-wrapper"
      :style="{
        height: `calc(100vh - 70rpx - ${navHeight} )`,
      }"
      scroll-y
      refresher-enabled
      :refresher-triggered="triggered"
      @refresherrefresh="onPulling"
      @scrolltolower="onLoadMoreData"
    >
      <MyWaterFall
        ref="waterfallFlow"
        v-model="list"
        imgKey="majorPicture"
        @onClickItem="onClickItem"
        :shopLogo="true"
        origin="filterGoodsService"
        :noMoreData="showNoMoreData"
      ></MyWaterFall>
    </scroll-view>
    <view
      v-if="!list.length && isCompleted"
      class="no-data-wrapper"
      :style="{
        height: `calc(100vh - 70rpx - ${navHeight} )`,
      }"
    >
      <NoData
        noDataText="暂无数据"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
    </view>
  </view>
</template>
<style scoped lang="scss">
.filter-page-wrapper {
  background-color: #f7f8fc;
  .filter-wrapper {
    background-color: #f7f8fc;
  }
}
</style>
<style scoped lang="scss">
@import "index";
</style>
