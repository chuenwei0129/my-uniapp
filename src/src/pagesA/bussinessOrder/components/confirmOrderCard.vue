<template>
  <view class="panel-wrappper">
    <view class="title">
      <image :src="productInfo.shopImage" mode="scaleToFill" />
      <view class="shop-name">{{ productInfo.shopName }}</view>
      <!-- <view class="status-tag">待付款</view> -->
    </view>
    <view v-for="(item, index) in productInfo.productList">
      <view class="product-item">
        <view class="first-row">
          <view class="item-name">{{ item.productName }}</view>
          <view class="price"><span>¥</span>{{ item.price }}</view>
        </view>
        <view class="sec-row">
          <view>数量</view>
          <view>x{{ item.quantity }}</view>
        </view>
      </view></view
    >

    <view class="service-info">
      <view class="info-item">
        <view class="left">配送服务</view>
        <view class="right">{{ delivery }}</view>
      </view>
      <view class="info-item">
        <view class="left">退换货说明</view>
        <view class="right" style="color: #999"
          >药品属于特殊商品，无质量问题概不退换</view
        >
      </view>
      <view class="info-item">
        <view class="left">优惠</view>
        <view class="right">无可用</view>
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
    delivery: {
      type: String,
    },
    productInfo: {
      type: Object,
    },
    orderStatus: {
      type: String,
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
  padding: 31rpx;
  background-color: #fff;
  border-radius: 15rpx;
  .title {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 31rpx;
    image {
      height: 38rpx;
      width: 38rpx;
      object-fit: cover;
      border-radius: 50%;
    }
    .shop-name {
      @include textfclaw(27rpx, #000);
      font-weight: bold;
      margin-left: 12rpx;
    }
    .status-tag {
      width: 81rpx;
      @include textfclaw(27rpx, #ff5b05);
      flex: 1;
      text-align: right;
    }
  }
  .product-item {
    padding-left: 54rpx;
    padding-bottom: 40rpx;
    .first-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      .item-name {
        @include textfclaw(29rpx, #000);
        text-align: left;
        font-weight: bold;
        width: 438rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 2; //显示的行
        font-weight: bold;
      }
      .price {
        @include textfclaw(38rpx, #000);
        font-family: D-DIN-Bold;
        span {
          display: inline-block;
          font-size: 27rpx;
          margin-right: 5rpx;
        }
      }
    }
    .sec-row {
      display: flex;
      justify-content: space-between;
      @include textfclaw(27rpx, #999);
      font-weight: 400;
      align-items: flex-end;
    }
    // &:last-of-type {
    // }
  }

  .service-info {
    padding-top: 29rpx;
    border-top: 2rpx solid #ececec;
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 33rpx;
      .left {
        @include textfclaw(27rpx, #999);
        font-weight: 400;
      }
      .right {
        @include textfclaw(27rpx, #333);
        font-weight: 400;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
