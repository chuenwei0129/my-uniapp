<template>
  <view class="img-list">
    <view class="img-list-item">
      <view v-for="(item, index) in imgList" :key="index" class="item-img">
        <image
          v-if="item.mediaType == 0"
          class="img"
          :src="item.mediaUrl"
          mode="aspectFill"
          :show-menu-by-longpress="true"
          @click="handlePreviewImages(item.mediaUrl)"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "appraiseImgList",
  props: {
    // 当前（单条）评论图片
    imgList: {
      type: Array,
      default: () => [],
    },
    // 接口加载出所有（多条）评论的图片
    allImgList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  methods: {
    handlePreviewImages(item) {
      if (this.isNative) {
        this.$emit("onPreviewImages", item);
      } else {
        uni.previewImage({
          current: item,
          indicator: 0,
          urls: this.allImgList.map((item) => item.mediaUrl),
          success: (res) => {
            console.log("🚀 ~ handlePreviewImages:::success ~ res:", res);
          },
          fail: (err) => {
            console.log("🚀 ~ handlePreviewImages:::fail ~ err:", err);
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.img-list {
  width: 100%;
  height: 100%;
  background: #fff;
  &-item {
    margin: 25rpx 0 23rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 0rpx;
    .item-img {
      width: 223rpx;
      height: 223rpx;
      background: #d8d8d8;
      border-radius: 8rpx;
      margin-bottom: 10rpx;
      margin-right: 9.62rpx;
      display: inline-block;
      overflow: hidden;
      .img {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
      }
    }
    .item-img:nth-child(3n) {
      margin-right: 0 !important;
    }
  }
}
</style>
