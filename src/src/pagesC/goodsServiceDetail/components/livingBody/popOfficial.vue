<template>
  <root-portal>
    <u-popup
      :show="show"
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
          <text>官方保障</text>
          <view class="close-icon">
            <image class="icon" :src="close_icon" @click="close" />
          </view>
        </view>
        <view class="main">
          <scroll-view class="main-scroll" scroll-y>
            <view
              class="main-item"
              :class="item.ogViceText ? 'paddingDesc' : 'paddingNormal'"
              v-for="(item, i) in officialGuaranteeList"
              :key="i"
            >
              <view
                class="item-header"
                :class="{ 'itemHeader-b': !item.ogViceText }"
              >
                <image class="item-icon" :src="item.ogIconType" />
                <text>{{ item.ogMainText || "-" }}</text>
              </view>
              <view class="item-desc" v-if="item.ogViceText">
                <text>{{ item.ogViceText || "-" }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </u-popup>
  </root-portal>
</template>

<script>
export default {
  name: "popOfficial",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    officialGuaranteeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      close_icon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/official_close.png",
    };
  },
  methods: {
    close() {
      this.$emit("update:show", false);
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100vw;
  max-height: 80vh; // 1327rpx;
  min-height: 808rpx;
  background: linear-gradient(270deg, #ffc5a4 0%, #ffe6d4 100%);
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  .header {
    width: 100%;
    height: 115rpx;
    line-height: 115rpx;
    text-align: center;
    font-weight: 500;
    font-size: 35rpx;
    color: #6e3a27;
    font-family: PingFangSC, PingFang SC;
    position: relative;
    .close-icon {
      width: 50rpx;
      height: 50rpx;
      background-color: rgba(255, 255, 255, 0.5);
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
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 23rpx;
      // opacity: 0.5;
      margin-bottom: 23rpx;
      .item-header {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 35rpx;
        color: #6e3a27;
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
        padding-left: calc(38rpx + 13rpx);
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        font-size: 25rpx;
        color: #8a4c35;
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
