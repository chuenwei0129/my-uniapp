<template>
  <view>
    <view
      :class="[
        'coupon-wrapper',
        status == 'EXPIRED'
          ? 'fold-expired'
          : isFold
          ? `fold-${couponDetail.subType}`
          : `unfold-${couponDetail.subType}`,
      ]"
    >
      <view class="time-zone">{{
        status == "RECEIVED" ? couponDetail.expireTime + "过期" : ""
      }}</view>
      <view
        class="coupon-content"
        :style="{
          paddingTop: status == 'RECEIVED' ? '26rpx' : '0rpx',
        }"
      >
        <!-- <view :class="[handleTagMatch(couponDetail.subType, status), 'tag']">
        </view> -->
        <view
          :class="[
            'crown',
            status !== 'EXPIRED'
              ? `crown-${couponDetail.subType}`
              : 'crown-EXPIRED',
          ]"
        ></view>
        <view class="mid">
          <view
            :class="['title', handleTitleMatch(couponDetail.subType, status)]"
          ></view>
          <view
            class="desc"
            :style="{
              marginTop: '23rpx',
            }"
          >
            <view class="left">{{
              `全类型问诊权益${couponDetail.totalUses}次 剩余${
                couponDetail.totalUses - couponDetail.usedCount
              }次`
            }}</view>
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
      <view class="rule" v-if="!isFold"> {{ couponDetail.desc }} </view>
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
    handleTagMatch(subType, status) {
      if (status !== "EXPIRED") {
        switch (subType) {
          case "INQUIRY":
            return "tag-normal";
          case "EXPERT_INQUIRY":
            return "tag-expert";
          case "NUTRITION_INQUIRY":
            return "tag-nutri";
        }
      } else {
        switch (subType) {
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
    handleTitleMatch(subType, status) {
      if (status !== "EXPIRED") {
        switch (subType) {
          case "MONTHLY":
            return "title-MONTHLY";
          case "QUARTER":
            return "title-QUARTER";
          case "SEMI_ANNUAL":
            return "title-SEMI_ANNUAL";
        }
      } else {
        switch (subType) {
          case "MONTHLY":
            return "title-MONTHLY-EXPIRED";
          case "QUARTER":
            return "title-QUARTER-EXPIRED";
          case "SEMI_ANNUAL":
            return "title-SEMI_ANNUAL-EXPIRED";
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
  // padding-left: 42rpx;
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
  .coupon-content {
    display: flex;
    padding-top: 26rpx;
    width: 100%;
    position: relative;
    // filter: grayscale(100%);
    padding-left: 42rpx;
    .crown {
      position: absolute;
      height: 185rpx;
      width: 185rpx;
      top: -31rpx;
      // left: -42rpx;
      left: 0;
    }
    .crown-SEMI_ANNUAL {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/crown-halfyear.png"
      );
    }
    .crown-MONTHLY {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/crown-month.png"
      );
    }
    .crown-QUARTER {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/crown-season.png"
      );
    }
    .crown-EXPIRED {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/crown-expired.png"
      );
    }
    .mid {
      padding-left: 129rpx;
      .title {
        // @include textfclaw(42rpx, #000);
        // text-align: left;
        // font-weight: bold;
        height: 35rpx;
      }
      .title-SEMI_ANNUAL {
        width: 294rpx;

        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/title-halfyear.png"
        );
      }
      .title-MONTHLY {
        width: 252rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/title-month.png"
        );
      }
      .title-QUARTER {
        width: 252rpx;

        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/title-season.png"
        );
      }
      .title-SEMI_ANNUAL-EXPIRED {
        width: 294rpx;

        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/title-halfyear-expired.png"
        );
      }
      .title-MONTHLY-EXPIRED {
        width: 252rpx;

        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/title-month-expired.png"
        );
      }
      .title-QUARTER-EXPIRED {
        width: 252rpx;

        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/title-season-expired.png"
        );
      }
      .desc {
        // display: flex;
        // align-items: center;

        .left {
          font-size: 23rpx;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.6);
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
.fold-expired {
  height: 185rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/fold-expired.png"
  );
}
.fold-SEMI_ANNUAL {
  height: 185rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/halfyear-bg-fold.png"
  );
}
.fold-MONTHLY {
  height: 185rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/month-bg-fold.png"
  );
}
.fold-QUARTER {
  height: 185rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/season-bg-fold.png"
  );
}
.unfold-SEMI_ANNUAL {
  height: 329rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/halfyear-bg-unfold.png"
  );
}
.unfold-MONTHLY {
  height: 329rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/month-bg-unfold.png"
  );
}
.unfold-QUARTER {
  height: 329rpx;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/mayactivity/prizelist/season-bg-unfold.png"
  );
}
.rule {
  margin-top: 63rpx;
  @include textfclaw(21rpx, #4a4a4a);
  text-align: left;
  font-weight: 400;
  line-height: 31rpx;
  padding-left: 27rpx;
}
</style>
