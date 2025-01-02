<template>
  <view>
    <view class="filter-wrapper">
      <view class="tab-list">
        <view class="tab-flex">
          <!-- 门店 -->
          <view
            :class="['item', shopName !== '全部门店' ? 'active' : '']"
            @click="handleSelect(1)"
          >
            <i class="iconfont icon-store fo-size icon-margin"></i>
            <view class="item-text1">{{
              shopName && shopName.slice(0, 7)
            }}</view>
            <view :class="isSelected(1) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="shopName !== '全部门店' ? '#FE2442' : '#666666'"
                size="8"
              ></u-icon>
            </view>
          </view>
          <view
            :class="['item', IntelligentSort !== '智能排序' ? 'active' : '']"
            @click="handleSelect(2)"
          >
            <i class="iconfont icon-sort fo-size icon-margin"></i>
            <view class="item-text">{{ IntelligentSort }}</view>
            <view :class="isSelected(2) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="IntelligentSort !== '智能排序' ? '#FE2442' : '#666666'"
                size="8"
              ></u-icon>
            </view>
          </view>
          <view
            :class="['item', sexName !== '性别' ? 'active' : '']"
            @click="handleSelect(2)"
            v-if="false"
          >
            <i class="iconfont icon-gender fo-size icon-margin"></i>
            <view class="item-text">{{ sexName }}</view>
            <view :class="isSelected(2) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="sexName !== '性别' ? '#FE2442' : '#666666'"
                size="8"
              ></u-icon>
            </view>
          </view>
          <view
            :class="['item', priceName !== '价格' ? 'active' : '']"
            @click="handleSelect(3)"
            v-if="false"
          >
            <i class="iconfont icon-refund fo-size icon-margin"></i>
            <view class="item-text">{{ priceName }}</view>
            <view :class="isSelected(3) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="priceName !== '价格' ? '#FE2442' : '#666666'"
                size="8"
              ></u-icon>
            </view>
          </view>
          <!-- 智能排序 -->
          <!-- <view
            :class="['item', IntelligentSort !== '智能排序' ? 'active' : '']"
            @click="handleSelect(2)"
          >
            <i class="iconfont icon-sort fo-size icon-margin"></i>
            <view class="item-text">{{ IntelligentSort }}</view>
            <view :class="isSelected(2) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="IntelligentSort !== '智能排序' ? '#FE2442' : '#666666'"
                size="9"
              ></u-icon>
            </view>
          </view> -->
        </view>
        <!-- 筛选 -->
        <view
          :class="['item item3', filterSelected ? 'active' : '']"
          @click="handleSelect(3)"
        >
          <view class="item-text">筛选</view>
          <i class="iconfont icon-filtrate fo-size icon-margin"></i>
        </view>
      </view>
    </view>
    <view
      class="overlay"
      :style="{
        height: `${scrollHeight}`,
      }"
      v-if="show"
      @click.stop="overlayClick"
    >
      <!-- 门店  -->
      <view v-if="sortType === 1" @click.stop>
        <scroll-view scroll-y="true" class="popups">
          <view class="list">
            <view
              class="u-page__tag-item"
              v-for="(item, index) in propShopList"
              :class="item.checked ? 'tag-hit' : ''"
              :key="index"
              @click.stop="shopClick(item, index)"
            >
              <view class="shop-name">{{ item.name }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 智能排序 -->
      <view
        class="popups popups-padding"
        v-else-if="sortType === 2"
        @click.stop
      >
        <view
          class="u-page__tags-item"
          v-for="(item, index) in intelligentSortList"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="sortClick(item, index)"
          :style="{
            marginRight: (index + 1) % 3 == 0 ? '0rpx' : '25rpx',
          }"
        >
          <view>{{ item.name }}</view>
        </view>
      </view>
      <!-- <view
        class="popups popups-padding"
        v-else-if="sortType === 3"
        @click.stop
      >
        <view
          class="u-page__tags-item"
          v-for="(item, index) in propPriceList"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="priceClick(item, index)"
          :style="{
            marginRight: (index + 1) % 3 == 0 ? '0rpx' : '25rpx',
          }"
        >
          <view v-if="index === 0">{{ "全部" }}</view>
          <view v-else-if="item.priceRangeBegin && item.priceRangeEnd === ''"
            >{{ item.priceRangeBegin }}以上</view
          >
          <view v-else
            >{{ item.priceRangeBegin }}-{{ item.priceRangeEnd }}</view
          >
        </view>
      </view> -->
      <!-- 智能排序  -->
      <!-- <view class="popups" v-else-if="sortType === 2" @click.stop>
        <view
          class="u-page__tags-item"
          v-for="(item, index) in intelligentSortList"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="sortClick(item, index)"
        >
          <view>{{ item.name }}</view>
        </view>
      </view> -->
      <!-- 筛选  -->
      <view class="popups" v-else-if="sortType === 3" @click.stop>
        <scroll-view scroll-y="true" class="scroll-popups">
          <view class="filter-item-box" v-if="tabType !== '异宠'">
            <view class="filter-title">性别</view>
            <view class="list">
              <view
                class="u-page__tags-item"
                v-for="(item, index) in genderList"
                :class="item.checked ? 'tag-hit' : ''"
                :key="item.id"
                @click.stop="genderClick(item, index)"
              >
                <view>{{ item.name }}</view>
              </view>
            </view>
          </view>
          <view class="filter-item-box">
            <view class="filter-title">价格</view>
            <view class="list">
              <view
                class="u-page__tags-item"
                v-for="(item, index) in propPriceList"
                :class="item.checked ? 'tag-hit' : ''"
                :key="index"
                @click.stop="priceClick(item, index)"
              >
                <view v-if="index === 0">{{ "全部" }}</view>
                <view
                  v-else-if="item.priceRangeBegin && item.priceRangeEnd === ''"
                  >{{ item.priceRangeBegin }}以上</view
                >
                <view v-else
                  >{{ item.priceRangeBegin }}-{{ item.priceRangeEnd }}</view
                >
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="filter-btn">
          <view class="reset btn" @click="filterReset">重置</view>
          <view class="confirm btn" @click="filterConfirm">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { eventBus } from "@/utils/eventBus";

