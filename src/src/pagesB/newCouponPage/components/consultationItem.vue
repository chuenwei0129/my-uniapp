<template>
  <view>
    <view :class="['coupon-wrapper', isFold ? 'fold' : 'unfold']">
      <view class="time-zone">{{
        status == "RECEIVED" ? couponDetail.expireTime + "过期" : ""
      }}</view>
      <view
        class="coupon-content"
        :style="{
          paddingTop: status == 'RECEIVED' ? '10rpx' : '0rpx',
        }"
      >
        <view
          :class="[handleTagMatch(couponDetail.useCouponType, status), 'tag']"
        >
        </view>
        <view class="mid">
          <view
            class="title"
            :style="{
              color: status !== 'EXPIRED' ? '#000' : '#999',
            }"
            >{{ couponDetail.couponTitle }}</view
          >
          <view
            class="desc"
            :style="{
              marginTop: status == 'RECEIVED' ? '13rpx' : '4rpx',
            }"
          >
            <view
              class="left"
              :style="{
                color: handleColorMatch(couponDetail.useCouponType, status),
              }"
              >{{
                couponDetail.useCouponType == "INQUIRY"
                  ? "可享全类型的问诊权益1次"
                  : couponDetail.useCouponType == "EXPERT_INQUIRY"
                  ? "可享免费专家问诊1次"
                  : "可享免费营养咨询1次"
              }}</view
            >
            <view class="expire-time" v-if="status !== 'RECEIVED'">{{
              status == "USED"
                ? "有效期至：" + couponDetail.expireTime
                : couponDetail.expireTime + "过期"
            }}</view>
          </view>
        </view>
        <view
          class="right"
          @click="isFold = !isFold"
          v-if="status == 'RECEIVED'"
        >
          <view>使用规则</view>
          <view
            :class="[
              'iconfont',
              isFold ? 'icon-outlineArrowDown' : 'icon-outlineArrowUp',
            ]"
          ></view>
        </view>
        <view
          :class="[`use-state-${status}`, 'use-state']"
          v-if="status !== 'RECEIVED'"
        ></view>
      </view>
      <view class="rule" v-if="!isFold"> {{ couponDetail.couponDesc }} </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    isPageShow: {
      type: Boolean,
      default: false,
    },
    type: { type: String, default: "normal" },
    couponDetail: {
      type: Object,
    },
    status: {
      type: String,
    },
  },
  data() {
    return {
      isFold: true,
    };
  },
  computed: {},
  watch: {},
  created() {},

  mounted() {},
  methods: {
    handleTagMatch(useCouponType, status) {
      if (status !== "EXPIRED") {
        switch (useCouponType) {
          case "INQUIRY":
            return "tag-normal";
          case "EXPERT_INQUIRY":
            return "tag-expert";
          case "NUTRITION_INQUIRY":
            return "tag-nutri";
        }
      } else {
        switch (useCouponType) {
          case "INQUIRY":
            return "tag-normal-expired";
          case "EXPERT_INQUIRY":
            return "tag-expert-expired";
          case "NUTRITION_INQUIRY":
            return "tag-nutri-expired";
        }
      }
    },
    handleColorMatch(useCouponType, status) {
      if (status !== "EXPIRED") {
        switch (useCouponType) {
          case "INQUIRY":
            return "#00816E";
          case "EXPERT_INQUIRY":
            return "#543B00";
          case "NUTRITION_INQUIRY":
            return "#7C0033";
        }
      } else {
        switch (useCouponType) {
          case "INQUIRY":
            return "#999";
          case "EXPERT_INQUIRY":
            return "#999";
          case "NUTRITION_INQUIRY":
            return "#999";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";

.coupon-wrapper {
  width: 673rpx;

  margin-bottom: 19rpx;
  padding-left: 42rpx;
  padding-right: 31rpx;
  .time-zone {
    @include textfclaw(21rpx, #999);
    height: 31rpx;
    font-weight: 400;
    // float: right;
    text-align: right;
    padding-top: 19rpx;
  }
  .tag {
    height: 88rpx;
    width: 88rpx;
    // padding-top: 38rpx;
  }
  .tag-normal {
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/tag-normal.png")
      no-repeat top left/100% 100%;
  }
  .tag-expert {
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/expert-tag.png")
      no-repeat top left/100% 100%;
  }
  .tag-nutri {
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/nutri-tag.png")
      no-repeat top left/100% 100%;
  }
  .tag-normal-expired {
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/tag-normal-expired.png")
      no-repeat top left/100% 100%;
  }
  .tag-expert-expired {
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/tag-expert-expired.png")
      no-repeat top left/100% 100%;
  }
  .tag-nutri-expired {
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/tag-nutri-expired.png")
      no-repeat top left/100% 100%;
  }
  .coupon-content {
    display: flex;
    // padding-top: 10rpx;
    width: 100%;
    position: relative;
    // filter: grayscale(100%);
    .mid {
      padding-left: 31rpx;
      .title {
        @include textfclaw(42rpx, #000);
        text-align: left;
        font-weight: bold;
      }
      .desc {
        // display: flex;
        // align-items: center;

        .left {
          font-size: 23rpx;
          font-weight: 400;
        }
        .expire-time {
          font-size: 21rpx;
          color: #999;
          font-weight: 400;
          margin-top: 4rpx;
        }
      }
    }
    .right {
      font-size: 21rpx;
      font-weight: 400;
      color: #4a4a4a;
      position: absolute;
      right: 0;
      bottom: 6rpx;
      display: flex;
      align-items: center;
      .iconfont {
        margin-left: 12rpx;
        font-size: 21rpx;
      }
    }
    .use-state {
      height: 129rpx;
      width: 142rpx;

      position: absolute;
      right: 0;
      bottom: 0;
      &-USED {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/used-tag.png"
        );
      }
      &-EXPIRED {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/expired-tag.png"
        );
      }
    }
  }
}
.fold {
  height: 185rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon-short.png"
  );
}
.unfold {
  height: 300rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon-long.png"
  );
}
.rule {
  margin-top: 65rpx;
  @include textfclaw(21rpx, #4a4a4a);
  text-align: left;
  font-weight: 400;
  line-height: 31rpx;
}
</style>
