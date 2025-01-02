<template>
  <!-- v-if="!!confirmItem" -->

  <view style="height: 100%; width: 100%">
    <view v-if="showLoading">
      <view v-if="showOverlay" style="height: 100vh; width: 100%"
        ><u-loading-page
          :loading="true"
          loading-text="订单支付中，请稍等"
          bg-color="#e8e8e8"
          color="#000"
        ></u-loading-page
      ></view>
      <view
        v-else
        class="submit-wrapper"
        :style="{
          height: isShowTimePop ? '100vh' : '100%',
          overflow: isShowTimePop ? 'hidden' : 'auto',
        }"
      >
        <!-- 活体 -->
        <view
          class="submit-info"
          v-if="speciesClassificationType || checkAlienPetType"
        >
          <!-- 活体类 -->
          <view class="address-info" @click="handleSelectAddress">
            <view
              v-if="addressInfo"
              style="
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 0;
                overflow: hidden;
              "
            >
              <view class="header-bar">
                {{ addressInfo.province }} {{ addressInfo.city }}
                {{ addressInfo.county }}</view
              >
              <view class="address">{{ getDetailAddress(addressInfo) }}</view>
              <view class="receiver">{{
                addressInfo.name + " " + addressInfo.phone
              }}</view>
            </view>
            <view v-else class="empty-hint">
              您还没有收货地址，快去添加吧
            </view>
            <span
              class="iconfont icon-arrowRight"
              style="font-size: 16px; color: #666666"
            />

            <view class="underline"></view>
          </view>

          <!-- 第一个活体 -->

          <view v-for="(item, index) in initData.cartShopList" :key="index">
            <view class="goods-wrapper">
              <view class="goods-box-title">
                <img
                  v-if="item.shopType + '' === '1'"
                  class="ppyc"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/ppyc1.png"
                  alt=""
                />
                <text v-else>
                  {{ item.shopName }}
                </text>
              </view>

              <view
                class="goods-item"
                v-for="(skuItem, skuIndex) in item.cartSkuList"
                :key="skuIndex"
              >
                <image class="pic" :src="skuItem.majorPicture"></image>
                <!-- 活体 -->
                <view class="goods-info">
                  <view class="name">
                    {{ skuItem.itemName }}
                  </view>
                  <view class="spec" v-if="speciesClassificationType"
                    >{{ genderFormater(skuItem, "gender") }} |
                    {{ genderFormater(skuItem, "age") }} | 疫苗{{
                      genderFormater(skuItem, "vaccina")
                    }}针 | 驱虫{{
                      genderFormater(skuItem, "deworming")
                    }}次</view
                  >
                  <view v-else>{{ genderFormater(skuItem, "shape") }}</view>
                  <!-- 价格+数量 -->
                  <view class="price-num">
                    <goods-price
                      :sale-price="skuItem.skuPrice"
                      :sale-sign-font-size="23"
                      :sale-price-integer-font-size="35"
                      :sale-price-decimal-font-size="23"
                      :sale-color="'#1F1F1FFF'"
                    ></goods-price>
                    <!-- <view class="num-text">x{{ skuItem.skuQty }}</view> -->
                  </view>
                </view>
              </view>

              <view style="height: 8rpx"></view>

              <view>
                <cell-item-normal
                  :title="'配送方式'"
                  :title-size="29"
                  title-color="#1F1F1F"
                  desc="专车配送"
                  :desc-size="29"
                  desc-color="#666666"
                  :titleLeftPadding="0"
                  :descRightPadding="0"
                  :isLast="true"
                  :isRight="true"
                  :verticalPadding="23"
                >
                </cell-item-normal>

                <!-- 配送时间 -->
                <cell-item-normal
                  :title="'配送时间'"
                  :title-size="29"
                  title-color="#1F1F1F"
                  desc="将由门店专员与您联系"
                  :desc-size="29"
                  desc-color="#1F1F1F"
                  :titleLeftPadding="0"
                  :descRightPadding="0"
                  :isLast="true"
                  :isRight="true"
                  :verticalPadding="23"
                  :fontWeight="600"
                >
                </cell-item-normal>
              </view>

              <!-- 备注信息 -->
              <view
                v-if="!item.virtualized"
                class="goods-remark"
                @click="handleRemark(index)"
              >
                <view class="name">备注</view>
                <view v-if="item.remark" class="value">{{ item.remark }}</view>
                <i
                  v-else
                  class="value iconfont icon-editorText fo-size"
                  style="font-size: 42rpx; color: #363636"
                ></i>
                <span
                  v-if="item.remark"
                  class="iconfont icon-arrowRight"
                  style="font-size: 16px; color: #666666"
                />
              </view>
            </view>
          </view>

          <view class="price-wrapper">
            <view class="item">
              <view class="item-title"> 商品总额 </view>
              <view class="item-value"> ￥{{ payInfo.skuAmount || 0 }} </view>
            </view>
            <view
              v-if="hasShopPromotion"
              class="item"
              @click="handleShopPromotionRowClick"
            >
              <view class="item-title">店铺促销</view>
              <view class="item-value">
                <GoodsPrice
                  left="-"
                  :saleSignFontSize="25"
                  :salePrice="shopPromotionAmount"
                  :salePriceIntegerFontSize="29"
                  :salePriceDecimalFontSize="25"
                />
                <span
                  class="iconfont icon-arrowRight"
                  style="color: #fe2442; font-weight: 400; font-size: 16px"
                />
              </view>
            </view>
            <view class="item" @click="handleCoupon">
              <view class="item-title"> 优惠券 </view>
              <view class="item-value coupon">
                <span v-if="payInfo.couponDiscountAmount > 0" class="price">
                  <GoodsPrice
                    left="-"
                    :saleSignFontSize="25"
                    :salePrice="payInfo.couponDiscountAmount"
                    :salePriceIntegerFontSize="29"
                    :salePriceDecimalFontSize="25"
                  />
                </span>
                <span v-else>{{ availableList }}</span>
                <span
                  class="iconfont icon-arrowRight"
                  style="font-size: 16px"
                  :style="{
                    color:
                      payInfo.couponDiscountAmount > 0 ? '#FE2442' : '#666666',
                  }"
                ></span
              ></view>
            </view>

            <view class="illustrate" v-if="initData.score > 0">
              <view class="illustrate-item">
                <view class="illustrate-item-title"> 购物返胖豆 </view>
                <view class="illustrate-item-value">
                  +{{ initData.score || 0 }}胖豆
                </view>
              </view>
              <view class="item-illustrate">订单交易完成即可到账</view>
            </view>
            <!-- <view class="prompt">V1会员升级后可返更多胖豆，最高30倍</view> -->
            <view class="prompt" v-if="!upGradeDescObj.isMaxLevel"
              >V{{
                upGradeDescObj.levelIndex
              }}会员升级后可返更多胖豆，最高30倍</view
            >
          </view>
          <!-- #ifdef MP-WEIXIN -->
          <view class="pay-wrapper">
            <view class="pay-item">
              <image class="ico" :src="pay.ico" mode="aspectFit"></image>
              <view class="name">{{ pay.name }}</view>
              <!-- 图标 -->
              <image
                v-if="pay.checked"
                class="check"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/pay_radio_checked.png"
                mode="aspectFit"
              ></image>
            </view>
          </view>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <view class="pay-wrapper">
            <u-radio-group
              placement="column"
              v-model="currentPayType"
              :labelDisabled="false"
              activeColor="#fe2442"
            >
              <view
                class="pay-item"
                v-for="(pay, index) in payList"
                :key="pay.id"
                @click="payListClick(pay)"
              >
                <image class="ico" :src="pay.ico" mode="aspectFit"></image>
                <view class="name">{{ pay.name }}</view>
                <u-radio :name="pay.id"></u-radio>
              </view>
            </u-radio-group>
          </view>
          <!-- #endif -->
          <view class="remark-info" v-if="isVirtual">
            <!-- <view class="title">{{ "备注" }}</view> -->
            <!-- <view class="desc">有效期：{{ validTime }}</view> -->
            <view class="desc">使用时间：适用门店营业时间内均能使用</view>
            <view class="desc">预约信息：使用前请联系门店进行预约</view>
            <view class="desc">服务保障：随时退·过期自动退款</view>
          </view>
          <view style="height: 100rpx; width: 100%"> </view>
        </view>

        <!-- 商品 -->
        <view class="submit-info" v-else>
          <!-- 商品类 -->
          <view
            v-if="!hasVirtual && isShowAddress"
            class="address-info"
            @click="handleSelectAddress"
          >
            <view
              v-if="addressInfo"
              style="
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 0;
                overflow: hidden;
              "
            >
              <view class="header-bar">
                {{ addressInfo.province }} {{ addressInfo.city }}
                {{ addressInfo.county }}</view
              >
              <view class="address">{{ getDetailAddress(addressInfo) }}</view>
              <view class="receiver">{{
                addressInfo.name + " " + addressInfo.phone
              }}</view>
            </view>
            <view v-else class="empty-hint">
              您还没有收货地址，快去添加吧
            </view>
            <span
              class="iconfont icon-arrowRight"
              style="font-size: 16px; color: #666666"
            />

            <view class="underline"></view>
          </view>

          <!-- 第一个商品 -->

          <view v-for="(item, index) in initData.cartShopList" :key="index">
            <view class="goods-wrapper">
              <view class="goods-box-title">
                <img
                  v-if="item.shopType + '' === '1'"
                  class="ppyc"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/ppyc1.png"
                  alt=""
                />
                <text v-else>
                  {{ item.shopName }}
                </text>
              </view>

              <view
                class="goods-item"
                v-for="(skuItem, skuIndex) in item.cartSkuList"
                :key="skuIndex"
              >
                <image class="pic" :src="skuItem.majorPicture"></image>

                <!-- 商品 -->
                <view class="goods-info">
                  <view class="name">
                    <text
                      class="goods-gift-flag"
                      v-if="skuItem.identifier === 2"
                      >赠品</text
                    >
                    {{ skuItem.itemName }}
                  </view>
                  <view class="spec">{{ skuItem.skuName }}</view>
                  <!-- 价格+数量 -->
                  <view class="price-num">
                    <goods-price
                      :sale-price="skuItem.skuPrice"
                      :sale-sign-font-size="23"
                      :sale-price-integer-font-size="35"
                      :sale-price-decimal-font-size="23"
                      :sale-color="'#1F1F1FFF'"
                    ></goods-price>
                    <view class="num-text">x{{ skuItem.skuQty }}</view>
                  </view>
                </view>
              </view>

              <view style="height: 8rpx"></view>

              <view>
                <!-- 商品自提 -->
                <DeliveryTypeItem
                  v-if="item.shopType == 0 && !item.virtualized"
                  @changeDeliveryType="handleChangeDeliveryType"
                  :delivery-policy="item.deliveryPolicy"
                  :cartShopList="item"
                  :selfCheckoutInfo="selfCheckoutInfo"
                  :checkAlienPetType="checkAlienPetType"
                  :commodityType="commodityType"
                  @updataDeliveryInfo="handleUpdataDeliveryInfo"
                  @isShowTimePop="handleIsShowTimePop"
                />

                <cell-item-normal
                  v-else
                  :title="'配送方式'"
                  :title-size="29"
                  title-color="#1F1F1F"
                  :desc="shippingType(item.deliveryType)"
                  :desc-size="29"
                  desc-color="#666666"
                  :titleLeftPadding="0"
                  :descRightPadding="0"
                  :isLast="true"
                  :isRight="true"
                  :verticalPadding="23"
                >
                </cell-item-normal>

                <cell-item-normal
                  v-if="!item.virtualized && item.deliveryType !== 4"
                  title="运费"
                  :title-size="29"
                  title-color="#1F1F1F"
                  :titleLeftPadding="0"
                  :descRightPadding="0"
                  :isLast="true"
                  :isRight="true"
                  :verticalPadding="23"
                  :desc="
                    item.minimumOrderAmount > item.priceDetail.payAmount
                      ? '未达到起送金额'
                      : '¥' + item.priceDetail.freight
                  "
                >
                  <template slot="title">
                    <view class="cell-item-title">
                      运费
                      <i
                        v-if="item.shopType == 0 && !item.virtualized"
                        class="iconfont icon-instructions"
                        @click.stop="handleFreightShow(item)"
                      ></i>
                    </view>
                  </template>
                </cell-item-normal>

                <!-- 退换货说明 -->
                <block v-if="item.returnPolicy">
                  <cell-item-normal
                    :title="'退换货说明'"
                    :title-size="29"
                    title-color="#1F1F1F"
                    :desc="item.returnPolicy"
                    :desc-size="29"
                    desc-color="#FE2442"
                    :titleLeftPadding="0"
                    :descRightPadding="0"
                    :isLast="true"
                    :isRight="true"
                    :verticalPadding="23"
                  ></cell-item-normal>
                </block>
              </view>

              <!-- 备注信息 -->
              <view
                v-if="!item.virtualized"
                class="goods-remark"
                @click="handleRemark(index)"
              >
                <view class="name">备注</view>
                <view v-if="item.remark" class="value">{{ item.remark }}</view>
                <i
                  v-else
                  class="value iconfont icon-editorText fo-size"
                  style="font-size: 42rpx; color: #363636"
                ></i>
                <span
                  v-if="item.remark"
                  class="iconfont icon-arrowRight"
                  style="font-size: 16px; color: #666666"
                />
              </view>
            </view>
          </view>

          <view class="price-wrapper">
            <view class="item">
              <view class="item-title"> 商品总额 </view>
              <view class="item-value"> ￥{{ payInfo.skuAmount || 0 }} </view>
            </view>
            <view
              v-if="hasShopPromotion"
              class="item"
              @click="handleShopPromotionRowClick"
            >
              <view class="item-title">店铺促销</view>
              <view class="item-value">
                <GoodsPrice
                  left="-"
                  :saleSignFontSize="25"
                  :salePrice="shopPromotionAmount"
                  :salePriceIntegerFontSize="29"
                  :salePriceDecimalFontSize="25"
                />
                <span
                  class="iconfont icon-arrowRight"
                  style="color: #fe2442; font-weight: 400; font-size: 16px"
                />
              </view>
            </view>
            <view class="item" @click="handleCoupon">
              <view class="item-title"> 优惠券 </view>
              <view class="item-value coupon">
                <span v-if="payInfo.couponDiscountAmount > 0" class="price">
                  <GoodsPrice
                    left="-"
                    :saleSignFontSize="25"
                    :salePrice="payInfo.couponDiscountAmount"
                    :salePriceIntegerFontSize="29"
                    :salePriceDecimalFontSize="25"
                  />
                </span>
                <span v-else>{{ availableList }}</span>
                <span
                  class="iconfont icon-arrowRight"
                  style="font-size: 16px"
                  :style="{
                    color:
                      payInfo.couponDiscountAmount > 0 ? '#FE2442' : '#666666',
                  }"
                ></span
              ></view>
            </view>
            <view class="illustrate" v-if="initData.score > 0">
              <view class="illustrate-item">
                <view class="illustrate-item-title"> 购物返胖豆 </view>
                <view class="illustrate-item-value">
                  +{{ initData.score || 0 }}胖豆
                </view>
              </view>
              <view class="item-illustrate">订单交易完成即可到账</view>
            </view>
            <view class="prompt" v-if="!upGradeDescObj.isMaxLevel"
              >V{{
                upGradeDescObj.levelIndex
              }}会员升级后可返更多胖豆，最高30倍</view
            >
          </view>

          <!-- <view class="pangdou" v-if="initData.score > 0">
          <view class="item-title"> 购物返胖豆 </view>
          <view class="item-value"> 预计+{{ initData.score }}胖豆 </view>
        </view> -->
          <!-- #ifdef MP-WEIXIN -->

          <view class="pay-wrapper">
            <view class="pay-item">
              <image class="ico" :src="pay.ico" mode="aspectFit"></image>
              <view class="name">{{ pay.name }}</view>
              <!-- 图标 -->
              <image
                v-if="pay.checked"
                class="check"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/pay_radio_checked.png"
                mode="aspectFit"
              ></image>
            </view>
          </view>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <view class="pay-wrapper">
            <u-radio-group
              placement="column"
              v-model="currentPayType"
              :labelDisabled="false"
              activeColor="#fe2442"
            >
              <view
                class="pay-item"
                v-for="(pay, index) in payList"
                :key="pay.id"
                @click="payListClick(pay)"
              >
                <image class="ico" :src="pay.ico" mode="aspectFit"></image>
                <view class="name">{{ pay.name }}</view>
                <u-radio :name="pay.id"></u-radio>
              </view>
            </u-radio-group>
          </view>
          <!-- #endif -->
          <view class="remark-info" v-if="isVirtual">
            <!-- <view class="title">{{ "备注" }}</view> -->
            <!-- <view class="desc">有效期：{{ validTime }}</view> -->
            <view class="desc">使用时间：适用门店营业时间内均能使用</view>
            <view class="desc">预约信息：使用前请联系门店进行预约</view>
            <view class="desc">服务保障：随时退·过期自动退款</view>
          </view>
          <!-- #ifdef MP-WEIXIN -->
          <view style="height: 100rpx; width: 100%"> </view>
          <!-- #endif -->
        </view>
        <u-transition
          :show="
            (speciesClassificationType || checkAlienPetType) &&
            !!signStatu.tripartiteTemplateName
          "
          mode="fade"
        >
          <view class="sign-contract-box">
            <view class="text-32">
              {{ currentAgreementTitle }}
              《{{ signStatu.tripartiteTemplateName }}》
            </view>
            <view class="flex-row" @click="agreementClick">
              <text class="text-group-4">{{
                signStatu.signed ? "查看合同" : "签署合同"
              }}</text>
              <img
                class="thumbnail-4"
                src="//frontend-cdn.chongpangpang.com/image/medical-mp/discovery/redright.png"
              />
            </view>
          </view>
        </u-transition>
        <!-- 提交订单 -->
        <view class="bottom-submit">
          <!-- 价格 -->
          <view class="price">
            <goods-price
              v-if="payInfo.payAmount === 0 || payInfo.payAmount"
              :sale-price="payInfo.payAmount"
              :sale-sign-font-size="31"
              :sale-price-integer-font-size="58"
              :sale-price-decimal-font-size="31"
              :sale-color="'#FE2442'"
            ></goods-price>
          </view>

          <!-- 提交按钮 -->
          <view
            class="submit"
            @click="submit()"
            :class="[submitText !== '提交订单' ? 'submitForbid' : '']"
            >{{ submitText }}</view
          >
        </view>
      </view>
    </view>
    <!-- cpp_h5_loading -->
    <view v-else class="data-unsettled">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
        mode="scaleToFill"
      />
    </view>
    <!-- <u-modal
      :show="show"
      content="当前收货地址超出配送范围，请重新选择商品"
      @confirm="handleBack"
    ></u-modal> -->
    <u-toast ref="uToast"></u-toast>
    <OutDistance
      :show.sync="show"
      :deliveryRangeCode="codePop"
      :messagePop="messagePop"
      :cancelOrRightBackfc="handleBack"
      @confirmBackfc="handleConfirm"
      @handleLiveOk="handleSelectAddress"
      :isLive="liveType"
    ></OutDistance>
    <CouponSelectPopView
      :show="couponSelectShow"
      :couponList="couponList"
      :cartType="submitOptions.cartType"
      :memberCouponId="memberCouponId"
      @onClose="handleCouponClose"
      @onRefresh="handleRefresh"
    ></CouponSelectPopView>
    <ShopPromotionPopView
      :show="isShowShopPromotionPop"
      :cartShopList="initData.cartShopList"
      @onClose="isShowShopPromotionPop = false"
    />
    <DeliverySubmitPop
      :isOpen.sync="isDeliverySubmitPopShow"
      @close="handleDeliverySubmitPopClose"
      :selfCheckoutInfo="selfCheckoutInfo"
      @confirm="handleDeliverySubmitPopConfirm"
    />

    <LockTheOrderPop
      :isOpen.sync="isLockTheOrderPopShow"
      @close="handleLockTheOrderPopClose"
      :lockType="lockType"
      :signStatu="signStatu"
      @confirm="handleLockTheOrderPopConfirm"
    ></LockTheOrderPop>

    <ContractInfoPop
      :contractInfo="contractInfo"
      :isOpen.sync="contractPopShow"
      @next="handleNext"
    />
    <freightPop
      :show.sync="showFreight"
      :messagePop="deliveryRule"
    ></freightPop>
  </view>