export default {
  name: "cutepetFilter",
  props: {
    scrollHeight: {
      type: String,
      default: "",
    },
    shopId: {
      type: String,
      default: "",
    },
    liveShopList: {
      type: Array,
      default: () => [],
    },
    priceList: {
      type: Array,
      default: () => [],
    },
    isClearOther: {
      type: Boolean,
    },
    changePetChangeFlag: {
      type: Boolean,
    },
    // 父组件传来用于同步吸顶筛选栏
    parentDataOut: {
      type: Object,
    },
    // tab类型，用于识别异宠
    tabType: {
      type: String,
    },
  },

  emits: ["onChange"],
  data() {
    return {
      sortType: 1,
      show: false,
      IntelligentSort: "直播优先",
      shopName: "全部门店",
      sexName: "性别",
      priceName: "价格",
      filterSelected: false, // 筛选
      intelligentSortList: [
        {
          name: "直播优先",
          checked: true,
          id: 1,
        },
        {
          name: "按上新时间",
          checked: false,
          id: 2,
        },
        {
          name: "按萌宠年龄",
          checked: false,
          id: 3,
        },
      ],
      genderList: [
        {
          name: "全部",
          checked: true,
          id: "0",
        },
        {
          name: "弟弟",
          checked: false,
          id: "1",
          sex: 1,
        },
        {
          name: "妹妹",
          checked: false,
          id: "2",
          sex: 2,
        },
      ],
      dataOut: {
        shopInfo: {},
        sortInfo: {},
        filterInfo: {
          sexInfo: {},
          priceInfo: {},
        },
      },
      propPriceList: [], // 存储prop传入
      propShopList: [], // 存储prop传入
      priceClick_item: {}, // 记录价格点击
      sexClick_item: {}, // 记录价格点击
      sortClick_item: {}, // 记录价格点击
    };
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {
    shopId: {
      immediate: true,
      handler(newValue, oldValue) {
        console.log(
          "🚀 ~ shopId ~ newValue, oldValue:",
          newValue,
          oldValue,
          this.propShopList
        );
        if (newValue !== oldValue) {
          if (newValue && this.propShopList.length == 0) {
            console.log("🚀 ~ shopId ~ newValue, oldValue:", this.liveShopList);
            this.commonShopfilter(this.liveShopList, newValue);
          }
          this.propShopList.forEach((shopItem, i) => {
            if (shopItem.shopId == newValue && i !== 0) {
              shopItem.checked = true;
              this.shopName = shopItem.name;
              this.dataOut.shopInfo = shopItem;
            } else if (i === 0 && shopItem.shopId == newValue) {
              shopItem.checked = true;
              this.shopName = "全部门店";
              this.dataOut.shopInfo = {};
            } else {
              if (shopItem.name == "全部门店" && newValue == "") {
                shopItem.checked = true;
                this.shopName = "全部门店";
                this.dataOut.shopInfo = {};
              } else {
                shopItem.checked = false;
              }
            }
          });
        }
      },
    },
    // 处理滚动问题
    show(newValue, oldValue) {
      eventBus.$emit("select-mask", newValue);
    },
    // 切换tab栏--智能排序以及筛选，条件清空
    isClearOther(newVal, oldVal) {
      this.show = false;
      if (newVal !== oldVal) {
        this.intelligentSortList.forEach((intelligentSort) => {
          intelligentSort.checked = false;
          this.IntelligentSort = "智能排序";
        });
        this.genderList.forEach((genderItem) => {
          genderItem.checked = false;
          this.filterSelected = false;
          this.sexName = "性别";
        });
        this.propPriceList.forEach((priceItem) => {
          priceItem.checked = false;
          this.filterSelected = false;
          this.priceName = "价格";
        });
        this.dataOut.filterInfo.sexInfo = {};
        this.dataOut.filterInfo.priceInfo = {};
        this.$set(this.dataOut, "sortInfo", {});
        // this.$set(this.dataOut.filterInfo, "sexInfo", {});
        // this.$set(this.dataOut.filterInfo, "priceInfo", {});
      }
    },
    changePetChangeFlag(newVal, oldVal) {
      // 排序
      this.intelligentSortList.forEach((intelligentSort) => {
        const sortInfo = this.parentDataOut?.sortInfo || {};
        if (
          !this.isEmptyObject(sortInfo) &&
          intelligentSort.id === sortInfo.id
        ) {
          intelligentSort.checked = true;
          this.$set(this, "IntelligentSort", intelligentSort.name);
        } else {
          intelligentSort.checked = false;
        }
      });
      this.genderList.forEach((genderItem) => {
        const sexInfo = this.parentDataOut?.filterInfo?.sexInfo || {};
        if (!this.isEmptyObject(sexInfo) && genderItem.id === sexInfo.id) {
          genderItem.checked = true;
          this.filterSelected = true;
          this.sexName = genderItem.name;
        } else {
          genderItem.checked = false;
        }
      });
      this.propPriceList.forEach((priceItem, i) => {
        const priceInfo = this.parentDataOut?.filterInfo?.priceInfo || {};
        if (!this.isEmptyObject(priceInfo) && priceItem.id === priceInfo.id) {
          priceItem.checked = true;
          this.filterSelected = true;
          this.priceName = this.priceTitle(priceItem, i);
        } else {
          priceItem.checked = false;
        }
      });

      if (this.parentDataOut?.filterInfo) {
        const priceInfo = this.parentDataOut?.filterInfo?.priceInfo;
        const sexInfo = this.parentDataOut?.filterInfo?.sexInfo;
        if (this.isEmptyObject(sexInfo) && this.isEmptyObject(priceInfo)) {
          this.filterSelected = false;
        }

        if (this.isEmptyObject(sexInfo)) {
          this.sexName = "性别";
        }
        if (this.isEmptyObject(priceInfo)) {
          this.priceName = "价格";
        }
      } else {
        this.priceName = "价格";
        this.sexName = "性别";
      }

      this.$set(this.dataOut, "sortInfo", this.parentDataOut?.sortInfo);
      this.$set(
        this.dataOut,
        "filterInfo",
        this.parentDataOut?.filterInfo || {}
      );
    },
    priceList(newVal, oldVal) {
      if (newVal !== oldVal) {
        const list = newVal?.map((item, index) => {
          return {
            ...item,
            checked: false,
            id: "" + (index + 1),
          };
        });
        list.unshift({
          name: "全部",
          checked: false,
          id: "0",
        });
        this.propPriceList = list;
      }
    },
    liveShopList(newVal, oldVal) {
      if (newVal !== oldVal) {
        const list = newVal?.map((item, index) => {
          return {
            ...item,
            checked: false,
          };
        });
        list.unshift({
          name: "全部门店",
          checked: false,
        });
        this.propShopList = list;
        this.commonShopfilter(this.propShopList, this.shopId);
      }
    },
  },
  methods: {
    commonShopfilter(list, newValue) {
      list.forEach((shopItem, i) => {
        if (shopItem.shopId == newValue) {
          shopItem.checked = true;
          this.shopName = shopItem.name || "全部门店";
          this.dataOut.shopInfo = shopItem || {};
        } else {
          if (shopItem.name == "全部门店" && newValue == "") {
            shopItem.checked = true;
            this.shopName = "全部门店";
            this.dataOut.shopInfo = {};
          } else {
            shopItem.checked = false;
          }
        }
      });
    }, // 清除推荐门店
    toClearRecommendShop(oldVal, newVal) {
      if (oldVal && oldVal.id !== newVal.id) {
        uni.$emit("clearRecommendShop", true);
      }
    },
    // 门店-点击
    shopClick(item, index) {
      if (this.shopId == "" && (item.shopId == "" || !item.shopId)) return;
      this.propShopList.forEach((shopItem, i) => {
        if (shopItem.shopId == item.shopId && index !== 0 && i !== 0) {
          shopItem.checked = true;
          this.shopName = shopItem.name;
          this.dataOut.shopInfo = shopItem;
        } else if (index === 0 && i === 0) {
          shopItem.checked = true;
          this.shopName = "全部门店";
          this.dataOut.shopInfo = {};
        } else {
          shopItem.checked = false;
        }
      });
      this.show = false;
      this.$emit("onChange", this.dataOut); // 传给父组件
    },
    // 智能排序-点击事件
    sortClick(item, index) {
      if (this.isEmptyObject(item)) return;
      this.toClearRecommendShop(this.sortClick_item, item);
      this.intelligentSortList.forEach((intelligentSort) => {
        if (intelligentSort.id == item.id) {
          intelligentSort.checked = true;
          this.IntelligentSort = intelligentSort.name;
          this.dataOut.sortInfo = intelligentSort;
        } else {
          intelligentSort.checked = false;
        }
      });
      this.show = false;
      this.sortClick_item = item; // 记录点击的item，用于清除推荐门店
      this.dataOut.filterInfo.sexInfo = {};
      this.dataOut.filterInfo.priceInfo = {};
      this.$emit("onChange", this.dataOut); // 传给父组件
    },
    // 性别-点击事件
    genderClick(item, index) {
      const that = this;
      this.sexName = index === 0 ? "性别" : item.name;
      if (this.isEmptyObject(item)) return;
      this.toClearRecommendShop(this.sexClick_item, item);
      that.dataOut.filterInfo.sexInfo = {};
      this.genderList.forEach((genderItem, i) => {
        if (genderItem.name == item.name) {
          genderItem.checked = true;
          if (i !== 0) {
            // that.dataOut.filterInfo = {
            //   sexInfo: genderItem,
            // };
            that.dataOut.filterInfo.sexInfo = genderItem;
          } else {
            // that.dataOut.filterInfo = {
            //   sexInfo: {},
            // };
            that.dataOut.filterInfo.sexInfo = {};
          }
        } else {
          genderItem.checked = false;
        }
      });
      this.sexClick_item = item; // 记录点击的item，用于清除推荐门店

      // this.show = false;
      // this.$emit("onChange", this.dataOut); // 传给父组件
    },

    // 价格-点击事件
    priceClick(item, index) {
      const that = this;
      this.priceName = this.priceTitle(item, index);
      if (this.isEmptyObject(item)) return;
      this.toClearRecommendShop(this.priceClick_item, item);
      that.dataOut.filterInfo.priceInfo = {};
      this.propPriceList.forEach((priceItem, i) => {
        if (index == i) {
          priceItem.checked = true;
          if (i !== 0) {
            // that.dataOut.filterInfo = {
            //   priceInfo: priceItem,
            // };
            that.dataOut.filterInfo.priceInfo = priceItem;
          } else {
            // that.dataOut.filterInfo = {
            //   priceInfo: {},
            // };
            that.dataOut.filterInfo.priceInfo = {};
          }
        } else {
          priceItem.checked = false;
        }
      });
      this.priceClick_item = item; // 记录点击的item，用于清除推荐门店

      // this.show = false;
      // this.$emit("onChange", this.dataOut); // 传给父组件
      console.log("🚀 ~ priceClick ~ item, index:", item, index, this.dataOut);
    },
    // 价格筛选title
    priceTitle(item, index) {
      if (index === 0) {
        return "价格";
      } else {
        if (item.priceRangeBegin && item.priceRangeEnd === "") {
          return item.priceRangeBegin + "以上";
        } else {
          return `${item.priceRangeBegin}-${item.priceRangeEnd}`;
        }
      }
    },
    // 筛选(性别/价格)重置事件
    filterReset() {
      this.genderList.map((e) => {
        if (e.checked) e.checked = false;
      });
      this.propPriceList.map((e) => {
        if (e.checked) e.checked = false;
      });
      this.dataOut.filterInfo.sexInfo = {};
      this.dataOut.filterInfo.priceInfo = {};
    },
    // 筛选(性别/价格)点击确定事件
    filterConfirm() {
      this.show = false;
      const { sexInfo, priceInfo } = this.dataOut.filterInfo;
      if (this.isEmptyObject(sexInfo) && this.isEmptyObject(priceInfo)) {
        this.filterSelected = false;
      } else {
        this.filterSelected = true;
      }
      console.log(this.dataOut,'dataOut');
      
      this.$emit("onChange", this.dataOut); // 传给父组件
    },
    overlayClick(e) {
      this.show = false;
    },
    isSelected(type) {
      return this.sortType === type && this.show;
    },
    handleSelect(type) {
      console.log("🚀 ~ handleSelect ~ type:", type);
      this.sortType = type;
      this.show = !this.show;
    },
    /**
     * 判断是否为空对象
     * @param obj 对象
     */
    isEmptyObject(obj) {
      if (obj == undefined || obj == null) return true;
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-wrapper {
  height: 85rpx;
  width: 100vw;
  background-color: #fff;
  padding: 0 29rpx 0 29rpx;
  // margin-top: 10rpx;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  .item {
    min-width: 58rpx;
    font-size: 27rpx;
    font-weight: 400;
    color: #666666;
    line-height: 38rpx;
    text-align: center;
    // margin-right: 60rpx;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
    margin-right: 50rpx;
    
    .item-text {
      height: 38rpx;
      line-height: 38rpx;
      margin: 0 8rpx;
    }
    .item-text1 {
      height: 38rpx;
      line-height: 38rpx;
      max-width: 190rpx;
      overflow: hidden;
      margin: 0 8rpx;
    }
    .icon-name {
      // color: #FE2442;
      transform: rotateX(180deg);
    }
    .icon-0 {
      // color: #FE2442;
      transform: rotateX(0);
    }
  }
  .item3{
      margin: 0;
      .item-text{
        margin-right: 4rpx;
      }
    }
  .active {
    color: #fe2442;
  }

  .tab-list {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    .tab-flex {
      display: flex;
      flex-direction: row;
    }
  }
}
.overlay {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
  .popupv {
    padding-left: 30rpx !important;
  }
  .popups {
    width: 100%;
    max-height: 712rpx;
    background-color: #fff;
    position: absolute;
    left: 0;
    padding: 12rpx 0rpx 6rpx 29rpx;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    z-index: 99;
    overflow-y: auto;
    top: -2rpx;
    box-sizing: border-box;
    .u-page__tag-item {
      width: 335rpx;
      height: 71rpx;
      background: #f7f8fc;
      border-radius: 10rpx;
      margin-bottom: 23rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #333333;
      line-height: 71rpx;
      text-align: center;
      overflow: hidden;
      margin-right: 23rpx;
      box-sizing: border-box;
    }
    .u-page__tags-item {
      width: 215rpx;
      height: 71rpx;
      background: #f7f8fc;
      border-radius: 10rpx;
      margin-bottom: 23rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #333333;
      line-height: 71rpx;
      text-align: center;
      overflow: hidden;
      margin-right: 23rpx;
    }
    .tag-hit {
      background: #ffefef;
      border-radius: 10rpx;
      border: 2rpx solid #fe2442;
      font-weight: 400;
      font-size: 25rpx;
      color: #fe2442;
    }
  }
  .popups-padding {
    padding: 12rpx 28rpx 6rpx 28rpx !important;
  }
}

.fo-size {
  font-size: 31rpx;
}
.icon-margin {
  margin-top: 3rpx;
}
.shop-name {
  width: 100%;
  padding: 0 20rpx;
  overflow: hidden;
}
.list {
  display: inline-flex;
  flex-wrap: wrap;
}
.filter-title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 25rpx;
  line-height: 35rpx;
  color: #333333;
  padding: 5rpx 0 17rpx;
}
.scroll-popups {
  width: 100%;
  max-height: 421rpx;
}
.filter-btn {
  width: 750rpx;
  height: 162rpx;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.08);
  padding-right: 27rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn {
    width: 332rpx;
    height: 85rpx;
    line-height: 85rpx;
    text-align: center;
    font-size: 31rpx;
    font-family: PingFangSC, PingFang SC;
  }
  .reset {
    border-radius: 42rpx;
    border: 2rpx solid #e6e6e6;
    color: #1f1f1f;
  }
  .confirm {
    background: #fe2442;
    border-radius: 40rpx;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
