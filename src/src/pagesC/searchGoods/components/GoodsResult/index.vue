<template>
  <view class="result-wrapper">
    <GoodsSortFilter @onChange="onFilterChange"></GoodsSortFilter>
    <scroll-view
      class="scroll-wrapper"
      :style="{
        height: `${scrollHeight}`,
      }"
      scroll-y
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <view v-if="emptyData" class="empty-wrapper">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/search_goods_empty.png"
          class="empty-img"
        >
        </image>
        <view class="empty-text">没有找到相关商品，换一个关键词试试吧~</view>
      </view>
      <block v-else>
        <MyWaterFall
          v-model="goodsList"
          idKey="itemId"
          imgKey="picture"
          ref="waterfallFlow"
          :shopLogo="true"
          :noMoreData="noMoreData"
          origin="goodsResult"
          @onClickItem="onClickItem"
        ></MyWaterFall>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import GoodsSortFilter from "@/pagesC/components/goodsSortFilter/index.vue";
import MyWaterFall from "@/components/waterfall/index.vue";

import { GET_SEARCH_GOODS } from "@/api/mallv2";
import { action_report, display_report } from "@/utils/track";
const module_name = "shop";

const PAGE_SIZE = 20;

export default {
  components: {
    GoodsSortFilter,
    MyWaterFall,
  },

  props: {
    sort: {
      type: [String, Number],
      default: 1,
    },

    keyword: {
      type: String,
      default: "",
    },

    scrollHeight: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      scrollViewHeight: 0,
      goodsList: [],
      isRefreshing: false,
      emptyData: false,
      noMoreData: false,
      pageNum: 1,
      sortType: 1,
      loadLock: false,
    };
  },

  created() {
    this.scrollViewHeight = `calc(100vh - 70rpx)`;
  },

  mounted() {
    console.log(`goods result`);
    this.sortType = this.sort;
    console.log(`sortType: ${this.sort}`);
    this.onRefresh();
  },

  watch: {
    keyword: {
      handler: (val) => {
        console.log(`search goods result: ${val}`);
        this.onRefresh();
      },
    },
  },

  methods: {
    onFilterChange(type) {
      this.sortType = type;
      // 重新请求
      this.onRefresh();
    },

    onRefresh() {
      // 正在下拉刷新，直接返回
      console.log("isRefreshing: ", this.isRefreshing);
      if (this.isRefreshing) {
        console.log("已经在刷新了~");
        return;
      }

      this.loadGoods(this.sortType, true);
    },

    onLoadMore() {
      if (this.noMoreData) {
        console.log("没有更多了~");
        return;
      }
      this.loadGoods(this.sortType);
    },

    onClickItem(item) {
      action_report({
        action_name: "search_commodity_click",
        module_name: module_name,
        extend: {
          commodity_name: item.itemName,
          commodity_id: item.itemId,
        },
      });
      // 商品详情
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${item.itemId}&skuId=${
          item?.skuId || ""
        }&shopId=${item?.shopId}`,
      });
    },

    async loadGoods(type, refresh = false) {
      if (this.loadLock) return;
      this.loadLock = true;
      const nextPageNum = refresh ? 1 : this.pageNum + 1;
      if (refresh) {
        this.goodsList = [];
        this.$refs.waterfallFlow.clear();
      }
      const data = {
        pageNum: nextPageNum,
        pageSize: PAGE_SIZE,
        keyword: this.keyword,
        sort: type,
        shopId: uni.getStorageSync("onlineCurMallId"),
      };
      console.log("load goods: ", data);
      try {
        const res = await GET_SEARCH_GOODS(data);
        console.log("search goods: ", res);
        const pageGoods = res.data?.data?.data ?? [];
        if (refresh) {
          this.goodsList = pageGoods;
        } else {
          this.goodsList = [...this.goodsList, ...pageGoods];
        }
        this.goodsList.map((item) => {
          display_report({
            display_name: "search_commodity_show",
            object_type: module_name,
            extend: {
              commodity_name: item.itemName,
              commodity_id: item.itemId,
            },
          });
        });
        console.log("goods list: ", this.goodsList);
        this.pageNum = nextPageNum;
        this.emptyData = this.goodsList.length == 0;
        // 是否为空
        this.noMoreData = res.data?.data?.empty || pageGoods.length == 0;
        this.loadLock = false;
      } catch (err) {
        console.log(err);
        this.loadLock = false;
      } finally {
        this.loadLock = false;
        if (this.isRefreshing) {
          this.isRefreshing = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.result-wrapper {
  display: flex;
  flex-flow: column nowrap;

  .scroll-wrapper {
    background: #f7f8fc;
  }

  .empty-wrapper {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .empty-img {
      width: 346rpx;
      height: 346rpx;
    }

    .empty-text {
      font-size: 29rpx;
      font-weight: 400;
      color: #666666;
    }
  }
}
</style>
