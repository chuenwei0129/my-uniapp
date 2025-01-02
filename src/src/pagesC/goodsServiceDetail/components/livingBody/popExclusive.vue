<template>
  <root-portal>
    <u-popup
      v-if="isOpen"
      :show="isOpen"
      mode="bottom"
      bgColor="transparent"
      @touchmove.stop.prevent
      :closeOnClickOverlay="true"
      :safeAreaInsetBottom="false"
      :overlay="true"
      @close="close"
    >
      <view class="content">
        <view class="header">
          <text>购宠尊享</text>
          <view class="close-icon">
            <image class="icon" :src="close_icon" @click="close" />
          </view>
        </view>
        <view class="main">
          <scroll-view class="main-scroll" scroll-y>
            <view
              class="main-item"
              :class="item.spViceText ? 'paddingDesc' : 'paddingNormal'"
              v-for="(item, i) in shopPetBenefitList"
              :key="i"
            >
              <view
                class="item-header"
                :class="{ 'itemHeader-b': !item.spViceText }"
              >
                <image class="item-icon" :src="item.spIconType" />
                <text>{{ item.spMainText || "-" }}</text>
              </view>
              <view class="item-desc" v-if="item.spViceText">{{
                item.spViceText || "-"
              }}</view>
            </view>
          </scroll-view>
        </view>
      </view>
    </u-popup>
  </root-portal>
</template>

<script>
export default {
  name: "popOfficial",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    shopPetBenefitList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      baseIconUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/",
      close_icon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_clear.png",
    };
  },
  methods: {
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100vw;
  // max-height: 1327rpx;
  max-height: 80vh;
  min-height: 808rpx;
  background: #f7f8fc;
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  .header {
    width: 100%;
    height: 115rpx;
    line-height: 115rpx;
    text-align: center;
    font-weight: 500;
    font-size: 35rpx;
    color: #1f1f1f;
    font-family: PingFangSC, PingFang SC;
    position: relative;

    .close-icon {
      width: 50rpx;
      height: 50rpx;
      background-color: #ecedf1;
      border-radius: 50%;
      // opacity: 0.5;
      position: absolute;
      top: 50%;
      right: 29rpx;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 31rpx;
        height: 31rpx;
        display: inline-block;
      }
    }
  }
  .main {
    padding: 0 29rpx;
    padding-bottom: 54rpx;
    .main-item {
      width: 100%;
      background-color: #fff;
      border-radius: 23rpx;
      margin-bottom: 23rpx;
      .item-header {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 31rpx;
        color: #1f1f1f;
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        box-sizing: border-box;
        .item-icon {
          width: 38rpx;
          height: 38rpx;
          display: inline-block;
          margin-right: 13rpx;
        }
      }
      .itemHeader-b {
        margin-bottom: 0rpx !important;
      }
      .item-desc {
        margin-top: 10rpx;
        // height: 38rpx;
        line-height: 38rpx;
        padding-left: calc(38rpx + 13rpx);
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        font-size: 25rpx;
        color: #666;
      }
    }
    .paddingDesc {
      padding: 30rpx 29rpx 29rpx 25rpx;
      box-sizing: border-box;
    }
    .paddingNormal {
      padding: 29rpx 25rpx;
    }
    .main-scroll {
      width: 100%;
      // max-height: calc(1327rpx - 115rpx - 20rpx);
      max-height: calc(80vh - 115rpx - 20rpx);
      min-height: 808rpx;
      overflow: hidden;
    }
  }
}
</style>
