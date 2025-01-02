<script>
import IconButton from "@/pagesC/components/iconButton/index.vue";
import { renderKM } from "@/utils";

export default {
  name: "applicableStoreItem",
  methods: {
    renderKM,
    navClickHandle(item) {
      uni.$u.throttle(() => {
        // #ifdef MP-WEIXIN
        uni.openLocation({
          latitude: item.latitude,
          longitude: item.longitude,
          name: item.mallName,
          address: item.fullAddress,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("showNavigationAlert", {
          dname: item.mallName,
          sname: "我的位置",
          dlat: item.latitude,
          dlon: item.longitude,
        });
        // #endif
      }, 500);
    },
    phoneClickHandle(item) {
      uni.$u.throttle(() => {
        uni.makePhoneCall({ phoneNumber: item.phone });
      }, 500);
    },
  },
  components: { IconButton },
  props: {
    item: Object,
    default: () => {},
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="top">
      <view class="left">
        <image mode="aspectFill" :src="item.mainMallPicture" />
      </view>
      <view class="right">
        <view class="title">{{ item.mallName }}</view>
        <view class="address">{{ item.fullAddress }}</view>
        <view class="distance-wrapper"
          ><text class="distance">距离你{{ renderKM(item.distance) }}</text
          ><text v-if="item.nearestFlag" class="tag">最近</text></view
        >
      </view>
    </view>
    <view class="bottom">
      <view class="left">
        <IconButton
          title="导航"
          iconSize="62"
          color="#F7F8FC"
          borderRadius="12"
          position="left"
          fontSize="24"
          :iconSize="41"
          url="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/store_nav_icon.png"
          @onClick="navClickHandle(item)"
        />
      </view>
      <view :style="{ width: '12rpx' }"></view>
      <view class="right">
        <IconButton
          title="电话"
          color="#F7F8FC"
          borderRadius="12"
          position="left"
          titleColor="#666666"
          fontSize="24"
          :iconSize="41"
          url="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/store_phone_icon.png"
          @onClick="phoneClickHandle(item)"
        />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-wrapper {
  margin: 20rpx 25rpx 32rpx;
  background: #ffffff;
  border-radius: 15rpx;
  padding: 23rpx;

  .top {
    display: flex;
    padding-bottom: 25rpx;
    .left {
      width: 162rpx;
      height: 162rpx;

      image {
        width: 100%;
        height: 100%;
        background-color: #00b87d;
        border-radius: 12rpx;
      }
    }

    .right {
      padding: 0 20rpx;

      .title {
        font-size: 35rpx;
        font-weight: 500;
        color: #1f1f1f;
        line-height: 37rpx;
      }

      .address {
        font-size: 23rpx;
        font-weight: 400;
        color: #333333;
        line-height: 33rpx;
        margin-top: 9rpx;
      }

      .distance-wrapper {
        margin-top: 9rpx;
        font-size: 23rpx;
        font-weight: 400;
        color: #666666;
        line-height: 33rpx;

        .tag {
          margin-left: 12rpx;
          color: #ff5b05;
        }
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 64rpx;
    padding: 0 25rpx;
    .left {
      flex: 1;
      height: 100%;
    }

    .right {
      flex: 1;
      height: 100%;
    }
  }
}
</style>
