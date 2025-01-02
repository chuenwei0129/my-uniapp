<template>
  <view class="themeactivity-page">
    <view :class="['header-fixed', isHeaderShow ? 'header-show' : '']">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="hender-frame" :style="{ height: navBarHeight }">
        <view class="left">
          <view class="iconfont icon-back" @click="goBack"></view>
        </view>
        <view
          class="title"
          :style="{ height: navBarHeight, lineHeight: navBarHeight }"
          >{{ name }}</view
        >
        <view class="right"></view>
      </view>
    </view>
    <view class="header-nomal">
      <cpp-navigation-bar
        :bgColor2="!isHeaderShow ? 'transparent' : 'white'"
        bgColor="none"
      >
      </cpp-navigation-bar>
    </view>
    <view class="theme-headerimage">
      <image class="img" :src="pic"></image>
    </view>
    <view class="themelist-wrap">
      <view v-if="listData && listData.length">
        <activity-list
          :listArr="listData"
          :cityCode="cityData.code"
        ></activity-list>
      </view>
      <view v-else class="fl-row-center h-vh emptywrap">
        <NoData
          noDataText="这里还没有内容哦"
          img="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/myActives/nodata-404.png"
        />
      </view>
    </view>
  </view>
</template>
<script>
import { getActivityList } from "@/api/activityclube";
import { mapState, mapMutations } from "vuex";
import NoData from "@/components/noData/index.vue";
import cppNavigationBar from "../components/cpp-navigation-bar/cpp-navigation-bar";
import activityList from "../components/activity-list/activity-list.vue";
export default {
  components: {
    NoData,
    cppNavigationBar,
    activityList,
  },
  data() {
    return {
      subjectId: "",
      listData: [],
      isHeaderShow: false,
      statusBarHeight: "",
      navBarHeight: "",
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
      listData: [],
      name: "",
      pic: "",
    };
  },
  computed: {
    ...mapState({
      cityData: (state) => state.city,
    }),
  },
  onLoad(option) {
    this.subjectId = option.subjectId;
    this.name = option.subjectName;
    this.pic = option.pic;
    console.log("id", option.subjectId);
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.getSubjectActList();
  },
  onPullDownRefresh() {
    this.resetPage();
    this.getSubjectActList();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    if (this.pageNo == this.totalPage) return;
    this.pageNo++;
    this.getSubjectActList();
  },
  onPageScroll(e) {
    let h = 100;
    if (e.scrollTop >= h) {
      this.isHeaderShow = true;
      return;
    } else {
      this.isHeaderShow = false;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    resetPage() {
      this.pageNo = 1;
      this.listData = [];
    },
    async getSubjectActList() {
      const { latitude, longitude } = uni.getStorageSync(
        "storage_currentPosition"
      );
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        lat: latitude,
        lon: longitude,
        cityCode: this.cityData.code || 330100,
        subjectId: this.subjectId,
      };
      const res = await getActivityList(params);
      this.totalPage = res?.data?.totalPage;
      this.listData = [...this.listData, ...res?.data?.data];
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
