<template>
  <view v-if="showOverlay" style="height: 100vh; width: 100%"
    ><u-loading-page
      :loading="true"
      loading-text="订单支付中，请稍等"
      bg-color="#e8e8e8"
      color="#000"
    ></u-loading-page
  ></view>

  <view v-else class="order">
    <view class="order-content">
      <view class="box">
        <view class="order-content-status">
          <view v-if="DetailData.isExist" class="flag">
            <image
              src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/time_icon_status.png"
            />
            <text>{{ orderStatus[DetailData.status] }}</text>
          </view>
          <view class="time" v-if="DetailData.status == 150"
            >有效时间：{{ DetailData.verifyTime }}</view
          >
          <view class="time" v-if="DetailData.status == -400"
            >退款时间：{{ DetailData.orderRefundTime }}</view
          >
          <view
            v-if="
              DetailData.isExist &&
              DetailData.countDownTime > 0 &&
              DetailData.status == 10
            "
            class="time"
          >
            <u-count-down
              :time="Number(DetailData.countDownTime)"
              format="剩mm分ss秒自动取消"
              @finish="handleFinish(item)"
            >
            </u-count-down>
          </view>
        </view>
        <view
          :class="[
            (DetailData.status == -400 && DetailData.isExist) ||
            (DetailData.status == 150 && DetailData.isExist) ||
            (DetailData.status == 10 && DetailData.isExist)
              ? 'marginT'
              : '',
            'order-content-allDesc',
          ]"
        >
          <view class="address">
            <view>{{ DetailData.address || "" }} </view>
            <view class="phone"
              >预留电话：
              <input
                v-if="!DetailData.isExist"
                type="tel"
                v-model="DetailData.phone"
              />
              <text v-else>{{ DetailData.phone || "" }}</text>
              <image
                v-if="!DetailData.isExist"
                src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/edit_phone_icon.png"
              />
            </view>
            <view class="distance" @click="openAddress">
              <image
                v-if="gap && !isNaN(gap)"
                src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/address_icon.png"
              />
              <text v-if="gap && !isNaN(gap)">距您 {{ gap }}km</text>
              <view class="look_map"
                >查看地图
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/left_icon_blue.png"
              /></view>
            </view>
            <view
              class="verify-box"
              v-if="
                (DetailData.status == 220 && DetailData.isExist) ||
                (DetailData.status == 300 && DetailData.isExist) ||
                (DetailData.status == 150 && DetailData.isExist) ||
                (DetailData.status == -400 && DetailData.isExist)
              "
              @click="handlecheckCode"
            >
              <view>核销码：</view>
              <image
                src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/verify.png"
              />
            </view>
          </view>

          <view class="orderDesc">
            <view class="goodsTit" @click="handleDetail">
              <!--{{info.productInfo.merchantUserAvatar}}-->
              <image
                class="goodsTit-headImg"
                src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/active_icon.png"
              />
              <text>{{ DetailData.productInfo.activityName }}</text>
              <image
                src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/left_icon.png"
              />
            </view>
            <view class="goods">
              <view class="img"
                ><image mode="aspectFill" :src="DetailData.productInfo.urls"
              /></view>
              <view class="goods-desc">
                <view>{{ DetailData.productInfo.itemTitle }}</view>
                <text>{{ DetailData.productInfo.itemDesc }}</text>
                <view
                  class="Unitprice"
                  :style="DetailData.isExist ? '' : 'margin-top: 0px;'"
                >
                  <view class="Unitprice-count" v-if="DetailData.isExist"
                    ><text>X</text
                    >{{ DetailData.productInfo.productQty || 1 }}</view
                  >
                  <view class="Unitprice-stock" v-else>
                    <text
                      >库存：{{ DetailData.productInfo.stockNum || 0 }}</text
                    >
                    <text>购买数量：1</text>
                  </view>
                  <view
                    class="Unitprice-sum"
                    :style="DetailData.isExist ? '' : 'margin-top: 20px;'"
                    ><text>¥</text>{{ DetailData.priceArr[0]
                    }}<text
                      v-if="
                        DetailData.priceArr && DetailData.priceArr.length == 2
                      "
                      >.{{ DetailData.priceArr[1] }}</text
                    ></view
                  >
                </view>
              </view>
            </view>
            <view class="goods-info" v-if="DetailData.isExist">
              <view @click="handlePhone">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/phone_icon.png"
                />
                <text>联系商家</text>
              </view>
              <view @click="handleClearOrder('service')">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/meg_icon.png"
                />
                <text>在线客服</text>
              </view>
            </view>
          </view>

          <view class="orderPrice">
            <view class="remark" v-if="!DetailData.isExist">
              <view class="title">备注：</view>
              <view class="remark-text" @click="handleOpenRemark">
                <!--<span>{{info.userRemark}}</span>-->
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/left_icon.png"
                />
              </view>
            </view>
            <view class="money">
              <view class="title">金额：</view>
              <text>¥{{ DetailData.payInfo.totalPrice || 0 }}</text>
            </view>
            <view class="actualPayment">
              <view class="title">实付款</view>
              <text>¥ {{ DetailData.payInfo.payAmount || 0 }}</text>
            </view>
          </view>

          <view class="orderInfo" v-if="DetailData.isExist">
            <view class="title">订单信息</view>
            <view class="info">
              <text>订单编号：</text>
              <view>
                <text>{{ DetailData.orderInfo.orderNo }}</text>
                <image
                  @click="handleCopy(DetailData.orderInfo.orderNo)"
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/copy_icon.png"
                />
              </view>
            </view>
            <view class="info">
              <text>下单时间：</text>
              <view>{{ DetailData.orderInfo.orderTime }}</view>
            </view>
            <view
              class="info"
              v-if="DetailData.status != 10 && DetailData.status != -110"
            >
              <text>支付时间：</text>
              <view>{{ DetailData.orderInfo.payTime }}</view>
            </view>
            <view class="info" v-if="DetailData.status == -400">
              <text>退款时间：</text>
              <view>{{ DetailData.orderInfo.orderRefundTime }}</view>
            </view>
            <view
              class="info"
              v-if="DetailData.status != 10 && DetailData.status != -110"
            >
              <text>支付方式：</text>
              <view>{{ payType == "WX" ? "微信支付" : "支付宝" }}</view>
            </view>
            <view
              class="info"
              v-if="DetailData.status != 10 && DetailData.status != -110"
            >
              <text>支付流水号：</text>
              <view>
                <text>{{ DetailData.orderInfo.payOrderNo }}</text>
                <image
                  @click="handleCopy(DetailData.orderInfo.payOrderNo)"
                  src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/copy_icon.png"
                />
              </view>
            </view>
            <view class="info">
              <text class="remark">订单备注：</text>
              <view class="info-text">{{
                DetailData.orderInfo.userRemark || "--"
              }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="order-footer" v-if="!DetailData.isExist">
        <view class="order-footer-price">
          <view v-if="!DetailData.isExist">应付：</view>
          <view v-if="!DetailData.isExist">¥ {{ orderAmount || "0" }}</view>
        </view>
        <view class="order-footer-opt" v-if="!DetailData.isExist">
          <view class="orign fl-row-center" @click="goPay">提交订单</view>
        </view>
      </view>
      <view
        class="order-footer"
        v-if="DetailData.isExist && DetailData.status != -200"
      >
        <view></view>
        <view class="order-footer-opt" v-if="DetailData.status == 10">
          <view class="default lin-64" @click="handleClearOrder('cancel')"
            >取消订单</view
          >
          <view class="option fl-row-center" @click="goPay">去支付</view>
        </view>
        <view class="order-footer-opt" v-else-if="DetailData.status == 150">
          <view class="default lin-64" @click="handleClearOrder('refund')"
            >申请退款</view
          >
          <view class="option fl-row-center" @click="handlecheckCode"
            >核销码</view
          >
        </view>
        <view class="order-footer-opt" v-else>
          <view class="default lin-64" @click="handleClearOrder('delete')"
            >删除</view
          >
        </view>
      </view>
    </view>
    <remarkModel :ifRemark="ifRemark" @openRemark="handleRemark" />
    <qrCodePop
      :isOpen.sync="qrCodeShow"
      :isUse="isUse"
      :code="DetailData.serviceVerifyInfo.verifyCode"
      :time="DetailData.verifyTime"
    />
    <modalOrder
      :content="content"
      :isOpen.sync="OrderShow"
      :sureText="sureText"
      @sureFn="handleSubmit"
      :ifCancel="submitType == 'service'"
    />
    <!-- 微信报名弹窗 -->
    <AddWxPop
      :show="addWxPop"
      :aid="DetailData.activityId"
      @close="closeAddWxPop"
    />
  </view>
</template>

<script>
import { mapState } from "vuex";
import { payArr, orderStatus } from "./data/index";
//  //import { wxShareMethod } from "@/utils/wxShare";
// import { appId, getCode } from "@/utils/config";
import { getProgramLocation, wxPay, distance } from "@/utils/index";
import {
  getOrderDetailData,
  calcOrderAmount,
  getPlaceOrderData,
  PlaceOrder,
  PrePayOrder,
  setCancelOrder,
  setDeleteOrder,
  setRefundOrder,
  OrderPay,
} from "@/api/activityorder";

import modalOrder from "../activesOrderList/components/modalOrder.vue";
import qrCodePop from "../activesOrderList/components/qrCodePop.vue";
import remarkModel from "./components/remarkModel.vue";
import { sendFormId, formId } from "@/utils/index";
import AddWxPop from "../activityDetails/components/AddWxPop.vue";
// import StartAppModal from "../shareActivityDetails/components/StartAppModal.vue";
export default {
  components: {
    remarkModel,
    modalOrder,
    qrCodePop,
    AddWxPop,
  },
  data() {
    return {
      addWxPop: false, //添加官方微信弹窗
      isPayOpen: false,
      payArr,
      DetailData: {
        activityId: "",
        isExist: false,
        address: "",
        phone: "",
        productInfo: {},
        payInfo: {},
        orderInfo: {},
        countDownTime: 0,
        userRemark: "",
        status: "",
        lat: "",
        lon: "",
      },
      submitType: "",
      payInd: 0,
      payType: "",
      query: {
        orderNos: "",
        aid: "",
      },
      orderAmount: 0,
      ifRemark: false,
      RemarkText: "",
      qrCodeShow: false,
      OrderShow: false,
      content: "",
      orderStatus,
      gap: "",
      sureText: "",
      isUse: false,
      activityType: "",
      skuId: "",
      isClick: false,
      timer: null,
      timeCount: 0,
      showOverlay: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  onLoad(option) {
    console.log("option:", option);
    this.DetailData.isExist = option.isExist == "true" ? true : false;
    this.query.orderNos = option.orderNos;
    this.query.aid = option.aid;
    this.skuId = option.skuId;
    this.activityType = option.activityType;

    // this.fetchPosition()
  },
  onReady() {},
  onShow() {
    uni.removeStorageSync("orderRemark");
    console.log("option: onShow :");
    this.init();
  },
  methods: {
    //初始化
    init() {
      uni.setNavigationBarTitle({
        title: this.DetailData.isExist ? "订单详情" : "提交订单",
      });
      console.log("this.DetailData 2 : ", this.DetailData);
      console.log("this.query : ", this.query);
      if (this.DetailData.isExist) {
        this.getOrderDetail();
      } else {
        this.getPlaceOrder();
      }
    },
    //订单详情
    async getOrderDetail() {
      const { orderNos = "" } = this.query;
      let data = await getOrderDetailData(orderNos);
      this.DetailData.activityId = data.data.activityId;
      this.DetailData.lat = data.data.addressResponse.lat;
      this.DetailData.lon = data.data.addressResponse.lon;
      const lat = data.data.addressResponse.lat;
      const lon = data.data.addressResponse.lon;
      this.gap = distance(lat, lon) >= 1000 ? "999+" : distance(lat, lon);
      this.DetailData.orderRefundTime = data.data.orderRefundTime;
      this.DetailData.address = data.data.addressResponse
        ? `${data.data.addressResponse.province || ""} ${
            data.data.addressResponse.city || ""
          } ${data.data.addressResponse.area || ""} ${
            data.data.addressResponse.address || ""
          }`
        : "";
      this.DetailData.phone = data.data.phone || "-";
      this.DetailData.merchantPhone = data.data.merchantPhone;
      this.DetailData.productInfo =
        {
          ...data.data.orderItemResponses[0],
          activityName: data.data.activityName,
          merchantUserAvatar: data.data.merchantUserAvatar,
          price: `${data.data.orderItemResponses[0].price}`,
        } || {};
      this.DetailData.payInfo = {
        payAmount: data.data.payAmount || 0,
        totalPrice: data.data.totalPrice || 0,
      };
      this.DetailData.orderInfo = {
        orderNo: data.data.orderNo,
        orderTime: data.data.orderTime,
        payTime: data.data.payTime,
        orderRefundTime: data.data.orderRefundTime,
        userRemark: data.data.userRemark || "",
        payOrderNo: data.data.payOrderNo || "",
      };
      this.DetailData.status = data.data.status;
      if (
        data.data.status == 150 ||
        data.data.status == -400 ||
        data.data.status == 300 ||
        data.data.status == 220
      ) {
        this.DetailData.verifyTime = `${data.data.serviceVerifyInfo.showValidBeginDate}-${data.data.serviceVerifyInfo.showValidEndDate}`;
        this.DetailData.serviceVerifyInfo = data.data.serviceVerifyInfo;
      }
      this.DetailData.priceArr = this.DetailData.productInfo.price.split(".");
      this.DetailData.countDownTime =
        data.data.countDownTime - new Date().getTime();
      this.payType = data.data.payType;
    },
    //获取下单页面数据
    async getPlaceOrder() {
      const { aid = "" } = this.query;
      let params = {};
      params.activityId = aid;
      console.log("this.query ", this.query);
      console.log("this.DetailData ", this.DetailData);

      if (this.skuId && this.skuId.length) {
        params.activityType = this.activityType;
        // params.itemId =
        params.skuId = this.skuId;
      }

      console.log("params ", params);

      let data = await getPlaceOrderData(params);
      const lat = data.data.addressResponse.lat;
      const lon = data.data.addressResponse.lon;
      this.DetailData.lat = data.data.addressResponse.lat;
      this.DetailData.lon = data.data.addressResponse.lon;
      this.gap = distance(lat, lon) >= 1000 ? "999+" : distance(lat, lon);
      this.DetailData.address = data.data.addressResponse
        ? `${data.data.addressResponse.province || ""} ${
            data.data.addressResponse.city || ""
          } ${data.data.addressResponse.area || ""} ${
            data.data.addressResponse.address || ""
          }`
        : "";
      this.DetailData.phone = data.data.userPhone || "-";
      this.DetailData.productInfo = {
        itemTitle: data.data.title,
        stockNum: data.data.stockNum,
        itemDesc: data.data.description,
        urls: data.data.url,
        activityName: data.data.activityName,
        price: `${data.data.price}`,
        skuId: data.data.skuId,
        salePrice: data.data.salePrice,
        productId: data.data.productId,
      };
      this.DetailData.payInfo = {
        payAmount: data.data.price || 0,
        totalPrice: data.data.price || 0,
      };
      this.payType = this.payInd == 0 ? "WX" : "ZFB";
      this.DetailData.priceArr = data.data.price.split(".");
      this.getCalcOrderAmount();
    },
    //总价
    async getCalcOrderAmount() {
      let data = await calcOrderAmount({
        productQty: 1,
        skuId: this.DetailData.productInfo.skuId,
      });
      this.orderAmount = data.data.orderAmount || 0;
    },

    async callbackTimeCount(orderNo) {
      let that = this;
      this.showOverlay = true;
      // uni.showLoading();
      if (this.timer) {
        clearInterval(this.timer);
      }
      //轮训查询订单状态

      that.timer = setInterval(async () => {
        that.timeCount++;
        console.log("that.timeCount ", that.timeCount);
        if (that.timeCount >= 3) {
          // uni.hideLoading();
          clearInterval(that.timer);
          that.timer = null;
          // this.DetailData.isExist = true
          // this.init()
          console.log("查3次没查到 ");
          uni.navigateTo({
            url: `/pagesF/activityDetails/index?aid=${this.query.aid}&paySuccess=1`,
          });
          return;
        }
        //查询订单状态
        try {
          const orderRes = await getOrderDetailData(orderNo);
          console.log("orderRes ", orderRes);
          if (orderRes.data.status == 200 || orderRes.data.status == 150) {
            clearInterval(that.timer);
            that.timer = null;
            // uni.hideLoading();
            // this.DetailData.isExist = true
            // this.init()
            console.log("查到待核销 ");
            uni.navigateTo({
              url: `/pagesF/activityDetails/index?aid=${this.query.aid}&paySuccess=1`,
            });
          }
        } catch (error) {}
      }, 3000);
    },

    //下单及支付
    async goPay() {
      if (this.isClick) {
        return;
      }
      this.isClick = true;
      setTimeout(() => {
        console.log("点击中。");
        this.isClick = false;
      }, 3000);

      const params = this.payParams();
      const { userId } = uni.getStorageSync("storage_info");
      const { orderNos = "", aid = "" } = this.query;
      let Payparams = {};
      if (!/^1[3456789]\d{9}$/.test(this.DetailData.phone)) {
        uni.showToast({
          icon: "none",
          title: "预留手机号不正确",
        });
        console.log("点击中。1");
        return;
      }
      console.log("点击中。2");
      if (!this.DetailData.isExist) {
        let data = await PlaceOrder(params);
        console.log("点击中。3", data.data.orderNo);
        this.query.orderNos = data.data.orderNo;
        this.setRouter(
          `/pagesF/activesPlaceOrder/index?isExist=true&aid=${aid}&orderNos=${data.data.orderNo}`
        );
        Payparams = {
          price: data.data.orderItemResponses[0].price,
          orderNo: data.data.orderNo,
        };
      } else {
        Payparams = {
          price: this.DetailData.productInfo.price * 1,
          orderNo: orderNos,
        };
      }
      console.log("点击中。4", this.query.orderNos);
      wxPay(Payparams, async (res) => {
        console.log("res ", res, this.query.orderNos);
        if (res == "error") {
          uni.showToast({
            icon: "none",
            title: "支付失败",
          });
          console.log("支付失败 ");
          this.DetailData.isExist = true;
          this.init();
        } else {
          console.log("支付成功", this.query.orderNos);

          this.callbackTimeCount(this.query.orderNos);
          console.log("支付成功", this.query.aid);

          uni.showToast({
            icon: "none",
            title: "支付成功",
          });
          sendFormId({
            modelIdArr: [JSON.parse(formId).DXTU, JSON.parse(formId).RWYw],
            path: `/pagesF/activityDetails/index?aid=${aid}&paySuccess=1`,
          });
        }
      });
    },
    payParams() {
      const { userId } = uni.getStorageSync("storage_info");
      const orderItms = this.DetailData.isExist
        ? {
            discountPrice: this.DetailData.productInfo.price,
            itemId: this.DetailData.productInfo.itemId,
            price: this.DetailData.productInfo.price,
            skuId: this.DetailData.productInfo.skuId,
            productQty: this.DetailData.productInfo.productQty,
          }
        : {
            discountPrice: this.DetailData.productInfo.salePrice,
            itemId: this.DetailData.productInfo.productId,
            price: this.DetailData.productInfo.price,
            skuId: this.DetailData.productInfo.skuId,
            productQty: 1,
          };
      const { aid } = this.query;
      let obj = {
        activityId: aid,
        orderItems: [orderItms],
        orderType: "PAID_ACTIVITIES",
        payType: this.payType,
        userId,
        userRemark: this.DetailData.isExist
          ? this.DetailData.orderInfo.userRemark
          : this.DetailData.userRemark || uni.getStorageSync("orderRemark"),
        userReservedMobile: this.DetailData.phone,
      };
      return obj;
    },
    payTab(i) {
      this.payInd = i;
      this.payType = i == 0 ? "WX" : "ZFB";
    },
    // 点击打开更改备注弹窗
    handleOpenRemark() {
      this.ifRemark = true;
      this.DetailData.userRemark = "";
    },
    // 修改备注
    handleRemark(data) {
      this.ifRemark = false;
      // if(data.type !== 'close') {
      this.RemarkText = data.remark;
      this.DetailData.userRemark = this.RemarkText;
      // }
    },
    setRouter(url) {
      uni.reLaunch({
        url,
      });
    },
    handleFinish(item) {
      this.init();
    },
    //复制
    handleCopy(data) {
      uni.setClipboardData({
        data,
        success: function () {
          uni.showToast({
            icon: "none",
            title: "复制成功",
          });
        },
      });
    },
    //拨打电话
    handlePhone() {
      if (this.DetailData.merchantPhone) {
        uni.makePhoneCall({
          phoneNumber: this.DetailData.merchantPhone,
        });
      }
    },
    //弹窗内容处理
    handleClearOrder(type) {
      this.OrderShow = true;
      this.submitType = type;
      this.sureText = "确定";
      if (type == "delete") {
        this.content = "是否进行删除操作？";
      } else if (type == "cancel") {
        this.content = "是否取消该订单？";
      } else if (type == "refund") {
        this.content = "是否进行退款操作？";
      } else {
        this.content = "小程序暂不支持在线客服，可下载宠胖胖APP联系在线客服";
      }
    },
    //弹窗提交
    async handleSubmit() {
      let res;
      if (this.submitType == "cancel") {
        res = await setCancelOrder(this.DetailData.orderInfo.orderNo);
        if (res.statusCode == 200) {
          this.init();
        }
      } else if (this.submitType == "delete") {
        res = await setDeleteOrder(this.DetailData.orderInfo.orderNo);
        if (res.statusCode == 200) {
          this.setRouter("/pagesF/activesOrderList/index");
        }
      } else if (this.submitType == "refund") {
        res = await setRefundOrder(this.DetailData.orderInfo.orderNo).catch(
          (err) => {}
        );
        if (res && res.statusCode == 200) {
          this.init();
        } else {
          this.content =
            "已过截止退款时间，不能进行退款，如有疑问，请联系在线客服。";
          this.OrderShow = true;
          this.submitType = "service";
          this.sureText = "知道了";
        }
      } else {
        console.log("知道了");
      }
    },
    //查看券码
    handlecheckCode() {
      this.qrCodeShow = true;
      this.isUse =
        this.DetailData.status == 300 ||
        this.DetailData.status == 220 ||
        this.DetailData.status == -400
          ? true
          : false;
    },
    // 获取位置
    fetchPosition() {
      getProgramLocation();
    },
    // 点击查看地址
    openAddress() {
      uni.openLocation({
        latitude: this.DetailData.lat,
        longitude: this.DetailData.lon,
        name: this.DetailData.address,
      });
    },
    handleDetail() {
      const { aid } = this.query;
      uni.navigateTo({
        url: `/pagesF/activityDetails/index?aid=${
          !this.DetailData.isExist ? aid : this.DetailData.activityId
        }`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
