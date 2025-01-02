<script>
import GoodsSortFilter from "@/pagesC/components/goodsSortFilter/index.vue";
import MallGoodsList from "@/components/goodsList/index.vue";
import { GET_PROMOTION_ACTIVITY_ITEM } from "@/api/mall";

export default {
  components: { MallGoodsList, GoodsSortFilter },
  data() {
    return {
      activityId: "",
      shopId: "",
      goods: [],
      safeBottomPadding: 0,
      triggered: false,
      pageNum: 1,
      pageSize: 10,
      sort: 1,
      totalCount: 0,
      startTime: "",
      endTime: "",
    };
  },
  methods: {
    onFilterChange(type) {
      this.sort = type;
      this.queryData(1);
    },
    refresh() {
      if (this.triggered) {
        return;
      }
      this.triggered = true;
      this.queryData(1);
    },
    loadMore() {
      if (this.triggered) {
        return;
      }
      if (this.goods.length >= this.totalCount) {
        return;
      }
      this.triggered = true;
      this.queryData(this.pageNum + 1);
    },
    async queryData(pageNum) {
      const data = {
        shopId: this.shopId,
        promotionId: this.activityId,
        pageSize: this.pageSize,
        pageNum: pageNum,
        sort: this.sort,
      };
      try {
        const res = await GET_PROMOTION_ACTIVITY_ITEM(data);
        this.pageNum = pageNum;
        const resData = res.data.data;
        this.totalCount = resData.totalCount;
        if (pageNum === 1) {
          this.goods = resData.data;
        } else {
          this.goods.push(...resData.data);
        }
        this.startTime = resData.startTime;
        this.endTime = resData.endTime;
        this.triggered = false;
        const navTitle = resData.promotionName || "";
        //#ifdef H5
        this.$dsBridge.call("setNativeNavigationTitle", navTitle);
        //#endif
        //#ifdef MP-WEIXIN
        await uni.setNavigationBarTitle({
          title: navTitle,
        });
        //#endif
      } catch (e) {
        this.triggered = false;
      }
    },
  },
  computed: {
    goodsItems() {
      return this.goods.map((e) => {
        const salePrice =
          e.promotionTag != null ? e.promotionPrice : e.lowestPrice;
        const originPrice = e.promotionTag != null ? e.lowestPrice : 0;
        return {
          ...e,
          title: e.itemName,
          salePrice: salePrice,
          originPrice: originPrice,
          id: e.itemId,
          promotion: e.promotionTag,
        };
      });
    },
  },
  mounted() {
    const windowInfo = uni.getWindowInfo();
    this.safeBottomPadding = windowInfo.safeAreaInsets.bottom;
  },
  onLoad(e) {
    this.activityId = e.activityId;
    this.shopId = e.shopId;
    this.refresh();
  },
};
</script>
<template>
  <view>
    <GoodsSortFilter @onChange="onFilterChange"></GoodsSortFilter>
    <view class="list-header">
      <text class="header-title">购买以下商品，参与促销活动</text>
      <text class="header-time">{{ startTime }} - {{ endTime }}</text>
    </view>
    <scroll-view
      class="list-content"
      scroll-y
      refresher-enabled
      :refresher-triggered="triggered"
      @refresherrefresh="refresh"
      @scrolltolower="loadMore"
    >
      <view style="height: 18rpx" />
      <MallGoodsList
        :goods="goodsItems"
        :imageStyle="{ backgroundColor: '#F7F8FC' }"
        canAddCart
      />
      <view :style="{ height: safeBottomPadding + 'px' }" />
    </scroll-view>
  </view>
</template>
<style lang="scss">
.list-header {
  background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_activity_gift_bg1.png");
  background-size: 100%, 100%;
  width: 100%;
  height: calc(100vw / (390 / 54));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .header-title {
    font-size: 31rpx;
    color: white;
    font-weight: bold;
    line-height: 37rpx;
  }
  .header-time {
    font-size: 25rpx;
    color: white;
    line-height: 35rpx;
  }
}
.list-content {
  width: 100%;
  height: calc(100vh - 70rpx - (100vw / (390 / 54)));
  padding: 0 16rpx;
  box-sizing: border-box;
}
</style>
