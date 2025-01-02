<template>
  <view class="choiceness-content">
    <scroll-view
      scroll-y
      class="choiceness-scroll-view"
      :refresher-enabled="true"
      :scroll-with-animation="false"
      :refresher-triggered="triggered"
      refresher-background="#fff"
      @refresherrefresh="myPullDownRefresh"
      @scroll="scrollFun"
      :throttle="false"
      @scrolltolower="handleScrollToLower"
    >
      <view>
        <!-- <view
          id="goodHeader"
          ref="goodHeader"
          style="height: 1px; width: 1px"
        ></view> -->
        <u-sticky class="goods-header" v-if="goodsCats.length > 0">
          <ChoicenessGoodsHeader
            :cats="goodsCats"
            @onSwitch="handleSwitchTab"
          />
        </u-sticky>

        <view
          style="
            margin-top: 16rpx;
            padding: 0 8px 32rpx;
            display: flex;
            flex-direction: column;
          "
          ><GoodsList
            v-if="showBottom"
            :useSkeleton="useSkeleton"
            :goods="formattedGoods"
            :adItems="sectionGoodsIndex === 0 ? goodsAds : []"
            eType="recommend"
            :switchTab="sectionGoodsIndex"
        /></view>
      </view>
    </scroll-view>
    <!-- 悬浮资源位 -->
    <!-- <ad-popup :show.sync="showAd" ref="adComponent"></ad-popup> -->
    <!-- 弹框资源位 -->
    <!-- <resourcePop :show.sync="showAd"></resourcePop> -->
  </view>
</template>

