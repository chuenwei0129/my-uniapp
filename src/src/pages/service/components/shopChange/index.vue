<template>
  <!-- 底部弹窗 -->
  <view class="customer-u-popup">
    <u-popup
      :show="show"
      mode="bottom"
      :closeOnClickOverlay="true"
      @close="close"
      :custom-style="{ 'border-radius': '38rpx 38rpx 0rpx 0rpx' }"
    >
      <view class="shop-popup-header">
        <text>切换门店</text>
        <view class="shop-popup-close" @click="close">
          <image
            style="width: 31rpx; height: 31rpx"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/close_icon.png"
          ></image>
        </view>
      </view>
      <view class="shop-popup-content" v-if="dataList && dataList.length">
        <scroll-view
          class="left-nav"
          scroll-y
          :scroll-into-view="'Ct' + dataList[catIndex].cityCode"
        >
          <view
            class="cat-item"
            v-for="(item, index) in dataList"
            :key="item.cityCode"
            :id="'Ct' + item.cityCode"
            @click="cutCity(item, index)"
            :class="{ 'active-city': catIndex === index }"
          >
            <view style="position: relative; width: 0; height: 0">
              <view class="cat-item-back"></view>
              <view
                v-if="catIndex === index + 1"
                class="cat-item-back-top"
              ></view>
              <view
                v-if="catIndex === index - 1"
                class="cat-item-back-bottom"
              ></view>
              <view
                v-if="
                  catIndex !== index &&
                  catIndex !== index - 1 &&
                  catIndex !== index + 1
                "
                class="cat-item-back-all"
              ></view>
              <!-- <view v-if="catIndex === index" class="cat-item-indicator" /> -->
            </view>
            <text class="cat-item-name">
              {{ item.cityName }}
            </text>
          </view>
        </scroll-view>
        <scroll-view
          class="right-shop-show"
          scroll-y
          scroll-with-animation="true"
          :scroll-into-view="'Ls' + dataList[rightIndex].cityCode"
          @scroll="handlePackageListScroll"
        >
          <view
            class="shop-info"
            v-for="(item, index) in dataList"
            :key="item.cityCode"
            :id="'Ls' + item.cityCode"
          >
            <view class="city">{{ item.cityName }}</view>
            <view
              v-for="(sitem, sindex) in item.shops"
              :key="sitem.shopId"
              @click="getChangeShopInfo(sitem)"
              :class="[
                'shop-card-item',
                sitem.shopId == selectShopId ? 'active' : '',
              ]"
            >
              <view
                class="map-clickarea"
                v-if="location.lat && location.lon"
                @click.stop="$u.debounce(handleNavigateShop(sitem), 500)"
              >
                <view class="map-guide">
                  <image
                    class="guide-icon"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/service/whiteguide.png"
                  ></image>
                  <view class="guide-text">导航</view>
                </view>
              </view>
              <image
                style="width: 572rpx; height: 162rpx; margin-bottom: 19rpx"
                :src="sitem.shopImage"
                mode="aspectFill"
              ></image>
              <!-- <view class="shop-img" :style="{'background-image': `url(${item.shopImage})` }"></view> -->
              <view class="title">{{ sitem.shopName }}</view>
              <view class="bottom-info">
                <view class="left-address">
                  <view class="address">{{ sitem.address }}</view>
                  <view class="distance" v-if="location.lat && location.lon">
                    距离你{{ renderKM(sitem.distance) }}
                    <view
                      v-if="index == 0 && sindex == 0"
                      class="nearest-tag"
                      >{{ "最近" }}</view
                    >
                  </view>
                </view>
                <view
                  class="copy-area"
                  @click.stop="
                    $u.debounce(
                      doCopy(sitem.shopName + ' ' + sitem.address),
                      500
                    )
                  "
                >
                  <view class="right-address-copy iconfont icon-copy"></view>
                </view>
              </view>
            </view>
          </view>
          <view style="height: 677rpx; width: 573rpx" class="fill-wrap">
            - 到底了 -
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {
  GET_STORE_LIST,
  GET_HAS_SHOP_CITIES,
  NEW_GET_STORE_LIST,
  NEW_GET_HAS_SHOP_CITIES,
  GET_CITY_SHOP_LIST,
} from "@/api/mallv2";
import { renderKM } from "@/utils";

