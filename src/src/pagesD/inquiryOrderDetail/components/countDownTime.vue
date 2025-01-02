<template>
  <view class="time-box">
    <view class="time-box-text"> {{ `剩余${countdownText}自动关闭` }}</view>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "CountDownTime",
  props: {
    payEndTime: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      countdownText: "00:00",
      targetTime: null,
      timerId: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  watch: {
    payEndTime: {
      immediate: true,
      handler(newValue, oldValue) {
        console.log("watch-payEndTime-old,newValue:", oldValue, newValue);
        if (this.timerId) {
          clearInterval(this.timerId);
        }
        if (newValue) {
          console.log("created-targetTime");
          this.targetTime = this.payEndTime;
          console.log(
            "created-targetTime-value:",
            this.payEndTime,
            this.targetTime
          );

          // 启动定时器，每秒更新页面
          this.timerId = setInterval(() => {
            this.updateTime();
          }, 1000);
        }
      },
    },
  },
  methods: {
    // 待付款更新倒计时
    updateTime() {
      if (this.targetTime <= 0) {
        this.countdownText = "00:00";
        clearInterval(this.timerId);
        this.$emit("timeDeadLine");
        console.log("时间到");
      } else {
        this.targetTime -= 1;
        const minutes = Math.floor(this.targetTime / 60);
        const seconds = this.targetTime % 60;
        // console.log("updateTime-ing", minutes, seconds);
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
.time-box {
  padding: 0 16rpx;
  display: flex;
  justify-content: center;
  &-text {
    font-size: 27rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #f33a50;
    line-height: 38rpx;
  }
}
</style>
