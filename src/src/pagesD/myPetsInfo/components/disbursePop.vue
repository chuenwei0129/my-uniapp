<template>
  <u-popup :show="show" round="19" @touchmove.stop.prevent>
    <view class="content">
      <view class="header">
        <text @click="close">取消</text>
        <view>支出</view>
        <text @click="hanldConfirm">确定</text>
      </view>
      <view class="pickerView">
        <picker-view class="picker" indicator-class="indicator" :value="value" @change="bindChange">
          <picker-view-column class="column">
            <view class="text" v-for="(item, index) in disburseList" :key="index">{{
              item
            }}</view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    disburse: {
      type: Number,
    },
  },
  data() {
    return {
      value: [0],
      disburseList: ["按年选择", "按月选择", "全部"],
    };
  },

  methods: {
    bindChange(e) {
      console.log('bindChange : ', e)
      this.value = e.detail.value;
    },
    close() {
      this.$emit("update:show", false);
    },
    hanldConfirm() {
      this.$emit("confirm", { disburse: this.value[0] });
      this.$emit("update:show", false);
    },
  },
  watch: {
    show(val, oldVal) {
      if (val) {
        this.value = [this.disburse];
        console.log('this.value : ', this.value)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 38rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  height: 113rpx;
  align-items: center;
  border-bottom: 1rpx solid #e6e6e6;

  text:first-child {
    font-size: 31rpx;
    color: #666666;
  }

  text:last-child {
    font-size: 31rpx;
    color: #2dce80;
  }

  view {
    font-size: 35rpx;
    font-weight: bold;
    color: #333333;
  }
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
  border-radius: 48rpx;
  overflow: hidden;
  background-color: #eee;
  opacity: 0.6;
  height: 96rpx;
}
</style>
