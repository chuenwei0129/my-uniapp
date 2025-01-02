<template>
  <view class="check-frame">
    <view class="check-info">
      <view class="top">
        <view class="img-zc">
          <view class="img"></view>
          <view class="zc">支出</view>
        </view>
        <view class="all-img" @click="disburseClick()">
          <view class="all">{{ disburseStr1 }}</view>
          <view class="img"></view>
        </view>
      </view>

      <view class="zc-title">{{ disburseStr3 }}</view>
      <view class="zc-price">{{ `¥ ${billData.consumeTotal || "0"}` }}</view>
      <view class="zc-count">{{ `共${billData.consumeCount || "0"}笔` }}</view>
    </view>

    <view class="check-tendency">
      <view class="up">
        <view class="up-title">支出分类</view>
        <view
          class="right"
          @click="viewAll()"
          v-if="billData && billData.data && billData.data.length"
        >
          <view class="txt">{{ disburseStr2 }}</view>
          <view class="img"></view>
        </view>
      </view>
      <!-- <view class="widght-unit">单位：kg</view> -->

      <view
        class="charts1"
        v-if="
          2 == activeTabIndex &&
          billData &&
          billData.data &&
          billData.data.length
        "
      >
        <!-- #ifdef H5 -->
        <canvas
          canvas-id="checkid"
          id="checkid"
          class="charts"
          @touchend="tap"
        />
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <canvas
          canvas-id="checkid"
          id="checkid"
          type="2d"
          class="charts"
          @touchend="tap"
        />
        <!-- #endif -->
      </view>

      <view v-if="billData && billData.data && billData.data.length">
        <view class="item" v-for="(item, index) in billData.data" :key="index">
          <view class="left">
            <!-- <view class="icon"></view> -->
            <image class="icon-new" :src="item.icon" />
            <view class="info">
              <view class="name"
                >{{ item.itemName }}
                <span class="des">{{
                  `${item.proportion}%（${item.count}笔）`
                }}</span>
              </view>
              <!-- <view class="barbg">
                <view class="bar"></view>
              </view> -->
              <!-- <u-line-progress class="progress" :percentage="30" activeColor="#FEE900"></u-line-progress> -->

              <view class="progress">
                <view class="bar" :style="{ width: getW(item) }"></view>
              </view>
            </view>
          </view>

          <view class="right" @click="billDes(item)">
            <view class="price">{{ `¥ ${item.consumeAmount} ` }}</view>
            <!-- #ifdef H5 -->
            <view class="price-right"></view>
            <!-- #endif -->
          </view>
        </view>
      </view>

      <view class="no-billData" v-else>
        <NoData
          noDataText="啊哦，这里空空如也～"
          img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
        >
        </NoData>
        <!-- #ifdef H5 -->
        <view class="no-billData-btn" @click="checkBtn(1)">去记账</view>
        <!-- #endif -->
      </view>
    </view>

    <view style="height: 225rpx"></view>

    <!-- #ifdef H5 -->
    <view
      class="buttomBtn"
      v-if="billData && billData.data && billData.data.length"
    >
      <!-- <view :class="['view-btn', 0 == btnIdx ? 'check' : '']" @click="checkBtn(0)" style="margin-right:27rpx">查看明细
      </view> -->
      <view :class="['view-btn check']" @click="checkBtn(1)">记账</view>
    </view>
    <!-- #endif -->

    <DisbursePop
      :show.sync="disburseShow"
      @confirm="handleDisburse"
      :disburse="disburse"
    />
    <TimePop :show.sync="timeShow" @confirm="handleTime" :time="time" />
    <u-picker
      :show="show"
      :columns="columns"
      title="选择时间"
      confirmColor="#FFB400"
      cancelColor="#666666"
      @confirm="confirmDate"
      @cancel="closeModal"
      :defaultIndex="defaultIndex"
    ></u-picker>
  </view>
</template>
<script>
// import ItemStatics from "./itemstatics.vue";
import dayjs from "dayjs";
import uCharts from "@qiun/ucharts";
import { GET_BILL } from "@/api/petinfo.js";

