<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @close="handleCancel"
    :round="20"
    @touchmove.stop.prevent
  >
    <view class="addDetailPop">
      <view class="header">
        <view class="title">加项介绍</view>
        <image
          class="cancel"
          @click="handleCancel"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/del.png"
          fit="contain"
        />
      </view>
      <view class="skuCard">
        <view v-if="skuListData && skuListData.length > 0">
          <!-- 服务列表 -->
          <scroll-view scroll-x class="sku-wrapper">
            <!-- 服务商品 -->
            <!-- 商品数量：1/2 -->
            <template v-if="skuListData.length == 1">
              <view
                v-for="item in skuListData"
                :key="item.skuId"
                :class="[
                  'sku-item',
                  newSelectedSkuId == item.skuId ? 'selected' : '',
                  skuListData.length == 1 ? 'oneSku' : '',
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
                    :class="[newSelectedSkuId == item.skuId ? 'selected' : '']"
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
                      :class="[
                        newSelectedSkuId == item.skuId ? 'selected' : '',
                      ]"
                    >
                      <view
                        :class="[
                          'sku-duration-text',
                          newSelectedSkuId == item.skuId ? 'selected' : '',
                        ]"
                        >{{ item.duration }}分钟</view
                      >
                    </view>
                  </view>
                </view>
              </view>
            </template>
            <!-- 商品数量：2+ -->
            <template v-else>
              <view class="sku-item-wrapper">
                <view
                  v-for="(item, index) in skuListData"
                  :key="index"
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
                      {{ item.skuName }}</view
                    >
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
                        :class="[
                          newSelectedSkuId == item.skuId ? 'selected' : '',
                        ]"
                      >
                        <view
                          :class="[
                            'sku-duration-text',
                            newSelectedSkuId == item.skuId ? 'selected' : '',
                          ]"
                          >{{ item.duration }}分钟</view
                        >
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </scroll-view>
        </view>
        <view class="sku-empty" v-else>
          <view class="empty-text"> 该门店暂无可约项目，具体请咨询门店 </view>
        </view>
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
            class="noticecontent noticecontent-color"
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
      type: Array,
      default() {
        return [];
      },
    },
    selectedSkuId: {
      type: String,
      default: "",
    },
  },
  watch: {
    isOpen: {
      handler(val, oldVal) {
        if (val) {
          this.newSelectedSkuId = this.selectedSkuId;
          this.newCommodityDetail = this.skuListData[0];
        }
      },
      immediate: true,
      deep: true,
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
    },
    handleShopSkuItemClick(item) {
      // 选择 sku
      this.newSelectedSkuId = item.skuId;
      this.newCommodityDetail = item;
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
