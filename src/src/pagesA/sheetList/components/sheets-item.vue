<template>
  <view class="sheets-item" @click="handleItem">
    <view class="portrait">
      <image
        class="portrait-image"
        mode="aspectFill"
        :src="
          sheet.petInformation.avatarUrl ||
          'https://frontend-cdn.chongpangpang.com/image/medical-mp/home/pet-avatar-tag.png'
        "
      />
      <view
        class="server-tag"
        v-show="sheet.state === 1 && lastMes.unreadMessageCount > 0"
      ></view>
    </view>
    <view class="sheets-info">
      <view class="info">
        <view class="nickname"
          >宠物：{{ sheet.petInformation.nickName || "" }}</view
        >
        <!-- ellipsis -->
        <view>
          <view
            v-if="typeName.code == 'AI_INQUIRY' || typeName.code == 'expert'"
          >
            <view class="redbg">
              {{ typeName.moduleName }}
            </view>
          </view>
          <view v-else>
            <view class="yellowbg">
              {{ typeName.moduleName }}
            </view>
          </view>
        </view>
        <view
          class="sheets-status"
          :class="[sheet.state === 1 ? 'service' : '']"
          >{{ sheetStateNum[sheet.state] }}</view
        >
      </view>

      <view class="time">{{ sheet.createTime || "" }}</view>

      <view v-if="sheet.inquiryType != 'AI_INQUIRY'">
        <view class="symptoms" v-if="sheet.inquiryType !== 'NUTRITION'">
          <view class="symptoms-title">主诉症状：</view>
          <view class="symptoms-content">{{
            sheet.petInformation.illnessDesc
          }}</view>
        </view>
      </view>
      <view v-else class="symptoms">
        <view class="symptoms-title">主诉症状：</view>
        <view class="symptoms-content">
          {{
            sheet.symptomType &&
            sheet.symptomType
              .map((i) => {
                return i.tagName;
              })
              .join("、")
          }}</view
        >
      </view>
      <view class="symptoms" v-else>
        <view class="symptoms-title">问诊诉求：</view>
        <view class="symptoms-content mar-bot">{{
          sheet.petInformation.medicalDemand &&
          sheet.petInformation.medicalDemand.join("、")
        }}</view>
      </view>
      <view
        class="symptoms"
        v-if="
          sheet.inquiryType == 'NUTRITION' && sheet.petInformation.illnessDesc
        "
      >
        <view class="symptoms-title">诉求详情：</view>
        <view class="symptoms-content ellipsis">{{
          sheet.petInformation.illnessDesc
        }}</view>
      </view>

      <view class="chat" v-if="sheet.state == 1 || sheet.state == -1">
        <text class="user-name" v-show="!(lastMes.sendUser.type === 'system')"
          >{{
            lastMes.sendUser.id === userInfo.ryUid
              ? "我"
              : sheet.doctorUserName || ""
          }}：</text
        >
        <view class="mes-show">
          <block v-if="lastMes.mes"> {{ lastMes.mes }}</block>
          <!-- <block v-if="sheet.diagnosticSheet"> -->
          <!-- <block v-else>
            {{
              sheet.diagnosticSheet.medicines.length
                ? "[电子处方笺]"
                : "[诊断小结]"
            }}</block
          > -->
        </view>
      </view>
      <view v-if="sheet.inquiryType == 'AI_INQUIRY'">
        <view class="diagnose">
          <view class="diagnose-title">报告结果：</view>
          <view class="diagnose-content text-line-one">
            {{ sheet.reportResult }}
          </view>
        </view>
      </view>
      <view v-else>
        <view
          class="diagnose"
          v-if="
            ![1, -1].includes(sheet.state) &&
            sheet.diagnosisStatus !== null &&
            sheet.inquiryType !== 'NUTRITION'
          "
        >
          <view class="diagnose-title">初诊结果：</view>
          <view class="diagnose-content text-line-one">
            {{ handleMatchDiagnose(sheet) }}
          </view>
        </view>
      </view>

      <view
        class="diagnose"
        v-if="
          ![1, -1].includes(sheet.state) &&
          sheet.diagnosisStatus !== null &&
          sheet.inquiryType == 'NUTRITION'
        "
      >
        <view class="diagnose-title"
          >{{ sheet.inquiryType == "NUTRITION" ? "营养建议：" : "初步小结：" }}
        </view>
        <view class="diagnose-content">
          {{
            sheet.diagnosticSheet
              ? sheet.diagnosticSheet.nutritionAdvice || "医师建议填写中..."
              : ""
          }}
        </view>
      </view>
      <view v-if="sheet.state == 3">
        <view v-if="sheet.inquiryType == 'AI_INQUIRY'">
          <view class="rate-con">
            <view
              v-if="sheet.commentInfo.commentStampOut != 0"
              class="rate-title"
              >评价：
              <span v-if="sheet.commentInfo.commentStampOut == 2">
                <span>
                  <image
                    class="evaluate"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/goodFace.png"
                  />
                </span>
                <span class="satisfied">满意</span>
              </span>
              <span v-else>
                <image
                  class="evaluate"
                  style="top: -6rpx"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/badFace.png"
                />
                <span class="satisfied">不满意</span>
              </span>
            </view>
          </view>
        </view>
        <view v-else>
          <view class="rate-con">
            <view class="rate-title">评价：</view>
            <u-rate
              :value="sheet.commentInfo.score"
              activeColor="#FFC900"
              readonly
              size="30rpx"
              gutter="4rpx"
              :allowHalf="true"
            ></u-rate>
            <text class="score">{{
              (sheet.commentInfo.score + "").indexOf(".") > -1
                ? sheet.commentInfo.score
                : sheet.commentInfo.score + ".0"
            }}</text>
          </view>
        </view>
      </view>

      <view class="btn-con">
        <view
          class="btn"
          v-if="sheet.state == 1 || sheet.state == -1"
          @click.stop="handleEnd"
          >{{ sheet.state == 1 ? "结束问诊" : "取消问诊" }}</view
        >
        <view
          class="btn inquiries"
          v-if="sheet.state == 1 || sheet.state == -1"
          @click.stop="
            () => {
              handleGoChat('continue');
            }
          "
          >继续问诊</view
        >
        <view
          class="btn"
          v-if="
            sheet.diagnosticSheet &&
            sheet.diagnosticSheet.medicines &&
            sheet.diagnosticSheet.medicines.length &&
            sheet.state !== 1
          "
          @click.stop="
            () => {
              diagnosisDetails(sheet);
            }
          "
          >查看处方</view
        >
        <view
          class="btn"
          v-if="sheet.state == 3 || sheet.state == 2"
          @click.stop="
            () => {
              handleGoChat('record');
            }
          "
          >聊天记录</view
        >
        <view
          class="btn"
          v-if="sheet.isShowReportResult"
          @click.stop="
            () => {
              handleGoReport(sheet.id);
            }
          "
          >查看报告</view
        >

        <view
          class="btn yellow-text"
          v-if="sheet.state == 2"
          @click.stop="
            () => {
              handleGoChat('rate');
            }
          "
          >去评价</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getProductList } from "@/api/base/index";
