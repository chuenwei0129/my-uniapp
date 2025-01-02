<template>
  <view class="index-warp">
    <view class="tab">
      <view
        class="tab_item"
        v-for="item in tabList"
        :key="item.id"
        @click="handleInd(item)"
      >
        <text :class="item.type == status ? 'active' : ''">{{
          item.title
        }}</text>
      </view>
    </view>
    <view class="list-box" v-if="listData && listData.length > 0">
      <activity-list :listArr="listData" enterType="myActivies"></activity-list>
    </view>
    <view v-else :style="'padding-top:400rpx'">
      <NoData
        v-if="refush == true"
        noDataText="空空如也，胖胖好寂寞..."
        img="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/myActives/nodata-404.png"
      />
    </view>
  </view>
</template>

<script>
import { tabList } from "./data/index";
import activityList from "../components/activity-list/activity-list.vue";
import NoData from "@/components/noData/index.vue";
import { GET_ACTIVIITES_LIST } from "@/api/activitymine";
export default {
  // #ifdef MP-WEIXIN
  // //...wxShareMethod(),
  // #endif
  components: {
    NoData,
    activityList,
  },
  data() {
    return {
      status: "ALL",
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
      tabVal: "",
      tabList,
      listData: [],
      refush: false,
    };
  },
  computed: {},
  onLoad(option) {
    this.status = option.type;
  },
  onReady() {},
  onShow() {
    this.refush = false;
    this.getMyActivityList();
  },
  onHide() {
    this.resetPage();
  },
  onReachBottom() {
    if (this.pageNo == this.totalPage) return;
    this.pageNo++;
    this.getMyActivityList();
  },
  methods: {
    // ...mapMutations(["setUserInfo"]),

    setRouter(url, query) {
      uni.navigateTo({
        url,
      });
    },
    resetPage() {
      this.pageNo = 1;
      this.listData = [];
      this.refush = false;
    },
    //tab切换数据初始化
    handleInd(item) {
      this.status = item.type;
      this.resetPage();
      this.getMyActivityList();
    },
    async getMyActivityList() {
      const { latitude, longitude } = uni.getStorageSync(
        "storage_currentPosition"
      );
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        type: this.status || "ALL",
      };
      if (latitude) {
        params.lat = latitude;
        params.lon = longitude;
      }
      const res = await GET_ACTIVIITES_LIST(params);
      this.totalPage = res.data.totalPage;
      this.listData = [...this.listData, ...res.data.data];
      this.refush = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
