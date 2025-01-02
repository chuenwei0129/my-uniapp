<template>
  <view
    class="da-dropdown"
    :class="{ 'is-fixed': fixedTop, 'has-search': hasSearch }"
    :style="dropdownStyle"
  >
    <!-- 搜索 -->
    <view
      class="da-dropdown-search"
      v-if="hasSearch"
      @touchmove.stop.prevent="handleMove"
    >
      <input
        class="da-dropdown-search-input"
        :value="searchItem.value"
        @input="handleSearchChange"
        :placeholder="searchItem.placeholder || '请输入'"
        @confirm="handleSearch"
        confirm-type="search"
      />
      <button class="da-dropdown-search-btn" @click="handleSearch">搜索</button>
    </view>
    <!-- 菜单 -->

    <view class="da-dropdown-menu" @touchmove.stop.prevent="handleMove">
      <view
        class="da-dropdown-menu-item"
        :class="{ 'is-hidden': item.isHidden === 'true' }"
        v-for="(item, index) in menuList"
        :key="index"
        @click="handleMenuClick(index, item)"
      >
        <text
          class="da-dropdown-menu-item--text"
          :class="item.isActived ? 'is-actived' : ''"
          >{{
            menuActiveText ? item.activeTitle || item.title : item.title
          }}</text
        >
        <view
          class="da-dropdown-menu-item--arrow"
          :class="[
            item.isClick ? 'is-actived' : '',
            item.isActived ? 'is-selected' : '',
          ]"
          v-if="item.type !== 'click' && item.type !== 'sort'"
        >
        </view>
        <view
          class="da-dropdown-menu-item--sort"
          v-if="item.type === 'sort'"
          :class="'is--' + item.value"
        ></view>
      </view>
    </view>
    <!-- 弹出 -->
    <view
      class="da-dropdown-content"
      :class="{ 'is-show': isShow, 'is-visible': isVisible }"
    >
      <view class="da-dropdown-content-popup" :class="isShow ? 'is-show' : ''">
        <slot name="slotTitle"></slot>
        <view
          class="da-dropdown-popup-box"
          v-for="(item, index) in menuList"
          :key="index"
        >
          <!-- 下拉列表 -->
          <DropdownCell
            v-if="item.type === 'cell' && index === currentIndex"
            :dropdownItem="item"
            :dropdownIndex="index"
            @success="handleCellSelect"
          ></DropdownCell>
          <!-- 多条件筛选 -->
          <DropdownFilter
            v-if="item.type === 'filter' && index === currentIndex"
            :dropdownItem="item"
            :dropdownIndex="index"
            @success="handleFilterConfirm"
            @reset="handleReset"
          ></DropdownFilter>
          <!-- 级联选择 -->
          <DropdownPicker
            v-if="item.type === 'picker' && index === currentIndex"
            :dropdownItem="item"
            :dropdownIndex="index"
            @success="handlePickerConfirm"
          />
          <!-- 日期范围 -->
          <DropdownDaterange
            v-if="item.type === 'daterange' && index === currentIndex"
            :dropdownItem="item"
            :dropdownIndex="index"
            @success="handleDaterangeConfirm"
          />
          <!-- 弹窗插槽拓展X5 -->
          <view v-if="item.type === 'slot1' && index === currentIndex">
            <slot name="slot1" :item="item" :index="index"></slot>
          </view>
          <view v-if="item.type === 'slot2' && index === currentIndex">
            <slot name="slot2" :item="item" :index="index"></slot>
          </view>
          <view v-if="item.type === 'slot3' && index === currentIndex">
            <slot name="slot3" :item="item" :index="index"></slot>
          </view>
          <view v-if="item.type === 'slot4' && index === currentIndex">
            <slot name="slot4" :item="item" :index="index"></slot>
          </view>
          <view v-if="item.type === 'slot5' && index === currentIndex">
            <slot name="slot5" :item="item" :index="index"></slot>
          </view>
        </view>
      </view>
      <view
        class="da-dropdown-content-mask"
        v-if="fixedTop"
        @tap="handlePopupMask"
        @touchmove.stop.prevent="handleMove"
      />
    </view>
    <view class="da-dropdown--blank" v-if="fixedTop"></view>
  </view>
</template>

