<template>
  <view class="noData-with-button-box">
    <image class="noData-img" :src="img" />
    <!-- https://frontend-cdn.chongpangpang.com/image/qykimg2/default.png -->
    <text>{{ noDataText }}</text>
    <view
      @click="handleClick"
      class="click-button"
      v-show="clickDataText !== null"
    >
      <text class="click-button-text">{{ clickDataText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "noData",

  props: {
    noDataText: {
      type: String,
      default: "暂无数据",
    },
    clickDataText: null,
    img: {
      type: String,
    },
  },

  methods: {
    handleClick() {
      this.$emit("func"); // 触发传过来的func函数
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.noData-with-button-box {
  // width: 440rpx;
  // height: 430rpx;
  // position: absolute;
  // // top: 30%;
  // left: 50%;
  // transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;

  .noData-img {
    width: 346rpx;
    height: 346rpx;
  }

  text {
    display: inline-block;
    color: #999999;
    font-size: 26rpx;
  }

  .click-button {
    padding: 15rpx 30rpx 15rpx 30rpx;
    background-color: #ffd41e;
    border-radius: 48rpx;
    margin-top: 25rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .click-button-text {
      display: contents;
      color: #1f1f1f;
      font-size: 30rpx;
      font-weight: bold;
      text-align: center;
    }
  }
}

@import "./index.scss";
</style>
