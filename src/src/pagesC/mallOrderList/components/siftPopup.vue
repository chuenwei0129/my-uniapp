<template>
  <view>
    <u-popup
      :show="show"
      mode="top"
      z-index="10070"
      @close="closePopup"
      @open="$emit('update:show', true)"
    >
      <view :class="{ 'popup-top': statusBarHeight }" class="filter-popup">
        <view v-if="filterPopupColumns.timeColumns">
          <view class="row-title flex-layout">{{
            filterPopupColumns.timeColumns.title
          }}</view>
          <view class="time-list flex-layout">
            <view
              v-for="(item, ind) in filterPopupColumns.timeColumns.columns"
              :key="ind"
              :class="{ 'time-box': item.slotName }"
            >
              <view
                v-if="!item.slotName"
                class="time-item flex-layout"
                :class="{ 'selected-checked': searchTime === item.id }"
                @click="selectTimeItme(item)"
              >
                {{ item.lable }}
              </view>
              <view
                v-if="item.slotName === 'datestartingtime'"
                class="flex-layout time-input"
              >
                <view
                  @click="selectStartingTime('startTime')"
                  :class="{ 'selected-checked': startTime }"
                >
                  <u--input
                    placeholder="选择起始时间"
                    border="none"
                    disabled
                    v-model="startTime"
                  ></u--input>
                </view>
                <view class="interval">-</view>
                <view
                  @click="selectStartingTime('endTime')"
                  :class="{ 'selected-checked': endTime }"
                >
                  <u--input
                    placeholder="选择终止时间"
                    border="none"
                    disabled
                    v-model="endTime"
                  ></u--input>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="filterPopupColumns.typeColumns">
          <view class="row-title flex-layout">{{
            filterPopupColumns.typeColumns.title
          }}</view>
          <view class="type-list flex-layout">
            <view
              v-for="(item, ind) in filterPopupColumns.typeColumns.columns"
              :key="ind"
              :class="{ 'type-box': item.slotName }"
            >
              <view
                v-if="!item.slotName"
                class="type-item flex-layout"
                :class="{ 'selected-checked': searchType === item.id }"
                @click="selectTypeItme(item)"
              >
                {{ item.lable }}
              </view>
            </view>
          </view>
        </view>
        <view class="popup-btns">
          <view class="flex-layout bottom-btns">
            <view class="bottom-btnitem flex-layout" @click="handleReset"
              >重置</view
            >
            <view
              class="bottom-btnitem flex-layout bottom-btnitem-sure"
              @click="handleDeliver"
              >确定</view
            >
          </view>
        </view>
      </view>
    </u-popup>
    <u-datetime-picker
      class="datetime-picker"
      :show="dateShow"
      v-model="dateShowValue"
      :maxDate="maxDate"
      :minDate="minDate"
      mode="date"
      @close="dataClose"
      @confirm="onConfirm"
      @cancel="dataClose"
    ></u-datetime-picker>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    statusBarHeight: {
      type: [Number, String],
      default: "",
    },
    minDate: {
      type: [Number, String],
      default: 0,
    },
    maxDate: {
      type: [Number, String],
      default: Number(new Date()),
    },
    filterPopupColumns: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dateShow: false,
      dateShowValue: "",
      searchTime: "",
      startTime: "",
      endTime: "",
      searchType: "",
      params: {
        startTime: "",
        endTime: "",
        typeList: "",
      },
    };
  },
  methods: {
    dataClose() {
      this.dateShow = false;
    },
    // 重置
    handleReset() {
      this.searchTime = "";
      this.startTime = "";
      this.endTime = "";
      this.searchType = "";
      this.startTime = "";
      this.endTime = "";
      this.params = {
        startTime: "",
        endTime: "",
        typeList: "",
      };
    },
    // 校验
    validate() {
      if (!this.startTime && this.endTime) {
        uni.showToast({
          title: "请选择起始时间",
          icon: "none",
        });
        return false;
      } else if (!this.endTime && this.startTime) {
        uni.showToast({
          title: "请选择终止时间",
          icon: "none",
        });
        return false;
      }
      return true;
    },
    // 确定筛选
    handleDeliver() {
      if (!this.validate()) {
        return;
      }
      console.log(this.params);
      this.$emit("handleDeliver", this.params);
      this.closePopup();
    },
    closePopup() {
      this.$emit("update:show", false);
    },
    // 记录起始时间的key
    selectStartingTime(type) {
      this.dateShow = true;
      this.timeValueType = type;
    },
    // 确定时间
    onConfirm({ value, mode }) {
      console.log(value);
      this[this.timeValueType] = dayjs(value).format("YYYY-MM-DD");
      this.searchTime = "";
      this.params[this.timeValueType] = value;
      this.dataClose();
    },
    selectTimeItme(item) {
      if (this.searchTime == item.id) {
        this.searchTime = "";
      } else {
        this.searchTime = item.id;
        this.startTime = "";
        this.endTime = "";
        this.getRecentThreeMonthsDateRange(item.id);
      }
    },
    selectTypeItme(item) {
      if (this.searchType == item.id) {
        this.searchType = "";
        this.params.typeList = "";
      } else {
        this.searchType = item.id;
        this.params.typeList = item.id;
      }
    },
    // 获取近几个月时间戳
    getRecentThreeMonthsDateRange(num) {
      this.params.startTime = dayjs().subtract(num, "month").valueOf();
      this.params.endTime = dayjs().valueOf();
    },
  },
};
</script>

