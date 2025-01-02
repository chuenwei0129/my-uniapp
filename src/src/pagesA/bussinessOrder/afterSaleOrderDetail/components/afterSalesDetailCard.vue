<template>
  <view>
    <view class="panel-wrappper">
      <view class="detail-info">
        <view class="detail-item">
          <view class="left">退款原因</view>
          <view class="right">
            <view>{{ afterSaleOrderInfo.applyReason }}</view>
          </view>
        </view>
        <view class="detail-item">
          <view class="left">退款金额</view>
          <view class="right">
            <view>¥{{ afterSaleOrderInfo.realRefundAmount }}</view>
          </view>
        </view>
        <view class="detail-item">
          <view class="left">申请时间</view>
          <view class="right">
            <view>{{ afterSaleOrderInfo.createTime }}</view>
          </view>
        </view>
        <view class="detail-item">
          <view class="left">订单编号</view>
          <view class="right">
            <view>{{ afterSaleOrderInfo.orderNo }}</view>
            <view @click="handleClip">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/copy-tag.png"
                mode="scaleToFill"
            /></view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-wrapper">
      <view class="left">
        <view style="font-size: 27rpx; color: #000">遇到问题？</view>
        <view
          style="
            font-size: 23rpx;
            color: rgba(153, 153, 153, 1);
            margin-top: 10rpx;
          "
          >服务时间：工作日9:00-18:00</view
        >
      </view>
      <view class="right" @click="handleMakeCall"
        ><image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/phone-tag.png"
          mode="scaleToFill"
        />
        拨打电话</view
      >
    </view>
    <!-- <PopMakePhoneCall
      :is-open.sync="isShowPopCall"
      :phone-list="afterSaleOrderInfo.shopServicePhone"
    /> -->
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import PopMakePhoneCall from "../../orderDetail/components/popMakePhoneCall.vue";

export default {
  //...wxShareMethod(),
  components: { PopMakePhoneCall },
  props: {
    afterSaleOrderInfo: {
      type: Object,
    },
  },
  data() {
    return { isShowPopCall: false };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  methods: {
    handleMakeCall() {
      if (
        Array.isArray(this.afterSaleOrderInfo.shopServicePhone) &&
        this.afterSaleOrderInfo.shopServicePhone.length
      ) {
        this.isShowPopCall = true;
        this.$emit('show')
      }
      // if (this.afterSaleOrderInfo.merchantPhone) {
      //   uni.makePhoneCall({
      //     phoneNumber: this.afterSaleOrderInfo.merchantPhone, //仅为示例
      //   });
      // }
    },
    handleClip() {
      uni.setClipboardData({
        data: this.afterSaleOrderInfo.orderNo,
        success: function () {
          console.log("success");
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

.panel-wrappper {
  width: 704rpx;
  margin: 0 auto;
  margin-bottom: 19rpx;
  position: relative;
  padding: 38rpx 31rpx;
  background-color: #fff;
  border-radius: 15rpx;
  .detail-info {
    .detail-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 33rpx;
      .left {
        @include textfclaw(27rpx, #999);
        font-weight: 400;
        text-align: left;
      }
      .right {
        display: flex;
        text-align: right;
        align-items: center;
        @include textfclaw(27rpx, #333);
        font-weight: 400;
        image {
          width: 23rpx;
          height: 25rpx;
          object-fit: cover;
          margin-left: 15rpx;
        }
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include textfclaw(27rpx, #000);
    .row-item {
      display: flex;
      image {
        height: 35rpx;
        width: 35rpx;
        object-fit: cover;
        margin-right: 12rpx;
      }
    }
  }
}
.bottom-wrapper {
  position: relative;
  height: 140rpx;
  background-color: #fff;
  border-radius: 15rpx;
  width: 704rpx;
  margin: 0 auto;
  .left {
    position: absolute;
    top: 38rpx;
    left: 31rpx;
  }
  .right {
    display: flex;
    position: absolute;
    top: 38rpx;
    right: 31rpx;
    font-size: 27rpx;
    color: #000;
    image {
      height: 35rpx;
      width: 35rpx;
      object-fit: cover;
      margin-right: 12rpx;
    }
  }
}
</style>
