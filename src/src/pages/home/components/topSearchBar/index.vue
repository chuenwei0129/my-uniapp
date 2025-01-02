<template>
  <view class="top-search-bar-container">
    <!-- <location-nav ref="locationRef" @refreshLocation="queryData" />
    <location-tip
      ref="locationTipRef"
      @updateOpenSet="$u.debounce(handleOpenSetting, 500)"
    /> -->
    <view
      class="searchbar-container"
      :class="{ 'mall-searchbar-container': isShowCar }"
      hover-class="none"
      hover-stop-propagation="false"
    >
      <view class="searchbar-back" @tap="$u.debounce(handleSearchTapped, 500)">
        <view class="searchbar">
          <view class="placeholder">
            <scan-code color="red" />
            <view class="line"></view>
            <view>搜你想要的宠物商品</view>
          </view>
          <view class="search-button">
            <image
              class="search-icon"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/header-search.png"
              style="width: 38rpx; height: 38rpx"
            />
          </view>
        </view>
      </view>

      <view v-if="isShowCar" class="cart-button-icon" @tap="handleCartTapped">
        <!-- <i class="iconfont icon-gouwuche" style="font-size: 52rpx"></i> -->
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/shoppingCar.png"
          style="width: 46rpx; height: 46rpx"
        ></image>
        <image
          class="search-icon"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/header-search.png"
          style="width: 38rpx; height: 38rpx"
        />
        <view v-if="badgeNum.num" class="badge-num">
          {{ badgeNum.num }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { FECTH_NEAR_SHOP_STORE, GET_CART_TOTAL } from "@/api/mallv2";
import { mapState, mapMutations } from "vuex";
import { action_report } from "@/utils/track";

import scanCode from "@/components/scanCode/index.vue";
const module_name = "shop";

export default {
  components: { scanCode },
  props: {
    isShowCar: {
      type: Boolean,
      default: true,
    },
    windowWidth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      badgeNum: {
        num: 0,
        maxNum: 99,
      },

      hasYunChao: true,
      show: false,
      curAddress: "",
      location: {
        // 测试用
        lon: 119.99933512369792,
        lat: 30.28137261284722,
      },
      addressList: [],
      refresh: "",
      noLocalTips: "",
      noStoreList: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      selectedAddress: (state) => state.selectedAddress,
      openSetting: (state) => state.openSetting,
    }),
  },
  mounted() {
    // 初始化时根据定位拿门店
    // this.getMyAddress();
    uni.$on("noStoreList", (res) => {
      this.noStoreList = res;
    });
  },
  methods: {
    ...mapMutations(["setOpenSetting", "setSelectedAddress"]),
    // 查询购物车总数量
    async getCartCount() {
      let params = {
        checked: false,
        cartType: 1,
      };
      let count = 0;
      if (this.userInfo.token) {
        const res = await GET_CART_TOTAL(params);
        let { data } = res.data;
        count = data || 0;
      }
      this.badgeNum.num = count;
    },
    async handleOpenSetting() {
      this.$emit(
        "updateOpenSet",
        uni.getStorageSync("medicine_openSetting_first")
      );
      this.$refs.locationRef.getMyAddress();
    },
    handleSearchTapped() {
      action_report({
        action_name: "shop_search_click",
        module_name: "shop",
      });
      uni.navigateTo({
        url: "/pagesC/searchGoods/index",
      });
    },
    // async queryData(params) {
    //   let that = this;
    //   that.location = params;
    //   console.log("that=======>", that.location, this);
    //   // 查询最近门店信息
    //   const res = await FECTH_NEAR_SHOP_STORE({
    //     lat: that.location.lat,
    //     lon: that.location.lon,
    //   });

    //   const { shopId = "", onlineMallName = "" } = res.data?.data || {};

    //   if (shopId) {
    //     that.hasYunChao = false;
    //     uni.setStorageSync("onlineCurMallId", shopId);
    //     uni.setStorageSync("isYunchao", false);
    //     console.log("存储shopid", uni.getStorageSync("onlineCurMallId"));
    //     uni.$emit("reloadYunChao", that.hasYunChao);
    //   } else {
    //     console.log("没有门店信息，打开云超模式");
    //     that.hasYunChao = true;
    //     uni.setStorageSync("onlineCurMallId", "");
    //     uni.setStorageSync("isYunchao", true);
    //     uni.$emit("reloadYunChao", that.hasYunChao);
    //   }
    // },
    handleCartTapped() {
      action_report({
        action_name: "shop_carticon_click",
        module_name: module_name,
      });
      uni.navigateTo({
        url: `/pagesC/shoppingCart/index`,
      });
    },
  },
  watch: {
    refresh() {
      this.$refs.locationRef.getMyAddress();
    },
    selectedAddress(val) {
      this.getCartCount();
      // this.$refs.locationRef.getMyAddress();
    },
  },
};
</script>
<style lang="scss">
.top-search-bar-container {
  .u-badge {
    border: 1px solid #1f1f1f;
    background: red;
  }
}
.u-badge {
  border: 1px solid #1f1f1f;
  background: red;
}
</style>
<style scoped lang="scss">
.top-search-bar-container {
  position: relative;
  z-index: 1;
  margin-top: 9rpx;
  height: 100%;
  .searchbar-container {
    width: 100%;
    padding: 0 15rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    display: inline-flex;
    align-items: center;
    .searchbar-back {
      // width: calc(100% - 100rpx - 22rpx);
      // margin-left: 22rpx;
      width: 100%;
      // margin: 0 22rpx;
      // margin: 0 15.38rpxrpx;
      margin-top: 1rpx;
      border-radius: 18px;
      border: 3rpx solid #fe2442;
      // background: #fe2442;
      position: sticky;

      .searchbar {
        width: 100%;
        height: 63rpx;
        border-radius: 35rpx;
        background: white;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        padding: 3rpx;
        .placeholder {
          color: #1f1f1f;
          font-size: 27rpx;
          margin-left: 20rpx;
          display: flex;
          align-items: center;
          font-weight: 300;
          .line {
            width: 2rpx;
            height: 35rpx;
            background-color: #dddddd;
            margin: 0 20rpx;
          }
        }
      }
      .search-button {
        background-color: #fe2442;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 88rpx;
        height: 54rpx;
        border-radius: 27rpx;
        margin-right: 5rpx;
        margin-left: auto;
        .search-icon {
          width: 20px;
          height: 20px;
        }
      }
    }
    .yunchao-container {
      width: calc(100% - 222rpx - 22rpx);
    }
    .cart-button-icon {
      width: 46rpx;
      height: 46rpx;
      display: inline-block;
      position: relative;
      margin-left: 37rpx;
      // position: absolute;
      // right: 29rpx;
      // margin-top: -12rpx;
      .badge-num {
        width: 29rpx;
        height: 29rpx;
        background: #fe2442;
        color: white;
        font-size: 21rpx;
        font-weight: 600;
        line-height: 29rpx;
        text-align: center;
        border-radius: 50%;
        position: absolute;
        top: -15rpx;
        right: -11rpx;
      }
      ::v-deep .u-badge {
        border: 1px solid #1f1f1f;
        background: yellow;
      }
      ::v-deep {
        .u-badge {
          border: 1px solid #1f1f1f;
          background: blue;
        }
      }
      ::v-deep .u-badge {
        border: 1px solid #1f1f1f;
        background: yellow;
      }
      .u-badge {
        border: 1px solid #1f1f1f;
        background: red;
      }
      image {
        width: 46rpx;
        height: 46rpx;
      }
    }
    .u-badge {
      border: 1px solid #1f1f1f;
      background: rgb(26, 203, 197);
    }
    .yunchao {
      height: 22rpx;
      line-height: 32rpx;
      margin-left: 20rpx;
      image {
        width: 122rpx;
        height: 34rpx;
        margin-top: -4rpx;
      }
    }
  }
  .mall-searchbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 31rpx 13rpx 15rpx;
    .searchbar-back {
      width: 625rpx;
      .searchbar {
        padding: 3rpx;
      }
    }
  }
  .navigation-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    margin-top: 32rpx;
    padding-bottom: 4rpx;
    // top: 10rpx;
    .title-view-wrapper {
      width: 420rpx;
      height: 40rpx;
      position: relative;
    }
    .title-view {
      position: absolute;
      left: 0;
      top: 0;
      height: 33rpx;
      display: flex;
      color: #666;
      width: 100%;
      justify-content: space-between;

      .title-item {
        z-index: 1;

        image {
          height: 33rpx;
          width: 138rpx;
          background-size: 138rpx 33rpx;
        }
      }

      .title-selected {
        color: #1f1f1f;
        font-weight: 500;
      }
    }
    .title-indicator {
      background: linear-gradient(270deg, #ff9f1f 0%, #ffd135 100%);
      width: 132rpx;
      height: 12rpx;
      position: absolute;
      top: 27rpx;
      z-index: 0;
      transition: left 0.3s;
    }
  }
}
</style>
