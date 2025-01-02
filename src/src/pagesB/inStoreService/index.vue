<template>
  <view class="in-store-service-content">
    <!--  @refresherrefresh="handleRefresh" -->
    <scroll-view
      :refresher-triggered="triggered"
      class="content-scroll-view"
      :refresher-enabled="false"
      scroll-y
      @scrolltolower="handleLoadMore"
    >
      <view v-if="!!shopInfo.shopId" style="height: 100%; width: 100%">
        <view class="shop-info">
          <scroll-view class="shop-banners" scroll-x="true">
            <view
              class="shop-banner"
              v-for="picture in shopInfo.mallPictures"
              :key="picture"
            >
              <image
                :src="picture"
                style="width: 100%; height: 100%"
                mode="aspectFill"
                @click="handlePreviewShopImages(picture)"
              />
            </view>
          </scroll-view>

          <view class="shop-name" @click="handleSwitchShop">
            <text>{{ shopInfo.mallName }}</text>
            <view class="changepart">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/changeicon.png"
              ></image>
              <view class="changetext">切换</view>
            </view>
            <!-- <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_switch.png"
            /> -->
          </view>

          <view class="bottom-wrap">
            <view class="shop-bottom">
              <view
                class="shop-address"
                @tap="$u.debounce(handleNavigateShop, 500)"
              >
                {{ shopInfo.address }}
              </view>
              <view class="shop-distance">
                {{ distance }}
              </view>
            </view>
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
          <!-- 快速预约美洗 -->
          <!-- <view
            v-if="shopInfo.mxReservationOpened"
            class="shop-quick-mx"
            @click="handleMxReservation"
          >
            <image class="quick-ico"></image>
            <view class="quick-text">快速预约美洗</view>
          </view> -->
        </view>
        <template v-if="petsList && petsList.length">
          <view style="height: 12rpx; background-color: #f7f8fc"></view>
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

        <view style="height: 12rpx; background-color: #f7f8fc"></view>
        <view
          v-if="dataList.length > 0"
          class="cat-goods-container"
          :class="{
            'cat-goods-container-height': hasPets,
          }"
        >
          <scroll-view
            scroll-y
            class="cat-scroll-list"
            :scroll-into-view="dataList[catIndex].code"
          >
            <view
              v-for="(item, index) in dataList"
              class="cat-item"
              :key="item.code"
              :id="item.code"
              @click="handleSelectCat(item)"
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
          <!-- 商品 -->
          <scroll-view
            scroll-y
            class="package-scroll-list"
            :scroll-into-view="dataList[rightIndex].code"
            scroll-with-animation="true"
            @scroll="handlePackageListScroll"
          >
            <!--    :scroll-top="packageScrollTop" -->
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
            <view style="height: 202rpx; background-color: white"></view>
          </scroll-view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { searchUserLocation } from "@/api/base";
import { CHECK_MX_RESERVATION } from "@/api/mall";
import {
  GET_NEAREST_SHOP,
  GET_RECOMMEND_GOODS,
  GET_SHOP_CLASSIFY,
  GET_SHOP_INLIST,
  // GET_NEAREST_SHOP,
} from "@/api/mallv2";
import { addCart } from "@/api/cart";
import { getAuthLocation } from "@/utils/location";
import { renderKM } from "@/utils";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import GoodsList from "@/components/goodsList/index.vue";
import { mapState } from "vuex";

