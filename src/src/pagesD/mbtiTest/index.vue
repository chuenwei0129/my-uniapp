<template>
  <view class="page-wrapper">
    <view class="bg">
      <view
        @mouseover="startBreathingAnimation"
        @mouseleave="resetBreath"
        class="breathing-button"
        @click="nameHandle"
      >
      </view>
    </view>

    <MbtiName :isOpen.sync="isOpen" @confirm="submitCallBack" />
  </view>
</template>

<script>
import MbtiName from "./components/mbtiName/index.vue";
import { mapState } from "vuex";
//import { wxShareMethod } from "@/utils/wxShare";
// #ifdef H5
import { secondShare } from "@/utils/secondshare";
// #endif
import { action_report, display_report } from "@/utils/track";
const shareInfo = {
  title: "猫咪性格测试大揭秘",
  path: "/pagesD/mbtiTest/index",
  imageUrl:
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/activity/mbti/shareicon.png",
  desc: "快来测一测你家猫咪的MBTI吧",
};
export default {
  components: {
    MbtiName,
  },
  // #ifdef MP-WEIXIN
  ...wxShareMethod(shareInfo),
  // #endif
  data() {
    return {
      isBreathing: false,
      isOpen: false,
    };
  },

  computed: {
    ...mapState(["userInfo"]),
  },
  onShow() {
    display_report({
      display_name: "mbtitest_teststart_display",
      object_type: "mbtitest",
    });
    // #ifdef H5
    setTimeout(() => {
      secondShare({
        title: shareInfo.title,
        desc: shareInfo.desc,
        link: `${window.location.origin}/crm-medical-h5/#/pagesD/mbtiTest/index`,
        imgUrl: shareInfo.imageUrl,
      });
    }, 500);
    // #endif
  },
  onLoad() {},
  methods: {
    nameHandle() {
      console.log("nameHandle=== ");
      this.isOpen = true;
      action_report({
        action_name: "mbtitest_start_click",
        module_name: "mbtitest",
      });
    },
    submitCallBack(petName) {
      console.log("submitCallBack=== ", petName);
      uni.redirectTo({
        url: `/pagesD/mbtiTest/components/questions/index?petName=${petName}`,
      });
    },
    startBreathingAnimation() {
      this.isBreathing = true;
    },
    resetBreath() {
      this.isBreathing = false;
    },
  },
};
</script>

<style></style>

<style lang="scss" scoped>
@import "./index.scss";
</style>
