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
          <view>{{ secondName }}</view>
          <text @click="handleConfirm">确定</text>
        </view>
        <view class="pickerView">
          <picker-view
            class="picker"
            indicator-class="indicator"
            :value="selectIndex"
            :immediate-change="true"
            @change="bindChange"
          >
            <picker-view-column class="column">
              <view
                class="text"
                v-for="(item, index) in columns"
                :key="index"
                >{{ item.name }}</view
              >
            </picker-view-column>
          </picker-view>
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
    columns: {
      type: Array,
      default: () => [],
    },
    secondName: {
      type: String,
      default: "",
    },
    selectId: {
      type: String,
      default: "",
    },
    type: {
      type: Number, // 4-特殊时期
    },
  },
  watch: {
    isShowPop(val) {
      if (val) {
        if (!!this.selectId) {
          this.selectIndex = [];
          this.columns?.forEach((item, index) => {
            // 特殊时期，没有id，用mark匹配
            if (this.type == 4) {
              if (item.name === this.selectId) this.selectIndex = [index];
            } else if (item.id == this.selectId) {
              this.selectIndex = [index];
            }
          });
        }
      }
    },
  },
  data() {
    return {
      selectIndex: [0],
    };
  },
  methods: {
    stopPrevent() {
      return;
    },
    handleConfirm() {
      const selectObj = this.columns[this.selectIndex[0]];
      this.$emit("onchange", selectObj);
      this.close();
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$emit("update:isShowPop", false);
    },
    bindChange(e) {
      console.log("🚀 ~ bindChange ~ e:", e);
      this.selectIndex = [e.detail.value];
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
  border-bottom: 0.5px solid #e6e6e6;
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
  background-color: #f3f3f4;
  /* opacity: 0.6; */
  height: 96rpx;
  z-index: 0;
}
</style>
