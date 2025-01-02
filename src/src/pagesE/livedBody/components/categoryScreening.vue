<template>
  <view class="category-screening" id="category-screening">
    <view class="tabBg-box" v-if="false">
      <image
        v-if="!showTop"
        :src="tabBg"
        mode="aspectFill"
        class="category-screening-bg"
      />
    </view>
    <!-- 类目  -->
    <view class="breed-container" v-if="updateCategoryFlag">
      <view class="breed-list-box" v-show="!showTop">
        <!-- 卡片类目 -->
        <scroll-view
          scroll-x
          class="scroll-breed"
          :scroll-left="scrollLeft"
          :scroll-with-animation="true"
          v-show="!changeBreedType"
        >
          <view class="scroll-box">
            <view class="bread-list">
              <view
                class="bread-item"
                v-for="(item, index) in breedList"
                :key="index"
                :class="{
                  firstItem: index === 0,
                  activeBg: index === activeIndex,
                }"
                @click="handleBreedFilter(index, item, 'card')"
              >
                <image v-if="item.icon" :src="item.icon" class="corner-mark" />
                <image
                  class="bread-img"
                  :src="item.picture || breedDefaultUrl"
                  mode="aspectFill"
                ></image>
                <view
                  class="bread-name"
                  :class="{ activeColor: index === activeIndex }"
                  >{{ (item.name && item.name.slice(0, 4)) || "-" }}</view
                >
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 顶部定位(吸顶效果)二级类目  -->
      <scroll-view
        scroll-x
        class="scroll-breed_2"
        :scroll-left="scrollLeft"
        :scroll-with-animation="true"
        v-show="changeBreedType"
        :style="{ top: breedStickyTop }"
      >
        <view class="breed-list2-box">
          <view class="breed-list2">
            <view
              v-for="(item, index) in breedList"
              :key="index"
              class="breed-item"
              @click="handleBreedFilter(index, item, 'noCard')"
              :class="{
                'active-item': index === activeIndex,
                firstItem: index === 0,
                activeBg: index === activeIndex,
              }"
            >
              {{ (item.name && item.name.slice(0, 4)) || "-" }}
            </view>
          </view>
          <view class="all-btn2" @click="showMore">
            <view class="btn-icon">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_down.png"
              />
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="all-btn" @click="showMore" v-if="!changeBreedType">
        <view>更</view>
        <view>多</view>

        <view class="btn-icon">
          <!-- <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_down.png"
          /> -->
          <u-icon name="arrow-down-fill" color="#666666" size="8"></u-icon>
        </view>
      </view>
    </view>
    <!-- 筛选项 -->
    <view :class="!showTop ? 'select-box' : ''">
      <view
        class="filter-container"
        :class="{ activeFilter: changeBreedType }"
        :style="{ top: `calc(80rpx + ${breedStickyTop})` }"
      >
        <CutepetFilter
          scrollHeight="100vh"
          :shopId="shopId"
          :liveShopList="liveShopList"
          :priceList="priceList"
          @onChange="receiveChild"
          :isClearOther="isClearOther"
          :changePetChangeFlag="changePetChangeFlag"
          :parentDataOut="parentDataOut"
          :tabType="tabType"
        />
      </view>
    </view>
  </view>
</template>

