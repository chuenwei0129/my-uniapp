<template>
  <view
    class="order-wrapper"
    :style="{
      marginLeft: `${marginLeft}rpx`,
      marginRight: `${marginRight}rpx`,
    }"
  >
    <view class="title-wrapper">
      <view class="title">我的订单</view>
      <view class="fl-row-leftNowrap" @click="handleMallOrderList">
        <view class="order-all">全部</view>
        <view class="right-arrow"></view>
      </view>
    </view>

    <view class="order-group">
      <view
        v-for="item in orderGroups"
        :key="item.name"
        class="item"
        @click="() => handleMallOrderList(item.listIndex)"
      >
        <image :src="item.icon" class="icon">
          <u-badge
            v-if="item.badgeNum"
            numberType="ellipsis"
            max="99"
            :value="item.badgeNum"
            absolute
            :offset="['-15rpx', '20rpx']"
          ></u-badge>
        </image>
        <view class="title">{{ item.title }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_MALL_ORDER_LIST_BRADGE } from "@/api/mall";
import { mapMutations, mapState } from "vuex";
export default {
  props: {
    marginLeft: {
      type: [String, Number],
      default: 0,
    },

    marginRight: {
      type: [String, Number],
      default: 0,
    },
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  data() {
    return {
      orderGroups: [
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_pay_v2.png",
          title: "待付款",
          listIndex: 1,
          badgeNum: 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_send_v2.png",
          title: "待发货",
          listIndex: 2,
          badgeNum: 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_receive_v2.png",
          title: "待收货",
          listIndex: 3,
          badgeNum: 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_unuse_v2.png",
          title: "待使用",
          listIndex: 4,
          badgeNum: 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_refund_v2.png",
          title: "退款/售后",
          listIndex: 5,
          badgeNum: 0,
        },
      ],
    };
  },
  created() {
    if (this.userInfo.token) {
      this.queryBadge();
    }
  },
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
    /// 请求列表角标数量
    async queryBadge() {
      const res = await GET_MALL_ORDER_LIST_BRADGE();
      const {
        refundingCount,
        tobeUsedCount,
        unpaidCount,
        waitReceivedCount,
        waitShippedCount,
      } = res?.data?.data || {};
      this.orderGroups = [
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_pay_v2.png",
          title: "待付款",
          listIndex: 1,
          badgeNum: unpaidCount || 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_send_v2.png",
          title: "待发货",
          listIndex: 2,
          badgeNum: waitShippedCount || 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_receive_v2.png",
          title: "待收货",
          listIndex: 3,
          badgeNum: waitReceivedCount || 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_unuse_v2.png",
          title: "待使用",
          listIndex: 4,
          badgeNum: tobeUsedCount || 0,
        },
        {
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/my_refund_v2.png",
          title: "退款/售后",
          listIndex: 5,
          badgeNum: refundingCount || 0,
        },
      ];
    },
    handleMallOrderList(index) {
      uni.navigateTo({
        url: `/pagesC/mallOrderList/index?listIndex=${index}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-wrapper {
  display: flex;
  flex-flow: column nowrap;
  background-color: white;
  border-radius: 31rpx;

  .title-wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin: 23rpx 23rpx 0 23rpx;

    .title {
      font-size: 29rpx;
      // font-weight: bold;
      color: #1f1f1f; // #003b32;
      line-height: 40rpx;
      flex: 1 1 0;
      font-family: AlimamaShuHeiTi, AlimamaShuHeiTi-Bold;
    }

    .order-all {
      font-size: 25rpx;
      font-weight: 400;
      color: #999999;
      line-height: 35rpx;
    }

    .right-arrow {
      height: 31rpx;
      width: 31rpx;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/index/arrow-right-tag.png);
    }
  }

  .order-group {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-top: 35rpx;
    padding-right: 19rpx;
    padding-left: 19rpx;

    .item {
      position: relative;
      height: 136rpx;
      width: 130rpx;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      .icon {
        height: 54rpx;
        width: 54rpx;
        position: relative;
      }

      .title {
        font-size: 25rpx;
        font-weight: 400;
        color: #1f1f1f;
        line-height: 35rpx;
        margin-top: 8rpx;
      }

      .badge {
        position: absolute;
        font-size: 23rpx;
        color: #fff;
        text-align: center;
        top: -15rpx;
        right: 20rpx;
        height: 33rpx;
        min-width: 33rpx;
        background: #ff4900;
        border-radius: 50%;
      }
    }
  }
}
</style>
