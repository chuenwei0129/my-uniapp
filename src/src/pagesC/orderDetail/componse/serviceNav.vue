<template>
  <view class="custom-navbar" :style="{ paddingTop: statusBarHeight }">
    <view class="back" :style="{ top: statusBarHeight, height: navBarHeight }">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/nav_back.png"
        class="back-icon"
        @click="goBack"
      ></image>
      <!--      <view class="back-icon" @click="goBack"></view>-->
    </view>
    <view
      class="content"
      :style="{
        paddingTop: subTitleShow ? '2rpx' : '20rpx',
        paddingBottom: subTitleShow ? '12rpx' : '20rpx',
      }"
    >
      <view class="fl-row-center">
        <image
          v-if="status === 6"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/order_detail_done.png"
          :style="{ width: '34rpx', height: '34rpx', marginRight: '10rpx' }"
        ></image>
        <view class="title">{{ title }}</view>
      </view>

      <view class="subTitle" v-if="[1, 12].includes(status)">{{
        `剩余${countdownText}订单自动取消`
      }}</view>
      <view class="subTitle gray" v-else-if="status === 5"
        >使用前请联系门店预约</view
      >
      <view class="subTitle gray" v-else-if="[9, 14].includes(status)"
        >退款预计在1-2小时原路返回您的账号</view
      >
      <view class="subTitle gray" v-else-if="[15, 16, 20, 21].includes(status)"
        >退款已原路返回您的账号</view
      >
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
export default {
  name: "ServiceNav",
  props: {
    ///订单状态： 1-待支付、(2-待发货、3-待收货、4-已签收)、5-待核销、6-已核销、(7-交易完成)、8-交易关闭、
    // 9-已过期、12-支付中、14-退款中、15-已退款、16-退货退款、20-部分退款、21-部分退货退款
    status: {
      type: Number,
      default: 0,
    },
    payEndTime: {
      type: String,
      default: "",
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
    };
  },
  mounted() {
    this.navHeight = getApp().globalData.navHeight + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
  },

  computed: {
    title() {
      let navTitle = "";
      switch (this.status) {
        case 1:
        case 12:
          navTitle = "待付款";
          break;
        case 5:
          navTitle = "待到店使用";
          break;
        case 6:
          navTitle = "已使用";
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
      return navTitle;
    },

    subTitleShow() {
      console.log("newStatusnewStatusnewStatus:", this.status);
      return [1, 5, 9, 12, 14, 15, 16, 20, 21, 12].includes(this.status);
    },
  },

  beforeDestroy() {
    clearInterval(this.timerId);
  },

  watch: {
    status: {
      immediate: true,
      handler(newValue, oldValue) {
        if (this.timerId) {
          clearInterval(this.timerId);
        }
        if ([1, 12].includes(newValue)) {
          if (this.payEndTime) {
            console.log("created-targetTime");
            this.targetTime = dayjs(this.payEndTime);

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
      console.log("updateTime-begin", this.targetTime);
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
      console.log("updateTime-ing", this.countdownText);
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
  padding-top: 60rpx;
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
    width: 26rpx;
    height: 38rpx;
    /* 添加返回图标的样式 */
    //background-image: url('https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/nav_back.png');
    //background-size: cover;
  }
}

.content {
  display: flex;
  flex-direction: column; // 垂直方向排列
  align-items: center;
  .title {
    color: #1f1f1f;
    font-size: 34rpx;
    font-weight: bold;
  }
  .subTitle {
    color: #f33a50;
    font-size: 27rpx;
    font-weight: 400;
    line-height: 38rpx;
  }
  .gray {
    color: #333333;
  }
}
</style>
