<template>
  <view class="card">
    <view class="fl-row-bet-start">
      <view class="fl-column-left">
        <view class="title">{{ item.shopName }}</view>
        <view class="time des">{{ "营业时间：" + item.serviceTime }}</view>
        <view class="address des">{{ `门店地址：${fullAddress}` }}</view>
      </view>

      <view class="u-flex-row-reverse fl-row-leftNowrap">
        <IconButton
          position="top"
          title="导航"
          titleColor="#999999"
          fontSize="25"
          iconSize="46"
          url="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/order_detail_location.png"
          :style="{ marginRight: '14rpx' }"
          @onClick="routerMap"
        />
        <IconButton
          position="top"
          title="电话"
          titleColor="#999999"
          fontSize="25"
          iconSize="46"
          url="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/order_detail_phone.png"
          @onClick="routerCall(item.shopPhone)"
          :style="{ marginLeft: '14rpx' }"
        />
      </view>
    </view>

    <view class="line" v-if="false"></view>

    <view class="items-center fl-row-center" @click="moreShop" v-if="false">
      <view class="more">更多适用门店</view>
    </view>
  </view>
</template>

<script>
import IconButton from "@/pagesC/components/iconButton/index.vue";

export default {
  components: { IconButton },
  props: {
    item: {
      type: Object,
    },
  },

  data() {
    return {};
  },

  computed: {
    fullAddress() {
      const info = this.item.shopAddressInfo;
      if (info.address.includes(info.city)) {
        return `${info.address}${info.addressName ?? ""}${
          info.houseNumber ?? ""
        }`;
      } else {
        return `${info.province ?? ""}${info.city ?? ""}${info.county ?? ""}${
          info.address ?? ""
        }${info.addressName ?? ""}${info.houseNumber ?? ""}`;
      }
    },
  },

  methods: {
    routerCall(num) {
      console.log("routerCall");
      uni.makePhoneCall({
        phoneNumber: num,
      });
    },

    routerMap() {
      console.log("routerMap");
      uni.openLocation({
        latitude: this.item.shopAddressInfo.lat,
        longitude: this.item.shopAddressInfo.lon,
        name: this.item.shopName,
        address: this.item.shopAddressInfo.address,
      });
    },

    moreShop() {
      console.log("更多店铺");
      this.$emit("changeFitShop");
    },
  },
};
</script>

<style lang="scss">
.card {
  .line {
    height: 2rpx;
    background-color: #efefef;
  }

  .title {
    font-size: 31rpx;
    font-weight: bold;
    color: #1f1f1f;
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 显示省略号 */
    max-width: 505rpx;
  }
  .time {
    padding: 12rpx 0 4rpx 0;
  }
  .address {
    padding-bottom: 25rpx;
  }

  .des {
    font-size: 29rpx;
    font-weight: 400;
    color: #666666;
    max-width: 505rpx;
  }
  .more {
    font-size: 29rpx;
    font-weight: 400;
    color: #ff5b05;
    padding-top: 25rpx;
  }
}
</style>
