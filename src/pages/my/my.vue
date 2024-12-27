<template>
  <view class="content">
    <z-paging-mini
      @scroll="scroll"
      ref="paging"
      v-model="dataList"
      auto-show-back-to-top
      back-to-top-threshold="750"
      @query="queryList"
    >
      <!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
      <template #top>
        <z-tabs :list="tabList" @change="tabsChange" />
      </template>
      <!-- 自定义返回顶部view -->
      <template #backToTop>
        <BackToTop ref="backToTop" />
      </template>
      <view
        class="item"
        v-for="(item, index) in dataList"
        :key="index"
        @click="itemClick(item)"
      >
        <view class="item-title">{{ item.title }}</view>
        <view class="item-detail">{{ item.detail }}</view>
        <view class="item-line"></view>
      </view>
    </z-paging-mini>
  </view>
</template>

<script>
import BackToTop from './BackToTop.vue'
export default {
  components: {
    BackToTop,
  },
  data() {
    return {
      // v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
      dataList: [],
      tabList: ['测试1', '测试2', '测试3', '测试4'],
      tabIndex: 0,
      current: 0,
      total: 0,
    }
  },
  methods: {
    scroll() {
      if (this.$refs.backToTop) {
        this.$refs.backToTop.isScroll()
      }
    },
    tabsChange(index) {
      this.tabIndex = index
      // 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
      // 调用reload时参数传true则代表reload时触发下拉刷新效果，不传或false则代表取消此效果
      this.$refs.paging.reload(true)
    },
    queryList(pageNo, pageSize) {
      this.current = pageNo
      // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
      // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
      // 模拟请求服务器获取分页数据，请替换成自己的网络请求
      // const params = {
      //   pageNo: pageNo,
      //   pageSize: pageSize,
      //   type: this.tabIndex + 1,
      // }

      const mockList = []
      for (let i = 0; i < 25; i++) {
        mockList.push({
          title: `标题 ${pageNo}-${i + 1}`,
          detail: `详情 ${pageNo}-${
            i + 1
          } - 这是一个长长的详情信息，用于模拟实际内容。`,
        })
      }
      // 将请求的结果数组传递给z-paging-mini
      this.$refs.paging.complete(mockList)
      // 这里的total一般是服务端返回的，一共有多少页，或者总条数/每页多少条，这里是写死的
      this.total = 3

      // 如果请求失败写this.$refs.paging.complete(false);
      // 注意，每次都需要在catch中写这句话很麻烦，z-paging-mini提供了方案可以全局统一处理
      // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-mini-error-emit');即可
      // this.$refs.paging.complete(false)
    },
    itemClick(item) {
      console.log('点击了', item.title)
    },
  },
}
</script>

<style>
.item {
  position: relative;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rpx 30rpx;
}

.item-detail {
  padding: 5rpx 15rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: white;
  background-color: #007aff;
}

.item-line {
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  height: 1px;
  width: 100%;
  background-color: #eeeeee;
}
</style>
