<template>
  <view class="sheets-lists">
    <u-list
      @scrolltolower="scrolltolower"
      @scrolltoupper="scrolltoupper"
      :scrollTop="scrollTop"
      :height="listHeight"
      v-if="
        sheetForTest.length > 0 || serviceSheetsList.length > 0 || !isCompleted
      "
    >
      <view v-show="isUpper">
        <u-loading-icon textSize="18" :show="isUpper"></u-loading-icon>
      </view>
      <u-list-item
        v-for="(item, index) in serviceSheetsList"
        :key="item.id"
        :id="'msg' + item.groupId"
      >
        <sheetsItem
          :sheet="item"
          :lastMes="lastSheetsMessage[item.groupId] || lastMesTem"
          @openMessage="openMessage"
        ></sheetsItem>
      </u-list-item>
      <u-list-item v-for="(item, index) in sheetForTest" :key="item.id">
        <sheetsItem :sheet="item"></sheetsItem>
      </u-list-item>
    </u-list>

    <view
      class="no-data-con"
      v-if="
        sheetForTest.length === 0 &&
        serviceSheetsList.length === 0 &&
        isCompleted
      "
    >
      <NoData
        noDataText="当前没有您的问诊记录"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
      <!-- <view class="go-sheet" @click="handleGoSheet">去问诊</view> -->
    </view>
    <ConfirmPop
      :isOpen.sync="isOpen"
      cancelText="我再想想"
      confirmText="结束问诊"
      text="结束服务后将不能再继续与医生交流，确定要结束本次问诊么？"
      @confirm="handleConfirm"
    />
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import { mapState, mapMutations } from "vuex";

import NoData from "@/components/noData/index.vue";
import ConfirmPop from "@/components/confirmPop/index.vue";
import sheetsItem from "./sheets-item.vue";
import { getSheetsList } from "@/api/sheets";
import { END_SHEET } from "@/api/chat";
import { debounce } from "@/utils/index";

