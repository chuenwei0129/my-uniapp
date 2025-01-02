<template>
  <u-popup :show="isOpen" mode="bottom" @close="handleCancel" :round="20">
    <view class="petPop addItemPop">
      <view class="header">
        <view class="title">添加加项</view>
        <image
          class="cancel"
          @click="handleCancel"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/del.png"
          fit="contain"
        />
      </view>
      <scroll-view class="list" scroll-y>
        <div class="good-list">
          <div class="add-item" v-for="(item, index) in goodsList" :key="index">
            <div class="contents" @click="handleSelect(item, index)">
              <div class="r">
                <image
                  v-if="item.selected"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/choose-selected.png"
                  mode="scaleToFill"
                />
                <image
                  v-else
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/choose-noselect.png"
                  mode="scaleToFill"
                />
              </div>
              <div class="l">
                <div class="name">{{ formatSkuName(item) }}</div>
                <div v-if="item.skuPrice !== null" class="price">
                  <GoodsPrice
                    :salePrice="item.skuPrice"
                    saleColor="#1F1F1F"
                    :saleFontWeight="100"
                    :saleSignWidth="0"
                    :saleSignFontSize="29"
                    :salePriceIntegerFontSize="35"
                    :salePriceDecimalFontSize="23"
                  >
                  </GoodsPrice>
                  <view
                    style="font-size: 17rpx; color: #1f1f1f; margin-left: 2rpx"
                    >起</view
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <view class="footers">
        <view
          :class="['new', total <= 0 ? 'disabled' : '']"
          @click="handleAddSkuInfo"
        >
          <view class="text"
            >确定 <span>({{ total }})</span></view
          >
        </view>
      </view>
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
    selectedSkuIds: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      goodsList: [],
    };
  },
  computed: {
    total() {
      return this.goodsList.filter((g) => g.selected).length;
    },
    formatSkuName() {
      return (item) => {
        const durationText = item.duration > 0 ? `${item.duration}分钟 ` : "";
        return `${durationText}${item.skuName}`;
      };
    },
  },
  watch: {
    skuListData: {
      handler(val, oldVal) {
        this.goodsList = val.map((g) => {
          return {
            ...g,
            selected: false,
          };
        });
      },
      immediate: true,
      deep: true,
    },
    isOpen: {
      handler(val, oldVal) {
        if (val) {
          this.goodsList = this.skuListData.map((g) => {
            const isSelect = this.selectedSkuIds.find((s) => {
              return s.skuId == g.skuId;
            });
            if (isSelect) {
              return {
                ...g,
                selected: true,
              };
            }
            return {
              ...g,
              selected: false,
            };
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleAddSkuInfo() {
      if (this.total <= 0) {
        uni.showToast({
          icon: "none",
          title: "请选择服务",
        });
        return;
      }
      const selectList = this.goodsList.filter((g) => g.selected);
      this.$emit("confirm", selectList);
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleSelect(item, index) {
      console.log("🚀 ~ handleSelect ~ item:", item);
      this.$set(this.goodsList, index, { ...item, selected: !item.selected });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
