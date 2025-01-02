<script>
import NavBar from "@/components/navBar/index.vue";
import ApplicableStoreItem from "@/pagesC/applicableStores/components/applicableStoreItem.vue";
import GoodsSortFilter from "@/pagesC/components/goodsSortFilter/car.vue";
import { AVAILABLE_GOODS_LIST } from "@/api/mall";
import { addCart } from "@/api/cart";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import MyWaterFall from "@/components/waterfall/index.vue";
import NoData from "@/components/noData/index.vue";
import { action_report, display_report } from "@/utils/track";

export default {
  name: "filterGoodsService",
  components: {
    NoData,
    MyWaterFall,
    GoodsPrice,
    ApplicableStoreItem,
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
      shopId: uni.getStorageSync("onlineCurMallId"),
      promotionId: "",
      searchType: uni.getStorageSync("onlineCurMallId") ? 0 : 1, //有shopid  0 店铺模式  无 1云超模式
    };
  },
  methods: {
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
      if (!this.triggered) {
        //下拉加载，先让其变true再变false才能关闭
        this.triggered = true;
        try {
          if (this.filterParams.pageNum === 1) {
            this.$refs?.waterfallFlow?.clear();
            this.list = [];
            this.isCompleted = false;
          }
          const res = await AVAILABLE_GOODS_LIST({
            pageNum: this.filterParams.pageNum,
            pageSize: this.filterParams.pageSize,
            shopId: this.shopId,
            promotionId: this.promotionId,
            // searchType: this.searchType,
          });
          this.title = res?.data?.data.title;
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
    },
    onLoadMoreData() {
      if (this.list.length === this.totalCount) return;
      this.filterParams.pageNum = this.filterParams.pageNum + 1;
      this.onLoadData();
    },
    onClickItem(item) {
      // #ifdef MP-WEIXIN
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/goodsServiceDetail/index?itemId=${
            item?.itemId || ""
          }&skuId=${item?.skuId || ""}&shopId=${item?.shopId}`,
        });
      }, 500);
      // #endif
      //#ifdef H5
      const goodsDomain = {
        development: "https://dev-cpp.chongpangpang.com/crm-medical-h5/#",
        test: "https://test-cpp.chongpangpang.com/crm-medical-h5/#",
        production: "https://cpp.chongpangpang.com/crm-medical-h5/#",
      };
      let jumpUrl = `${
        goodsDomain[process.env.NODE_ENV]
      }/pagesC/goodsServiceDetail/index?itemId=${item?.itemId || ""}&skuId=${
        item?.skuId || ""
      }&shopId=${item?.shopId}&transparentTopBar=1`;
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: jumpUrl,
      });
      // #endif
      action_report({
        action_name: "promotionalgoodslist_goods_click",
      });
    },
    waterfallFlowLoad() {},
    //购物车加购
    addCardNum(item) {
      uni.$u.debounce(async () => {
        try {
          const res = await addCart({
            cartType: 1,
            shopId: item.shopId || uni.getStorageSync("onlineCurMallId"),
            skuId: item.skuId,
            skuQty: 1,
            tenantId: "default_tenant",
          });

          if (res.data.data.isSuccess) {
            uni.showToast({
              icon: "none",
              title: "加购成功",
              duration: 1500,
            });
            uni.$emit("addCardNumActive");
          }
        } catch (e) {}
      }, 500);
    },
  },
  mounted() {
    this.navHeight = getApp().globalData.navHeight + "px";
    uni.$off();
    uni.$on("addCardNum", (res) => {
      this.addCardNum(res);
    });
  },
  onLoad(options) {
    (this.promotionId = options?.promotionId || ""), this.onLoadData();
    display_report({
      display_name: "promotionalgoodslist_display",
    });
  },
};
</script>
<template>
  <view class="page-wrapper filter-page-wrapper">
    <view class="top">
      <NavBar :title="title" navColor="#F7F8FC" :showBackBtn="true" />
      <view class="filter-wrapper">
        <GoodsSortFilter @onChange="onChange" />
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
