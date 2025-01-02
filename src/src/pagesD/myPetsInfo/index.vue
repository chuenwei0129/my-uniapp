<template>
  <scroll-view class="my-petinfo" scroll-y="true" @scroll="handleScroll">
    <view class="nav-bar-bgc">
      <NavBar
        title="我的宠物"
        navColor=""
        titleColor="#333333"
        showBackBtn
        @navBackClickHandle="back"
        :customback="true"
      >
        <!-- #ifdef H5 -->
        <template slot="righticon">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/moreicon.png"
            mode="aspectFill"
            class="moreicon"
            @click="showOpPop"
          ></image>
        </template>
        <!-- #endif -->
      </NavBar>
      <FixedNav :headerShow="isHeaderShow" :backfc="back">
        <template slot="headercomponent">
          <view class="avatarurl">
            <image :src="getSelectAvatar" mode="aspectFill"></image>
          </view>
        </template>
        <!-- #ifdef H5 -->
        <template slot="righticon">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/moreicon.png"
            mode="aspectFill"
            class="rightmore"
            @click="showOpPop"
          ></image>
        </template>
        <!-- #endif -->
      </FixedNav>
      <PetCard
        :pet-list="petList"
        :pet-id="petId"
        v-if="petList && petList.length"
        @changePet="changePet"
      ></PetCard>

      <HealthRecord
        :petId="petId"
        :data.sync="healthData"
        :dataFirst.sync="dataFirst"
        :currentPetData.sync="currentPetData"
        @openPop="openPop"
        @openPop2="openPop2"
        @openBscPop="openBscPop"
        @openliftStylePop="openliftStylePop"
      ></HealthRecord>
    </view>

    <!-- 
    <u-sticky :offset-top="topHeight" :bg-color="bgColor">
      <view class="tabs">
        <view
          :class="['tab-item', index == activeTabIndex ? 'active' : '']"
          v-for="(item, index) in tabInfo"
          :key="index"
          @click="toggleTab(item, index)"
        >
          {{ item.name }}
        </view>
      </view>
    </u-sticky>
    <button @click="openPop">打开弹层</button>
    <button @click="openPop2">打开病史</button>
    <template v-if="requestFlag">
      <Health
        v-if="activeTabIndex == 0"
        :petId="petId"
        :data="healthData"
        :petList="petList"
      ></Health>
    </template>
    <various-indicators
      v-if="activeTabIndex == 1"
      :petList="petList"
      :petId="petId"
      :reFreshTime="reFreshTime"
      :activeTabIndex="activeTabIndex"
    ></various-indicators>
    <check
      v-if="activeTabIndex == 2"
      :petList="petList"
      :petId="petId"
      :reFreshTime="reFreshTime"
      :activeTabIndex="activeTabIndex"
    ></check> -->

    <!-- #ifdef H5 -->
    <view class="shareicon" @click="toShare" v-if="isOwner"></view>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <ConfirmPop
      :isOpen.sync="shareOpen"
      text="亲友接受邀请后可以编辑宠物档案"
      @confirm="confirmShare"
    />
    <!-- #endif -->
    <CreateSuc :isOpen.sync="createSucOpen"></CreateSuc>

    <!--  疫苗  驱虫  体重 特殊时期弹窗组件 -->
    <HealthPop
      :show.sync="showPop"
      :healthType="healthType"
      :type="operateType"
      :petInfo="petInfo"
      :healthyCode="healthyCode"
      @close="popClose"
      @complete="handleComplete"
    ></HealthPop>

    <!-- 病史弹窗组件 -->
    <Cascader
      :petInfo="petInfo"
      :isShowPop="isShowPop"
      :healthyCode="healthyCode"
      @close="handleClose"
      @change="handleChange"
    />

    <!-- bcs选择弹窗 -->
    <BcsPopup
      :show.sync="bcsPopupShow"
      :healthyCode="healthyCode"
      @close="bscClose"
      :bcsItems="bcsItems"
      :petId="petId"
      :bcsShapeType="bcsShapeType"
      @confirmsClick="confirmsClick"
    ></BcsPopup>

    <!-- 养育方式弹窗 -->
    <CommonPicker
      :isShowPop.sync="isShowPopStyle"
      :columns="columns"
      :secondName="secondName"
      :selectId="selectId"
      :type="4"
      @onchange="commonPickerOnchange"
    ></CommonPicker>
  </scroll-view>
