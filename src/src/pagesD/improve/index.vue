<template>
  <view class="improve-wrapper">
    <NavBar
      :title="scrollTopNum > 20 ? '继续完善档案' : ' '"
      titleColor="#1F1F1F"
      :showBackBtn="true"
      @navBackClickHandle="back"
      :customback="true"
      class="navBar"
      :class="scrollTopNum > 20 ? 'navBar-bg' : ''"
    />
    <scroll-view class="scroll-y" @scroll="scrollTop" :scroll-y="true">
      <view class="nav-bar-bgc">
        <view class="improve-title">
          <view class="improve-title__main">继续完善宠物档案</view>
          <text class="improve-title__describe">权威宠物专家助您科学养宠</text>
        </view>
        <view class="improve-img"> </view>
      </view>
      <view class="improve-wrapper__content">
        <view class="input-wrapper">
          <view class="input-title"> 当前体重 </view>
          <view class="input-content">
            <input
              class="input"
              maxlength="5"
              border="none"
              placeholder-class="placeholder"
              v-model="petLifeCycle.weight"
              placeholder="请输入"
              type="digit"
              @input="handleBlurInput"
              @blur="weightBlur"
            />
            <text class="input_kg">kg</text>
          </view>
        </view>
        <view class="variety-wrapper-box">
          <view class="variety-wrapper">
            <view class="title"> 疫苗接种 </view>
            <view class="content">
              <TagComponent
                :list="vaccineInfoColumns"
                :val="petLifeCycle.vaccineInfo.status"
                @updateSelect="updateVaccineInfo"
              ></TagComponent>
            </view>
          </view>

          <view
            class="heg"
            :class="
              petLifeCycle.vaccineInfo.status === 1
                ? 'vaccineInfo-anim-open'
                : 'vaccineInfo-anim'
            "
          >
            <view class="wrapper-line"></view>
            <view class="variety-wrapper">
              <view class="variety-title"> 疫苗类型 </view>
              <view class="content" @click="commonPickerClick('vaccineInfo')">
                <view v-if="petLifeCycle.vaccineInfo.typeName" class="right">
                  <view class="right-choosen">{{
                    petLifeCycle.vaccineInfo.typeName
                  }}</view>
                  <image
                    class="icon1"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                  ></image>
                </view>
                <view v-else class="right">
                  <view class="right-text">请选择</view>
                  <image
                    class="icon1"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                  ></image>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="variety-wrapper-box">
          <view class="variety-wrapper">
            <view class="title"> 驱虫情况 </view>
            <view class="content">
              <TagComponent
                :list="anthelminticInfoColumns"
                :val="petLifeCycle.anTheLMinTicInfo.status"
                @updateSelect="updateanthelminticInfo"
              ></TagComponent>
            </view>
          </view>
          <view
            class="heg"
            :class="
              petLifeCycle.anTheLMinTicInfo.status === 1
                ? 'anthe-min-rows'
                : 'anthe-min-rows-close'
            "
          >
            <view v-for="item in anthelminticInfoArr" :key="item.data">
              <view class="wrapper-line"></view>
              <view class="variety-wrapper">
                <view class="variety-title"> {{ item.title }} </view>
                <view
                  class="content"
                  @click="commonPickerClick('anTheLMinTicInfo', item)"
                >
                  <view
                    v-if="petLifeCycle.anTheLMinTicInfo[item.data]"
                    class="right"
                  >
                    <view class="right-choosen">{{
                      petLifeCycle.anTheLMinTicInfo[item.data]
                    }}</view>
                    <image
                      class="icon1"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                    ></image>
                  </view>
                  <view v-else class="right">
                    <view class="right-text">请选择</view>
                    <image
                      class="icon1"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                    ></image>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="variety-wrapper-box">
          <view class="variety-wrapper">
            <view class="title"> 特殊时期 </view>
            <view class="content">
              <TagComponent
                :list="specialPeriodColumns"
                :val="petLifeCycle.specialPeriod.periodCode"
                @updateSelect="updateSpecialPeriod"
              ></TagComponent>
            </view>
          </view>
          <view
            class="heg"
            :class="
              showPrenatal || showFeeding
                ? 'vaccineInfo-anim-open'
                : 'vaccineInfo-anim'
            "
          >
            <view
              class="wrapper-line"
              v-if="showPrenatal || showFeeding"
            ></view>
            <view class="variety-wrapper" v-if="showPrenatal">
              <view class="variety-title"> 预产期 </view>
              <view class="content" @click="specialPeriodClick('expectedDate')">
                <view
                  v-if="petLifeCycle.specialPeriod.expectedDate"
                  class="right"
                >
                  <view class="right-choosen">{{
                    petLifeCycle.specialPeriod.expectedDate
                  }}</view>
                  <image
                    class="icon1"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                  ></image>
                </view>
                <view v-else class="right">
                  <view class="right-text">请选择</view>
                  <image
                    class="icon1"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                  ></image>
                </view>
              </view>
            </view>
            <view class="variety-wrapper" v-if="showFeeding">
              <view class="variety-title"> 分娩时间 </view>
              <view class="content" @click="specialPeriodClick('deliveryTime')">
                <view
                  v-if="petLifeCycle.specialPeriod.deliveryTime"
                  class="right"
                >
                  <view class="right-choosen">{{
                    petLifeCycle.specialPeriod.deliveryTime
                  }}</view>
                  <image
                    class="icon1"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                  ></image>
                </view>
                <view v-else class="right">
                  <view class="right-text">请选择</view>
                  <image
                    class="icon1"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                  ></image>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="variety-wrapper-box">
          <view class="variety-wrapper">
            <view class="title"> 病史 </view>
            <view class="content" @click="medicalHistoryClick">
              <view v-if="concatenatedNames" class="right">
                <view class="right-choosen-white">
                  {{ concatenatedNames }}
                </view>
                <image
                  class="icon1"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                ></image>
              </view>
              <view v-else class="right">
                <view class="right-text">请选择</view>
                <image
                  class="icon1"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                ></image>
              </view>
            </view>
          </view>
          <view class="wrapper-line"></view>
          <view class="variety-wrapper">
            <view class="title"> BCS </view>
            <view class="content" @click="bcsShapeTypeClick">
              <view v-if="petLifeCycle.bcs.shapeType" class="right">
                <view class="right-choosen">{{
                  petLifeCycle.bcs.shapeTitle
                }}</view>
                <image
                  class="icon1"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                ></image>
              </view>
              <view v-else class="right">
                <view class="right-text">请选择</view>
                <image
                  class="icon1"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                ></image>
              </view>
            </view>
          </view>
          <view class="wrapper-line"></view>
          <view class="variety-wrapper">
            <view class="title"> 养育方式 </view>
            <view class="content" @click="commonPickerClick('rearingStyle')">
              <view v-if="petLifeCycle.rearingStyle.name" class="right">
                <view class="right-choosen">{{
                  petLifeCycle.rearingStyle.name
                }}</view>
                <image
                  class="icon1"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                ></image>
              </view>
              <view v-else class="right">
                <view class="right-text">请选择</view>
                <image
                  class="icon1"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
                ></image>
              </view>
            </view>
          </view>
        </view>
        <view class="improve-wrapper__content__box"></view>
      </view>
      <view class="improve-wrapper__bottom">
        <view class="done" @click="submit">保存</view>
      </view>
    </scroll-view>
    <!-- 开启订阅弹窗 -->
    <PopsUp
      :show.sync="photoShow"
      @calendarClick="calendarClick"
      @jumpClose="jumpClose"
      @handleClose="handleClose"
    />
    <!-- bcs选择弹窗 -->
    <BcsPopup
      :show.sync="bcsPopupShow"
      @close="close"
      :bcsItems="bcsItems"
      :bcsShapeType="bcsShapeType"
      @confirmsClick="confirmsClick"
    ></BcsPopup>
    <!-- 大弹窗 含备注 同步动态的 -->
    <HealthPop
      :healthType="healthType"
      :show.sync="healthPopShow"
      :petInfo="petInfoObj"
      type=" "
      @complete="healthPopComplete"
    ></HealthPop>
    <!-- 小弹窗 只有选项的 -->
    <CommonPicker
      v-if="isShowPop"
      :isShowPop.sync="isShowPop"
      :columns="columns"
      :secondName="secondName"
      @onchange="commonPickerOnchange"
    ></CommonPicker>
    <DatePicker
      :isShowPop.sync="isShowDatePicker"
      @onChange="dateTimeOnChange"
    ></DatePicker>
    <!-- <DateTimePicker
      :isShowPop.sync="isShowDateTimePicker"
      :birthType="specialPeriodTimer"
      :notLimit="true"
      @onChange="dateTimeOnChange"
    >

    </DateTimePicker> -->
    <SpecialLimitedTime
      :isShowPop.sync="isShowDateTimePicker"
      :birthType="specialPeriodTimer"
      :notLimit="secondType"
      @onChange="dateTimeOnChange"
    ></SpecialLimitedTime>
    <Cascader
      :isShowPop.sync="cascaderShow"
      :petType="petTypeNum"
      :petInfo="cascaderPetInfo"
      @change="cascaderChange"
      @close="cascaderClose"
    ></Cascader>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
