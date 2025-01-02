<template>
  <view id="tabicom">
    <view class="filter-wrapper">
      <view class="tab-list">
        <view
          :class="['item', allstores.name !== '全部门店' ? 'active' : '']"
          @click="handleSelect(1)"
        >
          <view class="iconfont icon-shop fo-size"></view>
          <view class="item-text1">{{ allstores.name }}</view>
          <view :class="isSelected(1) ? 'icon-name' : ''">
            <u-icon
              name="arrow-down-fill"
              :color="allstores.name !== '全部门店' ? '#FE2442' : '#666666'"
              size="9"
            ></u-icon>
          </view>
        </view>
        <view
          :class="['item', gender !== '性别' ? 'active' : '']"
          @click="handleSelect(2)"
        >
          <i class="iconfont icon-gender fo-size"></i>

          <view class="item-text">{{ gender }}</view>
          <view :class="isSelected(2) ? 'icon-name' : ''">
            <u-icon
              name="arrow-down-fill"
              :color="gender !== '性别' ? '#FE2442' : '#666666'"
              size="9"
            ></u-icon>
          </view>
        </view>
        <view
          :class="['item', price !== '价格' ? 'active' : '']"
          @click="handleSelect(3)"
        >
          <i class="iconfont icon-refund fo-size"></i>
          <view class="item-text">{{ price }} </view>
          <view :class="isSelected(3) ? 'icon-name' : ''">
            <u-icon
              name="arrow-down-fill"
              :color="price !== '价格' ? '#FE2442' : '#666666'"
              size="9"
            ></u-icon>
          </view>
        </view>
      </view>
      <!-- <view
      :class="['shop-cart', isAnimating ? 'cartActive' : '']"
      @click="handleCartTapped"
    >
      <view v-if="num" class="dot">{{ num }}</view>
      <i class="iconfont icon-gouwuche" style="font-size: 46rpx"></i>
    </view> -->
    </view>
    <view
      class="overlay"
      :style="{
        height: `${scrollHeight}`,
      }"
      v-if="show"
      @click.stop="overlayClick"
    >
      <view class="popups" v-if="sortType === 1" @click.stop>
        <view
          class="u-page__tag-item"
          v-for="(item, index) in radios"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="radioClick(item, index)"
        >
          <view>{{ item.name }}</view>
        </view>
      </view>
      <view class="popups" v-else @click.stop>
        <view
          class="u-page__tags-item"
          v-for="(item, index) in radios"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="radioClick(item, index)"
        >
          <view>{{ item.name }}</view>
        </view>
      </view>
    </view>
    <!--  -->
  </view>
</template>

<script>
import { GET_PRICE_RANGE, GET_LIVESHOP_LIST } from "@/api/mallv2";
import { mapState } from "vuex";
import { action_report } from "@/utils/track";
const module_name = "shop";

