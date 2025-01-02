<template>
  <view class="panel-wrappper">
    <view class="address-empty" v-if="!addressDetail">
      <view class="info-item" @click="handleGoToAddMan">
        <view class="left">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/address-site.png"
            mode="scaleToFill"
          />
          <view>添加收货地址</view>
        </view>
        <view class="right">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/right-arrow.png"
            mode="scaleToFill"
          />
        </view>
      </view>
    </view>
    <view v-else class="address" @click="handleGoToAddMan">
      <view class="left">
        <view class="first-row">{{ addressDetail.address }}</view>
        <view class="second-row">
          <text class="name">{{ addressDetail.name }}</text>
          <text class="phone">{{ addressDetail.phone }}</text>
          <text v-if="addressDetail.defaultFlag == 1" class="default-tag"
            >默认</text
          >
        </view>
      </view>
      <view class="right" v-if="orderStatus !== 'CLOSED'">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/right-arrow.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="bottom-slide"></view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
export default {
  //...wxShareMethod(),
  components: {},
  props: {
    addressInfo: {
      type: Object,
    },
    // diagnosticSheetId: {
    //   type: String,
    // },
    orderStatus: {
      type: String,
    },
    orderNo: {
      type: String,
    },
  },
  data() {
    return { addressState: "empty", addressDetail: {} };
  },
  computed: {},
  watch: {
    addressInfo: {
      handler(newV, oldV) {
        this.addressDetail = newV;
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    // if (this.fromChannel) {
    //   console.log(this.fromChannel);
    // }
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
    handleGoToAddMan() {
      if (this.orderStatus == "CLOSED") return;
      uni.navigateTo({
        url: `/pagesA/addressManagement/index?orderNo=${this.orderNo || ''}`,
      });
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
  // padding: 38rpx 31rpx;
  background-color: #fff;
  border-radius: 15rpx;
  // height: 165rpx;
  .address-empty {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 38rpx 31rpx;
    .info-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        font-weight: bold;
        @include textfclaw(31rpx, #000);
        image {
          margin-right: 20rpx;
          height: 42rpx;
          width: 42rpx;
          object-fit: cover;
        }
      }
      .right {
        display: flex;
        align-items: center;
        flex: 1;
        text-align: right;
        justify-content: flex-end;
        image {
          height: 42rpx;
          width: 42rpx;
          object-fit: cover;
        }
      }
    }
  }
  .address {
    // height: 81rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 38rpx 31rpx;
    .left {
      padding: 38rpx 31rpx;
      .first-row {
        @include textfclaw(31rpx, #2a2c33);
        text-align: left;
        font-weight: bolder;
        margin-bottom: 19rpx;
        width: 600rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 2; //显示的行
      }
      .second-row {
        @include textfclaw(25rpx, #666);
        text-align: left;
        .name {
          margin-right: 12rpx;
        }
        .phone {
          margin-right: 12rpx;
        }
        .default-tag {
          display: inline-flex;
          @include textfclaw(19rpx, #fff);
          height: 27rpx;
          width: 54rpx;
          background-color: #2dce80;
          align-items: center;
          justify-content: center;
          border-radius: 8rpx;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      flex: 1;
      text-align: right;
      justify-content: flex-end;
      image {
        height: 42rpx;
        width: 42rpx;
        object-fit: cover;
      }
    }
  }
  .bottom-slide {
    position: absolute;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/address-bot.png"
    );
    height: 4rpx;
    width: 704rpx;
    bottom: 0;
    left: 0;
  }
}
</style>