import DisbursePop from "@/pagesD/myPetsInfo/components/disbursePop.vue";
import TimePop from "@/pagesD/myPetsInfo/components/timePop.vue";
import NoData from "@/components/noData/index.vue";
import { action_report } from "@/utils/track";
var uChartsInstance = {};
export default {
  components: {
    // ItemStatics
    DisbursePop,
    TimePop,
    NoData,
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
      cWidth: 750,
      cHeight: 500,
      list: [1, 1, 1, 1, 1],
      btnIdx: -1,
      billData: {},
      disburse: 2,
      disburseShow: false,
      disburseStr1: "全部",
      disburseStr2: "查看全部",
      disburseStr3: "全部",
      timeShow: false,
      time: "",
      columns: [[]],
      defaultIndex: [0],
      show: false,
      callType: "ALL",
      calDate: "",
      pixelRatio: 2,
    };
  },

  mounted() {
    //这里的 750 对应 css .charts 的 width
    this.cWidth = uni.upx2px(750);
    //这里的 500 对应 css .charts 的 height
    this.cHeight = uni.upx2px(500);
    this.pixelRatio = uni.getSystemInfoSync().pixelRatio;

    // this.getServerData();

    this.columns = [this.getYearData(2000)];
    console.log("columns", this.columns);
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
  },

  methods: {
    billDes(item) {
      console.log("item: ", item);
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/serviceB/account/expend_record?petId=${this.petId}&calType=${this.callType}&calDate=${this.calDate}&itemName=${item.itemName}&itemId=${item.itemId}`,
        // page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${productItem.itemId}&shopId=${productItem.shopId}`,
      });
      // #endif
    },
    getYearData(startYear) {
      let len = new Date().getFullYear() - startYear;
      return Array.from(
        { length: len + 1 },
        (_, index) => index + startYear + "年"
      );
    },
    confirmDate(e) {
      console.log("confirmDate: ", e);

      this.disburseStr1 = e.value[0];
      this.callType = "YEAR";
      this.calDate = e.value[0].slice(0, 4) + "-01-01";
      this.getSerDate();
      this.closeModal();

      // this.requestParams.calDate = e.value[0].slice(0, 4) + '-01-01';
      // //关闭弹窗 请求数据
      // this.show = false;
      // this.requestParams.pageNo = 1;
      // this.getRecordsList();
    },
    cancleModal() {
      this.show = false;
    },
    showModal() {
      this.show = true;
      setTimeout(() => {
        this.defaultIndex = [this.columns[0].length - 1];
      }, 100);
    },
    closeModal() {
      this.show = false;
    },
    handleTime(d) {
      console.log("handleTime ===", d);
      this.disburseStr1 = d.timeStr;
      this.callType = "MONTH";
      this.calDate = d.time.slice(0, 7) + "-01";
      this.getSerDate();
    },
    disburseClick() {
      this.disburseShow = true;
    },
    handleDisburse(d) {
      console.log("handleDisburse ===", d);
      if (0 == d.disburse) {
        this.disburseStr1 = "按年选择";
        this.time = this.time || dayjs(new Date()).format("YYYY");
        this.showModal();

        this.disburseStr3 = "年支出";
      } else if (1 == d.disburse) {
        this.disburseStr1 = "按月选择";
        this.time = this.time || dayjs(new Date()).format("YYYY-MM");
        this.timeShow = true;
        this.disburseStr3 = "月支出";
      }
      if (2 == d.disburse) {
        this.disburseStr1 = "全部";
        this.disburseStr3 = "全部支出";
        this.callType = "ALL";
        this.getBill();
      } else {
        console.log("handleDisburse === error");
      }
    },
    getW(item) {
      return item.proportion * 0.01 * 346 + "rpx";
    },
    getSerDate() {
      console.log("check getSerDate petId : ", this.petId);
      this.getBill();
      // this.getServerData()
    },
    async getBill() {
      if ("ALL" == this.callType) {
        let timeStr = dayjs(new Date()).format("YYYY-MM-DD");
        this.calDate = timeStr;
      }
      let p = {
        calDate: this.calDate, //查询的日期，根据该日期和type查询所有账单
        petId: this.petId,
        calType: this.callType, //全部-ALL、按月-MONTH、按年-YEAR
      };
      const res = await GET_BILL(p);
      console.log(res);
      this.billData = res.data;
      console.log("billData : ", this.billData);

      let tbres = {
        series: [
          {
            data: [], // [{ "name": "一班", "value": 50 }, { "name": "二班", "value": 30 }, { "name": "三班", "value": 20 }, { "name": "四班", "value": 18, "labelText": "四班:18人" }, { "name": "五班", "value": 8 }]
          },
        ],
      };
      let d = this.billData.data;
      let other = 0;
      if (d && d.length) {
        for (let index = 0; index < d.length; index++) {
          const e = d[index];
          console.log("e : ", e);
          if (index > 3) {
            other = other + Number(e.proportion);
            // tbres.series[0]['data'].push({ 'labelText': `${e.itemName}${e.proportion}%`, 'name': '其他', 'value': Number(e.proportion) })
          } else {
            tbres.series[0]["data"].push({
              labelText: `${e.itemName}`,
              name: e.itemName,
              value: Number(e.proportion),
            });
          }
        }
      }
      if (other) {
        tbres.series[0]["data"].push({
          labelText: " ",
          name: "其他",
          value: other,
        });
      }

      console.log("tbres : ", tbres);

      setTimeout(() => {
        // #ifdef MP-WEIXIN
        this.drawCharts2d("checkid", tbres);
        // #endif

        // #ifdef H5
        this.drawCharts("checkid", tbres);
        // #endif
      }, 500);
    },
    viewAll() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/recordALL/index?activetype=BILL&petId=${this.petId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call(
        "goPetRecordHistoryPage",
        JSON.stringify({
          petId: this.petId,
          tabMark: "BILL",
        })
      );
      // #endif

      action_report({
        action_name: "petfiles_bill_allrecord_click",
        module_name: "petfiles",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
    },

    checkBtn(index) {
      console.log("index ", index);
      this.btnIdx = index;

      // #ifdef H5
      this.$dsBridge.call(
        "goPetRecord",
        JSON.stringify({
          petId: this.petId,
          activeTabIndex: 2,
        })
      );
      // #endif

      //宠物档案_指标tab_体重记录入口_点击
      action_report({
        action_name: "petfiles_bill_bookkeeping_click",
        module_name: "petfiles",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
    },
    getServerData() {
      // //模拟从服务器获取数据时的延时
      // setTimeout(() => {
      //   //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      //   let res = {
      //     series: [
      //       {
      //         data: [{ "name": "一班", "value": 50 }, { "name": "二班", "value": 30 }, { "name": "三班", "value": 20 }, { "name": "四班", "value": 18, "labelText": "四班:18人" }, { "name": "五班", "value": 8 }]
      //       }
      //     ]
      //   };
      //   this.drawCharts('checkid', res);
      // }, 500);
    },

    drawCharts(id, data) {
      const ctx = uni.createCanvasContext(id, this);
      uChartsInstance[id] = new uCharts({
        type: "ring",
        context: ctx,
        width: this.cWidth,
        height: this.cHeight,
        series: data.series,
        animation: false,
        rotate: false,
        rotateLock: false,
        background: "#FFFFFF",
        color: [
          "#FEE900",
          "#FCED4A",
          "#FBF17C",
          "#FAF4AE",
          "#F9F7E0",
          "#F9F7E0",
          "#F9F7E0",
          "#F9F7E0",
          "#F9F7E0",
        ],
        padding: [5, 5, 5, 5],
        dataLabel: true,
        enableScroll: false,
        legend: {
          show: false,
          position: "right",
          lineHeight: 25,
        },
        // title: {
        //   name: "收益率",
        //   fontSize: 15,
        //   color: "#666666"
        // },
        // subtitle: {
        //   name: "70%",
        //   fontSize: 25,
        //   color: "#7cb5ec"
        // },
        extra: {
          ring: {
            ringWidth: 60,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 2,
            borderColor: "#FFFFFF",
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
              type: "ring",
              context: ctx,
              width: this.cWidth * this.pixelRatio,
              height: this.cHeight * this.pixelRatio,
              series: data.series,
              pixelRatio: this.pixelRatio,
              animation: false,
              rotate: false,
              rotateLock: false,
              background: "#FFFFFF",
              color: [
                "#FEE900",
                "#FCED4A",
                "#FBF17C",
                "#FAF4AE",
                "#F9F7E0",
                "#F9F7E0",
                "#F9F7E0",
                "#F9F7E0",
                "#F9F7E0",
              ],
              padding: [5, 5, 5, 5],
              dataLabel: true,
              enableScroll: false,
              legend: {
                show: false,
                position: "right",
                lineHeight: 25,
              },
              // title: {
              //   name: "收益率",
              //   fontSize: 15,
              //   color: "#666666"
              // },
              // subtitle: {
              //   name: "70%",
              //   fontSize: 25,
              //   color: "#7cb5ec"
              // },
              extra: {
                ring: {
                  ringWidth: 60,
                  activeOpacity: 0.5,
                  activeRadius: 10,
                  offsetAngle: 0,
                  labelWidth: 15,
                  border: true,
                  borderWidth: 2,
                  borderColor: "#FFFFFF",
                },
              },
            });
          } else {
            console.error("[uCharts]: 未获取到 context");
          }
        });
    },

    tap(e) {
      uChartsInstance[e.target.id].touchLegend(e);
      // uChartsInstance[e.target.id].showToolTip(e);
      console.log("tap e ", e);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";

.check-frame {
}

.check-info {
  display: flex;
  flex-direction: column;

  height: 313rpx;
  background: #ffffff;
  border-radius: 23rpx;
  margin: 0rpx 29rpx;
  padding: 30rpx;

  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .img-zc {
      display: flex;

      .img {
        width: 38rpx;
        height: 38rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/check/icon-zc.png"
        );
        margin-right: 15rpx;
      }

      .zc {
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

    .all-img {
      display: flex;

      .all {
        height: 38rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 27rpx;
        color: #1f1f1f;
        line-height: 38rpx;
        text-align: right;
        font-style: normal;
      }

      .img {
        width: 38rpx;
        height: 38rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/check/icon-all.png"
        );
        margin-right: 4rpx;
      }
    }
  }

  .zc-title {
    height: 40rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 29rpx;
    color: #2b2c3c;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin-top: 40rpx;
  }

  .zc-price {
    height: 69rpx;
    font-family: D-DIN, D-DIN;
    font-weight: bold;
    font-size: 58rpx;
    color: #1f1f1f;
    line-height: 63rpx;
    text-align: left;
    font-style: normal;
    margin-top: 14rpx;
  }

  .zc-count {
    height: 38rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 27rpx;
    color: #999999;
    line-height: 38rpx;
    text-align: left;
    font-style: normal;
    margin-top: 11rpx;
  }
}

.check-tendency {
  width: 692rpx;
  // height: 523rpx;
  background: #ffffff;
  border-radius: 23rpx;
  margin: 23rpx 29rpx;
  padding: 30rpx;

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

  .list {
    width: 630rpx;
    height: 77rpx;
  }

  .item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 38rpx;

    position: relative;

    .left {
      display: flex;
      justify-content: start;
    }

    .icon {
      width: 77rpx;
      height: 77rpx;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/check/snack.png"
      );
      margin-right: 19rpx;
    }

    .icon-new {
      width: 77rpx;
      height: 77rpx;

      margin-right: 19rpx;
    }

    .info {
      display: flex;
      flex-direction: column;

      .name {
        height: 42rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 31rpx;
        color: #1f1f1f;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
      }

      .des {
        height: 35rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 25rpx;
        color: #666666;
        line-height: 35rpx;
        text-align: left;
        font-style: normal;
      }

      .progress {
        width: 346rpx;
        height: 12rpx;
        background: #d8d8d8;
        border-radius: 6rpx;
        margin-top: 19rpx;

        .bar {
          max-width: 346rpx;
          height: 12rpx;
          background: #fee900;
          border-radius: 6rpx;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      position: absolute;
      top: 21rpx;
      right: 0rpx;
    }

    .price {
      height: 35rpx;
      font-family: D-DIN, D-DIN;
      font-weight: bold;
      font-size: 35rpx;
      color: #333333;
      line-height: 38rpx;
      text-align: right;
      font-style: normal;
    }

    .price-right {
      width: 23rpx;
      height: 23rpx;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/check/right.png"
      );
    }
  }
}

.charts {
  width: 692rpx;
  height: 523rpx;
  margin-left: -40rpx;
  margin-bottom: 20rpx;
  margin-top: 38rpx;
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

.no-billData {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-billData-btn {
  width: 165rpx;
  height: 69rpx;
  background: #fee900;
  border-radius: 35rpx;

  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 29rpx;
  color: #1f1f1f;
  line-height: 69rpx;
  text-align: center;
  font-style: normal;

  text-align: center;
  margin-top: 19rpx;
}
</style>
