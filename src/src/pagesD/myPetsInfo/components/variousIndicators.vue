<template>
  <view>
    <view class="widght-info" v-if="petId">
      <view class="img-title">
        <view class="img"></view>
        <view class="title">体重</view>
      </view>
      <view v-if="weightAnalysisData.type">
        <view
          class="widght-number"
          v-if="weightAnalysisData.type != 'NO_RECORD'"
        >
          <view class="wn-left">
            <view class="wn-left-title">体重</view>
            <view class="numberUnit">
              <view class="number">{{
                weightAnalysisData.currentWeight
                  ? weightAnalysisData.currentWeight
                  : "-"
              }}</view>
              <view class="unit">kg</view>
            </view>
            <view class="des"
              >{{
                weightAnalysisData.currentWeight
                  ? `更新时间：${weightAnalysisData.updateTime}`
                  : ""
              }}
            </view>
          </view>
          <view class="wn-right" v-if="weightAnalysisData.isShowShape != false">
            <view class="wn-right-title">体型判断</view>
            <view class="jd-img">
              <view class="jd">{{
                weightAnalysisData.currentShape
                  ? weightAnalysisData.currentShape
                  : "未知"
              }}</view>
              <view
                class="jdImg f1"
                v-if="weightAnalysisData.currentShape == '瘦弱'"
              ></view>
              <view
                class="jdImg f2"
                v-if="weightAnalysisData.currentShape == '偏瘦'"
              ></view>
              <view
                class="jdImg f3"
                v-if="weightAnalysisData.currentShape == '标准'"
              ></view>
              <view
                class="jdImg f4"
                v-if="weightAnalysisData.currentShape == '偏胖'"
              ></view>
              <view
                class="jdImg f5"
                v-if="weightAnalysisData.currentShape == '肥胖'"
              ></view>
            </view>
            <!-- #ifdef H5 -->
            <view class="edit" v-if="weightAnalysisData.sourceType == 'DAILY'">
              <view class="txt1">{{
                weightAnalysisData.currentWeight ? "分析有误？" : "没有数据？"
              }}</view>
              <view class="txt2" @click="nowCheck()">{{
                weightAnalysisData.currentWeight ? "重新选择" : "立即选择"
              }}</view>
              <view class="editImg"></view>
            </view>
            <!-- #endif -->
          </view>
        </view>
        <view class="no-widght" v-else>
          <view class="no-records">暂无记录</view>
          <!-- #ifdef H5 -->
          <view class="btn" @click="goRecords(1)">去记录</view>
          <!-- #endif -->
        </view>
      </view>
    </view>
    <view class="widght-tendency">
      <view class="up">
        <view class="up-title">体重趋势</view>
        <view class="right">
          <!-- <view class="txt">体重记录</view>
          <view class="img"></view> -->
        </view>
      </view>
      <view class="widght-unit">单位：kg</view>

      <view class="charts1" v-if="1 == activeTabIndex">
        <!-- #ifdef H5 -->
        <canvas
          canvas-id="indicatorsid"
          id="indicatorsid"
          class="charts"
          disable-scroll="true"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        />
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <canvas
          canvas-id="indicatorsid"
          id="indicatorsid"
          type="2d"
          class="charts"
          :onTouch="true"
          disable-scroll="true"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        />
        <!-- @touchend="tap" -->
        <!-- #endif -->
      </view>
      <view class="noChartsData">{{
        null == weightChartData.data ? "无数据记录" : ""
      }}</view>
      <!-- <view class="hasChartsData" v-else></view> -->
    </view>

    <view
      class="other-tendency"
      v-if="
        info.temperature ||
        info.heartRate ||
        info.respiratoryRate ||
        info.crt ||
        info.bcs
      "
    >
      <view class="title-date">
        <view class="title">其他指标</view>
        <view class="date">{{ `此数据来自${info.createTime}就诊报告` }}</view>
      </view>
      <view
        class="physique"
        v-if="
          info.temperature ||
          info.heartRate ||
          info.respiratoryRate ||
          info.crt ||
          info.bcs
        "
      >
        <view class="cards">
          <view
            class="card"
            :style="{ background: getBgColor() }"
            v-if="info.temperature"
          >
            <view class="top">
              <view class="title-num">
                <view class="title">体温</view>
                <view
                  :class="['num', getTemperatureColor()]"
                  v-if="info.temperatureDesc"
                  >{{ getTemperatureDesc() }}
                </view>
              </view>
              <view
                class="tips"
                @click="tipsTemperatureHandle"
                v-if="'2' != info.petType"
              ></view>
            </view>
            <view class="num-unit">
              <view class="num">{{
                `${Number.parseFloat(info.temperature)}`
              }}</view>
              <view class="unit">℃</view>
            </view>
            <view
              :class="['lines', `t${info.temperatureType}`]"
              v-if="info.temperatureType"
            >
            </view>
          </view>
          <view
            class="card"
            :style="{ background: getBgColor() }"
            v-if="info.heartRate"
          >
            <view class="top">
              <view class="title-num">
                <view class="title">心率</view>
                <view
                  :class="['num', getHeartRateColor()]"
                  v-if="info.heartRateDesc"
                  >{{ getHeartRateDesc() }}</view
                >
              </view>
              <view
                class="tips"
                @click="tipsHeartRateHandle"
                v-if="'2' != info.petType"
              ></view>
            </view>
            <view class="num-unit">
              <view class="num">{{
                `${Number.parseFloat(info.heartRate)}`
              }}</view>
              <view class="unit">次/分</view>
            </view>
            <view
              :class="['lines', `t${info.heartRateType}`]"
              v-if="info.heartRateType"
            >
            </view>
          </view>
          <view
            class="card"
            :style="{ background: getBgColor() }"
            v-if="info.respiratoryRate"
          >
            <view class="top">
              <view class="title-num">
                <view class="title">呼吸频率</view>
                <view
                  :class="['num', getRespiratoryRateColor()]"
                  v-if="info.respiratoryRateDesc"
                  >{{ getRespiratoryRateDesc() }}</view
                >
              </view>
              <view
                class="tips"
                @click="respiratoryRateHandle"
                v-if="'2' != info.petType"
              ></view>
            </view>
            <view class="num-unit">
              <view class="num">{{
                `${Number.parseFloat(info.respiratoryRate)}`
              }}</view>
              <view class="unit">次/分</view>
            </view>
            <view
              :class="['lines', `t${info.respiratoryRateType}`]"
              v-if="info.respiratoryRateType"
            >
            </view>
          </view>
          <view
            class="card"
            v-if="info.crt"
            :style="{ background: getBgColor() }"
          >
            <view class="top">
              <view class="title-num">
                <view class="title">CRT</view>
                <view :class="['num', getCRTColor()]" v-if="info.crtDesc">{{
                  getCRTDesc()
                }}</view>
              </view>
              <!-- <view class="tips"></view> -->
            </view>
            <view class="num-unit">
              <view class="num">{{ `${Number.parseFloat(info.crt)}` }}</view>
              <view class="unit">s</view>
            </view>
            <view class="crtdes">正常值 ≤ 1.5s </view>
          </view>
          <view
            class="card"
            v-if="info.bcs"
            :style="{ background: getBgColor() }"
          >
            <view class="top">
              <view class="title-num">
                <view class="title">血压</view>
                <!-- <view class="num">{{ getBloodPressureDesc() }}</view> -->
              </view>
              <!-- <view class="tips"></view> -->
            </view>
            <view class="num-unit">
              <view class="num">{{ `${Number.parseFloat(info.bcs)}` }}</view>
              <view class="unit">mmHG</view>
            </view>
            <view class="xydes">收缩压120~140 舒张压40~65 </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 
    <view class="record-weight" @click="recordWeightHandle">
      <view class="btn">
        <view class="txt">记录体重</view>
      </view>
    </view> -->

    <view style="height: 225rpx"></view>

    <!-- #ifdef H5 -->
    <view class="buttomBtn">
      <!-- <view :class="['view-btn', 0 == btnIdx ? 'check' : '']" @click="checkBtn(0)" style="margin-right:27rpx">查看明细
      </view> -->
      <view :class="['view-btn check']" @click="goRecords(2)">记录体重</view>
    </view>

    <!-- #endif -->

    <PhysicalExamination
      :isOpen.sync="isPetShow"
      @close="handlePopClose"
      :title="tipsShow.title"
      :des1="tipsShow.des1"
      :des2="tipsShow.des2"
      :petType="tipsShow.petType"
    />
  </view>
