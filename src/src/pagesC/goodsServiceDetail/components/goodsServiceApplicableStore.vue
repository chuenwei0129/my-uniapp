<script>
import IconButton from "@/pagesC/components/iconButton/index.vue";

export default {
  name: "goodsServiceApplicableStore",
  components: { IconButton },
  props: {
    storeInfo: {
      type: Object,
      default: () => {},
    },
    itemId: {
      type: String,
      default: "",
    },
    shopId: {
      type: String,
      default: "",
    },
    storelist: {
      type: Array,
      default: [],
    },
  },
  computed: {
    mallName() {
      return this.storeInfo?.mallName || "";
    },

    fullAddress() {
      return this.storeInfo?.fullAddress || "";
    },
    serviceTime() {
      return this.storeInfo?.serviceTime || "";
    },
    phone() {
      return this.storeInfo?.phone || "";
    },
    lat() {
      return this.storeInfo?.latitude || 0;
    },
    lon() {
      return this.storeInfo?.longitude || 0;
    },
  },
  methods: {
    onMoreStoreClickHandle() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/applicableStores/index?itemId=${this.itemId}&shopId=${this.shopId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/applicableStores/index?itemId=${this.itemId}&shopId=${this.shopId}`,
      });
      // #endif
    },
    navClickHandle() {
      console.log(
        "获取位置：：：：：：",
        this.lat,
        this.lon,
        this.mallName,
        this.fullAddress
      );
      uni.$u.throttle(() => {
        // #ifdef MP-WEIXIN
        uni.openLocation({
          latitude: this.lat,
          longitude: this.lon,
          name: this.mallName,
          address: this.fullAddress,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("showNavigationAlert", {
          dname: this.mallName,
          sname: "我的位置",
          dlat: this.lat,
          dlon: this.lon,
        });
        // #endif
      }, 500);
    },

    phoneClickHandle() {
      uni.$u.throttle(() => {
        uni.makePhoneCall({ phoneNumber: this.phone });
      }, 500);
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="store-wrapper">
      <view class="store-title">
        <view class="title">适用门店</view>
        <view
          class="more"
          v-if="storelist.length > 1"
          @click="onMoreStoreClickHandle"
        >
          <view class="text">更多适用门店</view>
          <i class="iconfont icon-bearingRight"></i>
        </view>
      </view>
      <view class="store">
        <view class="left">
          <!-- <view class="title">适用门店</view> -->
          <view class="item shop-name">{{ mallName }}</view>
          <view class="item">营业时间：{{ serviceTime }}</view>
          <view class="item">地址：{{ fullAddress }}</view>
        </view>
        <view class="right">
          <IconButton
            position="top"
            title="导航"
            titleColor="#999999"
            :fontSize="19"
            :iconSize="46"
            :interval="1"
            url="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/map_nav_icon.png"
            @onClick="navClickHandle"
          />
          <view :style="{ width: `38rpx` }"></view>
          <IconButton
            position="top"
            title="电话"
            titleColor="#999999"
            :fontSize="19"
            :iconSize="46"
            :interval="1"
            url="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/phone_icon.png"
            @onClick="phoneClickHandle"
          />
        </view>
      </view>
      <!-- <template v-if="storelist.length > 1">
        <view :style="{ height: '15rpx' }"></view>
        <view class="more-store" @click="onMoreStoreClickHandle">
          <text>更多适用门店</text></view
        >
      </template> -->
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "@/utils/fn.scss";
.page-wrapper {
  background-color: #fff;
  border-radius: 16rpx;
  margin: 15.38rpx 16rpx 0;

  .store-wrapper {
    .store-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 23.08rpx 15.38rpx 23.08rpx 23.08rpx;
      .title {
        font-weight: 500;
        @include textfclaw(31rpx, #1f1f1f, left, 42rpx);
      }
      .more {
        display: flex;
        align-items: center;
        @include textfclaw(23rpx, #999999, right, 33rpx);
      }
      .iconfont {
        color: #999999;
      }
    }
    .store {
      display: flex;
      padding: 0 23.08rpx 23.08rpx;
      .left {
        flex: 1;

        .title {
          padding: 25rpx 0 8rpx 0;
          font-size: 25rpx;
          font-weight: 400;
          color: #1f1f1f;
          line-height: 35rpx;
        }

        .item {
          padding: 2rpx 0;
          font-size: 23rpx;
          font-weight: 400;
          color: #999999;
          line-height: 35rpx;
        }

        .item.shop-name {
          font-size: 25rpx;
          font-weight: 500;
          color: #1f1f1f;
        }
      }

      .right {
        padding: 0 23rpx;
        display: flex;
        justify-content: space-between;
        height: 75rpx;
      }
    }
  }

  .more-store {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 29rpx;
    font-weight: 400;
    color: #ff5b05;
    line-height: 40rpx;
    padding: 25rpx 25px 0;
    border-top: #efefef solid 1px;
  }
}
</style>
