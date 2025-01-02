<script>
import GoodsItem from "@/pagesC/orderDetail/componse/goodsItem.vue";
import SkuGoodsItem from "@/pagesC/components/skuGoodsItem/index.vue";
import { GET_FREE_GIFT_ITEM } from "@/api/mall";

export default {
  name: "CouponDetailActivityGiftPopView",
  components: { SkuGoodsItem, GoodsItem },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    shopId: {
      type: String,
      default: "",
    },
    skuIds: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      goods: [],
    };
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        this.queryGiftGoods();
      }
    },
  },
  methods: {
    close() {
      this.$emit("onClose");
    },
    handleItemClicked(item) {
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${item.itemId}&skuId=${item.skuId}&shopId=${item.shopId}`,
      });
    },
    async queryGiftGoods() {
      try {
        const res = await GET_FREE_GIFT_ITEM({
          keyword: "",
          shopId: this.shopId,
          skuIds: this.skuIds,
        });
        this.goods = res.data.data || [];
      } catch (_) {}
    },
  },
  computed: {
    goodsItems() {
      return this.goods.map((e) => {
        return {
          ...e,
          majorPicture: e.picture,
          skuPrice: e.lowestPrice,
          skuQty: 1,
        };
      });
    },
  },
};
</script>

<template>
  <view class="popup-wrapper">
    <u-popup
      :show="show"
      @close="close"
      mode="bottom"
      :overlay="true"
      :closeOnClickOverlay="true"
      round="38rpx"
      :safeAreaInsetBottom="false"
    >
      <view>
        <view class="popup-content-wrapper">
          <view class="top">
            <view class="title">
              赠品
              <text v-if="goods.length > 0">共{{ goods.length }}件</text>
            </view>
            <view class="right">
              <image
                mode="aspectFit"
                :style="{ width: '50rpx', height: '50rpx' }"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
                @click="close"
              />
            </view>
          </view>
          <view class="content-wrapper">
            <view class="top-header-bg">
              现在购买则赠送以下商品，赠完为止
            </view>
            <view class="goods-list">
              <SkuGoodsItem
                v-for="item in goodsItems"
                class="goods-item"
                :item="item"
                :key="item.itemId"
                @onClick="handleItemClicked(item)"
              />
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style scoped lang="scss">
.popup-wrapper {
  .popup-content-wrapper {
    background: #ffffff;
    border-radius: 38rpx 38rpx 0 0;
    .top {
      padding: 25rpx 25rpx 0 25rpx;
      text-align: center;
      margin-bottom: 39rpx;
      .title {
        font-size: 35rpx;
        font-weight: 500;
        color: #000000;
      }
      .right {
        position: absolute;
        top: 26rpx;
        right: 26rpx;
      }
    }

    .content-wrapper {
      margin-bottom: 30rpx;
      max-height: 1000rpx;
      overflow-y: auto;
      .top-header-bg {
        width: 100%;
        height: calc(100vw / (390 / 54));
        background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_activity_gift_bg1.png");
        background-size: 100%, 100%;
        color: white;
        font-size: 31rpx;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .goods-list {
        display: flex;
        flex-direction: column;
        padding: 24rpx;
        .goods-item + .goods-item {
          margin-top: 20rpx;
        }
      }
    }
  }
}
</style>
