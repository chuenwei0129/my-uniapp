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
            <i class="iconfont icon-shop fo-size icon-margin"></i>
            <view class="item-text1">{{
              shopName && shopName.slice(0, 7)
            }}</view>
            <view :class="isSelected(1) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="shopName !== '全部门店' ? '#FE2442' : '#666666'"
                size="9"
              ></u-icon>
            </view>
          </view>
          <view
            :class="['item', sexName !== '性别' ? 'active' : '']"
            @click="handleSelect(2)"
          >
            <i class="iconfont icon-gender fo-size icon-margin"></i>
            <view class="item-text">{{ sexName }}</view>
            <view :class="isSelected(2) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="sexName !== '性别' ? '#FE2442' : '#666666'"
                size="9"
              ></u-icon>
            </view>
          </view>
          <view
            :class="['item', priceName !== '价格' ? 'active' : '']"
            @click="handleSelect(3)"
          >
            <i class="iconfont icon-refund fo-size icon-margin"></i>
            <view class="item-text">{{ priceName }}</view>
            <view :class="isSelected(3) ? 'icon-name' : ''">
              <u-icon
                name="arrow-down-fill"
                :color="priceName !== '价格' ? '#FE2442' : '#666666'"
                size="9"
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
        <!-- <view
          :class="['item', filterSelected ? 'active' : '']"
          @click="handleSelect(3)"
        >
          <view class="item-text">筛选</view>
          <i class="iconfont icon-filtrate fo-size icon-margin"></i>
        </view> -->
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

      <view class="popups" v-else-if="sortType === 2" @click.stop>
        <view
          class="u-page__tags-item"
          v-for="(item, index) in genderList"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="genderClick(item, index)"
        >
          <view>{{ item.name }}</view>
        </view>
      </view>
      <view class="popups" v-else-if="sortType === 3" @click.stop>
        <view
          class="u-page__tags-item"
          v-for="(item, index) in propPriceList"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="priceClick(item, index)"
        >
          <view v-if="index === 0">{{ "全部" }}</view>
          <view v-else-if="item.priceRangeBegin && item.priceRangeEnd === ''"
            >{{ item.priceRangeBegin }}以上</view
          >
          <view v-else
            >{{ item.priceRangeBegin }}-{{ item.priceRangeEnd }}</view
          >
        </view>
      </view>
      <!-- 智能排序  -->
      <!-- <view class="popups" v-else-if="sortType === 2" @click.stop>
        <view
          class="u-page__tags-item"
          v-for="(item, index) in IntelligentSortList"
          :class="item.checked ? 'tag-hit' : ''"
          :key="index"
          @click.stop="sortClick(item, index)"
        >
          <view>{{ item.name }}</view>
        </view>
      </view> -->
      <!-- 筛选  -->
      <!-- <view class="popups" v-else-if="sortType === 3" @click.stop>
        <scroll-view scroll-y="true" class="scroll-popups">
          <view class="filter-item-box">
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
                v-for="(item, index) in priceListFilter"
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
      </view> -->
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
  },

  emits: ["onChange"],
  data() {
    return {
      sortType: 1,
      show: false,
      IntelligentSort: "智能排序",
      shopName: "全部门店",
      sexName: "性别",
      priceName: "价格",
      filterSelected: false, // 筛选
      IntelligentSortList: [
        {
          name: "智能排序",
          checked: true,
          id: 1,
        },
        {
          name: "最新发布",
          checked: false,
          id: 2,
        },
        {
          name: "低龄优先",
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
    };
  },
  created() {},
  computed: {
    // priceListFilter() {
    //   const list = this.priceList?.map((item, index) => {
    //     return {
    //       ...item,
    //       checked: false,
    //       id: "" + index + 1,
    //     };
    //   });
    //   list.unshift({
    //     name: "全部",
    //     checked: false,
    //     id: "0",
    //   });
    //   return list;
    // },
    // shopList() {
    //   const list = this.liveShopList?.map((item, index) => {
    //     return {
    //       ...item,
    //       checked: false,
    //     };
    //   });
    //   list.unshift({
    //     name: "全部门店",
    //     checked: false,
    //   });
    //   return list;
    // },
  },
  watch: {
    shopId: {
      immediate: true,
      handler(newValue, oldValue) {
        console.log("🚀 ~ handler ~ newValue, oldValue:", newValue, oldValue);
        if (newValue !== oldValue) {
          this.propShopList.forEach((e, i) => {
            if (e.shopId == newValue && i !== 0) {
              e.checked = true;
              this.shopName = e.name;
              this.dataOut.shopInfo = e;
            } else if (i === 0 && e.shopId == newValue) {
              e.checked = true;
              this.shopName = "全部门店";
              this.dataOut.shopInfo = {};
            } else {
              if (e.name == "全部门店" && newValue == "") {
                e.checked = true;
                this.shopName = "全部门店";
                this.dataOut.shopInfo = {};
              } else {
                e.checked = false;
              }
            }
          });
          // this.displayMethodId(newValue);
        }
      },
    },
    show(newValue, oldValue) {
      if (newValue) {
        eventBus.$emit("select-mask", true);
      } else {
        eventBus.$emit("select-mask", false);
      }
    },
    // 切换tab栏--智能排序以及筛选，条件清空
    isClearOther(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.IntelligentSortList.forEach((e) => {
          e.checked = false;
          this.IntelligentSort = "智能排序";
        });
        this.genderList.forEach((e) => {
          e.checked = false;
          this.filterSelected = false;
        });
        this.priceListFilter.forEach((e) => {
          e.checked = false;
          this.filterSelected = false;
        });
        this.$set(this.dataOut, "sortInfo", {});
        this.$set(this.dataOut.filterInfo, "sexInfo", {});
        this.$set(this.dataOut.filterInfo, "priceInfo", {});
      }
    },
    changePetChangeFlag(newVal, oldVal) {
      // 排序
      this.IntelligentSortList.forEach((e) => {
        if (e.id === this.parentDataOut?.sortInfo?.id) {
          e.checked = true;
          this.$set(this, "IntelligentSort", e.name);
        } else {
          e.checked = false;
        }
      });
      this.genderList.forEach((genderItem) => {
        if (genderItem.id === this.parentDataOut?.filterInfo?.sexInfo?.id) {
          genderItem.checked = true;
          this.filterSelected = true;
          this.sexName = genderItem.name;
        } else {
          genderItem.checked = false;
        }
      });
      // this.priceListFilter.forEach((priceItem, i) => {
      //   if (priceItem.id === this.parentDataOut?.filterInfo?.priceInfo?.id) {
      //     priceItem.checked = true;
      //     this.filterSelected = true;
      //     this.priceName = this.priceTitle(priceItem, i);
      //   } else {
      //     priceItem.checked = false;
      //   }
      // });
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
      const { priceInfo, sexInfo } = this.parentDataOut.filterInfo;
      if (this.isEmptyObject(sexInfo) && this.isEmptyObject(priceInfo)) {
        this.filterSelected = false;
      }

      this.$set(this.dataOut, "sortInfo", this.parentDataOut.sortInfo);
      this.$set(this.dataOut, "filterInfo", this.parentDataOut.filterInfo);
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
      }
    },
  },
  methods: {
    // 门店-点击
    shopClick(item, index) {
      if (this.dataOut.shopInfo.shopId == item.shopId) return;
      this.propShopList.forEach((e, i) => {
        if (e.shopId == item.shopId && index !== 0 && i !== 0) {
          e.checked = true;
          this.shopName = e.name;
          this.dataOut.shopInfo = e;
        } else if (index === 0 && i === 0) {
          e.checked = true;
          this.shopName = "全部门店";
          this.dataOut.shopInfo = {};
        } else {
          e.checked = false;
        }
      });
      this.show = false;
      this.$emit("onChange", this.dataOut); // 传给父组件
    },
    // 智能排序-点击事件
    sortClick(item, index) {
      this.IntelligentSortList.forEach((e) => {
        if (e.id == item.id) {
          e.checked = true;
          this.IntelligentSort = e.name;
          this.dataOut.sortInfo = e;
        } else {
          e.checked = false;
        }
      });
      this.show = false;
      this.$emit("onChange", this.dataOut); // 传给父组件
    },
    // 性别-点击事件
    genderClick(item, index) {
      this.sexName = index === 0 ? "性别" : item.name;
      this.dataOut.filterInfo.sexInfo = {};
      this.genderList.forEach((e, i) => {
        if (e.name == item.name) {
          e.checked = true;
          this.dataOut.filterInfo.sexInfo = i === 0 ? {} : e;
        } else {
          e.checked = false;
        }
      });

      this.show = false;
      this.$emit("onChange", this.dataOut); // 传给父组件
    },

    // 价格-点击事件
    priceClick(item, index) {
      this.priceName = this.priceTitle(item, index);

      this.dataOut.filterInfo.priceInfo = {};
      this.propPriceList.forEach((e, i) => {
        if (index == i) {
          e.checked = true;
          this.dataOut.filterInfo.priceInfo = i === 0 ? {} : e;
        } else {
          e.checked = false;
        }
      });

      this.show = false;
      this.$emit("onChange", this.dataOut); // 传给父组件
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
      this.$emit("onChange", this.dataOut); // 传给父组件
    },
    overlayClick(e) {
      this.show = false;
    },
    isSelected(type) {
      return this.sortType === type && this.show;
    },
    handleSelect(type) {
      this.sortType = type;
      this.show = !this.show;
    },
    /**
     * 判断是否为空对象
     * @param obj 对象
     */
    isEmptyObject(obj) {
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
    &:nth-child(1),
    &:nth-child(2) {
      margin-right: 58rpx;
    }
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
    top: -1rpx;
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
  margin: 5rpx 0 17rpx;
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
