<template>
  <view class="panel-wrapper">
    <view class="status-bar">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/delivery-bar.png"
        mode="scaleToFill"
      />
    </view>
    <view class="delivery-info">
      <template v-if="!deliveryInfo.trackingNo">
        <view class="status-title">由商家配送</view>
        <view class="status-desc">暂无物流信息 </view>
        <view class="abs-zone">
          <view class="status-title abs-title">{{
            deliveryInfo.receiver.address || ""
          }}</view>
          <view class="status-desc abs-desc"
            >{{ deliveryInfo.receiver.name || "" }}&nbsp;{{
              deliveryInfo.receiver.phone || ""
            }}
          </view>
        </view>
      </template>
      <template v-else>
        <view class="status-title">{{ deliveryInfo.statusDesc }}</view>
        <view class="status-desc">{{ handleMatchDeliveryInfo }}</view>
        <view class="abs-zone">
          <view class="status-title abs-title">{{
            deliveryInfo.receiver.address
          }}</view>
          <view class="status-desc abs-desc"
            >{{ deliveryInfo.receiver.name }}&nbsp;{{
              deliveryInfo.receiver.phone
            }}
          </view>
        </view>
      </template>
    </view>
    <view
      class="to-delivery"
      v-if="deliveryInfo.trackingNo"
      @click="
        () => {
          handleGoToDelivery(orderNo);
        }
      "
    >
      <view class="text">查看物流</view> <view class="arrow"></view
    ></view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import { GET_DELIVERY_INFO } from "@/api/pay";
export default {
  //...wxShareMethod(),
  components: {},
  props: {
    trackingNo: {
      type: String,
    },
    orderNo: {
      type: String,
    },
    source:{
      default:''
    }
  },
  data() {
    return {
      deliveryInfo: {},
    };
  },
  computed: {
    handleMatchDeliveryInfo() {
      if (!this.deliveryInfo.traceDetail) {
        return "";
      } else {
        return JSON.parse(this.deliveryInfo.traceDetail)[0].context;
      }
    },
  },
  watch: {},
  created() {},
  onReady() {
    if (this.trackingNo) {
      GET_DELIVERY_INFO(this.trackingNo).then((res) => {
        console.log(res);
        this.deliveryInfo = res.data;
      });
    }
  },
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
    if (this.trackingNo) {
      GET_DELIVERY_INFO(this.trackingNo).then((res) => {
        console.log(res);
        this.deliveryInfo = res.data;
      });
    }
  },
  methods: {
    handleGoToDelivery(orderId) {
      uni.navigateTo({
        url: `/pagesA/webView/index?route=/buyerLogistics/${orderId}&source=${this.source}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

.panel-wrapper {
  width: 704rpx;
  margin: 0 auto;
  margin-bottom: 19rpx;
  position: relative;
  padding: 38rpx 31rpx;
  background-color: #fff;
  border-radius: 15rpx;
  height: 300rpx;
  overflow-y: scroll;
  display: flex;
  .status-bar {
    image {
      height: 171rpx;
      width: 23rpx;
      object-fit: cover;
    }
  }
  .delivery-info {
    flex: 1;
    margin-left: 27rpx;
    margin-top: -8rpx;
    position: relative;
    // overflow: hidden;
    .status-title {
      @include textfclaw(31rpx, rgba(42, 44, 51, 1));
      text-align: left;
      font-weight: bolder;
      margin-bottom: 19rpx;
      max-width: 594rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 1; //显示的行
    }
    .abs-zone {
      position: absolute;
      top: 150rpx;
      left: 0;
    }
    .abs-title {
      // position: absolute;
      // top: 150rpx;
      // left: 0;
    }
    .abs-desc {
      // position: absolute;
      // // top: 206rpx;
      // left: 0;
      padding-bottom: 38rpx;
    }
    .status-desc {
      @include textfclaw(25rpx, #666);
      text-align: left;
      font-weight: 300;
      width: 556rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 2; //显示的行
    }
  }
  .to-delivery {
    position: absolute;
    top: 35rpx;
    right: 31rpx;
    display: flex;
    align-items: center;
    @include textfclaw(23rpx, #000);
    .arrow {
      height: 27rpx;
      width: 27rpx;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/right-arrow.png"
      );
    }
  }
}
</style>
