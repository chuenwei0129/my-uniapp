<template>
  <view>
    <view class="sheets-lists">
      <u-list
        @scrolltolower="scrolltolower"
        @scrolltoupper="scrolltoupper"
        :scrollTop="scrollTop"
        :height="listHeight"
        v-if="couponList.length + cardList.length !== 0 && isShowUList"
      >
        <view v-show="isUpper">
          <u-loading-icon textSize="18" show="isUpper"></u-loading-icon>
        </view>
        <view class="card-group">
          <!-- <view class="cate-title" v-if="!cardList.length == 0"
            >我的问诊卡</view
          > -->
          <!-- <view
            v-for="(item, index) in cardList"
            :key="index"
            class="card-item"
          >
          </view> -->
          <u-list-item v-for="(item, index) in cardList" :key="item.id">
            <CardItem :coupon-detail="item" :status="status"></CardItem>
          </u-list-item>
        </view>
        <!-- <view class="cate-title" v-if="!couponList.length == 0"
          >我的问诊券</view
        > -->
        <u-list-item v-for="(item, index) in couponList" :key="item.id">
          <CouponItem :coupon-detail="item" :status="status"></CouponItem>
        </u-list-item>
      </u-list>
      <view class="no-data-con" v-if="couponList.length + cardList.length == 0">
        <NoData
          noDataText="暂无卡券"
          img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
        ></NoData>
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import { mapState, mapMutations } from "vuex";

import NoData from "@/components/noData/index.vue";
import CouponItem from "./couponItem.vue";
import CardItem from "./cardItem.vue";
import { GET_COUPON_PACK_List, GET_CARD_LIST } from "@/api/index";
import { debounce } from "@/utils/index";
import { getUserInfo } from "@/api/base/index";

export default {
  components: {
    NoData,
    CouponItem,
    CardItem,
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
      provideType: "PLATFORM",
      useBusinessIdentifier: "MEDICAL",
      couponList: [],
      cardList: [],
      statusMap: {
        0: 10,
        1: 20,
        2: 30,
      },
      status: 10,
      isShowUList: true,
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
        console.log("list pageShow", val);
      },
      immediate: true,
    },
  },
  created() {
    // this._getSheetsList();
    this.getCouponList();
    // this.getCardList();
  },

  mounted() {
    //结束上一次监听
    uni.$off();
    //全局事件订阅，只要订阅了事件就可以收到值
    uni.$on("changeTab", async (res) => {
      // this.isShowUList = false;
      this.cardList = [];
      this.couponList = [];
      console.log("🚀 ~ file: couponList.vue:97 ~ uni.$on ~ res:", res);
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10,
      };
      this.isLock = false;
      this.isCompleted = false;
      this.status = this.statusMap[res];
      this.getCouponList();
      // this.getCardList();
      this.$nextTick(() => {
        // this.scrollTop = 1;
        // this.isShowUList = true;
      });
    });
    uni.getSystemInfo({
      success: (res) => {
        this.listHeight = res.windowHeight - this.rpxToPx(310);
        // this.listHeight = res.windowHeight;
      },
    });
  },
  methods: {
    ...mapMutations(["setSheetsList", "setServiceSheetsList"]),
    handleConfirm() {
      END_SHEET({ groupId: this.groupId }).then((res) => {});
    },
    // 上拉加载更多
    scrolltolower() {
      console.log("到底");
      this.getCouponList();
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
      this.getCouponList();
      // this.getCardList();
      this.isLock = false;
      this.isCompleted = false;

      this.$emit("updateCount");
    },
    resetPageData() {
      this.pageInfo = {
        pageNum: 1,
        pageSize: this.pageInfo.pageSize,
      };
      this.isLock = false;
      this.isCompleted = false;
      // this.indexList = [];
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
    async getCouponList() {
      console.log(`getCouponList :  1 ${this.isLock} ${this.isCompleted}`);
      try {
        if (this.isLock || this.isCompleted) {
          //|| this.isCompleted
          return;
        }
        console.log(`getCouponList :  2`);
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
        const res = await GET_COUPON_PACK_List({
          ...this.pageInfo,
          // provideType: "PLATFORM",
          // useBusinessIdentifier: "MEDICAL",
          status: this.status,
          memberId: await this.getUserMemberId(),
        });
        const sheets = [...res.data.data.data];
        if (this.isUpper || this.pageInfo.pageNum == 1) {
          this.couponList = sheets;
        } else {
          this.couponList = [...this.couponList, ...sheets];
        }

        if (res.data.data.data.length === this.pageInfo.pageSize) {
          this.pageInfo.pageNum++;
        } else {
          this.isCompleted = true;
        }

        this.isLock = false;
      } catch (e) {
        this.isLock = false;
      } finally {
        if (this.isUpper) {
          setTimeout(() => {
            this.isUpper = false;
          }, 200);
        }
      }
    },
    async getCardList() {
      GET_CARD_LIST({
        status: this.status,
        useBusinessIdentifier: "MEDICAL",
      }).then((res) => {
        this.cardList = res.data;
      });
    },
    rpxToPx(rpx) {
      return (rpx / 750) * this.screenWidth;
    },
    handleScroll: debounce(function (e) {
      this.scrollTop = e;
    }, 500),
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";

.sheets-lists {
  padding: 19rpx 35rpx;
  // background-color: rgba(245, 246, 247, 1);
  height: calc(100vh - 85rpx);
  // height: 50vh;
  .no-data-con {
    margin-top: 30%;
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
