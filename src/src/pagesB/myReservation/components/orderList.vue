<template>
  <view>
    <view class="sheets-lists">
      <u-list
        @scrolltolower="scrolltolower"
        @scrolltoupper="scrolltoupper"
        :scrollTop="scrollTop"
        :height="listHeight"
        v-if="orderFlag"
      >
        <view v-show="isUpper">
          <u-loading-icon textSize="18" show="isUpper"></u-loading-icon>
        </view>
        <view class="line-box"></view>
        <u-list-item v-for="(item, index) in orderList" :key="item.id">
          <OrderItem :info="item"></OrderItem>
        </u-list-item>
      </u-list>
      <view class="no-data-con" v-if="!orderFlag">
        <!-- <NoData
          noDataText="暂无预约服务"
          img="https://henhen-frontend.oss-cn-shanghai.aliyuncs.com/image/medical-mp/chat/empty-sheet-tag.png"
        ></NoData> -->
        <view class="no-img">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/none_outher3.png"
            mode="scaleToFill"
          />
        </view>
        <view class="no-name">暂无预约记录</view>
        <view class="no-btn-box">
          <view @click="goShop" class="btn-left">逛逛商城</view>
          <view @click="goReservation" class="btn-right">去预约</view>
        </view>
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import { mapState, mapMutations } from "vuex";

import NoData from "@/components/noData/index.vue";
import OrderItem from "./orderItem.vue";
// import { GET_COUPON_LIST, GET_CARD_LIST } from "@/api/index";
import { myorderlist } from "@/api/reservation";
import { debounce } from "@/utils/index";

export default {
  components: {
    NoData,
    OrderItem,
  },
  props: {
    isPageShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listHeight: 0, //问诊单列表高度
      scrollTop: 1,
      isLock: false, // 是否正在上来加载
      isCompleted: false, // 是否数据加载完毕
      isUpper: false, // 是否正在下来刷新
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      // orderList: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11],
      orderList: [],
      isShowUList: true,
      orderFlag: true,
      totalCount: "",
    };
  },
  computed: {
    screenWidth() {
      return uni.getSystemInfoSync().screenWidth;
    },
  },
  watch: {
    isPageShow: {
      handler(val) {
        if (val) {
          this.resetPageData();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getOrderList();
  },

  mounted() {
    //结束上一次监听
    uni.$off();
    //全局事件订阅，只要订阅了事件就可以收到值
    uni.$on("changeTab", async (res) => {
      // this.isShowUList = false;
      this.orderList = [];
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10,
      };
      this.isLock = false;
      this.isCompleted = false;
      this.status = this.statusMap[res];
      this.getOrderList();
      this.$nextTick(() => {
        // this.scrollTop = 1;
        // this.isShowUList = true;
      });
    });
    uni.getSystemInfo({
      success: (res) => {
        this.listHeight = res.windowHeight - this.rpxToPx(90);
      },
    });
  },
  methods: {
    ...mapMutations(["setSheetsList", "setServiceSheetsList"]),
    // 上拉加载更多
    scrolltolower() {
      console.log("到底");

      if (this.orderList.length < this.totalCount) {
        this.getOrderList();
      }
    },

    // 下来刷新
    scrolltoupper() {
      if (this.isLock || this.isUpper) {
        return;
      }
      this.isUpper = true;
      // 下拉刷新的逻辑
      // this.resetPageData();
      this.pageInfo = {
        ...this.pageInfo,
        pageNum: 1,
      };
      this.getOrderList();
      this.isLock = false;
      this.isCompleted = false;
    },
    resetPageData() {
      this.pageInfo = {
        pageNum: 1,
        pageSize: this.pageInfo.pageSize,
      };
      this.isLock = false;
      this.isCompleted = false;
    },
    async getOrderList(type) {
      console.log("getOrderList11111111111111111111111111111111");

      try {
        if (!type) {
          if (this.isLock || this.isCompleted) {
            return;
          }
        }
        this.isLock = true;
        const params = {
          ...this.pageInfo,
        };
        console.log(
          "isLock",
          this.isLock,
          "isCompleted",
          this.isCompleted,
          params
        );
        const res = await myorderlist({
          ...this.pageInfo,
          reservationType: 1,
          userId: uni.getStorageSync("storage_info").userId,
          channelSource: 2,
        });
        if (res.data.data.data == null) {
          if (this.pageInfo.pageNum == 1) {
            this.orderFlag = this.orderList?.length ? true : false;
          }
          return;
        }
        const sheets = [...res.data.data.data];
        console.log("sheets", sheets);
        this.totalCount = res.data.data.totalCount;
        if (this.isUpper || this.pageInfo.pageNum == 1) {
          this.orderList = sheets;
        } else {
          this.orderList = [...this.orderList, ...sheets];
        }
        console.log("list", this.orderList);
        if (this.orderList?.length) {
          this.$emit("showbtn", false);
        }
        if (res.data.data.data.length === this.pageInfo.pageSize) {
          this.pageInfo.pageNum++;
        } else {
          this.isCompleted = true;
        }
        this.orderFlag = this.orderList?.length ? true : false;
        this.isLock = false;
      } catch (e) {
        this.orderFlag = false;
        this.isLock = false;
      } finally {
        if (this.isUpper) {
          setTimeout(() => {
            this.isUpper = false;
          }, 200);
        }
      }
    },
    rpxToPx(rpx) {
      console.log("rpxToPx", rpx, this.screenWidth);

      return (rpx / 750) * this.screenWidth;
    },
    handleScroll: debounce(function (e) {
      this.scrollTop = e;
    }, 500),
    goShop() {
      // #ifdef MP-WEIXIN
      console.log("23456");
      uni.switchTab({ url: "/pages/mall/index" });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/app/main?locate_main_fragment=1`,
      });
      // #endif
    },
    goReservation() {
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesB/submitReservation/index?transparentTopBar=1`,
      });
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesB/submitReservation/index`,
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";

.sheets-lists {
  // padding: 11rpx 0;
  // #ifdef H5
  height: calc(100vh - 88rpx);
  // #endif
  // #ifdef MP-WEIXIN
  height: calc(100vh - 77rpx);
  // #endif
  .line-box {
    width: 690rpx;
    height: 8rpx;
  }
  .no-data-con {
    padding-top: 30%;
    .no-img {
      width: 380rpx;
      height: 380rpx;
      margin: 10rpx auto 20rpx;
    }
    .no-name {
      width: 750rpx;
      text-align: center;
      color: #999999;
      font-size: 29rpx;
    }
    .no-btn-box {
      display: flex;
      justify-content: space-between;
      width: 600rpx;
      margin: 60rpx auto 0;
      color: #1f1f1f;
      font-size: 32rpx;
      .btn-left {
        width: 280rpx;
        height: 88rpx;
        border-radius: 44rpx;
        line-height: 88rpx;
        text-align: center;
        border: 1px solid #e6e6e6;
      }
      .btn-right {
        width: 280rpx;
        height: 88rpx;
        border-radius: 44rpx;
        line-height: 88rpx;
        text-align: center;
        border: 1px solid #e6e6e6;
      }
    }
  }
  .cate-title {
    @include textfclaw(27rpx, #000, $align: left, $lineH: 38rpx);
    font-weight: bold;
    margin-bottom: 23rpx;
    margin-top: 23rpx;
  }
  .card-group {
    width: 673rpx;
  }
}
</style>
