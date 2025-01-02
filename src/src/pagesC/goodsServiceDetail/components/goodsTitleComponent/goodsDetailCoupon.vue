<template>
  <view>
    <view
      class="coupon"
      @click="handleCoupon"
      :class="{ livingHeight: isLiving, marginTop: isLiving }"
    >
      <view
        class="coupon-list"
        v-if="isLogin && itemList"
        :class="{ livingHeight: isLiving }"
      >
        <GoodsPropmotionTag
          v-for="couponDetail in itemList"
          style="flex-shrink: 0; margin-right: 12rpx"
          :right-type="couponDetail.rightType"
          :rule="couponDetail.rule"
          :name="couponDetail.promotionName"
          :iconSize="isLiving ? 21 : 27"
          :textSize="isLiving ? 21 : 21"
          :key="couponDetail.promotionId"
          :promotionType="couponDetail.promotionType"
          :livingBody="isLiving"
        />
      </view>
      <view v-if="isLogin" class="right" :class="{ livingIcon: isLiving }">
        <i class="iconfont icon-bearingRight"></i>
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
import CouponDetailPopView from "@/pagesC/goodsServiceDetail/components/couponDetailPopView/index.vue";
import { action_report } from "@/utils/track";
import GoodsPropmotionTag from "@/pagesC/goodsServiceDetail/components/goodsTitleComponent/goodsPromotionTag.vue";

export default {
  name: "goodsDetailCoupon",
  components: { GoodsPropmotionTag, CouponDetailPopView },
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
      type: [Number, String],
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
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
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
    if (this.isNative) {
      this.isLogin = true;
    } else {
      const info = uni.getStorageSync("storage_info") || {};
      if (info.token) {
        this.isLogin = true;
      }
    }
  },
  methods: {
    handleCoupon() {
      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        this.$dsBridge.call("jumpLogin");
        return;
      } else {
        const info = uni.getStorageSync("storage_info") || {};
        if (!info.token) {
          uni.navigateTo({
            url: "/pagesD/login/index",
          });
          return;
        }
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
  height: 43rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15.38rpx;
  margin-top: 17rpx;
  .coupon-list {
    display: flex;
    overflow: hidden;
    flex: 1;
  }
  .right {
    .iconfont {
      color: #999999;
      // font-size: 25rpx;
    }
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
