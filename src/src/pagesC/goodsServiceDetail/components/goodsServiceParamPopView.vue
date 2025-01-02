<script>
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
export default {
  name: "goodsServiceParamPopView",
  components: { CellItemNormal },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    properties: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  emits: ["onClose"],
  methods: {
    close() {
      this.$emit("onClose");
    },
  },
};
</script>

<template>
  <view class="popup-wrapper">
    <u-popup
      :show="show"
      @close="close"
      mode="bottom"
      :overlay="true"
      :closeOnClickOverlay="true"
      round="38rpx"
    >
      <view class="content-wrapper">
        <view class="top">
          <view class="top-padding"></view>
          <view class="title">产品参数 </view>
          <!-- #ifdef MP-WEIXIN -->
          <image
            class="top-padding"
            mode="widthFix"
            :style="{ width: '50rpx', height: '50rpx' }"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
            @click="close"
          />
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <img
            class="close-icon"
            :style="{ width: '50rpx', height: '50rpx' }"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
            @click="close"
          />
          <!-- #endif -->
        </view>
        <view class="content">
          <CellItemNormal
            v-for="(item, index) in properties"
            :key="index"
            :title="item.propertyName"
            :desc="item.propertyValue"
            :isRight="true"
            titleLeftPadding="0"
            descRightPadding="0"
          ></CellItemNormal>
        </view>
        <view class="bottom"></view>
      </view>
    </u-popup>
  </view>
</template>

<style scoped lang="scss">
.popup-wrapper {
  .content-wrapper {
    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      // #ifdef H5
      height: 115rpx;
      .close-icon {
        width: 50rpx;
        height: 50rpx;
        margin-right: 31rpx;
      }
      // #endif

      .top-padding {
        padding: 35rpx 31rpx;
        width: 50rpx;
        height: 50rpx;
      }

      .title {
        flex: 1;
        font-size: 35rpx;
        font-weight: bold;
        color: #000000;
        line-height: 38rpx;
        text-align: center;
      }
    }

    .content {
      min-height: 400rpx;
      max-height: calc(100vh * 0.6);
      padding: 0 38rpx 0;
      overflow-y: scroll;
    }

    .bottom {
      padding-bottom: calc(constant(safe-area-inset-bottom));
      padding-bottom: calc(env(safe-area-inset-bottom));
    }
  }
}
</style>
