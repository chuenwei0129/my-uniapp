<template>
  <view class="my-info">
    <view class="my-info-portrait" @click="handleIcon()">
      <image
        class="img"
        mode="aspectFill"
        :src="
          Info.avatarUrl ||
          'https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/unlogin-V2.png'
        "
      />
    </view>
    <view class="my-info-desc" v-if="token">
      <view class="first-wrapper">
        <view class="nickName">{{ Info.nickName }}</view>
      </view>
      <!-- <view class="ppid">{{ `胖胖号：${Info.showUserId}` }}</view> -->
      <view class="tag-list">
        <view class="tag" v-if="Info.sex || Info.age !== null">
          <image
            class="sex"
            :src="
              Info.sex == 1
                ? 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/home/sex-man.png'
                : 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/home/sex-girl.png'
            "
            v-if="Info.sex"
          />
          <text v-if="Info.age !== null">{{ Info.age || 0 }}岁</text>
        </view>
        <view v-if="Info.city">{{ Info.city || "未知" }}</view>
      </view>
    </view>
    <view class="my-info-member-code" v-if="token" @click="codeJump"></view>
    <view v-else class="unlogin-text" @click="toLogin()">未登录</view>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";

export default {
  name: "user-info",
  props: {
    Info: {
      type: Object,
    },
    token: {
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {
    setRouter(url) {
      uni.navigateTo({
        url,
      });
    },
    handleCouponList() {
      uni.navigateTo({
        url: `/pagesA/couponList/index`,
      });
    },
    codeJump() {
      action_report({
        action_name: "mypage_membercode_click",
      });
      uni.navigateTo({
        url: `/pagesE/memberCodePage/index`,
      });
    },
    handleIcon() {
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) {
        uni.navigateTo({
          url: `/pagesD/login/index`,
        });
        return;
      }

      this.setRouter("/pagesD/editUserInfo/index");
    },
    toLogin() {
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) {
        uni.navigateTo({
          url: `/pagesD/login/index`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";

.img {
  width: 135rpx;
  height: 135rpx;
  border: 6rpx solid #f3f3f4;
}

image {
  display: block;
}

.my-info {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 31rpx;
  // padding-top: 58rpx;
  padding-bottom: 54rpx;
  position: relative;
  margin-top: -24rpx;

  &-portrait {
    width: 135rpx;
    height: 135rpx;
    position: relative;

    .img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .edit_icon {
      width: 35rpx;
      height: 35rpx;
      background-color: #ffffff;
      border-radius: 50%;
      position: absolute;
      bottom: 5rpx;
      right: 5rpx;
      box-sizing: border-box;
      padding: 6rpx;

      image {
        width: 23rpx;
        height: 23rpx;
      }
    }
  }

  &-desc {
    padding-left: 38rpx;

    .first-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 508rpx;
      height: 62rpx;

      margin-top: 26rpx;

      .nickName {
        font-weight: bold;
        font-size: 36rpx;
      }

      .button {
        font-size: 25rpx;
        color: #000;
        height: 62rpx;
        width: 169rpx;
        border-radius: 31rpx;
        border: 2rpx solid #000000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .ppid {
      height: 31rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 21rpx;
      color: #666666;
      line-height: 31rpx;
      text-align: left;
      font-style: normal;
    }

    .tag-list {
      display: flex;
      font-size: 19rpx;
      color: #666666;
      // margin-top: 24rpx;
      line-height: 31rpx;

      view {
        height: 35rpx;
        background-color: #ffffff80;
        color: #666666;
        //opacity: 0.5;
        display: flex;
        align-items: center;
        border-radius: 17rpx;
        border: 1rpx solid #e6ecff80;
        padding: 5rpx 15rpx;
        margin-right: 8rpx;
      }

      view > img {
        margin-right: 5rpx;
      }
    }

    .sex {
      width: 27rpx;
      height: 27rpx;
    }
  }

  &-member-code {
    position: absolute;
    right: 0;
    height: 65rpx;
    width: 146rpx;
    top: 45rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/member-code-entry-1.png"
    );
  }
}

.unlogin-text {
  font-size: 35rpx;
  color: #1f1f1f;
  margin-left: 38rpx;
  font-weight: bold;
}
</style>
