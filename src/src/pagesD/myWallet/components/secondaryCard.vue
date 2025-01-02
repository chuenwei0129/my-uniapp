<script>
import ExpandableText from "@/pagesD/myWallet/components/expandableText.vue";
import { getMyCardList } from "@/pagesD/myWallet/api/myWallet";
import NoData from "@/components/noData/index.vue";
import { display_report } from "@/utils/track";

export default {
  name: "secondaryCard",
  components: { NoData, ExpandableText },
  data() {
    return {
      navHeight: "0",
      listHeight: "0",
      safeAreaBottom: "0",
      isCompleted: false,
      list: [],
    };
  },
  mounted() {
    this.navHeight = getApp().globalData.navHeight;
    this.safeAreaBottom = getApp().globalData.bottomSafeAreaHeight;
    this.listHeight = `calc(100vh - ${this.navHeight}px - 44px - ${this.safeAreaBottom}px)`;
    this.getCardNum();
    display_report({
      display_name: "mypage_timescard_display",
      object_type: "me",
    });
  },
  methods: {
    async getCardNum() {
      try {
        const res = await getMyCardList(1);
        this.list = res?.data?.data || [];
        this.isCompleted = true;
      } catch (e) {
        this.isCompleted = true;
      }
    },
  },
};
</script>

<template>
  <view class="view-wrapper">
    <u-list :height="listHeight" v-if="list.length">
      <u-list-item v-for="(item, index) in list" :key="index">
        <view class="list-item">
          <view class="list-bg"></view>
          <view class="top-view">
            <view class="shop-view">
              <view class="circular"></view>
              <view class="shop">{{ item.shopName }}</view>
            </view>
          </view>
          <view
            class="content-view"
            v-for="(item2, index2) in item.cardList"
            :key="index2"
          >
            <view class="content-left">
              <view class="title"
                ><expandable-text :dt="item2.templateName" />
              </view>
              <view class="time">有效期：{{ item2.validityDesc }}</view>
            </view>
            <view class="content-right">
              <text class="top">{{ item2.balanceTimes }}</text>
              <text class="bottom">可用次数</text>
            </view>
          </view>

          <view class="footer">
            <view class="desc"
              >次卡仅限线下门店购买使用，具体可用范围请和门店确认</view
            >
          </view>
        </view>
      </u-list-item>
    </u-list>
    <view
      v-if="!list.length && isCompleted"
      class="no-data-wrapper"
      :style="{ height: listHeight }"
    >
      <NoData
        noDataText="还没有次卡～"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
    </view>
  </view>
</template>

<style scoped lang="scss">
.view-wrapper {
  .list-item {
    position: relative;
    .list-bg {
      position: absolute;
      background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/my/mine_card_copon_bg.png")
        no-repeat center 20rpx/100% 100%;
      background-size: 100% 152rpx;
      width: 100%;
      height: 152rpx;
      z-index: -1;
    }
    .top-view {
      margin-top: 20rpx;
      height: 100rpx;
      border-radius: 31rpx 31rpx 0 0;
      .shop-view {
        position: relative;
        .circular {
          position: absolute;
          top: 25rpx;
          left: 31rpx;
          width: 27rpx;
          height: 27rpx;
          background: #ffd41e;
          opacity: 0.8;
          border-radius: 13.5rpx;
        }
        .shop {
          position: absolute;
          top: 50rpx;
          left: 43rpx;
          right: 43rpx;
          transform: translateY(-50%);
          font-weight: 600;
          font-size: 31rpx;
          color: #333333;
          line-height: 42rpx;
          white-space: nowrap; /* 防止文本换行 */
          overflow: hidden; /* 隐藏超出一行的部分 */
          text-overflow: ellipsis;
        }
      }
    }
    .content-view {
      background-color: #fff;
      border-radius: 24rpx;
      margin: 0 24rpx 20rpx;
      padding: 29rpx 19rpx 29rpx 31rpx;
      display: flex;
      .content-left {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          font-weight: 600;
          font-size: 31rpx;
          color: #333333;
          line-height: 42rpx;
        }
        .time {
          padding-top: 20rpx;
          font-weight: 400;
          font-size: 27rpx;
          color: #999999;
        }
      }
      .content-right {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 0 12rpx;
        .top {
          font-family: D-DIN-Bold;
          font-weight: bold;
          font-size: 69rpx;
          color: #1f1f1f;
          line-height: 75rpx;
        }
        .bottom {
          font-weight: 400;
          font-size: 23rpx;
          color: #1f1f1f;
          line-height: 31rpx;
        }
      }
    }
    .footer {
      height: 49rpx;
      font-weight: 400;
      font-size: 23rpx;
      color: #999999;
      line-height: 31rpx;
      text-align: center;
      .desc {
        margin-top: 20rpx;
      }
    }
  }
  .no-data-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 29rpx 29rpx 0 0;
    margin-top: 16rpx;
  }
}
</style>
