<script>
import { postCouponSwitch } from "@/api/cart";
import { getWidth, rpxToPx } from "@/utils";
export default {
  name: "couponSelectPopView",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    couponList: {
      type: Array,
      default: [],
    },
    memberCouponId: {
      type: String,
      default: "",
    },
    cartType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectId: this.memberCouponId,
      couponFoldStatusList: [],
    };
  },
  watch: {
    memberCouponId: {
      immediate: true,
      handler: function (v) {
        this.selectId = this.memberCouponId;
      },
    },
    couponList(newVal, oldVal) {
      this.couponFoldStatusList = (newVal ?? []).map((e) => {
        let text = "";
        if (e.isAvailable) {
          text = e.description;
        } else {
          text = `不可用优惠券说明：${e.description}`;
        }
        const w = getWidth(text, "11px sans-serif");
        const contentW =
          getApp().globalData.windowWidth - rpxToPx(28) * 2 - rpxToPx(38) * 2;
        const isShowFold = w > contentW;
        return {
          memberCouponId: e.memberCouponId,
          isFold: true,
          isShowFold,
        };
      });
    },
  },
  computed: {
    availableList() {
      return this.couponList.filter((item) => item.isAvailable);
    },
    unAvailableList() {
      return this.couponList.filter((item) => !item.isAvailable);
    },
    isShowFold() {
      return (item) => {
        return (
          this.couponFoldStatusList.find(
            (e) => e.memberCouponId === item.memberCouponId
          )?.isShowFold ?? false
        );
      };
    },
    isFold() {
      return (item) => {
        return (
          this.couponFoldStatusList.find(
            (e) => e.memberCouponId === item.memberCouponId
          )?.isFold ?? false
        );
      };
    },
    isShowDescription() {
      return (item) => {
        return (item.description || "").length > 0;
      };
    },
  },
  mounted() {},
  emits: ["onClose", "onRefresh"],
  methods: {
    stopPrevent() {
      return;
    },
    close() {
      this.$emit("onClose");
    },
    onCheckChange(e) {
      console.log('onCheckChange',e);
      this.selectId = e.length > 0 ? e[0] : "";
    },
    onCheckClick(item){
      console.log('click',item);
      if (this.selectId === item.memberCouponId) {
        // 如果点击的是当前选中的 item，则取消选中
        this.selectId = '';
      } else {
        // 否则选中点击的 item
        this.selectId = item.memberCouponId;
      }
    },
    async handleChangeSubmit() {
      if (this.availableList.length > 0) {
        const res = await postCouponSwitch({
          cartType: this.cartType == 1 ? 1 : 2,
          platformCouponId: this.selectId,
        });
        this.$emit("onRefresh", this.selectId);
      } else {
        this.$emit("onClose");
      }
    },
    //去调末尾的0
    handleNum(num) {
      let str = num.toFixed(2) + "";
      return str.replace(/\.?0+$/, "");
    },
    handleCouponDescClick(item) {
      const foldStatus = this.couponFoldStatusList.find(
        (e) => e.memberCouponId === item.memberCouponId
      );
      if (foldStatus) {
        foldStatus.isFold = !foldStatus.isFold;
      }
    },
  },
};
</script>

