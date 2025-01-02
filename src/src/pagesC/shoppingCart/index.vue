<template>
  <view class="cart-page" :style="!offerShow ? 'height: 100vh' : ''">
    <view class="tool-card">
      <view class="bg-view tool-card-address" @click="addressClickHandler">
        <i class="iconfont icon-address-cart"></i>
        <view class="tool-card-address-text">{{
          addressInfo.address || "选择收货地址"
        }}</view>
        <i class="iconfont icon-arrowDown"></i>
      </view>
      <view
        v-if="cartShops.length > 0"
        class="bg-view tool-card-btn"
        @click="manageClickHandler"
        >{{ isManager ? "完成" : "管理" }}</view
      >
    </view>
    <scroll-view class="scroll" scroll-y :style="scrollHeight">
      <template v-if="cartShops && cartShops.length > 0">
        <shop-goods
          ref="shopGoodsRef"
          v-for="(item, index) in cartShops"
          :key="index"
          :shop="item"
          :shopIndex="index"
          :isManager="isManager"
          :couponList="couponList"
          :pdLevelIndex="pdLevelIndex"
          @onCheckProductChange="onCheckProductChange"
          @onCheckShopAllChange="onCheckShopAllChange"
          @onNumberChange="onNumberChange"
          @onDeleteSkuSuccess="getCartList"
          @showCleanPop="showCleanPop"
        ></shop-goods>
      </template>
      <empty-cart v-if="cartShops.length === 0">
        <u-loading-page
          v-if="showOverlay"
          :loading="true"
          loading-text="努力加载中…… "
          color="#333"
          font-size="16"
        ></u-loading-page>
      </empty-cart>
      <like-goods
        v-if="storeInfo.shopId"
        :skuIdList="skuIdList"
        :shopId="storeInfo.shopId"
      ></like-goods>
    </scroll-view>
    <view class="cart-footer" v-if="cartShops.length > 0">
      <view class="cart-footer-content">
        <u-checkbox-group @change="onCheckAllChange">
          <u-checkbox
            name="all"
            :disabled="allcheckDisabled"
            :checked="allChecked"
            shape="circle"
            activeColor="#FE2442"
            label="全选"
          ></u-checkbox
        ></u-checkbox-group>
        <view v-if="isManager" class="cart-footer-content-right">
          <view class="delete-btn" @click="$u.debounce(deleteCart, 500)">
            删除{{
              selectedSkuList.length > 0
                ? "(" + selectedSkuList.length + ")"
                : ""
            }}
          </view>
        </view>
        <view v-else class="cart-footer-content-right">
          <view class="price-card" @click="showOffersInfo">
            <div class="total-price">
              <div class="total-price-text">合计:</div>
              <div style="margin-bottom: 5rpx">
                <goods-price
                  :sale-price="totalPrice"
                  :sale-sign-font-size="23"
                  :sale-price-integer-font-size="35"
                  :sale-price-decimal-font-size="23"
                  :sale-color="'#FE2442'"
                ></goods-price>
              </div>
            </div>
            <view class="offers-price" v-if="changeAmount > 0">
              优惠￥{{ changeAmount }} 明细 <i class="iconfont icon-arrowUp"></i
            ></view>
          </view>

          <view class="over-btn" @click="$u.debounce(overClickHandler, 500)">
            结算{{
              checkedSkuListByCan.length > 0
                ? "(" + checkedSkuListByCan.length + ")"
                : ""
            }}
          </view>
        </view>
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </view>
    <CouponDetailPopView
      ref="couponPopViewRef"
      :show="offerShow"
      :priceDetail="priceInfo"
      :couponInfo="couponInfo"
      :picList="checkedPicByCan"
      :shops="cartShops"
      @onClose="closeOffer"
    ></CouponDetailPopView>
    <InventorySwitchPop
      :isOpen.sync="isShowInventorySwitchPop"
      @close="handleCancelSwitchInventory"
      @confirm="handleConfirmSwitchInventory"
    />
    <CleanGoodsPopup
      :show="showCleanPopup"
      :lapseGoodsNum="lapseGoodsNum"
      @onClose="showCleanPopup = false"
      @cleanAll="cleanAll"
    />
  </view>
