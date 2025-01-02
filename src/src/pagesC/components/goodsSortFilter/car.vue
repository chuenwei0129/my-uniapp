<template>
  <view class="filter-wrapper">
    <view
      :class="['shop-cart', isAnimating ? 'cartActive' : '']"
      @click="handleCartTapped"
    >
      <view v-if="num" class="dot">{{ num }}</view>
      <i class="iconfont icon-gouwuche" style="font-size: 46rpx"></i>
    </view>
  </view>
</template>

<script>
import { GET_CART_TOTAL } from "@/api/mallv2";
import { mapState } from "vuex";
import { action_report } from "@/utils/track";
const module_name = "shop";

export default {
  name: "goodsSortFilter",

  data() {
    return {
      sortType: 1,
      isAnimating: false, //动画
      num: 0,
    };
  },
  mounted() {
    // uni.$off();
    uni.$on("addCardNumActive", (res) => {
      this.addCardNumActive();
    });
    this.getCartNum();
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
    priceIcoClass() {
      if (this.sortType === 3) {
        return "price-ico-asc";
      } else if (this.sortType === 4) {
        return "price-ico-desc";
      } else {
        return "price-ico";
      }
    },
  },

  emits: ["onChange"],
  methods: {
    //获取购物车数量
    async getCartNum() {
      let params = {
        checked: false,
        cartType: 1,
      };
      if (!this.userInfo.token) {
        return;
      }
      const res = await GET_CART_TOTAL(params);
      let { data } = res.data;
      this.num = data;
    },

    isSelected(type) {
      return this.sortType === type;
    },

    handleSelect(type) {
      if (this.sortType === type) return;

      this.sortType = type;
      this.$emit("onChange", this.sortType);
    },
    addCardNumActive() {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
      this.getCartNum();
    },
    handleCartTapped() {
      // 二级类目时
      action_report({
        action_name: "class2_carticon_click",
        module_name: module_name,
      });
      // 搜索时
      action_report({
        action_name: "result_carticon_click",
        module_name: module_name,
      });
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/shoppingCart/index`,
      });
      // #endif

      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/shoppingCart/index`,
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-wrapper {
  height: 70rpx;
  width: 100%;
  background-color: transparent;
  padding: 6rpx 29rpx 0 29rpx;

  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  .item {
    min-width: 58rpx;
    font-size: 29rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
    text-align: center;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  .active {
    color: #ff5b05;
  }

  .price-sort {
    height: 25rpx;
    width: 25rpx;
  }

  .price-ico {
    height: 26rpx;
    width: 26rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price.png");
  }

  .price-ico-asc {
    height: 26rpx;
    width: 26rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price_asc.png");
  }

  .price-ico-desc {
    height: 26rpx;
    width: 26rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/sort_filter_price_desc.png");
  }

  .tab-list {
    width: 50%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
}

.shop-cart {
  position: relative;
  .shop-cart-logo {
    width: 44rpx;
    height: 44rpx;
  }
  .dot {
    position: absolute;
    top: -11rpx;
    right: -11rpx;
    background: #f33a50;
    font-size: 20rpx;
    font-weight: 600;
    color: #ffffff;
    border-radius: 50%;
    // padding: 2rpx 10rpx;
    width: 34rpx;
    height: 34rpx;
    line-height: 34rpx;
    text-align: center;
    // min-width: 28rpx;
    // min-height: 28rpx;
  }
}
.cartActive {
  animation-name: zoomInOut;
  animation-duration: 0.3s; /* 动画持续时间 */
  animation-iteration-count: 1; /* 动画次重 */
}
@keyframes zoomInOut {
  0% {
    transform: scale(1); /* 初始化为正常大小 */
  }
  50% {
    transform: scale(1.15); /* 放大至1.15倍 */
  }
  100% {
    transform: scale(1); /* 恢复到正常大小 */
  }
}
</style>
