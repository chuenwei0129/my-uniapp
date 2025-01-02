<template>
  <view class="panel-wrappper">
    <view class="service-info">
      <view class="first-row">
        <view class="tag">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/aftersale-finish.png"
            mode="scaleToFill"
          />
        </view>
        <view class="status-name">{{
          afterSaleStatusEnum[afterSaleOrderInfo.afterSaleStatus]
        }}</view>
        <view class="time">{{ afterSaleOrderInfo.createTime }}</view>
        <view class="price">
          <text class="unit">¥</text>
          <text>{{ afterSaleOrderInfo.realRefundAmount }}</text>
        </view>
      </view>
      <view class="sec-row"> 已将钱款退回支付账户，预计2小时内到账 </view>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import { orderStatus, afterSaleStatus, afterSaleType } from "../../lib/data";

export default {
  //...wxShareMethod(),
  components: {},
  props: {
    afterSaleOrderInfo: {
      type: Object,
    },
  },
  data() {
    return {
      afterSaleStatusEnum: afterSaleStatus,
    };
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
  methods: {},
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
  .service-info {
    .first-row {
      display: flex;
      align-items: center;
      margin-bottom: 19rpx;
      .tag {
        margin-right: 12rpx;
        image {
          height: 35rpx;
          width: 35rpx;
          object-fit: cover;
        }
      }
      .status-name {
        margin-right: 19rpx;
        @include textfclaw(31rpx, rgba(42, 44, 51, 1));
        font-weight: bolder;
      }
      .time {
        flex: 1;
        @include textfclaw(25rpx, #666);
        text-align: left;
      }
      .price {
        color: rgba(255, 91, 5, 1);
        font-family: D-DIN-Bold;
        font-size: 46rpx;
        .unit {
          font-size: 23rpx;
        }
      }
    }
    .sec-row {
      @include textfclaw(25rpx, #666);
      text-align: left;
    }
  }
}
</style>
