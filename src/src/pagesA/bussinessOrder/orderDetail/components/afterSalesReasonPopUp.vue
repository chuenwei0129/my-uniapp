<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
    @touchmove.stop.prevent
  >
    <view class="petPop">
      <view class="header">
        <view class="title"
          >{{ type == "cancelOrder" ? "取消订单" : "申请退款" }}
        </view>
        <view class="close-icon" @click="handleCancel"></view>
      </view>
      <view class="content">
        <view class="service-info">
          <view
            class="info-item"
            @click="
              () => {
                handlePay(index);
              }
            "
            v-for="(item, index) in reasonOptions"
            :key="index"
          >
            <view class="mid">{{ item.reason }}</view>
            <view
              :class="['right', item.checked ? 'checked' : 'uncheck']"
            ></view>
          </view>
        </view>
      </view>
      <view class="footers">
        <view class="new">
          <view class="cancel" @click="handleCancel">{{
            type == "cancelOrder" ? "暂不取消" : "暂不退款"
          }}</view>
          <view class="confirm" @click="handleConfirm">{{
            type == "cancelOrder" ? "确认取消" : "确认退款"
          }}</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { GET_CANCEL_REASON } from "@/api/pay";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      checked: true,
      checkedIndex: 0,
      reasonOptions: [],
    };
  },
  computed: {},
  onLoad(options) {},
  onReady() {
    this.handleGetReason();
  },
  mounted(){
    this.handleGetReason();
  },
  methods: {
    handlePay(checkedIndex) {
      this.reasonOptions = this.reasonOptions.map((item, index) => {
        if (checkedIndex == index) {
          return {
            ...item,
            checked: !item.checked,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      });
      this.checkedIndex = checkedIndex;
    },
    handleOpen() {
      // const ind = this.couponList.findIndex((p) => p.id == this.selectPetId);
      this.checkedIndex = 0;
    },
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    handleConfirm() {      
      if (this.checkedIndex === "") {
        return uni.showToast({
          title: "请选择理由",
          icon: "none",
        });
      }      
      this.$emit("update:isOpen", false);
      this.$emit("confirm", this.reasonOptions[this.checkedIndex]);
    },
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    handleGetReason() {
      GET_CANCEL_REASON().then((res) => {
        this.reasonOptions = res.data.map((i, index) => {
          return {
            reason: i,
            checked: index == 0 ? true : false,
          };
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "utils/fn.scss";

.petPop {
  position: relative;
  left: 0;
  top: 0;
  box-sizing: border-box;
}
.header {
  box-sizing: border-box;
  padding: 40rpx 38rpx;
  display: flex;
  align-items: center;
  font-weight: bold;
  position: relative;
  height: 115rpx;

  .title {
    font-size: 38rpx;
    font-weight: bold;
    color: #333333;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .close-icon {
    height: 42rpx;
    width: 42rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/close-icon.png"
    );
    position: absolute;
    right: 38rpx;
  }
}
.content {
  padding: 0 31rpx 38rpx;
  .title {
    @include textfclaw(31rpx, #323232);
    text-align: left;
    font-weight: bold;
    padding-bottom: 31rpx;
  }
  .service-info {
    .info-item {
      display: flex;
      //   margin-bottom: 33rpx;
      align-items: center;
      height: 115rpx;
      border-top: 2rpx solid #e6e6e6;
      .left {
        image {
          height: 62rpx;
          width: 62rpx;
          object-fit: cover;
        }
      }
      .mid {
        flex: 1;
        // margin-left: 23rpx;
        @include textfclaw(31rpx, #000);
        text-align: left;
      }
      .right {
        height: 42rpx;
        width: 42rpx;
        &.checked {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/checked.png"
          );
        }
        &.uncheck {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/order/uncheck.png"
          );
        }
      }
      .special-right {
        color: rgba(255, 91, 5, 1);
        font-family: D-DIN-Bold;
        font-size: 46rpx;
        span {
          display: inline-block;
          font-size: 23rpx;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.footers {
  box-sizing: border-box;
  padding: 13rpx 38rpx;
  // border-top: 1px solid #e6e6e6;
  .new {
    // background-color: #2DCE80;
    height: 85rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 31rpx;
    // border-radius: 46px;
    .cancel {
      border: 2rpx solid #2dce80;
      background: #e7faf7;
      color: #2dce80;
      border-radius: 40rpx;
      width: 327rpx;
      height: 85rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .confirm {
      background: #2dce80;
      color: #fff;
      border-radius: 40rpx;
      width: 327rpx;
      height: 85rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.card-wrapper {
  width: 673rpx;
  margin-bottom: 19rpx;
  padding-left: 42rpx;
  padding-right: 31rpx;
  .checked {
    height: 48rpx;
    width: 48rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/checked.png"
    );
  }
  .uncheck {
    height: 48rpx;
    width: 48rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/uncheck.png"
    );
  }
  .time-zone {
    @include textfclaw(21rpx, #999);
    height: 31rpx;
    font-weight: 400;
    // float: right;
    text-align: right;
    padding-top: 19rpx;
  }
}
</style>
