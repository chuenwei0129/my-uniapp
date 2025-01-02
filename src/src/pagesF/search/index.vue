<template>
  <view>
    <view class="fl-row-justy fix-header">
      <view class="input-box items-center">
        <view class="input-btn iconfont icon-search"></view>
        <view class="input-text">
          <input
            type="text"
            v-model="keyword"
            confirm-type="search"
            @confirm="getBiSearch('clear')"
            focus
            placeholder="搜索感兴趣的活动"
            placeholder-style="color:#AAAAAA"
          />
        </view>
      </view>
      <view class="search-btn" @click="getBiSearch('clear')">搜索</view>
    </view>
    <view class="line"></view>
    <view class="list-box" v-if="listData && listData.length > 0">
      <activity-list :listArr="listData"></activity-list>
    </view>
    <view v-if="listData.length == 0 && isSearched" style="height: 1000rpx">
      <NoData
        img="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/a_404.png"
        noDataText="没有找到活动哦～"
      >
      </NoData>
    </view>
  </view>
</template>

<script>
import { ACTIVITY_SEARCH_LIST } from "@/api/activityclube";
import activityList from "../components/activity-list/activity-list.vue";
import NoData from "@/components/noData/index.vue";
export default {
  components: {
    activityList,
    NoData,
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
      listData: [],
      keyword: "",
      isSearched: false,
    };
  },
  onReachBottom() {
    if (this.pageNo == this.totalPage) return;
    this.pageNo++;
    this.getBiSearch();
  },
  methods: {
    resetData() {
      this.pageNo = 1;
      this.listData = [];
    },
    async getBiSearch(type) {
      if (type == "clear") {
        this.resetData();
      }
      const { latitude, longitude } = uni.getStorageSync(
        "storage_currentPosition"
      );
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        citySearchType: "NATIONAL",
        lat: latitude,
        lon: longitude,
        titleName: this.keyword,
      };

      const {
        data: { data, totalPage },
      } = await ACTIVITY_SEARCH_LIST(params);
      this.isSearched = true;
      this.totalPage = totalPage;
      this.listData = [...this.listData, ...data];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
