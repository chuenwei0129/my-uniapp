<template>
  <view>
    <NavBar
      titleColor="#000"
      :showBackBtn="showBackBtn"
      :whiteBack="false"
      navColor="#ffffff"
    />
    <!-- #ifdef H5 -->
    <slot name="inapptips"></slot>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <Location :isShowLoaction="false" @openSetting="openSetting" />
    <!-- #endif -->
    <scroll-view
      scroll-y
      class="default-citylist"
      :style="{ height: `calc(100vh - ${navHeight} - 40px - 24px)` }"
    >
      <view class="title">点击进入宠胖胖门店逛逛吧</view>
      <view
        v-for="(item, index) in shopList"
        :key="index"
        class="shop-card-item"
        @click="$u.debounce(selectShop(item), 500)"
      >
        <image
          :src="item.shopImage"
          class="shop-main-image"
          mode="aspectFill"
        ></image>
        <view class="bottom-info">
          <view class="mallname">{{ item.shopName }}</view>
          <view class="flex-address-info">
            <view class="adress">{{ item.address }}</view>
            <view
              class="copy-area"
              @click.stop="
                $u.debounce(doCopy(item.shopName + ' ' + item.address), 500)
              "
            >
              <view class="right-address-copy iconfont icon-copy"></view>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 202rpx"></view>
    </scroll-view>
  </view>
</template>
<script>
import Location from "@/pages/home/components/location/index.vue";
import NavBar from "@/components/navBar/index.vue";

import { action_report } from "@/utils/track";
export default {
  components: {
    Location,
    NavBar,
  },
  props: {
    shopList: {
      type: Array,
      default: [],
    },
    showBackBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      navHeight: getApp().globalData.navHeight + "px",
    };
  },
  mounted() {
    //#ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + "px";
    //#endif
    //#ifdef H5
    let h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight);
    this.navHeight = h5NavHeight + "px";
    //#endif
  },
  methods: {
    doCopy(item) {
      this.$emit("copy", item);
    },
    selectShop(item) {
      console.log("item", item);
      action_report({
        action_name: "chooseshop_click",
        module_name: "cityshop_list",
        extend: {
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          shop_id: item.shopId,
        },
      });
      this.$emit("selectshop", item);
    },
    openSetting(val) {
      this.$emit("openSetting", val);
    },
  },
};
</script>
<style lang="scss" scoped>
.default-citylist {
  width: 692rpx;
  height: calc(100vh - 24px);
  margin: 0 29rpx 29rpx 29rpx;
  .title {
    color: #1f1f1f;
    font-size: 29rpx;
    line-height: 40rpx;
    margin-top: 29rpx;
    margin-bottom: 29rpx;
    font-weight: bold;
  }
  .shop-card-item {
    width: 100%;
    border-radius: 15rpx;
    margin-bottom: 15rpx;
    background: #f7f8fc;
    border: 2rpx solid #e6e6e6;
    .shop-main-image {
      width: 688rpx;
      height: 162rpx;
      border-top-left-radius: 12rpx;
      border-top-right-radius: 12rpx;
      color: #1f1f1f;
      // margin-bottom: 29rpx;
    }
    .bottom-info {
      padding: 29rpx;
      .mallname {
        font-size: 29rpx;
        line-height: 40rpx;
        font-weight: 500;
        margin-bottom: 10rpx;
        width: 608rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; //禁止换行
      }
      .flex-address-info {
        display: flex;
        align-items: baseline;
        .adress {
          width: 608rpx;
          font-weight: 300;
          font-size: 23rpx;
          line-height: 33rpx;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .copy-area {
          margin-left: auto;
          flex-shrink: 0;
          width: 50rpx;
          display: flex;
          justify-content: flex-end;
        }
        .right-address-copy {
          font-size: 23rpx;
        }
      }
    }
  }
}
</style>
