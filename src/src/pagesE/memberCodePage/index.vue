<template>
  <view class="container">
    <NavBar
      title="会员码"
      titleColor="#fff"
      :showBackBtn="true"
      :whiteBack="true"
      @navBackClickHandle="navBackClickHandle"
      :customback="true"
    />
    <view class="code-zone">
      <view class="top-member-info">
        <view class="portrait">
          <image
            class="img"
            :src="
              memberDetail.avatarUrl ||
              'https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/unlogin-V2.png'
            "
          />
        </view>
        <view class="info-zone">
          <view class="phone">{{ memberDetail.desensitizedPhone }}</view>
          <view class="date">{{ memberDetail.createdDateDesc }}</view>
        </view>
      </view>
      <view class="code-detail">
        <view class="title">结算前出示会员码</view>
        <!-- v-show="showTki" -->
        <view
          style="
            height: 179rpx;
            display: flex;
            justify-content: center;
            margin-bottom: 48rpx;
          "
        >
          <tkiBarcode
            :loadMake="false"
            :opations="opations"
            :onval="true"
            format="code128"
            :val="memberDetail.codeRelationId"
            ref="barcode"
            @result="barCodeResult"
          />
        </view>
        <view>
          <!-- <image
            v-if="qrCodeUrl.length > 0"
            :src="qrCodeUrl"
            :style="{ width: '256rpx', height: '256rpx', margin: '0 auto' }"
          ></image> -->
          <canvas
            class="fl-row-center"
            id="qrcode"
            canvas-id="qrcode"
            :style="{ width: '256rpx', height: '256rpx', margin: '0 auto' }"
          ></canvas>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import NavBar from "@/components/navBar/index.vue";
import tkiBarcode from "./components/tki-barcode/tki-barcode.vue";
import UQRCode from "./components/uqrcodejs/uqrcode";
import { getMemberCode } from "@/api/my";
import { display_report } from "@/utils/track";
import { debounce } from "@/utils/index";

export default {
  //...wxShareMethod(),
  components: { NavBar, tkiBarcode },
  props: {},
  data() {
    return {
      qrCodeUrl: "",
      opations: {
        // format: "CODE128",//选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
        height: 179, //高度
        displayValue: false, //是否在条形码下方显示文字
        background: "#ffffff", //设置条形码的背景色
        margin: 0, //设置条形码周围的空白边距
        width: 4,
      },
      timer: null,
      memberDetail: {},
      showTki: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.handleGetMemberCode = debounce(this.handleGetMemberCode, 500);
  },
  methods: {
    drawCode(url) {
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = url;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = uni.upx2px(256);
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext("qrcode", this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();

      setTimeout(() => {
        var that = this;
        uni.canvasToTempFilePath(
          {
            canvasId: "qrcode",
            success: (res) => {
              console.log("二维码", res.tempFilePath);
              this.qrCodeUrl = res.tempFilePath;
            },
            fail: (err) => {
              console.error("二维码 err, ", err);
            },
          },
          that
        );
      }, 1000);

      setTimeout(() => {
        // this.$refs["barcode"]._makeCode();
      }, 100);
    },
    barCodeResult(v) {
      console.log("条形码回执成功:", v);
    },
    /**
     * 获取用户条码信息
     */
    async handleGetMemberCode() {
      try {
        this.showTki = false;
        const res = await getMemberCode();
        this.memberDetail = res.data.data;
        this.drawCode(res.data.data.codeRelationId);
      } catch (error) {
      } finally {
        this.showTki = true;
      }
    },
    // TODO
    navBackClickHandle() {
      console.log("timer", this.timer);
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.switchTab({
            url: "/pages/home/index",
          });
        },
      });
      // #endif
    },
  },
  onShow() {
    this.handleGetMemberCode();
    console.log("onshow", this.timer);
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.timer = setInterval(() => {
        console.log("定时器启动");
        this.handleGetMemberCode();
      }, 30000);
    } else {
      console.log("生成定时器");
      this.timer = setInterval(() => {
        console.log("定时器启动");
        this.handleGetMemberCode();
      }, 30000);
    }
    // 保持屏幕常亮
    uni.setKeepScreenOn({
      keepScreenOn: true,
    });
    display_report({
      display_name: "membercode_display",
    });
  },
  onHide() {
    console.log("关闭onhide", this.timer);
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log("关闭定时器");
    }
  },
  onUnload() {
    console.log("关闭onunload", this.timer);
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log("关闭定时器");
    }
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
