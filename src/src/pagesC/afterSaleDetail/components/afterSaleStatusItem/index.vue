<template>
  <view class="after-sale-status-item-content" ref="afterSaleStatusItemRef">
    <view class="status-item-left">
      <view
        class="status-item-line"
        style="height: 34rpx;"
        :style="{backgroundColor: hasUp ? '#D9D9D9' : 'white'}"
      />
      <view class="status-item-dot" :style="{
        backgroundColor: isSelected ? '#FE2442' : '#999999'
      }"></view>
      <view class="status-item-line" v-if="hasDown" style="flex: 1;"></view>
    </view>
    <view class="status-item-content">
      <view
        class="status-item-title"
        :style="{
          color: isSelected ? '#FE2442' : '#666'
        }">
        {{ title }}
      </view>
      <text
        class="status-item-subtitle"
        v-if="subtitle && subtitle.length > 0"
      >
        {{ subtitle }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AfterSaleStatusItem',
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    hasUp: {
      type: Boolean,
      default: false,
    },
    hasDown: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    }
  },
}
</script>

<style lang="scss">
.after-sale-status-item-content {
  display: flex;
  .status-item-left {
    width: 54rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .status-item-dot {
      width: 18rpx;
      height: 18rpx;
      border-radius: 9rpx;
    }
    .status-item-line {
      width: 2rpx;
      background-color: #D9D9D9;
    }
  }
  .status-item-content {
    flex: 1;
    margin: 23rpx 0;
    margin-right: 12rpx;
    display: flex;
    flex-direction: column;
    font-size: 29rpx;
    width: calc(100% - 54rpx - 12rpx);
    .status-item-title {
      word-break: break-all;
    }
    .status-item-subtitle {
      margin-top: 6rpx;
      font-size: 27rpx;
      color: #999;
      word-break: break-all;
    }
  }
}
</style>