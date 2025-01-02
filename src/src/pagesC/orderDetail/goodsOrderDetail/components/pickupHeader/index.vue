<template>
  <!-- 自提订单信息 -->
  <view style="margin-bottom: 19rpx">
    <view class="pickup-panel">
      <view class="pp-item" style="margin-bottom: 15rpx">
        <view class="pp-title">自提点</view>
        <view class="pp-desc">{{ shopInfo.shopName }}</view>
        <view class="to-map" @click="handleSeePickup"
          >查看地图
          <view
            @click="handleOpenChoosetime"
            class="iconfont icon-arrowRight"
          ></view
        ></view>
      </view>
      <view class="add-detail">
        <view class="content">
          {{ shopInfo.shopAddressInfo.address }}
        </view>
      </view>
      <view class="pp-item" style="margin-bottom: 38rpx">
        <view class="pp-title">提货人手机号</view>
        <view class="pp-desc-phone">
          <view>
            {{ deliveryInfo.selfCheckoutPhone }}
          </view>
        </view>
      </view>
      <view class="pp-item">
        <view class="pp-title">提货时间</view>
        <view class="pp-desc-time">
          <view>{{
            deliveryInfo.selfCheckoutStartTime.substr(0, 16) +
            "-" +
            deliveryInfo.selfCheckoutEndTime.split(" ")[1].substr(0, 5),
          }}</view>
        </view>
      </view>
      <image
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/order_detail_header_line.png"
        :style="{ height: '4rpx', width: '100%' }"
        mode="scaleToFill"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    deliveryInfo: {
      type: Object,
    },
    shopInfo: {
      type: Object,
    },
  },
  data() {
    return {
      formData: {
        phone: "",
        time: "2021-08-01 10:00",
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //自提查看地址
    handleSeePickup() {
      // #ifdef MP-WEIXIN
      uni.chooseLocation({
        longitude: this.shopInfo?.shopAddressInfo.lon,
        latitude: this.shopInfo?.shopAddressInfo.lat,
        success: async (res) => {
          console.log("????", res);
          const data = {
            lon: res.longitude,
            lat: res.latitude,
          };
        },
      });
      // #endif
      // #ifdef H5
      const { shopAddressInfo, shopName = "" } = this.shopInfo;
      this.$dsBridge.call("showNavigationAlert", {
        sname: "我的位置",
        dname: shopName,
        dlat: shopAddressInfo.lat || '',
        dlon: shopAddressInfo.lon || '',
        ntype: 2, //注释(0：驾车、1：公交、2：步行)
      });
      // #endif
    },
  },
};
</script>

<style scoped lang="scss">
.pickup-panel {
  height: 325rpx;
  width: 719rpx;
  border-radius: 23rpx;
  background: #f7f8fc;
  position: relative;
  padding: 31rpx 23rpx;
  background: #ffffff;
  margin: 0 auto;
  margin-top: 20rpx;
}
.pp-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 29rpx;
  color: #1f1f1f;
  .to-map {
    display: flex;
    align-items: center;
    font-size: 23rpx;
    background: #eff0f3;
    border-radius: 21rpx;
    // padding: 10rpx 15rpx;
    padding: 10rpx 8rpx 10rpx 15rpx;
    min-width: 142rpx;
    height: 42rpx;
  }
}
.pp-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 370rpx;
}
.pp-desc-phone {
  display: flex;
  align-items: center;
  .iconfont {
    color: #666;
    width: 16px;
    height: 16px;
  }
}
.pp-desc-time {
  display: flex;
  align-items: center;
  .iconfont {
    color: #666;
    width: 16px;
    height: 16px;
  }
}

.add-detail {
  width: 100%;
  display: flex;
  margin-bottom: 31rpx;
  .content {
    font-size: 400;
    font-size: 25rpx;
    color: #666;
    line-height: 33rpx;
    text-align: left;
  }
}
</style>
