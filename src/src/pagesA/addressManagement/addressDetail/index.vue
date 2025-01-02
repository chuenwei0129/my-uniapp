<template>
  <view class="content">
    <view class="line"></view>
    <view class="top">
      <view class="formItem1">
        <view class="label" @click="handleChoose">地址</view>
        <view class="com" @click="handleChoose">
          <u--input
            placeholder="请选择地址"
            border="bottom"
            readonly
            v-model="addressName"
            class="input1"
            style="pointer-events: none"
            placeholderStyle="fontSize: 31rpx;color: #B0B0B0;fontWeight: 400;"
          ></u--input>
          <view class="adress-icon"></view>
        </view>
      </view>
      <view class="formItem2">
        <view class="label">门牌号</view>
        <view class="com">
          <u--input
            placeholder="请填写详细地址，例：1层101"
            border="bottom"
            v-model="houseNumber"
            placeholderStyle="fontSize: 31rpx;color: #B0B0B0;fontWeight: 400;"
          ></u--input>
        </view>
      </view>
      <view class="formItem3">
        <view class="label">标签</view>
        <view class="com">
          <view class="tag-list">
            <view
              class="tag-item"
              :class="{
                checked: item.checked,
              }"
              v-for="item in tagList"
              :key="item.label"
              @click="handleTagClick(item)"
            >
              {{ item.label }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="addressInfo">
      <view class="formItem">
        <view class="label">联系人</view>
        <view class="com">
          <u--input
            placeholder="请输入联系人姓名"
            border="bottom"
            v-model="name"
            placeholderStyle="fontSize: 31rpx;color: #B0B0B0;fontWeight: 400;"
          ></u--input>
        </view>
      </view>
      <view class="formItem">
        <view class="label">手机号</view>
        <view class="com">
          <u--input
            placeholder="请输入联系人手机号"
            border="bottom"
            v-model="phone"
            type="number"
            maxlength="11"
            placeholderStyle="fontSize: 31rpx;color: #B0B0B0;fontWeight: 400;"
          ></u--input>
        </view>
      </view>
      <div class="default">
        <div class="title">设置为默认地址</div>
        <div class="switch">
          <u-switch
            v-model="isDefault"
            activeColor="#2DCE80"
            inactiveColor="#f5f6f7"
          ></u-switch>
        </div>
      </div>
    </view>

    <view class="add-btn" v-if="openType == 'add'">
      <view class="adds-text" @click="handleAdd">保存地址</view>
      <u-safe-bottom></u-safe-bottom>
    </view>
    <view class="edit-btn" v-if="openType == 'edit'">
      <div class="button-card">
        <view class="edit-del" @click="handleDel">删除地址</view>
        <view class="edit-save" @click="handleEdit">保存地址</view>
      </div>

      <u-safe-bottom></u-safe-bottom>
    </view>
    <!-- #ifdef H5 -->
    <AmapChoose
      color="#2DCE80"
      keyMap="ff22550776f6060a4002f2c9f21609a8"
      AMapKeyWeb="ff22550776f6060a4002f2c9f21609a8"
      :show="mapshow"
      :initLocation="initLocation"
      @placeChoose="handlePlaceChoose"
      @changeShow="handleMapCancel"
    ></AmapChoose>

    <!-- #endif -->
  </view>
</template>

<script>
import {
  searchUserLocation,
  addUserAddress,
  getAddressListDetail,
  editAddress,
  delAddress,
  getAddressList,
} from "@/api/base/index";
import { mapState, mapMutations } from "vuex";
import { debounce } from "@/utils/index";
import AmapChoose from "./amap-choose/amap-choose.vue";
export default {
  data() {
    return {
      tagList: [
        {
          label: "家",
          value: 1,
          checked: false,
        },
        {
          label: "公司",
          value: 2,
          checked: false,
        },
        {
          label: "学校",
          value: 3,
          checked: false,
        },
      ],
      isDefault: false,
      openType: "",
      name: "",
      phone: "",
      addressName: "",
      houseNumber: "",
      province: "",
      city: "",
      county: "",
      address: "",
      lon: "",
      lat: "",
      countyCode: "",
      tagType: "",
      userAddressId: "",
      mapshow: false,
      initLocation: "120.00,30.28",
      // longitude: "120.00",
      // latitude: "30.28",
    };
  },
  components: { AmapChoose },

  onLoad(options) {
    this.openType = options.openType;
    if (options.openType == "edit") {
      this.userAddressId = options.id;
      this.handleGetAddressDetail(options.id);
    }
    uni.setNavigationBarTitle({
      title: options.openType === "add" ? "新增地址" : "编辑地址",
    });
    // #ifdef MP-WEIXIN
    wx.onNeedPrivacyAuthorization((resolve) => {
      // 需要用户同意隐私授权时
      // 弹出开发者自定义的隐私授权弹窗
      console.log(resolve);
    });
    // #endif

    uni.getLocation({
      type: "wgs84",
      success: function (res) {
        console.log("当前位置的经度：" + res.longitude);
        console.log("当前位置的纬度：" + res.latitude);
      },
      fail: (err) => {
        console.log("dfdfdfsd", err);
      },
    });
  },
  onReady() {
    this._mapContext = uni.createMapContext("map", this);
  },
  computed: {
    ...mapState({
      addressId: (state) => state.addressId,
    }),
  },
  methods: {
    ...mapMutations(["setAddressId", "setSelectedAddress"]),
    handleTagClick(item) {
      this.tagList = this.tagList.map((i) => {
        if (i.value == item.value) {
          return {
            ...i,
            checked: !i.checked,
          };
        } else {
          return {
            ...i,
            checked: false,
          };
        }
      });
    },
    async handlePlaceChoose(res) {
      this.mapshow = false;
      const data = {
        lon: res.longitude,
        lat: res.latitude,
      };
      try {
        const res2 = await searchUserLocation({ data });
        this.addressName = res.address;
        this.province = res2.data.province;
        this.city = res2.data.city;
        this.county = res2.data.district;
        this.address = res.address;
        this.lon = res.longitude;
        this.lat = res.latitude;
        this.countyCode = res2.data.adcode;
      } catch (error) {
        console.log(error);
      }
    },
    handleMapCancel() {
      this.mapshow = false;
    },
    handleChoose() {
      console.log("123456", 123);
      // #ifdef H5

      if (this.openType == "edit") {
        this.initLocation = `${this.lon},${this.lat}`;
      }
      this.mapshow = true;

      // #endif
      // #ifdef MP-WEIXIN
      uni.chooseLocation({
        // longitude: "120.00",
        // latitude: "30.28",
        success: async (res) => {
          console.log("????", res);
          const data = {
            lon: res.longitude,
            lat: res.latitude,
          };
          try {
            const res2 = await searchUserLocation({ data });
            this.addressName = res.name;
            this.province = res2.data.province;
            this.city = res2.data.city;
            this.county = res2.data.district;
            this.address = res.address;
            this.lon = res.longitude;
            this.lat = res.latitude;
            this.countyCode = res2.data.adcode;
          } catch (error) {
            console.log(error);
          }
        },
      });
      // #endif
    },

    handleAdd: debounce(function () {
      let that = this;
      if (!this.addressName) {
        uni.showToast({
          icon: "none",
          title: "请选择地址",
          duration: 1000,
        });
        return;
      }
      if (!this.name) {
        uni.showToast({
          icon: "none",
          title: "请输入联系人姓名",
          duration: 1000,
        });
        return;
      }
      if (!this.phone) {
        uni.showToast({
          icon: "none",
          title: "请输入手机号",
          duration: 1000,
        });
        return;
      }
      const tag = this.tagList.find((t) => t.checked);
      if (tag) {
        this.tagType = tag.value;
      }
      const params = {
        defaultFlag: Number(this.isDefault),
        name: this.name,
        phone: this.phone,
        addressName: this.addressName,
        houseNumber: this.houseNumber,
        province: this.province,
        city: this.city,
        county: this.county,
        address: this.address,
        lon: this.lon,
        lat: this.lat,
        countyCode: this.countyCode,
        tagType: this.tagType,
      };
      addUserAddress(params).then((res) => {
        uni.showToast({
          icon: "none",
          title: "新增地址成功",
          duration: 2000,
        });
        uni.$emit("addAddressClickHandle");
        getAddressList().then((resList) => {
          if (resList.data.data.length) {
            that.setAddressId(
              resList.data.data.find((i) => i.defaultFlag)?.userAddressStrId
            );
          } else {
            that.setAddressId("");
            console.log(that.addressId);
          }
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1000);
      });
    }, 1000),

    handleDel: debounce(function () {
      let that = this;
      delAddress(this.userAddressId).then((res) => {
        uni.showToast({
          icon: "none",
          title: "删除地址成功",
          duration: 2000,
        });
        const addressInfo = uni.getStorageSync("mall_last_search_address_obj");
        if (
          addressInfo &&
          addressInfo.isDeliveryAddress &&
          that.userAddressId == addressInfo.userAddressStrId
        ) {
          uni.setStorageSync("mall_last_search_address_obj", "");
          this.setSelectedAddress("");
        }
        getAddressList().then((resList) => {
          if (resList.data.data.length) {
            that.setAddressId(
              resList.data.data.find((i) => i.defaultFlag)?.userAddressStrId
            );
          } else {
            that.setAddressId("");
            console.log(that.addressId);
          }
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1000);
      });
    }, 1000),

    handleEdit: debounce(function () {
      if (!this.addressName) {
        uni.showToast({
          icon: "none",
          title: "请选择地址",
          duration: 1000,
        });
        return;
      }
      if (!this.name) {
        uni.showToast({
          icon: "none",
          title: "请输入联系人姓名",
          duration: 1000,
        });
        return;
      }
      if (!this.phone) {
        uni.showToast({
          icon: "none",
          title: "请输入手机号",
          duration: 1000,
        });
        return;
      }
      const tag = this.tagList.find((t) => t.checked);
      if (tag) {
        this.tagType = tag.value;
      }
      const params = {
        defaultFlag: Number(this.isDefault),
        name: this.name,
        phone: this.phone,
        addressName: this.addressName,
        houseNumber: this.houseNumber,
        province: this.province,
        city: this.city,
        county: this.county,
        address: this.address,
        lon: this.lon,
        lat: this.lat,
        countyCode: this.countyCode,
        tagType: this.tagType,
      };
      editAddress(this.userAddressId, params).then(() => {
        uni.showToast({
          icon: "none",
          title: "保存地址成功",
          duration: 2000,
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1000);
      });
    }, 1000),

    handleGetAddressDetail(id) {
      getAddressListDetail(id).then((res) => {
        this.isDefault = Boolean(res.data.defaultFlag);
        this.name = res.data.name;
        this.phone = res.data.phone;
        this.addressName = res.data.addressName;
        this.houseNumber = res.data.houseNumber;
        this.province = res.data.province;
        this.city = res.data.city;
        this.county = res.data.county;
        this.address = res.data.address;
        this.lon = res.data.lon;
        this.lat = res.data.lat;
        this.countyCode = res.data.countyCode;
        this.tagType = res.data.tagType;
        this.tagList = this.tagList.map((t) => {
          return {
            ...t,
            checked: t.value === res.data.tagType,
          };
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
