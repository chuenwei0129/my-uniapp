<template>
  <view class="view" v-show="isShowContent">
    <view class="box" v-if="hasData">
      <view class="header">
        <view class="header-logitics-num fl-row-bet-start">
          <view> {{ logistics.expName + " " + logistics.number }}</view>
          <view @click="copy(logistics.number)">复制</view>
        </view>
        <view class="line"></view>
      </view>

      <logistics-step :logistics-data="logisticsList"></logistics-step>
      <view class="line-container">
        <view class="line"></view>
      </view>
      <view class="footer">
        <view class="footer-logitics-info">
          <!--        <image-->
          <!--            style="width: 44rpx; height: 44rpx;margin-right: 17rpx"-->
          <!--            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/reservation/iphone.png"-->
          <!--            mode="aspectFit"-->
          <!--        ></image>-->
          <view class="icon">
            <view class="icon-bg">
              <view class="icon-text">收</view>
            </view>
          </view>
          <view>{{ receiveInfo }}</view>
        </view>
      </view>
    </view>
    <view class="empty" v-else>
      <NoData
        :noDataText="'未查到物流信息'"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_order_list_empty.png"
      ></NoData>
    </view>
  </view>
</template>

<script>
import LogisticsStep from "@/pagesC/logisticsDetail/componse/logisticsStep.vue";
import { regDataList } from "@/pagesC/logisticsDetail/componse/logisticsStep.js";
import { GET_LOGISTICS_DETAIL } from "@/api/mall";
import { GET_RECOMMEND_GOODS } from "@/api/mallv2";
import NoData from "@/components/noData/index.vue";
export default {
  components: { NoData, LogisticsStep },
  data() {
    return {
      logistics: {
        courier: "",
        courierPhone: "",
        deliveryInfo: {
          address: "",
          city: "",
          cityCode: "",
          county: "",
          countyCode: "",
          deliveryStatus: "",
          lat: 0,
          logisticsCompanyCode: "",
          logisticsCompanyName: "",
          logisticsNo: "",
          lon: 0,
          name: "",
          phone: "",
          province: "",
          provinceCode: "",
          shippingType: 0,
          userAddressId: 0,
        },
        deliverystatus: "",
        expName: "",
        expPhone: "",
        expSite: "",
        issign: "",
        list: [
          {
            status: "",
            time: "",
          },
        ],
        logo: "",
        number: "",
        takeTime: "",
        type: "",
        updateTime: "",
      },
      hasData: false,
      isShowContent: false,
    };
  },

  computed: {
    receiveInfo() {
      const phone = this.logistics.deliveryInfo.phone ?? "";
      return `${this.logistics.deliveryInfo.name}，${
        phone.substr(0, 3) + "****" + phone.substring(7)
      } ${this.logistics.deliveryInfo.province} ${
        this.logistics.deliveryInfo.city
      } ${this.logistics.deliveryInfo.county} ${
        this.logistics.deliveryInfo.address
      }`;
    },
    logisticsList() {
      return regDataList(this.logistics.list);
    },
  },

  onLoad(option) {
    const orderId = option.orderId;
    console.log("onLoadonLoadonLoadonLoad:::", orderId);
    this.loadData(orderId);
  },

  methods: {
    async loadData(orderId) {
      const res = await GET_LOGISTICS_DETAIL({ orderId: orderId });
      console.log("ppppppp:", res);
      const { code, data, message } = res?.data;
      if (code === 0) {
        this.hasData = true;
        this.logistics = data;
        console.log("logisticslogistics:", this.logistics);
      } else {
        this.hasData = false;
        uni.showToast({
          title: message,
          icon: "none",
        });
      }
      this.isShowContent = true;
      console.log("kkkkkkk:", this.logisticsList);
    },

    copy(orderNum) {
      console.log(`copy${orderNum}`);
      uni.setClipboardData({
        data: orderNum,
        success: function () {
          uni.showToast({
            title: "已成功复制",
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

<style lang="scss">
@import "./index.scss";
</style>
