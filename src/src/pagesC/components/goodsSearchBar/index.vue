<script>
export default {
  name: "goodsSearchBar",
  data() {
    return {
      statusBarHeight: "",
      navHeight: "",
      navBarHeight: "",
      menuButtonWidth: "",
      keyword: "",
    };
  },
  props: {
    navColor: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: String,
      default: "",
    },
  },
  computed: {
    navColorStyle() {
      let style = {};
      if (this.$props.navColor.length) {
        style.backgroundColor = this.$props.navColor;
      }
      return style;
    },
    fixedStyle() {
      let style = {};
      if (this.$props.isFixed) {
        style.backgroundColor = this.$props.navColor;
        style.position = "fixed";
        style.left = 0;
        style.right = 0;
        style.top = 0;
      }
      return style;
    },
  },
  emits: [
    "onSearch",
    "onClick",
    "onClear",
    "onBlur",
    "onFocus",
    "onChange",
    "onBackClick",
  ],
  methods: {
    onSearchClickHandle() {
      this.$emit("onSearch", this.keyword);
    },
    onClickHandle() {
      this.$emit("onClick");
    },
    onClearClickHandle() {
      this.$emit("onClear");
    },
    onBlurClickHandle() {
      this.$emit("onBlur");
    },
    onFocusClickHandle() {
      this.$emit("onFocus");
    },
    onValueChangeHandle(value) {
      this.$emit("onChange", value);
    },
    onBackClickHandle() {
      uni.navigateBack({
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
    },
  },
  created() {
     //#ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + 8 + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    //#endif
    //#ifdef H5
    let h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight);
    this.navHeight = h5NavHeight + "px";
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    //#endif
    this.menuButtonWidth = getApp().globalData.menuButtonWidth + "px";
  },
  watch: {
    "$props.defaultValue"(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.keyword = newValue;
    },
  },
};
</script>

<template>
  <view
    class="page-wrapper"
    :style="[{ height: navHeight }, navColorStyle, fixedStyle]"
  >
    <view :style="{ height: statusBarHeight }"></view>
    <view
      class="navbar-wrapper"
      :style="{
        height: navBarHeight,
        marginRight: menuButtonWidth,
      }"
    >
      <image
        :style="{
          width: '22px',
          height: '22px',
          marginLeft: '11px',
          marginRight: '11px',
        }"
        mode="aspectFit"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/back-black-tag.png"
        @click="onBackClickHandle"
      />
      <view class="search-bar">
        <u-search
          placeholder="请输入商品"
          v-model="keyword"
          :showAction="false"
          borderColor="#1f1f1f"
          height="60rpx"
          bgColor="#fff"
          placeholderColor="#999"
          focus
          :searchIconSize="15"
          :disabled="disabled"
          searchIcon="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/search_icon.png"
          :inputStyle="{ caretColor: '#FE2442' }"
          @search="onSearchClickHandle"
          @click="onClickHandle"
          @change="onValueChangeHandle"
          @focus="onFocusClickHandle"
          @blur="onBlurClickHandle"
          @clear="onClearClickHandle"
        ></u-search>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-wrapper {
  .navbar-wrapper {
    display: flex;
    align-items: center;
  }
  .search-bar {
    flex: 1;
  }
}
</style>
