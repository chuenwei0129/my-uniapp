<template>
  <view class="custom-navbar" :style="{ paddingTop: statusBarHeight }">
    <view class="back" :style="{ top: statusBarHeight, height: navBarHeight }">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/nav_back_v2.png"
        class="back-icon"
        @click="goBack"
      ></image>
    </view>
    <view
      class="content"
      :style="{
        paddingTop: '20rpx',
        paddingBottom: cutDownTimeShow ? '2rpx' : '20rpx',
      }"
    >
      <view class="fl-row-center">
        <image
          v-if="[4, 7].includes(status)"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/order_detail_done.png"
          :style="{ width: '34rpx', height: '34rpx', marginRight: '10rpx' }"
        ></image>
        <view class="title">{{ title || "" }}</view>
      </view>
      <view
        class="subTitle-dada"
        :class="reasonColor"
        v-if="
          (deliveryType == 1 || deliveryType == 6) &&
          ![15, 20, 21].includes(status)
        "
        >{{ subhead || "" }}
      </view>
      <view class="subTitle" v-if="cutDownTimeShow && deliveryType !== 1">{{
        `剩余${countdownText}订单关闭`
      }}</view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ORDER_STATUS_LIST } from "../../mallOrderList/const";
dayjs.extend(duration);
export default {
  name: "GoodsNav",
  props: {
    ///订单状态： 1-待支付、2-待发货、3-待收货（如果是自提订单，显示为待自提）、4-已签收、(5-待核销、6-已核销)、7-交易完成、8-交易关闭、
    // (9-已过期)、12-支付中、14-退款中、15-已退款、16-退货退款、20-部分退款、21-部分退货退款
    status: {
      type: Number,
      default: 0,
    },
    payEndTime: {
      type: String,
      default: "",
    },
    deliveryType: {
      type: [String, Number],
    },
    cancelReason: {
      type: String,
    },
    deliveryStatus: {
      type: Number,
    },
    estimatedDeliveryTime: {
      type: String,
    },
  },

  data() {
    return {
      statusBarHeight: "",
      navHeight: "",
      navBarHeight: "",
      countdownText: "00:00",
      targetTime: null,
      timerId: null,
      titleColor: "#fe2442",
      navTextObj: {
        "-1": "待付款", // --剩余9分59秒关闭（红）
        "-5": "待派单", // 1行 --预计7月12日10点派送（灰）
        "-7": "门店备货中",
        "-8": "待派单", //副标题 1行
        "-10": "正在召唤骑士",
        "-20": "已取消派单", //副标题 1行或两行 --正在为你重新召唤骑士，取消原因。。。（灰）
        "-30": "已取消派单", //副标题 1行或两行 --正在为你重新召唤骑士，取消原因。。。（灰）
        "-40": "已取消派单", //副标题 1行或两行 --正在为你重新召唤骑士，取消原因。。。（灰）
        "-50": "派送异常", //副标题 1行 --异常原因：买家拒收，商品返还中（红）
        "-60": "派送异常", //副标题 1行 --异常原因：买家拒收，商品返还中（红）
        1: "正在召唤骑士",
        5: "正在召唤骑士",
        10: "骑士正赶往门店", // "骑士已接单",
        20: "骑士已到店",
        30: "骑士送货中",
        40: "订单已送达", //副标题 1行 --感谢信任，期待再次光临（灰）
      },
      livingText: {
        "-7": "门店备货中",
        1: "待派送",
        30: "待收货",
        40: "交易完成",
      },
      orderStatusList: ORDER_STATUS_LIST,
    };
  },

  mounted() {

    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    // #endif

    // #ifdef H5
    this.navHeight = getApp().globalData.h5NavBarFullHeight + "px";
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    // #endif
  },

  computed: {
    reasonColor() {
      if ([-1, -50, -60].includes(this.deliveryStatus))
        return "title-info-warn";
      else return "title-info";
    },
    title() {
      console.log(
        "打印打印--deliveryType---deliveryStatus--status------",
        this.deliveryType,
        this.deliveryStatus,
        this.status
      );
      // 交付类型
      let navTitle = "";
      const originStatusArr = this.orderStatusList["待付款"]
        .concat(this.orderStatusList["已关闭"])
        .concat([20, 21]);
      // deliveryType 1: 同城配送 2: 快递 3: 到店核销 4: 门店配送(配送到家) 5: 线下门店配送类型(无需收货地址）6:活体订单
      if (this.deliveryType == 1 && !originStatusArr.includes(this.status)) {
        navTitle = this.getNavText(this.deliveryStatus, this.navTextObj);
      } else if (
        !originStatusArr.includes(this.status) &&
        this.deliveryType == 6
      ) {
        navTitle = this.getNavText(this.deliveryStatus, this.livingText);
      } else {
        switch (this.status) {
          case 1:
            navTitle = "待付款";
            break;
          case 2:
            this.deliveryType == 4
              ? (navTitle = "待门店备货") // (navTitle = "正在捡货")
              : (navTitle = "待发货");
            break;
          case 3:
            this.deliveryType == 4
              ? (navTitle = "待提货") // (navTitle = "待自提")
              : (navTitle = "待收货");
            break;
          case 4:
          case 7:
            navTitle = "交易完成";
            break;
          case 8:
            navTitle = "订单已取消";
            break;
          case 9:
            navTitle = "已过期";
            break;
          case 14:
            navTitle = "退款中";
            break;
          case 15:
          case 16:
          case 20:
          case 21:
            navTitle = "已退款";
            break;
        }
      }
      return navTitle;
    },
    subhead() {
      if (this.deliveryType == 1) {
        if ([-20, -30, -40].includes(this.deliveryStatus)) {
          return "正在为你重新召唤骑士"; // this.cancelReason? "正在为你重新召唤骑士，" + `取消原因：${this.cancelReason}`: "正在为你重新召唤骑士";
        } else if (
          [-5, -8].includes(this.deliveryStatus) &&
          this.estimatedDeliveryTime
        ) {
          return `预计${this.estimatedDeliveryTime}派送`;
        } else if ([-50, -60].includes(this.deliveryStatus)) {
          return this.cancelReason ? `异常原因:${this.cancelReason}` : "";
        } else if (this.deliveryStatus === 40) {
          return `感谢信任，期待再次光临`;
        } else {
          return "";
        }
      } else if (this.deliveryType == 6) {
        //  活体订单
        if (this.deliveryStatus === 30) {
          return "萌宠被专车护送中...";
        } else if (this.deliveryStatus === 40) {
          return "感谢信任，期待再次光临";
        }
      }
    },

    cutDownTimeShow() {
      console.log("newStatusnewStatusnewStatus:", this.status);
      return [1, 12].includes(this.status);
    },
  },

  beforeDestroy() {
    clearInterval(this.timerId);
  },

  watch: {
    cutDownTimeShow: {
      immediate: true,
      handler(newValue, oldValue) {
        // console.log("watch-cutDownTimeShow-old,newValue:", oldValue, newValue);
        if (this.timerId) {
          clearInterval(this.timerId);
        }
        if (newValue) {
          if (this.payEndTime) {
            console.log("created-targetTime");
            this.targetTime = dayjs(this.payEndTime);
            // console.log(
            //   "created-targetTime-value:",
            //   this.payEndTime,
            //   this.targetTime
            // );

            // 启动定时器，每秒更新页面
            this.timerId = setInterval(() => {
              this.updateTime();
            }, 1000);
          }
        }
      },
    },
  },

  methods: {
    getNavText(status, obj) {
      return obj[status];
    },
    // 返回上一页的逻辑
    goBack() {
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        fail: (e) => {
          console.log("result---------fail");
          uni.switchTab({
            url: "/pages/mall/index",
          });
        },
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },

    // 待付款更新倒计时
    updateTime() {
      // console.log("updateTime-begin", this.targetTime);
      const now = dayjs();
      const diff = this.targetTime - now;
      const duration = dayjs.duration(diff);
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      if (duration.asMilliseconds() <= 0) {
        this.countdownText = "00:00";
        clearInterval(this.timerId);
        this.$emit("timeDeadLine");
        console.log("时间到");
      } else {
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");
        this.countdownText = `${formattedMinutes}:${formattedSeconds}`;
      }
      // console.log("updateTime-ing", this.countdownText);
    },
  },
};
</script>

<style lang="scss">
.custom-navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20rpx;
  padding-right: 20rpx;
  background-color: #f7f8fc;
}

.back {
  position: absolute;
  left: 20rpx;
  top: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .back-icon {
    width: 42rpx;
    height: 42rpx;
    /* 添加返回图标的样式 */
    //background-image: url('https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/nav_back.png');
    //background-size: cover;
  }
}

.content {
  display: flex;
  flex-direction: column; // 垂直方向排列
  align-items: center;
  justify-content: center;
  .title {
    color: #1f1f1f;
    font-size: 34rpx;
    font-weight: bold;
  }
  .subTitle {
    font-weight: 400;
    color: #fe2442;
    font-size: 27rpx;
    line-height: 38rpx;
    // margin-top: 19rpx;
  }
  .subTitle-dada {
    font-weight: 400;
    font-size: 27rpx;
    line-height: 38rpx;
    margin-top: 19rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; //作为弹性伸缩盒子模型显示。
    -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
    -webkit-line-clamp: 2;
  }
  .title-info-warn {
    color: #fe2442;
  }
  .title-info {
    color: #666666;
  }
}
</style>
