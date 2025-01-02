<template>
  <view class="page-wrapper">
    <view class="bg">
      <!-- <view  class="question"> -->
      <view class="qText" v-if="!questionOk"
        >{{ questionList[curNum - 1] ? questionList[curNum - 1].question : "" }}
        <view class="pot1"></view>
        <view class="pot2"></view>
        <view class="pot3"></view>
        <view class="pot4"></view>
      </view>
      <!-- </view> -->

      <view
        v-if="!questionOk"
        :class="['answer1', checkNum == 0 ? 'check' : '']"
        @click="checkHandle(0)"
      >
        <view v-if="!questionOk" class="aText">{{
          questionList[curNum - 1]
            ? questionList[curNum - 1].answerList[0].answer
            : ""
        }}</view>
      </view>
      <view
        v-if="!questionOk"
        :class="['answer2', checkNum == 1 ? 'check' : '']"
        @click="checkHandle(1)"
      >
        <view v-if="!questionOk" class="aText">{{
          questionList[curNum - 1]
            ? questionList[curNum - 1].answerList[1].answer
            : ""
        }}</view>
      </view>

      <view
        v-if="!questionOk"
        class="petImg"
        :style="'background-image: url(' + imageUrl + ');'"
      >
      </view>
    </view>

    <view v-if="!questionOk" class="countbg">
      <view class="num"
        >{{ `${curNum}/` }} <span class="num_right">12</span>
      </view>
    </view>
    <view v-if="!questionOk" class="myPetName">{{ petName }}</view>
    <view class="buttomImg"> </view>

    <view v-if="questionOk" class="anim">
      <view class="animText"> 猫咪性格分析中...</view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
//import { wxShareMethod } from "@/utils/wxShare";
// #ifdef H5
import { secondShare } from "@/utils/secondshare";
// #endif
import { GET_MBTI_CREATE_CATEGORY, MBTI_SUBMIT_CATEGORY } from "@/api/activity";
const shareInfo = {
  title: "猫咪性格测试大揭秘",
  path: "/pagesD/mbtiTest/index",
  imageUrl:
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/activity/mbti/shareicon.png",
  desc: "快来测一测你家猫咪的MBTI吧",
};
export default {
  components: {},

  // props: {
  //   petName: {
  //     type: String,
  //   },
  // },
  data() {
    return {
      curNum: 1,
      isCan: true,
      checkNum: -1,
      questionOk: false,
      paperNo: "",
      questionList: [],
      submitData: {},
      imageUrl: "",
      petName: "",
    };
  },
  // #ifdef MP-WEIXIN
  ...wxShareMethod(shareInfo),
  // #endif
  computed: {
    ...mapState(["userInfo"]),
  },
  onShow() {
    // #ifdef H5
    setTimeout(() => {
      secondShare({
        title: shareInfo.title,
        desc: shareInfo.desc,
        link: `${window.location.origin}/crm-medical-h5/#/pagesD/mbtiTest/index`,
        imgUrl: shareInfo.imageUrl,
      });
    }, 500);
    // #endif
  },
  onLoad(options) {
    this.petName = options.petName;
  },
  created() {
    GET_MBTI_CREATE_CATEGORY({ category: "CAT" }).then((res) => {
      console.log(res);
      this.paperNo = res.data.paperNo;
      this.questionList = res.data.questionList;
      this.submitData.paperNo = this.paperNo;

      this.submitData.deviceId = uni.getStorageSync("systemInfo").device_id;
      this.submitData.petCategory = "cat";
      this.submitData.petName = this.petName;
      this.submitData.questionAnswer = [];

      this.imageUrl = this.questionList[this.curNum - 1].backUrl;
    });
  },

  methods: {
    checkHandle(type) {
      console.log("checkHandle=== ", type);
      if (!this.isCan) {
        console.log("isCan false=== ");
        return;
      }
      this.checkNum = type;
      this.isCan = false;

      this.submitData.questionAnswer.push({
        questionId: this.questionList[this.curNum - 1].id,
        questionGroup: this.questionList[this.curNum - 1].questionGroup,
        answerId: this.questionList[this.curNum - 1].answerList[type].id,
        answerScore:
          this.questionList[this.curNum - 1].answerList[type].answerScore,
      });

      if (this.curNum == 12) {
        console.log("this.submitData=== ", this.submitData);
      }

      setTimeout(() => {
        this.curNum++;
        this.isCan = true;
        this.checkNum = -1;

        if (this.curNum == 13) {
          this.questionOk = true;
          setTimeout(() => {
            MBTI_SUBMIT_CATEGORY(this.submitData).then((resGet) => {
              console.log(resGet);
              let rest = resGet.data;

              console.log("rest=", rest);
              uni.redirectTo({
                url: `/pagesD/mbtiTest/components/result/index?rest=${rest}&petname=${this.petName}`,
              });
            });
          }, 1000);
        } else {
          this.imageUrl = this.questionList[this.curNum - 1].backUrl;
        }
      }, 500);
    },
  },
};
</script>

<style></style>

<style lang="scss" scoped>
@import "./index.scss";
</style>
