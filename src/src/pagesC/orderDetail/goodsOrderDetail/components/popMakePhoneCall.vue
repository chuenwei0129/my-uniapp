<template>
  <u-popup
    :show="show"
    mode="bottom"
    @close="close"
    :round="20"
    @tap.stop.prevent
    @touchmove.stop.prevent
    :customStyle="{ height: '884rpx' }"
  >
    <view class="petPop">
      <view class="icon" @click="close">
        <view class="icon-box">
          <image :src="iconUrl" mode="scaleToFill" />
        </view>
      </view>

      <image :src="imgUrl" mode="scaleToFill" />
      <view class="tip">请确认呼出号码</view>
      <view class="phone">{{ formatPhone }}</view>
      <view class="warnTip">为保障服务质量，你的通话可能被录音</view>
      <view class="footers" @click="getSecretNo">
        <view class="new">
          <view class="text">确认并呼叫(加密)</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { formatFloat } from "@/utils";

export default {
  props: {
    show: {
      type: Boolean,
    },
    phone: {
      type: String,
    },
  },
  data() {
    return {
      iconUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/closeIcon.png",
      imgUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/noContent.png",
    };
  },
  computed: {
    formatPhone() {
      return this.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3");
    },
  },
  onLoad() {},
  onReady() {},
  methods: {
    getSecretNo() {
      // 配送员电话 订单详情 deliveryPersonnelNumber，我的电话deliveryInfo.phone
      // userPhoneNumber: 用户手机号 horsePhoneNumber: 骑士手机号
      this.$emit("callprivacyno-events");
      console.log("dada");
      this.close();
    },
    close() {
      console.log("关闭弹窗");
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.petPop {
  height: 885rpx;
  text-align: center;
  .icon {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      background-color: #ecedf1;
      margin: 28rpx 28rpx 0 0;
      image {
        width: 31rpx;
        height: 31rpx;
        margin: 0;
      }
    }
  }
  image {
    // margin-top: 54rpx;
    width: 346rpx;
    height: 346rpx;
  }
  .tip {
    margin-top: 38rpx;
    color: #1f1f1f;
    font-size: 42rpx;
    line-height: 58rpx;
    font-weight: 500;
  }
  .phone {
    color: #1f1f1f;
    font-size: 58rpx;
    line-height: 81rpx;
    font-weight: 600;
    margin-bottom: 23rpx;
  }
  .warnTip {
    color: #fe2442;
    font-size: 25rpx;
    line-height: 35rpx;
    font-weight: 400;
    margin-bottom: 73rpx;
  }
}
// .petPop {
//   position: relative;
//   left: 0;
//   top: 0;
//   box-sizing: border-box;
// }
// .header {
//   box-sizing: border-box;
//   padding: 40rpx 38rpx;
//   display: flex;
//   align-items: center;
//   font-weight: bold;
//   position: relative;
//   height: 885rpx;

//   .title {
//     font-size: 46rpx;
//     font-weight: bold;
//     color: #333333;
//     text-align: center;
//     position: absolute;
//     left: 50%;
//     transform: translateX(-50%);
//   }

//   .close-icon {
//     height: 42rpx;
//     width: 42rpx;
//     @include bg(
//       "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/close-icon.png"
//     );
//     position: absolute;
//     right: 38rpx;
//   }
// }
// .content {
//   padding: 38rpx 31rpx;
//   .title {
//     @include textfclaw(31rpx, #323232);
//     text-align: left;
//     font-weight: bold;
//     padding-bottom: 31rpx;
//   }
//   .service-info {
//     // padding-top: 29rpx;
//     .info-item {
//       display: flex;
//       margin-bottom: 33rpx;
//       align-items: center;
//       justify-content: center;
//     }
//   }
// }
.footers {
  box-sizing: border-box;
  padding: 13rpx 38rpx;
  .new {
    background-color: #fee900;
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 48px;

    .text {
      font-size: 35rpx;
      font-weight: 500;
      line-height: 48rpx;
      color: #1f1f1f;
    }
  }
}
// .card-wrapper {
//   width: 673rpx;
//   margin-bottom: 19rpx;
//   padding-left: 42rpx;
//   padding-right: 31rpx;
//   .checked {
//     height: 48rpx;
//     width: 48rpx;
//     @include bg(
//       "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/checked.png"
//     );
//   }
//   .uncheck {
//     height: 48rpx;
//     width: 48rpx;
//     @include bg(
//       "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/uncheck.png"
//     );
//   }
//   .time-zone {
//     @include textfclaw(21rpx, #999);
//     height: 31rpx;
//     font-weight: 400;
//     // float: right;
//     text-align: right;
//     padding-top: 19rpx;
//   }
// }
</style>
