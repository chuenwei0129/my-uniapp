<template>
  <scroll-view scroll-y class="home-scrollwrapper" :scroll-top="scrollTop">
    <view class="home-wrapper">
      <view class="notice-msg" v-if="showNotice"
        >温馨提示: 服务价格仅供参考，实际以线下门店收费为准<view
          class="iconfont icon-closeMark notice-close"
          @click="closeNotice"
        ></view>
      </view>
      <TopShop :shopInfo="shopInfo" :closet="shopInfo.tag === 3" />
      <view class="list-content">
        <view class="tab-wrapper">
          <u-tabs
            :list="tabList"
            lineColor="#2DCE80"
            :activeStyle="{
              color: '#333333',
              fontWeight: 'bold',
              fontSize: '31rpx',
            }"
            :inactiveStyle="{
              color: '#999999',
              fontSize: '27rpx',
            }"
            itemStyle="padding-left: 30px; padding-right: 30px; height: 43px;"
            @click="handleChooseTab"
          ></u-tabs>
        </view>

        <view class="listWrapper">
          <template v-if="serviceList.length">
            <view
              class="list-item"
              v-for="(item, index) in serviceList"
              :key="index"
              @click="goOrder(item)"
            >
              <view class="itemimage">
                <image :src="item.pic" />
              </view>
              <view class="info">
                <view class="servicename">{{ item.skuName || "" }}</view>
                <view class="servicedesc" v-if="item.desc">{{
                  item.desc || ""
                }}</view>
                <view class="price" v-if="item.price"
                  >¥<view class="num">{{ item.price || "" }}</view>
                </view>
                <view class="orderbtn">预约</view>
              </view>
            </view>
          </template>

          <template v-else>
            <view class="empty">
              <NoData
                noDataText="暂无可预约服务"
                img="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/empty-order.png"
              ></NoData>
            </view>
          </template>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import TopShop from "./components/topShop";
import { mapState, mapMutations } from "vuex";
import { getLatestShop, getGoodsList, shopDetail } from "@/api/reservation";
import NoData from "@/components/noData/index";
import { action_report, display_report } from "@/utils/track";
const module_name = "store";
export default {
  //...wxShareMethod(),
  components: { TopShop, NoData },
  props: {},
  data() {
    return {
      showNotice: true,
      scrollTop: 0,
      shopInfo: {},
      tabList: [
        {
          name: "预约美洗",
          orderTab: 1,
        },
      ],
      serviceList: [],
      ifCloset: false,
    };
  },
  computed: {
    ...mapState(["allShopList", "selectedShopId"]),
  },
  watch: {},
  created() {},
  mounted() {},
  async onShow() {
    //根据选中门店id查询信息
    const latitude = uni.getStorageSync("lat");
    const longitude = uni.getStorageSync("lon");
    const shopId = uni.getStorageSync("selectShopInfo")?.shopId;
    console.log("shopId", shopId);
    if (shopId) {
      //上一级带入
      const _params = {
        currentLat: latitude,
        currentLng: longitude,
        shopId: shopId,
      };
      //查询相关门店信息
      const { data } = await shopDetail(_params);
      this.shopInfo = data.data;
    } else {
      //默认门店
      this.getShop();
    }
    const res = await getGoodsList({
      shopId: this.shopInfo.shopId,
      pageNum: 0,
      pageSize: 500,
      merchantId: this.shopInfo.merchantId,
    });
    this.serviceList = res.data.data.data;
    display_report({
      display_name: "appointment_list_show",
      object_type: module_name,
      extend: {
        shopId: this.shopInfo.shopId,
        shopName: this.shopInfo.shopName,
      },
    });
  },
  methods: {
    ...mapMutations(["setAllShopList", "setSelectShopId"]),
    closeNotice() {
      this.showNotice = false;
    },
    handleChooseTab(item) {
      console.log("item", item);
    },
    scrolltolower() {},
    goOrder(item) {
      action_report({
        action_name: "appointment_list_servicecard_clk",
        module_name: module_name,
        extend: {
          shopId: this.shopInfo.shopId,
          skuId: item.skuId,
        },
      });
      uni.navigateTo({
        url: `/pagesB/submitReservation/index?skuId=${item.skuId}&shopId=${this.shopInfo.shopId}&merchantId=${this.shopInfo.merchantId}&actShopId=${this.shopInfo.shopId}`,
      });
    },
    async getShop() {
      const latitude = uni.getStorageSync("lat");
      const longitude = uni.getStorageSync("lon");
      const cityCode = uni.getStorageSync("cityCode");
      const _params = {
        cityCode: cityCode,
        // 手机当前定位的经纬度
        lng: longitude,
        lat: latitude,
      };
      const { data } = await getLatestShop(_params);
      this.shopInfo = data.data;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
