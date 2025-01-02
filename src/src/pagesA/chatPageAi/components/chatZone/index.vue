<template>
  <view class="wrapper">
    <view class="input-wrapper" :class="{ andTop: isAnd }">
      <view class="text-card" :class="{ andCard: isAnd }">
        <textarea
          :adjust-position="!isAnd"
          class="input"
          :show-confirm-bar="false"
          auto-height="true"
          maxlength="500"
          confirm-type="send"
          @confirm="sendMessText"
          confirm-hold="true"
          v-model="inputValue"
          @input="handleChange"
          placeholder="有问题尽管问我"
        />
      </view>
      <view class="send-button" @click="sendMessText"></view>
    </view>
    <!-- <u-safe-bottom></u-safe-bottom> -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import {
  ConversationType as RYConversationType,
  TextMessage as RYTextMessage,
  sendMessage as RYsendMessage,
  ErrorCode as RYErrorCode,
  ImageMessage as RYImageMessage,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { mapState, mapMutations } from "vuex";
import { handleLastMes } from "@/pagesA/components/rongyunCloud/ryConnect";
export default {
  components: {},
  props: {
    groupId: {
      type: String,
    },
    isPageEmojiHalf: {
      type: Boolean,
    },
  },
  data() {
    return {
      inputValue: "",
      keyboardHeight: "",
      isShowEmoji: false,
      // photoShow: false,
      isEmojiContent: false,
      emojiList: [],
      qiniuyunToken: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      isChooseImage: (state) => state.isChooseImage,
    }),
    isAnd() {
      return uni.$u.os() === "android";
    },
  },
  mounted() {
    const RongEmoji = require("./libs/RongEmoji-2.2.10.js");
    var emojiConfig = {
      size: 50,
    };
    RongEmoji.init(emojiConfig);
    var list = RongEmoji.list;
    this.emojiList = list;
    uni.onKeyboardHeightChange((res) => {
      this.keyboardHeight = res.height;
      if (res.height) {
        //呼起键盘，此时要关闭表情看板
        this.isShowEmoji = false;
        // this.$emit("handleEmojiPanel", false);
      }
      this.$emit("keyBoardActive", res.height);
    });
    // this.uploadQN(
    //   "http://tmp/z2XU6XqmnCsOff7123412163ce8e719ce34599a834d5.mp4"
    // );
  },
  watch: {
    isPageEmojiHalf: {
      handler: function (newV) {
        if (!newV) {
          //关闭表情看板
          this.isShowEmoji = false;
          // this.$emit("handleEmojiPanel", false);
        }
      },
    },
  },
  methods: {
    ...mapMutations(["setIsChooseImage"]),
    handleChange(e) {
      uni
        .createSelectorQuery()
        .in(this)
        .select(".input")
        .boundingClientRect((result) => {
          if (result) {
            this.$emit("heightChange", result);
          }
        })
        .exec();
    },
    sendMessText() {
      uni.hideKeyboard();
      if (!this.inputValue.length) {
        return;
      }
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };

      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      const message1 = new RYTextMessage({
        // 文本内容
        content: this.inputValue,
        extra: JSON.stringify({ nickName: this.userInfo.nickName }),
      });
      let options;
      RYsendMessage(conversation, message1, options).then((res) => {
        // 发送完成后，问诊单最后一条消息 更新
        handleLastMes({
          groupId: this.groupId,
          mes: res.data,
          type: "newMes",
        });

        if (res.code === RYErrorCode.SUCCESS) {
          // 消息发送成功，可以根据返回结果中的 messageId 字段将列表中的该消息状态改为发送成功。
          // console.log("消息发送成功", res.data);
          let data = res.data;
          this.$emit("sendSuccess", {
            content: { content: data?.content.content },
            messageType: data.messageType,
            userAvatarUrl: this.userInfo.avatarUrl,
            sentTime: data.sentTime,
            direction: data.messageDirection,
            messageUId: data.messageUId,
            state: 1,
          });
          this.inputValue = "";
          //文本信息添加到当前的message列表内，已经保存了groupid
        } else {
          // message.error("消息发送失败");
        }
      });
    },
    sendMessImg(imgUrl, base64) {
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      const message1 = new RYImageMessage({
        content: base64, // 图片缩略图，应为 Base64 字符串，且不可超过 80KB
        imageUri: imgUrl, // 图片的远程访问地址
      });
      let options;
      RYsendMessage(conversation, message1, options).then((res) => {
        if (res.code === RYErrorCode.SUCCESS) {
          // 消息发送成功，可以根据返回结果中的 messageId 字段将列表中的该消息状态改为发送成功。
          let data = res.data;
          // console.log(data);

          // 发送完成后，问诊单最后一条消息 更新
          handleLastMes({
            groupId: this.groupId,
            mes: res.data,
            type: "newMes",
          });
          this.$emit("sendSuccess", {
            content: {
              content: data?.content.content,
              imageUri: data?.content.imageUri,
            },
            messageType: data.messageType,
            userAvatarUrl: this.userInfo.avatarUrl,
            sentTime: data.sentTime,
            direction: data.messageDirection,
            messageUId: data.messageUId,
            state: 1,
          });
          //文本信息添加到当前的message列表内，已经保存了groupid
        } else {
          // message.error("消息发送失败");
        }
      });
    },
    handleEmojiPanel(type) {
      if (type == "emoji") {
        this.isEmojiContent = true;
      } else {
        this.isEmojiContent = false;
      }
      if (this.keyboardHeight) {
        //键盘唤起状态，一定是打开看板
        this.isShowEmoji = true;
        this.$emit("handleEmojiPanel", true);
      } else {
        //键盘关闭时
        if (this.isShowEmoji) {
          //当前是显示看板状态
        } else {
          this.isShowEmoji = !this.isShowEmoji;
          // this.$emit("handleEmojiPanel", this.isShowEmoji);
        }
      }
    },
    deleteContent() {
      if (this.inputValue.length) {
        console.log(this.inputValue);
      }
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
