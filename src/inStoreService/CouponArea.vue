<template>
  <view class="coupon-area">
    <!-- 标题和查看更多按钮 -->
    <view class="coupon-area__header">
      <view class="coupon-area__title">
        待使用
      </view>
      <view>
        <u-text
          v-if="list.length > 5"
          suffix-icon="play-right-fill"
          icon-style="font-size: 20rpx; color: #b2b3b5;"
          color="#b2b3b5"
          text="查看更多"
          @click="handleViewMore"
        />
      </view>
    </view>
    <!-- 轮播图区域 -->
    <swiper
      class="coupon-area__swiper"
      :indicator-dots="list.length > 1"
      :autoplay="true"
      :interval="3000"
      :circular="true"
      :current="current"
      indicator-active-color="#FF2342"
      indicator-color="#ddd"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in list"
        :key="index"
      >
        <CouponCard
          :coupon="item"
          @click="handleClick"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import CouponCard from './CouponCard.vue'

export default {
  name: 'CouponArea',
  components: {
    CouponCard,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      current: 0,
    }
  },

  methods: {
    handleClick (coupon) {
      // TODO: 跳转 APP
      uni.showToast({
        title: `查看券码: ${coupon.id}`,
        icon: 'success',
      })
    },
    handleViewMore () {
      uni.showToast({
        title: '查看更多优惠券',
        icon: 'none',
      })
    },
    onSwiperChange (event) {
      this.current = event.detail.current
    },
  },
}
</script>

<style scoped>
.coupon-area {
  padding: 40rpx;
  background-color: #f6f8fc;
  border-radius: 40rpx;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 标题区域样式 */
.coupon-area__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-area__title {
  font-size: 50rpx;
  font-weight: bold;
  color: #1b1b1b;
}

/* 轮播容器样式 */
.coupon-area__swiper {
  height: 250rpx; /* 减少高度，让指示器更靠近卡片 */
}

/* Swiper 指示器样式 */
.coupon-area__swiper /deep/ .uni-swiper-dot {
  width: 24rpx; /* 长条宽度 */
  height: 6rpx; /* 长条高度 */
  border-radius: 6rpx; /* 圆角 */
  background-color: #ddd;
  margin: 0 6rpx; /* 间距 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.coupon-area__swiper /deep/ .uni-swiper-dot-active {
  width: 32rpx; /* 激活状态加宽 */
  background-color: #ff2342;
}
</style>
