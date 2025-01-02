<template>
  <view :class="['store-item', selected ? 'selected' : '']">
    <image class="pic" mode="aspectFill" :src="item.shopImage"></image>
    <view class="info">
      <view class="title">{{ item.shopName }}</view>
      <view class="address">{{ item.address }}</view>
      <view class="distance-wrapper">
        <view class="distance"> 距离你{{ renderKM(item.distance) }} </view>
        <view v-if="item.nearestFlag" class="nearest-tag">{{ "最近" }}</view>
      </view>
    </view>
    <view v-if="selected" class="selected-tag"></view>
  </view>
</template>

<script>
import { renderKM } from "@/utils";

export default {
  props: {
    item: {
      type: Object,
    },

    selected: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {
    renderKM,
  },
};
</script>

<style lang="scss" scoped>
.store-item {
  position: relative;
  width: 100%;
  height: 208rpx;
  margin-top: 19rpx;
  padding-left: 23rpx;
  padding-right: 23rpx;
  background-color: white;
  border-radius: 15rpx;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  overflow: hidden;

  .pic {
    height: 162rpx;
    width: 162rpx;
    border-radius: 12rpx;
  }

  .info {
    flex: 1 1 0;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
    margin-left: 19rpx;

    .title {
      width: 100%;
      font-size: 35rpx;
      font-weight: bold;
      color: #1f1f1f;
      line-height: 37rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .address {
      margin-top: 10rpx;
      width: 406rpx;
      height: 65rpx;
      font-size: 23rpx;
      font-weight: 400;
      color: #333333;
      line-height: 33rpx;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .distance-wrapper {
      display: flex;
      flex-flow: row nowrap;
      margin-top: 10rpx;

      .distance {
        font-size: 23rpx;
        font-weight: 400;
        color: #666666;
        line-height: 33rpx;
      }

      .nearest-tag {
        font-size: 23rpx;
        font-weight: 400;
        // #ifdef MP-WEIXIN
        color: #ff5b05;
        // #endif
        // #ifdef H5
        color: #fe2442;
        // #endif
        line-height: 33rpx;
        margin-left: 12rpx;
      }
    }
  }

  .selected-tag {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 46rpx;
    width: 46rpx;
    background-repeat: no-repeat;
    // #ifdef MP-WEIXIN
    background-size: contain;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/select_store_checked_tag.png);
    // #endif
    // #ifdef H5
    background-size: cover;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/select_store_checked_tag_new_cor.png);
    // #endif
  }
}

.store-item.selected {
  // #ifdef MP-WEIXIN
  border-radius: 15rpx;
  border: 3rpx solid #ffd41e;
  // #endif
  // #ifdef H5
  border-radius: 24rpx;
  border: 3rpx solid #fe2442;
  background-color: #ffefef;
  // #endif
}
</style>
