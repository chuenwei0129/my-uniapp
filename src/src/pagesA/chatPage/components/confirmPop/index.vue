<template>
  <view>
    <u-popup
      :show="show"
      mode="center"
      bgColor="transparent"
      @close="close"
      :mask-close-able="false"
      :closeOnClickOverlay="false"
      @touchmove.stop.prevent
    >
      <view class="pingan-pop">
        <view class="title">温馨提示</view>
        <view class="decript"> 本宠物问诊服务由<span>宠胖胖</span>提供 </view>
        <view class="agreement">
          <view
            :class="['radiocheck', checked ? 'checked' : '']"
            @click="checkboxChange"
          ></view>
          <view class="agreement-text">
            <div>
              我已阅读并同意<span @click="goAgreement(1)"
                >《上海宠氧互联网宠物医院宠物健康咨询服务知情同意书》</span
              >和<span @click="goAgreement(2)">《用户授权协议》</span>
            </div>
          </view>
        </view>
        <view class="openbtn" @click="confirmationBelief">我已阅读并同意</view>

        <view class="close-icon" @click="close"></view>
      </view>

      <u-toast ref="uToast"></u-toast>
    </u-popup>
  </view>
</template>
<script>
import { userConfirmRequest } from "@/api/sheets";
import { thirdPartyLoginFun } from "@/utils/config";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    pinganAuthData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    goAgreement(linktype) {
      let str = "";
      if (linktype == 1) {
        str = `/pagesA/webView/index?route=/meow-interface/html/oxygen-pet.html&type=jump&title=隐私协议`;
      } else {
        str = `/pagesA/webView/index?route=/meow-interface/html/user-auth.html&type=jump&title=用户授权协议`;
      }
      uni.navigateTo({
        url: str,
      });
    },
    close() {
      this.$emit("close");
    },
    checkboxChange() {
      let curstatus = this.checked;
      this.checked = !curstatus;
    },
    confirmationBelief() {
      if (!this.checked) {
        this.$refs.uToast.show({
          type: "default",
          icon: false,
          message: "请先勾选同意授权协议",
        });
        return;
      } else {
        thirdPartyLoginFun(
          {
            openId: this.pinganAuthData.openId,
            thirdType: Number(this.pinganAuthData.thirdType),
          },
          () => {
            const requsetData = {
              isAuthorization:true
            };
            userConfirmRequest(requsetData).then((res) => {
              // 请求成功关闭弹窗
              this.$emit("success");
            });
          }
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";

.pingan-pop {
  width: 576rpx;
  height: 390rpx;
  background: #fff;
  border-radius: 38rpx;
  position: relative;

  .title {
    color: #1f1f1f;
    font-size: 30rpx;
    font-weight: bold;
    text-align: center;
    margin: 46rpx 0 30rpx 0;
  }
  .decript {
    font-size: 26rpx;
    color: #333333;
    margin-bottom: 46rpx;
    text-align: center;
    span {
      color: #ff6d22;
    }
  }

  .agreement {
    padding-left: 29rpx;
    padding-right: 40rpx;
    display: flex;
    // @include absNormal(auto, auto, $bottom: 73rpx, $left: 0);
    .radiocheck {
      width: 27rpx;
      height: 27rpx;
      margin-right: 8rpx;
      margin-top: 4rpx;
      flex-shrink: 0;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/pingan/noCheck@3x.png"
      );
      &.checked {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/pingan/PAagree@3x.png"
        );
      }
    }

    .agreement-text {
      color: #333;
      font-size: 21rpx;
      margin-bottom: 30rpx;
      span {
        color: #238cff;
      }
    }
  }
  .openbtn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    width: 523rpx;
    height: 77rpx;
    background: #ff6d22;
    border-radius: 77rpx;
    color: #fff;
    font-size: 30rpx;
    font-weight: bold;
  }
}
.close-icon {
  position: absolute;
  right: 15rpx;
  top: 15rpx;
  width: 50rpx;
  height: 50rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/pingan/PAclose@3x.png"
  );
}
</style>
