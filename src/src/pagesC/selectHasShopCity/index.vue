<template>
  <view class="select-has-shop-city-content">
    <view class="subtitle">仅显示当前已开通门店的城市</view>
    <view
      v-for="city in cities"
      class="city-row"
      @click="handleSelectCity(city)"
    >
      <view class="city-content">{{ city.cityName }}</view>
      <view class="row-line"></view>
    </view>
  </view>
</template>

<script>
import { GET_HAS_SHOP_CITIES } from "@/api/mallv2";

export default {
  data() {
    return {
      cities: [],
    };
  },
  methods: {
    async queryData() {
      const params = {
        bizType: 3,
        channelType: 1,
      };
      const res = await GET_HAS_SHOP_CITIES(params);

      this.cities = res.data.data;
    },
    handleSelectCity(city) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("onSelectCity", city);
      uni.navigateBack();
    },
  },
  mounted() {
    this.queryData();
  },
};
</script>

<style lang="scss">
.select-has-shop-city-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .subtitle {
    font-size: 27rpx;
    color: #999;
    text-align: center;
  }
  .city-row {
    width: 100%;
    height: 124rpx;
    padding: 0 29rpx;
    display: flex;
    flex-direction: column;
  }
  .city-content {
    display: flex;
    align-items: center;
    flex: 1;
    color: #1f1f1f;
    font-size: 29rpx;
    padding: 0 29rpx;
  }
  .row-line {
    width: 100%;
    height: 1px;
    background-color: #efefef;
  }
}
</style>
