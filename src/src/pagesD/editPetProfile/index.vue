<template>
  <view class="pet-detail-wrapper">
    <NavBar
      :title="scrollTopNum > 20 ? '完善宠物档案' : ' '"
      titleColor="#1F1F1F"
      :showBackBtn="true"
      @navBackClickHandle="back"
      :customback="true"
      class="navBar"
      :class="scrollTopNum > 20 ? 'navBar-bg' : ''"
    />
    <scroll-view
      class="scroll-y"
      @scroll="scrollTop"
      :scroll-y="true"
      v-if="petDetailLonding"
    >
      <view class="nav-bar-bgc">
        <view class="improve-title">
          <view class="improve-title__main">完善宠物档案</view>
          <text class="improve-title__describe">权威宠物专家助您科学养宠</text>
        </view>
        <view class="improve-img"> </view>
      </view>
      <view class="pet-detail-wrapper__content">
        <view class="first-box">
          <view class="avatar" @click="changeAvatal">
            <view class="title" :class="{ op: enterType == 'AI_INQUIRY' }"
              >头像</view
            >
            <view class="upload-box" :class="{ op: enterType == 'AI_INQUIRY' }">
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
            <view class="title" :class="{ op: enterType == 'AI_INQUIRY' }">
              昵称
            </view>
            <view class="content" :class="{ op: enterType == 'AI_INQUIRY' }">
              <input
                class="input input1"
                maxlength="10"
                placeholder-class="placeholder"
                v-model="petInfo.nickName"
                :disabled="enterType == 'AI_INQUIRY'"
                placeholder="请输入"
                @blur="inputBlur"
              />
            </view>
          </view>
          <view class="wrapper-line"></view>

          <view class="input-wrapper">
            <view class="title" :class="{ op: enterType == 'AI_INQUIRY' }">
              性别
            </view>
            <TagComponent
              :list="genderColumns"
              :val="petInfo.sex"
              :disabled="enterType == 'AI_INQUIRY'"
              @updateSelect="updateSex"
            ></TagComponent>
          </view>
          <view class="wrapper-line"></view>

          <view class="input-wrapper" v-if="petType == 'other'">
            <view class="title" :class="{ op: enterType == 'AI_INQUIRY' }">
              种类
            </view>
            <TagComponent
              :list="petTypeOtherColumns"
              :val="parentCategoryId"
              :disabled="enterType == 'AI_INQUIRY'"
              @updateSelect="updateParentId"
            ></TagComponent>
          </view>
          <view class="wrapper-line" v-if="petType == 'other'"></view>

          <view class="variety-wrapper">
            <view class="title" :class="{ op: enterType == 'AI_INQUIRY' }">
              品种
            </view>
            <view
              class="content"
              :class="{ op: enterType == 'AI_INQUIRY' }"
              @click="chooseCategory"
            >
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
            <view class="title" :class="{ op: enterType == 'AI_INQUIRY' }">
              出生日期
            </view>
            <view
              class="content"
              :class="{ op: enterType == 'AI_INQUIRY' }"
              @click="specialPeriodClick('birth')"
            >
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
          <template v-if="petType !== 'other'">
            <view class="wrapper-line"></view>
            <view class="input-wrapper">
              <view class="title" :class="{ op: enterType == 'AI_INQUIRY' }">
                是否绝育
              </view>
              <TagComponent
                :list="sterColumns"
                :val="petInfo.sterilizationStatus"
                :disabled="enterType == 'AI_INQUIRY'"
                @updateSelect="updatesterilizationStatus"
              ></TagComponent>
            </view>
          </template>
        </view>
        <!-- 不是智能问诊过来的展示 -->
        <view v-if="enterType != 'AI_INQUIRY'">
          <template v-if="petType !== 'other'">
            <view class="variety-wrapper-box">
              <view class="variety-wrapper">
                <view class="variety-title"> 当前体重 </view>
                <view class="content" @click="healthPopClick('weight')">
                  <view v-if="petLifeCycle.weight" class="right">
                    <view class="right-choosen">{{ petLifeCycle.weight }}</view>
                    <text class="right-kg">kg</text>
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
                <view class="variety-title"> 疫苗接种 </view>
                <view class="content" @click="healthPopClick('vaccineInfo')">
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
              <view class="wrapper-line"></view>
              <view class="variety-wrapper">
                <view class="variety-title"> 驱虫情况 </view>
                <view
                  class="content"
                  @click="healthPopClick('anTheLMinTicInfo')"
                >
                  <view
                    v-if="
                      petLifeCycle.anTheLMinTicInfo.typeName ||
                      petLifeCycle.anTheLMinTicInfo.drugName
                    "
                    class="right"
                  >
                    <view class="right-choosen"
                      >{{ petLifeCycle.anTheLMinTicInfo.typeName }} |
                      {{ petLifeCycle.anTheLMinTicInfo.drugName }}</view
                    >
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
                <view class="variety-title"> 特殊时期 </view>
                <view class="content" @click="healthPopClick('specialPeriod')">
                  <view
                    v-if="petLifeCycle.specialPeriod.periodName"
                    class="right"
                  >
                    <view class="right-choosen">{{
                      petLifeCycle.specialPeriod.periodName
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
                <view
                  class="content"
                  @click="commonPickerClick('rearingStyle')"
                >
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
          </template>
        </view>
        <!-- 智能问诊过来的 非异宠展示 -->
        <view
          class="variety-wrapper-box"
          v-if="enterType == 'AI_INQUIRY' && petType !== 'other'"
          :class="enterType == 'AI_INQUIRY' ? 'cpp-pd' : ''"
        >
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
              <view class="variety-title"> 疫苗接种 </view>
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

        <view class="pet-detail-wrapper__content__box"></view>
      </view>
      <view class="preserve-wrapper">
        <view
          class="done"
          @click="submit"
          v-if="enterType != 'AI_INQUIRY' || petType == 'other'"
          >保存</view
        >
        <view class="done" @click="submit('AI_INQUIRY')" v-else>开始问诊</view>
      </view>
    </scroll-view>

    <view v-else class="data-unsettled">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
        mode="scaleToFill"
      />
    </view>
    <PhotoPop :show.sync="photoShow" @event="handlePhoto" />
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
      :type="healthTypAadd"
      :show.sync="healthPopShow"
      :petInfo="petInfoObj"
      :enterType="enterType"
      @complete="healthPopComplete"
    ></HealthPop>
    <!-- 小弹窗 只有选项的 -->
    <CommonPicker
      :isShowPop.sync="isShowPop"
      :columns="columns"
      :secondName="secondName"
      @onchange="commonPickerOnchange"
    ></CommonPicker>
    <DatetimePicker
      :isShowPop.sync="isDatetimePickerr"
      :birthType="petInfo.birth"
      @onChange="dateTimeOnChange"
    ></DatetimePicker>
    <Cascader
      :isShowPop.sync="cascaderShow"
      :petType="petTypeNum"
      :petInfo="cascaderPetInfo"
      @change="cascaderChange"
      @close="cascaderClose"
    ></Cascader>
    <!--ai问诊编辑 特殊时期用的时间弹窗  特殊处理 只能选t-42 获取t+70 -->
    <SpecialLimitedTime
      :isShowPop.sync="specialLimitedTimeShow"
      :feedback="secondTypeTime"
      :birthType="computingTime"
      :notLimit="secondType"
      @onChange="secondTypeTimeOnChange"
    ></SpecialLimitedTime>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { formatTime } from "@/utils/index.js";
import { EDIT_PET_DETAIL, ADD_USER_PETS_DETAIL } from "@/api/index";
import { BASR_URL } from "@/utils/http";
import PhotoPop from "./components/photoPop.vue";
import MultiChoose from "./components/multichoose.vue";
import TagComponent from "../petInfo/components/tagComponent.vue";
import NavBar from "@/components/navBar/index.vue";
import BcsPopup from "../improve/components/bcsPopup.vue";
import HealthPop from "../components/healthPop.vue";
import CommonPicker from "../components/commonPicker.vue";
import DatetimePicker from "../components/dateTimePicker.vue";
import Cascader from "../components/cascader.vue";
import SpecialLimitedTime from "../components/specialLimitedTime.vue";
import { mapMutations, mapState } from "vuex";
import { action_report } from "@/utils/track";
import { aiConsultationPost } from "@/api/medical";
import dayjs from "dayjs";
import {
  GET_CATEGORY_BATCHITEMS,
  GET_HEALTH_METADATA,
  HOLD_PETHEALTHRECORD,
} from "@/api/petinfo";
export default {
  components: {
    PhotoPop,
    MultiChoose,
    NavBar,
    TagComponent,
    BcsPopup,
    HealthPop,
    CommonPicker,
    DatetimePicker,
    Cascader,
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
      },
      petLifeCycle: {
        weight: "",
        vaccineInfo: {
          status: 0, // 0 - 未接种 / 1 - 已接种
          typeId: "", //疫苗种类id
          typeName: "", //疫苗种类名称
        },
        anTheLMinTicInfo: {
          //驱虫信息
          status: 0, // 0 - 未接种 / 1 - 定时驱虫
          deWormingTime: "", //驱虫时间
          typeId: "", //驱虫类型id
          typeName: "", //驱虫类型名称 体内 体外 内外一体
          drugId: "", //驱虫药品名称id
          drugName: "", //驱虫药品名称
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
          //养育方式
          code: "", // domesticate - 家养 /freeRanging 散养/ cageCulture 笼养
          name: "",
        },
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
      genderColumns: [
        { label: "妹妹", id: 2 },
        { label: "弟弟", id: 1 },
      ],
      vaccineInfoColumns: [
        { label: "已接种", id: 1 },
        { label: "未接种", id: 0 },
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
      concatenatedNames: "",
      bcsPopupShow: false,
      healthType: 3, //// 1 疫苗 2 驱虫 3 体重4 特殊时期
      healthPopShow: false,
      petInfoObj: {},
      isShowPop: false,
      columns: [],
      secondName: "",
      secondType: "",
      anthelminticInfoItem: {},
      isDatetimePickerr: false,
      cascaderShow: false,
      enterType: "",
      userId: "",
      bcsItems: [], //bcs选项
      rearingStyleItems: [], //养育方式选项
      dewormingItems: [], //驱虫类型选项
      vaccineItems: [], //疫苗类型选项
      specialPeriodColumns: [],
      specialPeriodItems: [], //特殊时期
      cascaderPetInfo: {}, //
      apptype: "", //表示是原生跳到这个页面的或者新人链路跳过来  不是小程序内部跳转
      healthTypAadd: "add", //弹窗内是否显示同步动态按钮
      bcsShapeType: "", //bcs弹窗回显
      loadingShow: false, //头像上传加载中效果
      petDetailLonding: false,
      scrollTopNum: 0,
      secondTypeTime: "",
      specialLimitedTimeShow: false,
      computingTime: "", //特时期的时间要基于这个时间进行计算
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
  async onLoad(option) {
    // this.petId = option.petId || "10000";
    if (option.apptype) {
      this.apptype = option.apptype;
    }
    console.log("this.apptype", this.apptype);

    await this.getUsePetsDetail(option.petId, true);
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
    if (option.type === "AI_INQUIRY") {
      this.enterType = "AI_INQUIRY";
    } else if (option.type === "aiConsultationEdit") {
      this.enterType = "aiConsultationEdit";
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
  },
  onShow() {},
  computed: {
    ...mapState(["userSelectedPetId"]),
    hasValidate() {
      return this.petInfo?.avatarUrl &&
        this.petInfo?.nickName &&
        this.petInfo?.categoryId &&
        this.petInfo?.birth
        ? true
        : false;
    },
    //哺乳期
    showFeeding() {
      return this.petLifeCycle?.specialPeriod?.periodName === "哺乳期";
    },
    //孕期
    showPrenatal() {
      return this.petLifeCycle?.specialPeriod?.periodName === "孕期";
    },
    //病史传值
    petTypeNum() {
      return this.petType === "cat" ? 1 : 2;
    },
  },
  methods: {
    ...mapMutations([
      "setUserSelectedPetId",
      "setUserPetList",
      "setSelectPetItem",
      "setSymptomDesc",
      "clearSymptomData",
    ]),
    scrollTop(event) {
      let { scrollTop } = event.detail;
      console.log(scrollTop);
      this.scrollTopNum = scrollTop;
    },
    getUsePetsDetail(petId, type = false) {
      // type 用于判断是否需要更新基本信息
      try {
        //回显数据查询接口
        this.petId = petId;
        ADD_USER_PETS_DETAIL({ petId: petId }).then((res) => {
          // console.log(res);
          const {
            nickName,
            categoryId,
            categoryName,
            birth,
            sex,
            sexName,
            sterilizationStatus,
            sterilizationStatusDesc,
            avatarUrl,
            petStatus,
            parentCategoryId,
            petLifeCycle,
            userId,
          } = res.data;
          (this.petStatus = petStatus),
            (this.parentCategoryId = parentCategoryId);
          if (type) {
            let _data = this.petTypeOneColumns.filter(
              (item, index) => item.id == this.parentCategoryId
            );
            this.petType = _data[0]?.type ? _data[0]?.type : "other"; //处理异宠状态宠物类型选择
            this.petInfo = {
              nickName,
              categoryId,
              categoryName,
              birth,
              sex,
              sexName,
              sterilizationStatus,
              sterilizationStatusDesc,
              avatarUrl,
            };
          }

          //生命周期数据处理
          if (petLifeCycle) {
            if (!petLifeCycle?.medicalHistory) {
              petLifeCycle.medicalHistory = {};
              petLifeCycle.medicalHistory.medicalHistoryItems = [];
            }
            this.petLifeCycle = JSON.parse(JSON.stringify(petLifeCycle));
            // 兼容性处理 防止null报错
            if (!this.petLifeCycle?.vaccineInfo) {
              this.petLifeCycle.vaccineInfo = {
                status: 0, // 0 - 未接种 / 1 - 已接种
                typeId: "", //疫苗种类id
                typeName: "", //疫苗种类名称
              };
            }
            if (!this.petLifeCycle?.anTheLMinTicInfo) {
              this.petLifeCycle.anTheLMinTicInfo = {
                status: 0, // 0 - 未接种 / 1 - 定时驱虫
                deWormingTime: "", //驱虫时间
                typeId: "", //驱虫类型id
                typeName: "", //驱虫类型名称 体内 体外 内外一体
                drugId: "", //驱虫药品名称id
                drugName: "", //驱虫药品名称
              };
            }
            if (!this.petLifeCycle?.specialPeriod) {
              this.petLifeCycle.specialPeriod = {
                periodCode: "", //id
                periodName: "", //名称
                deliveryTime: "", // 分娩日期
                expectedDate: "", // 预产期
                mark: "",
              };
            } else {
              if (
                this.petLifeCycle?.specialPeriod?.periodCode ==
                "6746872abbf92b1b14ebd2dd"
              ) {
                // 分娩时间
                // 用于回显的时间
                this.petLifeCycle.specialPeriod.deliveryTime =this.petLifeCycle?.specialPeriod?.deliveryTime? dayjs(
                  this.petLifeCycle?.specialPeriod?.deliveryTime
                ).format("YYYY-MM-DD"):'';
                // 用于计算的时间
                let lactationRecordTime =
                  this.petLifeCycle?.specialPeriod?.lactationRecordTime;
                this.computingTime = lactationRecordTime
                  ? dayjs(lactationRecordTime).format("YYYY-MM-DD")
                  : "";
              } else if (
                this.petLifeCycle?.specialPeriod?.periodCode ==
                "6746872abbf92b1b14ebd2de"
              ) {
                // 预产期
                // 用于回显的时间
                this.petLifeCycle.specialPeriod.expectedDate = this.petLifeCycle?.specialPeriod?.expectedDate ? dayjs(
                  this.petLifeCycle?.specialPeriod?.expectedDate
                ).format("YYYY-MM-DD"): '';
                // computingTime用于计算的时间
                let expectedDateRecordTime =
                  this.petLifeCycle?.specialPeriod?.expectedDateRecordTime;
                this.computingTime = expectedDateRecordTime
                  ? dayjs(expectedDateRecordTime).format("YYYY-MM-DD")
                  : "";
              }
            }
            if (!this.petLifeCycle?.bcs) {
              this.petLifeCycle.bcs = {
                shapeType: "", // 直接取下拉接口值
                shapeTitle: "",
              };
            }
            if (!this.petLifeCycle?.rearingStyle) {
              this.petLifeCycle.rearingStyle = {
                code: "", // domesticate - 家养 /freeRanging 散养/ cageCulture 笼养
                name: "",
              };
            }
            //病史展示处理
            this.concatenatedNames =
              petLifeCycle?.medicalHistory?.medicalHistoryItems
                .map((item) => item.name)
                .join("/");
          }
          this.userId = userId;
          this.petId = petId;
          if (this.petType !== "other") {
            this.getItems();
          }
          this.petInfoObj.petIds = petId;
          this.petInfoObj.petType = this.petType.toUpperCase();
          this.petInfoObj.sex = this.petInfo.sex.toString();
          this.petInfoObj.sterilizationStatus =
            this.petInfo.sterilizationStatus;
          this.petDetailLonding = true;
          console.log("🚀 ~ GET_PET_DETAIL ~ this.petInfo:", this.petLifeCycle);
          uni.setStorageSync("petInfo", this.petInfo);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async healthPopComplete(data) {
      console.log("healthPopComplete", data);

      if (this.healthType === 3) {
        // 在宠物档案页填写体重
        action_report({
          action_name: "petfiles_add_weight",
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
        //体重
      } else if (this.healthType === 1) {
        // 在宠物档案页填写疫苗
        action_report({
          action_name: "petfiles_add_vacnote",
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
        //疫苗
      } else if (this.healthType === 2) {
        // 在宠物档案页填写驱虫
        action_report({
          action_name: "petfiles_add_killinsect",
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
        //驱虫
      } else if (this.healthType === 4) {
        // 在宠物档案页填写驱虫
        action_report({
          action_name: "petfiles_add_specialperiod",
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
        //特殊时期
        this.petLifeCycle.specialPeriod.periodCode = data.typeId;
        this.petLifeCycle.specialPeriod.periodName = data.typeName;
        let specialPeriod = JSON.parse(
          JSON.stringify(this.petLifeCycle.specialPeriod)
        );
        //删除后端不需要的字段
        delete specialPeriod.lactationRecordTime;
        delete specialPeriod.expectedDateRecordTime;
        if (data.specailMark === "TE_SHU_SHI_QI_FEEDING") {
          //哺乳期
          this.petLifeCycle.specialPeriod.deliveryTime = data.date
            ? data.date
            : "";
          specialPeriod.deliveryTime = data.date
            ? dayjs(data.date).format("YYYY-MM-DD HH:mm:ss")
            : "";
          specialPeriod.expectedDate = "";
        } else if (data.specailMark === "TE_SHU_SHI_QI_PRENATAL") {
          //孕期
          this.petLifeCycle.specialPeriod.expectedDate = data.date
            ? data.date
            : "";
          specialPeriod.expectedDate = data.date
            ? dayjs(data.date).format("YYYY-MM-DD HH:mm:ss")
            : "";
          specialPeriod.deliveryTime = "";
        } else {
          specialPeriod.deliveryTime = "";
          specialPeriod.expectedDate = "";
        }
        await this.holdItemsLifeCycle("TE_SHU_SHI_QI", {
          specialPeriod: specialPeriod,
        });
      }
      this.getUsePetsDetail(this.petId);
    },
    inputBlur() {
      uni.hideKeyboard();
    },
    //单个生命周期新增接口
    async holdItemsLifeCycle(type, item) {
      console.log("holdItemsLifeCycle", type, item);
      try {
        let query = [];
        let obj = {
          petId: this.petId, //宠物Id
          userId: this.userId, //用户Id
          mark: type, // 条目标识字段：TI_ZHONG-称体重、QU_CHONG-驱虫、YI_MIAO-疫苗、TE_SHU_SHI_QI-特殊时期、BING_SHI-病史、BCS-bcs、YAN_YU_FANG_SHI-养育方式
          ...item,
        };
        query.push(obj);
        const res = await HOLD_PETHEALTHRECORD({ list: query });
        console.log("holdItemsLifeCycle", res);
      } catch (error) {
        console.log("holdItemsLifeCycle", error);
      }
    },
    specialPeriodClick(type) {
      console.log("specialPeriodClick", this.petLifeCycle);

      this.secondType = type;
      if (this.enterType == "AI_INQUIRY" && type == "birth") {
        return;
      } else if (this.enterType == "AI_INQUIRY" && type == "expectedDate") {
        //预产期
        this.secondTypeTime = this.petLifeCycle?.specialPeriod?.expectedDate;
        this.specialLimitedTimeShow = true;
      } else if (this.enterType == "AI_INQUIRY" && type == "deliveryTime") {
        //分娩时间
        this.secondTypeTime = this.petLifeCycle?.specialPeriod?.deliveryTime;
        this.specialLimitedTimeShow = true;
      } else {
        this.isDatetimePickerr = true;
      }
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
    commonPickerClick(type, item) {
      this.secondType = type;
      this.anthelminticInfoItem = item;
      if (type === "rearingStyle") {
        //养育方式
        this.columns = this.rearingStyleItems;
        this.secondName = "养育方式";
      } else if (type === "vaccineInfo") {
        //疫苗
        this.columns = this.vaccineItems;
        this.secondName = "疫苗类型";
      }
      this.isShowPop = true;
    },
    //病史点击事件
    medicalHistoryClick() {
      this.cascaderPetInfo = {
        petType: this.petTypeNum,
        medicalHistoryItems:
          this.petLifeCycle.medicalHistory.medicalHistoryItems,
      };
      console.log("cascaderPetInfo", this.cascaderPetInfo);

      this.cascaderShow = true;
    },
    cascaderClose() {
      this.cascaderShow = false;
    },
    cascaderChange(list) {
      // 在宠物档案页填写病史
      action_report({
        action_name: "petfiles_add_illness",
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
      console.log("cascaderChange", list);
      this.petLifeCycle.medicalHistory.medicalHistoryItems = list.map(
        (item) => {
          item.code = item.id;
          return item;
        }
      );
      this.concatenatedNames = list.map((item) => item.name).join("/");
      console.log(this.concatenatedName, this.petLifeCycle);
      this.holdItemsLifeCycle("BING_SHI", {
        medicalHistory: this.petLifeCycle.medicalHistory,
      });
      this.cascaderShow = false;
    },
    //特殊时期弹窗内容回显
    dateTimeOnChange(date) {
      if (this.secondType === "birth") {
        this.petInfo = { ...this.petInfo, birth: formatTime(date) };
        this.isDatetimePickerr = false;
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
        //疫苗
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
        // 在宠物档案页填写样式方式
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
        this.holdItemsLifeCycle("YAN_YU_FANG_SHI", {
          rearingStyle: this.petLifeCycle.rearingStyle,
        });
      }
    },
    healthPopClick(type) {
      if (type === "weight") {
        this.healthTypAadd = "add";
        //体重
        this.petInfoObj = {
          ...this.petInfoObj,
          weight: this.petLifeCycle.weight,
        };
        this.petInfoObj.date = "";
        this.healthType = 3;
      } else if (type === "vaccineInfo") {
        // 疫苗
        this.healthTypAadd = "add";
        this.petInfoObj = {
          ...this.petInfoObj,
          date: "",
          typeId: this.petLifeCycle.vaccineInfo?.typeId, // 驱虫/疫苗类型 id
          typeName: this.petLifeCycle.vaccineInfo?.typeName, // 驱虫/疫苗类型 name
        };
        this.healthType = 1;
      } else if (type === "anTheLMinTicInfo") {
        this.healthTypAadd = "add";
        // 驱虫
        this.petInfoObj = {
          ...this.petInfoObj,
          date: this.petLifeCycle.anTheLMinTicInfo.deWormingTime
            ? dayjs(this.petLifeCycle.anTheLMinTicInfo.deWormingTime).format(
                "YYYY-MM-DD HH:mm"
              )
            : "",
          typeId: this.petLifeCycle.anTheLMinTicInfo?.typeId, // 驱虫/疫苗类型 id
          typeName: this.petLifeCycle.anTheLMinTicInfo?.typeName, // 驱虫/疫苗类型 name
          drugId: this.petLifeCycle.anTheLMinTicInfo?.drugId, // 驱虫品牌id
          drugName: this.petLifeCycle.anTheLMinTicInfo?.drugName, // 驱虫品牌name
        };
        console.log("healthPopClick", this.petInfoObj, this.healthPopShow);
        this.healthType = 2;
      } else if (type === "specialPeriod") {
        // 特殊时期
        this.healthTypAadd = " ";
        const foundPerson = this.specialPeriodItems.find(
          (person) => person.id === this.petLifeCycle.specialPeriod.periodCode
        );

        this.petInfoObj = {
          ...this.petInfoObj,
          // date: this.petLifeCycle.specialPeriod.deWormingTime,
          typeId: this.petLifeCycle.specialPeriod?.periodCode, // 驱虫/疫苗类型 id
          typeName: this.petLifeCycle.specialPeriod?.periodName, // 驱虫/疫苗类型 name
          //           "lactationRecordTime": "" 最近一次哺乳期填写日,
          // "expectedDateRecordTime": "" 最近一次预产期填写日
          lactationRecordTime: this.petLifeCycle?.specialPeriod
            ?.lactationRecordTime
            ? dayjs(
                this.petLifeCycle?.specialPeriod?.lactationRecordTime
              ).format("YYYY-MM-DD")
            : "",
          expectedDateRecordTime: this.petLifeCycle?.specialPeriod
            ?.expectedDateRecordTime
            ? dayjs(
                this.petLifeCycle?.specialPeriod?.expectedDateRecordTime
              ).format("YYYY-MM-DD")
            : "",
          specailMark: this.petLifeCycle.specialPeriod.periodCode
            ? foundPerson.mark
            : "",
        };
        if (foundPerson) {
          if (foundPerson.mark === "TE_SHU_SHI_QI_FEEDING") {
            //哺乳期
            this.petInfoObj.date = this.petLifeCycle.specialPeriod?.deliveryTime
              ? dayjs(this.petLifeCycle.specialPeriod?.deliveryTime).format(
                  "YYYY-MM-DD"
                )
              : "";
          } else if (foundPerson.mark === "TE_SHU_SHI_QI_PRENATAL") {
            //孕期
            this.petInfoObj.date = this.petLifeCycle.specialPeriod?.expectedDate
              ? dayjs(this.petLifeCycle.specialPeriod?.expectedDate).format(
                  "YYYY-MM-DD"
                )
              : "";
          }
        } else {
          this.petInfoObj.date = "";
        }
        console.log("healthPopClick", this.petInfoObj, this.healthPopShow);
        this.healthType = 4;
      }
      console.log("foundPerson", this.petLifeCycle);
      this.healthPopShow = true;
    },
    confirmsClick(item) {
      // 在宠物档案页填写bcs
      action_report({
        action_name: "petfiles_add_bcs",
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
      console.log(item, this.petLifeCycle.bcs);
      this.petLifeCycle.bcs.shapeType = item.shapeType;
      this.petLifeCycle.bcs.shapeTitle = item.shapeTitle;
      this.holdItemsLifeCycle("BCS", { bcs: this.petLifeCycle.bcs });
      this.bcsPopupShow = false;
    },
    birthClick() {
      this.secondType = "birth";
      this.isDatetimePickerr = true;
    },
    bcsShapeTypeClick() {
      console.log("bcsShapeTypeClick", this.bcsItems);
      this.bcsShapeType = this.petLifeCycle.bcs?.shapeType;
      this.bcsPopupShow = true;
    },
    close(val) {
      this.bcsPopupShow = val;
    },
    //所有弹窗筛选项查询接口
    async getItems() {
      try {
        const res = await GET_CATEGORY_BATCHITEMS({
          sex: this.petInfo.sex,
          petType: this.petType.toUpperCase(),
        });
        console.log("TE_SHU_SHI_QI", res.data);
        this.bcsItems = res.data.bcsItems;
        this.rearingStyleItems = res.data.rearingStyleItems;
        this.dewormingItems = res.data.dewormingItems;
        this.vaccineItems = res.data.vaccineItems;
        this.specialPeriodItems = res.data.specialPeriodItems;
        this.specialPeriodList();
        console.log("TE_SHU_SHI_QI", this.bcsItems);
      } catch (error) {
        console.log(error);
      }
    },
    //ai问诊进来的特殊时期进行处理
    specialPeriodList() {
      let specialPeriodColumns = this.specialPeriodItems.map((item) => {
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
        if(this.enterType=='AI_INQUIRY'){
          this.petLifeCycle.specialPeriod = {
          //特殊时期
          periodCode: "6746872abbf92b1b14ebd2dc", //id
          periodName: "非特殊时期", //名称
          deliveryTime: "", // 分娩日期
          expectedDate: "", // 预产期
          mark: "TE_SHU_SHI_QI_NORMAL",
        };
        }
  
      } else {
        this.specialPeriodColumns = specialPeriodColumns;
        console.log("specialPeriodColumns", this.specialPeriodColumns);
        const exists = this.specialPeriodColumns.some(
          (item) => item.id === this.petLifeCycle.specialPeriod.periodCode
        );
        if (!exists && this.enterType=='AI_INQUIRY') {
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
    },
    back() {
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
    updateVaccineInfo(item) {
      this.petLifeCycle.vaccineInfo.status = item.id;
      if (item.id === 0) {
        this.petLifeCycle.vaccineInfo.typeId = "";
        this.petLifeCycle.vaccineInfo.typeName = "";
      }
    },
    updateanthelminticInfo(item) {
      console.log(item);

      this.petLifeCycle.anTheLMinTicInfo.status = item.id;
    },
    updateSpecialPeriod(item) {
      this.petLifeCycle.specialPeriod.periodCode = item.id;
      this.petLifeCycle.specialPeriod.periodName = item.label;
      this.petLifeCycle.specialPeriod.mark = item.mark;
      this.petLifeCycle.specialPeriod.deliveryTime = "";
      this.petLifeCycle.specialPeriod.expectedDate = "";
      console.log(this.petLifeCycle.specialPeriod);
    },
    updateSex(item) {
      this.petInfo = {
        ...this.petInfo,
        sex: item.id,
        sexName: item.label,
      };
      this.petInfoObj.sex = this.petInfo.sex.toString();
    },
    updateParentId(item) {
      this.parentCategoryId = item.id;
      this.petInfo = {
        ...this.petInfo,
        categoryId: "",
        categoryName: "",
      };
    },
    updatesterilizationStatus(item) {
      this.petInfo = {
        ...this.petInfo,
        sterilizationStatus: item.id,
        sterilizationStatusDesc: item.label,
      };
      this.petInfoObj.sterilizationStatus = this.petInfo.sterilizationStatus;
    },
    changePetParent(item) {
      this.petType = item.type;
      this.parentCategoryId = item.id;
      this.petInfo = {
        ...this.petInfo,
        categoryId: "",
        categoryName: "",
      };
    },
    changeAvatal() {
      if (this.enterType == "AI_INQUIRY") {
        return;
      }
      // #ifdef MP-WEIXIN
      this.photoShow = true;
      // #endif
      // #ifdef H5
      //针对原生处理 头像上传选项弹窗避免弹出两次
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
          uni.uploadFile({
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
              that.loadingShow = false;
              // that.setHeadPortrait(uploadFileRes.data || "");
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
      if (this.enterType == "AI_INQUIRY") {
        return;
      }
      uni.hideKeyboard();
      uni.setStorageSync("petInfo", { ...this.petInfo });
      setTimeout(() => {
        uni.navigateTo({
          url: `/pagesA/selectTypeTwo/index?parentId=${this.parentCategoryId}`,
        });
      }, 100);
    },
    // ai问诊进来的 点击问诊的时候对生命周期进行统一保存
    async recordTheLifecycle() {
      //删除后端不需要的字段

      let petLifeCycle = JSON.parse(JSON.stringify(this.petLifeCycle));
      delete petLifeCycle.specialPeriod.lactationRecordTime;
      delete petLifeCycle.specialPeriod.expectedDateRecordTime;
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
      let query = [
        {
          petId: this.petId, //宠物Id
          userId: this.userId, //用户Id
          mark: "YI_MIAO", // 条目标识字段：TI_ZHONG-称体重、QU_CHONG-驱虫、YI_MIAO-疫苗、TE_SHU_SHI_QI-特殊时期、BING_SHI-病史、BCS-bcs、YAN_YU_FANG_SHI-养育方式
          vaccineInfo: petLifeCycle.vaccineInfo,
          recordTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          petId: this.petId, //宠物Id
          userId: this.userId, //用户Id
          mark: "TE_SHU_SHI_QI", // 条目标识字段：TI_ZHONG-称体重、QU_CHONG-驱虫、YI_MIAO-疫苗、TE_SHU_SHI_QI-特殊时期、BING_SHI-病史、BCS-bcs、YAN_YU_FANG_SHI-养育方式
          specialPeriod: petLifeCycle.specialPeriod,
        },
      ];
      let res = await HOLD_PETHEALTHRECORD({ list: query });
      console.log("点击问诊的时候对生命周期进行统一保存", res);
    },
    async submit(type) {
      if (!this.hasValidate) {
        if (!this.petInfo.avatarUrl) {
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

      if (this.isSubmit) {
        return;
      }
      this.isSubmit = true;
      if (type == "AI_INQUIRY") {
        if (
          this.petLifeCycle.vaccineInfo.status &&
          this.petLifeCycle.vaccineInfo.typeName == ""
        ) {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "疫苗接种不能为空",
          });
          this.isSubmit = false;
          return;
        }
        if (this.petLifeCycle.specialPeriod.periodName == "") {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "特殊时期不能为空",
          });
          this.isSubmit = false;
          return;
        }
        //智能问诊走的去问诊逻辑
        try {
          await this.recordTheLifecycle();
          let params = JSON.parse(uni.getStorageSync("aiparams"));
          console.log("params", params);
          const res = await aiConsultationPost({
            ...params,
            preFilledInfo: {
              ...params.preFilledInfo,
              vaccinationStatus: this.petLifeCycle.vaccineInfo.status, //疫苗接种情况 接种情况 // 0 - 未接种 / 1 - 已接种
              vaccinationOption: this.petLifeCycle.vaccineInfo.typeName, //接种选项(疫苗种类名称)
              specialPeriod: this.petLifeCycle.specialPeriod.periodName, //特殊时期
            },
          });
          this.isSubmit = false;
          //清空缓存
          uni.removeStorageSync("symptArry");
          uni.removeStorageSync("aiparams");
          this.setSelectPetItem({});
          this.clearSymptomData();
          this.setSymptomDesc("");
          //缓存协议
          let agreementData = uni.getStorageSync("newAgreement")
            ? uni.getStorageSync("newAgreement")
            : [];
          agreementData.push(this.petId);
          let newAgreement = [...new Set(agreementData)];
          uni.setStorageSync("newAgreement", newAgreement);
          // #ifdef MP-WEIXIN

          uni.redirectTo({
            url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              res.data
            )}&fromOrigin=new&inquiryType=AI_INQUIRY&petId=${this.petId}`,
          });
          // #endif
          // #ifdef H5
          let messageInfoCode = encodeURIComponent(JSON.stringify(res.data));
          // this.$dsBridge.call("gotoPageThroughRoute", {
          //   page: `${window.location.origin}/crm-medical-h5/#/pagesA/chatPage/index?messageInfo=${messageInfoCode}&fromOrigin=new&inquiryType=AI_INQUIRY&petId=${this.selectedPet.id}&transparentTopBar=1`,
          // });
          // this.$dsBridge.call("closeCurrentWebview", {});
          uni.redirectTo({
            url: `/pagesA/chatPage/index?messageInfo=${messageInfoCode}&fromOrigin=new&inquiryType=AI_INQUIRY&petId=${this.petId}`,
          });
          // #endif
        } catch (error) {
          console.log(error);
        }
      } else {
        // 其他逻辑保持不变
        try {
          //编辑逻辑  不对生命周期进行保存 生命周期编辑页面是单个保存
          EDIT_PET_DETAIL({
            ...this.petInfo,
            petId: this.petId,
            petStatus: this.petStatus,
            sterilizationStatus:
              this.petType == "other" ? 0 : this.petInfo.sterilizationStatus,
            sterilizationStatusDesc:
              this.petType == "other"
                ? "未知"
                : this.petInfo.sterilizationStatusDesc,
          })
            .then((res) => {
              this.$refs.uToast.show({
                type: "",
                icon: false,
                message: "修改成功",
              });
              // #ifdef H5
              this.$dsBridge.call("createAndEditPetSuccess", {
                type: "edit", //add或edit
                petId: res.data.petId,
              }); //调用成功的方法
              if (this.apptype) {
                // apptype是app传的 小程序传的是type 如果apptype存在就是原生页面跳过来的 销毁页面 否则就是小程序内部跳的  回到上一页
                this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
              } else {
                uni.navigateBack({
                  delta: 1, // 返回的页面数
                });
              }

              // #endif
              // #ifdef MP-WEIXIN
              setTimeout(() => {
                this.isSubmit = false;

                if (
                  "petRecord" == this.enterType ||
                  "petRecordAdd" == this.enterType
                ) {
                  uni.redirectTo({
                    url: `/pagesE/petRecords/index?petId=${this.petId}`,
                  });
                } else if (this.enterType == "myPetAdd") {
                  uni.redirectTo({
                    url: `/pagesD/myPetsInfo/index?petId=${this.petId}`,
                  });
                } else if (this.enterType == "aiConsultationEdit") {
                  uni.navigateBack({
                    delta: 1, // 返回的页面数
                  });
                } else {
                  uni.switchTab({ url: "/pages/index/index" });
                }
              }, 2000);
              // #endif
            })
            .catch(() => {
              this.isSubmit = false;
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
