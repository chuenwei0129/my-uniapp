<template>
  <view>
    <view v-if="isLoading" style="height: 100vh; width: 100%">
      <u-loading-page :loading="true"></u-loading-page>
    </view>
    <view v-else>
      <view class="page-wrapper">
        <view class="header">
          <view class="status-bar" :style="{ height: statusBarHeight }"></view>
          <view class="back-btn" @click="handleBack">
            <!-- #ifdef MP-WEIXIN -->
            <view class="home-btn">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/home_btn.png"
              />
            </view>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <u-icon name="arrow-left" color="#fff"></u-icon>
            <!-- #endif -->
          </view>
        </view>
        <view class="main">
          <view class="status-bar" :style="{ height: statusBarHeight }"></view>
          <view class="header-style"></view>
          <view class="content-box">
            <view class="photo">
              <image :src="imageUrl" />
            </view>

            <view class="title-text">
              <view class="feed-num"> 已成功投喂{{ petFoodNum }}克宠粮 </view>
              <view class="feed-hint"> 小宠正在赶来的路上~ </view>
            </view>

            <view class="btns">
              <!-- <view class="close-btn" @click="handleBack">关闭</view> -->
              <view class="pay-btn" @click="handleRefeed"> 继续投喂 </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isLoading: false,
      petFoodNum: 10,
      isFeeding: true,
      isLoadImage: false,
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/feeding_first.png",
      imageUrl2: "",
      strQuery: "",
      statusBarHeight: getApp().globalData.statusBarHeight,
    };
  },
  onLoad(option) {
    console.log("feeded option", option);
    this.petFoodNum = option.petFoodNum;
    uni.getImageInfo({
      src: "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/feedingV4.png",
      success: (res) => {
        console.log("图片加载完成");
        this.imageUrl = res.path;
        setTimeout(() => {
          // this.isFeeding = false;
          this.imageUrl = this.imageUrl2;
        }, 4000);
      },
    });
    uni.getImageInfo({
      src: "https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/feededV4.png",
      success: (res) => {
        console.log("imageUrl2", res);
        this.imageUrl2 = res.path;
      },
    });

    console.log("🚀 ~ onLoad ~ option:", option);
    const data = uni.getStorageSync("feederPaymentInfo", data);
    let strQuery = "";
    Object.keys(data).forEach((i) => {
      strQuery += `${i}=${data[i]}&`;
    });
    this.strQuery = strQuery.slice(0, strQuery.length - 1);
    console.log("🚀 ~ onLoad feed ~ :", this.strQuery);
  },
  mounted() {
    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        console.log(res, "--------------------------------------------");
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    //#endif

    //#ifdef H5
    console.log(getApp());
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    //#endif
  },
  onShow() {},
  methods: {
    // 返回按钮
    handleBack() {
      console.log("click", "返回按钮");
      uni.navigateBack({
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
    },
    // 再次投喂
    handleRefeed() {
      console.log("click", "再次投喂");
      uni.redirectTo({
        url: `/pagesE/feederPayment/index?${this.strQuery}`,
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
    },
    imageLoad(event) {
      console.log("图片加载完成", event);
      this.isLoadImage = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss">
.back-btn {
  width: 58rpx;
  height: 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 50%;

  ::v-deep span {
    font-size: 30rpx;
  }
}
</style>
