<template>
  <view
    class="common-picker"
    v-if="isShowPop"
    @touchmove.stop.prevent="stopPrevent"
  >
    <u-popup
      v-if="isShowPop" 
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
    secondName: {
      type: String,
      default: "选择日期",
    },
    birthType: {
      type: String,
      default: "",
    },
    feedback: {
      type: String,
      default: "",
    },
    // 选中的时间类型 预产期还是孕期
    //deliveryTime分娩时间t-42
    //expectedDate 预产期 t+70
    notLimit: {
      type: String,
      default: "",
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
      previous42M: "", //计算42天之前的所在月份
      previous42Y: "", //计算42天之前的所在年份
      previous42D: "", //计算42天之前的天数
      previous42Days: null,//往前或者往后计算出的日期
      dateRanges: [],//年月日所对应的数组
      dayIndex:0
    };
  },
  watch: {
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
      console.log('data',this.feedback , this.birthType);
      // feedback是用于 用户选择的日期回显
      let currentYear, currentMonth, currentDate, today;
      if (this.feedback) {
        console.log('this.birthType',this.feedback);
        // 获取用户选择的对应的年月日
        const [year, month, day] = dayjs(this.feedback).format("YYYY-MM-DD").split("-").map(Number);
        currentYear = year;
        currentMonth = month;
        currentDate = day;
      } else {
        // 如果没有选择的就选中今天
        today = this.todayDate;
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1; // 当前月份 (0-11，所以加1)
        currentDate = today.getDate();
      }
         // 生成年份列表，前后各25年
      // this.years = Array.from({ length: 51 }, (_, i) => currentYear - 25 + i);
      // this.days = this.getDaysForMonth(currentYear, currentMonth)
      //对应的年月日赋值给选中的变量
      this.selectedYear = currentYear;
      this.selectedMonth = currentMonth;
      this.selectedDay = currentDate;
      console.log('initDate',this.selectedYear,this.selectedMonth,this.selectedDay);
      // 计算天数的方法
      this.calculatePrevious42DaysYearMonth();
    },
    updateDays(year, month) {
    
      console.log("更新日期", year, month, this.dayIndex);
      // 根据年月获取对应的天数数组
      this.days = this.getDaysForMonth(year, month)
      // 获取对应的天数索引
      console.log('获取对应的天数索引',this.days,this.selectedDay);
      // 获取当前选中天数在对应数组中的索引
      this.dayIndex = this.days.findIndex(item=>item==this.selectedDay)
      // 如果查不到就选中最后一个
      if (this.dayIndex==-1) {
        this.dayIndex = this.days.length - 1;
      }
      console.log('获取对应的天数索引',this.dayIndex);
      // 更新月份和年份的索引值，避免选择无效选项
      this.monthIndex = this.months.findIndex(item=>item==month)
      if (this.monthIndex==-1) {
        this.monthIndex = this.months.length - 1;
      }
      // 更新年份索引
      this.yearIndex = this.years.findIndex(item=>item==year)
      if (this.yearIndex==-1) {
        this.yearIndex = this.years.length - 1;
      }
      // 吧选中的年月日赋值
      this.selectedYear = year;
      this.selectedMonth = month;
      this.selectedDay = this.days[this.dayIndex];
      // setTimeout(()=>{
     
      // },10)
      this.$nextTick(()=>{
        this.value = [this.yearIndex, this.monthIndex, this.dayIndex];
        console.log('this.value',this.value,this.days);
      })
    },
    //计算对应时间的日期范围
    calculatePrevious42DaysYearMonth() {
      let TDate;
      // birthType 记录的用户修改的时间 基于这个时间进行计算
      if (this.birthType) {
        console.log('this.birthType',this.birthType);
        // 如果T是一个有效的日期字符串，则将其转换为Date对象
        TDate = new Date(this.birthType.replace(/-/g, "/")); // 替换日期格式中的-为/，以兼容不同浏览器的Date解析
      } else {
        // 如果T未定义或为空，则使用今天的日期
        TDate = new Date();
      }
      console.log('TDate',TDate);
      // 检查日期是否有效
      if (isNaN(TDate.getTime())) {
        console.error("无效的日期格式");
        return;
      }
      console.log('notLimit',this.notLimit,TDate);
  
      if (this.notLimit == "deliveryTime") {
        //计算往前42天的日期
        this.calculatePrevious42(TDate);
        
      } else if (this.notLimit == "expectedDate") {
        // 计算往后71天的日期
        this.calculatePrevious70(TDate);
        // selectedYear =  this.years[0];
      }
      //获取当前选中的年份日期 
      let selectedYear = this.selectedYear || this.years[0];
      // 假设有一个 selectedYear 属性来表示用户选中的年份
      // 如果没有选中年份，则默认使用日期范围中的最早年份
      console.log('selectedYear',this.years,selectedYear);
      // 获取当前选中年份对应的月份
      this.getMonthForyears(selectedYear)
      console.log('selectedYM',this.months,this.selectedMonth);
   
      // this.days=this.getDaysForMonth(this.selectedYear,this.selectedMonth)
      // 初始化天数
      this.updateDays(selectedYear, this.selectedMonth);
    },
    // 获取42天的方法
    calculatePrevious42(TDate) {
      // 计算的日期
      let previous42Days = new Date(TDate);
      previous42Days.setDate(previous42Days.getDate() - 42);

      console.log("previous42Days", previous42Days);

      this.previous42D = String(previous42Days.getDate()).padStart(2, "0");

      this.previous42Days = previous42Days;
      let currentDate = new Date(previous42Days);

      this.years = [];
      this.months = [];
      this.dateRanges = []; // 用于存储所有相关的日期范围
      while (currentDate <= TDate) {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();
        // console.log("currentDate", year, month, day);

        // 如果年份不在years数组中，则添加
        if (!this.years.includes(year)) {
          this.years.push(year);
        }

        // 存储日期范围，以便后续使用
        this.dateRanges.push({ year: year, month: month, day: day });
        // 移动到下一天
        currentDate.setDate(currentDate.getDate() + 1);
      }
    },
    // 获取70天的算法
    calculatePrevious70(TDate) {
      // 计算 T + 70 天
      let future70Days = new Date(TDate);
      future70Days.setDate(future70Days.getDate() + 70);

      console.log("future70Days", future70Days);

      // 格式化日期
      this.previous42D = String(future70Days.getDate()).padStart(2, "0");

      this.previous42Days = future70Days;
      let currentDate = new Date(TDate); // 从 T 开始计算

      this.years = [];
      this.months = [];
      this.dateRanges = []; // 用于存储所有相关的日期范围

      while (currentDate <= future70Days) {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();
        console.log("currentDate", year, month, day);

        // 如果年份不在 years 数组中，则添加
        if (!this.years.includes(year)) {
          this.years.push(year);
        }

        // 存储日期范围，以便后续使用
        this.dateRanges.push({ year: year, month: month, day: day });
        // 移动到下一天
        currentDate.setDate(currentDate.getDate() + 1);
      }
    },
    // 获取基于月份的日期数组
    getDaysForMonth(year, month) {
      // 获取当前月份的天数
      const daysInMonth = new Date(year, month, 0).getDate();

      // 从 dateRanges 中筛选出与指定年份和月份匹配的日期
      const days = this.dateRanges
        .filter(
          (dateRange) => dateRange.year === year && dateRange.month === month
        )
        .map((dateRange) => dateRange.day)
        // 去重，因为同一个日期可能在 dateRanges 中出现多次
        .filter((day, index, self) => self.indexOf(day) === index)
        // 转换为数字数组（如果 map 后还是数字的话，这一步其实可以省略）
        .map(Number)
        // 排序，确保日期按从小到大的顺序排列
        .sort((a, b) => a - b);

      // 如果 days 数组为空，则生成从 1 到 daysInMonth 的完整日期数组
      if (days.length === 0) {
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
      }

      return days;
    },
       // 获取基于年份的月份数组
    getMonthForyears(year) {
      this.months = this.dateRanges
        .filter((dateRange) => dateRange.year === year)
        .map((dateRange) => dateRange.month)
        // 去重，因为同一个月份可能在日期范围内出现多次（比如月份的第一天和最后一天）
        .filter((month, index, self) => self.indexOf(month) === index)
        // 转换为数字数组（如果map后还是数字的话，这一步其实可以省略）
        .map(Number);
    },
    handleConfirm() {
      const date = `${this.selectedYear}-${
        this.selectedMonth < 10 ? "0" + this.selectedMonth : this.selectedMonth
      }-${this.selectedDay < 10 ? "0" + this.selectedDay : this.selectedDay}`;

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
      console.log('触发bindChange');
      
      //获取当前选中的索引数组
      const [newYearIndex, newMonthIndex, newDayIndex] = event.detail.value;
      console.log(newYearIndex, newMonthIndex, newDayIndex);
      
      this.yearIndex = newYearIndex;
      this.monthIndex = newMonthIndex == -1 ? 0 : newMonthIndex;
      this.dayIndex = newDayIndex == -1 ? 0 : newDayIndex;

      this.selectedYear = this.years[this.yearIndex];
      this.selectedDay = this.days[this.dayIndex];
      // 根据选中的年份筛选月份
      this.getMonthForyears(this.selectedYear)

      this.selectedMonth = this.months[this.monthIndex]
        ? this.months[this.monthIndex]
        : this.months[0];

      this.updateDays(this.selectedYear, this.selectedMonth);
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
  
  
  