</template>
<script>
import NavBar from "@/components/navBar/index.vue";
import FixedNav from "@/components/fixedNav/index.vue";
import PetCard from "./components/card.vue";
import Health from "./components/health.vue";
import ConfirmPop from "./components/sharePop.vue";
import CreateSuc from "./components/createSuc.vue";
import CommonPicker from "../components/commonPicker.vue";
import { mapState, mapMutations } from "vuex";
import { GET_PET_LIST } from "@/api/index.js";
import dayjs from "dayjs";
import {
  GET_CATEGORY_BATCHITEMS,
  GET_PET_BODY_TYPE,
  GET_LIFE_STYLE_DATA,
  HOLD_PETHEALTHRECORD,
} from "@/api/petinfo";
import {
  GET_HEALTH_INFO,
  GET_WEIGHT_CONFIRM_SHAPE,
  GET_HEALTH_DATA,
} from "@/api/petinfo.js";
import HealthRecord from "./components/healthRecord.vue";

import VariousIndicators from "./components/variousIndicators.vue";
import Check from "./components/check.vue";
import { action_report, display_report } from "@/utils/track";
import { subtractFloat } from "@/utils/number";
import HealthPop from "@/pagesD/components/healthPop.vue";
import Cascader from "@/pagesD/components/cascader.vue";
import BcsPopup from "@/pagesD/improve/components/bcsPopup.vue";
const h5Domain = {
  development: "https://cn-dev01-shareactivity.chongpangpang.com",
  test: "https://cn-dev02-shareactivity.chongpangpang.com",
  pre: "https://cn-test01-shareactivity.chongpangpang.com",
  production: "https://shareactivity.chongpangpang.com",
};
export default {
  components: {
    PetCard,
    NavBar,
    FixedNav,
    Health,
    VariousIndicators,
    Check,
    ConfirmPop,
    CreateSuc,
    HealthRecord,
    HealthPop,
    Cascader,
    BcsPopup,
    CommonPicker,
  },
  computed: {
    ...mapState(["userInfo"]),
    getSelectAvatar() {
      let _url =
        this.petList.filter((item, index) => item.id == this.petId)[0]
          ?.avatarUrl || this.petList[0]?.avatarUrl;
      return _url;
    },
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
    isOwner() {
      let isOwner;
      if (this.petList.filter((item, index) => item.id == this.petId)?.length) {
        isOwner = this.petList.filter((item, index) => item.id == this.petId)[0]
          ?.isOwner;
      } else {
        isOwner = this.petList[0]?.isOwner;
      }
      return isOwner;
    },
    // 记录当前页面正在展示的宠物数据（用于完善信息打开弹窗时传递信息）
    currentPetData() {
      let currentData = this.petList.filter((item) => item.id == this.petId);
      return currentData;
    },
  },
  data() {
    return {
      tabInfo: [
        { name: "健康", id: "1" },
        { name: "指标", id: "2" },
        { name: "账单", id: "3" },
      ],
      activeTabIndex: 0,
      isHeaderShow: false,
      statusBarHeight: "",
      navBarHeight: "",
      topHeight: "",
      bgColor: "",
      petList: [],
      petId: "",
      healthData: [],
      dataFirst: {},
      reFreshTime: "",
      requestFlag: false,
      shareOpen: false,
      createSucOpen: false,
      showPop: false, //疫苗 驱虫 体重
      isShowPop: false, //病史
      bcsPopupShow: false, //bsc
      isShowPopStyle: false, //养育方式
      secondName: "", //弹窗标题

      columns: [],
      healthyCode: "healthyCode",

      bcsItems: [], //bcs选项
      selectId: "", //养育方式id

      petInfo: {},
      healthType: 1, // 1 疫苗 2 驱虫 3 体重
      operateType: "add", // add-显示【同步动态】；不传，不显示
      bcsShapeType: "", //宠物身形记录

      currentMark: "", //当前mark
    };
  },
  async onShow() {
    console.log("show");
    // 进入宠物档案页
    // 进入宠物档案页
    display_report({
      display_name: "petfiles_display",
      object_type: "Pet",
      extend: {
        // #ifdef H5
        user_id: this.$dsBridge.call("getUserId", "getUserId"),
        // #endif
        // #ifdef MP-WEIXIN
        user_id: uni.getStorageSync("storage_info").userId,
        // #endif
      },
    });
    await this.getInfo();
    if (this.activeTabIndex == 0) {
      action_report({
        action_name: "petfiles_healthy_click",
        module_name: "petfiles",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
      this.getHealthData();
    }
  },
  onLoad(option) {
    console.log("option", option);
    if (option.type == "createliving") {
      //活体-添加档案
      this.createSucOpen = true;
    }

    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    //#endif
    //#ifdef H5
    this.topHeight = Number(this.statusBarHeight.split("px")[0]);
    // this.topHeight = getApp().globalData.h5NavBarFullHeight;
    //#endif
    //#ifdef MP-WEIXIN
    this.topHeight =
      Number(this.statusBarHeight.split("px")[0]) +
      Number(this.navBarHeight.split("px")[0]);
    //#endif
    this.petId = option.petId;
    this.activeTabIndex =
      !option.activeTabIndex || option.activeTabIndex == "null"
        ? 0
        : option.activeTabIndex;
  },
  onReady() {
    // #ifdef H5
    this.$dsBridge.register("reFreshPetDetail", this.reFreshPetDetail);
    this.$dsBridge.register("selectPetBodyType", this.reFreshSelectPetBodyType);
    // #endif
  },
  methods: {
    //单个生命周期新增接口
    async holdItemsLifeCycle(type, item) {
      try {
        const { userId } = uni.getStorageSync("storage_info");
        let query = [];
        let obj = {
          petId: this.petId, //宠物Id
          userId: userId, //用户Id
          mark: type, // TE_SHU_SHI_QI-特殊时期、BING_SHI-病史、BCS-bcs-养育方式
          ...item,
        };
        query.push(obj);
        const res = await HOLD_PETHEALTHRECORD({ list: query });

        this.getHealthData();
      } catch (error) {
        console.log(error);
      }
    },

    showType(type) {
      switch (type) {
        case "YI_MIAO":
          return 1;
        case "QU_CHONG":
          return 2;
        case "TI_ZHONG":
          return 3;
        case "TE_SHU_SHI_QI":
          return 4;
      }
    },

    // 判断类型下数据是否存在
    getType(type, data) {
      if (type == "QU_CHONG" && data.anthelminticInfo) {
        return true;
      } else if (type == "YI_MIAO" && data.vaccineInfo) {
        return true;
      } else if (type == "TI_ZHONG" && data.weight) {
        return true;
      } else if (type == "TE_SHU_SHI_QI") {
        return true;
      } else {
        return false;
      }
    },

    getPetType(item) {
      if (item.catPet) {
        return "CAT";
      } else if (item.dogPet) {
        return "DOG";
      } else if (item.otherPet) {
        return "OTHER";
      }
    },

    // 疫苗 驱虫 体重模块点击回调
    openPop(val) {
      console.log('openPop',val);

      this.petInfo.drugId = "";
      this.petInfo.drugName = "";
      this.petInfo.typeId = "";
      this.petInfo.typeName = "";
      // 调整入参
      this.currentMark = val.mark;
      this.showPop = true;
      this.petInfo.petIds = this.petId; // 宠物id
      this.petInfo.petType = this.getPetType(this.currentPetData[0]); // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
      this.petInfo.sex = this.currentPetData[0].sex; //1-GG, -2MM
      this.petInfo.sterilizationStatus = this.currentPetData[0].sterilizationStatus; //性别
      this.petInfo.date =val.recordTimeHm || ''; //记录时间
      // console.log(this.petInfo.date);

      if (val.mark == "QU_CHONG" && val.anthelminticInfo) {
        this.petInfo.drugId = val.anthelminticInfo.drugId || "";
        this.petInfo.drugName = val.anthelminticInfo.drugName || "";
        this.petInfo.typeId = val.anthelminticInfo.typeId || "";
        this.petInfo.typeName = val.anthelminticInfo.typeName || "";
      } else if (val.mark == "YI_MIAO" && val.vaccineInfo) {
        this.petInfo.typeId = val.vaccineInfo.typeId || "";
        this.petInfo.typeName = val.vaccineInfo.typeName || "";
      } else if (val.mark == "TE_SHU_SHI_QI" && val.specialPeriod) {
        this.petInfo.typeId = val.specialPeriod.periodCode;
        this.petInfo.typeName = val.specialPeriod.periodName;
        //           "lactationRecordTime": "" 最近一次哺乳期填写日,
        // "expectedDateRecordTime": "" 最近一次预产期填写日
        console.log();

        this.petInfo.lactationRecordTime = val?.specialPeriod
          ?.lactationRecordTime
          ? dayjs(val?.specialPeriod?.lactationRecordTime).format("YYYY-MM-DD")
          : "";
        this.petInfo.expectedDateRecordTime = val?.specialPeriod
          ?.expectedDateRecordTime
          ? dayjs(val?.specialPeriod?.expectedDateRecordTime).format(
              "YYYY-MM-DD"
            )
          : "";
        if (val.specialPeriod.periodCode === "6746872abbf92b1b14ebd2de") {
          this.petInfo.date = val?.specialPeriod?.expectedDate
            ? dayjs(val?.specialPeriod?.expectedDate).format("YYYY-MM-DD")
            : "";
          this.petInfo.specailMark = 'TE_SHU_SHI_QI_PRENATAL'; // 宠物id
        }
        if (val.specialPeriod.periodCode === "6746872abbf92b1b14ebd2dd") {
          this.petInfo.date = val?.specialPeriod?.deliveryTime
            ? dayjs(val?.specialPeriod?.deliveryTime).format("YYYY-MM-DD")
            : "";
          this.petInfo.specailMark = 'TE_SHU_SHI_QI_FEEDING'; // 宠物id
        }
      }

      this.petInfo.weight = val.weight || "";
      this.healthType = this.showType(val.mark);
      this.operateType = this.getType(val.mark, val) ? "edit" : "add"; //add-显示

      console.log(this.petInfo, "this.petInfo");
    },
    openPop2(val) {
      this.isShowPop = true;
      this.petInfo.petType = this.currentPetData[0].catPet
        ? 1
        : this.currentPetData[0].dogPet
        ? 2
        : ""; // 1：猫 2:狗
      this.petInfo.medicalHistoryItems = val.medicalHistory
        ? val.medicalHistory.medicalHistoryItems
        : ""; // 病史
      this.petInfo.petId = this.petId; // 宠物id
      console.log(this.petInfo, "this.petInfo");
    },
    openBscPop(val) {
      let petType = this.getPetType(this.currentPetData[0]);
      this.getItems(petType);
      this.bcsShapeType = val?.bcs?.shapeType;
    },
    openliftStylePop(val) {
      const requestData = {
        mark: "YAN_YU_FANG_SHI",
        petId: this.petId,
      };
      GET_LIFE_STYLE_DATA(requestData)
        .then((res) => {
          console.log(res, "res");

          this.columns = res.data;
          this.secondName = "养育方式";
          this.selectId = val.rearingStyle ? val.rearingStyle.name : "";
          this.isShowPopStyle = true;
        })
        .catch((error) => {});
    },

    popClose() {
      this.showPop = false;
    },
    handleClose() {
      this.isShowPop = false;
    },
    bscClose(val) {
      this.bcsPopupShow = val;
    },

    // 体重 疫苗 驱虫 特殊时期保存
    handleComplete(query) {
      console.log(query, "体重 疫苗 驱虫 特殊时期");
      // 注：需要对特殊时期的完成回调进行保存操作
      if (this.currentMark == "TE_SHU_SHI_QI") {
        let data = {
          periodCode: query.typeId,
          periodName: query.typeName,
          deliveryTime:
            query.typeName == "哺乳期" && query.date ? query.date + " 00:00:00" : "",
          expectedDate:
            query.typeName == "孕期" && query.date ? query.date + " 00:00:00" : "",
        };
        this.holdItemsLifeCycle("TE_SHU_SHI_QI", { specialPeriod: data });
      } else {
        this.getHealthData();
      }
      this.popClose();
    },

    handleChange(option) {
      console.log(option, "bingshi");
      let data = {
        medicalHistoryItems: [],
      };
      option.forEach((item) => {
        data.medicalHistoryItems.push({
          code: item.id,
          name: item.name,
        });
      });

      //回调返回数组存在数据，即执行请求操作
      if (option && option.length) {
        this.holdItemsLifeCycle("BING_SHI", {
          medicalHistory: data,
        });
      }

      this.handleClose();
    },

    confirmsClick(val) {
      let data = {
        shapeTitle: val.shapeTitle,
        shapeType: val.shapeType,
      };
      this.holdItemsLifeCycle("BCS", { bcs: data });
      this.bscClose(false);
    },

    // 养育方式回调
    commonPickerOnchange(select) {
      console.log(select, "select");
      action_report({
        action_name: "petfiles_add_raise",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif

          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif

          pet_id: this.petId,
        },
      });

      // 调用保存接口，成功即进行刷新
      const data = {
        code: select.id,
        name: select.name,
      };
      this.holdItemsLifeCycle("YAN_YU_FANG_SHI", { rearingStyle: data });
    },

    toShare() {
      // #ifdef H5
      action_report({
        action_name: "Pet_ShareFriend_click",
        module_name: "petfiles",
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          pet_id: this.petId,
        },
      });
      // #endif
      this.shareOpen = true;
    },
    confirmShare() {
      console.log("domain", h5Domain);
      // #ifdef H5
      const userId = this.$dsBridge.call("getUserId", "getUserId");
      const _link = `${
        h5Domain[process.env.NODE_ENV]
      }/h5/shareActivity/?random=123#/activity/petProfileShare`;
      const _shareUrl = `${_link}?userId=${userId}&sharePetId=${this.petId}`;
      console.log("shareurl", _shareUrl);
      this.$dsBridge.call("iphoneShare.shareByNative", {
        type: 2, // 1:朋友圈  2：微信好友 3：QQ好友 4：微博
        title: "您的好友邀请你共享萌宠成长", //标题
        content: "接受邀请可共享萌宠动态、驱虫疫苗提醒、健康成长提示等", //分享内容
        shareUrl: _shareUrl, //分享链接
        image:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/shareicon.png",
      });
      // #endif
    },
    back() {
      console.log("back back");
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      if (this.isNative) {
        this.$dsBridge.call("closeCurrentWebview", {});
      } else {
        // router.go(-1);
      }
      // #endif
    },
    showOpPop() {
      // #ifdef H5
      this.$dsBridge.call("showPetMorePopup", this.petId);
      // #endif
    },

    // 获取bsc数据
    async getItems(type) {
      try {
        const res = await GET_PET_BODY_TYPE({
          petType: type,
        });
        this.bcsItems = res.data;
        this.bcsPopupShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    async reFreshSelectPetBodyType(params) {
      console.log("reFreshSelectPetBodyType params===", params);
      let d = JSON.parse(params);
      console.log("reFreshSelectPetBodyType params===d ", d);
      let p = {
        shapeType: d.shapeType,
        petId: this.petId,
      };
      this.getWeightConfirmShape(p);

      setTimeout(() => {
        this.reFreshTime = new Date().getTime();
      }, 500);
    },
    async reFreshPetDetail(params) {
      console.log("params===", params);
      setTimeout(() => {
        this.reFreshTime = new Date().getTime();
      }, 500);
      let data = {};
      if (typeof params == "string") {
        data = JSON.parse(params);
      } else {
        data = params;
      }
      if (JSON.stringify(data) == "{}") {
        //刷新宠物列表
        await this.getInfo();
        //健康tab
        this.getHealthData();
        return;
      }
      if (data.activeTabIndex === 0) {
        //健康tab
        this.getHealthData();
      } else {
      }
    },
    async getInfo() {
      try {
        const res = await GET_PET_LIST({
          //#ifdef H5
          userId: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          //#ifdef  MP-WEIXIN
          userId: this.userInfo.userId,
          // #endif
        });
        if (!res.data?.length) {
          //跳转新增宠物页面
          //#ifdef  MP-WEIXIN
          uni.switchTab({
            url: "/pages/my/index",
          });
          // #endif
          // #ifdef H5
          if (this.isNative) {
            this.$dsBridge.call("closeCurrentWebview", {});
          } else {
            // router.go(-1);
          }
          // #endif
          return;
        }
        this.petList = res.data;
        console.log(this.petList, "this.petList");

        // this.isOwner = res.data[0].isOwner; //是否是宠物主人
        let curpet = res.data.filter((item) => item.id == this.petId).length;
        if (!this.petId || !curpet) {
          this.petId = res.data[0].id;
        }
      } catch (error) {
        console.log(error);
      }
    },

    subtract(x, y) {
      return (x * 100 - y * 100) / 100;
    },
    async getHealthData() {
      const { userId } = uni.getStorageSync("storage_info");
      const requestData = {
        petId: this.petId,
        userId: userId,
      };
      const res = await GET_HEALTH_DATA(requestData);
      this.requestFlag = true;
      this.healthData = res.data;

      this.healthData.sort((star, next) => {
        // 按页面展示顺序进行排序
        const type = [
          "TI_ZHONG",
          "BCS",
          "QU_CHONG",
          "TE_SHU_SHI_QI",
          "YI_MIAO",
          "YAN_YU_FANG_SHI",
          "BING_SHI",
        ];
        return type.indexOf(star.mark) - type.indexOf(next.mark);
      });

      this.healthData.forEach((item) => {
        // 记录体重差值
        if (item.mark == "TI_ZHONG" && item.secondLastWeight) {
          item.differValue = subtractFloat(
            item.weight,
            item.secondLastWeight.weight
          );
        }
      });

      this.dataFirst = this.healthData[0]; //记录第一项体重
      console.log(this.dataFirst, "this.dataFirst");
      this.healthData.shift();
      console.log(this.healthData, "this.healthData");
    },

    async getWeightConfirmShape(p) {
      const res = await GET_WEIGHT_CONFIRM_SHAPE(p);
    },

    changePet(id) {
      console.log("id===", id);
      //切换宠物
      this.petId = id;
      if (this.activeTabIndex == 0) {
        this.getHealthData();
      }
    },
    toggleTab(item, index) {
      if (index == 0) {
        //健康tab
        action_report({
          action_name: "petfiles_healthy_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
        this.getHealthData();
      } else if (index == 1) {
        //tab宠物档案_指标tab下内容_点击
        action_report({
          action_name: "petfiles_index_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      } else if (index == 2) {
        //宠物档案_账单tab下内容_点击
        action_report({
          action_name: "petfiles_bill_click",
          module_name: "petfiles",
          // #ifdef H5
          extend: {
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
          },
          // #endif
        });
      }
      this.activeTabIndex = index;
      this.reFreshTime = "";
    },
    handleScroll(e) {
      if (e.detail.scrollTop >= 50) {
        this.isHeaderShow = true;
      }
      if (e.detail.scrollTop < 50) {
        this.isHeaderShow = false;
      }
      if (e.detail.scrollTop >= 160) {
        this.bgColor = "#FFFFFF";
      } else {
        this.bgColor = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
