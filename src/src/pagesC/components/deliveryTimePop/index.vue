<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
    :closeOnClickOverlay="false"
    closeable="true"
  >
    <view class="title">选择提货时间</view>
    <view class="wrapper">
      <!-- 左侧日期栏 -->
      <view class="date-choose">
        <view
          v-for="(item, index) in formatDate"
          :key="index"
          :class="[
            'date-item',
            dateActivatedIndex == index ? 'date-item-activated' : '',
          ]"
          @click="handleClick(index, 'date', item)"
        >
          {{ item }}</view
        >
      </view>
      <!-- 右侧时间栏 -->
      <view class="time-choose">
        <template
          v-if="
            selfCheckoutDateList[dateActivatedIndex] &&
            selfCheckoutDateList[dateActivatedIndex].selfCheckoutTimeList &&
            selfCheckoutDateList[dateActivatedIndex].selfCheckoutTimeList.length
          "
        >
          <view
            v-for="(item, index) in selfCheckoutDateList[dateActivatedIndex]
              .selfCheckoutTimeList"
            :key="index"
            :class="[
              'time-item',
              timeActivatedIndex == index ? 'time-item-activated' : '',
            ]"
            @click="handleClick(index, 'time', item)"
          >
            {{ item.selfCheckoutTimeStr.split(" ")[1] }}

            <view
              class="iconfont icon-selected"
              v-if="timeActivatedIndex == index"
            ></view> </view
        ></template>
        <template v-else>
          <view class="time-item">{{
            selfCheckoutDateList[dateActivatedIndex].selfCheckoutErrorMessage
          }}</view>
        </template>
      </view>
    </view>
    <view class="button" @click="handleConfirm">确定</view>
  </u-popup>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    selfCheckoutDateList: { type: Array },
    selfCheckoutStartTime: {
      type: String,
    },
  },
  data() {
    return {
      dateActivatedIndex: 0,
      timeActivatedIndex: 0,
      formatDate: [],
    };
  },
  computed: {},
  watch: {
    selfCheckoutDateList: {
      handler(newVal, oldVal) {
        this.mergeDateList(newVal);//判断是否为数组
        this.handleGetIndex(newVal, this.selfCheckoutStartTime);
      },
      deep: true,
    },
  },
  onLoad() {},
  mounted() {},
  onReady() {},

  methods: {
    handleOpen() {},
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    handleConfirm() {
      this.$emit("update:isOpen", false);
      this.$emit("confirm", {
        dateActivatedIndex: this.dateActivatedIndex,
        timeActivatedIndex: this.timeActivatedIndex,
      });
    },
    handleClick(i, type, item) {
      if (type == "date") {
        this.dateActivatedIndex = i;
        console.log("日期变更", this.dateActivatedIndex);
        if (this.dateActivatedIndex) this.timeActivatedIndex = 0;
        // this.timeActivatedIndex = null;
      } else if (type == "time") {
        this.timeActivatedIndex = i;
      }
    },
    mergeDateList(value) {
      const firstList = value.map((item) => {
        return item.label;
      });
      let lastList = value.map((item) => {
        return item.selfCheckoutDate;
      });
      lastList = lastList.slice(3, 7);
      this.formatDate = this.mergeAndRemoveEmptyStrings(firstList, lastList);
      // this.mergeAndRemoveEmptyStrings(firstList, lastList);
      console.log("firstList", firstList, lastList);
    },
    mergeAndRemoveEmptyStrings(array1, array2) {
      return [...array1, ...array2].filter((item) => item !== "");
    },
    handleGetIndex(arr, startTime) {
      let dateActivatedIndex = arr.findIndex(
        (item) => item.selfCheckoutDate == startTime.split(" ")[0]
      );
      let timeActivatedIndex = arr[
        dateActivatedIndex
      ].selfCheckoutTimeList.findIndex(
        (item) => item.selfCheckoutStartTime == startTime
      );
      this.dateActivatedIndex = dateActivatedIndex;
      this.timeActivatedIndex = timeActivatedIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
