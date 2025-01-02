<template>
  <view>
    <view
      class="notice-wrapper"
      :style="{
        bottom: safeAreaBottom,
      }"
      v-if="
        lastMesInfo['PRESCRIPTION'].id ||
        (!lastMesInfo['PRESCRIPTION'].id && lastMesInfo['NEWCHAT'].id)
      "
    >
      <template
        v-if="lastMesInfo['PRESCRIPTION'].id && lastMesInfo['NEWCHAT'].id"
      >
        <template
          v-if="lastMesInfo['PRESCRIPTION'].time > lastMesInfo['NEWCHAT'].time"
        >
          <view class="notice">
            <view class="notice-left">
              <view class="close" @click="closeNotice(lastMesInfo)">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/shutDown.png"
                />
              </view>
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/medical_home_bell_icon.png"
                mode="scaleToFill"
                class="avatar"
              />
              <view
                class="msg"
                @click="viewNotice(lastMesInfo['PRESCRIPTION'])"
                >{{ lastMesInfo["PRESCRIPTION"].content }}</view
              >
            </view>

            <view
              class="go-detailbtn"
              @click="viewNotice(lastMesInfo['PRESCRIPTION'])"
              >去查看</view
            >
          </view>
        </template>
        <template v-else>
          <view class="notice">
            <view class="notice-left">
              <view class="close" @click="closeMsg(lastMesInfo)">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/shutDown.png"
                  mode="center"
                />
              </view>
              <image
                :src="lastMesInfo['NEWCHAT'].doctorAvatarUrl"
                mode="scaleToFill"
                class="avatar"
              />
              <view class="msg" @click="continueSheet"
                >在线医生{{
                  lastMesInfo["NEWCHAT"].doctorUserName
                }}医生有新回复~</view
              >
            </view>
            <view class="go-detailbtn" @click="continueSheet">去查看</view>
          </view>
        </template>
      </template>
      <template
        v-if="lastMesInfo['PRESCRIPTION'].id && !lastMesInfo['NEWCHAT'].id"
      >
        <view class="notice">
          <view class="notice-left">
            <view class="close" @click="closeNotice(lastMesInfo)">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/shutDown.png"
              />
            </view>
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/medical_home_bell_icon.png"
              mode="scaleToFill"
              class="avatar"
            />
            <view
              class="msg"
              @click="viewNotice(lastMesInfo['PRESCRIPTION'])"
              >{{ lastMesInfo["PRESCRIPTION"].content }}</view
            >
          </view>
          <view
            class="go-detailbtn"
            @click="viewNotice(lastMesInfo['PRESCRIPTION'])"
            >去查看</view
          >
        </view>
      </template>
      <template
        v-if="!lastMesInfo['PRESCRIPTION'].id && lastMesInfo['NEWCHAT'].id"
      >
        <view class="notice">
          <view class="notice-left">
            <view class="close" @click="closeMsg(lastMesInfo)">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/home/shutDown.png"
              />
            </view>
            <image
              :src="lastMesInfo['NEWCHAT'].doctorAvatarUrl"
              mode="scaleToFill"
              class="avatar"
            />
            <view class="msg" @click="continueSheet"
              >在线医生{{
                lastMesInfo["NEWCHAT"].doctorUserName
              }}医生有新回复~</view
            >
          </view>
          <view class="go-detailbtn" @click="continueSheet">去查看</view>
        </view>
      </template>
    </view>
    <view
      class="bottom-mask"
      :style="{
        height: safeAreaBottom,
      }"
      v-if="
        lastMesInfo['PRESCRIPTION'].id ||
        (!lastMesInfo['PRESCRIPTION'].id && lastMesInfo['NEWCHAT'].id)
      "
    ></view>
  </view>
</template>

