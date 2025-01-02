<template>
  <view class="goods-wrapper" v-if="!isRequesting || isflag">
    <view v-if="showAppointmentStatus" class="reserved" @click="gotoPage">
      <image
        class="date-icon"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/date.png"
      />
      <text class="reserved-text"> 我预约的宠物 </text>
      <!-- <image
        class="right-icon"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_right.png"
      ></image> -->
      <u-icon name="play-right-fill" color="#666666" size="8"></u-icon>
    </view>

    <!-- 活体商品列表 -->
    <LivedBodyGoodsList
      :goodsList="goodsList"
      :isRequesting="isRequesting"
      :isLoading="isLoading"
      :tabList="tabList"
      :recommendedShop="recommendedShop"
      :tabIndex="tabIndex"
      :tabId="tabId"
      :breedId="breedId"
      :filterData="filterData"
      :tabName="tabName"
      @handleRefresh="handleRefresh"
    />
  </view>
</template>

<script>
import LivedBodyGoodsList from "./livedBodyGoodsList.vue";

import { GET_APPOINTMENT_STATUS } from "@/api/livedBody";
export default {
  props: {
    goodsList: {
      type: Array,
      default: [],
    },
    tabList: {
      type: Array,
      default: [],
    },
    isRequesting: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    isflag: {
      type: Boolean,
      default: true,
    },
    recommendedShop: {
      type: Object,
      default: {},
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    tabId: {
      type: String,
      default: "",
    },
    breedId: {
      type: String,
      default: "",
    },
    filterData: {
      type: Object,
      default: {},
    },
    tabName: {
      type: String,
      default: "",
    },
    showAppointmentStatus: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LivedBodyGoodsList,
  },
  data() {
    return {
      // showAppointmentStatus: false,
    };
  },
  mounted() {
    // this.getAppointmentStatus();
    console.log("tabName===2", this.tabName);
  },
  methods: {
    handleRefresh(data) {
      this.$emit("handleRefresh", data);
    },
    gotoPage() {
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pagesB/myReservation/index?current=1",
      });
      //#endif

      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesB/myReservation/index?current=1`,
      });
      //#endif
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-wrapper {
  // padding: 15rpx 0;
  // padding-top: 12rpx;
  background: #fff;
  .reserved {
    height: 77rpx;
    background: #f7f8fc;
    border-radius: 15rpx;
    padding: 19rpx 23rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 18rpx 0;
    // margin-top: 10rpx;

    .date-icon {
      width: 39rpx;
      height: 39rpx;
      margin-right: 16rpx;
    }
    .reserved-text {
      flex: 1;
      font-size: 27rpx;
      color: #333333;
    }
    .right-icon {
      width: 26rpx;
      height: 26rpx;
    }
  }
}
</style>
