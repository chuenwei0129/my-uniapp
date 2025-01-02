<template>
  <view class="content flex" @click.prevent="handleClearTip">
    <view class="tabView">
      <view
        class="tab_item"
        v-for="item in tabData"
        :key="item.id"
        @click="handleInd(item)"
      >
        <text :class="item.id == ind ? 'active' : ''">{{ item.title }}</text>
        <view class="line" v-if="item.id == ind"></view>
      </view>
    </view>
    <view class="order" @click.self="handleClientClick">
      <u-list
        @scrolltolower="scrolltolower"
        v-if="orderList.length > 0"
        @scroll="handlelistScroll"
      >
        <u-list-item v-for="(item, index) in orderList" :key="index">
          <view class="order-item">
            <view class="order-item-top flex justify-between align-center">
              <view
                class="order-name flex align-center"
                @click="handleDetail(item, 'active')"
              >
                <image
                  class="img"
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/active_icon.png"
                />
                <text>{{ item.activityName }}</text>
                <image
                  class="left"
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/left_icon.png"
                />
              </view>
              <view class="order-status flex align-center">
                <view v-if="item.status == 10 && item.timeStr > 0" class="time">
                  <u-count-down
                    :time="Number(item.timeStr)"
                    format="剩mm分ss秒"
                    @finish="handleFinish(item)"
                  >
                  </u-count-down>
                </view>
                <text>{{ orderStatus[item.status] }}</text>
              </view>
            </view>
            <view
              class="order-item-middle"
              @click="handleDetail(item, 'order')"
            >
              <view class="order-product flex align-center">
                <image
                  mode="aspectFill"
                  :src="item.orderItemListResponses[0].itemUrl"
                />
                <view class="order-product-text">
                  <view class="desc">
                    <view>{{ item.orderItemListResponses[0].itemTitle }}</view>
                    <text>{{ item.orderItemListResponses[0].itemDesc }}</text>
                  </view>
                  <view class="price flex justify-between">
                    <text class="count"><text>X</text>1</text>
                    <view class="money">
                      <text>¥</text>
                      <view
                        >{{ getPrice(item.payAmount)[0]
                        }}<text v-if="getPrice(item.payAmount)[1]"
                          >.{{ getPrice(item.payAmount)[1] || "" }}</text
                        ></view
                      >
                    </view>
                  </view>
                </view>
              </view>
              <text class="placeOrderTime">下单时间：{{ item.orderTime }}</text>
              <text
                class="placeOrderTime"
                v-if="item.status == 300 || item.status == 220"
                >完成时间：{{ item.orderCompleteTime }}</text
              >
            </view>
            <view
              class="order-item-bottom flex justify-end"
              v-if="item.status == 10"
            >
              <view class="default" @click="handleClearOrder(item, 'cancel')"
                >取消订单</view
              >
              <view class="option" @click="handleTopay(item)">去付款</view>
            </view>
            <view
              class="order-item-bottom flex justify-end"
              v-if="item.status == 150"
            >
              <view
                class="default"
                @click.sync="handleClearOrder(item, 'refund')"
                >申请退款</view
              >
              <view class="option" @click="handlecheckCode(item)">核销码</view>
            </view>
            <view
              class="order-item-bottom flex justify-end"
              v-if="item.status == 220 || item.status == 300"
            >
              <view class="default" @click="handlecheckCode(item)">核销码</view>
            </view>
            <view class="order-item-bottom flex" v-if="item.status == -400">
              <view class="text">退款成功</view>
            </view>
          </view>
        </u-list-item>
        <view v-if="isFinsh" class="finish">{{ listDefaultText }}</view>
      </u-list>
      <NoData
        v-else
        :noDataText="`还没有${indStatus}订单记录哦～`"
        img="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/myActives/nodata-404.png"
      />
    </view>

    <qrCodePop
      :isOpen.sync="qrCodeShow"
      :isUse="isUse"
      :code="itemDetail.verifyCode"
      :time="itemDetail.validEndDate"
    >
    </qrCodePop>
    <modalOrder
      :content="content"
      :isOpen.sync="OrderShow"
      @sureFn="handleSubmit"
      :sureText="sureText"
      :ifCancel="itemDetail.type == 'service'"
    />
  </view>