export default {
  name: "cutepetFilter",
  props: {
    scrollHeight: {
      type: String,
      default: "",
    },
    shopId: {
      type: String,
      default: "",
    },
  },

  emits: ["onChange"],
  data () {
    return {
      sortType: 1,
      isAnimating: false, //动画
      num: 0,
      show: false,
      radios: [],
      priceList: [],
      shopList: [],
      allstores: {
        name: "全部门店",
        shopId: "",
        checked: false,
      },
      gender: "性别",
      price: "价格",
      lowerPrice: undefined, //最小价格
      highPrice: undefined, //最大价格
    };
  },
  created () {
    // this.getLiveshopList();
    this.getPriceRangeList();
    uni.$off();
    uni.$on("cutepetResults", async (res) => {
      console.log("135135135135135135", res);
      await this.cutepetResults();

      // this.$emit("onChange", this.sortType);
    });
    // this.sendDataToParent();
  },
  mounted () { },
  computed: {},

  methods: {
    async getPriceRangeList () {
      try {
        let { data } = await GET_PRICE_RANGE();
        // console.log(res);
        this.priceList = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getLiveshopList () {
      return new Promise(async (resolve, reject) => {
        let lon, lat, province, provinceCode, city, cityCode;
        const mall_last_search_address_obj = uni.getStorageSync(
          "mall_last_search_address_obj"
        ); //当前收货地址位置
        if (!mall_last_search_address_obj) {
          lon = uni.getStorageSync("lon");
          lat = uni.getStorageSync("lat");
          province = uni.getStorageSync("province");
          provinceCode = uni.getStorageSync("provinceCode");
          city = uni.getStorageSync("currentCity");
          cityCode = uni.getStorageSync("selectedCityCode");
        } else {
          lon = mall_last_search_address_obj.lon;
          lat = mall_last_search_address_obj.lat;
          province = mall_last_search_address_obj.province;
          provinceCode = mall_last_search_address_obj.provinceCode;
          city = mall_last_search_address_obj.city;
          cityCode = mall_last_search_address_obj.cityCode;
        }

        if (lon && lat && province) {
          const isRequest = this.putLiveShopList(
            lon,
            lat,
            province,
            provinceCode,
            city,
            cityCode
          );
          resolve(isRequest);
        } else {
          // #ifdef H5
          const res = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
            ? JSON.parse(
              this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
              {}
            )
            : {};
          console.log("当前位置的经度：" + res.lon);
          console.log("当前位置的纬度：" + res.lat);
          const isRequest = await this.putLiveShopList(res.lon, res.lat);
          resolve(isRequest);
          // #endif
          // #ifdef MP-WEIXIN
          uni.getLocation({
            type: "gcj02",
            success: async (res) => {
              console.log("当前位置的经度：" + res.longitude);
              console.log("当前位置的纬度：" + res.latitude);
              const isRequest = await this.putLiveShopList(
                res.longitude,
                res.latitude
              );
              resolve(isRequest);
            },
            fail: async (err) => {
              console.log("dfdfdfsd", err);
              const isRequest = await this.putLiveShopList();
              resolve(isRequest);
            },
          });
          // #endif
        }
      });
    },
    putLiveShopList (lon, lat, province, provinceCode, city, cityCode) {
      return new Promise(async (resolve, reject) => {
        console.log("当前位置的经度：" + lon);
        console.log("当前位置的纬度：" + lat);
        console.log("省市信息", province, provinceCode, city, cityCode);
        let query = {
          // cityCode: res.address.cityCode,  //所在城市code
          // cityName: res.address.city,  //-- 所在城市名称
          lng: lon, // -- 经度
          lat: lat, // -- 纬度
          province,
          provinceCode,
          city,
          cityCode,
        };
        console.log(
          "lon:",
          lon,
          "lat:",
          lat,
          province,
          provinceCode,
          city,
          cityCode
        );

        if (!lon || !lat || !province) {
          resolve(false);
        }
        let { data } = await GET_LIVESHOP_LIST(query);
        console.log(data);

        this.shopList = data.data;
        console.log("门店", this.shopList);
        if (this.shopId) {
          this.displayMethodId(this.shopId);
        }
        resolve(true);
      });
    },
    async cutepetResults () {
      const isLocation = await this.getLiveshopList();
      // 若请求的接口入参完整，判断shopList第一个数据的selectedShop是否为1，是则选中反显，否则选择全部门店
      if (isLocation) {
        const defaultShop = this.shopList[0];
        console.log("defaultShop,defaultShop,defaultShop", defaultShop);
        if (defaultShop && defaultShop.selectedShop == 1) {
          this.displayMethodId(defaultShop.shopId);
        } else {
          // this.radios[0].checked = true
        }
      }
      await this.sendDataToParent();
      // this.$emit("onChange", this.sortType);
    },
    sendDataToParent () {
      if (this.price === "价格") {
        // priceRange = this.priceList
        this.lowerPrice = undefined;
        this.highPrice = undefined;
      } else if (this.price.includes("-")) {
        let priceArr = this.price.split("-");
        this.lowerPrice = priceArr[0];
        this.highPrice = priceArr[1];
      } else if (this.price.includes("以上")) {
        let priceArr = this.price.split("以上");
        this.lowerPrice = priceArr[0];
        this.highPrice = "";
      }
      this.$emit("sendDataToParent", {
        allstores: this.allstores.name === "全部门店" ? null : this.allstores,
        gender: this.gender === "性别" ? 0 : this.gender === "弟弟" ? 1 : 2,
        lowerPrice: this.lowerPrice,
        highPrice: this.highPrice,
      });
    },
    overlayClick (e) {
      // console.log(e.target === e.currentTarget);
      this.show = false;
    },
    async radioClick (items, name) {
      try {
        console.log(items);

        this.radios.forEach((item, index) => {
          item.checked = index === name ? true : false;
        });
        if (this.sortType === 1) {
          if (items.name === "全部") {
            this.allstores = {
              name: "全部门店",
              shopId: "",
              checked: false,
            };
          } else {
            this.allstores = items;
          }
        } else if (this.sortType === 2) {
          if (items.name === "全部") {
            this.gender = "性别";
          } else {
            this.gender = items.name;
          }
        } else if (this.sortType === 3) {
          if (items.name === "全部") {
            this.price = "价格";
          } else {
            this.price = items.name;
          }
        }
        this.show = false;
        await this.sendDataToParent();
        // this.$emit("onChange", this.sortType);
      } catch (error) {
        console.log(error);
      }
    },
    isSelected (type) {
      return this.sortType === type && this.show;
    },
    displayMethodId (shopId) {
      console.log("displayMethodId--displayMethodId", shopId, this.shopList);

      this.radios = this.shopList.map((item) => {
        const res = {
          ...item,
        };
        if (item.shopId === shopId) {
          res.checked = true;
          this.allstores.name = item.name;
          this.allstores.shopId = item.shopId;
        } else {
          res.checked = false;
        }
        return res;
      });
      console.log(this.radios);
    },
    displayMethod (name) {
      this.radios.forEach((item) => {
        item.checked = false;
      });
      let person = this.radios.find((person) => person.name === name);
      if (person) {
        // name = person.name
        person.checked = true;
      } else {
        this.radios[0].checked = true;
      }
    },
    handleSelect (type) {
      this.sortType = type;
      if (type === 1) {
        const shopLists = this.shopList.map((item) => {
          return {
            ...item,
            checked: false,
          };
        });
        console.log("shopLists", shopLists);

        this.radios = JSON.parse(
          JSON.stringify([
            {
              name: "全部",
              shopId: "",
              checked: true,
            },
            ...shopLists,
          ])
        );
        if (this.allstores.name !== "全部门店") {
          this.displayMethod(this.allstores.name);
        } else {
          this.displayMethod("全部");
        }
      } else if (type === 2) {
        this.radios = [
          {
            name: "全部",
            checked: true,
          },
          {
            name: "弟弟",
            checked: false,
          },
          {
            name: "妹妹",
            checked: false,
          },
        ];
        if (this.gender !== "性别") {
          this.displayMethod(this.gender);
        } else {
          this.displayMethod("全部");
        }
      } else if (type === 3) {
        const transformedData = this.priceList.map((item) => ({
          name:
            item.priceRangeEnd === ""
              ? `${item.priceRangeBegin}以上`
              : `${item.priceRangeBegin}-${item.priceRangeEnd}`,
          checked: false,
        }));
        console.log(transformedData);
        this.radios = JSON.parse(
          JSON.stringify([
            {
              name: "全部",
              checked: true,
            },
            ...transformedData,
          ])
        );
        console.log(this.radios);
        if (this.price !== "价格") {
          this.displayMethod(this.price);
        } else {
          this.displayMethod("全部");
        }
      }

      this.show = !this.show;

      // if (this.sortType === type) return;

      // this.$emit("onChange", this.sortType);
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-wrapper {
  height: 70rpx;
  width: 100vw;
  background-color: #fff;
  padding: 0 29rpx 0 29rpx;

  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  .item {
    min-width: 58rpx;
    font-size: 27rpx;
    font-weight: 400;
    color: #666666;
    line-height: 38rpx;
    text-align: center;
    margin-right: 60rpx;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    flex-shrink: 0;
    // white-space: nowrap;
    .item-text {
      height: 38rpx;
      line-height: 38rpx;
      margin: 0 4rpx;
    }
    .item-text1 {
      height: 38rpx;
      line-height: 38rpx;
      max-width: 190rpx;
      overflow: hidden;
      margin: 0 4rpx;
    }
    .icon-name {
      // color: #FE2442;
      transform: rotate(180deg);
    }
    .icon-0 {
      // color: #FE2442;
      transform: rotate(0);
    }
  }

  .active {
    color: #fe2442;
  }

  .tab-list {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
  }
}
.overlay {
  position: absolute;
  left: 0;
  width: 100%;
  // min-height: calc(90vh - 65px);
  z-index: 99;
  // background: #000;
  background-color: rgba(0, 0, 0, 0.5);

  .popups {
    width: 100%;
    max-height: 712rpx;
    background-color: #fff;
    position: absolute;
    left: 0;
    // padding: 0 6rpx;
    padding-left: 29rpx;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    z-index: 99;
    overflow-y: auto;
    padding-bottom: 6rpx;
    .u-page__tag-item {
      width: 335rpx;
      height: 71rpx;
      background: #f7f8fc;
      border-radius: 10rpx;
      margin-bottom: 23rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #333333;
      line-height: 71rpx;
      text-align: center;
      overflow: hidden;
      margin-right: 23rpx;
    }
    .u-page__tags-item {
      width: 215rpx;
      height: 71rpx;
      background: #f7f8fc;
      border-radius: 10rpx;
      margin-bottom: 23rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #333333;
      line-height: 71rpx;
      text-align: center;
      overflow: hidden;
      margin-right: 23rpx;
    }
    .tag-hit {
      background: #ffefef;
      border-radius: 10rpx;
      border: 1rpx solid #fe2442;
      font-weight: 400;
      font-size: 25rpx;
      color: #fe2442;
    }
  }
}

.shop-cart {
  position: relative;
  .shop-cart-logo {
    width: 44rpx;
    height: 44rpx;
  }
  .dot {
    position: absolute;
    top: -11rpx;
    right: -11rpx;
    background: #f33a50;
    font-size: 20rpx;
    font-weight: 600;
    color: #ffffff;
    border-radius: 50%;
    // padding: 2rpx 10rpx;
    width: 34rpx;
    height: 34rpx;
    line-height: 34rpx;
    text-align: center;
    // min-width: 28rpx;
    // min-height: 28rpx;
  }
}
.cartActive {
  animation-name: zoomInOut;
  animation-duration: 0.3s; /* 动画持续时间 */
  animation-iteration-count: 1; /* 动画次重 */
}
@keyframes zoomInOut {
  0% {
    transform: scale(1); /* 初始化为正常大小 */
  }
  50% {
    transform: scale(1.15); /* 放大至1.15倍 */
  }
  100% {
    transform: scale(1); /* 恢复到正常大小 */
  }
}
.fo-size {
  font-size: 31rpx;
}
</style>
