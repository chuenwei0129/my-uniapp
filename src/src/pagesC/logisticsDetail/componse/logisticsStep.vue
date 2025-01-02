<template>
  <view class="logistics-detail">
    <view
      class="logistics-item"
      v-for="(item, index) in logisticsData"
      :key="index"
    >
      <!-- 左侧竖直进度条 -->
      <view class="progress-item">
        <view
          class="top-line"
          :style="{ backgroundColor: index === 0 ? '#fff' : '#ddd' }"
        ></view>
        <view
          class="dot"
          :style="{ backgroundColor: index === 0 ? '#FF5B05' : '#999999' }"
        ></view>
        <view v-if="index !== logisticsData.length - 1" class="line"></view>
      </view>

      <!-- 右侧物流内容 -->
      <view class="logistics-content">
        <text
          class="item-time"
          :style="{ color: index === 0 ? '#FF5B05' : '#999999' }"
          >{{ item.time }}</text
        >
        <!--          <view class="item-title" v-html="item.context"></view>-->
        <u-parse
          class="item-title"
          :style="{ color: index === 0 ? '#1f1f1f' : '#999999' }"
          :content="item.status"
          @linkTap="navigate"
        ></u-parse>
      </view>
    </view>
  </view>
</template>

<script>
import background from "@dcloudio/uni-h5/src/core/view/components/editor/formats/background";

export default {
  methods: {
    background,
    navigate(e) {
      const { href } = e;
      console.log(`navigate:${href}`);
      uni.makePhoneCall({
        phoneNumber: href,
      });
    },
  },
  props: {
    logisticsData: {
      type: [Object, Array],
    },
  },
};
</script>

<style lang="scss" scoped>
.logistics-detail {
  display: flex;
  flex-direction: column;
  padding: 0 28rpx;
}

.logistics-item {
  display: flex;
  align-items: flex-start;
  //margin-bottom: 20rpx;

  .progress-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;

    .top-line {
      width: 2rpx;
      height: 8rpx;
    }

    .dot {
      width: 17rpx;
      height: 17rpx;
      border-radius: 50%;
    }

    .line {
      width: 2rpx;
      flex: 1;
      background-color: #ddd;
    }
  }

  .logistics-content {
    display: flex;
    flex-direction: column;
    margin-left: 28rpx;

    .item-time {
      font-size: 24rpx;
      margin-bottom: 10rpx;
    }
    .item-title {
      font-size: 28rpx;
      margin-bottom: 28rpx;
    }
  }
}
</style>