export default {
  components: {
    GoodsPrice,
    GoodsList,
  },
  props: {
    opensetting: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      shopId: "",
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
      rightIndex: 0,
      canScrollContent: true,
      canScrollPackage: false,
      packageScrollTop: 0,
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
    };
  },

  computed: {
    ...mapState(["userInfo", "selectedAddress"]),
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
  },
  watch: {
    dataList(newVal, oldVal) {
      let res = [];
      let lastPackOffset = 0;
      for (let i = 0; i < newVal.length; i++) {
        const pack = newVal[i];
        let packHeight = 78;
        // if (this.petsList.length) {
        //   packHeight += 29 + 70;
        // } else {
        //   packHeight += 29 + 45;
        // }
        // // packHeight += 29 + 35;
        // packHeight += pack.skuInfoList.length * (16 + 162);
        let skuInfoListLength = pack.skuInfoList.length;
        packHeight += skuInfoListLength * 162 + 29 * (skuInfoListLength - 1);
        if (lastPackOffset < 1) {
          // 列表上间距
          packHeight += 7;
        }
        const range = {
          startOffset: lastPackOffset,
          endOffset: packHeight + lastPackOffset,
        };
        res.push(range);
        lastPackOffset = range.endOffset;
      }
      this.dataOffsetList = res.map((e) => {
        return {
          startOffset: this.rpx2px(e.startOffset),
          endOffset: this.rpx2px(e.endOffset),
        };
      });
      console.log(
        "🚀 ~ this.dataOffsetList=res.map ~ this.dataOffsetList:",
        this.dataOffsetList
      );
    },
  },
  methods: {
    getTypeNamePositions() {
      const query = uni.createSelectorQuery().in(this);
      this.typeNamePositions = [];
      query
        .selectAll(".packagename")
        .boundingClientRect((data) => {
          console.log("data===", data);
          if (data.length) {
            let firstTop = data[0].top;
            data.forEach((item) => {
              this.typeNamePositions.push(item.top - firstTop);
            });
          }
        })
        .exec();
    },
    toAll() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/livedBody/index?shopId=${this.shopId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesE/livedBody/index?shopId=${this.shopId}&transparentTopBar=1`,
      });
      // #endif
    },
    goLiveDetail(item) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${item.itemId}&skuId=${
          item.skuId || ""
        }&shopId=${this.shopId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${
          item.itemId
        }&shopId=${this.shopId}&skuId=${item.skuId || ""}`,
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
        lat = lat ? (lat == "0.0" ? "" : lat) : ""; //兼容ios空值
        lon = lon ? (lon == "0.0" ? "" : lon) : "";
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
      this.queryData();
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
    async queryData() {
      // 查询最近门店信息
      const res = await GET_NEAREST_SHOP({
        areaCode: "123",
        areaName: "123",
        cityCode: "123",
        cityName: "123",
        lat: this.location.lat,
        lon: this.location.lon,
        shopId: this.shopId,
      });
      console.log("this.shopId", this.shopId);
      console.log("this.shopId-local", uni.getStorageSync("onlineCurMallId"));
      // const res = await GET_SHOP_DETAIL({
      //   shopId: this.shopId,
      //   // lat: this.location.lat,
      //   // lon: this.location.lon,
      // });
      console.log("res res GET_NEAREST_SHOP", res.data.data);
      this.catIndex = 0;
      this.rightIndex = 0;
      this.packageScrollTop = 0;
      this.shopInfo = res.data.data;
      this.getInShopPets();
      // 当前门店的cityCode
      let cityCode = this.shopInfo.cityCode;
      if (cityCode.length === 4) {
        cityCode += "00";
      }
      // uni.setStorageSync("selectedCityCode", cityCode);
      this.selectedCityCode = cityCode;

      // await this.searchLocation({
      //   lon: this.shopInfo.longitude,
      //   lat: this.shopInfo.latitude,
      // });
      const { shopId } = this.shopInfo ?? { shopId: null };
      if (shopId) {
        console.log("dadaaa====<", shopId);
        // 查询门店类目
        const res1 = await GET_SHOP_CLASSIFY({
          shopId: shopId,
        });
        this.dataList = res1.data.data;
      }
      // 查询是否 预约美洗  - 单拎出来，先不动这块冲突逻辑
      const shopInfo = res.data?.data;
      if (shopInfo) {
        try {
          // 请求判断 是否 开启预约美洗
          const checkRes = await CHECK_MX_RESERVATION({
            shopId: shopInfo.shopId,
            bizType: 1,
            channelType: 1,
          });
          console.log("check res: ", checkRes);
          // 门店 开通 预约美洗
          this.shopInfo = {
            ...shopInfo,
            mxReservationOpened: checkRes.data?.data ?? false,
          };
        } catch (e) {
          console.log("check err:", e);
          // 缺省 没有开启 预约美洗
          this.shopInfo = {
            ...shopInfo,
            mxReservationOpened: false,
          };
        }
      }
      setTimeout(() => {
        this.getTypeNamePositions();
      }, 500);
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
      const that = this;
      const { cityName, provinceName, shopId } = this.shopInfo;
      const { lat, lon } = this.location;
      let name = cityName === "市辖区" ? provinceName : cityName;
      uni.navigateTo({
        url: `/pagesD/selectStore/index?form=storeDetail&cityName=${name}&shopId=${shopId}&selectedCityCode=${
          this.selectedCityCode
        }&lat=${lat || ""}&lon=${lon || ""}`,
        events: {
          resultEvent: async function (e) {
            console.log("选择店铺信息===", e);
            const shopInfo = e.data;
            that.shopInfo = shopInfo;
            that.shopId = shopInfo.shopId;
            await that.queryData({
              areaCode: that.location.adcode,
              areaName: that.location.district,
              cityCode: that.location.cityCode,
              cityName: that.location.city,
            });
          },
        },
      });
    },
    handleNavigateShop() {
      // uni.openLocation({
      //   latitude: this.shopInfo.latitude,
      //   longitude: this.shopInfo.longitude,
      //   name: this.shopInfo.mallName,
      //   address: this.shopInfo.address,
      //   success: function (res) {},
      // });
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
    handleSelectCat(cat) {
      console.log("cat cat", cat);
      const index = this.dataList.findIndex((e) => e.name === cat.name);
      console.log("this.catIndex", this.catIndex, index);
      if (this.catIndex === index) {
        return;
      }
      this.catIndex = index;
      this.rightIndex = index;
      if (index === 0) {
        this.packageScrollTop = 0;
        return;
      }
      let offset = this.dataOffsetList[index];
      this.packageScrollTop = offset.startOffset;
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
      console.log("data===scrollTop", scrollTop, this.typeNamePositions);
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

      // let index = -1;
      // for (let i = 0; i < this.dataOffsetList.length; i++) {
      //   const offset = this.dataOffsetList[i];
      //   if (scrollTop >= offset.startOffset && scrollTop < offset.endOffset) {
      //     index = i;
      //     break;
      //   }
      // }
      // if (index > -1) {
      //   this.catIndex = index;
      // }
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
        current: url,
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
        // 跳转预约，没有skuId
        uni.navigateTo({
          url: `/pagesB/submitReservation/index?shopId=${this.shopInfo.mallId}&merchantId=${this.shopInfo.merchantId}&actShopId=${this.shopInfo.shopId}`,
        });
      }
    },
    async getInShopPets() {
      const _params = {
        pageSize: 4,
        pageNum: 1,
        shopId: this.shopId,
        storeId: this.shopInfo?.storeId,
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
  },
  onShow() {
    // this.getInShopPets();
  },
  mounted(optiosn) {
    // console.log("dfdsfdsfs", "pageb", optiosn);
    // const windowInfo = uni.getWindowInfo();
    // this.safeAreaBottom = windowInfo.safeAreaInsets.bottom + 49;
    // this.checkLocation();
    // setTimeout(() => {
    //   this.getTypeNamePositions();
    // }, 500);
  },
  created() {},
  onLoad(options) {
    console.log("dfdsfdsfs", "pageb", options);
    const { shopId, lat, lon } = options;
    if (shopId) {
      this.shopId = shopId;
    }
    // #ifdef MP-WEIXIN
    this.location = {
      lat,
      lon,
    };
    // #endif
    const windowInfo = uni.getWindowInfo();
    this.safeAreaBottom = windowInfo.safeAreaInsets.bottom + 49;
    this.checkLocation();
  },
};
</script>

<style scoped lang="scss">
.in-store-service-content {
  height: calc(100vh - 24px);
  display: flex;
  flex-direction: column;
  padding-top: 24rpx;

  .content-scroll-view {
    height: calc(100%);
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
    flex-direction: column;
    padding-bottom: 33rpx;

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
      color: #1f1f1f;
      font-size: 38rpx;
      font-weight: bold;
      margin-left: 29rpx;
      margin-top: 29rpx;
      margin-bottom: 19rpx;
      height: 54rpx;
      display: flex;
      align-items: center;
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

      .shop-address {
        margin-top: 8rpx;
        color: #1f1f1f;
        font-size: 24rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 33rpx;
      }

      .shop-distance {
        margin-top: 4rpx;
        font-size: 24rpx;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 33rpx;

        text {
          color: #ff5b05;
          font-size: 24rpx;
          margin-left: 12rpx;
        }
      }
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
        background-color: hsla(0, 0%, 77%, 0.32);
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
  .inshop-pets {
    width: 100vw;
    height: 334rpx;
    padding: 29rpx;
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

  .cat-goods-container-height {
    height: calc(100% - 340rpx - 394rpx - 12rpx) !important;
  }
  .cat-goods-container {
    width: 100%;
    height: calc(100% - 390rpx - 12rpx);
    // background-color: #999;
    display: flex;

    .cat-scroll-list {
      background-color: #f7f8fc;
      width: 120rpx;
      height: calc(100%);
      flex-shrink: 0;

      .cat-item {
        height: 110rpx;
        display: flex;
        align-items: center;
        color: #1f1f1f;
        font-size: 25rpx;
        text-align: left;

        .cat-item-name {
          margin-left: 24rpx;
          width: calc(100% - 36rpx);
          z-index: 100;
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

    .package-scroll-list {
      height: 100%;
      background-color: white;
      padding-left: 20rpx;
      padding-right: 29rpx;

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
            width: calc(100% - 162rpx - 20rpx);

            .sku-item-top {
              display: flex;
              flex-direction: column;

              .sku-item-title {
                color: #1f1f1f;
                font-size: 29rpx;
                font-weight: 500;
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
                font-size: 24rpx;
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
                background-color: #ffd41e;
                color: #1f1f1f;
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
</style>
