<template>
  <view class="common-picker" v-if="isShowPop" @touchmove.stop.prevent="stopPrevent">
    <u-popup
      :show="isShowPop"
      @close="close"
      round="38rpx"
      mode="bottom"
      @touchmove.stop.prevent
      :safeAreaInsetBottom="false"
    >
      <view class="content">
        <view class="header" v-if="birthType == 'birth'">
          <text @click="handleCancel">取消</text>
          <view @click="handleShowDate">{{ date || "选择日期" }}</view>
          <text @click="handleConfirm">确定</text>
        </view>
        <view class="header" v-else>
          <!-- <text @click="handleCancel">取消</text> -->
          <view class="top-date" @click="handleDateTime(1)">
            <view :class="['date-show', { 'noactive-size': !showLine }]">{{
              date || "选择日期"
            }}</view>
            <view class="year-line" v-if="showLine"></view>
          </view>
          <view class="top-time" @click="handleDateTime(2)">
            <view :class="['time-show', { 'noactive-size': showLine }]">{{
              time || "选择时间"
            }}</view>
            <view class="time-line" v-if="!showLine"></view>
          </view>
          <!-- <text @click="handleConfirm">确定</text> -->
        </view>

        <view class="pickerView">
          <!-- 日期 -->
          <template v-if="showDate">
            <picker-view
              class="picker"
              indicator-class="indicator"
              :value="value"
              :immediate-change="true"
              @change="bindChange"
            >
              <picker-view-column class="column first-column">
                <view class="item" v-for="(item, index) in years" :key="index">
                  <view class="text text-date">{{ item }}年</view>
                </view>
              </picker-view-column>

              <picker-view-column class="column1 second-column">
                <view class="item" v-for="(item, index) in months" :key="index">
                  <view class="text text-date second-text">{{ item }}月</view>
                </view>
              </picker-view-column>

              <picker-view-column class="column2 third-column">
                <view class="item" v-for="(item, index) in days" :key="index">
                  <view class="text text-date third-text">{{ item }}日</view>
                </view>
              </picker-view-column>
            </picker-view>
          </template>
          <!-- 时间-时/分  -->
          <template v-if="showTime">
            <picker-view
              class="picker"
              indicator-class="indicator"
              :value="value2"
              :immediate-change="true"
              @change="bindTimeChange"
            >
              <picker-view-column class="column">
                <view class="item" v-for="(item, index) in hours" :key="index">
                  <view class="text">{{ item }}</view>
                </view>
              </picker-view-column>
              <picker-view-column class="column2">
                <view
                  class="item"
                  v-for="(item, index) in minutes"
                  :key="index"
                >
                  <view class="text">{{ item }}</view>
                </view>
              </picker-view-column>
            </picker-view>
          </template>
        </view>
        <view class="footer">
          <view class="btn" @click="handleConfirm">确定</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import dayjs from "dayjs";
export default {
  name: "commonPicker",
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  props: {
    isShowPop: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    secondName: {
      type: String,
      default: "选择日期",
    },
    birthType: {
      type: String,
      default: "",
    },
  },
  data() {
    const currentDate = dayjs().format("YYYY-MM-DD");
    const currentTime = dayjs().format("HH:mm");
    const years = [];
    const year = dayjs().format("YYYY");
    const months = [];
    const month = dayjs().format("MM");
    const days = [];
    const day = dayjs().format("DD");
    const hours = [];
    const hour = dayjs().format("HH");
    const minutes = [];
    const minute = dayjs().format("mm");
    for (let i = 1990; i <= year; i++) {
      years.push(i);
    }
    for (let i = 1; i <= month; i++) {
      months.push(i);
    }
    for (let i = 1; i <= day; i++) {
      days.push(i);
    }
    for (let index = 0; index <= 23; index++) {
      const i = index > 9 ? index : "0" + index;
      hours.push(i);
    }
    for (let index = 0; index <= 59; index++) {
      const i = index > 9 ? index : "0" + index;
      minutes.push(i);
    }
    return {
      years,
      year,
      months,
      month,
      days,
      day,
      hours,
      hour,
      minutes,
      minute,
      value: [9999, month - 1, day - 1],
      value2: [hour, minute - 1],
      date: currentDate,
      time: currentTime,
      showDate: true,
      showTime: false,
      showLine: true,
    };
  },
  methods: {
    stopPrevent(){
      return
    },
    handleConfirm() {
      const date = `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}`;
      let newDate = dayjs(date).format("YYYY-MM-DD HH:mm");
      const currentDate = new Date().getTime();
      if (new Date(date).getTime() > currentDate) {
        newDate = dayjs(currentDate).format("YYYY-MM-DD HH:mm");
      }
      console.log("输出时间：：：：", newDate);
      this.$emit("onChange", newDate);
      this.close();
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$emit("update:isShowPop", false);
    },
    handleDateTime(type) {
      if (type === 1) {
        this.showDate = true;
        this.showTime = false;
        this.showLine = true;
      } else {
        this.showDate = false;
        this.showTime = true;
        this.showLine = false;
      }
    },
    bindChange(e) {
      const val = e.detail.value;
      const currentYear = dayjs().format("YYYY");
      this.year = this.years[val[0]];
      if (this.year == currentYear) {
        const currentDate = dayjs();
        const targetDate = `${this.year}-${this.months[val[1]]}`;
        if (currentDate.isSame(targetDate, "month")) {
          const day = dayjs().format("DD");
          this.days = [];
          for (let i = 1; i <= day; i++) {
            this.days.push(i);
          }
        } else {
          const daysInMonth = dayjs(
            `${this.year}-${this.months[val[1]]}`
          ).daysInMonth();
          this.days = [];

          for (let i = 1; i <= daysInMonth; i++) {
            this.days.push(i);
          }
        }
      } else {
        this.months = [];
        this.days = [];
        for (let i = 1; i <= 12; i++) {
          this.months.push(i);
        }
        const daysInMonth = dayjs(
          `${this.year}-${this.months[val[1]]}`
        ).daysInMonth();

        for (let i = 1; i <= daysInMonth; i++) {
          this.days.push(i);
        }
      }
      const month =
        val[1] < this.months.length
          ? this.months[val[1]]
          : this.months[this.months.length - 1];
      this.month = month?.toString().padStart(2, "0");
      const day =
        val[2] < this.days.length
          ? this.days[val[2]]
          : this.days[this.days.length - 1];
      this.day = day?.toString().padStart(2, "0");
      this.date = `${this.year}-${this.month}-${this.day}`;
    },
    // 时间
    bindTimeChange(e) {
      const val = e.detail.value;
      this.hour = this.hours[val[0]];
      this.minute = this.minutes[val[1]];
      this.time = `${this.hour}:${this.minute}`;
      console.log("时分=======>", this.time);
    },
  },
};
</script>

