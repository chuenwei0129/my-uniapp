<template>
  <view class="benefits-page">
    <FixedNav title="权益详情" :headerShow="isHeaderShow"></FixedNav>
    <view class="status-bar" :style="{ height: statusBarHeight }"></view>
    <template>
      <view class="header">
        <view class="iconfont icon-back" @click="handleBack"></view>
        <view class="header-t">权益详情</view>
        <view></view>
        <view class="click" @click="handleBack"></view>
      </view>
      <scroll-view
        class="tag-wrapper"
        scroll-x="true"
        :scroll-left="scrollLeft"
        :scroll-with-animation="true"
      >
        <!-- :scroll-into-view="`benefit${scrollToView}`" -->
        <view
          :class="[
            'benefit',
            item.benefitId === activeId ? 'benefit-active' : '',
          ]"
          class="benefit-scroll"
          v-for="(item, index) in benefitsList_V2"
          :id="`benefit${item.benefitId}`"
          :key="item.benefitId"
          @click="tabClick(item.benefitId, item.benefitType, index)"
        >
          <view
            :class="[
              'benefit-icon',
              item.isLock ? 'benefit-locked benefit-iconLock' : '',
            ]"
          >
            <image :src="item.benefitDetailIcon"></image>
          </view>
          <view class="benefit-name">{{
            item.benefitName && item.benefitName.slice(0, 5)
          }}</view>
          <!-- <view class="benefit-coming" v-if="item.coming">即将上线</view> -->
        </view>
      </scroll-view>
      <Application
        v-if="gradeBenefitDetail_V2"
        :gradeBenefitDetail_V2.sync="gradeBenefitDetail_V2"
        :queryBenefitType.sync="queryBenefitType"
        @change="onChange"
      ></Application>
    </template>
  </view>
</template>
<script>
import FixedNav from "@/components/fixedNav/index.vue";
import CouponList from "./components/couponList.vue";
// import { QUERY_BENEFIT_LIST, QUERY_BENEFIT_DETAIL } from "@/api/benefit";
// import { RECEIVE_COUPON } from "@/api/member";
import { ALLGRADE_BENEFIT_INFO, GRADE_BENEFIT_DETAIL } from "@/api/memberV2";
import Application from "./components/application.vue";
import { display_report } from "@/utils/track";

