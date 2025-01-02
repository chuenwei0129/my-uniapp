<template>
  <view>
    <u-sticky bgColor="#fff">
      <u-tabs
        :list="tagList"
        lineWidth="15"
        lineColor="#2DCE80"
        :scrollable="false"
        :activeStyle="{
          color: '#2DCE80',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{
          color: 'rgba(153, 153, 153, 1)',
          transform: 'scale(1)',
        }"
        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
        @click="handleChooseTab"
      >
      </u-tabs>
    </u-sticky>

    <ConsultationList />
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import { mapState, mapMutations } from "vuex";
import NoData from "@/components/noData/index.vue";
import ConsultationList from "./consultationList.vue";
import { debounce } from "@/utils/index";

export default {
  components: {
    NoData,
    ConsultationList,
  },
  props: {
    isPageShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagList: [
        {
          name: "可使用",
        },
        {
          name: "已使用",
        },
        {
          name: "已过期",
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

  mounted() {
    //结束上一次监听
  },
  methods: {
    handleChooseTab(item) {
      console.log(item);
      uni.$emit("changeTab", item.index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./consultation.scss";
</style>
