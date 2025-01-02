<template>
  <view class="like-view" v-if="goodsList.length > 0">
    <view class="top-title">你可能喜欢</view>
    <view class="goods-list">
      <GoodsList :goods="formattedGoods"></GoodsList>
    </view>
  </view>
</template>

<script>
import GoodsList from "@/components/goodsList/index.vue";
import { queryRecommend } from "@/api/cart";

export default {
  components: {
    GoodsList,
  },
  props: {
    skuIdList: {
      type: Array,
      default: [],
    },
    shopId: {
      type: [String, Number],
      default: "",
    },
  },

  data() {
    return {
      goodsList: [],
    };
  },

  computed: {
    formattedGoods() {
      console.log("goodlist====", this.goodsList);
      return this.goodsList.map((e) => {
        const salePrice =
          e.promotionTag != null ? e.promotionPrice : e.lowestPrice;
        const originPrice = e.promotionTag != null ? e.lowestPrice : 0;
        return {
          picture: e.majorPicture,
          title: e.itemName,
          salePrice: salePrice,
          originPrice: originPrice,
          id: e.itemId,
          skuId: e.skuId,
          skuTag: e.skuTag,
          shopId: e.shopId,
          promotion: e.promotionTag,
          soldStockTag: e.soldStockTag,
        };
      });
    },
  },
  watch: {
    skuIdList: {
      deep: true,
      immediate: true,
      handler: function (v) {
        console.log("aaa====");
        this.requestQueryRecommend();
      },
    },
    shopId: {
      immediate: true,
      handler: function (v) {
        console.log("----------------------");
        console.log("🤣--2222", v);
        this.requestQueryRecommend();
      },
    },
  },

  mounted() {
    // this.requestQueryRecommend();
  },

  methods: {
    async requestQueryRecommend() {
      console.log("推荐===");
      const { data } = await queryRecommend({
        pageNum: 1,
        pageSize: 20,
        type: 2,
        shopId: this.shopId,
        buyGoodIds: this.skuIdList,
      });
      const { data: resData } = data || {};
      const { goodData } = resData || {};
      this.goodsList = goodData || [];
    },
  },
};
</script>

<!-- <style>
page {
  height: 100%;
  width: 100%;
}
</style> -->

<style scoped lang="scss">
@import "./index.scss";
</style>
