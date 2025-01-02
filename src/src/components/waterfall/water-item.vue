<template>
  <view>
    <view
      class="waterfall-box"
      v-for="(item, index) in formattedGoods"
      :key="index"
      @click="onClickItem(item)"
    >
      <GoodsCard
        :goods="item"
        :canAddCart="shopLogo"
        :eType="origin"
        needMargin
      />
    </view>
  </view>
</template>

<script>
import GoodsCard from "@/components/goodsCard/index.vue";

export default {
  name: "myWaterItem",
  components: { GoodsCard },
  props: {
    list: {
      type: Array,
      default: [],
    },
    //图片在data对象字段
    imgKey: {
      type: String,
      default: "",
    },
    //购物车logo
    shopLogo: {
      type: Boolean,
      default: false,
    },
    // 父级来源
    origin: {
      type: String,
      default: "",
    },
  },

  data() {
    return {};
  },
  computed: {
    formattedGoods() {
      return this.list.map((e) => {
        const salePrice = e.promotionTag != null ? e.promotionPrice : e.lowestPrice;
        const originPrice = e.promotionTag != null ? e.lowestPrice : 0;
        return {
          ...e,
          picture: e.majorPicture ? e.majorPicture : e.picture,
          title: e.itemName,
          salePrice: salePrice,
          originPrice: originPrice,
          id: e.itemId,
          skuId: e.skuId,
          skuTag: e.skuTag,
          shopId: e.shopId,
          promotion: e.promotionTag
        };
      });
    },
  },
  emits: ["onClickItem"],
  methods: {
    onClickItem(item) {
      this.$emit("onClickItem", {
        ...item,
        itemId: item.id ? item.id : item.itemId
      });
    },
  },
};
</script>

<style lang="scss">
.waterfall-box {
  border-radius: 16rpx;
  box-sizing: border-box;
  position: relative;
  margin-top: 16rpx;

  .itemImg {
    width: 100%;
    display: block;
    border-radius: 16rpx;
    height: calc((100vw - 48rpx) * 0.5);
  }

  .content {
    padding: 17rpx 8rpx 18rpx;
    font-size: 27rpx;
    font-weight: 400;
    color: #333333;
    line-height: 35rpx;

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      position: relative;
    }
    .no-indent {
      text-indent: 0;
    }
    .goods-tips {
      width: 82rpx;
      height: 36rpx;
      position: relative;
      left: 0;
      top: 8rpx;
      margin-right: 10rpx;
    }
    .newuser-tips {
      width: 110rpx;
      height: 35rpx;
      position: relative;
      left: 0;
      top: 8rpx;
      margin-right: 10rpx;
    }
    .price {
      margin-top: 12rpx;
    }
    .tags {
      display: flex;
      margin-top: 20rpx;
      .tag-item + .tag-item {
        margin-left: 10rpx;
      }
      .tag-item {
        height: 35rpx;
        .delivery-tips {
          width: 100rpx;
          height: 100%;
          vertical-align: bottom;
        }
      }
      .promotion-tag {
        max-width: calc(((100vw - 16rpx * 3) / 2 - 17rpx - 18rpx));
      }
      .small-promotion-tag {
        max-width: calc(
          (100vw - 16rpx * 3) / 2 - 17rpx - 18rpx - 100rpx - 10rpx
        );
      }
    }
  }
}
</style>