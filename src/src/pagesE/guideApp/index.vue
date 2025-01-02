<template>
  <scroll-view
    scroll-y="true"
    class="scroll-view"
    @scroll="handleScroll"
    @scrolltoupper="handleScrolltoupper"
  >
    <!-- 导航栏 -->
    <template>
      <FixedNav
        title="推荐宠胖胖APP"
        :headerShow="isHeaderShow"
        :backfc="handleBack"
        navBarFontweight="400"
      ></FixedNav>
      <view :style="{ height: statusBarHeight }"></view>
      <u-sticky :offsetTop="statusBarHeight" :zIndex="isHeaderShow ? -1 : 1">
        <view class="header" v-show="!isHeaderShow">
          <view class="iconfont icon-back" @click="handleBack"></view>
          <view class="header-t">推荐宠胖胖APP</view>
          <view></view>
          <view class="click" @click="handleBack"></view>
        </view>
      </u-sticky>
    </template>
    <view class="guide-wrap" @click="$u.debounce(handleNoteTip, 500)">
      <!-- top 背景图 -->
      <image class="guide-bg" :src="`${baseImgUrl}${navImgBg}`" alt="" />
      <!-- 内容区域 -->
      <view class="guide-content">
        <image
          class="title"
          :src="`${baseImgUrl}${imgTitle}${guideType}.png`"
          alt=""
        />
        <view class="content0">
          <image
            class="img"
            :src="`${baseImgUrl}${imgContent}${guideType}.png`"
          />
          <image class="border" :src="`${baseImgUrl}border-block.png`" />
        </view>
        <view class="content1">
          <image
            class="content1-item"
            :src="`${baseImgUrl}${contentLeft}`"
            alt=""
          />
          <image
            class="content1-item"
            :src="`${baseImgUrl}${contentRight}${guideType}.png`"
            alt=""
            :show-menu-by-longpress="true"
          />
        </view>
        <image class="content2" :src="`${baseImgUrl}${content2}`" alt="" />
      </view>
    </view>
  </scroll-view>
</template>
<script>
import FixedNav from "@/components/fixedNav/index.vue";
import { display_report } from "@/utils/track";
import { TO_NOTE_TIP } from "@/api/memberV2.js";
import dayjs from "dayjs";
export default {
  name: "guideApp",
  components: {
    FixedNav,
  },
  data() {
    return {
      baseImgUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/guideApp/",
      isHeaderShow: false,
      statusBarHeight: "",
      navImgBg: "guideBg.png",
      contentLeft: "guideContent-left.png",
      contentRight: "guide_right_",
      content2: "guideContent_2.png",
      imgTitle: "guideType-", // 直播
      imgContent: "guideContent-", // 内容
      guideType: 3, // 引导页类型 3默认兜底
      backTohome: false, //引导页返回逻辑补充，补充返回首页的逻辑
    };
  },
  onLoad(option) {
    // type: 1 兑换(胖豆类场景)  2 问诊（问诊类） 3 社区（社区-兜底场景）  4 养宠（养宠类） 5 补贴（营销类） 6 直播（直播类）
    if (option.type) {
      this.guideType = option.type;
    }
    const userInfo = uni.getStorageSync("storage_info");
    display_report({
      display_name: "guidedownload_show",
      module_name: "guidedownload",
      extend: {
        user_id: userInfo.userId,
        type: this.guideType,
      },
    });
    if (option.backTohome) {
      console.log('backTohome',option.backTohome);
      
      this.backTohome = option.backTohome;
    }
  },
  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    // #ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    // #endif
  },
  methods: {
    // 小程序引导下载页短信提醒
    handleNoteTip() {
      if (this.hasClickedToday()) {
        console.log("今天已经点击过了！");
        return;
      }
      console.log("今天还没有点击过！");
      // return;
      TO_NOTE_TIP().then((res) => {
        console.log("🚀 ~ TO_NOTE_TIP ~ res:", res);
        // 记录点击事件
        this.recordClick();
      });
    },
    // 导航栏
    handleScroll(e) {
      let h = 20;
      console.log(
        "🚀 ~ handleScroll ~ e.target.scrollTop:",
        e.target.scrollTop
      );
      if (e && e.target.scrollTop >= h) {
        this.isHeaderShow = true;
      } else {
        this.isHeaderShow = false;
      }
    },
    handleScrolltoupper(e) {
      if (e.target.offsetTop === 0) {
        this.isHeaderShow = false;
      }
    },
    // 返回
    handleBack() {
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
      // #ifdef MP-WEIXIN
      if (this.backTohome) {
        return uni.switchTab({ url: "/pages/home/index" });
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }
      // #endif
    },
    // 检查是否已经点击过
    hasClickedToday() {
      // #ifdef H5
      const lastClickDate = localStorage.getItem("lastClickDate");
      // #endif
      // #ifdef MP-WEIXIN
      const lastClickDate = uni.getStorageSync("lastClickDate");
      // #endif
      const today = dayjs().format("YYYY-MM-DD");
      console.log("🚀 ~ hasClickedToday ~ today:", { today, lastClickDate });
      // 如果没有记录，或者记录的日期不是今天，则返回 false
      if (!lastClickDate || lastClickDate !== today) {
        return false;
      }
      return true;
    },

    // 记录点击事件
    recordClick() {
      const today = dayjs().format("YYYY-MM-DD");
      // #ifdef H5
      localStorage.setItem("lastClickDate", today);
      // #endif
      // #ifdef MP-WEIXIN
      uni.setStorageSync("lastClickDate", today);
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
.guide-wrap {
  width: 100%;
  padding-bottom: 40rpx;
  .guide-bg {
    width: 750rpx;
    height: 869rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .guide1 {
    margin-bottom: 38rpx;
  }
  .guide-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 38rpx;
    .title {
      width: 231rpx;
      height: 62rpx;
      margin: 17rpx 0 23rpx;
    }
    .content0 {
      width: 577rpx;
      height: 635rpx;
      margin-bottom: 38rpx;
      font-size: 0rpx;
      position: relative;
      .img {
        width: 100%;
        height: 100%;
      }
      .border {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .content1 {
      width: 100vw;
      height: 365rpx;
      margin-bottom: 29rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0;
      padding: 0 28.85rpx;
      box-sizing: border-box;
      &-item {
        width: 336.54rpx;
        height: 365.38rpx;
      }
    }
    .content2 {
      width: 692rpx;
      height: 458rpx;
    }
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76rpx;
  width: 100%;
  padding: 17rpx 29rpx 0 33rpx;
  color: #000;
  font-size: 35rpx;
  box-sizing: border-box;
  position: relative;
  .iconfont {
    font-size: 40rpx;
  }
  &-t {
    margin-left: -40rpx;
  }
  .click {
    position: absolute;
    left: 0;
    top: 0;
    width: 120rpx;
    height: 90rpx;
  }
}
.scroll-view {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 2;
  background-color: #f7f8fc;
}
.scroll-view::-webkit-scrollbar {
  display: none;
}
</style>
