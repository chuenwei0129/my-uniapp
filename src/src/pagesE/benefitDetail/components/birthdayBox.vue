<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="birthday-content" @click="toGuideApp">
      <view class="title">
        <view class="title-nav">随机{{ goodsList.length }}选1</view>
      </view>
      <view class="gift-box">
        <view
          :class="['gift-item', goodsList.length < 4 ? '' : 'marginBottom30']"
          v-for="(item, index) in goodsList"
          :key="index"
        >
          <view class="gift-img">
            <image mode="widthFix" :src="item.goodsLogoPic"></image>
          </view>
          <view class="gift-name">{{ sliceStr(item.goodsName, 6) }}</view>
        </view>
      </view>
    </view>
    <view class="close-icon" @click="handleClose">
      <image class="img" mode="widthFix" :src="closeIconUrl"></image>
    </view>
  </u-popup>
</template>

<script>
const h5Domain = {
  dev: "https://cn-dev02-shareactivity.chongpangpang.com/#",
  jumpdev: "https://cn-dev02-shareactivity.chongpangpang.com",
  pro: "https://shareactivity.chongpangpang.com/#",
  jumppro: "https://shareactivity.chongpangpang.com",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/#",
};
const env =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "dev"
    : process.env.NODE_ENV === "pre"
    ? "pre"
    : "pro";
export default {
  name: "BirthdayBox",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    goodsList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      orderGoods: {},
      closeIconUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/closeIcon.png",
    };
  },
  created() {},
  mounted() {
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  methods: {
    sliceStr(str, len) {
      return str.length > len ? str.slice(0, len) : str;
    },
    toast(str) {
      uni.showToast({
        title: str,
        icon: "none",
      });
    },
    go(url) {
      uni.navigateTo({ url });
    },
    close() {
      this.$emit("update:show", false);
    },
    handleClose() {
      this.$emit("update:show", false);
    },
    toGuideApp() {
      this.close();
      // 小程序
      if (this.isNative) {
        // 非小程序
        this.receiveAward();
      } else {
        // 小程序
        uni.navigateTo({
          url: "/pagesE/guideApp/index?type=1",
        });
      }
    },
    // 领取权益（生日盲盒）
    async receiveAward() {
      const orderGoods = this.goodsList.find((item) => item.isSubmitGoods);
      const {
        goodsId,
        goodsName,
        goodsLogoPic,
        originScore,
        payScore,
        goodsQuantity,
      } = orderGoods;
      const query = `transparentTopBar=1&goodsId=${goodsId}&goodsName=${goodsName}&originScore=${originScore}&payScore=${payScore}&goodsQuantity=${goodsQuantity}&orderSource=3&goodsLogoPic=${encodeURIComponent(
        encodeURIComponent(goodsLogoPic)
      )}`;
      console.log(
        "生日盲盒链接===",
        `${h5Domain[env]}integral/order/${goodsId}?${query}`
      );
      // this.$dsBridge.call("gotoPageThroughRoute", {
      //   page: `${h5Domain[env]}integral/order/${goodsId}?${query}`,
      //   // page: `${h5Domain[env]}integral/order/${goodsId}?${query}`,
      // });
      console.log(`${h5Domain[env]}/integral/order/${goodsId}?${query}`);
      window.location.href = `${h5Domain[env]}/integral/order/${goodsId}?${query}`;
    },
  },
};
</script>

<style lang="scss" scopede>
@import "../../../utils/fn.scss";
.birthday-content {
  width: 596rpx;
  height: 808rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/birthdayBox.png"
  );
  // position: relative;
  .title {
    text-align: center;
    .title-nav {
      display: inline-block;
      width: 192rpx;
      height: 46rpx;
      font-family: AlimamaShuHeiTi, AlimamaShuHeiTi-Bold;
      @include textfclaw(25rpx, #5b3671, $align: center, $lineH: 46rpx);
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/bithdayIcon.png"
      );
      margin-top: 150rpx;
    }
  }
  .gift-box {
    width: 100%;
    min-height: 400rpx;
    margin-top: 8rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 17rpx 57rpx;
    .gift-item {
      @include flex();
      flex-direction: column;
    }
    .marginBottom30 {
      margin-bottom: 30rpx;
    }
    .gift-img {
      width: 173rpx;
      height: 173rpx;
      background: #ffffff;
      border-radius: 19rpx;
      border: 2rpx solid #ffccca;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }
    .gift-name {
      width: 173rpx;
      text-align: center;
      margin-top: 6rpx;
      font-weight: 500;
      font-size: 23rpx;
      color: #333333;
    }
  }
}
.close-icon {
  // @include bg("https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/closeIcon.png");
  // width: 61rpx;
  // height: 61rpx;
  // position: absolute;
  // bottom: -86rpx;
  // left: 50%;
  // transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  margin-top: 58rpx;
  .img {
    display: inline-block;
    width: 61rpx;
    height: 61rpx;
  }
}
</style>
