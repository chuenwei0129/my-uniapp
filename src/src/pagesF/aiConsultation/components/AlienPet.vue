<template>
  <view>
    <view class="no-box">
      <view class="img">
        <image
          class="image"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/noData.png"
          mode="scaleToFill"
        />
      </view>
      <view class="name">
        该宠物暂不支持智能问诊，若需要为该宠物问诊可转人工问诊哟~
      </view>
      <view @click="goFreeClinic" class="btn">宠医义诊</view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    selectedPet: {
      type: Object,
    },
  },
  data() {
    return {
      tipsContent: "",
      num: 0,
    };
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    goFreeClinic() {
      // #ifdef MP-WEIXIN
      // uni.navigateTo({
      //   url: `/pagesA/diseaseDesc/index?petId=${this.selectedPet.id}&doctorUserId=`,
      // });
      //跳转到引导页面
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/tool/inquiry/doctor?petId=${String(
          this.selectedPet.id
        )}&inquiryType=QUICK`,
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.no-box {
  width: 480rpx;
  margin: 200rpx auto;
  .img {
    width: 360rpx;
    height: 360rpx;
    margin: 0 auto;
    image {
      width: 360rpx;
      height: 360rpx;
    }
  }
  .name {
    font-size: 26rpx;
    width: 480rpx;
    text-align: center;
    margin: 20rpx auto 40rpx;
    color: #999999;
  }
  .btn {
    width: 180rpx;
    height: 72rpx;
    margin: 0 auto;
    font-weight: bold;
    line-height: 72rpx;
    text-align: center;
    color: #1f1f1f;
    font-size: 30rpx;
    border-radius: 36rpx;
    background-color: #ffeea5;
    cursor: pointer;
  }
}
</style>
