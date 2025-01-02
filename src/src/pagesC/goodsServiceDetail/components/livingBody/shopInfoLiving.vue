<template>
  <view class="shopInfo">
    <view class="liner-parent">
      <view class="ling-height"></view>
    </view>
    <view class="content">
      <view>
        <view class="header">
          <view class="title" @click="goShopDetail">{{
            shopInfo &&
            shopInfo.onlineShopName &&
            sliceStr(shopInfo.onlineShopName, 20)
          }}</view>
          <view class="check" @click="$u.debounce(handleNav, 500)">
            <image class="check-icon" :src="rightIcon_gray" />
            <text class="distance">{{ distance }}</text>
          </view>
        </view>
        <view class="address">
          <view class="address-text" @click="goShopDetail">
            {{ (shopInfo && shopInfo.fullAddress) || "-" }}
          </view>
          <view
            class="address-right"
            @click.stop="addressCopy(shopInfo.fullAddress)"
          >
            <i class="iconfont icon-copy fo-size"></i>
          </view>
        </view>
      </view>
      <view class="pref">
        <image
          v-if="reservation"
          class="img1"
          :src="liveSkuInfo && liveSkuInfo.reservationWatchPetFlow"
        />
        <image v-if="liveSkuInfo" class="img2" :src="liveSkuInfo.buyNowFlow" />
      </view>
    </view>
    <view class="pic-detail">
      <image
        v-for="(item, i) in detailUrlList"
        class="img-detail"
        mode="widthFix"
        :src="item"
        :key="i"
      ></image>
    </view>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
import { mapState } from "vuex";
export default {
  name: "shopInfoLiving",
  props: {
    livebodyData: {
      type: Object,
      default: () => {},
    },
    reservation: {
      type: [Boolean, Number],
      default: false,
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    detailUrlList() {
      const newUrls = this.livebodyData?.liveSkuDTO?.liveDetailImgList?.map(
        (item) => {
          if (item) {
            const parts = item.split("?");
            return parts[0];
          }
        }
      );
      return newUrls;
    },
    meter() {
      let lat2 = "";
      let lng2 = "";
      let that = this;
      lat2 = uni.getStorageSync("lat") || "";
      lng2 = uni.getStorageSync("lon") || "";
      if (lat2 && lng2) {
        let rad1 = (that.livebodyData.liveShop.lat * Math.PI) / 180.0;
        let rad2 = (lat2 * Math.PI) / 180.0;
        let a = rad1 - rad2;
        let b =
          (that.livebodyData.liveShop.lng * Math.PI) / 180.0 -
          (lng2 * Math.PI) / 180.0;
        let s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
                Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
            )
          );
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        s = s.toString();
        s = s.substring(0, s.indexOf(".") + 2);
        if (s < 1) {
          if (s == "0.0") {
            s = "导航";
          } else {
            s = s * 1000 + "m";
          }
        } else {
          s = s + "km";
        }
        this.distance = s;
      } else {
        this.distance = "导航";
      }
    },
  },
  data() {
    return {
      rightIcon_gray:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/positionIcon.png",
      shopInfo: null,
      liveSkuInfo: null,
      distance: "",
    };
  },
  mounted() {
    this.shopInfo = this.livebodyData.liveShop;
    this.liveSkuInfo = this.livebodyData.liveSkuDTO;
  },
  methods: {
    sliceStr(str, len) {
      if (str && str.length > len) {
        return str.slice(0, len);
      } else {
        return str;
      }
    },
    handleNav() {
      action_report({
        action_name: "LivepetDetailpage_navigation_click",
        module_name: "LivepetDetailpage",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.livebodyData?.liveSkuDTO?.itemName,
        },
      });
      uni.$u.throttle(() => {
        console.log("点击了导航===>", this.shopInfo);
        // #ifdef MP-WEIXIN
        uni.openLocation({
          latitude: this.shopInfo?.lat,
          longitude: this.shopInfo?.lng,
          name: this.shopInfo?.onlineShopName || "",
          address: this.shopInfo?.fullAddress,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("showNavigationAlert", {
          dname: this.shopInfo?.onlineShopName || "",
          sname: "我的位置",
          dlat: this.shopInfo?.lat,
          dlon: this.shopInfo?.lng,
        });
        // #endif
      }, 500);
    },
    goShopDetail() {
      const { shopId } = this.livebodyData?.liveShop;

      let lon, lat;
      const mall_last_search_address_obj = uni.getStorageSync(
        "mall_last_search_address_obj"
      );
      if (!mall_last_search_address_obj) {
        lon = uni.getStorageSync("lon");
        lat = uni.getStorageSync("lat");
      } else {
        lon = mall_last_search_address_obj.lon;
        lat = mall_last_search_address_obj.lat;
      }
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesB/inStoreService/index?shopId=${shopId}&lat=${lat}&lon=${lon}`,
      });
      // #endif
      // #ifdef H5
      console.log(
        "H5--跳转门店详情：：：",
        `${window.location.origin}/crm-medical-h5/#/pagesB/inStoreService/index?shopId=${shopId}&lat=${lat}&lon=${lon}`
      );
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesB/inStoreService/index?shopId=${shopId}&lat=${lat}&lon=${lon}`,
      });
      // #endif
    },
    addressCopy(e) {
      uni.setClipboardData({
        data: e,
        showToast: false,
        success: (res) => {
          uni.showToast({
            title: "复制成功",
            icon: "none",
          });
        },
        fail: function () {
          uni.showToast({
            title: "复制失败",
            icon: "none",
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.shopInfo {
  width: 100%;
  box-sizing: border-box;
  .liner-parent {
    width: 100%;
    background-color: #fff;
    .ling-height {
      width: 692rpx;
      height: 2rpx;
      background-color: #f8f8f8;
      margin: 0 auto;
    }
  }

  .content {
    // height: 625rpx;
    background: #fff;
    // border-radius: 23rpx;
    padding: 38rpx 29rpx;
    box-sizing: border-box;
    // margin: 0 15rpx 19rpx;
    .header {
      display: flex;
      // align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;
      width: 100%;
      .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 31rpx;
        color: #1f1f1f;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        width: calc(100% - 158rpx);
      }
      .check {
        width: 158rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        font-size: 25rpx;
        color: #666666;
        line-height: 35rpx;
        text-align: right;
        font-style: normal;
        display: flex;
        // align-items: center;
        justify-content: flex-end;
        .check-icon {
          display: inline-block;
          width: 27rpx;
          height: 27rpx;
          margin-right: 4rpx;
        }
        .distance {
          color: #1f1f1f;
        }
      }
    }
    .address {
      // position: relative;
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 25rpx;
      color: #1f1f1f;
      line-height: 35rpx;
      margin-bottom: 38rpx;
      display: flex;
      justify-content: space-between;

      .address-right {
        width: 158rpx;
        display: flex;
        justify-content: flex-end;
      }
      .address-text {
        // width: 625rpx;
        width: calc(100% - 158rpx);
      }
      .fo-size {
        // position: absolute;
        // right: 0;
        // top: 0;
      }
    }
    .img1,
    .img2 {
      width: 100%; //662rpx;
      height: 196rpx;
      display: block;
    }
    .img1 {
      margin-bottom: 38rpx;
    }
  }
}
.pic-detail {
  width: 100%;
  .img-detail {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>