</template>
<script>
// import ItemStatics from "./itemstatics.vue";
import uCharts from "@qiun/ucharts";
import dayjs from "dayjs";
import {
  GET_WEIGHT_ANALYSIS,
  GET_WEIGHT_CHART,
  GET_INDICATOR,
} from "@/api/petinfo.js";
import PhysicalExamination from "./physicalExamination/index.vue";
import { action_report } from "@/utils/track";

var uChartsInstance = {};
export default {
  components: {
    PhysicalExamination,
    // ItemStatics
  },
  props: {
    petId: {
      type: String,
      default: "",
    },
    petList: {
      type: Array,
      default: [],
    },
    reFreshTime: {
      type: String,
      default: "",
    },
    activeTabIndex: {
      type: Number,
    },
    // data: {
    //   type: Object,
    //   default: {}
    // },
    // petList: {
    //   type: Array,
    //   default: []
    // }
  },
  data() {
    return {
      info: {},
      cWidth: 650,
      cHeight: 500,
      weightAnalysisData: {},
      indicatorData: {},
      isPetShow: false,
      tipsShow: {},
      weightChartData: {},
      ctx: "",
      tbUrl: "",
      pixelRatio: 2,
    };
  },

  watch: {
    petId: {
      handler(val, oldVal) {
        console.log("petId val ", val);
        console.log("petId oldVal ", oldVal);
        this.getSerDate();
      },
      immediate: true,
      deep: true,
    },
    reFreshTime: {
      handler(val, oldVal) {
        console.log("reFreshTime val ", val);
        console.log("reFreshTime oldVal ", oldVal);
        if (val) {
          this.getSerDate();
        }
      },
      immediate: true,
      deep: true,
    },
    activeTabIndex: {
      handler(val, oldVal) {
        console.log("activeTabIndex val ", val);
        console.log("activeTabIndex oldVal ", oldVal);
        console.log(this.ctx);
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    console.log(this.ctx, "当前ctx实例");
    //这里的 750 对应 css .charts 的 width
    this.cWidth = uni.upx2px(651);
    //这里的 500 对应 css .charts 的 height
    this.cHeight = uni.upx2px(500);

    this.pixelRatio = uni.getSystemInfoSync().pixelRatio;

    // this.getSerDate()
  },
  methods: {
    nowCheck() {
      // let listJson = JSON.stringify(this.weightAnalysisData.shapes)
      let curpet = this.petList.filter((item) => item.id == this.petId);
      // console.log('curpet0: ', this.petList)
      // console.log('curpet1: ', this.petId)
      // console.log('curpet2: ', curpet)
      let str = `/mine/pet/select/pet/body/type?petId=${this.petId}&parentCategoryId=${curpet[0].petCategoryId}`;
      // console.log('str: ', str)
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: str,
      });

      //宠物档案_指标tab_重新选择按钮_点击
      // #endif
      action_report({
        action_name: "petfiles_index_reselect_click",
        module_name: "petfiles",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
    },

    getSerDate() {
      console.log("variousindicators getSerDate petId : ", this.petId);
      this.getWeightAnalysis();
      this.getWeightChart();
      this.getIndicator();
      this.getServerData();
    },

    async getWeightAnalysis() {
      const res = await GET_WEIGHT_ANALYSIS(this.petId);
      this.weightAnalysisData = res.data;
      console.log("weightAnalysisData : ", this.weightAnalysisData);
    },

    async getWeightChart() {
      const res = await GET_WEIGHT_CHART({ petId: this.petId });
      this.weightChartData = res.data;
      console.log("weightChartData : ", this.weightChartData);

      let resd = { categories: [], series: [{ name: "", data: [] }] };
      let data = this.weightChartData.data;
      if (data && data.length) {
        data.reverse().forEach((value, index) => {
          let timeStr = dayjs(value.recordTime).format("MM/DD");
          resd.categories.push(timeStr);
          resd.series[0].data.push(Number(value.weight));
        });
        console.log("resd:", resd);
      } else {
      }

      setTimeout(() => {
        // #ifdef MP-WEIXIN
        this.drawCharts2d("indicatorsid", resd);
        // #endif

        // #ifdef H5
        this.drawCharts("indicatorsid", resd);
        // #endif
      }, 500);
    },

    async getIndicator() {
      const res = await GET_INDICATOR(this.petId);
      this.indicatorData = res.data;
      console.log("getIndicator : ", this.indicatorData);
      this.info = this.indicatorData;
    },

    getServerData() {
      //模拟从服务器获取数据时的延时
      // setTimeout(() => {
      //   //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      //   let res = {
      //     categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
      //     series: [
      //       {
      //         name: "成交量A",
      //         data: [35, 8, 25, 37, 4, 20]
      //       }
      //     ]
      //   };
      //   this.drawCharts('indicatorsid', res);
      // }, 500);
    },
    drawCharts(id, data) {
      const ctx = uni.createCanvasContext(id, this);
      uChartsInstance[id] = new uCharts({
        type: "area",
        context: ctx,
        width: this.cWidth,
        height: this.cHeight,
        categories: data.categories,
        series: data.series,
        animation: false,
        background: "#FFFFFF",
        color: [
          "#FEE900",
          "#91CB74",
          "#FAC858",
          "#EE6666",
          "#73C0DE",
          "#3CA272",
          "#FC8452",
          "#9A60B4",
          "#ea7ccc",
        ],
        padding: [15, 15, 0, 15],
        enableScroll: true,
        legend: { show: false },
        xAxis: {
          disableGrid: true,
          itemCount: 5,
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          data: [
            {
              min: 0,
            },
          ],
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.2,
            addLine: true,
            width: 2,
            gradient: true,
            activeType: "hollow",
          },
        },
      });
    },
    drawCharts2d(id, data) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#" + id)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res[0]) {
            const canvas = res[0].node;
            const ctx = canvas.getContext("2d");
            canvas.width = res[0].width * this.pixelRatio;
            canvas.height = res[0].height * this.pixelRatio;
            uChartsInstance[id] = new uCharts({
              type: "area",
              context: ctx,
              width: this.cWidth * this.pixelRatio,
              height: this.cHeight * this.pixelRatio,
              categories: data.categories,
              series: data.series,
              pixelRatio: this.pixelRatio,
              animation: false,
              background: "#FFFFFF",
              color: [
                "#FEE900",
                "#91CB74",
                "#FAC858",
                "#EE6666",
                "#73C0DE",
                "#3CA272",
                "#FC8452",
                "#9A60B4",
                "#ea7ccc",
              ],
              padding: [15, 15, 0, 15],
              legend: { show: false },
              enableScroll: true,
              xAxis: {
                disableGrid: true,
                itemCount: 5,
                // scrollShow: true
              },
              yAxis: {
                gridType: "dash",
                dashLength: 2,
                data: [
                  {
                    min: 0,
                  },
                ],
              },
              extra: {
                area: {
                  type: "curve",
                  opacity: 0.2,
                  addLine: true,
                  width: 2,
                  gradient: true,
                  activeType: "hollow",
                },
              },
            });
          } else {
            console.error("[uCharts]: 未获取到 context");
          }
        });
    },

    touchstart(e) {
      console.log("touchstart ======= ");
      uChartsInstance[e.target.id].scrollStart(e);
    },
    touchmove(e) {
      uChartsInstance[e.target.id].scroll(e);
    },
    touchend(e) {
      uChartsInstance[e.target.id].scrollEnd(e);
      uChartsInstance[e.target.id].touchLegend(e);
      uChartsInstance[e.target.id].showToolTip(e);
    },

    tap(e) {
      uChartsInstance[e.target.id].touchLegend(e);
      // uChartsInstance[e.target.id].showToolTip(e);
    },
    recordWeightHandle() {},
    goRecords(index) {
      // #ifdef H5
      this.$dsBridge.call(
        "goPetRecord",
        JSON.stringify({
          petId: this.petId,
          activeTabIndex: 1,
        })
      );
      // #endif

      if (1 == index) {
        //宠物档案_指标tab_记录体重按钮_点击
        action_report({
          action_name: "petfiles_index_recordweight_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      } else {
        //宠物档案_指标tab_体重记录入口_点击
        action_report({
          action_name: "petfiles_index_weightentry_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      }
    },
    tipsHandle() {
      this.isFatThinShow = true;
      this.fatThinShow = {};
      this.fatThinShow.weightType = this.info.weightType;
      this.fatThinShow.petType = this.info.petType;
    },
    tipsTemperatureHandle() {
      this.tipsShow = {};
      this.tipsShow.title = "体温表";
      this.tipsShow.des1 =
        "0" == this.info.petType
          ? "标准体温：38.2-39.5°C"
          : "标准体温：38-39.5°C";
      this.tipsShow.des2 =
        "0" == this.info.petType
          ? "标准体温：38-39.5°C"
          : "标准体温：37.5-39.2°C";
      this.tipsShow.petType = this.info.petType;
      this.isPetShow = true;
    },

    tipsHeartRateHandle() {
      this.tipsShow = {};
      this.tipsShow.title = "心率表";
      this.tipsShow.des1 =
        "0" == this.info.petType
          ? "标准心率：140-180次/分"
          : "标准心率：80-140次/分";
      this.tipsShow.des2 =
        "0" == this.info.petType
          ? "标准心率：120-160次/分"
          : "标准心率：70-120次/分";
      this.tipsShow.petType = this.info.petType;
      this.isPetShow = true;
    },

    respiratoryRateHandle() {
      this.tipsShow = {};
      this.tipsShow.title = "呼吸频率";
      this.tipsShow.des1 =
        "0" == this.info.petType
          ? "标准呼吸频率：15-30次/分"
          : "标准呼吸频率：15-30次/分";
      this.tipsShow.des2 =
        "0" == this.info.petType
          ? "标准呼吸频率：20-30次/分"
          : "标准呼吸频率：15-30次/分";
      this.tipsShow.petType = this.info.petType;
      this.isPetShow = true;
    },

    handlePopClose() {
      this.isPetShow = false;
    },
    showPhysicalInfo() {
      this.isPetShow = true;
    },

    getBgColor() {
      // let colors = ['#F1F8FF', '#FFFAEE', '#FDF5FF', '#FFF1F1']
      // let num = Math.floor(Math.random() * (colors.length));
      // return colors[num]

      return "#ffffff";
    },
    getDiagnosisNames() {
      // console.log('getDiagnosisNames ', this.info.diagnosisList)
      if (this.info.diagnosisList && this.info.diagnosisList.length) {
        return this.info.diagnosisList
          .map((i) => {
            return i.name;
          })
          .join("、");
      } else {
        return "";
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
      return this.info.temperatureDesc; //pk[this.info.temperatureType];
    },
    getTemperatureColor() {
      let pk = { 1: "blue", 2: "green", 3: "red" };
      return pk[this.info.temperatureType];
    },
    getHeartRateDesc() {
      let pk = { 1: "偏低", 2: "标准", 3: "偏高" };
      return this.info.heartRateDesc; //pk[this.info.heartRateType];
    },
    getHeartRateColor() {
      let pk = { 1: "blue", 2: "green", 3: "red" };
      return pk[this.info.heartRateType];
    },

    getRespiratoryRateDesc() {
      let pk = { 1: "偏低", 2: "正常", 3: "偏高" };
      return this.info.respiratoryRateDesc; //pk[this.info.respiratoryRateType];
    },
    getRespiratoryRateColor() {
      let pk = { 1: "blue", 2: "green", 3: "red" };
      return pk[this.info.respiratoryRateType];
    },

    getCRTDesc() {
      return this.info.crtDesc; // 1 == this.info.crtType ? "正常" : "异常";
    },
    getCRTColor() {
      return 1 == this.info.crtType ? "green" : "red";
    },

    getNormalCRT() {
      return this.info.normalCRT ? "正常" : "异常";
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";

.widght-info {
  width: 692rpx;
  height: 298rpx;
  background: #ffffff;
  border-radius: 23rpx;
  margin: 0rpx 29rpx;
  padding: 30rpx;
}

.img-title {
  display: flex;
  justify-content: flex-start;

  .img {
    width: 38rpx;
    height: 38rpx;
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/weight/wIon.png"
    );
    margin-right: 15rpx;
  }

  .title {
    height: 42rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 31rpx;
    color: #1f1f1f;
    line-height: 42rpx;
    text-align: left;
    font-style: normal;
  }
}

.widght-number {
  display: flex;
  justify-content: space-between;
  margin-top: 38rpx;

  .wn-left {
    // width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .wn-left-title {
      height: 35rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: #1f1f1f;
      line-height: 35rpx;
      text-align: left;
      font-style: normal;
    }

    .numberUnit {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      margin-top: 11rpx;
      margin-bottom: 15rpx;

      .number {
        height: 69rpx;
        font-family: D-DIN, D-DIN;
        font-weight: bold;
        font-size: 69rpx;
        color: #1f1f1f;
        line-height: 75rpx;
        text-align: left;
        font-style: normal;
      }

      .unit {
        height: 35rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 25rpx;
        color: #666666;
        line-height: 35rpx;
        text-align: left;
        font-style: normal;
        margin-left: 10rpx;
      }
    }

    .des {
      height: 31rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 23rpx;
      color: #999999;
      line-height: 31rpx;
      text-align: left;
      font-style: normal;
    }
  }

  .wn-right {
    // width: 50%;
    display: flex;
    flex-direction: column;

    .wn-right-title {
      width: 100rpx;

      height: 35rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: #1f1f1f;
      line-height: 35rpx;
      text-align: left;
      font-style: normal;
    }

    .jd-img {
      display: flex;
      align-items: flex-end;

      .jd {
        height: 69rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 54rpx;
        color: #1f1f1f;
        line-height: 69rpx;
        text-align: left;
        font-style: normal;
        margin-right: 12rpx;
        margin-top: 12rpx;
      }

      .jdImg {
        width: 152rpx;
        height: 17rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/weight/w-bz-3.png"
        );

        &.f1 {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_1.png"
          );
        }

        &.f2 {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_2.png"
          );
        }

        &.f3 {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_3.png"
          );
        }

        &.f4 {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_4.png"
          );
        }

        &.f5 {
          @include bg(
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_5.png"
          );
        }
      }
    }

    .edit {
      display: flex;
      flex-direction: row;
      justify-content: start;
      margin-top: 15rpx;
      align-items: center;

      .txt1 {
        height: 31rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 23rpx;
        color: #999999;
        line-height: 31rpx;
        text-align: left;
        font-style: normal;
      }

      .txt2 {
        height: 31rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 23rpx;
        color: #ff8315;
        line-height: 31rpx;
        text-align: left;
        font-style: normal;
      }

      .editImg {
        width: 23rpx;
        height: 23rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/weight/editImg.png"
        );
      }
    }
  }
}

