<template>
  <view class="in-store-service-content">
    <!--  @refresherrefresh="handleRefresh" -->
    <template v-if="!showDefaultList">
      <FixedNav
        :title="shopInfo.mallName"
        :headerShow="isHeaderShow"
        :isShowBack="false"
        :notFlexCenter="true"
        :shopIcon="shopInfo.mallPictures[0]"
      ></FixedNav>
      <scroll-view
        :refresher-triggered="triggered"
        class="content-scroll-view"
        :using-sticky="true"
        :refresher-enabled="false"
        scroll-y
        :scroll-top="packageScrollTop"
        :throttle="false"
        @scrolltolower="handleLoadMore"
        @scroll="scrollFun"
      >
        <!-- 模拟头部导航         -->
        <NavBar
          titleColor="#000"
          :showBackBtn="false"
          :whiteBack="false"
          navColor="#ffffff"
        />
        <Location :isShowLoaction="false" @openSetting="openSetting" />
        <view v-if="!!shopInfo.shopId" style="height: 100%; width: 100%">
          <view class="shop-info" :style="addMagrinTop">
            <!-- 新的头部样式 -->
            <view class="shop-img-box">
              <image
                :src="shopInfo.mallPictures[0]"
                mode="aspectFill"
                @click="handlePreviewShopImages()"
              />
              <view class="shop-img-num" @click="handlePreviewShopImages()"
                >{{
                  (shopInfo.mallPictures && shopInfo.mallPictures.length) || 0
                }}张</view
              >
              <view
                class="shop-change-btn-wrap"
                @click.stop.prevent="handleSwitchShop"
              >
                <view class="shop-change-btn">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/service/change-store.png"
                  ></image>
                  <text>切换门店</text>
                </view>
              </view>
            </view>
            <view class="shop-info-box">
              <view class="shop-name">{{ shopInfo.mallName }}</view>
              <view class="shop-specific">
                <view class="shop-name-address">
                  <view
                    class="shop-address"
                    @tap="
                      $u.debounce(
                        addressCopy(shopInfo.mallName + ' ' + shopInfo.address),
                        500
                      )
                    "
                  >
                    {{
                      shopInfo.address && shopInfo.address.length > 25
                        ? shopInfo.address.slice(0, 25) + "..."
                        : shopInfo.address
                    }}
                    <view class="iconfont icon-copy addresscopy"></view>
                  </view>
                  <view
                    class="shop-distance"
                    v-if="location.lat && location.lon"
                  >
                    {{ distance }}
                    <view v-if="shopInfo.nearestFlag" class="nearest-tag">{{
                      "最近"
                    }}</view>
                  </view>
                </view>
                <view class="shop-phone-naviagation">
                  <view
                    class="shop-additional-item"
                    @tap="$u.debounce(handleNavigateShop, 500)"
                  >
                    <view class="shop-item-back">
                      <image
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_navigator.png"
                      />
                    </view>
                    <text>导航</text>
                  </view>
                  <view
                    class="shop-additional-item"
                    @tap="$u.debounce(handleCallPhone, 500)"
                  >
                    <view class="shop-item-back">
                      <image
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_phone.png"
                      />
                    </view>
                    <text>电话</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 洗美 直播 -->
          <view class="beauty-live-box">
            <view
              class="beauty-box"
              @click="handleMxReservation"
              v-if="shopInfo.mxReservationOpened"
            >
              <view class="beauty-box-left">
                <image
                  class="img-inco"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/service/resv-icon.png"
                ></image>
                <view class="text">预约洗美</view>
              </view>
              <image
                class="arrow-inco"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
              ></image>
            </view>
            <view
              class="live-box"
              :class="{
                'live-box-complete': !shopInfo.mxReservationOpened,
              }"
              @click="gotoAppDownload"
            >
              <view class="live-box-left">
                <image
                  class="img-inco"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/service/live-icon.png"
                ></image>
                <view class="text">萌宠直播</view>
              </view>
              <image
                class="arrow-inco"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
              ></image>
            </view>
          </view>

          <!-- banner 轮播图 -->
          <banner-swiper
            banner-key="BANNER_SERVICE_DELIVERY_APPLE"
            banner-style="margin-top: 29rpx; margin-bottom: 29rpx;width: 692rpx !important;border-radius: 15rpx;"
            moduleName="store"
            actionName="service_banner_click"
            displayName="service_banner_show"
          />

          <template v-if="petsList && petsList.length">
            <!-- <view style="height: 12rpx; background-color: #f7f8fc"></view> -->
            <view class="inshop-pets">
              <view class="inshop-header">
                <view class="inshop-title">在售宠物</view>
                <view class="showall" @tap="$u.debounce(toAll, 500)">
                  查看全部
                  <view class="allrightarrow"></view>
                </view>
              </view>
              <view class="pets-list">
                <view
                  class="pets-item"
                  :class="{ 'pets-item-last': index === petsList.length - 1 }"
                  v-for="(item, index) in petsList"
                  :key="item.itemId"
                  @click="$u.debounce(goLiveDetail(item), 500)"
                >
                  <image :src="item.imgUrlList && item.imgUrlList[0]"></image>
                  <view class="pet-desc">{{ item.itemName.slice(0, 6) }}</view>
                </view>
              </view>
            </view>
          </template>

          <view
            v-if="dataList && dataList.length"
            style="height: 12rpx; background-color: #f7f8fc"
          ></view>
          <!-- <u-sticky> -->
          <!--  -->
          <view class="main-part" v-if="dataList && dataList.length">
            <scroll-view
              scroll-y
              class="cat-scroll-list"
              :using-sticky="true"
              :scroll-into-view="dataList[catIndex].code"
              :style="{
                top: navFullHeight + 'px',
                height: `calc(100vh - 50px - ${navFullHeight + 'px'})`,
              }"
            >
              <view
                v-for="(item, index) in dataList"
                class="cat-item"
                :key="item.code"
                :id="item.code"
                @click="handleSelectCat(item, index)"
              >
                <view style="position: relative; width: 0; height: 0">
                  <view class="cat-item-back"></view>
                  <view
                    v-if="catIndex === index + 1"
                    class="cat-item-back-top"
                  ></view>
                  <view
                    v-if="catIndex === index - 1"
                    class="cat-item-back-bottom"
                  ></view>
                  <view
                    v-if="
                      catIndex !== index &&
                      catIndex !== index - 1 &&
                      catIndex !== index + 1
                    "
                    class="cat-item-back-all"
                  ></view>
                  <!-- <view v-if="catIndex === index" class="cat-item-indicator" /> -->
                </view>
                <text
                  class="cat-item-name"
                  :style="catIndex === index ? 'font-weight: bold' : ''"
                  >{{ item.name }}</text
                >
              </view>
            </scroll-view>
            <view
              v-if="dataList && dataList.length > 0"
              class="cat-goods-container"
              :class="{
                'cat-goods-container-height': hasPets,
              }"
            >
              <!-- 商品区域  定高-->
              <view
                class="package-scroll-list"
                :scroll-into-view="dataList[rightIndex].code"
                @scroll="handlePackageListScroll"
              >
                <!-- scroll-y  scroll-with-animation="true"  :scroll-top="packageScrollTop" -->
                <view style="height: 7rpx; background-color: white"></view>
                <view
                  v-for="item in dataList"
                  class="package-item"
                  :key="item.code"
                  :id="item.code"
                >
                  <view class="package-name packagename">{{ item.name }}</view>
                  <view
                    v-for="packageItem in item.skuInfoList"
                    class="package-sku-item"
                    :key="packageItem.skuId"
                    @click="handleSelectSku(packageItem)"
                  >
                    <image
                      class="sku-item-picture"
                      mode="aspectFill"
                      :src="packageItem.majorPicture"
                    />
                    <view class="sku-item-right">
                      <view class="sku-item-top">
                        <view class="sku-item-title">{{
                          packageItem.nickName
                        }}</view>
                        <view class="sku-item-desc">{{
                          packageItem.description
                        }}</view>
                      </view>
                      <view class="sku-item-bottom">
                        <GoodsPrice
                          :salePrice="packageItem.promotionPrice"
                          :originPrice="packageItem.price"
                          :saleFontWeight="400"
                          :salePriceIntegerFontSize="38"
                        />
                        <view
                          class="sku-item-buy"
                          @click.stop="handleSelectSku(packageItem)"
                          >抢购</view
                        >
                      </view>
                    </view>
                  </view>
                </view>
                <view
                  :style="{
                    height: `calc(100vh - 315px)`,
                    backgroundColor: '#FFFFFF',
                  }"
                  class="fill-wrap"
                >
                  - 到底了 -
                </view>
              </view>
            </view>
          </view>
          <view
            v-else-if="!(dataList && dataList.length) && showNoData"
            class="no-data-content"
          >
            <NoData
              img="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/no_data.png"
              noDataText="更多服务敬请期待"
              :isShowMore="false"
            />
          </view>
        </view>
      </scroll-view>
      <!-- 门店切换弹窗 -->
      <!-- :isDefaultData.sync="isDefaultData" -->
      <shopChange
        v-if="popupShow"
        :show.sync="popupShow"
        :shopInfo="shopInfo"
        :location="location"
        :bizType="3"
        :selectShopId="shopId"
        :isMedicine="isMedicine"
        @getChangeShopInfo="getChangeShopInfo"
        @copy="addressCopy"
      />
    </template>
    <template v-else>
      <!-- 模拟头部导航         -->
      <DefaultCityList
        :shopList="shopList"
        @copy="addressCopy"
        @selectshop="selectShop"
        @openSetting="openSetting"
      ></DefaultCityList>
    </template>
    <!-- 底部tabbar -->
    <view>
      <CustomTabbar />
    </view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
