<template>
  <view class="panel-wrappper">
    <view class="service-info">
      <view class="info-item">
        <view class="left">商品金额</view>
        <view class="right">¥&nbsp;{{ amountInfo.productPrice }}</view>
      </view>
      <view class="info-item">
        <view class="left">运费</view>
        <view class="right">¥&nbsp;{{ amountInfo.freight }}</view>
      </view>
      <view class="info-item">
        <view class="left">合计</view>
        <view class="special-right"
          ><span>¥</span>{{ amountInfo.totalPrice }}</view
        >
      </view>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
export default {
  //...wxShareMethod(),
  components: {},
  props: {
    amountInfo: {
      type: Object,
    },
  },
  data() {
    return {};
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
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 33rpx;
      .left {
        @include textfclaw(31rpx, #000);
        font-weight: bold;
      }
      .right {
        @include textfclaw(27rpx, #000);
        font-weight: 400;
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
