<template>
  <view class="result-popmodal">
    <u-popup
      :show="show"
      @touchmove.stop.prevent
      mode="center"
      @close="closeModal"
    >
      <view class="tips">长按保存图片至本地，分享给好友</view>
      <view class="popcontent">
        <image
          :src="`${imageurl}${restype}.png`"
          class="resultImage"
          :show-menu-by-longpress="true"
        ></image>
      </view>
      <view class="modal-close" @click="closeModal"></view>
    </u-popup>
  </view>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    restype: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      imageurl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/activity/mbti/resultV2/",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";

.result-popmodal {
  .tips {
    color: #ffffff;
    font-size: 27rpx;
    margin: 0 auto 20rpx;
  }

  .popcontent {
    width: 523rpx;

    .resultImage {
      width: 523rpx;
      height: 1131rpx;
    }
  }

  .modal-close {
    width: 62rpx;
    height: 62rpx;
    margin: 20rpx auto 0;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/activity/mbti/close.png"
    );
  }
}
</style>