export default {
  name: "shopChange",
  data() {
    return {
      leftCityList: [],
      newRightShopObj: {},
      // isMedicine: false,
      cityCode: "",
      catIndex: 0,
      rightIndex: 0,
      typeNamePositions: [],
      dataList: [],
      dataListIsScrolling: false,
    };
  },
  props: {
    bizType: {
      type: Number | String,
    },
    show: {
      type: Boolean,
      default: false,
      require: true,
    },
    // shopInfo: {
    // 	type: Object,
    // 	default: {}
    // },
    location: {
      type: Object,
      default: {},
    },
    // isDefaultData: {
    // 	type: Boolean
    // },
    isMedicine: {
      type: Boolean,
      default: false,
    },
    selectShopId: {
      type: String,
    },
  },
  // watch: {
  //   show: {
  //     handler(newVal) {
  //       if (newVal) {
  //         this.handleSwitchShop();
  //       }
  //     },
  //     immediate: true,
  //     deep: true,
  //   },
  // },
  mounted() {
    console.log("location", this.location);
    this.handleSwitchShop();
  },
  methods: {
    renderKM,
    close() {
      this.catIndex = 0;
      this.$emit("update:show", false);
    },
    async handleSwitchShop() {
      // await this.getStoreList();
      await this.getDataList();
      this.getTypeNamePositions();
    },
    async getDataList() {
      const _params = {
        lng: this.location.lon,
        lat: this.location.lat,
        bizType: this.bizType,
        channelType: 1,
      };
      const res = await GET_CITY_SHOP_LIST(_params);
      this.dataList = res.data.data;
      console.log("datalist===", this.dataList);
    },
    getChangeShopInfo(item) {
      this.$emit("getChangeShopInfo", item);
      this.close();
    },
    getTypeNamePositions() {
      //计算商品区标题距离顶部的top值 item.height / 2(微调距离)
      const query = uni.createSelectorQuery().in(this);
      this.typeNamePositions = [];
      query
        .selectAll(".city")
        .boundingClientRect((data) => {
          if (data.length) {
            let firstTop = data[0].top;
            console.log("first", firstTop);
            data.forEach((item) => {
              this.typeNamePositions.push(
                item.top - firstTop - item.height / 2
              );
            });
          }
        })
        .exec();
      console.log("typesss", this.typeNamePositions);
    },
    handlePackageListScroll(e) {
      const { scrollTop } = e.detail;
      if (this.dataListIsScrolling) {
        return;
      }
      const lastIndex = this.typeNamePositions.length - 1;
      //判断右侧窗口顶边在哪两个分类名称之间，左侧分类导航高亮显示该索引项
      if (scrollTop >= this.typeNamePositions[lastIndex]) {
        this.catIndex = lastIndex;
      } else {
        for (var i = 0; i < lastIndex; i++) {
          if (
            scrollTop >= this.typeNamePositions[i] &&
            scrollTop <= this.typeNamePositions[i + 1]
          ) {
            this.catIndex = i;
            break;
          }
        }
      }
    },
    cutCity(cat, index) {
      console.log("cat cat", cat, index);
      if (this.catIndex === index) {
        return;
      }
      this.catIndex = index;
      this.rightIndex = index;
      // let offset = this.typeNamePositions[index];
      // this.packageScrollTop = offset;
      // console.log("packageScrollTop", this.packageScrollTop);
      this.dataListIsScrolling = true;
      setTimeout(() => {
        this.dataListIsScrolling = false;
      }, 2000);
    },
    doCopy(item) {
      this.$emit("copy", item);
    },
    handleNavigateShop(item) {
      const { lat, lng, shopName, address } = item;
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/address/navigation/map?targetName=${shopName}&targetAddress=${address}&targetLat=${lat}&targetLng=${lng}`,
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.openLocation({
        latitude: lat,
        longitude: lng,
        name: shopName,
        address: address,
        success: function (res) {},
      });
      // //#endif
    },
  },
};
</script>

<style lang="scss" scoped>
.shop-popup-header {
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 35rpx;
  color: #1f1f1f;
  position: relative;
  line-height: 115rpx;
  background: #ffffff;
  text-align: center;
  border-bottom: 2rpx solid #f8f8f8;
  border-radius: 38rpx 38rpx 0rpx 0rpx;

  .shop-popup-close {
    position: absolute;
    top: 28.85rpx;
    right: 28.85rpx;
    width: 50rpx;
    height: 50rpx;
    background: #ecedf1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.shop-popup-content {
  display: flex;
  height: 1002rpx;
  background-color: #f7f8fc;
  .left-nav {
    overflow-y: auto;
    width: 119rpx;
    .city-name {
      line-height: 110rpx;
      text-align: center;
      background: #f7f8fc;
      // border-radius: 0rpx 12rpx 0rpx 0rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #1f1f1f;
    }
    .active-city {
      font-weight: 600;
      background-color: #fff;
    }
    .cat-item {
      height: 110rpx;
      display: flex;
      align-items: center;
      color: #1f1f1f;
      font-size: 25rpx;
      text-align: left;

      .cat-item-name {
        // margin-left: 29rpx;
        width: 100%;
        text-align: right;
        padding-right: 20rpx;
        z-index: 1;
        overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
      }

      .cat-item-back {
        background-color: white;
        left: 0;
        top: -55rpx;
        width: 120rpx;
        height: 110rpx;
        z-index: 0;
        position: absolute;
      }

      .cat-item-back-top {
        @extend .cat-item-back;
        background-color: #f7f8fc;
        border-radius: 0 0 12rpx 0;
      }

      .cat-item-back-bottom {
        @extend .cat-item-back;
        background-color: #f7f8fc;
        border-radius: 0 12rpx 0 0;
      }

      .cat-item-back-all {
        @extend .cat-item-back;
        background-color: #f7f8fc;
      }

      .cat-item-indicator {
        // #ifdef MP-WEIXIN
        background-color: #ffd41e;
        // #endif
        // #ifdef H5
        background-color: #fe2442;
        // #endif

        width: 12rpx;
        height: 25rpx;
        position: absolute;
        left: 0;
        top: -12.5rpx;
      }
    }
  }
  .right-shop-show {
    flex: 1;
    padding-left: 29rpx;
    padding-right: 29rpx;
    overflow-y: auto;
    height: 100%;
    padding-top: 38rpx;
    padding-bottom: 38rpx;
    background-color: #fff;
    box-sizing: border-box;
    .fill-wrap {
      font-size: 23rpx;
      color: #999999;
      line-height: 33rpx;
      padding-top: 39rpx;
      text-align: center;
    }
    .city {
      margin-bottom: 15rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #999999;
      line-height: 35rpx;
      text-align: left;
    }
    .shop-info {
      // padding: 0 29rpx 29rpx 29rpx;

      .shop-card-item {
        border-radius: 15rpx;
        border: 2rpx solid #e6e6e6;
        background: #f7f8fc;
        margin-bottom: 19rpx;
        color: #1f1f1f;
        position: relative;
        &.active {
          border-color: #fe2442;
          background: #ffefef;
          color: #fe2442;
          .distance {
            color: #fe2442;
          }
        }
        .map-clickarea {
          width: 115rpx;
          height: 77rpx;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 2;
        }
        .map-guide {
          position: absolute;
          width: 81rpx;
          height: 38rpx;
          border-radius: 19rpx;
          background: rgba($color: #000000, $alpha: 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          top: 10rpx;
          right: 10rpx;
          z-index: 2;
          .guide-icon {
            width: 17rpx;
            height: 17rpx;
            margin-right: 6rpx;
            vertical-align: middle;
          }
          .guide-text {
            font-size: 19rpx;
            color: #ffffff;
            line-height: 38rpx;
          }
        }
      }
      image {
        // border-radius: 15rpx;
        border-top-left-radius: 12rpx;
        border-top-right-radius: 12rpx;
      }
    }
    .bottom-info {
      padding: 0 29rpx 29rpx 29rpx;
      display: flex;
      justify-content: flex-start;
      .copy-area {
        margin-left: auto;
        flex-shrink: 0;
        width: 70rpx;
        display: flex;
        justify-content: flex-end;
      }
      .right-address-copy {
        font-size: 23rpx;
        margin-top: 2rpx;
      }
    }
    .nearest-tag {
      font-size: 23rpx;
      font-weight: 400;
      color: #fe2442;
      line-height: 33rpx;
      margin-left: 12rpx;
    }
    .shop-img {
      width: 583rpx;
      height: 162rpx;
      margin-bottom: 19rpx;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .title {
      margin-bottom: 10rpx;
      width: 488rpx;
      font-weight: 500;
      margin-left: 29rpx;
      font-size: 29rpx;
      line-height: 40rpx;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .address {
      font-weight: 400;
      font-size: 23rpx;
      line-height: 33rpx;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .distance {
      display: flex;
      margin-right: 10rpx;
      font-weight: 400;
      font-size: 23rpx;
      color: #666666;
      margin-top: 4rpx;
      line-height: 33rpx;
      text-align: left;
    }
  }
}
</style>
