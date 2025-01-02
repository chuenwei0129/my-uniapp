<template>
  <view class="goods-new-user-activity-countdown-wrapper">
    <image
      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/mall_goods_new_user_countdown.png"
    />
    <text>新人活动仅剩 ：{{ formattedCountdown }}</text>
  </view>
</template>
<script>
export default {
  name: "GoodsNewUserActivityCountdown",
  props: {
    countdownTs: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    formattedCountdown() {
      const toFixedTwo = (val) => {
        if (val < 10) {
          return `0${val}`;
        }
        return `${val}`;
      };
      if (this.currentTs > 0) {
        let remainingTs = this.currentTs / 1000;
        const days = Math.floor(remainingTs / (24 * 3600)).toFixed(0);
        remainingTs = remainingTs % (24 * 3600);
        const hours = Math.floor(remainingTs / 3600).toFixed(0);
        remainingTs = remainingTs % 3600;
        const minutes = Math.floor(remainingTs / 60).toFixed(0);
        remainingTs = remainingTs % 60;
        const seconds = remainingTs.toFixed(0);
        if (days > 0) {
          return `${toFixedTwo(days)}天${toFixedTwo(hours)}时${toFixedTwo(
            minutes
          )}分${toFixedTwo(seconds)}秒`;
        }
        return `${toFixedTwo(hours)}时${toFixedTwo(minutes)}分${toFixedTwo(
          seconds
        )}秒`;
      }
      return "";
    },
  },
  watch: {
    countdownTs(oldVal, newVal) {
      this.resetTimer(newVal);
    },
  },
  methods: {
    resetTimer(newDeadlineTs) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (newDeadlineTs > 0) {
        this.currentTs = newDeadlineTs;
        this.timer = setInterval(() => {
          this.currentTs -= 1000;
          if (this.currentTs <= 0) {
            clearInterval(this.timer);
            this.$emit("onFinish");
          }
        }, 1000);
      }
    },
  },
  data() {
    return {
      currentTs: 0,
      timer: null,
    };
  },
  mounted() {
    if (this.$props.countdownTs > 0) {
      this.resetTimer(this.$props.countdownTs);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
<style scoped lang="scss">
.goods-new-user-activity-countdown-wrapper {
  height: 77rpx;
  background: linear-gradient(270deg, #ff7a34 0%, #ffa128 100%);
  display: flex;
  padding: 0 22rpx;
  align-items: center;
  image {
    width: 58rpx;
    height: 58rpx;
  }
  text {
    margin-left: 20rpx;
    color: white;
    font-size: 29rpx;
  }
}
</style>
