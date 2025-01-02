<template>
  <view>
    <view v-if="storeList.length > 0" class="desc">
      <scroll-view
        @scrolltolower="scrolltolower"
        lower-threshold="1300"
        class="storeBox"
        scroll-y="true"
      >
        <view
          v-for="(item, index) in storeList"
          :key="item.id"
          class="itemStore"
        >
          <view class="storLeft">
            <view class="name">{{ item.name }}</view>
            <view class="address">{{ item.address }}</view>
            <view class="distance">
              <view>距离你{{ renderKM(item.distance) }} </view>
              <view v-if="index == 0" class="other">最近</view>
            </view>
          </view>
          <view class="storMiddle"></view>
          <view class="storRight">
            <view
              class="shop-additional-item"
              @tap="$u.debounce(handleNavigateShop(item), 500)"
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
              @tap="$u.debounce(handleCallPhone(item), 500)"
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
      </scroll-view>
    </view>
    <view v-else>
      <view class="no-box">
        <view class="img">
          <image
            class="image"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/noData.png"
            mode="scaleToFill"
          />
        </view>
        <view class="name"> 您附近暂无宠胖胖门店 </view>
      </view>
    </view>
  </view>
</template>

<script>
import { renderKM } from "@/utils";
import { getStorePage } from "../api/aiConsultation";
export default {
  data() {
    return {
      storeList: [], // 列表数据
      pageNo: 1, // 当前页数
      hasMore: true, // 是否有更多数据
      local: {},
      option: {},
      cityCode: "",
      lon: "",
      lat: "",
    };
  },
  onLoad(option) {
    console.log(option, 999992222);
    this.cityCode = option.cityCode;
    this.lon = option.lon;
    this.lat = option.lat;
    this.getStore();
    display_report({
      display_name: "IntelligentconsultationIM_NearbyStores_display",
      object_type: "ai_consultation",
      extend: {
        source:
          uni.getStorageSync("umt_extend").umt_code ||
          uni.getStorageSync("shareType"),
      },
    });
  },
  created() {
    // #ifdef H5
    if (
      this.$dsBridge.call(
        "getPositioningCoordinates",
        "getPositioningCoordinates"
      )
    ) {
      let localJson = this.$dsBridge.call(
        "getPositioningCoordinates",
        "getPositioningCoordinates"
      );

      this.local = localJson ? JSON.parse(localJson) : "";
      console.log(this.local, "local-----=====");
    }
    // #endif
  },

  methods: {
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
    renderKM,
    // 下滑触发
    async scrolltolower() {
      // console.log("下滑");
      if (this.hasMore) {
        this.getStore();
      }
    },
    // 获取附近门店列表
    async getStore() {
      let params = {
        pageSize: 10, // 每页条数
        pageNo: this.pageNo,
        cityCode: this.cityCode ? this.cityCode : "",
        lat: this.lat ? this.lat : "",
        lon: this.lon ? this.lon : "",
        // #ifdef MP-WEIXIN
        // cityCode: this.cityCode,
        // lat: this.lat,
        // lon: this.lon,
        // #endif
        // // #ifdef H5
        // cityCode: this.local.cityCode ? this.local.cityCode.slice(0, 4) : "",
        // lat: this.local.lat,
        // lon: this.local.lon,
        // // #endif
      };
      console.log(params, "params");
      const res = await getStorePage(params);
      if (this.storeList.length == 0) {
        this.storeList = res.data.data;
      } else {
        res.data.data.forEach((element) => {
          this.storeList.push(element);
        });
      }
      this.pageNo++;
      if (this.storeList.length >= res.data.totalCount) {
        this.hasMore = false;
      }
    },
    // 导航
    handleNavigateShop(item) {
      //#ifdef H5
      const { lat, lon, name, address } = item;
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/address/navigation/map?targetName=${name}&targetAddress=${address}&targetLat=${lat}&targetLng=${lon}`,
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.openLocation({
        latitude: item.lat,
        longitude: item.lon,
        name: item.name,
        address: item.address,
        success: function (res) {},
      });
      // //#endif
    },
    // 拨打电话
    handleCallPhone(item) {
      uni.makePhoneCall({
        phoneNumber: item.phone,
      });
    },

    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
