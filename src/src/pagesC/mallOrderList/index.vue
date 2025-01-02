<template>
  <view class="page">
    <view
      class="header"
      :style="{
        paddingTop: statusBarHeight,
      }"
    >
      <!-- 顶部搜索 -->
      <view class="top-navbar">
        <view class="left-icon" @click="handleNavBack"></view>
        <view class="search" @click="handleSearch">
          <u-search
            placeholder="搜索订单"
            disabled
            :showAction="false"
            searchIcon="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/consultationBg-scroll.png"
          ></u-search>
        </view>
        <view
          class="filter-search iconfont icon-shaixuan"
          @click="show = true"
        ></view>
      </view>

      <!-- 标签 -->
      <view class="tag-wrapper">
        <CustomTabs
          :list="tabList"
          font-size="27rpx"
          :scrollable="false"
          :activeStyle="{
            color: '#000',
            fontFamily: 'AlimamaShuHeiTi-Bold',
            fontWeight: 'bold',
            transform: 'scale(1)',
          }"
          :inactiveStyle="{
            color: '#000',
            transform: 'scale(1)',
          }"
          line-width="38rpx"
          line-height="4rpx"
          lineColor="#1F1F1F"
          :current="tabsIndex"
          @click="handleChooseTab"
        >
        </CustomTabs>
      </view>
      <view class="guideTip" @click="toGuideApp" v-if="tipShow()"
        >仅展示3个月内的订单，APP内查看全部订单<view class="rightarrow"
          ><img
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/redright.png" /></view
      ></view>
    </view>

    <view class="main">
      <scroll-view
        scroll-y
        :style="{
          height: `calc(100vh - ${headerHeight}rpx)`,
        }"
        enable-flex="true"
        :scroll-top="newScrollTop"
        @scroll="scroll"
        @scrolltolower="scrollReachBottom"
        @refresherrefresh="myPullDownRefresh"
      >
        <view v-if="!firstLoading">
          <template v-if="orderList.length">
            <!-- 订单列表 -->
            <view class="order-list">
              <view v-for="item in orderList" :key="item.orderNo">
                <GoodsOrderCard
                  :orderInfo="item"
                  @cancelPop="handleCancelPop"
                  @confirmPop="handleConfirmPop"
                  @updateOrderList="handleData"
                  @openMessage="openMessage"
                />
              </view>
            </view>
          </template>
          <template v-else>
            <NoData
              :noDataText="'暂无订单'"
              img="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_order_list_empty.png"
              :isShowMore="false"
            >
            </NoData>
          </template>
        </view>
        <!-- 骨架屏 -->
        <EmptySkeleton v-else />
      </scroll-view>
      <!-- 筛选的弹层 -->
      <SiftPopup
        :statusBarHeight="statusBarHeight"
        :show.sync="show"
        :filterPopupColumns="filterPopupColumns"
        @handleDeliver="handleDeliver"
      >
      </SiftPopup>
      <!-- 待付款的取消订单/待发货的申请退款/售后单重新申请 -->
      <CancelOrderPop
        :scene="cancelPopType === 'cancel' ? 1 : 2"
        :isOpen.sync="isCancelPopShow"
        @confirm="handleCancelPopConfirm"
      />
      <!-- 订单confirm弹窗 -->
      <PopConfirm
        :isOpen.sync="isConfirmPopShow"
        :title="confirmPopTitle"
        :text="confirmContent"
        :confirmText="confirmPopConfirmText"
        :dataInfo="dataInfo"
        @confirm="handleConfirmPopConfirm"
      />
      <!-- 结束问诊 -->
      <ConfirmPop
        :isOpen.sync="isInquiryOpen"
        cancelText="我再想想"
        confirmText="结束问诊"
        text="结束服务后将不能再继续与医生交流，确定要结束本次问诊么？"
        @confirm="handleConfirm"
      />
    </view>
  </view>
</template>

<script>
import CustomTabs from "./components/customTabs/customTabs.vue";
import EmptySkeleton from "./components/emptySkeleton/emptySkeleton";
import SiftPopup from "./components/siftPopup";
import NoData from "@/components/noData/index.vue";
import CancelOrderPop from "@/pagesC/components/cancelOrderPop/index.vue";
import GoodsOrderCard from "./components/goodsOrderCard.vue";
import PopConfirm from "@/pagesC/components/PopConfirm/index.vue";
import ConfirmPop from "@/components/confirmPop/index.vue";
import { END_SHEET } from "@/api/chat";