</template>

<script>
import CouponSelectPopView from "../couponSelectPopView/index.vue";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
import ContractInfoPop from "../../../components/contractInfoPop/index.vue";
import OutDistance from "../outdistancePopView/index.vue";
import freightPop from "../freightPopView/index.vue";
import { PREPAY_WX_MP, APP_PREPAY } from "@/api/mall";
import {
  settlement,
  queryRangeStore,
  editAddressApi,
  postCouponListByType,
} from "@/api/cart";
import {
  CREATE_ORDERv3,
  FETCH_SHOP_DETAIL,
  GET_ORDER_TRADE_DETAIL,
  GET_SELFTAKE_INFO,
} from "@/api/mallv2";
import {
  getSignStatusByLiveInfoId,
  detailByTrackingNo,
  getESignH5Link,
  fileGetSignStatus,
} from "@/api/eSignature";
import { getUserInfo } from "@/api/base/index";
import { mapState, mapMutations } from "vuex";
import { getAddressList, getAddressListDetail } from "@/api/base/index";
import { action_report } from "@/utils/track";
import ShopPromotionPopView from "@/pagesC/submitOrder/components/shopPromotionPopView/index.vue";
import { formatFloat } from "@/utils";
import DeliveryTypeItem from "@/pagesC/components/deliveryTypeItem/index.vue";
import DeliverySubmitPop from "@/pagesC/components/deliverySubmitPop/index.vue";
import LockTheOrderPop from "@/pagesC/components/lockTheOrderPop/index.vue";
import { GET_UPGRADE_DESC } from "@/api/memberV2";
export default {
  name: "goodsSubmit",
  components: {
    ShopPromotionPopView,
    GoodsPrice,
    CellItemNormal,
    CouponSelectPopView,
    DeliveryTypeItem,
    DeliverySubmitPop,
    LockTheOrderPop,
    ContractInfoPop,
    OutDistance,
    freightPop,
  },

  props: {
    submitOptions: {
      type: Object,
    },
    submitType: {
      type: String,
    },
  },

  submitClickMs: 0,

  data() {
    return {
      contractPopShow: false,
      contractInfo: {},
      couponSelectShow: false,
      show: false,
      showFreight: false, //运费模版弹窗
      deliveryRule: "",
      initData: {
        cartShopList: [],
      },
      // 支付 金额信息
      payInfo: null,
      addressInfo: null,
      // 微信支付
      pay: {
        ico: "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/submit_order_wx_pay.png",
        name: "微信支付",
        checked: true,
      },
      // 支付宝支付
      payList: [
        {
          ico: "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/submit_order_wx_pay.png",
          name: "微信支付",
          checked: true,
          id: "WX",
        },
        {
          ico: "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/icon_alipay.png",
          name: "支付宝",
          checked: false,
          id: "ZFB",
        },
      ],
      currentPayType: "WX",
      showOverlay: false,
      payAmount: 0,
      tradeId: "",
      tradeNo: "",
      couponList: [],
      checkedCouponId: "",
      isShowShopPromotionPop: false,
      isDeliverySubmitPopShow: false,
      selfCheckoutInfo: {},
      submitText: "提交订单",
      score: "",
      isShowTimePop: false,

      signStatu: {
        signFileUrl: "", //签署文件链接
        signed: false, //签署状态（true为已签署）
        tripartiteTemplateName: "",
        signRefRelationId: "",
      },
      agreementList: [
        {
          title: "请签署",
          url: "online.png",
          width: 154,
        },
        {
          title: "已签署",
          url: "contract.png",
          width: 123,
        },
      ],
      isHighValueLivePopShow: false,
      highliveValue: {},
      isLockTheOrderPopShow: false,
      lockType: true,
      signRefRelationId: "", //签署业务表主键id
      // fileSignStatus: false, //签署回调
      isIncludeSelfDeliver: false,
      isIncludeVirtualized: false,
      codePop: "", // 配送范围提示code
      messagePop: "", // 配送范围提示信息
      queryDeliveryType: null, // 用于settlement接口传参
      queryDistanceBool: false, // 是否替换为云超发货 true 是 false 否
      fullPath: "", //合同页面重定向地址
      liveType: false, //是否是活体(排出低价值)
      shapeMap: {
        "00": "未知",
        "01": "半毛",
        "02": "全毛",
        11: "幼体",
        12: "亚成体",
        13: "亚成体",
      },
      signTypes: "",
      genderMap: ["未知", "弟弟", "妹妹"],
      upGradeDescObj: {},
      showLoading: false,
      reMarkList: {},
      mallShopId: "",
      // #ifdef H5
      agreementSigningStatus: true, //用于h5中判断是否需要查询最新的活体协议签署状态
      // #endif
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    availableList() {
      const list = this.couponList.filter((item) => item.isAvailable);
      return list && list.length > 0 ? "请选择优惠券" : "暂无可用";
    },
    //是否全都是虚拟商品
    hasVirtual() {
      const res = this.initData?.cartShopList?.find(function (item) {
        return item.cartSkuList?.find(function (item) {
          return !item.virtualized;
        });
      });
      return !res;
    },
    //是否是活体/// 商品类型 1 实物 2 虚拟 3 活体
    commodityType() {
      const res = this.initData?.cartShopList?.find(function (item) {
        return item.cartSkuList?.find(function (item) {
          return item.commodityType === 3;
        });
      });
      return res?.commodityType === 3;
    },
    // 是 否是高价值异宠 1:高价值异宠2:低价值异宠
    checkAlienPetType() {
      const cartShopList = this.initData?.cartShopList;
      if (!cartShopList || cartShopList.length === 0) return false;
      const cartSkuList = cartShopList[0].cartSkuList;
      if (!cartSkuList || cartSkuList.length === 0) return false;
      const liveInfo = cartSkuList[0].liveInfo;
      if (!liveInfo) return false;
      return liveInfo.alienPetType === 1;
    },
    // 是否是异宠
    // 1-猫
    // 50-狗
    // 214-水族
    // 460-爬行
    // 835-其他小宠
    // 836-鸟类
    speciesClassificationType() {
      // true不是异宠  false是异宠
      const cartShopList = this.initData?.cartShopList;
      if (!cartShopList || cartShopList.length === 0) return false;
      const cartSkuList = cartShopList[0].cartSkuList;
      if (!cartSkuList || cartSkuList.length === 0) return false;
      const liveInfo = cartSkuList[0].liveInfo;
      if (!liveInfo) return false;
      return (
        liveInfo.speciesClassification === 1 ||
        liveInfo.speciesClassification === 50
      );
    },
    /**
     * 判断是否有自提商品，自提商品不校验距离
     */
    hasDelivery() {
      let res = this.initData?.cartShopList?.some((i) => {
        return i.deliveryType == 4 && i.shopType == 0;
      });
      return res;
    },
    /**
     * 选择地址栏显示隐藏逻辑
     */
    isShowAddress() {
      let res = this.initData?.cartShopList?.some(function (item) {
        return (
          item.deliveryType == 1 ||
          item.deliveryType == 2 ||
          item.deliveryType == 6
        );
      });
      return res;
    },
    /**
     * 判断是否是达达订单
     */
    isDelivery() {
      let res = this.initData?.cartShopList?.some(
        (item) => item.deliveryType === 1
      );
      return res;
    },
    addressId() {
      return (
        this.addressInfo &&
        (this.addressInfo.userAddressStrId || this.addressInfo.userAddressId)
      );
    },

    confirmItem() {
      return this.initData?.cartShopList?.[0];
    },

    // 退换货说明
    returnPolicy() {
      try {
        const itemList = this.initData?.cartShopList;
        if (itemList == null) {
          return "";
        }
        return itemList[0]?.returnPolicy ?? "";
      } catch (err) {
        return "";
      }
    },

    isVirtual() {
      const res = this.initData?.cartShopList?.some(function (item) {
        return item.virtualized === true;
      });
      return res;
    },
    isSelfCheckOut() {
      const res = this.initData?.cartShopList?.some(function (item) {
        return item.deliveryType === 4;
      });
      return res;
    },
    memberCouponId() {
      return this.initData?.couponDetail?.memberCouponId;
    },
    sourceChannel() {
      return this.submitOptions.sourceChannel;
    },
    hasShopPromotion() {
      return this.shopPromotionAmount > 0;
    },
    shopPromotionAmount() {
      return formatFloat(this.payInfo?.activityDiscountAmount || 0);
    },
    isCoupon() {
      const res1 =
        !!this.initData.couponDetail &&
        this.initData.couponDetail.memberCouponId.length > 0;
      const res2 = this.initData.cartShopList.some((e) => {
        return (e.activityList || []).length > 0;
      });
      return res1 || res2;
    },
    // 协议前缀
    currentAgreementTitle() {
      return this.signStatu.signed
        ? this.agreementList[1].title
        : this.agreementList[0].title;
    },
    //确认订单页面 在h5用的是原生的地址选择页面 返回的参数不一样 所以这里做了区分
    // h5选中地址后返回的数据中没有userAddressStrId   只有 userAddressId
    consigneeAddressId() {
      // #ifdef H5
      return (
        this.$dsBridge.call(
          "getMallLocationAddressId",
          "getMallLocationAddressId"
        ) || this.addressInfo?.userAddressStrId
      );
      // #endif
      // #ifdef MP-WEIXIN
      return this.addressInfo?.userAddressStrId;
      // #endif
    },
    lastConsigneeAddressId() {
      // #ifdef H5
      return (
        this.$dsBridge.call(
          "getMallLocationAddressId",
          "getMallLocationAddressId"
        ) || this.addressInfo?.userAddressStrId
      );
      // #endif
      // #ifdef MP-WEIXIN
      return (
        uni.getStorageSync("consigneeAddressId") ||
        this.addressInfo?.userAddressStrId
      );
      // #endif
    },
    genderFormater() {
      return (val, type) => {
        console.log("genderFormater", val);
        switch (type) {
          case "gender":
            return this.genderMap[val?.liveInfo?.gender] || "未知";
          case "age":
            return val?.liveInfo?.age || 0;
          case "vaccina":
            return val?.liveInfo?.liveVaccinationList?.length || 0;
          case "deworming":
            return val?.liveInfo?.liveDewormingList?.length || 0;
          case "shape":
            return this.shapeMap[val?.liveInfo?.shape] || "未知";
          default:
            return "";
        }
      };
    },
  },
  beforeDestroy() {
    uni.removeStorageSync("consigneeAddressId");
    console.log("返回上一级=====》", uni.getStorageSync("consigneeAddressId"));
  },
  async mounted() {
    console.log("commodityType", this.commodityType);

    let pages = getCurrentPages(); //页面对象
    const currentPage = pages[pages.length - 1];
    const route = currentPage.options;
    // this.queryDeliveryType = route.type && route.type == 'liveType' ? true : false
    if (route.type && route.type == "liveType") {
      this.queryDeliveryType = 6;
    }
    if (route.shopId) {
      this.mallShopId = route.shopId;
    }
    this.liveType = route.type == "liveType";
    this.fullPath = currentPage.$page.fullPath;
    console.log("this.$store=====================", currentPage);

    // this.fileSignStatus = this.$store.state.searchHistoryState.fileSignStatus;
    uni.$off();
    uni.$on("getSignStatus", (res) => {
      console.log(res);
      this.getSignStatus();
    });
    //获取地址
    await this.handleAddress();
    await this.getSubmitInitData(false, false);

    if (this.speciesClassificationType || this.checkAlienPetType) {
      //查询签署状态
      this.getSignStatusByLive();
    }
    console.log("订单数据=>>>>>>>>>>>", this.addressInfo, this.initData);
    console.log("配送方式=>>>>>>>>>>>", this.selfCheckoutInfo);
    //获取当前会员等级接口
    this.getUpgradeDesc();
    // #ifdef H5
    this.$dsBridge.register(
      "selectAddressCallBack",
      this.selectAddressCallBack
    );
    // #endif
  },
  onShow() {},

  methods: {
    ...mapMutations(["setSelectedAddress"]),
    //点击微信或者支付宝的文本
    payListClick(item) {
      this.currentPayType = item.id;
    },
    // 运费规则弹窗
    handleFreightShow(item) {
      this.deliveryRule = item.deliveryRule || "";
      this.showFreight = true;
    },
    async getUpgradeDesc() {
      try {
        const res = await GET_UPGRADE_DESC();
        this.upGradeDescObj = res?.data?.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = true;
      }
    },
    handleRefresh(couponId) {
      console.log("couponID====>", couponId);
      this.checkedCouponId = couponId;
      this.couponSelectShow = false;
      this.getSubmitInitData(true, false);
    },
    handleCouponClose() {
      this.couponSelectShow = false;
    },
    handleCoupon() {
      this.couponSelectShow = true;
    },
    async handleAddress() {
      // #ifdef H5
      try {
        const getMallLocationAddressId = this.$dsBridge.call(
          "getMallLocationAddressId",
          "getMallLocationAddressId"
        );
        let addressInfo;
        if (getMallLocationAddressId) {
          const res = await getAddressListDetail(getMallLocationAddressId);
          console.log(
            "getAddressListDetail",
            getMallLocationAddressId,
            res.data
          );
          addressInfo = {
            ...res.data,
            isDeliveryAddress: true,
            userAddressStrId: String(getMallLocationAddressId),
          };
        } else {
          addressInfo = this.addressInfo;
        }
        if (addressInfo && addressInfo.isDeliveryAddress) {
          this.addressInfo = addressInfo;
        } else {
          this.addressInfo = "";
        }
      } catch (error) {
        console.log(error);
      }
      // #endif
      // #ifdef MP-WEIXIN
      const addressInfo =
        this.addressInfo || uni.getStorageSync("mall_last_search_address_obj");
      if (addressInfo && addressInfo.isDeliveryAddress) {
        this.addressInfo = addressInfo;
      } else {
        this.addressInfo = "";
      }
      // #endif
      await this.handleDeleAddress();
    },
    getDetailAddress(info) {
      if (info && info.address) {
        return `${info.address}${info.addressName ?? ""}${
          info.houseNumber ?? ""
        }`;
      }
      return "";
    },
    // 进入首页之后要配置地址 - 方便服务端算运费
    async handleDeleAddress() {
      console.log("handleDeleAddress", this.addressInfo);
      let data = {
        ...this.addressInfo,
        cartType: this.submitOptions.cartType == 1 ? 1 : 2, //结算方式（1:购物车 2:立即购买）
        consigneeAddressId: this.consigneeAddressId,
        shopId: this.submitOptions.shopId,
        tenantId: "default_tenant",
      };
      try {
        const res = await editAddressApi(data);
        console.log("设置地址返回时间----》", new Date().getTime());
        if (!res.data.data.isSuccess) {
          return;
        }
      } catch (err) {
        return;
      }
    },
    // 查询签署状态回调
    async getSignStatus() {
      try {
        //liveInfoId 宠物档案id
        // #ifdef H5
        if (this.agreementSigningStatus) return;
        // #endif
        let id = this.signRefRelationId;
        const res = await fileGetSignStatus({ id });
        // #ifdef H5
        //逻辑 第一次进入不需要调用这个接口查询签署状态  点击下一步去签署之后会修改状态 返回到这个页面的时候需要查询签署状态  查询完等到下一次点击去签署之前都不会再查询签署状态
        this.agreementSigningStatus = true;
        // #endif
        if (res.data.data.status) {
          this.signStatu.signed = res.data.data.status;
          this.signStatu.signFileUrl = res.data.data.signFileUrl;
        } else {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "签署失败，请重新签署!",
          });
        }
      } catch (error) {
        console.log(error);
        this.agreementSigningStatus = true;
      }
    },
    async handleNext(data) {
      try {
        // 给用户一个反馈
        uni.showLoading({
          mask: true,
        });
        console.log(data);
        let cartSkuLInfo = this.initData.cartShopList[0].cartSkuList[0];
        let priceDetail = this.initData?.priceDetail;
        let cartShopInfo = this.initData.cartShopList[0];
        if (this.checkAlienPetType) {
          this.signTypes = "LIVE_ORDER_HIGH_VALUE_OTHER_PET";
        } else if (
          cartSkuLInfo.liveInfo?.speciesClassification === 1 ||
          cartSkuLInfo.liveInfo?.speciesClassification === 50
        ) {
          this.signTypes = "LIVE_ORDER_DOG_CAT_PET";
        } else {
          this.signTypes = "";
        }
        console.log("cartSkuLInfo.payAmount", priceDetail.payAmount);

        let query = {
          liveInfoId: cartSkuLInfo.liveInfo.id, //活体信息ID
          amount: priceDetail.payAmount, //实际购买金额
          storeId: cartShopInfo.storeId, //门店id
          signType: this.signTypes,
          //LIVE_ORDER_HIGH_VALUE_OTHER_PET("LIVE_ORDER_HIGH_VALUE_OTHER_PET", "活体订单高价值异宠"),
          // LIVE_ORDER_DOG_CAT_PET("LIVE_ORDER_DOG_CAT_PET", "活体订单犬猫");
          phone: data.phone,
          address: data.address.trim().slice(0, 50),
          customerName: data.customerName.trim(),
        };
        const res = await detailByTrackingNo(query);
        let h5query = {
          storeId: cartShopInfo.storeId, //模版关联ID
          signType: this.signTypes,
          fileId: res.data.data.fileId, //文件id
          liveInfoId: cartSkuLInfo.liveInfo.id, //关联id
          // #ifdef MP-WEIXIN
          redirectUrl: "wechat://back", //重定向地址
          // #endif
          // #ifdef H5
          redirectUrl: "cppsign://liveSign.end", //重定向地址
          // #endif
          phone: data.phone,
        };
        const h5res = await getESignH5Link(h5query);
        console.log("getESignH5Link", h5res);
        this.signRefRelationId = h5res.data.data.signRefRelationId;
        uni.hideLoading();
        // uni.setStorageSync("signRefRelationId", h5res.data.data.signRefRelationId);
        //跳转到合同签字页面
        // #ifdef MP-WEIXIN
        let str = `/pagesA/webView/index?route=${encodeURIComponent(
          h5res.data.data.url
        )}&type=icon`;
        uni.navigateTo({
          url: str,
        });
        // #endif
        // #ifdef H5
        this.agreementSigningStatus = false;
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: h5res.data.data.url,
        });
        // #endif
      } catch (error) {
        uni.hideLoading();
        console.log(error);
      }
    },
    // 查询当前订单签署状态
    async getSignStatusByLive() {
      try {
        console.log("liveInfo", this.initData);
        let cartSkuLInfo = this.initData.cartShopList[0].cartSkuList[0];
        if (this.checkAlienPetType) {
          this.signTypes = "LIVE_ORDER_HIGH_VALUE_OTHER_PET";
        } else if (
          cartSkuLInfo.liveInfo?.speciesClassification === 1 ||
          cartSkuLInfo.liveInfo?.speciesClassification === 50
        ) {
          this.signTypes = "LIVE_ORDER_DOG_CAT_PET";
        } else {
          this.signTypes = "";
        }
        //liveInfoId 宠物档案id
        const res = await getSignStatusByLiveInfoId({
          liveInfoId: cartSkuLInfo?.liveInfo?.id,
          signType: this.signTypes,
        });
        this.signStatu = res?.data?.data;
        this.signRefRelationId = res?.data?.data?.signRefRelationId;
      } catch (error) {
        console.log(error);
      }
    },
    previewWechat(urlPdf) {
      uni.showLoading({
        title: "正在加载中..",
      });
      uni.downloadFile({
        url: urlPdf,
        success: function (res) {
          var filePath = res.tempFilePath;
          uni.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function (res) {
              console.log("打开文档成功");
              uni.hideLoading();
            },
          });
        },
        complete: function (r) {
          uni.hideLoading();
        },
      });
    },
    agreementClick() {
      if (this.signStatu.signed) {
        this.previewWechat(this.signStatu.signFileUrl);
      } else {
        // this.contractInfo = JSON.parse(JSON.stringify(this.addressInfo))
        //未签署
        this.contractPopShow = true;
      }
    },
    async selectAddressCallBack(val) {
      console.log("选择收货地址：", val);
      if (typeof val == "string") {
        val = JSON.parse(val);
      }
      let item = {
        ...val,
        isDeliveryAddress: true,
        userAddressStrId: val.userAddressId,
      };
      this.addressInfo = item;
      var res = this.initData?.cartShopList.find(function (item) {
        return item.shopType === 0;
      });
      console.log("----------------------");
      console.log("🤣--选择地址", this.initData, res, this.addressInfo);

      await this.handleDeleAddress();
      console.log("设置地址执行完----》", new Date().getTime());
      this.handleCanPay(res);
      this.getSubmitInitData(true, false);
    },
    handleSelectAddress() {
      // #ifdef H5
      //跳转到原生地址管理

      this.$dsBridge.call("selectAddr", "selectAddr");

      // #endif
      // 选择收货地址
      // #ifdef MP-WEIXIN
      let that = this;
      uni.navigateTo({
        url: "/pagesA/addressManagement/index",
        events: {
          resultEvent: async function (res) {
            console.log("选择收货地址：", res);
            let item = {
              ...res.data,
              isDeliveryAddress: true,
            };
            // uni.setStorageSync("mall_last_search_address_obj", item);
            // that.setSelectedAddress(item);
            that.addressInfo = item;
            /**
             * 当商品为门店商品，且自提类型为配送到家时校验，到店自提时不校验，新逻辑
             */
            var res = that.initData?.cartShopList.find(function (item) {
              return item.shopType === 0;
            });
            console.log("----------------------");
            console.log("🤣--选择地址", that.initData, res, that.addressInfo);

            await that.handleDeleAddress();
            console.log("设置地址执行完----》", new Date().getTime());
            that.handleCanPay(res);
            that.getSubmitInitData(false, false);
          },
        },
      });
      // #endif
    },

    //判断地址是否能支付
    async handleCanPay(res) {
      //有门店商品要判断能否购买
      console.log("执行地址判断");
      // if (this.hasDelivery) return;
      try {
        // const {
        //   data: { data },
        // } = await queryRangeStore({
        //   lat: this.addressInfo.lat,
        //   lon: this.addressInfo.lon,
        //   cityCode:(this.addressInfo.cityCode || this.addressInfo.adcode).slice(0, 4)+'00'
        // });
        setTimeout(async () => {
          await this.getSubmitInitData(true, false);
          if (this.speciesClassificationType || this.checkAlienPetType) {
            //查询签署状态
            this.getSignStatusByLive();
          }
        }, 0);
        // if (data) {
        //   // uni.setStorageSync("onlineCurMallId", data.shopId);
        //   console.log("🤣--地址", data, res);
        //   //判断门店的shopId是否在列表中
        //   if (res.shopId != data.shopId) {
        //     // this.show = true;
        //     // return;
        //   }
        // }
      } catch (error) {
        console.log("🚀 ~ handleCanPay ~ error:", error);
        // this.show = true;
        // return;
      }
    },

    shippingType(type) {
      if (type == 2) {
        return "快递发货"; // "物流配送";
      } else if (type == 3) {
        return "到店核销";
      } else if (type == 1) {
        return "同城配送";
      } else if (type == 4) {
        return "自提";
      } else {
        return "";
      }
    },

    async requestWxPay(tradeId, tradeNo, payInfo) {
      // 通过 订单号，生成 微信支付 单号
      try {
        // 微信 预支付信息
        const res = await this.getWxMpPrepayInfo(
          tradeId,
          tradeNo,
          this.payInfo.payAmount
        );
        // 微信支付订单
        console.log("wx mp prepay info: ", res);
        const wxPayOrder = res?.data?.data;
        if (res?.data?.code != 0) {
          throw res.data?.message ?? "微信支付生成订单失败";
        }
        if (res?.data?.data?.zeroPayFlag) {
          //  0元购
          uni.navigateTo({
            url: `/pagesC/mallOrderList/index`,
          });
        } else {
          let that = this;
          // 通过微信单号，拉起 微信支付
          uni.requestPayment({
            provider: "wxpay",
            orderInfo: { ...wxPayOrder, package: wxPayOrder.packages },
            timeStamp: wxPayOrder.timeStamp,
            nonceStr: wxPayOrder.nonceStr,
            package: wxPayOrder.packages,
            signType: wxPayOrder.signType,
            paySign: wxPayOrder.paySign,
            success(res) {
              console.log("微信支付成功：", res);
              // 查询订单 状态

              that.nextOrder(tradeId, tradeNo);
              // that.navToPaySuccess(orderInfo);
            },
            fail(e) {
              console.log("支付失败：", e);
              uni.showToast({
                icon: "none",
                title: "支付失败",
              });
              // 直接 跳转订单详情
              // 跳转待付款列表

              setTimeout(() => {
                uni.redirectTo({
                  url: `/pagesC/mallOrderList/index?listIndex=${1}`,
                });
              }, 200);
            },
          });
        }
        uni.hideLoading();
      } catch (err) {
        console.log("wx prepay err: ", err);
        uni.hideLoading();
        if (typeof err === "string") {
          uni.showToast({
            icon: "none",
            title: err,
          });
        }
        // 直接 跳转订单详情
        setTimeout(() => {
          uni.reLaunch({
            url: `/pagesC/mallOrderList/index?listIndex=${1}`,
          });
        }, 200);
      }
    },
    //获取优惠券列表
    async getCouponList() {
      let itemInfoDTOList = [];
      this.initData.cartShopList.map((shop) => {
        shop.cartSkuList.map((item) => {
          itemInfoDTOList.push({
            itemId: item.itemId,
            price: item.skuAmount,
            shopId: item.shopId,
            skuQty: item.skuQty,
          });
        });
      });
      const res = await postCouponListByType({
        channel: "MINI",
        list: itemInfoDTOList,
      });
      const { data } = res.data || {};

      this.couponList = data;
    },
    /**
     *
     * @param refresh false 点击计算第一次生成结算界面，true 结算界面数据刷新
     * @param distanceBool 弹层--是否替换为云超发货 true 是 false 否
     */
    async getSubmitInitData(refresh, distanceBool) {
      this.queryDistanceBool = distanceBool;
      try {
        // #ifdef H5
        console.log("刷新接口返回时间--getSubmitInitData------------》", {
          lastTimeConsigneeAddressId: this.lastConsigneeAddressId,
          shopId: this.$dsBridge.call("getMallShopId", "getMallShopId"),
        });
        // #endif
        // uni.getStorageSync("mallShopId")  这个h5中取不到  路由传过来的shopId也是这个 所以修改成统一路由取用
        const res = await settlement({
          cartType: this.submitOptions.cartType == 1 ? 1 : 2, //结算方式（1:购物车 2:立即购买）
          // #ifdef MP-WEIXIN
          shopId: uni.getStorageSync("onlineCurMallId") || this.mallShopId || 0,
          // #endif
          // #ifdef H5
          shopId:
            this.$dsBridge.call("getMallShopId", "getMallShopId") ||
            this.mallShopId ||
            0,
          // #endif
          tenantId: "default_tenant",
          refresh,
          sourceType: 5,
          consigneeAddressId: this.consigneeAddressId,
          memberCouponId: this.checkedCouponId,
          sourceChannel: this.sourceChannel,
          supportActivity: true,
          deliveryType: this.hasDelivery ? 4 : this.queryDeliveryType || 1, // this.isDelivery ? 1 : "",
          refreshCommodityOwner: distanceBool, // 是否云超发货 true, 否则传 false
          lastTimeConsigneeAddressId: this.lastConsigneeAddressId, // 切换地址前的地址id
        });

        const data = res.data?.data;
        if (res.data?.code == 0 && data) {
          this.contractInfo = data.consigneeAddress;
          uni.setStorageSync(
            "consigneeAddressId",
            data?.consigneeAddress?.consigneeAddressId
          );
          this.initData = data;
          // 标记是否有虚拟（服务）订单
          const { cartShopList } = this.initData;
          // 有且仅有一个商品，标记虚拟商品
          if (cartShopList && cartShopList.length === 1) {
            this.isIncludeVirtualized = cartShopList.every(
              (item) => item.virtualized
            );
          }
          if (this.sourceChannel === "1") {
            const cartShopList = this.initData.cartShopList;
            this.initData.cartShopList = cartShopList.map((e) => {
              return {
                ...e,
                returnPolicy: "新人活动商品不支持退换",
              };
            });
          }
          this.payInfo = data?.priceDetail;

          this.checkedCouponId = data.couponDetail?.memberCouponId;

          this.initData?.cartShopList.forEach((item, index) => {
            if (this.reMarkList[item.shopId]) {
              item.remark = this.reMarkList[item.shopId];
            } else {
              item.remark = "";
            }
          });
          // 达达切换地址时，优先使用上次settlement接口返回deliveryType
          this.initData?.cartShopList.some((item) => {
            console.log(
              "达达切换地址时，优先使用上次settlement接口返回deliveryType::getSubmitInitData::cartShopList",
              this.initData?.cartShopList
            );
            if (!item.virtualized && item.shopType === 0) {
              this.queryDeliveryType = item.deliveryType;
              console.log(
                "🚀 ~ this.initData?.cartShopList.some ~ this.queryDeliveryType:",
                this.queryDeliveryType
              );
            }
          });
          if (!refresh) {
            let storeId = data.cartShopList.find(
              (i) => i.shopType == 0 && !i.virtualized
            )?.storeId;
            if (storeId) {
              this.getSelfTakeInfo(storeId);
            }
          }
          // let shopMerchantDetail = data.cartShopList.find(
          //   (i) => i.shopType == 0 && !i.virtualized && i.deliveryType == 1
          // );
          // if (shopMerchantDetail?.minimumOrderAmount) {
          //   shopMerchantDetail?.priceDetail.skuAmount >=
          //   shopMerchantDetail?.minimumOrderAmount
          //     ? (this.submitText = "提交订单")
          //     : (this.submitText = `门店商品差¥${Number.parseFloat(
          //         shopMerchantDetail?.minimumOrderAmount -
          //           shopMerchantDetail?.priceDetail.skuAmount
          //       ).toFixed(2)}起送`);

          // } else {
          //   this.submitText = "提交订单";
          // }
          const shopMerchantDetail = data.cartShopList.find(
            (i) =>
              i.shopType == 0 &&
              !i.virtualized &&
              (i.deliveryType == 1 || i.deliveryType == 2)
          );
          if (shopMerchantDetail) {
            const minDifferenceAmount = Math.abs(
              Number(shopMerchantDetail.minDifferenceAmount || 0)
            );
            this.submitText =
              minDifferenceAmount === 0
                ? "提交订单"
                : `门店商品差¥${Number.parseFloat(minDifferenceAmount).toFixed(
                    2
                  )}起送`;
          } else {
            this.submitText = "提交订单";
          }
          if (data?.priceDetail.couponDiscountAmount > 0) {
            this.getCouponList();
          }

          // 确认订单页 cartShopList 如果为空 和 30000同样处理---弹框“当前收货地址超出配送范围，请重新选择商品”
          if (!data.cartShopList || data.cartShopList.length === 0) {
            this.codePop = "30000";
            // if (this.queryDeliveryType == 6) {
            //   this.messagePop = "当前收货地址超出配送范围，请重新选择收货地址";
            // } else {
            //   this.messagePop = "当前收货地址超出配送范围，请重新选择商品";
            // }
            this.messagePop = "当前收货地址超出配送范围，请重新选择收货地址";
            this.show = true;
          }
        }
      } catch (error) {
        console.log("🚀 ~ getSubmitInitData ~ error:", error, error.code);
        // code：30000、30001判断是否同城配送
        const code = error.code;
        if ([30000, 30001].includes(code)) {
          this.codePop = error.code;
          this.messagePop = error.message;
          this.show = true;
          console.log("4444444444444444===", code, error, this.show);
        } else {
          throw error.data?.message ?? "确认订单获取失败";
        }
      }
    },
    handleRemark(index) {
      // 跳转编辑 备注，最多50个字
      let that = this;
      let remark = that.initData.cartShopList[index].remark;
      console.log("remakr===>", remark, index);
      uni.navigateTo({
        url: `/pagesC/editRemark/index?remark=${encodeURIComponent(remark)}`,
        events: {
          resultEvent(res) {
            console.log(`res: ${JSON.stringify(res)}`);
            let re = res.data.trim();
            that.initData.cartShopList[index].remark = re || "";
            that.reMarkList[that.initData.cartShopList[index].shopId] =
              re || "";
            that.$forceUpdate();
          },
        },
      });
    },

    async submit() {
      // this.isDeliverySubmitPopShow = true;
      // return;
      if (this.submitText !== "提交订单") return;
      if (this.submitOptions.sourceChannel === "1") {
        action_report({
          action_name: "newcomersorderpage_submit_click",
          module_name: "newcomersorderpage",
        });
      } else {
        action_report({
          action_name: "Orderpage_submit_click",
          module_name: "shop",
        });
      }
      if (this.speciesClassificationType || this.checkAlienPetType) {
        // #ifdef MP-WEIXIN
        const { userId } = uni.getStorageSync("storage_info");
        // #endif
        action_report({
          action_name: "LivepetOrderpage_submit_click",
          module_name: "",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            commodity_id: this.submitOptions.itemId,
          },
        });
      }
      // uni.xxx 方法，必须在 点击方法中调用，使用 这种方式处理 防抖
      if (Date.now() - this.submitClickMs < 1800) {
        console.log("点击防抖处理");
        return;
      }
      this.submitClickMs = Date.now();
      console.log("点击事件处理");
      if (this.hasDelivery && !this.selfCheckoutInfo.selfCheckoutPhone) {
        uni.showModal({
          title: "提示",
          content: "手机号不能为空",
          confirmText: "确定",
          showCancel: false,
          success: () => {},
        });
        return;
      }
      console.log("手机号不能为空校验通过");

      // 暂时注释掉
      // if (!this.addressInfo) {
      //   uni.showToast({
      //     title: "您还没有收货地址，请填写收货地址",
      //   });
      //   return;
      // }
      /**
       * 显示地址栏时需要校验地址是否存在
       */
      if (this.isShowAddress) {
        if (!this.addressInfo) {
          uni.showModal({
            title: "提示",
            content: "您还没有收货地址，请填写收货地址",
            confirmText: "确定",
            showCancel: false,
            success: () => {},
          });
          return;
        }
      }
      console.log(
        "收货地址校验通过",
        this.speciesClassificationType,
        this.checkAlienPetType
      );
      //先判断地址 在判断协议
      if (this.speciesClassificationType || this.checkAlienPetType) {
        //先判断是不是猫狗和高价值异宠
        //签署状态（true为已签署）
        if (!this.signStatu.signed) {
          this.isLockTheOrderPopShow = true;
          this.lockType = false;
          return;
        }
      }
      console.log("新增能否购买的判断逻辑", this.hasVirtual);

      // 新增能否购买的判断逻辑
      // 全都是虚拟商品就不用判断地址
      if (!this.hasVirtual) {
        //从列表判断是否有门店商品 没有就不需要效验
        var res = this.initData?.cartShopList.find(function (item) {
          return item.shopType === 0;
        });
        if (res) {
          //有门店商品要判断能否购买
          /**
           * 自提商品选择配送到家也要判断，到店自提则不需要判断，到店自提需要判断距离5km
           */
          if (res.deliveryType == 1 || res.deliveryType == 2) {
            try {
              const {
                data: { data },
              } = await queryRangeStore({
                errorNo: "2",
                lat: this.addressInfo.lat,
                lon: this.addressInfo.lon,
                cityCode:
                  (this.addressInfo.cityCode || this.addressInfo.adcode).slice(
                    0,
                    4
                  ) + "00",
              });
              if (data) {
                //判断门店的shopId是否在列表中
                if (res.shopId != data.shopId) {
                  // this.show = true;
                  // return;
                }
              } else {
                // this.show = true;
                // return;
              }
            } catch (error) {
              // this.show = true;
              // return;
            }
          }
          /**
           * 超过5km逻辑判断取消
           */
          //确认 deliveryType 字段是什么意思
          if (res.deliveryType == 4) {
            this.isDeliverySubmitPopShow = true;
            const { lat, lon } =
              this.selfCheckoutInfo.selfCheckoutAddress.shopAddressInfo;
            const dis = await this.handleDistance(lat, lon);
            this.isDeliverySubmitPopShow = true;
            this.selfCheckoutInfo = {
              ...this.selfCheckoutInfo,
              distance: dis,
            };
            return;

            // console.log("🚀 ~ submit ~ distance:", distance);
          }
        }
        console.log("this.addressInfo", this.addressInfo);

        //更新地址
        let data = {
          ...this.addressInfo,
          cartType: this.submitOptions.cartType == 1 ? 1 : 2, //结算方式（1:购物车 2:立即购买）
          consigneeAddressId: this.consigneeAddressId,
          shopId: this.submitOptions.shopId,
          tenantId: "default_tenant",
        };
        /**
         * 自提时如果没有地址
         */
        if (this.isShowAddress) {
          try {
            const res = await editAddressApi(data);
            if (!res.data.data.isSuccess) {
              return;
            }
          } catch (err) {
            return;
          }
        }
      }
      console.log("拉起订阅");
      let that = this;
      uni.showLoading({
        mask: true,
      });
      // #ifdef MP-WEIXIN
      // 创建订单，调起支付，
      uni.requestSubscribeMessage({
        tmplIds: [
          // 付款成功通知
          "eTZuVrsktCbx5_VGh8CISD3Fy57yjriI9HWCNxQqLY8",
          // 订单发货提醒
          "5RauA6GT66XJ9PAthVIozZYZUsEZeeMvJwHBFmvGyE8",
          // 订单交易完成通知
          "Gyzi80BUQo6NlJ8qao6UMH7HN7WSl8il5OTGtaiBeuc",
        ],
        fail(e) {
          console.log("拉起失败");

          console.log(e);
        },
        complete() {
          that.submitOrder();
        },
      });
      // #endif
      // #ifdef H5
      that.submitOrder();
      // #endif
    },

    async delay(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
      });
    },

    async nextOrder(tradeId, tradeNo) {
      console.log("order info: ", tradeId, tradeNo);
      let orderInfo = {};
      let isPaySucessful = false;
      // 轮询3次，查询是否支付成功，跳转支付成功页 或 详情
      uni.showLoading({
        mask: true,
      });
      this.showOverlay = true;

      try {
        // 查询订单信息
        const res = await GET_ORDER_TRADE_DETAIL({
          tradeId: tradeId,
        });

        let { orderNo, orderType, payAmount, saleOrderId } = res.data.data;
        this.score = res.data.data.score;
        orderInfo = {
          // orderNo: orderNo,
          orderId: saleOrderId,
          // orderType: orderType,
        };
        // 获取成功
        if (res.data?.code == 0 && res.data?.data?.paySuccessStatus) {
          isPaySucessful = true;
          this.isIncludeSelfDeliver = res.data?.data?.isSelfCheckoutOrder;
        }
      } catch (err) {
        console.log(err);
      }
      uni.hideLoading();
      // 支付后-清除存储的上次地址Id
      uni.removeStorageSync("consigneeAddressId");
      if (isPaySucessful) {
        const itemIds = [];
        const firstItem = this.initData?.cartShopList?.[0];
        if (firstItem) {
          itemIds.push(firstItem.itemId);
        }
        const orderObj = {
          orderId: orderInfo.orderId,
          orderType: orderInfo.orderType,
          itemIds,
          score: this.score,
          payAmount: this.payInfo.payAmount,
        };
        const orderJson = JSON.stringify(orderObj);
        // 支付成功
        console.log(
          "🚀 ~ 支付成功 ~ this.isIncludeSelfDeliver || this.isIncludeVirtualized:",
          this.isIncludeSelfDeliver,
          this.isIncludeVirtualized
        );
        if (this.isIncludeSelfDeliver) {
          // #ifdef MP-WEIXIN
          uni.redirectTo({
            url: `/pagesC/orderDetail/goodsOrderDetail/index?orderId=${orderInfo.orderId}`,
          });
          // #endif
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/pagesC/orderDetail/goodsOrderDetail/index?orderId=${orderInfo.orderId}&transparentTopBar=1`,
            closeOldWebview: 1,
          });
          // #endif
        } else if (this.isIncludeVirtualized) {
          // #ifdef MP-WEIXIN
          uni.redirectTo({
            url: `/pagesC/orderDetail/serviceOrderDetail/index?orderId=${orderInfo.orderId}`,
          });
          // #endif
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/pagesC/orderDetail/serviceOrderDetail/index?orderId=${orderInfo.orderId}&transparentTopBar=1`,
            closeOldWebview: 1,
          });
          // #endif
        } else {
          // #ifdef MP-WEIXIN
          uni.redirectTo({
            url: `/pagesC/paySuccess/index?orderInfo=${encodeURIComponent(
              orderJson
            )}`,
          });
          // #endif
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${
              window.location.origin
            }/crm-medical-h5/#/pagesC/paySuccess/index?orderInfo=${encodeURIComponent(
              orderJson
            )}`,
            closeOldWebview: 1,
          });
          // #endif
        }
      } else {
        // 支付失败
        setTimeout(() => {
          // #ifdef MP-WEIXIN
          uni.redirectTo({
            url: `/pagesC/mallOrderList/index`,
          });
          // #endif
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/pagesC/mallOrderList/index`,
            closeOldWebview: 1,
          });
          // #endif
        }, 200);
      }
    },

    navToPaySuccess(orderInfo) {
      const itemIds = [];
      const firstItem = this.initData?.confirmItemList?.[0];
      if (firstItem) {
        itemIds.push(firstItem.itemId);
      }
      const orderJson = JSON.stringify({
        orderId: orderInfo.orderId,
        orderType: orderInfo.orderType,
        itemIds,
      });
      // 支付成功
      uni.redirectTo({
        url: `/pagesC/paySuccess/index?orderInfo=${encodeURIComponent(
          orderJson
        )}`,
      });
    },

    async submitOrder() {
      console.log("调用了submitOrder方法");
      try {
        const { tradeId, tradeNo } = await this.createMallOrder();
        this.tradeId = tradeId;
        this.tradeNo = tradeNo;
        // 判断子单or整单 === 目前认为创建订单这里为整单，只有我的待付款才是子单
        console.log("orderInfo: ", tradeId, tradeNo);
        // #ifdef MP-WEIXIN
        // 微信支付
        this.requestWxPay(tradeId, tradeNo);
        // #endif
        // #ifdef H5
        this.requestAppPay(tradeId, tradeNo);
        // #endif
      } catch (err) {
        uni.hideLoading();
        console.log("捕获异常 ===================，", err);

        // uni.showToast({
        //   icon: "none",
        //   title: err,message,
        //   duration: 4000
        // });
      }
    },

    async getUserMemberId() {
      let memberId = this.userInfo?.memberId;
      if (memberId) {
        console.log(`memberId: ${memberId}`);
        return memberId;
      }

      const user = await getUserInfo(true, true);
      if (this.userInfo) {
        this.userInfo.memberId = memberId;
      }
      console.log(`memberId: ${user.memberId}`);
      return user.memberId;
    },

    async createMallOrder() {
      // 判断是否空
      const firstItem = this.initData?.confirmItemList?.[0];

      const memberId = await this.getUserMemberId();
      // 相比 服务订单， 增加 addressId, remark, source=1-商城订单
      let shopRemarkDTOList = [];
      this.initData.cartShopList.map((item) => {
        shopRemarkDTOList.push({
          shopId: item.shopId,
          remark: item.remark,
          deliveryType: item.deliveryType,
          selfCheckoutPhone: this.selfCheckoutInfo?.selfCheckoutPhone || "",
          selfCheckoutStartTime:
            this.selfCheckoutInfo?.selfCheckoutStartTime || "",
          selfCheckoutEndTime: this.selfCheckoutInfo?.selfCheckoutEndTime || "",
        });
      });
      var resShop = this.initData?.cartShopList.find(function (item) {
        return item.shopType === 0;
      });
      const data = {
        memberId,
        shopId: resShop?.shopId || 0,
        // orderType: "021",
        // 微信支付
        cartType: this.submitOptions.cartType == 1 ? 1 : 2,
        // sourceOrderType: 5,
        shopRemarkDTOList: shopRemarkDTOList,
        // 新增两个参数 -
        consigneeAddressId: this.consigneeAddressId,
        lastConsigneeAddressId: this.lastConsigneeAddressId, // 切换地址前的地址id, // 上一次收货地址id
        memberCouponId: this.checkedCouponId,
        sourceChannel: this.sourceChannel,
        supportActivity: true,
        refreshCommodityOwner: this.queryDistanceBool, // 刷新商品所属

        signInstanceId: this.signRefRelationId,
      };
      try {
        const res = await CREATE_ORDERv3(data);
        console.log("create order: ", res);
        if (res?.data && res?.data?.code == 0) {
          return {
            tradeId: res.data.data.tradeId,
            tradeNo: res.data.data.tradeNo,
          };
        }
      } catch (err) {
        console.log(err.message, "=================");
        const code = err.code;
        if ([30000, 30001].includes(code)) {
          this.codePop = err.code;
          this.messagePop = err.message;
          this.show = true;
        } else {
          uni.showModal({
            title: "提示",
            content: err.message,
            confirmText: "确定",
            showCancel: false,
            success: () => {},
          });
        }
      }
    },

    async getWxMpPrepayInfo(tradeId, tradeNo, payAmount) {
      // 支付金额
      const that = this;
      const memberId = await this.getUserMemberId();
      const { userId, openId } = uni.getStorageSync("storage_info");
      let data = {
        memberId,
        biz: "O2O",
        tradeNo: tradeNo,
        commodityName: `宠胖胖订单-${tradeNo}`,
        tradeAmount: payAmount,
        payType: "WX",
        payServiceType: "WECHAT_JSXCX",
        channelUserId: openId,
        payMode: "FULL_ORDER_PAY", // 整单
      };
      const discountAmount = this.payInfo?.couponDiscountAmount || 0;
      if (discountAmount > 0) {
        data = {
          ...data,
          discountAmount,
        };
      }
      const promotionAmount = this.payInfo?.activityDiscountAmount || 0;
      if (promotionAmount > 0) {
        data = {
          ...data,
          promotionAmount,
        };
      }
      return await PREPAY_WX_MP(data);
    },
    handleBack() {
      uni.navigateBack();
    },
    // 确认订单页改为由云超发货
    handleConfirm(bool) {
      this.getSubmitInitData(true, bool);
    },
    handleShopPromotionRowClick() {
      this.isShowShopPromotionPop = true;
    },
    /**
     * 自提门店超出范围判断
     */
    handleDistance(lat1, lng1) {
      let lat2 = "";
      let lng2 = "";
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "gcj02", //设置type为gcj02
          isHighAccuracy: true,
          success: async (res) => {
            lat2 = res.latitude;
            lng2 = res.longitude;
            let rad1 = (lat1 * Math.PI) / 180.0;
            let rad2 = (lat2 * Math.PI) / 180.0;
            let a = rad1 - rad2;
            let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
            let s =
              2 *
              Math.asin(
                Math.sqrt(
                  Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(rad1) *
                      Math.cos(rad2) *
                      Math.pow(Math.sin(b / 2), 2)
                )
              );
            s = s * 6378.137;
            s = Math.round(s * 10000) / 10000;
            s = s.toString();
            s = s.substring(0, s.indexOf(".") + 2);
            resolve(s);
          },
        });
      });
    },
    /**
     * 自提门店超出范围确定弹窗
     */
    handleDeliverySubmitPopClose() {
      this.isDeliverySubmitPopShow = false;
    },
    /**
     * 当前收货地址超出配送范围弹窗
     */
    handleHighValueLivePopClose() {
      this.isHighValueLivePopShow = false;
    },
    handleLockTheOrderPopClose() {
      this.isLockTheOrderPopShow = false;
    },
    handleLockTheOrderPopConfirm() {
      if (this.lockType) {
        //联系门店逻辑
      } else {
        //去签署逻辑
        this.isLockTheOrderPopShow = false;
        this.contractPopShow = true;
      }
    },
    async handleDeliverySubmitPopConfirm() {
      //更新地址
      let data = {
        ...this.addressInfo,
        cartType: this.submitOptions.cartType == 1 ? 1 : 2, //结算方式（1:购物车 2:立即购买）
        consigneeAddressId: this.consigneeAddressId,
        shopId: this.submitOptions.shopId,
        tenantId: "default_tenant",
      };
      /**
       * 自提时如果没有地址
       */
      if (this.isShowAddress) {
        try {
          const res = await editAddressApi(data);
          if (!res.data.data.isSuccess) {
            return;
          }
        } catch (err) {
          return;
        }
      }

      console.log("拉起订阅");
      let that = this;
      uni.showLoading({
        mask: true,
      });
      // #ifdef MP-WEIXIN
      // 创建订单，调起支付，
      uni.requestSubscribeMessage({
        tmplIds: [
          // 付款成功通知
          "eTZuVrsktCbx5_VGh8CISD3Fy57yjriI9HWCNxQqLY8",
          // 订单发货提醒
          "5RauA6GT66XJ9PAthVIozZYZUsEZeeMvJwHBFmvGyE8",
          // 订单交易完成通知
          "Gyzi80BUQo6NlJ8qao6UMH7HN7WSl8il5OTGtaiBeuc",
        ],
        fail(e) {
          console.log("拉起失败");

          console.log(e);
        },
        complete() {
          that.submitOrder();
        },
      });
      // #endif
      // #ifdef H5
      that.submitOrder();
      // #endif
    },
    /**
     * 获取自提信息
     */
    async getSelfTakeInfo(storeId) {
      try {
        const res = await GET_SELFTAKE_INFO({
          storeId,
          tenantId: "default_tenant",
        });
        const { data } = res.data;
        this.selfCheckoutInfo = {
          ...data,
          selfCheckoutTimeStr:
            data.selfCheckoutStartTime.substr(0, 16) +
            "-" +
            data.selfCheckoutEndTime.split(" ")[1].substr(0, 5),
        };
      } catch (error) {}
    },
    async handleChangeDeliveryType(deliveryType) {
      if (deliveryType !== 4 && this.isShowAddress) {
        let ifShowCanPay = this.initData.cartShopList.find(function (item) {
          return item.shopType === 0 && item.deliveryType == 4;
        });
        console.log("当前是否有自提商品", this.hasDelivery, ifShowCanPay);
        if (ifShowCanPay) {
          if (!this.addressInfo) {
            uni.showModal({
              title: "提示",
              content: "请添加收货地址",
              confirmText: "确定",
              showCancel: false,
              success: () => {},
            });
            return;
          }
          try {
            const {
              data: { data },
            } = await queryRangeStore({
              errorNo: "3",
              lat: this.addressInfo.lat,
              lon: this.addressInfo.lon,
              cityCode:
                (this.addressInfo.cityCode || this.addressInfo.adcode).slice(
                  0,
                  4
                ) + "00",
            });
            if (data.shopId) {
              //判断门店的shopId是否在列表中
              if (ifShowCanPay.shopId != data.shopId) {
                // this.show = true;
                // return;
              }
            } else {
              // this.show = true;
              // return;
            }
          } catch (error) {
            // this.show = true;
            // return;
          }
        }
      }
      let that = this;
      try {
        const res = await settlement({
          cartType: this.submitOptions.cartType == 1 ? 1 : 2, //结算方式（1:购物车 2:立即购买）
          // #ifdef MP-WEIXIN
          shopId: uni.getStorageSync("onlineCurMallId") || this.mallShopId || 0,
          // #endif
          // #ifdef H5
          shopId:
            this.$dsBridge.call("getMallShopId", "getMallShopId") ||
            this.mallShopId ||
            0,
          // #endif
          tenantId: "default_tenant",
          refresh: true,
          sourceType: 5,
          consigneeAddressId: this.consigneeAddressId,
          lastTimeConsigneeAddressId: this.lastConsigneeAddressId, // 切换地址前的地址id, // 上一次收货地址id
          memberCouponId: this.checkedCouponId,
          sourceChannel: this.sourceChannel,
          supportActivity: true,
          deliveryType: deliveryType,
        });
        const data = res.data?.data;
        if (res.data?.code == 0 && data) {
          uni.setStorageSync(
            "consigneeAddressId",
            data.consigneeAddress?.consigneeAddressId
          );
          if (this.sourceChannel === "1") {
            const cartShopList = this.initData.cartShopList;
            this.initData.cartShopList = cartShopList.map((e) => {
              return {
                ...e,
                returnPolicy: "新人活动商品不支持退换",
              };
            });
          }
          this.payInfo = data?.priceDetail;

          this.checkedCouponId = data.couponDetail?.memberCouponId;

          // let shopMerchantDetail = data.cartShopList.find(
          //   (i) => i.shopType == 0 && !i.virtualized && i.deliveryType == 1
          // );
          // if (shopMerchantDetail?.minimumOrderAmount) {
          //   shopMerchantDetail?.priceDetail.skuAmount >=
          //   shopMerchantDetail?.minimumOrderAmount
          //     ? (this.submitText = "提交订单")
          //     : (this.submitText = `门店商品差¥${Number.parseFloat(
          //         shopMerchantDetail?.minimumOrderAmount -
          //           shopMerchantDetail?.priceDetail.skuAmount
          //       ).toFixed(2)}起送`);
          // } else {
          //   this.submitText = "提交订单";
          // }
          let shopMerchantDetail = data.cartShopList.find(
            (i) =>
              i.shopType == 0 &&
              !i.virtualized &&
              (i.deliveryType == 1 || i.deliveryType == 2)
          );
          if (shopMerchantDetail) {
            const minDifferenceAmount = Math.abs(
              Number(shopMerchantDetail.minDifferenceAmount || 0)
            );
            this.submitText =
              minDifferenceAmount === 0
                ? "提交订单"
                : `门店商品差¥${Number.parseFloat(minDifferenceAmount).toFixed(
                    2
                  )}起送`;
          } else {
            this.submitText = "提交订单";
          }
          if (data?.priceDetail.couponDiscountAmount > 0) {
            this.getCouponList();
          }
          this.initData = data;
          // 标记是否有虚拟（服务）订单
          const { cartShopList } = this.initData;
          // 有且仅有一个商品，标记虚拟商品
          if (cartShopList && cartShopList.length === 1) {
            this.isIncludeVirtualized = cartShopList.every(
              (item) => item.virtualized
            );
          }
          this.initData?.cartShopList.forEach((item, index) => {
            if (this.reMarkList[item.shopId]) {
              item.remark = this.reMarkList[item.shopId];
            } else {
              item.remark = "";
            }
          });
          if (deliveryType == 4) {
            let storeId = data.cartShopList.find(
              (i) => i.shopType == 0 && !i.virtualized
            )?.storeId;
            if (storeId) {
              this.getSelfTakeInfo(storeId);
            }
          }
        }
      } catch (error) {
        // code：30000、30001判断是否同城配送
        const code = error.code;
        if ([30000, 30001].includes(code)) {
          this.codePop = error.code;
          this.messagePop = error.message;
          this.show = true;
        } else {
          throw error.data?.message ?? "确认订单获取失败";
        }
      }
    },
    handleUpdataDeliveryInfo(e) {
      this.selfCheckoutInfo = {
        ...this.selfCheckoutInfo,
        selfCheckoutEndTime: e.selfCheckoutEndTime,
        selfCheckoutPhone: e.selfCheckoutPhone,
        selfCheckoutStartTime: e.selfCheckoutStartTime,
        selfCheckoutTimeStr:
          e.selfCheckoutStartTime.substr(0, 16) +
          "-" +
          e.selfCheckoutEndTime.split(" ")[1].substr(0, 5),
      };
    },
    handleIsShowTimePop(e) {
      this.isShowTimePop = e;
    },
    //app支付前置
    async requestAppPay(tradeId, tradeNo) {
      console.log("app支付前置调用了requestAppPay", tradeId, tradeNo);

      let that = this;
      try {
        // 微信 预支付信息
        const res = await this.getAppPrePayInfo(tradeId, tradeNo);
        console.log("🚀 ~app侧 requestAppPay ~ res:", res);
        // 支付订单
        const wxPayOrder = res?.data?.data;
        if (res?.data?.code != 0) {
          throw res.data?.message ?? "支付生成订单失败";
        }
        if (res?.data?.data?.zeroPayFlag) {
          //  0元购
          // 0元购直接跳到订单详情
          this.nextOrder(tradeId, tradeNo);
        } else {
          let that = this;
          //唤起微信or支付宝支付，跳出页面，返沪触发onshow
          const { appId, payOrderNo } = wxPayOrder;
          this.$dsBridge.call("gotoPay", {
            appId,
            payOrderNo,
            type: that.currentPayType,
          });
          this.$emit("requestAppPay", { tradeId, tradeNo });
        }
        uni.hideLoading();
      } catch (err) {
        console.log("wx prepay err: ", err);
        uni.hideLoading();
        if (typeof err === "string") {
          uni.showToast({
            icon: "none",
            title: err,
          });
        }
        // 直接 跳转订单详情
        setTimeout(() => {
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${
              window.location.origin
            }/crm-medical-h5/#/pagesC/mallOrderList/index?listIndex=${1}`,
            closeOldWebview: 1,
          });
        }, 200);
      }
    },
    //app侧获取prepay信息
    async getAppPrePayInfo(tradeId, tradeNo) {
      // 支付金额
      const that = this;
      const memberId = await this.getUserMemberId();
      const { userId, openId } = JSON.parse(
        this.$dsBridge.call("getUserInfo", "getUserInfo")
      );
      console.log("h5getUserInfo", userId, openId);
      let data = {
        memberId,
        biz: "O2O",
        tradeNo: tradeNo,
        commodityName: `宠胖胖订单-${tradeNo}`,
        tradeAmount: that.payInfo.payAmount,
        payType: this.currentPayType,
        payServiceType:
          this.currentPayType == "WX" ? "WECHAT_JSXCX" : "ALIPAY_ALXCX",
        channelUserId: openId,
        payMode: "FULL_ORDER_PAY", // 整单
        tenantId: "default_tenant",
        platformId: "1699310123233079297",
        appId: "1719257571221630978",
      };
      const discountAmount = this.payInfo?.couponDiscountAmount || 0;
      if (discountAmount > 0) {
        data = {
          ...data,
          discountAmount,
        };
      }
      const promotionAmount = this.payInfo?.activityDiscountAmount || 0;
      if (promotionAmount > 0) {
        data = {
          ...data,
          promotionAmount,
        };
      }
      return await APP_PREPAY(data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../index.scss";

.price-wrapper {
  background: #ffffff;
  border-radius: 15rpx;
  margin-top: 20rpx;
  padding: 34rpx 23rpx;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 46rpx;
    .item-title {
      font-size: 29rpx;
      font-weight: 400;
      color: #1f1f1f;
    }
    .item-value {
      display: flex;
      align-items: center;
      font-size: 25rpx;
      font-family: D-DIN, D-DIN;
      font-weight: bold;
      color: #1f1f1f;
      .price {
        font-size: 25rpx;
        font-family: D-DIN, D-DIN;
        font-weight: bold;
        color: #ff5b05;
      }
    }
    .coupon {
      font-size: 29rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
  }
  .illustrate {
    // margin-bottom: 46rpx;
    .illustrate-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .illustrate-item-title {
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
      }
      .illustrate-item-value {
        display: flex;
        align-items: center;
        font-size: 27rpx;
        color: #fe2442;
        font-family: D-DIN, D-DIN;
        font-weight: 400;
      }
    }
    .item-illustrate {
      font-weight: 400;
      font-size: 25rpx;
      color: #999999;
      line-height: 35rpx;
      font-weight: 400;
      text-align: right;
      margin-top: 10rpx;
    }
  }
  .prompt {
    width: 100%;
    height: 69rpx;
    margin: 15rpx 0 0 0;
    background: #fcf7ee;
    border-radius: 12rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 25rpx;
    color: #6e4708;
    line-height: 69rpx;
    text-align: center;
    font-style: normal;
  }

  .all-price {
    margin-top: 25rpx;
    text-align: right;
    font-size: 29rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #666666;
    .price {
      font-size: 33rpx;
      font-weight: 600;
      color: #fe2442;
    }
  }
}
.agreement {
  //   width: 719rpx;
  // height: 112rpx;
  background: #ffffff;
  border-radius: 23rpx;
  padding: 36rpx 29rpx;
  margin: 19rpx 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .agreement-title {
    font-weight: 400;
    font-size: 29rpx;
    color: #1f1f1f;
    line-height: 40rpx;
  }
  .agreement-right {
    // min-width: 98rpx;
    height: 42rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.pangdou {
  background: #ffffff;
  border-radius: 15rpx;
  margin-top: 20rpx;
  padding: 34rpx 23rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .item-title {
    font-size: 29rpx;
  }
  .item-value {
    color: #fe2442;
    font-size: 29rpx;
    line-height: 37rpx;
  }
}

.submit-wrapper {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;

  .right-arrow {
    height: 31rpx;
    width: 31rpx;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/index/arrow-right-tag.png);
  }

  .submit-info {
    display: flex;
    flex-flow: column nowrap;
    padding-left: 15rpx;
    padding-right: 15rpx;
    padding-bottom: 196rpx;

    .address-info {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      position: relative;
      overflow: hidden;
      background-color: white;
      border-radius: 15rpx;
      padding: 30rpx 15rpx 30rpx 23rpx;
      min-height: 144rpx;

      .empty-hint {
        font-size: 31rpx;
        font-weight: bold;
        color: #1f1f1f;
        flex: 1 1 0;
      }

      .address {
        font-size: 31rpx;
        font-weight: bold;
        color: #1f1f1f;
        margin-bottom: 10rpx;
      }

      .receiver {
        font-size: 27rpx;
        font-weight: 400;
        color: #1f1f1f;
        line-height: 38rpx;
        margin-top: 2rpx;
      }
    }

    .goods-wrapper {
      display: flex;
      flex-flow: column nowrap;
      border-radius: 15rpx;
      background-color: white;
      padding: 23rpx 23rpx 12rpx 23rpx;
      margin-top: 19rpx;
      .goods-box-title {
        font-size: 29rpx;
        font-weight: 500;
        color: #1f1f1f;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        margin-bottom: 27rpx;
      }
      .goods-gift-flag {
        height: 35rpx;
        background: #fff8f4;
        border-radius: 6rpx;
        border: 1rpx solid rgba(255, 91, 5, 0.33);
        margin-right: 12rpx;
        font-size: 23rpx;
        color: #ff5b05;
        padding-left: 8rpx;
        padding-right: 4rpx;
      }
      .ppyc {
        width: 120rpx;
        height: 32rpx;
      }
      .goods-item {
        display: flex;
        flex-flow: row nowrap;
        margin-bottom: 31rpx;

        .pic {
          width: 154rpx;
          height: 154rpx;
          border-radius: 9rpx;
          background-color: #f7f8fc;
        }

        .goods-info {
          display: flex;
          flex-flow: column nowrap;
          overflow: hidden;
          flex: 1 1 0;
          margin-left: 17rpx;

          .name {
            font-size: 29rpx;
            font-weight: bold;
            color: #1f1f1f;
            line-height: 37rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            align-items: center;
            .goods-gift-flag {
              line-height: 33rpx;
              background: #ffffff;
              border-radius: 6rpx;
              border: 1rpx solid #fe496a;
              margin-right: 12rpx;
              font-size: 23rpx;
              color: #fe2442;
              padding-top: 1rpx;
              padding-left: 8rpx;
              padding-right: 4rpx;
            }
          }

          .spec {
            font-size: 27rpx;
            font-weight: 400;
            color: #666666;
            line-height: 38rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 4rpx;
          }

          .price-num {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: flex-end;
            flex: 1 1 0;

            .num-text {
              font-size: 13px;
              font-weight: bold;
              color: #1f1f1f;
              margin-bottom: 3rpx;
            }
          }
        }
      }
    }

    .underline {
      position: absolute;
      height: 4rpx;
      width: 100%;
      bottom: 0;
      left: 0;
      right: 0;
      background-repeat: repeat-x;
      background-size: contain;
      background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/order_detail_header_line.png);
    }

    .goods-remark {
      // height: 112rpx;
      background-color: white;
      // border-radius: 15rpx;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding: 20rpx 0 22rpx 0;

      .name {
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
      }

      .value {
        font-size: 29rpx;
        font-weight: 400;
        color: #666666;
        margin-left: 46rpx;
        text-align: right;
        // 一行 省略
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1 1 0;
      }
    }
  }
}
.header-bar {
  font-size: 27rpx;
  font-weight: 400;
  color: #666666;
  padding: 0 0 10rpx 0;
}
.pay-item {
  .name {
    font-weight: 400 !important;
  }
}
.bottom-submit {
  .submit {
    background: #fe2442;
    color: white;
    min-width: 250rpx;
  }
  .submitForbid {
    background: #eaeaea;
    color: #1f1f1f;
  }
}
.remark-info {
  background: #ffffff;
  border-radius: 15rpx;
  margin-top: 19rpx;

  padding: 34rpx 23rpx 23rpx 31rpx;

  .title {
    font-size: 29rpx;
    color: #1f1f1f;
    margin-bottom: 7rpx;
  }

  .desc {
    font-size: 27rpx;
    color: #666666;
    white-space: pre-wrap;
    line-height: 54rpx;
  }
}

.sign-contract-box {
  position: fixed;
  bottom: 164rpx;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 96rpx;
  padding: 26rpx 28rpx 26rpx 28rpx;
  box-shadow: 0rpx 2rpx 0rpx 0rpx #f8f8f8;
  font-size: 29rpx;
  color: #fe2442;
  background-color: #ffefef;
  .text-32 {
    height: 40rpx;
    font-weight: 600;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }
  .flex-row {
    display: flex;
    align-items: center;
  }
  .text-group-4 {
    font-weight: 600;
    line-height: 40rpx;
    text-align: right;
    font-style: normal;
  }
  .thumbnail-4 {
    width: 42rpx;
    height: 42rpx;
  }
}
.cell-item-title {
  display: flex;
  align-items: center;
  .icon-instructions {
    color: #666666;
    margin-left: 9rpx;
  }
}
</style>
