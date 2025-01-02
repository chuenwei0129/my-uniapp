<template>
  <view class="wapper" v-if="isShowAllSelect">
    <!-- <view class="test" @click="test">test</view> -->
    <u-popup
      :show="show"
      mode="bottom"
      :round="20"
      hight="100px"
      :overlay="noMask"
      :safeAreaInsetBottom="false"
    >
      <!-- 选项框 -->
      <!-- 单选框部分 -->

      <view class="allBox">
        <!-- <view class="allBox"> -->
        <view class="singleBox" v-if="isMultiSelect === false">
          <view
            v-if="quesMessage.questionOptions.length > 2"
            class="yesMore"
            v-for="(item, index) in quesMessage.questionOptions"
            :key="index"
            @click="checkItem(index)"
            :class="{ activeMore: checked === index }"
            >{{ item.option }}</view
          >
          <view
            v-if="quesMessage.questionOptions.length == 2"
            class="yes"
            v-for="(item, index) in quesMessage.questionOptions"
            :key="index"
            @click="checkItem(index)"
            :class="{ active: checked === index }"
            >{{ item.option }}</view
          >
        </view>
        <!-- 多选框部分 -->
        <view class="doubleBox" v-show="isMultiSelect">
          <view class="body">
            <view
              class="quesContent"
              v-for="(item, index) in quesMessage.questionOptions"
              :key="index"
              @click="checkItmeDouble(index, item)"
              :class="{ active: isSelected(index) }"
            >
              <view class="ques-info">
                {{ item.option }}
              </view>
              <view
                class="instructions"
                @click.stop="symptomPopupInterpret(item)"
                v-if="
                  item.desc != null ||
                  item.images.length > 0 ||
                  item.videos.length > 0
                "
              >
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/instructions.png"
                  mode="scaleToFill"
                  style="width: 16px; height: 16px"
                />
              </view>
            </view>
          </view>
          <view class="submit">
            <view class="cleanOff" @click="confirmUserAct('clean')">重置</view>
            <view
              class="checkSubmit"
              @click="confirmUserAct('submit')"
              :class="isAllowSubmit ? 'allowSubmit' : ''"
              >提交</view
            >
          </view>
        </view>
      </view>
      <view class="safeBottomBox" style="height: 30px"></view>
    </u-popup>
    <u-toast ref="uToast" />
    <SymptomPopup ref="SymptomPopup"></SymptomPopup>
  </view>
</template>

<script>
import {
  ConversationType as RYConversationType,
  TextMessage as RYTextMessage,
  sendMessage as RYsendMessage,
  ErrorCode as RYErrorCode,
  ImageMessage as RYImageMessage,
  SightMessage as RYSightMessage,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { mapState, mapMutations } from "vuex";
import { BASR_URL } from "@/utils/http";
import { handleLastMes } from "@/pagesA/components/rongyunCloud/ryConnect";
import { postRegisterMessageApi } from "@/pagesA/api/chatAi";
import SymptomPopup from "@/pagesA/chatPage/components/SymptomPopup/index.vue";
import { debounce } from "@/utils/index";
import { action_report } from "@/utils/track";
export default {
  components: {
    SymptomPopup,
  },
  props: {
    groupId: {
      type: String,
    },
    quesMessage: {
      type: Object,
    },
    isMultiSelect: {
      type: Boolean,
    },
    isShowAllSelect: {
      type: Boolean,
    },
    quesId: {
      type: String,
    },
  },
  data() {
    return {
      answerList: [
        {
          id: 1,
          name: "是",
        },
        {
          id: 2,
          name: "否",
        },
      ],
      answerList2: [
        {
          id: 1,
          name: "选项1",
        },
        {
          id: 2,
          name: "选项2",
        },
        {
          id: 3,
          name: "选项3",
        },
        {
          id: 4,
          name: "选项4",
        },
        {
          id: 5,
          name: "选项5",
        },
        {
          id: 6,
          name: "选项6",
        },
      ],
      checked: null,
      show: true,
      noMask: false,
      selectedValues: [],
      inputValue: "",
    };
  },
  computed: {
    isAllowSubmit() {
      return this.selectedValues.length === 0 ? true : false;
    },
    ...mapState({
      userInfo: (state) => state.userInfo,
      isChooseImage: (state) => state.isChooseImage,
    }),
  },
  watch: {
    quesMessage: {
      handler(newVal, oldVal) {
        console.log("问题=========", newVal, oldVal);
        this.show = true;
      },
      deep: true,
    },
  },
  methods: {
    checkItem(index) {
      this.inputValue = this.quesMessage.questionOptions[index].option;
      this.checked = this.checked === index ? null : index;
      this.show = false;
      setTimeout(() => {
        this.sendMessText();
        this.checked = null;
      }, 500);
    },
    sendMessText() {
      if (!this.inputValue.length) {
        return;
      }
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };

      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      console.log(123456789);
      const message1 = new RYTextMessage({
        // 文本内容
        content: this.inputValue,
        extra: "文本消息",
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
          let registerData = {
            consultationId: this.quesMessage.uuid, //问诊单号
            questionId: this.quesMessage.questionId, //问题唯一id
            questionDesc: this.quesMessage.questionDesc.question, //问题内容
            answers: [this.inputValue],
          };
          console.log(
            "registerData==============================>",
            registerData
          );
          this.postRegisterMessage(registerData);
          this.$emit("sendSuccess", {
            // content: { content: data?.content.content },
            content: {
              content: data?.content.content,
              consultationId: this.quesMessage.uuid, //问诊单号
              questionId: this.quesMessage.questionId, //问题唯一id
              questionDesc: this.quesMessage.questionDesc.question, //问题内容
              answers: [this.inputValue],
            }, //回答,
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
    // AI问诊出发自定义消息
    async postRegisterMessage(data) {
      const res = await postRegisterMessageApi(data);
      console.log("res===================>,AI问诊出发自定义消息", res);
    },
    checkItmeDouble(id, option) {
      // this.selectedValues.push(id);
      console.log(option);
      const isSelected = this.isSelected(id);
      if (isSelected) {
        this.selectedValues = this.selectedValues.filter((i) => i !== id);
      } else {
        this.selectedValues.push(id);
      }
    },
    isSelected(index) {
      return this.selectedValues.includes(index);
    },
    confirmUserAct: debounce(function (type) {
      if (type === "clean") {
        this.selectedValues = [];
        this.inputValue = [];
      } else if (this.selectedValues.length === 0) {
        return console.log("未有选中项");
      } else {
        console.log(this.selectedValues);
        let ansArr = this.quesMessage.questionOptions;
        let newAnsArr = [];
        ansArr.map((item, index) => {
          if (!this.selectedValues.includes(index)) return;
          newAnsArr.push(item.option);
        });
        this.inputValue = newAnsArr.join(",");
        console.log(this.inputValue);
        this.sendMessText();
        this.selectedValues = [];
        // this.inputValue = [];
        this.show = false;
      }
    }, 300),
    test() {
      this.show = true;
      this.checked = null;
      this.selectedValues = [];
    },
    symptomPopupInterpret(item) {
      action_report({
        action_name: "IntelligentconsultationIM_SymptomDefinition_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      let data = {
        textDescription: item.desc || "",
        diseaseName: item.option || "",
        images: item.images,
        videos: item.videos,
      };
      console.log(data);
      this.$refs.SymptomPopup.formatData(data);
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
