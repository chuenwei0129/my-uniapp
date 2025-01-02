<template>
  <view>
    <view class="drop-wrapper">
      <DropDown
        ref="dropDown"
        :options="options"
        @change="onHeaderSelect"
        @select="onItemSelect"
        dropIcon="line"
      ></DropDown>
    </view>
    <!-- 120rpx是下拉tab高度 -->
    <scroll-view
      scroll-y
      class="doc-list-wrapper"
      :style="{
        height: `calc(100vh - 120rpx)`,
      }"
      :scroll-top="scrollViewTop"
      enable-flex="true"
    >
      <sheetsList ref="sheetsList" :isPageShow="isPageShow"></sheetsList>
    </scroll-view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import DropDown from "@/components/dropDown/wyb-drop-down.vue";
import { GET_ONLINE_STATUS } from "@/api/index";
import { mapState, mapMutations } from "vuex";
import { getPetList } from "@/api/base/index";
import sheetsList from "./components/sheets-list.vue";
import { getTypeModule } from "@/pagesA/api/chatAi";

export default {
  components: { DropDown, sheetsList },
  data() {
    return {
      current: 0,
      scrollViewTop: 0,
      isShow: false,
      isPageShow: false,
      DataInfo: {},
      options: [
        {
          header: "全部状态",
          // contents在自定义开启时可以不用传
          contents: ["全部状态", "服务中", "待评价", "已完成", "已取消","已关闭"],
        },
        {
          header: "全部类型",
          contents: [
            "全部类型",
            // "专家问诊",
            // "免费义诊",
            // "营养咨询",
            // "在线开药",
            // "报告解读",
            // "智能问诊",
          ],
        },
        {
          header: "时间倒序",
          contents: ["时间倒序", "时间正序"],
        },
        {
          header: "全部宠物",
          contents: ["全部宠物"],
          petId: [""],
        },
      ],
      docList: [],
      pageNo: 1,
      pageSize: 10,
      isFinished: false, //无数据,禁止下拉刷新
      sortMap: {
        全部状态: 0,
        服务中: 1,
        待评价: 2,
        已完成: 3,
        已取消: 4,
        已关闭: 7,
        全部类型: "",
        // 专家问诊: "EXPERT",
        // 免费义诊: "QUICK",
        // 营养咨询: "NUTRITION",
        // 在线开药: "ONLINE_PRESCRIPTION",
        // 报告解读: "REPORT_INTERPRETATION",
        // 智能问诊: "AI_INQUIRY",
        时间倒序: 1,
        时间正序: 2,
      },
      department: "",
      sort: "",
      sheetState: "",
      sheetInquiryType: "",
      sheetSortType: "",
      petList: "",
      petData: {
        name: [],
        petId: [""],
      },
      statusBarHeight: "",
      navBarHeight: "",
      navHeight: "",
    };
  },
  mounted() {
    // this.getDocList();
    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.navHeight = getApp().globalData.navHeight + "px";
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    let h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight);
    this.navHeight = h5NavHeight + "px";
    //#endif
  },
  watch: {
    consultationShow: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.$refs.sheetsList.isLock = false;
          this.$refs.sheetsList.isCompleted = false;
          this.$refs.sheetsList._getSheetsList();
          console.log("watch988");
          this.setConsultationShow(false);
        }
      },
    },
  },
  computed: {
    ...mapState([
      "userInfo",
      "userSelectedPetId",
      "userPetList",
      "serviceSheetsList",
      "consultationShow",
    ]),
  },
  created() {
    this.getModule();
  },
  onShow() {
    this.getPetData();

    this.$refs.sheetsList.isLock = false;
    this.$refs.sheetsList.isCompleted = false;
    this.$refs.sheetsList._getSheetsList();

    console.log(88999112233);
  },
  methods: {
    ...mapMutations(["setAiTypeName", "setConsultationShow"]),
    onHeaderSelect: function (e) {},
    onItemSelect: function (e) {
      this.pageNo = 1;
      this.isFinished = false;
      this.scrollViewTop = 0;
      switch (e.headerIndex) {
        case 0:
          this.sheetState = this.sortMap[e.content];
          break;
        case 1:
          this.sheetInquiryType = this.sortMap[e.content];
          break;
        case 2:
          this.sheetSortType = this.sortMap[e.content];
          break;
        case 3:
          this.petId = e.petId;
          break;
      }
      let params = {
        state: this.sheetState,
        inquiryType: this.sheetInquiryType,
        sortType: this.sheetSortType,
        petId: this.petId,
      };

      if (e.headerIndex == 3) {
        this.getPetData();
      }
      uni.$emit("getSheetListWithParams", params);
      this.$set(this.options, e.headerIndex, {
        header: e.content,
        contents:
          e.headerIndex == 0
            ? ["全部状态", "服务中", "待评价", "已完成", "已取消","已关闭"]
            : e.headerIndex == 1
            ? [...this.options[1].contents]
            : e.headerIndex == 2
            ? ["时间倒序", "时间正序"]
            : ["全部宠物", ...this.petData.name],
        petId: e.headerIndex == 3 ? ["", ...this.petData.petId] : "",
      });
      this.$refs.dropDown.close();
    },
    async docAsk(userId) {
      if (this.serviceSheetsList.length) {
        this.isShowGoTo = true;
        return;
      }
      if (this.userPetList.length == 1) {
        return uni.showToast({
          title: "请先添加宠物",
          icon: "error",
        });
      }
      const res = await GET_ONLINE_STATUS(userId);
      if (res.data) {
        uni.navigateTo({
          url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&doctorUserId=${userId}`,
        });
      } else {
      }
    },
    async getPetData() {
      getPetList({ userId: this.userInfo.userId }).then((res) => {
        this.petList = res.data;
        this.petData.name = [];
        this.petData.petId = [];
        this.options[3].contents = ["全部宠物"];
        this.options[3].petId = [""];
        this.petList.forEach((item) => {
          this.petData.name.push(item.nickName);
          this.petData.petId.push(item.id);
          this.options[3].contents.push(item.nickName);
          this.options[3].petId.push(item.id);
        });
      });
    },
    async getModule() {
      getTypeModule().then((res) => {
        console.log(res.data, "res.data");
        this.setAiTypeName(res.data);
        res.data.forEach((item) => {
          this.options[1].contents.push(item.moduleName);
          this.sortMap[item.moduleName] = item.code;
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
