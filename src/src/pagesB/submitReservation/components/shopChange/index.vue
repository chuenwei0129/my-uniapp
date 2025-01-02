<template>
  <!-- 底部弹窗 -->
  <view class="customer-u-popup">
    <u-popup
      :show="show"
      mode="bottom"
      :custom-style="{ 'border-radius': '38rpx 38rpx 0rpx 0rpx' }"
    >
      <view class="shop-popup-header">
        <text>切换门店</text>
        <view class="shop-popup-close" @click="close">
          <image
            style="width: 31rpx; height: 31rpx"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/close_icon.png"
          ></image>
        </view>
      </view>
      <view class="shop-popup-content">
        <view class="left-nav">
          <view
            class="cat-item"
            v-for="(item, index) in leftCityList"
            :key="index"
            @click="cutCity(item, index)"
            :class="{ 'active-city': cityIndex === index }"
          >
            <view style="position: relative; width: 0; height: 0">
              <view class="cat-item-back"></view>
              <view
                v-if="cityIndex === index + 1"
                class="cat-item-back-top"
              ></view>
              <view
                v-if="cityIndex === index - 1"
                class="cat-item-back-bottom"
              ></view>
              <view
                v-if="
                  cityIndex !== index &&
                  cityIndex !== index - 1 &&
                  cityIndex !== index + 1
                "
                class="cat-item-back-all"
              ></view>
              <!-- <view v-if="catIndex === index" class="cat-item-indicator" /> -->
            </view>
            <text class="cat-item-name">
              {{ item.cityName }}
            </text>
          </view>
        </view>
        <view class="right-shop-show">
          <view class="city">{{ city }}</view>
          <view
            class="shop-info"
            v-for="(item, index) in rightShopList"
            :key="index"
            @click="getChangeShopInfo(item)"
          >
            <image
              :class="[
                item.storeId === shopInfo.shopId ? 'address-area-border' : '',
              ]"
              style="width: 582.69rpx; height: 162rpx; margin-bottom: 19rpx"
              :src="item.shopImage"
              mode="aspectFill"
            ></image>
            <!-- <view class="shop-img" :style="{'background-image': `url(${item.shopImage})` }"></view> -->
            <view class="title">{{ item.shopName }}</view>
            <view class="address">{{ item.address }}</view>
            <view class="distance" v-if="isMedicine">
              距离你{{ renderKM(item.distance) }}
              <view v-if="0 == index && item.distance" class="nearest-tag">{{
                "最近"
              }}</view>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {
  GET_STORE_LIST,
  GET_HAS_SHOP_CITIES,
  NEW_GET_STORE_LIST,
  NEW_GET_HAS_SHOP_CITIES,
} from "@/api/mallv2";
import { GET_SHOP_CITY_LIST, GET_NEARBY_SHOP_LIST } from "@/api/reservation";
import { renderKM } from "@/utils";
export default {
  name: "shopChange",
  data() {
    return {
      leftCityList: [],
      rightShopList: [],
      newRightShopObj: {},
      // isMedicine: false,
      city: "",
      cityIndex: 0,
      cityCode: "",
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      require: true,
    },
    shopInfo: {
      type: Object,
      default: {},
    },
    location: {
      type: Object,
      default: {},
    },
    // isDefaultData: {
    // 	type: Boolean
    // },
    isMedicine: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // this.isMedicine = uni.getStorageSync("medicine_openSetting_first")
  },
  watch: {
    show: {
      handler(newVal) {
        if (newVal) {
          this.handleSwitchShop();
        }
      },
    },
  },
  methods: {
    renderKM,
    close() {
      this.cityIndex = 0;
      this.$emit("update:show", false);
    },
    async handleSwitchShop() {
      // await this.getStoreList();
      await this.getCityList();
    },
    // 获取门店列表
    async getStoreList(params) {
      try {
        // const res = await GET_STORE_LIST(params);
        // const res = await NEW_GET_STORE_LIST(params);
        const res = await GET_NEARBY_SHOP_LIST(params);
        this.rightShopList = res.data.data.data || {};
        console.log(this.rightShopList, res, params);
        // if(!this.rightShopList.length) {
        // 	uni.showToast({
        // 		icon: "none",
        // 		title: '当前城市暂无宠胖胖门店',
        // 		duration: 1000,
        // 	});
        // }
      } catch (err) {
        console.log(err, "--getStoreList-err");
        this.rightShopList = [];
      }
    },
    // 获取城市列表
    async getCityList() {
      try {
        const _params = {
          bizType: 1,
        };

        // const res = await GET_HAS_SHOP_CITIES(params)
        // const res = await NEW_GET_HAS_SHOP_CITIES(params);
        const res = await GET_SHOP_CITY_LIST(_params);
        console.log(res, "---res");
        const result = res.data.data;
        // if(this.isDefaultData) {
        // 	const index = result.findIndex(item => item.cityCode === '3201')
        // 	const obj = result.splice(index, 1)[0]
        // 	result.unshift(obj)
        // 	// [result[0], result[index]] = [result[index], result[0]]
        // }
        this.leftCityList = result.map((item) => {
          item.cityName = item.cityName.replace("市", "");
          return item;
        });
        this.setCityProperty(this.leftCityList[0]);
        const latitude = uni.getStorageSync("lat");
        const longitude = uni.getStorageSync("lon");
        const params = {
          cityCode: this.cityCode,
          lat: latitude,
          limit: 0,
          lng: longitude,
          pageNum: 0,
          pageSize: 20,
          shopName: "",
          skip: 0,
          bizType: 1,
        };

        // #ifdef H5
        params.lat = this.location.lat;
        params.lng = this.location.lon;
        // #endif

        this.getStoreList(params);
        // this.rightShopList =
        //   this.newRightShopObj[this.leftCityList[0].cityCode];
      } catch (err) {
        console.log(err, "--getCityList-err");
        this.leftCityList = [];
      }
    },
    getChangeShopInfo(item) {
      this.$emit("getChangeShopInfo", item);
      this.close();
    },
    cutCity(item, index) {
      console.log("切换城市", index);
      this.setCityProperty(item);
      // this.getStoreList()
      //   this.rightShopList = this.newRightShopObj[item.cityCode];
      let latitude = uni.getStorageSync("lat");
      let longitude = uni.getStorageSync("lon");
      let params = {
        cityCode: this.cityCode,
        lat: latitude,
        limit: 0,
        lng: longitude,
        pageNum: 0,
        pageSize: 20,
        shopName: "",
        skip: 0,
      };
      // #ifdef H5
      params.lat = this.location.lat;
      params.lng = this.location.lon;
      // #endif
      this.getStoreList(params);
      this.cityIndex = index;
    },
    setCityProperty(item) {
      const { cityName, cityCode } = item;
      this.city = cityName;
      this.cityCode = cityCode;
    },
  },
};
</script>

