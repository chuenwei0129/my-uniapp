<template>
  <view class="page">
    <!-- 头部搜索 -->
    <view
      class="header"
      :style="{
        paddingTop: statusBarHeight,
      }"
    >
      <!-- 顶部搜索 -->
      <view class="top-navbar">
        <view class="left-icon" @click="handleNavBack"></view>
        <view class="search">
          <u-search
            v-model.trim="searchValue"
            :showAction="false"
            placeholder="搜索门店/商品名"
            searchIcon="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/consultationBg-scroll.png"
            @search="handleSearchGoods"
          ></u-search>
        </view>
        <view class="search-btn" @click="handleSearchGoods">搜索</view>
      </view>
    </view>

    <!-- 内容 -->
    <view
      class="main"
      :style="{
        height: `calc(100vh - ${headerHeight}rpx)`,
      }"
    >
      <view>
        <view>
          <!-- 搜索历史 -->
          <view class="old-search" v-if="oldSerachList.length">
            <view class="search-title flex-layout">
              <view class="text">搜索历史</view>
              <view class="icon" @click="clearOldSerachList"></view>
            </view>

            <view class="search-list flex-layout">
              <view
                class="search-item flex-layout"
                id="search-item"
                v-for="item in oldSerachList"
                :key="item.id"
                :ref="`ref${item}`"
                @click="searchWord(item)"
              >
                <view v-if="item.id !== 'empty'">
                  {{ item.text }}
                </view>
                <view
                  v-if="item.text === 'empty' && isExpand"
                  :class="{ 'expand-icon': isExpand }"
                  @click="handleExpand"
                >
                </view>
              </view>
            </view>
          </view>
          <!--  -->
          <view class="classify-title flex-layout">
            <view class="text">分类搜索</view>
          </view>
          <view class="classify-list flex-layout">
            <view
              class="classifyBtn-item flex-layout"
              v-for="item in classifyList"
              :key="item.id"
              @click="searchWord(item)"
            >
              {{ item.text }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { pxToRpx, rpxToPx } from "@/utils/index";

export default {
  data() {
    return {
      headerHeight: 0,
      statusBarHeight: 0,
      searchValue: "",
      pageNum: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      oldSerachList: [],
      classifyList: [
        { text: "猫粮" },
        { text: "狗粮" },
        { text: "GO" },
        { text: "寄养" },
        { text: "得了猫瘟怎么办" },
        { text: "猫粮该怎么选" },
        { text: "洗澡" },
        { text: "最多展示一行不换行最多展示一行不换行最多" },
        { text: "得了猫瘟怎么办1" },
        { text: "猫粮该怎么选2" },
      ],
      isExpand: false, // 是否展开历史搜索了
    };
  },
  onShow() {
    // this.$nextTick(() => {
    //   this.getSearchArea(); // 搜索区域是否显示展开图标
    // });
  },
  mounted() {
    this.setPageHeight(); // 获取顶部安全区，设置scrollView的高度 滚动
    this.getOldSerachList(); // 获取搜索历史
    this.$nextTick(() => {
      this.getSearchArea(); // 搜索区域是否显示展开图标
    });
  },
  methods: {
    handleNavBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    setPageHeight() {
      let height = 0;
      // 获取头部高度
      uni
        .createSelectorQuery()
        .in(this)
        .select(".header")
        .boundingClientRect((data) => {
          // 获取顶部安全区，计算list高度 方便滚动
          console.log("头部高度", data.height);

          //#ifdef MP-WEIXIN
          this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
          this.headerHeight =
            pxToRpx(Number(getApp().globalData.statusBarHeight)) +
            pxToRpx(data.height);
          console.log("height", height);
          this.headerHeight = `calc(100vh - ${height}rpx)`;
          //#endif

          //#ifdef H5
          this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
          this.headerHeight =
            pxToRpx(Number(getApp().globalData.h5StatusBarHeight)) +
            pxToRpx(data.height);
          console.log(this.headerHeight);
          //#endif
        })
        .exec();
    },
    getGoodsList() {
      if (this.finished || this.loading) return;
      this.loading = true;
      this.loading = false;
      const res = { data: [] };
      // 数据全部加载完成
      if (res.data.length < 10) {
        this.finished = true;
      }
    },
    searchWord(item) {
      this.searchValue = item.text;
      this.handleSearchGoods(item.text);
    },
    handleSearchGoods() {
      if (!this.searchValue) {
        uni.showToast({
          title: "请输入门店/商品名",
          icon: "none",
        });
        return;
      }
      this.oldSerachList.unshift({
        text: this.searchValue,
        id: Date.now(),
      });
      this.setOldSerachList();
      uni.navigateTo({
        url: `/pagesC/mallOrderList/serachGoodsResult/index?searchValue=${this.searchValue}`,
      });
    },
    getOldSerachList() {
      this.oldSerachList =
        uni
          .getStorageSync("oldSerachList")
          .filter((item) => item.id !== "empty") || [];
    },
    setOldSerachList() {
      uni.setStorageSync("oldSerachList", this.oldSerachList);
    },
    clearOldSerachList() {
      this.oldSerachList = [];
      this.setOldSerachList();
    },
    getSearchArea() {
      // 历史搜索展开就不计算了
      if (this.isExpand) return;
      uni
        .createSelectorQuery()
        .in(this)
        .select(".search-list")
        .boundingClientRect((data) => {
          console.log({ data });
          const lishiBtnBottom = data.bottom;
          const screenWidth = uni.getSystemInfoSync().screenWidth;
          uni
            .createSelectorQuery()
            .selectAll("#search-item")
            .boundingClientRect((res) => {
              console.log({ res });
              const index = res.findIndex(
                (item) => item.bottom > lishiBtnBottom
              );
              console.log("index", index);
              if (index > -1) {
                console.log("index", index);
                const lastItemright = res[index - 1].right;
                const flag =
                  screenWidth - lastItemright > rpxToPx(68 + 20 + 28 + 10);
                console.log("剩余宽度", flag);
                console.log(
                  screenWidth - lastItemright,
                  rpxToPx(58 + 20 + 28 + 10)
                );
                if (flag) {
                  this.oldSerachList.splice(index, 0, {
                    text: "",
                    id: "empty",
                  });
                } else {
                  this.oldSerachList.splice(index - 1, 0, {
                    text: "",
                    id: "empty",
                  });
                }
              }
            })
            .exec();
        })
        .exec();
    },
    filterOldSerachList() {
      this.oldSerachList = this.oldSerachList.filter(
        (item) => item.id !== "empty"
      );
    },
    handleExpand(){

    }
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>