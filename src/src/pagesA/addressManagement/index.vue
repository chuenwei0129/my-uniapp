<template>
  <view class="address-card">
    <view class="list" v-if="addressList.length > 0">
      <view
        class="address-item"
        v-for="(item, index) in addressList"
        :key="item.name"
      >
        <view class="info">
          <view
            class="left"
            @click="
              () => {
                handleChooseAdd(item);
              }
            "
          >
            <view class="base">
              <view class="name">
                {{ item.name }}<text class="phone"> {{ item.phone }} </text>
              </view>
              <view class="isDefault" v-if="item.defaultFlag">默认</view>
            </view>
            <view class="ads">{{ item.addressName }}</view>
          </view>
          <view
            class="right"
            @click="
              () => {
                handleEdit(item);
              }
            "
          ></view>
        </view>
        <view class="line" v-if="index !== addressList.length - 1"></view>
      </view>
      <view class="add-btn">
        <view class="adds-text" @click="handleAdd">添加收货地址</view>
        <u-safe-bottom></u-safe-bottom>
      </view>
    </view>
    <view class="empty" v-else>
      <view class="empty-icon"></view>
      <view class="empty-text">暂无地址信息</view>
      <view class="empty-add" @click="handleAdd">添加收货地址</view>
    </view>
  </view>
</template>

<script>
import { getAddressList } from "@/api/base/index";
import { EDIT_ADDRESS } from "@/api/pay";
import { mapState, mapMutations } from "vuex";
import { debounce } from "@/utils/index";

export default {
  data() {
    return {
      addressList: [],
    };
  },
  computed: {
    ...mapState(["addressId"]),
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
  mounted() {
    this.handleAdd = debounce(this.handleAdd, 500);
    this.handleEdit = debounce(this.handleEdit, 500);
  },
  onShow() {
    console.log("chufa");
    getAddressList().then((res) => {
      this.addressList = res.data.data;
    });
  },
  onReady() {},
  methods: {
    ...mapMutations(["setAddressId"]),
    handleAdd() {
      uni.navigateTo({
        url: `/pagesA/addressManagement/addressDetail/index?openType=add`,
      });
    },
    handleEdit(item) {
      uni.navigateTo({
        url: `/pagesA/addressManagement/addressDetail/index?openType=edit&id=${item.userAddressStrId}`,
      });
    },
    async handleChooseAdd(item) {
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
  },
  components: {},
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
