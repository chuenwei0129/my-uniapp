<template>
  <view class="history-item" @click="handleItemClick">{{ title }}</view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {

    }
  },

  emits: ['onHistoryClick'],

  methods: {
    handleItemClick() {
      this.$emit('onHistoryClick', this.title);
    }
  }
}
</script>

<style>
.history-item {
  height: 58rpx;
  padding-left: 25rpx;
  padding-right: 25rpx;
  margin-top: 10rpx;
  margin-bottom: 9rpx;
  background: #f7f8fc;
  border-radius: 29rpx;
  margin-right: 19rpx;

  font-size: 29rpx;
  color: #333333;
  line-height: 58rpx;
}
</style>