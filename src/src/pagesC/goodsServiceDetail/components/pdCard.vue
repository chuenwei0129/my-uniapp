<template>
  <view v-if="pdScore > 0">
    <view class="pdCard" @click="handlePdPop">
      <div class="fBg">
        返胖豆
        <image
          :style="{ width: '12px', height: '12px', marginLeft: '4px' }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/pd_icon.png"
        />
      </div>
      <div class="infoText">
        V{{ pdLevelIndex }}会员预计返<span style="color: #fe2442">{{
          pdScore
        }}</span
        >胖豆
      </div>

      <view class="right">
        <image
          :style="{ width: '11px', height: '10px' }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/right_black.png"
        />
      </view>
    </view>
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
import PdPopView from "./PdPopView/index.vue";
import { postPdInfo } from "@/api/mallv2.js";

export default {
  components: { PdPopView },
  props: {
    minPrice: {
      type: Number,
      default: () => 0,
    },
    upGradeDescObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      pdScore: 0,
      pdLevelIndex: 1,
      pdPopShow: false,
      isLogin: false,
    };
  },
  watch: {
    minPrice: {
      handler(newVal) {
        if (newVal >= 0) {
          this.requestPdInfo(newVal);
        }
      },
      immediate: true,
    },
  },
  computed: {},
  emits: ["onRefresh"],
  mounted() {
    const info = uni.getStorageSync("storage_info") || {};
    if (info.token) {
      this.isLogin = true;
    }
  },
  methods: {
    async requestPdInfo(payAmount) {
      const res = await postPdInfo({
        payAmount,
      });
      const { code, data } = res.data;
      if (code === 0) {
        const { levelIndex, score } = data;
        (this.pdScore = Number(score)), (this.pdLevelIndex = levelIndex);
      }
    },
    handlePdPop() {
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      // action_report({
      //   action_name: "Detailpage_morepromo_click",
      //   module_name: "Detailpage",
      //   extend: {
      //     commodity_id: this.itemId,
      //   },
      // });
      this.pdPopShow = true;
    },
    handleClose() {
      this.pdPopShow = false;
    },
    handleRefresh() {
      this.$emit("onRefresh");
    },
  },
};
</script>
<style lang="scss" scoped>
.pdCard {
  background: linear-gradient(270deg, #faf0d9 0%, #f0d498 100%);
  border-radius: 4px;
  height: 22px;
  margin-top: 13px;
  display: flex;
  align-items: center;
  .fBg {
    width: 74px;
    height: 22px;
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/pd_bg_black.png");
    background-size: 100%;
    font-weight: 500;
    font-size: 13px;
    color: #e8bd77;
    // line-height: 22px;
    padding-left: 5px;
    display: flex;
    align-items: center;
  }
  .infoText {
    font-weight: 400;
    font-size: 13px;
    color: #6e4708;
    margin-left: 5px;
  }
}
.right {
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 16px;
  color: white;
  font-size: 25rpx;
  padding-left: 20rpx;
}
</style>
