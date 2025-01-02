<template>
  <view
    class="common-picker"
    v-if="isShowPop"
    @touchmove.stop.prevent="stopPrevent"
  >
    <u-popup
      :show="isShowPop"
      @close="close"
      round="38rpx"
      mode="bottom"
      @touchmove.stop.prevent
      :safeAreaInsetBottom="false"
    >
      <view class="content">
        <view class="header">
          <text @click="handleCancel">取消</text>
          <view @click="handleShowDate">{{ secondName || "选择日期" }}</view>
          <text @click="handleConfirm">确定</text>
        </view>

        <view class="pickerView">
          <!-- 日期 -->
          <template>
            <picker-view
              class="picker"
              indicator-class="indicator"
              :value="value"
              :immediate-change="true"
              @change="bindChange"
            >
              <picker-view-column class="column first-column">
                <view class="item" v-for="(year, index) in years" :key="index">
                  <view class="text text-date">{{ year }}年</view>
                </view>
              </picker-view-column>

              <picker-view-column class="column1 second-column">
                <view
                  class="item"
                  v-for="(month, index) in months"
                  :key="index"
                >
                  <view class="text text-date second-text">{{ month }}月</view>
                </view>
              </picker-view-column>

              <picker-view-column class="column2 third-column">
                <view class="item" v-for="(day, index) in days" :key="index">
                  <view class="text text-date third-text">{{ day }}日</view>
                </view>
              </picker-view-column>
            </picker-view>
          </template>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
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
    secondName: {
      type: String,
      default: "选择日期",
    },
    birthType: {
      type: String,
      default: "",
    },
    // 是否放开限制
    notLimit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      years: [], // 年份列表
      months: Array.from({ length: 12 }, (_, i) => i + 1), // 月份列表
      selectedYear: null, // 选择的年份
      selectedMonth: null, // 选择的月份
      selectedDay: null, // 选择的日期
      todayDate: new Date(), // 当前日期
      days: [], // 当前月份的天数列表
      value: [],
    };
  },
  watch: {
    selectedYear(newYear) {
      // this.updateDays(newYear, this.selectedMonth);
    },
    selectedMonth(newMonth) {
      // this.updateDays(this.selectedYear, newMonth);
    },
    isShowPop(newValue) {
      if (newValue) {
        this.initDate();
      }
    },
  },
  methods: {
    stopPrevent() {
      return;
    },
    initDate() {
      console.log(this.birthType);

      let currentYear, currentMonth, currentDate, today;

      if (this.birthType) {
        const [year, month, day] = this.birthType.split("-").map(Number);
        currentYear = year;
        currentMonth = month;
        currentDate = day;
      } else {
        today = this.todayDate;
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1; // 当前月份 (0-11，所以加1)
        currentDate = today.getDate();
      }
      // 生成年份列表，前后各25年
      this.years = Array.from({ length: 51 }, (_, i) => currentYear - 25 + i);

      // 初始化默认选择的年、月、日的索引
      this.yearIndex = this.years.indexOf(currentYear);

      this.monthIndex = currentMonth - 1; // 月份数组是从0开始
      this.dayIndex = currentDate - 1; // 日期数组是从0开始

      this.selectedYear = currentYear;
      this.selectedMonth = currentMonth;
      this.selectedDay = currentDate;
      console.log(this.selectedYear, this.selectedMonth, this.selectedDay);
      // 初始化天数
      this.updateDays(currentYear, currentMonth);
    },
    updateDays(year, month) {
      console.log("更新日期");
      const daysInMonth = new Date(year, month, 0).getDate(); // 获取该月的天数

      // 如果是当前月份，日期列表不能大于今天
      if (
        !this.notLimit &&
        year === this.todayDate.getFullYear() &&
        month === this.todayDate.getMonth() + 1
      ) {
        this.days = Array.from(
          { length: Math.min(daysInMonth, this.todayDate.getDate()) },
          (_, i) => i + 1
        );
      } else {
        // 否则显示该月的所有日期
        this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      }
      // 如果当前选择的日期超过该月的最大天数，调整索引
      if (this.dayIndex >= this.days.length) {
        this.dayIndex = this.days.length - 1;
      }
      const currentYear = this.todayDate.getFullYear();
      const currentMonth = this.todayDate.getMonth() + 1;
      if (!this.notLimit) {
        // 限制年份：当前年份之后的年份不显示
        this.years = this.years.filter((year) => year <= currentYear);
      }

      // 限制月份：当前月之后的月份不显示
      if (this.years[this.yearIndex] === currentYear && !this.notLimit) {
        this.months = this.months.filter((month) => month <= currentMonth);
      } else {
        this.months = Array.from({ length: 12 }, (_, i) => i + 1); // 所有12个月
      }

      // 更新月份和年份的索引值，避免选择无效选项
      this.monthIndex = Math.min(this.monthIndex, this.months.length - 1);
      this.selectedYear = year;
      this.selectedMonth = month;
      this.selectedDay = this.days[this.dayIndex];
      setTimeout(() => {
        this.value = [this.yearIndex, this.monthIndex, this.dayIndex];
      }, 10);
      console.log(
        "🚀 ~ updateDays ~ this.value:",

        this.value
      );
    },

    handleConfirm() {
      const date = `${this.selectedYear}-${
        this.selectedMonth < 10 ? "0" + this.selectedMonth : this.selectedMonth
      }-${this.selectedDay < 10 ? "0" + this.selectedDay : this.selectedDay}`;
      console.log("handleConfirm", date);

      this.$emit("onChange", date);
      this.close();
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$emit("update:isShowPop", false);
    },
    handleShowDate() {
      this.showDate = true;
      this.showTime = false;
    },
    handleShowTime() {
      this.showDate = false;
      this.showTime = true;
    },
    bindChange(event) {
      //获取当前选中的索引数组
      const [newYearIndex, newMonthIndex, newDayIndex] = event.detail.value;

      this.yearIndex = newYearIndex;
      this.monthIndex = newMonthIndex;
      this.dayIndex = newDayIndex;

      const selectedYear = this.years[this.yearIndex];
      const selectedMonth = this.months[this.monthIndex];

      // 如果当前选择的年月是当年当月，限制日期不能超过今天
      if (
        !this.notLimit &&
        selectedYear === this.todayDate.getFullYear() &&
        selectedMonth === this.todayDate.getMonth() + 1
      ) {
        // 限制日期不超过今天
        this.dayIndex = Math.min(newDayIndex, this.todayDate.getDate() - 1);
      } else {
        this.dayIndex = newDayIndex;
      }

      this.updateDays(selectedYear, selectedMonth);
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
.pickerView {
  height: 550rpx;
  padding: 100rpx 0;
  .picker {
    background-color: #fff;
    width: 100%;
    height: 247rpx;
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
