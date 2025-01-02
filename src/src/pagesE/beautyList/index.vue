<template>
  <view class="page-wrapper">
    <scroll-view
      class="scroll-list"
      :enable-flex="true"
      :scroll-y="true"
      @scrolltolower="onLoadMore"
    >
      <view class="header-top">
        <div class="bar" :style="{ height: statusBarHeight }"></div>
        <div class="bar-c">
          <view class="return" @click="handleReturn"></view>
          <view class="status-text">
            <view>美洗记录</view>
          </view>
        </div>
      </view>
      <div class="block"></div>
      <div class="mx-list">
        <div class="mx-item" v-for="(item, index) in meiXiList" :key="index">
          <div class="ll">
            <div class="name">{{ item.skuName }}</div>
            <div class="pet">
              <span class="p1">{{ statusObj[item.status] }}</span>
              <span class="p2">{{ item.petName }}</span>
              <!-- <span class="p3">{{ item. }}</span> -->
            </div>
            <div class="time">{{ showTime(item.reservationBeginTime) }}</div>
          </div>
          <div class="rr">
            <div
              class="sign"
              v-if="item.viewSignInBtn"
              @click="handleSign(1, item)"
            >
              去签到
            </div>
            <div
              class="watch"
              v-if="!item.viewSignInBtn"
              @click="handleSign(2, item)"
            >
              查看
            </div>
          </div>
          <div v-if="item.userSignIn" class="signed">已签到</div>
        </div>
      </div>
    </scroll-view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getBeautyList } from "@/api/reservation";
//import { wxShareMethod } from "@/utils/wxShare";
import dayjs from "dayjs";
export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: {},
  data() {
    return {
      statusObj: {
        0: "待到店",
        10: "待服务",
        20: "服务中",
        40: "已完成",
        "-10": "已取消",
        "-20": "预约失败",
      },
      statusBarHeight: "",
      pageNum: 1,
      pageSize: 10,
      meiXiList: [],
      totalCount: 0,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      userPetList: (state) => state.userPetList,
    }),
  },
  onLoad(option) {
    if (option.id) {
    }
  },
  onReady() {},
  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        console.log("res ", res);
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    this.pageNum = 1;
    this.handleGetList(true);
  },
  methods: {
    handleReturn() {
      uni.switchTab({
        url: `/pages/mall/index`,
      });
    },
    handleSign(type, item) {
      uni.navigateTo({
        url: `/pagesE/beautyWashing/index?sign=${type}&id=${item.id}`,
      });
    },
    showTime(time) {
      let show_day = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      );

      return `${dayjs(time).format("YYYY-MM-DD")} ${
        show_day[dayjs(time).format("d")]
      } ${dayjs(time).format("HH:mm")}`;
    },
    onLoadMore() {
      if (this.meiXiList.length >= this.totalCount) {
        console.log("没有更过数据了");
        return;
      }
      this.pageNum++;
      this.handleGetList();
    },
    handleGetList(refresh) {
      getBeautyList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        reservationType: 1,
        // channelSource: 2,
        sortField: "reservation_begin_time",
        userId: uni.getStorageSync("storage_info").userId,
      }).then((res) => {
        console.log("🚀 ~ handleGetList ~ res:", res);
        const { totalCount, data = [] } = res.data.data;
        if (refresh) {
          this.meiXiList = data;
        } else {
          this.meiXiList = [...this.meiXiList, ...data];
        }
        this.totalCount = totalCount;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