<style lang="scss" scoped>
.common-picker {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}
.content {
  padding: 0 38rpx;
}
.header {
  display: flex;
  justify-content: space-between;
  height: 113rpx;
  align-items: center;
  border-bottom: 1rpx solid #e6e6e6;
  font-weight: 500;
  text:first-child {
    font-size: 31rpx;
    color: #666666;
    font-weight: 500;
  }
  text:last-child {
    font-size: 31rpx;
    color: #1f1f1f;
    font-weight: 500;
  }
  view {
    font-size: 35rpx;
    color: #1f1f1f;
  }
}
.pickerView {
  height: 409rpx; // 550rpx;
  padding: 75rpx 0 0rpx;
  .picker {
    background-color: #fff;
    width: 100%;
    height: 247rpx;
  }
}
.footer {
  width: 100%;
  background-color: #fff;
  padding: 0 38rpx 65rpx;
  box-sizing: border-box;
  .btn {
    width: 100%;
    background-color: #fee900;
    height: 85rpx;
    border-radius: 42rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 31rpx;
    color: #1f1f1f;
  }
}
.text {
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 35rpx;
  color: #1f1f1f;
  text-align: center;
  height: 96rpx;
  line-height: 96rpx;
}
.date-show,
.time-show {
  display: inline-block;
}
.year-line,
.time-line {
  width: 77rpx;
  height: 4rpx;
  background-color: #1f1f1f;
  position: absolute;
  bottom: -32rpx;
  left: 50%;
  transform: translate(-50%, 50%);
}
.text-date {
  display: inline-block;
}
.first-column {
  text-align: right !important;
}
.third-column {
  text-align: left !important;
}
.third-text {
  margin-left: 25rpx;
}
.second-column {
  text-align: center !important;
}
.second-text {
  margin-left: 25rpx;
}
.top-date {
  margin-left: 100rpx;
  position: relative;
}
.top-time {
  margin-right: 124rpx;
  position: relative;
}
.noactive-size {
  font-size: 31rpx !important;
  font-size: 400;
}
</style>
<style scoped>
/deep/ .column {
  font-size: 31rpx;
  color: #000;
  text-align: center;
  line-height: 96rpx;
}

/deep/ .indicator::after {
  border-bottom: 0 !important;
}

/deep/ .indicator::before {
  border-top: 0 !important;
}
/deep/ .column .indicator {
  width: 100% !important;
  border-radius: 48rpx 0 0 48rpx;
  overflow: hidden;
  background-color: #f3f3f4;
  height: 96rpx;
  z-index: 0;
}

/deep/ .column1 .indicator {
  width: 100% !important;
  overflow: hidden;
  background-color: #f3f3f4;
  height: 96rpx;
  z-index: 0;
  font-size: 31rpx;
  color: #000;
  text-align: center;
  line-height: 96rpx;
}

/deep/ .column2 .indicator {
  width: 100% !important;
  border-radius: 0 48rpx 48rpx 0;
  overflow: hidden;
  background-color: #f3f3f4;
  height: 96rpx;
  z-index: 0;
  font-size: 31rpx;
  color: #000;
  text-align: center;
  line-height: 96rpx;
}
</style>
