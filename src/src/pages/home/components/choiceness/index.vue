<template>
  <view class="choiceness-content">
    <!-- <scroll-view
      scroll-y
      class="choiceness-scroll-view"
      :refresher-enabled="true"
      :scroll-with-animation="false"
      :refresher-triggered="triggered"
      @refresherrefresh="myPullDownRefresh"
      :throttle="false"
      @scrolltolower="handleScrollToLower"
    > -->
    <view>
      <view
        v-if="cats.length > 0 || hots.length > 0"
        class="core-functional-box"
      >
        <view v-if="cats.length > 0" class="core-functional-areas">
          <core-functional-area
            v-for="(item, index) in cats"
            :cat="item"
            :index="index"
            :key="item.id"
            @onClick="handleHotTapped(item)"
            :class="{
              'first-child': index === 0,
              'last-child': index === cats.length - 1,
            }"
          ></core-functional-area>
        </view>
        <scroll-list-area
          :list="hots"
          @handle-ad-route="handleAdRoute"
        ></scroll-list-area>
      </view>

      <!-- 骨架屏 -->
      <template v-else>
        <view v-if="useSkeleton" class="skeleton-jingang">
          <view class="jingang-box">
            <image class="icon" :src="skeletonIcon" />
          </view>
        </view>
      </template>

      <view v-if="bannerImageUrls.length > 0" style="position: relative">
        <swiper
          class="banner-swiper"
          autoplay
          circular
          interval="3000"
          @change="handleBannerChanged"
        >
          <swiper-item
            v-for="url in bannerImageUrls"
            :key="url"
            @click="handleBannerTapped(url)"
          >
            <view class="banner-item">
              <image class="banner-image" :src="url" mode="aspectFill"></image>
            </view>
          </swiper-item>
        </swiper>
        <view v-if="bannerImageUrls.length > 1" class="banner-indicator">
          <text class="indicator-index">{{ bannerIndex }}</text
          >/<text>{{ bannerImageUrls.length }}</text>
        </view>
      </view>
      <view>
        <myTipsCard v-if="tipsList" :tipsList="tipsList" />
      </view>
      <!-- banner 位置 -->
      <banner-swiper
        banner-key="BANNER_CONSULTATION_HOME_APPLE"
        bannerStyle="margin-top: 15rpx; margin-bottom: 15rpx;width: 719.23rpx;"
        moduleName="shop"
        actionName="newhome_banner_click"
        displayName="newhome_banner_show"
      />
      <!-- padding: 0 15.38rpx 32rpx; -->
      <view
        style="
          margin: 15rpx auto 0;
          display: flex;
          flex-direction: column;
          width: 719rpx;
        "
        ><GoodsList
          :useSkeleton="useSkeleton"
          :goods="formattedGoods"
          from="home"
          :adItems="sectionGoodsIndex === 0 ? goodsAds : []"
          eType="recommend"
      /></view>
    </view>
    <!-- </scroll-view> -->
    <!-- <advertisementPop
      v-if="imgData && imgData.length"
      :info="imgData"
      ref="adComponent"
      :show.sync="isShowPop"
    /> -->
  </view>
</template>

