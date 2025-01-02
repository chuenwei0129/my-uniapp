<template>
  <view class="coupon-list">
    <template
      v-if="homeInfo.newPersonRefList && homeInfo.newPersonRefList.length"
    >
      <view class="oneline-list">
        <view
          class="closettime"
          v-if="homeInfo.couponExpiredTime > homeInfo.currentTime"
        >
          距失效
          <CountDown
            :expiredtime="homeInfo.couponExpiredTime"
            :currenttime="homeInfo.currentTime"
            @refresh="refresh"
          ></CountDown>
        </view>
        <view class="couponwrap">
          <view
            class="coupon-item"
            v-for="(item, index) in newData"
            :key="index.promotionId"
          >
            <view class="couponface">
              <view class="unit">¥</view>
              <view class="facevalue">{{ item.couponFaceValue }}</view>
              <view class="count" v-if="item.qty > 1">x{{ item.qty }}</view>
            </view>
            <view class="couponrule" v-if="item.couponRuleDesc">{{
              item.couponRuleDesc
            }}</view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="vertical-list">
        <view class="list-shadow"></view>
        <view class="title-image">{{ homeInfo.couponPackActivityName }}</view>
        <view
          :class="['coupon-item', `coupon-item${1 + index}`]"
          v-for="(item, index) in newData"
          :key="index.promotionId"
        >
          <view class="couponface">
            <view class="unit">¥</view>
            <view class="facevalue">{{ item.couponFaceValue }}</view>
            <view class="count" v-if="item.qty > 1">x{{ item.qty }}</view>
          </view>
          <view>
            <view class="couponrule" v-if="item.couponRuleDesc">{{
              item.couponRuleDesc
            }}</view>
            <view
              class="coupontime"
              v-if="item.expiredTime > homeInfo.currentTime"
            >
              距失效:
              <CountDown
                :expiredtime="item.expiredTime"
                :currenttime="homeInfo.currentTime"
                @refresh="refresh"
              ></CountDown>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>
<script>
import CountDown from "./time.vue";
export default {
  components: {
    CountDown,
  },
  props: {
    homeInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      newData: [],
    };
  },
  methods: {
    refresh() {
      this.$emit("refreshhome");
    },
  },
  mounted() {
    this.newData = this.homeInfo?.couponPackList || [];
    console.log("🚀 ~ mounted ~ this.newData:", this.homeInfo);
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";

.coupon-list {
  .oneline-list {
    width: 723rpx;
    height: 306rpx;
    margin: 0 auto 19rpx;
    position: relative;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/couponbg.png"
    );

    .closettime {
      @include absNormal(auto, auto, 31rpx, $right: 29rpx);
      @include textfclaw(23rpx, #666666, $align: left, $lineH: 33rpx);
      display: flex;
    }

    .couponwrap {
      display: flex;
      flex-wrap: nowrap;
      padding-top: 106rpx;

      .coupon-item {
        flex-shrink: 0;
        width: 212rpx;
        height: 167rpx;
        margin-right: 15rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/itembgV2.png"
        );

        &:first-child {
          margin-left: 29rpx;
        }

        .couponface {
          display: flex;
          justify-content: center;
          margin-top: 12rpx;
          align-items: baseline;
          color: #ff1e2f;
          font-size: 77rpx;
          font-weight: bold;

          .unit {
            font-size: 38rpx;
          }

          .count {
            margin-left: 4rpx;
            font-size: 27rpx;
          }
        }

        .couponrule {
          @include textfclaw(27rpx, #ffffff, $align: center, $lineH: 38rpx);
        }
      }
    }
  }

  .vertical-list {
    width: 723rpx;
    margin: 0 auto 19rpx;
    background: #ffffff;
    border-radius: 27rpx;
    position: relative;
    padding-bottom: 38rpx;

    .list-shadow {
      width: 723rpx;
      height: 115rpx;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/titleshadow.png"
      );
    }

    .title-image {
      padding-top: 15rpx;
      @include textfclaw(38rpx, #ffffff, $align: center, $lineH: 54rpx);
      font-weight: bold;
      @include absNormal(446rpx, 83rpx, -13rpx, $left: 135rpx);
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/titleimage.png"
      );
    }

    .coupon-item {
      width: 685rpx;
      height: 146rpx;
      margin: 0 auto 19rpx;
      display: flex;
      align-items: center;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/miniapp-newuser/longbgV2.png"
      );

      .couponface {
        display: flex;
        width: 240rpx;
        justify-content: center;
        align-items: baseline;
        color: #ff1e2f;
        font-weight: bold;

        .unit {
          font-size: 38rpx;
          margin-right: 2rpx;
        }

        .facevalue {
          font-size: 90rpx;
        }

        .count {
          margin-left: 4rpx;
          font-size: 31rpx;
        }
      }

      .couponrule {
        margin-left: 30rpx;
        @include textfclaw(31rpx, #ffffff, $align: left, $lineH: 42rpx);
        margin-bottom: 19rpx;
      }

      .coupontime {
        display: flex;
        font-size: 23rpx;
        color: #ffffff;
        margin-left: 30rpx;

        .timespan {
          width: 35rpx;
          height: 35rpx;
          background: #ffffff;
          border-radius: 8rpx;
          margin: 0 6rpx;
          @include flex();
          font-weight: bold;
          @include textfclaw(23rpx, #f43c01, $align: center, $lineH: 35rpx);
        }
      }
    }

    .coupon-item1 {
      margin-top: -19rpx;
    }
  }
}
</style>