<script>
import GoodsList from "@/components/goodsList/index.vue";
import {
  GET_RECOMMEND_AREA,
  GET_RECOMMEND_HOT,
  getCategoryTreeGoodsV2,
} from "@/api/mall";
import { GET_RECOMMEND_GOODS, GET_RECOMMEND_CLASSIFY } from "@/api/mallv2";
import { mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
import { GET_BANNER_INFO } from "@/api";
import {
  getCarouselList,
  getHomeNearestMall,
  getNewPersonBannerPopUp,
} from "@/api/home";
// import ChoicenessCatView from "./ChoicenessCatView.vue";
// import ChoicenessHotView from "./ChoicenessHotView.vue";
import ChoicenessGoodsHeader from "./ChoicenessGoodsHeader.vue";
import NoData from "@/components/noData/index.vue";
import { adRouteGo, rpxToPx } from "@/utils";
import NewComerGift from "@/pages/home/components/newComerGift/index.vue";

export default {
  components: {
    ChoicenessGoodsHeader,
    // ChoicenessHotView,
    // ChoicenessCatView,
    GoodsList,
    NoData,
    NewComerGift,
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
  },

  data() {
    return {
      showAd: true,
      triggered: false,
      footerTriggered: false,
      // 热门商品分类
      cats: [],
      // 金刚区热门
      hots: [],
      // 轮播
      bannerIndex: 1,
      banners: [],
      // 专区
      areas: [],
      // 推荐商品分类
      goodsCats: [],
      goodsAds: [],
      // 选中的推荐商品分类
      sectionGoodsIndex: 0,
      // 分区商品查询参数，第一个是推荐
      sectionGoodsParams: [
        {
          dbPageNo: 0,
          skipGoods: 0,
          pageNum: 1,
          pageSize: 10,
        },
      ],
      // 分类对应商品
      sectionGoods: [],
      isScrollChild: false,
      rootScrollTop: 0,
      goodsHeaderScrollTop: 0,
      fixLock: false,
      showBottom: true,
    };
  },
  computed: {
    ...mapState({
      selectedAddress: (state) => state.selectedAddress,
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
    hotItemMargin() {
      return (index) => {
        if (index > 0) {
          if (this.hots.length > 5) {
            return {
              marginLeft: "34rpx",
            };
          }
          return {
            marginLeft: `calc((100vw - 23rpx * 2 - 100rpx * 5) / 4)`,
          };
        }
        return {};
      };
    },
    areaItemStyle() {
      if (this.areas.length === 2) {
        return {
          aspectRatio: 182 / 140,
        };
      }
      if (this.areas.length === 3) {
        return {
          aspectRatio: 118 / 180,
        };
      }
      return {};
    },
    bannerImageUrls() {
      return this.banners.map((e) => e.content.material.url);
    },
  },
  methods: {
    scrollFun(e) {
      let top = e.detail.scrollTop;
      this.rootScrollTop = top;
      if (top > 5) {
        this.$emit("scrollTrue", true);
      } else {
        this.$emit("scrollTrue", false);
      }
      this.$emit("scroll", top);
    },
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
      console.log("jump ad: ", ad.content.route);
      const { path, type } = ad.content.route;
      switch (type) {
        case "NATIVE":
          const tabPaths = ["/pages/mall/index", "/pages/index/index"];
          if (tabPaths.some((e) => e === path)) {
            return uni.switchTab({
              url: path,
            });
          } else {
            return uni.navigateTo({
              url: path,
            });
          }
        case "APPLET":
          let appId = JSON.parse(path).menu;
          let pathReal = JSON.parse(path).function;
          const systemInfo = uni.getAccountInfoSync();
          if (systemInfo.miniProgram.appId == appId) {
            return uni.navigateTo({
              url: pathReal,
            });
          } else {
            return uni.navigateToMiniProgram({
              appId,
              path: pathReal,
              success(res) {
                // 打开成功
              },
            });
          }
        case "URL":
          if (path.indexOf("http") !== -1) {
            console.log("path===>", path, path.indexOf("http"));
            let newRoute = "";
            if (path.indexOf("h5/shareActivity/?random=123#")) {
              newRoute = path.replace("h5/shareActivity/?random=123#", "#");
            } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
              newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
            } else if (path.indexOf("h5/shareActivity/?random=123")) {
              newRoute = path.replace("h5/shareActivity/?random=123/", "");
            }
            let str = `/pagesA/webView/index?route=${encodeURIComponent(
              newRoute
            )}&type=icon`;
            console.log("url===>", str, newRoute);
            return uni.navigateTo({
              url: str,
            });
          } else {
            return uni.navigateTo({
              url: path,
            });
          }
      }
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
          if (!lat && !lon) {
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

              uni.navigateTo({
                url: `/pagesB/inStoreService/index?shopId=${shopId}&lat=${lat}&lon=${lon}`,
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
        uni.$emit("skeleton-refresh", true); // 关闭骨架屏
        this.queryGoods();
      }
    },
    async myPullDownRefresh() {
      console.log("上滑");
      await this.refresh(true);
    },
    async handleScrollToLower() {
      console.log("下滑");
      console.log("");
      if (this.triggered || this.footerTriggered) {
        return;
      }
      this.footerTriggered = true;
      const params = this.sectionGoodsParams[this.sectionGoodsIndex];
      params.pageNum += 1;
      try {
        await this.queryGoods();
        this.footerTriggered = false;
      } catch (e) {
        console.log("商城上拉数据出错：", e);
        this.footerTriggered = false;
        params.pageNum -= 1;
      }
    },
    async refresh(showTriggered) {
      if (this.triggered) {
        return;
      }
      if (showTriggered) {
        this.triggered = true;
      }
      try {
        // 查询推荐类目
        const res1 = await GET_RECOMMEND_CLASSIFY();
        this.cats = res1.data.data.filter((e) => e.recommendType === 1);
        this.cats.push({
          id: 0,
          name: "全部分类",
        });
        this.goodsCats = res1.data.data.filter((e) => e.recommendType === 2);
        // 更新分类商品查询数据
        const params = [
          {
            dbPageNo: 0,
            skipGoods: 0,
            pageNum: 1,
            pageSize: 10,
          },
        ];
        for (const goodsCat of this.goodsCats) {
          params.push({
            pageNum: 1,
            pageSize: 10,
            classifyId: goodsCat.id,
          });
        }
        this.sectionGoodsParams = params;
        this.sectionGoods = Array(params.length);
        // 查询金刚区
        // const res2 = await GET_RECOMMEND_HOT();
        // this.hots = res2?.data?.data || [];
        // // 查询专区
        // const res3 = await GET_RECOMMEND_AREA({ version: 2, enabled: true });
        // this.areas = res3?.data?.data || [];
        // 查询广告
        const res4 = await getCarouselList({
          key: "CAROUSEL_SHOPPING_APPLE",
          cityCode: uni.getStorageSync("cityCode"),
        });
        this.goodsAds = res4?.data || [];
        // // 查询banner
        // await this.queryBanner();
        // 查询分区商品
        // let item = uni.getStorageSync("mall_last_search_address_obj");
        // if (!(item.lat && item.lon)) {
        //   await this.queryGoods();
        // }
        await this.queryGoods();
        this.triggered = false;
      } catch (e) {
        console.log("商城刷新数据出错：", e);
        this.triggered = false;
      }
    },
    async queryGoods(data) {
      try {
        const params = this.sectionGoodsParams[this.sectionGoodsIndex];
        let goodData = [];
        if (this.sectionGoodsIndex === 0) {
          const res = await GET_RECOMMEND_GOODS({
            ...Object.assign(params, data),
            type: 3,
            // shopId: uni.getStorageSync("onlineCurMallId"),
            shopId: this.shopId,
          });
          params.dbPageNo = res.data.data.dbPageNo;
          params.skipGoods = res.data.data.skipGoods;
          goodData = res.data.data.goodData ?? [];
        } else {
          const res = await getCategoryTreeGoodsV2({
            ...Object.assign(params, data),
            // shopId: uni.getStorageSync("onlineCurMallId"),
            shopId: this.shopId,
          });
          goodData = res?.data?.data?.data || [];
        }
        const sectionGoods = this.sectionGoods ?? [];
        if (params.pageNum === 1) {
          sectionGoods[this.sectionGoodsIndex] = goodData;
        } else {
          sectionGoods[this.sectionGoodsIndex] = (
            sectionGoods[this.sectionGoodsIndex] ?? []
          ).concat(goodData);
          if (goodData.length === 0) {
            params.pageNum -= 1;
          }
        }
        console.log("查询商品结束：", sectionGoods);
        this.sectionGoods = [...sectionGoods];
      } catch (error) {
      } finally {
        this.showBottom = true;

        uni.$emit("skeleton-refresh", false); // 关闭骨架屏
      }
    },
    async queryBanner() {
      try {
        const res = await GET_BANNER_INFO({
          key: "BANNER_PET_SHOPPING_APPLE",
          cityCode: uni.getStorageSync("cityCode"),
        });
        this.banners = res.data;
        if (this.banners.length > 0) {
          const banner = this.banners[0];
          display_report({
            display_name: "shop_banner_display",
            object_type: "shop",
            extend: {
              ad_name: banner.content.title,
              ad_id: banner.content.id,
            },
          });
        }
      } catch (_) {
        this.banners = [];
      }
    },
  },
  mounted() {
    this.refresh(false);
    uni.$on("refresh", (res) => {
      this.showBottom = false;
      this.refresh(true);
    });
    // this.getNewComerGiftBanner(); 交给父组件调用
  },
  watch: {
    shopId: {
      immediate: false,
      handler(newValue, oldValue) {
        console.log("jiantingdao 数据变更", newValue);
        console.log("请求推荐数据====》");
        this.showBottom = false;
        this.queryGoods({ dbPageNo: 0, pageNum: 1 });
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
</style>
