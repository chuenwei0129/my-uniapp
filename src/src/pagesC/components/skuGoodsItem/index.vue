<script>
import GoodsPrice from "@/components/goodsPrice/index.vue";

export default {
  name: "SkuGoodsItem",
  components: { GoodsPrice },
  props: {
    item: {
      type: Object,
      default: {
        majorPicture: "",
        itemName: "",
        skuName: "",
        skuPrice: "",
        skuQty: 0,
      },
    },
  },
  methods: {
    handleItemClicked() {
      this.$emit("onClick");
    },
  },
};
</script>

<template>
  <view class="goods-item" @click="handleItemClicked">
    <image class="pic" :src="item.majorPicture"></image>
    <view class="goods-info">
      <view class="name">{{ item.itemName || "" }}</view>
      <view class="spec">{{ item.skuName || "" }}</view>
      <!-- 价格+数量 -->
      <view class="price-num">
        <goods-price
          :sale-price="item.skuPrice"
          :sale-sign-font-size="23"
          :sale-price-integer-font-size="35"
          :sale-price-decimal-font-size="23"
          :sale-color="'#1F1F1FFF'"
        ></goods-price>
        <view class="num-text">x{{ item.skuQty || 0 }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.goods-item {
  display: flex;
  flex-flow: row nowrap;
  padding: 20rpx;
  background-color: #f7f8fc;
  border-radius: 16rpx;
  .pic {
    width: 154rpx;
    height: 154rpx;
    border-radius: 10rpx;
    background-color: white;
  }
  .goods-info {
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    flex: 1 1 0;
    margin-left: 17rpx;

    .name {
      font-size: 29rpx;
      color: #1f1f1f;
      line-height: 37rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .spec {
      font-size: 27rpx;
      font-weight: 400;
      color: #666666;
      line-height: 38rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 4rpx;
    }

    .price-num {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: flex-end;
      flex: 1 1 0;

      .num-text {
        font-size: 25rpx;
        font-weight: bold;
        color: #1f1f1f;
      }
    }
  }
}
</style>
