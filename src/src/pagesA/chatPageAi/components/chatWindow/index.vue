<template>
  <scroll-view
    class="wrapper"
    id="chat-window"
    scroll-y="true"
    :scroll-into-view="scrollToView"
    :refresher-enabled="hasMore"
    :refresher-triggered="triggered"
    @refresherrefresh="myPullDownRefresh"
    @scroll="handleScroll"
    :scroll-top="scrollTop"
    :scroll-anchoring="true"
  >
    <!-- :scroll-top="scrollTop" -->
    <view
      v-if="chatMessage.length"
      :style="{
        '-webkit-overflow-scrolling': scrollFlag ? 'auto' : 'touch',
        '-webkit-backface-visibility': 'hidden',
        '-webkit-transform': 'translateZ(0rpx)',
      }"
    >
      <view
        v-for="(item, index) in chatMessage"
        :key="item.messageUId"
        :id="'msg' + item.sentTime"
      >
        <!-- &&
            !(
              item.messageType == 'RCAiCutePetChatMsg' &&
              JSON.parse(item.content.message).msgType ==
                'AI_MICRO_CHAT_HOT_PROBLEM'
            ) -->
        <view
          class="timeInfo"
          v-if="
            index > 2 &&
            item.sentTime - chatMessage[index - 1].sentTime > 180000
          "
        >
          {{
            item.messageType == "RCAiCutePetChatMsg" &&
            JSON.parse(item.content.message).msgType ==
              "AI_MICRO_CHAT_HOT_PROBLEM"
              ? ""
              : initTime(item.sentTime)
          }}
        </view>
        <view class="timeInfo" v-if="index == 0">
          {{
            item.messageType == "RCAiCutePetChatMsg" &&
            JSON.parse(item.content.message).msgType ==
              "AI_MICRO_CHAT_HOT_PROBLEM"
              ? ""
              : initTime(item.sentTime)
          }}
        </view>
        <!-- 文字信息 -->
        <view
          class="left-mes"
          v-if="item.messageType == 'RC:TxtMsg' && item.direction == 2"
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body left-text">
            <view v-html="item.content.content"></view>
          </view>
        </view>
        <view
          class="right-mes"
          v-if="item.messageType == 'RC:TxtMsg' && item.direction == 1"
        >
          <view class="right-body right-text">
            <view v-html="item.content.content"></view>
          </view>
          <view class="right-ava"><image :src="avatarUrl" alt="" /></view>
        </view>
        <!-- AI文字消息 -->
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCAiCutePetChatMsg' &&
            item.direction == 2 &&
            JSON.parse(item.content.message).msgType == 'INTELLIGENT_QA'
          "
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body left-text">
            <view
              v-html="
                handleTxtMsgToHtml(JSON.parse(item.content.message).content)
              "
            >
            </view>
            <view
              class="can-like-zone"
              v-if="item.expansion && item.expansion.canLike"
            >
              <view class="to-choose" v-if="item.expansion.state == '0'">
                <view
                  class="top"
                  @click="
                    () => {
                      handlePraise(item, 'tolike');
                    }
                  "
                  ><image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/tolike.png"
                    mode="scaleToFill"
                /></view>
                <view
                  class="bottom"
                  @click="
                    () => {
                      handlePraise(item, 'tounlike');
                    }
                  "
                >
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/tounlike.png"
                    mode="scaleToFill"
                  />
                </view>
              </view>
              <view class="liked" v-if="item.expansion.state == '1'">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/liked.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="unliked" v-if="item.expansion.state == '2'">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/unliked.png"
                  mode="scaleToFill"
                />
              </view>
            </view>
          </view>
        </view>
        <!-- AI文字消息带动效 -->
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCAiCutePetChatMsg' &&
            item.direction == 2 &&
            JSON.parse(item.content.message).msgType == 'LOADING'
          "
        >
          <view :class="['left-ava', item.isNewMessage ? 'ani-opa' : '']"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <!--  -->
          <view
            class="left-body left-text"
            v-if="item.expansion && item.expansion.answer == undefined"
          >
            <image
              class="loading-img"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/loading-3.png"
              mode="scaleToFill"
            />
            <view
              :class="['loading-text', item.isNewMessage ? 'ani-thinking' : '']"
              >豚豚正在思考中</view
            >
            <view
              style="
                height: 27rpx;
                position: absolute;
                width: 1rpx;
                left: 0;
                top: 150rpx;
              "
            ></view>
          </view>
          <view
            class="left-body left-text"
            :class="[item.isNewMessage ? 'scale-in-tl' : '']"
            v-if="item.expansion && item.expansion.answer"
          >
            <view v-html="handleTxtMsgToHtml(item.expansion.answer)"></view>
            <view
              class="can-like-zone"
              v-if="item.expansion && item.expansion.canLike"
            >
              <view class="to-choose" v-if="item.expansion.state == '0'">
                <view
                  :class="[
                    'top',
                    item.isNewMessage ? 'slide-in-fwd-center' : '',
                  ]"
                  @click="
                    () => {
                      handlePraise(item, 'tolike');
                    }
                  "
                  ><image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/tolike.png"
                    mode="scaleToFill"
                /></view>
                <view
                  :class="[
                    'bottom',
                    item.isNewMessage ? 'slide-in-fwd-center-1' : '',
                  ]"
                  @click="
                    () => {
                      handlePraise(item, 'tounlike');
                    }
                  "
                >
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/tounlike.png"
                    mode="scaleToFill"
                  />
                </view>
              </view>
              <view class="liked" v-if="item.expansion.state == '1'">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/liked.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="unliked" v-if="item.expansion.state == '2'">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/unliked.png"
                  mode="scaleToFill"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 顶部置顶消息 -->
        <view
          class="top-cmd"
          v-if="
            item.messageType == 'RCAiCutePetChatMsg' &&
            JSON.parse(item.content.message).msgType ==
              'AI_MICRO_CHAT_HOT_PROBLEM'
          "
        >
          <view class="top-special">
            <view
              :class="['pet', chatMessage.length == 1 ? 'slide-in-bottom' : '']"
            ></view>
            <view class="hi"></view>
            <Typer
              v-if="chatMessage.length == 1"
              class="typer slide-in-bottom1"
              content="豚豚终于见到你啦😊 ～"
              speed="30"
            >
            </Typer>
            <view class="typer" v-else>豚豚终于见到你啦😊 ～</view>
            <view
              :class="[
                'bottom-text',
                chatMessage.length == 1 ? 'slide-in-bottom2' : '',
              ]"
            ></view>
          </view>
          <view class="bottom-wrapper">
            <view
              :class="[
                'left-wrapper',
                chatMessage.length == 1 ? 'slide-in-bottom3' : '',
              ]"
            >
              <view class="title">
                <view class="left"></view>
                <view
                  class="change"
                  @click="
                    () => {
                      changeQuestion(item.messageUId);
                    }
                  "
                ></view>
                <view
                  class="right"
                  @click="
                    () => {
                      changeQuestion(item.messageUId);
                    }
                  "
                  >换一批</view
                >
              </view>
              <view class="question-wrapper">
                <view
                  class="ques-item"
                  v-for="(itemchild, indexchild) in hotPloblemsInAi[
                    hotPloblemsIndexInAi[item.messageUId]
                  ]"
                  :key="indexchild"
                  @click="
                    () => {
                      sendMessText(itemchild);
                    }
                  "
                >
                  <view class="content">{{ itemchild }}</view>
                  <view class="right-arrow"></view>
                  <view class="border" v-if="indexchild !== 3"></view>
                </view>
              </view>
            </view>
            <view
              :class="[
                'right-wrapper',
                chatMessage.length == 1 ? 'slide-in-bottom4' : '',
              ]"
              @click="
                () => {
                  sendMessText('人工问诊');
                }
              "
            >
              <view class="title"> </view>
              <view class="text"> 多年临床经验的兽医来帮您的爱宠看病 </view>
              <view class="bottom-pic"></view>
            </view>
          </view>
          <view style="height: 23rpx"></view>
        </view>
        <!-- AI进入人工问诊 -->
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCAiCutePetChatMsg' &&
            item.direction == 2 &&
            JSON.parse(item.content.message).msgType == 'ARTIFICIAL_INQUIRY'
          "
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body">
            <view>进入人工问诊前，请先</view>
            <view style="color: #2dce80" @click="handleStartQuick"
              >选择或完善宠物信息</view
            >
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { initTime } from "@/utils/index.js";
import { mapState, mapMutations } from "vuex";
// import * as RongIMLib from "@rongcloud/imlib-next";
import {
  ConversationType as RYConversationType,
  TextMessage as RYTextMessage,
  sendMessage as RYsendMessage,
  updateMessageExpansion as RYupdateMessageExpansion,
  ErrorCode as RYErrorCode,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { handleLastMes } from "@/pagesA/components/rongyunCloud/ryConnect";
import { CHAT_AIQUEST_CARD_CLICK_UPLOAD } from "@/api";
import { AI_PRAISE } from "@/api/chat";
import Typer from "../typer/index.vue";
export default {
  components: {
    Typer,
  },
  props: {
    sheetState: {
      type: Number,
    },
    chatMessage: {
      type: Array,
    },
    keyBoardHeight: {
      type: Number,
    },
    hasMore: {
      type: Boolean,
    },
    groupId: {
      type: String,
    },
    aiHotProblems: {
      type: Array,
    },
    aiHotProblemsIndex: {
      type: Object,
    },
    groupId: {
      type: String,
    },
  },
  data() {
    return {
      avatarUrl: "",
      scrollToView: "msg0",
      scrollComponent: null,
      // 初始化赋值一次
      // lastMesSentTimeLocal: this.lastMesSentTime,
      lastMesSentTimeLocal: "",
      triggered: false,
      scrollFlag: false,
      timer_dm: null,
      scrollTop: 0,
      hotPloblemsInAi: [],
      hotPloblemsIndexInAi: {},
      lockScreen: false,
      myPullDownRefreshLock: false,
    };
  },
  created() {},
  mounted() {
    this.avatarUrl = this.userInfo.avatarUrl;
    this.$nextTick(() => {
      this.scrollTop = 20;
    });
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      lastMesSentTime: (state) => state.lastMesSentTime,
      isChooseImage: (state) => state.isChooseImage,
    }),
  },
  methods: {
    ...mapMutations(["setIsChooseImage"]),
    initTime,
    myPullDownRefresh() {
      console.log("检测到到顶", this.hasMore);
      var that = this;
      this.triggered = true;
      this.$emit("scrolltoupper");
      setTimeout(function () {
        that.triggered = false;
      }, 1000);
    },
    handleScroll(e) {
      // 第一次进入时要手动触发myPullDownRefresh
      if (!this.myPullDownRefreshLock) {
        if (e.target.scrollTop == 0) {
          this.$emit("scrolltoupper");
          this.myPullDownRefreshLock = true;
        }
      }
      this.lockScreen = false;
      if (this.scrollFlag) {
        this.scrollFlag = false;
        return;
      }
      // this.scrollTop = e.detail.scrollTop;
      //开始滚动时，-webkit-overflow-scrolling:auto
      // this.scrollFlag = false;
      clearTimeout(this.timer_dm);
      this.timer_dm = setTimeout(() => {
        this.scrollFlag = true;
        // this.scrollTop = e.detail.scrollTop + 1;
      }, 200);
    },

    diagnosisDetails(item) {
      console.log("diagnosisDetails ==", item);
      uni.navigateTo({
        url: `/pagesA/electronPrescription/index?id=${item.consultationSheetId}`,
      });
    },
    changeQuestion(uid) {
      // console.log(this.hotPloblemsIndexInAi[uid]);
      if (this.hotPloblemsIndexInAi[uid] < 3) {
        this.$set(
          this.hotPloblemsIndexInAi,
          uid,
          ++this.hotPloblemsIndexInAi[uid]
        );
        // console.log(this.hotPloblemsIndexInAi, this.hotPloblemsInAi);
      } else if (this.hotPloblemsIndexInAi[uid] == 3) {
        this.$set(this.hotPloblemsIndexInAi, uid, 0);
      }
    },
    // 智能卡片点击交互
    aiQuestCardDidSelect(item, index, title) {
      console.log("aiQuestCardDidSelect ==", item);
      console.log("messageUId ==", item.messageUId);
      console.log("index == ", index.toString());
      console.log("grouoId == ", this.groupId);
      if (this.sheetState != 1) {
        return;
      }
      let expansion = { optionIndex: index.toString() };
      // 更新消息
      RYupdateMessageExpansion(expansion, item).then((res) => {
        if (res.code === 0) {
          let data = res.data;
          console.log(res.code, "更新成功");
          this.$emit("updateSuccess", item, {
            ...item,
            expansion: expansion,
          });
        } else {
          console.log(res.code, res.msg);
        }
      });

      // 发送新消息
      let options;
      let conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      const newMessage = new RYTextMessage({
        content: title,
        extra: "文本消息",
      });
      RYsendMessage(conversation, newMessage, options)
        .then((res) => {
          console.log(res);
          if (res.code === RYErrorCode.SUCCESS) {
            console.log(res);
            let data = res.data;
            // 发送完成后，问诊单最后一条消息 更新
            handleLastMes({
              groupId: this.groupId,
              mes: res.data,
              type: "newMes",
            });
            // 消息发送成功回调显示。
            this.$emit("sendSuccess", {
              content: {
                content: data?.content.content, //base64
                sightUrl: data?.content.sightUrl,
              },
              messageType: data.messageType,
              userAvatarUrl: item.avatarUrl,
              sentTime: data.sentTime,
              direction: data.messageDirection,
              messageUId: data.messageUId,
              state: this.sheetState,
            });
          } else {
            console.log("消息发送失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // 上报服务
      CHAT_AIQUEST_CARD_CLICK_UPLOAD({
        optionIndex: index.toString(),
        questionCardUsageRecordId: JSON.parse(
          JSON.parse(item.content.message).content
        ).questionCardUsageRecordId,
        questionScriptUsageRecordId: JSON.parse(
          JSON.parse(item.content.message).content
        ).questionScriptUsageRecordId,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //人工问诊，选择问题交互 11.20更新 关闭人工问诊功能
    sendMessText(content) {
      if (content == "人工问诊") {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
        return;
      }

      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };

      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      const message1 = new RYTextMessage({
        // 文本内容
        content,
        extra: JSON.stringify({ nickName: this.userInfo.nickName }),
      });
      let options;
      RYsendMessage(conversation, message1, options).then((res) => {
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
          //文本信息添加到当前的message列表内，已经保存了groupid
        } else {
          // message.error("消息发送失败");
          uni.showToast({
            title: "发送失败",
          });
        }
      });
    },
    // 发起人工问诊 //11.20更新 关闭人工问诊功能
    handleStartQuick() {
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      // this.$emit("handleStartQuick");
    },
    //点赞交互
    handlePraise(item, type) {
      this.lockScreen = true;
      let expansion = {
        ...item.expansion,
        state: type == "tolike" ? "1" : "2",
      };
      // 接口触发
      AI_PRAISE({
        msgId: expansion.msgId,
        like: type == "tolike" ? true : false,
      }).then((res) => {
        // 更新消息
        RYupdateMessageExpansion(expansion, item).then((res) => {
          if (res.code === 0) {
            let data = res.data;
            console.log(res.code, "更新成功");
            this.$emit("updateSuccess", item, {
              ...item,
              expansion: expansion,
            });
          } else {
            console.log(res.code, res.msg);
          }
        });
      });
      setTimeout(() => {
        this.lockScreen = false;
      }, 500);
    },
    // 换行符处理
    handleTxtMsgToHtml(content) {
      content = content.replace(/\n/g, (lineStr) => {
        return lineStr.slice(1) + "<br />";
      });

      return content;
    },
  },
  watch: {
    chatMessage: {
      handler(newV, oldV) {
        if (newV.length) {
          if (uni.getStorageSync("lastMesSentTime") !== newV[0].sentTime) {
            console.log("进入不等条件", newV);
            //说明是下拉了
            this.triggered = false;
            this.scrollToView = "msg" + uni.getStorageSync("lastMesSentTime");
            uni.setStorageSync("lastMesSentTime", newV[0].sentTime);
            return;
          }
          // 如果点赞状态，不允许滚动
          if (this.lockScreen) return;
          this.scrollToView = "";
          this.$nextTick(() => {
            this.scrollToView =
              "msg" + this.chatMessage[this.chatMessage.length - 1].sentTime;
          });
        }
      },
      deep: true,
      // immediate: true,
    },

    keyBoardHeight: function (newV, oldV) {
      if (!this.scrollFlag) {
        return;
      }
      if (newV !== oldV) {
        this.scrollToView = "";
        this.$nextTick(() => {
          this.scrollToView =
            "msg" + this.chatMessage[this.chatMessage.length - 1].sentTime;
        });
      }
    },
    aiHotProblems: function (newV, oldV) {
      let result = [];
      let length = newV.length;
      for (let i = 0; i < length; i += 4) {
        result.push(newV.slice(i, i + 4));
      }
      // this.$set(this.hotPloblemsInAi, result);
      this.hotPloblemsInAi = result;
    },
    aiHotProblemsIndex: function (newV, oldV) {
      // this.$set(this.hotPloblemsIndexInAi, newV);
      this.hotPloblemsIndexInAi = newV;
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
