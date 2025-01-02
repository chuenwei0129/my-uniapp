<script>
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
import GradientButton from "@/pagesC/components/gradientButton/index.vue";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import GoodsNumBox from "@/pagesC/components/goodsNumBox/index.vue";
import { mapState } from "vuex";

export default {
  name: "goodsUpdatePopView",
  components: { GoodsNumBox, GoodsPrice, GradientButton, CellItemNormal },
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
  },
  data() {
    return {
      buyNum: 1,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    salePrice() {
      return this.selectedSku?.salePrice || "";
    },
    lowestPrice() {
      return (
        this.selectedSku?.minLowestPrice || this.selectedSku?.lowestPrice || ""
      );
    },
    majorPicture() {
      return (
        this.selectedSku?.majorPicture ||
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/common_placeholder_icon.png"
      );
    },
    buyLimitNum() {
      return this.data?.saleStrategy?.buyLimitNum || -1;
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
  },

  emits: ["onClose", "onSelectSpec"],
  methods: {
    close() {
      this.$emit("onClose");
    },
    onSelectSpec(item, index) {
      if (item.disabled) return;
      if (this.skuId === item.id) return;
      uni.$emit("onSelectSpecClickHandle", [item, index]);
    },
    onChange(value) {
      this.buyNum = value;
      uni.$emit("onBuyNumChange", value);
    },
    onImageClickHandle(url) {
      // uni.previewImage({
      //   urls: "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png",
      //   current: 0,
      // });
    },
    onBuyClickHandle() {
      if (!this.userInfo.token) {
        this.goToLoginAction();
        return;
      }
      uni.navigateTo({
        url: `/pagesC/submitOrder/index?itemId=${this.itemId}&skuId=${
          this.skuId
        }&skuQty=${this.buyNum}&shopId=${
          this.shopId
        }&shopName=${encodeURIComponent(this.shopName)}&type=${this.goodsType}`,
      });
      this.$emit("onClose");
    },
    goToLoginAction() {
      uni.navigateTo({
        url: `/pagesD/login/index`,
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
              mode="widthFix"
              :src="majorPicture"
              @click="onImageClickHandle(majorPicture)"
            />
            <view class="price">
              <GoodsPrice :salePrice="lowestPrice" :originPrice="salePrice" />

              <view class="selected-sku">已选择：{{ selectSkuName }}</view>
            </view>
          </view>
          <view class="right">
            <image
              mode="aspectFit"
              :style="{ width: '50rpx', height: '50rpx' }"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
              @click="close"
            />
          </view>
        </view>
        <div class="content-wrapper">
          <div class="specs-wrapper">
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
                    disabled: item.disabled,
                  }"
                  >{{ item.nickName }}
                  {{ item.disabled ? "（缺货）" : "" }}</view
                >
              </view>
            </view>
          </div>
        </div>
        <div class="bottom-wrapper">
          <div class="bottom-buttons">
            <GradientButton
              title="确定"
              :fontSize="29"
              fontWeight="bold"
              color="linear-gradient(to right, #FFD41E, #FF9C00)"
              :borderRadius="43"
              @tap="$u.debounce(onBuyClickHandle, 500)"
            />
          </div>
        </div>
      </view>
    </u-popup>
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
      padding: 25rpx 31rpx 25rpx 25rpx;

      .left {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .picture {
          width: 93rpx;
          height: 93rpx;
          border-radius: 8rpx;
          ::v-deep {
            img {
              width: 93rpx;
              height: 93rpx;
              border-radius: 8rpx;
            }
          }
        }

        .price {
          margin-left: 25rpx;
          flex: 1;
          align-self: flex-start;

          .selected-sku {
            word-break: break-all;
            font-size: 24rpx;
            font-weight: 400;
            color: #999999;
            line-height: 35rpx;
          }
        }
      }

      .right {
        width: 50rpx;
        height: 50rpx;
        margin: 0 0 0 31rpx;
        ::v-deep {
          uni-image {
            img {
              width: 50rpx;
              height: 50rpx;
            }
          }
        }
      }
    }

    .content-wrapper {
      margin: 0 16rpx 60rpx;
      background-color: #ffffff;
      //background-color: rebeccapurple;
      border-radius: 16rpx;

      .specs-wrapper {
        min-height: 150rpx;
        max-height: calc(100vh * 0.5);
        padding: 28rpx 23rpx;
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
              background-color: rgba(255, 91, 5, 0.1);
              border: 0.5px solid #ff5b05;
              color: #ff5b05;
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
