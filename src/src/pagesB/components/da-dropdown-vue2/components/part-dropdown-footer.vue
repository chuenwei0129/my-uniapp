<template>
  <view class="da-dropdown-footer">
    <view class="da-dropdown-footer--reset" @click="handleReset()">{{ resetText || '重置' }}</view>
    <view class="da-dropdown-footer--confirm" @click="handleConfirm()">
      {{ confirmText || '确认' }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'PartDropdownFooter',
  props: {
    resetText: {
      type: String,
      default: '重置',
    },
    confirmText: {
      type: String,
      default: '确认',
    },
  },
  methods: {
    handleReset() {
      this.$emit('reset')
    },
    handleConfirm() {
      this.$emit('confirm')
    },
  },
}
</script>

<style lang="scss" scoped>
.da-dropdown-footer {
  display: flex;
  align-items: center;
  padding: 0 38rpx 40rpx 38rpx;
  margin-top: 30rpx;

  &--reset,
  &--confirm {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 85rpx;
    font-size: 31rpx;
    color: #333333;
    background-color: #EEEEEE;
    // border: 2rpx solid #ccc;
    border-radius: 40rpx;
  }

  &--confirm {
    margin-left: 19rpx;
    color: #fff;
    background-color: var(--dropdown-theme-color);
    border-color: var(--dropdown-theme-color);
  }

  &--reset:hover,
  &--confirm:hover {
    opacity: 0.8;
  }
}
</style>
