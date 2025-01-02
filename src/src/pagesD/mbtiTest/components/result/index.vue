<template>
  <view class="result-page">
    <view :class="['bg', `${resulttype ? resulttype : 'ESFJ'}`]"></view>
    <view class="petname">{{ petName }}的测试结果是:</view>
    <view class="bottom-part">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/activity/mbti/groupimagev2.png"
        :show-menu-by-longpress="true"
        class="group-part"
      ></image>
      <view class="btnshadow"></view>
      <view class="btn-groups">
        <!-- :class="[isStart ? 'start' : !isScroll ? 'scroll' : 'scrollStop']" -->
        <view class="againbtn" @click="againGame"></view>
        <view class="sharebtn" @click="toShare"></view>
        <view class="savebtn" @click="showResultPop"></view>
      </view>
    </view>
    <ResultPop
      :show.sync="modalShow.resultshow"
      :restype="resulttype"
      @close="closeModal('resultshow')"
    ></ResultPop>
    <ShareModal
      v-if="modalShow.shareshow"
      @close="closeModal('shareshow')"
    ></ShareModal>
  </view>
</template>
<script>
import { wxShareMethod } from "@/utils/wxShare";
import ResultPop from "../resultPop/index.vue";
import ShareModal from "../shareModal/index.vue";
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
    ResultPop,
    ShareModal,
  },
  // #ifdef MP-WEIXIN
  ...wxShareMethod(shareInfo),
  // #endif
  data() {
    return {
      modalShow: {
        resultshow: false,
        shareshow: false,
      },
      petName: "",
      resulttype: "",
      isScroll: true,
      timer: "", //记录定时器状态
      isStart: true,
    };
  },
  onLoad(option) {
    console.log("option", option);
    this.petName = option.petname;
    this.resulttype = option.rest;
  },
  onPageScroll(e) {
    console.log("onPageScroll ====");
    this.isStart = false;
    this.isScroll = true;
    clearTimeout(this.timer); //这里必须要每次滚动前 清除一次
    // 如果停留则表示滚动结束  一旦空了1s就判定为滚动结束
    this.timer = setTimeout(() => {
      console.log("结束滚动");
      this.isScroll = false;
    }, 300);
  },
  onShow() {
    display_report({
      display_name: "mbtitest_resultpage_display",
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
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  methods: {
    againGame() {
      action_report({
        action_name: "mbtitest_resultpage_retest_click",
        module_name: "mbtitest",
      });
      uni.redirectTo({
        url: "/pagesD/mbtiTest/index",
      });
    },
    toShare() {
      action_report({
        action_name: "mbtitest_resultpage_share_click",
        module_name: "mbtitest",
      });
      console.log("native==", this.isNative);
      if (this.isNative) {
        console.log("native==");
        const href = document.location.href;
        const hostRouter = href.split("#")[0];
        // #ifdef H5
        this.$dsBridge.call("openShare", {
          title: "猫咪性格测试大揭秘", //标题
          content: "快来测一测你家猫咪的MBTI吧", //分享内容
          shareUrl: `${hostRouter}#/pagesD/mbtiTest/index`,
          image:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/activity/mbti/shareicon.png", // 分享的logo(微信)
          sharingChannels: ["WECHAT_FRIEND", "WXCHAT_FRIEND_CIRCLE"],
        });
        // #endif
        // wxShareMethod();
      } else {
        this.modalShow["shareshow"] = true;
      }
    },
    showResultPop() {
      action_report({
        action_name: "mbtitest_resultpage_saveimage_click",
        module_name: "mbtitest",
      });
      this.modalShow["resultshow"] = true;
    },
    closeModal(type) {
      this.modalShow[type] = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";

::v-deep .u-popup__content {
  // background-color: rgba(0, 0, 0, 0.3) !important;
  background-color: transparent !important;
}

::v-deep .u-popup .u-transition {
  background-color: rgba(0, 0, 0, 0.55) !important;
}
</style>
