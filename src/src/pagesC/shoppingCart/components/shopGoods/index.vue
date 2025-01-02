<template>
  <div class="shop-view">
    <div class="shop-card">
      <u-checkbox-group
        @change="$u.debounce(onCheckShopAllChange, 500)"
        v-if="shop.type != '失效商品'"
      >
        <u-checkbox
          :checked="shop.checked"
          shape="circle"
          activeColor="#FE2442"
        >
        </u-checkbox>
      </u-checkbox-group>
      <div v-if="shop.shopType === 0" class="shop-card-title">
        {{
          shop.type == "失效商品"
            ? `失效商品共${shop.cartSkuList.length}件`
            : shop.shopName
        }}
      </div>
      <div
        class="clear-btn"
        v-if="shop.shopType === 0 && shop.type == '失效商品'"
        @click="cleanGoods(shop.cartSkuList.length)"
      >
        清空
      </div>
      <u--image
        v-if="shop.shopType === 1"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/ppyc1.png"
        width="135rpx"
        height="38rpx"
        mode="aspectFit"
      ></u--image>
    </div>
    <div
      v-for="(sortItem, groupIndex) in newShop.mySortSkuList"
      :key="groupIndex"
    >
      <div
        v-show="groupIndex > 0"
        style="background: #ececec; height: 2rpx; margin: 46rpx 23rpx 0 23rpx"
      ></div>
      <div v-if="sortItem.activity !== null">
        <div class="shop-activity-content">
          <div class="shop-activity-tip">
            {{ sortItem.activity.promotionName }}
          </div>
          <div style="flex: 1"></div>
          <div class="shop-ac-right-content" @click="goPromotionPage(sortItem)">
            <div class="shop-ac-right-text">
              {{ sortItem.activity.meetThreshold ? "再逛逛" : "去凑单" }}
            </div>
            <div class="iconfont icon-arrowRight"></div>
          </div>
        </div>
        <div
          class="shop-activity-dissatisfy-container"
          v-show="dealPromotionTipShow(sortItem)"
        >
          <div class="content">
            {{ dealPromotionGapTip(sortItem) }}
          </div>
        </div>
      </div>
      <div
        style="margin-top: 30rpx"
        v-for="(productItem, index) in sortItem.skuList"
        :key="index"
      >
        <uni-swipe-action>
          <uni-swipe-action-item
            :right-options="options"
            @click="deleteProduct(productItem)"
            :disabled="productItem.identifier === 2"
          >
            <div class="item">
              <view
                @click="
                  $u.debounce(onCheckProductChange(groupIndex, index), 500)
                "
              >
                <template v-if="productItem.identifier === 2">
                  <div
                    class="u-checkbox__icon-wrap u-checkbox__icon-wrap--circle"
                    style="width: 18px"
                  ></div>
                </template>
                <template v-else>
                  <view
                    style="
                      width: 42rpx;
                      height: 42rpx;
                      margin-right: 8rpx;
                      margin-left: -2rpx;
                    "
                  >
                    <!-- <u-checkbox
                      v-if="isRefresh"
                      :checked="
                        isManager
                          ? productItem.checked
                          : !productItem.effective
                          ? false
                          : productItem.checked
                      "
                      :disabled="isManager ? false : !productItem.effective"
                      shape="circle"
                      activeColor="#FE2442"
                    ></u-checkbox> -->
                    <image
                      :src="iconSrc(productItem)"
                      style="height: 100%; width: 100%"
                      :lazy-load="true"
                    ></image>
                  </view>
                </template>
              </view>

              <div
                class="goods-img"
                @click="onProductClick(productItem, index)"
              >
                <!-- src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/%E5%95%8A%E5%95%8A1.avif" -->
                <image
                  :src="productItem.majorPicture"
                  mode="aspectFill"
                  :lazy-load="true"
                ></image>
                <div
                  v-if="dealPromotionGapImgShow(sortItem, productItem)"
                  class="goods-tip"
                >
                  <div
                    v-if="productItem.salableStockQty === 0"
                    class="goods-tip-text"
                  >
                    无货
                  </div>
                  <div v-else class="goods-tip-text">未达<br />门槛</div>
                </div>
              </div>
              <div class="goods-info">
                <div
                  class="goods-info-title"
                  :style="{
                    color: shop.type == '失效商品' ? '#999' : '#1F1F1F',
                  }"
                  @click="onProductClick(productItem, index)"
                >
                  <span
                    v-if="productItem.identifier === 2"
                    class="goods-info-title-gift"
                    >赠品</span
                  >{{ productItem.itemName }}
                </div>
                <div
                  class="goods-info-attr"
                  :style="{
                    color: shop.type == '失效商品' ? '#999' : '#666666',
                  }"
                >
                  {{ shop.type == "失效商品" ? "已失效" : productItem.skuName }}
                  <!-- <i class="iconfont">&#xe735;</i> -->
                </div>
                <view class="offers-card" v-if="hasCoupon(productItem.itemId)">
                  <view
                    class="offers-card-tag"
                    v-for="(couponInfo, couponIndex) in hasCoupon(
                      productItem.itemId
                    )"
                    :key="couponIndex"
                  >
                    {{
                      formatDiscount(
                        couponInfo.rightType,
                        couponInfo.rule,
                        couponInfo.promotionName
                      )
                    }}
                  </view>
                  <view
                    class="vipTag offers-card-tag"
                    v-if="productItem.score && productItem.score > 0"
                    >V{{ pdLevelIndex }}会员返{{ productItem.score }}胖豆</view
                  >
                </view>
                <div class="goods-info-bottom" v-if="productItem.effective">
                  <goods-price
                    :sale-price="productItem.skuPrice"
                    :sale-sign-font-size="23"
                    :sale-price-integer-font-size="35"
                    :sale-price-decimal-font-size="23"
                    :sale-color="shop.type == '失效商品' ? '#999' : '#FE2442'"
                  ></goods-price>
                  <div>
                    <template v-if="productItem.identifier === 2">
                      <div>x{{ productItem.skuQty }}</div>
                    </template>
                    <template v-else>
                      <u-number-box
                        :name="productItem.skuId"
                        v-model="productItem.skuQty"
                        :max="maxBuyNum(productItem)"
                        min="1"
                        @blur="(e) => numberBlur(e, productItem)"
                        :asyncChange="true"
                      >
                        <template #minus>
                          <view
                            :class="[
                              'minus',
                              productItem.skuQty <= 1 ? 'disable' : '',
                            ]"
                            @click="handleMinusClick(productItem)"
                          >
                          </view>
                        </template>
                        <template #plus>
                          <view
                            :class="[
                              'plus',
                              isDisabledPlus(productItem) ? 'disable' : '',
                            ]"
                            @click="handlePlusClick(productItem)"
                          >
                          </view>
                        </template>
                      </u-number-box>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </div>
    </div>
    <GoodsUpdatePopView
      :show.sync="showSpecsPopView"
      @onClose="showSpecsPopView = false"
    />
    <!-- <CleanGoodsPopup
      :show="showCleanPopup"
      :lapseGoodsNum="lapseGoodsNum"
      @onClose="showCleanPopup = false"
      @cleanAll="cleanAll"
    /> -->
  </div>
