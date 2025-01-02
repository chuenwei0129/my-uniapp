<template>
  <view class="container">
    <view class="nav">
      <ServiceNav
        :status="orderDetail.orderStatus"
        :payEndTime="orderDetail.payEndTime"
        @timeDeadLine="timeDeadLine"
      ></ServiceNav>
    </view>
    <view
      class="box"
      :style="{ paddingBottom: safeBottomPadding, paddingTop: navHeight }"
    >
      <view
        class="order-status-wrapper"
        v-if="
          reservationStatus.reservationId ||
          reservationStatus.canJumpReservation
        "
      >
        <view
          class="order-wrapper bg-text"
          v-if="reservationStatus.reservationId"
          @click="goSubmitReservationDetail"
        >
          <view class="text-wrapper" v-if="reservationStatus.status == 10">
            <view class="text"
              >成功预约
              {{ reservationStatus.reservationBeginTime }} 到店使用</view
            >
            <view class="text-extra">请按时到店</view>
          </view>
          <view
            class="text-wrapper"
            v-else-if="reservationStatus.applyStatus == 10"
          >
            <view class="text"
              >已预约
              {{ reservationStatus.reservationBeginTime }} 到店使用</view
            >
            <view class="text-extra">门店确认中</view>
          </view>
          <image
            class="order-icon"
            src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/icon-right.png"
            fit="contain"
          />
        </view>
        <view
          class="order-wrapper"
          @click="goSubmitReservation"
          v-else-if="reservationStatus.canJumpReservation"
        >
          <!-- 利用 img load 事件，触发 埋点事件 -->
          <image
            class="order-icon"
            @load="onSubmitReservationShow"
            @error="onSubmitReservationShow"
            src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/time.png"
            fit="contain"
          />
          <view>立即预约</view>
        </view>
      </view>
      <view class="code fl-column-center" v-if="orderDetail.orderStatus === 5">
        <image
          v-if="qrCodeUrl.length > 0"
          :src="qrCodeUrl"
          :style="{ width: codeSize, height: codeSize }"
        ></image>
        <canvas
          v-else
          class="fl-row-center"
          id="qrcode"
          canvas-id="qrcode"
          :style="{ width: codeSize, height: codeSize }"
        ></canvas>
        <view style="width: 271rpx; height: 60rpx; margin-top: 20rpx">
          <tkiBarcode
            :loadMake="false"
            :opations="opations"
            :onval="true"
            format="code128"
            :val="verifyInfo.verifyCode"
            ref="barcode"
            @result="barCodeResult"
          />
        </view>
        <view class="fl-row-center">
          <view class="code-title">券码</view>
          <view class="code-title-num">{{ verifyInfo.verifyCode }}</view>
        </view>
        <view class="code-des"
          >有效期至{{ verifyInfo.verifyValidEndTime }}，到期未使用自动退款</view
        >
      </view>

      <view class="goods-box" @click="routerGoodsDetail">
        <view v-for="(bean, index) in orderDetail.orderItems" :key="index">
          <goodsItem :item="bean"></goodsItem>
        </view>
      </view>
      <view class="shop-info" v-if="orderDetail.orderStatus !== 8">
        <shopInfoCard
          :item="orderDetail.shopInfo"
          @changeFitShop="moreFitShop"
        ></shopInfoCard>
      </view>

      <view
        class="footer"
        v-if="
          orderDetail.verifyInfoList &&
          [6, 14, 15, 16, 20, 21].includes(orderDetail.orderStatus)
        "
      >
        <view class="cell center" v-if="verifyInfo.verifyShopName">
          <view class="cell-title">消费门店</view>
          <view class="cell-des">{{ verifyInfo.verifyShopName }}</view>
        </view>
        <view class="cell center" v-if="verifyInfo.verifyTime">
          <view class="cell-title">消费时间</view>
          <view class="cell-des">{{ verifyInfo.verifyTime }}</view>
        </view>
        <view class="cell center" v-if="verifyInfo.verifyCode">
          <view class="cell-title">券码</view>
          <view class="cell-des">{{
            `${verifyInfo.verifyCode}（ ${
              orderDetail.orderStatus === 6 ? "已核销" : "已退款"
            }）`
          }}</view>
        </view>
      </view>
      <view class="footer">
        <view class="cell center">
          <view class="cell-title">商品金额</view>
          <goodsPrice
            :salePrice="orderDetail.orderAmount"
            sale-color="#1f1f1f"
            salePriceIntegerFontSize="29"
          ></goodsPrice>
        </view>
        <view class="cell center">
          <view class="cell-title">优惠券</view>
          <goodsPrice
            v-if="orderDetail.changeAmount && orderDetail.changeAmount > 0"
            :salePrice="orderDetail.changeAmount"
            salePriceIntegerFontSize="29"
            left="-"
          ></goodsPrice>
          <view v-else> 无 </view>
        </view>
        <view class="cell center">
          <view class="cell-title">实付款</view>
          <goodsPrice
            :salePrice="orderDetail.realPayAmount"
            salePriceIntegerFontSize="35"
            sale-color="#F33A50"
          ></goodsPrice>
        </view>
        <view v-if="orderDetail.score && orderDetail.score > 0">
          <view class="cell center">
            <view class="cell-title">购物返胖豆</view>
            <view class="bean-back" @click="toBeanPage"
              >+{{ orderDetail.score || 0 }}胖豆
              <image
                v-if="[4, 6, 7].includes(orderDetail.orderStatus)"
                class="arrowRight"
                mode="widthFix"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/arrowRight_red.png"
              ></image
            ></view>
          </view>
          <view class="to-account" @click="toBeanPage">
            <text
              class="txt1"
              v-if="[1, 2, 3, 8, 9].includes(orderDetail.orderStatus)"
              >订单交易完成即可到账</text
            >
            <text
              class="txt1"
              v-else-if="[5, 6].includes(orderDetail.orderStatus)"
              >{{
                orderDetail.orderStatus === 5
                  ? "到店完成核销即可到账"
                  : "可在核销订单查看到账明细"
              }}</text
            >
            <text
              class="txt2"
              v-else-if="[4, 7].includes(orderDetail.orderStatus)"
              >已到账</text
            >
          </view>
        </view>

        <view class="cell center">
          <view class="cell-title">订单编号</view>
          <view class="u-flex-wrap-reverse fl-row-leftStartNowrap center">
            <view class="cell-des">{{ orderDetail.orderNo }}</view>
            <view class="divider-container">
              <view class="divider"></view>
            </view>
            <view class="cell-title" @click="copy(orderDetail.orderNo)"
              >复制</view
            >
          </view>
        </view>
        <view class="cell center">
          <view class="cell-title">提交时间</view>
          <view class="cell-des">{{ orderDetail.orderTime }}</view>
        </view>
      </view>
    </view>

    <view
      class="bottom fl-row-bet-start"
      :style="{ paddingBottom: safeAreaBottom }"
    >
      <CustomerService />
      <view>
        <view
          v-if="[1, 12].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view class="bottom-button" @click="$u.debounce(cancleOrder, 500)">
            取消订单
          </view>
          <view class="bottom-button pay" @click="$u.debounce(goPay, 500)">
            去支付
          </view>
        </view>

        <view
          v-else-if="[5].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view class="bottom-button" @click="$u.debounce(applyRefund, 500)">
            申请退款
          </view>
          <view class="bottom-button pay" @click="$u.debounce(retryBuy, 500)">
            再次购买
          </view>
        </view>
        <view
          v-else-if="[6, 8, 9].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view class="bottom-button" @click="$u.debounce(deleteOrder, 500)">
            删除订单
          </view>
          <view class="bottom-button pay" @click="$u.debounce(retryBuy, 500)">
            再次购买
          </view>
        </view>
        <view
          v-else-if="[14, 15, 16, 20, 21].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view class="bottom-button" @click="$u.debounce(seeAfterSale, 500)">
            查看售后
          </view>
          <view class="bottom-button" @click="$u.debounce(deleteOrder, 500)">
            删除订单
          </view>
          <view class="bottom-button pay" @click="$u.debounce(retryBuy, 500)">
            再次购买
          </view>
        </view>
      </view>
    </view>
    <PopConfirm
      :is-open.sync="isDeletePopShow"
      title="确认删除订单?"
      text="删除后将从你的订单列表移除"
      @confirm="deletePopConfirm"
    />
    <PopConfirm
      :is-open.sync="isGoMallPopShow"
      title="提醒"
      text="商品已下架，去看看其他商品吧"
      confirmText="逛逛商城"
      @confirm="goMall"
    />
    <CancelOrderPop
      :isOpen.sync="isCancelPopShow"
      :scene="1"
      @confirm="canclePopConfirm"
    ></CancelOrderPop>
    <CancelOrderPop
      :isOpen.sync="isRefundPopShow"
      :scene="2"
      @confirm="refundPopConfirm"
    ></CancelOrderPop>
    <PaymentPopup
      :show="showPayWay"
      :payWayList="payWayList"
      :selectedPayWay="selectedPayWay"
      @close="showPayWay = false"
      @select="handlePayWaySelect"
    />
  </view>
