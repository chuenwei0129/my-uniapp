<template>
  <view class="order">
    <view class="order-money">
      <view class="title">订单金额</view>
      <goodsPrice
        :salePrice="item.consultationOrderInfo.realPayAmount"
        :saleSignFontSize="23"
        :salePriceIntegerFontSize="34"
        :sale-color="'#1f1f1f'"
      ></goodsPrice>
    </view>
    <view class="order-info">
      <view class="order-info-number">
        <view class="title">订单编号</view>
        <view class="order-info-number-copy">
          <view class="des">{{ item.consultationOrderInfo.saleOrderNo }}</view>
          <view class="order-info-number-copy-line"></view>
          <view
            class="order-info-number-copy-text"
            @click="copy(item.consultationOrderInfo.saleOrderNo)"
            >复制</view
          >
        </view>
      </view>
      <view class="order-info-type">
        <view class="title">订单类型</view>
        <view class="des">{{ getInquiryTypeString(item.inquiryType) }}</view>
      </view>
      <view class="order-info-type">
        <view class="title">提交时间</view>
        <view class="des">{{ item.createTime }}</view>
      </view>
      <view class="order-info-type" v-if="item.state === 6">
        <view class="title">订单取消时间</view>
        <view class="des">{{ item.updateTime }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import goodsPrice from "@/components/goodsPrice/index.vue";
import { getInquiryTypeString } from "@/utils/medical";
export default {
  name: "InquiryOrderItem",
  components: { goodsPrice },
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },

  methods: {
    getInquiryTypeString,
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
.order {
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #f7f8fc;

  &-money {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    padding: 34rpx 23rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
    background: #ffffff;
    border-radius: 15rpx;
    margin-top: 19rpx;
  }

  &-info {
    display: flex;
    flex-direction: column;
    margin-left: 15rpx;
    margin-right: 15rpx;
    margin-top: 19rpx;
    padding-top: 11rpx;
    padding-bottom: 11rpx;
    background: #ffffff;
    border-radius: 15rpx;

    &-number {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 23rpx;
      flex-wrap: nowrap;
      &-copy {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        &-line {
          margin-right: 15rpx;
          margin-left: 15rpx;
          width: 1rpx;
          height: 27rpx;
          background: #cdcdcd;
        }
        &-text {
          font-size: 29rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #1f1f1f;
          line-height: 40rpx;
        }
      }
    }

    &-type {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 23rpx;
    }
  }

  .title {
    font-size: 29rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #1f1f1f;
    line-height: 40rpx;
  }
  .des {
    font-size: 29rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
    max-width: 500rpx;
    text-align: right;
  }
}
</style>
