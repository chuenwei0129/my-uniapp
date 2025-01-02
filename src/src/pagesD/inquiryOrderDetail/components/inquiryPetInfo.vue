<template>
  <view class="pet-info">
    <view class="pet-info-name">
      <view class="title">爱宠</view>
      <view class="des">{{ item.petInformation.nickName }}</view>
    </view>
    <view class="pet-info-ill" v-if="item.symptomType">
      <view class="title">症状类型</view>
      <view class="des">{{
        item.symptomType.map((symtom) => symtom.tagName).join("、")
      }}</view>
    </view>
    <view class="pet-info-ill" v-if="item.petInformation.medicalDemand">
      <view class="title">问诊诉求</view>
      <view class="des">{{
        item.petInformation.medicalDemand.join("、")
      }}</view>
    </view>
    <view class="pet-info-img" v-if="item.petInformation.symptomImags">
      <view class="title">症状图片</view>
      <view class="pet-info-img-col">
        <view
          v-for="(image, index) in item.petInformation.symptomImags.slice(0, 3)"
          :key="index"
          class="image-container"
        >
          <image
            :src="image"
            mode="aspectFit"
            style="width: 100rpx; height: 100rpx"
            @click="previewInquiryImage(image)"
          />
        </view>
      </view>
    </view>
    <view class="pet-info-main">
      <view class="title">{{
        item.inquiryType === "NUTRITION" ? "具体描述" : "主诉"
      }}</view>
      <view class="suit">{{
        item.petInformation.illnessDesc || "暂未描述"
      }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "InquiryPetInfo",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  methods: {
    previewInquiryImage(image) {
      console.log("image:", image);
      const imgs = this.item.petInformation.symptomImags;
      console.log("images:", imgs);
      uni.previewImage({
        current: image,
        urls: imgs,
        success: function (res) {
          console.log("success:", res);
        },
        fail: function (res) {
          console.log("fail:", res);
        },
        complete: function (res) {
          console.log("complete:", res);
        },
      });
    },
  },
};
</script>

<style lang="scss">
.pet-info {
  background: #ffffff;
  border-radius: 15rpx;
  margin: 0 16rpx;
  padding-left: 23rpx;
  padding-right: 23rpx;
  &-name {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 36rpx;
    padding-bottom: 23rpx;
  }

  &-ill {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 23rpx;
    padding-bottom: 23rpx;
  }

  &-img {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 23rpx;
    padding-bottom: 13rpx;
    &-col {
      max-width: 500rpx;
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: nowrap;
      max-height: 100rpx;
      .image-container {
        background: #f5f6f7;
        width: 100rpx; /* 设置图片容器宽度 */
        height: 100rpx; /* 设置图片容器高度 */
        border-radius: 8rpx; /* 图片容器圆角 */
        overflow: hidden; /* 超出容器部分隐藏 */
        margin-left: 10rpx;
        margin-bottom: 10rpx;
      }
    }
  }

  &-main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 23rpx;
    padding-bottom: 34rpx;
    .suit {
      margin-top: 19rpx;
      padding: 19rpx;
      background: #f5f6f7;
      border-radius: 15rpx;
      font-size: 27rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 38rpx;
      word-break: break-all;
    }
  }

  .title {
    font-size: 29rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #1f1f1f;
    line-height: 40rpx;
  }
  .des {
    font-size: 29rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
    max-width: 500rpx;
    text-align: right;
  }
}
</style>