<script>
import { action_report, display_report } from "@/utils/track";
import { CHANGE_NOTICE } from "@/api";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
// import {
//   ConversationType as RYConversationType,
//   clearMessagesUnreadStatus as RYclearMessagesUnreadStatus,
//   sendSyncReadStatusMessage as RYsendSyncReadStatusMessage,
// } from "@rongcloud/imlib-next";
import { mapMutations, mapState } from "vuex";
const module_name = "medical";
export default {
  name: "FloatingNotice",
  props: {},
  data() {
    return {
      safeAreaBottom: getApp().globalData.bottomSafeAreaHeight + "px",
    };
  },
  computed: {
    ...mapState(["lastMesInfo"]),
  },
  methods: {
    ...mapMutations(["setlastMessInfo", "setLastSheetsMessage"]),
    //查看处方消息通知
    async viewNotice(item) {
      if (item.fromtype == 2) {
        action_report({
          action_name: "consultation_main_message_clk",
          module_name: module_name,
          extend: {
            type: "PRESCRIPTION_NOTICE",
          },
        });
      } else {
        action_report({
          action_name: "consultation_main_message_clk",
          module_name: module_name,
          extend: {
            type: "PRESCRIPTION_EXPIRED_PRE_NOTICE",
          },
        });
      }
      const { data } = await CHANGE_NOTICE(item.id, "VIEWED");
      if (data) {
        this.setlastMessInfo({});
        // this.$set(this.lastMesInfo["PRESCRIPTION"], "id", "");
      }
      //跳转电子处方笺
      uni.navigateTo({
        url: `/pagesA/electronPrescription/index?id=${item.consultationSheetId}`,
      });
    },
    //进入已有问诊单
    async continueSheet() {
      action_report({
        action_name: "consultation_main_message_clk",
        module_name: module_name,
        extend: {
          type: "NEW_CHAT",
        },
      });
      const res = await GET_IN_SERVICE_LAST({});
      const {
        groupId,
        remainingTime,
        doctorAvatarUrl,
        doctorUserName,
        state,
        remainingWaitingTime,
        id,
        inquiryType,
      } = res.data;
      let result = {
        groupId,
        remainingTime,
        remainingWaitingTime,
        doctorAvatarUrl,
        doctorUserName,
        sheetState: state,
        id,
        inquiryType,
      };
      uni.navigateTo({
        url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
          result
        )}&fromOrigin=continue&inquiryType=${res.data.inquiryType}`,
      });
    },
    //关闭
    async closeNotice(msg) {
      const itemId = msg["PRESCRIPTION"].id;
      console.log("closeNotice:", msg);
      console.log("closeNotice:", itemId);
      console.log(`pet-medical-inquiry/v1/notice/${itemId}/VIEWED/status`);
      const { data } = await CHANGE_NOTICE(itemId, "VIEWED");
      console.log("CHANGE_NOTICE:", data);
      if (data) {
        this.setlastMessInfo({});
      }
    },
    async closeMsg(msg) {
      // const lastMsg = msg["NEWCHAT"];
      // console.log("closeMsgcloseMsg:", lastMsg);
      // const res = await GET_IN_SERVICE_LAST({});
      // console.log("closeMsgcloseMsg-res:", res);
      // const { groupId } = res.data;
      // const options = {
      //   conversationType: RYConversationType.GROUP,
      //   targetId: groupId,
      // };
      // console.log("closeMsgcloseMsgoptions-options:", options);
      // // 将消息变为已读
      // RYclearMessagesUnreadStatus(options).then((res) => {
      //   console.log("clearMessagesUnreadStatus-res:", res);
      //   if (res.code === 0) {
      //     // console.log(res.code);
      //     // 发送多端同步未读数消息
      //     RYsendSyncReadStatusMessage(options, Date.now()).then(() => {});
      //     console.log("closeMsg:", this.lastMesInfo);
      //     // this.$set(this.lastMesInfo["NEWCHAT"], "id", "");
      //     this.setlastMessInfo({});
      //     console.log("closeMsg111:", this.lastMesInfo);
      //     this.setLastSheetsMessage({
      //       ["unreadMessageCount"]: 0,
      //     });
      //   } else {
      //     console.log(res.code, res.msg);
      //   }
      // });
    },
  },
};
</script>

<style lang="scss">
.notice-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  height: 96rpx;
  display: flex;
  align-items: center;
  .notice {
    width: 100%;
    height: 96rpx;
    background: #ffd41e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 13rpx;
    padding-right: 16rpx;
    border-radius: 23rpx 23rpx 0 0;

    &-left {
      display: flex;
      align-items: center;
      .close {
        padding: 3rpx 15rpx 5rpx 5rpx;
        image {
          width: 17rpx;
          height: 17rpx;
        }
      }
      .avatar {
        width: 58rpx;
        height: 58rpx;
        border-radius: 50%;
        margin-right: 12rpx;
        border: 2rpx solid #ffffff;
        image {
          border-radius: 50%;
        }
      }
      .msg {
        width: 490rpx;
        padding-top: 4rpx;
        font-size: 25rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #1f1f1f;
        line-height: 35rpx;
      }
    }

    .go-detailbtn {
      display: flex;
      width: 113rpx;
      height: 50rpx;
      background: #ffffff;
      border-radius: 25rpx;
      font-size: 25rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: bold;
      color: #1f1f1f;
      line-height: 35rpx;
      text-align: center;
      justify-content: center;
      align-items: center;
    }
  }
}
.bottom-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 750rpx;
  background-color: #fff;
}
</style>
