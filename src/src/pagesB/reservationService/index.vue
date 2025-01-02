<template>
  <view class="wrapper">
    <NavBar
      :title="getStatusTitle()[0]"
      titleColor="#000"
      :showBackBtn="true"
      :whiteBack="false"
      @navBackClickHandle="handleNavBack"
      :customback="true"
      navColor="#f7f8fc"
    />
    <scroll-view
      class="content-wrapper"
      scroll-y
      :style="{
        height: `calc(100vh - 115rpx - ${statusBarHeight})`,
      }"
    >
      <view class="tip-box" v-if="detail.status == statusEnum.INIT"
        >服务时间: {{ showTime }}，请提前10分钟到店</view
      >
      <view class="wrapper-up">
        <view class="info">
          <view class="shop-wrapper">
            <view class="shop-info">
              <view class="name">{{ shopName }}</view>
              <view class="address">{{ address }}</view>
            </view>
            <view class="icons">
              <view
                class="left"
                @click="
                  chooseLocation({
                    latitude: detail.shopDetail.lat,
                    longitude: detail.shopDetail.lng,
                    shopName: detail.shopDetail.shopName,
                    address: detail.shopDetail.address,
                  })
                "
              >
                <view class="navigation-icon">
                  <image
                    mode="aspectFit"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_navigator.png"
                  />
                </view>
                <view class="navigation-text">导航</view>
              </view>
              <view
                class="right"
                @click="makePhoneCall(detail.shopDetail.shopPhone)"
              >
                <view class="iphone-icon">
                  <image
                    mode="aspectFit"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_phone.png"
                  ></image>
                </view>
                <view
                  class="iphone-text"
                  @click="makePhoneCall(detail.shopDetail.shopPhone)"
                >
                  电话
                </view>
              </view>
            </view>
          </view>
          <view class="line"></view>
          <view class="sku">
            <view class="sku-left">
              <view class="img">
                <image
                  :src="detail.commodityDetailResponse.pic"
                  mode="aspectFill"
                  class="head"
                />
              </view>
              <view class="des-box">
                <view class="title">
                  {{ detail ? detail.commodityDetailResponse.skuName : "" }}
                </view>
                <view class="tips">
                  {{ detail ? detail.commodityDetailResponse.desc : "" }}
                </view>
              </view>
            </view>
            <view class="sku-right">
              <view
                v-if="
                  detail.commodityDetailResponse &&
                  detail.commodityDetailResponse.price !== undefined &&
                  detail.commodityDetailResponse.price !== null
                "
                style="
                  display: flex;
                  flex-flow: row nowrap;
                  align-items: baseline;
                "
              >
                <GoodsPrice
                  :salePrice="detail.commodityDetailResponse.price"
                  :saleSignWidth="0"
                  saleColor="#1F1F1FFF"
                  :saleSignFontSize="33"
                  :saleFontWeight="400"
                  :salePriceDecimalFontSize="37"
                  :salePriceIntegerFontSize="36"
                >
                </GoodsPrice>
                <view
                  style="
                    font-size: 19rpx;
                    color: #1f1f1f;
                    font-weight: bold;
                    margin-left: 4rpx;
                    margin-top: 10rpx;
                  "
                  >起</view
                >
              </view>
            </view>
            <!-- <image
              :src="detail.commodityDetailResponse.pic"
              mode="aspectFill"
              class="head"
            />
            <view class="right">
              <view class="title"
                >{{
                  detail ? detail.commodityDetailResponse.skuName : ""
                }}</view
              >
              <view class="tips"
                >{{
                  detail ? detail.commodityDetailResponse.desc : ""
                }}</view
              >

              <view
                v-if="
                  detail.commodityDetailResponse &&
                  detail.commodityDetailResponse.price !== undefined &&
                  detail.commodityDetailResponse.price !== null
                "
                style="
                  display: flex;
                  flex-flow: row nowrap;
                  align-items: baseline;
                "
              >
                <GoodsPrice
                  :salePrice="detail.commodityDetailResponse.price"
                  :saleSignWidth="0"
                  saleColor="#1F1F1FFF"
                  :saleSignFontSize="21"
                  :salePriceDecimalFontSize="21"
                  :salePriceIntegerFontSize="39"
                >
                </GoodsPrice>
                <view
                  style="
                    font-size: 21rpx;
                    color: #1f1f1f;
                    font-weight: bold;
                    margin-left: 4rpx;
                  "
                  >起</view
                >
              </view>
            </view> -->
          </view>
          <div v-if="detail.additionalItems" class="server-info">
            <div
              v-for="(skuItem, index) in detail.additionalItems"
              class="server-item"
              :key="index"
            >
              <div class="lable">{{ skuItem.skuName }}</div>
              <div v-if="skuItem.price !== null" class="text">
                <GoodsPrice
                  :salePrice="skuItem.price"
                  saleColor="#1F1F1F"
                  :saleSignWidth="0"
                  :saleFontWeight="400"
                  :saleSignFontSize="29"
                  :salePriceDecimalFontSize="28"
                  :salePriceIntegerFontSize="28"
                >
                </GoodsPrice>
              </div>
            </div>
          </div>
        </view>

        <ReservationInformation :detail="detail" :showTime="showTime">
        </ReservationInformation>
        <OrderInfomation :detail="detail"> </OrderInfomation>

        <ReservationNotice
          :detail="detail"
          v-if="
            detail.shopDetail.bizNotice !== '<p><br></p>' &&
            detail.shopDetail.bizNotice
          "
        >
        </ReservationNotice>

        <view class="safe-placeholder"></view>
      </view>

      <view class="last">
        <view :class="['btn', again ? 'again' : '']" @click="handleBtn">
          <view :class="['text', again ? 'again' : '']">{{
            again ? "再次预约" : "取消预约"
          }}</view>
        </view>
        <div v-if="detail.status" class="ls" @click="handleGoToList">
          美洗记录
        </div>
      </view>

      <CancelReservation
        :isOpen.sync="cancelPop"
        :detail="detail"
        @sendSuccess="sendSuccess"
      />

      <CallConfirmPop
        :isOpen.sync="show"
        :shopPhone="detail.shopDetail.shopPhone"
        @confirm="handleconfirm"
      />

      <!-- <u-modal
        :show="show"
        title="温馨提示"
        confirmText="好的"
        confirmColor="#2DCE80"
        :showCancelButton="false"
        @cancel="handlecancel"
        @confirm="handleconfirm"
      >
        <view class="modal-content">
          <text>今天是预约到店的日期，不允许取消。</text>
          <text>如需取消请联系客服</text>
          <text
            class="iphoneText"
            @click="makePhoneCall(detail.shopDetail.shopPhone)"
            >{{ detail.shopDetail.shopPhone }}</text
          >
        </view>
      </u-modal> -->
    </scroll-view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import ReservationInformation from "./components/reservationInformation.vue";