</template>

<script>
import { postDeleteSku, CLEAN_INVALID_GOODS } from "@/api/cart";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import GoodsUpdatePopView from "../goodsUpdatePopView/index.vue";
import { action_report } from "@/utils/track";
import { formatDiscount } from "@/utils/index";
import CleanGoodsPopup from "../cleanGoodsPopup/index.vue";
export default {
  components: { GoodsPrice, GoodsUpdatePopView, CleanGoodsPopup },
  props: {
    isManager: {
      type: Boolean,
      default: false,
    },
    shopIndex: {
      type: Number,
      default: 0,
    },
    shop: {
      type: Object,
      default: {
        activityList: [{}],
        cartSkuList: [{}],
        mySortSkuList: [
          {
            activity: {},
            skuList: [{}],
          },
        ],
        name: "",
        checked: false,
        type: "",
      },
    },
    couponList: {
      type: Array,
      default: [],
    },
    pdLevelIndex: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      formatDiscount,
      showSpecsPopView: false,
      newShop: this.shop,
      showCleanPopup: false,
      lapseGoodsNum: 0,
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#FF3F48",
          },
        },
      ],
      isRefresh: true,
    };
  },
  watch: {
    shop(newVal, oldVal) {
      // this.$nextTick(() => {
      //   this.newShop = newVal;
      //   this.isRefresh = true;
      // });
      setTimeout(() => {
        this.newShop = newVal;
        this.isRefresh = true;
      }, 10);
    },
  },
  computed: {
    isDisabledPlus() {
      return (item) => {
        // console.log(
        //   `skuQty: ${item.skuQty} | maxBuyNum: ${this.maxBuyNum(
        //     item
        //   )} | salableStockQty: ${item.salableStockQty} | cloudStockQty: ${
        //     item.cloudStockQty || 0
        //   }`
        // );
        const res =
          item.skuQty === this.maxBuyNum(item) &&
          (this.shop.shopType === 1 ||
            item.salableStockQty >= (item.cloudStockQty || 0));
        // console.log("是否禁用：", res);
        return res;
      };
    },

    iconSrc() {
      return (productItem) => {
        const cacheKey = JSON.stringify({ ...productItem, isManager: this.isManager });
        const ICON_URLS = {
          disabled: "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/cart-disabledsel.png",
          selected: "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/cart-selected-v2.png",
          noselect: "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/cart-noselect-v2.png",
        };

        const isEffective = productItem.effective;
        const disabled = !isEffective;

        if (disabled) {
          return ICON_URLS.disabled;
        }

        const checked = this.isManager ? productItem.checked : isEffective && productItem.checked;

        return checked ? ICON_URLS.selected : ICON_URLS.noselect;
      };
    },
  },
  onLoad() {},
  methods: {
    // async cleanAll() {
    //   //清空所有失效数据 todo
    //   try {
    //     const res = await CLEAN_INVALID_GOODS({
    //       cartType: 1,
    //     });
    //     this.showCleanPopup = false;
    //     this.$emit("onDeleteSkuSuccess");
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },
    cleanGoods(num) {
      this.$emit("showCleanPop", num);
      // console.log("失效商品点击打开弹窗", num);
      // this.showCleanPopup = true;
      // this.lapseGoodsNum = num;
    },
    beginRefresh() {
      this.isRefresh = false;
    },
    checkboxChange(e) {
      console.log(e);
    },
    async requestDeleteSku({ shopId, skuId, itemName }) {
      const res = await postDeleteSku({
        shopId,
        skuId,
        cartType: 1,
      });
      uni.showToast({
        icon: "none",
        title: "删除成功",
      });
      this.$emit("onDeleteSkuSuccess");
    },
    deleteProduct(productItem) {
      const item = productItem;
      action_report({
        action_name: "shoppingcart_removal_click",
        module_name: "shop",
        extend: {
          commodity_name: item.itemName,
          commodity_id: item.itemId,
        },
      });
      this.requestDeleteSku({
        shopId: item.shopId,
        skuId: item.skuId,
        itemName: item.itemName,
      });
    },
    changeAttr() {
      this.showSpecsPopView = true;
    },
    onCheckShopAllChange(e) {
      this.$emit("onCheckShopAllChange", this.shopIndex);
    },
    onCheckProductChange(groupIndex, productIndex) {
      this.beginRefresh();
      this.$emit("onCheckProductChange", {
        shopIndex: this.shopIndex,
        groupIndex,
        productIndex,
      });
    },
    numberBlur(e, productItem) {
      console.log("离开", e, productItem, this.shop);
      if (e.value) {
        this.$emit("onNumberChange", {
          shopId: productItem.shopId,
          sku: productItem,
          skuQty: e.value,
        });
      }
    },
    onProductClick(productItem, index) {
      if (this.shop.type == "失效商品") {
        return;
      }
      uni.$u.debounce(() => {
        const pageUrl = `/pagesC/goodsServiceDetail/index?itemId=${
          productItem.itemId
        }&skuId=${productItem.skuId || ""}&isCart=true&shopId=${
          productItem.shopId
        }`;
        //#ifdef H5
        // this.$dsBridge.call("gotoPageThroughRoute", {
        //   page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${productItem.itemId}&shopId=${productItem.shopId}`,
        // });
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#${pageUrl}&transparentTopBar=1`,
        });
        //#endif
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: pageUrl,
        });
        // #endif
      }, 500);
    },
    //最大购买数量
    maxBuyNum(productItem) {
      return productItem.salableStockQty > 99
        ? 99
        : productItem.salableStockQty;
    },
    //是否有优惠券
    hasCoupon(itemId) {
      const couponInfo = this.couponList.find((item) => item.itemId == itemId);
      return couponInfo && couponInfo.couponsList;
    },
    // 促销提示
    dealPromotionGapTip(sortItem) {
      const activity = sortItem.activity;
      if (!activity) {
        return "";
      }
      if (activity.meetThreshold) {
        let leftString = "";
        if (activity.rule.threshold) {
          leftString = `已满${activity.rule.threshold}元，`;
        }
        if (activity.rule.quantity) {
          leftString = `已满${activity.rule.quantity}件，`;
        }
        // n元任选m件
        if (activity.rule.optionalQty) {
          leftString = `已满${activity.rule.optionalQty}件，`;
        }
        // 处理阶梯
        const totalCheckedQty = sortItem.skuList.reduce(function (acc, obj) {
          if (obj.checked) {
            return acc + obj.skuQty;
          }
          return acc;
        }, 0);
        const totalCheckedPrice = sortItem.skuList.reduce(function (acc, obj) {
          if (obj.checked) {
            return acc + obj.skuAmount;
          }
          return acc;
        }, 0);
        if (activity.rule.firstPhase) {
          if (
            activity.rule.firstPhase.quantity &&
            totalCheckedQty >= activity.rule.firstPhase.quantity
          ) {
            leftString = `已满${activity.rule.firstPhase.quantity}件，`;
          }
          if (
            activity.rule.firstPhase.threshold &&
            totalCheckedPrice >= activity.rule.firstPhase.threshold
          ) {
            leftString = `已满${activity.rule.firstPhase.threshold}元，`;
          }
        }
        if (activity.rule.secondPhase) {
          if (
            activity.rule.secondPhase.quantity &&
            totalCheckedQty >= activity.rule.secondPhase.quantity
          ) {
            leftString = `已满${activity.rule.secondPhase.quantity}件，`;
          }
          if (
            activity.rule.secondPhase.threshold &&
            totalCheckedPrice >= activity.rule.secondPhase.threshold
          ) {
            leftString = `已满${activity.rule.secondPhase.threshold}元，`;
          }
        }
        if (activity.rule.thirdPhase) {
          if (
            activity.rule.thirdPhase.quantity &&
            totalCheckedQty >= activity.rule.thirdPhase.quantity
          ) {
            leftString = `已满${activity.rule.thirdPhase.quantity}件，`;
          }
          if (
            activity.rule.thirdPhase.threshold &&
            totalCheckedPrice >= activity.rule.thirdPhase.threshold
          ) {
            leftString = `已满${activity.rule.thirdPhase.threshold}元，`;
          }
        }
        let centerString = "已享优惠";
        if (activity.activityAmount) {
          centerString = `已减${activity.activityAmount}元`;
        }
        if (activity.rule.gift) {
          centerString = "已领赠品";
        }
        return leftString + centerString;
      }
      // 处理阶梯已满足部分文案
      let leftString = "";
      if (activity.activityAmount) {
        leftString = `已减${activity.activityAmount}元,`;
      }
      // 处理未满足文案
      let centerString = "";
      let oopsStr = leftString.length > 0 ? "再凑" : "还差";
      if (activity.gapQty) {
        centerString = `${oopsStr}${activity.gapQty}件,`;
      } else if (activity.thresholdGapAmount) {
        centerString = `${oopsStr}${activity.thresholdGapAmount}元,`;
      }
      let rightString = "可享优惠";
      if (activity.giftInfo) {
        rightString = "可领赠品";
      } else if (activity.expectedDiscountAmount) {
        rightString = `可减${activity.expectedDiscountAmount}元`;
      } else if (activity.expectedDiscount) {
        rightString = `可打${(activity.expectedDiscount * 10).toFixed(1)}折`;
      }
      return leftString + centerString + rightString;
    },
    // 促销赠品标识是否显示处理
    dealPromotionGapImgShow(sortItem, productItem) {
      if (productItem.identifier === 2 && sortItem.activity) {
        if (!sortItem.activity.meetThreshold) {
          if (!sortItem.activity.totalAmount) {
            return true;
          }
        }
      }
      if (productItem.salableStockQty === 0) {
        return true;
      }
      return false;
    },
    // 促销提示是否显示处理
    dealPromotionTipShow(sortItem) {
      if (!sortItem.activity) {
        return false;
      }
      const checkedSkus = sortItem.skuList.filter((item) => item.checked);
      return checkedSkus.length > 0 && sortItem.activity.rightType !== 331;
    },
    // 去促销页
    goPromotionPage(shop) {
      action_report({
        action_name: shop.activity.meetThreshold
          ? "shoppingcart_zaiguangguang_click"
          : "shoppingcart_qucoudan_click",
        module_name: "shoppingcart",
        extend: {},
      });
      uni.navigateTo({
        url: `/pagesC/promotionGoodsList/index?activityId=${shop.activity.activityId}&shopId=${this.shop.shopId}`,
      });
    },
    handleMinusClick(item) {
      if (item.skuQty <= 1) {
        return;
      }
      console.log("数量减1", item);
      this.$emit("onNumberChange", {
        shopId: item.shopId,
        sku: item,
        skuQty: item.skuQty - 1,
      });
    },
    handlePlusClick(item) {
      if (this.isDisabledPlus(item)) {
        return;
      }
      console.log("数量加1", item);
      this.$emit("onNumberChange", {
        shopId: item.shopId,
        sku: item,
        skuQty: item.skuQty + 1,
      });
    },
    /*购物车前勾选图标*/
    handleMatchIcon(item) {
      let url = "";
      let checked = this.isManager
        ? item.checked
        : !item.effective
        ? false
        : item.checked;

      let disabled = this.isManager ? !item.effective : !item.effective;
      if (disabled) {
        url =
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/cart-disabledsel.png";
      } else {
        if (checked) {
          url =
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/cart-selected-v2.png";
        } else {
          url =
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/cart-noselect-v2.png";
        }
      }
      return url;
    },
  },
};
</script>

<!-- <style>
page {
  height: 100%;
  width: 100%;
}
</style> -->

<style scoped lang="scss">
@import "./index.scss";
</style>