export default {
  components: { FixedNav, CouponList, Application },
  data() {
    return {
      statusBarHeight: "",
      activeId: "",
      flag: true,
      benefitsList: [],
      isHeaderShow: false,
      benefit: {
        benefitId: 0,
        benefitCouponList: [],
        coming: true,
        birthdayConfig: {},
        benefitType: null,
      },
      scrollToView: "",
      benefitsList_V2: [],
      gradeBenefitDetail_V2: {}, // 相应类型权益下的详情
      queryBenefitType: null,
      contentScrollW: 0, // 导航区宽度
      curIndex: 0, // 当前选中 --activeId
      scrollLeft: 0, // 横向滚动条位置
      levelIndex: null,
      display_report_query: {
        50: "quanyi_xiaofei_display", // 50-消费得胖豆 -
        51: "quanyi_shengji_display", // 51-升级得胖豆 -
        52: "quanyi_shiwu_display", // 52-生日盲盒
        53: "quanyi_zhuanshu_display", // 53-会员专属兑换 -
        54: "quanyi_xuni_display", // 54-虚拟奖励 -
        55: "quanyi_shequn_display", // 55-会员社群 -
        56: "quanyi_tuikuan_display", // 56-消费仅退款
        57: "quanyi_gift_display", // 57-等级会员礼
        20: "quanyi_coupon_display", // 20-优惠劵 -
      },
    };
  },
  watch: {
    activeId: {
      immediate: true,
      handler: function (val) {
        if (!val || !val.length) return;
        // this.getBenefitDetail();
        // this.getGradeBenefitDetail()
      },
    },
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  onPageScroll(e) {
    let h = 80;
    if (e && e.scrollTop >= h) {
      this.isHeaderShow = true;
      return;
    } else {
      this.isHeaderShow = false;
    }
  },
  created() {
    // #ifdef H5
    console.log("🚀 ~ created ~ window:", window, this.$router, this.$route);
    this.queryBenefitType = Number(this.$route.query.benefitType);
    this.activeId = this.$route.query.benefitId;
    // #endif
    this.getAllGradeBenefit();
  },
  onLoad(option) {
    if (option && option.benefitId) {
      this.activeId = option.benefitId;
      this.$nextTick(() => { 
        // 埋点
        const userInfo = uni.getStorageSync("storage_info");
        display_report({
          display_name: "quanyi_display",
          module_name: "member",
          extend: {
            userId: userInfo.userId,
            memberLv: userInfo.levelIndex,
          },
        });
        this.queryBenefitType = Number(option.benefitType);
        console.log(
          "🚀 ~ this.$nextTick ~ this.queryBenefitType:",
          this.queryBenefitType
        );
        if (option.benefitId) {
          this.getGradeBenefitDetail(
            option.benefitId,
            Number(this.queryBenefitType)
          );
        }

        const dataTab = this.benefitsList_V2.find(
          (value) => value.benefitId == option.benefitId
        );
        const info = uni.getStorageSync("currentLevelInfo");
        const query = {
          ...info,
          itemData: dataTab,
          queryBenefitType: Number(option.benefitType),
          benefitId: option.benefitId,
        };
        uni.setStorageSync("currentLevelInfo", query);
      });
      setTimeout(() => {
        const index = this.benefitsList_V2.findIndex(
          (value) => value.benefitId == option.benefitId
        );
        if (index > -1) {
          this.scrollToView = option.benefitId;
        }
      }, 200);
    }
  },
  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    // #ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    // #endif
    console.log('***********************')
  },
  methods: {
    // 滚动条位置
    getScrollP() {
      const i = this.curIndex;
      const scrollIndex = this.benefitsList_V2[i];
      if (scrollIndex.left > this.contentScrollW / 2) {
        this.scrollLeft =
          scrollIndex.left - this.contentScrollW / 2 + scrollIndex.width / 2;
      } else {
        this.scrollLeft = 0;
      }
    },
    // 获取标题区域宽度，和每个子元素节点的宽度以及元素距离左边栏的距离
    getScrollW() {
      let that = this
      let query = uni.createSelectorQuery().in(this);
      query
        .select(".tag-wrapper")
        .boundingClientRect((data) => {
          // 拿到 tag-wrapper 组件宽度
          this.contentScrollW = data.width;
        })
        .exec();

      query
        .selectAll(".benefit-scroll")
        .boundingClientRect((data) => {
          let dataLen = data.length;
          for (let i = 0; i < dataLen; i++) {
            //  tag-wrapper 子元素组件距离左边栏的距离
            this.benefitsList_V2[i].left = data[i].left;
            //  tag-wrapper 子元素组件宽度
            this.benefitsList_V2[i].width = data[i].width;
          }
          if(this.benefitsList_V2.every(i=>i.left)) {
            that.getScrollP();
          }  
        })
        .exec();
    },

    handleBack() {
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
    },
    tabClick(id, benefitType, index) {
      this.queryBenefitType = Number(benefitType);
      this.activeId = id;
      this.getGradeBenefitDetail(id, benefitType);
      this.curIndex = index;
      this.getScrollP();
    },
    async getAllGradeBenefit() {
      try {
        const {
          data: { data },
        } = await ALLGRADE_BENEFIT_INFO();
        this.benefitsList_V2 = data;
        if (data.length > 0) {
          this.curIndex = this.benefitsList_V2.findIndex(
            (item) => item.benefitId == this.activeId
          );
          setTimeout(() => {
            this.getScrollW();
          }, 1000);
        }
      } catch (error) {
        console.log("🚀 ~ getAllGradeBenefit ~ error:", error);
      }
    },
    getGradeBenefitDetail(id, type) {
      const data = { benefitId: id };
      if (!data.benefitId) return;
      this.flag = false;
      GRADE_BENEFIT_DETAIL(data).then((res) => {
        this.flag = true;
        this.gradeBenefitDetail_V2 = res.data.data;
        // this.gradeBenefitDetail_V2.status = 1
        // 埋点
        const userInfo = uni.getStorageSync("storage_info");
        display_report({
          display_name: this.display_report_query[type],
          module_name: "member",
          extend: {
            userId: userInfo.userId,
            memberLv: userInfo.levelIndex,
          },
        });
      });
    },
    onChange(data) {
      console.log('走了子组件传值==========');
      this.getGradeBenefitDetail(this.activeId, data);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
