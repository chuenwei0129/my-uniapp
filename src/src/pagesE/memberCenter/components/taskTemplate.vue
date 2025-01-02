<template>
  <view class="task-template">
    <ExclusiveConversion :levelIndex="levelIndex"></ExclusiveConversion>
    <view class="task-title" v-if="list.length > 0">做任务赚成长值</view>
    <view class="task-content">
      <view class="task-item" v-for="(item, index) in list" :key="index">
        <view class="left">
          <image class="icon" :src="`${imgUrl}${item.taskCode}.png`"></image>
          <view class="item-content">
            <view class="name">{{ filterStrLen(item.taskName) }}</view>
            <view class="desc"
              >{{ item.desc1 }}<text class="txt">{{ item.desc2 }}</text
              >{{ item.desc3 }}</view
            >
          </view>
        </view>
        <view
          :class="['btn', item.status === 3 ? 'opacity' : '']"
          v-if="item.taskCode !== 'LOGIN_WEEKLY'"
          @click="toTask(item)"
          >{{
            item.status === 1
              ? "去下单"
              : item.status === 2
              ? "去完成"
              : "已完成"
          }}</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import ExclusiveConversion from "./exclusiveConversion.vue";
import { QUERY_TASKS } from "@/api/memberV2";
import { action_report } from "@/utils/track";
export default {
  name: "taskTemplate",
  components: { ExclusiveConversion },
  props: {
    levelIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      imgUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/",
      list: [],
    };
  },
  mounted() {
    this.getTasks();
  },
  methods: {
    // 做任务 --去消费
    toTask(item) {
      if (item.status === 3) return;
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "member_renwu_click",
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: this.levelIndex,
          taskName: item.taskName,
        },
      });
      // #ifdef MP-WEIXIN
      uni.switchTab({
        url: "/pages/mall/index",
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/app/main?locate_main_fragment=2&tab=online`,
      });
      // #endif
    },
    filterStrLen(str) {
      if (str?.length > 12) return str.slice(0, 12) + "...";
      else return str;
    },
    async getTasks() {
      const {
        data: { data },
      } = await QUERY_TASKS();

      this.list = data;
      this.list.map((item) => {
        if (item.taskCode === "DAILY_CONSUME") {
          item.desc1 = "每消费";
          item.desc2 = `${item.scoreRule}元=1`;
          item.desc3 = "成长值";
          item.status = 1; // 去下单
        } else if (item.taskCode === "LOGIN_WEEKLY") {
          item.desc1 = `${item.completedCount}/${item.totalCount}${item.countUnitDesc}  | `;
          item.desc2 = `+${item.scoreRule}`;
          item.desc3 = "成长值";
          item.status = 0; // 不展示按钮
        } else if (item.taskCode === "FIRST_CONSUME") {
          item.desc1 = `${item.completedCount}/${item.totalCount} | `;
          item.desc2 = `+${item.scoreRule}`;
          item.desc3 = "成长值";
          if (item.completedCount === item.totalCount)
            item.status = 3; // 已完成
          else item.status = 2; // 去完成
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.task-template {
  padding: 11rpx 30rpx 60px;
  width: 100vw;
  min-height: 500rpx;
  background-color: #f7f8fc;
  border-radius: 31rpx 31rpx 0rpx 0rpx;
  margin-top: 23rpx;
  overflow: hidden;
  .task-title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-style: normal;
    margin-top: 38rpx;
    margin-bottom: 30rpx;
    @include textfclaw(35rpx, #333333, $align: left, $lineH: 48rpx);
  }
  .task-content {
    .task-item {
      height: 123rpx;
      background: #ffffff;
      border-radius: 23rpx;
      display: flex;
      padding: 21rpx 31rpx 21rpx 21rpx;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 19rpx;
      &:last-child{
        margin-bottom: 0;
      }
      .left {
        display: flex;
      }
      .icon {
        width: 81rpx;
        height: 81rpx;
      }
      .item-content {
        margin-left: 19rpx;
        font-family: PingFangSC, PingFang SC;
        font-style: normal;
        .name {
          font-weight: 500;
          @include textfclaw(31rpx, #1f1f1f, $align: left, $lineH: 42rpx);
          margin-bottom: 3rpx;
        }
        .desc {
          font-weight: 400;
          @include textfclaw(23rpx, #666666, $align: left, $lineH: 33rpx);
          @include textOverflow($lamp: 1);
          .txt {
            color: #fe2442;
          }
        }
      }
      .btn {
        width: 119rpx;
        height: 54rpx;
        background: #fee900;
        border-radius: 27rpx;
        font-weight: 500;
        @include textfclaw(25rpx, #1f1f1f, $align: center, $lineH: normal);
        @include flex;
      }
      .opacity {
        opacity: 0.4;
      }
    }
  }
}
</style>
