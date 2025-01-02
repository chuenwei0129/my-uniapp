<template>
  <view class="task-page">
    <view class="task-top">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="header">
        <view class="iconfont icon-back" @click="handleBack"></view>
        <view class="header-t">会员成长任务</view>
        <view></view>
      </view>
      <view class="info">
        <view class="value">
          <view class="current" @click="goDetail">
            <view class="l">{{ levelInfo.availableGrowthValue }}&nbsp;</view>
            <view class="r"
              >成长值<span
                class="iconfont icon-outlineArrowRight"
                style="font-size: 15px"
              ></span
            ></view>
          </view>
          <view class="next">
            <view class="l">
              {{ titleArr[levelInfo.levelIndex - 1] }} &nbsp;</view
            >
            <view class="r">{{ levelInfo.upGrowthValue }}</view>
          </view>
        </view>
        <view class="progress" @click="goDetail">
          <view
            class="inner"
            :style="{ width: levelInfo.levelProgressBarRatio * 100 + '%' }"
          ></view>
        </view>
      </view>
    </view>
    <view class="task-btm">
      <view class="taskItem" v-for="item in taskList" :key="item.title">
        <view class="l">
          <view class="value">+{{ item.growthValue }}</view>
          <view class="info">
            <view class="title">{{ item.title }}</view>
            <view class="sub-title">{{ item.subTitle }}</view>
          </view>
        </view>
        <view class="r" v-if="item.type == 2" @click="goMall">去商城</view>
      </view>
    </view>
  </view>
</template>
<script>
import { QUERY_LEVEL } from "@/api/member";
export default {
  name: "memberTask",
  data() {
    return {
      statusBarHeight: "",
      levelInfo: {},
      titleArr: [
        "小水豚",
        "小铜豚",
        "小银豚",
        "小金豚",
        "小钻豚",
        "黑金豚",
        "胖豚豚",
      ],
      taskList: [
        {
          growthValue: "N",
          title: "线下宠胖胖门店消费",
          subTitle: "消费金额 → 成长值",
          type: 1,
        },
        {
          growthValue: "N",
          title: "商城购买商品",
          subTitle: "消费金额 → 成长值",
          type: 2,
        },
      ],
    };
  },
  methods: {
    goDetail() {
      //TODO 成长明细
      uni.navigateTo({
        url: `/pagesE/growthDetail/index`,
      });
    },
    handleBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    goMall() {
      uni.switchTab({
        url: `/pages/mall/index`,
      });
    },
    //获取用户会员等级
    async _getUserLevel() {
      const { data } = await QUERY_LEVEL();

      this.levelInfo = data.data;
      console.log("🚀 ~ _getUserLevel ~ levelInfo:", this.levelInfo);
    },
  },
  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    // 获取用户会员等级
    this._getUserLevel();
  },
};
</script>
<style lang="scss" scoped>
.task-page {
  width: 750rpx;
  .task-top {
    width: 100%;
    height: 475rpx;
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/member/task_top.png")
      no-repeat center center/100%;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72rpx;
      width: 100%;
      padding: 0 19rpx;
      font-weight: bold;
      color: #6f3e07;
      font-size: 35rpx;
      box-sizing: border-box;
      padding-top: 5rpx;
      .iconfont {
        font-size: 40rpx;
      }
      &-t {
        margin-left: -60rpx;
      }
    }
    .info {
      padding: 0 33rpx;
      margin-top: 92rpx;
      .value {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .current {
          display: flex;
          align-items: center;
          .l {
            font-size: 50rpx;
            font-weight: bold;
            color: #6f3e07;
            margin-right: 9rpx;
          }
          .r {
            font-size: 25rpx;
            color: #6f3e07;
            display: flex;
            align-items: center;
            .iconfont {
              // margin-top: 2rpx;
            }
          }
        }
        .next {
          display: flex;
          font-size: 25rpx;
          font-weight: 400;
          color: #6f3e07;
          .l {
            margin-right: 9rpx;
          }
        }
      }
      .progress {
        width: 100%;
        height: 10rpx;
        background: rgba(43, 11, 0, 0.1);
        border-radius: 6rpx;
        backdrop-filter: blur(10px);
        overflow: hidden;
        margin-top: 15rpx;
        .inner {
          height: 10rpx;
          background: linear-gradient(to right, #ce9331, #6c3f02);
          border-radius: 6rpx;
        }
      }
    }
  }
  .task-btm {
    width: 100%;
    height: calc(100vh - 430rpx);
    background: #ffffff;
    border-radius: 31rpx 31rpx 0rpx 0rpx;
    margin-top: -70rpx;
    padding: 60rpx 29rpx;
    .taskItem {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 73rpx;
      margin-bottom: 58rpx;
      .l {
        display: flex;
        align-items: center;
        height: 100%;
        .value {
          width: 65rpx;
          height: 65rpx;
          border-radius: 65rpx;
          background: linear-gradient(143deg, #fef5dd 0%, #ffe39e 100%);
          border: 2rpx solid #fedf94;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 27rpx;
          font-weight: bold;
          color: #6f3e07;
          margin-right: 19rpx;
          .add {
            font-weight: normal;
          }
        }
        .info {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          .title {
            font-size: 29rpx;
            font-weight: bold;
            color: #1f1f1f;
          }
          .sub-title {
            font-size: 23rpx;
            color: #999999;
          }
        }
      }
      .r {
        width: 138rpx;
        height: 58rpx;
        background: #ffd41e;
        border-radius: 31rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25rpx;
        color: #1f1f1f;
      }
    }
  }
}
</style>
