<template>
  <view class="dad-wrapper">
    <view class="drop-wrapper">
      <DaDropdownVue2
        ref="DaDropdownRef"
        :dropdownMenu.sync="dropdownMenuList"
        themeColor="#2DCE80"
        textColor="#666666"
        :duration="300"
        :fixedTop="true"
        :menuActiveText="false"
        :syncDataFn="tagList"
        @reset="handleReset"
        @confirm="handleConfirm"
        @close="handleClose"
        @open="handleOpen"
      >
        <template v-slot:slotTitle>
          <!-- <view class="bg"> -->
          <view class="slotTitle">当前已开通门店的城市</view>
          <!-- </view> -->
        </template>
      </DaDropdownVue2>
    </view>
    <scroll-view
      class="doc-list-wrapper"
      :scroll-y="!modalopen"
      @scrolltolower="scrolltolower"
      :scroll-top="scrollTop"
      @scroll="handleScroll"
    >
      <view class="list-bg">
        <view
          class="item-bg"
          v-for="(item, index) in shopList"
          :key="index"
          @click="checkShop(item, index)"
        >
          <image
            class="img"
            :src="item.shopImages[0]"
            mode="aspectFill"
            @click="toShopDetail(item)"
          />
          <view class="info">
            <view class="name">{{ item.shopName }}</view>
            <view class="address">{{ item.address }}</view>
            <view class="last">
              <view class="left" v-if="item.distance">
                <view class="icon1 iconfont icon-address"></view>
                <view class="distance">{{ showDistance(item.distance) }}</view>
                <view class="btn" v-if="0 == index">
                  <view class="text">距离最近</view>
                </view>
              </view>
              <view v-if="!item.distance" style="min-width: 100rpx"></view>
              <view class="right">
                <view class="gou" v-if="shopId == item.shopId"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import DaDropdownVue2 from "../components/da-dropdown-vue2/index.vue";
import { GET_SHOP_CITY_LIST, GET_NEARBY_SHOP_LIST } from "@/api/reservation";
export default {
  //...wxShareMethod(),
  components: { DaDropdownVue2 },
  props: {},
  data() {
    return {
      dropdownMenuList: [
        {
          title: "",
          type: "cell",
          prop: "god1",
          // showAll: true,
          showIcon: true,
          value: "", // 默认内容2
          options: [
            // { label: "杭州", value: "杭州" },
            // { label: "上海", value: "上海" },
            // { label: "北京", value: "北京" },
            // { label: "深圳", value: "深圳" },
          ],
        },
      ],
      shopCityList: {},
      shopList: [],
      shopId: "",
      cityCode: "",
      modalopen: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  onLoad(options) {
    console.log("changeReservationShop options ", options);
    this.shopId = options.shopId;
    this.cityCode = options.cityCode;
  },
  async onShow() {
    this.getShopCityList();

    const latitude = uni.getStorageSync("lat");
    const longitude = uni.getStorageSync("lon");

    let params = {
      cityCode: this.cityCode || "3301",
      lat: latitude,
      limit: 0,
      lng: longitude,
      pageNum: 0,
      pageSize: 20,
      shopName: "",
      skip: 0,
    };
    this.getShopList(params);
  },
  methods: {
    handleReset() {},
    handleConfirm(data) {
      console.log("handleConfirm - ", this.shopCityList);
      let curData = this.shopCityList.filter(
        (item) => item.cityCode == data["god1"]
      );
      this.dropdownMenuList[0].title = curData[0].cityName;
      this.dropdownMenuList[0].value = curData[0].cityCode;
      //TODO 根据城市请求门店列表
      const latitude = uni.getStorageSync("lat");
      const longitude = uni.getStorageSync("lon");
      let params = {
        cityCode: data["god1"],
        lat: latitude,
        limit: 0,
        lng: longitude,
        pageNum: 0,
        pageSize: 20,
        shopName: "",
        skip: 0,
      };
      this.getShopList(params);
    },
    handleClose() {
      console.log("handleOpen =====1 ");
      this.modalopen = false;
    },
    handleOpen() {
      console.log("handleOpen =====0 ");
      this.modalopen = true;
    },
    scrolltolower() {},
    scrollTop() {},
    handleScroll() {},

    async getShopCityList() {
      try {
        const res = await GET_SHOP_CITY_LIST();

        this.shopCityList = res.data.data;
        console.log("this.shopCityList ", this.shopCityList);

        this.dropdownMenuList[0].title = this.shopCityList[0].cityName;
        this.dropdownMenuList[0].value = this.shopCityList[0].cityName;

        this.dropdownMenuList[0].options = [];
        for (let index = 0; index < this.shopCityList.length; index++) {
          const c = this.shopCityList[index];
          this.dropdownMenuList[0].options.push({
            label: c.cityName,
            value: c.cityCode,
          });

          if (c.cityCode == this.cityCode) {
            this.dropdownMenuList[0].value = c.cityCode;
            this.dropdownMenuList[0].title = c.cityName;
          }
        }

        console.log("this.dropdownMenuList ", this.dropdownMenuList);
      } catch (e) {
        console.error("获取查询城市列表失败", e);
      }
    },

    async getShopList(params) {
      try {
        const res = await GET_NEARBY_SHOP_LIST(params);

        this.shopList = res.data.data.data;
        console.log("this.shopList ", this.shopList);
      } catch (e) {
        console.error("获取门店列表失败", e);
      }
    },

    toShopDetail(info) {
      // uni.navigateTo({
      //   url: `/pagesB/shopDetails/index?shopId=${
      //     info.shopId
      //   }&currentLat=${0}&currentLng=${0}`,
      // });
    },

    showDistance(distance) {
      return `距离你${
        Number(distance) > 1000
          ? (Number(distance) / 1000).toFixed(2) + "km"
          : distance + "m"
      }`;
    },

    checkShop(shopInfo, index) {
      console.log("checkShop ", shopInfo);
      uni.setStorageSync("selectShopInfo", {
        shopId: shopInfo.storeId,
        // closet 是否最近
        closet: index == 0,
      });
      // 事件返回结果
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.emit("resultEvent", {
          data: shopInfo,
        });
      }
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