<style lang="scss" scoped>
.shop-popup-header {
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 35rpx;
  color: #1f1f1f;
  position: relative;
  line-height: 115rpx;
  background: #ffffff;
  text-align: center;
  border-bottom: 2rpx solid #f8f8f8;
  border-radius: 38rpx 38rpx 0rpx 0rpx;

  .shop-popup-close {
    position: absolute;
    top: 28.85rpx;
    right: 28.85rpx;
    width: 50rpx;
    height: 50rpx;
    background: #ecedf1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.shop-popup-content {
  display: flex;
  height: 1002rpx;
  background-color: #f7f8fc;
  .left-nav {
    overflow-y: auto;
    width: 119rpx;
    .city-name {
      line-height: 110rpx;
      text-align: center;
      background: #f7f8fc;
      // border-radius: 0rpx 12rpx 0rpx 0rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #1f1f1f;
    }
    .active-city {
      font-weight: 600;
      background-color: #fff;
    }
    .cat-item {
      height: 110rpx;
      display: flex;
      align-items: center;
      color: #1f1f1f;
      font-size: 25rpx;
      text-align: left;

      .cat-item-name {
        margin-left: 29rpx;
        width: calc(100% - 29rpx);
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
  }
  .right-shop-show {
    flex: 1;
    padding-left: 19rpx;
    padding-right: 29rpx;
    overflow-y: auto;
    padding-top: 38rpx;
    background-color: #fff;
    .city {
      margin-bottom: 15rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #999999;
      line-height: 35rpx;
      text-align: left;
    }
    .shop-info {
      margin-bottom: 38rpx;
      image {
        border-radius: 15rpx;
      }
    }
    .address-area-border {
      border-radius: 15rpx;
      border: 4rpx solid #fe2442;
    }
    .nearest-tag {
      font-size: 23rpx;
      font-weight: 400;
      color: #fe2442;
      line-height: 33rpx;
      margin-left: 12rpx;
    }
    .shop-img {
      width: 583rpx;
      height: 162rpx;
      margin-bottom: 19rpx;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .title {
      margin-bottom: 10rpx;
      width: 100%;
      font-weight: 500;
      font-size: 35rpx;
      color: #1f1f1f;
      line-height: 40rpx;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .address {
      font-weight: 400;
      font-size: 23rpx;
      color: #1f1f1f;
      line-height: 33rpx;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .distance {
      display: flex;
      margin-right: 10rpx;
      font-weight: 400;
      font-size: 23rpx;
      color: #666666;
      line-height: 33rpx;
      text-align: left;
    }
  }
}
</style>