<script>
import GoodsList from "@/components/goodsList/index.vue";
import {
  GET_RECOMMEND_AREA,
  GET_RECOMMEND_HOT,
  getCategoryTreeGoodsV2,
} from "@/api/mall";
import {
  GET_RECOMMEND_GOODS,
  GET_RECOMMEND_CLASSIFY,
  featureArea,
  navigationArea,
} from "@/api/mallv2";
import { mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
import { GET_BANNER_INFO } from "@/api";
import {
  getCarouselList,
  getHomeNearestMall,
  getNewPersonBannerPopUp,
} from "@/api/home";

import { GET_MEMBER_LV_CONFIG } from "@/api/memberV2";
import ChoicenessCatView from "./ChoicenessCatView.vue";
import ChoicenessHotView from "./ChoicenessHotView.vue";
import ChoicenessGoodsHeader from "./ChoicenessGoodsHeader.vue";
import NoData from "@/components/noData/index.vue";
import { adRouteGo } from "@/utils";
import myTipsCard from "../myTipsCard/index.vue";
// import NewComerGift from "@/pages/home/components/newComerGift/index.vue";
import bannerSwiper from "@/components/bannerSwiper/index.vue";
import CoreFunctionalArea from "./CoreFunctionalArea.vue";
import ScrollListArea from "./ScrollListArea.vue";

export default {
  components: {
    ChoicenessGoodsHeader,
    ChoicenessHotView,
    ChoicenessCatView,
    GoodsList,
    NoData,
    myTipsCard,
    bannerSwiper,
    CoreFunctionalArea,
    ScrollListArea,
  },

  props: {
    useSkeleton: {
      type: Boolean,
      default: false,
    },
    opensetting: {
      type: Boolean,
      default: false,
    },
    safeAreaTop: {
      type: Number,
    },
    shopId: {
      type: String | Number,
    },
    tipsList: {
      type: Object,
      default: () => {},
    },
    cats: {
      type: Array,
      default: () => [],
    },
    hots: {
      type: Array,
      default: () => [],
    },
    banners: {
      type: Array,
      default: () => [],
    },
    goodsAds: {
      type: Array,
      default: () => [],
    },
    sectionGoods: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      // 轮播
      bannerIndex: 1,
      // goodsAds: [],
      // 选中的推荐商品分类
      sectionGoodsIndex: 0,
      // 分类对应商品
      // sectionGoods: [],
      // 骨架屏icon
      skeletonIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/home/skeleton_icon.png",
    };
  },
  computed: {
    ...mapState({
      selectedAddress: (state) => state.selectedAddress,
      userInfo: (state) => state.userInfo,
    }),

    formattedGoods() {
      const goods = this.sectionGoods[this.sectionGoodsIndex] ?? [];
      return goods.map((e) => {
        const salePrice =
          e.promotionTag != null ? e.promotionPrice : e.lowestPrice;
        const originPrice = e.promotionTag != null ? e.lowestPrice : 0;
        return {
          picture: e.majorPicture,
          title: e.itemName,
          salePrice: salePrice,
          originPrice: originPrice,
          id: e.itemId,
          skuId: e.skuId,
          skuTag: e.skuTag,
          shopId: e.shopId,
          promotion: e.promotionTag,
          soldStockTag: e.soldStockTag,
        };
      });
    },
    bannerImageUrls() {
      return this.banners.map((e) => e.content.material.url);
    },
  },
  methods: {
    handleSearchTapped() {
      uni.navigateTo({
        url: "/pagesC/searchGoods/index",
      });
    },
    handleOpenSetting() {
      console.log("emit handleOpenSetting");
      this.$emit("handleOpenSetting");
    },
    handleAdRoute(ad) {
      adRouteGo(ad.content.route);
    },
    handleBannerChanged(e) {
      const { current } = e.detail;
      this.bannerIndex = current + 1;
      const banner = this.banners[current];
      display_report({
        display_name: "shop_banner_display",
        object_type: "shop",
        extend: {
          ad_name: banner.content.title,
          ad_id: banner.content.id,
        },
      });
    },
    handleBannerTapped(url) {
      uni.$u.debounce(() => {
        const banner = this.banners.find((e) => {
          return e.content.material.url === url;
        });
        if (banner) {
          this.handleAdRoute(banner);
          action_report({
            action_name: "shop_banner_click",
            module_name: "shop",
            extend: {
              ad_name: banner.content.title,
              ad_id: banner.content.id,
            },
          });
        }
      }, 500);
    },
    handleCatTapped(cat) {
      console.log("分类点击-----》", cat);
      if (cat.id === 0) {
        action_report({
          action_name: "shop_allclass_click",
          module_name: "shop",
        });
        uni.navigateTo({
          url: `/pagesC/goodsCategories/index`,
        });
        return;
      }
      action_report({
        action_name: "shop_class2_click",
        module_name: "shop",
        extend: {
          shop_class2_id: cat.id,
          shop_class2_name: cat.name,
        },
      });
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/filterGoodsService/index?categoryId=${cat.id}&title=${cat.name}`,
        });
      }, 500);
    },
    async handleHotTapped(hot) {
      action_report({
        action_name: "home_mainfunctionalarea_click",
        module_name: "shop",
        extend: {
          area_name: hot.mainTitle || "",
          ad_id: this.userInfo.userId || "",
        },
      });
      if (hot.jumpType === 1) {
        if (hot.h5Link?.indexOf("{shopId}") !== -1) {
          const mall_last_search_address_obj = uni.getStorageSync(
            "mall_last_search_address_obj"
          );

          let lon, lat, cityCode, cityName;

          if (!mall_last_search_address_obj) {
            lon = uni.getStorageSync("lon");
            lat = uni.getStorageSync("lat");
            cityCode = uni.getStorageSync("currentCity");
            cityName = uni.getStorageSync("selectedCityCode");
            console.log("1==>", lat, lon, cityCode, cityName);
          } else {
            lon = mall_last_search_address_obj.lon;
            lat = mall_last_search_address_obj.lat;
            cityCode =
              mall_last_search_address_obj.cityCode ||
              mall_last_search_address_obj.adcode;
            cityName =
              mall_last_search_address_obj.cityName ||
              mall_last_search_address_obj.city;
            console.log("2===>", lat, lon, cityCode, cityName);
          }
          console.log("结果====>", lat, lon);
          if (!lat && !lon && !cityCode && !cityName) {
            if (hot.title === "到店服务") {
              uni.reLaunch({
                url: `/pages/service/index?shopId=&lat=${lat}&lon=${lon}&cityCode=${cityCode}&cityName=${cityName}`,
              });
              return;
            }
            uni.showToast({
              icon: "none",
              title: "您附近暂无宠胖胖门店！",
            });
          }
          try {
            const res = await getHomeNearestMall({
              cityCode,
              cityName,
              lon,
              lat,
              errShow: false,
            });
            if (res.data?.data?.shopId) {
              const link = hot.h5Link?.replace(
                "{shopId}",
                res.data?.data?.shopId
              );
              const shopId = res.data?.data?.shopId;
              // 该链接需要单独处理，与首页类似，直接跳转小程序内部
              // uni.navigateTo({
              //   url: `/pagesB/inStoreService/index?shopId=${this.data.shopId}&lat=${latNow}&lon=${lonNow}`,
              // });

              // uni.navigateTo({
              //   url: `/pagesB/inStoreService/index?shopId=${shopId}&lat=${lat}&lon=${lon}`,
              // });
              uni.reLaunch({
                url: `/pages/service/index?shopId=${shopId}&lat=${lat}&lon=${lon}`,
              });
              // this.handleAdRoute({
              //   content: {
              //     route: {path: link, type: "URL"}
              //   }
              // });
            } else {
              await uni.showToast({
                icon: "none",
                title: "您附近暂无宠胖胖门店！",
              });
            }
          } catch (_) {
            await uni.showToast({
              icon: "none",
              title: "您附近暂无宠胖胖门店！",
            });
          }
          return;
        }
        this.handleAdRoute({
          content: {
            route: { path: hot.h5Link, type: "URL" },
          },
        });
      } else if (hot.jumpType === 2) {
        const miniLink = hot.miniLink;
        if (miniLink.startsWith("APPLET/")) {
          this.handleAdRoute({
            content: {
              route: { path: miniLink.substring(7), type: "APPLET" },
            },
          });
        } else {
          if (miniLink.indexOf("${levelConfigId}") !== -1) {
            return await this.handleMiniLink(hot);
          }
          this.handleAdRoute({
            content: {
              route: { path: hot.miniLink, type: "NATIVE" },
            },
          });
        }
      }
    },
    handleAreaTapped(area, index) {
      action_report({
        action_name: `shop_zone${index + 1}_click`,
        module_name: "shop",
      });
      if (area.h5Link.startsWith("http")) {
        this.handleAdRoute({
          content: {
            route: { path: area.h5Link, type: "URL" },
          },
        });
      } else {
        this.handleAdRoute({
          content: {
            route: { path: area.h5Link, type: "NATIVE" },
          },
        });
      }
    },
    handleSwitchTab(tabIndex) {
      if (this.sectionGoodsIndex === tabIndex) {
        return;
      }
      this.sectionGoodsIndex = tabIndex;
      if ((this.sectionGoods[this.sectionGoodsIndex] ?? []).length === 0) {
        this.queryGoods();
      }
    },

    /**
     * 处理跳转会员权益页面的Path路径，增加会员等级参数levelConfigId
     *
     * 该方法用于处理与“Mini链接”相关的一系列操作，可能包括数据获取、状态更新等
     * @param {object} hot 包含miniLink属性的对象，用于获取跳转路径
     */
    async handleMiniLink(hot) {
      const userInfoToken = uni.getStorageSync("storage_info") || {};
      if (!Object.keys(userInfoToken).length) {
        return uni.navigateTo({ url: "/pagesD/login/index" });
      }

      let path = hot.miniLink;

      // 验证和清理 path
      if (typeof path !== "string" || !path.startsWith("/")) {
        console.error("Invalid miniLink path:", path);
        return;
      }

      try {
        const response = await GET_MEMBER_LV_CONFIG();
        const { currentLevelIndex = 1, levelConfigList = [] } =
          response.data.data;

        // 检查 data 和 levelConfigList 是否为空
        if (
          !response.data.data ||
          !Array.isArray(levelConfigList) ||
          levelConfigList.length === 0
        ) {
          console.error(
            "Invalid member level config data:",
            response.data.data
          );
          return;
        }

        // 替换 ${levelConfigId} 为实际的 levelConfigId
        path = path.replace(
          /\${levelConfigId}/,
          levelConfigList[currentLevelIndex - 1].levelConfigId
        );

        console.log("miniLink===>", path);

        this.handleAdRoute({
          content: {
            route: { path: path, type: "NATIVE" },
          },
        });
      } catch (error) {
        console.error("Error fetching member level config:", error);
      }
    },
  },
  onShow() {},
  mounted() {
    console.log("chose===========", this.tipsList);
    // this.getFloatData();
    // this.refresh(false);
    // uni.$on("refresh", (res) => {
    //   this.refresh(true);
    // });
    // this.getNewComerGiftBanner(); 交给父组件调用
  },
  watch: {
    shopId: {
      immediate: false,
      handler(newValue, oldValue) {
        console.log("jiantingdao 数据变更", newValue);
        console.log("请求推荐数据====》");
        this.queryGoods({ dbPageNo: 0 });
      },
    },
  },
};
</script>

<style lang="scss">
.choiceness-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .choiceness-scroll-view {
    height: 100%;
    overflow-y: scroll;
  }

  .banner-swiper {
    margin-bottom: 31rpx;
    width: 100vw;
    height: calc(100vw / (374 / 110));
    .banner-item {
      height: 100%;
      padding: 0 30rpx;
    }
    .banner-image {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
  .banner-indicator {
    position: absolute;
    right: 52rpx;
    bottom: 17rpx;
    background-color: #00000047;
    width: 30px;
    height: 17px;
    border-radius: 8.5px;
    font-size: 10px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    .indicator-index {
      font-weight: bold;
      color: white;
      font-size: 14px;
    }
  }
  .cats-hots-container {
    // margin-top: 30rpx;
    // padding-top: 38rpx;
    width: 719rpx;
    margin: 0 auto;
    border-radius: 23rpx;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      #ffffff 84%,
      rgba(243, 243, 244, 0) 100%
    );
    // border-radius: 31rpx 31rpx 0 0;
    .cats-container {
      padding: 0 23rpx;
      height: 140rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 23rpx;
      .cat-item {
        height: 100%;
        width: 100rpx;
      }
    }
    .hots-container {
      display: flex;
      width: 100%;
      height: 130rpx;
      margin-bottom: 31rpx;
      .hot-item {
        width: 100rpx;
        height: 100%;
        flex-shrink: 0;
      }
    }
  }
  .areas-container {
    padding: 0 15rpx;
    margin-bottom: 19rpx;
    display: flex;
    justify-content: space-between;
    .area-item {
      flex: 1;
      height: auto;
    }
    .area-item + .area-item {
      margin-left: 19rpx;
    }
  }
  .goods-header {
    height: 85rpx;
    width: 100%;
  }
  .goods-list {
    width: calc(100% - 16px);
    height: calc(100% - 44px);
    margin-top: 20rpx;
    padding: 0 8px 32rpx;
    display: flex;
    flex-direction: column;
  }
}

.core-functional-box {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
  width: 719rpx;
  max-height: 358rpx;
  margin: 15rpx auto;
  padding: 21rpx 0 21rpx 0;
  border-radius: 23rpx;
  background: #ffffff;
  .core-functional-areas {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 35rpx 17rpx 48rpx;
    .first-child {
      padding-left: 6rpx;
    }

    .last-child {
      padding-right: 19rpx;
    }
  }
  .cat-item {
    height: 100%;
    width: 100rpx;
  }
  .cats-hots-container {
    margin-top: 30rpx;
    padding-top: 38rpx;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      #ffffff 84%,
      rgba(243, 243, 244, 0) 100%
    );
    border-radius: 31rpx 31rpx 0 0;
    .cats-container {
      padding: 0 23rpx;
      height: 140rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 23rpx;
      .cat-item {
        height: 100%;
        width: 100rpx;
      }
    }
    .hots-container {
      display: flex;
      width: 100%;
      height: 130rpx;
      margin-bottom: 31rpx;
      .hot-item {
        width: 100rpx;
        height: 100%;
        flex-shrink: 0;
      }
    }
  }
}

.skeleton-jingang {
  width: 100vw;
  padding: 0 15rpx;
  box-sizing: border-box;
  .jingang-box {
    width: 100%;
    height: 358rpx;
    background: #ffffff;
    border-radius: 23rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .icon {
      display: block;
      width: 165rpx;
      height: 65rpx;
    }
  }
}
</style>
