<template>
  <view class="timePickd">
    <u-datetime-picker :show="show" v-model="date" mode="year-month" title="支出" confirmText="确定" :minDate="-1262332800000"
      :maxDate="new Date().getTime()" confirmColor="#2DCE80" @cancel="handleClose"
      @confirm="hanldConfirm"></u-datetime-picker>
  </view>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: {
    show: {
      type: Boolean,
    },
    time: {
      type: String,
    },
  },
  data: function () {
    return {
      date: new Date().getTime(),
    };
  },
  created() { },
  methods: {
    bindChange: function (e) {
      // const val = e.detail.value;
      // this.year = this.years[val[0]];
      // this.month = this.months[val[1]];
      // this.day = this.days[val[2]];
    },
    handleClose() {
      this.$emit("update:show", false);
    },
    hanldConfirm(data) {
      console.log("hanldConfirm", data);

      let timeStr = dayjs(data.value).format("YYYY年MM月");
      let time = dayjs(data.value).format("YYYY-MM-DD");

      // let date = new Date(data.value);
      // console.log("date122222", date);
      // let year = date.getFullYear();
      // const month = date.getMonth() + 1;
      // const day = date.getDate();


      this.$emit("confirm", { time: time, timeStr: timeStr });
      this.$emit("update:show", false);
    },
  },
  watch: {
    show(val) {
      if (val) {
        console.log("watch val", val);
        this.pickerShow = val;
        console.log("this.pickerShow", this.pickerShow);
        if (this.time && this.time != "") {
          // const time = this.time.split("-");
          // const years = this.years.findIndex((item) => item == time[0] * 1);
          // const month = this.months.findIndex((item) => item == time[1] * 1);
          // const day = this.days.findIndex((item) => item == time[2] * 1);
          // this.year = time[0];
          // this.month = time[1];
          // this.day = time[2];
          // this.value = [years, month, day];
        }
      }
    },
    time: {
      handler(val) {
        if (val) {
          let date = new Date(val);
          // this.date = date.getTime();
        }
      },
    },
  },
};
</script>

<style lang="scss">
.timePickd ::v-deep .u-popup__content {
  border-radius: 20rpx;
}

.timePickd ::v-deep .u-toolbar {
  position: relative;
  left: 0;
  top: 0;
  font-weight: bold;
  height: 114rpx !important;

  &::before {
    position: absolute;
    left: 38rpx;
    bottom: 0;
    content: "";
    width: 673rpx;
    border-bottom: 0.5px solid #e6e6e6;
  }
}
</style>
