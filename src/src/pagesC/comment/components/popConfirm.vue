<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="content">
      <view class="contentImg"></view>
      <div class="content-title">确定要删除评价吗？</div>
      <scroll-view scroll-y class="content-top">
        <div class="content-item">
          删除后，您的评价将在商品详情页中<br/>同步删除
        </div>
      </scroll-view>
      <view class="footer">
        <view class="cancel" @click="handleClose">取消 </view>
        <view class="line2"></view>
        <view class="confirm" @click="handleConfirm">确定 </view>
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
    messagePop: {
      type: String,
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:show", false);
    },
    handleConfirm(){
      this.$emit("handleConfirm");
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss" ;
.content {
  width: 577rpx;
  height: 331rpx;
  background: #ffffff;
  border-radius: 38rpx;
  padding: 46rpx 38rpx 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  word-break: break-all;
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
  .content-title{
    height: 42rpx;
    font-weight: 500;
    font-size: 31rpx;
    color: #1F1F1F;
    line-height: 42rpx;
    text-align: center;
  }
  .content-top {
    height: 448rpx;
    border-bottom: 1rpx solid #e6e6e6;
    padding: 30rpx 0 0;
    box-sizing: border-box;
    overflow-y: auto;
    @include textfclaw(27rpx, #333333, $align: left, $lineH: 38rpx);
    .content-item{
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 27rpx;
      color: #333333;
      line-height: 38rpx;
      text-align: center;
      font-style: normal;
    }
  }
  .content-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 94rpx;
    box-sizing: border-box;
    .know {
      width: 100%;
      font-weight: 500;
      text-align: center;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
  }
}
.footer {
    display: flex;
    align-items: center;
    .cancel {
      flex: 1;
      font-size: 31rpx;
      color: #25252a;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 94rpx;
    }
    .line2 {
      width: 2rpx;
      height: 38rpx;
      background-color: #e6e6e6;
    }
    .confirm {
      flex: 1;
      height: 94rpx;
      font-weight: bold;
      font-size: 31rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1F1F1F;
    }
  }
</style>
