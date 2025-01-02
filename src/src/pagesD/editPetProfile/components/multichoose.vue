<template>
  <view class="choose-wrap">
    <view :class="['choose-item', `${item.id == selecetId ? 'selected' : ''}`]" v-for="(item, index) in list" :key="index" @click="changeItem(item, index)">
      {{ item.label }}
    </view>
  </view>
  </template>
  <script>
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      val: {
        type: String | Number
      }
    },
    data() {
      return {
        selecetId: this.val
      }
    },
    watch: {
      val: {
        immediate: true,
        handler(newValue, oldValue) {
          this.selecetId = newValue;
        },
      }
    },
    methods: {
      changeItem(item) {
        this.selecetId = item.id;
        this.$emit('updateSelect', item);
      }
    }
  }

  </script>
  <style lang="scss" scoped>
@import "../../../utils/fn.scss";
  .choose-wrap {
    height: 63rpx;
    border-radius: 33rpx;
    background: #F0F1F6;
    display: flex;
    align-items: center;
    .choose-item {
      width: 96rpx;
      height: 63rpx;
      border-radius: 33rpx;
      @include flex();
      color: #666666;
      font-size: 27rpx;
      line-height: 38rpx;
      font-weight: bold;
      &.selected {
        color: #333333;
        background: #FFDE52
      }
    }
  }
  </style>
  