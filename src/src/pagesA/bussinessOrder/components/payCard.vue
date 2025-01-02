<template>
  <view class="panel-wrappper">
    <view class="title">支付信息</view>
    <view class="service-info">
      <view class="info-item">
        <view class="left"
          ><image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/weixinpay.png"
            mode="scaleToFill"
          />
        </view>
        <view class="mid">微信支付</view>
        <view
          @click="
            () => {
              handlePay(0);
            }
          "
          :class="['right', checkedIndex == 0 ? 'checked' : 'uncheck']"
        ></view>
      </view>
      <!-- <view class="info-item">
        <view class="left"
          ><image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/alipay.png"
            mode="scaleToFill"
        /></view>
        <view class="mid">支付宝支付</view>
        <view
          @click="
            () => {
              handlePay(1);
            }
          "
          :class="['right', checkedIndex == 1 ? 'checked' : 'uncheck']"
        ></view>
      </view> -->
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
export default {
  //...wxShareMethod(),
  components: {},
  props: {},
  data() {
    return {
      checkedIndex: 0,
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
  methods: {
    handlePay(index) {
      this.checkedIndex = index;
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
  .title {
    @include textfclaw(31rpx, #323232);
    text-align: left;
    font-weight: bold;
    padding-bottom: 31rpx;
    border-bottom: 2rpx solid #ececec;
  }
  .service-info {
    padding-top: 29rpx;
    .info-item {
      display: flex;
      margin-bottom: 33rpx;
      align-items: center;
      .left {
        image {
          height: 62rpx;
          width: 62rpx;
          object-fit: cover;
        }
      }
      .mid {
        flex: 1;
        margin-left: 23rpx;
        @include textfclaw(27rpx, #333);
        text-align: left;
      }
      .right {
        height: 42rpx;
        width: 42rpx;
        &.checked {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/checked.png"
          );
        }
        &.uncheck {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/uncheck.png"
          );
        }
      }
      .special-right {
        color: rgba(255, 91, 5, 1);
        font-family: D-DIN-Bold;
        font-size: 46rpx;
        span {
          display: inline-block;
          font-size: 23rpx;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
