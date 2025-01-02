<script>
import { getMyCardList } from "@/pagesD/myWallet/api/myWallet";
import NoData from "@/components/noData/index.vue";
import { display_report } from "@/utils/track";

export default {
  name: "debitCard",
  components: { NoData },
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
      display_name: "mypage_valuecard_display",
      object_type: "me",
    });
  },

  methods: {
    async getCardNum() {
      try {
        const res = await getMyCardList();
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
            class="bottom-view"
            v-for="(item2, index2) in item.cardList"
            :key="index2"
          >
            <view class="money-top">
              <view class="title">总余额(元）</view>
              <view class="money">{{ item2.balanceAmount }}</view>
            </view>
            <view class="line"></view>
            <view class="money-bottom">
              <view class="money-view">
                <view class="title">本金(元）</view>
                <view class="money">{{ item2.rechargeAmount }}</view>
                <view class="desc">有效期：{{ item2.validityDesc }}</view>
              </view>
              <view class="money-view">
                <view class="title">赠金(元）</view>
                <view class="money">{{ item2.giveAmount }}</view>
              </view>
            </view>
          </view>
          <view class="footer">
            <view class="desc"
              >储值卡仅限线下门店购买使用，具体可用范围请和门店确认</view
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
        noDataText="还没有储蓄卡～"
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
        top: 50%;
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
    .bottom-view {
      background-color: #fff;
      border-radius: 24rpx;
      margin: 0 24rpx 20rpx;
      .money-top {
        padding: 31rpx 31rpx 0;
        .title {
          font-weight: 400;
          font-size: 27rpx;
          color: #1f1f1f;
          line-height: 38rpx;
        }

        .money {
          font-family: D-DIN-Bold;
          font-weight: bold;
          font-size: 69rpx;
          color: #1f1f1f;
          line-height: 75rpx;
          padding: 20rpx 0 27rpx;
        }
      }

      .line {
        margin: 0 31rpx;
        border-bottom: 1px solid rgba(230, 230, 230, 0.4);
      }

      .money-bottom {
        display: flex;
        padding: 22rpx 31rpx 31rpx;
        font-weight: 400;
        font-size: 27rpx;
        color: #1f1f1f;
        line-height: 38rpx;
        .money-view {
          flex: 1;
          .money {
            font-family: D-DIN-Bold;
            font-weight: bold;
            padding-top: 12rpx;
            font-size: 38rpx;
            line-height: 42rpx;
          }
          .desc {
            padding-top: 24rpx;
            font-weight: 400;
            font-size: 23rpx;
            color: #999999;
            line-height: 33rpx;
          }
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
        margin-top: 30rpx;
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
