<template>
  <u-popup
    :show="show"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="down-modal">
      <view :class="['contentimage', `level${levelIndex}_down`]"></view>
      <view class="pop-title"
        >你的会员等级已降级至{{ memberLvList[levelIndex - 1] }}</view
      >
      <view class="content">
        <scroll-view class="scroll-content" scroll-y="true">
          <view v-for="(item, i) in levelChangeDesc" :key="i">
            {{ i + 1 }}. {{ item }}。
          </view>
        </scroll-view>
      </view>
      <view class="btn" @click="$u.debounce(toRules, 500)">查看升级攻略</view>
      <view class="close-btn" @click="close"></view>
    </view>
  </u-popup>
</template>

<script>
import { GTE_RULES } from "@/api/memberV2";
import { action_report } from "@/utils/track";
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    levelChangeDesc: {
      type: Array,
      default: () => [],
    },
    levelIndex: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      memberLvList: ["Lv1小银豚", "Lv2小金豚", "Lv3小钻豚"],
    };
  },
  methods: {
    close() {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "updowngrade_pop_button_display",
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: this.levelIndex,
        },
      });
      this.$emit("update:show", false);
    },
    handleClose() {
      this.$emit("update:show", false);
    },
    async toRules() {
      try {
        const { data } = await GTE_RULES();
        this.close();
        const path = data.data;
        if (path.indexOf("http") !== -1) {
          let newRoute = "";
          if (path.indexOf("h5/shareActivity/?random=123#")) {
            newRoute = path.replace("h5/shareActivity/?random=123#", "#");
          } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
            newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
          } else if (path.indexOf("h5/shareActivity/?random=123")) {
            newRoute = path.replace("h5/shareActivity/?random=123/", "");
          }
          let str = `/pagesA/webView/index?route=${newRoute}&type=icon`;
          console.log("str::", str);
          return uni.navigateTo({ url: str });
        } else {
          return uni.navigateTo({ url: path });
        }
      } catch (error) {
        console.log("err::", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
@import "@/utils/membertheme.scss";
.down-modal {
  position: relative;
  width: 577rpx;
  height: 763rpx;
  background: #ffffff;
  border-radius: 38rpx;
  text-align: center;
  padding-top: 58rpx;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  .pop-title {
    width: 100%;
    font-family: PingFang SC;
    font-size: 31rpx;
    margin: 42rpx auto 38rpx;
    color: #1f1f1f;
    text-align: center;
    font-weight: 500;
  }
  .scroll-content {
    height: 200rpx;
  }
  .content {
    padding: 0rpx 58rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 29rpx;
    color: #333333;
    line-height: 1.8;
    text-align: left;
    margin-bottom: 40rpx;
    // height: 200rpx;
    // overflow-y: auto;
  }
  .contentimage {
    width: 228rpx;
    height: 205rpx;
    margin: 0 auto 57rpx;
  }
  .btn {
    width: 500rpx;
    height: 96rpx;
    border-radius: 48rpx;
    @include flex();
    margin: 0 auto 38rpx;
    @include textfclaw(35rpx, #1f1f1f, $align: center, $lineH: 42rpx);
    font-weight: bold;
    background-color: #fee900;
  }
  .level1_down {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvp_1.png"
    );
  }
  .level2_down {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvp_2.png"
    );
  }
  .level3_down {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/memberLvp_3.png"
    );
  }
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
</style>
