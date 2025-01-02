<template>
  <view class="content">
    <view class="content-title">
      <u-alert :title="title" fontSize="27rpx" :center="true"></u-alert>
    </view>
    <view class="content-box"
      ><u-row
        justify="center"
        align="center"
        customStyle="height: 100%"
        gutter="10"
      >
        <u-col span="6" textAlign="center">
          <view class="valuefont">{{ levelInfo.availableGrowthValue }}</view>
          <u--text
            align="center"
            color="#999999"
            size="23rpx"
            text="当前成长值"
          ></u--text>
        </u-col>
        <u-col span="6" textAlign="center">
          <view class="value-last">{{ growthValue }}</view>
          <u--text
            @click="goRule"
            align="center"
            color="#999999"
            size="23rpx"
            text="近30天将失效成长值"
            :suffixIcon="src"
          ></u--text>
        </u-col> </u-row
    ></view>
    <!-- <u-toast ref="uToast" class="utoast"></u-toast> -->
    <view class="content-toast" v-if="showToast">
      <view class="main">
        成长值有效期为365天，每月1日根据12个月内获得成长值进行定级
      </view>
    </view>
  </view>
</template>
<script>
import { GTE_RULES } from "@/api/memberV2";

export default {
  components: {},
  props: {
    levelInfo: {
      type: Object,
    },
    growthValue: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      failureValue: 200,
      title: "成长值即将更新，基于过去12个月有效分计算",
      src: "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/iconPrompt.png",
      showToast: false,
    };
  },
  computed: {},
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
    goRule() {
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
      this.showToast = true;
      // uni.showToast({
      //   icon: "none",
      //   title: "成长值有效期为365天，每月1日根据12个月内获得成长值进行定级",
      //   duration: 3000,
      // });
      // const { data } = await GTE_RULES();
      // const path = data.data;

      // if (path.indexOf("http") !== -1) {
      //   let newRoute = "";
      //   if (path.indexOf("h5/shareActivity/?random=123#")) {
      //     newRoute = path.replace("h5/shareActivity/?random=123#", "#");
      //   } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
      //     newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
      //   } else if (path.indexOf("h5/shareActivity/?random=123")) {
      //     newRoute = path.replace("h5/shareActivity/?random=123/", "");
      //   }
      //   let str = `/pagesA/webView/index?route=${encodeURIComponent(
      //     newRoute
      //   )}&type=icon&transparentTopBar=1`;
      //   return uni.navigateTo({
      //     url: str,
      //   });
      // } else {
      //   return uni.navigateTo({ url: path });
      // }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  .content-title {
    height: 77rpx;
  }
  .content-box {
    height: 224rpx;
    padding: 0 25rpx;
    .valuefont {
      color: #1f1f1f;
      font-size: 70rpx;
      line-height: 75rpx;
      font-family: D-DIN-Bold;
    }
    .value-last {
      margin-top: 17rpx;
      color: #1f1f1f;
      font-size: 54rpx;
      line-height: 58rpx;
      font-family: D-DIN-Bold;
    }
  }
}
.content-toast {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  .main {
    background-color: #585858;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20rpx 30rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 10rpx;
    width: 417rpx;
    text-align: center;
    line-height: 1.5;
  }
}
</style>
