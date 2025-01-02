<template>
  <view class="steps-container">
    <scroll-view
      :scroll-y="true"
      class="scroll-step"
      scroll-with-animation
      :scroll-into-view="scrollPosition"
    >
      <view
        class="step-main"
        v-for="(step, index) in steps"
        :id="`step${index}`"
        :key="index"
      >
        <!-- 步骤条（圆圈--线条） -->
        <view class="step">
          <view
            class="step-circle"
            :class="{
              currentActive: index === currentStep,
              'slot-icon_actived': index < currentStep,
            }"
          >
          </view>
          <view
            class="step-line"
            :class="{ 'step-line_currentActive': index < currentStep }"
            v-if="index < steps.length - 1"
          ></view>
          <!-- 步骤圆点label -->
          <view
            class="step-label"
            :class="{ currentActive: index === currentStep }"
          ></view>
        </view>
        <!-- 步骤内容 -->
        <view class="desc">
          <view class="title" :class="{ active: index === currentStep }">
            {{ step.orderDeliveryStatusDesc || "" }}
          </view>
          <view class="time" v-if="step.orderDeliveryTime">{{
            step.orderDeliveryTime
          }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true,
    },
    currentStep: {
      type: Number,
      required: true,
    },
  },
  computed: {
    scrollPosition() {
      return `step${this.steps.length - 1}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-step {
  width: 100%;
  max-height: calc(1025rpx - 180rpx);
  overflow-y: scroll;
  padding-bottom: 35rpx;
}
.steps-container {
  display: flex;
  flex-direction: column;
  .step-main {
    display: flex;
  }
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-circle {
  width: 23rpx;
  height: 23rpx;
  border-radius: 50%;
  border: 2rpx solid #999;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.step-line {
  width: 2rpx;
  height: 75rpx;
  background-color: #999999;
}
.slot-icon_actived {
  background-color: #fff;
  border: 2rpx solid #fe2442 !important;
}
.step-line_currentActive {
  background-color: #fe2442;
  border-color: #fe2442;
  box-sizing: border-box;
}
.step-label {
  color: #999999;
}
.step-circle.currentActive {
  background-color: #fe2442;
  border: 2rpx solid #fe2442 !important;
}
.active {
  color: #fe2442 !important;
}
.desc {
  display: flex;
  justify-content: space-between;
  width: calc(100vw - 38 * 2rpx - 23rpx - 25rpx);
  margin-left: 25rpx;
  .title {
    font-size: 29rpx;
    color: #1f1f1f;
    line-height: 25rpx;
    text-align: left;
  }
  .time {
    font-size: 23rpx;
    color: #999999;
    line-height: 33rpx;
    text-align: right;
    font-style: normal;
  }
}
</style>
