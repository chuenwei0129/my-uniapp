<template>
  <view class="appraise">
    <view class="header">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="top-bar">
        <view :class="['iconfont', 'icon-back']" @click="goBack"></view>
        <view class="top-title"
          >评价({{ commentCount || totalCommentCount }})</view
        >
        <view class="click" @click="goBack"></view>
      </view>

      <view class="top-tab">
        <view class="tab-item" @click="changeTab('OVERALL')">
          <view :class="{ 'active-tab': selectSort === 'OVERALL' }">综合</view>
          <view :class="{ 'border-b': selectSort === 'OVERALL' }"></view>
        </view>
        <view class="line"></view>
        <view class="tab-item" @click="changeTab('NEWEST')">
          <view :class="{ 'active-tab': selectSort === 'NEWEST' }">最新</view>
          <view :class="{ 'border-b': selectSort === 'NEWEST' }"></view>
        </view>
      </view>
    </view>

    <scroll-view
      class="scroll-appraise"
      scroll-y
      lower-threshold="150"
      @scrolltolower="handleScrolltolower"
      :style="{ background: commentsList.length > 0 ? '#fff' : '#F7F8FC' }"
    >
      <template v-show="!isLoading">
        <AppraiseList
          v-if="commentsList.length > 0"
          :commentsList="commentsList"
          :appraiseType="itemData.commodityType == 2 ? 2 : 1"
          :isLoading="isLoading"
        />
        <AppraiseEmpty v-if="commentsList.length === 0 && !isLoading" />
      </template>
      <template v-if="isLoading">
        <view class="data-unsettled">
          <image
            class="loading-img"
            src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
            mode="scaleToFill"
          />
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script>
import { display_report } from "@/utils/track";
import { GET_SPU_COMMENTS } from "@/api/mallV3";
import AppraiseList from "@/pagesC/goodsServiceDetail/components/appraise/appraiseList.vue";
import AppraiseEmpty from "@/pagesC/goodsServiceDetail/components/appraise/appraiseEmpty.vue";
export default {
  name: "Appraise",
  components: { AppraiseList, AppraiseEmpty },
  props: {
    // 商品详情数据
    itemData: {
      type: Object,
      default: () => {},
    },
    // 评论总数
    commentCount: {
      type: [String, Number],
      default: () => "0",
    },
    statusBarHeight: {
      type: String,
    },
    navBarHeight: {
      type: String,
    },
    userInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectSort: "OVERALL",
      // 评论列表
      commentsList: [],
      pageNum: 1,
      pageSize: 20,
      loadEnable: true,
      isLoading: false,
      totalCommentCount: 0,
    };
  },
  async mounted() {
    console.log("评价列表====>", this.userInfo);
    display_report({
      display_name: "Reviewspage_display",
      module_name: "Reviewspage",
      extend: {
        user_id: this.userInfo?.userId,
        commodity_id: this.itemData.itemName,
      },
    });
    // 获取评论列表
    this.getComments(this.selectSort);
  },
  computed: {},
  methods: {
    // 获取所有评论
    getComments(sort) {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        shopId: this.itemData.shopId,
        itemId: this.itemData.itemId,
        sortType: sort || "OVERALL", // OVERALL=综合排序, NEWEST=最新排序;
      };
      if (this.isLoading) return;
      this.isLoading = true;
      GET_SPU_COMMENTS(params)
        .then((res) => {
          const newData = JSON.parse(JSON.stringify(res?.data?.data?.data));
          this.totalCommentCount = res?.data?.data?.commentCount || 0;
          this.commentsList = [...this.commentsList, ...newData];
          // this.pageNum++;
          this.total = res?.data?.data?.totalCount || 0;
          if (this.commentsList?.length <= Number(total)) {
            this.loadEnable = true;
          } else {
            this.loadEnable = false;
          }
        })
        .catch((err) => {
          console.log("获取商详评论列表--失败：：", err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    changeTab(sort) {
      if (this.sortType !== sort) {
        this.pageNum = 1;
        this.commentsList = [];
        this.getComments(sort);
      }
      this.selectSort = sort;
    },
    goBack() {
      this.$emit("close");
    },
    handleScrolltolower(e) {
      console.log(
        "---------------触底了---------------",
        this.commentsList?.length,
        this.loadEnable
      );
      // 接口返回数据不足20条时，禁止加载更多
      if (this.commentsList?.length < this.total && this.loadEnable) {
        this.pageNum++;
        this.getComments(this.selectSort);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.appraise {
  width: 100%;
  // #ifdef H5
  height: calc(100vh - constant(safe-area-inset-bottom) - 32rpx - 85rpx);
  height: calc(100vh - env(safe-area-inset-bottom) - 32rpx - 85rpx);
  // #endif
  // #ifdef MP-WEIXIN
  height: initial;
  // #endif
  background: #f7f8fc;
  overflow: hidden;

  .header {
    background-color: #fff;
    .top-bar {
      display: flex;
      align-items: center;
      height: 62rpx;
      position: relative;
      .top-title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-style: normal;
        @include textfclaw(31rpx, #333, left, 46rpx);
        margin-left: 4rpx;
      }
      .click {
        position: absolute;
        left: 0;
        top: 0;
        width: 120rpx;
        height: 90rpx;
      }
      .icon-back {
        font-size: 42rpx;
        margin-left: 23rpx;
        font-size: 48rpx;
      }
      .iconfont {
        font-size: 42rpx;
      }
    }

    .top-tab {
      margin: 4rpx 31rpx 0;
      border-bottom: 0.5px solid #e6e6e6;
      font-weight: 300;
      font-size: 27rpx;
      color: #333333;
      line-height: 38rpx;
      font-family: PingFangSC, PingFang SC;
      display: flex;
      align-items: center;
      padding: 21rpx 0;
      .tab-item {
        position: relative;
        .border-b {
          position: absolute;
          bottom: -21rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 38rpx;
          height: 4rpx;
          background: #1f1f1f;
        }
      }
      .active-tab {
        font-weight: 500;
        @include textfclaw(27rpx, #1f1f1f, center, 38rpx);
      }
      .line {
        width: 1rpx;
        height: 23rpx;
        border: 1rpx solid #e6e6e6;
        margin: 0 25rpx;
      }
    }
  }

  .scroll-appraise {
    width: 100%;
    // #ifdef MP-WEIXIN
    max-height: calc(
      100vh - env(safe-area-inset-bottom) - 32rpx - 85rpx - 228rpx
    );
    // #endif
    // #ifdef H5
    max-height: calc(100vh - env(safe-area-inset-bottom) - 195rpx);
    // #endif
    background: #fff;
    overflow: hidden;
    position: relative;
  }
  .data-unsettled {
    // #ifdef MP-WEIXIN
    height: calc(100vh - env(safe-area-inset-bottom) - 32rpx - 85rpx - 228rpx);
    // #endif
    // #ifdef H5
    height: calc(100vh - env(safe-area-inset-bottom) - 195rpx);
    // #endif
    width: 750rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .loading-img {
      width: 60rpx;
      height: 60rpx;
    }
  }
}
</style>
