<template>
  <u-popup
    v-if="show"
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
    :closeOnClickOverlay="true"
    :overlay="true"
  >
    <view class="content">
      <view class="contentImg"></view>
      <view class="content-top">
        <text v-if="1">
          {{ msg_1 || "-" }}
        </text>
        <!-- <text v-else class="typeMessage">{{ msg_2 }}</text> -->
      </view>
      <view class="content-bottom">
        <template v-if="1">
          <view class="cancel" @click="handleCancel">放弃</view>
          <view class="confirm" @click="handleConfirm">联系门店</view>
        </template>
        <view v-if="0" class="know" @click="handleCancel">好的</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { mapState } from "vuex";
import { action_report } from "@/utils/track";
export default {
  name: "outdistance",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    code: {
      type: [String, Number],
    },
    cancelOrRightBackfc: {
      type: Function,
    },
    messagePop: {
      type: String,
    },
    livebodyData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  data() {
    return {
      msg_1: "宠物已被其他买家锁单,如需选购,可联系门店咨询",
      msg_2: "",
    };
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    // 好的/取消 按钮
    handleCancel() {
      this.close();
      if (this.cancelOrRightBackfc) {
        this.cancelOrRightBackfc();
      }
    },
    // 联系门店 按钮
    handleConfirm() {
      this.close();
      action_report({
        action_name: "LivepetDetailpage_phone_click",
        module_name: "action_report",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.livebodyData.liveSkuDTO.itemId,
        },
      });
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: this.livebodyData.liveShop.shopPhone,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../utils/fn.scss";
.content {
  width: 577rpx;
  height: 288rpx;
  background: #ffffff;
  border-radius: 38rpx;
  padding: 38rpx 38rpx 0 38rpx;
  box-sizing: border-box;
  position: relative;
  .contentImg {
    position: absolute;
    top: -27rpx;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 346rpx;
    height: 231rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/popupIcon.png"
    );
  }
  .content-top {
    width: 100%;
    height: 154rpx;
    border-bottom: 1rpx solid #e6e6e6;
    padding: 25rpx 30rpx;
    box-sizing: border-box;
    @include textfclaw(27rpx, #000000, $align: center, $lineH: 38rpx);
    .typeMessage {
      padding-top: 20rpx;
      display: inline-block;
      box-sizing: border-box;
    }
  }
  .content-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 27rpx auto 28rpx;
    height: calc(100% - 154rpx);
    box-sizing: border-box;
    .cancel {
      width: 50%;
      @include textfclaw(31rpx, #25252a, $align: center, $lineH: 42rpx);
      border-right: 1rpx solid #e6e6e6;
    }
    .confirm {
      width: 50%;
      font-weight: 500;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
    .know {
      width: 100%;
      font-weight: 500;
      @include textfclaw(31rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    }
  }
}
</style>
