<template>
  <view v-if="isOpen" @touchmove.stop.prevent="stopPrevent">
  <u-popup
    id="popup"
    :show="isOpen"
    mode="bottom"
    bgColor="#ffffff"
    :round="20"
    :closeOnClickOverlay="true"
    :safeAreaInsetBottom="false"
    @open="handleOpen"
    @close="close"
    @touchmove.stop.prevent
    :customStyle="{ bottom: bottom }"
  >
    <view class="fillinfo-pop">
      <view class="pop-header">
        <view class="header-title">完善合同信息</view>
        <view class="header-close" @click="close"></view>
      </view>
      <view class="tip-text">请填写真实信息，一旦提交无法修改</view>
      <view class="form" v-if="platforms">
        <view class="formItem">
          <view class="label">购买人姓名</view>
          <view class="com">
            <input
              placeholder="请填写"
              maxlength="15"
              border="none"
              type="text"
              height="25"
              v-model="info.customerName"
              :showConfirmBar="false"
              :disableDefaultPadding="true"
              :adjustPosition="false"
              :always-system="true"
              :always-embed="true"
              :hold-keyboard="true"
              class="input1"
              placeholder-style="fontSize: 31rpx;color: #999999;font-weight: normal;"
            />
          </view>
        </view>
        <view class="formItem">
          <view class="label">联系方式</view>
          <view class="com">
            <input
              placeholder="请填写"
              height="25"
              type="text"
              maxlength="11"
              border="none"
              v-model="info.phone"
              :showConfirmBar="false"
              :disableDefaultPadding="true"
              :adjustPosition="false"
              :always-system="true"
              :always-embed="true"
              :hold-keyboard="true"
              class="input1"
              placeholder-style="fontSize: 31rpx;color: #999999;font-weight: normal;"
            />
          </view>
        </view>
        <view class="address">
          <view class="label">地址</view>
          <textarea
            class="addressText"
            v-model="info.address"
            placeholder="请填写详细地址"
            :showConfirmBar="false"
            :disableDefaultPadding="true"
            :adjustPosition="false"
            :always-embed="true"
            :hold-keyboard="true"
            maxlength="50"
            border="none"
            placeholder-style="color:#999999; fontSize:31rpx;"
            @input="changInput"
          ></textarea>
          <view class="count">{{ lang }}/50 </view>
        </view>
      </view>
      <view class="form" v-else>
        <view class="formItem">
          <view class="label">购买人姓名</view>
          <view class="com">
            <input
              placeholder="请填写"
              maxlength="15"
              border="none"
              type="text"
              height="25"
              v-model="info.customerName"
              :showConfirmBar="false"
              :always-system="true"
              :adjust-position="true"
              :cursor-spacing="280"
              class="input1"
              placeholder-style="fontSize: 31rpx;color: #999999;font-weight: 400;"
            />
          </view>
        </view>
        <view class="formItem">
          <view class="label">联系方式</view>
          <view class="com">
            <input
              placeholder="请填写"
              height="25"
              type="text"
              maxlength="11"
              border="none"
              v-model="info.phone"
              :showConfirmBar="false"
              :adjust-position="true"
              :always-system="true"
              :cursor-spacing="200"
              class="input1"
              placeholder-style="fontSize: 31rpx;color: #999999;font-weight: 400;"
            />
          </view>
        </view>
        <view class="address">
          <view class="label">地址</view>
          <textarea
            class="addressText"
            v-model="info.address"
            placeholder="请填写详细地址"
            :showConfirmBar="false"
            :adjust-position="true"
            :always-system="true"
            :cursor-spacing="120"
            @click="$u.debounce(handClick, 500)"
            :focus="focus"
            maxlength="50"
            border="none"
            placeholder-style="color:#999999; fontSize:31rpx;"
            @input="changInput"
          ></textarea>
          <view class="count">{{ lang }}/50 </view>
        </view>
      </view>
      <view
        :class="['next-step', canNext ? 'light' : '']"
        @click="$u.debounce(goNext, 500)"
      >
        下一步
      </view>
    </view>
  </u-popup>
  </view>
