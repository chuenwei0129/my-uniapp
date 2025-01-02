<template>
  <view class="page-container">
    <!-- <view class="search-wrapper">
      <u-search
        placeholder="日照香炉生紫烟"
        v-model="searchValue"
        :showAction="false"
        @focus="handleSearchFocus"
      ></u-search>
    </view> -->
    <view class="tag-wrapper">
      <u-tabs
        :list="tabList"
        lineWidth="15"
        lineColor="#2DCE80"
        :scrollable="false"
        :activeStyle="{
          color: '#000',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{
          color: 'rgba(153, 153, 153, 1)',
          transform: 'scale(1)',
        }"
        :current="listIndex"
        @click="handleChooseTab"
      >
      </u-tabs>
    </view>
    <view class="guideTip" @click="toGuideApp" v-if="tipShow"
      >仅展示1个月内的订单，APP内查看全部订单<view class="rightarrow"
        ><img
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/redright.png" /></view
    ></view>
    <scroll-view
      scroll-y
      class="order-wrapper"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      @refresherrefresh="myPullDownRefresh"
      @scrolltolower="handleScrollToLower"
    >
      <template v-if="orderList.length">
        <view
          v-for="(item, index) in orderList"
          :key="item.orderNo"
          @click="
            () => {
              handleGoToDetail(item);
            }
          "
        >
          <OrderCard
            :orderInfo="item"
            :isAfterSale="activeOrderTab == 5"
            :source="source"
            @openPop="handlePopOpen"
            @timeout="handleTimeOut"
          /> </view
      ></template>
      <template v-else>
        <view class="empty">
          <NoData
            :noDataText="activeOrderTab == 5 ? '暂无售后哦' : '暂无订单哦'"
            img="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/empty-order.png"
            :isShowMore="source == 30 ? false : true"
          ></NoData>
        </view>
      </template>
    </scroll-view>
    <PopConfirm
      :is-open.sync="isShowPopConfirm"
      :title="popTitle"
      :text="popText"
      @confirm="handlePopConfirm"
    />
    <!-- <ConfirmOrderCard />
      <OrderAmount />
      <PayCard /> -->
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import OrderCard from "./components/ordercard.vue";
import ConfirmOrderCard from "./components/confirmOrderCard.vue";
import OrderAmount from "./components/orderAmount.vue";
import PayCard from "./components/payCard.vue";
import PopConfirm from "./orderDetail/components/popConfirm.vue";
import {
  GET_ORDER_LIST,
  DELETE_ORDER,
  CONFIRM_RECEIPT,
  DELETE_AFTERSALE,
} from "@/api/pay";
import NoData from "@/components/noData/index.vue";
import { action_report } from "@/utils/track";
import { thirdPartyLoginFun } from "@/utils/config";
export default {
  //...wxShareMethod(),
  components: {
    OrderCard,
    ConfirmOrderCard,
    OrderAmount,
    PayCard,
    NoData,
    PopConfirm,
  },
  props: {},
  data() {
    return {
      searchValue: "",
      tabList: [
        {
          name: "全部",
          orderTab: 1,
        },
        {
          name: "待付款",
          orderTab: 2,
        },
        {
          name: "待发货",
          orderTab: 3,
        },
        {
          name: "待收货",
          orderTab: 4,
        },
        {
          name: "退款/售后",
          orderTab: 5,
        },
      ],
      pageSize: 10,
      page: 1,
      orderList: [],
      orderListLock: false,
      activeOrderTab: 1,
      isShowPopConfirm: false,
      popTitle: "",
      popText: "",
      triggered: false,
      isShowNoData: false,
      listIndex: 0,
      oprationOrderNo: "",
      oprationAfterSaleNo: "",
      source: null, //PINGAN 30代表 平安app
      openId: "", //用于平安的三方id
    };
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
    tipShow() {
      // return this.$dsBridge && this.$dsBridge.call("getToken", "getToken")
      //   ? false
      //   : true;
      return false;
    },
  },
  watch: {},
  created() {},
  mounted() {
    console.log("触发mounted");
  },
  onBackPress() {
    console.log("1111");
  },
  onShow() {
    // this.orderListLock = false;
    console.log("触发onshow", this.orderList);
    // return;
    if (this.source && this.source == 30 && this.openId) {
      console.log("进入平安");
      // source:''//PINGAN 平安app
      //先登陆获取token 再请求列表
      thirdPartyLoginFun(
        {
          openId: this.openId,
          thirdType: Number(this.source),
        },
        () =>
          this.handleGetOrderList({
            orderTab: this.activeOrderTab,
            page: 1,
            pageSize: this.pageSize,
          })
      );
    } else {
      console.log('else');
      this.handleGetOrderList({
        orderTab: this.activeOrderTab,
        page: 1,
        pageSize: this.pageSize,
      });
    }
    console.log("触发onshow1", this.orderList);
  },
  onLoad(options) {
    if (options.listIndex) {
      this.listIndex = Number(options.listIndex) + 1;
      this.activeOrderTab = Number(options.listIndex) + 2;
    }
    if (options.openId) {
      this.openId = options.openId;
    }
    if (options.source) {
      this.source = Number(options.source);
    }
    // this.orderList = [];
  },
  methods: {
    toGuideApp() {
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
    },
    handleSearchFocus() {
      uni.navigateTo({
        url: "/pagesA/orderSearchPage/index",
      });
    },
    handleChooseTab(item) {
      console.log(item);
      this.init();
      this.activeOrderTab = item.orderTab;
      this.handleGetOrderList({
        page: 1,
        orderTab: item.orderTab,
        pageSize: this.pageSize,
      });
    },
    handleGetOrderList(data) {
      if (this.orderListLock) return;
      GET_ORDER_LIST(data)
        .then((res) => {
          console.log('handleGetOrderList',res);
          
          this.orderList = res.data.data;
          if (res.data.data.length == 0) {
            this.orderListLock = true;
          }
        })
        .catch((e) => {});
      return true;
    },
    init() {
      this.page = 1;
      this.orderList = [];
      this.orderListLock = false;
      this.activeOrderTab = 1;
    },
    handleScrollToLower() {
      if (this.orderListLock) return;
      this.page++;
      GET_ORDER_LIST({
        page: this.page,
        orderTab: this.activeOrderTab,
        pageSize: this.pageSize,
        channel: this.isNative ? 2 : 1,
      }).then((res) => {
        if (res.data.data.length) {
          this.orderList = this.orderList.concat(res.data.data);
        } else {
          this.orderListLock = true;
        }
      });
    },
    handleGoToDetail(item) {
      if (this.activeOrderTab == 5) {
        uni.navigateTo({
          url: `/pagesA/bussinessOrder/afterSaleOrderDetail/index?afterSaleNo=${item.afterSaleNo}&source=${this.source}`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${item.orderNo}&source=${this.source}`,
        });
      }
    },
    handlePopOpen(data) {
      this.isShowPopConfirm = true;
      this.oprationOrderNo = data.orderNo;
      this.oprationAfterSaleNo = data.afterSaleNo;
      if (data.type == "gain") {
        (this.popTitle = "请确认您已收到货"),
          (this.popText = "确认收货后钱款将打给商家");
      } else if (data.type == "delete") {
        (this.popTitle = "确认删除订单？"),
          (this.popText = "删除后将从你的订单列表移除");
      }
    },
    handlePopConfirm() {
      let ordeNo =
        this.activeOrderTab == 5
          ? this.oprationAfterSaleNo
          : this.oprationOrderNo;
      if (this.popTitle == "确认删除订单？") {
        if (this.activeOrderTab == 5) {
          DELETE_AFTERSALE(ordeNo)
            .then((res) => {
              this.page=1
              this.orderList = [];
              this.orderListLock = false;
              this.handleGetOrderList({
                orderTab: this.activeOrderTab,
                page: 1,
                pageSize: this.pageSize,
                channel: this.isNative ? 2 : 1,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          DELETE_ORDER(ordeNo)
            .then((res) => {
              this.page=1
              this.orderList = [];
              this.orderListLock = false;
              this.handleGetOrderList({
                orderTab: this.activeOrderTab,
                page: 1,
                pageSize: this.pageSize,
              });

            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else if ((this.popTitle = "请确认您已收到货")) {
        //收货流程
        CONFIRM_RECEIPT(ordeNo)
          .then((res) => {
            this.page=1
            this.orderList = [];
            this.orderListLock = false;
            this.handleGetOrderList({
              orderTab: this.activeOrderTab,
              page: 1,
              pageSize: this.pageSize,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleTimeOut(orderNo) {
      this.orderList.forEach((i) => {
        if (i.orderNo == orderNo) {
          i.orderStatus = "CLOSED";
        }
      });
    },
    myPullDownRefresh() {
      this.page = 1;
      this.orderList = [];
      this.orderListLock = false;
      this.triggered = true;
      this.handleGetOrderList({
        orderTab: this.activeOrderTab,
        page: 1,
        pageSize: this.pageSize,
      });
      setTimeout(() => {
        this.triggered = false;
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
