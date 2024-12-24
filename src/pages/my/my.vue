<template>
  <view>
    <view class="coupon-item" :class="!status ? 'h' : ''">
      <view class="coupon-item-left">
        <view class="coupon-item-info">
          <view class="coupon-item-money">¥{{ preferential }}</view>
          <view class="coupon-item-ask">{{
            content == 0 ? "无门槛" : "满" + content + "元可用"
          }}</view>
        </view>
        <view class="coupon-item-content">
          <view class="coupon-left-top">
            <view class="coupon-item-name">{{ preferential }}元代金券</view>
            <view class="coupon-item-tip">订单结算支付时可用</view>
          </view>
          <view class="coupon-left-bottom">
            <view class="coupon-item-time">有效期至 {{ end_date }}</view>
          </view>
        </view>
      </view>

      <view class="coupon-item-right" v-if="status">
        <view class="coupon-item-botton" @click="userEvent"> 去使用 </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "lx-coupon",
  props: {
    status: {
      type: Boolean,
      default: true,
    },
    preferential: {
      type: Number,
      default: 0,
    },
    content: {
      type: Number,
      default: 0,
    },
    end_date: {
      type: String,
      default: "2023-05-26 12:00:00",
    },
  },
  methods: {
    userEvent() {
      this.$emit("onClick");
    },
  },
};
</script>

<style>
/* Coupon Item Styles */
.coupon-item {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.coupon-item.h {
  filter: grayscale(100%);
}

.coupon-item-left {
  display: flex;
  align-items: center;
}

.coupon-item-info {
  width: 170px;
  height: 170px;
  background-image: url("https://fakeimg.pl/300x200");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.coupon-item-money {
  font-size: 50px;
  font-weight: bold;
}

.coupon-item-money::first-letter {
  font-size: 24px;
  font-weight: normal;
}

.coupon-item-ask {
  font-size: 26px;
}

.coupon-item-content {
  color: #333;
  font-size: 28px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
  flex-shrink: 0;
}

.coupon-left-top .coupon-item-name {
  font-size: 30px;
  font-weight: bold;
}

.coupon-left-top .coupon-item-tip {
  font-size: 24px;
  color: #888888;
}

.coupon-left-bottom .coupon-item-time {
  font-size: 24px;
  color: #888888;
}

.coupon-item-right .coupon-item-botton {
  background: #ff4131;
  color: #fff;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 24px;
  flex-shrink: 0;
}
</style>
