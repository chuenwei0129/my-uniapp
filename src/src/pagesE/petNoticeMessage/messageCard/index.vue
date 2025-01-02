<template>
  <view class="message-item">
    <view class="message-title-view">
      <image
        class="message-icon"
        v-show="isPetNoticeMsg"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/peiInfo/ic_pet_notice.png"
        mode="aspectFill"
      ></image>
      <image
        class="message-icon"
        v-show="isServerMsg"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/peiInfo/ic_service_notice.png"
        mode="aspectFill"
      ></image>

      <text class="message-title">
        {{ isPetNoticeMsg ? "养宠提醒" : "服务通知" }}</text
      >

      <text class="message-time"> {{ message.createTimeDisplay }}</text>
    </view>

    <view class="message-line" />

    <view class="message-row-data">
      <image
        class="message-image-con-pet"
        v-show="isPetNoticeMsg"
        :src="picture"
        mode="aspectFill"
      ></image>
      <image
        class="message-image-con-store"
        v-show="isServerMsg"
        :src="picture"
        mode="aspectFill"
      ></image>
    </view>

    <text class="message-con-text">
      {{
        isPetNoticeMsg ? message.messageBody.message : message.messageBody.title
      }}</text
    >

    <view
      class="message-row"
      :style="{ marginTop: '40rpx' }"
      v-if="isPetNoticeMsg"
    >
      <text class="message-bottom-text-tip"> 提醒时间：</text>
      <text class="message-bottom-text-con">
        {{ message.messageBody.remindTime }}</text
      >
    </view>

    <view
      class="message-row"
      :style="{ marginTop: '20rpx' }"
      v-if="isPetNoticeMsg"
    >
      <text class="message-bottom-text-tip"> 重复周期：</text>
      <text class="message-bottom-text-con"> {{ circle() }}</text>
    </view>

    <view v-show="isServerMsg" :style="{ marginTop: '40rpx' }">
      <text class="message-bottom-text-tip">
        {{ message.messageBody.message }}</text
      >
    </view>
  </view>
</template>

<script>
import GoodsPrice from "@/components/goodsPrice/index.vue";

export default {
  name: "goodsCard",
  props: {
    message: {
      type: Object,
      default: {
        messageType: "", //"RAISING_PET",
        messageCategory: "", // "PETS_PLAN",
        messageBody: {
          message: "", //"喵喵的美洗服务已完成，赶紧领回家吧~",
          cycleType: "", //"DAY",  //ONCE-仅一次， DAY-天，Week-周，Month-月，Year-年
          cyclePeriod: "", //"10",
          remindTime: "", //"",
          avatarUrl: "", //"http://",
          title: "", //"美洗服务已完成",
          storeName: "", //"", //门店名称
          storeImage: "", //"http" //门店图片
        },
        createTimeDisplay: "", //"今天"
      },
    },
  },
  components: {
    GoodsPrice,
  },

  methods: {
    circle() {
      let str = "";
      switch (this.message.messageBody.cycleType) {
        case "ONCE":
          str = "仅一次";
          break;
        case "DAY":
          str = "每天提醒";
          break;
        case "WEEK":
          str = "每周提醒";
          break;
        case "MONTH":
          str = "每月提醒";
          break;
        case "YEAR":
          str = "每年提醒";
          break;
        default:
          str = "每年提醒";
      }
      return str;
    },
  },
  computed: {
    picture() {
      return this.message.messageCategory === "PETS_PLAN"
        ? this.message.messageBody.avatarUrl
        : this.message.messageBody.storeImage;
    },

    isServerMsg() {
      return this.message.messageCategory === "STORE_MSG";
    },
    isPetNoticeMsg() {
      return this.message.messageCategory === "PETS_PLAN";
    },

    titleIcon() {
      return this.message.messageCategory === "PETS_PLAN"
        ? "https://frontend-cdn.chongpangpang.com/image/medical-mp/peiInfo/ic_pet_notice.png"
        : "https://frontend-cdn.chongpangpang.com/image/medical-mp/peiInfo/ic_service_notice.png";
    },
  },
  data() {
    return {};
  },
  mounted() {
    // display_report({
    //   display_name: "shop_selected_commodity_show",
    //   object_type: "shop",
    //   extend: {
    //     commodity_name: this.title
    //   }
    // });
  },
};
</script>

<style scoped lang="scss">
.message-item {
  width: auto;
  position: relative;
  flex-direction: column;
  margin-left: 20rpx;
  margin-top: 20rpx;
  margin-right: 20rpx;
  padding: 24rpx 30rpx 24rpx 30rpx;
  background-color: white;
  border-radius: 16rpx;

  .message-line {
    width: 100%;
    height: 0.5rpx;
    background-color: #efeeee;
    margin-top: 20rpx;
  }

  .message-title-view {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
  }
  .message-icon {
    width: 44rpx;
    height: 44rpx;
    border-radius: 30rpx;
  }

  .message-title {
    color: #666666;
    font-size: 32rpx;
    margin-left: 16rpx;
  }

  .message-time {
    color: #aaaaaa;
    font-size: 24rpx;
    float: right;
    margin-left: auto;
  }

  .message-image-con-store {
    border-radius: 12px;
    width: 120rpx;
    height: 120rpx;
    position: relative;
    margin-top: 28rpx;
  }

  .message-image-con-pet {
    border-radius: 60rpx;
    width: 120rpx;
    height: 120rpx;
    position: relative;
    margin-top: 28rpx;
  }

  .message-con-text {
    color: #333333;
    font-size: 36rpx;
    font-weight: bold;
    margin-top: 20rpx;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .message-bottom-text-tip {
    color: #999999;
    font-size: 24rpx;
  }

  .message-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .message-bottom-text-con {
    color: #666666;
    font-size: 24rpx;
  }

  .message-bottom-margin {
    margin-top: 40rpx;
  }

  .message-bottom-2-margin {
    margin-top: 20rpx;
  }
}
.message-row-data {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
