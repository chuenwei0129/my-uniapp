<template>
  <view class="page-wrapper">
    <view class="city-wrapper" @click="handleSelectCity">
      <view class="city-name">{{ locationInfo.cityName }}</view>
      <view class="indicator"></view>
    </view>
    <scroll-view
      class="store-wrapper"
      scroll-y
      :scroll-top="scrollTop"
      :refresher-enabled="false"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
      v-if="list.length"
    >
      <block v-for="(item, index) in list" :key="item.shopId">
        <view @click="handleItemClick(item)">
          <store-item
            :selected="item.shopId === locationInfo.mallId"
            :item="item"
          ></store-item>
        </view>
      </block>
    </scroll-view>
    <view class="no-data-wrapper" v-if="!list.length && isCompleted">
      <NoData
        noDataText="暂无数据"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
    </view>
  </view>
</template>

<script>
import StoreItem from "./components/storeItem/index.vue";
import { GET_STORE_LIST } from "@/api/mallv2";
import NoData from "@/components/noData/index.vue";

export default {
  components: {
    NoData,
    StoreItem,
  },

  data() {
    return {
      scrollTop: 0,
      isCompleted: false,
      locationInfo: {
        cityCode: "",
        cityName: "",
        lat: 0,
        lon: 0,
        mallId: "",
      },
      list: [],
    };
  },

  onLoad(options) {
    this.locationInfo.mallId = options?.shopId || "";
    this.locationInfo.cityName = options?.cityName || "杭州市";

    if (options.form === "storeDetail") {
      const { selectedCityCode, lat, lon } = options;
      this.locationInfo.cityCode = selectedCityCode;
      this.locationInfo.lat = lat || "30.25";
      this.locationInfo.lon = lon || "120.21";
    } else {
      this.locationInfo.cityCode =
        uni.getStorageSync("selectedCityCode") || "330100";
      this.locationInfo.lat = uni.getStorageSync("lat") || "30.25";
      this.locationInfo.lon = uni.getStorageSync("lon") || "120.21";
    }
    this.getStoreList();
  },

  methods: {
    onRefresh() {
      console.log(`on refresh`);
      this.getStoreList();
    },

    onLoadMore() {
      console.log(`on load more`);
    },

    async getStoreList() {
      console.log("get store list");
      // const params = this.locationInfo;
      const params = {
        bizType: 3,
        channelType: 1,
        cityCode: this.locationInfo.cityCode.substring(0, 4),
        lat: this.locationInfo.lat,
        lng: this.locationInfo.lon,
      };
      try {
        this.isCompleted = false;
        const res = await GET_STORE_LIST(params);
        console.log("res: ", res.data);
        this.list = res?.data?.data.data ?? [];
        this.isCompleted = true;
      } catch (err) {
        console.log(err);
        this.isCompleted = true;
      }
    },

    /**
     * 处理选择城市
     */
    handleSelectCity() {
      uni.navigateTo({
        url: "/pagesC/selectHasShopCity/index",
        events: {
          onSelectCity: (city) => {
            const locationInfo = this.locationInfo;
            this.locationInfo = {
              ...locationInfo,
              cityName: city.cityName,
              cityCode: city.cityCode,
            };
            this.onRefresh();
          },
        },
      });
    },

    handleItemClick(item) {
      console.log("select store: ", item);
      this.mallId = item.shopId;
      // 选择
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("resultEvent", {
        data: item,
      });
      uni.navigateBack();
    },
  },
};
</script>

<style>
page {
  background-color: #f7f8fc;
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss" scoped>
.page-wrapper {
  height: 100vh;

  .city-wrapper {
    width: 100%;
    height: 85rpx;
    font-size: 29rpx;
    font-weight: bold;
    color: #666666;
    line-height: 40rpx;
    background-color: white;
    padding-left: 38rpx;
    padding-right: 38rpx;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .city-name {
      font-size: 29rpx;
      font-weight: bold;
      color: #666666;
    }

    .indicator {
      width: 19rpx;
      height: 19rpx;
      margin-left: 4rpx;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/select_store_city_arrow_bottom.png);
    }
  }

  .store-wrapper {
    width: 100%;
    height: calc(100vh - 85rpx);
    background-color: #f7f8fc;
    box-sizing: border-box;
    padding-left: 15rpx;
    padding-right: 15rpx;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 24rpx);
    padding-bottom: calc(env(safe-area-inset-bottom + 24rpx));
  }

  .no-data-wrapper {
    height: calc(100% - 85rpx);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
