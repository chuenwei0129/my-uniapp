<template>
  <view class="title-container">
    <view class="price-info">
      <view class="price-box">
        <view class="price">
          <text class="price-icon">￥</text>
          <text class="price-num">{{ data.liveSkuDTO.salePrice || "0" }}</text>
        </view>
        <view class="right-pd" @click="handlePdShowPop" v-if="pdScore >= 0">
          <view>V{{ pdLevelIndex || 0 }}会员返{{ pdScore || 0 }}胖豆</view>
          <view>
            <i class="iconfont icon-right-live icon-bearingRight"></i>
          </view>
        </view>
      </view>

      <view class="chip-city">
        <view class="left-desc">
          <text>{{ data.liveShop.cityName || "-" }}内配送 </text>
        </view>
        <view class="right-box">
          <text v-if="data.liveSkuDTO.chipCode">
            <!-- <text class="dot">·</text> -->
            芯片码:
            <text class="chip-num">{{ data.liveSkuDTO.chipCode || "-" }}</text>
          </text>
        </view>
      </view>
    </view>
    <view class="safe-box">
      <OfficialSecurity
        :isPetType="isPetType"
        :memberBenefitInfo="data.memberBenefitDTO"
        :data="data"
      />
      <Exclusive
        :isPetType="isPetType"
        :memberBenefitInfo="data.memberBenefitDTO"
        :data="data"
      />
    </view>
    <Race :data="data" />
    <!-- 胖豆弹层 -->
    <PdPopView
      :show="pdPopShow"
      @onClose="handleClose"
      :pdScore="pdScore"
      :pdLevelIndex="pdLevelIndex"
      :upGradeDescObj="upGradeDescObj"
    ></PdPopView>
  </view>
</template>
<script>
import { postPdInfo } from "@/api/mallv2.js";
import PdPopView from "../PdPopView/index.vue";
import CouponCard from "../couponCard.vue";
import OfficialSecurity from "./officialSecurity.vue";
import Exclusive from "./exclusive.vue";
import Race from "./race.vue";
export default {
  name: "GoodsTitleLiving",
  components: { PdPopView, CouponCard, OfficialSecurity, Exclusive, Race },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    couponList: {
      type: Array,
      default: () => [],
    },
    activityList: {
      type: Array,
      default: () => [],
    },
    upGradeDescObj: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    getMinPrice: {
      handler(newVal) {
        if (newVal >= 0) {
          this.requestPdInfo(newVal);
        }
      },
      immediate: true,
    },
  },
  computed: {
    getMinPrice() {
      return this.data?.liveSkuDTO?.salePrice;
    },
    specialPrice() {
      const maxCoupon = this.couponList.find((item) => item.maxDiscountCoupons);
      const isMaxCoupon = !!maxCoupon;
      const isBetterActivity =
        this.activityList.length > 0 && !!this.activityList[0].betterActivityId;
      if (!isMaxCoupon && !isBetterActivity) {
        return "-1";
      }
      let price = Number.parseFloat(this.data?.liveSkuDTO?.salePrice);
      if (isMaxCoupon) {
        price = (
          this.data?.liveSkuDTO?.salePrice - (maxCoupon?.discountAmount || 0)
        ).toFixed(2);
      }
      if (isBetterActivity) {
        const availableActivityResp = this.activityList[0];
        price -= Number.parseFloat(
          availableActivityResp.betterActivityAmount || 0
        );
      }
      return price < 0 ? 0 : price;
    },
    isCouponCard() {
      return (
        this.couponList?.length > 0 ||
        (this.activityList?.length > 0 &&
          this.activityList[0].activities.length > 0)
      );
    },
    // 活体-猫/狗
    isPetType() {
      const speciesClassification =
        this.data?.liveSkuDTO?.speciesClassification;
      const alienPetType = this.data?.liveSkuDTO?.alienPetType;
      if ([1, 50].includes(speciesClassification)) {
        return 1; // 猫/狗
      } else if (
        [214, 836, 460, 835].includes(speciesClassification) &&
        alienPetType == 1
      ) {
        return 2; // 高价值异宠
      } else {
        return 3; // 未知
      }
    },
  },
  data() {
    return {
      rightIcon_red:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_red.png",
      pdPopShow: false,
      pdScore: 0,
      pdLevelIndex: 0,
    };
  },
  created() {
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  methods: {
    /**
     * 获取胖豆信息
     * @param payAmount 订单金额
     */
    async requestPdInfo(payAmount) {
      const res = await postPdInfo({
        payAmount,
      });
      const { code, data } = res.data;
      if (code === 0) {
        const { levelIndex, score } = data;
        this.pdScore = Number(score);
        this.pdLevelIndex = levelIndex;
      }
    },
    // 打开胖豆弹层
    handlePdShowPop() {
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      this.pdPopShow = true;
    },
    // 关闭胖豆弹层
    handleClose() {
      this.pdPopShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.title-container {
  background-color: #fff;
  width: 100vw;
  padding: 44rpx 29rpx 31rpx;
  .price-info {
    border-bottom: 2rpx solid #f8f8f8;
    padding-bottom: 28.85rpx;
    box-sizing: border-box;
    // margin: 0 29rpx;
  }
  .safe-box {
    padding-bottom: 28.85rpx;
    box-sizing: border-box;
    border-bottom: 2rpx solid #f8f8f8;
  }
  .price-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15rpx;

    .right-pd {
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 23rpx;
      color: #fe2442;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-right {
        width: 27rpx;
        height: 27rpx;
        display: block;
        margin-right: -3rpx;
        margin-top: -1rpx;
      }
    }
  }
  .price {
    color: #1f1f1f;
    .price-icon {
      font-size: 29rpx;
      font-weight: 600;
    }
    .price-num {
      font-size: 46rpx;
      font-family: D-DIN-Bold;
      line-height: 34rpx;
    }
  }
  .chip-city {
    font-family: PingFangSC, PingFang SC;
    font-weight: 300;
    font-size: 23rpx;
    color: #333333;
    // line-height: 33rpx;
    text-align: left;
    display: flex;
    justify-content: space-between;
    .left-desc {
      max-width: 408rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .dot {
        margin: 0 10rpx;
      }
    }
    .chip-num {
      margin: 0 10rpx 0 10rpx;
    }
    .right-box {
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 23rpx;
      color: #333333;
      // line-height: 33rpx;
      // text-align: right;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-right {
        width: 27rpx;
        height: 27rpx;
        display: block;
        margin-right: -3rpx;
        margin-top: -1rpx;
      }
    }
  }
  .icon-right-live {
    color: #fe2442;
    font-size: 27rpx;
  }
}
</style>