.no-widght {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .no-records {
    height: 38rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 27rpx;
    color: #666666;
    line-height: 38rpx;
    text-align: left;
    font-style: normal;
    margin-top: 42rpx;
    margin-bottom: 19rpx;
  }

  .btn {
    width: 227rpx;
    height: 73rpx;
    background: #fee900;
    border-radius: 37rpx;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 27rpx;
    color: #1f1f1f;
    line-height: 38rpx;
    text-align: left;
    font-style: normal;
  }
}

.widght-tendency {
  width: 692rpx;
  // height: 523rpx;
  background: #ffffff;
  border-radius: 23rpx;
  margin: 23rpx 29rpx 0rpx 29rpx;
  padding: 30rpx 30rpx 0rpx 30rpx;

  .up {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .up-title {
      height: 42rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      font-size: 31rpx;
      color: #1f1f1f;
      line-height: 42rpx;
      text-align: left;
      font-style: normal;
    }

    .right {
      display: flex;
      align-items: center;

      .txt {
        height: 35rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 25rpx;
        color: #999999;
        line-height: 35rpx;
        text-align: left;
        font-style: normal;
      }

      .img {
        width: 23rpx;
        height: 23rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/weight/zhankai.png"
        );
      }
    }
  }
}

.other-tendency {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 38rpx 30rpx 30rpx 30rpx;

  .title-date {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .title {
      height: 42rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 31rpx;
      color: #1f1f1f;
      line-height: 42rpx;
      text-align: left;
      font-style: normal;
    }

    .date {
      height: 35rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: #999999;
      line-height: 35rpx;
      text-align: right;
      font-style: normal;
    }
  }
}

