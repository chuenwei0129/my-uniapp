<script>
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
import GradientButton from "@/pagesC/components/gradientButton/index.vue";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import { mapState } from "vuex";
import { addCart } from "@/api/cart";
import CouponCard from "./couponCard.vue";
import InventorySwitchPop from "@/pagesC/components/inventorySwitchPop/index.vue";
import GoodsNumStepper from "@/pagesC/components/goodsNumStepper/index.vue";

export default {
  name: "goodsServiceSpecsPopView",
  components: {
    GoodsNumStepper,
    InventorySwitchPop,
    GoodsPrice,
    GradientButton,
    CellItemNormal,
    CouponCard,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    goodsState: {
      type: Number,
      default: 1,
    },
    skuList: {
      type: Array,
      default: () => [],
    },
    selectedSku: {
      type: Object,
      default: () => {},
    },
    curSkuId: {
      type: String,
    },
    writing: {
      type: String,
    },
    writingType: {
      type: Number,
    },
    couponList: {
      type: Array,
      default: () => [],
    },
    activityList: {
      type: Array,
      default: () => [],
    },
    selectBuyNum: {
      type: Number,
    },
  },
  data() {
    return {
      buyNum: 1,
      isOpen: false,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    isCloudStock() {
      // 从data里面取字段
      return !!this.data.cloudFlag;
    },
    // 原价
    salePrice() {
      console.log("this========>", this.selectedSku);
      return this.selectedSku?.salePrice || "";
    },
    // 最低零售价
    minSalePrice() {
      return (
        this.selectedSku?.minSalePrice || this.selectedSku?.minLowestPrice || ""
      );
    },
    lowestPrice() {
      return this.selectedSku?.lowestPrice || "";
    },
    majorPicture() {
      return (
        this.selectedSku?.majorPicture ||
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/common_placeholder_icon.png"
      );
    },
    buyNumMin() {
      if (this.skuList.every((e) => e.disabled)) {
        return 0;
      }
      return 1;
    },
    // 限购数量
    buyLimitNum() {
      return this.data?.saleStrategy?.buyLimitNum || -1;
    },
    // 当前选择的sku库存
    selectedSkuStockQty() {
      return Number(
        this.skuList.find((e) => e.selected)?.salableStockQty || "0"
      );
    },
    itemId() {
      return this.data?.itemId || "";
    },
    shopId() {
      return this.data?.shopId || "";
    },
    shopName() {
      return this.data?.shopName || "";
    },
    skuId() {
      return this.selectedSku?.id || "";
    },
    selectSkuName() {
      return this.selectedSku?.nickName || "";
    },
    virtualized() {
      return this.data?.virtualized || "";
    },
    goodsType() {
      if (this.virtualized) {
        return "service";
      }
      return "mall";
    },
    //是否存在最大券
    isMaxCoupon() {
      const res1 = this.couponList.find((item) => item.maxDiscountCoupons);
      const res2 = this.isPromotionActivity;
      return res1 || res2;
    },
    // 是否有促销活动
    isPromotionActivity() {
      const activityList = this.activityList || [];
      const firstActivity = activityList.length > 0 ? activityList[0] : null;
      if (!!firstActivity) {
        return (firstActivity.activities || []).length > 0;
      }
      return false;
    },
    specialPrice() {
      const maxCoupon = this.couponList.find((item) => item.maxDiscountCoupons);
      const isMaxCoupon = !!maxCoupon;
      const isBetterActivity =
        this.activityList.length > 0 && !!this.activityList[0].betterActivityId;
      if (!isMaxCoupon && !isBetterActivity) {
        return "-1";
      }
      let price = Number.parseFloat(this.minSalePrice);
      if (isMaxCoupon) {
        price = (this.minSalePrice - (maxCoupon?.discountAmount || 0)).toFixed(
          2
        );
      }
      if (isBetterActivity) {
        price -= Number.parseFloat(
          this.activityList[0].betterActivityAmount || 0
        );
      }
      return price < 0 ? 0 : price;
    },
  },
  emits: ["onClose", "onSelectSpec", "onRefresh", "onSwitchShop"],
  watch: {
    skuList(newVal) {
      if (newVal.every((e) => e.disabled)) {
        this.buyNum = 0;
      }
    },
  },
  methods: {
    close() {
      this.$emit("onClose");
    },
    checkCloudStock(skuStockQty, cloudStockQty) {
      console.log(
        `当前：${skuStockQty}，限额：${this.buyLimitNum}, 云仓：${cloudStockQty}， 添加：${this.buyNum}`
      );
      // 如果是云仓就return
      if (this.isCloudStock) {
        return;
      }
      if (this.buyNum <= skuStockQty || this.buyNum > cloudStockQty) {
        return;
      }
      if (this.buyLimitNum > 0 && this.buyNum > this.buyLimitNum) {
        this.isOpen = cloudStockQty >= this.buyLimitNum;
      } else {
        this.isOpen = cloudStockQty >= this.buyNum;
      }
    },
    async onSelectSpec(item, index) {
      if (this.isCloudStock && item.disabled) {
        return;
      }
      uni.$emit("onSelectSpecClickHandle", [item, index]);
      if (this.skuId === item.id) return;
      const skuStockQty = Number(item.salableStockQty || "0");
      const cloudStockQty = Number(item.cloudStockQty || "0");
      this.buyNum = 1;
      uni.$emit("onBuyNumChange", 1);
      this.checkCloudStock(skuStockQty, cloudStockQty);
    },
    async onChange(value) {
      this.buyNum = value;
      uni.$emit("onBuyNumChange", value);
      const skuStockQty = this.selectedSkuStockQty;
      const cloudStockQty = Number(
        this.skuList.find((e) => e.selected)?.cloudStockQty || "0"
      );
      this.checkCloudStock(skuStockQty, cloudStockQty);
    },
    onImageClickHandle(url) {
      // uni.previewImage({
      //   urls: "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png",
      //   current: 0,
      // });
    },
    async onBuyClickHandle() {
      if (!this.userInfo.token) {
        this.goToLoginAction();
        return;
      }

      const res = await addCart({
        cartType: this.writingType,
        shopId: this.shopId,
        skuId: this.curSkuId,
        skuQty: this.buyNum,
        tenantId: "default_tenant",
      });
      if (this.writingType == 1) {
        //加入购物车
        uni.showToast({
          title: "加入购物车成功",
          duration: 2000,
        });
      }
      if (res.data.data.isSuccess) {
        if (this.writingType == 2) {
          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pagesC/submitOrder/index?itemId=${this.itemId}&skuId=${
              this.skuId
            }&skuQty=${this.buyNum}&shopId=${
              this.shopId
            }&shopName=${encodeURIComponent(this.shopName)}&type=${
              this.goodsType
            }`,
          });
          // #endif
          // #ifdef H5
          let route = `pagesC/submitOrder/index?itemId=${this.itemId}&skuId=${
            this.skuId
          }&skuQty=${this.buyNum}&shopId=${
            this.shopId
          }&shopName=${encodeURIComponent(this.shopName)}&type=${
            this.goodsType
          }&transparentTopBar=1`;
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/${route}`,
          });
          // #endif
        }
        //解决toast一闪
        setTimeout(() => {
          this.$emit("onClose");
          this.$emit("getCartCount");
        }, 500);
      }
    },
    goToLoginAction() {
      uni.navigateTo({
        url: `/pagesD/login/index`,
      });
    },
    handleRefresh() {
      this.$emit("onRefresh");
    },
    handleConfirm() {
      let buyNum = this.buyNum === 0 ? 1 : this.buyNum;
      if (buyNum > this.buyLimitNum) {
        buyNum = this.buyLimitNum;
      }
      this.$emit("onSwitchShop", {
        buyNum,
        skuId: this.selectedSku.id,
      });
    },
  },
};
</script>

