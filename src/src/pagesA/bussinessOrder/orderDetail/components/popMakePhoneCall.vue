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
      <view class="content">
        <view class="service-info">
          <view
            class="info-item"
            v-for="(item, index) in phoneList"
            :key="index"
            @click="
              () => {
                handleMakePC(item);
              }
            "
            >{{ item }}</view
          >
        </view>
      </view>
      <view class="footers">
        <view class="new" @click="handleCancel">
          <view class="text">取消</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    phoneList: {
      type: Array,
    },
  },
  data() {
    return {
      checked: true,
      checkedIndex: 0,
    };
  },
  computed: {
    ...mapState(["userSelectedPetId"]),
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    handlePay(index) {
      this.checkedIndex = index;
    },
    handleOpen() {
      this.checkedIndex = 0;
    },
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },

    handleMakePC(item) {
      uni.makePhoneCall({
        phoneNumber: item, //仅为示例
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
    font-size: 46rpx;
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
  padding: 38rpx 31rpx;
  .title {
    @include textfclaw(31rpx, #323232);
    text-align: left;
    font-weight: bold;
    padding-bottom: 31rpx;
  }
  .service-info {
    // padding-top: 29rpx;
    .info-item {
      display: flex;
      margin-bottom: 33rpx;
      align-items: center;
      justify-content: center;
    }
  }
}
.footers {
  box-sizing: border-box;
  padding: 13rpx 38rpx;
  .new {
    background-color: #2dce80;
    height: 85rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 46px;

    .text {
      font-size: 31rpx;
      font-weight: bold;
      color: #ffffff;
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
