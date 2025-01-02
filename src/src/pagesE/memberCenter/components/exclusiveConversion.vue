<template>
  <view class="exclusive-container" v-if="showGoods">
    <view class="top">
      <view class="title">胖豆免费兑换</view>
      <view class="more-nav">
        <text class="more" @click="toGuideApp(1)">查看更多</text>
        <image class="nav" :src="navIcon"></image>
      </view>
    </view>
    <view class="bottom">
      <!-- <scroll-view
      class="scroll-view"
      scroll-x
      @scrolltolower="loadMore"
    > -->
      <view
        :class="item.selfHide ? 'goods-item goods-item-none' : 'goods-item'"
        v-for="(item, index) in goodsList"
        @click="toGuideApp(2, item)"
        :key="index"
      >
        <!-- <view :class="['icon1 icon']" v-if="item.goodsExclusiveLevel"
          >V{{ item.goodsExclusiveLevel }}+专享</view
        > -->
        <view
          :class="['icon', styleNum(item)]"
          v-if="item.goodsPromotion && item.goodsPromotion.promotionType"
          >{{
            item.goodsPromotion.promotionType === 1
              ? `限时${item.goodsPromotion.discount}折`
              : `直降${item.goodsPromotion.prizeReduction}`
          }}</view
        >
        <view class="item-img">
          <image class="img" :src="item.goodsLogoPic" mode="aspectFill"></image>
          <view
            class="settimeout"
            v-if="
              item.goodsPromotion &&
              item.goodsPromotion.endTime &&
              nowTime > item.goodsPromotion.endTime
            "
          >
            <view
              class="time"
              v-if="item.goodsPromotion && item.goodsPromotion.endTime"
            >
              <CountDown
                :endTime="item.goodsPromotion.endTime"
                @countDownEnd="countDownEnd"
              />
            </view>
          </view>
        </view>
        <view class="item-name">{{ filterStrLen(item.goodsName) }}</view>
        <view class="item-price">
          <view class="content-prize"> </view>
          <image class="beans" :src="beanImg"></image>
          <text class="number">
            <text class="now">{{
              (item.goodsPromotion && item.goodsPromotion.promotionPrize) ||
              item.goodsExclusiveConsumeScore ||
              item.consumeScore
            }}</text>
            <!-- <text class="prev" v-if="(item.goodsPromotion && item.goodsPromotion.promotionPrize) || item.goodsExclusiveConsumeScore">{{
              item.consumeScore
            }}</text> -->
          </text>
        </view>
      </view>
      <!-- </scroll-view> -->
    </view>
    <view class="pd-info" @click="toGuideApp(3)">
      <text>我的胖豆：</text><text>{{ scores }}</text>
      <text class="split"></text>
      <text>赚胖豆</text>
      <image class="nav" :src="navIcon"></image>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  ONLY_REDEMPTION_ITEM,
  ONLY_REDEMPTION_ITEM_v3,
  PD_COUNT,
} from "@/api/memberV2";
import CountDown from "./countDown.vue";
import { display_report, action_report } from "@/utils/track";
dayjs.extend(duration);
const h5Domain = {
  dev: "https://cn-dev02-shareactivity.chongpangpang.com/#",
  jumpdev: "https://cn-dev02-shareactivity.chongpangpang.com",
  pro: "https://shareactivity.chongpangpang.com/#",
  jumppro: "https://shareactivity.chongpangpang.com",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/#",
};
const env =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "dev"
    : process.env.NODE_ENV === "pre"
    ? "pre"
    : "pro";
