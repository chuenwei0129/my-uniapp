<template>
  <view class="benefitList">
    <view class="benefitItem">
      <view
        class="carditem couponcard"
        v-for="(carditem, index) in showCouponList"
        :key="index"
      >
        <view class="leftwrap">
          <view
            style="display: flex; flex-direction: column; align-items: center"
          >
            <view
              :class="[
                'couponface',
                isCouponNumber(carditem.couponFaceValue) ? '' : 'free',
              ]"
              >{{ getNumber(carditem.couponFaceValue)
              }}<view
                class="unit"
                v-if="isCouponNumber(carditem.couponFaceValue)"
                >{{ carditem.couponRightType == "216" ? "折" : "元" }}</view
              >
            </view>
            <view class="threshold" v-if="carditem.couponRuleDesc">{{
              carditem.couponRuleDesc
            }}</view>
          </view>
        </view>
        <view class="centerwrap">
          <view>
            <view class="couponname">{{ carditem.couponName }}</view>
            <view class="validate">{{ carditem.couponValidityDesc }}</view>
          </view>
        </view>
        <view
          v-if="carditem.status == 2"
          class="rightbtn"
          @click="
            () => {
              toMall(carditem);
            }
          "
        >
          去使用
        </view>
        <view
          v-else-if="carditem.status == 1"
          class="rightbtn"
          @click="
            () => {
              receiveCoupon(carditem.benefitId, carditem);
            }
          "
        >
          立即领取
        </view>
        <view v-else-if="carditem.status == 0" class="rightbtn btn-locked">
          <view class="icon"></view>
          未解锁
        </view>
      </view>
      <view
        class="more"
        @click="handleMore"
        v-if="more && couponList.length > 4"
      >
        <view>展开{{ couponList.length - 4 }}张券</view>
        <view class="iconfont icon-outlineArrowDown"></view>
      </view>
    </view>
  </view>
</template>
<script>
import { RECEIVE_COUPON } from "@/api/member";
export default {
  props: {
    couponList: {
      type: Array,
      default() {
        return [];
      },
    },
    levelConfigId: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      more: true,
      receiveflag: false,
    };
  },
  computed: {
    showCouponList() {
      if (this.more) {
        return this.couponList.slice(0, 4);
      } else {
        return this.couponList;
      }
    },
  },
  methods: {
    getNumber(str) {
      return (str | 0) == str ? Math.floor(str) : str;
    },
    toMall(couponDetail) {
      uni.navigateTo({
        url: `/pagesC/availableGoods/index?promotionId=${couponDetail.promotionId}`,
      });
    },
    handleMore() {
      this.more = false;
    },
    isCouponNumber(val) {
      return isNaN(val - 0) ? false : true;
    },
    receiveCoupon(id, item) {
      if (this.receiveflag) return;
      this.receiveflag = true;
      const _params = {
        levelConfigId: item.levelConfigId,
        benefitId: this.levelConfigId,
        refId: item.couponId,
      };
      console.log(_params, 3333);
      try {
        RECEIVE_COUPON(_params).then((res) => {
          if (res) {
            uni.showToast({
              title: "领取成功",
              icon: "none",
            });
            setTimeout(() => {
              this.receiveflag = false;
            }, 300);
            //更新列表 emit
            // this.getBenefitDetail();
            this.$emit("refresh");
          }
        });
      } catch (e) {
        this.receiveflag = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.benefitList {
  width: 100%;
  border-radius: 31rpx;
  transition: all 0.5s;
  .benefitItem {
    width: 693rpx;
    background: #ffffff;
    border-radius: 31rpx;

    .carditem {
      margin-bottom: 20rpx;
      height: 153rpx;
    }
    .item-top {
      display: flex;
      align-items: center;
      margin-bottom: 45rpx;
      .benefitnme {
        @include textfclaw(35rpx, #333333, $align: left, $lineH: 48rpx);
        font-weight: bold;
      }
      .couponcount {
        margin-left: auto;
        @include flex();
        @include textfclaw(27rpx, #666666, $align: left, $lineH: 38rpx);
      }
    }
    .carditem {
      display: flex;
      align-items: center;
      &.couponcard {
        width: 693rpx;
        height: 154rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/member/couponbg.png"
        );
        .leftwrap {
          width: 192rpx;
          height: 154rpx;
          text-align: center;
          @include flex();
          .couponface {
            @include textfclaw(54rpx, #ff5b05, $align: center, $lineH: 54rpx);
            font-weight: bold;
            display: flex;
            align-items: baseline;
            &.free {
              font-size: 38rpx;
            }

            .unit {
              font-size: 24rpx;
              font-weight: normal;
              margin-left: 4rpx;
            }
          }
          .threshold {
            @include textfclaw(25rpx, #ff5b05, $align: center, $lineH: 35rpx);
          }
        }
        .centerwrap {
          margin-left: 37rpx;
          display: flex;
          align-items: center;
          .couponname {
            @include ellipsis(260rpx);
            @include textfclaw(29rpx, #ff5b05, $align: left, $lineH: 60rpx);
            font-weight: bold;
            margin-bottom: 6rpx;
          }
          .validate {
            @include textfclaw(25rpx, #ff5b05, $align: left, $lineH: 35rpx);
          }
        }
        .rightbtn {
          width: 142rpx;
          height: 54rpx;
          background: #ff5b05;
          border-radius: 27rpx;
          @include flex();
          @include textfclaw(25rpx, #ffffff, $align: center, $lineH: 35rpx);
          font-weight: bold;
          margin-right: 31rpx;
          margin-left: auto;
        }
      }
    }
    .normalpic,
    .giftpic {
      width: 693rpx;
      height: 100%;
    }
  }
}
.more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 23rpx;
  font-size: 27rpx;
  color: #666666;
}
.btn-locked {
  width: 142rpx;
  height: 54rpx;
  background: #999999 !important;
  border-radius: 27rpx;
  color: #ffffff !important;
  font-size: 25rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    width: 23rpx;
    height: 25rpx;
    margin-right: 7rpx;
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/member/locked.png")
      no-repeat center center/100%;
  }
}
</style>
