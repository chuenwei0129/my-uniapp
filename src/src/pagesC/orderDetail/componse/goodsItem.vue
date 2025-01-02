<template>
  <view class="card">
    <image v-if="item.imageUrl" :src="item.imageUrl" class="icon"></image>
    <image v-else :src="productDefaultimg" class="icon"></image>

    <view class="content">
      <view class="row fl-row-bet-start">
        <view class="title">
          <text v-if="item.identifier === 2" class="goods-gift-flag">赠品</text>
          {{ item.itemName }}
        </view>
        <!-- <view class="reality">实付</view>
        <goodsPrice
          :salePrice="item.skuPrice * item.skuQty"
          :saleSignFontSize="21"
          :salePriceIntegerFontSize="29"
          :sale-color="'#1f1f1f'"
        ></goodsPrice> -->
      </view>
      <view class="row fl-row-bet-start">
        <!--        <view class="des">{{ item.propertyList.map(bean => bean.propertyName).join('/') }}</view>-->
        <view class="des">{{ item.skuName }}</view>
        <goodsPrice
          :salePrice="item.price"
          :saleSignFontSize="21"
          :salePriceIntegerFontSize="29"
          :sale-color="'#666666'"
        ></goodsPrice>
      </view>
      <view class="row fl-row-bet-start">
        <view class="des"></view>
        <view class="num">x {{ item.skuQty }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import goodsPrice from "@/components/goodsPrice/index.vue";
export default {
  components: { goodsPrice },
  props: {
    item: {
      type: Object,
      default: {
        imageUrl: "",
        itemId: 0,
        orderItemId: 0,
        price: 0,
        propertyList: [
          {
            propertyId: 0,
            propertyName: "",
          },
        ],
        realPayAmount: 0,
        skuId: 0,
        skuName: "",
        skuQty: 0,
        identifier: 0,
      },
    },
  },

  data() {
    return {
      productDefaultimg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/product_default.webp",
    };
  },
};
</script>

<style lang="scss">
.card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  background-color: #ffffff;
  padding: 14rpx 0;
  .icon {
    width: 154rpx;
    height: 154rpx;
    background-color: #f7f8fc;
    border-radius: 9rpx;
    flex-shrink: 0;
  }

  .content {
    margin-left: 17rpx;
    display: flex;
    flex-direction: column;
    flex: 1;
    .row {
      flex-wrap: nowrap;
      .title {
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
        max-width: 410rpx;
        padding-bottom: 4rpx;
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
        flex: 1;
        display: flex;
        align-items: center;
        .goods-gift-flag {
          line-height: 33rpx;
          background: white;
          border-radius: 6rpx;
          border: 1rpx solid #ffcfd8;
          margin-right: 12rpx;
          font-size: 23rpx;
          color: #fe2442;
          padding-top: 2rpx;
          padding-left: 8rpx;
          padding-right: 4rpx;
        }
      }
      .des {
        font-size: 29rpx;
        font-weight: 400;
        color: #666666;
        max-width: 410rpx;
      }
      .price {
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
      }
      .num {
        font-size: 25rpx;
        font-weight: 400;
        color: #666666;
      }
    }
  }
}
.reality {
  font-size: 21rpx;
  margin-right: 5rpx;
  line-height: 32rpx;
}
</style>
