<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @touchmove.stop.prevent
  >
    <view class="content">
      <view class="contentImg"></view>
      <view class="content-top">
        <text v-if="deliveryRangeCode == '30001'">
          {{ messagePop }}
        </text>
        <text v-else class="typeMessage">{{ messagePop }}</text>
      </view>
      <view class="content-bottom">
        <template v-if="deliveryRangeCode == '30001'">
          <view class="cancel" @click="handleCancel(true)">取消</view>
          <view class="confirm" @click="handleConfirm">确定</view>
        </template>
        <view v-else class="know" @click="handleCancel(false)">好的</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "outdistance",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    deliveryRangeCode: {
      type: [String, Number], // 30001 :超出门店配送范围 30000 :超出配送范围
    },
    cancelOrRightBackfc: {
      type: Function,
    },
    messagePop: {
      type: String,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      msg_1: "当前收货地址超出门店配送范围，是否改为由胖胖云超发货？",
      msg_2: "当前收货地址超出配送范围，请重新选择商品",
    };
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    // 好的/取消 按钮
    handleCancel(isBack) {
      this.close();
      if (this.isLive) {
        this.$emit("handleLiveOk", true);
        return;
      }
      if(!isBack){
        this.$emit("handleLiveOk", true);
        return
      }
      if (this.cancelOrRightBackfc) {
        this.cancelOrRightBackfc();
      }
    },
    // 确认按钮
    handleConfirm() {
      this.close();
      this.$emit("confirmBackfc", true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../utils/fn.scss";
.content {
  width: 577rpx;
  height: 288rpx;
  background: #ffffff;
  border-radius: 38rpx;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  .contentImg {
    position: absolute;
    top: -27rpx;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 346rpx;
    height: 231rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/popovercutePet.png"
    );
  }
  .content-top {
    width: 100%;
    flex: 1;
    padding-top: 77rpx;
    box-sizing: border-box;
    @include textfclaw(27rpx, #000000, $align: center, $lineH: 38rpx);
    text{
      display: inline-block;
      box-sizing: border-box;
      width: 513rpx;
    }
    .typeMessage {
      width: 430rpx;
    }
  }
  .content-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 27rpx auto 28rpx;
    height: 94rpx;
    box-sizing: border-box;
    border-top: 1rpx solid #e6e6e6;
    margin: 0 38rpx;
    .cancel {
      width: 50%;
      @include textfclaw(31rpx, #25252a, $align: center, $lineH: 42rpx);
      border-right: 1rpx solid #e6e6e6;
    }
    .confirm {
      width: 50%;
      font-weight: 500;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
    .know {
      width: 100%;
      font-weight: 500;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
  }
}
</style>
