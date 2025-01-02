<template>
  <view class="scroll-list-wrapper">
    <u-scroll-list
      ref="scrollListRef"
      :indicatorBarWidth="indicatorBarWidth"
      :indicator="isShowIndicator"
      :indicatorActiveColor="'#1F1F1F'"
      :indicatorColor="'#c7c7c7'"
      :indicatorWidth="indicatorWidth"
      :indicatorStyle="{ marginTop: '15rpx' }"
    >
      <view
        class="scroll-list"
        :style="{ overflow: list.length <= 5 ? 'clip' : 'inherit' }"
      >
        <view
          class="scroll-list__goods-item"
          v-for="(item, index) in list"
          :key="index"
          @click="goToPage(item)"
        >
          <u-image
            class="scroll-list__goods-item__image"
            :src="item.image"
            duration="450"
            fade
            :lazy-load="true"
            width="62rpx"
            height="62rpx"
          ></u-image>
          <image
            class="scroll-list__goods-item__corner"
            v-if="!!item.cornerIcon"
            :src="item.cornerIcon"
          />
          <text class="scroll-list__goods-item__text">{{ item.title }}</text>
        </view>
      </view>
    </u-scroll-list>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";

export default {
  name: "ScrollListArea",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  // 组件选项，设置样式隔离为共享模式
  options: {
    styleIsolation: "shared", // 共享样式，使组件内的样式影响到全局
  },
  computed: {
    isShowIndicator() {
      if (!Array.isArray(this.list)) {
        console.error("isShowIndicator: list should be an array");
        return false;
      }
      return this.list.length > 5;
    },

    indicatorWidth() {
      return uni.upx2px(38);
    },

    indicatorBarWidth() {
      // 检查 this.list 是否为 null 或 undefined
      if (!this.list) {
        console.error("list is null or undefined");
        return 0;
      }

      // 检查 this.list.length 是否大于 5
      if (this.list.length <= 5) {
        return 0;
      }

      const BAR_WIDTH_UNIT = 38; // 底部滚动宽度
      const flooredWidth = Math.floor((5 / this.list.length) * 100) / 100;
      console.log(flooredWidth, "floowdit", this.list.length);
      const width = flooredWidth * BAR_WIDTH_UNIT;
      const cachedWidth = uni.upx2px(width);
      return cachedWidth;
    },
  },

  methods: {
    calculateDenominator(x) {
      const q = Math.floor(x / 10);
      const r = x % 10;

      if (r >= 5) {
        return (q + 1) * 10;
      } else {
        return q * 10;
      }
    },

    async goToPage(item) {
      console.log("goToPage", item);
      action_report({
        action_name: "shop_diamond_click",
        module_name: "shop",
        extend: {
          diamond_name: item.title,
        },
      });
      // 1为h5
      if (item.jumpType === 1) {
        const obj = {
          content: {
            route: { path: item.h5Link, type: "URL" },
          },
        };
        this.$emit("handle-ad-route", obj);
      } else if (item.jumpType === 2) {
        const miniLink = item.miniLink;
        let obj = {
          content: {
            route: { path: item.h5Link, type: "URL" },
          },
        };
        if (miniLink.startsWith("APPLET/")) {
          obj = {
            content: {
              route: { path: miniLink.substring(7), type: "APPLET" },
            },
          };
        } else {
          obj = {
            content: {
              route: { path: item.miniLink, type: "NATIVE" },
            },
          };
        }
        this.$emit("handle-ad-route", obj);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-list-wrapper {
  padding: 0 40rpx 0 42rpx;
  ::v-deep .u-scroll-list__indicator__line {
    height: 4rpx;
    border-radius: 4rpx;
  }
  ::v-deep .u-scroll-list__indicator__line__bar {
    height: 4rpx;
    border-radius: 4rpx;
  }

  ::v-deep .u-scroll-list {
    padding-bottom: 0;
  }

  .scroll-list {
    display: flex;
    flex-direction: row;
    padding-top: 14rpx;

    &__goods-item {
      position: relative;
      width: 100rpx;
      height: 108rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6rpx;
      padding: 4rpx 0 2rpx 0;
      &:not(:last-child) {
        margin-right: 36rpx;
      }

      &__image {
        width: 62rpx;
        height: 62rpx;
        border-radius: 4px;
      }

      &__corner {
        position: absolute;
        height: 25rpx;
        width: 42rpx;
        top: -8rpx;
        left: 52rpx;
      }

      &__text {
        width: 100rpx;
        height: 35rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        font-size: 25rpx;
        color: #333333;
        line-height: 35rpx;
        text-align: center;
        font-style: normal;
        overflow: hidden;
      }
    }

    &__show-more {
      background-color: #fff0f0;
      border-radius: 3px;
      padding: 3px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;

      &__text {
        font-size: 12px;
        width: 12px;
        color: #f56c6c;
        line-height: 16px;
      }
    }
  }
}
</style>
