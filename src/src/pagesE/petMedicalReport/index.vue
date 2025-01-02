<template>
  <view class="report-page">
    <view class="card">
      <view class="title-time">
        <view class="title">{{ `Hi~${info.petName || ''}` }}</view>
        <view class="time" v-if="info.visitTime">{{ info.visitTime }}</view>
      </view>
      <view class="conclusion">
        <view class="top">
          <view class="left">
            <view class="title">{{ `诊断结论：` }}</view>
            <view class="disease">{{ getDiagnosisNames() }}</view>
          </view>
          <view class="right" @click="goAi" v-if="'' != getDiagnosisNames()">
            <view class="ai"></view>
            <view class="wwai">问问AI</view>
            <view class="right"></view>
          </view>
        </view>
        <p :class="[
          'content',
          expande ? 'expande' : 'close',
          opac ? 'opac' : '',
        ]" id="content" v-if="info.doctorsAdvice">
          医嘱：
          <span style="color: #1f1f1f" v-if="info.doctorsAdvice">{{ info.doctorsAdvice }}</span>
        </p>
        <view class="zk" @click="expandeClick" v-if="needShowExpande">
          <view class="txt">{{ expande ? "收起" : "展开全文" }}</view>
          <view :class="[expande ? 'up' : 'down']"></view>
        </view>
        <view class="doctor" v-if="info.doctorInfo">
          <view class="icon">
            <!-- <image :src="info.DoctorInfo.avatarUrl" mode="scaleToFill" class="avatar" /> -->
          </view>
          <view class="right">
            <view class="name-tips">
              <view class="name" v-if="info.doctorInfo.name">{{ `${info.doctorInfo.name}` }}</view>
              <view class="tips"></view>
            </view>
            <view class="des">{{
              `${info.doctorInfo.storeName || ' '}`
            }}</view>
          </view>
        </view>

        <view class="sjx"></view>
      </view>
    </view>

    <view class="physique"
      v-if="!isEmpty(info.weight) || !isEmpty(info.temperature) || !isEmpty(info.heartRate) || !isEmpty(info.respiratoryRate) || !isEmpty(info.crt) || !isEmpty(info.bcs)">
      <view class="title">体格检查</view>
      <view class="cards">
        <view class="card" :style="{ background: getBgColor() }" v-if="info.weight">
          <view class="top">
            <view class="title-num">
              <view class="title">体重</view>
              <view :class="['num', getWeightColor()]" v-if="info.weightDesc">{{ getWeightDesc() }}</view>
            </view>
            <view class="tips" @click="tipsHandle" v-if="'2' != info.petType"></view>
          </view>
          <view class="num-unit">
            <view class="num">{{ `${Number.parseFloat(info.weight)}` }}</view>
            <view class="unit">kg</view>
          </view>
          <view :class="['lines', `f${info.weightType}`]" v-if="info.weightType">
          </view>
        </view>
        <view class="card" :style="{ background: getBgColor() }" v-if="info.temperature">
          <view class="top">
            <view class="title-num">
              <view class="title">体温</view>
              <view :class="['num', getTemperatureColor()]" v-if="info.temperatureDesc">{{ getTemperatureDesc() }}
              </view>
            </view>
            <view class="tips" @click="tipsTemperatureHandle" v-if="'2' != info.petType"></view>
          </view>
          <view class="num-unit">
            <view class="num">{{ `${Number.parseFloat(info.temperature)}` }}</view>
            <view class="unit">℃</view>
          </view>
          <view :class="['lines', `t${info.temperatureType}`]" v-if="info.temperatureType"> </view>
        </view>
        <view class="card" :style="{ background: getBgColor() }" v-if="info.heartRate">
          <view class="top">
            <view class="title-num">
              <view class="title">心率</view>
              <view :class="['num', getHeartRateColor()]" v-if="info.heartRateDesc">{{ getHeartRateDesc() }}</view>
            </view>
            <view class="tips" @click="tipsHeartRateHandle" v-if="'2' != info.petType"></view>
          </view>
          <view class="num-unit">
            <view class="num">{{ `${Number.parseFloat(info.heartRate)}` }}</view>
            <view class="unit">次/分</view>
          </view>
          <view :class="['lines', `t${info.heartRateType}`]" v-if="info.heartRateType"> </view>
        </view>
        <view class="card" :style="{ background: getBgColor() }" v-if="info.respiratoryRate">
          <view class="top">
            <view class="title-num">
              <view class="title">呼吸频率</view>
              <view :class="['num', getRespiratoryRateColor()]" v-if="info.respiratoryRateDesc">{{
                getRespiratoryRateDesc() }}</view>
            </view>
            <view class="tips" @click="respiratoryRateHandle" v-if="'2' != info.petType"></view>
          </view>
          <view class="num-unit">
            <view class="num">{{ `${Number.parseFloat(info.respiratoryRate)}` }}</view>
            <view class="unit">次/分</view>
          </view>
          <view :class="['lines', `t${info.respiratoryRateType}`]" v-if="info.respiratoryRateType"> </view>
        </view>
        <view class="card" v-if="info.crt" :style="{ background: getBgColor() }">
          <view class="top">
            <view class="title-num">
              <view class="title">CRT</view>
              <view :class="['num', getCRTColor()]" v-if="info.crtDesc">{{ getCRTDesc() }}</view>
            </view>
            <!-- <view class="tips"></view> -->
          </view>
          <view class="num-unit">
            <view class="num">{{ `${Number.parseFloat(info.crt)}` }}</view>
            <view class="unit">s</view>
          </view>
          <view class="crtdes">正常值 ≤ 1.5s </view>
        </view>
        <view class="card" v-if="info.bloodPressure" :style="{ background: getBgColor() }">
          <view class="top">
            <view class="title-num">
              <view class="title">血压</view>
              <!-- <view class="num">{{ getBloodPressureDesc() }}</view> -->
            </view>
            <!-- <view class="tips"></view> -->
          </view>
          <view class="num-unit">
            <view class="num">{{ `${Number.parseFloat(info.bloodPressure)}` }}</view>
            <view class="unit">mmHG</view>
          </view>
          <view class="xydes">收缩压120~140 舒张压40~65 </view>
        </view>
      </view>

      <!-- <view class="des">
        <view class="title">检查描述：</view>
        <view class="content">耳朵外表干燥不流黄色液体了，耳朵外表干燥不流黄色液体了。</view>
      </view> -->
    </view>

    <view class="inspect" :class="[(isInspectMore || info.inspectionList.length <= 4) ? 'autoHeight' : '']"
      v-if="info.inspectionList && info.inspectionList.length">
      <view class="title-price" v-if="info.inspectionList.length">
        <view class="title">检查检验</view>
        <!-- <view class="price">合计：<span class="num">¥ 350</span></view> -->
      </view>
      <view class="contents">
        <view class="item" v-for="(    n, index    ) in     info.inspectionList    " :key="index">
          <view class="name-price">
            <view class="name">{{ n.name }}</view>
            <view class="price">{{ `x ${n.quantitiy}` }}</view>
          </view>
          <!-- <view class="line"></view>
          <view class="inspect-result">
            <text>检查结果</text>
            <view class="right"></view>
          </view> -->
        </view>
      </view>

      <view class="noMore" v-if="info.inspectionList.length > 4 && isInspectMore" @click="inspectMore">
        <text>收起全部</text>
        <view class="up"></view>
      </view>
      <view class="more" @click="inspectMore" v-if="info.inspectionList.length > 4 && !isInspectMore">
        <text>查看更多</text>
        <view class="bom"></view>
      </view>
    </view>

    <view class="disease-diagnosis" v-if="!isEmpty(info.diagLevelDesc)">
      <view class="title-diagLevelDesc">
        <view class="d-title">病情诊断</view>
        <view class="diagLevelDesc">{{ info.diagLevelDesc || '' }}</view>
      </view>

      <view class="card">
        <view class="title-num">
          <view class="title">{{ getDiagnosisNames() }}</view>
          <!-- <view class="num">一级</view> -->
        </view>
        <view class="des" v-if="info.illnessDesc">{{ info.illnessDesc }}</view>
      </view>
    </view>

    <view class="inspect" :class="[(isCFMore || info.prescriptionList.length <= 4) ? 'autoHeight' : '']"
      v-if="!isEmpty(info.prescriptionList)">
      <view class="title-price">
        <view class="title">处方</view>
        <!-- <view class="price">合计：<span class="num">¥ 350</span></view> -->
      </view>
      <view class="prescription-contents">
        <view class="item" v-for="(    n, index    ) in     info.prescriptionList    " :key="index">
          <view class="title-p">{{ n.name }}</view>
          <view class="count">{{ `x ${n.quantity}` }}</view>
          <!-- <view class="nun-price">
            <view class="num">数量：1</view>
            <view class="price">¥ 100</view>
          </view> -->
        </view>
      </view>

      <view class="noMore" v-if="info.prescriptionList.length > 4 && isCFMore" @click="CFMore">
        <text>收起全部</text>
        <view class="up"></view>
      </view>
      <view class="more" @click="CFMore" v-if="info.prescriptionList.length > 4 && !isCFMore">
        <text>查看更多</text>
        <view class="bom"></view>
      </view>
    </view>

    <view class="inspect autoHeight" v-if="!isEmpty(info.treatmentList)">
      <view class="title-price">
        <view class="title">处置</view>
        <!-- <view class="price">合计：<span class="num">¥ 350</span></view> -->
      </view>
      <view class="cz-price">
        <view class="item" v-for="(    n, index    )  in     info.treatmentList    " :key="index">
          <view class="title-p">{{ n.name }}</view>
          <view class="count">{{ `x ${n.quantity}` }}</view>
        </view>
      </view>
    </view>

    <view style="height: 130rpx"></view>

    <PhysicalExamination :isOpen.sync="isPetShow" @close="handlePopClose" :title='tipsShow.title' :des1='tipsShow.des1'
      :des2='tipsShow.des2' :petType='tipsShow.petType' />
    <FatThinStandard :isOpen.sync="isFatThinShow" @close="handleFatThinClose" :weightType='fatThinShow.weightType'
      :petType='fatThinShow.petType' />
  </view>
