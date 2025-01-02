<template>
  <view class="page-wrapper">
    <view class="header-top">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <!-- <view>1111</view> -->
      <view class="return" @click="handleReturn"></view>
      <text></text>
      <!-- <u-sticky bgColor="#fff"> -->
      <view class="tabs">
        <CustomTabs
          :list="tagList"
          line-width="45"
          line-height="6"
          lineColor="#FFD41E95"
          font-size="20"
          :scrollable="false"
          :activeStyle="{
            color: '#000',
            fontWeight: 'bold',
            transform: 'scale(1)',
          }"
          :inactiveStyle="{
            color: 'rgba(153, 153, 153, 1)',
            transform: 'scale(1)',
          }"
          :current="listIndex"
          itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
          @click="handleChooseTab"
        >
        </CustomTabs>
      </view>

      <!-- </u-sticky> -->
    </view>

    <Coupon v-if="listIndex == 0" />
    <Consultation v-if="listIndex == 1" />
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import { mapState, mapMutations } from "vuex";
import NoData from "@/components/noData/index.vue";
import Consultation from "./components/consultation.vue";
import Coupon from "./components/coupon.vue";
import { debounce } from "@/utils/index";
import CustomTabs from "./components/customTabs/customTabs.vue";

export default {
  components: {
    NoData,
    Coupon,
    CustomTabs,
    Consultation,
  },
  props: {
    isPageShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listIndex: 0,
      lastIndex: 0,
      tagList: [
        {
          name: "优惠券",
        },
        {
          name: "问诊券",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      serviceSheetsList: (state) => state.serviceSheetsList,
      lastSheetsMessage: (state) => state.lastSheetsMessage,
      sheetsList: (state) => state.sheetsList,
      userSelectedPetId: (state) => state.userSelectedPetId,
    }),
    screenWidth() {
      return uni.getSystemInfoSync().screenWidth;
    },
  },
  watch: {
    isPageShow: {
      handler(val) {
        if (val) {
          // this.resetPageData();
          // this._getSheetsList();
        }
        console.log("list pageShow", val);
      },
      immediate: true,
    },
  },
  created() {
    // this._getSheetsList();
  },
  onShow() {
    console.log("最外层onshow");
    this.listIndex = 3;
    setTimeout(() => {
      this.listIndex = this.lastIndex;
    }, 10);
  },
  mounted() {
    //结束上一次监听
  },
  methods: {
    handleReturn() {
      console.log("return");
      uni.navigateBack({
        delta: 1,
      });
    },
    handleChooseTab(item) {
      console.log(item);
      this.listIndex = item.index;
      this.lastIndex = item.index;
      // uni.$emit("changeTab", item.index);
    },
    // 切换tab请求接口
    // handleChooseTab(item) {
    //   // this.scrollTop = this.oldScrollTop;
    //   // this.$nextTick(() => {
    //   //   this.scrollTop = 0;
    //   // })
    //   // this.init();
    //   // this.activeOrderTab = item.orderTab;
    //   // this.handleData();
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
