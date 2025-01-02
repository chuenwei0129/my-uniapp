<template>
  <view class="index-warp">
    <view class="list-box" v-if="listData && listData.length > 0">
      <activity-list :listArr="listData"></activity-list>
    </view>
    <view class="noData" v-else>
      <NoData
        noDataText="空空如也，胖胖好寂寞..."
        img="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/myActives/nodata-404.png"
      />
    </view>
  </view>
</template>

<script>
import { GET_ACTIVIITES_LIST } from "@/api/activitymine";
import activityList from "../components/activity-list/activity-list.vue";
import NoData from "@/components/noData/index.vue";
export default {
  // #ifdef MP-WEIXIN
  // ...wxShareMethod(),
  // #endif
  components: {
    activityList,
    NoData,
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
      tabVal: "",
      listData: [],
    };
  },
  computed: {},
  onLoad(option) {},
  onReady() {},
  onShow() {
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
    },
    async getMyActivityList() {
      const { latitude, longitude } = uni.getStorageSync(
        "storage_currentPosition"
      );
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        type: "WANTED",
      };
      if (latitude) {
        params.lat = latitude;
        params.lon = longitude;
      }

      const res = await GET_ACTIVIITES_LIST(params);
      this.totalPage = res.data.totalPage;
      this.listData = [...this.listData, ...res.data.data];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