</template>

<script>
import CleanGoodsPopup from "./components/cleanGoodsPopup/index.vue";
import {
  queryRangeStore,
  queryCartList,
  postUpdateSkuNum,
  postBatchDeleteSku,
  postCheckedAll,
  postCheckedSku,
  postCheckedStore,
  postCouponList,
  GET_SHOP_LIST,
  GET_CLOUD_SALE_STOCK_LIST,
  postDeleteSku,
  addCart,
  CLEAN_INVALID_GOODS,
} from "@/api/cart";
import EmptyCart from "./components/emptyCart";
import LikeGoods from "./components/likeGoods";
import ShopGoods from "./components/shopGoods";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import { mapState, mapMutations } from "vuex";
import CouponDetailPopView from "./components/couponDetailPopView";
import { action_report } from "@/utils/track";
import InventorySwitchPop from "@/pagesC/components/inventorySwitchPop/index.vue";
export default {
  components: {
    InventorySwitchPop,
    EmptyCart,
    LikeGoods,
    ShopGoods,
    GoodsPrice,
    CouponDetailPopView,
    CleanGoodsPopup,
  },

  data() {
    return {
      showCleanPopup: false,
      lapseGoodsNum: 0,
      cartInfo: {},
      shops: [],
      cloudShops: [],
      isManager: false,
      addressInfo: {},
      storeInfo: {},
      offerShow: false,
      showOverlay: true,
      couponList: [],
      isShowInventorySwitchPop: false,
      inventorySwitchInfo: null,
      allcheckDisabled: false,
    };
  },

  computed: {
    //是否全都是虚拟商品
    hasVirtual() {
      const res = this.shops?.find(function (item) {
        if (item.type != "失效商品") {
          return item.cartSkuList?.find(function (item) {
            return !item.virtualized;
          });
        }
      });
      return !res;
    },

    scrollHeight() {
      if (this.cartShops.length > 0) {
        return "height: calc(100vh - 193rpx - 95rpx - 40rpx)";
      }
      return "height: calc(100vh  - 95rpx - 40rpx)";
    },
    allChecked() {
      let allchecked = false;

      const normalGoods = this.cartShops.filter(
        (item) => item?.type !== "失效商品"
      ); //普通商品
      if (normalGoods?.length) {
        this.allcheckDisabled = false;
        allchecked = normalGoods.every((item) => item.checked);
      } else {
        allchecked = false;
        this.allcheckDisabled = true; //只有无效商品置灰
      }
      return allchecked;
    },
    cartShops() {
      this.shops.forEach((shop) => {
        // const uncheckedCartSkuList = this.filterUncheckedProduct(
        //   shop.cartSkuList
        // );
        // shop.checked = uncheckedCartSkuList.length === 0;
        // 处理促销数据
        let mySortSkuList = [];
        if (shop.activityList && shop.activityList.length) {
          for (const myValueKey in shop.activityList) {
            let activity = shop.activityList[myValueKey];
            const skuList = shop.cartSkuList.filter((item) => {
              return item.activityId === activity.activityId;
            });
            mySortSkuList.push({
              activity: activity,
              skuList: skuList,
              shopName: shop.shopName,
            });
          }
          const skuList = shop.cartSkuList.filter((item) => {
            return !item.activityId;
          });
          if (skuList.length) {
            mySortSkuList.push({
              activity: null,
              skuList,
              shopName: shop.shopName,
            });
          }
        } else {
          mySortSkuList = [
            {
              activity: null,
              skuList: shop.cartSkuList,
              shopName: shop.shopName,
            },
          ];
        }

        shop.mySortSkuList = mySortSkuList;
        shop.alertSortSkuList = mySortSkuList.filter((item) => {
          return (
            item.activity &&
            (item.activity.meetThreshold || item.activity.totalAmount)
          );
        });
      });
      return this.shops;
    },
    //商品的选中状态
    selectedSkuList() {
      const skuList = [];
      this.cartShops.forEach((shop) => {
        shop.mySortSkuList.forEach((sortItem) => {
          sortItem.skuList.forEach((sku) => {
            if (sku.checked) {
              skuList.push(sku.skuId);
            }
          });
        });
      });

      const newSkuList = Array.from(new Set(skuList));

      return newSkuList;
    },
    // 有效商品的选中
    checkedSkuListByCan() {
      const skuList = [];
      this.cartShops.forEach((shop) => {
        if (shop.type != "失效商品") {
          shop.mySortSkuList.forEach((sortItem) => {
            sortItem.skuList.forEach((sku) => {
              if (sku.checked) {
                skuList.push(sku.skuId);
              }
            });
          });
        }
      });
      const newSkuList = Array.from(new Set(skuList));
      return newSkuList;
    },
    // 有效商品的选中的有优惠券的商品图片
    checkedPicByCan() {
      const itemList = [];
      const picList = [];
      this.cartShops.forEach((shop) => {
        if (shop.type != "失效商品") {
          shop.cartSkuList.forEach((sku) => {
            if (sku.checked) {
              itemList.push(sku);
            }
          });
        }
      });
      this.couponInfo?.itemIdList?.map((id) => {
        if (itemList.find((item) => item.itemId === id)) {
          picList.push(
            itemList.find((item) => item.itemId === id).majorPicture
          );
        }
      });
      console.log("优惠cartShops", this.cartShops);
      console.log("优惠couponInfo", this.couponInfo);
      console.log("优惠itmList", itemList);
      console.log("优惠pic", picList);
      return picList;
    },
    skuIdList() {
      const skuList = [];
      console.log("shopss==", this.cartShops);
      this.cartShops.forEach((shop) => {
        shop.mySortSkuList.forEach((sortItem) => {
          sortItem.skuList.forEach((sku) => {
            if (sku.checked) {
              skuList.push(sku.skuId);
            }
          });
        });
      });
      console.log("list===", skuList);
      return skuList;
    },
    totalPrice() {
      return this.cartInfo?.priceDetail?.payAmount || 0;
    },
    changeAmount() {
      return this.cartInfo?.priceDetail?.changeAmount || 0;
    },
    priceInfo() {
      return this.cartInfo?.priceDetail || {};
    },
    //优惠券信息
    couponInfo() {
      return this.cartInfo?.couponDetail || {};
    },
    pdLevelIndex() {
      return this.cartInfo?.levelIndex || "";
    },
  },

  onLoad() {
    const info = uni.getStorageSync("storage_info") || {};
    // #ifdef MP-WEIXIN
    if (info.token) {
      const lastSearchAddressObj = uni.getStorageSync(
        "mall_last_search_address_obj"
      );
      this.addressInfo = lastSearchAddressObj || {};
      this.getCartList();
      this.getRangeStore();
    }
    // #endif
  },

  onShow() {
    console.log("🚀 ~ onShow ~ onShow:触发onshow");

    const info = uni.getStorageSync("storage_info") || {};

    if (!info.token) {
      this.showOverlay = false;
    }
    // #ifdef MP-WEIXIN
    const lastSearchAddressObj = uni.getStorageSync(
      "mall_last_search_address_obj"
    );
    this.addressInfo = lastSearchAddressObj || {};
    // #endif
  },
  onReady() {
    // #ifdef H5
    this.$dsBridge.register("refreshCartPage", this.h5getAddress);
    this.h5getAddress();
    // #endif
  },
  onPullDownRefresh() {
    console.log("----------------------");
    console.log("🤣--下拉刷新");
    const info = uni.getStorageSync("storage_info") || {};
    if (info.token) {
      this.getCartList();
    }
  },

  methods: {
    ...mapMutations(["setSelectedAddress"]),
    showCleanPop(data) {
      this.showCleanPopup = true;
      this.lapseGoodsNum = data;
    },
    async cleanAll() {
      //清空所有失效数据 todo
      try {
        const res = await CLEAN_INVALID_GOODS({
          cartType: 1,
        });
        this.showCleanPopup = false;
        this.getCartList();
        // this.$emit("onDeleteSkuSuccess");
      } catch (e) {
        console.log(e);
      }
    },
    h5getAddress() {
      console.log("🚀 ~ h5getAddress ~ 触发h5getAddress:");
      this.addressInfo = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
        ? JSON.parse(
            this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
            {}
          )
        : {};
      const info = uni.getStorageSync("storage_info") || {};

      if (info.token) {
        this.getRangeStore();
      }
    },
    async getRangeStore() {
      console.log("购物车最近门店===>", this.addressInfo);
      try {
        if (
          !this.addressInfo.lat ||
          this.addressInfo.lat == "0.0" ||
          !this.addressInfo.lon ||
          this.addressInfo.lon == "0.0"
        ) {
          this.storeInfo = { shopId: 0 };
          this.getCartList();
          return;
        }
        const {
          data: { data },
        } = await queryRangeStore({
          errorNo: "1",
          lat: this.addressInfo.lat,
          lon: this.addressInfo.lon,
          cityCode:
            this.addressInfo?.cityCode || this.addressInfo?.adcode
              ? (this.addressInfo?.cityCode || this.addressInfo?.adcode).slice(
                  0,
                  4
                ) + "00"
              : "",
        });

        if (data) {
          this.storeInfo = data;
          this.getCartList();
        } else {
          this.storeInfo = { shopId: 0 };
          this.getCartList();
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    async getCartList() {
      try {
        const { data } = await queryCartList({
          shopId: this.storeInfo.shopId || 0,
          cartType: 1,
          sourceType: 5,
          supportActivity: true,
        });
        uni.stopPullDownRefresh();
        console.log("🚀 ~ file: index.vue:415 ~ getCartList ~ data:", data);

        const { data: cartInfo } = data || {};
        let noGoods = [];
        const updatedCartShopList = cartInfo.cartShopList.filter((shop) => {
          shop.cartSkuList = shop.cartSkuList.filter((sku) => {
            if (!sku.effective) {
              noGoods.push({ ...sku });
            }
            return sku.effective;
          });
          return shop.cartSkuList.length > 0;
        });
        if (noGoods.length > 0) {
          updatedCartShopList.push({
            cartSkuList: noGoods,
            type: "失效商品",
            shopType: 0,
            checked: true,
          });
        }
        this.cartInfo = { ...cartInfo, cartShopList: updatedCartShopList };
        this.shops = updatedCartShopList;
        await this.getCouponInfo(updatedCartShopList);
        await this.getCloudSaleStock();
      } catch (error) {
        this.cartInfo = {};
        this.shops = [];
        uni.stopPullDownRefresh();
      } finally {
        this.showOverlay = false;
      }
    },

    //获取优惠券信息
    async getCouponInfo(cartList) {
      const validShop = cartList.filter((shop) => {
        return shop.type != "失效商品";
      });

      let itemInfoDTOList = [];
      validShop.map((shop) => {
        shop.cartSkuList.map((item) => {
          itemInfoDTOList.push({
            itemId: item.itemId,
            price: item.skuAmount,
            shopId: item.shopId,
          });
        });
      });
      try {
        const res = await postCouponList({
          itemInfoDTOList,
          // #ifdef MP-WEIXIN
          channel: "MINI",
          // #endif
          //#ifdef H5
          channel: "APP",
          // #endif
        });
        const { data } = res;
        const { data: couponList } = data || {};
        this.couponList = couponList;
      } catch (error) {}
    },

    handleManagement() {},
    // 选择地址
    addressClickHandler() {
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/mall/selectAddress`,
      });
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/mallAddress/index`,
        events: {
          resultEvent: async (res) => {
            console.log("当前选择地址：", res.data);
            // 首页需要联动更改地址
            // uni.setStorageSync("mall_last_search_address_obj", res.data);

            this.setSelectedAddress(res.data);
            let { address, lat, lon, cityCode, adcode } = res.data;
            this.addressInfo = {
              address,
              lat,
              lon,
              cityCode,
              adcode,
            };
            // const info = uni.getStorageSync("storage_info") || {};
            // if (info.token) {
            //   this.getRangeStore();
            // }
          },
        },
      });
      // #endif
    },
    // 获取所有云超店铺商品库存
    async getCloudSaleStock() {
      const skuIdList = (this.shops || [])
        .filter((e) => {
          return Number(e.shopType || "0") !== 1;
        })
        .flatMap((e) => {
          return (e.cartSkuList || []).map((e) => {
            return e.skuId;
          });
        });
      try {
        const res = await GET_CLOUD_SALE_STOCK_LIST({
          skuIdList,
        });
        this.cloudShops = res.data.data?.saleStockList || [];
        this.shops = this.shops.map((e) => {
          return {
            ...e,
            cartSkuList: e.cartSkuList.map((v) => {
              const cloudStock =
                this.cloudShops.find((n) => n.skuId === v.skuId)
                  ?.salableStockQty || 0;
              return {
                ...v,
                cloudStockQty: Number(cloudStock),
              };
            }),
          };
        });
      } catch (_) {}
    },
    manageClickHandler() {
      this.isManager = !this.isManager;
    },

    // 删除购物车
    async deleteCart() {
      const { selectedSkuList } = this;
      if (selectedSkuList.length === 0) {
        uni.showToast({
          title: "请选择商品",
          icon: "none",
        });
        return;
      }
      await postBatchDeleteSku({
        cartType: 1,
      });
      uni.showToast({
        title: "删除成功",
        icon: "none",
      });
      this.getCartList();
    },

    // 过滤未选择的商品
    filterUncheckedProduct(cartSkuList) {
      return cartSkuList.filter((item) =>
        this.isManager ? !item.checked : item.effective ? !item.checked : false
      );
    },
    // 店铺勾选
    async onCheckShopAllChange(shopIndex) {
      console.log("shopIndex", shopIndex);
      const res = await postCheckedStore({
        checked: !this.cartShops[shopIndex].checked,
        shopId: this.cartShops[shopIndex].shopId,
        cartType: 1,
      });
      this.getCartList();
    },
    // 商品勾选
    async onCheckProductChange({ shopIndex, groupIndex, productIndex }) {
      console.log(shopIndex, "===", groupIndex, "===", productIndex);
      console.log("cartShops", this.cartShops[shopIndex]);
      if (this.cartShops[shopIndex].type == "失效商品") return;
      const res = await postCheckedSku({
        checked:
          !this.cartShops[shopIndex].mySortSkuList[groupIndex].skuList[
            productIndex
          ].checked,
        shopId:
          this.cartShops[shopIndex].mySortSkuList[groupIndex].skuList[
            productIndex
          ].shopId,
        skuId:
          this.cartShops[shopIndex].mySortSkuList[groupIndex].skuList[
            productIndex
          ].skuId,
        cartType: 1,
      });
      this.getCartList();
    },
    // 勾选全部
    async onCheckAllChange() {
      try {
        const newCheckedStatus = !this.allChecked;
        const res = await postCheckedAll({
          checked: newCheckedStatus,
          cartType: 1,
        });
        console.log("勾选全部操作结果:", res);
        // 刷新购物车列表
        this.getCartList();
      } catch (error) {
        console.error("勾选全部操作失败:", error);
      }
    },
    async requestUpdateNumber({ shopId, skuId, skuQty }) {
      try {
        const res = await postUpdateSkuNum({
          shopId,
          skuId,
          skuQty,
          cartType: 1,
        });
        uni.hideLoading();
        this.getCartList();
      } catch (error) {
        uni.hideLoading();
        this.getCartList();
      }
    },
    onNumberChange({ shopId, sku, skuQty }) {
      console.log("目标数量：", skuQty, "当前数量：", sku.skuQty);
      const prevQty = sku.skuQty;
      const shop = this.shops.find((e) => e.shopId === shopId);
      const cartSku = (shop?.cartSkuList || []).find(
        (e) => e.skuId === sku.skuId
      );
      cartSku.skuQty = skuQty;

      let num = skuQty || 1;
      if (num > 99) {
        num = 99;
      }
      if (num > sku.salableStockQty) {
        const cloudStockQty =
          this.cloudShops.find((e) => e.skuId === sku.skuId)?.salableStockQty ||
          0;
        if (num > cloudStockQty || cloudStockQty === 0) {
          num = sku.salableStockQty;
        } else {
          this.isShowInventorySwitchPop = true;
          this.inventorySwitchInfo = {
            shopId: shopId,
            cloudShopId: this.cloudShops.find((e) => e.skuId === sku.skuId)
              ?.shopId,
            skuId: sku.skuId,
            skuQty: skuQty,
            prevQty,
          };
          return;
        }
      }
      uni.showLoading({ mask: true });
      uni.$u.debounce(() => {
        this.requestUpdateNumber({ shopId, skuId: sku.skuId, skuQty: num });
      }, 1000);
    },
    overClickHandler() {
      action_report({
        action_name: "shoppingcart_settlement_click",
        module_name: "shop",
      });
      if (this.checkedSkuListByCan.length <= 0) {
        uni.showToast({
          title: "您还没有选择宝贝呢",
          icon: "none",
        });
        return;
      }
      // 存储商品shopId 用于确认订单页面同城配送兜底
      uni.setStorageSync("mallShopId", this.storeInfo.shopId);
      this.closeOffer();
      // #ifdef H5
      if (this.hasVirtual) {
        //服务
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/flutter?entryPoint=offlineConfirmOrder&cartType=1`,
        });
      } else {
        //实物
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/flutter?entryPoint=onlineConfirmOrder&cartType=1`,
        });
      }
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/submitOrder/index?&shopId=${this.storeInfo.shopId}&cartType=1&type=mall`,
      });
      // #endif
    },
    showOffersInfo() {
      if (this.changeAmount <= 0) {
        return;
      }
      this.offerShow = !this.offerShow;
    },
    closeOffer() {
      this.offerShow = false;
    },
    async handleConfirmSwitchInventory() {
      // 先删除
      // 再添加
      // 再刷新
      await uni.showLoading({ mask: true });
      const { shopId, cloudShopId, skuId, skuQty, prevQty } =
        this.inventorySwitchInfo;
      const shop = this.shops.find((e) => e.shopId === shopId);
      const cartSku = (shop?.cartSkuList || []).find(
        (e) => e.skuId === skuId && e.shopId === shopId
      );
      cartSku.skuQty = prevQty;
      try {
        await postDeleteSku({
          shopId,
          skuId,
          cartType: 1,
        });
        await addCart({
          cartType: 1,
          shopId: cloudShopId,
          skuId: skuId,
          skuQty: skuQty,
          tenantId: "default_tenant",
        });
        await this.getCartList();
        uni.hideLoading();
      } catch (_) {
        uni.hideLoading();
      }
    },
    async handleCancelSwitchInventory() {
      const { shopId, cloudShopId, skuId, skuQty, prevQty } =
        this.inventorySwitchInfo;
      const shop = this.shops.find((e) => e.shopId === shopId);
      const cartSku = (shop?.cartSkuList || []).find(
        (e) => e.skuId === skuId && e.shopId === shopId
      );
      cartSku.skuQty = prevQty;
    },
  },
};
</script>

<style>
page {
  height: 100%;
  width: 100%;
  background-color: #f7f8fc;
}
</style>

<style scoped lang="scss">
@import "./index.scss";
</style>
