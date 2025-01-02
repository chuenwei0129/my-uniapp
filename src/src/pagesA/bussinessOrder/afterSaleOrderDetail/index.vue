<template>
  <view class="page-container">
    <scroll-view scroll-y class="scroll">
      <AfterSalesStatusCard :afterSaleOrderInfo="orderInfo" />
      <AfterSaleProductInfo
        :product-info="orderInfo.orderAfterSaleDetailRestResponses"
      />
      <!-- <OrderAmountDetail :orderInfo="orderInfo" /> -->
      <AfterSalesDetailCard :afterSaleOrderInfo="orderInfo" @show="isShowPopCall=true" />
    </scroll-view>
    <view class="bottom-zone">
      <view
        class="button"
        @click="
          isShowPopConfirm = true;
          popTitle = '确认删除售后单？';
          popText = '删除后将从你的售后单列表移除';
        "
        >删除记录</view
      >
    </view>
    <PopConfirm
      :is-open.sync="isShowPopConfirm"
      :title="popTitle"
      :text="popText"
      @confirm="handlePopConfirm"
    />
    <popMakePhoneCall
      :is-open.sync="isShowPopCall"
      :phone-list="orderInfo.shopServicePhone"
    />
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import AfterSalesStatusCard from "./components/afterSalesStatusCard.vue";
import AfterSaleProductInfo from "./components/afterSaleProductInfo.vue";
import AfterSalesDetailCard from "./components/afterSalesDetailCard.vue";
import PopConfirm from "../orderDetail/components/popConfirm.vue";
import popMakePhoneCall from "../orderDetail/components/popMakePhoneCall.vue";
import { DETAIL_AFTERSALE, DELETE_AFTERSALE } from "@/api/pay";
import { orderStatus, afterSaleStatus, afterSaleType } from "../lib/data";
export default {
  //...wxShareMethod(),
  components: {
    AfterSalesStatusCard,
    AfterSaleProductInfo,
    AfterSalesDetailCard,
    PopConfirm,
    popMakePhoneCall
  },
  props: {},
  data() {
    return {
      isShowPopConfirm: false,
      popTitle: "",
      popText: "",
      isShowPopPay: false,
      isShowPopReasons: false,
      afterSaleStatusEnum: afterSaleStatus,
      orderInfo: {},
      source:null,
      isShowPopCall:false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  onReady() {},
  onLoad(options) {
    if (options.afterSaleNo) {
      this.handleGetDetail(options.afterSaleNo);
    }
    this.source = options.source || ''
  },
  methods: {
    handleSetTitle(title) {
      uni.setNavigationBarTitle({
        title,
      });
    },
    async handleGetDetail(afterSaleNo) {
      try {
        const res = await DETAIL_AFTERSALE(afterSaleNo);
        this.orderInfo = res.data;
      } catch (error) {}
    },
    handlePopConfirm() {
      let that = this;
      if (this.popTitle == "确认删除售后单？") {
        DELETE_AFTERSALE(this.orderInfo.afterSaleNo)
          .then((res) => {
            // uni.navigateBack({
            //   delta: 1,
            // });
            uni.redirectTo({
              url: `/pagesA/bussinessOrder/index?listIndex=3&source=${this.source}`,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
