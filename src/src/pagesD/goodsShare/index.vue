<template>
  <view class="container">
    <div class="topbar">
      <!-- #ifdef MP-WEIXIN -->
      <div class="l">
        <image
          class="bimg1"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/back-white.png"
          mode="scaleToFill"
          @click="handleGoBack"
        />
      </div>
      <!-- #endif -->
      <div v-if="isNative" class="l">
        <image
          class="bimg1"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/back-white.png"
          mode="scaleToFill"
          @click="handleGoBack"
        />
      </div>
      <div v-if="isNative" class="r">
        <image
          class="bimg2"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/share-white.png"
          mode="scaleToFill"
          @click="handleShare"
        />
      </div>
    </div>
    <view v-for="(item, i) in setList" :key="i">
      <view v-if="item.displayType == 1 && item.images" class="type1">
        <view v-for="item1 in item.images">
          <image
            class="timg"
            :style="{ height: `${item1.height}rpx` }"
            :key="item1.imageLink"
            :src="item1.imageLink"
            mode="scaleToFill"
            @click="handleGoTo(item1)"
          />
        </view>
      </view>
      <view v-if="item.displayType == 2 && item.images" class="type2">
        <view class="type2-card">
          <image
            v-for="item1 in item.images"
            :key="item1.imageLink"
            class="dimg"
            :style="{ height: `${item1.height}rpx` }"
            :src="item1.imageLink"
            mode="scaleToFill"
            @click="handleGoTo(item1)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getActivitySeting } from "@/api/activity";
import { lunchApp } from "@/utils";
// #ifdef H5
import { secondShare } from "@/utils/secondshare";
// #endif
import { debounce } from "@/utils/index";
import { wxShareMethod } from "@/utils/wxShare";

export default {
  components: {},
  // #ifdef MP-WEIXIN
  onShareAppMessage(e) {
    return {
      title: this.shareInfo.shareTitle,
      // desc: this.shareInfo.shareTitle,
      path: `/pagesD/goodsShare/index?activityCode=${this.activityCode}`,
      imageUrl: this.shareInfo.shareImg,
    };
  },
  onShareTimeline(e) {
    return {
      title: this.shareInfo.shareTitle,
      // desc: this.shareInfo.shareTitle,
      path: `/pagesD/goodsShare/index`,
      imageUrl: this.shareInfo.shareImg,
      query: `activityCode=${this.activityCode}`,
    };
  },
  // #endif

  data() {
    return {
      setList: [],
      title: "",
      shareInfo: "",
      activityCode: "",
      // #ifdef H5
      scheme: {
        host: "main_activity",
        params: {
          router: "/web/main",
          WebViewUrl: window.location.href,
        },
      },
      // #endif
    };
  },

  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },

  onLoad(options) {
    this.activityCode = options.activityCode || "PET_NEW_YEAR_GOODS_FESTIVAL";
  },
  onShow() {
    getActivitySeting({
      activityCode: this.activityCode,
      // #ifdef MP-WEIXIN
      source: "MINI_PROGRAM",
      // source: "H5",
      // #endif
      // #ifdef H5
      source: "APP",
      // #endif
    }).then((res) => {
      console.log("🚀 ~ getActivitySeting ~ res:", res, this.isNative);
      const { title, content, shareImg, shareTitle, shareDesc } = res.data;
      this.title = title;
      this.setList = content || [];
      this.shareInfo = {
        shareImg,
        shareTitle,
        shareDesc,
      };
      uni.setNavigationBarTitle({
        title,
      });
      // #ifdef H5
      setTimeout(() => {
        secondShare({
          title,
          desc: shareDesc,
          link: `${window.location.origin}/crm-medical-h5/#/pagesD/goodsShare/index?transparentTopBar=1&activityCode=${this.activityCode}`,
          imgUrl: shareImg,
        });
      }, 500);

      // #endif
    });
  },
  mounted() {},
  methods: {
    getHeight(item) {},
    handleGoTo: debounce(function (item) {
      if (item.jumpLink) {
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: item.jumpLink,
        });
        // #endif
        // #ifdef H5
        if (this.isNative) {
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: item.jumpLink,
          });
        } else {
          lunchApp(this.scheme);
        }
        // #endif
      }
    }, 500),
    handleGoBack() {
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      if (this.isNative) {
        this.$dsBridge.call("closeCurrentWebview", {});
      } else {
        // router.go(-1);
      }
      // #endif
    },
    handleShare() {
      const href = document.location.href;
      const hostRouter = href.split("#")[0];
      const { shareImg, shareTitle, shareDesc } = this.shareInfo;
      // this.$dsBridge.call("openShare", {
      //   title: shareTitle,
      //   content: shareDesc,
      //   shareUrl: `${hostRouter}#/pagesD/goodsShare/index?transparentTopBar=1&activityCode=${this.activityCode}`, //分享链接
      //   image: shareImg,
      //   sharingChannels: [
      //     "WECHAT_FRIEND",
      //     "WXCHAT_FRIEND_CIRCLE",
      //     "QQ",
      //     "WEIBO",
      //     "COPY_LINK",
      //   ],
      //   // poster:
      //   //   "https://image.henhenchina.com/61ee0fe4f58112000178d924/756a9ec3075d4e4f983b9d51a9973ed0.png",
      //   // nickName: userInfo.nickName || "",
      //   // avatarUrl: userInfo.avatarUrl || "",
      // });
      wxShareMethod();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  .timg {
    width: 100%;
    display: block;
  }
  .type2-card {
    display: flex;
    flex-wrap: wrap;
  }
}

.dimg {
  width: 50%;
}
image {
  display: block;
  object-fit: cover;
}
.topbar {
  width: 100%;
  height: 88rpx;
  position: absolute;
  top: 88rpx;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 19rpx 0 31rpx;

  .bimg1 {
    width: 44rpx;
    height: 44rpx;
    // margin-left: -4rpx;
  }
  .bimg2 {
    width: 44rpx;
    height: 44rpx;
  }
  .l {
    padding: 8rpx 8rpx;
    border-radius: 30rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.25);
    background: rgba(0, 0, 0, 0.5);
  }
  .r {
    padding: 8rpx 16rpx;
    border-radius: 30rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.25);
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
