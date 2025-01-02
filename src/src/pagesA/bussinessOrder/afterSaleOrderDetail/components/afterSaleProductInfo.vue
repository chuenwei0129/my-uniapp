<template>
  <view class="panel-wrappper">
    <view class="title">
      <view class="shop-name">退款信息</view>
      <view class="status-tag"></view>
    </view>
    <view v-for="(item, index) in productInfo" :key="item.detailId">
      <view class="product-item">
        <view class="first-row">
          <view class="item-name">{{ item.productName }}</view>
          <view class="price"><span>¥</span>{{ item.productSalePrice }}</view>
        </view>
        <view class="sec-row">
          <view>数量</view>
          <view>x{{ item.productNum }}</view>
        </view>
      </view></view
    >
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
export default {
  //...wxShareMethod(),
  components: {},
  props: {
    productInfo: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //加载字体文件;
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
    &:last-of-type {
      padding-bottom: 0rpx;
    }
  }
}
</style>