const lastMesTem = { sendUser: {} };
export default {
  components: {
    sheetsItem,
    NoData,
    ConfirmPop,
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
      indexList: [], // 已结束的问诊单列表
      serviceList: [], // 服务中的问诊单列表
      scrollTop: 10,
      isLock: false, // 是否正在上来加载
      isCompleted: false, // 是否数据加载完毕
      isUpper: false, // 是否正在下来刷新
      pageInfo: {
        pageNo: 1,
        pageSize: 20,
        inquiryType: "",
        sortType: "",
        state: 0,
      },
      lastMess: {
        sendUser: {},
      },
      isOpen: false,
      groupId: "",
      sheetForTest: [],
      // totalCount: 0,
      // totalPage: 1,
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
  },
  watch: {
    isPageShow: {
      handler(val) {
        if (val) {
          this.resetPageData();
          this._getSheetsList();
        }
        // console.log("list pageShow", val);
      },
      immediate: true,
    },
  },
  created() {
    // this._getSheetsList();
  },

  mounted() {
    //结束上一次监听
    uni.$off();
    //全局事件订阅，只要订阅了事件就可以收到值
    uni.$on("refreshSheetList", async (res) => {
      this.sheetForTest = [];
      this.resetPageData();
      this._getSheetsList();
    });
    uni.$on("getSheetListWithParams", async (res) => {
      // this.resetPageData();
      this.sheetForTest = [];
      this.pageInfo = {
        pageNo: 1,
        pageSize: 20,
        inquiryType: res.inquiryType,
        sortType: res.sortType,
        state: res.state,
        petId: res.petId ? res.petId : "",
      };
      this.isLock = false;
      this.isCompleted = false;
      this._getSheetsList();
      this.$nextTick(() => {
        // this.scrollTop = 10;
      });
    });
    uni.getSystemInfo({
      success: (res) => {
        console.log("bbbbbb", res, this.rpxToPx(108));
        // this.listHeight = res.windowHeight - this.rpxToPx(275);

        // #ifdef MP-WEIXIN
        // this.listHeight = res.windowHeight;
        // 110rpx是下拉tab高度
        this.listHeight = `calc(100vh - 120rpx)`;
        // #endif
        // #ifdef H5
        this.listHeight = res.windowHeight - 61;

        // #endif
      },
    });
  },
  methods: {
    ...mapMutations(["setSheetsList", "setServiceSheetsList"]),
    handleConfirm() {
      END_SHEET({ groupId: this.groupId }).then((res) => {});
    },
    openMessage(id) {
      this.isOpen = true;
      this.groupId = id;
    },
    // 去问诊
    handleGoSheet() {
      if (this.userSelectedPetId) {
        uni.navigateTo({
          url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}`,
        });
      } else {
        return uni.showToast({
          title: "请先添加宠物",
          icon: "error",
        });
      }
    },
    // 上拉加载更多
    scrolltolower() {
      this._getSheetsList();
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
        pageNo: 1,
      };
      this.isLock = false;
      this.isCompleted = false;
      this._getSheetsList();
    },
    //问诊单数组过滤
    handleSheetFilter(array) {
      if (!Array.isArray(array)) return;
      let tempSheetArr = array.map((item) => {
        return {
          petInformation: item.petInformation,
          state: item.state,
          inquiryType: item.inquiryType,
          createTime: item.createTime,
          doctorUserName: item.doctorUserName,
          doctorAvatarUrl: item.doctorAvatarUrl,
          commentInfo: item.commentInfo,
          id: item.id,
          groupId: item.groupId,
          remainingTime: item.remainingTime,
          remainingWaitingTime: item.remainingWaitingTime,
          diagnosisStatus: item.diagnosisStatus,
          diagnosticSheet: item.diagnosticSheet,
          reportResult: item.reportResult,
          isShowReportResult: item.isShowReportResult,
          symptomType: item.symptomType,
        };
      });
      return tempSheetArr;
    },
    // 获取全部的问诊单
    async _getSheetsList(state = 0) {
      try {
        if (this.isLock || this.isCompleted) {
          //|| this.isCompleted
          return;
        }
        console.log("_getSheetsList-----");
        this.isLock = true;
        const params = {
          ...this.pageInfo,
        };
        // console.log(
        //   "isLock",
        //   this.isLock,
        //   "isCompleted",
        //   this.isCompleted,
        //   params
        // );
        const res = await getSheetsList(params);
        const sheets = [...res.data.data];
        // 处理在服务中的数据
        if (this.pageInfo.pageNo == 1) {
          const serviceItemIndex = sheets.findIndex((item) => {
            return item.state == 1 || item.state == -1;
          });

          if (serviceItemIndex > -1) {
            const serverItem = sheets.splice(serviceItemIndex, 1);
            // this.serviceList = serverItem;
            this.setServiceSheetsList([...serverItem]);
          } else {
            this.setServiceSheetsList([]);
          }
        }

        if (this.isUpper || this.pageInfo.pageNo == 1) {
          this.sheetForTest = this.handleSheetFilter(sheets);
        } else {
          this.sheetForTest = this.handleSheetFilter([
            ...this.sheetForTest,
            ...sheets,
          ]);
        }

        if (res.data.data.length === this.pageInfo.pageSize) {
          this.pageInfo.pageNo++;
        } else {
          this.isCompleted = true;
        }

        // console.log("问诊单列", res.data);
        // console.log("setSheetsList", this.sheetsList);
        this.isLock = false;
      } catch (e) {
        console.log("获取问诊单列表错误", e);
        this.isLock = false;
      } finally {
        if (this.isUpper) {
          setTimeout(() => {
            this.isUpper = false;
          }, 200);
        }
      }
    },

    resetPageData() {
      this.pageInfo = {
        pageNo: 1,
        pageSize: this.pageInfo.pageSize,
        inquiryType: "",
        sortType: "",
      };
      this.isLock = false;
      this.isCompleted = false;
      // this.indexList = [];
    },
    rpxToPx(rpx) {
      return (rpx / 750) * this.screenWidth;
    },
    handleScroll: debounce(function (e) {
      console.log(e);
      this.scrollTop = e;
    }, 500),
  },
};
</script>

<style lang="scss" scoped>
.sheet-lists {
}
.upper-con {
  text-align: center;
}

.no-data-con {
  padding-top: 180rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .go-sheet {
    margin-top: 30rpx;
    width: 169rpx;
    height: 62rpx;
    background: #ffc900;
    border-radius: 31rpx;
    text-align: center;
    line-height: 62rpx;
    font-size: 26rpx;
    font-weight: bold;
    color: #000000;
  }
}
</style>