<style scoped lang="scss">
.flex-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}
.filter-popup {
  width: 100%;
  height: 100%;
  padding: 0 31rpx 42rpx;

  ::v-deep .row-title {
    width: 100%;
    height: 85rpx;
    font-weight: bold;
    font-size: 29rpx;
    color: #1f1f1f;
    background: #ffffff;
    justify-content: start;
  }
  .time-list,
  .type-list {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 26rpx;
  }
  .time-item,
  .type-item {
    width: 219rpx;
    height: 69rpx;
    background: #f5f5f9;
    border-radius: 35rpx;
    margin-bottom: 12rpx;
    font-weight: 400;
    font-size: 25rpx;
    color: #1f1f1f;
  }
  .time-box:last-child {
    width: 100%;
  }
  .time-input {
    width: 100%;
    justify-content: space-between;
    .u-input {
      width: 321rpx;
      height: 69rpx;
      background: #f5f5f9;
      border-radius: 35rpx;

      .uni-input-placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 25rpx;
        color: #999999;
      }
      ::v-deep .uni-input-input {
        text-align: center;
      }
    }
    .interval {
      margin: 0 15rpx;
      font-size: 25rpx;
      color: #333333;
    }
  }
  .selected-checked {
    font-weight: 500;
    color: #fe2442;
    background: #ffefef;
    border-radius: 35rpx;
    border: 1rpx solid #ffd8d8;
    .u-input {
      background: #ffefef !important;
      border: 1rpx solid #ffd8d8;
      ::v-deep .uni-input-input {
        font-weight: 500;
        font-size: 25rpx;
        color: #fe2442;
        color: #fe2442;
      }
    }
  }
  .popup-btns {
    .bottom-btns {
      justify-content: space-between;
    }

    .bottom-btnitem {
      width: 333rpx;
      height: 77rpx;
      background: #ffffff;
      border-radius: 42rpx;
      border: 1rpx solid #e6e6e6;
    }
    .bottom-btnitem {
      width: 333rpx;
      height: 77rpx;
      background: #ffffff;
      border-radius: 42rpx;
      border: 1rpx solid #e6e6e6;
    }
    .bottom-btnitem-sure {
      font-weight: 500;
      color: #ffffff;
      background: #fe2442;
      border: 1rpx solid #fe2442;
    }
  }
}
.popup-top {
  padding-top: 88rpx;
}
.u-safe-bottom{
  display: none;
}
</style>