<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="handleCancel"
    :round="20"
    @touchmove.stop.prevent
  >
    <view class="petPop skuDetailPop">
      <view class="header">
        <view class="title">服务介绍</view>
        <image
          class="cancel"
          @click="handleCancel"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/del.png"
          fit="contain"
        />
      </view>
      <view class="skuCard">
        <template v-if="skuListData">
          <view v-if="skuListData.data && skuListData.data.length > 0">
            <!-- 服务列表 -->
            <scroll-view scroll-x class="sku-wrapper">
              <!-- 服务商品 -->
              <view class="sku-item-wrapper">
                <view
                  v-for="item in skuListData.data.flat()"
                  :key="item.skuId"
                  :class="[
                    'sku-item',
                    newSelectedSkuId == item.skuId ? 'selected' : '',
                  ]"
                  @click="handleShopSkuItemClick(item)"
                >
                  <image
                    class="sku-pic"
                    :src="item.skuPicture"
                    mode="aspectFill"
                  ></image>
                  <view class="sku-content">
                    <view
                      class="sku-name"
                      :class="[
                        newSelectedSkuId == item.skuId ? 'selected' : '',
                      ]"
                    >
                      {{ item.skuName }}
                    </view>
                    <view class="sku-info">
                      <!-- 价格 -->
                      <view
                        v-if="
                          item.skuPrice !== undefined && item.skuPrice !== null
                        "
                        class="sku-price"
                      >
                        <GoodsPrice
                          :salePrice="item.skuPrice"
                          :saleColor="'#FE2442'"
                          :saleSignWidth="0"
                          :saleFontWeight="100"
                          :saleSignFontSize="25"
                          :salePriceIntegerFontSize="25"
                          :salePriceDecimalFontSize="25"
                        >
                        </GoodsPrice>
                        <view
                          style="
                            margin-left: 2rpx;
                            font-size: 17rpx;
                            color: #fe2442;
                          "
                          >起</view
                        >
                      </view>
                      <!-- 时间 -->
                      <view
                        v-if="
                          item.duration !== undefined && item.duration !== null
                        "
                        class="sku-duration"
                      >
                        <view
                          class="sku-duration-box"
                          :class="[
                            newSelectedSkuId == item.skuId ? 'selected' : '',
                          ]"
                          >{{ item.duration }}分钟</view
                        >
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
          <view class="sku-empty" v-else>
            <view class="empty-text"> 该门店暂无可约项目，具体请咨询门店 </view>
          </view>
        </template>
      </view>
      <view class="content">
        <template v-if="newCommodityDetail.introductionType == 1">
          <scroll-view scroll-y class="noticecontent imagecontent">
            <image :src="newCommodityDetail.introduction" mode="widthFix" />
          </scroll-view>
        </template>
        <template v-else-if="newCommodityDetail.introductionType == 2">
          <view
            v-html="newCommodityDetail.introduction"
            class="noticecontent"
          ></view>
        </template>
      </view>
      <!-- <view class="footers">
        <view class="new" @click="handleAddSkuInfo">
          <view class="text">确定</view>
        </view>
      </view> -->
    </view>
  </u-popup>
</template>

<script>
import GoodsPrice from "@/components/goodsPrice/index.vue";
import { action_report, display_report } from "@/utils/track";

const module_name = "store";

export default {
  components: {
    GoodsPrice,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    skuListData: {
      type: Object,
      default() {
        return {};
      },
    },
    selectedSkuId: {
      type: String,
      default: "",
    },
    commodityDetail: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    selectedSkuId(newVal) {
      if (newVal) {
        this.newSelectedSkuId = newVal;
        this.newCommodityDetail = this.commodityDetail;
      }
    },
    isOpen(newVal) {
      if (this.newSelectedSkuId) {
        // this.newSelectedSkuId = newVal;
        this.newCommodityDetail = this.commodityDetail;
      }
    },
  },
  data() {
    return {
      newCommodityDetail: {},
      newSelectedSkuId: "",
    };
  },
  computed: {},
  onLoad(options) {},
  onReady() {},
  methods: {
    handleOpen() {
      console.log("sku detail show");
      display_report({
        display_name: "appointmentsubmit_servicebrief_show",
        object_type: module_name,
        extend: {},
      });
    },
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      this.newSelectedSkuId = this.selectedSkuId;
      this.newCommodityDetail = {};
    },
    handleAddSkuInfo() {
      this.$emit("confirm", this.newSelectedSkuId, this.newCommodityDetail);
      this.$emit("update:isOpen", false);
      this.$emit("close", false);

      // 埋点
      console.log("choose skuId: ", this.newSelectedSkuId);
      action_report({
        action_name: "appointmentsubmit_servicebrief_chose",
        module_name: module_name,
        extend: {
          skuId: this.newSelectedSkuId,
        },
      });
    },
    handleShopSkuItemClick(item) {
      // 选择 sku
      this.newSelectedSkuId = item.skuId;
      this.newCommodityDetail = item;
      this.$emit("confirm", this.newSelectedSkuId, this.newCommodityDetail);
    },
    isImageUrl() {
      return /^http:\/\/.*/g.test(this.newCommodityDetail.introduction);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
