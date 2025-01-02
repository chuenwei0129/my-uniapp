<template>
  <view v-if="pdScore > 0" class="pdCard-content">
    <view class="pdCard" @click="handlePdPop">
      <div class="fBg">
        <image class="img" :src="beanImg" />
        返胖豆
      </div>
      <div class="infoText">
        V{{ pdLevelIndex }}会员预计返<span style="color: #fe2442">{{
          pdScore
        }}</span
        >胖豆
      </div>

      <view class="right">
        <i class="iconfont icon-outlineArrowRight"></i>
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
import PdPopView from "@/pagesC/goodsServiceDetail/components/PdPopView/index.vue";
import { postPdInfo } from "@/api/mallv2.js";
import { mapState } from "vuex";
import { action_report } from "@/utils/track";

export default {
  name: "goodsDetailPd",
  components: { PdPopView },
  props: {
    minPrice: {
      type: [Number, String],
    },
    upGradeDescObj: {
      type: Object,
      default: () => {},
    },
    itemData: {
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
      beanImg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/bean.png",
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
  computed: {
    ...mapState(["userInfo"]),
  },
  emits: ["onRefresh"],
  mounted() {
    const info = uni.getStorageSync("storage_info") || {};
    if (info.token) {
      this.isLogin = true;
    }
  },
  methods: {
    async requestPdInfo(payAmount) {
      // #ifdef H5
      // let token = this.$dsBridge.call("getToken", "getToken");
      // if (!token) return;
      // #endif
      try {
        const res = await postPdInfo({
          payAmount,
        });
        const { code, data } = res.data;
        if (code === 0) {
          const { levelIndex, score } = data;
          (this.pdScore = Number(score)), (this.pdLevelIndex = levelIndex);
        }
      } catch (error) {
        console.log("🚀 ~ requestPdInfo ~ error:", error);
      }
    },
    handlePdPop() {
      action_report({
        action_name: "Detailpage_pangdourights_click",
        module_name: "Detailpage",
        extend: {
          user_id: this.userInfo?.userId,
          commodity_id: this.itemData?.itemName,
        },
      });
      // #ifdef H5
      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        this.$dsBridge.call("jumpLogin");
      } else if (!this.$dsBridge) {
        const info = uni.getStorageSync("storage_info") || {};
        if (!info.token) {
          uni.navigateTo({
            url: "/pagesD/login/index",
          });
          return;
        }
      }
      // #endif
      // #ifdef MP-WEIXIN
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      // #endif
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
@import "@/utils/fn.scss";
.pdCard-content {
  width: 100%;
  padding: 0 23rpx;
}
.pdCard {
  border-radius: 33rpx;
  height: 22px;
  display: flex;
  align-items: center;
  height: 65rpx;
  position: relative;
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/bean-bg.png"
  );
  .fBg {
    height: 22px;

    background-size: 100%;
    // font-weight: 500;
    font-size: 13px;
    color: #fff;
    padding-left: 33rpx;
    display: flex;
    align-items: center;
    margin-right: 67rpx;
    .img {
      width: 46rpx;
      height: 46rpx;
      margin-right: 6rpx;
    }
  }
  .infoText {
    font-weight: 400;
    font-size: 13px;
    color: #6e4708;
    margin-left: 5px;
  }
}
.right {
  position: absolute;
  right: 10rpx;
  font-size: 25rpx;

  width: 46rpx;
  height: 46rpx;
  @include flex();
  background-color: #ffc781;
  border-radius: 50%;
}
.iconfont {
  color: #1f1f1f;
}
</style>
