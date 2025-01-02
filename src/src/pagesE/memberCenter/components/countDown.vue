<template>
  <view class="time-box">
    <view class="clock"></view>
    距结束{{ countdownText }}
  </view>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "CountDownTime",
  props: {
    endTime: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      countdownText: "00:00",
      targetTime: null,
      timerId: null,
    };
  },
  activated() {
    if(this.timerId) clearInterval(this.timerId);
    this.timerId = null
  },
  created() {
    if(this.timerId) clearInterval(this.timerId);
    this.timerId = null
    if(this.endTime == null || this.endTime == '' || this.endTime == undefined) return;
    this.targetTime = dayjs(this.endTime);
    // 启动定时器，每秒更新页面
    this.timerId = setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timerId);
    this.timerId = null
  },
  methods: {
   // 倒计时
    updateTime() {
      const now = dayjs();
      const duration = dayjs.duration(this.targetTime.diff(now));
      
      const day = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      if (duration.asMilliseconds() <= 0) {
        this.countdownText = "00:00:00";
        clearInterval(this.timerId);
        this.timerId = null
      } else {
        const formattedDay= String(day).padStart(2, "0");
        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");
        this.countdownText = `${formattedDay}天 ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      }
    },
  },

}
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.time-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19rpx;
  color: #fff;
}
.clock {
  display: inline-block;
  width: 21rpx;
  height: 21rpx;
  margin-right: 8rpx; 
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/clock.png"
  );
}

</style>