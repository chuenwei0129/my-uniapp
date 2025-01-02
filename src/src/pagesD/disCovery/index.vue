<template>
  <view class="discovery-list">
    <NavBar></NavBar>
    <view class="list-name">探索</view>
    <view class="list-ul">
      <view
        class="list-item"
        v-for="(item, index) in actList"
        :key="index"
        @click="jumpToUrl(item)"
      >
        <view class="left">
          <view class="act-name">
            {{ item.name }}
            <view class="tag" v-if="item.inApp">仅限APP使用</view>
          </view>
          <view class="act-desc">{{ item.desc }}</view>
        </view>
        <view class="right">
          <img :src="item.picUrl" class="icon" />
          <img
            class="arrow"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/rightarrow.png"
          />
        </view>
      </view>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view>
      <CustomTabbar />
    </view>
    <!-- #endif -->
  </view>
</template>
<script>
import CustomTabbar from "@/components/customTabbar/index.vue";
import NavBar from "@/components/navBar/index.vue";
import { mapMutations, mapState } from "vuex";
/**
 * 区分环境接口请求地址
 */
const SHARE_BASR_URL = process.env.NODE_ENV.includes("development")
  ? "https://cn-dev01-shareactivity.chongpangpang.com/"
  : process.env.NODE_ENV.includes("test")
  ? "https://cn-dev02-shareactivity.chongpangpang.com/"
  : process.env.NODE_ENV.includes("pre")
  ? "https://cn-test01-shareactivity.chongpangpang.com/"
  : "https://shareactivity.chongpangpang.com/";
export default {
  components: {
    CustomTabbar,
    NavBar,
  },
  data() {
    return {
      actList: [
        {
          name: "同城活动",
          desc: "来参加宠友线下活动吧",
          picUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/icon1.png",
          path: "/pagesF/activityIndex/index",
        },
        {
          name: "能不能吃",
          desc: "宠物健康饮食成长",
          picUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/icon2.png",
          path: `${SHARE_BASR_URL}h5/shareActivity/?random=123#/eatornot?params=share&transparentTopBar=1`,
        },
        {
          name: "宠物翻译器",
          desc: "看看宠物在说啥",
          picUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/icon3.png",
          path: "/pagesE/guideApp/index?type=4",
          inApp: true,
        },
        {
          name: "MBTI测试",
          desc: "解锁猫咪内心密码",
          picUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/icon4.png",
          path: "/pagesE/guideApp/index?type=4",
          inApp: true,
        },
        {
          name: "养宠工具",
          desc: "多种实用养宠工具任你挑",
          picUrl:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/icon5.png",
          path: "/pagesE/toolsList/index",
        },
      ],
    };
  },
  methods: {
    ...mapMutations(["setCustomTabbarIndex"]),
    jumpToUrl(item) {
      // if (item?.inApp) return;
      if (item.path.indexOf("http") > -1) {
        const route = item.path;
        let newRoute = "";
        if (route.indexOf("h5/shareActivity/?random=123#")) {
          newRoute = route.replace("h5/shareActivity/?random=123#", "#");
        } else if (route.indexOf("h5/shareActivity/?random=123/#/")) {
          newRoute = route.replace("h5/shareActivity/?random=123/#/", "#");
        } else if (route.indexOf("h5/shareActivity/?random=123")) {
          newRoute = route.replace("h5/shareActivity/?random=123/", "");
        }
        console.log("newRoute:  ", newRoute);

        let str = `/pagesA/webView/index?route=${encodeURIComponent(
          newRoute
        )}&type=icon`;
        uni.navigateTo({
          url: str,
        });
      } else {
        uni.navigateTo({
          url: item.path,
        });
      }
    },
  },
  mounted() {
    //设置导航栏index
    this.setCustomTabbarIndex(3);
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
};
</script>
<style lang="scss" scoped>
@import "../../utils/fn.scss";
.discovery-list {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 19rpx 29rpx;
  background-color: #f3f3f4;
  .list-name {
    @include textfclaw(40rpx, #1f1f1f, $align: left);
    margin-bottom: 38rpx;
    font-family: "AlimamaShuHeiTi-Bold";
  }
  .list-ul {
    height: calc(100vh - 130rpx);
    .list-item {
      width: 692rpx;
      height: 173rpx;
      background: #ffffff;
      border-radius: 23rpx;
      display: flex;
      align-items: center;
      padding: 0 35rpx;
      margin-bottom: 19rpx;
      position: relative;
      .left {
        .act-name {
          @include textfclaw(31rpx, #1f1f1f, $align: left, $lineH: 37rpx);
          margin-bottom: 12rpx;
          font-family: "AlimamaShuHeiTi-Bold";
          display: flex;
          align-items: center;
          .tag {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 142rpx;
            height: 30rpx;
            font-weight: bold;
            background: #fe2442;
            border-radius: 15rpx 15rpx 15rpx 4rpx;
            border: 2rpx solid #ffffff;
            @include textfclaw(21rpx, #ffffff);
            font-family: "PingFangSC, PingFang SC;";
            margin-left: 17rpx;
          }
        }
        .act-desc {
          @include textfclaw(25rpx, #999999, $align: left, $lineH: 35rpx);
        }
      }
      .right {
        display: flex;
        align-items: center;
        @include absNormal(auto, auto, $top: 33rpx, $left: 512rpx);
        .icon {
          width: 108rpx;
          height: 108rpx;
        }
        .arrow {
          width: 23rpx;
          height: 23rpx;
          margin-left: 23rpx;
        }
      }
    }
  }
}
</style>
