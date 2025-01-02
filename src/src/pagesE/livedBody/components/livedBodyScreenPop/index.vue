<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="openPopu"
    @close="handleClose"
    :round="38"
    :safeAreaInsetBottom="false"
  >
    <view class="breed-pop">
      <view class="page-container">
        <!-- <view class="status-bar" :style="{ height: statusBarHeight }"></view> -->
        <!-- <view class="tabs-container">
          <view class="back-btns" @click="handleClose">
            <image
            class="banc-img"
            src="https://frontend-cdn.henhenchina.com/image/medical-mp/livedBody/goback.png"
          ></image>
          </view>

          <view class="scol-tabs">
              <view class="list-box">
                <u-tabs
              :activeStyle="{
                color: '#1f1f1f',
                fontSize: '31rpx',
                fontFamily: 'AlimamaShuHeiTi-Bold',
              }"
              :inactiveStyle="{
                color: '#1f1f1f',
                fontSize: '31rpx',
              }"
              lineColor="transparent"
              :list="tabList"
              @click="handleTabsClick"
              :current="tabIndex"
              :safeAreaInsetBottom="false"
            ></u-tabs>
              </view>
            </view>
        </view> -->
        <view class="line"></view>
        选择品种
        <view class="close-icon" @click="$emit('update:isOpen',false)">
          <view class="iconfont icon-shutDown"></view>
        </view>
      </view>

      <!-- <view class="status-bar" :style="{ height: statusBarHeight }"></view> -->
      <view class="breed-list">
        <view
          v-for="(item, index) in breedTwoList"
          class="breed-item"
          :key="item.id"
          :class="{
            activeBg: index === activeIndex,
          }"
          @click="handleBreedFilter(item, index)"
        >
          <view class="item-img">
            <image :src="item.picture || breedDefaultUrl" />
          </view>
          <view
            class="breed-title"
            :class="{ activeColor: index === activeIndex }"
          >
            {{ item.name && item.name.slice(0, 4) }}
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
    breedList: {
      type: Array,
      default: [],
    },
    tabList: {
      type: Array,
      default: [],
    },
    statusBarHeight: {
      type: String,
      default: "0px",
    },
    current: {
      type: Number,
      default: 0,
    },
    secondClassifyId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      breedDefaultUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/breed_default.png",
      breedTwoList: [],
      tabIndex: 0,
      activeIndex: 0,
    };
  },
  onLoad(options) {},
  onReady() {},
  mounted() {
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  methods: {
    openPopu() {
      this.tabIndex = this.current;
      this.breedTwoList = JSON.parse(JSON.stringify(this.breedList));
      let index = this.breedTwoList.findIndex(
        (item) => item.id === this.secondClassifyId
      );
      console.log("open", this.breedList, this.secondClassifyId, index);
      if (index != -1) {
        this.activeIndex = index;
      } else {
        this.activeIndex = 0;
      }
    },
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleClose() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleConfirm() {
      this.$emit("update:isOpen", false);
      this.$emit("confirm");
    },
    handleTabsClick(item) {
      if (this.tabIndex === item.index) return;

      this.tabIndex = item.index;
      // this.tabId = item.id; // 存储附近门店跳转的tab id
      // this.tabName = item.name;
      // this.goodsList = [];
      // this.pageNum = 1;
      this.breedTwoList = item.subClassify || [];
      if (this.current == item.index) {
        let index = this.breedTwoList.findIndex(
          (item) => item.id === this.secondClassifyId
        );
        if (index != -1) {
          this.activeIndex = index;
        } else {
          this.activeIndex = 0;
        }
      } else {
        this.activeIndex = 0;
      }
    },
    handleBreedFilter(item, index) {
      console.log("handleBreedFilter123", this.breedTwoList[index], index);

      this.activeIndex = index;
      this.$emit("handleBreedFilter", this.breedTwoList[index], index);
      this.$emit("close", false);
      // this.isOpen = false
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
