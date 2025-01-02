<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
    @touchmove.stop.prevent
  >
    <view class="petPop">
      <view class="header">
        <view class="title">我的卡券</view>
        <view class="close-icon" @click="handleCancel"></view>
      </view>
      <view
        :class="[
          'list-wrapper',
          couponList.length > 2 ? 'height-max' : 'height-common',
        ]"
      >
        <template v-for="(item, index) in couponList">
          <view
            :key="index"
            :class="['card-wrapper', `fold-${item.resourceSubType}`]"
            v-if="item.resourceType == 'CARD'"
          >
            <view class="time-zone">{{ item.expireTime }}过期</view>
            <view class="card-content">
              <view :class="['crown', `crown-${item.resourceSubType}`]"></view>
              <view class="mid">
                <view
                  :class="[
                    'title',
                    handleTitleMatch(item.resourceSubType, 'RECEIVED'),
                  ]"
                ></view>
                <view class="desc">
                  <view class="left"
                    >{{
                      `全类型问诊权益${item.totalUses}次 剩余${
                        item.totalUses - item.usedCount
                      }次`
                    }}
                  </view>
                </view>
              </view>
              <view
                :class="[selectIndex == index ? 'checked' : 'uncheck']"
                @click="
                  () => {
                    handleChooseCoupon(item, index);
                  }
                "
              ></view>
            </view>
          </view>
          <view class="coupon-wrapper" v-if="item.resourceType == 'COUPON'">
            <view class="time-zone">{{ item.expireTime }}过期</view>
            <view class="coupon-content">
              <view
                :class="[
                  handleTagMatch(item.resourceSubType, 'RECEIVED'),
                  'tag',
                ]"
              >
              </view>
              <view class="mid">
                <view class="title">{{ item.title }}</view>
                <view class="desc">
                  <view
                    class="left"
                    :style="{
                      color: handleColorMatch(
                        item.resourceSubType,
                        item.status
                      ),
                    }"
                    >{{
                      item.resourceSubType == "INQUIRY"
                        ? "可享全类型的问诊权益1次"
                        : item.resourceSubType == "EXPERT_INQUIRY"
                        ? "可享免费专家问诊1次"
                        : "可享免费营养咨询1次"
                    }}
                  </view>
                </view>
              </view>
              <view
                :class="[selectIndex == index ? 'checked' : 'uncheck']"
                @click="
                  () => {
                    handleChooseCoupon(item, index);
                  }
                "
              ></view>
            </view>
          </view>
        </template>
      </view>
      <view class="footers">
        <view class="new" @click="handleConfirm">
          <view class="text">确定</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    couponList: {
      type: Array,
      default() {
        return [];
      },
    },
    inquiryType: {
      type: String,
    },
    doctorUserId: {
      type: String,
    },
    petList: {
      type: Array,
      default() {
        return [];
      },
    },
    CouponChooseFrom: {
      type: String,
    },
  },
  data() {
    return {
      checked: true,
      selectIndex: 0,
      selectedCouponNo: 0,
      selectResourceType: "",
    };
  },
  computed: {
    ...mapState(["userSelectedPetId"]),
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    handleOpen() {
      // const ind = this.couponList.findIndex((p) => p.id == this.selectPetId);
      this.selectIndex = 0;
      this.selectedCouponNo = this.couponList[0].resourceId;
      this.selectResourceType = this.couponList[0].resourceType;
    },
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    handleConfirm() {
      console.log(
        this.inquiryType,
        this.selectIndex,
        this.selectedCouponNo,
        this.selectResourceType
      );
      if (typeof this.selectIndex !== "number") {
        return uni.showToast({
          title: "请选择卡券",
          icon: "error",
        });
      }
      this.handleCancel();
      if (this.CouponChooseFrom == "AI") {
        this.$emit("AICouponChoose", {
          resourceId: this.selectedCouponNo,
          resourceType: this.selectResourceType,
        });
        return;
      }
      if (this.petList.length === 1 || !this.userSelectedPetId) {
        uni.navigateTo({
          url: `/pagesD/petInfo/index?type=askDoctor&inquiryType=${this.inquiryType}&resourceId=${this.selectedCouponNo}&doctorUserId=${this.doctorUserId}&resourceType=${this.selectResourceType}&transparentTopBar=1`,
        });
        return;
      }
      switch (
        this.inquiryType //选择优惠劵弹窗，确定跳转
      ) {
        case "QUICK":
          uni.navigateTo({
            url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=QUICK&resourceId=${this.selectedCouponNo}&doctorUserId=${this.doctorUserId}&resourceType=${this.selectResourceType}`,
          });
          break;
        case "EXPERT":
          uni.navigateTo({
            url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=EXPERT&resourceId=${this.selectedCouponNo}&doctorUserId=${this.doctorUserId}&resourceType=${this.selectResourceType}`,
          });
          break;
        case "NUTRITION":
          uni.navigateTo({
            url: `/pagesA/nutritionDesc/index?petId=${this.userSelectedPetId}&inquiryType=NUTRITION&resourceId=${this.selectedCouponNo}&doctorUserId=${this.doctorUserId}&resourceType=${this.selectResourceType}`,
          });
          break;
      }
    },
    handleChooseCoupon(item, index) {
      this.selectIndex = index;
      this.selectedCouponNo = item.resourceId;
      this.selectResourceType = item.resourceType;
    },
    handleTagMatch(useCouponType, status) {
      if (status !== "EXPIRED") {
        switch (useCouponType) {
          case "INQUIRY":
            return "tag-normal";
          case "EXPERT_INQUIRY":
            return "tag-expert";
          case "NUTRITION_INQUIRY":
            return "tag-nutri";
        }
      } else {
        switch (useCouponType) {
          case "INQUIRY":
            return "tag-normal-expired";
          case "EXPERT_INQUIRY":
            return "tag-expert-expired";
          case "NUTRITION_INQUIRY":
            return "tag-nutri-expired";
        }
      }
    },
    handleColorMatch(useCouponType, status) {
      if (status !== "EXPIRED") {
        switch (useCouponType) {
          case "INQUIRY":
            return "#00816E";
          case "EXPERT_INQUIRY":
            return "#543B00";
          case "NUTRITION_INQUIRY":
            return "#7C0033";
        }
      }
    },
    handleTitleMatch(subType, status) {
      if (status !== "EXPIRED") {
        switch (subType) {
          case "MONTHLY":
            return "title-MONTHLY";
          case "QUARTER":
            return "title-QUARTER";
          case "SEMI_ANNUAL":
            return "title-SEMI_ANNUAL";
        }
      } else {
        switch (subType) {
          case "MONTHLY":
            return "title-MONTHLY-EXPIRED";
          case "QUARTER":
            return "title-QUARTER-EXPIRED";
          case "SEMI_ANNUAL":
            return "title-SEMI_ANNUAL-EXPIRED";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
