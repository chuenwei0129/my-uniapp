<template>
  <root-portal>
    <u-popup
      v-if="show"
      :show="show"
      mode="bottom"
      bgColor="transparent"
      @touchmove.stop.prevent
      :closeOnClickOverlay="true"
      :safeAreaInsetBottom="false"
      :overlay="true"
      @close="close"
    >
      <view class="content-safeguard">
        <view class="header">
          <text>服务保障</text>
          <view class="close-icon">
            <image class="icon" :src="close_icon" @click="close" />
          </view>
        </view>
        <view class="main">
          <scroll-view class="main-scroll" scroll-y>
            <view
              class="main-item"
              :class="item.ogViceText ? 'paddingDesc' : 'paddingNormal'"
              v-for="(item, i) in shopPetBenefitList"
              :key="i"
            >
              <view
                class="item-header"
                :class="{ 'itemHeader-b': !item.ogViceText }"
              >
                <image class="item-icon" :src="item.icon" />
                <text>{{ item.ogMainText || "-" }}</text>
              </view>
              <view class="item-desc" v-if="item.ogViceText">{{
                item.ogViceText || "-"
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
  name: "goodsSafeguardPopView",
  props: {
    show: {
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
      this.$emit("update:show", false);
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.content-safeguard {
  width: 100vw;
  max-height: 80vh;
  min-height: 721rpx;
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
      border-radius: 8rpx;
      margin-bottom: 23rpx;
      .item-header {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 29rpx;
        color: #1f1f1f;
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        box-sizing: border-box;
        .item-icon {
          width: 38rpx;
          height: 38rpx;
          display: inline-block;
          margin-right: 11rpx;
        }
      }
      .itemHeader-b {
        margin-bottom: 0rpx !important;
      }
      .item-desc {
        margin-top: 10rpx;
        // height: 38rpx;
        line-height: 35rpx;
        padding-left: calc(38rpx + 11rpx);
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        font-size: 25rpx;
        color: #1f1f1f;
      }
    }
    .paddingDesc {
      padding: 23rpx 29rpx;
      box-sizing: border-box;
    }
    .paddingNormal {
      padding: 29rpx 25rpx;
    }
    .main-scroll {
      width: 100%;
      max-height: calc(80vh - 115rpx - 20rpx);
      overflow: hidden;
    }
  }
}
</style>
