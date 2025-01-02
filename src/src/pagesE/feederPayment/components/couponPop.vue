<template>
  <u-popup
    :show="isShowCouponPop"
    :round="20"
    @close="handleClose"
    bgColor="#fff"
    @touchmove.stop.prevent
  >
    <view class="wrapper">
      <view class="title">
        <view class="title-text">优惠券</view>
        <view class="title-close" @click="handleClose">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/close_white.png"
          />
        </view>
      </view>

      <view class="container">
        <scroll-view class="scroll-view" scroll-y>
          <view v-if="ableCouponList.length" class="able">
            可用优惠券({{ ableCouponList.length || 0 }})
          </view>
          <view class="able-list">
            <u-radio-group v-model="radioCurrentValue" placement="column">
              <!-- @change="groupChange" -->
              <view
                v-for="coupon in ableCouponList"
                :key="coupon.memberCouponId"
                class="able-coupon"
                @click="changeRadioCurrentValue(coupon.memberCouponId)"
              >
                <view v-if="coupon.rightType" class="coupon-type">
                  {{ couponTypeMap[coupon.rightType] }}
                </view>

                <view class="coupon-price">
                  <view v-if="coupon.rightType == 216">
                    <text class="price">{{
                      handleNum(coupon.discount * 10)
                    }}</text
                    >折
                  </view>
                  <view v-if="coupon.rightType == 201" class="price">免费</view>
                  <view v-if="coupon.rightType == 211">
                    <text class="price">{{ coupon.amount }}</text
                    >元
                  </view>
                  <view v-if="coupon.rightType != 201"
                    >满{{ coupon.threshold }}可用</view
                  >
                </view>

                <view class="coupon-content">
                  <view class="content-title">
                    {{ coupon.promotionName }}
                  </view>
                  <view class="content-expires">
                    有效期至 {{ coupon.endTime }}
                  </view>
                </view>

                <view class="radio">
                  <u-radio
                    :name="coupon.memberCouponId"
                    activeColor="#fe2442"
                  ></u-radio>
                </view>
              </view>
            </u-radio-group>
          </view>

          <view v-if="disableCouponList.length" class="able">
            不可用优惠券({{ disableCouponList.length || 0 }})
          </view>
          <view class="able-list">
            <view
              v-for="coupon in disableCouponList"
              :key="coupon.memberCouponId"
              class="able-coupon disable-coupon"
            >
              <view class="disable-top">
                <view v-if="coupon.rightType" class="coupon-type">
                  {{ couponTypeMap[coupon.rightType] }}
                </view>

                <view class="coupon-price">
                  <view v-if="coupon.rightType == 216">
                    <text class="price">{{
                      handleNum(coupon.discount * 10)
                    }}</text
                    >折
                  </view>
                  <view v-if="coupon.rightType == 201" class="price">免费</view>
                  <view v-if="coupon.rightType == 211">
                    <text class="price">{{ coupon.amount }}</text
                    >元
                  </view>
                  <view v-if="coupon.rightType != 201"
                    >满{{ coupon.threshold }}可用</view
                  >
                </view>

                <view class="coupon-content">
                  <view class="content-title">
                    {{ coupon.promotionName }}
                  </view>
                  <view class="content-expires">
                    有效期至 {{ coupon.endTime }}
                  </view>
                </view>
              </view>

              <view class="disable-cause">
                不可用原因：{{ coupon.description }}
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="confirm">
        <view class="confirm-btn" @click="confirmCoupon"> 确定 </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isShowCouponPop: {
      type: Boolean,
      default: false,
    },
    ableCouponList: {
      type: Array,
      default: [],
    },
    disableCouponList: {
      type: Array,
      default: [],
    },
    radioValue: {
      type: String,
      default: "",
    },
  },
  watch: {
    radioValue(newValue, oldValue) {
      console.log(
        "couponPop watch:",
        newValue,
        oldValue,
        this.radioCurrentValue
      );
      this.radioCurrentValue = newValue;
    },
  },
  data() {
    return {
      show: false,
      radioCurrentValue: undefined,
      couponTypeMap: {
        211: "满减券",
        216: "折扣券",
        201: "商品券",
        226: "运费券",
        231: "问诊券",
      },
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("update:isShowCouponPop", false);
    },
    confirmCoupon() {
      console.log("changeCouponInfo");
      let data;
      if (this.radioCurrentValue) {
        data = this.ableCouponList.find(
          (item) => item.memberCouponId == this.radioCurrentValue
        );
      } else {
        data = {
          amount: undefined,
          memberCouponId: "",
          rightType: undefined,
        };
      }
      this.$emit("changeCouponInfo", data);
      this.handleClose();
    },
    changeRadioCurrentValue(memberCouponId) {
      console.log(memberCouponId);
      if (this.radioCurrentValue == memberCouponId) {
        this.radioCurrentValue = null;
      } else {
        this.radioCurrentValue = memberCouponId;
      }
    },
    //去调末尾的0
    handleNum(num) {
      let str = num.toFixed(2) + "";
      return str.replace(/\.?0+$/, "");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0 29rpx;
}

.title {
  height: 115rpx;
  display: flex;
  align-items: center;
  position: relative;

  .title-text {
    margin: 0 auto;
  }
  .title-close {
    position: absolute;
    top: 29rpx;
    right: 0rpx;

    image {
      width: 50rpx;
      height: 50rpx;
    }
  }
}

.container {
  overflow-y: auto;
  max-height: 60vh;
  mask-image: linear-gradient(
    to top,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 1)
  );
  padding-bottom: 40rpx;

  .scroll-view {
    max-height: 60vh;
    overflow-y: auto;
  }
  .able {
    margin-top: 10rpx;
    margin-bottom: 19rpx;
    font-size: 29rpx;
  }
  .able-list {
    .able-coupon {
      background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/able_coupon.png");
      background-size: 100%;
      height: 154rpx;
      width: 692rpx;
      margin: 0 auto;
      position: relative;
      display: flex;
      margin-bottom: 19rpx;

      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: #fe2442;

      .coupon-type {
        width: 87rpx;
        height: 31rpx;
        background: #fe2442;
        border-radius: 15rpx 0rpx 15rpx 0rpx;
        position: absolute;
        left: 0;
        top: 0;

        font-size: 21rpx;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .coupon-price {
        width: 191rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .price {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 54rpx;
          color: #fe2442;
        }
      }
      .coupon-content {
        padding-left: 41rpx;
        padding-right: 41rpx;
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex: 1;

        .content-title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 29rpx;
          line-height: 40rpx;
        }
      }
      .radio {
        display: flex;
        justify-content: center;
        align-content: center;
        margin-left: auto;
        padding-right: 17rpx;
      }
    }

    .disable-coupon {
      background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/feeder/disable_coupon.png");
      height: 212rpx;
      width: 691rpx;
      display: block;

      color: #666666;

      .disable-top {
        height: 154rpx;
        display: flex;

        .coupon-type {
          background: #666666;
        }
        .coupon-price .price {
          color: #666666;
        }
      }

      .disable-cause {
        padding-left: 37rpx;
        display: flex;
        align-items: center;
        color: #999999;
        height: 57rpx;
      }
    }
  }
}

.confirm {
  padding: 31rpx 0;

  .confirm-btn {
    width: 673rpx;
    height: 85rpx;
    background: #fe2442;
    border-radius: 42rpx;
    margin: 0 auto;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 31rpx;
    color: #ffffff;
    line-height: 42rpx;
  }
}
</style>
