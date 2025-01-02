<template>
  <view class="page-wrapper">
    <view class="top-bar">
      <view class="return" @click="handleReturn"></view>
      <view class="text">在线开药</view>
      <view class="r"></view>
    </view>
    <view class="prescribe-image"></view>
    <view class="card-list">
      <view
        class="card"
        v-for="item in card"
        :key="item.name"
        @click="handleCardClick(item)"
      >
        <view class="icon">
          <image :src="item.icon" />
        </view>
        <view class="info">
          <view class="name">{{ item.name }}</view>
          <view class="desc">{{ item.desc }}</view>
        </view>
        <view class="tr"></view>
      </view>
    </view>
    <GoToChatPage :show.sync="show"></GoToChatPage>
    <CouponChoosePop
      :isOpen.sync="isCouponShow"
      @close="handleCouponClose"
      :coupon-list="couponCommendList"
      :inquiry-type="inquiryTypeForPop"
      :pet-list="userPetList"
    />
    <InvitePop :isOpen.sync="isInviteShow" @close="handleCouponClose" />
    <view class="toast-body" v-if="isShowSelfToast">
      {{ toastContent }}
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getPrescriptionList } from "@/api/sheets";
import GoToChatPage from "@/components/goToChatPage/index.vue";
import CouponChoosePop from "@/components/couponChoosePop/index.vue";
import InvitePop from "@/components/invitePop/index.vue";
import { action_report } from "@/utils/track";
import { CAN_I_ASK_V2, GET_RESOURCE_LIST_IN_POP } from "@/api/index";
export default {
  components: {
    GoToChatPage,
    CouponChoosePop,
    InvitePop,
  },
  props: {},
  data() {
    return {
      card: [
        {
          name: "复诊开方",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/change/subs.png",
          desc: "已有历史处方、线下处方单",
          type: "ONLINE_PRESCRIPTION",
        },
        {
          name: "问诊开方",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/change/s.png",
          desc: "暂无处方，不知道开什么药",
          type: "QUICK",
        },
      ],
      show: false,
      isCouponShow: false,
      couponCommendList: [],
      inquiryTypeForPop: "",
      isInviteShow: false,
      toastContent: "",
      isShowSelfToast: false,
      sheetId: "",
      userSelectedPetId: "",
    };
  },
  computed: {
    ...mapState(["serviceSheetsList", "userPetList"]),
  },
  watch: {
    userSelectedPetId: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
      },
      immediate: true,
    },
  },
  created() {},
  onShow() {},
  mounted() {},
  onLoad(option) {
    console.log(
      "3422222222222222222222222222",
      option,
      this.userSelectedPetId,
      this.serviceSheetsList
    );
    this.userSelectedPetId = option.petId;
    this.sheetId = option.sheetId || "";
  },
  methods: {
    ...mapMutations(["setHistoryPrescription"]),
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
    handleCouponClose() {
      this.isCouponShow = false;
      this.isInviteShow = false;
    },
    getFirstPrescription(info) {
      getPrescriptionList({
        diagnosticType: "PRESCRIPTION",
        petId: this.userSelectedPetId,
      }).then((res) => {
        this.setHistoryPrescription(res.data.data[0] || {});
        //去复诊新页面
        uni.navigateTo({
          url: `/pagesA/subsequent/index?petId=${this.userSelectedPetId}&inquiryType=${info.type}&sheetId=${this.sheetId}`,
        });
      });
    },
    handleCardClick(info) {
      action_report({
        action_name:
          info.type === "ONLINE_PRESCRIPTION"
            ? "prescribe_list_rx_clk"
            : "prescribe_list_consult_clk",
        module_name: "medical ",
      });
      if (this.serviceSheetsList.length) {
        return (this.show = true);
      }
      this.inquiryTypeForPop = info.type;
      CAN_I_ASK_V2(info.type)
        .then((res) => {
          if (res.data == 1) {
            //没有宠物，跳转添加宠物
            if (!this.userPetList.length > 0 || !this.userSelectedPetId) {
              uni.navigateTo({
                url: "/pagesD/petInfo/index&transparentTopBar=1",
              });
              return;
            }
            if (info.type == "QUICK") {
              uni.navigateTo({
                url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=${info.type}&sheetId=${this.sheetId}`,
              });
            }
            if (info.type == "ONLINE_PRESCRIPTION") {
              this.getFirstPrescription(info);
            }
          } else if (res.data == 2) {
            //请求优惠券数据
            GET_RESOURCE_LIST_IN_POP(type).then((resCoupon) => {
              this.couponCommendList = resCoupon.data;
              this.isCouponShow = true;
            });
          } else {
            this.isInviteShow = true;
          }
        })
        .catch((err) => {
          console.log("err", err.message);
          this.toastContent = err.message;
          this.isShowSelfToast = true;
          setTimeout(() => {
            this.isShowSelfToast = false;
          }, 2000);
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
