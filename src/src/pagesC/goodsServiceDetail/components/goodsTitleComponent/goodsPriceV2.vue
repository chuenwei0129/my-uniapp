<template>
  <view class="goods-price">
    <view class="price-box">
      <view class="unit">¥</view>
      <view class="discounts">
        <text>{{ salePriceInteger }}</text>
        <text v-if="salePriceDecimal.length > 0" class="decimals">
          {{ "." + salePriceDecimal }}
        </text>
      </view>
      <view class="discount-dsc" v-if="originPricePrefix && isShowSpecialPrice">
        <view class="title">{{ originPricePrefix }}</view>
        <i class="iconfont icon-ygj1"></i>
      </view>
      <view v-if="originPricePrefix && isShowSpecialPrice" class="original"
        >¥{{ salePrice || "" }}</view
      >
    </view>
    <view v-if="showSales && salesNum != null" class="sales">
      已售{{ salesNum }}
    </view>
  </view>
</template>

<script>
import { formatFloat } from "@/utils";

export default {
  name: "goodsPriceV2",
  props: {
    salePrice: {
      type: String,
    },
    specialPrice: {
      type: String,
    },
    originPricePrefix: {
      type: String,
    },
    salesNum: {
      type: [String, Number],
      default: "0",
    },
    showSales: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    salePriceInteger() {
      const price = this.isShowSpecialPrice
        ? this.specialPrice
        : this.salePrice;
      const salePriceNum = Number.parseFloat(price);
      if (salePriceNum !== salePriceNum) {
        return "0";
      }
      const num = salePriceNum.toFixed(2);
      return `${num}`.split(".")[0];
    },
    salePriceDecimal() {
      const price = this.isShowSpecialPrice
        ? this.specialPrice
        : this.salePrice;
      const salePriceNum = Number.parseFloat(price);
      if (salePriceNum !== salePriceNum) {
        return "";
      }
      const num = salePriceNum.toFixed(2);
      const res = `${num}`.split(".")[1];
      if (res === "00") {
        return "";
      }
      if (res.substring(1, 2) === "0") {
        return res.substring(0, 1);
      }

      return res;
    },
    isShowSpecialPrice() {
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) {
        return false;
      }
      if (this.specialPrice == "-1") {
        return false;
      }
      if (!this.specialPrice) return false;
      const salePriceNum = Number.parseFloat(this.salePrice);
      const specialPriceNum = Number.parseFloat(this.specialPrice);
      console.log("99999==========>", salePriceNum, specialPriceNum);
      if (salePriceNum <= specialPriceNum) return false;

      return true;
    },
  },
  data() {
    return {};
  },
  created() {
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
    formatFloat,
    priceList(index) {
      let str = this.specialPrice;
      let part = str?.split(".");
      return part[index] < 0 ? 0 : part[index];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.goods-price {
  font-family: PingFangSC, PingFang SC;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 23rpx;
  // margin-top: 28.85rpx;
  .price-box {
    display: flex;
    align-items: flex-end;
    view {
      display: inline-block;
    }
    .unit {
      font-weight: 600;
      @include textfclaw(31rpx, #ff2538, left);
      // background-color: skyblue;
    }
    .discounts {
      font-family: D-DIN, D-DIN-Bold;
      @include textfclaw(62rpx, #ff2538, left, 54rpx);
      margin-right: 12rpx;
      // background-color: skyblue;
      .decimals {
        font-size: 42rpx;
        line-height: 38rpx;
      }
    }
    .discount-dsc {
      width: 94rpx;
      // height: 38rpx;
      position: relative;
      @include flex();
      margin-right: 10rpx;
      // background-color: skyblue;
      .title {
        width: 94rpx;
        font-weight: 500;
        @include textfclaw(21rpx, #ffffff, center);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .iconfont {
        color: #fe2442;
        font-size: 38rpx;
      }
    }
    .original {
      // background-color: skyblue;

      @include textfclaw(25rpx, #999999, left, 25rpx);
    }
  }
  .sales {
    font-weight: 300;
    @include textfclaw(23rpx, #666666, left, 33rpx);
  }
}
</style>
