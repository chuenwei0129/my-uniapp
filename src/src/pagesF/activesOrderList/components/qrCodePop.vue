<template>
  <view>
    <u-popup
      :show="isOpen"
      mode="center"
      @open="handleOpen"
      bgColor="transparent"
      @close="close"
      @touchmove.stop.prevent
    >
      <view class="uqCard">
        <view class="title">核销码</view>
        <view class="uq_defaule" v-if="isUse">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/uq_default.png"
          />
        </view>
        <view
          class="uq"
          :class="{ uqUse: isUse }"
          v-if="code && isOpen && !isUse"
        >
          <uqrcode
            ref="uqrcode"
            canvas-id="qrcode"
            :value="code"
            :size="180"
            :auto="true"
            :options="{ margin: 10 }"
          ></uqrcode>
        </view>
        <view class="qr-desc flex">
          <text :class="isUse ? 'out' : ''">核销码：{{ code }}</text>
          <text :style="isUse ? 'color:#999999' : ''"
            >有效期至：{{ time }}</text
          >
        </view>
        <view class="sure" @click="close">知道了</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
//TODO
import uqrcode from "../../components/uqrcode/uqrcode.vue";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    isUse: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      default: "",
    },
  },
  components: {
    uqrcode,
  },
  data() {
    return {};
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    handlepay() {},

    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleClose() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleOpenPay() {
      this.$emit("update:isOpen", false);
      this.$emit("open");
    },
    handleOpen() {},
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.uqCard {
  width: 596rpx;
  height: 731rpx;
  background: #ffffff;
  border-radius: 31rpx;
  position: relative;
  // left: 0;
  // top: 0;
}

.bgc {
  width: 538rpx;
  height: 652rpx;
  display: block;
}

.uq {
  position: absolute;
  top: 125rpx;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
}

.uqUse {
  opacity: 0.2;
}

.code-num {
  position: relative;
  z-index: 5;
  text-align: center;
  // margin-top: -4px;
  font-size: 24rpx;
}

.open {
  position: absolute;
  right: 80rpx;
  bottom: 136rpx;
  width: 180rpx;
  height: 86rpx;
}

.title {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 38rpx 0 44rpx 0;
  font-size: 35rpx;
  font-weight: 500;
  color: #333333;
}
.sure {
  width: 100%;
  border-top: 2rpx solid #ececec;
  padding: 25rpx 0 27rpx 0;
  color: #ffaa1e;
  font-size: 31rpx;
  text-align: center;
  position: absolute;
  top: 635rpx;
}

.uq_defaule {
  width: 346rpx;
  height: 346rpx;
  position: absolute;
  top: 125rpx;
  left: 50%;
  transform: translateX(-50%);
  image {
    width: 100%;
    height: 100%;
  }
}
.qr-desc {
  flex-direction: column;
  position: absolute;
  width: 100%;
  left: 0rpx;
  top: 519rpx;
  .out {
    text-decoration: line-through;
    color: #999999;
  }

  text {
    text-align: center;
    font-size: 31rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 5rpx;
  }

  text:last-child {
    font-size: 23rpx;
    font-weight: 400;
    color: #666666;
  }
}
</style>