</template>

<script>
import ServiceNav from "@/pagesC/orderDetail/componse/serviceNav.vue";
import goodsItem from "@/pagesC/orderDetail/componse/goodsItem.vue";
import goodsPrice from "@/components/goodsPrice/index.vue";
import IconButton from "@/pagesC/components/iconButton/index.vue";
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
import UQRCode from "@/pagesC/components/uqrcodejs/uqrcode";
import shopInfoCard from "@/pagesC/orderDetail/componse/shopInfoCard.vue";
import tkiBarcode from "@/pagesC/components/tki-barcode/tki-barcode.vue";
import orderDetailModel from "@/pagesC/orderDetail/model";
import { GET_ORDER_DETAIL } from "@/api/mall";
import PopConfirm from "@/pagesC/components/PopConfirm/index.vue";
import CancelOrderPop from "@/pagesC/components/cancelOrderPop/index.vue";
import { CHECK_STATUS } from "@/api/mallv2";
import { orderCanJumpReservation } from "@/api/reservation";
import { action_report, display_report } from "@/utils/track";
import PaymentPopup from "../goodsOrderDetail/components/PaymentPopup/index.vue";

export default {
  ///订单状态： 1-待支付、(2-待发货、3-待收货、4-已签收)、5-待核销、6-已核销、(7-交易完成)、8-交易关闭、
  // 9-已过期、12-支付中、14-退款中、15-已退款、16-退货退款、20-部分退款、21-部分退货退款
  components: {
    CancelOrderPop,
    PopConfirm,
    IconButton,
    CellItemNormal,
    ServiceNav,
    goodsItem,
    goodsPrice,
    shopInfoCard,
    tkiBarcode,
    PaymentPopup,
  },

  data() {
    return {
      statusBarHeight: "",
      navHeight: "",
      navBarHeight: "",
      safeAreaBottom: "",
      safeBottomPadding: "",
      codeSize: "",
      qrCodeUrl: "",
      barCodeUrl: "",
      opations: {
        // format: "CODE128",//选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
        height: 52, //高度
        displayValue: false, //是否在条形码下方显示文字
        background: "#ffffff", //设置条形码的背景色
        margin: 0, //设置条形码周围的空白边距
      },
      orderDetail: orderDetailModel.data,
      isDeletePopShow: false,
      isRefundPopShow: false,
      isCancelPopShow: false,
      isGoMallPopShow: false,
      fullOrderStatus: null, // true表示是整单
      reservationStatus: {}, //展示预约状态的判定条件
      showPayWay: false,
      selectedPayWay: "",
      payWayList: [
        {
          label: "微信支付",
          value: "wechat_pay",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/submit_order_wx_pay.png",
        },
        {
          label: "支付宝",
          value: "alipay",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-alipay.png",
        },
      ],
    };
  },

  mounted() {
    this._mapContext = uni.createMapContext("myMap", this);
    console.log("map", this._mapContext);
    const windowInfo = uni.getWindowInfo();
    this.navHeight = getApp().globalData.navHeight + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    this.safeAreaBottom =
      windowInfo.safeAreaInsets.bottom + uni.upx2px(12) + "px";
    this.safeBottomPadding = windowInfo.safeAreaInsets.bottom + 60 + "px";
    this.codeSize = uni.upx2px(271) + "px";
    this.points = [
      {
        longitude: 120.0,
        latitude: 30.28,
      },
      {
        longitude: 120.01,
        latitude: 30.21,
      },
    ];
    this.cluster();
    // MapContext.includePoints({
    //   points: this.points,
    //   success: () => {
    //     console.log("chengg");
    //   },
    //   fail: () => {
    //     console.log("fail");
    //   },
    // });
  },

  computed: {
    verifyInfo() {
      const arr = this.orderDetail?.verifyInfoList ?? [];
      return arr.length > 0 ? arr[0] : {};
    },
    orderItem() {
      const arr = this.orderDetail?.orderItems ?? [];
      return arr.length > 0 ? arr[0] : {};
    },
  },

  onLoad(option) {
    console.log("onLoadon");
    this.orderId = option.orderId;
    this.isReservationOrder();
  },

  onShow() {
    console.log("onShowonShowonShow:::", this.orderId);
    this.loadData();
  },

  methods: {
    // 跳转胖豆主页
    toBeanPage() {
      const str = "/integral/index?transparentTopBar=1";
      const status = this.orderDetail.orderStatus;
      if ([4, 6, 7].includes(status)) {
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${h5Domain[env]}${str}`,
        });
        // #endif
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: "/pagesE/guideApp/index?type=1",
        });
        // #endif
      }
    },
    // 去支付时查询是子单还是父单
    // async isCurOrderSon() {
    //   let params = { id: orderId}
    //   const res = await GET_ORDER_EXTEND(params)
    //   let {fullOrderStatus} = res.data.data
    //   this.fullOrderStatus =  fullOrderStatus
    //   console.log('查询当前是子单还是父单：', res.data)
    // },
    // 订单是否可以跳转预约页面
    async isReservationOrder() {
      const params = {
        orderNo: this.orderId,
      };
      const res = await orderCanJumpReservation(params);
      this.reservationStatus = res.data.data;
      console.log(this.reservationStatus, "console");
    },

    onSubmitReservationShow() {
      console.log("submit reservation show");
      // 出现预约入口 埋点
      display_report({
        display_name: "service_detail_appointment_show",
        module_name: "store",
        extend: {},
      });
    },

    // 立即预约
    goSubmitReservation() {
      // 点击预约入口 埋点
      action_report({
        action_name: "service_detail_appointment_clk",
        module_name: "store",
        extend: {},
      });

      console.log(this.orderDetail, this.orderDetail.orderItems[0], "console");
      uni.redirectTo({
        url: `/pagesB/submitReservation/index?shopId=${this.orderDetail.storeId}&merchantId=${this.orderDetail.merchantId}&skuId=${this.orderDetail.orderItems[0].skuId}&orderNo=${this.orderDetail.orderNo}&actShopId=${this.orderDetail.shopInfo.shopId}`,
      });
    },
    // 跳转预约详情页
    goSubmitReservationDetail() {
      uni.redirectTo({
        url: `/pagesB/reservationService/index?reservationId=${this.reservationStatus.reservationId}`,
      });
    },
    ///可见刷新加载数据
    async loadData() {
      const orderId = this.orderId;
      const res = await GET_ORDER_DETAIL({ orderId: orderId });
      console.log("loadDataloadDataloadData:::", res);
      if (res?.data?.code === 0) {
        this.orderDetail = res?.data?.data ?? {};
        if (this.verifyInfo.verifyCode) {
          this.drawCode(this.verifyInfo.verifyCode);
        }

        console.log("orderDetailorderDetail:", this.orderDetail);
        console.log("orderStatus:", this.orderDetail.orderStatus);
        console.log("orderItems:", this.orderItem);
      } else {
        uni.showToast({
          title: res?.data?.message,
          icon: "none",
        });
      }
    },

    drawCode(url) {
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = url;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = uni.upx2px(271);
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext("qrcode", this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();

      setTimeout(() => {
        var that = this;
        uni.canvasToTempFilePath(
          {
            canvasId: "qrcode",
            success: (res) => {
              console.log("二维码", res.tempFilePath);
              this.qrCodeUrl = res.tempFilePath;
            },
            fail: (err) => {
              console.error("二维码 err, ", err);
            },
          },
          that
        );
      }, 1000);

      setTimeout(() => {
        this.$refs["barcode"]._makeCode();
      }, 100);
    },

    barCodeResult(v) {
      console.log("条形码回执成功:", v);
    },

    ///复制订单号
    copy(orderNum) {
      console.log(`copy${orderNum}`);
      uni.setClipboardData({
        data: orderNum,
        success: function () {
          uni.showToast({
            title: "已成功复制",
            icon: "none",
          });
        },
        fail: function () {
          uni.showToast({
            title: "复制失败",
            icon: "none",
          });
        },
      });
    },

    ///商品详情
    routerGoodsDetail() {
      console.log("商品详情");
      const { itemId, skuId } = this.orderItem;
      const shopId = this.orderDetail?.shopInfo?.shopId ?? "";
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${itemId}&shopId=${
          shopId || ""
        }&skuId=${skuId || ""}`,
      });
    },

    /// 再次购买 & 再来一单
    /// 跳转到商品详情，itemId是必传参数，shopId和skuId如果存在，就传，如果不存在，字段不传或者是传空字符串
    async retryBuy() {
      console.log("再来一单:::::", this.orderDetail);

      const itemId = this.orderItem.itemId;
      const skuId = this.orderItem.skuId;
      const shopId = this.orderDetail?.shopInfo?.shopId ?? "";

      let skuAddDTOList = [];
      this.orderDetail.orderItems.forEach((item) => {
        skuAddDTOList.push({
          skuId: item.skuId,
          skuQty: item.skuQty,
        });
      });
      let shopAddDTOList = [
        {
          shopId: shopId,
          skuAddDTOList: skuAddDTOList,
        },
      ];
      const res = await CHECK_STATUS({
        shopAddDTOList,
      });
      console.log("再来一单:::::", res);
      if (res?.data?.data?.isSuccess) {
        console.log(
          `跳到商品详情Url:/pagesC/goodsServiceDetail/index?itemId=${itemId}&shopId=${shopId}&skuId=${skuId}`
        );
        // uni.navigateTo({
        //   url: `/pagesC/goodsServiceDetail/index?itemId=${itemId}&shopId=${
        //     shopId || ""
        //   }&skuId=${skuId || ""}`,
        // });

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
        this.isGoMallPopShow = true;
      }
    },
    goMall() {
      console.log("逛逛商城");
      this.isGoMallPopShow = false;
      uni.switchTab({
        url: `/pages/mall/index`,
      });
    },

    ///取消订单
    cancleOrder() {
      console.log("取消订单 - 弹框");
      this.isCancelPopShow = true;
    },
    canclePopConfirm() {
      this.isCancelPopShow = false;
      orderDetailModel.com_cancelOrder(this.orderId, () => {
        console.log("取消订单成功，刷新界面");
        this.loadData();
      });
    },

    ///删除订单
    deleteOrder() {
      console.log("删除订单");
      this.isDeletePopShow = true;
    },
    deletePopConfirm() {
      this.isDeletePopShow = false;
      orderDetailModel.com_deleteOrder(this.orderId);
    },

    ///申请退款
    applyRefund() {
      console.log("申请退款 - 弹框");
      this.isRefundPopShow = true;
    },
    refundPopConfirm(reason, additionalReason) {
      console.log("reason::", reason, additionalReason);
      console.log("orderItem::", this.orderItem);
      this.isRefundPopShow = false;
      orderDetailModel.com_applyRefund(
        this.orderId,
        this.orderItem,
        reason.reason,
        reason.additionalReason,
        this.orderDetail.payAmount
      );
    },

    ///查看售后
    seeAfterSale() {
      console.log("查看售后 - 跳界面");
      orderDetailModel.com_seeAfterSale(
        this.orderDetail?.afterSaleInfo?.afterSaleOrderId
      );
    },

    ///查看更多适用门店
    moreFitShop() {
      console.log("更多适用门店");
      const itemId = this.orderItem.itemId;
      const shopId = this.orderDetail?.shopInfo?.shopId ?? "";
      uni.navigateTo({
        url: `/pagesC/applicableStores/index?itemId=${itemId}&shopId=${shopId}`,
        events: {
          resultEvent: function (res) {
            console.log("change store result: ", res);
          },
        },
      });
    },

    ///倒计时结束，刷新界面
    timeDeadLine() {
      this.loadData();
      console.log("timeDeadLine倒计时结束，刷新界面:::");
    },

    ///去支付
    goPay() {
      console.log("去支付");
      // #ifdef MP-WEIXIN
      orderDetailModel.com_requestWxPay(
        this.orderDetail.orderNo,
        this.orderItem.skuName,
        this.orderDetail.realPayAmount,
        this.orderId,
        this.orderDetail.changeAmount,
        "",
        () => {
          ///支付成功或失败，都刷新界面
          console.log("支付成功");
          setTimeout(() => {
            this.loadData();
          }, 100);
        },
        () => {
          console.log("支付失败");
          setTimeout(() => {
            this.loadData();
          }, 100);
        }
      );
      // #endif
      // #ifdef H5
      this.showPayWay = true;
      // #endif
    },
    // 点击标记点
    markertap(value) {
      console.log(value, "点击标记点");
    },
    cluster() {
      console.log("aaa=====", this._mapContext);
      // 仅调用初始化，才会触发 on.("markerClusterCreate", (e) => {})
      this._mapContext.initMarkerCluster({
        enableDefaultStyle: false, // 是否使用默认样式
        zoomOnClick: true, // 点击聚合的点，是否改变地图的缩放级别
        gridSize: 60, // 聚合计算时网格的像素大小，默认60
        complete(res) {
          console.log("initMarkerCluster", res);
        },
      });
      // 缩放视野展示所有经纬度
      this._mapContext.includePoints({
        points: this.points,
        padding: [20, 60, 20, 20],
        complete(res) {
          console.log("includePoints", res);
        },
      });
      // 缩放或拖动导致新的聚合簇产生时触发，仅返回新创建的聚合簇信息。
      // this._mapContext.on("markerClusterCreate", (res) => {
      // 		console.log("markerClusterCreate", res);
      // 		const clusters = res.clusters
      // 		const markers = clusters.map(cluster => {
      // 			const {
      // 				center,
      // 				clusterId,
      // 				markerIds
      // 			} = cluster
      // 			let iconPath = 'https://mp100.fengo.vip/fengo100/2024-07-11/53c3fc2f-e3a9-43b9-96d0-183a90818a49.png'
      // 			return {
      // 				...center,
      // 				width: 0,
      // 				height: 0,
      // 				clusterId, // 必须
      // 				iconPath: iconPath,
      // 				width: 24,
      // 				height: 36,
      // 				label: {
      // 					content: markerIds.length + '',
      // 					fontSize: 16,
      // 					color: '#ffffff',
      // 					width: 20,
      // 					height: 20,
      // 					lineHeight: 20,
      // 					bgColor: '#E90000',
      // 					borderRadius: 10,
      // 					textAlign: 'center',
      // 					anchorX: 12,
      // 					anchorY: -46,
      // 				}
      // 			}
      // 		})
      // 		this._mapContext.addMarkers({
      // 		markers,
      // 		clear: false,
      // 		complete(res) {
      // 			console.log('clusterCreate addMarkers', res)
      // 		}
      // 	})
      // });

      // 聚合簇的点击事件
      // this._mapContext.on("markerClusterClick",(res)=>{
      // 	console.log('markerClusterClick', res)
      // })
      this.addMarkers();
    },
    //  添加标记点
    addMarkers() {
      const make = this.markers;
      this._mapContext.addMarkers({
        make,
        clear: true, //是否先清空地图上所有 marker
        complete(res) {
          console.log("addMarkers", res);
        },
      });
    },
    handlePayWaySelect(value) {
      this.showPayWay = false;
      // 其他处理逻辑
      // #ifdef H5
      this.selectedPayWay = value;
      orderDetailModel.com_requestAppPay({
        tradeInfo: {
          orderNo: this.orderDetail.orderNo,
          itemName: this.orderItem.skuName,
          payAmount: this.orderDetail.realPayAmount,
          discountAmount: this.orderDetail.totalCouponAmount || 0,
          promotionAmount: this.orderDetail.totalActivityAmount || 0,
          currentPayType: value, //TODO
        },
        successCallback: () => {
          ///支付成功或失败，都刷新界面
          console.log("app支付成功");
          // 支付成功 或 失败，都刷新界面
          setTimeout(() => {
            this.loadData();
          }, 100);
        },
        failCallback: () => {
          ///支付成功或失败，都刷新界面
          console.log("app支付失败");
          // 支付成功 或 失败，都刷新界面
          setTimeout(() => {
            this.loadData();
          }, 100);
        },
      });
      // #endif
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
::v-deep .tki-barcode {
  width: 272rpx;
  height: 52rpx;
  image {
    width: 272rpx !important;
    height: 52rpx;
  }
}
</style>
