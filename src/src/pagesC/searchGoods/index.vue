<template>
  <view class="page-wrapper">
    <GoodsSearchBar
      :defaultValue="inputSearchWord"
      navColor="#fff"
      @onFocus="onSearchFocus"
      @onBlur="onSearchBlur"
      @onSearch="handleSearch"
      @onClear="handleSearchClear"
      @onBackClick="handleBackClick"
      isFixed
    >
    </GoodsSearchBar>

    <view :style="{ height: `${navHeight}px` }"></view>
    <view class="content-wrapper" ::style="{ height: scrollViewHeight }">
      <view v-if="isSearchFocus || !searchWord" class="search-wrapper">
        <block v-if="historyList && historyList.length > 0">
          <view class="history-title">
            <view class="title">搜索历史</view>
            <view
              v-if="hasSearchHistory"
              class="clear"
              @click="clearHistory"
            ></view>
          </view>

          <view id="history" class="search-history">
            <block v-if="!expanded && foldHistoryList">
              <block v-for="item in foldHistoryList" :key="item.title">
                <view
                  v-if="item.expand"
                  class="expand"
                  @click="expandHistory()"
                ></view>
                <HistoryItem
                  v-else
                  id="historyTag"
                  :title="item.title"
                  @onHistoryClick="handleWordClick"
                >
                </HistoryItem>
              </block>
            </block>
            <block v-else>
              <HistoryItem
                v-for="item in historyList"
                id="historyTag"
                :title="item"
                :key="item"
                @onHistoryClick="handleWordClick"
              >
              </HistoryItem>
            </block>
          </view>

          <view style="height: 10rpx"></view>
        </block>

        <view v-if="hotList && hotList.length > 0" class="hot-search">
          <view class="title">热门搜索</view>
          <view class="list">
            <block v-for="item in hotList" :key="item">
              <view class="item" @click="handleWordClick(item)">
                <view class="hot-ico"></view>
                <view class="title">{{ item }}</view>
              </view>
            </block>
          </view>
        </view>
      </view>
      <view v-else class="result-wrapper">
        <u-sticky :offsetTop="navHeight">
          <view class="tabs-bg">
            <u-tabs
              :list="list4"
              lineWidth="30"
              lineHeight="2"
              lineColor="#FE2442"
              :current="productStatus"
              :activeStyle="{
                color: '#1F1F1F',
                fontWeight: 'bold',
                zIndex: 2,
              }"
              :inactiveStyle="{
                color: '#333333',
                zIndex: 2,
              }"
              @click="tabsClick"
              itemStyle="padding-left: 67.5rpx; padding-right: 67.5rpx; height: 50rpx;"
            >
            </u-tabs>
          </view>
        </u-sticky>
        <GoodsResult
          v-if="productStatus === 0"
          :keyword="searchWord"
          :scrollHeight="goodsScrollViewHeight"
        ></GoodsResult>
        <CutepetResult
          v-else
          :keyword="searchWord"
          :scrollHeight="goodsScrollViewHeight"
          ref="cutepetResults"
        ></CutepetResult>
      </view>
    </view>

    <PopConfirm
      :is-open.sync="showClearPop"
      title="提醒"
      text="是否确定删除全部搜索历史？"
      @confirm="handleClearHistory"
    />
  </view>
</template>

