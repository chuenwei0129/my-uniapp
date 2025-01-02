<template>
  <view class="goods-list-content">
    <view class="even-goods-list">
      <view v-if="adItems.length > 0" class="ad-items">
        <swiper
          class="ad-swiper"
          autoplay
          circular
          interval="3000"
          @change="handleAdChanged"
        >
          <swiper-item
            v-for="ad in adItems"
            :key="ad.id"
            @click="handleAdTapped(ad)"
          >
            <view class="ad-item">
              <image
                class="ad-image"
                :src="ad.content.material.url"
                mode="aspectFill"
              ></image>
            </view>
          </swiper-item>
        </swiper>
        <!-- 面板指示点 -->
        <view v-if="adItems.length > 1" class="ad-indicator">
          <view class="ad-indicator-wrapper">
            <view
              v-for="ad in adItems"
              :class="[
                'indicator-item',
                adItems[currentAdIndex].id === ad.id
                  ? 'indicator-item-selected'
                  : '',
              ]"
              :key="ad.id"
            />
          </view>
        </view>
      </view>

      <!-- 骨架屏  -->
      <!-- <template v-else>
        <view
          v-if="showSkeleton && useSkeleton"
          class="skeleton-evengoods paddingRight demo3"
        >
          <view class="skeleton-item">
            <image class="icon" :src="skeletonIcon" />
          </view>
        </view>
      </template> -->
      <template v-if="evenGoods && evenGoods.length > 0">
        <GoodsCard
          class="goods-item"
          v-for="goodsItem in evenGoods"
          :key="goodsItem.id"
          :goods="goodsItem"
          :canAddCart="canAddCart"
          :imageStyle="imageStyle"
          :eType="eType"
          needMargin
          @click="handleClickGoods"
        ></GoodsCard>
      </template>

      <!-- 骨架屏  -->
      <view
        v-else-if="
          showSkeleton &&
          evenGoods.length == 0 &&
          oddGoods.length == 0 &&
          useSkeleton
        "
        class="skeleton-evengoods paddingRight test2"
      >
        <view class="skeleton-item" v-for="i in 2" :key="i">
          <image class="icon" :src="skeletonIcon" />
        </view>
      </view>
    </view>

    <!-- 偶数 -->
    <view class="odd-goods-list" v-if="oddGoods && oddGoods.length > 0">
      <GoodsCard
        class="goods-item"
        v-for="goodsItem in oddGoods"
        :key="goodsItem.id"
        :goods="goodsItem"
        :canAddCart="canAddCart"
        :imageStyle="imageStyle"
        :eType="eType"
        needMargin
        @click="handleClickGoods"
      ></GoodsCard>
    </view>

    <!-- 骨架屏  -->
    <view
      v-else-if="
        showSkeleton &&
        oddGoods.length == 0 &&
        evenGoods.length == 0 &&
        useSkeleton
      "
      class="skeleton-evengoods paddingLeft"
    >
      <view class="skeleton-item" v-for="i in 2" :key="i">
        <image class="icon" :src="skeletonIcon" />
      </view>
    </view>
  </view>
</template>

<script>
import { adRouteGo } from "@/utils/index";
import GoodsCard from "../goodsCard/index.vue";
import { action_report, display_report } from "@/utils/track";

