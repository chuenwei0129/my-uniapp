<template>
  <view class="page-wrapper">
    <block v-if="submitOptions">
      <!-- h5里面不用原生的navbar 是为了点击备注的时候兼容之前预约美洗跳转备注页面 -->
      <!-- #ifdef H5 -->
      <NavBar
        :title="'确认订单'"
        navColor="#F7F8FC"
        :whiteBack="false"
        showBackBtn
        @navBackClickHandle="handleReturn"
        :customback="true"
         :style="{position: 'sticky',top: 0,left: 0, zIndex: 999}"
      >
      </NavBar>
      <!-- #endif -->
      <GoodsSubmit ref="goodsRef" :submitOptions="submitOptions" @requestAppPay="requestAppPay"></GoodsSubmit>
    </block>
  </view>
</template>

<script>
import GoodsSubmit from "./components/goodsSubmit/index.vue";
import CellItemNormal from "../components/cellItemNormal/index.vue";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import NavBar from "@/components/navBar/index.vue";
import { mapState } from "vuex";

export default {
  components: {
    CellItemNormal,
    GoodsPrice,
    GoodsSubmit,
    NavBar,
  },

  data() {
    return {
      // 确定订单 类型
      submitType: null,
      submitOptions: null,
      // 提交商品信息
      initData: null,
      // 支付信息
      payInfo: null,

      addressId: null,
      address: {
        address: "宋都阳光国际听涛苑3幢2单元1301111111111111111111",
        name: "李超",
        phone: "158****8888",
      },
      remark: "放门口就可以，别敲门谢谢",
      pageEntryTimes: 0, //是否第一次进入提交订单页面，第一次进入调用子组件的mounted initdata，后续不调用，走当前页面onshow调用initdata
      tradeNo:'',
      tradeId:'',
      liveType:''
    };
  },

  computed: {
    ...mapState(["userInfo"]),

    // 是否服务到店
    isService() {
      return this.submitType == "service";
    },
  },
  onShow() {
    if (this.submitType == "mall" && this.$refs.goodsRef) {
      this.$refs.goodsRef.handleAddress();
    }
    //处理h5端跳出小程序后的返回轮训逻辑
    // #ifdef H5
    console.log('返回轮训逻辑',this.tradeId,this.tradeNo);
    if(this.liveType=='liveType'){
      //判断是活体订单要查询协议的签署状态
      console.log('活体订单查询协议状态');
      //调用签署协议状态的方法getSignStatus
      uni.$emit("getSignStatus");
    }
    if (this.tradeId && this.tradeNo) {
      this.$refs.goodsRef.nextOrder(this.tradeId, this.tradeNo);
    }
    // #endif
    // this.$nextTick(() => {
    //   if (this.pageEntryTimes) {
    //     this.$refs.goodsRef &&
    //       this.$refs.goodsRef.getSubmitInitData(false, false);
    //   } else {
    //     this.pageEntryTimes++;
    //   }
    // });
  },
  onLoad(options) {
    console.log("🚀 ~ onLoad ~ options:", options);
    if(options.type && options.type == "liveType"){
      //说明是活体
      this.liveType = "liveType";
    }
    // 相关字段
    this.submitType = options.type;
    this.submitOptions = {
      itemId: options.itemId,
      skuId: options.skuId,
      skuQty: options.skuQty,
      shopId: options.shopId,
      shopName: options.shopName && decodeURIComponent(options.shopName),
      cartType: options.cartType,
      type: options.type,
      sourceChannel: options.sourceChannel,
    };
  },

  methods: {
    handleReturn() {
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },
    requestAppPay(obj){
    console.log('传出来的obj',obj);
    
      this.tradeId=obj.tradeId
      this.tradeNo=obj.tradeNo
    }
  },
};
</script>

<style>
page {
  background-color: #f7f8fc;
}
</style>

<style lang="scss" scoped>
@import "./index.scss";
</style>
