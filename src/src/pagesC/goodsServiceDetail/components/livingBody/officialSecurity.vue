<template>
  <view>
    <!-- <view class="officialSecurity" @click="handlePop">
      <view class="official">官方保障</view>
      <view class="desc">
        <text class="desc-text">{{ textDesc || "-" }}</text>
        <image class="right-brown" :src="rightIcon_brown"></image>
      </view>
    </view> -->
    <view class="officialSecurity-content" @click="handlePop">
      <view class="left">
        <officialTag :text="'官方保障'" bgc="#1f1f1f" :key="index" />
        <officialTag
          :text="item.ogMainText"
          :bgc="`linear-gradient(270deg, #FF2400 0%, #FF7058 100%)`"
          v-for="(item, index) in textDesc"
          :key="index"
        />
      </view>
      <view class="right">
        <view class="liner"></view>
        <view class="right-icon-box">
          <i class="iconfont icon-right-live icon-bearingRight"></i>
        </view>
      </view>
    </view>
    <popOfficial
      :officialGuaranteeList="officialGuaranteeList"
      :show="toShowOfficial"
      @close="handleClose"
    ></popOfficial>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
import { mapState } from "vuex";

import popOfficial from "./popOfficial.vue";
import officialTag from "./component/officialTag.vue";
export default {
  name: "officialSecurity",
  components: {
    popOfficial,
    officialTag,
  },
  props: {
    memberBenefitInfo: {
      type: Object,
      default: () => {},
    },
    isPetType: {
      type: Number, // 1: 猫/狗 2：高价值异宠 3：未知
    },
    data: {
      type: Object,
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    textDesc() {
      const { officialGuaranteeList, officialGuaranteeAlienPetList } =
        this.memberBenefitInfo;
      const list =
        this.isPetType === 1
          ? officialGuaranteeList || []
          : this.isPetType === 2
          ? officialGuaranteeAlienPetList || []
          : [];
      return list;
      // .map((item) => {
      //   return item.ogMainText;
      // })
      // .join(" · ");
    },
    officialGuaranteeList() {
      const { officialGuaranteeList, officialGuaranteeAlienPetList } =
        this.memberBenefitInfo;
      const list =
        this.isPetType === 1
          ? officialGuaranteeList
          : this.isPetType === 2
          ? officialGuaranteeAlienPetList
          : [];
      return list || [];
    },
  },
  data() {
    return {
      rightIcon_brown:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_brown.png",
      toShowOfficial: false,
    };
  },
  mounted() {
    // 阿里妈妈字体
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load otf");
      },
      fail() {
        console.log("fail load otf");
      },
    });
  },
  methods: {
    handleClose(bool) {
      this.toShowOfficial = bool;
    },
    handlePop() {
      action_report({
        action_name: "LivepetDetailpage_guarantee_click",
        module_name: "LivepetDetailpage",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.data?.liveSkuDTO?.itemName,
        },
      });
      this.toShowOfficial = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.officialSecurity-content {
  position: relative;
  margin-top: 29rpx;
  .left {
    width: calc(100% - 41rpx);
    overflow: hidden;
    white-space: nowrap;
  }
  .right {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 56rpx;
    height: 42rpx;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .right-icon-box {
      width: calc(100% - 15rpx);
      background-color: #fff;
      height: 100%;
      .icon-right-live {
        display: inline-block;
      }
    }
    .liner {
      width: 15rpx;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1)
      );
    }
    .icon-right-live {
      font-size: 27rpx;
      color: #999;
    }
  }
}
.officialSecurity {
  width: 100%;
  height: 77rpx;
  line-height: 77rpx;
  background: linear-gradient(270deg, #ffc5a4 0%, #ffe6d4 100%);
  border-radius: 23rpx;
  margin-top: 29rpx;
  display: flex;
  padding-left: 23rpx;
  padding-right: 6rpx;
  justify-content: space-between;
  align-items: center;
  font-size: 25rpx;
  color: #8a4c35;
  .official {
    font-family: "AlimamaShuHeiTi-Bold";
    margin-right: 15rpx;
  }
  .desc {
    font-family: PingFangSC, PingFang SC;
    display: flex;
    align-items: center;
    justify-content: center;
    .desc-text {
      display: inline-block;
      max-width: 513rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .right-brown {
    width: 27rpx;
    height: 27rpx;
    display: inline-block;
    margin-right: 5rpx;
  }
}
</style>
