<template>
  <view class="pet-detail-wrapper">
    <view v-if="petDetailLonding">
      <view class="nav-bar-bgc">
        <nav-bar
          :showTitle="false"
          :showBackBtn="true"
          @navBackClickHandle="back"
          :customback="true"
        />
        <view class="head-title">
          <view class="head-title__main">{{
            petInfoTask.taskTitle ? petInfoTask.taskTitle : "创建宠物档案"
          }}</view>
          <text class="head-title__describe">{{
            petInfoTask.taskSubtitle ? petInfoTask.taskSubtitle : ""
          }}</text>
        </view>
        <view class="head-img"></view>
      </view>
      <view class="pet-detail-wrapper__content">
        <view class="mes-container">
          <view class="pettype-item">
            <view
              v-for="(item, index) in petTypeOneColumns"
              :key="index"
              :class="[
                'onetypeitem',
                `${item.type == petType ? 'selected' : ''}`,
              ]"
              @click="changePetParent(item)"
            >
              <view class="typename">{{ item.name }}</view>
            </view>
          </view>
        </view>
        <view class="first-wrapper">
          <view class="avatar" @click="changeAvatal">
            <view class="title">头像</view>

            <view class="upload-box">
              <view v-if="petInfo.avatarUrl" class="avatar-wrap">
                <image :src="petInfo.avatarUrl" mode="aspectFill" />
              </view>
              <view class="avatar-wrap-loading" v-if="loadingShow">
                <u-loading-icon
                  mode="circle"
                  color="#fee900"
                  inactiveColor="#1f1f1f"
                ></u-loading-icon>
              </view>
              <view class="upload-icon"></view>
            </view>
          </view>
          <view class="wrapper-line"></view>
          <view class="input-wrapper">
            <view class="title"> 昵称 </view>
            <view class="content">
              <input
                class="input input1"
                maxlength="10"
                placeholder-class="placeholder"
                v-model="petInfo.nickName"
                placeholder="请输入"
                @blur="inputBlur"
              />
            </view>
          </view>
          <view class="wrapper-line"></view>
          <view class="input-wrapper">
            <view class="title"> 性别 </view>
            <TagComponent
              :list="genderColumns"
              :val="petInfo.sex"
              @updateSelect="updateSex"
            ></TagComponent>
          </view>
          <view class="wrapper-line"></view>
          <view class="input-wrapper" v-if="petType == 'other'">
            <view class="title"> 种类 </view>
            <TagComponent
              :list="petTypeOtherColumns"
              :val="parentCategoryId"
              @updateSelect="updateParentId"
            ></TagComponent>
          </view>
          <view class="wrapper-line" v-if="petType == 'other'"></view>
          <view class="variety-wrapper">
            <view class="title"> 品种 </view>
            <view class="content" @click="chooseCategory">
              <view v-if="petInfo.categoryId" class="right">
                <view class="right-choosen">{{ petInfo.categoryName }}</view>
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
            <view class="title"> 出生日期 </view>
            <view class="content" @click="isShowDatePicker = !isShowDatePicker">
              <view v-if="petInfo.birth" class="right">
                <view class="right-choosen">{{ petInfo.birth }}</view>
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
          <view class="wrapper-line" v-if="petType !== 'other'"></view>
          <view class="input-wrapper" v-if="petType !== 'other'">
            <view class="title"> 是否绝育 </view>
            <TagComponent
              :list="sterColumns"
              :val="petInfo.sterilizationStatus"
              @updateSelect="updatesterilizationStatus"
            ></TagComponent>
          </view>
        </view>
        <!-- 上面是基础信息 下面判断是通过这些页面跳过来的 智能问诊才展示-->
        <view v-if="enterType === 'AI_INQUIRY'">
          <view class="variety-wrapper-box" v-if="petType != 'other'">
            <view class="cpp-describe"
              >使用智能问诊需确认疫苗接种情况和特殊时期</view
            >
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
            <view class="wrapper-line"></view>
            <view class="cpp-variety-wrapper">
              <view class="cpp-title"> 特殊时期 </view>
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
                <view
                  class="content"
                  @click="specialPeriodClick('expectedDate')"
                >
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
                <view
                  class="content"
                  @click="specialPeriodClick('deliveryTime')"
                >
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
          <view class="cpp-done">
            <view class="cpp-btn" @click="submit('AI_INQUIRY')">保存</view>
          </view>
        </view>
      </view>

      <view class="preserve-wrapper" v-if="enterType != 'AI_INQUIRY'">
        <!-- //宠医义诊QUICK、专家问诊EXPERT、在线开药（问诊开方）QUICK、报告解读REPORT_INTERPRETATION、营养咨询NUTRITION、美洗预约taskdesc 这些进来的不展示下一步-->
        <view
          class="done"
          @click="submit"
          v-if="petType == 'other' || intelligenceType === 'intelligence'"
          >保存</view
        >
        <template v-else>
          <view class="done" @click="submit('continue')"
            >{{
              recordPetInfoTask.taskSubtitle
                ? recordPetInfoTask.taskSubtitle
                : "继续完善档案"
            }}
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/petInfoRight.png"
            ></image>
          </view>
          <view class="complete-done" @click="submit"
            >已完成填写，直接进入</view
          >
        </template>
      </view>
    </view>
    <view v-else class="data-unsettled">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
        mode="scaleToFill"
      />
    </view>
    <!--生日日期 -->
    <DatetimePicker
      :isShowPop.sync="isShowDatePicker"
      :birthType="petInfo.birth"
      @onChange="dateTimeOnChange"
    ></DatetimePicker>
    <!-- 小弹窗 只有选项的 -->
    <CommonPicker
      v-if="isShowPop"
      :isShowPop.sync="isShowPop"
      :columns="columns"
      :secondName="secondName"
      @onchange="commonPickerOnchange"
    ></CommonPicker>
    <!-- 特殊时期用的时间弹窗  特殊处理 只能选t-42 获取t+70 -->
    <SpecialLimitedTime
      :isShowPop.sync="specialLimitedTimeShow"
      :feedback="secondTypeTime"
      :notLimit="secondType"
      @onChange="secondTypeTimeOnChange"
    ></SpecialLimitedTime>
    <PhotoPop :show.sync="photoShow" @event="handlePhoto" />
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { formatTime } from "@/utils/index.js";
import { ADD_PETS_SAVE } from "@/api/index";
import { GET_USERSCORE_TASKBYCODE } from "@/api/memberV2";
import { BASR_URL } from "@/utils/http";
import PhotoPop from "./components/photoPop.vue";
import MultiChoose from "./components/multichoose.vue";
import TagComponent from "./components/tagComponent.vue";
import NavBar from "@/components/navBar/index.vue";
import DatetimePicker from "../components/dateTimePicker.vue";
import { mapMutations, mapState } from "vuex";
import { action_report } from "@/utils/track";
import { GET_LIFE_BY_USER_ID, GET_HIGH_VALU_ORDERS } from "@/api/benefit";
import { GET_CATEGORY_BATCHITEMS } from "@/api/petinfo";
import dayjs from "dayjs";
const h5Domain = {
  development: "https://cn-dev01-shareactivity.chongpangpang.com/",
  test: "https://cn-dev02-shareactivity.chongpangpang.com/",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/",
  production: "https://shareactivity.chongpangpang.com/",
};
import CommonPicker from "../components/commonPicker.vue";
import SpecialLimitedTime from "../components/specialLimitedTime.vue";
export default {
  components: {
    PhotoPop,
    MultiChoose,
    NavBar,
    TagComponent,
    DatetimePicker,
    CommonPicker,
    SpecialLimitedTime,
  },
  data() {
    return {
      current: 0,
      photoShow: false,
      isSubmit: false,
      petInfo: {
        nickName: "",
        categoryId: "",
        categoryName: "",
        birth: "",
        sex: 2,
        sexName: "妹妹",
        sterilizationStatus: 0,
        sterilizationStatusDesc: "未知",
        avatarUrl: "",
        sourceId: "",
      },
      petStatus: "",
      parentCategoryId: 1,
      petType: "cat",
      isShowDatePicker: false,
      hasUpload: false,
      value1: Number(new Date()),
      petTypeOneColumns: [
        {
          name: "猫咪",
          type: "cat",
          id: 1,
        },
        {
          name: "狗狗",
          type: "dog",
          id: 50,
        },
        {
          name: "异宠",
          type: "other",
          id: 836,
        },
      ],
      //默认头像列表
      pictureList: {
        cat: "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/defaultCat.png",
        other:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/defaultDog.png",
        dog: "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/defaultOther.png",
      },
      genderColumns: [
        { label: "妹妹", id: 2 },
        { label: "弟弟", id: 1 },
      ],
      sterColumns: [
        { label: "是", id: 2 },
        { label: "否", id: 1 },
        { label: "未知", id: 0 },
      ],
      petTypeOtherColumns: [
        {
          id: 836,
          label: "鸟类",
        },
        {
          id: 214,
          label: "水族",
        },
        {
          id: 460,
          label: "爬行",
        },
        {
          id: 835,
          label: "其他",
        },
      ],
      vaccineInfoColumns: [
        { label: "已接种", id: 1 },
        { label: "未接种", id: 0 },
      ],
      specialPeriodColumns: [],
      specialPeriodArr: [],
      petLifeCycle: {
        vaccineInfo: {
          status: 0, // 0 - 未接种 / 1 - 已接种
          typeId: "", //疫苗种类id
          typeName: "", //疫苗种类名称
        },
        specialPeriod: {
          //特殊时期
          periodCode: "6746872abbf92b1b14ebd2dc", //id
          periodName: "非特殊时期", //名称
          deliveryTime: "", // 分娩日期
          expectedDate: "", // 预产期
          mark: "TE_SHU_SHI_QI_NORMAL",
        },
      },
      isShowPop: false, //单个选项弹窗
      columns: [],
      secondName: "", //弹窗的title
      secondType: "", //当前是哪个类型弹窗
      anthelminticInfoItem: {}, //针对驱虫的处理
      specialLimitedTimeShow: false,
      secondTypeTime: "",
      petId: "",
      enterType: "",
      //   问诊
      inquiryType: "",
      selectedCouponNo: "",
      doctorUserId: "",
      selectResourceType: "",
      sourceId: "",
      storeId: "",
      storeName: "",
      petInfoTask: {}, //顶部返回胖豆文案
      recordPetInfoTask: {}, //继续完善按钮的文案 是否返回胖豆
      taskByCode: false, //根据接口返回判断是否建档完成过
      gotoPetHome: "", //app跳转判断用
      h5Types: "", //registerNew表示新人养宠
      loadingShow: false, //头像的加载中
      apptype: "", //表示是原生跳到这个页面的或者新人链路跳过来  不是小程序内部跳转
      petDetailLonding: false, //活体添加宠物可能需要数据回显 这个时候以后接口可能查询比较久  所以加一个加载中 数据加载完再显示页面
      guideCreationId: "", //引导建档需要的订单id
      intelligenceType: "",
      nopet: "",
    };
  },
  mounted() {
    uni.$on("selectPetType", (option) => {
      console.log("11 selectPetType option ", option);
      this.petInfo = {
        ...uni.getStorageSync("petInfo"),
        categoryName: option.categoryName,
        categoryId: option.categoryId,
      };
    });
  },
  onLoad(option) {
    // #ifdef H5
    if (option.gotoPetHome) {
      //app传过来的 用于判断是否跳到养宠频道
      console.log("gotoPetHome", option.gotoPetHome);
      this.gotoPetHome = option.gotoPetHome;
    }
    if (option.apptype) {
      //app或者通过原生方法跳过来的 新增 编辑都需要传 用于返回按钮的判断 以及提交逻辑判断 是否需要关闭webview
      console.log("apptype", option.apptype);
      this.apptype = option.apptype;
    }
    if (option.h5Types) {
      // registerNew表示新人养宠链路
      console.log("h5Types", option.h5Types);
      this.h5Types = option.h5Types;
    }
    if (option.orderId) {
      //引导建档弹窗链路跳过来的
      this.guideCreationId = option.orderId;
      this.getByUserId(option.orderId);
    }
    // #endif

    if (
      option.type === "askDoctor" &&
      option.inquiryType &&
      option.resourceId &&
      option.resourceType
    ) {
      this.enterType = "askDoctor";
      this.inquiryType = option.inquiryType;
      this.selectedCouponNo = option.resourceId;
      this.doctorUserId = option.doctorUserId ?? "";
      this.selectResourceType = option.resourceType;
    }
    if (option.type === "taskdesc") {
      this.enterType = "taskdesc";
    }
    //智能问诊
    if (option.type === "AI_INQUIRY") {
      this.enterType = "AI_INQUIRY";
    }
    //复诊开方
    if (option.type === "ONLINE_PRESCRIPTION") {
      this.enterType = "ONLINE_PRESCRIPTION";
    }
    if (option.nopet) {
      //小程序智能问诊没有宠物时候的传参
      this.nopet = option.nopet;
    }
    //智能问诊AI_INQUIRY， 宠医义诊QUICK、专家问诊EXPERT、在线开药（问诊开方）QUICK、报告解读REPORT_INTERPRETATION、营养咨询NUTRITION、美洗预约YUYUEXIMEI
    if (
      [
        "QUICK",
        "EXPERT",
        "REPORT_INTERPRETATION",
        "NUTRITION",
        "YUYUEXIMEI",
      ].includes(option.type)
    ) {
      this.enterType = option.type;
      this.intelligenceType = "intelligence";
    }
    // 从问诊过来的要给默认头像
    if (
      this.enterType == "AI_INQUIRY" ||
      this.intelligenceType == "intelligence"
    ) {
      this.petInfo.avatarUrl = this.pictureList[this.petType];
    }

    if (option.enterType === "petRecord") {
      this.enterType = "petRecord";
    } else if (option.enterType === "petRecordAdd") {
      this.enterType = "petRecordAdd";
    } else if (option.enterType === "myPetAdd") {
      this.enterType = "myPetAdd";
    } else if (option.enterType === "createliving") {
      this.enterType = "createliving";
      this.sourceId = option.sourceId;
      this.storeId = option.storeId;
      this.storeName = option.storeName;
      //TODO接入活体同步档案
      console.log("option", option);
      let _data = this.petTypeOneColumns.filter(
        (item, index) => item.id == option.parentCategoryId
      );
      this.petType = _data[0]?.type ? _data[0]?.type : "other"; //处理异宠状态宠物类型选择
      this.petInfo = {
        ...option,
        sterilizationStatus: 0,
        sterilizationStatusDesc: "未知",
        sex: Number(option.sex) ? Number(option.sex) : 2,
      };
      console.log("aa==", this.petInfo);
    }
    if (option.enterType === "echoDisplay") {
      //高价值异宠跳过来 数据回显
      // 新建宠物档案页，同步活体订单的流程
      this.petDetailLonding = false;
      this.enterType = "echoDisplay";
      this.getByUserId();
    } else {
      // 其他的新增页面可以不需要加载中目前
      this.petDetailLonding = true;
    }
    console.log("this.enterType", option.type, this.enterType);
    //获取奖励胖豆以及文案的接口
    this.getTaskByCode();
  },
  onShow() {
    this.isSubmit = false;
    this.getItems();
  },
  computed: {
    ...mapState(["userSelectedPetId"]),
    hasValidate() {
      if (this.enterType == "AI_INQUIRY") {
        return this.petInfo?.nickName &&
          this.petInfo?.categoryId &&
          this.petInfo?.birth
          ? true
          : false;
      } else {
        return this.petInfo?.avatarUrl &&
          this.petInfo?.nickName &&
          this.petInfo?.categoryId &&
          this.petInfo?.birth
          ? true
          : false;
      }
    },

    //哺乳期
    showFeeding() {
      return this.petLifeCycle.specialPeriod.mark === "TE_SHU_SHI_QI_FEEDING";
    },
    //孕期
    showPrenatal() {
      return this.petLifeCycle.specialPeriod.mark === "TE_SHU_SHI_QI_PRENATAL";
    },
  },
  methods: {
    ...mapMutations([
      "setUserSelectedPetId",
      "setUserPetList",
      "setSelectPetItem",
      "setHistoryPrescription",
    ]),

    async getByUserId(orderId) {
      try {
        let res;
        if (orderId) {
          //引导建档需要调用的获取宠物信息的接口
          res = await GET_HIGH_VALU_ORDERS({
            memberId: this.$dsBridge.call("getUserId", "getUserId") || "",
            orderId: this.guideCreationId,
          });
        } else {
          res = await GET_LIFE_BY_USER_ID({
            memberId: uni.getStorageSync("storage_info").userId || "",
            // memberId:'390701254868123648',
          });
        }
        let liveDetailResponse = res.data?.data?.liveDetailResponse;
        //是空就不处理
        if (!liveDetailResponse) {
          this.petDetailLonding = true;
          return;
        }
        console.log("getByUserId", res);
        // 引导建档数据的回显
        this.petInfo.avatarUrl = liveDetailResponse?.majorPicture;
        this.petInfo.birth = dayjs(liveDetailResponse?.birthDay).format(
          "YYYY-MM-DD"
        );
        let firstCategoryId = liveDetailResponse?.firstCategoryId;
        this.parentCategoryId = firstCategoryId;
        let _data = this.petTypeOneColumns.filter(
          (item, index) => item.id == firstCategoryId
        );
        this.petType = _data[0]?.type ? _data[0]?.type : "other"; //处理异宠状态宠物类型选择
        this.petInfo.categoryId = liveDetailResponse?.secondCategoryId;
        this.petInfo.categoryName = liveDetailResponse?.secondCategoryName;

        let gender = liveDetailResponse?.gender;
        let _gender = this.genderColumns.filter(
          (item, index) => item.id == gender
        );
        this.petInfo.sex = gender;
        this.petInfo.sexName = _gender?.label;
        this.petInfo.sourceId = res.data?.data?.orderId;
        //进行统一记录 sourceId


        this.sourceId = res.data?.data?.orderId;
        console.log('this.sourceId',this.sourceId);
        this.petDetailLonding = true;
      } catch (error) {
        this.petDetailLonding = true;
        console.log(error);
      }
      console.log(orderId);
    },
    inputBlur() {
      uni.hideKeyboard();
    },
    updateVaccineInfo(item) {
      this.petLifeCycle.vaccineInfo.status = item.id;
      if (item.id === 0) {
        this.petLifeCycle.vaccineInfo.typeId = "";
        this.petLifeCycle.vaccineInfo.typeName = "";
      }
    },
    updateSpecialPeriod(item) {
      this.petLifeCycle.specialPeriod.periodCode = item.id;
      this.petLifeCycle.specialPeriod.periodName = item.name;
      this.petLifeCycle.specialPeriod.mark = item.mark;
      this.petLifeCycle.specialPeriod.deliveryTime = "";
      this.petLifeCycle.specialPeriod.expectedDate = "";
      console.log(this.petLifeCycle.specialPeriod);
    },
    commonPickerClick(type, item) {
      this.secondType = type;
      this.anthelminticInfoItem = item;
      if (type === "vaccineInfo") {
        //疫苗
        this.columns = this.vaccineItems;
        this.secondName = "疫苗类型";
      }
      this.isShowPop = true;
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
      }
    },
    specialPeriodClick(type) {
      this.secondType = type;
      if (type == "expectedDate") {
        //预产期
        this.secondTypeTime = this.petLifeCycle?.specialPeriod?.expectedDate;
      } else if (type == "deliveryTime") {
        //分娩时间
        this.secondTypeTime = this.petLifeCycle?.specialPeriod?.deliveryTime;
      }
      this.specialLimitedTimeShow = true;
    },
    secondTypeTimeOnChange(data) {
      if (this.secondType == "expectedDate") {
        //预产期
        this.petLifeCycle.specialPeriod.expectedDate = formatTime(data);
      } else if (this.secondType == "deliveryTime") {
        //分娩时间
        this.petLifeCycle.specialPeriod.deliveryTime = formatTime(data);
      }
      this.specialLimitedTimeShow = false;
    },
    async getItems() {
      try {
        const res = await GET_CATEGORY_BATCHITEMS({
          sex: this.petInfo.sex,
          petType: this.petType.toUpperCase(),
        });
        console.log("TE_SHU_SHI_QI", res);
        let specialPeriodColumns = res.data.specialPeriodItems.map((item) => {
          item.label = item.name;
          return {
            ...item,
          };
        });
        if (this.petInfo.sterilizationStatus == 2 && this.petInfo.sex == 2) {
          // 雌性 已绝育 不展示哺乳期和孕期 发情期
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
          //已绝育的情况下 更新了数组 选中的也要改成默认的
          this.petLifeCycle.specialPeriod = {
            //特殊时期
            periodCode: "6746872abbf92b1b14ebd2dc", //id
            periodName: "非特殊时期", //名称
            deliveryTime: "", // 分娩日期
            expectedDate: "", // 预产期
            mark: "TE_SHU_SHI_QI_NORMAL",
          };
        } else {
          this.specialPeriodColumns = specialPeriodColumns;
          console.log("specialPeriodColumns", this.specialPeriodColumns);
          //判断选中的是否在更新的数组中   不存在默认选中第一个  存在就不处理
          const exists = this.specialPeriodColumns.some(
            (item) => item.id === this.petLifeCycle.specialPeriod.periodCode
          );
          if (!exists) {
            this.petLifeCycle.specialPeriod = {
              //特殊时期
              periodCode: "6746872abbf92b1b14ebd2dc", //id
              periodName: "非特殊时期", //名称
              deliveryTime: "", // 分娩日期
              expectedDate: "", // 预产期
              mark: "TE_SHU_SHI_QI_NORMAL",
            };
          }
        }
        this.specialPeriodArr = JSON.parse(
          JSON.stringify(specialPeriodColumns)
        );
        this.vaccineItems = res.data.vaccineItems;
      } catch (error) {
        console.log(error);
      }
    },
    back() {
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
      console.log("registerNew", this.apptype, this.h5Types);

      if (this.apptype) {
        //原生页面进来 直接关闭
        this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
        return;
      }
      if ("petRecord" == this.enterType) {
        uni.redirectTo({
          url: `/pagesE/petRecords/index?petId=${this.petId}`,
        });
      } else if ("petRecordAdd" == this.enterType) {
        console.log("handleAddPet petId ", this.petId);
        uni.redirectTo({
          url: `/pagesE/petRecords/index?petId=${this.petId}`,
        });
      } else if (this.enterType == "myPetAdd") {
        uni.redirectTo({
          url: `/pagesD/myPetsInfo/index?petId=${this.petId}`,
        });
      } else {
        uni.navigateBack({
          delta: 1, // 返回的页面数
        });
      }
      return;
    },
    dateTimeOnChange(data) {
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
      this.petInfo = { ...this.petInfo, birth: formatTime(data) };
      this.isShowDatePicker = false;
    },
    async getTaskByCode() {
      // "PET_INFO_TASK","RECORD_PET_DAILY_TASK"
      try {
        const res = await GET_USERSCORE_TASKBYCODE({
          taskCodes: ["PET_INFO_TASK", "RECORD_PET_DAILY_TASK"],
        });
        //完成过任务就不返回数据
        console.log("getTaskByCode", res.data);

        if (res.data.length > 0) {
          //未完成建档
          this.taskByCode = true;
          res.data.forEach((item) => {
            if (item.taskCode === "PET_INFO_TASK") {
              this.petInfoTask = item;
            } else {
              this.recordPetInfoTask = item;
            }
          });
        } else {
          //已完成建档
          this.taskByCode = false;
        }

        console.log("GET_USERSCORE_TASKBYCODE", res);
      } catch (error) {
        console.log(error);
      }
    },
    updateSex(item) {
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
      this.petInfo = {
        ...this.petInfo,
        sex: item.id,
        sexName: item.label,
      };
      this.getItems();
    },
    updateParentId(item) {
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
      this.parentCategoryId = item.id;
      this.petInfo = {
        ...this.petInfo,
        categoryId: "",
        categoryName: "",
      };
    },
    updatesterilizationStatus(item) {
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
      this.petInfo = {
        ...this.petInfo,
        sterilizationStatus: item.id,
        sterilizationStatusDesc: item.label,
      };
      //考虑用缓存数据
      if (this.petInfo.sterilizationStatus == 2 && this.petInfo.sex == 2) {
        // 已绝育 不展示哺乳期和孕期
        // 要过滤掉的 mark 值
        const marksToFilterOut = [
          "TE_SHU_SHI_QI_PRENATAL",
          "TE_SHU_SHI_QI_FEEDING",
          "TE_SHU_SHI_QI_RUT",
        ];
        // 使用 filter 方法过滤掉具有特定 mark 的对象
        this.specialPeriodColumns = this.specialPeriodArr.filter(
          (item) => !marksToFilterOut.includes(item.mark)
        );
        //已绝育的情况下 更新了数组 选中的也要改成默认的
        this.petLifeCycle.specialPeriod = {
          //特殊时期
          periodCode: "6746872abbf92b1b14ebd2dc", //id
          periodName: "非特殊时期", //名称
          deliveryTime: "", // 分娩日期
          expectedDate: "", // 预产期
          mark: "TE_SHU_SHI_QI_NORMAL",
        };
      } else {
        this.specialPeriodColumns = this.specialPeriodArr;
      }
    },
    changePetParent(item) {
      console.log("item", item);

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
      this.petType = item.type;
      this.parentCategoryId = item.id;
      this.petInfo = {
        ...this.petInfo,
        categoryId: "",
        categoryName: "",
      };
      this.getItems();
      //判断是不是默认头像  不是默认头像就说明是用户传的  就不用切换为默认头像
      //Object.values对象格式提取成数组进行遍历
      let screen = Object.values(this.pictureList).some(
        (item) => item === this.petInfo.avatarUrl
      );
      console.log("screen", screen);
      if (screen) {
        // 从问诊过来的要给默认头像
        if (
          this.enterType == "AI_INQUIRY" ||
          this.intelligenceType == "intelligence"
        ) {
          this.petInfo.avatarUrl = this.pictureList[item.type];
        }
      }
    },
    changeAvatal() {
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
      // #ifdef MP-WEIXIN
      this.photoShow = true;
      // #endif
      // #ifdef H5
      const systemInfo = uni.getSystemInfoSync();
      if (systemInfo.platform !== "ios") {
        this.handlePhoto(1);
      } else {
        this.handlePhoto(0);
      }
      // #endif
    },
    handlePhoto(data) {
      const that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: data == 1 ? ["camera"] : ["album"],
        success: function (res) {
          that.loadingShow = true;
          // console.log("res resddddddd", res);
          const url = process.env.NODE_ENV?.includes("local")
            ? "/api/"
            : BASR_URL;
          const uploadTask = uni.uploadFile({
            url: url + "cpp-common-management/v1/file/upload",
            filePath: res.tempFilePaths[0],
            name: "file",
            header: {
              Authorization: uni.getStorageSync("storage_info").token,
              fromChannel: "MP",
            },
            formData: {
              file: res.tempFilePaths[0],
            },
            success: (uploadFileRes) => {
              // that.setHeadPortrait(uploadFileRes.data || "");
              that.loadingShow = false;
              console.log(uploadFileRes);
              that.petInfo = { ...that.petInfo, avatarUrl: uploadFileRes.data };
            },
            fail: (res) => {
              that.loadingShow = false;
              console.log(res);
            },
          });
        },
      });
    },
    chooseCategory() {
      uni.hideKeyboard();
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
      uni.setStorageSync("petInfo", { ...this.petInfo });
      setTimeout(() => {
        uni.navigateTo({
          url: `/pagesA/selectTypeTwo/index?parentId=${this.parentCategoryId}`,
        });
      }, 100);
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
    submit(type) {
      if (!this.hasValidate) {
        if (!this.petInfo.avatarUrl && type != "AI_INQUIRY") {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "请上传宠物头像",
          });
        } else if (!this.petInfo.nickName) {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "请填写宠物昵称",
          });
        } else if (!this.petInfo.categoryId) {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "请选择宠物品种",
          });
        } else if (!this.petInfo.birth) {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "请选择宠物出生日期",
          });
        }
        return;
      }
      if (type == "AI_INQUIRY" && this.petLifeCycle.vaccineInfo.status) {
        //选了已接种疫苗种类必选
        if (!this.petLifeCycle.vaccineInfo.typeName) {
          console.log("AI_INQUIRY", this.petLifeCycle.vaccineInfo);
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "请选择疫苗种类",
          });
          return;
        }
      }
      if (type == "AI_INQUIRY" && this.showFeeding) {
        //只有哺乳期的分娩时间必填
        if (!this.petLifeCycle.specialPeriod.deliveryTime) {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "请选择分娩日期",
          });
          return;
        }
      }
      if (this.isSubmit) {
        return;
      }
      this.isSubmit = true;
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
        console.log("res.data.petId = 0 ", this.petInfo);
        //新建逻辑
        if (type === "continue") {
          this.isSubmit = false;
          //点击继续编辑档案
          uni.setStorageSync("petInfo", {
            ...this.petInfo,
            petType: this.petType,
          });
          if (this.enterType === "askDoctor") {
            uni.navigateTo({
              url: `/pagesD/improve/index?enterType=${this.enterType}&gotoPetHome=${this.gotoPetHome}&h5Types=${this.h5Types}&taskByCode=${this.taskByCode}&inquiryType=${this.inquiryType}&resourceId=${this.resourceId}&resourceType=${this.resourceType}&doctorUserId=${this.doctorUserId}`,
            });
          } else if (this.enterType === "createliving") {
            //两种情况都是通过弹窗建档  但是来源不一样 通过弹窗引导建档的 要吧sourceId带到下个页面 保存时候传递
            uni.navigateTo({
              url: `/pagesD/improve/index?enterType=${this.enterType}&gotoPetHome=${this.gotoPetHome}&h5Types=${this.h5Types}&taskByCode=${this.taskByCode}&sourceId=${this.sourceId}&storeId=${this.storeId}&storeName=${this.storeName}`,
            });
          } else if (this.guideCreationId) {
            //两种情况都是通过弹窗建档  但是来源不一样 通过弹窗引导建档的 要吧sourceId带到下个页面 保存时候传递
            uni.navigateTo({
              url: `/pagesD/improve/index?enterType=${this.enterType}&orderId=${this.guideCreationId}&gotoPetHome=${this.gotoPetHome}&h5Types=${this.h5Types}&taskByCode=${this.taskByCode}&sourceId=${this.sourceId}&storeId=${this.storeId}&storeName=${this.storeName}`,
            });
          } else {
            uni.navigateTo({
              url: `/pagesD/improve/index?enterType=${this.enterType}&gotoPetHome=${this.gotoPetHome}&h5Types=${this.h5Types}&taskByCode=${this.taskByCode}`,
            });
          }
        } else {
          let petLifeCycle = JSON.parse(JSON.stringify(this.petLifeCycle));
          petLifeCycle.specialPeriod.deliveryTime = petLifeCycle?.specialPeriod
            ?.deliveryTime
            ? dayjs(petLifeCycle?.specialPeriod?.deliveryTime).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "";
          petLifeCycle.specialPeriod.expectedDate = petLifeCycle?.specialPeriod
            ?.expectedDate
            ? dayjs(petLifeCycle?.specialPeriod?.expectedDate).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "";
          //异宠 和 点击直接进入的逻辑
          ADD_PETS_SAVE({
            ...this.petInfo,
            sterilizationStatus:
              this.petType == "other" ? 0 : this.petInfo.sterilizationStatus,
            sterilizationStatusDesc:
              this.petType == "other"
                ? "未知"
                : this.petInfo.sterilizationStatusDesc,

            sourceType: this.sourceId ? 2 : 0,
            sourceId: this.sourceId || "",
            //之前逻辑不变 生命周期传空
            petLifeCycle: type == "AI_INQUIRY" ? petLifeCycle : {},
          })
            .then((res) => {
              action_report({
                action_name: "IntelligentconsultationIM__AddPet",
                module_name: "ai_consultation",
                extend: {
                  source:
                    uni.getStorageSync("umt_extend").umt_code ||
                    uni.getStorageSync("shareType"),
                },
              });
              console.log("res.data.petId = 1 ", res);
              // #ifdef MP-WEIXIN
              //之前的逻辑保留 如果首次建档 跳转到引导页）
              console.log("taskByCode", this.taskByCode);
              // 判断是否跳到引流页  智能问诊在小程序保存之后不需要去引导页
              if (this.taskByCode && this.enterType != 'AI_INQUIRY') {
                uni.showToast({
                  title: "添加成功",
                  duration: 2000,
                });
                uni.redirectTo({
                  url: `/pagesE/guideApp/index?type=1&backTohome=true`,
                });
                return;
              }
              // 路由跳转逻辑
              if (this.enterType === "askDoctor") {
                uni.showToast({
                  title: "添加成功",
                  duration: 2000,
                });
                uni.redirectTo({
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
                if (
                  this.enterType === "taskdesc" ||
                  this.enterType === "YUYUEXIMEI" ||
                  this.enterType === "echoDisplay" ||
                  (this.enterType === "AI_INQUIRY" && this.nopet != "nopet")
                ) {
                  //this.enterType === "AI_INQUIRY" && this.nopet != "nopet" 这个条件是  有宠物的时候点击新增问诊  创建完之后返回上一页
                  uni.navigateBack({
                    delta: 1,
                    success: () => {
                      this.setSelectPetItem({});
                    },
                  });
                } else if (
                  this.enterType === "AI_INQUIRY" &&
                  this.nopet === "nopet"
                ) {
                  //没有宠物的时候点击新增问诊  创建完之后跳到问诊页面
                  uni.redirectTo({
                    url: `/pagesF/aiConsultation/index?petId=${res.data.petId}&inquiryType=AI_INQUIRY`,
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
                    uni.redirectTo({
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
                    uni.redirectTo({
                      url: route,
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
              // #ifdef H5
              this.$refs.uToast.show({
                type: "",
                icon: false,
                message: "添加成功",
              });
              this.$dsBridge.call("createAndEditPetSuccess", {
                type: "add", //add或edit
                petId: res.data.petId,
              }); //调用成功的方法
              // 注册引导页链路跳转创作者中心页
              if(this.h5Types == 'registerNew'){
                let page = h5Domain[process.env.NODE_ENV] +`#/register/new/hello?h5Types=registerNew&transparentTopBar=1`;
                this.$dsBridge.call("gotoPageThroughRoute", {
                  page,
                  closeOldWebview:1
                });
                return
              }
              if (
                (this.gotoPetHome && this.gotoPetHome === "true") ||
                !!this.guideCreationId
              ) {
                //跳转到养宠页面
                this.$dsBridge.call("gotoPageThroughRoute", {
                  page: `/home/new?mainTabKey=PET`,
                  closeOldWebview:1
                });
                // this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
              }
              if (this.nopet == "nopet") {
                //判断没有宠物跳到新加宠物页面 还是有宠物跳过来的 进行不同的跳转
                this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
              } else {
                // 智能问诊AI_INQUIRY， 宠医义诊QUICK、专家问诊EXPERT、在线开药（问诊开方）QUICK、报告解读REPORT_INTERPRETATION、营养咨询NUTRITION、美洗预约YUYUEXIMEI
                if (["QUICK", "EXPERT"].includes(this.enterType)) {
                  // 宠医义诊QUICK、专家问诊EXPERT
                  this.$dsBridge.call("gotoPageThroughRoute", {
                    page: `${window.location.origin}/crm-medical-h5/#/pagesA/diseaseDesc/index?petId=${res.data.petId}&inquiryType=${this.enterType}&transparentTopBar=1`,
                    closeOldWebview:1
                  });
                } else if (["REPORT_INTERPRETATION"].includes(this.enterType)) {
                  // 报告解读REPORT_INTERPRETATION
                  this.$dsBridge.call("gotoPageThroughRoute", {
                    page: `${window.location.origin}/crm-medical-h5/#/pagesA/reportInterpretation/index?petId=${res.data.petId}&transparentTopBar=1`,
                    closeOldWebview:1
                  });
                } else if (["NUTRITION"].includes(this.enterType)) {
                  // 营养咨询NUTRITION
                  this.$dsBridge.call("gotoPageThroughRoute", {
                    page: `${window.location.origin}/crm-medical-h5/#/pagesA/nutritionDesc/index?petId=${res.data.petId}&inquiryType=NUTRITION&transparentTopBar=1`,
                    closeOldWebview:1
                  });
                } else if (["AI_INQUIRY"].includes(this.enterType)) {
                  //ai问诊
                  this.$dsBridge.call("gotoPageThroughRoute", {
                    page: `${window.location.origin}/crm-medical-h5/#/pagesF/aiConsultation/index?petId=${res.data.petId}&inquiryType=AI_INQUIRY&transparentTopBar=1`,
                    closeOldWebview:1
                  });
                } else if (["ONLINE_PRESCRIPTION"].includes(this.enterType)) {
                  //去复诊新页面
                  this.getFirstPrescription(res.data.petId);
                }else{
                  // 兜底 直接关闭
                  this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
                }
              }

              // #endif
            })
            .catch(() => {
              this.isSubmit = false;
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