import { END_SHEET } from "@/api/chat";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import ConfirmPop from "@/components/confirmPop/index.vue";
import { debounce } from "@/utils/index";
import { postStepOutEndApi } from "@/pagesA/api/chatAi";
export default {
  props: {
    sheet: {
      type: Object,
      default: () => {
        return {};
      },
    },
    lastMes: {
      type: Object,
      default: () => {
        return { sendUser: {} };
      },
    },
  },
  data() {
    return {
      current: 0,
      isOpen: false,
      sheetStateNum: {
        "-1": "待接诊",
        1: "服务中",
        2: "待评价",
        3: "已完成",
        4: "已取消",
        5: "已取消",
        7: "已关闭",
      },
      typeName: {},
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      serviceSheetsList: (state) => state.serviceSheetsList,
      lastSheetsMessage: (state) => state.lastSheetsMessage,
      sheetsList: (state) => state.sheetsList,
      aiTypeName: (state) => state.aiTypeName,
    }),
  },
  components: {
    ConfirmPop,
  },
  mounted() {
    this.$nextTick(() => {
      this.getModule(this.sheet);
    });
  },
  methods: {
    async postStepOutEnd(id) {
      const res = await postStepOutEndApi(id);
    },
    ...mapMutations(["setSheetsList", "setServiceSheetsList"]),

    handleItem: debounce(function () {
      uni.navigateTo({
        url: `/pagesA/sheetDetail/index?id=${this.sheet.id}`,
      });
    }, 500),
    // handleItem() {

    // },
    /**
     * 用户主动结束问诊单
     */
    async handleEnd() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      return;
      // #endif
      console.log("结束问诊");
      // this.isOpen = true;
      this.$emit("openMessage", this.sheet.groupId);
    },
    handleConfirm() {
      END_SHEET({ groupId: this.sheet.groupId }).then((res) => {});
    },
    async handleGoChat(type) {
      // #ifdef MP-WEIXIN
      //ai问诊可以查看聊天记录
      if (this.sheet.inquiryType == "AI_INQUIRY") {
        uni.navigateTo({
          url: `/pagesA/chatPage/index?messageInfo=&fromOrigin=continue&inquiryType=${this.sheet.inquiryType}&groupId=${this.sheet.groupId}&state=${this.sheet.state}&sheetId=${this.sheet.id}`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
      }
      return;
      // #endif
      let result;
      try {
        if (type == "continue" && this.sheet.inquiryType != "AI_INQUIRY") {
          this.postStepOutEnd(this.sheet.id);
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
          result = {
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
            )}&fromOrigin=continue&inquiryType=${this.sheet.inquiryType}`,
          });
        } else if (
          type != "continue" &&
          this.sheet.inquiryType != "AI_INQUIRY"
        ) {
          result = {
            groupId: this.sheet.groupId,
            remainingTime: this.sheet.remainingTime,
            remainingWaitingTime: this.sheet.remainingWaitingTime,
            doctorAvatarUrl: this.sheet.doctorAvatarUrl,
            doctorUserName: this.sheet.doctorUserName,
            sheetState: this.sheet.state,
            id: this.sheet.id,
            inquiryType: this.sheet.inquiryType,
          };
          uni.navigateTo({
            url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              result
            )}&fromOrigin=continue&inquiryType=${
              this.sheet.inquiryType
            }&sheetId=${this.sheet.id}`,
          });
        } else {
          // #ifdef MP-WEIXIN

          uni.navigateTo({
            url: `/pagesA/chatPage/index?messageInfo=&fromOrigin=continue&inquiryType=${this.sheet.inquiryType}&groupId=${this.sheet.groupId}&state=${this.sheet.state}&sheetId=${this.sheet.id}`,
          });
          // #endif
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/pagesA/chatPage/index?messageInfo=&fromOrigin=rate&inquiryType=${this.sheet.inquiryType}&groupId=${this.sheet.groupId}&state=${this.sheet.state}&sheetId=${this.sheet.id}`,
          });
          // #endif
        }
      } catch (e) {
        console.error("handleGoChat", e);
      }
    },

    async handleGoReport(id) {
      const { userId } = uni.getStorageSync("storage_info");
      uni.navigateTo({
        url: `/pagesF/illnessReport/index?tabs=0&sheetId=${id}&shareType=WECHAT_CIRCLE&userId=${userId}`,
      });
    },

    handleMatchDiagnose(item) {
      //  【拟】
      if (item.diagnosisStatus == "UNDIAGNOSED") return "医生诊断开具中…";
      let diagnoseEnum = {
        1: "待查，需要结合线下进一步诊断",
        2: "用户未及时回复或终止聊天",
        3: "据本次问诊描述，未发现异常",
        5: "无",
      };
      if (item.diagnosticSheet) {
        if (item.diagnosticSheet.diagnosisIndex == 4) {
          if (
            Array.isArray(item.diagnosticSheet.diagnosis) &&
            item.diagnosticSheet.diagnosis.length
          ) {
            let name = item.diagnosticSheet.diagnosis
              .map((i) => {
                return i.name;
              })
              .join("、");
            let remark = item.diagnosticSheet.diagnosisRemarks
              ? `；${item.diagnosticSheet.diagnosisRemarks}`
              : "";
            let res = name + remark;
            return "【拟】" + res;
          } else {
            return item.diagnosticSheet.diagnosisRemarks || "无";
          }
        } else {
          if (item.diagnosticSheet.diagnosisIndex == 5) {
            return item.diagnosticSheet.diagnosisRemarks || "无";
          } else {
            let name = diagnoseEnum[item.diagnosticSheet.diagnosisIndex];
            let remark = item.diagnosticSheet.diagnosisRemarks
              ? `；${item.diagnosticSheet.diagnosisRemarks}`
              : "";
            let res = name + remark;
            return res;
          }
        }
      }
    },
    //原始处方
    diagnosisDetails(item) {
      uni.navigateTo({
        url: `/pagesA/electronPrescription/index?id=${item.id}`,
      });
    },
    getModule(detail) {
      console.log(detail.inquiryType, "detail.inquiryType");
      this.aiTypeName.forEach((item) => {
        if (item.code == detail.inquiryType) {
          this.typeName = item;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";

.sheets-item {
  // padding: 38rpx 38rpx 20rpx;
  // display: flex;
  padding: 23rpx 19rpx;
  display: flex;
  width: 719rpx;
  margin: 0 auto;
  margin-bottom: 19rpx;
  border-radius: 15rpx;
  background-color: #fff;
  .portrait {
    flex: 0 70rpx;
    height: 70rpx;

    position: relative;
    .portrait-image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
    .server-tag {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background-color: #ff5b05;
      position: absolute;
      top: 10rpx;
      right: -4rpx;
    }
  }
  .sheets-info {
    padding: 0 0 20rpx 20rpx;
    flex: 1;
    // border-bottom: 0.5px solid #eeeeee;
    overflow: hidden;

    .info {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      margin-bottom: 8rpx;
      .nickname {
        height: 42rpx;
        font-size: 31rpx;
        font-weight: bold;
        color: #333333;
        line-height: 42rpx;
        // flex: 1;
        max-width: 300rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 1; //显示的行
      }
      .redbg {
        margin-left: 15rpx;
        padding: 0 8rpx;
        border-radius: 8rpx;
        text-align: center;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 22rpx;
        color: #ff2529;
        background: linear-gradient(to right, #ffe6e7, #fff7f7);
        border: 1px solid #ffbebe;
      }
      .yellowbg {
        margin-left: 15rpx;
        padding: 0 8rpx;
        border-radius: 8rpx;
        text-align: center;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 22rpx;
        color: #ce6800;
        background: linear-gradient(to right, #fff7ec, #fffdf9);
        border: 1px solid #ffd6be;
      }
      .sheets-status {
        height: 33rpx;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 33rpx;
        text-align: right;
        flex: 1;
        color: #1f1f1f;
        // flex: 0 92rpx;
        &.service {
          color: #ff5b05;
        }
        &.evaluate {
          color: #ffb400;
        }
      }
      .type {
        height: 35rpx;
        width: 115rpx;
        margin-left: 8rpx;
      }
      .quick {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/tth_harmony_os_update/quick-icon.jpg"
        );
      }
      .expert {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/tth_harmony_os_update/expert-iocn.jpg"
        );
      }
      .nutrition {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/tth_harmony_os_update/nutrition-icon.jpg"
        );
      }
      .online {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/tth_harmony_os_update/online-icon.jpg"
        );
      }
      .reports {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/tth_harmony_os_update/reports-icon.jpg"
        );
      }

      .aiInquiry {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/aisheetlist.png"
        );
      }
      .online {
        width: 115rpx;
        height: 35rpx;
        background: rgba(30, 149, 234, 0.1);
        border-radius: 19rpx;
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 21rpx;
        color: #1e95ea;
        padding-top: 4rpx;
      }
      .reports {
        width: 115rpx;
        height: 35rpx;
        background: rgba(109, 160, 0, 0.1);
        border-radius: 19rpx;
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 21rpx;
        color: #6da000;
        padding-top: 4rpx;
      }
    }
    .time {
      height: 33rpx;
      font-size: 23rpx;
      font-weight: 400;
      color: #999999;
      line-height: 33rpx;
      margin-bottom: 15rpx;
    }

    .symptoms {
      .symptoms-title {
        height: 38rpx;
        font-size: 27rpx;
        font-weight: 400;
        color: #666666;
        line-height: 38rpx;
        margin-bottom: 15rpx;
      }
      .symptoms-content {
        font-size: 27rpx;
        font-weight: bold;
        color: #333333;
        line-height: 38rpx;
        &.mar-bot {
          margin-bottom: 23rpx;
        }
        &.ellipsis {
          width: 585rpx;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .diagnose {
      .diagnose-title {
        height: 38rpx;
        font-size: 27rpx;
        font-weight: 400;
        color: #666666;
        line-height: 38rpx;
        margin-bottom: 15rpx;
        margin-top: 23rpx;
      }
      .diagnose-content {
        font-size: 27rpx;
        font-weight: bold;
        color: #333333;
        line-height: 38rpx;
        width: 585rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .text-line-one {
        white-space: nowrap; //不支持换行
        overflow: hidden; //隐藏多出部分文字
        text-overflow: ellipsis; //用省略号代替多出部分文字
      }
    }

    .chat {
      margin-top: 19rpx;
      padding: 19rpx;
      background: #fafafa;
      border-radius: 15rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #666666;
      line-height: 38rpx;
      overflow: hidden;
      display: flex;
      .user-name {
        white-space: nowrap;
      }
      .mes-show {
        font-size: 28rpx;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .rate-con {
      margin-top: 15rpx;
      display: flex;
      align-items: center;
      .rate-title {
        position: relative;
        font-size: 27rpx;
        font-weight: 400;
        color: #666666;
        line-height: 38rpx;
        .evaluate {
          position: absolute;
          top: -8rpx;
          width: 50rpx;
          height: 50rpx;
        }
        .satisfied {
          margin-left: 55rpx;
          font-weight: bold;
        }
      }
      .score {
        margin-left: 8rpx;
        font-size: 24rpx;
        font-weight: bold;
        color: #ffc900;
      }
    }

    .btn-con {
      margin-top: 38rpx;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .btn {
        padding: 18rpx 0;
        line-height: 1;
        font-size: 26rpx;
        font-weight: 400;
        color: #333333;
        text-align: center;
        border-radius: 25px;
        border: 2rpx solid #e6e6e6;
        flex: 0 174rpx;
        &.inquiries {
          background-color: #ffeea5;
          color: #1f1f1f;
          font-size: 30rpx;
          border-color: #ffffff;
        }

        & ~ .btn {
          margin-left: 20rpx;
        }
      }
      .yellow-text {
        background-color: #ffeea5;
        color: #1f1f1f;
        font-size: 30rpx;
        border-color: #ffffff;
      }
    }
  }
}
</style>
