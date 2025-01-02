<template>
  <view class="record-all-page">
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
    <view class="navibar">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="hender-frame" :style="{ height: navBarHeight }">
        <view class="left">
          <view class="iconfont icon-back" @click="goBack"></view>
        </view>
        <view
          class="title"
          :style="{ height: navBarHeight, lineHeight: navBarHeight }"
        >
          <view class="petavatar">
            <image :src="petAvatarUrl" mode="aspectFill"></image>
          </view>
          <view class="titlename">历史记录</view>
        </view>
      </view>
    </view>
    <view class="tabwrap">
      <view
        v-for="(item, index) in tabs"
        :key="index"
        :class="['tabitem', activeTabIndex == index ? 'active' : '']"
        @click="toggleTab(item, index)"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="datechoose" @click="showModal"
      >{{ requestParams.calDate.split("-")[0] }}年<view
        class="downarrow"
      ></view>
    </view>
    <scroll-view scroll-y class="cards" @scrolltolower="scrolltolowerFn">
      <view class="content" v-if="newRecordsList.length != 0">
        <view class="line"></view>
        <view class="right">
          <view class="carditem">
            <view class="event-wrap">
              <view
                class="card-content"
                v-for="(sitem, sindex) in newRecordsList"
                :key="sitem.id"
              >
                <view class="contenttitle">{{ getRecordTitle(sitem) }}</view>
                <view class="contentdesc">{{ getDesc(sitem) }}</view>
                <image
                  class="card-img"
                  v-if="sitem.imageUrl"
                  :src="sitem.imageUrl"
                  mode="aspectFill"
                  @click="previewImages(sitem.imageUrl)"
                />
                <view class="recordtype"
                  >{{ getOriginalTitle(sitem)
                  }}<view class="recordtime">{{
                    getTime(sitem.recordTime)
                  }}</view>
                </view>

                <view class="point-big"></view>
                <view class="point-small"></view>
                <view
                  class="medicalreport"
                  v-if="
                    sitem.extendJson && JSON.parse(sitem.extendJson).showDetail
                  "
                  @click="toReport(sitem)"
                  >就诊报告<view class="iconfont icon-outlineArrowRight"></view
                ></view>
                <view
                  class="medicalreport"
                  v-if="
                    sitem.extendJson && JSON.parse(sitem.extendJson).jumpUrl
                  "
                  @click="goRecord(sitem)"
                  >查看记录<view class="iconfont icon-outlineArrowRight"></view>
                </view>
                <view class="datetag" v-if="sitem.time">{{
                  getRecordDate(sitem.time)
                }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="no-data-con" v-else>
        <NoData
          noDataText="啊哦，这里空空如也～"
          img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
        >
        </NoData>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import NoData from "@/components/noData/index.vue";
import dayjs from "dayjs";
import { getRecords } from "@/api/record";
import { GET_PET_DETAIL } from "@/api/index";
export default {
  components: {
    NoData,
  },
  data() {
    return {
      columns: [[]],
      petAvatarUrl: "",
      show: false,
      statusBarHeight: "",
      navBarHeight: "",
      tabs: [
        { name: "全部", type: "ALL" },
        { name: "驱虫", type: "QU_CHONG" },
        { name: "美洗", type: "MEI_XI" },
        { name: "疫苗", type: "YI_MIAO" },
        { name: "体检", type: "TI_JIAN" },
        { name: "记账", type: "BILL" },
        { name: "病历", type: "CASE" },
      ],
      activeTabIndex: 0,
      activeTabType: "ALL",
      recordsList: [],
      requestParams: {
        pageNo: 1,
        pageSize: 20,
        petIds: [],
        calType: "YEAR",
        calDate: dayjs().format("YYYY-MM-DD"),
        category: "ALL",
      },
      totalPage: 1,
      isCompelete: true,
      defaultIndex: [0],
      newRecordsList: [],
      nowTime: "",
    };
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
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
    confirmDate(e) {
      this.requestParams.calDate = e.value[0].slice(0, 4) + "-01-01";
      //关闭弹窗 请求数据
      this.show = false;
      this.requestParams.pageNo = 1;
      this.getRecordsList();
    },
    cancleModal() {
      this.show = false;
    },
    toReport(item) {
      let extendStore = JSON.parse(item.extendJson);
      uni.navigateTo({
        url: `/pagesE/petMedicalReport/index?registrationId=${extendStore.registrationId}&diagType=${extendStore.diagType}`,
      });
    },
    goRecord(item) {
      let extendStore = JSON.parse(item.extendJson);
      uni.navigateTo({
        url: `${extendStore.jumpUrl}`,
      });
    },
    getDesc(item) {
      if (item.type == "CASE") {
        return `诊断信息: ${item?.medicalRecordInfo?.diagnosis}`;
      } else if (item.type == "STORE") {
        let extendStore = JSON.parse(item.extendJson);
        return `${extendStore?.packageName}｜¥${extendStore?.price}`;
      } else if (item.type == "MEDICAL") {
        let extendStore = JSON.parse(item.extendJson);
        return `${extendStore.diagnosis} | 医生: ${extendStore.doctorName}`;
      } else {
        return item.desc;
      }
    },
    getRecordTitle(item) {
      if (item.title?.indexOf("体重") > -1) {
        return `体重${item.weight}kg`;
      } else if (item.type == "BILL") {
        return `${item.title}${item.amount}元`;
      } else if (item.type == "CASE") {
        return `主诉症状：${item?.medicalRecordInfo?.symptom}`;
      } else if (item.type == "MEDICAL" || item.type == "STORE") {
        let extendStore = JSON.parse(item.extendJson);
        return `${extendStore?.serviceName}【${extendStore?.storeName}】`;
      } else {
        return item.title;
      }
    },
    getOriginalTitle(item) {
      if (item.type == "BILL") {
        return "记账";
      } else if (item.type == "MEDICAL" || item.type == "STORE") {
        return "门店服务";
      } else if (item.type == "CASE") {
        return "病历";
      } else {
        return "日常";
      }
    },
    scrolltolowerFn() {
      if (!this.isCompelete) {
        return;
      }
      if (this.requestParams.pageNo >= this.totalPage) {
        return;
      }
      this.requestParams.pageNo = this.requestParams.pageNo + 1;
      this.getRecordsList();
    },
    toggleTab(item, index) {
      this.nowTime = "";
      this.activeTabIndex = index;
      this.activeTabType = item.type;
      this.requestParams.category = item.type;
      this.requestParams.pageNo = 1;
      this.getRecordsList();
    },
    previewImages(imageUrl) {
      uni.previewImage({
        urls: [imageUrl],
      });
    },
    getYearData(startYear) {
      let len = new Date().getFullYear() - startYear;
      return Array.from(
        { length: len + 1 },
        (_, index) => index + startYear + "年"
      );
    },
    getTime(time) {
      return dayjs(time).format("HH:mm");
    },
    getRecordDate(date) {
      return date.slice(5, date.length).replace("-", "月");
    },
    async getRecordsList() {
      try {
        this.isCompelete = false;
        if (this.requestParams.pageNo === 1) {
          this.recordsList = [];
          this.newRecordsList = [];
        }
        const { data } = await getRecords({
          ...this.requestParams,
        });
        this.totalPage = Number(data?.totalPage || 0);
        let result = data.data;
        this.recordsList = this.recordsList.concat(result);
        for (let index = 0; index < result.length; index++) {
          const r = result[index];
          let date = r.date;
          if (this.nowTime != date) {
            r.events[0]["time"] = date;
            this.nowTime = date;
          }
          this.newRecordsList = this.newRecordsList.concat(r.events);
        }
        this.isCompelete = true;
      } catch (e) {
        console.log("error", e);
        this.isCompelete = true;
      }
    },
    async getPetInfo(id) {
      const { data } = await GET_PET_DETAIL({ petId: id });
      this.petAvatarUrl = data.avatarUrl;
    },
  },
  onLoad(option) {
    console.log("option", option);
    if (option.activetype) {
      this.activeTabIndex = [
        "ALL",
        "QU_CHONG",
        "MEI_XI",
        "YI_MIAO",
        "TI_JIAN",
        "BILL",
        "CASE",
      ].indexOf(option.activetype);
      this.requestParams.category = option.activetype;
    }

    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    this.requestParams.petIds.push(option.petId);
    this.columns = [this.getYearData(2000)];
    console.log("columns", this.columns);
    this.getPetInfo(option.petId);
    this.getRecordsList();
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
::v-deep .u-popup__content {
  border-radius: 20px 20px 0px 0px;
}
::v-deep .u-toolbar {
  height: 113rpx !important;
  border-bottom: 2rpx solid #e6e6e6;
}
::v-deep .u-picker {
  padding: 0 38rpx;
}
</style>
