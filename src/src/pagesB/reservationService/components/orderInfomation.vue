<template>
  <view class="content">
    <view class="frame">
      <view class="title">订单信息</view>
      <view class="line"></view>
      <view class="m-row">
        <view class="row-left">预约订单编号</view>
        <view class="copy">
          <view class="order">{{ detail.reservationNo }}</view>
          <view class="divider"></view>
          <view class="order-cp" @click="handleClip">复制</view>
        </view>
      </view>
      <view class="m-row">
        <view class="row-left">下单时间</view>
        <view class="row-right">{{ detail.createdTime }}</view>
      </view>
      <view class="m-row">
        <view class="row-left">预约类型</view>
        <view class="row-right">{{ showType() }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    detail: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  onReady() {},
  onShow() {},
  onLoad(options) {},
  methods: {
    handleClip() {
      uni.setClipboardData({
        data: this.detail.reservationNo,
        success: function () {
          console.log("success");
        },
      });
    },

    showType() {
      if (this.detail.type == 1) {
        return "预约美洗";
      } else if (this.detail.type == 2) {
        return "挂号";
      }
      if (this.detail.type == 3) {
        return "驱虫";
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

.content {
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 19rpx;
  border-radius: 24rpx;

  .frame {
    width: 100%;
    height: 100%;
    padding: 0rpx 30rpx 20rpx;
  }

  .title {
    height: 105rpx;
    font-size: 29rpx;
    font-weight: 500;
    color: #1f1f1f;
    line-height: 105rpx;
  }

  .line {
    height: 2rpx;
    border: 1rpx solid #f8f8f8;
    margin-bottom: 10rpx;
  }

  .m-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 86rpx;

    .row-left {
      min-width: 160rpx;
      height: 38rpx;
      font-size: 29rpx;
      color: #1f1f1f;
    }

    .row-right {
      flex: auto;
      font-size: 29rpx;
      color: #666666;
      text-align: right;
      word-break: break-all;
    }

    .copy {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      flex: 1;

      .order {
        font-size: 29rpx;
        color: #666666;
      }

      .divider {
        width: 2rpx;
        height: 27rpx;
        border: 2rpx solid #cdcdcd;
        margin: 0 15rpx;
      }

      .order-cp {
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
      }
    }
  }
}
</style>
