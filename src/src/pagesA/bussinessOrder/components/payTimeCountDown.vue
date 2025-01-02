<template>
  <view>{{ modal.h }}:{{ modal.m }}:{{ modal.s }} </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
export default {
  //...wxShareMethod(),
  components: {},
  props: {
    payValidDate: {
      type: String,
    },
  },
  data() {
    return {
      timedown: null,
      modal: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.countDown();
  },
  onReady() {},
  methods: {
    timeFormat(param) {
      //处理数据永远是两位数
      return param < 10 ? "0" + param : param;
    },
    countDown() {
      if (!this.payValidDate) return;
      let newTime = new Date().getTime(); //获取当前时间
      if (newTime > this.payValidDate) {
        this.$emit("updateOrderStatus");
        clearTimeout(this.timedown);
        this.timedown = null;
        return "活动已结束";
      }
      let time = (this.payValidDate - newTime) / 1000;
      // 获取天、时、分、秒
      let d1 = parseInt(time / (60 * 60 * 24));
      let h1 = parseInt((time % (60 * 60 * 24)) / 3600);
      let m1 = parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
      let s1 = parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
      this.modal = {
        d: this.timeFormat(d1),
        h: this.timeFormat(h1),
        m: this.timeFormat(m1),
        s: this.timeFormat(s1),
      };
      this.timedown = setTimeout(() => {
        this.countDown();
      }, 1000);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timedown);
    this.timedown = null;
  },
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

.button {
  height: 77rpx;
  border-radius: 40px;
  display: flex;
  align-items: center;
  padding: 17rpx 37rpx;
  margin-left: 19rpx;
}
.to-pay {
  @include textfclaw(31rpx, #fff);
  font-weight: bold;
  background: #2dce80;
}
</style>