</template>
<script>
import { mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
import PhysicalExamination from "./components/physicalExamination/index.vue";
import FatThinStandard from "./components/fatThinStandard/index.vue";
import { medicalReportDetail } from "@/api/reservation";
export default {
  name: "PetMedicalReport",
  components: { PhysicalExamination, FatThinStandard },
  data() {
    return {
      summary:
        "控制猫咪体重，增加水分摄入，可以在食物中加入XXX等，增加每日运动，增加每日运动，增加喂食鱼油～增加喂食～控制猫咪体重，增加水分摄入，可以在食物中加入XXX等，增加每日运动，增加每日运动，增加喂食鱼油～增加喂食～",
      expande: true,
      needShowExpande: false,
      opac: false,
      isInspectMore: false,
      isCFMore: false,
      isPetShow: false,
      isFatThinShow: false,
      // info: "",
      tipsShow: {},
      fatThinShow: {},
      info: {},
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },

  async onLoad(option) {
    console.log("petMedicalReport option: ", option);

    const res = await medicalReportDetail({
      registrationId: option.registrationId,// "9fb8f3a0-5148-e596-3afc-3a112e095adc",
      // diagId: "9c2d6be1-7af8-88fb-74a8-3a112e0962f6",
      diagType: option.diagType
    });
    console.log("medicalReportDetail res: ", res);
    this.info = res.data.data;


    uni.setNavigationBarTitle({
      title: this.info.petName ? `${this.info.petName}的就诊报告` : "就诊报告",
    });

    this.summaryHeight();

    display_report({
      display_name: "visit_report_display",
      object_type: "petpage",
    });
  },
  async onShow() {



  },
  methods: {
    isEmpty(val) {
      if(!val || !val?.length) {
        return true;
      } else {
        return false;
      }
    },
    tipsHandle() {
      this.isFatThinShow = true;
      this.fatThinShow = {}
      this.fatThinShow.weightType = this.info.weightType
      this.fatThinShow.petType = this.info.petType
    },
    tipsTemperatureHandle() {
      this.tipsShow = {}
      this.tipsShow.title = '体温表'
      this.tipsShow.des1 = '0' == this.info.petType ? '标准体温：38.2-39.5°C' : '标准体温：38-39.5°C'
      this.tipsShow.des2 = '0' == this.info.petType ? '标准体温：38-39.5°C' : '标准体温：37.5-39.2°C'
      this.tipsShow.petType = this.info.petType
      this.isPetShow = true;
    },

    tipsHeartRateHandle() {
      this.tipsShow = {}
      this.tipsShow.title = '心率表'
      this.tipsShow.des1 = '0' == this.info.petType ? '标准心率：140-180次/分' : '标准心率：80-140次/分'
      this.tipsShow.des2 = '0' == this.info.petType ? '标准心率：120-160次/分' : '标准心率：70-120次/分'
      this.tipsShow.petType = this.info.petType
      this.isPetShow = true;
    },

    respiratoryRateHandle() {
      this.tipsShow = {}
      this.tipsShow.title = '呼吸频率'
      this.tipsShow.des1 = '0' == this.info.petType ? '标准呼吸频率：15-30次/分' : '标准呼吸频率：15-30次/分'
      this.tipsShow.des2 = '0' == this.info.petType ? '标准呼吸频率：20-30次/分' : '标准呼吸频率：15-30次/分'
      this.tipsShow.petType = this.info.petType
      this.isPetShow = true;
    },

    getBgColor() {
      let colors = ['#F1F8FF', '#FFFAEE', '#FDF5FF', '#FFF1F1']
      let num = Math.floor(Math.random() * (colors.length));
      return colors[num]
    },
    getDiagnosisNames() {
      // console.log('getDiagnosisNames ', this.info.diagnosisList)
      if (this.info.diagnosisList && this.info.diagnosisList.length) {
        return this.info.diagnosisList.map((i) => {
          return i.name;
        }).join("、");
      } else {
        return ''
      }
    },
    getWeightDesc() {
      let pk = { 1: "消瘦", 2: "偏瘦", 3: "标准", 4: "偏胖", 5: "肥胖" };
      return this.info.weightDesc; //pk[this.info.weightType];
    },
    getWeightColor() {
      let color = { 1: "blue", 2: "blue", 3: "green", 4: "red", 5: "red" };
      return color[this.info.weightType];
    },
    getTemperatureDesc() {
      let pk = { 1: "偏低", 2: "标准", 3: "偏高" };
      return this.info.temperatureDesc//pk[this.info.temperatureType];
    },
    getTemperatureColor() {
      let pk = { 1: "blue", 2: "green", 3: "red" };
      return pk[this.info.temperatureType];
    },
    getHeartRateDesc() {
      let pk = { 1: "偏低", 2: "标准", 3: "偏高" };
      return this.info.heartRateDesc//pk[this.info.heartRateType];
    },
    getHeartRateColor() {
      let pk = { 1: "blue", 2: "green", 3: "red" };
      return pk[this.info.heartRateType];
    },

    getRespiratoryRateDesc() {
      let pk = { 1: "偏低", 2: "正常", 3: "偏高" };
      return this.info.respiratoryRateDesc//pk[this.info.respiratoryRateType];
    },
    getRespiratoryRateColor() {
      let pk = { 1: "blue", 2: "green", 3: "red" };
      return pk[this.info.respiratoryRateType];
    },

    getCRTDesc() {
      return this.info.crtDesc// 1 == this.info.crtType ? "正常" : "异常";
    },
    getCRTColor() {
      return 1 == this.info.crtType ? "green" : "red";
    },


    getNormalCRT() {
      return this.info.normalCRT ? "正常" : "异常";
    },
    handleFatThinClose() {
      this.isFatThinShow = false;
    },
    handlePopClose() {
      this.isPetShow = false;
    },
    showPhysicalInfo() {
      this.isPetShow = true;
    },
    CFMore() {
      this.isCFMore = !this.isCFMore;
    },
    inspectMore() {
      this.isInspectMore = !this.isInspectMore;
    },
    expandeClick() {
      this.expande = !this.expande;
    },
    goAi() {
      console.log("goAi ");
      action_report({
        action_name: "visit_report_ai_click",
        module_name: "petpage",
      });
      //萌宠咨询
      let str = `${this.getDiagnosisNames()}怎么办`;
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/tool/inquiryChat/ai?inquiryContent=${str}`,
      });
      //#endif

      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/chatPageAi/index?messText=${str}`,
      });
      //#endif


    },
    summaryHeight() {

      this.$nextTick(async () => {
        // if (!this.info.doctorsAdvice) {
        //   return
        // }
        let lineHeight = 22;
        const query = uni.createSelectorQuery().in(this);
        let ret = await this.getSelectorQueryRect(query, `#content`, true);
        console.log("summaryHeight11 ", ret, this.expande);
        if (ret && ret.length) {
          if (ret[0].height > lineHeight * 3) {
            this.expande = false;
            this.needShowExpande = true;
          } else {
            this.expande = true;
          }
          this.opac = true;
          console.log("summaryHeight3 ", ret, this.expande, this.needShowExpande);
        } else {
          this.expande = true;
          this.opac = true;
        }

      });
    },

    getSelectorQueryRect(query, selector, all = false) {
      return new Promise((resolve, reject) => {
        if (all) {
          query
            .selectAll(selector)
            .boundingClientRect((rects) => {
              resolve(rects);
            })
            .exec();
        } else {
          query
            .select(selector)
            .boundingClientRect((rect) => {
              resolve(rect);
            })
            .exec();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
