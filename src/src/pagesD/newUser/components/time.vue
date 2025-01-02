<template>
  <view class="timewrap-content" v-if="timeData.d || timeData.h || timeData.m || timeData.s">
  <view class="timespan">{{ timeData.d }}</view>天<view class="timespan">{{ timeData.h }}</view>:<view class="timespan">{{ timeData.m }}</view>:<view class="timespan">{{ timeData.s }}
  </view>
</view>
</template>
<script>
export default {
  props: {
    expiredtime: {
      type: String,
    },
    currenttime: {
      type: String
    }
  },
  data() {
    return {
      remaintime: 0,
      timeData: {
      }
    }
  },
  methods: {
    countDown() {
      let time = this.remaintime;
      if (time > 0) {
        // 获取天、时、分、秒
        let d1 = parseInt(time / (60 * 60 * 24));
        let h1 = parseInt((time % (60 * 60 * 24)) / 3600);
        let m1 = parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
        let s1 = parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
        this.timeData = {
          d : d1 < 10 ? "0" + d1 : d1,
          h : h1 < 10 ? "0" + h1 : h1,
          m : m1 < 10 ? "0" + m1 : m1,
          s : s1 < 10 ? "0" + s1 : s1,
        }
      } else {
        this.timeData = {
          d: '00',
          h: '00',
          m: '00',
          s: '00'
        }
      }
      return this.timeData;
    }
  },
  created() {
    this.remaintime = (Number(this.expiredtime) - Number(this.currenttime)) / 1000;
    this.countDown();
    this.timer = setInterval(() => {
      this.remaintime = this.remaintime-1;
      
      if (this.remaintime < 0) {
        this.$emit('refresh');
        clearInterval(this.timer);
      } else {
        this.countDown();
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timedown = null;
  },
}
</script>
<style lang="scss" scoped>
.timewrap-content {
  display: flex;
  .timespan {
  width: 35rpx;
  height: 35rpx;
  background: #FFDDDF;
  border-radius: 8rpx;
  margin: 0 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F43C01;
  font-size: 23rpx;
  font-weight: bold;
}
}

</style>