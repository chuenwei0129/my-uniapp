<template>
  <view
    class="cart-button"
    @click="handleClick"
  >
    <view
      v-if="cartItemCount"
      class="cart-button__badge"
    >
      {{ cartItemCount }}
    </view>
    <i
      class="iconfont icon-a-ShoppingCart"
      style="font-size: 46rpx"
    />
  </view>
</template>

<script>
export default {
  name: 'CartButton',
  props: {
    cartItemCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleClick () {
      uni.navigateTo({
        url: '/pagesC/shoppingCart/index',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.cart-button {
  position: relative;
  width: 70rpx; // 或与图标大小匹配的值
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .cart-button__badge {
    position: absolute;
    top: -8rpx; // 调整为适当值
    right: -8rpx;
    background: #f33a50;
    font-size: 20rpx;
    font-weight: 600;
    color: #ffffff;
    border-radius: 50%;
    width: 34rpx;
    height: 34rpx;
    line-height: 34rpx;
    text-align: center;
  }
}
</style>
