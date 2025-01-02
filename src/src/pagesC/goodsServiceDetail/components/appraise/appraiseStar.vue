<template>
  <view class="star">
    <view
      class="star-box"
      v-for="(starItem, starIndex) in goodsType"
      :key="starItem"
    >
      <view v-if="goodsType == 2" class="title"
        >{{ starIndex == 0 ? "服务" : "环境" }}
      </view>
      <view class="iconfont-box">
        <i
          class="iconfont icon-collectHighlight"
          :class="{
            light: index < lightStar(starIndex),
          }"
          v-for="(item, index) in 5"
          :key="index"
        ></i>
      </view>
      <view
        class="goods-name"
        v-if="(goodsType == 2 && starIndex == 1) || goodsType == 1"
      >
        <view class="buy">已购</view>
        <view class="skuName2">{{ skuName }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "AppraiseStar",
  props: {
    star: {
      type: Object,
      default: () => {},
    },
    goodsType: {
      type: Number,
      default: 1, // 1 实物商品 2 服务商品
    },
    skuName: {
      type: String,
      default: "",
    },
  },
  computed: {},
  data() {
    return {};
  },
  methods: {
    lightStar(index) {
      if (this.goodsType === 1) {
        return this.star.materialScore;
      } else if (this.goodsType === 2) {
        if (index === 0) {
          return this.star.serviceScore || 0;
        } else {
          return this.star.environmentScore || 0;
        }
      } else {
        return 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.star {
  width: 100%;
  margin-top: 23rpx;
  .star-box {
    display: flex;
    margin-bottom: 10rpx;
    .title {
      font-weight: 300;
      @include textfclaw(19rpx, #666, center, 19rpx);
      margin-right: 10rpx;
    }
    .iconfont-box {
      display: inherit;
    }
    .iconfont {
      display: inline-block;
      margin-right: 5rpx;
      font-size: 19rpx;
      color: #e6e6eb;
      line-height: 19rpx;
    }
    .light {
      color: #ff2442 !important;
    }
    .goods-name {
      font-weight: 300;
      @include textfclaw(19rpx, #666, center, 19rpx);
      margin-left: 10rpx;
      display: flex;
      .skyName {
        max-width: 530rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .skuName2 {
        max-width: 430rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .buy {
      margin-right: 4rpx;
    }
  }
}
</style>
