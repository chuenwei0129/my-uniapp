<template>
  <view>
    <view
      class="coupon"
      @click="handleCoupon"
      :class="{ livingHeight: isLiving, marginTop: isLiving }"
    >
      <view
        class="coupon-list"
        v-if="isLogin"
        :class="{ livingHeight: isLiving }"
      >
        <PromotionTag
          v-for="couponDetail in itemList"
          style="flex-shrink: 0; margin-right: 12rpx"
          :right-type="couponDetail.rightType"
          :rule="couponDetail.rule"
          :name="couponDetail.promotionName"
          :iconSize="isLiving ? 21 : 27"
          :textSize="isLiving ? 21 : 25"
          :key="couponDetail.promotionId"
          :promotionType="couponDetail.promotionType"
          :livingBody="isLiving"
        />
      </view>
      <view class="right" :class="{ livingIcon: isLiving }">
        <image
          :style="{ width: '12px', height: '12px' }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/right_red.png"
        />
      </view>
    </view>
    <CouponDetailPopView
      :show="couponDetailShow"
      :minLowestPrice="minLowestPrice"
      @onClose="handleClose"
      :couponList="couponList"
      :activityList="activityList"
      @onRefresh="handleRefresh"
      :isLiving="isLiving"
    ></CouponDetailPopView>
  </view>
</template>
<script>
import CouponDetailPopView from "../components/couponDetailPopView/index.vue";
import { action_report } from "@/utils/track";
import PromotionTag from "@/components/goodsCard/components/promotionTag.vue";

export default {
  components: { PromotionTag, CouponDetailPopView },
  props: {
    couponList: {
      type: Array,
      default: () => [],
    },
    activityList: {
      type: Array,
      default: () => [],
    },
    itemId: {
      type: String,
      default: "",
    },
    minLowestPrice: {
      type: Number,
      default: 0,
    },
    isLiving: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    itemList() {
      let items = [];
      if (
        this.activityList.length > 0 &&
        this.activityList[0].activities.length > 0
      ) {
        const res = (this.activityList[0].activities || []).map((e) => {
          return {
            ...e,
            promotionType: 2,
          };
        });
        items.push(...res);
      }
      const res = (this.couponList || []).map((e) => {
        return {
          ...e,
          promotionType: 1,
        };
      });
      items.push(...res);
      return items;
    },
  },
  data() {
    return {
      couponDetailShow: false,
      isLogin: false,
    };
  },
  emits: ["onRefresh"],
  mounted() {
    const info = uni.getStorageSync("storage_info") || {};
    if (info.token) {
      this.isLogin = true;
    }
  },
  methods: {
    handleCoupon() {
      const info = uni.getStorageSync("storage_info") || {};
      if (!info.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      action_report({
        action_name: "Detailpage_morepromo_click",
        module_name: "Detailpage",
        extend: {
          commodity_id: this.itemId,
        },
      });
      this.couponDetailShow = true;
    },
    handleClose() {
      this.couponDetailShow = false;
    },
    handleRefresh() {
      this.$emit("onRefresh");
    },
  },
};
</script>
<style lang="scss" scoped>
.coupon {
  display: flex;
  align-items: center;
  margin-top: 25rpx;
  height: 43rpx;
  .coupon-list {
    display: flex;
    overflow: hidden;
    height: 43rpx;
    flex: 1;
    margin-right: 32rpx;
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 16px;
    color: white;
    font-size: 25rpx;
    padding-left: 20rpx;
  }
}
.livingHeight {
  height: 31rpx !important;
}
.marginTop {
  margin-top: 12rpx !important;
}
.livingIcon {
  margin-right: -10rpx !important;
}
</style>
