<template>
  <u-popup
    :show="ifRemark"
    mode="center"
    bgColor="transparent"
    @close="close('close')"
    @touchmove.stop.prevent
  >
    <view class="popup_content">
      <view class="popup_desc">
        <img
          class="close"
          @click="close('close')"
          src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/activesOrder/close_icon.png"
        />
        <view class="popup_desc_title">备注</view>
        <view class="popup_desc_textArea">
          <textarea
            v-model="remark"
            class="content"
            style="overflow: visible"
            maxlength="100"
            @input="monitorInput"
            placeholder="请输入您需要的备注内容"
          ></textarea>
          <view class="count">{{ num }}/100</view>
        </view>
        <view class="confirm" @click="close">确定</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    ifRemark: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      num: 0,
      remark: "",
    };
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    close(type = "") {
      if (type == "close") {
        this.remark = "";
        this.num = 0;
      } else {
        uni.setStorageSync("orderRemark", this.remark);
      }
      this.$emit("openRemark", {
        type,
        remark: uni.getStorageSync("orderRemark") || this.remark,
      });

      this.$emit("update:ifRemark", false);
      this.$emit("close", false);
    },
    monitorInput(e) {
      if (e.detail.cursor < 100) {
        this.num = e.detail.value.length;
        this.remark = e.detail.value.slice(0, e.detail.cursor);
      }
      if (e.detail.cursor >= 100) {
        this.num = 100;
      }
    },
  },
  watch: {
    ifRemark(val) {
      if (val) {
        this.remark = uni.getStorageSync("orderRemark") || "";
        this.num = this.remark.length >= 100 ? 100 : this.remark.length;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
:deep(.popup_main) {
  background-color: transparent !important;
}
.popup_content {
  width: 577rpx;
  height: 469rpx;
  background-color: #fff;
  border-radius: 38rpx;
  padding: 32rpx 40rpx 28rpx 40rpx;
}
.popup_desc {
  position: relative;
  &_title {
    font-weight: 500;
    color: #000000;
    font-size: 32rpx;
    text-align: center;
  }
  &_textArea {
    width: 100%;
    height: 240rpx;
    background-color: #f5f6f7 !important;
    border-radius: 40rpx;
    margin-top: 24rpx;
    margin-bottom: 48rpx;
    padding-bottom: 15rpx;
    overflow: hidden;
    box-sizing: border-box;
    .content {
      width: 100%;
      resize: none;
      height: 70%;
      background-color: #f8f8fa;
      font-size: 27rpx;
      line-height: 38rpx;
      outline: none;
      border: 0;
      padding: 32rpx 32rpx 0 32rpx;
    }
    .count {
      font-size: 28rpx;
      color: #999999;
      text-align: right;
      padding-right: 32rpx;
    }
  }
  .close {
    position: absolute;
    right: 0;
    width: 44rpx;
    height: 44rpx;
  }
  .confirm {
    height: 94rpx;
    line-height: 94rpx;
    text-align: center;
    border-top: 1rpx solid #e6e6e6;
    font-weight: 500;
    color: #ffb400;
    font-size: 31rpx;
  }
}
.popup_btn {
  text-align: center;
  color: #ffb400;
  font-size: 32rpx;
  border-top: 1rpx solid #e6e6e6;
  padding-top: 26rpx;
  font-weight: 500;
}

::-webkit-input-placeholder {
  color: #999999;
}
:-ms-input-placeholder {
  color: #999999;
}
:-moz-placeholder,
::-moz-placeholder {
  color: #999999;
  opacity: 1;
}
</style>
