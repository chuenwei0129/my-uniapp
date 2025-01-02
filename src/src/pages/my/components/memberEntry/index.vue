<template>
  <view>
    <!-- 可以进入会员主页 -->
    <template v-if="levelInfo.switchStatus === 0">
      <view
        :class="['member-entry', `level${levelInfo.levelIndex}_entry`]"
        @click="toMyMember"
      >
        <u-notice-bar
          class="noticeBar"
          :text="sliceStr"
          direction="column"
          :duration="5000"
          :icon="false"
          :fontSize="29"
          :color="levelColor[levelInfo.levelIndex]"
        ></u-notice-bar>
        <image
          v-if="levelInfo.isMemberLevelLock"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/level_up.png"
          mode="scaleToFill"
          @click.stop="toUpgrade"
        />
      </view>
    </template>
    <!-- 不可进入会员主页 -->
    <template v-else-if="[1, 2].includes(levelInfo.switchStatus)">
      <view class="member-entry level0_entry">
        <u-notice-bar
          class="noticeBar"
          :text="noMemberStr"
          direction="column"
          :duration="5000"
          :icon="false"
          color="#FEECC3"
        ></u-notice-bar>
        <image
          v-if="levelInfo.isMemberLevelLock"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/level_up.png"
          mode="scaleToFill"
          @click.stop="toUpgrade"
        />
      </view>
    </template>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  props: {
    levelInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      noMemberStr: ["会员体系升级中，敬请期待~"],
      strlist: [
        "任意消费即可开启权益",
        "月月领券，最高可领69元",
        "领宠胖胖限定生日礼包",
      ],
      levelColor: ["#fff", "#43698F", "#70361F", "#342068", "#C5C6FF"],
    };
  },
  computed: {
    sliceStr() {
      const str = this.levelInfo?.benefitDescription;
      if (str && str.length > 11) {
        const string = str.slice(0, 11) + "...";
        return [string];
      } else {
        return [str];
      }
    },
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  methods: {
    toUpgrade() {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "me_unlock_upgrade",
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: this.levelInfo.levelIndex,
        },
      });
      if (this.isNative) {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/user/info?isFromMemberCenter=1`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=1`,
        });
      }
    },
    toMyMember() {
      const userInfo = uni.getStorageSync("storage_info");
      const info = uni.getStorageSync("currentLevelInfo");
      const query = {
        ...info,
        levelConfigId: this.levelInfo.levelConfigId,
      };
      uni.setStorageSync("currentLevelInfo", query);
      action_report({
        action_name: "me_member_click",
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: this.levelInfo.levelIndex,
        },
      });
      uni.navigateTo({
        url: `/pagesE/memberCenter/index?levelConfigId=${this.levelInfo.levelConfigId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
@import "@/utils/membertheme.scss";
.member-entry {
  width: 692rpx;
  height: 115rpx;
  margin: -0rpx 28rpx 0rpx 30rpx;
  position: relative;
  image {
    width: 80rpx;
    height: 30rpx;
    position: absolute;
    right: 23rpx;
    top: 12rpx;
  }
  &.level0_entry {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/noMemberBg.png"
    );
  }
  &.level1_entry {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberbg_1.png"
    );
  }
  &.level2_entry {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberbg_2.png"
    );
  }
  &.level3_entry {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberbg_3.png"
    );
  }
  &.level4_entry {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberbg_4.png"
    );
  }
}

::v-deep .u-notice-bar {
  background-color: #252525 !important;
  color: #ffffff;
  height: 100%;
}

::v-deep .u-notice__left-icon {
  display: none !important;
}

::v-deep .u-notice__swiper__item__text {
  font-size: 29rpx !important;
}

::v-deep .u-notice__swiper {
  margin-top: 25rpx !important;
  margin-left: 176rpx;
  height: 38rpx !important;
}
</style>
