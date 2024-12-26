<template>
  <div class="category">
    <u--image
      src="https://cdn.uviewui.com/uview/album/1.jpg"
      :fade="true"
      duration="450"
    ></u--image>

    <!-- 金刚区 -->
    <view class="todo">
      <u-row justify="space-between" gutter="10">
        <u-col span="2.4">
          <view class="item">
            <view class="img">
              <image src="../../static/logo.png" mode=""></image>
            </view>
            <view class="text">水果蔬菜</view>
          </view>
        </u-col>
        <u-col span="2.4">
          <view class="item">
            <view class="img">
              <image src="../../static/logo.png" mode=""></image>
            </view>
            <view class="text">肉禽蛋品</view>
          </view>
        </u-col>
        <u-col span="2.4">
          <view class="item">
            <view class="img">
              <image src="../../static/logo.png" mode=""></image>
            </view>
            <view class="text">海鲜水产</view>
          </view>
        </u-col>
        <u-col span="2.4">
          <view class="item">
            <view class="img">
              <image src="../../static/logo.png" mode=""></image>
            </view>
            <view class="text">速食冷冻</view>
          </view>
        </u-col>
        <u-col span="2.4">
          <view class="item">
            <view class="img">
              <image src="../../static/logo.png" mode=""></image>
            </view>
            <view class="text">粮油米面</view>
          </view>
        </u-col>
      </u-row>
    </view>
    <!-- 分类 -->
    <Swiper></Swiper>
    <Tabs></Tabs>
  </div>
</template>

<script>
import Tabs from "./Tabs.vue";
import Swiper from "./Swiper.vue";
export default {
  components: {
    Tabs,
    Swiper,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
};
</script>

<style lang="scss">
.todo {
  padding: 10rpx 25rpx;
}

.item {
  height: 163rpx;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    height: 108rpx;
    width: 108rpx;
    background: red;
    border-radius: 50%;
    margin-bottom: 7rpx;
    image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .text {
    font-size: 24rpx;
    color: #666666;
  }
}
</style>
