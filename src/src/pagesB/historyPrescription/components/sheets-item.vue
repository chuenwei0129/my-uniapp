<template>
  <view class="sheets-item" @click="handleItem">
    <view class="portrait">
      <image
        class="portrait-image"
        mode="aspectFill"
        :src="
          sheet.petAvatarUrl ||
          'https://frontend-cdn.chongpangpang.com/image/medical-mp/home/pet-avatar-tag.png'
        "
      />
    </view>
    <view class="sheets-info">
      <view class="info">
        <view class="nickname"
          >宠物：{{
            sheet.petNickName ? sheet.petNickName.slice(0.6) : ""
          }}</view
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
        <view class="sheets-status"></view>
      </view>

      <view class="time">{{ sheet.createTime || "" }}</view>
      <view class="diagnose">
        <view class="diagnose-title">诊断：</view>
        <view class="diagnose-content text-line-one">
          {{ handleMatchDiagnose(sheet) }}
        </view>
      </view>
      <view class="diagnose">
        <view class="diagnose-title"
          >药品（共{{ sheet.medicines.length }}个)</view
        >
        <view
          class="medicines-content"
          v-for="med in sheet.medicines.slice(0, 3)"
          :key="med.id"
        >
          <view class="name text-line-one">{{ med.name }}</view>
          <view class="num">x{{ med.quantity }} {{ med.quantityUnit }}</view>
        </view>
      </view>

      <view class="btn-con">
        <view
          class="btn"
          @click.stop="
            () => {
              handleItem(sheet);
            }
          "
          >选中处方</view
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
import { action_report } from "@/utils/track";

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
      userSelectedPetId: (state) => state.userSelectedPetId,
      aiTypeName: (state) => state.aiTypeName,
    }),
  },
  components: {
    ConfirmPop,
  },
  mounted() {
    this.$nextTick(() => {
      this.getModule();
    });
  },
  methods: {
    ...mapMutations([
      "setSheetsList",
      "setServiceSheetsList",
      "setHistoryPrescription",
    ]),

    handleItem: debounce(function () {
      action_report({
        action_name: "historyrx_list_chose_clk",
        module_name: "medical",
      });
      //#ifdef MP-WEIXIN
      this.setHistoryPrescription(this.sheet);
      //#endif

      //#ifdef H5
      // 获取实例传参
      let pages = getCurrentPages()
      let prevPage = pages[pages.length -2] 
      console.log({pages,prevPage});
      prevPage.$vm.setDiagnosticId(this.sheet.id)
      //#endif
      uni.navigateBack({
        delta: 1,
      });
    }, 500),
    goBuyMedicines() {
      if (this.sheet.orderNo) {
        uni.navigateTo({
          url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${this.sheet.orderNo}`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesA/bussinessOrder/confirmOrderPage/index?diagnosticSheetId=${this.sheet.id}`,
        });
      }
    },
    goSubsequent() {
      this.setHistoryPrescription(this.sheet);
      uni.navigateTo({
        url: `/pagesA/subsequent/index?petId=${this.userSelectedPetId}`,
      });
    },
    /**
     * 用户主动结束问诊单
     */
    async handleEnd() {
      console.log("结束问诊");
      // this.isOpen = true;
      this.$emit("openMessage", this.sheet.groupId);
    },
    handleConfirm() {
      END_SHEET({ groupId: this.sheet.groupId }).then((res) => {});
    },
    async handleGoChat(type) {
      let result;
      try {
        if (type == "continue") {
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
        } else {
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
        }

        // if (this.sheet.inquiryType == "QUICK") {
        //   uni.navigateTo({
        //     url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
        //       result
        //     )}&fromOrigin=continue&inquiryType=QUICK`,
        //   });
        // } else if (this.sheet.inquiryType == "EXPERT") {
        //   uni.navigateTo({
        //     url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
        //       result
        //     )}&fromOrigin=continue&inquiryType=EXPERT`,
        //   });
        // } else {
        //   uni.navigateTo({
        //     url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
        //       result
        //     )}&fromOrigin=continue&inquiryType=NUTRITION`,
        //   });
        // }
        uni.navigateTo({
          url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
            result
          )}&fromOrigin=continue&inquiryType=${this.sheet.inquiryType}`,
        });
      } catch (e) {
        console.error("handleGoChat", e);
      }
    },

    handleMatchDiagnose(item) {
      //  【拟】
      let diagnoseEnum = {
        1: "待查，需要结合线下进一步诊断",
        2: "用户未及时回复或终止聊天",
        3: "据本次问诊描述，未发现异常",
        5: "无",
      };
      if (item.diagnosisIndex == 4) {
        if (Array.isArray(item.diagnosis) && item.diagnosis.length) {
          let name = item.diagnosis
            .map((i) => {
              return i.name;
            })
            .join("、");
          let remark = item.diagnosisRemarks
            ? `；${item.diagnosisRemarks}`
            : "";
          let res = name + remark;
          return "【拟】" + res;
        } else {
          return item.iagnosisRemarks || "无";
        }
      } else {
        if (item.diagnosisIndex == 5) {
          return item.diagnosisRemarks || "无";
        } else {
          let name = diagnoseEnum[item.diagnosisIndex];
          let remark = item.diagnosisRemarks
            ? `；${item.diagnosisRemarks}`
            : "";
          let res = name + remark;
          return res;
        }
      }
    },
    //原始处方
    diagnosisDetails(item) {
      uni.navigateTo({
        url: `/pagesA/electronPrescription/index?id=${item.consultationSheetId}`,
      });
    },
    getModule() {
      this.aiTypeName.forEach((item) => {
        if (item.code == this.sheet.type) {
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
  margin-top: 19rpx;
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
        // max-width: 300rpx;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box; //作为弹性伸缩盒子模型显示。
        // -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        // -webkit-line-clamp: 1; //显示的行
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
        font-size: 27rpx;
        color: #333333;
      }
      .type {
        height: 35rpx;
        width: 115rpx;
        margin-left: 8rpx;
      }
      .quick {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/zhichong/my/quick-2.png"
        );
      }
      .expert {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/zhichong/my/expert-tag.png"
        );
      }
      .nutrition {
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/nutrition/index/nutri-tag.png"
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
      .medicines-content {
        display: flex;
        align-content: center;
        justify-content: space-between;
        margin-bottom: 15rpx;
        height: 38rpx;
        .name {
          font-size: 27rpx;
          font-weight: bold;
          color: #333333;
          width: 446rpx;
        }
        .num {
          width: 108rpx;
          font-size: 27rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          white-space: nowrap;
          overflow: hidden;
        }
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
        font-size: 27rpx;
        font-weight: 400;
        color: #666666;
        line-height: 38rpx;
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
          color: #000000;
          background: #ffc900;
          border: none;
        }

        & ~ .btn {
          margin-left: 20rpx;
        }
      }
      .yellow-text {
        border-color: #ffb400;
        color: #ffb400;
      }
    }
  }
}
.sheets-item:nth-last-of-type(1) {
  margin-bottom: 19rpx;
}
</style>
