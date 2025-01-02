<script>
export default {
  name: "goodsServicePictures",
  data() {
    return {};
  },
  props: {
    urls: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onImageClickHandle(index) {
      console.log("index-------------------");
      uni.previewImage({
        urls: this.urls,
        current: index,
      });
    },
  },
};
</script>

<template>
  <view class="page-wrapper" id="goodsDetailInfo">
    <view class="picture-title" v-if="urls.length">详情</view>
    <view class="picture-wrapper">
      <view
        class="picture"
        v-for="(item, index) in urls"
        :key="item"
        @click="onImageClickHandle(index)"
      >
        <image
          class="item"
          :src="item"
          mode="widthFix"
          :class="{
            first: index == 0,
            last: index == urls.length - 1,
            one: urls.length == 1,
          }"
        />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "@/utils/fn.scss";
.page-wrapper {
  margin: 15.38rpx;
  padding: 23.08rpx 19.23rpx 19.23rpx;
  background-color: #fff;
  border-radius: 23rpx;
  .picture-title {
    font-weight: 500;
    @include textfclaw(31rpx, #1f1f1f, left, 42rpx);
    margin-bottom: 19.23rpx;
  }

  .picture-wrapper {
    .first {
      width: 100%;
      border-radius: 16rpx 16rpx 0 0;
      vertical-align: top;
    }
    .item {
      width: 100%;
      vertical-align: top;
    }
    .last {
      width: 100%;
      border-radius: 0 0 16rpx 16rpx;
      vertical-align: top;
    }
    .one {
      width: 100%;
      border-radius: 16rpx;
      vertical-align: top;
    }
  }
}
</style>
