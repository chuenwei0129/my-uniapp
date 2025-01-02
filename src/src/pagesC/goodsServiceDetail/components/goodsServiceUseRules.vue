<script>
export default {
  name: "goodsServiceUseRules",
  props: {
    limitTimeDesc: {
      type: String,
      default: "",
    },
    storeInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    limitTime() {
      return this.limitTimeDesc || "";
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="goods-rules">
      <view class="rules-item">
        <view class="label">服务保障</view>
        <view class="desc">
          <view class="desc-item">
            <i class="iconfont icon-right"></i>
            <view class="text">随时退</view>
          </view>
          <view class="desc-item">
            <i class="iconfont icon-right"></i>
            <view class="text">过期自动退款</view>
          </view>
        </view>
      </view>
      <view class="rules-item">
        <view class="label">有效期</view>
        <view class="value">{{ limitTime }}</view>
      </view>
      <view class="rules-item">
        <view class="label">使用时间</view>
        <view class="value">适用门店营业时间内均能使用</view>
      </view>
      <view class="rules-item last">
        <view class="label">预约时间</view>
        <view class="value">使用前请联系门店进行预约</view>
      </view>
      <!-- <view class="title">使用规则</view> -->
      <!-- <view class="item">有效期：{{ limitTime }}</view> -->
      <!-- <view class="item">使用时间：适用门店营业时间内均能使用</view> -->
      <!-- <view class="item">预约时间：使用前请联系门店进行预约</view> -->
      <!-- <view class="item">服务保障：随时退·过期自动退款</view> -->
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "@/utils/fn.scss";
.page-wrapper {
  background-color: #fff;
  border-radius: 23rpx;
  margin: 24rpx 15.38rpx 0;
  padding: 32rpx 23rpx;

  .goods-rules {
    .rules-item {
      display: flex;
      align-items: center;
      margin-bottom: 32rpx;
      .label {
        width: 130rpx;
        @include textfclaw(25rpx, #999, left, 35rpx);
      }
      .desc {
        display: flex;
        align-items: center;
        .desc-item {
          display: flex;
          align-items: center;
          @include textfclaw(25rpx, #1f1f1f, left, 35rpx);
          margin-right: 23.08rpx;
          .text {
            margin-left: 8rpx;
          }
        }
      }
      .value {
        @include textfclaw(25rpx, #1f1f1f, left, 35rpx);
      }
    }
    .rules-item.last {
      margin-bottom: 0;
    }
    .iconfont {
      color: #1f1f1f;
      font-size: 25rpx;
    }
    // .title {
    //   padding: 25rpx 0 8rpx 0;
    //   font-size: 25rpx;
    //   font-weight: 400;
    //   color: #1f1f1f;
    //   line-height: 35rpx;
    // }

    // .item {
    //   padding: 8rpx 0;
    //   font-size: 25rpx;
    //   font-weight: 400;
    //   color: #666666;
    //   line-height: 35rpx;
    // }
  }
}
</style>
