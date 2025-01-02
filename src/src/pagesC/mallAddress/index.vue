<template>
  <!-- 电商地址组件 -->
  <view class="address-card">
    <view style="position: sticky; background: #f5f6f7; z-index: 10">
      <view class="address-bg-container">
        <view class="open-search-address-view">
          <view class="search-address-text" @click="handleSearchMap">
            搜索小区、办公楼、学校等
          </view>
        </view>
        <view class="cur-search" v-if="searchLoc">
          当前所选位置： {{ searchLoc }}
        </view>
      </view>
    </view>

    <view class="naddress">
      <view class="naddress-title">
        <view class="naddress-title-item"> 附近地址 </view>
        <view class="naddress-title-icon" @click="handleOpenSetting">
          <img v-if="!naddress" src="@/static/images/tabbar/icon.png" />
          <img
            v-else
            :class="{ rotate: isRotating }"
            src="@/static/images/tabbar/iconn.png"
          />
          <view class="naddress-title-icon-text">{{
            !naddress ? "未开启定位，去开启" : "重新定位"
          }}</view>
        </view>
      </view>
      <view @click="naddressClick" class="naddress-address" v-if="naddress">{{
        naddress
      }}</view>
    </view>

    <view class="list-header-tips"> 我的收货地址</view>
    <view class="list" v-if="addressList.length > 0">
      <view class="list-scroll">
        <view
          class="address-item"
          v-for="(item, index) in addressList"
          :key="index"
        >
          <view class="info">
            <view
              :class="['left', item.isClick ? 'clicked-class' : '']"
              @click="
                () => {
                  handleChooseAdd(item, index);
                }
              "
            >
              <view class="base">
                <view class="add-province">
                  {{ item.address }}
                </view>
              </view>
              <view class="name">
                {{ item.addressName }}
              </view>
              <view class="ads">
                {{ item.name }}
                <text class="phone"> {{ item.phone }}</text>
                <text class="isDefault" v-if="item.defaultFlag">默认</text>
              </view>
            </view>
            <!-- <view
              class="right"
              @click="
                () => {
                  handleEdit(item);
                }
              "
            ></view> -->
          </view>
          <view
            class="right"
            v-if="
              searchLoc == item.addressName ||
              item.isClick ||
              searchLoc == item.address
            "
          >
            <u-icon
              name="checkmark-circle-fill"
              color="#FE2442"
              size="20"
            ></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view class="add-btn">
      <view class="adds-text" @click="handleAdd">
        <text style="margin-left: 20rpx">新增收货地址</text>
      </view>
      <u-safe-bottom></u-safe-bottom>
    </view>
  </view>
</template>

<script>
import { getAddressList, searchUserLocation } from "@/api/base/index";
import { EDIT_ADDRESS } from "@/api/pay";
import { mapState, mapMutations } from "vuex";
import { getAuthLocation } from "@/utils/location";

