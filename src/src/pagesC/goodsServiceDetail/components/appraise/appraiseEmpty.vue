<template>
  <view class="appraise-empty">
    <view class="empty-box">
      <view class="empty-img">
        <image class="img" :src="noDataImg" mode="widthFix" />
        <view class="img-text">暂无评价～</view>
      </view>
      <view class="empty-text">
        <view class="text-icon">
          <image class="icon" :src="likeLeft" />
        </view>
        <view class="text">猜你喜欢</view>
        <view class="text-icon">
          <image class="icon" :src="likeRight" />
        </view>
      </view>
    </view>

    <view class="recommend-box">
      <goods-list :goods="formattedGoods"></goods-list>
    </view>
  </view>
</template>

<script>
import goodsList from "@/components/goodsList/index.vue";
import { GET_RECOMMEND_GOODS } from "@/api/mallv2";
export default {
  name: "AppraiseEmpty",
  components: { goodsList },
  data() {
    return {
      noDataImg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/no-content.png",
      goodsData: [],
      likeLeft:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/comment-lick-left.png",
      likeRight:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/comment-lick-right.png",
    };
  },
  computed: {
    formattedGoods() {
      return this.goodsData.map((e) => {
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
        };
      });
    },
  },
  mounted() {
    this.getShopListApi();
  },
  methods: {
    async getShopListApi() {
      const res = await GET_RECOMMEND_GOODS();
      this.goodsData = res.data.data.goodData;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.appraise-empty {
  width: 100%;
  height: 100%;
  .empty-box {
    @include flex();
    flex-direction: column;
    .empty-img {
      width: 100%;
      @include flex();
      flex-direction: column;
      margin: 38rpx auto 58rpx;
      .img {
        width: 231rpx;
        height: 231rpx;
      }
      .img-text {
        font-family: PingFangSC, PingFang SC;
        font-style: normal;
        @include textfclaw(25rpx, #999999, center, 35rpx);
      }
    }
    .empty-text {
      @include flex();
      .text-icon {
        width: 31rpx;
        height: 31rpx;
        font-size: 0;
        margin: 0 15rpx;
        .icon {
          width: 100%;
          height: 100%;
        }
      }
      .text {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-style: normal;
        @include textfclaw(31rpx, #202020, center, 42rpx);
      }
    }
  }

  .recommend-box {
    margin-top: 40rpx;
    padding: 0 15.38rpx;
  }
}
</style>
