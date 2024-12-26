<template>
  <view
    :class="['filter-options__item', isActive ? 'filter-options__item--active' : '']"
    @click="handleClick"
  >
    <view class="filter-options__label">
      {{ label }}
    </view>
    <view
      v-if="custom"
      :class="`filter-options__price-icon filter-options__price-icon--${custom}`"
    />
  </view>
</template>

<script>

export default {
  name: 'FilterOption',
  props: {
    label: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    custom: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick () {
      this.$emit('onClick')
      console.log(this.$props)
    },
  }
}
</script>

<style scoped lang="scss">
.filter-options__item {
  flex: 1;
  height: 60rpx;
  margin: 0 10rpx;
  font-size: 26rpx;
  font-weight: 400;
  color: #333333;
  background-color: #f5f5f5;
  line-height: 60rpx;
  text-align: center;
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;

  &--active {
    color: #fe2442;
    font-weight: 500;
    background-color: #ffffff;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  }
}

.filter-options__label {
  font-size: 26rpx;
}

.filter-options__price-icon {
  height: 26rpx;
  width: 26rpx;
  background-repeat: no-repeat;
  background-size: contain;

  &--default {
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price.png");
  }

  &--asc {
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price_asc1.png");
  }

  &--desc {
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price_desc1.png");
  }
}
</style>