<template>
  <view class="popup-wrapper" @touchmove.stop.prevent="stopPrevent">
    <u-popup
      :show="show"
      @close="close"
      mode="bottom"
      :overlay="true"
      :closeOnClickOverlay="true"
      round="38rpx"
      :safeAreaInsetBottom="false"
      @touchmove.stop.prevent
    >
      <view>
        <view class="popup-content-wrapper">
          <view class="top">
            <view class="title"> 优惠券 </view>
            <view class="right">
              <image
                mode="aspectFit"
                :style="{ width: '50rpx', height: '50rpx' }"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
                @click="close"
              />
            </view>
          </view>
          <view class="content-wrapper" v-if="availableList.length > 0">
           <scroll-view  :scroll-y="true" class="scroll-Y">
            <view style="height: 100%">
              <view class="title" v-if="availableList.length > 0">
                可用优惠券({{ availableList.length }})
              </view>
              <view
                class="item-wrapper"
                v-for="item in availableList"
                :key="item.memberCouponId"
              >
                <view
                  class="item"
                  :style="{
                    marginBottom: isShowDescription(item) ? '0rpx' : '20rpx',
                  }"
                  @click="onCheckClick(item)"
                >
                  <view class="left">
                    <view v-if="item.rightType == 216" class="price"
                      >{{ handleNum(item.discount * 10)
                      }}<span class="yuan">折</span></view
                    >
                    <view v-if="item.rightType == 201" class="price-text"
                      >免费</view
                    >
                    <view v-if="item.rightType == 211" class="price"
                      >{{ item.amount }}<span class="yuan">元</span>
                    </view>
                    <view class="time" v-if="item.rightType != 201"
                      >满{{ item.threshold }}可用</view
                    >
                  </view>
                  <view class="right">
                    <view class="info">
                      <view class="name">{{ item.promotionName }}</view>
                      <view class="time">有效期至{{ item.endTime }}</view>
                    </view>
                    <u-checkbox-group  @change="onCheckChange">
                      <u-checkbox
                        :name="item.memberCouponId"
                        :checked="selectId == item.memberCouponId"
                        shape="circle"
                        activeColor="#FE2442"
                      ></u-checkbox>
                    </u-checkbox-group>
                  </view>
                </view>
                <view
                  v-if="isShowDescription(item)"
                  class="coupon-desc"
                  @click="handleCouponDescClick(item)"
                >
                  <view class="coupon-desc-content-wrapper">
                    <view
                      class="coupon-desc-content"
                      :style="{
                        whiteSpace: isFold(item) ? 'nowrap' : 'normal',
                      }"
                    >
                      {{ item.description }}
                    </view>
                    <image
                      v-if="isShowFold(item)"
                      :src="
                        isFold(item)
                          ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_arrow_down.png'
                          : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_arrow_up.png'
                      "
                      mode="scaleToFill"
                    />
                  </view>
                </view>
              </view>

              <view class="title" v-if="unAvailableList.length > 0">
                不可用优惠券({{ unAvailableList.length }})
              </view>
              <view
                class="item-wrapper"
                v-for="item in unAvailableList"
                :key="item.memberCouponId"
              >
                <view class="item-no">
                  <view class="left">
                    <view v-if="item.rightType == 216" class="price"
                      >{{ handleNum(item.discount * 10)
                      }}<span class="yuan">折</span></view
                    >
                    <view v-if="item.rightType == 201" class="price-text"
                      >免费</view
                    >
                    <view v-if="item.rightType == 211" class="price"
                      >{{ item.amount }}<span class="yuan">元</span>
                    </view>
                    <view class="time" v-if="item.rightType != 201"
                      >满{{ item.threshold }}可用</view
                    >
                  </view>
                  <view class="right">
                    <view class="info">
                      <view class="name">{{ item.promotionName }}</view>
                      <view class="time">有效期至{{ item.endTime }}</view>
                    </view>
                  </view>
                </view>
                <view
                  class="coupon-desc-disable"
                  @click="handleCouponDescClick(item)"
                >
                  不可用原因：该笔订单不符合优惠条件
                  <view class="coupon-desc-content-wrapper">
                    <view
                      v-if="isShowDescription(item)"
                      class="coupon-desc-content"
                      :style="{
                        whiteSpace: isFold(item) ? 'nowrap' : 'normal',
                      }"
                    >
                      不可用优惠券说明：{{ item.description }}
                    </view>
                    <image
                      v-if="isShowFold(item)"
                      :src="
                        isFold(item)
                          ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_arrow_down.png'
                          : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_detail_pop_arrow_up.png'
                      "
                      mode="scaleToFill"
                    />
                  </view>
                </view>
              </view>
            </view>
           </scroll-view>
          </view>
          <view class="no-date" v-else>
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/none_outher3.png"
            ></image>
            <view>暂无可用优惠券</view>
          </view>
          <view style="margin: 38rpx 28rpx 55rpx 28rpx">
            <u-button
              type="primary"
              customStyle="background-color: #FE2442;border-radius: 42rpx;border:none"
              @click="handleChangeSubmit"
              >确定</u-button
            >
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style scoped lang="scss">
.popup-wrapper {
  .popup-content-wrapper {
    background: #ffffff;
    border-radius: 38rpx 38rpx 0 0;
    .top {
      padding: 25rpx 25rpx 0 25rpx;
      text-align: center;
      .title {
        font-size: 35rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #000000;
      }
      .right {
        position: absolute;
        top: 26rpx;
        right: 26rpx;
      }
    }

    .content-wrapper {
      margin: 0 28rpx 30rpx 28rpx;
      max-height: 880rpx;
      // overflow-y: auto;
      .scroll-Y{
        width: 100%;
        max-height: 880rpx;
      }
      .title {
        font-size: 29rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #1f1f1f;
        margin-top: 38rpx;
        margin-bottom: 20rpx;
      }
      .item-wrapper {
        display: flex;
        flex-direction: column;
      }
      .item {
        width: 100%;
        height: 154rpx;
        background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_item_bg.png");
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        z-index: 1;
        .left {
          width: 28%;
          text-align: center;
          .price {
            font-size: 54rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #fe2442;
            line-height: 50rpx;
            height: 50rpx;
          }
          .price-text {
            font-size: 38rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #fe2442;
            line-height: 50rpx;
            height: 50rpx;
          }
          .yuan {
            font-size: 23rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #fe2442;
          }
        }
        .right {
          width: 72%;
          padding: 0 18rpx;
          display: flex;
          justify-content: space-between;
          .info {
            width: 80%;

            .name {
              font-size: 29rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #fe2442;
              line-height: 50rpx;
              height: 50rpx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .time {
          margin-top: 5rpx;
          font-size: 25rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #fe2442;
          line-height: 35rpx;
        }
      }
      .item-no {
        width: 100%;
        height: 154rpx;
        display: flex;
        align-items: center;
        background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/coupon_item_bg_no.png");
        background-size: 100% 100%;
        z-index: 1;
        .left {
          width: 28%;
          text-align: center;
          .price {
            font-size: 54rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #666666;
            line-height: 50rpx;
            height: 50rpx;
          }
          .price-text {
            font-size: 38rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #666666;
            line-height: 50rpx;
            height: 50rpx;
          }
          .yuan {
            font-size: 23rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #666666;
          }
        }
        .right {
          width: 72%;
          padding: 0 18rpx;
          display: flex;
          justify-content: space-between;
          .info {
            width: 80%;
            .name {
              font-size: 29rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #666666;
              line-height: 50rpx;
              height: 50rpx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .time {
          margin-top: 5rpx;
          font-size: 25rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 35rpx;
        }
      }
      .coupon-desc {
        color: #999999;
        font-size: 11px;
        line-height: 31rpx;
        padding: 27rpx 38rpx 12rpx 38rpx;
        border-bottom-left-radius: 15rpx;
        border-bottom-right-radius: 15rpx;
        border: 1rpx solid #ffe3d7;
        position: relative;
        top: -15rpx;
        z-index: 0;
        margin-bottom: 8rpx;
        display: flex;
        flex-direction: column;
      }
      .coupon-desc-disable {
        @extend .coupon-desc;
        border: 1rpx solid #e8e8e8;
      }
      .coupon-desc-content-wrapper {
        display: flex;
      }
      .coupon-desc-content {
        margin-right: 21rpx;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      image {
        width: 25rpx;
        height: 25rpx;
        margin-top: 4rpx;
      }
    }
    .no-date {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 40rpx 0 20rpx 0;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: #666666;
      image {
        width: 346rpx;
        height: 346rpx;
      }
    }
  }
}
</style>