<template>
  <view class="popup-wrapper">
    <u-popup
      :show="show"
      @close="close"
      mode="bottom"
      :overlay="true"
      :closeOnClickOverlay="true"
      round="38rpx"
    >
      <view class="popup-content-wrapper">
        <view class="top">
          <view class="left">
            <image
              class="picture"
              :src="majorPicture"
              @click="onImageClickHandle(majorPicture)"
            />
            <view class="price">
              <GoodsPrice
                :salePrice="minSalePrice"
                :specialPrice="specialPrice"
                specialStyle="padding: 5rpx 25rpx 5rpx 18rpx"
              />
              <view class="selected-sku">已选择：{{ selectSkuName }}</view>
            </view>
          </view>
          <view class="right">
            <image
              mode="widthFix"
              :style="{ width: '50rpx', height: '50rpx' }"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
              @click="close"
            />
          </view>
        </view>
        <view class="content-wrapper">
          <view class="specs-wrapper">
            <view class="items-wrapper">
              <view class="title">规格</view>
              <view class="items">
                <view
                  v-for="(item, index) in skuList"
                  :key="index"
                  @click="onSelectSpec(item, index)"
                  class="item"
                  :class="{
                    active: item.selected,
                    unActive: !item.selected,
                    disabled: isCloudStock ? item.disabled : false,
                  }"
                  >{{ item.nickName }}
                  {{ item.disabled ? "（缺货）" : "" }}</view
                >
              </view>
            </view>
            <view class="num-wrapper">
              <view class="left">
                <view class="title">数量</view>
                <view v-if="buyLimitNum !== -1" class="desc"
                  >每人限购{{ buyLimitNum }}件</view
                >
              </view>
              <view class="right">
                <GoodsNumStepper
                  :num="buyNum"
                  :min="buyNumMin"
                  :max="buyLimitNum >= 1 ? buyLimitNum : 99"
                  @change="onChange"
                />
              </view>
            </view>
          </view>
        </view>
        <view class="bottom-wrapper">
          <view class="bottom-buttons">
            <GradientButton
              :title="writing"
              :fontSize="29"
              fontWeight="bold"
              color="#FE2442"
              titleColor="white"
              :borderRadius="43"
              @onClick="$u.debounce(onBuyClickHandle, 500)"
              v-if="goodsState === 1"
            />
            <GradientButton
              title="库存不足"
              :fontSize="29"
              fontWeight="bold"
              color="#FE2442"
              titleColor="#FFFFFF4D"
              :borderRadius="43"
              v-if="goodsState === 3"
            />
            <GradientButton
              title="商品已下架"
              :fontSize="29"
              fontWeight="bold"
              :borderRadius="43"
              color="#FE2442"
              titleColor="#FFFFFF4D"
              v-if="goodsState === 2"
            />
          </view>
        </view>
      </view>
    </u-popup>
    <InventorySwitchPop
      :isOpen.sync="isOpen"
      cancelText="取消"
      confirmText="确定"
      @confirm="handleConfirm"
    />
  </view>