<script>
import CutepetFilter from "./cutepetFilter.vue";
export default {
  name: "categoryScreening",
  components: {
    CutepetFilter,
  },
  props: {
    tabList: {
      type: Array,
    },
    tabIndex: {
      type: Number,
    },
    shopId: {
      type: String,
    },
    liveShopList: {
      type: Array,
    },
    priceList: {
      type: Array,
    },
    breedStickyTop: {
      type: String,
    },
    changeBreedType: {
      type: Boolean,
    },
    secondId: {
      type: String,
    },
    changePetChangeFlag: {
      type: Boolean,
    },
    showTop: {
      type: Boolean,
      default: false,
    },
    isClearOther: {
      type: Boolean,
    },
    // 传给子组件的筛选条件（排序、价格、性别）
    parentDataOut: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    tabBg() {
      return this.tabList[this.tabIndex]?.picture || "";
    },
    tabType() {
      return this.tabList[this.tabIndex]?.name || "";
    },
    breedList() {
      setTimeout(() => {
        this.getScrollW();
      }, 100);
      return this.tabList[this.tabIndex]?.subClassify || [];
    },
  },
  data() {
    return {
      breedDefaultUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/breed_default.png",
      activeIndex: 0,
      selectQuery: {}, // 选中的所有筛选条件
      selectQueryObj: {}, // 门店、性别、价格
      selectPet: "", // 选中的品种
      contentScrollW: 0, // 二级类目区域宽度
      scrollLeft: 0, // 二级类目滚动条位置
      isScroll: true, // 是否可以滚动
      isCutepetFilterTransfer: false, // 筛选组件是否传参
      hasLeftBreedList: [],
      sendSelectData: {
        // 传给父组件的所有筛选条件
        dataOut: {},
        categoryInfo: {},
        itemTypeInfo: {}, // 二级类目同步(卡片与吸顶)
      },
      isEditInitShop: false, // 是否手动选择初始化门店筛选（触发了门店、排序、筛选）
      updateCategoryFlag: true, // 刷新二级类目
    };
  },
  watch: {
    tabIndex(newVal, oldVal) {
      if (newVal >= 0) {
        const list = this.tabList[this.tabIndex]?.subClassify;
        const index =
          (this.secondId &&
            list?.findIndex((item) => item.id == this.secondId)) ||
          0;
        this.activeIndex = index || 0;
        this.selectPet = "";
      }
      if (newVal !== oldVal) {
        this.updateCategoryFlag = false;
        this.scrollLeft = 0;
        this.$nextTick(() => {
          this.updateCategoryFlag = true;
        });
      }
    },
    changePetChangeFlag(newVal, oldVal) {
      const list = this.tabList[this.tabIndex]?.subClassify;
      const index = list?.findIndex((item) => item.id == this.secondId);
      this.activeIndex = index === -1 ? 0 : index;
      this.selectPet = this.secondId;
      this.sendSelectData.categoryInfo.secondClassifyIds =
        this.selectPet.length > 0 ? [this.selectPet] : [];
      if (this.showTop) {
        setTimeout(() => {
          this.getScrollW();
        }, 500);
      } else {
        this.getScrollP();
      }
    },
    isClearOther(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$set(this.sendSelectData, "categoryInfo", {});
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 监听-根据定位/收货地址-初始化门店,赋值sendSelectData
    initShopWatch() {
      console.log("这里是子组件 ：：：", this.liveShopList, this.shopId);
      if (this.shopId && this.shopId !== "") {
        const shopInfo = this.liveShopList.find(
          (item) => item.shopId === this.shopId
        );
        this.sendSelectData.dataOut.shopInfo = shopInfo;
      }
    },
    // 接收子组件传参
    receiveChild(childData) {
      this.isEditInitShop = true;
      this.sendSelectData.dataOut = childData;
      this.$emit("liveSelectChange", this.sendSelectData);
    },
    // // 获取标题区域宽度，和每个子元素节点的宽度以及元素距离左边栏的距离
    getScrollW() {
      let that = this;
      let query = uni.createSelectorQuery().in(this);
      query
        .select(".scroll-breed")
        .boundingClientRect((data) => {
          // 拿到 scroll-breed 组件宽度
          this.contentScrollW = data?.width;
        })
        .exec();

      query
        .selectAll(".bread-item")
        .boundingClientRect((data) => {
          let dataLen = data.length;
          const breedList = this.tabList[this.tabIndex]?.subClassify;
          for (let i = 0; i < dataLen; i++) {
            //  scroll-breed 子元素组件距离左边栏的距离
            breedList[i].left = data[i]?.left || 0;
            //  scroll-breed 子元素组件宽度
            breedList[i].width = data[i]?.width || 0;
          }
          if (breedList?.every((i) => i.left)) {
            this.hasLeftBreedList = breedList;
            that.getScrollP();
          }
        })
        .exec();
    },
    // 滚动条位置
    getScrollP() {
      const breedList = this.hasLeftBreedList; // this.tabList[this.tabIndex]?.subClassify;
      const i = this.activeIndex;
      const scrollItem = breedList[i];
      if (!(scrollItem?.left && scrollItem?.width)) return;
      const left =
        scrollItem.left - this.contentScrollW / 2 + scrollItem.width / 2;
      setTimeout(() => {
        this.scrollLeft = left > 0 ? left : 0;
      }, 100);
    },
    handleBreedFilter(i, item, type) {
      if (this.activeIndex == i) return;
      if (!this.isEditInitShop) this.initShopWatch();
      this.activeIndex = i;
      if (item?.id) this.selectPet = item.id || "";
      else this.selectPet = "";

      if (item?.id) {
        this.sendSelectData.categoryInfo.secondClassifyIds = [this.selectPet];
      } else {
        this.$set(this.sendSelectData.categoryInfo, "secondClassifyIds", []);
      }
      // this.isCutepetFilterTransfer = false; // 表示接收到了子组件的值
      this.getScrollP();
      // 用于处理吸顶二级类目与卡片选中态同步问题
      this.sendSelectData.itemTypeInfo = { type, index: i };
      uni.$u.debounce(() => {
        this.$emit("liveSelectChange", this.sendSelectData);
      }, 200);
    },
    showMore() {
      this.$emit("showMore");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.category-screening {
  width: 100%;
  background-color: #fff;
  .category-screening-bg {
    width: 750rpx;
    height: 235rpx;
    display: block;
  }
  .breed-list-box {
    height: 200rpx;
  }
  // 类目
  .breed-container {
    width: 100vw;
    // background-color: #fff;
    // margin-top: -42rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    .scroll-breed {
      height: 200rpx;
    }
    .scroll-breed_2 {
      height: 80rpx !important;
      position: fixed;
      left: 0;
    }
    .bread-list {
      display: flex;
      overflow-x: scroll;
      padding-right: 68rpx;
      box-sizing: border-box;
      .bread-item {
        margin-top: 8rpx;
        width: 135rpx;
        height: 192rpx;
        background-color: #f7f8fc;
        margin-left: 15rpx;
        @include flex;
        flex-direction: column;
        border-radius: 15rpx;
        position: relative;
        border: 2rpx solid #fff;
        // box-sizing: border-box;
        .corner-mark {
          position: absolute;
          width: 42rpx;
          height: 25rpx;
          right: -8rpx;
          top: -8rpx;
          z-index: 9;
        }
        .bread-img {
          width: 135rpx;
          height: 135rpx;
          display: block;
        }
        .bread-name {
          font-family: PingFangSC, PingFang SC;
          font-size: 25rpx;
          font-weight: 300;
          color: #1f1f1f;
          width: 100%;
          height: calc(100% - 135rpx);
          @include flex;
        }
      }
      .firstItem {
        margin-left: 15rpx !important;
      }
      .activeBg {
        background-color: #ffefef;
      }
      .activeColor {
        color: #fe2442 !important;
        font-weight: 500 !important;
      }
    }
    .all-btn {
      position: absolute;
      bottom: -1rpx;
      right: 0;
      width: 54rpx;
      height: 193rpx;
      margin-bottom: 2rpx;
      border-radius: 15rpx 0 0 15rpx;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #666666;
      font-size: 23rpx;
      // background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/gengduo.png");
      // background-color: rgba(255, 255, 255, 0.5);
      background: linear-gradient(
        270deg,
        #f7f8fc 0%,
        rgba(247, 248, 252, 0.7) 100%
      );
      padding-top: 50rpx;
      .btn-icon {
        // width: 23rpx;
        height: 23rpx;
        margin-top: 21rpx;
        image {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
  }
}
.activeFilter {
  position: fixed;
  z-index: 999;
  left: 0;
  margin-top: -12rpx !important;
}
.breed-list2-box {
  width: 100%;
  padding-bottom: 15rpx;
  padding-top: 15rpx;
  padding-right: 75rpx;
  box-sizing: border-box;
  background-color: white;
  height: 80rpx;
  position: relative;
  top: 0;
  left: 0;
  .all-btn2 {
    width: 115rpx;
    height: 58rpx;
    z-index: 999;
    text-align: right;
    line-height: 58rpx;
    padding-right: 27rpx;
    position: absolute;
    right: 0;
    top: 15rpx;
    background: linear-gradient(
      270deg,
      #ffffff 60%,
      rgba(255, 255, 255, 0) 100%
    );
    .btn-icon {
      margin-top: 5rpx;
      image {
        width: 23rpx;
        height: 23rpx;
      }
    }
  }
  .breed-list2 {
    padding-right: 68rpx;
    position: relative;
    z-index: 2;
    padding-left: 29rpx;
    display: flex;
    overflow-x: auto;
    flex: 1;
    background: linear-gradient(
      270deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    );
    box-sizing: border-box;
    .breed-item {
      background: #f7f8fc;
      border-radius: 29rpx;
      border: 2rpx solid #ffffff;
      margin-right: 15rpx;
      flex-shrink: 0;
      overflow: hidden;
      font-size: 25rpx;
      height: 54rpx;
      line-height: 54rpx;
      padding:  0 29rpx;
    }

    .active-item {
      color: #fe2442;
      background-color: #ffefef;
    }
  }
}
.select-box {
  height: 85rpx;
}
.scroll-box {
  display: inline-block;
  overflow: hidden;
}
.tabBg-box {
  width: 750rpx;
  height: 235rpx;
}
</style>
