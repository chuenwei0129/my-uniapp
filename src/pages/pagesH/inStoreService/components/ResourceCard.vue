<template>
  <view class="resource-card">
    <view
      v-if="list.length > 0"
      class="header"
    >
      <text class="title">
        {{ title }}
      </text>
      <text
        v-if="list.length >= 3"
        class="more"
        @click="onViewMore"
      >
        查看更多
      </text>
    </view>
    <view class="content">
      <u-row
        v-if="list.length === 1"
        gutter="16"
      >
        <u-col span="12">
          <view class="item one-item">
            <view class="image-wrapper">
              <slot
                name="image-0"
                :item="list[0]"
              >
                <img
                  :src="list[0].image"
                  class="image"
                >
              </slot>
            </view>
            <view class="text-wrapper">
              <view class="text-line-1 text-ellipsis">
                {{ list[0].text1 }}
              </view>
              <view class="text-line-2 text-ellipsis">
                {{ list[0].text2 }}
              </view>
              <view class="text-line-3 text-ellipsis">
                {{ list[0].text3 }}
              </view>
            </view>
          </view>
        </u-col>
      </u-row>
      <u-row
        v-else
        gutter="16"
      >
        <u-col
          v-for="(item, index) in list"
          :key="index"
          :span="list.length <= 3 ? 12 / list.length : 4"
        >
          <view class="item">
            <view class="image-wrapper">
              <slot
                :name="`image-${index}`"
                :item="item"
              >
                <img
                  :src="item.image"
                  class="image"
                >
              </slot>
            </view>
            <view class="text-wrapper">
              <view class="text-line-1 text-ellipsis">
                {{ item.text1 }}
              </view>
              <view class="text-line-2 text-ellipsis">
                {{ item.text2 }}
              </view>
              <view
                class="text-line-3 text-ellipsis"
                :class="{ 'empty-line': !item.text3 && list.length === 2 }"
              >
                {{ item.text3 || '' }}
              </view>
            </view>
          </view>
        </u-col>
      </u-row>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ResourceCard',
  props: {
    title: {
      type: String,
      default: '资源卡片'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onViewMore () {
      this.$emit('view-more')
    }
  }
}
</script>

<style scoped>
.resource-card {
  margin-bottom: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.more {
  font-size: 28rpx;
  color: #999;
}

.content {
  width: 100%;
}

.item {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 20rpx;
}

.one-item {
  display: flex;
  align-items: center;
}

.image-wrapper {
  width: 100%;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.one-item .image-wrapper {
  width: 200rpx;
  height: 200rpx;
  margin-right: 20rpx;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.text-wrapper {
  flex: 1;
}

.text-line-1,
.text-line-2,
.text-line-3 {
  font-size: 28rpx;
  line-height: 1.5;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-line-3.empty-line {
  visibility: hidden; /* 隐藏但不占据空间 */
}
</style>