export default {
  name: "MallGoodsList",
  props: {
    useSkeleton: {
      type: Boolean,
      default: false,
    },
    goods: {
      type: Array,
      default: [],
    },
    canAddCart: {
      type: Boolean,
      default: false,
    },
    imageStyle: {
      type: Object,
      default: () => {
        return {
          backgroundColor: "white",
        };
      },
    },
    adItems: {
      type: Array,
      default: () => [],
    },
    eType: {
      type: String,
      default: "",
    },
    from: {
      type: String,
      default: "",
    },
    switchTab: {
      type: Number,
    },
  },
  components: {
    GoodsCard,
  },
  data() {
    return {
      currentAdIndex: 0,
      // 骨架屏icon
      skeletonIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/home/skeleton_icon.png",
      showSkeleton: true, // 骨架屏 开启/关闭
    };
  },
  mounted() {
    uni.$on("skeleton-refresh", (bool) => {
      setTimeout(() => {
        this.showSkeleton = bool;
      }, 300);
    });
  },
  computed: {
    oddGoods() {
      console.log("🚀 ~ oddGoods ~ oddGoods:", this.goods);
      if (this.adItems.length > 0) {
        return this.goods.filter((_, index) => index % 2 === 0);
      } else {
        return this.goods.filter((_, index) => index % 2 !== 0);
      }
    },
    evenGoods() {
      if (this.adItems.length > 0) {
        return this.goods.filter((_, index) => index % 2 !== 0);
      } else {
        return this.goods.filter((_, index) => index % 2 === 0);
      }
    },
  },
  methods: {
    handleAdChanged(e) {
      const { current } = e.detail;
      this.currentAdIndex = current;
    },
    handleAdTapped(ad) {
      if (this.from === "home") {
        action_report({
          action_name: "newhome_adfeed_click",
          module_name: "home",
          extend: {
            ad_name: ad.content.title,
            ad_id: ad.content.id,
          },
        });
      }
      adRouteGo(ad.content.route);
    },
    handleClickGoods(goods) {
      console.log("===========goods==>", goods);
      uni.$u.debounce(() => {
        //#ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${goods.id}&shopId=${goods.shopId}`,
        });
        //#endif

        //#ifdef MP-WEIXIN
        action_report({
          action_name: "shop_selected_commodity_click",
          module_name: "shop",
          extend: {
            commodity_name: goods.title,
            commodity_id: goods.id,
          },
        });
        uni.navigateTo({
          url: `/pagesC/goodsServiceDetail/index?itemId=${goods.id}&skuId=${
            goods.skuId || ""
          }&shopId=${goods.shopId}`,
        });
        //#endif
      }, 500);
    },
  },
};
</script>

<style scoped lang="scss">
.goods-list-content {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .even-goods-list {
    display: flex;
    flex-direction: column;
    // flex: 1;
    // width: 352rpx;
    width: calc((100vw - 46rpx) / 2);
  }
  .odd-goods-list {
    @extend .even-goods-list;
    margin-left: 15rpx;
  }

  .ad-items {
    aspect-ratio: 183/287;
    border-radius: 23rpx;
    overflow: hidden;
    margin-bottom: 16rpx;
    box-sizing: border-box;
    .ad-swiper {
      width: 100%;
      height: 100%;
      .ad-item {
        display: flex;
        .ad-image {
          flex: 1;
          border-radius: 23rpx;
          overflow: hidden;
          // width: calc((100vw - 24px) / 2);
          // height: calc((100vw - 24px) / 2 * 287 / 183);
          width: 352rpx;
          height: 552rpx;
        }
      }
    }
    .ad-indicator {
      position: relative;
      width: 100%;
      height: 0;
      .ad-indicator-wrapper {
        display: flex;
        justify-content: center;
        position: absolute;
        width: 100%;
        top: -15rpx;
        .indicator-item {
          width: 12rpx;
          height: 4rpx;
          border-radius: 4rpx;
          background-color: #1f1f1f;
          opacity: 0.25;
          border: 1rpx solid rgba(255, 255, 255, 0.63);
        }
        .indicator-item-selected {
          background: #1f1f1f;
          border: 1rpx solid #1f1f1f;
          opacity: 1 !important;
        }
        .indicator-item + .indicator-item {
          margin-left: 4rpx;
        }
      }
    }
  }

  .goods-item {
    margin-bottom: 16rpx;
  }
}
.skeleton-evengoods {
  width: calc((100vw - 30rpx) / 2);
  box-sizing: border-box;
  .skeleton-item {
    width: 352rpx; // calc((100vw - 46rpx) / 2);
    height: 552rpx;
    background: #ffffff;
    border-radius: 23rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16rpx;
    .icon {
      display: block;
      width: 165rpx;
      height: 65rpx;
    }
  }
}
.paddingRight {
  padding-right: 8rpx;
}
.paddingLeft {
  padding-left: 8rpx;
}
</style>
