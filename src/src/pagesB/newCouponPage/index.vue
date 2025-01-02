<template>
  <view class="page-wrapper">
    <view class="header-top">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="return" @click="handleReturn"></view>
      <text></text>
      <view class="tabs-container">
        <view
          class="item"
          :class="{ active: index === listIndex }"
          v-for="(item, index) in tagList"
          :key="index"
          @click="handleChooseTab(index)"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <transition name="fade" mode="out-in">
      <Coupon v-if="listIndex == 0" key="coupon" />
      <CardPack v-if="listIndex == 1" key="cardpack" />
    </transition>

    <!-- <Consultation v-if="listIndex == 1" /> -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NoData from "@/components/noData/index.vue";
import Consultation from "./components/consultation.vue";
import Coupon from "./components/coupon.vue";
import { debounce } from "@/utils/index";
import CustomTabs from "./components/customTabs/customTabs.vue";
import CardPack from "@/pagesB/myNewWallet/index.vue";

export default {
  components: {
    NoData,
    Coupon,
    CustomTabs,
    Consultation,
    CardPack,
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
          name: "会员卡",
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
    // console.log("最外层onshow");
    // this.listIndex = 3;
    // setTimeout(() => {
    //   this.listIndex = this.lastIndex;
    // }, 10);
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
    handleChooseTab(current) {
      this.listIndex = current;
      this.lastIndex = current;
      // uni.$emit("changeTab", item.index);
      console.log("huiyuanka", this.listIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