<script>
import { deepClone } from "./utils";
import DropdownPicker from "./components/picker.vue";
import DropdownCell from "./components/cell.vue";
import DropdownFilter from "./components/filter.vue";
import DropdownDaterange from "./components/daterange.vue";

export default {
  components: {
    DropdownPicker,
    DropdownCell,
    DropdownFilter,
    DropdownDaterange,
  },
  props: {
    /**
     * 导航菜单数据
     */
    dropdownMenu: {
      type: Array,
      default: () => [],
    },
    /**
     * 菜单激活时，是否改变为激活项文字
     */
    menuActiveText: {
      type: Boolean,
      default: true,
    },
    /**
     * 激活颜色
     */
    themeColor: {
      type: String,
      default: "#007aff",
    },
    /**
     * 常规颜色
     */
    textColor: {
      type: String,
      default: "#333333",
    },
    /**
     * 背景颜色，当固定在顶部时，此为必填
     */
    bgColor: {
      type: String,
      default: "#ffffff",
    },
    /**
     * 是否固定在顶部
     */
    fixedTop: {
      type: Boolean,
      default: false,
    },
    /**
     * 固定在头部时的位置，单位px
     * 如果页面定义了 "navigationStyle": "custom" ，因此固定头部时需要额外获取状态栏高度，以免被异形屏头部覆盖
     */
    fixedTopValue: {
      type: Number,
      default: 0,
    },
    /**
     * 弹窗过渡时间
     */
    duration: {
      type: [Number, String],
      default: 300,
    },
  },
  data() {
    return {
      currentIndex: -1,
      isVisible: false,
      isShow: false,
      menuList: [],
      hasSearch: false,
      searchItem: null,
    };
  },
  computed: {
    /**
     * 主题样式
     */
    dropdownStyle() {
      return `
        --dropdown-theme-color: ${this.themeColor};
        --dropdown-text-color: ${this.textColor};
        --dropdown-background-color: ${this.bgColor};
        --dropdown-popup-duration: ${this.duration / 1000}}s;
        --dropdown-fixed-top: ${this.fixedTopValue || 0}}px;
      `;
    },
  },
  watch: {
    dropdownMenu: {
      deep: true,
      immediate: true,
      handler: function (v) {
        this.initData(v);
      },
    },
  },
  mounted() {
    this.initDomInfo();
  },
  methods: {
    /**
     * 初始化数据
     */
    async initData(dropdownMenuData) {
      const newMenu = deepClone(dropdownMenuData || []);
      const hasShowAllType = ["cell", "picker"];
      const allItem = { label: "不限", value: "-9999" };
      if (newMenu?.length) {
        for (let i = 0; i < newMenu.length; i++) {
          const item = newMenu[i];

          // 处理初始项
          if (hasShowAllType.includes(item.type)) {
            if (item.syncDataFn && typeof item.syncDataFn === "function") {
              const syncOptions = await item.syncDataFn();
              item.options = syncOptions || [];
            }
          }

          if (item.options?.length) {
            if (item.field) {
              item.options = this.alignData(item.options, item.field);
            }
            if (item.showAll) {
              if (
                item.options.findIndex((k) => k.value === allItem.value) === -1
              ) {
                item.options.unshift(allItem);
              }
            }
          }

          // 处理已选项
          if (item.value || item.value === 0 || item.value === false) {
            if (item.type === "cell") {
              for (let x = 0; x < item.options.length; x++) {
                const k = item.options[x];
                if (k.value === item.value) {
                  item.isActived = true;
                  item.activeTitle = k.label;
                  break;
                }
              }
            }
            if (item.type === "click") {
              item.isActived = item.value === true;
            }
            if (item.type === "sort") {
              item.isActived = item.value === "asc" || item.value === "desc";
            }
            if (item.type === "filter") {
              item.isActived = JSON.stringify(item.value || {}) !== "{}";
            }
            if (item.type === "picker") {
              item.isActived = item.value?.length;
            }
            if (item.type === "daterange") {
              item.isActived = item.value?.start && item.value?.end;
            }
            if (item.type === "slot") {
              item.isActived = !!item.value;
            }
          } else {
            item.isActived = false;
            if (item.type === "cell") {
              item.activeTitle = null;
            }
          }

          // 搜索项特殊处理
          if (item.type === "search") {
            item.isHidden = "true";
            this.searchItem = item;
            this.hasSearch = true;
          }
        }
      }
      console.log("item===>", newMenu);
      this.menuList = newMenu;
    },
    /**
     * 处理部分初始数据
     * @param data
     */
    alignData(data, alignField) {
      for (let i = 0; i < data.length; i++) {
        const k = data[i];
        k.label = k[alignField?.label || "label"] || null;
        k.value = k[alignField?.value || "value"] || null;
        k.children = k[alignField?.children || "children"] || null;
        if (k.children?.length) {
          this.alignData(k.children, alignField);
        }
      }
      return data;
    },
    /**
     * 初始化获取系统信息
     */
    initDomInfo() {},
    /**
     * 打开弹窗
     * @param index 当前激活索引
     */
    handlePopupShow(index) {
      this.isShow = true;
      this.isVisible = true;
      this.currentIndex = index;
      this.$emit("open", this.currentIndex);
    },
    /**
     * 关闭弹窗
     */
    handlePopupHide() {
      this.isShow = false;
      // 延迟移除下拉弹窗
      setTimeout(() => {
        this.isVisible = false;
        this.clearIndex();
      }, this.duration);

      this.$forceUpdate();
      this.$emit("close", this.currentIndex);
    },
    /**
     * 点击蒙层
     */
    handlePopupMask() {
      if (this.menuList?.length) {
        this.menuList.forEach((k) => {
          k.isClick = false;
        });
      }
      this.handlePopupHide();
    },
    /**
     * 清理滚动
     */
    handleMove() {
      return false;
    },
    /**
     * 关闭弹窗
     */
    clearIndex() {
      this.currentIndex = -1;
    },
    /**
     * 点击菜单项
     */
    handleMenuClick(index, item) {
      const dropdownMenu = this.menuList;
      const menuItem = dropdownMenu[index];

      dropdownMenu.forEach((k) => {
        k.isClick = false;
      });

      if (menuItem.type === "click") {
        return this.handleItemClick(menuItem, index);
      }

      if (menuItem.type === "sort") {
        return this.handleItemSort(menuItem, index);
      }
      if (index === this.currentIndex) {
        item.isClick = false;
        this.handlePopupHide();
        return;
      }

      item.isClick = true;

      this.handlePopupShow(index);
    },
    /**
     * 搜索输入
     */
    handleSearchChange(e) {
      this.searchItem.value = e?.detail?.value;
    },
    /**
     * 确定搜索
     */
    handleSearch() {
      if (this.searchItem?.prop) {
        const res = { [this.searchItem.prop]: this.searchItem.value };
        this.$emit("update:dropdownMenu", this.menuList);
        this.$emit("confirm", res);
      } else {
        console.error(`菜单项${this.searchItem.title}未定义prop，返回内容失败`);
      }
    },
    /**
     * 菜单项-下拉列表回调
     * @param callbackData 操作返回的数据
     * @param cellItem 下拉列表项数据
     * @param index 菜单索引
     */
    handleCellSelect(callbackData, cellItem, index) {
      const dropdownMenu = this.menuList;
      const item = dropdownMenu[index];
      item.isClick = false;

      if (cellItem.value === "-9999") {
        item.isActived = false;
        item.activeTitle = undefined;
        item.value = null;
      } else {
        item.isActived = true;
        item.activeTitle = cellItem.label;
        item.value = cellItem.value;
      }

      this.handlePopupHide();
      this.$emit("update:dropdownMenu", dropdownMenu);
      this.$emit("confirm", callbackData);
    },
    /**
     * 菜单项-点击
     * @param item 菜单项
     * @param index 菜单项索引
     */
    handleItemClick(item, index) {
      this.handlePopupHide();

      if (this.currentIndex === -1) {
        this.currentIndex = index;
        item.value = true;
        item.isActived = true;
      } else {
        item.value = false;
        item.isActived = false;
        this.clearIndex();
      }
      if (item?.prop) {
        const res = { [item.prop]: item.value };
        this.$emit("update:dropdownMenu", this.menuList);
        this.$emit("confirm", res);
      } else {
        console.error(`菜单项${item.title}未定义prop，返回内容失败`);
      }
    },
    /**
     * 菜单项-排序
     * @param item 菜单项
     * @param index 菜单项索引
     */
    handleItemSort(item, index) {
      this.handlePopupHide();

      if (item.value === "asc") {
        item.value = "desc";
        this.currentIndex = index;
        item.isActived = true;
      } else if (item.value === "desc") {
        item.value = undefined;
        item.isActived = false;
        this.clearIndex();
      } else {
        item.value = "asc";
        this.currentIndex = index;
        item.isActived = true;
      }

      if (item?.prop) {
        const res = { [item.prop]: item.value };
        this.$emit("update:dropdownMenu", this.menuList);
        this.$emit("confirm", res);
      } else {
        console.error(`菜单项${item.title}未定义prop，返回内容失败`);
      }
    },
    /**
     * 菜单项-筛选回调
     * @param callbackData 操作返回的数据
     * @param filterData 筛选数据
     * @param index 菜单索引
     */
    handleFilterConfirm(callbackData, filterData, index) {
      const dropdownMenu = this.menuList;
      const item = dropdownMenu[index];
      item.isClick = false;

      item.isActived = JSON.stringify(filterData || {}) !== "{}";
      item.activeTitle = undefined;
      item.value = filterData;

      this.handlePopupHide();
      this.$emit("update:dropdownMenu", dropdownMenu);
      this.$emit("confirm", callbackData);
    },
    //重置
    handleReset() {
      this.$emit("reset");
    },
    /**
     * 菜单项-级联回调
     * @param callbackData 操作返回的数据
     * @param pickerItem 级联已选数据
     * @param index 菜单索引
     */
    handlePickerConfirm(callbackData, pickerItem, index) {
      const dropdownMenu = this.menuList;
      const item = dropdownMenu[index];
      item.isClick = false;

      if (!pickerItem || pickerItem[0] === "-9999") {
        item.isActived = false;
        item.activeTitle = undefined;
        item.value = null;
      } else {
        item.isActived = true;
        item.value = pickerItem;
      }

      this.handlePopupHide();
      this.$emit("update:dropdownMenu", dropdownMenu);
      this.$emit("confirm", callbackData);
    },
    /**
     * 菜单项-日期范围回调
     * @param callbackData 操作返回的数据
     * @param daterangeItem 日期范围数据
     * @param index 菜单索引
     */
    handleDaterangeConfirm(callbackData, daterangeItem, index) {
      const dropdownMenu = this.menuList;
      const item = dropdownMenu[index];
      item.isClick = false;

      if (daterangeItem?.start && daterangeItem?.end) {
        item.isActived = true;
        item.value = daterangeItem;
      } else {
        item.isActived = false;
        item.activeTitle = undefined;
        item.value = null;
      }

      this.handlePopupHide();
      this.$emit("update:dropdownMenu", dropdownMenu);
      this.$emit("confirm", callbackData);
    },
  },
};
</script>

