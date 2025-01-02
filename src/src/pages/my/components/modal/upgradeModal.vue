<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view :class="['upgrade-modal', `LV${levelIndex}`]">
      <view :class="['bg-icon', `LV${levelIndex}_icon`]"></view>
      <view :class="['title', `LV${levelIndex}_title`]"></view>
      <view :class="['title-tip', `LV${levelIndex}_color`]"
        >已成功升级到会员等级{{ levelList[levelIndex - 1] }}</view
      >
      <view :class="['content', levelIndex === 4 ? 'content4' : '']">
        <scroll-view class="scroll-content" scroll-y="true">
          <view
            :class="['content-item', `LV${levelIndex}_color`]"
            v-for="(item, index) in levelChangeDesc"
            :key="index"
          >
            • {{ item }}
          </view>
        </scroll-view>
      </view>
      <view
        :class="[
          'btn',
          levelIndex === 4 ? 'btnStyle4' : `LV${levelIndex}_color`,
        ]"
        @click="$u.debounce(toMember, 500)"
        >立即体验</view
      >
      <view class="close-btn" @click="close"></view>
    </view>
  </u-popup>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  props: {
    levelIndex: {
      type: Number,
      default: 0,
    },
    levelChangeDesc: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Boolean,
      default: false,
    },
    memberLevelId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      levelList: ["V1-小银豚", "V2-小金豚", "V3-小钻豚", "V4-黑金豚"],
    };
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    toMember() {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "updowngrade_pop_button_display",
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: this.levelIndex,
        },
      });
      this.close();
      const id = this.memberLevelId;
      uni.navigateTo({
        url: `/pagesE/memberCenter/index?levelConfigId=${id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
@import "@/utils/membertheme.scss";
.upgrade-modal {
  position: relative;
  width: 577rpx;
  min-height: 690rpx;
  text-align: left;
  border-radius: 38rpx;
  padding: 48rpx 44rpx 38rpx;
  box-sizing: border-box;

  .LV2_color {
    color: #70361f;
  }
  .LV3_color {
    color: #342068;
  }
  .LV4_color {
    color: #c5c6ff;
  }
  .LV2_title {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvTitle_2.png"
    );
  }
  .LV3_title {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvTitle_3.png"
    );
  }
  .LV4_title {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvTitle_4.png"
    );
  }
  .LV2_icon {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvp_2.png"
    );
  }
  .LV3_icon {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvp_3.png"
    );
  }
  .LV4_icon {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvp_4.png"
    );
  }
  .bg-icon {
    width: 250rpx;
    height: 236rpx;
    position: absolute;
    top: -78rpx;
    right: -32rpx;
    z-index: -1;
  }
  .title {
    width: 194rpx;
    height: 46rpx;
  }
  .title-tip {
    font-size: 23rpx;
    line-height: 33rpx;
    // color: #70361F;
    font-family: PingFangSC, PingFang SC;
    margin: 9rpx auto 28rpx;
  }
  .scroll-content {
    height: 358rpx;
  }
  .content {
    margin: 0rpx auto 30rpx;
    width: 488rpx;
    // min-height: 357rpx;
    // height: 358rpx;
    // overflow-y: auto;
    border-radius: 27rpx;
    background-color: rgba(255, 255, 255, 0.39);
    text-align: left;
    padding: 8rpx 38rpx 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    .content-item {
      margin-top: 23rpx;
      font-size: 29rpx;
      font-family: PingFangSC, PingFang SC;
    }
  }
  .content4 {
    background-color: rgba(255, 255, 255, 0.11) !important;
    color: #c5c6ff !important;
  }
  .btn {
    width: 100%;
    height: 85rpx;
    border-radius: 42rpx;
    @include flex();
    margin: 0 auto 18rpx;
    @include textfclaw(31rpx, "", $align: center, $lineH: 42rpx);
    font-weight: bold;
    background-color: #fff;
  }
  .btnStyle4 {
    background-color: #c5c6ff !important;
    color: #342068 !important;
  }
  .close-btn {
    width: 61rpx;
    height: 61rpx;
    position: absolute;
    bottom: -120rpx;
    left: 50%;
    transform: translate(-50%, -50%);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/closeIcon.png"
    );
  }
}
.LV2 {
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvBg_2.png"
  );
}
.LV3 {
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvBg_3.png"
  );
}
.LV4 {
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvBg_4.png"
  );
}
</style>
