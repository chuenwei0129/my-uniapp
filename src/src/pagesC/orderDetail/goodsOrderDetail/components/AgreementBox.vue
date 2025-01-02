<template>
  <u-transition
    v-if="agreementObj.code"
    :show="agreementObj.code"
    :mode="onlineAndOffline ? 'fade' : ''"
    duration="500"
  >
    <view
      :class="[agreementObj.code !== 1 ? 'agreement' : 'sign-contract-box']"
    >
      <view class="title"> {{ agreementObj.title }} </view>
      <view
        v-if="agreementObj.code !== 4"
        class="status-container"
        @click.stop="handleContractStatus"
      >
        <text class="status-text">{{ agreementObj.signStatusText }}</text>
        <img class="thumbnail-4" :src="imgUrl" />
      </view>
    </view>
  </u-transition>
</template>

<script>
export default {
  props: {
    agreementObj: {
      type: Object,
      required: true,
      default: () => ({
        code: null,
        title: "",
        signStatusText: "",
      }),
    },
    onlineAndOffline: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  computed: {
    imgUrl() {
      return this.agreementObj.code === 1
        ? "//frontend-cdn.chongpangpang.com/image/medical-mp/discovery/blackRed.png"
        : "//frontend-cdn.chongpangpang.com/image/medical-mp/discovery/blackReturn.png";
    },
  },

  methods: {
    handleContractStatus() {
      this.$emit("contract-status");
    },
  },
};
</script>

<style lang="scss" scoped>
.status-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40rpx;
  line-height: 40rpx;
}

.status-text {
  /* font-weight: 400; */
  font-size: 29rpx;
  /* color: #1f1f1f; */
  text-align: right;
  font-style: normal;
  white-space: nowrap;
}

.status-icon {
  width: 46rpx;
  height: 46rpx;
}
.thumbnail-4 {
  width: 24rpx;
  height: 24rpx;
}

.agreement {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 112rpx;
  padding: 36rpx 29rpx;
  margin: 0 19rpx 0 19rpx;
  font-size: 29rpx;
  background: #ffffff;
  border-radius: 23rpx;
  color: #1f1f1f;
  .agreement-title {
    line-height: 40rpx;
    font-weight: 400;
    color: #1f1f1f;
  }
  .agreement-right {
    height: 42rpx;
  }
}
</style>