<script>
import HistoryItem from "./components/HistoryItem/index.vue";
import GoodsSearchBar from "../components/goodsSearchBar/index.vue";
import PopConfirm from "../components/PopConfirm/index.vue";
import GoodsResult from "./components/GoodsResult/index.vue";
import CutepetResult from "./components/CutepetResult/index.vue";
import ConfirmPop from "@/components/confirmPop/index.vue";
import { mapState } from "vuex";
import { addCart } from "@/api/cart";
import { action_report } from "@/utils/track";
import zIndex from "uview-ui/libs/config/zIndex";
export default {
  components: {
    HistoryItem,
    GoodsSearchBar,
    GoodsResult,
    ConfirmPop,
    PopConfirm,
    CutepetResult,
  },

  historyRect: null,

  data() {
    return {
      navHeight: "",
      scrollViewHeight: "",
      goodsScrollViewHeight: "0",
      foldHistoryList: null,
      expanded: false,
      hotList: [],
      showClearPop: false,
      isSearchFocus: false,
      // 输入框文本
      inputSearchWord: null,
      searchWord: null,
      productStatus: 0,
      list4: [
        {
          name: "商品",
        },
        {
          name: "萌宠",
        },
      ],
      pageFrom:''
    };
  },

  computed: {
    ...mapState({
      historyList: (state) => {
        return state.searchHistoryState.historyList;
      },

      hasSearchHistory: (state) => {
        const len = state.searchHistoryState.historyList?.length ?? 0;
        return len > 0;
      },
    }),
  },

  watch: {
    historyList: {
      handler: async function (value) {
        // this.calcHistory();
        console.log("history: ", value);
        // 置空，判断行数，nextTick
        this.foldHistoryList = null;
        this.$nextTick(() => {
          this.calcHistory();
        });
      },
    },
  },

  mounted() {
    uni.$off();
    uni.$on("addCardNum", (res) => {
      this.addCardNum(res);
    });
  },

  created() {
    this.navHeight = getApp().globalData.navHeight + 8;
    this.scrollViewHeight = `calc(100vh - ${this.navHeight + "px"})`;
    this.goodsScrollViewHeight = `calc(100vh - ${
      this.navHeight + "px"
    } - 70rpx - 50rpx - 18rpx)`;
  },

  async onLoad(options) {
    this.$store.dispatch("getSearchHistory");
    const keyword = options.keyword;
    this.pageFrom = options.from || ''    
    if (keyword) {
      this.handleWordClick(decodeURIComponent(keyword));
    }
  },

  onShareAppMessage(res) {
    if (this.searchWord) {
      return {
        title: `为您找到“${this.searchWord}”相关的优质商品`,
        path: `/pagesC/searchGoods/index?keyword=${encodeURIComponent(
          this.searchWord
        )}`,
      };
    }
  },

  methods: {
    tabsClick(item) {
      this.productStatus = item.index;
      //切换到活体
      if (item.index === 1) {
        this.$nextTick(() => {
          uni.$emit("cutepetResults");
        });
      }
    },
    rpx2px(rpx) {
      const systemInfo = uni.getSystemInfoSync();
      const screenWidth = systemInfo.screenWidth;
      const pxRatio = screenWidth / 750; // 750 是设计稿的宽度，可以根据实际情况修改
      return rpx * pxRatio;
    },

    async addCardNum(item) {
      const res = await addCart({
        cartType: 1,
        shopId: item.shopId || uni.getStorageSync("onlineCurMallId"),
        skuId: item.skuId,
        skuQty: 1,
        tenantId: "default_tenant",
      });

      if (res.data.data.isSuccess) {
        uni.showToast({
          icon: "none",
          title: "加购成功",
          duration: 1000,
        });
        uni.$emit("addCardNumActive");
      }
    },

    handleBackClick() {
      // 后退处理
      uni.navigateBack({
        fail: (e) => {
          console.log("result---------fail");
          uni.switchTab({
            url: "/pages/mall/index",
          });
        },
      });
    },

    clearHistory() {
      this.showClearPop = true;
    },

    handleClearHistory() {
      // 清空历史搜索
      this.$store.dispatch("clearSearchHistory");
    },

    onSearchFocus() {
      this.isSearchFocus = true;
      this.searchWord = null;
      console.log(
        `search focus: ${this.isSearchFocus}，keyword: ${this.searchWord}`
      );
    },

    onSearchBlur() {
      this.productStatus = 0;
      if(this.pageFrom == 'liveBody'){
        this.productStatus = 1;
      }
      this.isSearchFocus = false;
      console.log(
        `search focus: ${this.isSearchFocus}，keyword: ${this.searchWord}`
      );
    },

    getSelectorQueryRect(query, selector, all = false) {
      return new Promise((resolve, reject) => {
        if (all) {
          query
            .selectAll(selector)
            .boundingClientRect((rects) => {
              resolve(rects);
            })
            .exec();
        } else {
          query
            .select(selector)
            .boundingClientRect((rect) => {
              resolve(rect);
            })
            .exec();
        }
      });
    },

    async calcHistory() {
      console.log("calc");
      // 如果已展开，直接使用 原始数据
      if (this.expanded) {
        return;
      }
      const query = uni.createSelectorQuery().in(this);
      if (!this.historyRect || this.historyRect.right == 0) {
        this.historyRect = await this.getSelectorQueryRect(query, "#history");
      }
      console.log("calc history rect: ", this.historyRect);
      const rects = await this.getSelectorQueryRect(query, "#historyTag", true);
      const maxLines = 2;
      let startX = 0;
      let lineNum = 0;
      let lastIdx = 0;
      for (let index in rects) {
        const rect = rects[index];
        if (index == 0) {
          startX = rect.left;
          lineNum = 1;
        } else if (rect.left == startX) {
          lineNum++;
          if (lineNum > maxLines) {
            lastIdx = index;
            break;
          }
        }
      }

      console.log("calc resize: ", lineNum);
      const expandSize = this.rpx2px(77);
      if (lineNum > maxLines) {
        let idx = lastIdx - 1;
        while (idx >= 0) {
          const expandRight = rects[idx].right + expandSize;
          console.log(
            `${this.historyList[idx]}, history right: ${this.historyRect.right}, rect right: ${rects[idx].right}, expand size: ${expandSize}`
          );
          if (expandRight <= this.historyRect.right) {
            break;
          }
          idx--;
        }
        const list = [...this.historyList.slice(0, idx + 1)].map((item) => {
          return {
            title: item,
          };
        });
        list.push({
          title: "",
          expand: true,
        });
        this.foldHistoryList = list;
      } else {
        this.foldHistoryList = [...this.historyList].map((item) => {
          return {
            title: item,
          };
        });
      }
      this.expanded = false;
    },

    expandHistory() {
      this.expanded = true;
    },

    handleWordClick(keyword) {
      this.productStatus = 0;
      if(this.pageFrom == 'liveBody'){
        this.productStatus = 1;
      }
      // 处理 输入框 文本
      console.log(`handle keyword click: ${keyword}`);
      this.inputSearchWord = keyword;
      this.handleSearch(keyword);
    },

    handleSearch(keyword) {
      this.productStatus = 0;
      if(this.pageFrom == 'liveBody'){
        this.productStatus = 1;
      }
      console.log("handle search: ", keyword.trim());
      // 搜索
      if (keyword) {
        this.searchWord = keyword.trim();
        console.log("search: ", this.searchWord);
        this.$store.dispatch("addSearchHistory", keyword);
        if (this.searchWord.length > 0) {
          action_report({
            action_name: "all_search_keyword_click",
            module_name: "shop",
            extend: {
              keyword_name: this.searchWord,
            },
          });
        }
      }
    },

    handleSearchClear() {
      console.log("handle search clear");
      this.searchWord = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-flow: column nowrap;

  .content-wrapper {
    position: relative;

    .search-wrapper {
      height: 100%;
      width: 100%;

      .history-title {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-top: 29rpx;
        padding-left: 29rpx;
        padding-right: 29rpx;

        .title {
          font-size: 29rpx;
          font-weight: bold;
          color: #1f1f1f;
          line-height: 40rpx;
        }

        .clear {
          height: 35rpx;
          width: 35rpx;
          background-repeat: no-repeat;
          background-size: contain;
          background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/search_goods_clear_history.png);
        }
      }

      .search-history {
        display: flex;
        flex-flow: row wrap;
        margin-top: 10rpx;
        margin-left: 29rpx;
        margin-right: 29rpx;

        .history-item {
          height: 58rpx;
          margin-top: 10rpx;
          margin-bottom: 9rpx;
          background: #f7f8fc;
          border-radius: 29rpx;
          margin-right: 19rpx;

          font-size: 29rpx;
          color: #333333;
          line-height: 58rpx;
        }

        .expand {
          height: 58rpx;
          width: 58rpx;
          margin-top: 10rpx;
          margin-bottom: 9rpx;
          background-repeat: no-repeat;
          background-size: contain;
          background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/search_history_expand.png);
        }
      }

      .hot-search {
        margin-top: 29rpx;
        padding-left: 29rpx;
        padding-right: 29rpx;

        .title {
          font-size: 29rpx;
          font-weight: bold;
          color: #1f1f1f;
          line-height: 40rpx;
        }

        .list {
          display: flex;
          flex-flow: row wrap;
          margin-top: 14rpx;

          .item {
            width: 50%;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;

            .hot-ico {
              height: 21rpx;
              width: 21rpx;
              background-repeat: no-repeat;
              background-size: contain;
              background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/search_goods_hot_word.png);
            }

            .title {
              font-size: 29rpx;
              font-weight: 400;
              color: #333333;
              line-height: 68rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-left: 12rpx;
              padding-right: 18rpx;
            }
          }
        }
      }
    }

    .result-wrapper {
      height: 100%;
      width: 100%;
      .tabs-bg {
        height: 50rpx;
        background: #fff;
        z-index: 9999;
      }
    }
  }
}

::v-deep .u-tabs__wrapper__nav {
  padding-left: 178.5rpx;
}
</style>
