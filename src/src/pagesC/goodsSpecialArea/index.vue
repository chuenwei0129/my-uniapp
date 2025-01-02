<script>
import NavBar from "@/components/navBar/index.vue";
import { getGoodsSpecialArea } from "@/api/mallv2";
import NoData from "@/components/noData/index.vue";
import MyWaterFall from "@/components/waterfall/index.vue";

export default {
  name: "index",
  components: { MyWaterFall, NoData, NavBar },
  data() {
    return {
      showNavBar: false,
      bannerHeight: 0,
      bannerUrl: "",
      title: "",
      isCompleted: false,
      list: [],
    };
  },
  methods: {
    onClickItem(item) {
      console.log("item--------", item);
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${
          item?.itemId || ""
        }&skuId=${item?.skuId || ""}&shopId=${item?.shopId}`,
      });
    },
    onScrollHandle(event) {
      this.showNavBar =
        event?.detail?.scrollTop >= getApp().globalData.navHeight;
    },
    onLoadImage(event) {
      this.bannerHeight = event?.detail?.height ?? 0;
    },
    async getGoodsSpecialAreaList(categoryId) {
      try {
        const res = await getGoodsSpecialArea({ id: categoryId });
        this.title = res?.data?.data?.title;
        this.bannerUrl = res?.data?.data?.banner;
        this.list = res?.data?.data?.itemList;
        this.isCompleted = true;
      } catch (e) {
        this.isCompleted = true;
      }
    },
  },

  onLoad(options) {
    const categoryId = options?.categoryId || "";
    this.getGoodsSpecialAreaList(categoryId);
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="navbar-wrapper">
      <NavBar
        class="navbar"
        showBackBtn
        :title="title"
        :showTitle="showNavBar"
        :navColor="showNavBar ? '#FFF' : 'transparent'"
      />
    </view>
    <scroll-view
      v-if="list.length"
      class="scroll-wrapper"
      scroll-y
      @scroll="onScrollHandle"
    >
      <view class="banner-wrapper">
        <image
          @load="onLoadImage"
          mode="heightFix"
          :style="{ width: '100%', verticalAlign: 'top' }"
          :src="bannerUrl"
        />
      </view>
      <MyWaterFall v-model="list" imgKey="picture" @onClickItem="onClickItem" />
    </scroll-view>
    <view v-if="!list.length && isCompleted" class="no-data-wrapper">
      <NoData
        noDataText="暂无数据"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