</template>

<style scoped lang="scss">
.popup-wrapper {
  .popup-content-wrapper {
    background-color: #f7f8fc;
    border-radius: 38rpx 38rpx 0 0;

    .top {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 25rpx 31rpx 5rpx 25rpx;

      .left {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .picture {
          width: 93rpx;
          height: 93rpx;
          border-radius: 8rpx;
        }

        .price {
          margin-left: 14rpx;
          flex: 1;
          align-self: flex-start;

          .selected-sku {
            word-break: break-all;
            font-size: 24rpx;
            font-weight: 400;
            color: #999999;
            line-height: 35rpx;
            margin-top: 13rpx;
          }
        }
      }

      .right {
        width: 50rpx;
        height: 50rpx;
        margin: 0 0 0 31rpx;
      }
    }

    .content-wrapper {
      margin: 23rpx 16rpx 60rpx;
      background-color: #ffffff;
      //background-color: rebeccapurple;
      border-radius: 16rpx;

      .specs-wrapper {
        min-height: 150rpx;
        max-height: calc(100vh * 0.5);
        padding: 0 9rpx 0 25rpx;
        overflow-y: scroll;

        .items-wrapper {
          margin: 29rpx 0 13rpx;

          .title {
            font-size: 25rpx;
            font-weight: bold;
            color: #1f1f1f;
            line-height: 35rpx;
            //background-color: #1e5fec;
            margin-bottom: 24rpx;
          }

          .items {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            font-size: 25rpx;
            font-weight: 400;
            color: #333333;
            line-height: 35rpx;

            .item {
              padding: 16rpx 25rpx;
              margin-right: 16rpx;
              margin-bottom: 16rpx;
              border-radius: 10rpx;
              word-break: break-all;
            }

            .active {
              background-color: #fff2f0;
              border: 0.5px solid #ff869c;
              color: #fe2442;
            }

            .unActive {
              background-color: #f3f3f4;
              border: none;
            }

            .disabled {
              background-color: #f3f3f4;
              border: none;
              color: #999999;
            }
          }
        }

        .num-wrapper {
          //background-color: #2c405a;
          padding: 0 0 29rpx;
          margin: 0 25rpx 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 25rpx;
          font-weight: bold;
          color: #1f1f1f;
          line-height: 35rpx;

          .left {
            flex: 1;
            display: flex;
            align-items: center;

            .desc {
              flex: 1;
              margin-left: 20rpx;
              font-size: 23rpx;
              font-weight: 400;
              color: #999999;
              line-height: 33rpx;
            }
          }
        }
      }
    }

    .bottom-wrapper {
      background-color: #fff;
      padding: 16rpx 39rpx;

      .bottom-buttons {
        height: 85rpx;
      }
    }
  }
}
</style>