</template>
<script>
import { rpxToPx } from "@/utils";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    contractInfo: {
      type: Object,
      default: {},
    },
  },
  options: { styleIsolation: "shared" },
  data () {
    return {
      info: {
        customerName: "",
        phone: "",
        address: "",
      },
      keyboardHeight: 0,
      lang: 0,
      platforms: true,
      focus: false,
      listener:null
    };
  },
  computed: {
    canNext () {
      return this.info.customerName && this.info.phone && this.info.address;
    },
    bottom () {
      return this.keyboardHeight + "px";
    },
  },
  mounted () {
    this.listener = (res) => {
      console.log(11559, res);
      if (res.height > 0) {
        // 键盘弹出
        this.keyboardHeight = res.height - rpxToPx(60);
      } else {
        // 键盘收起
        this.keyboardHeight = 0;
      }
    }
    const systemInfo = uni.getSystemInfoSync();

    if (systemInfo.platform === 'ios') {
      console.log('当前设备是 ios');
      uni.onKeyboardHeightChange(this.listener);
      this.platforms = true
    } else {
      console.log('其他平台');
      this.platforms = false
    }
  },
  beforeDestroy () {
    uni.offKeyboardHeightChange(this.listener)
    this.listener = null
  },
  methods: {
    stopPrevent() {
      return;
    },
    handClick () {
      setTimeout(() => {
        this.focus = true
      }, 600)
    },
    changInput (e) {
      console.log(e);
      let { value } = e.detail
      this.info.address = value.slice(0, 50)
      this.lang = value.length > 50 ? 50 : value.length
    },
    getDetailAddress (info) {
      if (info && info.address) {
        let str = `${info.address}${info.addressName ?? ""}${info.houseNumber ?? ""
          }`;
        return str.slice(0, 50);
      }
      return "";
    },
    handleOpen () {
      console.log(this.contractInfo);
      if (this.contractInfo) {
        this.info.address = this.getDetailAddress(this.contractInfo);
        this.lang = this.info.address.length > 50 ? 50 : this.info.address.length
        this.info.phone = this.contractInfo.phone;
        this.info.customerName = this.contractInfo.name.slice(0, 15);
      }
    },
    validatePhone (phone) {
      if (/^1[3-9]\d{9}$/.test(phone)) {
        return true;
      } else {
        return false;
      }
    },
    close () {
      uni.hideKeyboard()
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      this.info = {
        customerName: "",
        phone: "",
        address: "",
      };
    },
    goNext () {
      if (!this.canNext) return;
      if (!this.validatePhone(this.info.phone)) {
        uni.showToast({
          icon: "none",
          title: "请输入正确的手机号码",
          duration: 1000,
        });
        return;
      } else {
        this.$emit("next", this.info);
        this.$emit("update:isOpen", false);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";
.fillinfo-pop {
  width: 100vw;
  // height: 767rpx;
  position: relative;
  .pop-header {
    width: 100%;
    height: 115rpx;
    @include flex();
    position: relative;
    .header-title {
      font-weight: bold;
      @include textfclaw(35rpx, #1f1f1f, $align: center, $lineH: 115rpx);
    }
    .header-close {
      @include absNormal(50rpx, 50rpx, $top: 33rpx, $right: 29rpx);
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/raw/popclose.png"
      );
    }
  }
  .tip-text {
    position: absolute;
    left: 0;
    top: 87rpx;
    font-weight: 400;
    font-size: 25rpx;
    color: #fe2442;
    width: 100%;
    text-align: center;
  }
  .form {
    margin-top: 44rpx;
    padding: 0 29rpx;
    .formItem {
      display: flex;
      height: 86rpx;
      margin-bottom: 40rpx;
      border-bottom: 1rpx solid #e6e6e6;
      .label {
        @include textfclaw(31rpx, #1f1f1f, $align: left, $lineH: 42rpx);
        min-width: 154rpx;
      }
      .com {
        width: 100%;
        flex: 1;
        margin-left: auto;
        .input1 {
          border: none;
          outline: none;
          text-align: right;
          direction: ltr;
        }
        ::v-deep .u-textarea {
          // padding: 0 !important;
          // width: 100%;
          // outline: none;
          // text-align: right;
          // direction: ltr;
          // white-space: nowrap !important;
          // overflow-x: auto !important;
          // overflow-y: hidden !important;
          // resize: none !important;
          // line-height: 25px;
          // box-sizing: border-box !important;
        }
      }
    }
    .address {
      position: relative;
      border: none;
      .addressText {
        padding: 0 !important;
        width: 100%;
        height: 125rpx;
        margin-top: 10rpx;
        color: #1f1f1f !important;
        font-size: 31rpx;
      }
      .count {
        position: absolute;
        bottom: 0;
        right: 0;
        // width: 58rpx;
        height: 35rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 25rpx;
        color: #999999;
        line-height: 35rpx;
        text-align: right;
        font-style: normal;
      }
    }
  }

  // .address::v-deep .u-textarea {
  //   padding: 0 rpx !important;
  // }

  .next-step {
    background: #fe2442;
    color: #ffffff;
    border-radius: 42px;
    @include flex();
    @include textfclaw(31rpx, #ffffff, $align: center, $lineH: 42rpx);
    // @include absNormal(673rpx, 85rpx, $bottom: 23rpx, $left: 38rpx);
    width: 673rpx;
    height: 85rpx;
    margin: 0 auto;
    margin-top: 23rpx;
    margin-bottom: 69rpx;
    font-weight: bold;
    opacity: 0.6;
    &.light {
      opacity: 1;
    }
  }
}
.address ::v-deep .u-textarea {
  padding: 0 !important;
  width: 100%;
  min-height: 125rpx;
  margin-top: 10rpx;
}
.address ::v-deep .u-textarea__field {
  color: #1f1f1f !important;
  font-size: 31rpx;

  textarea {
    color: #1f1f1f !important;
    font-size: 31rpx;
  }
}
::v-deep .u-textarea__count {
  position: absolute !important;
  right: 0px !important;
  bottom: 2px !important;
  padding: 0 !important;
}
</style>