</template>

<script>
import {
  getOrderList,
  setCancelOrder,
  setDeleteOrder,
  setRefundOrder,
  PrePayOrder,
  OrderPay,
} from "@/api/activityorder";
import { tabData, orderStatus, statusColor, statusTime } from "./data/index";
import modalOrder from "./components/modalOrder.vue";
import qrCodePop from "./components/qrCodePop.vue";
import NoData from "@/components/noData/index.vue";
import { sendFormId, formId } from "@/utils/index";
import { wxPay } from "@/utils/index";
export default {
  components: {
    modalOrder,
    qrCodePop,
    NoData,
  },
  data() {
    return {
      ind: 1,
      pageNo: 1,
      pageSize: 10,
      content: "",
      OrderShow: false,
      qrCodeShow: false,
      isFinsh: false,
      tabData,
      statusColor,
      statusTime,
      tabStatus: "",
      timer: false,
      orderList: [],
      orderStatus,
      itemDetail: {},
      listDefaultText: "",
      currentOpt: "",
      provider: uni.getStorageSync("storage_provider"),
      timeData: {},
      sureText: "",
      isUse: false,
      indStatus: "全部",
      isClick: false,
    };
  },
  onLoad(option) {
    this.getOrderListFn();
  },
  onShow() {},
  onReady() {},

  methods: {
    getPrice(price) {
      return price.split(".");
    },
    scrolltolower() {
      if (!this.isFinsh) {
        this.isFinsh = true;
        this.pageNo += 1;
        this.getOrderListFn();
      } else {
        this.listDefaultText = "没有更多了～";
      }
    },
    handleClientClick() {},
    handlelistScroll() {
      if (this.currentOpt) {
        this.orderList[this.currentOpt - 1].Opt =
          !this.orderList[this.currentOpt - 1].Opt;
        this.currentOpt = "";
      }
    },

    //tab切换数据初始化
    handleInd(item) {
      if (this.currentOpt) {
        this.orderList[this.currentOpt - 1].Opt =
          !this.orderList[this.currentOpt - 1].Opt;
        this.currentOpt = "";
      }

      this.ind = item.id;
      this.indStatus = item.title;
      this.init(item.status);
    },
    handleClearTip(e) {
      if (this.currentOpt) {
        this.orderList[this.currentOpt - 1].Opt =
          !this.orderList[this.currentOpt - 1].Opt;
        this.currentOpt = "";
      }
    },
    init(status = "") {
      this.pageNo = 1;
      this.pageSize = 10;
      this.isFinsh = false;
      this.tabStatus = status;
      this.orderList = [];
      this.getOrderListFn();
    },
    //退款弹窗展示
    handleOperation(i, item) {
      if (this.currentOpt) {
        this.orderList[this.currentOpt - 1].Opt =
          !this.orderList[this.currentOpt - 1].Opt;
        this.currentOpt = "";
      }
      this.currentOpt = i + 1;
      this.orderList[i].Opt = !this.orderList[i].Opt;
    },
    //弹窗内容处理
    handleClearOrder(item, type) {
      this.OrderShow = true;
      this.sureText = "确定";
      this.itemDetail = { ...item, type };
      if (type == "delete") {
        this.content = "是否进行删除操作？";
      } else if (type == "cancel") {
        this.content = "是否取消该订单？";
      } else {
        this.content = "是否进行退款操作？";
      }
    },
    //弹窗提交
    async handleSubmit() {
      const { type, orderNo } = this.itemDetail;
      let res;
      if (type == "cancel") {
        res = await setCancelOrder(orderNo);
        if (res.statusCode == 200) {
          this.init();
        }
      } else if (type == "delete") {
        res = await setDeleteOrder(orderNo);
      } else if (type == "refund") {
        res = await setRefundOrder(orderNo).catch((err) => {});
        if (res && res.statusCode == 200) {
          this.init();
        } else {
          this.content =
            "已过截止退款时间，不能进行退款，如有疑问，请联系在线客服。";
          this.OrderShow = true;
          this.itemDetail.type = "service";
          this.sureText = "知道了";
        }
      } else {
        console.log("知道了");
      }
    },
    //倒计时时间
    timeDown(data) {
      var that = this;
      var orders = data;
      for (var i = 0; i < orders.length; i++) {
        var status = orders[i].status;
        if (status == 10 && orders[i].time) {
          orders[i].timeStr = orders[i].time;
        }
      }
      return orders;
    },
    payParams(data) {
      const orderItms = {
        discountPrice: data.orderItemListResponses[0].discountValue,
        itemId: data.orderItemListResponses[0].itemId,
        price: data.orderItemListResponses[0].price,
        skuId: data.orderItemListResponses[0].skuId,
        productQty: data.orderItemListResponses[0].times,
      };
      let obj = {
        activityId: data.activityId,
        orderItems: [orderItms],
        orderType: "PAID_ACTIVITIES",
        payType: data.payType,
        userId: uni.getStorageSync("storage_info").userId || "",
        userRemark: "",
        userReservedMobile: uni.getStorageSync("storage_info").phone,
      };
      return obj;
    },
    //订单列表加载
    async getOrderListFn() {
      // uni.showLoading();
      let data = await getOrderList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orderStatus: this.tabStatus,
        activityType: "PAID_ACTIVITIES",
      });
      if (data.statusCode == 200 && data.data.data.length > 0) {
        // uni.hideLoading();
        data.data.data.map((item) => {
          item.Opt = false;
          item.time = item.countDownTime - new Date().getTime();
          item.timeStr = 0;
          return item;
        });
        // this.listDefaultText = "加载中";
        let newData = this.timeDown(data.data.data);
        this.orderList = this.orderList.concat(newData);
        if (newData.length < this.pageSize) {
          this.isFinsh = true;
        } else {
          this.isFinsh = false;
        }
      } else {
        this.isFinsh = false;
        uni.hideLoading();
        this.listDefaultText = "没有更多了～";
        if (this.pageSize > 1) {
          this.pageSize -= 1;
        }
      }
    },
    //处理返回操作的时间
    getOptTime(item) {
      if (item.status == -110) {
        return item.orderCancelTime || "";
      } else if (item.status == 150) {
        return item.validEndDate || "";
      } else if (item.status == -400) {
        return item.orderRefundTime || "";
      } else if (item.status == 220) {
        return item.verifyTime || "";
      }
    },
    //查看券码
    handlecheckCode(item) {
      this.itemDetail = {
        ...item,
        verifyCode: item.serviceVerifyInfo.verifyCode,
        validEndDate:
          item.serviceVerifyInfo.showValidBeginDate +
          "-" +
          item.serviceVerifyInfo.showValidEndDate,
      };
      this.isUse =
        item.status == 300 || item.status == 220 || item.status == -400
          ? true
          : false;
      this.qrCodeShow = true;
    },
    handleTopay(item) {
      if (this.isClick) {
        return;
      }
      this.isClick = true;
      setTimeout(() => {
        console.log("点击中。");
        this.isClick = false;
      }, 3000);

      wxPay(
        {
          price: item.payAmount * 1,
          orderNo: item.orderNo,
        },
        (res) => {
          if (res == "error") {
            uni.showToast({
              icon: "none",
              title: "支付失败",
            });
            this.getOrderListFn();
          } else {
            uni.showToast({
              icon: "none",
              title: "支付成功",
            });
            sendFormId({
              modelIdArr: [JSON.parse(formId).DXTU, JSON.parse(formId).RWYw],
              path: `/pagesF/activityDetails/index?aid=${item.activityId}`,
            });
            this.getOrderListFn();
          }
        }
      );
    },
    handleFinish(item) {
      this.init(this.tabStatus);
    },
    handleDetail(item, type) {
      if (type == "active") {
        uni.navigateTo({
          url: `/pagesF/activityDetails/index?aid=${item.activityId}`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesF/activesPlaceOrder/index?isExist=true&aid=${item.activityId}&orderNos=${item.orderNo}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
