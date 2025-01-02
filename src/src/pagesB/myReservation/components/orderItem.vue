<template>
  <view class="order-item" @click="goDetail">
    <view class="item-header">
      <view class="itemname">{{ info.shopName }}</view>
      <view
        :class="[
          'itemstatus',
          gray_status.indexOf(info.status) > -1 ? 'grey' : '',
        ]"
        >{{ statusText[String(info.status)] }}</view
      >
    </view>
    <view class="iteminfo">
      <view class="itemimage">
        <image :src="info.skuPic" mode="widthFit" />
      </view>
      <view class="itemdetail">
        <view class="desc"
          ><view class="label">项目:</view
          ><view class="name">{{ info.skuName }}</view></view
        >
        <view class="desc"
          ><view class="label">宠物:</view
          ><view class="name">{{ info.petName || "" }}</view></view
        >
        <view class="desc"
          ><view class="label">时间:</view
          ><view class="name">{{ showTime }}</view></view
        >
        <view class="desc"
          ><view class="label">类型:</view
          ><view class="name">{{ serviceTypeText[info.type] }}</view></view
        >
      </view>
    </view>
    <view class="goBtn">查看详情</view>
  </view>
</template>
<script>
import dayjs from "dayjs";
export default {
  components: {},
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  computed: {
    showTime() {
      // console.log("info:", this.info);
      if (
        !(this.info.reservationBeginTimeTs && this.info.reservationEndTimeTs)
      ) {
        return "";
      }

      const t1 = Number(this.info.reservationBeginTimeTs);
      const t2 = Number(this.info.reservationEndTimeTs);
      // console.log("t1:", t1);
      let show_day = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      );
      let ss1 = dayjs(t1).format("YYYY-MM-DD");
      let ss2 = show_day[dayjs(t1).format("d")];
      let ss3 = dayjs(t1).format("HH:mm");
      let ss4 = dayjs(t2).format("HH:mm");
      // console.log("ss", ss1, ss2, ss3);

      let str = ss1 + " " + ss2 + " " + ss3 + "-" + ss4;
      return str;
    },
  },
  data() {
    return {
      gray_status: [-20, -10, 40],
      serviceTypeText: {
        1: "预约美洗",
        2: "挂号",
        3: "驱虫",
      },
      statusText: {
        0: "门店确认中",
        20: "服务中",
        10: "待服务",
        40: "已完成",
        "-10": "已取消",
        "-20": "预约失败",
        "-30": "未到店",
      },
    };
  },
  methods: {
    goDetail() {
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesB/reservationService/index?reservationId=${this.info?.id}&transparentTopBar=1`,
      });
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesB/reservationService/index?reservationId=${this.info?.id}`,
      });
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/utils/fn.scss";
.order-item {
  width: 719rpx;
  padding: 33rpx 31rpx;
  background: #ffffff;
  border-radius: 24rpx;
  margin: 11rpx auto;
  position: relative;
  .item-header {
    display: flex;
    align-items: start;
    // padding-bottom: 5rpx;
    // border-bottom: 1rpx solid #e6e6e6;
    .itemname {
      flex: 1;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 30rpx;
      color: #1f1f1f;
      line-height: 38rpx;
    }
    .itemstatus {
      font-size: 30rpx;
      // font-weight: bold;
      margin-left: auto;
      color: #fe2442;
      width: 180rpx;
      text-align: right;
      &.yellow {
        color: #999999;
      }
    }
  }
  .iteminfo {
    display: flex;
    margin-top: 29rpx;
    .itemimage {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      margin-right: 19rpx;
      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12rpx;
      }
    }
    .itemdetail {
      .desc {
        display: flex;
        align-items: center;
        margin-bottom: 13rpx;
        .label {
          width: 75rpx;
          font-size: 25rpx;
          color: #666666;
          line-height: 31rpx;
        }
        .name {
          width: 380rpx;
          color: #666666;
          font-size: 25rpx;
          line-height: 31rpx;
          // font-weight: bold;
          @include textOverflow(1);
        }
      }
    }
  }
  .goBtn {
    width: 169rpx;
    height: 69rpx;
    border-radius: 35rpx;
    border: 2rpx solid #e6e6e6;
    font-weight: 400;
    font-size: 29rpx;
    color: #1f1f1f;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15rpx;
    margin-left: auto;
  }
}
</style>
