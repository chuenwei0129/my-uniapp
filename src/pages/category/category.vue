<template>
  <view>
    <u-tabs
      :list="list"
      lineWidth="40"
      :current="current"
      @change="tabChange"
    ></u-tabs>
    <swiper
      class="scroll-view-height"
      @change="swipeIndex"
      :current="current"
      :duration="300"
    >
      <swiper-item>
        <scroll-view scroll-y="true" class="scroll-view-height list-content">
          <view class="list-item" v-for="(item, index) in 20" :key="'A' + index"
            >tab1- {{ index }}</view
          >
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y="true" class="scroll-view-height list-content">
          <view class="list-item" v-for="(item, index) in 20" :key="'B' + index"
            >tab2- {{ index }}</view
          >
        </scroll-view>
      </swiper-item>
    </swiper>
    <tabbar :current="2"></tabbar>
  </view>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      // swiper索引
      current: 0,
      list: [
        {
          name: 'tab1',
        },
        {
          name: 'tab2',
        },
      ],
    }
  },
  methods: {
    swipeIndex(index) {
      // 获得swiper切换后的current索引
      this.current = index.detail.current
    },
    tabChange(data) {
      this.current = data.index
    },
  },
}
</script>

<style scoped lang="scss">
.scroll-view-height {
  /* 页面高度减去包含状态栏、标题、tab组件的高度 */
  height: calc(100vh - var(--status-bar-height) - 178rpx);
}

.list-content {
  background-color: #f4f4f4;
}

.list-item {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  margin: 4rpx 0;
  background-color: #ffffff;
}
</style>
