<template>
  <view class="coupon-card">
    <view class="coupon-card__image">
      <image :src="coupon.imageUrl" />
    </view>

    <view class="coupon-card__info">
      <view class="coupon-card__title">
        {{ coupon.itemName }}
      </view>
      <!-- TODO: 券码待使用时间还剩7天时，展示“还剩x天”字段，且阿拉伯数字为红色，字重medium -->
      <view class="coupon-card__expiry-date">
        {{ coupon.verifyValidEndTime }}
      </view>
      <view class="coupon-card__location">
        <u-text
          prefix-icon="map"
          size="24rpx"
          color="#c0c1c5"
          icon-style="font-size: 24rpx; color: #c0c1c5"
          :text="coupon.shopName"
        />
      </view>
    </view>

    <view
      class="coupon-card__action"
      @click="$emit('click', coupon)"
    >
      查看券码
    </view>
  </view>
</template>

<script>
export default {
  name: 'CouponCard',
  props: {
    coupon: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
}
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

/* 卡片样式 */
.coupon-card {
  margin-top: 32rpx;
  display: flex;
  align-items: center;
  background-color: #f6f8fc;
  border-radius: 16rpx;
}

/* 图片样式 */
.coupon-card__image {
  width: 160rpx;
  height: 160rpx;
  margin-right: 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

/* 信息栏样式 */
.coupon-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 32rpx;
  overflow: hidden;
}

.coupon-card__title {
  color: #2f3032;
  font-size: 32rpx;
  font-weight: 500;
  @include ellipsis(256rpx);
}

.coupon-card__expiry-date {
  font-size: 28rpx;
  color: #9e9fa1;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}

/* 按钮样式 */
.coupon-card__action {
  display: flex;
  align-items: center;
  background-color: #ff2342;
  color: #fff;
  border-radius: 36rpx;
  padding: 16rpx;
  font-size: 24rpx;
  margin-right: 16rpx;
}
</style>