import TagComponent from "../petInfo/components/tagComponent.vue";
import PopsUp from "./components/popsUp.vue";
import BcsPopup from "./components/bcsPopup.vue";
import HealthPop from "../components/healthPop.vue";
import CommonPicker from "../components/commonPicker.vue";
import DatePicker from "../components/datePicker.vue";
import DateTimePicker from "../components/dateTimePicker.vue";
import SpecialLimitedTime from "../components/specialLimitedTime.vue";
import Cascader from "../components/cascader.vue";
import { GET_CATEGORY_BATCHITEMS, GET_HEALTH_METADATA } from "@/api/petinfo";
import { ADD_PETS_SAVE } from "@/api/index";
import dayjs from "dayjs";
import { mapMutations } from "vuex";
import { action_report } from "@/utils/track";
const h5Domain = {
  development: "https://cn-dev01-shareactivity.chongpangpang.com/",
  test: "https://cn-dev02-shareactivity.chongpangpang.com/",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/",
  production: "https://shareactivity.chongpangpang.com/",
};
export default {
  components: {
    NavBar,
    TagComponent,
    PopsUp,
    BcsPopup,
    HealthPop,
    CommonPicker,
    DatePicker,
    Cascader,
    DateTimePicker,
    SpecialLimitedTime,
  },
  data() {
    return {
      petLifeCycle: {
        weight: "",
        vaccineInfo: {
          status: null, // 0 - 未接种 / 1 - 已接种
          typeId: "", //疫苗种类id
          typeName: "", //疫苗种类名称
        },
        anTheLMinTicInfo: {
          //驱虫信息
          status: null, // 0 - 未接种 / 1 - 定时驱虫
          deWormingTime: "", //驱虫时间
          typeId: "", //驱虫类型id
          typeName: "", //驱虫类型名称 体内 体外 内外一体
          drugId: "", //驱虫药品名称id
          drugName: "", //驱虫药品名称
          mark: "",
        },
        specialPeriod: {
          //特殊时期
          periodCode: "", //id
          periodName: "", //名称
          deliveryTime: "", // 分娩日期
          expectedDate: "", // 预产期
          mark: "",
        },
        medicalHistory: {
          //病史
          medicalHistoryItems: [],
        },
        bcs: {
          //bcs
          shapeType: "", // 直接取下拉接口值
          shapeTitle: "",
        },
        rearingStyle: {
          //养育方式 //默认家养
          code: "domesticate", // domesticate - 家养 /freeRanging 散养/ cageCulture 笼养
          name: "家养",
        },
      },
      concatenatedNames: "",
      // "status": 0, // 0 - 未接种 / 1 - 已接种
      vaccineInfoColumns: [
        { label: "已接种", id: 1 },
        { label: "未接种", id: 0 },
      ],
      anthelminticInfoColumns: [
        { label: "已驱虫", id: 1 },
        { label: "未驱虫", id: 0 },
      ],
      specialPeriodColumns: [],
      anthelminticInfoArr: [
        { title: "驱虫时间", data: "deWormingTime" },
        { title: "驱虫类型", data: "typeName" },
        { title: "驱虫品牌", data: "drugName" },
      ],
      petId: "",
      petInfo: {},
      photoShow: false,
      bcsItems: [], //bcs选项
      rearingStyleItems: [], //养育方式选项
      dewormingItems: [], //驱虫类型选项
      vaccineItems: [], //疫苗类型选项
      bcsPopupShow: false,
      healthType: 3, //// 1 疫苗 2 驱虫 3 体重
      healthPopShow: false, //带备注的弹窗
      petInfoObj: {}, //弹窗里面需要的值
      isShowPop: false, //单个选项弹窗
      columns: [],
      secondName: "", //弹窗的title
      secondType: "", //当前是哪个类型弹窗
      anthelminticInfoItem: {}, //针对驱虫的处理
      isShowDatePicker: false,
      cascaderShow: false,
      enterType: "", //路由传参
      returnedParameters: {}, //新建接口返回的参数 用于写入日历
      gotoPetHome: "", //原生是否跳到养宠页面
      lastValidValue: "", //输入框的上一个值
      cascaderPetInfo: {}, //病史弹窗需要的值
      h5Types: "", //判断是否新人链路
      bcsShapeType: "", //bcs弹窗回显的传参
      taskByCode: false, //判断是否跳到引流页
      sourceId: "",
      storeId: "",
      storeName: "",
      //   问诊
      inquiryType: "",
      selectedCouponNo: "",
      doctorUserId: "",
      selectResourceType: "",
      isSubmit: false, //保存按钮防止多次点击
      addSystemReminderSubmit: false, //订阅日历按钮防止多次点击
      isShowDateTimePicker: false, //时间弹窗
      specialPeriodTimer: "", //特殊时期回显传参
      scrollTopNum:0,
      guideCreationId:'',//引导建档弹窗继续填写
    };
  },
  async onLoad(option) {
    // #ifdef H5
    if (option.gotoPetHome) {
      console.log("gotoPetHome", typeof option.gotoPetHome, option.gotoPetHome);
      this.gotoPetHome = option.gotoPetHome;
    }
    if (option.orderId) {
      //引导建档弹窗链路跳过来的
      this.guideCreationId = option.orderId;
    }
    // #endif
    // this.petId = option.petId;
    if (option.h5Types) {
      console.log("h5Types", option.h5Types);
      this.h5Types = option.h5Types;
    }
    if(option.sourceId){
      this.sourceId = option.sourceId;
    }
    if (
      option.enterType === "askDoctor" &&
      option.inquiryType &&
      option.resourceId &&
      option.resourceType
    ) {
      this.enterType = "askDoctor";
      this.inquiryType = option.inquiryType;
      this.selectedCouponNo = option.resourceId;
      this.doctorUserId = option.doctorUserId ?? "";
      this.selectResourceType = option.resourceType;
    } else if (option.enterType === "createliving") {
      this.enterType = "createliving";
      this.sourceId = option.sourceId;
      this.storeId = option.storeId;
      this.storeName = option.storeName;
    } else if (option.enterType) {
      this.enterType = option.enterType;
    }
    if (option.taskByCode) {
      if (option.taskByCode === "true") {
        this.taskByCode = true;
      } else {
        this.taskByCode = false;
      }
      console.log("taskByCode", typeof this.taskByCode);
    }
    //TODO接入活体同步档案
    this.petInfo = uni.getStorageSync("petInfo");
    // console.log('petInfo', petInfo);
    await this.getItems();
    this.petInfoObj = {
      petIds: option.parentId, // 宠物id
      petType: this.petInfo.petType.toUpperCase(), // // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
      sex: this.petInfo.sex.toString(), // 性别: 1-GG, -2MM
    };
  },
  onShow() {
    console.log("this.isSubmit = false;", this.isSubmit);
    this.isSubmit = false;
  },
  watch: {
    "petLifeCycle.anTheLMinTicInfo.mark": {
      handler(newVal, oldVal) {
        //监听驱虫类型改变 清空驱虫品牌
        if (oldVal !== newVal) {
          this.petLifeCycle.anTheLMinTicInfo.drugId = "";
          this.petLifeCycle.anTheLMinTicInfo.drugName = "";
        }
      },
      deep: true,
      immediate: false,
    },
  },

  computed: {
    //哺乳期
    showFeeding() {
      return this.petLifeCycle.specialPeriod.mark === "TE_SHU_SHI_QI_FEEDING";
    },
    //孕期
    showPrenatal() {
      return this.petLifeCycle.specialPeriod.mark === "TE_SHU_SHI_QI_PRENATAL";
    },
    //病史传值
    petTypeNum() {
      return this.petInfo.petType === "cat" ? 1 : 2;
    },
  },
  methods: {
    ...mapMutations([
      "setUserSelectedPetId",
      "setUserPetList",
      "setSelectPetItem",
      "setHistoryPrescription",
    ]),
    scrollTop(event) {
      let { scrollTop } = event.detail;
      console.log(scrollTop);
      this.scrollTopNum = scrollTop;
    },
    handleClose() {
      this.photoShow = false;
    },
    handleBlurInput(event) {
      const newValue = event.target.value;

      // 允许输入数字、小数点和以零开头的情况
      let cleanedValue = newValue.replace(/[^0-9.]/g, "");

      // 确保只有一个零开头
      if (
        cleanedValue.startsWith("0") &&
        cleanedValue.length > 1 &&
        cleanedValue[1] !== "."
      ) {
        cleanedValue = "0" + cleanedValue.slice(1).replace(/^0+/, "");
      }

      // 确保只有一个小数点
      cleanedValue = cleanedValue.replace(/(\..*)\./g, "$1");

      // 保留一位小数
      cleanedValue = cleanedValue.replace(/(\.\d)\d*/, "$1");

      this.$nextTick(() => {
        if (cleanedValue !== newValue) {
          this.petLifeCycle.weight = this.lastValidValue; // 恢复到上一个有效的值
        } else {
          if (Number(cleanedValue) > 1000) {
            this.$refs.uToast.show({
              type: "",
              icon: false,
              message: "最高可输入1000kg",
            });
            cleanedValue = "1000";
          }
          // if (Number(cleanedValue) === 0) {
          //   cleanedValue = "";
          // }
          // 更新上一个有效的值
          this.lastValidValue = cleanedValue;
          this.petLifeCycle.weight = cleanedValue;
        }
      });
      console.log("cleanedValue", cleanedValue);
    },
    healthPopComplete(data) {
      if (this.healthType === 3) {
        //体重
        this.petLifeCycle.weight = data.weight;
      }
    },
    // 先获取类型  拿着类型的mark请求品牌
    async getcreatItems(mark) {
      try {
        let res = await GET_HEALTH_METADATA({
          mark: mark,
          petType: this.petInfo.petType.toUpperCase(),
          sex: this.petInfo.sex,
        });
        this.columns = res.data;
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    specialPeriodClick(type) {
      // 统计宠物档案页所有点击行为
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
      this.secondType = type;
      this.isShowDateTimePicker = true;
    },
    commonPickerClick(type, item) {
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
      this.secondType = type;
      this.anthelminticInfoItem = item;
      if (type === "vaccineInfo") {
        //疫苗
        this.columns = this.vaccineItems;
        this.secondName = "疫苗类型";
      } else if (type === "anTheLMinTicInfo") {
        //驱虫
        this.secondName = item.title;
        if (item.data === "deWormingTime") {
          //驱虫时间
          this.isShowDatePicker = true;
          return;
        } else if (item.data === "typeName") {
          //驱虫类型
          this.columns = this.dewormingItems;
        } else if (item.data === "drugName") {
          //驱虫品牌
          if (this.petLifeCycle.anTheLMinTicInfo.typeId) {
            this.getcreatItems(this.petLifeCycle.anTheLMinTicInfo.mark);
          } else {
            this.$refs.uToast.show({
              type: "default",
              icon: false,
              message: "请先选择驱虫类型",
            });
            return;
          }
        }
      } else if (type === "rearingStyle") {
        //养育方式
        this.columns = this.rearingStyleItems;
        this.secondName = "养育方式";
      }
      this.isShowPop = true;
    },
    weightBlur() {
      // 统计宠物档案页所有点击行为
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
    },
    //病史点击事件
    medicalHistoryClick() {
      // 统计宠物档案页所有点击行为
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
      this.cascaderPetInfo = {
        petType: this.petTypeNum,
        medicalHistoryItems:
          this.petLifeCycle.medicalHistory.medicalHistoryItems,
      };
      this.cascaderShow = true;
    },
    cascaderClose() {
      this.cascaderShow = false;
    },
    cascaderChange(list) {
      console.log("cascaderChange", list);
      this.petLifeCycle.medicalHistory.medicalHistoryItems = list.map(
        (item) => {
          item.code = item.id;
          return item;
        }
      );
      this.concatenatedNames = list.map((item) => item.name).join("/");
      console.log(this.concatenatedName, this.petLifeCycle);
      this.cascaderShow = false;
    },
    //特殊时期弹窗内容回显
    dateTimeOnChange(date) {
      if (this.secondType === "anTheLMinTicInfo") {
        //驱虫时间 回显
        this.petLifeCycle.anTheLMinTicInfo = {
          ...this.petLifeCycle.anTheLMinTicInfo,
          deWormingTime: dayjs(date).format("YYYY-MM-DD HH:mm"),
        };
      } else if (this.secondType === "expectedDate") {
        //预产期时间回显
        this.petLifeCycle.specialPeriod = {
          ...this.petLifeCycle.specialPeriod,
          expectedDate: dayjs(date).format("YYYY-MM-DD"),
        };
        this.specialPeriodTimer = dayjs(date).format("YYYY-MM-DD");
      } else if (this.secondType === "deliveryTime") {
        //分娩时间回显
        this.petLifeCycle.specialPeriod = {
          ...this.petLifeCycle.specialPeriod,
          deliveryTime: dayjs(date).format("YYYY-MM-DD"),
        };
        this.specialPeriodTimer = dayjs(date).format("YYYY-MM-DD");
      }
      console.log(this.petLifeCycle);
    },
    commonPickerOnchange(selectObj) {
      console.log(
        "selectObj",
        selectObj,
        this.secondType,
        this.anthelminticInfoItem
      );

      if (this.secondType === "vaccineInfo") {
        this.petLifeCycle.vaccineInfo = {
          ...this.petLifeCycle.vaccineInfo,
          typeId: selectObj.id,
          typeName: selectObj.name,
        };
      } else if (this.secondType === "anTheLMinTicInfo") {
        let { data } = this.anthelminticInfoItem;
        if (data === "deWormingTime") {
          //驱虫时间
          // this.
        } else if (data === "typeName") {
          //驱虫类型
          this.petLifeCycle.anTheLMinTicInfo = {
            ...this.petLifeCycle.anTheLMinTicInfo,
            typeId: selectObj.id, //驱虫类型id
            typeName: selectObj.name, //驱虫类型名称 体内 体外 内外一体
            mark: selectObj.mark,
          };
          console.log("selectObj", this.petLifeCycle.anTheLMinTicInfo);
        } else if (data === "drugName") {
          //驱虫品牌
          this.petLifeCycle.anTheLMinTicInfo = {
            ...this.petLifeCycle.anTheLMinTicInfo,
            drugId: selectObj.id, //驱虫类型id
            drugName: selectObj.name, //驱虫类型名称 体内 体外 内外一体
          };
        }
      } else if (this.secondType === "rearingStyle") {
        // "domesticate"， // domesticate - 家养 /freeRanging 散养/ cageCulture 笼养
        switch (selectObj.mark) {
          case "YAN_YU_FANG_SHI_JIA_YAN":
            this.petLifeCycle.rearingStyle.code = "domesticate";
            break;
          case "YAN_YU_FANG_SHI_SHAN_YAN":
            this.petLifeCycle.rearingStyle.code = "freeRanging";
            break;
          case "YAN_YU_FANG_SHI_LON_YAN":
            this.petLifeCycle.rearingStyle.code = "cageCulture";
            break;
          default:
        }
        this.petLifeCycle.rearingStyle.name = selectObj.name;
      }
    },
    healthPopClick(type) {
      console.log(this.petInfoObj, this.healthPopShow);

      this.healthPopShow = true;
      if (type === "weight") {
        this.healthType = 3;
      }
    },
    confirmsClick(item) {
      console.log(item);
      this.petLifeCycle.bcs.shapeType = item.shapeType;
      this.petLifeCycle.bcs.shapeTitle = item.shapeTitle;
      this.bcsPopupShow = false;
    },
    bcsShapeTypeClick() {
      // 统计宠物档案页所有点击行为
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
      this.bcsShapeType = this.petLifeCycle.bcs.shapeType;
      console.log("this.bcsShapeType", this.bcsShapeType);

      this.bcsPopupShow = true;
    },
    close(val) {
      this.bcsPopupShow = val;
    },
    async getItems() {
      try {
        const res = await GET_CATEGORY_BATCHITEMS({
          sex: this.petInfo.sex,
          petType: this.petInfo.petType.toUpperCase(),
        });
        console.log("TE_SHU_SHI_QI", res);
        let specialPeriodColumns = res.data.specialPeriodItems.map((item) => {
          if (item.name === "非特殊时期") {
            item.label = "无";
            this.updateSpecialPeriod(item);
          } else {
            item.label = item.name;
          }
          return {
            ...item,
          };
        });
        if (this.petInfo.sterilizationStatus == 2 && this.petInfo.sex == 2) {
          // 已绝育 不展示哺乳期和孕期
          // 要过滤掉的 mark 值
          const marksToFilterOut = [
            "TE_SHU_SHI_QI_PRENATAL",
            "TE_SHU_SHI_QI_FEEDING",
            "TE_SHU_SHI_QI_RUT",
          ];
          // 使用 filter 方法过滤掉具有特定 mark 的对象
          this.specialPeriodColumns = specialPeriodColumns.filter(
            (item) => !marksToFilterOut.includes(item.mark)
          );
        } else {
          this.specialPeriodColumns = specialPeriodColumns;
        }

        this.bcsItems = res.data.bcsItems;
        this.rearingStyleItems = res.data.rearingStyleItems;
        this.dewormingItems = res.data.dewormingItems;
        this.vaccineItems = res.data.vaccineItems;
      } catch (error) {
        console.log(error);
      }
    },
    //封装对写日历数据的处理
    addSystemReminderFun(nextVaccinationInfo) {
      let arr = [];
      nextVaccinationInfo.dates.forEach((item) => {
        let obj = {
          content: nextVaccinationInfo.content,
          time: dayjs(item).valueOf(),
          title: nextVaccinationInfo.title,
        };
        arr.push(obj);
      });
      return arr;
    },
    //订阅日历方法
    calendarClick() {
      try {
        if (this.addSystemReminderSubmit) {
          return;
        }
        this.addSystemReminderSubmit = true;
        let { nextVaccinationInfo, nextDeWormingInfo } =
          this.returnedParameters;
        let arr = [];
        if (nextVaccinationInfo && nextVaccinationInfo.dates.length > 0) {
          // 疫苗写入日历
          let nextVaccinationInfoArr =
            this.addSystemReminderFun(nextVaccinationInfo);
          arr = [...arr, ...nextVaccinationInfoArr];
        }
        if (nextDeWormingInfo && nextDeWormingInfo.dates.length > 0) {
          // 驱虫时间写入日历
          let nextDeWormingInfoArr =
            this.addSystemReminderFun(nextDeWormingInfo);
          arr = [...arr, ...nextDeWormingInfoArr];
        }
        this.$dsBridge.call("addSystemReminder", arr);
        // 关闭webview
        console.log(6);
        this.$dsBridge.register("addReminderCallback", this.gotoPet);
        console.log(9);
      } catch (error) {
        this.addSystemReminderSubmit = false;
        console.log(error);
      }
    },
    jumpClose() {
      // #ifdef H5
      // 关闭webview
      this.gotoPet();
      // #endif
    },
    back() {
      uni.navigateBack({
        delta: 1, // 返回的页面数
      });
    },
    getFirstPrescription(petId) {
      getPrescriptionList({
        diagnosticType: "PRESCRIPTION",
        petId: petId,
      }).then((res) => {
        this.setHistoryPrescription(res.data.data[0] || {});
        //去复诊新页面
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesA/subsequent/index?petId=${petId}&inquiryType=${this.enterType}&transparentTopBar=1`,
          closeOldWebview:1
        });
      });
    },
    gotoPet() {
      this.$dsBridge.call("createAndEditPetSuccess", {
        type: "add", //add或edit
        petId: this.petId,
      }); //调用成功的方法
      this.addSystemReminderSubmit = false;
      if (["ONLINE_PRESCRIPTION"].includes(this.enterType)) {
        //去复诊新页面
        this.getFirstPrescription(this.petId)
        return
      }
      if ((this.gotoPetHome && this.gotoPetHome === "true") || !!this.guideCreationId) {
        //跳转到养宠页面
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/home/new?mainTabKey=PET`,
          closeOldWebview:1
        });
      }else{
        this.addSystemReminderSubmit = false;
        this.$dsBridge.call("closeCurrentWebview", {});
      }
    },
    submit() {
      try {
        // 统计宠物档案页所有点击行为
        action_report({
          action_name: "petfiles_cilck",
          module_name: "Pet",
          extend: {
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            // #ifdef MP-WEIXIN
            user_id: uni.getStorageSync("storage_info").userId,
            // #endif
            type: this.h5Types,
          },
        });

        if (["0", "0.", ".0", "0.0"].includes(this.petLifeCycle.weight)) {
          this.$refs.uToast.show({
            type: "",
            icon: false,
            message: "体重不可输入0kg",
          });
          return;
        } else if (this.petLifeCycle.weight == ".") {
          this.$refs.uToast.show({
            type: "",
            icon: false,
            message: "请输入正确的体重数字",
          });
          return;
        }
        console.log("this.petLifeCycle", this.petLifeCycle);
        //选择已接种 已驱虫 特殊时期就都要校验  没选不校验
        if (this.petLifeCycle?.anTheLMinTicInfo?.status === 1) {
          if (this.petLifeCycle?.anTheLMinTicInfo?.deWormingTime === "") {
            this.$refs.uToast.show({
              type: "",
              icon: false,
              message: "驱虫时间不能为空",
            });
            return;
          } else if (this.petLifeCycle?.anTheLMinTicInfo?.typeName === "") {
            this.$refs.uToast.show({
              type: "",
              icon: false,
              message: "驱虫类型不能为空",
            });
            return;
          } else if (this.petLifeCycle?.anTheLMinTicInfo?.drugName === "") {
            this.$refs.uToast.show({
              type: "",
              icon: false,
              message: "驱虫品牌不能为空",
            });
            return;
          }
        }
        if (this.petLifeCycle?.vaccineInfo?.status === 1) {
          if (this.petLifeCycle?.vaccineInfo?.typeName === "") {
            this.$refs.uToast.show({
              type: "",
              icon: false,
              message: "疫苗类型不能为空",
            });
            return;
          }
        }
        //孕期 哺乳期校验
        //         mark: "TE_SHU_SHI_QI_FEEDING"
        // name: "哺乳期"
        // mark: "TE_SHU_SHI_QI_PRENATAL"
        // name: "孕期"
        console.log("哺乳期校验", this.showFeeding);

        if (this.showFeeding) {
          if (this.petLifeCycle?.specialPeriod?.deliveryTime === "") {
            this.$refs.uToast.show({
              type: "",
              icon: false,
              message: "分娩日期不能为空",
            });
            return;
          }
        }
        // if (this.showPrenatal) {
        //   if (this.petLifeCycle?.specialPeriod?.expectedDate === "") {
        //     this.$refs.uToast.show({
        //       type: "",
        //       icon: false,
        //       message: " 预产期不能为空",
        //     });
        //     return;
        //   }
        // }
        const petLifeCycles = JSON.parse(JSON.stringify(this.petLifeCycle));
        let deWormingTime = petLifeCycles?.anTheLMinTicInfo?.deWormingTime;
        let expectedDate = petLifeCycles?.specialPeriod?.expectedDate;
        let deliveryTime = petLifeCycles?.specialPeriod?.deliveryTime;
        if (deWormingTime) {
          petLifeCycles.anTheLMinTicInfo.deWormingTime = dayjs(
            deWormingTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (expectedDate) {
          petLifeCycles.specialPeriod.expectedDate = dayjs(expectedDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        if (deliveryTime) {
          petLifeCycles.specialPeriod.deliveryTime = dayjs(deliveryTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }

        if (petLifeCycles?.vaccineInfo?.status === null) {
          petLifeCycles.vaccineInfo = null;
        }
        if (petLifeCycles?.anTheLMinTicInfo?.status === null) {
          petLifeCycles.anTheLMinTicInfo = null;
        }
        if (!petLifeCycles?.specialPeriod?.periodCode) {
          petLifeCycles.vaccineInfo = null;
        }
        if (petLifeCycles?.medicalHistory?.medicalHistoryItems?.length === 0) {
          petLifeCycles.medicalHistory = null;
        }
        if (!petLifeCycles?.bcs?.shapeType) {
          petLifeCycles.bcs = null;
        }
        if (this.isSubmit) {
          return;
        }
        this.isSubmit = true;
        ADD_PETS_SAVE({
          ...this.petInfo,
          sourceType: this.sourceId ? 2 : 0,
          sourceId:
          this.sourceId
              ? this.sourceId
              : this.enterType === "echoDisplay"
              ? this.petInfo.sourceId
              : "",
          petLifeCycle: petLifeCycles,
        })
          .then((res) => {
            // console.log(res);

            this.petId = res.petId;
            this.returnedParameters = res.data;
            // #ifdef H5
            this.$refs.uToast.show({
              type: "",
              icon: false,
              message: "添加成功",
            });
            // 获取通知权限状态
            console.log(
              "gotoPetHome",
              typeof this.gotoPetHome,
              this.gotoPetHome
            );
            console.log(this.h5Types,'h5Typesh5Types');            
            if(this.h5Types == 'registerNew'){
              let page = h5Domain[process.env.NODE_ENV] +`#/register/new/hello?h5Types=registerNew&transparentTopBar=1`;
              this.$dsBridge.call("gotoPageThroughRoute", {
                page,
                closeOldWebview:1
              });
              return
            }
            if (this.gotoPetHome && this.gotoPetHome === "true") {
              // 新人养宠，养宠频到，我的 这三个入口才需要弹窗
              let response = this.$dsBridge.call(
                "checkNotificationsPermission",
                "checkNotificationsPermission"
              );
              console.log("checkNotificationsPermission", response);
              if (!response) {
                this.photoShow = true;
              } else {
                // 开启了通知权限就直接关闭webview
                this.gotoPet();
              }
            } else {
              // 开启了通知权限就直接关闭webview
              this.gotoPet();
            }

            // #endif
            // #ifdef MP-WEIXIN
            console.log("this.taskByCode", this.taskByCode);
            if (this.taskByCode) {
              uni.showToast({
                title: "添加成功",
                duration: 2000,
              });
              uni.reLaunch({
                url: `/pagesE/guideApp/index?type=1&backTohome=true`,
              });
              return;
            }
            if (this.enterType === "askDoctor") {
              uni.showToast({
                title: "添加成功",
                duration: 2000,
              });
              uni.reLaunch({
                url: `/pagesA/diseaseDesc/index?petId=${res.data.petId}&inquiryType=QUICK&resourceId=${this.selectedCouponNo}&doctorUserId=${this.doctorUserId}&resourceType=${this.selectResourceType}`,
                success: () => {
                  this.setUserPetList(res.data.concat([{ type: "add" }]));
                  this.setUserSelectedPetId(res.data.petId);
                },
              });
            } else {
              uni.showToast({
                title: "添加成功",
                duration: 2000,
              });
              setTimeout(() => {
                this.setSelectPetItem({});
                this.isSubmit = false;
              }, 2000);
              if (this.enterType === "taskdesc") {
                uni.navigateBack({
                  delta: 2,
                  success: () => {
                    this.setSelectPetItem({});
                  },
                });
              } else if (
                "petRecord" == this.enterType ||
                "petRecordAdd" == this.enterType
              ) {
                //跳转到健康页面
                setTimeout(() => {
                  uni.reLaunch({
                    url: `/pagesE/petRecords/index?petId=${res.data.petId}`,
                    success: () => {
                      this.setSelectPetItem({});
                    },
                  });
                }, 2000);
              } else if (
                this.enterType === "myPetAdd" ||
                this.enterType === "createliving"
              ) {
                //跳转到我的宠物
                let route =
                  this.enterType === "createliving"
                    ? `/pagesD/myPetsInfo/index?petId=${res.data.petId}&type=createliving`
                    : `/pagesD/myPetsInfo/index?petId=${res.data.petId}`;
                setTimeout(() => {
                  uni.reLaunch({
                    url: route,
                    success: () => {
                      this.setSelectPetItem({});
                    },
                  });
                }, 2000);
              } else if (this.enterType === "AI_INQUIRY") {
                setTimeout(() => {
                  uni.reLaunch({
                    url: `/pagesF/aiConsultation/index`,
                    success: () => {
                      this.setSelectPetItem({});
                    },
                  });
                }, 2000);
              } else {
                setTimeout(() => {
                  uni.switchTab({
                    url: "/pages/index/index",
                    success: () => {
                      this.setSelectPetItem({});
                    },
                  });
                }, 2000);
              }
            }
            // #endif
          })
          .catch(() => {
            this.isSubmit = false;
          });
      } catch (error) {
        console.log(error);
      }
    },
    updateVaccineInfo(item) {
      // 统计宠物档案页所有点击行为
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
      this.petLifeCycle.vaccineInfo.status = item.id;
      if (item.id === 0) {
        this.petLifeCycle.vaccineInfo.typeId = "";
        this.petLifeCycle.vaccineInfo.typeName = "";
      }
    },
    updateanthelminticInfo(item) {
      // 统计宠物档案页所有点击行为
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
      this.petLifeCycle.anTheLMinTicInfo.status = item.id;
      if (item.id === 0) {
        this.petLifeCycle.anTheLMinTicInfo = {
          ...this.petLifeCycle.anTheLMinTicInfo,
          deWormingTime: "",
          typeId: "",
          typeName: "",
          drugId: "",
          drugName: "",
          mark: "",
        };
      }
    },
    updateSpecialPeriod(item) {
      // 统计宠物档案页所有点击行为
      action_report({
        action_name: "petfiles_cilck",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          type: this.h5Types,
        },
      });
      this.petLifeCycle.specialPeriod.periodCode = item.id;
      this.petLifeCycle.specialPeriod.periodName = item.name;
      this.petLifeCycle.specialPeriod.mark = item.mark;
      this.petLifeCycle.specialPeriod.deliveryTime = "";
      this.petLifeCycle.specialPeriod.expectedDate = "";
      console.log(this.petLifeCycle.specialPeriod);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