.physique {
  width: 719rpx;
  // background: #FFFFFF;
  border-radius: 15rpx;
  margin-top: 19rpx;
  padding: 0rpx 0rpx 30rpx 0rpx;

  .title {
    height: 46rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 35rpx;
    color: #1f1f1f;
    line-height: 46rpx;
    text-align: left;
    font-style: normal;
    margin-bottom: 19rpx;
  }

  .cards {
    display: flex;
    flex-flow: wrap;

    .card {
      width: 333rpx;
      height: 173rpx;
      background: #ffffff;
      border-radius: 15rpx;

      // width: 329rpx;
      // height: 173rpx;
      // background: #F1F8FF;
      // border-radius: 15rpx;
      margin-right: 23rpx;
      margin-bottom: 15rpx;
      padding: 15rpx;

      display: flex;
      flex-direction: column;

      .top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .title-num {
          display: flex;
          flex-direction: row;
          justify-content: start;

          .title {
            height: 35rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 27rpx;
            color: #1f1f1f;
            line-height: 38rpx;
            text-align: left;
            font-style: normal;
            margin-right: 15rpx;
          }

          .num {
            width: 65rpx;
            height: 35rpx;
            background: #6ddc5c;
            border-radius: 19rpx 19rpx 19rpx 0rpx;

            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 23rpx;
            color: #ffffff;
            line-height: 35rpx;
            text-align: center;
            font-style: normal;

            margin: 2rpx 9rpx;

            &.blue {
              background: #40aefa;
            }

            &.green {
              background: #6ddc5c;
            }

            &.red {
              background: #fc522c;
            }
          }
        }

        .tips {
          width: 35rpx;
          height: 35rpx;
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/why.png");
          background-size: cover;
        }
      }

      .num-unit {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .num {
          height: 54rpx;
          font-family: D-DIN, D-DIN;
          font-weight: bold;
          font-size: 54rpx;
          color: #1f1f1f;
          line-height: 58rpx;
          text-align: left;
          font-style: normal;
          margin-right: 8rpx;
        }

        .unit {
          height: 38rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 27rpx;
          color: #666666;
          line-height: 38rpx;
          text-align: left;
          font-style: normal;
        }
      }

      .lines {
        width: 256rpx;
        height: 16rpx;
        background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_1.png");
        background-size: 100% 100%;
        margin-top: 10rpx;

        &.f1 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_1.png");
          background-size: cover;
        }

        &.f2 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_2.png");
          background-size: cover;
        }

        &.f3 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_3.png");
          background-size: cover;
        }

        &.f4 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_4.png");
          background-size: cover;
        }

        &.f5 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/five_5.png");
          background-size: cover;
        }

        &.t1 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/three_1.png");
          background-size: cover;
          width: 188rpx;
        }

        &.t2 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/three_2.png");
          background-size: cover;
          width: 188rpx;
        }

        &.t3 {
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petMedicalRepport/three_3.png");
          background-size: cover;
          width: 188rpx;
        }
      }

      .crtdes {
        height: 31rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 23rpx;
        color: #666666;
        line-height: 31rpx;
        text-align: left;
        font-style: normal;
      }

      .xydes {
        height: 31rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 21rpx;
        color: #999999;
        line-height: 31rpx;
        text-align: left;
        font-style: normal;
      }
    }

    .card-weight {
    }

    .card-temperature {
    }

    .card-heart-rate {
    }

    .card-breath {
    }

    .card-crt {
    }

    .card-bood-pressure {
    }
  }

  .des {
    display: flex;
    justify-content: start;

    .title {
      width: 135rpx;
      height: 38rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 27rpx;
      color: #666666;
      line-height: 38rpx;
      text-align: left;
      font-style: normal;
    }

    .content {
      width: 523rpx;
      // height: 77rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 27rpx;
      color: #666666;
      line-height: 38rpx;
      text-align: left;
      font-style: normal;
    }
  }
}