<style lang="scss" scoped>
.da-dropdown {
  --dropdown-menu-height: 100rpx;
  --dropdown-popup-duration: 0.3s;

  position: relative;
  z-index: 888;
  width: 100%;
  line-height: 1;

  &--blank {
    width: 100%;
    height: var(--dropdown-menu-height);
  }

  &-search {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: var(--dropdown-menu-height);
    padding: 10rpx 20rpx 6rpx;
    background: var(--dropdown-background-color, #fff);

    &-input {
      flex-grow: 1;
      height: 60rpx;
      padding: 0 20rpx;
      overflow: hidden;
      font-size: 28rpx;
      color: var(--dropdown-text-color);
      background: #f6f6f6;
      border-radius: 8rpx 0 0 8rpx;
    }

    &-btn {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      height: 60rpx;
      padding: 0 20rpx;
      overflow: hidden;
      font-size: 28rpx;
      color: var(--dropdown-text-color);
      background: #f6f6f6;
      border: none;
      border-radius: 0 8rpx 8rpx 0;

      &::after {
        display: none;
      }
    }
  }

  &-menu {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    height: var(--dropdown-menu-height);
    background: var(--dropdown-background-color, #fff);
    // box-shadow: 0 1rpx 0 0 #bbb;

    &-item {
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      height: 100%;

      &:hover {
        background: #ffffff;
      }

      &.is-hidden {
        display: none;
      }

      &--text {
        font-size: 27rpx;
        color: var(--dropdown-text-color);

        &.is-actived {
          color: var(--dropdown-theme-color);
        }
      }

      &--arrow {
        width: 12rpx;
        height: 12rpx;
        background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/arrow.png")
          no-repeat top left / 100% 100%;
        margin-left: 8rpx;
        &.is-actived {
          opacity: 1;
          transform: rotate(180deg);
        }
        &.is-selected {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/selectedarrow.png")
            no-repeat top left / 100% 100%;
          opacity: 1;
        }
      }

      &--sort {
        position: relative;
        margin-left: 6rpx;
        transition: transform 0.3s;

        &::before,
        &::after {
          position: absolute;
          top: calc(50% - 16rpx);
          left: 0;
          content: "";
          border-color: transparent;
          border-style: solid;
          border-width: 8rpx;
          border-bottom-color: #bbb;
        }

        &::after {
          top: calc(50% + 6rpx);
          border-top-color: #bbb;
          border-bottom-color: transparent;
        }

        &.is--asc::before {
          border-bottom-color: var(--dropdown-theme-color);
        }

        &.is--desc::after {
          border-top-color: var(--dropdown-theme-color);
        }
      }
    }
  }

  &-content {
    position: absolute;
    top: var(--dropdown-menu-height);
    left: 0;
    z-index: -1;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    visibility: hidden;
    // box-shadow: 0 -1rpx 0 0 #bbb;
    opacity: 0;
    transition: all var(--dropdown-popup-duration, 0.3s) linear;

    &.is-show {
      z-index: 901;
      opacity: 1;
    }

    &.is-visible {
      visibility: visible;
      // animation: CustomBS var(--dropdown-popup-duration) linear var(--dropdown-popup-duration) forwards;
    }

    &-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 9;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
    }

    &-popup {
      position: relative;
      z-index: 10;
      max-height: 100%;
      overflow: auto;
      transition: transform var(--dropdown-popup-duration) linear;
      transform: translateY(-100%);

      &.is-show {
        transform: translateY(0);
      }
    }
  }

  &-popup-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 28rpx;
    line-height: 1;
    background: var(--dropdown-background-color, #fff);
    transition: border-radius var(--dropdown-popup-duration) linear;
  }

  /* 固定至顶 */
  &.is-fixed {
    z-index: 980;

    .da-dropdown {
      &-search {
        position: fixed;
        top: calc(var(--window-top, 0px) + var(--dropdown-fixed-top, 0px));
        right: 0;
        left: 0;
        max-width: 1190px;
        margin: auto;
      }

      &-menu {
        position: fixed;
        top: calc(var(--window-top, 0px) + var(--dropdown-fixed-top, 0px));
        right: 0;
        left: 0;
        max-width: 1190px;
        margin: auto;
      }

      &-content {
        position: fixed;
        top: calc(
          var(--window-top, 0px) + var(--dropdown-fixed-top, 0px) +
            var(--dropdown-menu-height, 0px)
        );
        right: 0;
        bottom: 0;
        left: 0;
        height: 100%;
        box-shadow: none;
      }
    }

    &.has-search {
      .da-dropdown {
        &-menu {
          top: calc(
            var(--window-top, 0px) + var(--dropdown-fixed-top, 0px) +
              var(--dropdown-menu-height, 0px)
          );
        }

        &-content {
          top: calc(
            var(--window-top, 0px) + var(--dropdown-fixed-top, 0px) +
              var(--dropdown-menu-height, 0px) +
              var(--dropdown-menu-height, 0px)
          );
        }

        &--blank {
          height: calc(
            var(--dropdown-fixed-top, 0px) + var(--dropdown-menu-height, 0px) +
              var(--dropdown-menu-height, 0px)
          );
        }
      }
    }
  }
}

@keyframes CustomBS {
  0% {
    box-shadow: 0 -1rpx 0 0 #bbb;
  }

  100% {
    box-shadow: 0 -1rpx 0 0 #bbb, 0 20rpx 20rpx -10rpx rgba(0, 0, 0, 0.1);
  }
}
</style>
