<template>
  <view class="itemcontent">
    <view class="header">
      <view class="leftwrap">
        <view :class="['icon', `${type}_icon`]"></view>
        <view :class="[`${type}_title`]">{{ title }}</view>
      </view>
    </view>
    <template v-if="info && Object.keys(info).length">
      <view class="titledesc"
        >距离上次{{ title == "疫苗" ? "接种" : title }}已过去</view
      >
      <view class="daygo">
        <view class="daynnum">{{ info.diffDays || 0 }}</view
        ><view class="unit">天</view>
      </view>
      <view class="suggest" v-if="info.tip">{{ info.tip }}</view>
      <view class="bottom">
        <view class="latestdate"
          >最近:
          {{
            info.latestRecordTime
              ? info.latestRecordTime.replaceAll("-", "/")
              : "-"
          }}{{ info.storeName ? `【${info.storeName}】` : "" }}</view
        >
        <view class="viewbtn" @click="goDetail"
          >立即查看<view class="rightarrow"></view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="empty-record">
        <view class="emptytext">暂无记录</view>
        <!-- #ifdef H5 -->
        <view class="gorecordBtn" @click="goRecord">去记录</view>
        <!-- #endif -->
      </view>
    </template>
  </view>
</template>
<script>
import { action_report } from "@/utils/track";
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    petId: {
      type: String,
      default: "",
    },
  },
  methods: {
    goDetail() {
      if (this.type == "QU_CHONG") {
        action_report({
          action_name: "petfiles_healthy_deworm_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      } else if (this.type == "MEI_XI") {
        action_report({
          action_name: "petfiles_healthy_washing_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      } else if (this.type == "YI_MIAO") {
        action_report({
          action_name: "petfiles_healthy_vaccines_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      } else if (this.type == "TI_JIAN") {
        action_report({
          action_name: "petfiles_healthy_phyexam_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      }
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/recordALL/index?activetype=${this.type}&petId=${this.petId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call(
        "goPetRecordHistoryPage",
        JSON.stringify({
          petId: this.petId,
          tabMark: this.type,
        })
      );
      // #endif
    },
    goRecord() {
      this.$emit("goRecord", this.petId);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";

.itemcontent {
  padding: 31rpx 27rpx 23rpx 31rpx;
  background-color: #ffffff;
  border-radius: 23rpx;
  width: 692rpx;
  margin: 0 auto 23rpx;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 31rpx;

    .leftwrap {
      flex: 1;
      display: flex;
      align-items: center;

      .icon {
        width: 38rpx;
        height: 38rpx;
        margin-right: 10rpx;
      }

      .QU_CHONG_title {
        font-weight: bold;
        @include textfclaw(31rpx, #937cfc, $align: left, $lineH: 42rpx);
      }

      .MEI_XI_title {
        font-weight: bold;
        @include textfclaw(31rpx, #ff567b, $align: left, $lineH: 42rpx);
      }

      .YI_MIAO_title {
        font-weight: bold;
        @include textfclaw(31rpx, #eb38b9, $align: left, $lineH: 42rpx);
      }

      .TI_JIAN_title {
        font-weight: bold;
        @include textfclaw(31rpx, #21c599, $align: left, $lineH: 42rpx);
      }

      .QU_CHONG_icon {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/qvchongicon.png"
        );
      }

      .MEI_XI_icon {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/meixiicon.png"
        );
      }

      .YI_MIAO_icon {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/yimiaoicon.png"
        );
      }

      .TI_JIAN_icon {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/tijianicon.png"
        );
      }
    }

    .rightwrap {
      margin-left: auto;
      @include flex();
      @include textfclaw(23rpx, #666666, $align: left, $lineH: 31rpx);

      .tipicon {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/tipicon.png"
        );
        width: 31rpx;
        height: 31rpx;
        margin-right: 4rpx;
      }
    }
  }

  .empty-record {
    margin-top: 67rpx;
    margin-bottom: 54rpx;
    .emptytext {
      @include textfclaw(27rpx, #666666, $align: center, $lineH: 38rpx);
    }
    .gorecordBtn {
      width: 227rpx;
      height: 73rpx;
      background: #fee900;
      border-radius: 37rpx;
      @include textfclaw(27rpx, #1f1f1f, $align: center, $lineH: 38rpx);
      @include flex();
      margin: 19rpx auto 0;
      font-weight: bold;
    }
  }

  .titledesc {
    @include textfclaw(25rpx, #333333, $align: left, $lineH: 35rpx);
    margin-bottom: 12rpx;
  }

  .daygo {
    @include textfclaw(25rpx, #666666, $align: left, $lineH: 35rpx);
    display: flex;
    margin-bottom: 19rpx;
    // align-items: center;

    .daynnum {
      font-size: 69rpx;
      line-height: 75rpx;
      color: #1f1f1f;
      font-weight: bold;
      font-family: "D-DIN, D-DIN";
      margin-right: 10rpx;
    }
    .unit {
      margin-top: 27rpx;
    }
  }

  .suggest {
    @include textfclaw(25rpx, #1f1f1f, $align: left, $lineH: 31rpx);
    font-weight: bold;
    padding-bottom: 19rpx;
  }

  .bottom {
    border-top: 2rpx solid #e6e6e6;
    padding-top: 19rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include textfclaw(25rpx, #666666, $align: left, $lineH: 35rpx);

    .viewbtn {
      display: flex;
      align-items: center;

      .rightarrow {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/expandicon.png"
        );
        width: 23rpx;
        height: 23rpx;
      }
    }
  }
}
</style>