export default {
  data() {
    return {
      addressList: [],
      searchLoc: "",
      naddress: false,
      naddressList: {},
      isRotating: false,
      // curIndex: -1
    };
  },
  computed: {
    ...mapState(["addressId", "userInfo", "selectedAddress"]),
  },
  onLoad(options) {
    // console.log(options.diagnosticSheetId);
    // if (options.diagnosticSheetId) {
    //   this.diagnosticSheetId = options.diagnosticSheetId;
    // }
    if (options.orderNo) {
      this.orderNo = options.orderNo;
    }
  },
  onShow() {
    let address = uni.getStorageSync("mall_last_search_address_obj");
    this.naddressList = uni.getStorageSync("addressList");
    this.naddress = uni.getStorageSync("addressList")?.address;
    this.searchLoc = address.address;
    if (!this.userInfo.token) {
      uni.reLaunch({
        url: `/pagesD/login/index`,
      });
    } else {
      getAddressList().then((res) => {
        this.addressList = res.data.data;
      });
    }
  },
  onReady() {},
  methods: {
    ...mapMutations(["setAddressId", "setSelectedAddress", "setOpenSetting"]),
    handleAdd() {
      uni.navigateTo({
        url: `/pagesC/mallAddress/addressDetail/index?openType=add`,
      });
    },
    // handleEdit(item) {
    //   uni.navigateTo({
    //     url: `/pagesC/mallAddress/addressDetail/index?openType=edit&id=${item.userAddressStrId}`,
    //   });
    // },
    // 打开小程序地图
    async handleSearchMap() {
      uni.chooseLocation({
        success: async (res) => {
          console.log("res====>1", res);
          const data = {
            lon: res.longitude,
            lat: res.latitude,
          };
          try {
            const res2 = await searchUserLocation({ data });
            let item = Object.assign(res2.data, data);
            item.isDeliveryAddress = false;
            console.log("mall_last_search_address:", res2.data, data);
            uni.setStorageSync("mall_last_search_address_obj", item);
            uni.setStorageSync("lon", item.lon);
            uni.setStorageSync("lat", item.lat);
            uni.setStorageSync("cityCode", item.adcode);
            this.setSelectedAddress(item);
            this.searchLoc = res2.data.address || res2.data.formattedAddress;

            // let pages = getCurrentPages()
            // let prePage = pages[pages.length - 2]
            // prePage.$vm.refresh = Math.random()

            const eventChannel = this.getOpenerEventChannel();
            eventChannel.emit("resultEvent", {
              data: item,
            });
            uni.navigateBack({ delta: 1 });
          } catch (error) {
            console.log(error);
          }

          // searchUserLocation({data}).then((res2) => {
          //   console.log('res===<', res2)
          // });
        },
      });
    },
    // 选择的是收货地址
    async handleChooseAdd(item, index) {
      // this.curIndex = index
      this.addressList.map((cur) => {
        return cur.userAddressStrId === item.userAddressStrId
          ? (cur.isClick = true)
          : (cur.isClick = false);
      });
      console.log("选择地址:", item);
      // item.address = item.addressName;
      item.isDeliveryAddress = true;
      uni.setStorageSync("mall_last_search_address_obj", item);
      uni.setStorageSync("lon", item.lon);
      uni.setStorageSync("lat", item.lat);
      uni.setStorageSync("cityCode", item.cityCode);
      this.setSelectedAddress(item);
      this.searchLoc = item.addressName;

      this.setAddressId(item.userAddressStrId);
      if (this.orderNo) {
        //修改订单地址
        try {
          const res = await EDIT_ADDRESS({
            orderNo: this.orderNo,
            addressId: item.userAddressStrId,
          });
        } catch (error) {}
      }
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("resultEvent", {
        data: item,
      });
      uni.navigateBack({
        delta: 1,
      });
    },

    async handleOpenSetting() {
      try {
        let { latitude, longitude } = await getAuthLocation();
        this.searchLocation({
          lon: longitude,
          lat: latitude,
        });
      } catch (e) {
        console.log("获取位置失败商城", e);
        uni.showModal({
          title: "提示",
          content: "您拒绝了位置的授权，不可使用",
          showCancel: false,
          success: function (res) {
            //打开设置
            uni.openSetting({
              success(res) {
                let userLocation = res.authSetting["scope.userLocation"];
                if (userLocation) {
                  // 继续进行授权成功后的操作
                } else {
                  // 用户拒接授权 给提示
                  // uni.showToast({
                  //   title: "您已拒绝位置授权",
                  //   duration: 2000,
                  // });
                }
              },
            });
          },
        });
      }
    },
    //根据经纬度查取地区
    async searchLocation(data) {
      this.isRotating = true;
      const res = await searchUserLocation({ data });
      console.log("接口返回====>", res.data, data);
      const { adcode, city, district, province, address } = res.data;
      const { lat, lon } = data;
      const cityCode = adcode.slice(0, 4) + "00";
      const provinceCode = cityCode.slice(0, 2) + "0000";

      uni.setStorageSync("lon", data.lon);
      uni.setStorageSync("lat", data.lat);
      uni.setStorageSync("province", province);
      uni.setStorageSync("provinceCode", provinceCode);
      uni.setStorageSync("city", city);
      uni.setStorageSync("cityCode", cityCode);
      uni.setStorageSync("district", district);
      uni.setStorageSync("adcode", adcode);
      uni.setStorageSync("currentCity", city);
      uni.setStorageSync("selectedCityCode", cityCode);
      uni.setStorageSync("address", address);
      // 在地址选择页面点击从新获取时把当前地址存到storage中 并且把是否开启定位变更为true
      uni.setStorageSync("addressList", { ...res.data, ...data });
      uni.setStorageSync("mall_last_search_address_obj", {
        ...res.data,
        ...data,
      });
      this.naddress = address;
      this.naddressList = { ...res.data, ...data };
      this.setOpenSetting(true);
      uni.setStorageSync("medicine_openSetting_first", true);
      setTimeout(() => {
        this.isRotating = false;
        this.naddressClick();
      }, 500);
    },

    async naddressClick() {
      const item = this.naddressList;
      console.log(item, "选择了当前定位的地址");
      item.isDeliveryAddress = false;
      uni.setStorageSync("mall_last_search_address_obj", item);
      this.setSelectedAddress(item);
      this.searchLoc = item.addressName;
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("resultEvent", {
        data: item,
      });
      uni.navigateBack({
        delta: 1,
      });
    },
  },
  components: {},
};
</script>

<style lang="scss">
@import "./index.scss";

.rotate {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
