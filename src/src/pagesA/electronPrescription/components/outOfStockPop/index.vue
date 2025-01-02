<template>
  <view>
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
          <view class="title">提示</view>
          <view class="close-icon" @click="handleCancel"></view>
        </view>

        <view class="lineImg"> </view>
        <!-- couponList.length > 2 ? 'height-max' : 'height-common', -->
        <view :class="['list-wrapper']">
          <view class="prompt-des">
            {{
              inStockProducts.length
                ? "很抱歉，当前处方中部分药品目前缺货，建议线下药店/医院购买"
                : "很抱歉，当前处方中药品均已缺货，建议线下药店/医院购买"
            }}
          </view>
          <view class="frame-up">
            <view class="frame-up-title"> 缺货商品 </view>
            <view
              class="frame-up-drugs"
              v-for="(item, index) in outOfStockProducts"
              :key="index"
            >
              <view class="drug">{{ item.productName }} </view>
            </view>
          </view>
          <view class="middle-title"
            >{{
              `您仍可继续购买下列商品（${
                inStockProducts.length > 0 ? inStockProducts.length : 0
              }种）`
            }}
          </view>
          <view class="frame-buttom" v-if="inStockProducts.length > 0">
            <view
              class="frame-buttom-drugs"
              v-for="(item, index) in inStockProducts"
              :key="index"
            >
              <view class="drug">
                <view class="name">{{ item.productName }} </view>
                <view class="num"
                  >{{ `x ${item.quantity} ${item.quantityUnit}` }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="footers">
        <view class="new" @click="handleConfirm" v-if="inStockProducts.length">
          <view class="text">继续购药</view>
        </view>
        <view v-else class="no">
          <view class="text">继续购药</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { action_report } from "@/utils/track";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    inStockProducts: {
      type: Array,
      default() {
        return [];
      },
    },
    outOfStockProducts: {
      type: Array,
      default() {
        return [];
      },
    },
    diagnosticSheetId: {
      type: String,
    },
    source: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["userSelectedPetId"]),
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    handleOpen() {
      console.log("inStockProducts", this.inStockProducts);
    },
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleConfirm() {
      action_report({
        action_name: "pop_transaction",
        module_name: "transaction",
      });
      // #ifdef H5
      if (this.source == 30) {
        this.$pinganPlugin.openPage(
          `${window.location.origin}/crm-medical-h5/#/pagesA/bussinessOrder/confirmOrderPage/index?diagnosticSheetId=${this.diagnosticSheetId}&source=${this.source}`
        );
      } else {
        uni.navigateTo({
          url: `/pagesA/bussinessOrder/confirmOrderPage/index?diagnosticSheetId=${this.diagnosticSheetId}&source=${this.source}`,
        });
      }
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/bussinessOrder/confirmOrderPage/index?diagnosticSheetId=${this.diagnosticSheetId}&source=${this.source}`,
      });
      // #endif

      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
