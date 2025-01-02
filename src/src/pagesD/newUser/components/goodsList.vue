<template>
  <view :class="['goods-list', `${list.length > 1 ? '' : 'notab'}`]">
    <!-- <scroll-view
        v-if="list.length"
        class="scroll-wrapper"
        scroll-y
        @scrolltolower="onLoadMoreData"
      >
        
      </scroll-view> -->
    <template v-if="list.length">
      <MyWaterFall
        ref="waterfallFlow"
        v-model="list"
        imgKey="majorPicture"
        @onClickItem="onClickItem"
        :shopLogo="false"
        origin="filterGoodsService"
      ></MyWaterFall>
    </template>
    <template v-else>
      <view v-if="!list.length && isCompleted" class="no-data-wrapper">
        <NoData
          noDataText="暂无商品"
          img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
        ></NoData>
      </view>
    </template>
  </view>
</template>
<script>
import MyWaterFall from "@/components/waterfall/index.vue";
import NoData from "@/components/noData/index.vue";
import { QUERY_ADJUST_GOOD } from "@/api/newUser";
import { action_report, display_report } from "@/utils/track";
export default {
  components: {
    MyWaterFall,
    NoData,
  },
  data() {
    return {
      filterParams: {
        pageNum: 1,
        pageSize: 20,
        promotionId: "",
      },
      isCompleted: false,
      totalCount: 0,
      list: [],
    };
  },
  props: {
    activeInfo: {
      type: Object,
      default: {},
    },
    homeInfo: {
      type: Object,
      default: {},
    },
    loadmore: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    activeInfo: {
      handler(val, oldVal) {
        console.log("🚀 ~ handler ~ val:", val, oldVal);

        this.onChange(val);
        // if(val !== oldVal) {
        //   this.onChange(val);
        // }
      },
      immediate: false,
      deep: true,
    },
    loadmore: {
      handler(val, oldVal) {
        if (val == true) {
          this.onLoadMoreData();
        }
      },
      immediate: false,
      deep: true,
    },
  },
  methods: {
    onChange(val) {
      this.filterParams.pageNum = 1;
      this.filterParams.promotionId = val.promotionId;
      this.onLoadData();
      console.log("----------onChange--------");
    },
    onClickItem(item) {
      action_report({
        action_name: "newcomerspage_exclusivegoods_click",
        module_name: "",
      });
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/flutter?entryPoint=goodsShopSpecialDetailPage&type=1&primaryId=${
          item.itemId
        }&skuId=${item.refId || ""}&shopId=${item.shopId}&activityId=${
          this.homeInfo?.couponPackActivityId
        }`,
      });
      //#endif

      console.log("item--------", item);
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${
          item?.itemId || ""
        }&skuId=${item?.refId || ""}&shopId=${item?.shopId}&activityId=${
          this.homeInfo?.couponPackActivityId
        }`,
      });
      //#endif
    },
    onLoadMoreData() {
      if (this.list.length === this.totalCount) {
        this.$emit("loadmoreupdate");
        return;
      }
      this.filterParams.pageNum = this.filterParams.pageNum + 1;
      this.onLoadData();
      console.log("----------loadMoreData--------");
    },
    async onLoadData() {
      try {
        if (this.filterParams.pageNum === 1) {
          this.$refs?.waterfallFlow?.clear();
          this.list = [];
          this.isCompleted = false;
        }
        this.filterParams.promotionId = this.activeInfo.promotionId;
        const res = await QUERY_ADJUST_GOOD({
          pageNum: this.filterParams.pageNum,
          pageSize: this.filterParams.pageSize,
          promotionId: this.filterParams.promotionId,
        });
        // 将数据赋值给瀑布流 list 属性
        this.totalCount = Number(res?.data?.data?.totalCount || 0);
        let data = [];
        if (res?.data?.data?.data) {
          data = res?.data?.data?.data.map((item, index) => {
            return {
              ...item,
              newuserTag: true,
            };
          });
        }
        this.list = this.list.concat(data);
        this.isCompleted = true;
        this.$emit("loadmoreupdate");
      } catch (e) {
        this.isCompleted = true;
        this.$emit("loadmoreupdate");
      }
      console.log("list-------------", this.list);
      console.log("----------onLoadData--------");
    },
  },
  mounted() {
    this.onLoadData();
  },
};
</script>
<style lang="scss" scoped>
.scroll-wrapper {
  height: 2000rpx;
}
.goods-list {
  min-height: 880rpx;
  padding: 0 10rpx 44rpx 10rpx;
  &.notab {
    padding-top: 23rpx;
  }
  .u-list-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>
