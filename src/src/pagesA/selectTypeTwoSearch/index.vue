<template>
  <view>
    <!-- #ifdef H5 -->
    <NavBar
      title="添加宠物"
      navColor="#ffffff"
      :whiteBack="false"
      showBackBtn
      @navBackClickHandle="handleGoBack"
      :customback="true"
      style="position: sticky; top: 0; left: 0; z-index: 99"
    >
    </NavBar>
    <!-- #endif -->
    <view class="card">
      <view class="search">
        <u-input
          class="inp"
          type="text"
          placeholder="搜索宠物品种"
          clearable
          v-model="search"
          shape="circle"
          placeholderStyle="fontSize: 25rpx;color: #aaa;fontWeight: 400;"
          @confirm="handleSearchChange"
        >
          <template slot="prefix">
            <view class="searchicon"></view>
          </template>
        </u-input>

        <view class="cancel" @click="handleGoBack">取消</view>
      </view>
      <view class="searchList" :style="{ height: `calc(100vh - ${navHeight}px)` }" v-if="seacrchList.length > 0">
        <view
          class="search-item"
          v-for="item in seacrchList"
          :key="item.id"
          @click="
            () => {
              handleSelectItem(item);
            }
          "
        >
          {{ item.name }}
        </view>
      </view>
      <view class="nosearch" v-else>
        <view class="searchimg"></view>
        <view class="searchtext">被你难倒了，换个词试试吧～</view>
      </view>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import NavBar from "@/components/navBar/index.vue";

export default {
  components: {
    NavBar,
  },
  //...wxShareMethod(),
  onLoad(option) {
    this.enterType = option.enterType || "";
    // #ifdef H5
    let h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight);
      // 搜索栏在盒子高度之外  需要加上搜索栏高度this.rpx2px(85)
    this.navHeight = h5NavHeight + Math.ceil(this.rpx2px(85));
    console.log(this.navHeight, h5NavHeight,this.rpx2px(85), "高");
    // #endif
    // #ifdef MP-WEIXIN
    this.navHeight = Math.ceil(this.rpx2px(100));
    // #endif
  },
  onReady() {},
  onShow() {},
  data() {
    return {
      search: "",
      allList: uni.getStorageSync("searchList"),
      seacrchList: [],
      enterType: "",
      navHeight: 0,
    };
  },

  mounted() {
  },
  methods: {
    handleSelectItem(item) {
      // uni.redirectTo({
      //   url: `/pagesA/petInfo/index?categoryId=${item.id}&categoryName=${item.name}`,
      // });

      if (this.enterType == "AI") {
        uni.navigateBack({
          delta: 2,
          success: () => {
            uni.$emit("selectPetTypeAI", {
              categoryId: item.id,
              categoryName: item.name,
            });
          },
        });
      } else {
        uni.navigateBack({
          delta: 2, //TODO 减少一个页面
          success: () => {
            uni.$emit("selectPetType", {
              categoryId: item.id,
              categoryName: item.name,
            });
          },
        });
      }
    },
    handleSearchChange(e) {
      const searchVal = this.allList.filter((a) => {
        return a.name.includes(e);
      });
      this.seacrchList = searchVal;
    },
    handleGoBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    rpx2px(rpx) {
      const systemInfo = uni.getSystemInfoSync();
      const screenWidth = systemInfo.screenWidth;
      const pxRatio = screenWidth / 750; // 750 是设计稿的宽度，可以根据实际情况修改
      return rpx * pxRatio;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>