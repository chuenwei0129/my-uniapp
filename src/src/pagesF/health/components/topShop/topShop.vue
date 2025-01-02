<template>
  <view class="top-shop">
    <view class="shop-info">
      <view class="address-info">
        <view class="address">{{ shop.shopName }}</view>
        <view v-if="shop.distance" class="distance">
          距离你{{
            Number(shop.distance) > 1000
              ? (Number(shop.distance) / 1000).toFixed(1) + "km"
              : shop.distance + "m"
          }}
        </view>
      </view>
      <view class="switch-shop" @click="changeShop()">
        <image
          class="switch-ico"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/switch-shop.png"
          mode="aspectFit"
          @click="previewShopImages"
        />
        <view class="switch-text">切换门店</view>
      </view>
    </view>
    <image
      class="cover"
      :src="shop.shopImages[0]"
      mode="aspectFill"
      @click="previewShopImages()"
    />
    <view class="bottom-action">
      <view class="action-base" @click="callPhone()">
        <image
          style="width: 44rpx; height: 44rpx"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/reservation/iphone.png"
          mode="aspectFit"
        >
        </image>
        <view style="margin-left: 2rpx">联系</view>
      </view>
      <view class="action-base" style="margin-left: 60rpx" @click="navMap()">
        <image
          style="width: 44rpx; height: 44rpx"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/reservation/Navigation.png"
          mode="aspectFit"
        >
        </image>
        <view style="margin-left: 4rpx">导航</view>
      </view>
      <view class="space"></view>
      <view class="reservation" @click="toReservation()">预约服务</view>
    </view>
  </view>
</template>

<script>
import { action_report, display_report } from "@/utils/track";
const module_name = "store";
export default {
  props: {
    shop: Object,
    closet: Boolean,
  },

  data() {
    return {};
  },

  mounted() {
    // 展示时，
    display_report({
      display_name: "consultation_main_store_show",
      object_type: module_name,
      extend: {
        shopId: this.shop.shopId,
        shopName: this.shop.shopName,
      },
    });
    uni.setStorageSync("selectShopInfo", {
      shopId: this.shop.shopId,
      // closet 是否最近
      closet: this.closet,
    });
  },

  methods: {
    // 切换门店
    changeShop() {
      action_report({
        action_name: "consultation_main_store_change_clk",
        module_name: module_name,
      });

      uni.navigateTo({
        url: `/pagesB/changeReservationShop/index?shopId=${this.shop.shopId}&cityCode=${this.shop.cityCode}`,
        success: (res) => {
          console.log("res: ", res);
        },
        fail: (e) => {
          console.log("error: ", e);
        },
      });
    },

    callPhone() {
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: this.shop.shopPhone,
      });

      action_report({
        action_name: "consultation_main_store_phone_clk",
        module_name: module_name,
        extend: {
          shopId: this.shop.shopId,
          shopName: this.shop.shopName,
        },
      });
    },
    navMap() {
      // 导航地图
      action_report({
        action_name: "consultation_main_store_navigation_clk",
        module_name: module_name,
        extend: {
          shopId: this.shop.shopId,
          shopName: this.shop.shopName,
        },
      });

      uni.openLocation({
        latitude: this.shop.lat,
        longitude: this.shop.lng,
        name: this.shop.shopName,
        address: this.shop.address,
        success: function (res) {},
      });
    },
    toReservation() {
      action_report({
        action_name: "consultation_main_store_clk",
        module_name: module_name,
        extend: {
          shopId: this.shop.shopId,
          shopName: this.shop.shopName,
        },
      });
      // 预约服务
      uni.navigateTo({
        url: `/pagesB/reservationHomePage/index`,
      });
    },
    previewShopImages() {
      uni.previewImage({
        urls: this.shop.shopImages,
      });
    },
  },
};
</script>

<style lang="scss">
@import "./topShop.scss";
</style>
