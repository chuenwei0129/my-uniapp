<template>
  <view class="order-item" @click="goDetail">
    <view class="item-header">
      <view class="itemname">{{ info.shopName }}</view>
      <view
        v-if="info.status != '-10'"
        :class="[
          'itemstatus',
          gray_status.indexOf(info.status) > -1 ? 'grey' : '',
        ]"
        >{{ statusText[String(info.status)] }}</view
      >
      <view class="cancel-effect" v-else>
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/quxiao.png"
        />
      </view>
    </view>
    <view class="iteminfo">
      <view class="itemimage">
        <image :src="info.skuPic" mode="widthFit" />
      </view>
      <view class="itemdetail">
        <view class="desc">
          <!-- <view class="label">项目:</view> -->
          <view class="name1">{{ info.skuName || "未知" }}</view></view
        >
        <view class="desc"
          ><view class="label">预约时间:</view
          ><view class="name">{{ reservationShowTime || "未知" }}</view></view
        >
        <view class="desc" v-if="showTime"
          ><view class="label">库存锁定时间:</view
          ><view class="name">{{ showTime }}</view></view
        >
        <view class="desc"
          ><view class="label">预约类型:</view
          ><view class="name">{{ serviceTypeText[info.type] }}</view></view
        >
        <view class="goBtn">查看详情</view>
      </view>
    </view>
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
      if (!(this.info.lockStockBeginTime && this.info.lockStockEndTime)) {
        return "";
      }

      const t1 = this.info.lockStockBeginTime;
      const t2 = this.info.lockStockEndTime;
      console.log("t1:", t1, t2);
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

      // let str = ss1 + " " + ss2 + " " + ss3 + "-" + ss4;
      let str = ss1 + " " + ss3 + "-" + ss4;
      return str;
    },
    reservationShowTime() {
      // console.log("info:", this.info);
      if (!(this.info.reservationBeginTime && this.info.reservationEndTime)) {
        return "";
      }

      const t1 = this.info.reservationBeginTime;
      const t2 = this.info.reservationEndTime;
      console.log("t1:", t1, t2);
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

      // let str = ss1 + " " + ss2 + " " + ss3 + "-" + ss4;
      let str = ss1 + " " + ss3 + "-" + ss4;
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
        4: "预约看宠",
      },
      statusText: {
        0: "预约成功",
        20: "已到店",
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
      const h5Domain = {
        development: "https://cn-dev01-shareactivity.chongpangpang.com/",
        test: "https://cn-dev02-shareactivity.chongpangpang.com/",
        pre: "https://cn-test01-shareactivity.chongpangpang.com/",
        production: "https://shareactivity.chongpangpang.com/",
      };
      let route =
        h5Domain[process.env.NODE_ENV] +
        `wallet-h5/#/livingBody/reservationDetail?reservationId=${this.info?.id}`;
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/webView/index?route=${encodeURIComponent(
          route
        )}&type=icon`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: route,
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
  // height: 413rpx;
  padding: 33rpx 31rpx 30rpx;
  background: #ffffff;
  border-radius: 24rpx;
  margin: 0 auto;
  margin-top: 19rpx;
  position: relative;
  box-sizing: border-box;
  .item-header {
    display: flex;
    align-items: start;
    // padding-bottom: 25rpx;
    // border-bottom: 1rpx solid #e6e6e6;
    .itemname {
      width: 500rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 30rpx;
      color: #1f1f1f;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
    }
    .itemstatus {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 30rpx;
      color: #fe2442;
      line-height: 38rpx;
      text-align: right;
      font-style: normal;
      margin-left: auto;
      &.yellow {
        color: #999999;
      }
    }
    .cancel-effect {
      width: 135rpx;
      height: 135rpx;
      position: absolute;
      top: 0;
      right: 0;
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
          // width: 75rpx;
          font-size: 24rpx;
          color: #666;
          line-height: 31rpx;
        }
        .name1 {
          // width: 380rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #666666;
          font-style: normal;
          @include textOverflow(1);
          line-height: 31rpx;
        }
        .name {
          // width: 380rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #666666;
          font-style: normal;
          margin-left: 20rpx;
          @include textOverflow(1);
          line-height: 31rpx;
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
    margin-left: 327rpx;
    margin-top: 25rpx;
  }
}
</style>