.record-weight {
  width: 100%;
  height: 177rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  .btn {
    width: 635rpx;
    height: 96rpx;
    background: #fee900;
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .txt {
      height: 38rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 35rpx;
      color: #000000;
      line-height: 38rpx;
      text-align: center;
      font-style: normal;
    }
  }
}

.widght-unit {
  height: 33rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 23rpx;
  color: #999999;
  line-height: 33rpx;
  text-align: left;
  font-style: normal;
  margin-top: 38rpx;
  margin-bottom: 20rpx;
}

.charts {
  width: 650rpx;
  height: 623rpx;
  margin-left: -20rpx;
  margin-bottom: 20rpx;
}

.charts-img {
  width: 692rpx;
  height: 623rpx;
  object-fit: cover;
}

.buttomBtn {
  width: 750rpx;
  height: 177rpx;
  background: #ffffff;
  justify-content: center;
  align-items: center;

  display: flex;
  position: fixed;
  bottom: 0rpx;

  .view-btn {
    width: 635rpx;
    height: 85rpx;
    border-radius: 42rpx;
    // border: 2rpx solid #E6E6E6;
    align-items: center;
    display: flex;
    flex-direction: center;
    justify-content: center;

    margin-top: -45rpx;

    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 31rpx;
    color: #666666;
    line-height: 42rpx;
    text-align: center;
    font-style: normal;

    &.check {
      background: #fee900;
      color: #1f1f1f;
    }
  }
}

.noChartsData {
  width: 100%;
  height: 50rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 23rpx;
  color: #999999;
  line-height: 33rpx;
  text-align: center;
  font-style: normal;
  margin-top: -140rpx;
}

// .hasChartsData {
//   width: 100%;
//   height: 33rpx;
//   margin-top: -120rpx;
// }
</style>