export default {
  name: "exclusiveConversion",
  components: { CountDown },
  props: {
    levelIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      navIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/navRight.png",
      beanImg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/bean.png",
      goodsList: [],
      pageNo: 1,
      showGoods: false,
      nowTime: "",
      scores: 0,
    };
  },
  created() {},
  created() {},
  beforeDestroy() {},
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  mounted() {
    this.nowTime = new Date().getTime();
    this.getGoodsList();
    this.getPdCount();
    //加载字体文件 D-DIN-Bold
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        // 'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
        "url('https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf')",
      success() {
        console.log("success load ttf 1111");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  methods: {
    styleNum(item) {
      const {
        goodsPromotion: { promotionType, discount, prizeReduction },
      } = item;
      if (item.goodsExclusiveLevel) {
        if ([1, 2].includes(promotionType)) return "icon2";
      } else {
        return "icon3";
      }
    },

    loadMore() {
      console.log("触底了老弟");
      // this.pageNo += 1
      // this.getGoodsList()
    },
    getPdCount() {
      PD_COUNT().then((res) => {
        this.scores = res.data.scores;
      });
    },
    getGoodsList() {
      const params = {
        pageNo: 1,
        pageSize: 9,
        goodsType: 1,
        scene: 1,
        sortType: 2,
      };
      ONLY_REDEMPTION_ITEM_v3(params)
        .then((res) => {
          console.log(res);
          this.goodsList = res.data.data || [];
          this.showGoods = this.goodsList.length > 0 ? true : false;
          if (this.goodsList.length % 3 == 2) {
            this.goodsList.push({ selfHide: true });
          }
          if (this.showGoods) {
            const userInfo = uni.getStorageSync("storage_info");
            display_report({
              display_name: "member_zhuanshu_display",
              module_name: "member",
              extend: {
                userId: userInfo.userId,
                memberLv: this.levelIndex,
              },
            });
          }
        })
        .catch((err) => {
          console.log("err:::", err);
        });
    },
    toGuideApp(type, good) {
      //1查看更多 2去商品详情 3赚胖豆
      const actionNameJson = {
        1: "member_check_more_click",
        2: "member_pangdou_exchange_click",
      };
      const userInfo = uni.getStorageSync("storage_info");
      if (actionNameJson[type]) {
        action_report({
          // action_name: "member_zhuanshu_click",
          action_name: actionNameJson[type],
          module_name: "member",
          extend: {
            userId: userInfo.userId,
            memberLv: this.levelIndex,
            goodsId: type == 2 ? good.goodsId : undefined,
            // cardName: "专属兑换",
          },
        });
      }
      if (this.isNative) {
        if (type == 1) {
          window.location.href = `${h5Domain[env]}/integral/detaillist?tabType=0&transparentTopBar=1`;
          return;
        }
        if (type == 2) {
          window.location.href = `${h5Domain[env]}/integral/productdetail/${good.goodsId}?goodType=1&transparentTopBar=1`;
          return;
        }
        if (type == 3) {
          window.location.href = `${h5Domain[env]}/integral/index?intergralShowtask=true&transparentTopBar=1`;
          return;
        }
      } else {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=1`,
        });
      }
    },
    filterStrLen(str) {
      if (str?.length > 6) return str.slice(0, 6);
      else return str;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.exclusive-container {
  // margin-top: 38rpx;
  width: 100%;
  // background: linear-gradient(135deg, #fed900 0%, #fee900 100%);
  border-radius: 23rpx;
  padding-bottom: 5rpx;
  box-sizing: border-box;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 19rpx 0;
    font-family: PingFangSC, PingFang SC;
    .title {
      font-weight: 600;
      @include textfclaw(35rpx, #333333, $align: left);
    }
    .more-nav {
      display: flex;
      align-items: center;
      .more {
        font-weight: 400;
        @include textfclaw(25rpx, #1f1f1f, $align: right);
      }
      .nav {
        width: 23rpx;
        height: 23rpx;
        margin-left: 3rpx;
      }
    }
  }
  .bottom {
    font-family: PingFangSC, PingFang SC;
    // padding: 0rpx 9rpx 9rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; // space-between;
    // overflow: scroll;
    .goods-item {
      width: 220rpx;
      height: 346rpx;
      background: #ffffff;
      border-radius: 15rpx;
      overflow: hidden;
      backdrop-filter: blur(10px);
      position: relative;
      margin-bottom: 18rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 19rpx;
      .icon1 {
        left: 7rpx;
        // width: 90rpx;
        background: #1f1f1f;
        color: #e8bd77 !important;
        z-index: 9;
        border-radius: 12rpx 0rpx 12rpx 0rpx;
      }
      .icon2 {
        left: 91rpx;
        // width: 100rpx;
        background: #fe2442;
        color: #fff;
        z-index: 8;
        border-radius: 0rpx 0rpx 12rpx 0rpx;
        padding-left: 15rpx !important;
      }
      .icon3 {
        left: 7rpx;
        // width: 92rpx;
        background: #fe2442;
        color: #fff;
        z-index: 8;
        border-radius: 12rpx 0rpx 12rpx 0rpx;
      }
      .icon {
        position: absolute;
        top: 10rpx;
        height: 35rpx;
        padding: 0 10rpx;
        @include textfclaw(21rpx, #ffffff, $align: center, $lineH: 35rpx);
      }
      .item-img {
        width: 100%;
        height: 220rpx;
        margin: 0;
        display: inline-block;
        border-radius: 12rpx;
        text-align: center;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
          display: inline-block;
        }
        .settimeout {
          width: 212rpx;
          height: 35rpx;
          background: #666666;
          opacity: 0.4;
          border-radius: 0rpx 0rpx 12rpx 12rpx;
          @include textfclaw(21rpx, #ffffff, $align: center, $lineH: 31rpx);
          @include flex();
          position: absolute;
          bottom: 0;
          left: 0;
          .clock {
            display: inline-block;
            width: 21rpx;
            height: 21rpx;
            @include bg(
              "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/clock.png"
            );
          }
          .clock-text {
            margin: 0 10rpx 0 4rpx;
          }
          .time {
            display: inline-block;
          }
        }
      }
      .item-name {
        @include textfclaw(27rpx, #333333, $align: center);
        font-weight: 500;
      }
      .item-price {
        @include flex();
        .beans {
          width: 42rpx;
          height: 42rpx;
          margin-right: 2rpx;
          display: inline-block;
          margin-left: -2rpx;
        }
        .number {
          margin-left: -2rpx;
          .now {
            font-family: D-DIN-Bold;
            font-weight: bold;
            @include textfclaw(35rpx, #1f1f1f, $align: left, $lineH: 38rpx);
            margin-right: 7rpx;
            box-sizing: border-box;
          }
          .prev {
            @include textfclaw(29rpx, #999999, $align: left, $lineH: 31rpx);
            text-decoration: line-through;
          }
        }
      }
    }
    .goods-item-none {
      opacity: 0;
    }
    .goods-item:last-child {
      margin-right: 0;
    }
  }
  .scroll-view {
    white-space: nowrap;
    width: 100%;
    overflow-x: scroll;
  }
  .pd-info {
    height: 69rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 27rpx;
    color: #333333;
    font-style: normal;
    background-color: #fff;
    border-radius: 15rpx;
    .split {
      width: 2rpx;
      height: 19rpx;
      opacity: 0.4;
      margin: 0 15rpx;
      background-color: #1f1f1f;
    }
    .nav {
      width: 23rpx;
      height: 23rpx;
      margin-left: 3rpx;
    }
  }
}
</style>