import OrderInfomation from "./components/orderInfomation.vue";
import ReservationNotice from "./components/reservationNotice.vue";
import CancelReservation from "./components/cancelReservation/index.vue";
import CallConfirmPop from "./components/callConfirmPop/index.vue";
import { GET_test, GET_RESERVATION_DETAIL } from "@/api/reservation";
import { action_report, display_report } from "@/utils/track";
import dayjs from "dayjs";
import NavBar from "@/components/navBar/index.vue";
const module_name = "store";
export default {
  //...wxShareMethod(),
  components: {
    GoodsPrice,
    ReservationInformation,
    OrderInfomation,
    ReservationNotice,
    CancelReservation,
    CallConfirmPop,
    NavBar,
  },
  props: {},
  data() {
    return {
      again: true,
      cancelPop: false,
      statusBarHeight: 0,
      navBarHeight: 0,
      statusEnum: {
        PRE_INIT: 0, //"预约/到店确认"),
        INIT: 10, //"待服务"),
        CONFIRM: 20, // "到店确认"),
        PAYED: 30, //"已支付"),
        FINISH: 40, //"已完成"),
        CANCEL: -10, //"已取消");
        FAIL: -20, //"预约失败/门店拒绝");
        NOTSHOW: -30, //未到店
      },
      reservationId: "",
      detail: {},
      show: false,
      backtype: 0,
    };
  },
  computed: {
    showTime() {
      console.log("this:", this.detail);
      if (!this.detail || !this.detail.reservationBeginTimeTs) {
        return "";
      }

      const t1 = Number(this.detail.reservationBeginTimeTs);
      const t2 = Number(this.detail.reservationEndTimeTs);
      console.log("t1:", t1);
      let show_day = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      );
      let ss1 = dayjs(t1).format("YYYY-MM-DD");
      let ss2 = show_day[dayjs(t1).format("d")];
      let ss3 = dayjs(t1).format("HH:mm");
      let ss4 = dayjs(t2).format("HH:mm");
      console.log("ss", ss1, ss2, ss3);

      let str = ss1 + " " + ss3 + "-" + ss4;
      console.log("str:", str);
      return str;
    },
    shopName(){
      return this.detail?.shopDetail?.shopName || '未知'
    },
    address(){
      return this.detail?.shopDetail?.address || '未知'
    }
  },
  watch: {},
  created() {},
  mounted() {
    console.log("11111 ", this.detail.skuId);
    //#ifdef MP-WEIXIN
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    this.navBarHeight = `calc(115rpx + ${
      getApp().globalData.statusBarHeight
    }px)`;
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    this.navBarHeight = `calc(115rpx + ${
      getApp().globalData.h5StatusBarHeight
    }px)`;
     //#endif
  },
  onReady() {},
  async onLoad(options) {
    console.log("options ", options);
    await this._getDetail({ reservationId: options.reservationId });
    this.reservationId = options.reservationId;
    console.log("222 ", this.detail.skuId);
    this.backtype = options.backtype;

    // 展示时，
    display_report({
      display_name: "appointment_order_show",
      object_type: module_name,
      extend: {
        skuId: this.detail.skuId,
      },
    });
  },
  methods: {
    handleNavBack() {
      //#ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
      //#ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
        fail(e) {
          uni.switchTab({
            url: "/pages/mall/index",
          });
        },
      });
      //#endif
    },
    handleGoToList() {
      uni.navigateTo({
        url: `/pagesE/beautyWashing/index?id=${this.detail.id}`,
      });
    },
    handlegoToCon() {
      console.log("handlegoToCon === 1 。", this.backtype);
      // if (this.backtype == 1) {
      //   console.log("handlegoToCon === 2");
      //   uni.switchTab({
      //     url: `/pages/index/index`,
      //   });
      // } else {
      console.log("handlegoToCon === 3");
      uni.navigateBack({ delta: 1 });
      // }
    },
    sendSuccess(e) {
      this._getDetail({ reservationId: this.reservationId });
    },

    handlecancel() {
      this.show = false;
    },

    handleconfirm() {
      this.show = false;
    },

    handleBtn() {
      console.log("cancelPop --");
      if (!this.again) {
        const t1 = Number(this.detail.reservationBeginTimeTs);
        let ss1 = dayjs(t1).format("YYYY-MM-DD");
        let ss2 = dayjs(new Date()).format("YYYY-MM-DD");
        this.show = ss1 == ss2;
        if (!this.show) {
          this.cancelPop = true;
        }
      } else {
        uni.navigateTo({
          url: `/pagesB/submitReservation/index`,
        });
        action_report({
          action_name: "appointment_order_reappointment_show",
          module_name: module_name,
          extend: {},
        });
      }
    },

    async _getDetail(params) {
      try {
        const res = await GET_RESERVATION_DETAIL(params);
        this.detail = res.data.data;
        console.log("detail ", this.detail);

        if (this.detail?.status == this.statusEnum.PRE_INIT) {
          this.again = false;
        } else if (this.detail?.status == this.statusEnum.INIT) {
          this.again = false;
        } else if (this.detail?.status == this.statusEnum.CONFIRM) {
          this.again = false;
        } else if (this.detail?.status == this.statusEnum.PAYED) {
          this.again = false;
        } else {
          this.again = true;
        }
      } catch (e) {
        console.error("获取详情失败", e);
      }
    },

    /**
     * statusEnum: {
        PRE_INIT: 0, //"预约/到店确认"),
        INIT: 10, //"待服务"),
        CONFIRM: 20, // "服务中"),
        PAYED: 30, //"已支付"),
        FINISH: 40, //"已完成"),
        CANCEL: -10, //"已取消");
        FAIL: -20, //"预约失败/门店拒绝");
        NOTSHOW: -30, //"未到店");
      },
     */
    getStatusTitle() {
      console.log("this.detail.status ", this.detail);
      if (this.detail?.status == this.statusEnum.PRE_INIT) {
        return ["门店确认中", "请留意短信通知"];
      } else if (this.detail?.status == this.statusEnum.INIT) {
        return ["待服务", "请留意短信通知"];
      } else if (this.detail?.status == this.statusEnum.CONFIRM) {
        return ["服务中", ""];
      } else if (this.detail?.status == this.statusEnum.PAYED) {
        return ["已支付", "请留意短信通知"];
      } else if (this.detail?.status == this.statusEnum.FINISH) {
        return ["已完成", ""];
      } else if (this.detail?.status == this.statusEnum.CANCEL) {
        return ["已取消", ""];
      } else if (this.detail?.status == this.statusEnum.FAIL) {
        return ["预约失败", this.detail?.cancelReason];
      } else if (this.detail?.status == this.statusEnum.NOTSHOW) {
        return ["未到店", "已超过预约日期，本次预约失效"];
      }
      return ["", ""];
    },
    getStatusDesc() {},

    showDistance() {
      return `距离你{{Number(this.detail.shopDetail.distance) > 1000 ? (Number(this.detail.shopDetail.distance)/1000).toFixed(2)+'km' : this.detail.shopDetail.distance + 'm'}}`;
    },

    makePhoneCall(pNumber) {
      uni.makePhoneCall({
        phoneNumber: pNumber,
      });
    },

    chooseLocation(params) {
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/address/navigation/map?targetName=${params.shopName}&targetAddress=${params.address}&targetLat=${params.latitude}&targetLng=${params.longitude}`,
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.openLocation({
        latitude: params.latitude,
        longitude: params.longitude,
        name: params.shopName,
        address: params.address,
        success: function (res) {},
      });
      //#endif
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
