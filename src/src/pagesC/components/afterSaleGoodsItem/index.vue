<script>
import GoodsItem from "@/pagesC/orderDetail/componse/goodsItem.vue";

export default {
  name: "AfterSaleGoodsItem",
  components: {GoodsItem},
  props: {
    goods: {
      type: Array,
      default: []
    }
  },
  computed: {
    goodsCount() {
      let count = 0;
      this.goods.forEach(e => {
        count += e.skuQty;
      });
      return count;
    }
  }
}
</script>

<template>
<view class="after-sale-goods-item-wrapper">
  <view v-if="goods.length > 1" class="goods-list">
    <view>
      <image
          v-for="goodsItem in goods"
          class="goods-item"
          :src="goodsItem.imageUrl"
          mode="aspectFill"
          :key="goodsItem.itemId"
      />
    </view>
    <view class="count-wrapper">
      <view class="count-card">共{{goodsCount}}件</view>
    </view>
  </view>
  <view v-else-if="goods.length === 1" class="order-item-wrapper">
    <GoodsItem class="order-item" :item="goods[0]"/>
  </view>
</view>
</template>

<style scoped lang="scss">
.after-sale-goods-item-wrapper {
  width: 100%;
  background-color: white;
  border-radius: 16rpx;
  overflow: hidden;
}
.goods-list {
  padding: 21rpx;
  display: flex;
  overflow-x: scroll;
  justify-content: space-between;
  .goods-item {
    width: 154rpx;
    height: 154rpx;
    border-radius: 10rpx;
    background-color: #F7F8FC;
  }
  .goods-item + .goods-item {
    margin-left: 15rpx;
  }
  .count-wrapper {
    position: relative;
    width: 0;
    height: 0;
    right: 154rpx;
    .count-card {
      width: 154rpx;
      height: 154rpx;
      background: linear-gradient( 90deg, rgba(255,255,255,0.14) 0%, #FFFFFF 10%, #FFFFFF 100%);
      color: #666666;
      font-size: 23rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.order-item-wrapper {
  padding: 7rpx 21rpx;
}
.order-item {
  display: flex;
  image {
    width: 156rpx;
    height: 156rpx;
    border-radius: 10rpx;
    background-color: #f7f8fc;
    flex-shrink: 0;
  }
  .goods-info {
    margin-left: 18rpx;
    width: calc(100% - 156rpx - 36rpx);
    display: flex;
    flex-direction: column;
    .goods-info-1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #1f1f1f;
      width: 100%;
      .sku-name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-right: 18rpx;
      }
    }
    .goods-info-2 {
      display: flex;
      justify-content: space-between;
      color: #666;
      margin-top: 4rpx;
      align-items: center;
      width: 100%;
    }
  }
}
</style>