<template>
  <view class="exclusive-container">
    <view class="exclusive" @click="handleClick">
      <!-- 渐变底图 -->
      <!-- <image class="liner-bg" :src="linerBg" /> -->
      <view
        class="part"
        v-for="(item, index) in mainPetBenefitList"
        :key="index"
      >
        <image class="part-icon" :src="item.mainIconType"></image>
        <view class="part-title">{{ item.mainMainText || "-" }}</view>
      </view>
      <!-- <view class="right-icon">
        <image class="right-icon-gray" :src="rightIcon_gray" />
      </view> -->
      <view class="right">
        <view class="liner"></view>
        <view class="right-icon-box">
          <i class="iconfont icon-right-live icon-bearingRight"></i>
        </view>
      </view>
    </view>
    <PopExclusive
      :isOpen="toIsOpen"
      :shopPetBenefitList="shopPetBenefitList"
      @close="handleClose"
    />
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
import { mapState } from "vuex";
import PopExclusive from "./popExclusive.vue";
export default {
  name: "exclusive",
  components: { PopExclusive },
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
    // 弹层
    shopPetBenefitList() {
      const { shopPetBenefitList, shopPetBenefitAlienPetList } =
        this.memberBenefitInfo;
      const list =
        this.isPetType === 1
          ? shopPetBenefitList
          : this.isPetType === 2
          ? shopPetBenefitAlienPetList
          : [];
      return list || [];
    },
    // 外面
    mainPetBenefitList() {
      return this.memberBenefitInfo?.mainPetBenefitList || [];
    },
  },
  data() {
    return {
      toIsOpen: false,
      rightIcon_gray:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png",
      linerBg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/linerBg.png",
    };
  },
  methods: {
    handleClose(bool) {
      this.toIsOpen = bool;
    },
    handleClick() {
      action_report({
        action_name: "LivepetDetailpage_enjoyment_click",
        module_name: "LivepetDetailpage",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.data?.liveSkuDTO?.itemName,
        },
      });
      this.toIsOpen = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.exclusive {
  width: 100%;
  margin-top: 29rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  .liner-bg {
    position: absolute;
    top: 0;
    right: 0;
    width: 35rpx;
    height: 35rpx;
  }
  .part {
    margin-right: 25rpx;
    display: flex;
    width: calc(100% - 41rpx);
  }
  .part-icon {
    width: 35rpx;
    height: 35rpx;
    display: inline-block;
  }
  .part-title {
    // width: 150rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 300;
    font-size: 25rpx;
    color: #1f1f1f;
    line-height: 35rpx;
    text-align: left;
    font-style: normal;
  }
  .right-icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    .right-icon-gray {
      width: 27rpx;
      height: 27rpx;
      display: inline-block;
      margin-right: -3rpx;
    }
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
</style>
