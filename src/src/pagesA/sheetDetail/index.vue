<template>
  <view>
    <!-- #ifdef H5 -->
    <NavBar
      v-if="source != 30"
      title="问诊详情"
      navColor="#f5f6f7"
      showBackBtn
      @navBackClickHandle="back"
      :customback="true"
      :style="{ position: 'sticky', top: 0, left: 0, zIndex: 999 }"
    >
      <template slot="righticon">
        <view
          class="navbar-right"
          @click="handleGoChat"
          v-if="detail.state !== -1"
        >
          聊天记录
        </view>
      </template>
    </NavBar>

    <!-- #endif -->
    <view class="sheet-wrapper" v-if="detail">
      <view class="diagnose" v-if="detail.diagnosticSheet !== null">
        <view v-if="detail.inquiryType !== 'NUTRITION'">
          <view class="top-wrapper">
            <view class="head-bg"></view>
            <view class="title first-title">
              <view class="left">初诊结果</view>
            </view>
          </view>
          <view class="bot-wrapper">
            <!-- 需要判断返回内容渲染，type值1-4枚举，同时还有备注信息 -->
            <view>
              <view v-if="[4].includes(detail.diagnosticSheet.diagnosisIndex)">
                <view class="color-tag suspect">拟</view>
                <view
                  class="content bold"
                  v-if="Array.isArray(detail.diagnosticSheet.diagnosis)"
                >
                  {{
                    detail.diagnosticSheet.diagnosis
                      .map((i) => {
                        return i.name;
                      })
                      .join("、")
                  }}
                </view>
              </view>
              <view
                v-if="[1, 2, 3].includes(detail.diagnosticSheet.diagnosisIndex)"
                class="content bold"
              >
                {{
                  diagnosisOptions[detail.diagnosticSheet.diagnosisIndex - 1]
                    .label
                }}
              </view>
            </view>
            <view
              class="content"
              v-if="detail.diagnosticSheet.diagnosisIndex == 5"
              >{{ detail.diagnosticSheet.diagnosisRemarks || "无" }}</view
            >
            <view v-else>
              <view
                class="content"
                v-if="
                  detail.diagnosticSheet.diagnosisRemarks &&
                  detail.diagnosticSheet.diagnosisRemarks.length
                "
              >
                {{ detail.diagnosticSheet.diagnosisRemarks }}
              </view>
            </view>

            <block
              v-if="
                detail.diagnosticSheet.weight &&
                detail.diagnosticSheet.weight != 0
              "
            >
              <view class="title sec-title">
                <view class="left">当前体重</view>
              </view>

              <view class="content">
                {{ detail.diagnosticSheet.weight }}kg
              </view>
            </block>

            <view
              class="title sec-title"
              v-if="detail.diagnosticSheet.offlineAdvice"
            >
              <view class="left">医嘱</view>
            </view>
            <view class="content" v-if="detail.diagnosticSheet.offlineAdvice">
              {{ detail.diagnosticSheet.offlineAdvice }}
            </view>
            <view
              class="title trd-title"
              v-if="
                detail.diagnosticSheet.medicationAdvice ||
                detail.diagnosticSheet.otherAdvice
              "
            >
              <view class="left">处置建议</view>
            </view>
            <view v-if="detail.diagnosticSheet.medicationAdvice">
              <view class="color-tag advice">用药建议</view>
              <view class="content">
                {{ detail.diagnosticSheet.medicationAdvice }}
              </view>
            </view>
            <view v-if="detail.diagnosticSheet.otherAdvice">
              <view class="color-tag advice">其他建议</view>
              <view class="content">
                {{ detail.diagnosticSheet.otherAdvice }}
              </view>
            </view>
          </view>
        </view>
        <view v-else>
          <view class="top-wrapper">
            <view class="head-bg"></view>
            <view class="title first-title">
              <view class="left">初步结论</view>
            </view>
          </view>
          <view class="bot-wrapper">
            <view class="content bold">
              {{ detail.diagnosticSheet.conclusion }}
            </view>
            <view class="title">
              <view class="left">营养建议</view>
            </view>
            <view class="content bold">
              {{ detail.diagnosticSheet.nutritionAdvice }}
            </view>
          </view>
        </view>
        <view class="skirt"></view>
      </view>

      <!-- 处方信息 -->
      <view
        class="panel"
        v-if="
          detail.diagnosticSheet &&
          detail.diagnosticSheet.medicines &&
          detail.diagnosticSheet.medicines.length
        "
      >
        <view class="title prescription">
          <view class="left">处方信息</view>
          <view
            class="prescription-original"
            @click="
              () => {
                imgPreviewPrescription(
                  detail.diagnosticSheet.prescriptionImageUrl
                );
              }
            "
            >原始处方</view
          >
          <view class="prescription-official">
            <!-- 已开具 -->
            <image
              v-if="detail.diagnosticSheet.prescriptionStatus == 'ISSUED'"
              src="https://image.henhenchina.com/61ee0fe4f58112000178d924/4c698702fdd34412a7e1f5972f430124.png"
            />
            <!-- 已经执行 -->
            <image
              v-if="detail.diagnosticSheet.prescriptionStatus == 'EXECUTED'"
              src="https://image.henhenchina.com/61ee0fe4f58112000178d924/c05f4faff4d64b5abe2e01a69c8fe124.png"
            />
            <!-- 已过期 -->
            <image
              v-if="detail.diagnosticSheet.prescriptionStatus == 'EXPIRED'"
              src="https://image.henhenchina.com/61ee0fe4f58112000178d924/afacb939d27f4a8cb26de48d62e25a11.png"
            />
          </view>
        </view>

        <view class="detail">
          <view
            class="prescription-item"
            v-for="(item, index) in detail.diagnosticSheet.medicines"
            :key="index"
          >
            <view class="prescription-top">
              <view class="prescription-name">{{ item.name }}</view>
              <view class="prescription-num"
                >x {{ item.quantity }} {{ item.quantityUnit }}</view
              >
            </view>
            <view class="prescription-bottom"
              >用法用量：{{ item.usageInstructions }}</view
            >
          </view>
          <view v-if="detail.diagnosticSheet.prescriptionStatus != 'EXPIRED'">
            <view
              class="detail-btn"
              v-if="detail.diagnosticSheet.prescriptionStatus == 'EXECUTED'"
              @click.stop="
                () => {
                  goOrderDetail(detail.orderInfo);
                }
              "
              >查看订单</view
            >
            <view
              class="detail-btn"
              v-else=""
              @click.stop="
                () => {
                  diagnosisDetails(detail);
                }
              "
              >按处方购买</view
            >
          </view>
        </view>
      </view>
      <!-- 问诊信息 -->
      <view class="panel">
        <view class="title">
          <view class="left">问诊信息</view>
          <view
            class="right"
            @click="handleGoChat"
            v-if="detail.state !== -1 && detail.inquiryType == 'NUTRITION'"
          >
            <view>聊天记录</view>
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/arrow-right-tag1.png"
              mode="scaleToFill"
            />
          </view>
        </view>
        <view class="detail">
          <view class="info2">
            <view class="key">爱宠名称</view>
            <view class="value">{{
              detail.petInformation.nickName || ""
            }}</view>
          </view>
          <view class="info2">
            <view class="key">基础信息</view>
            <view class="value">
              {{
                [
                  detail.petInformation.categoryName,
                  detail.petInformation.age,
                  detail.petInformation.gender === 1 ? "GG" : "MM",
                  detail.petInformation.hairColor,
                ]
                  .filter(Boolean)
                  .join(" ")
              }}
            </view>
          </view>
          <view
            class="info2"
            v-if="
              detail.petInformation.weight && detail.petInformation.weight != 0
            "
          >
            <view class="key">当前体重</view>
            <view class="value"> {{ detail.petInformation.weight }}kg </view>
          </view>
          <view class="info2">
            <view class="key">绝育情况</view>
            <view class="value">
              {{ sterilizationEnum[detail.petInformation.sterilizationStatus] }}
            </view>
          </view>
          <view
            class="info2"
            v-if="
              detail.inquiryType !== 'NUTRITION' &&
              detail.inquiryType !== 'ONLINE_PRESCRIPTION'
            "
          >
            <view class="key">疫苗情况</view>
            <view class="value">
              {{ vaccineInfo || "未知" }}
            </view>
          </view>
          <view class="info2" v-if="detail.inquiryType == 'NUTRITION'">
            <view class="key">体重</view>
            <view class="value"> {{ detail.petInformation.weight }}kg </view>
          </view>
          <view class="info2" v-if="detail.inquiryType == 'NUTRITION'">
            <view class="key">主食习惯</view>
            <view class="value taglist">
              {{
                detail.petInformation.dietHabit &&
                detail.petInformation.dietHabit.join("、")
              }}
            </view>
          </view>
          <view class="info2" v-if="detail.inquiryType == 'NUTRITION'">
            <view class="key">运动量</view>
            <view class="value">
              {{ detail.petInformation.dailyExerciseAmount }}
            </view>
          </view>
          <view class="info2" v-if="detail.inquiryType == 'NUTRITION'">
            <view class="key">问诊诉求</view>
            <view class="value taglist">
              {{
                detail.petInformation.medicalDemand &&
                detail.petInformation.medicalDemand.join("、")
              }}
            </view>
          </view>
          <view
            class="info2"
            v-if="
              detail.inquiryType !== 'NUTRITION' &&
              detail.inquiryType !== 'ONLINE_PRESCRIPTION'
            "
          >
            <view class="key">是否驱虫</view>
            <view class="value">
              {{ expelInsectsInfo || "未知" }}
            </view>
          </view>
          <view v-if="detail.inquiryType != 'AI_INQUIRY'">
            <view
              class="info2"
              v-if="detail.symptomType && detail.symptomType.length"
            >
              <view class="key">症状类型</view>
              <view class="value taglist">
                {{
                  detail.symptomType &&
                  detail.symptomType
                    .map((i) => {
                      return i.tagName;
                    })
                    .join("、")
                }}
              </view>
            </view>
          </view>
          <view v-else>
            <view class="info3">
              <text class="title-info3">选择症状</text>
              <view class="content">
                {{
                  detail.symptomType &&
                  detail.symptomType
                    .map((i) => {
                      return i.tagName;
                    })
                    .join("、")
                }}</view
              >
            </view>
            <view v-if="detail.petInformation.illnessDesc" class="info3">
              <text class="title-info3">补充描述症状</text>
              <view class="content">
                {{ detail.petInformation.illnessDesc }}</view
              >
            </view>
          </view>

          <view class="info2" v-if="detail.petInformation.symptomDuration">
            <view class="key">症状时长</view>
            <view class="value">
              {{ detail.petInformation.symptomDuration }}
            </view>
          </view>
          <view
            class="info2"
            v-if="
              detail.petInformation.symptomImags &&
              detail.petInformation.symptomImags.length
            "
          >
            <view class="key">症状照片</view>
            <view class="value img-wrapper">
              <view
                v-for="(item, index) in detail.petInformation.symptomImags"
                :key="index"
              >
                <image
                  :src="item"
                  mode="scaleToFill"
                  @click="
                    () => {
                      imgPreview(item);
                    }
                  "
                />
              </view>
            </view>
          </view>
          <view v-if="detail.inquiryType != 'AI_INQUIRY'">
            <view class="info3" v-if="detail.petInformation.illnessDesc">
              <text class="title-info3">{{
                detail.inquiryType !== "NUTRITION" ? "主诉症状" : "具体描述"
              }}</text>
              <view class="content">{{
                detail.petInformation.illnessDesc
              }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="panel" v-if="detail.orderInfo">
        <view class="title">
          <view class="left">订单信息</view>
          <view class="right">
            <view>{{ detail.orderInfo.orderStatus }}</view>
          </view>
        </view>
        <view class="detail">
          <view class="info2">
            <view class="key">快递单号</view>
            <view class="value">{{
              detail.orderInfo.logisticsTrackingNo
                ? detail.orderInfo.logisticsTrackingNo
                : "无"
            }}</view>
          </view>
          <view class="info2">
            <view class="key">物流公司</view>
            <view class="value">
              {{
                detail.orderInfo.logisticsCompanyName
                  ? detail.orderInfo.logisticsCompanyName
                  : "无"
              }}
            </view>
          </view>
          <view class="info2">
            <view class="key">订单id</view>
            <view class="value">
              {{ detail.orderInfo.orderNo ? detail.orderInfo.orderNo : "无" }}
            </view>
          </view>
          <view class="info2">
            <view class="key">订单金额</view>
            <view class="value">
              {{
                detail.orderInfo.payAmount
                  ? detail.orderInfo.payAmount + "元"
                  : "无"
              }}
            </view>
          </view>
          <view class="info2">
            <view class="key">商品信息</view>
            <view class="value">
              {{
                detail.orderInfo.medicines
                  ? `${detail.orderInfo.medicines[0].name}
                      等，共${detail.orderInfo.medicines.length}件商品 `
                  : "无"
              }}
            </view>
          </view>
          <view class="detail-btn" @click="goOrderDetail(detail.orderInfo)"
            >查看订单详情</view
          >
        </view>
      </view>

      <view class="panel" v-if="isShowDoctor([1, 2, 3])">
        <view class="title">
          <view class="left">服务医生信息</view>
          <!-- #ifdef MP-WEIXIN -->
          <view class="right" @click="handleGoChat" v-if="detail.state !== -1">
            <view>聊天记录</view>
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/arrow-right-tag1.png"
              mode="scaleToFill"
            />
          </view>
          <!-- #endif -->
        </view>
        <view class="list-item" @click="toDocDetail">
          <view class="avatar">
            <image
              :src="
                detail.inquiryType == 'QUICK'
                  ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/zhichong/index/kuaizhen-avatar.png'
                  : detail.doctorInfo.avatarUrl ||
                    'https://image.henhenchina.com/account_10.png'
              "
            />
          </view>
          <view class="info">
            <view class="first-row">
              <view class="name" v-if="detail.inquiryType !== 'QUICK'">{{
                detail.doctorInfo.userName
              }}</view>
              <view class="name" v-else>快诊医生团队</view>
            </view>
            <view
              class="aiDepartment"
              v-if="detail.inquiryType == 'AI_INQUIRY'"
            >
              {{ detail.doctorInfo.department.replace(/,/g, " | ") }}
            </view>
            <view class="second-row">
              <span v-if="detail.inquiryType != 'AI_INQUIRY'">
                <text class="name">评分 </text>
                <text class="num margin29">{{
                  detail.doctorInfo.avgScore
                }}</text>
              </span>
              <text class="name">累计接诊量 </text>
              <text style="margin-left: 10rpx" class="num">{{
                detail.doctorInfo.totalServiceCount
              }}</text>
            </view>
            <view class="aiDirection" v-if="detail.inquiryType == 'AI_INQUIRY'">
              {{ detail.doctorInfo.goodDirection }}
            </view>
            <view v-if="detail.inquiryType != 'AI_INQUIRY'">
              <view class="third-row" v-if="detail.inquiryType !== 'QUICK'">
                从业{{ detail.doctorInfo.employmentYears }}年 ｜
                {{ detail.doctorInfo.hospitalName }}
                {{ detail.doctorInfo.sameCityFlag ? "同城" : "非同城" }}
                <!-- {{ item.sameCityFlag ? "｜&nbsp;同城" : "" }} -->
              </view>
              <view class="forth-row" v-if="detail.inquiryType !== 'QUICK'">{{
                detail.doctorInfo.goodDirection
              }}</view>
              <view class="forth-row" v-if="detail.inquiryType == 'QUICK'"
                >本次服务医生 {{ detail.doctorInfo.userName }}</view
              >
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="
          detail.inquiryType !== 'AI_INQUIRY' &&
          [-1, 4, 5].includes(detail.state) &&
          detail.inquiryType !== 'NUTRITION'
        "
        class="panel"
      >
        <view class="title">
          <view class="left">服务医生信息</view>
        </view>
        <view class="list-item" @click="toDocDetail">
          <view class="avatar">
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/zhichong/index/not-match-avatar.png"
            />
          </view>
          <view class="info">
            <view class="first-row no-doc">
              <view class="name"> 未匹配到医生 </view>
            </view>
          </view>
        </view>
      </view>

      <view class="panel distance">
        <view class="title">
          <view class="left">在线问诊单</view>
          <view class="right"></view>
        </view>
        <view class="detail">
          <view class="info1">
            <view class="name">问诊单编号：</view>
            <view class="content">{{ detail.id }}</view>
          </view>
          <view class="info1">
            <view class="name letter">问诊时间:</view>
            <view class="content">{{ detail.createTime || "" }}</view>
          </view>
          <view class="info1">
            <view class="name">问诊单状态：</view>
            <view class="content">{{ sheetStateEnum[detail.state] }}</view>
          </view>
          <view class="info1">
            <view class="name">问诊单类型：</view>
            <view class="content">
              <!-- {{
              detail.inquiryType == "QUICK"
                ? "免费义诊"
                : detail.inquiryType == "EXPERT"
                ? "专家问诊"
                : detail.inquiryType == "ONLINE_PRESCRIPTION"
                ? "在线开药"
                : detail.inquiryType == "REPORT_INTERPRETATION"
                ? "报告解读"
                : "营养咨询"
            }} -->
              {{ typeName }}
            </view>
          </view>
          <view class="info1">
            <view class="name letter">订单金额：</view>
            <view class="content">{{ detail.price }} 元</view>
          </view>
        </view>
      </view>
      <view v-if="!isShowFoot([-1, -2, 4, 5, 6])" class="foot">
        <view @click="handleGoChat" class="foot-btn">{{
          detail.state == 1 ? "继续咨询" : "咨询记录"
        }}</view>
      </view>
      <view v-if="!isShowFoot([-1, -2, 4, 5, 6])" class="brick"></view>
    </view>
  </view>
</template>

<script>
import DropDown from "@/components/dropDown/wyb-drop-down.vue";
import { getSheetsDetail } from "@/api/sheets";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import { getTypeModule } from "@/pagesA/api/chatAi";
import NavBar from "@/components/navBar/index.vue";
import { mapState } from "vuex";
import {
  QUERY_SHEET_BY_ORDERNO,
} from "@/api/pay";
const SHARE_BASR_URL =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test" ||
  process.env.NODE_ENV === "development-local"
    ? "https://cn-dev02-shareactivity.chongpangpang.com/"
    : "https://shareactivity.chongpangpang.com/";
export default {
  components: { DropDown, NavBar },
  data() {
    return {
      id: "",
      detail: {
        doctorInfo: {},
        petInformation: {},
        commentInfo: {},
        tags: {},
        diagnosticSheet: {},
      },
      sheetStateEnum: {
        "-1": "待接单",
        1: "服务中",
        2: "待评价",
        3: "已完成",
        4: "已取消",
        5: "已取消",
      },
      sterilizationEnum: {
        0: "绝育未知",
        1: "未绝育",
        2: "已绝育",
      },
      vaccineEnum: {
        1: "已接种疫苗",
        2: "未接种疫苗",
        3: "接种不全",
        4: "接种不详",
      },
      diagnosisOptions: [
        {
          label: "待查，需要结合线下进一步诊断",
          value: 1,
        },
        {
          label: "用户未及时回复或终止聊天",
          value: 2,
        },
        {
          label: "据本次问诊描述，未发现异常",
          value: 3,
        },
        {
          label: "拟",
          value: 4,
        },
        {
          label: "无",
          value: 5,
        },
      ],
      diagnosisRemarksOptions: [
        {
          label: "无",
          value: 1,
        },
        {
          label: "线下就医进一步诊断",
          value: 2,
        },
        {
          label: "建议3-7天后线上复诊",
          value: 3,
        },
        {
          label: "建议日常关注宠物状态",
          value: 4,
        },
        {
          label: "",
          value: 5,
        },
      ],
      aiSelectData: [],
      typeName: "",
      source: null, //30 平安app
      vaccineInfo:'',
      expelInsectsInfo:''
    };
  },
  onLoad(options) {
    this.id = options.id || "";
    this.source = options.source || "";
  },
  onShow() {
    this._getSheetsDetail();
  },
  watch: {
    // 监听 petInformation 的变化
    'detail.petInformation': {
      handler(newVal) {
        console.log('petInformation changed:', newVal);
        // 处理疫苗信息
        let vaccineName = this.vaccineEnum[newVal?.vaccineDetail?.vaccine] || '';
        console.log('vaccineName',newVal?.vaccineDetail?.vaccine,vaccineName);
        
        let vaccineDetail = newVal?.vaccineDetail?.vaccineTime || '';
        let vaccineType = newVal?.vaccineDetail?.vaccineType || '';
        this.vaccineInfo = [vaccineName, vaccineDetail, vaccineType]
          .filter(Boolean)
          .join(' ');

        // 处理驱虫信息
        let expelInsectsName =
          ['定时驱虫', '未定时驱虫', '未做驱虫'][newVal?.expelInsectsDetail?.expelInsects - 1] || '';
        let expelInsectsTime = newVal?.expelInsectsDetail?.expelInsectsTime || '';
        let expelInsectsType = newVal?.expelInsectsDetail?.expelInsectsType || '';
        let expelInsectsBrand = newVal?.expelInsectsDetail?.expelInsectsBrand || '';
        this.expelInsectsInfo = [
          expelInsectsName,
          expelInsectsTime,
          expelInsectsType,
          expelInsectsBrand,
        ]
          .filter(Boolean)
          .join(' ');
      },
      immediate: true, // 立即执行一次
      deep: true, // 深度监听
    },
  },
  methods: {
    back(){
      this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
    },
    isShowDoctor(status = []) {
      // 智能问诊直接展示医生信息
      if (this.detail.inquiryType == "AI_INQUIRY") {
        return true;
      }
      return (
        status.includes(this.detail.state) &&
        this.detail.inquiryType !== "NUTRITION"
      );
    },
    isShowFoot(status) {
      // -1 -2 4 5 6 不展示   1-继续咨询   其他-咨询记录
      return status.includes(this.detail.state);
    },

    async handleGoChat() {
      console.log('this.detail',this.detail);
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      return;
      // #endif
      // #ifdef H5
      try {
        // if (this.detail.inquiryType === "QUICK") {
        //   uni.showToast({
        //     icon: false,
        //     title: "小程序暂不支持免费义诊消息回复，请返回app进行问诊",
        //   });
        //   return;
        // }
        let remainingTimeVal = this.detail.remainingTime;
        let remainingWaitingTimeVal;
        if (this.detail.state == 1 || this.detail.state == -1) {
          const res = await GET_IN_SERVICE_LAST({});
          const { remainingTime, remainingWaitingTime } = res.data;
          remainingTimeVal = remainingTime;
          remainingWaitingTimeVal = remainingWaitingTime;
        }

        let result = {
          groupId: this.detail.groupId,
          remainingTime: remainingTimeVal,
          remainingWaitingTime: remainingWaitingTimeVal,
          doctorAvatarUrl: this.detail.doctorInfo.avatarUrl,
          doctorUserName: this.detail.doctorInfo.userName,
          sheetState: this.detail.state,
          id: this.detail.id,
          inquiryType: this.detail.inquiryType,
        };
        // if (this.detail.inquiryType !== "QUICK") {
        //   uni.navigateTo({
        //     url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
        //       result
        //     )}&fromOrigin=continue&inquiryType=EXPERT`,
        //   });
        // } else {
        //   uni.navigateTo({
        //     url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
        //       result
        //     )}&fromOrigin=continue&inquiryType=QUICK`,
        //   });
        // }
        let pingAnData = uni.getStorageSync("pingan-data");
        console.log(
          pingAnData,
          'let pingAnData = uni.getStorageSync("pingan-data");'
        );
        if (this.source == 30) {
          const baseUrl = window.location.origin + "/crm-medical-h5/#";
          const path = `${baseUrl}/pagesA/chatPage/index?messageInfo=${JSON.stringify(
            result
          )}&fromOrigin=continue&inquiryType=${
            this.detail.inquiryType
          }&sheetState=${this.detail.state}&petId=${
            this.detail.petInformation.petId
          }&source=${this.source}&openId=${
            this.pinganOpenId || pingAnData.openId || ""
          }&consultationId=${this.id || ""}`;
          console.log(path, "path");

          this.$pinganPlugin.openPage(path);
        } else {
          uni.navigateTo({
            url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              result
            )}&fromOrigin=continue&inquiryType=${
              this.detail.inquiryType
            }&sheetState=${this.detail.state}&petId=${
              this.detail.petInformation.petId
            }`,
          });
        }
      } catch (e) {
        console.error("handleGoChat", e);
      }
      // #endif
    },
    async _getSheetsDetail() {
      try {
        const res = await getSheetsDetail({
          id: this.id,
        });

        this.detail = res.data;
        this.getModule(this.detail);
      } catch (e) {
        console.error("获取详情失败", e);
      }
    },
    toDocDetail() {
      if (this.detail.inquiryType == "QUICK") {
        return;
      }
      if (this.detail.inquiryType == "AI_INQUIRY") {
        return;
      }
      uni.navigateTo({
        url: `/pagesA/docDetail/index?userId=${
          this.detail.doctorInfo.userId
        }&cityCode=${uni.getStorageSync("cityCode")}&source=${this.source}`,
      });
    },
    imgPreview(url) {
      uni.previewImage({
        urls: [url], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: url, // 当前显示图片的http链接，默认是第一个
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      });
    },

    //原始处方
    imgPreviewPrescription(url) {
      uni.previewImage({
        urls: [url], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: url, // 当前显示图片的http链接，默认是第一个
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      });
    },

    diagnosisDetails(item) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/electronPrescription/index?id=${item.id}&source=${this.source}`,
      });
      // #endif
      // #ifdef H5
      if (this.source == 30) {
        this.$pinganPlugin.openPage(
          `${window.location.origin}/crm-medical-h5/#/pagesA/electronPrescription/index?id=${item.id}&source=${this.source}`
        );
        return;
      }else{
        this.$dsBridge.call("gotoPageThroughRoute", {
          page:`${window.location.origin}/crm-medical-h5/#/pagesA/electronPrescription/index?id=${item.id}`,
        });
      }
      // uni.navigateTo({
      //   url: `/pagesA/electronPrescription/index?id=${item.id}&source=${this.source}`,
      // });
      // #endif
    },

    goOrderDetail(item) {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${item.orderNo}`,
      });
      // #endif
       // #ifdef H5
      if(this.source ==30){
        //平安app跳转方式
        uni.navigateTo({
        url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${item.orderNo}&source=${this.source}`,
      });
      }else{
        //宠胖胖app跳转方式
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${SHARE_BASR_URL}h5/shareActivity/?random=123#/buyerOrderDetail/${item.orderNo}?transparentTopBar=1`,
        });
      }
       // #endif
    },
    async getModule(detail) {
      getTypeModule().then((res) => {
        this.aiSelectData = res.data;
        this.aiSelectData.forEach((item) => {
          if (item.code == detail.inquiryType) {
            this.typeName = item.moduleName;
          }
        });
        console.log(this.aiSelectData, "this.aiSelectData");
      });
    },
  },
  computed: {
    ...mapState({
      pinganOpenId: (state) => state.pinganOpenId,
      pinganId: (state) => state.pinganId,
    }),
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
