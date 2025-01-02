<template>
  <view>
    <u-sticky bgColor="#fff">
      <u-tabs
        :list="tagList"
        lineWidth="0"
        lineColor="#1F1F1F"
        :scrollable="false"
        :activeStyle="{
          color: '#1F1F1F',
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

    <CouponList @update-count="updateCount" />
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import { mapState, mapMutations } from "vuex";
import NoData from "@/components/noData/index.vue";
import CouponList from "./couponList.vue";
import { debounce } from "@/utils/index";
import { GET_COUPON_PACK_QTY } from "@/api/index";
import { getUserInfo } from "@/api/base/index";

export default {
  components: {
    NoData,
    CouponList,
  },
  props: {
    isPageShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listCount: {
        unusedCount: 0, //未使用的数量
        usedCount: 0, //已使用的数量
        expiredCount: 0, //已过期的数量
      },
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
    tagList() {
      let tagList = [
        {
          name: `未使用(${this.listCount.unusedCount})`,
        },
        {
          name: `已使用(${this.listCount.usedCount})`,
        },
        {
          name: `已过期(${this.listCount.expiredCount})`,
        },
      ];
      return tagList;
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
    this.getCouponPackQty();
  },
  methods: {
    updateCount() {
      console.log("updateCount===");
      this.getCouponPackQty();
    },
    handleChooseTab(item) {
      console.log(item);
      uni.$emit("changeTab", item.index);
    },

    async getUserMemberId() {
      let memberId = this.userInfo?.memberId;
      if (memberId) {
        console.log(`memberId: ${memberId}`);
        return memberId;
      }

      const user = await getUserInfo(true, true);
      if (this.userInfo) {
        this.userInfo.memberId = memberId;
      }
      console.log(`memberId: ${user.memberId}`);
      return user.memberId;
    },

    async getCouponPackQty() {
      try {
        const params = {
          memberId: await this.getUserMemberId(),
        };
        const res = await GET_COUPON_PACK_QTY(params);
        console.log("res ", res);
        this.listCount = res.data.data;
      } catch (e) {
      } finally {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./consultation.scss";
</style>
