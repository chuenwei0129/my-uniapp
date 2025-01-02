<template>
  <!-- 按钮组 -->
  <view>
    <view :class="num ? 'content' : 'content-more'">
      <image v-if="num" :src="moreBg" mode="scaleToFill" />
      <image v-else :src="moreBgTwo" mode="scaleToFill" />
      <view class="item">
        <view v-for="(item, index) in btnList" :key="item.id">
          <view class="item-top" @click.stop="handleMakeCall(item)">{{
            item.name
          }}</view>
          <view v-if="btnList.length - index > 1" class="line"></view>
        </view>
      </view>
    </view>
    <!-- 拨打电话 -->
  </view>
</template>

<script>
export default {
  name: "",
  components: {},

  props: {
    orderDetail: {
      type: Object,
    },
    btnList: {
      type: Array,
    },
    num: {
      type: Boolean,
    },
    deliveryStatus: {
      type: Number,
    },
    shopPhone: {
      type: String,
    },
  },
  data() {
    return {
      phone: "",
      moreBg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/moreBg.png",
      moreBgTwo:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/moreBgTwo.png",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleMakeCall(value) {
      const deliveryStatus = this.deliveryStatus;
      const length = this.btnList.length;
      console.log("value.id", value.id, length, value);
      if (value.id == 1) {
        this.$emit("burialpointevents", "Orderdetails_contacstore_click");
        // 联系门店
        console.log("联系门店");
        uni.makePhoneCall({
          // 手机号
          phoneNumber: this.shopPhone,
        });
        // plus.device.dial(this.shopPhone, false);
      } else if (value.id == 2 && value.name == "取消订单") {
        // 取消订单
        this.$emit("child-events", 1);
        console.log("取消订单");
      } else if (value.id == 2 && value.name == "申请售后") {
        // 申请售后
        this.$emit("child-events", 2);
        console.log("申请售后");
      } else if (value.id == 3) {
        // 删除订单
        this.$emit("child-events", 3);
        console.log("删除订单");
      }
      this.$emit("close-more");
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  width: 244rpx;
  height: 184rpx;
  margin-left: 13rpx;
  position: relative;
  text-align: center;
  img {
    margin-top: 10rpx;
    width: 217rpx;
    height: 167rpx;
    z-index: 10;
  }
  .item {
    padding: 19rpx 30rpx;
    width: 217rpx;
    height: 167rpx;
    z-index: 100;
    // margin-top: 20rpx;
    // margin-bottom: 30rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .item-top {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 9rpx;
      color: #333333;
      font-size: 29rpx;
      line-height: 40rpx;
      font-weight: 500;
      height: 100%;
    }
    .line {
      text-align: center;
      margin: 15rpx 0 15rpx 15rpx;
      width: 139rpx;
      border-bottom: 2rpx solid #f8f8f8;
    }

    // margin-top: -100rpx !important;

    // .line:last-child {
    //   border-bottom: none;
    // }
  }
}
.content-more {
  width: 244rpx;
  height: 256rpx;
  margin-left: 13rpx;
  position: relative;
  text-align: center;
  img {
    margin-top: 10rpx;
    width: 217rpx;
    height: 232rpx;
    z-index: 10;
  }
  .item {
    padding: 19rpx 30rpx;
    width: 217rpx;
    height: 232rpx;
    z-index: 100;
    // margin-top: 20rpx;
    // margin-bottom: 30rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .item-top {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 9rpx;
      color: #333333;
      font-size: 29rpx;
      line-height: 40rpx;
      font-weight: 500;
      height: 100%;
    }
    .line {
      text-align: center;
      margin: 11rpx 0 12rpx 11rpx;
      width: 139rpx;
      border-bottom: 2rpx solid #f8f8f8;
    }
    .line-no {
      text-align: center;
      margin: 11rpx 0 12rpx 11rpx;
      width: 139rpx;
    }

    // margin-top: -100rpx !important;

    // .line:last-child {
    //   border-bottom: none;
    // }
  }
}
</style>
