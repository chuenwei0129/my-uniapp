// src/pagesH/inStoreService/components/CouponCard.vue

<template>
  <view class="coupon-card">
    <view class="coupon-card__header">
      <text class="coupon-card__header-text">
        待使用
      </text>
      <view
        v-if="showMoreButton"
        class="coupon-card__header-more"
        @click="$emit('view-more')"
      >
        <text>查看更多</text>
        <u-icon
          name="play-right-fill"
          size="14"
        />
      </view>
    </view>
    <view class="coupon-card__content">
      <image
        :src="coupon.imageUrl"
        class="coupon-card__image"
      />

      <view class="coupon-card__info">
        <view class="coupon-card__title">
          {{ coupon.itemName }}
        </view>
        <view class="coupon-card__expiry-date">
          {{ coupon.verifyValidEndTime }}
        </view>
        <view class="coupon-card__location">
          <u-icon
            name="map"
            size="14"
          />
          {{ coupon.shopName }}
        </view>
      </view>

      <view class="coupon-card__action">
        <button
          class="coupon-card__button"
          @click="$emit('click', coupon)"
        >
          查看券码
        </button>
      </view>
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
    showMoreButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click', 'view-more'],
}
</script>

<style scoped>
/* 卡片样式 */
.coupon-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* 固定宽度 */
  height: 150px; /* 固定高度 */
  margin: 0 auto; /* 水平居中 */
}

/* 标题栏样式 */
.coupon-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.coupon-card__header-text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.coupon-card__header-more {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #007aff;
  cursor: pointer;
}

/* 内容区域样式 */
.coupon-card__content {
  display: flex;
  align-items: center;
  flex: 1;
}

/* 图片样式 */
.coupon-card__image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  object-fit: cover;
  margin-right: 10px;
}

/* 信息栏样式 */
.coupon-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* 防止文字溢出 */
}

.coupon-card__title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏溢出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}

.coupon-card__expiry-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coupon-card__location {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 按钮样式 */
.coupon-card__action {
  margin-left: 10px;
}

.coupon-card__button {
  background-color: #FF2342;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.coupon-card__button:hover {
  background-color: #d81b3a;
}
</style>