import { pxToRpx, rpxToPx } from "@/utils/index";
import dayjs from "dayjs";
import {
  GET_MALL_AFTER_LIST,
  GET_MALL_ORDER_LIST,
  GET_MALL_ORDER_LIST_BRADGE,
  DELETE_ORDER,
  CANCEL_ORDER,
  CONFIRM_ORDER,
  DELETE_AFTER_SALE,
  REVOKE_AFTER_SALE,
} from "@/api/mall";
import {
  APPLY_AFTER_SALE,
  GET_RECOMMEND_GOODS,
  CHECK_STATUS,
  GET_SEARCH_ORDER_LIST,
} from "@/api/mallv2";
import { action_report } from "@/utils/track";
import { appId } from "./const";

export default {
  components: {
    CustomTabs,
    EmptySkeleton,
    SiftPopup,
    NoData,
    CancelOrderPop,
    GoodsOrderCard,
    PopConfirm,
    ConfirmPop,
  },

  data() {
    return {
      tabList: [
        {
          name: "全部",
          orderTab: 0,
        },
        {
          name: "待付款",
          orderTab: 1,
        },
        {
          name: "待发货",
          orderTab: 2,
        },
        {
          name: "待收货",
          orderTab: 3,
        },
        {
          name: "待使用",
          orderTab: 5,
        },
        {
          name: "退款",
          orderTab: 6,
        },
      ],
      tabsIndex: 0,
      activeOrderTab: 0,
      orderList: [],
      headerHeight: 0,
      statusBarHeight: 0,
      pageNum: 1,
      pageSize: 20,
      startTime: "",
      endTime: "",
      typeList: "",
      loading: false,
      finished: false,
      newScrollTop: 0,
      oldScrollTop: 0,
      show: false,
      filterPopupColumns: {
        timeColumns: {
          title: "按时间筛选",
          columns: [
            { lable: "近1个月", id: 1 },
            { lable: "近3个月", id: 3 },
            { lable: "近6个月", id: 6 },
            { slotName: "datestartingtime" },
          ],
        },
        typeColumns: {
          title: "按类型筛选",
          columns: [
            { lable: "商品", id: "020" },
            { lable: "服务", id: "021" },
            { lable: "问诊", id: "030" },
            { lable: "萌宠", id: "035" },
            { lable: "胖豆", id: "103" },
            { lable: "活动", id: "036" },
          ],
        },
      },
      oprationOrderInfo: {},
      dataInfo: [],
      // 取消订单/申请退款弹窗
      cancelPopType: "cancel",
      isCancelPopShow: false,

      firstLoading: true, // 第一次加载展示骨架屏
      // 删除订单/确认收货弹窗
      confirmPopType: "",
      isConfirmPopShow: false,
      confirmPopTitle: "",
      confirmContent: "",
      confirmPopConfirmText: "确认",
      isInquiryOpen: false,
      groupId: "",
    };
  },
  computed: {
    isNative() {
      let isdefH5;
      //#ifdef H5
      isdefH5 = false;
      //#endif
      //#ifdef MP-WEIXIN
      isdefH5 = true;
      //#endif
      return isdefH5;
    },
  },
  onLoad(options) {
    const { listIndex = 0 } = options || {};
    // tab对应订单状态
    const orderStatusMap = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 5,
      5: 6,
    };
    this.tabsIndex = Number(listIndex);
    this.activeOrderTab = orderStatusMap[Number(listIndex)];
    this.handleData();
  },
  onShow() {},
  mounted() {
    console.log("触发mounted");
    uni.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#F7F8FC",
    });
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
    this.setPageHeight();
  },
  computed: {},
  methods: {
    tipShow() {
      let isdefH5 = false;
      //#ifdef H5
      isdefH5 = false;
      //#endif
      //#ifdef MP-WEIXIN
      isdefH5 = true;
      //#endif
      return isdefH5;
    },
    handleNavBack() {
      //#ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
      //#ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      //#endif
    },
    setPageHeight() {
      let height = 0;
      // 获取头部高度
      uni
        .createSelectorQuery()
        .in(this)
        .select(".header")
        .boundingClientRect((data) => {
          // 获取顶部安全区，计算list高度 方便滚动
          console.log("头部高度", data.height);

          //#ifdef MP-WEIXIN
          this.statusBarHeight =
            getApp().globalData.statusBarHeight + 20 + "px";
          this.headerHeight =
            pxToRpx(Number(getApp().globalData.statusBarHeight)) +
            pxToRpx(data.height);
          this.headerHeight = `calc(100vh - ${height}rpx)`;
          //#endif

          //#ifdef H5
          this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
          this.headerHeight =
            pxToRpx(Number(getApp().globalData.h5StatusBarHeight)) +
            pxToRpx(data.height);
          console.log(this.headerHeight);
          //#endif
        })
        .exec();
    },
    toGuideApp() {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "orderlist_more_click",
        module_name: "orderList",
        extend: {
          user_id: userInfo.userId,
        },
      });
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=5`,
      });
    },
    // 切换tab请求接口
    handleChooseTab(item) {
      this.goToPageTop();
      this.pageNum = 1;
      this.activeOrderTab = item.orderTab;
      this.finished = false;
      this.handleData();
    },
    // 根据tab请求接口
    handleData() {
      if (this.activeOrderTab === 6) {
        this.pageNum = 1;
        // 退款，单独接口
        this.handleGetAfterList({
          pageNo: this.pageNum,
          pageSize: this.pageSize,
        });
      } else {
        // 其他tab，统一接口
        this.pageNo = 1;
        this.getOrderList({
          pageNo: this.pageNo,
          orderStatus: this.activeOrderTab,
          pageSize: this.pageSize,
          channel: this.isNative ? 2 : 1,
        });
      }
      // 更新数据后重新请求角标
      this.queryBadge();
    },
    /// 请求列表角标数量
    async queryBadge() {
      const res = await GET_MALL_ORDER_LIST_BRADGE();
      const {
        refundingCount,
        tobeUsedCount,
        unpaidCount,
        waitReceivedCount,
        waitShippedCount,
      } = res.data.data;
      console.log(
        "badge:::",
        res,
        refundingCount,
        tobeUsedCount,
        unpaidCount,
        waitReceivedCount,
        waitShippedCount
      );

      this.fetchTabsBradge(
        0,
        unpaidCount,
        waitShippedCount,
        waitReceivedCount,
        tobeUsedCount,
        refundingCount
      );
    },
    // 更新角标
    fetchTabsBradge(a, b, c, d, e, f) {
      this.tabList = [
        {
          name: "全部",
          orderTab: 0,
          badge: {
            value: a,
          },
        },
        {
          name: "待付款",
          orderTab: 1,
          badge: {
            value: b,
          },
        },
        {
          name: "待发货",
          orderTab: 2,
          badge: {
            value: c,
          },
        },
        {
          name: "待收货",
          orderTab: 3,
          badge: {
            value: d,
          },
        },
        {
          name: "待使用",
          orderTab: 5,
          badge: {
            value: e,
          },
        },
        {
          name: "退款",
          orderTab: 6,
          badge: {
            value: f,
          },
        },
      ];
    },
    // 获取订单数据
    async getOrderList() {
      if (this.finished || this.loading) return;
      this.loading = true;
      try {
        const params = {
          page: this.pageNum,
          size: this.pageSize,
          orderStatus: this.activeOrderTab,
          channel: this.isNative ? 2 : 1,
          startTime: this.startTime ? this.startTime : null,
          endTime: this.endTime ? this.endTime : null,
          typeList: this.typeList ? this.typeList : null,
        };
        const { data } = await GET_SEARCH_ORDER_LIST(params);
        if (this.pageNum === 1) {
          this.orderList = data.data.data || [];
        } else {
          this.orderList = [...this.orderList, ...data.data.data];
        }
        // this.orderList = [
        //   {
        //     orderType: "100",
        //     orderStatus: 2,
        //     deliveryStatus: -10,
        //     payEndTime: "2025-01-02 16:00:00",
        //     ifAddPet: 0,
        //     showCommentButton: 0,
        //   },
        // ];

        // 数据全部加载完成
        this.loading = false;
        if (data.data.data.length < 20) {
          this.finished = true;
        }
        if (this.firstLoading) {
          this.firstLoading = false;
        }
      } catch (error) {
        this.loading = false;
        this.firstLoading = false;
      }
    },
    /// 请求售后订单列表
    handleGetAfterList(data) {
      // if (this.orderListLock) return;
      if (this.loading || this.finished) return;
      this.loading = true;
      GET_MALL_AFTER_LIST({
        ...data,
        channel: this.isNative ? 2 : 1,
        appId,
      })
        .then((res) => {
          const afterOrderList = res.data?.data?.data || [];
          const { totalCount = 0 } = res.data?.data || {};
          console.log("GET_MALL_AFTER_LIST:::", res);
          console.log("GET_MALL_AFTER_LIST:::", res.data);
          console.log("GET_MALL_AFTER_LIST:::", res.data.data);
          console.log("GET_MALL_AFTER_LIST:::", res.data.data.data);
          console.log("GET_MALL_AFTER_LIST:::", afterOrderList);
          if (this.pageNum === 1) {
            this.orderList = afterOrderList;
          } else {
            this.orderList = [...this.orderList, ...afterOrderList];
          }
          this.loading = false;
          this.firstLoading = false;
          if (
            afterOrderList.length === 0 ||
            Number(totalCount) === afterOrderList.length
          ) {
            this.finished = true;
          }
        })
        .catch((e) => {
          this.loading = false;
          this.firstLoading = false;
        });
    },
    // 触底加载
    scrollReachBottom() {
      console.log("触底加载");
      this.pageNum++;
      this.handleData();
    },
    // 下拉刷新
    myPullDownRefresh() {
      this.pageNum = 1;
      this.finished = false;
      this.handleData();
    },
    handleDeliver(params) {
      this.startTime = params.startTime ? params.startTime : null;
      this.endTime = params.endTime ? params.endTime : null;
      this.typeList = params.typeList ? params.typeList : null;
      this.finished = false;
      this.handleData();
    },
    scroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
    },
    goToPageTop() {
      // 解决view层不同步的问题
      this.newScrollTop = this.oldScrollTop;
      this.$nextTick(() => {
        this.newScrollTop = 0;
      });
    },
    handleSearch() {
      console.log("去搜索页");
      uni.navigateTo({
        url: "/pagesC/mallOrderList/serachGoods/index",
      });
    },
    selectType() {},
    handleGoToDetail() {},
    // 打开取消订单/申请退款弹窗
    handleCancelPop(data) {
      const { type, orderInfo } = data;
      this.oprationOrderInfo = orderInfo;
      this.cancelPopType = type;
      this.isCancelPopShow = true;
    },
    // 取消订单/申请退款确认逻辑
    handleCancelPopConfirm(data) {
      const { reason, additionalReason } = data;
      const {
        orderId,
        orderItems = [],
        payAmount,
        afterSaleType,
        applyRefundAmount,
      } = this.oprationOrderInfo;
      const { itemId, orderItemId, saleOrderItemId, skuId, skuQty } =
        orderItems[0] || {};
      if (this.cancelPopType === "cancel") {
        this.handleCancelOrder({
          orderId: this.oprationOrderInfo.orderId,
          orderCancelReason: `${reason}${
            reason === "其他原因" ? `: ${additionalReason}` : ""
          }`,
        });
      } else if (this.cancelPopType === "refund") {
        this.handleRefundOrder({
          orderId: orderId,
          ...(additionalReason ? { additionalDesc: additionalReason } : {}), // 其他原因补充
          afterSaleNum: skuQty,
          afterSaleReason: reason,
          afterSaleType: 6, // 6-售后商城仅退款 7-售后商城退款退货
          refundAmount: payAmount,
          itemId,
          orderItemId,
          skuId,
          APPLY_AFTER_SALE: "v2",
        });
      } else if (this.cancelPopType === "reapply") {
        this.handleRefundOrder({
          orderId: orderId,
          ...(additionalReason ? { additionalDesc: additionalReason } : {}), // 其他原因补充
          afterSaleNum: skuQty,
          afterSaleReason: reason,
          afterSaleType, // 6-售后商城仅退款 7-售后商城退款退货
          refundAmount: applyRefundAmount,
          itemId,
          orderItemId: saleOrderItemId,
          skuId,
        });
      }
    },
    // 取消订单
    handleCancelOrder({ orderId, orderCancelReason }) {
      CANCEL_ORDER({
        orderId,
        orderCancelReason,
        appId,
      })
        .then((res) => {
          if (res.statusCode !== 200) {
            uni.showToast({
              title: res.data.message ?? "未知错误",
              icon: "none",
            });
            return;
          }
          uni.showToast({
            title: "取消订单成功",
            icon: "none",
          });
          setTimeout(() => {
            this.orderListLock = false;
            this.handleData();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 申请售后/退款
    handleRefundOrder(data) {
      APPLY_AFTER_SALE({
        ...data,
        appId,
      })
        .then((res) => {
          const resData = res.data.data;
          if (!resData) {
            uni.showToast({
              title: res.data.message ?? "未知错误",
              icon: "none",
            });
            return;
          }
          const afterSaleOrderId = resData.afterSaleOrderId;
          if (afterSaleOrderId) {
            uni.showToast({
              title:
                this.cancelPopType === "reapply"
                  ? "重新申请提交成功"
                  : "退款申请提交成功",
              icon: "none",
            });
            setTimeout(() => {
              this.orderListLock = false;
              this.handleData();
            }, 500);
          }
        })
        .catch((e) => {
          console.log("申请退款报错：", e);
        });
    },
    // 评价
    handleGoEvaluate() {},
    // 支付
    handlepayment() {},
    // 查看物流
    handleGoToDelivery() {},
    // 打开删除订单/确认收货/再来一单弹窗
    handleConfirmPop(data) {
      const { orderInfo, type } = data;
      this.dataInfo = data.orderInfo.orderItems;
      console.log(data);
      this.confirmPopType = type;
      this.oprationOrderInfo = orderInfo;
      if (type === "delete") {
        // 删除订单文案
        this.confirmPopTitle = "删除提醒";
        this.confirmContent = "确认删除该订单？删除后将从你的订单列表移除";
        this.isConfirmPopShow = true;
      } else if (type === "receipt") {
        // 确认收货文案
        this.confirmPopTitle = "请确认您已收到货";
        this.confirmContent = "确认收货后，平台仍将保障您的权益";
        this.isConfirmPopShow = true;
      } else if (type === "another") {
        // 再来一单
        const { orderItems = [], shopId } = orderInfo;
        const { itemId, skuId } = orderItems[0] || {};
        let skuAddDTOList = [];
        orderInfo.orderItems.forEach((item) => {
          if (item.identifier !== 2 && item.identifier !== "2") {
            skuAddDTOList.push({
              skuId: item.skuId,
              skuQty: item.skuQty,
            });
          }
        });
        let shopAddDTOList = [
          {
            shopId: orderInfo.shopId,
            skuAddDTOList: skuAddDTOList,
          },
        ];
        CHECK_STATUS({ shopAddDTOList })
          .then(async (res) => {
            if (res.data?.data?.isSuccess) {
              // #ifdef MP-WEIXIN
              uni.navigateTo({
                url: `/pagesC/shoppingCart/index`,
              });
              // #endif

              // #ifdef H5
              this.$dsBridge.call("gotoPageThroughRoute", {
                page: `${window.location.origin}/crm-medical-h5/#/pagesC/shoppingCart/index`,
              });
              // #endif
            } else {
              this.confirmPopTitle = "";
              this.confirmContent = "商品已下架，去看看其他商品吧～";
              this.confirmPopConfirmText = "去商城逛逛";
              this.isConfirmPopShow = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 删除订单/确认收货/再来一单确认逻辑
    handleConfirmPopConfirm() {
      if (this.confirmPopType === "delete") {
        // 删除订单
        this.handleDeleteOrder();
      } else if (this.confirmPopType === "receipt") {
        // 确认收货
        this.handleConfirmReceipt();
      } else if (this.confirmPopType === "another") {
        // 再来一单
        // 去商城
        uni.switchTab({
          url: "/pages/mall/index",
        });
      }
    },
    // 删除订单逻辑
    handleDeleteOrder() {
      const { orderId } = this.oprationOrderInfo;
      DELETE_ORDER({
        orderId,
        appId,
      })
        .then((res) => {
          if (res.statusCode !== 200) {
            uni.showToast({
              title: res.data.message ?? "未知错误",
              icon: "none",
            });
            return;
          }
          uni.showToast({
            title: "删除订单成功",
            icon: "none",
          });
          setTimeout(() => {
            this.orderListLock = false;
            this.handleData();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 确认收货逻辑
    handleConfirmReceipt() {
      const { orderId } = this.oprationOrderInfo;
      CONFIRM_ORDER({
        orderId,
        appId,
      })
        .then((res) => {
          if (res.statusCode !== 200) {
            uni.showToast({
              title: res.data.message ?? "未知错误",
              icon: "none",
            });
            return;
          }
          uni.showToast({
            title: "确认收货成功",
            icon: "none",
          });
          setTimeout(() => {
            this.orderListLock = false;
            this.handleData();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openMessage(id) {
      this.isInquiryOpen = true;
      this.groupId = id;
    },
    // 结束问诊
    handleConfirm() {
      END_SHEET({ groupId: this.groupId }).then((res) => {});
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>