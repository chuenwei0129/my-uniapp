<template>
  <view class="growth-page">
    <!-- #ifdef H5 -->
    <NavBar
      title="成长值明细"
      titleColor="#000"
      :showBackBtn="true"
      :whiteBack="false"
      @navBackClickHandle="navBackClickHandle"
      :customback="true"
    />
    <!-- #endif -->
    <HeadInfo :levelInfo="levelInfo" :growthValue="growthValue"></HeadInfo>
    <u-sticky :disabled="true" bgColor="#fff">
      <CustomTabs
        :list="tabList"
        line-width="32"
        line-height="6"
        lineColor="#FEE900"
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
        @click="handleChooseTab"
      >
      </CustomTabs>
    </u-sticky>

    <view class="line"></view>

    <scroll-view
      scroll-y
      class="order-wrapper"
      :refresher-enabled="true"
      :refresher-triggered="triggered"
      @refresherrefresh="myPullDownRefresh"
      @scrolltolower="_getGrowthList"
    >
      <template v-if="growthList.length">
        <view class="grwoth" v-for="(item, index) in growthList" :key="index">
          <view class="l">
            <view class="t">{{ item.bizDesc }}</view>
            <view class="b">{{ item.createdDate }}</view>
          </view>
          <view :class="['r', `r-${item.operateType}`]">
            {{ item.operateType == 10 ? "+" : "" }}{{ item.growthValue }}
          </view>
        </view>
      </template>
      <template v-if="!growthList.length && loaded">
        <view class="empty">
          <NoData noDataText="暂无内容" :img="imgUrl"></NoData>
        </view>
      </template>
    </scroll-view>
  </view>
</template>
<script>
import NavBar from "@/components/navBar/index.vue";
import { QUERY_LEVEL, GETEXPIRED_GROWTH } from "@/api/member";
import { QUERY_GROWTH_DETAIL } from "@/api/benefit";
import CustomTabs from "./components/customTabs.vue";
import HeadInfo from "./components/headInfo.vue";
import NoData from "@/components/noData/index.vue";
import { tr } from "@dcloudio/vue-cli-plugin-uni/packages/postcss/tags";
import { display_report } from "@/utils/track";
export default {
  name: "GrowthDetail",
  components: { CustomTabs, NoData, HeadInfo, NavBar },
  data() {
    return {
      scrollTop: 0,
      isRefresher: true,
      imgUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/no-content.png",
      levelInfo: {},
      listIndex: 0,
      page: 0,
      pageSize: 10,
      triggered: false,
      operateType: "",
      growthListLock: false,
      growthList: [],
      growthValue: 0,
      loaded: true,
      tabList: [
        {
          name: "全部",
          index: 0,
          operateType: "",
        },
        {
          name: "获取",
          index: 1,
          operateType: 10,
        },
        {
          name: "退回",
          index: 2,
          operateType: 20,
        },
      ],
    };
  },
  watch: {},
  onShow() {
    this._getUserLevel();
    this._getGrowthList();
    const userInfo = uni.getStorageSync("storage_info");
    display_report({
      display_name: "member_growthdetail_diaplay",
      module_name: "member",
      extend: {
        userId: userInfo.userId,
        memberLv: this.levelIndex,
      },
    });
  },

  onLoad() {
    this._getUserGrowthValue();
  },

  onPageScroll(e) {
    // e.scrollTop 获取页面的滚动高度
    if (e.scrollTop) {
      this.isRefresher = true;
    } else {
      this.isRefresher = false;
    }
    console.log("e.scrollTop", e.scrollTop);
  },
  destroyed() {},
  methods: {
    navBackClickHandle() {
      uni.navigateBack({
        delta: 1,
      });
    },
    myPullDownRefresh() {
      this.page = 0;
      this.growthList = [];
      this.growthListLock = false;
      this.triggered = true;
      this.isRefresher = true;
      this._getGrowthList();
      this._getUserLevel();
      setTimeout(() => {
        this.isRefresher = false;
        this.triggered = false;
      }, 1000);
    },
    handleChooseTab(item) {
      console.log(item);
      this.init();
      this.operateType = item.operateType;
      this._getGrowthList();
      this._getUserLevel();
    },
    //获取用户会员等级
    async _getUserLevel() {
      const { data } = await QUERY_LEVEL();

      this.levelInfo = data.data;
      console.log("🚀 ~ _getUserLevel ~ levelInfo:", this.levelInfo);
    },
    //获取30天内过期成长值
    async _getUserGrowthValue() {
      const { data } = await GETEXPIRED_GROWTH();
      this.growthValue = data.data.last30DayExpiredGrowth;
      // this.levelInfo = data.data;
      // console.log("🚀 ~ _getUserLevel ~ levelInfo:", this.levelInfo);
    },
    //获取明细列表
    async _getGrowthList(e) {
      console.log(e, 222222);
      if (this.growthListLock) return;
      this.isRefresher = false;
      this.loaded = false;
      this.page++;
      const { data } = await QUERY_GROWTH_DETAIL({
        operateType: this.operateType,
        pageNum: this.page,
        pageSize: this.pageSize,
      });
      const list = data.data.data;
      console.log(list);
      if (list.length) {
        this.growthList = this.growthList.concat(list);
      } else {
        this.growthListLock = true;
      }
      this.loaded = true;
    },
    //
    init() {
      this.page = 0;
      this.growthList = [];
      this.growthListLock = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