import FixedNav from "@/components/fixedNav/index.vue";
import DefaultCityList from "./components/defaultCityList/index";

import { searchUserLocation, GET_DEFAULT_SHOPLIST } from "@/api/base";
import { CHECK_MX_RESERVATION } from "@/api/mall";
import {
  GET_NEAREST_SHOP,
  FECTH_NEAR_SHOP_STORE,
  GET_RECOMMEND_GOODS,
  GET_SHOP_CLASSIFY,
  GET_SHOP_INLIST,
  GET_HAS_SHOP_CITIES,
  NEW_FECTH_NEAR_SHOP_STORE,
} from "@/api/mallv2";
import { addCart } from "@/api/cart";
import { getAuthLocation } from "@/utils/location";
import { renderKM } from "@/utils";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import GoodsList from "@/components/goodsList/index.vue";
import CustomTabbar from "@/components/customTabbar/index.vue";
import { mapMutations, mapState } from "vuex";
import bannerSwiper from "@/components/bannerSwiper/index.vue";
import shopChange from "./components/shopChange/index.vue";
import Location from "../home/components/location/index.vue";
import { action_report, display_report } from "@/utils/track";
import NoData from "@/components/noData/index.vue";
const share_params = {
  title: "分享好友，领取免费宠物在线问诊（限时）",
  path: "/pages/service/index",
  imageUrl:
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/share/share-img-logo.png",
  desc: "分享好友，领取免费宠物在线问诊（限时）",
};
export default {
  components: {
    GoodsPrice,
    GoodsList,
    FixedNav,
    CustomTabbar,
    NavBar,
    bannerSwiper,
    shopChange,
    Location,
    NoData,
    DefaultCityList,
  },
  // props: {
  //   opensetting: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },

  data() {
    return {
      statusBarHeight: "",
      navBarHeight: "",
      shopId: "",
      storeId: "",
      location: {
        lon: 0,
        lat: 0,
        province: "",
        provinceCode: 0,
        city: "",
        cityCode: "",
        district: "",
        adcode: 0,
        isLocation: true,
      },
      shopInfo: {},
      safeAreaBottom: 0,
      catIndex: 0,
      rightIndex: null,
      canScrollContent: true,
      canScrollPackage: false,
      packageScrollTop: 0,
      oldScrollTop: 0,
      isDataListCanScroll: false,
      dataList: [],
      dataOffsetList: [],
      dataListIsScrolling: false,
      triggered: false,
      // 推荐商品查询参数
      dbPageNo: 0,
      skipGoods: 0,
      pageNo: 1,
      pageSize: 10,
      goods: [],
      petsList: [], //在售宠物列表
      typeNamePositions: [],
      popupShow: false,
      isHeaderShow: false, //顶部导航栏显示
      isMedicine: false,
      showNoData: false,
      lat: "",
      lon: "",
      shopList: [], //无定位下门店列表
      shareEmpty: "", //分享页是默认门店列表进入
      // showDefaultList: false, //无定位情况下默认展示列表
    };
  },
  computed: {
    ...mapState(["userInfo", "selectedAddress"]),
    navFullHeight() {
      return Number(this.statusBarHeight) + Number(this.navBarHeight);
    },
    hasPets() {
      return this.petsList?.length ? true : false;
    },
    distance() {
      const obj = this.shopInfo;
      // if (this.shopInfo) {
      //   return `距离您${renderKM(this.shopInfo.distance)}`;
      // }
      if (Object.keys(obj).length > 0) {
        return `距离您${renderKM(this.shopInfo.distance)}`;
      }
      return `距离您0m`;
    },
    headerHeight() {
      let h = 0;
      if (!this.opensetting) {
        h += 66;
      }
      h += 189;
      h += 22;
      h += 54;
      h += 8;
      h += 33;
      h += 4;
      h += 33;
      h += 29;
      h += 12;
      return uni.upx2px(h);
    },
    formattedGoods() {
      return this.goods.map((e) => {
        return {
          picture: e.majorPicture,
          title: e.itemName,
          salePrice: e.lowestPrice,
          originPrice: e.salePrice,
          id: e.itemId,
        };
      });
    },
    addMagrinTop() {
      return !this.isMedicine ? "margin-top: 29rpx" : "";
    },
    showMxBtn() {
      return typeof this.shopInfo?.mxReservationOpened === "boolean"
        ? true
        : false;
    },
    showDefaultList() {
      return (
        (!this.shopId && !(this.location.lat && this.location.lon)) ||
        this.shareEmpty == "empty"
      );
    },
  },
  methods: {
    ...mapMutations(["setCustomTabbarIndex"]),
    addressCopy(e) {
      uni.setClipboardData({
        data: e,
        showToast: false,
        success: (res) => {
          uni.showToast({
            title: "已复制门店信息",
            icon: "none",
          });
        },
        fail: function () {
          uni.showToast({
            title: "复制失败",
            icon: "none",
          });
        },
      });
    },
    getTypeNamePositions() {
      //计算商品区标题距离顶部的top值 item.height / 2(微调距离)
      const query = uni.createSelectorQuery().in(this);
      this.typeNamePositions = [];
      query
        .selectAll(".packagename")
        .boundingClientRect((data) => {
          if (data.length) {
            data.forEach((item) => {
              this.typeNamePositions.push(
                item.top - this.navFullHeight - item.height / 2
              );
            });
          }
        })
        .exec();
    },
    toAll() {
      // #ifdef MP-WEIXIN
      action_report({
        action_name: "store_petsforsale_more_click",
        module_name: "store",
        extend: {
          user_id: uni.getStorageSync("storage_info").userId,
        },
      });
      uni.navigateTo({
        url: `/pagesE/livedBody/index?shopId=${this.shopInfo.shopId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesE/livedBody/index?shopId=${this.shopInfo.shopId}&transparentTopBar=1`,
      });
      // #endif
    },
    goLiveDetail(item) {
      // #ifdef MP-WEIXIN
      action_report({
        action_name: "store_petsforsale_pet_click",
        module_name: "store",
        extend: {
          user_id: uni.getStorageSync("storage_info").userId,
          pet_name: item.itemName,
          pet_id: item.itemId,
        },
      });
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${item.itemId}&skuId=${
          item.skuId || ""
        }&shopId=${this.shopInfo.shopId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${
          item.itemId
        }&shopId=${this.shopInfo.shopId}&skuId=${item.skuId || ""}`,
      });
      // #endif
    },
    checkLocation() {
      let storeAddress = {
        lon: "",
        lat: "",
      };
      console.log("this.$dsbridge", this.$dsBridge);
      // #ifdef H5
      if (this.$dsBridge.call("getAddressInfo", "getAddressInfo")) {
        let localJson = this.$dsBridge.call("getAddressInfo", "getAddressInfo");

        const local = localJson ? JSON.parse(localJson) : "";
        const {
          lat = "",
          lon = "",
          currentLon = "", // 当前实时纬度
          currentLat = "", // 当前经度
          cityCode = "", // 城市编码
          cityName = "", // 城市名称
        } = local;

        storeAddress = {
          lat,
          lon,
        };
        console.log("local local", local);
      }

      // else {
      //   storeAddress = {
      //     lon: 120.121431,
      //     lat: 30.221378,
      //   };
      // }

      let { lat, lon } = storeAddress;
      if (lat && lon) {
        this.location = {
          lat: lat,
          lon: lon,
        };
        uni.setStorageSync("lon", lon);
        uni.setStorageSync("lat", lat);
        // this.searchLocation({ ...this.location });
        this.queryData();
        return;
      }
      // #endif
      //#ifdef MP-WEIXIN
      if (!this.shopId && !(this.location.lat && this.location.lon)) {
        //todo 请求城市列表
        this.getNoAddressShopList();
        // this.showDefaultList = true;
      } else {
        this.queryData();
      }
      // #endif
    },
    async getNoAddressShopList() {
      const _params = {
        bizType: 3,
        channelType: 1,
        lat: "",
        lng: "",
        cityCode: "",
      };
      const res = await GET_DEFAULT_SHOPLIST(_params);
      this.shopList = res.data.data;
      res.data.data.forEach((item) => {
        display_report({
          display_name: "chooseshop_display",
          object_type: "cityshop_list",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: uni.getStorageSync("storage_info").userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            shop_id: item.shopId,
          },
        });
      });
    },
    getLocation() {
      let that = this;
      uni.getLocation({
        type: "gcj02", //设置type为gcj02
        isHighAccuracy: true,
        success: async function (res) {
          that.location = {
            ...that.location,
            lon: res.longitude,
            lat: res.latitude,
          };
          try {
            await that.searchLocation({
              lon: res.longitude,
              lat: res.latitude,
            });
          } catch (e) {
            console.log("获取经纬度成功，后续查询出错：", e);
          } finally {
            that.triggered = false;
          }
        },
        fail: (error) => {
          that.location = {
            ...that.location,
            lon: 120.21,
            lat: 30.25,
            isLocation: false,
          };
          console.log("获取定位失败了", error);
          try {
            that.searchLocation({
              lon: that.location.lon,
              lat: that.location.lat,
            });
          } catch (e) {
            console.log("获取经纬度失败，后续查询出错：", e);
          } finally {
            that.triggered = false;
          }
        },
      });
    },
    //根据经纬度查取地区
    async searchLocation(data) {
      const res = await searchUserLocation({ data });
      const { adcode, city, district, province } = res.data;
      const cityCode = adcode.slice(0, 4) + "00";
      const provinceCode = cityCode.slice(0, 2) + "0000";
      uni.setStorageSync("lon", data.lon);
      uni.setStorageSync("lat", data.lat);
      uni.setStorageSync("province", province);
      uni.setStorageSync("provinceCode", provinceCode);
      uni.setStorageSync("city", city);
      uni.setStorageSync("cityCode", cityCode);
      uni.setStorageSync("district", district);
      uni.setStorageSync("adcode", adcode);
      uni.setStorageSync("currentCity", city);
      uni.setStorageSync("selectedCityCode", cityCode);
    },
    // 获取门店详情
    async queryData(shopId) {
      try {
        const res = await NEW_FECTH_NEAR_SHOP_STORE({
          bizType: 3,
          lat: this.location.lat,
          lon: this.location.lon,
          shopId: this.shopId || "",
          storeId: this.storeId || "",
        });
        console.log("this.shopId-local", uni.getStorageSync("onlineCurMallId"));
        // const res = await GET_SHOP_DETAIL({
        //   shopId: this.shopId,
        //   // lat: this.location.lat,
        //   // lon: this.location.lon,
        // });
        console.log("res res GET_NEAREST_SHOP", res);
        // this.catIndex = 0;
        // this.rightIndex = 0;
        this.packageScrollTop = this.oldScrollTop;
        // 当调用此方法时，会先保存当前的滚动位置，并在下一个Vue的DOM更新周期开始时滚动到页面顶部
        this.$nextTick(() => {
          this.packageScrollTop = 0;
        });
        if (res.data.data) {
          this.shopInfo = res.data?.data;
          let cityCode = this.shopInfo.cityCode;
          if (cityCode.length === 4) {
            cityCode += "00";
          }
          // uni.setStorageSync("selectedCityCode", cityCode);
          this.selectedCityCode = cityCode;
          const { shopId, mallId } = this.shopInfo ?? { shopId: null };
          console.log("shopId==", shopId);
          //记缓存 防止切换地址切门店
          this.shopId = shopId;
          this.storeId = mallId;
          if (shopId) {
            console.log("dadaaa====<", shopId);
            // 查询门店类目
            const res1 = await GET_SHOP_CLASSIFY({
              shopId: shopId,
            });
            this.dataList = res1.data.data;
            this.showNoData = !this.dataList?.length;
          }
          // 查询是否 预约美洗  - 单拎出来，先不动这块冲突逻辑
          const shopInfo = res.data?.data;
          if (shopInfo) {
            try {
              // 请求判断 是否 开启预约美洗
              const checkRes = await CHECK_MX_RESERVATION({
                shopId: shopInfo.mallId,
                bizType: 1,
                channelType: 1,
              });
              console.log("check res: ", checkRes);
              // 门店 开通 预约美洗
              this.shopInfo = {
                ...shopInfo,
                mxReservationOpened: checkRes.data?.data ?? false,
              };
              // 当前是默认门店
              if (shopInfo.tag === 2) {
                // 开启定位或者选择地址, 返回默认门店, 则提示
                if (this.location.lat && this.location.lon) {
                  setTimeout(() => {
                    uni.showToast({
                      icon: "none",
                      title: "当前城市暂无宠胖胖门店",
                      duration: 3000,
                    });
                  }, 1000);
                }
                this.popupShow = true;
              }
            } catch (e) {
              console.log("check err:", e);
              // 缺省 没有开启 预约美洗
              this.shopInfo = {
                ...shopInfo,
                mxReservationOpened: false,
              };
            }
          }
        } else {
          //无门店信息情况，弹窗，弹层显示
          uni.showToast({
            icon: "none",
            title: "当前城市暂无宠胖胖门店",
            duration: 3000,
          });
          this.popupShow = true;
        }
        //TODO 暂时注释接口，获取门店内活体信息
        this.getInShopPets();
        // 当前门店的cityCode
        // await this.searchLocation({
        //   lon: this.shopInfo.longitude,
        //   lat: this.shopInfo.latitude,
        // })

        setTimeout(() => {
          this.getTypeNamePositions();
        }, 500);
      } catch (error) {
        uni.showToast({
          icon: "none",
          title: "当前城市暂无宠胖胖门店",
          duration: 1000,
        });
        this.popupShow = true;
        console.log("queryDataError", error);
      }
      if (!this.isMedicine && !uni.getStorageSync("set_location_toast")) {
        //解决toast一闪
        setTimeout(() => {
          uni.showToast({
            icon: "none",
            title: "请开启定位",
            duration: 3000,
          });
        }, 1000);
        // 只有第一次进入小程序，如果没有开启定位就提示，后面不提示了
        uni.setStorageSync("set_location_toast", true);
      }
    },
    // getPositioningCoordinates

    async queryGoods() {
      const res = await GET_RECOMMEND_GOODS({
        dbPageNo: this.dbPageNo,
        skipGoods: this.skipGoods,
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        shopId: uni.getStorageSync("onlineCurMallId"),
        type: 1,
      });
      console.log("GET_RECOMMEND_GOODS", res.data.data);
      this.dbPageNo = res.data.data.dbPageNo;
      this.skipGoods = res.data.data.skipGoods;
      const goodData = res.data.data.goodData ?? [];
      if (this.pageNo === 1) {
        this.goods = goodData;
      } else {
        this.goods.push(...goodData);
        if (goodData.length === 0) {
          this.pageNo -= 1;
        }
      }
    },
    handleSwitchShop() {
      this.popupShow = true;
    },
    getChangeShopInfo(item) {
      const { lat, lng: lon, shopId, storeId } = item;
      console.log("item===", item);
      // 保存切换门店的id，防止在开启定位的时候导致门店数据请求错误
      // uni.setStorageSync("onlineCurMallId", shopId);
      // 单独设置一个门店的shopid用于保存切换门店之后的id，再次进入是切换门店之后的id
      // uni.setStorageSync("serviceShopId", shopId);
      // uni.setStorageSync("serviceStoreId", storeId);
      // this.location = { lat, lon };
      this.shopId = shopId;
      this.storeId = storeId;
      this.queryData();
    },
    handleNavigateShop() {
      //#ifdef H5
      const { latitude, longitude, mallName, address } = this.shopInfo;
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/address/navigation/map?targetName=${mallName}&targetAddress=${address}&targetLat=${latitude}&targetLng=${longitude}`,
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.openLocation({
        latitude: this.shopInfo.latitude,
        longitude: this.shopInfo.longitude,
        name: this.shopInfo.mallName,
        address: this.shopInfo.address,
        success: function (res) {},
      });
      // //#endif
    },
    handleCallPhone() {
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: this.shopInfo.phone,
      });
    },
    handleSelectCat(cat, index) {
      if (this.catIndex === index) {
        return;
      }
      this.catIndex = index;
      this.rightIndex = index;
      let offset = this.typeNamePositions[index];
      this.packageScrollTop = offset;
      console.log("packageScrollTop", this.packageScrollTop);
      this.dataListIsScrolling = true;
      setTimeout(() => {
        this.dataListIsScrolling = false;
      }, 2000);
    },
    handleSelectSku(sku) {
      let shopId = this.shopInfo.shopId;
      console.log(
        "fdfsdfsd",
        `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${sku.itemId}&shopId=${shopId}`
      );
      uni.$u.debounce(() => {
        //#ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${sku.itemId}&shopId=${shopId}`,
        });
        //#endif

        //#ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/goodsServiceDetail/index?itemId=${sku.itemId}&skuId=${
            sku.skuId || ""
          }&shopId=${shopId}`,
        });
        //#endif
      }, 500);
    },
    handlePackageListScroll(e) {
      const { scrollTop } = e.detail;
      if (this.dataListIsScrolling) {
        return;
      }
      const lastIndex = this.typeNamePositions.length - 1;
      //判断右侧窗口顶边在哪两个分类名称之间，左侧分类导航高亮显示该索引项
      if (scrollTop >= this.typeNamePositions[lastIndex]) {
        this.catIndex = lastIndex;
      } else {
        for (var i = 0; i < lastIndex; i++) {
          if (
            scrollTop >= this.typeNamePositions[i] &&
            scrollTop <= this.typeNamePositions[i + 1]
          ) {
            this.catIndex = i;
            break;
          }
        }
      }
    },
    async handleRefresh() {
      if (this.triggered) {
        return;
      }
      this.triggered = true;
      if (this.shopInfo) {
        await this.queryData({
          areaCode: this.location.adcode,
          areaName: this.location.district,
          cityCode: this.location.cityCode,
          cityName: this.location.city,
        });
        this.triggered = false;
      } else {
        this.getLocation();
      }
    },

    async handleLoadMore() {
      if (this.shopInfo) {
        return;
      }
      if (this.triggered) {
        return;
      }
      this.pageNo += 1;
      this.triggered = true;
      try {
        await this.queryGoods();
        this.triggered = false;
      } catch (e) {
        console.log("商城上拉数据出错：", e);
        this.triggered = false;
        this.pageNo -= 1;
      }
    },
    handlePreviewShopImages(url) {
      uni.previewImage({
        urls: this.shopInfo.mallPictures,
        current: this.shopInfo.mallPictures[0],
      });
    },

    handleMxReservation() {
      // 处理登录
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      if (this.shopInfo) {
        action_report({
          action_name: "store_washing_click",
          module_name: "store",
          extend: {
            user_id: uni.getStorageSync("storage_info").userId,
          },
        });
        // 跳转预约，没有skuId
        uni.navigateTo({
          url: `/pagesB/submitReservation/index?shopId=${this.shopInfo.mallId}&merchantId=${this.shopInfo.merchantId}&actShopId=${this.shopInfo.shopId}`,
        });
      }
    },
    gotoAppDownload() {
      action_report({
        action_name: "store_live_click",
        module_name: "store",
        extend: {
          user_id: uni.getStorageSync("storage_info").userId,
        },
      });
      uni.navigateTo({ url: "/pagesE/guideApp/index?type=6" });
    },
    openSetting(value) {
      this.location = {
        lat: uni.getStorageSync("lat"),
        lon: uni.getStorageSync("lon"),
      };
      this.queryData();
      this.isMedicine = value;
    },
    selectShop(item) {
      this.shopId = item.shopId;
      this.storeId = item.storeId;
      console.log("item==", item);
      if (this.shopId && this.storeId) {
        this.queryData();
      }
    },
    async getInShopPets() {
      const _params = {
        pageSize: 4,
        pageNum: 1,
        shopId: this.shopInfo?.shopId,
        //更换门店详情查询接口，替换shoreid为mallid
        storeId: this.shopInfo?.mallId,
      };
      const { data } = await GET_SHOP_INLIST(_params);
      this.petsList = data.data || [];
    },
    rpx2px(rpx) {
      const systemInfo = uni.getSystemInfoSync();
      const screenWidth = systemInfo.screenWidth;
      const pxRatio = screenWidth / 750; // 750 是设计稿的宽度，可以根据实际情况修改
      return rpx * pxRatio;
    },
    //滚动监听
    scrollFun(e) {
      const { scrollTop } = e.detail;
      this.oldScrollTop = scrollTop;
      this.isHeaderShow = scrollTop > 30 ? true : false;
      //TODO 重新计算滚动位置
      if (this.dataListIsScrolling) {
        return;
      }
      const lastIndex = this.typeNamePositions.length - 1;
      //判断右侧窗口顶边在哪两个分类名称之间，左侧分类导航高亮显示该索引项
      if (scrollTop >= this.typeNamePositions[lastIndex]) {
        this.catIndex = lastIndex;
      } else {
        for (var i = 0; i < lastIndex; i++) {
          if (
            scrollTop >= this.typeNamePositions[i] &&
            scrollTop <= this.typeNamePositions[i + 1]
          ) {
            this.catIndex = i;
            break;
          }
        }
      }
    },
  },
  onShow() {
    // this.getInShopPets();
    this.setCustomTabbarIndex(3);
    this.isMedicine = uni.getStorageSync("medicine_openSetting_first");

    // #ifdef MP-WEIXIN
    if (uni.getStorageSync("adchannel")) {
      //从广告进入
      this.location = {
        lat: uni.getStorageSync("lat"),
        lon: uni.getStorageSync("lon"),
      };
      this.shopId = "";
      this.storeId = "";
      uni.setStorageSync("adchannel", false);
    } else {
      this.location = {
        lat: this.lat || uni.getStorageSync("lat"),
        lon: this.lon || uni.getStorageSync("lon"),
      };
    }
    // #endif
    this.checkLocation();
  },
  mounted(optiosn) {
    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight;
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight;
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight;
    this.navBarHeight = getApp().globalData.h5NavBarHeight;
    //#endif

    // console.log("dfdsfdsfs", "pageb", optiosn);
    // const windowInfo = uni.getWindowInfo();
    // this.safeAreaBottom = windowInfo.safeAreaInsets.bottom + 49;
    // this.checkLocation();
    // setTimeout(() => {
    //   this.getTypeNamePositions();
    // }, 500);
  },
  created() {},
  // #ifdef MP-WEIXIN
  onShareTimeline(res) {
    let pathUrl = this.shopId
      ? `/pages/service/index?shopId=${this.shopId}&storeId=${this.storeId}`
      : `/pages/service/index?type=empty`;
    return {
      title: this.shopInfo.mallName,
      path: pathUrl,
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/service/serviceshareimage.png",
      desc: this.shopInfo.mallName,
    };
  },
  onShareAppMessage(res) {
    let pathUrl = this.shopId
      ? `/pages/service/index?shopId=${this.shopId}&storeId=${this.storeId}`
      : `/pages/service/index?type=empty`;
    return {
      title: this.shopInfo.mallName,
      path: pathUrl,
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/service/serviceshareimage.png",
      desc: this.shopInfo.mallName,
    };
  },
  // #endif
  onLoad(options) {
    console.log("dfdsfdsfs", "pageb", options);
    const { shopId, lat, lon, cityCode, cityName, storeId, type } = options;
    if (shopId) {
      this.shopId = shopId;
    }
    if (storeId) {
      this.storeId = storeId;
    }
    if (type) {
      this.shareEmpty = type;
    }
    this.lat = lat;
    this.lon = lon;

    const windowInfo = uni.getWindowInfo();
    this.safeAreaBottom = windowInfo.safeAreaInsets.bottom + 49;

    //用于登陆完成返回原页面 last_route_params
    uni.removeStorageSync("last_route_params");
    let last_route_params = "";
    if (shopId) {
      last_route_params = `?shopId=${this.shopId}&storeId=${this.storeId}`;
    }
    if (type) {
      last_route_params = `?type=${this.shareEmpty}`;
    }

    uni.setStorageSync("last_route_params", last_route_params);
  },
};
</script>

<style scoped lang="scss">
.in-store-service-content {
  height: calc(100vh - 24px);
  // height: 100%;
  display: flex;
  flex-direction: column;
  // padding: 24rpx 28.85rpx 0;
  // background-color: red;

  .content-scroll-view {
    height: 100%;
    // height: calc(100vh - 24px);
  }

  .location-fail {
    height: 76rpx;
    font-size: 25rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16rpx;
    padding-right: 25rpx;

    .location-desc {
      color: #666;
      display: flex;
      align-items: center;
      font-size: 27rpx;
      font-weight: 400;
      color: #1f1f1f;
      line-height: 38rpx;

      image {
        width: 43rpx;
        height: 43rpx;
        margin-right: 15rpx;
      }
    }

    .location-button {
      width: 100rpx;
      height: 50rpx;
      background: #ffd41e;
      border-radius: 25rpx;

      font-size: 23rpx;
      font-weight: 500;
      color: #1f1f1f;
      line-height: 50rpx;
      text-align: center;
    }
  }

  .shop-info {
    display: flex;
    align-items: center;
    margin-top: 9.62rpx;
    margin-bottom: 28.85rpx;
    padding: 0 29rpx;
    // 新的头部展示图片信息
    .shop-img-box {
      position: relative;
      margin-right: 23.08rpx;
      width: 173rpx;
      height: 173rpx;
      image {
        width: 173rpx;
        height: 173rpx;
        border-radius: 14rpx;
      }
      .shop-img-num {
        position: absolute;
        top: 7.69rpx;
        right: 7.69rpx;
        width: 54rpx;
        // height: 35rpx;
        border-radius: 30rpx;
        background: rgb(0 0 0 / 40%);
        font-size: 21rpx;
        color: #ffffff;
        text-align: center;
        line-height: 35rpx;
      }
      .shop-change-btn-wrap {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 173rpx;
        height: 86rpx;
      }
      .shop-change-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 173rpx;
        line-height: 46rpx;
        background: rgb(0 0 0 / 40%);
        border-radius: 0 0 14rpx 14rpx;
        font-size: 23rpx;
        color: #ffffff;
        image {
          width: 26.92rpx;
          height: 26.92rpx;
        }
      }
    }
    .shop-info-box {
      // flex: 1;
      width: calc(100% - 173rpx - 23.08rpx);
      .shop-name {
        width: 496rpx;
        margin-bottom: 18rpx;
        font-weight: 600;
        font-size: 35rpx;
        color: #1f1f1f;
        line-height: 48rpx;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .shop-specific {
        display: flex;
        // align-items: center;
      }
      .shop-name-address {
        width: 342.31rpx;
        margin-right: 30.77rpx;
      }
      .addresscopy {
        font-size: 23rpx;
        display: inline-block;
        margin-left: 10rpx;
      }
      .shop-address {
        margin-bottom: 3.85rpx;
        max-height: 65.38rpx;
        font-weight: 400;
        font-size: 23rpx;
        color: #1f1f1f;
        line-height: 33rpx;
        text-align: left;
        // display: -webkit-box;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
        word-break: break-all;
        position: relative;
        // &::after {
        //   content: "";
        //   background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/service/copyicon.png")
        //     no-repeat top left / 100% 100%;
        //   position: absolute;
        //   bottom: 5rpx;
        //   right: 0;
        //   width: 23rpx;
        //   height: 23rpx;
        //   display: inline-block;
        //   vertical-align: baseline;
        // }
      }
      .shop-distance {
        display: flex;
        font-weight: 400;
        font-size: 23rpx;
        color: #666666;
        line-height: 33rpx;
        text-align: left;
        .nearest-tag {
          font-size: 23rpx;
          font-weight: 400;
          color: #fe2442;
          line-height: 33rpx;
          margin-left: 12rpx;
        }
      }
      .shop-phone-naviagation {
        display: flex;
        flex: 1;
      }
    }

    .shop-banners {
      width: 100vw;
      height: 189rpx;
      white-space: nowrap;

      .shop-banner {
        width: 308rpx;
        height: 189rpx;
        display: inline-block;
        background-color: gray;
        border-radius: 16rpx;
        overflow: hidden;
      }

      .shop-banner + .shop-banner {
        margin-left: 12rpx;
      }

      .shop-banner:first-child {
        margin-left: 29rpx;
      }

      .shop-banner:last-child {
        margin-right: 29rpx;
      }
    }

    .shop-name {
      // color: #1f1f1f;
      // font-size: 38rpx;
      // font-weight: bold;
      // margin-left: 29rpx;
      // margin-top: 29rpx;
      // margin-bottom: 19rpx;
      // height: 54rpx;
      // display: flex;
      // align-items: center;
      .changepart {
        width: 100rpx;
        height: 38rpx;
        background: #f3f3f4;
        border-radius: 19rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 15rpx;
        flex-shrink: 0;
        image {
          width: 27rpx;
          height: 27rpx;
          margin-left: 4rpx;
          flex-shrink: 0;
        }
        .changetext {
          color: #1f1f1f;
          font-size: 23rpx;
          line-height: 38rpx;
        }
      }
      text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 29rpx - 108rpx);
      }
    }

    .shop-quick-mx {
      margin: 36rpx 29rpx 10rpx;
      height: 85rpx;
      border-radius: 42rpx;
      border: 2rpx solid #e6e6e6;
      display: flex;
      justify-content: center;
      align-items: center;

      .quick-ico {
        height: 46rpx;
        width: 46rpx;
        margin-right: 15rpx;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_mx_btn_ico.png);
      }

      .quick-text {
        font-size: 29rpx;
        font-weight: bold;
        color: #1f1f1f;
        line-height: 85rpx;
      }
    }
    .bottom-wrap {
      display: flex;
      margin-left: 29rpx;
      margin-right: 29rpx;
    }
    .shop-bottom {
      display: flex;
      flex-direction: column;
      margin-right: 29rpx;
      width: calc(100% - 47rpx - 39rpx - 47rpx - 29rpx);

      // .shop-address {
      //   margin-top: 8rpx;
      //   color: #1f1f1f;
      //   font-size: 24rpx;
      //   white-space: nowrap;
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   height: 33rpx;
      // }

      // .shop-distance {
      //   margin-top: 4rpx;
      //   font-size: 24rpx;
      //   color: #666;
      //   white-space: nowrap;
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   height: 33rpx;

      //   text {
      //     color: #ff5b05;
      //     font-size: 24rpx;
      //     margin-left: 12rpx;
      //   }
      // }
    }

    .shop-additional-item {
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      align-items: center;
      .shop-item-back {
        width: 47rpx;
        height: 47rpx;
        border-radius: 23.5rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f7f8fc;
        image {
          width: 24rpx;
          height: 24rpx;
        }
      }
      text {
        color: #999;
        font-size: 20rpx;
        margin-top: 2px;
      }
    }

    .shop-additional-item + .shop-additional-item {
      margin-left: 39rpx;
    }
  }

  // 洗美 直播样式
  .beauty-live-box {
    display: flex;
    margin-bottom: 29rpx;
    padding: 0 29rpx;
    height: 94.23rpx;
    > view {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 338.46rpx;
      height: 94.23rpx;
      background: #f7f8fc;
      border-radius: 15rpx;
      padding: 0 23.08rpx 0 19.23rpx;
      &:first-of-type {
        margin-right: 15.38rpx;
      }
    }
    .beauty-box-left,
    .live-box-left {
      display: flex;
      align-items: center;
    }
    .img-inco {
      width: 54rpx;
      height: 56rpx;
      margin-right: 13rpx;
    }
    .arrow-inco {
      width: 23rpx;
      height: 23rpx;
    }
    .text {
      margin-right: 90.38rpx;
      font-weight: 600;
      font-size: 29rpx;
      color: #1f1f1f;
      line-height: 40rpx;
      text-align: left;
    }
    .live-box-complete {
      width: 100%;
      justify-content: space-between;
      &:first-of-type {
        margin-right: 0;
      }
    }
  }

  .inshop-pets {
    width: 100vw;
    height: 306rpx;
    padding: 0 29rpx 29rpx;
    background-color: #ffffff;
    .inshop-header {
      display: flex;
      align-items: center;
      .inshop-title {
        font-size: 31rpx;
        color: #1f1f1f;
        font-weight: bold;
        line-height: 42rpx;
      }
      .showall {
        margin-left: auto;
        display: flex;
        align-items: center;
        font-size: 25rpx;
        color: #1f1f1f;
        line-height: 1;
        .allrightarrow {
          width: 23rpx;
          height: 25rpx;
          margin-left: 4rpx;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png);
        }
      }
    }
    .pets-list {
      width: 100%;
      white-space: nowrap;
      margin-top: 19rpx;
      .pets-item-last {
        margin-right: 0 !important;
      }
      .pets-item {
        width: 167rpx;
        margin-right: 10rpx; // 9rpx;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        image {
          width: 167rpx;
          height: 167rpx;
          border-radius: 15rpx;
        }
        .pet-desc {
          font-size: 23rpx;
          color: #1f1f1f;
          margin-top: 15rpx;
          .splitline {
            margin-left: 5rpx;
            margin-right: 5rpx;
            display: inline-block;
          }
        }
      }
    }
  }
  .main-part {
    display: flex;
  }
  .cat-goods-container-height {
    height: calc(100% - 340rpx - 394rpx - 12rpx) !important;
  }
  .cat-scroll-list {
    background-color: #f7f8fc;
    width: 120rpx;
    height: 100%;
    // height: 800rpx;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    // z-index: 20;

    .cat-item {
      height: 110rpx;
      display: flex;
      align-items: center;
      color: #1f1f1f;
      font-size: 25rpx;
      text-align: left;

      .cat-item-name {
        margin-left: 29rpx;
        width: calc(100% - 36rpx);
        z-index: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .cat-item-back {
        background-color: white;
        left: 0;
        top: -55rpx;
        width: 120rpx;
        height: 110rpx;
        z-index: 0;
        position: absolute;
      }

      .cat-item-back-top {
        @extend .cat-item-back;
        background-color: #f7f8fc;
        border-radius: 0 0 12rpx 0;
      }

      .cat-item-back-bottom {
        @extend .cat-item-back;
        background-color: #f7f8fc;
        border-radius: 0 12rpx 0 0;
      }

      .cat-item-back-all {
        @extend .cat-item-back;
        background-color: #f7f8fc;
      }

      .cat-item-indicator {
        // #ifdef MP-WEIXIN
        background-color: #ffd41e;
        // #endif
        // #ifdef H5
        background-color: #fe2442;
        // #endif

        width: 12rpx;
        height: 25rpx;
        position: absolute;
        left: 0;
        top: -12.5rpx;
      }
    }

    .cat-item-selected {
      background-color: white;
    }
  }
  .cat-goods-container {
    width: calc(100vw - 119rpx);
    margin-left: 19rpx;
    // margin-right: auto;
    height: calc(100% - 390rpx - 12rpx);
    // background-color: #999;
    // display: flex;

    .package-scroll-list {
      // height: 100%;
      // overflow-y: scroll;
      background-color: white;
      padding-left: 20rpx;
      padding-right: 29rpx;
      .fill-wrap {
        font-size: 23rpx;
        color: #999999;
        line-height: 33rpx;
        padding-top: 54rpx;
        text-align: center;
      }
      .package-item {
        display: flex;
        flex-direction: column;
        padding-top: 33rpx;

        .package-name {
          font-size: 25rpx;
          color: #999;
          height: 35rpx;
        }

        .package-sku-item {
          display: flex;
          margin-top: 29rpx;

          .sku-item-picture {
            width: 162rpx;
            height: 162rpx;
            flex-shrink: 0;
            border-radius: 16rpx;
          }

          .sku-item-right {
            display: flex;
            margin-left: 20rpx;
            flex-direction: column;
            justify-content: space-between;
            // width: calc(100% - 162rpx - 20rpx);
            flex: 1;
            .sku-item-top {
              display: flex;
              flex-direction: column;

              .sku-item-title {
                color: #1f1f1f;
                font-size: 29rpx;
                font-weight: 500;
                line-height: 37rpx;
                width: 100%;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .sku-item-desc {
                margin-top: 4rpx;
                color: #999;
                width: 100%;
                font-size: 25rpx;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
            .sku-item-bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .sku-item-buy {
                width: 91rpx;
                height: 54rpx;
                border-radius: 27rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 25rpx;
                font-weight: 500;
                // #ifdef MP-WEIXIN
                background-color: #fe2442;
                color: #fff;
                // #endif
                // #ifdef H5
                background-color: #fe2442;
                color: #ffffff;
                // #endif
              }
            }
          }
        }
      }
    }
  }

  .no-shop {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 39rpx 54rpx 39rpx;
    text {
      color: #1f1f1f;
      font-size: 43rpx;
      font-weight: 500;
    }
    .select-city {
      width: 100%;
      height: 85rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 42.5rpx;
      font-size: 31rpx;
      color: #1f1f1f;
      font-weight: 500;
      margin-top: 31rpx;
      background-color: #ffd41e;
    }
  }

  .no-shop-recommend-goods {
    padding: 0 16rpx;
  }
}

.scroll-view_H {
  width: 100vw;
  height: 50px;
  border: 1px solid #000;
  white-space: nowrap;
  .content {
    width: auto;
    height: 50px;
  }
  #demo1 {
    display: inline-block;
    background-color: red;
    width: 400px;
    height: 100%;
  }
  #demo2 {
    display: inline-block;
    background-color: green;
    width: 400px;
    height: 100%;
  }
  #demo3 {
    display: inline-block;
    background-color: gainsboro;
    width: 400px;
    height: 100%;
  }
}
.no-data-content {
  // margin-top: 115rpx
  margin-top: 86rpx;
  padding-bottom: 350rpx;
}
</style>
