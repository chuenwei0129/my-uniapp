<template>
  <view class="desc">
    <!-- 标题 -->
    <view
      class="nav-bar"
      :class="{ 'nav-bar-scrollbg': isScroll }"
      :style="{
        paddingTop: statusBarHeight,
      }"
    >
      <view class="nav-wrapper">
        <view class="nav-back" @click="handleNavBack"></view>
        <view class="title-wrapper">
          <view class="title">报告解读</view>
        </view>
      </view>
    </view>
    <!--背景-->
    <view class="top">
      <!-- 文案描述 -->
      <view class="copywriting-box">
        <view class="writing-top">执业兽医师为爱宠一对一解读报告</view>
        <view class="writing-bottom">马上录入你家宠物的病情信息吧~</view>
      </view>
    </view>
    <!-- 宠物切换 -->
    <view
      class="pet-box"
      :class="{ 'pet-box-sticky': hasPetBoxStickyClass }"
      :style="{ top: petBoxTop }"
    >
      <scroll-view
        scroll-x="true"
        class="pet-scroll"
        :scroll-into-view="petScrollToViewData"
      >
        <view
          :class="{
            petItemFirst: index === 0,
          }"
          class="pet-item"
          v-for="(item, index) in petList"
          :key="index"
          :id="`pet_item_${item.id}`"
        >
          <view
            :class="selectedPet.id == item.id ? 'active-img-name' : 'img-name'"
            @click="selectItem(item)"
          >
            <view class="pet-item-inner">
              <image
                :src="item.avatarUrl"
                mode="aspectFill"
                class="pet-item-img"
              />
              <view class="pet-item-label">
                {{ item.nickName.substring(0, 4) }}
              </view>
            </view>
          </view>
          <view class="icon-box">
            <view>
              <view
                :class="[selectedPet.id == item.id ? 'allRight' : '']"
              ></view>
            </view>
          </view>
        </view>
        <view style="margin-right: 30rpx" class="pet-item">
          <view class="img-name" @click="addPetsMethod">
            <view class="pet-item-inner">
              <image src="" mode="aspectFill" class="pet-item-img no-img" />
              <view class="pet-item-label-add">+添加宠物</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="content">
      <view class="qu">
        <!-- 无档案记录 -->
        <view v-if="filesShow && !isAlienPet">
          <view class="quone">
            <view class="quTitle"
              >请选择疫苗接种情况<text class="required">*</text></view
            >
            <view class="yuList">
              <view
                class="checkItem"
                @click="
                  () => {
                    handleChecked('yuList', yitem);
                  }
                "
                v-for="yitem in yuList"
                :key="yitem.key"
                :class="{
                  checked: yitem.checked,
                }"
              >
                {{ yitem.name }}
              </view>
            </view>
            <!-- <view
              @click="
                () => {
                  openFiles(1);
                }
              "
              class="select-box"
              v-if="getListName(yuList) === '已接种'"
            >
              <view class="name">疫苗类型</view>
              <view class="select-item">
                <view class="name-left" v-if="filesVaccine.vaccineType"
                  >{{ filesVaccine.vaccineType }}
                </view>
                <view class="left" v-else>请选择</view>
                <view class="right">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"
                    mode="aspectFill"
                  />
                </view>
              </view>
            </view> -->
          </view>
          <view class="qutwo">
            <view class="quTitle"
              >请选择是否驱虫<text class="required">*</text></view
            >
            <view class="quList">
              <view
                class="checkItem"
                @click="
                  () => {
                    handleChecked('quList', qitem);
                  }
                "
                v-for="qitem in quList"
                :key="qitem.key"
                :class="{
                  checked: qitem.checked,
                }"
              >
                {{ qitem.name }}
              </view>
            </view>
            <!-- <view v-if="getListName(quList) === '定时驱虫'">
              <view
                @click="
                  () => {
                    openDatePicker();
                  }
                "
                class="select-box"
              >
                <view class="name">最近驱虫时间</view>
                <view class="select-item">
                  <view v-if="petDate == null" class="left">请选择</view>
                  <view v-else class="name-left">{{ petDate }} </view>
                  <view class="right">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
              <view
                @click="
                  () => {
                    openCommonPicker(2);
                  }
                "
                class="select-box"
              >
                <view class="name">驱虫类型</view>
                <view class="select-item">
                  <view v-if="filesInsect.expelInsectsType" class="name-left">{{
                    filesInsect.expelInsectsType
                  }}</view>
                  <view v-else class="left">请选择</view>
                  <view class="right">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
              <view
                @click="
                  () => {
                    openCommonPicker(3);
                  }
                "
                class="select-box"
              >
                <view class="name">驱虫品牌</view>
                <view class="select-item">
                  <view
                    v-if="filesInsect.expelInsectsBrand"
                    class="name-left"
                    >{{ filesInsect.expelInsectsBrand }}</view
                  >
                  <view v-else class="left">请选择</view>
                  <view class="right">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
            </view> -->
          </view>
          <view class="qutwo">
            <view class="quTitle">当前体重<text class="required">*</text></view>
            <view class="input-wrapper">
              <view class="diseaseDesc-wight">
                <u--input
                  placeholder="请输入体重"
                  border="surround"
                  shape="circle"
                  v-model="weightData"
                  type="digit"
                  clearable
                  :customStyle="{ width: '604rpx' }"
                  @input="handleWeightChange"
                ></u--input>
                <view class="unit">kg</view>
              </view>


            </view>
          </view>
        </view>
        <!-- 有档案记录 -->
        <view v-if="!filesShow && !isAlienPet">
          <view
            @click="
              () => {
                openFiles(3);
              }
            "
            class="weight-box"
          >
            <view class="name">当前体重</view>
            <view v-if="filesWeight.weight" class="weight-time">
              <view class="left">
                <view>{{ filesWeight.weight }}</view>
                <view class="unit">kg</view>
              </view>
              <view class="right">
                <view class="time-date"
                  >最新时间：{{ filesWeight.time.substring(0, 10) }}</view
                >
                <view class="time-icon">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                    mode="aspectFill"
                  />
                </view>
              </view>
            </view>
            <view v-else class="no-weight-time">
              <view class="right">
                <view>请完善体重信息</view>
                <view class="time-icon">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                    mode="aspectFill"
                  />
                </view>
              </view>
            </view>
          </view>
          <view
            @click="
              () => {
                openFiles(1);
              }
            "
            class="vaccine-box"
          >
            <view class="name">疫苗接种</view>
            <view v-if="filesVaccine.vaccineTime" class="vaccine-time">
              <view class="left">
                <view>{{ filesVaccine.vaccineType }}</view>
              </view>
              <view class="right">
                <view
                  >最新时间：{{
                    filesVaccine.vaccineTime.substring(0, 10)
                  }}</view
                >
                <view class="time-icon">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                    mode="aspectFill"
                  />
                </view>
              </view>
            </view>
            <view v-else class="no-vaccine-time">
              <view class="right">
                <view>请完善疫苗信息</view>
                <view class="time-icon">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                    mode="aspectFill"
                  />
                </view>
              </view>
            </view>
          </view>
          <view
            @click="
              () => {
                openFiles(2);
              }
            "
            class="insect-box"
          >
            <view class="name">驱虫情况</view>
            <view v-if="filesInsect.expelInsectsTime" class="insect-time">
              <view class="left">
                <view>{{ filesInsect.expelInsectsType }}</view>
                <view
                  class="line"
                  v-if="
                    filesInsect.expelInsectsType &&
                    filesInsect.expelInsectsBrand
                  "
                  >|</view
                >
                <view>{{ filesInsect.expelInsectsBrand }}</view>
              </view>
              <view class="right">
                <view
                  >最新时间：{{
                    filesInsect.expelInsectsTime.substring(0, 10)
                  }}</view
                >
                <view class="time-icon">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                    mode="aspectFill"
                  />
                </view>
              </view>
            </view>
            <view v-else class="no-insect-time">
              <view class="right">
                <view>请完善驱虫信息</view>
                <view class="time-icon">
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                    mode="aspectFill"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- <view class="qutwo">
          <view class="quTitle">当前体重1<text class="required">*</text></view>
          <view class="input-wrapper">
            <view class="diseaseDesc-wight">
              <u--input
                placeholder="请输入体重"
                border="surround"
                shape="circle"
                v-model="weightData"
                type="digit"
                clearable
                :customStyle="{ width: '604rpx' }"
                @input="handleWeightChange"
                :formatter="formatter"
              ></u--input>
              <view class="unit">kg</view>
            </view>

            // <view
            //   @click="handleGetWeight(sheetData.petInformation.weight)"
            //   v-if="
            //     sheetData.petInformation.weight &&
            //     sheetData.petInformation.weight != 0
            //   "
            //   class="last-btn-wight"
            //   >使用上次体重：{{ sheetData.petInformation.weight }}kg</view
            // >
          </view>
        </view> -->
        <view class="disease-img" v-if="!historyPrescription.id">
          <view class="quTitle">上传报告<text class="required">*</text></view>
          <view
            style="
              font-size: 23rpx;
              color: #1f1f1f;
              font-weight: 400;
              margin-top: -19rpx;
              margin-bottom: 19rpx;
            "
            >请上传检查报告或其他病情资料，以便医生给您更精准的判读（请上传高清图片）</view
          >
          <u-upload
            :fileList="diseaseImgs"
            @afterRead="afterRead"
            @delete="deletePic"
            :deletable="upLoadDeletable"
            name="1"
            :maxCount="9"
            :width="'154rpx'"
            :height="'154rpx'"
          >
            <view class="upload-emp" v-if="diseaseImgs.length">
              <view>
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/inquiry/mp_icon_upload.png"
                  mode="widthFix"
                  style="width: 64rpx; height: 64rpx"
                ></image>
              </view>
              <view>{{ diseaseImgs.length }}/9</view>
            </view>
            <view class="upload_emp" v-else>
              <view class="icon"></view>
              <view>点击上传</view>
            </view>
          </u-upload>
        </view>
        <view class="detail">
          <view class="quTitle detailTitle"
            >请描述爱宠病情<text class="required">*</text></view
          >
          <view class="desca">
            <u--textarea
              height="135"
              v-model="illnessDesc"
              placeholder="请描述爱宠病情"
              maxlength="500"
              count
              :formatter="testFormatter"
              :showConfirmBar="false"
            ></u--textarea>
          </view>
        </view>
        <view class="quone">
          <view class="quTitle"
            >您的解读需求<text class="required">*</text></view
          >
          <view class="yuList readerList">
            <view
              class="checkItem"
              @click="
                () => {
                  handleChecked('readerList', yitem);
                }
              "
              v-for="yitem in readerList"
              :key="yitem.key"
              :class="{
                checked: yitem.checked,
              }"
            >
              {{ yitem.name }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="message">
      <view class="agreement">
        <u-checkbox-group
          placement="column"
          size="14px"
          activeColor="#000000"
          @change="checkboxChange"
          v-model="checkboxValue"
        >
          <u-checkbox> </u-checkbox>
        </u-checkbox-group>
        <view class="agreement-text">
          已阅读并同意
          <text @click="goAgreement"
            >《上海宠氧互联网宠物医院宠物健康咨询服务知情同意书》</text
          >
        </view></view
      >
      <view
        class="messageText"
        :class="!!allowSubmit ? 'allowMessage' : ''"
        @click="handleMessage"
      >
        开始咨询
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </view>
    <u-popup
      :show="doctorShow"
      :overlayStyle="{ background: 'rgba(3, 100, 219, 0)' }"
      mode="center"
      bgColor="transparent"
      @touchmove.stop.prevent
    >
      <view class="doctor-box">
        <view class="load-icon">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/payLoading.png"
            mode="widthFix"
          ></image>
        </view>
        <view class="load-name"> 连接医生({{ secondNum }}s) </view>
      </view>
    </u-popup>
    <ChangePetPop
      :petList="petList"
      :selectPetId="petId"
      :isOpen.sync="isPetShow"
      @confirm="handleSelectPet"
      @close="handlePetPopClose"
    />
    <CommonPicker
      v-if="isShowPop"
      :isShowPop.sync="isShowPop"
      :columns="columns"
      :secondName="secondName"
      @onchange="handlePickerChange"
    />
    <DatePicker :isShowPop.sync="isShowDate" @onChange="handleDateChange" />
    <HealthPop
      :healthType="healthType"
      type="add"
      :show.sync="healthPopShow"
      :petInfo="petInfoObj"
      @complete="healthPopComplete"
    ></HealthPop>
    <ConfirmPop ref="symptomPopup"></ConfirmPop>
  </view>
</template>

<script>
import DatePicker from "../diseaseDesc/components/datePicker";
import CommonPicker from "../diseaseDesc/components/commonPicker";
import HealthPop from "../diseaseDesc/components/healthPop";
import ConfirmPop from "../diseaseDesc/components/confirmPop/index";
import dayjs from "dayjs";
//import { wxShareMethod } from "@/utils/wxShare";
import ChangePetPop from "@/components/changePetPop";
import { mapState, mapMutations } from "vuex";
import {
  getPetList,
  submitMessage,
  getTag,
  submitMessageQuick,
  healthFiles,
  GET_HEALTH_METADATA,
} from "@/api/base";
import { BASR_URL } from "@/utils/http";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import { action_report } from "@/utils/track";
import {
  addEventListener as RYaddEventListener,
  Events as RYEvents,
  init as RYinit,
  destroy as RYdestroy,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { RyConnect } from "@/pagesA/components/rongyunCloud/ryConnect";
import chatMixins from "@/pagesA/mixins/chatMixins";
import { pxToRpx } from "@/utils/index";
import { inquiryOrderDetail } from "@/api/inquiryOrder";

export default {
  onLoad(option) {
    console.log("====option====", option);
    this.petId = option.petId;
    this.doctorUserId = option.doctorUserId;
    this.groupId = option.groupId;
    this.inquiryType = "REPORT_INTERPRETATION"; //  QUICK
    this.resourceId = option.resourceId;
    this.resourceType = option.resourceType;
    this._getDiseaseTag();

    /**
     * 从问诊单 待接诊进入 增加入参
     * from=consultOrder
     * consultationId=xxxxxx
     * userGroupId=xxxxxxx
     * deadlineTime=2024-11-26 15:00:00
     * */
    this.from = option.from; // 来源 consultOrder-问诊单 inquiryOrderSubmit-确认订单支付成功
    this.consultationId = option.consultationId;
    this.userGroupId = option.userGroupId;
    this.deadlineTime = option.deadlineTime;
  },
  onReady() {},
  onUnload() {
    this.clearInstance();
  },
  async onShow() {
    getPetList({ userId: this.$dsBridge && this.$dsBridge.call("getUserId", "getUserId") || this.userInfo.userId }).then((res) => {
      if (
        res.data &&
        res.data.length &&
        res.data.length !== this.petList.length
      ) {
        this.petList = res.data;
        const selectPet = res.data.find((i) => i.id == this.petId);
        const resultPetData =
          this.petId && this.consultationId ? selectPet : res.data[0];
        console.log("设置宠物", resultPetData, selectPet);
        this.selectedPet = resultPetData;
        this.selectItem(this.selectedPet);
        // 滚动到选择的宠物
        this.$nextTick(() => {
          this.petScrollToViewData = `pet_item_${this.selectedPet.id}`;
        });

        if (this.selectPetItem.id) {
          return;
        }

        this.selectPetItem = selectPet;
      }
    });

    this.inquiryOrderDetailHandler();
    await this.RYconnectMethod();
  },
  mixins: [chatMixins],
  data() {
    return {
      petScrollToViewData: "",
      from: "",
      consultationId: "",
      userGroupId: "",
      deadlineTime: "",
      // 等待倒计时文案
      waitingTimeFormatter: "",
      yuList: [
        {
          name: "已接种",
          key: 1,
          checked: false,
        },
        {
          name: "未接种",
          key: 2,
          checked: false,
        },
        // {
        //   name: "接种不全",
        //   key: 3,
        //   checked: false,
        // },
        // {
        //   name: "接种不详",
        //   key: 4,
        //   checked: false,
        // },
      ],
      quList: [
        {
          name: "定时驱虫",
          key: 1,
          checked: false,
        },
        // {
        //   name: "未定时驱虫",
        //   key: 2,
        //   checked: false,
        // },
        {
          name: "未做驱虫",
          key: 3,
          checked: false,
        },
      ],
      readerList: [
        {
          name: "治疗效果未达到预期",
          key: "治疗效果未达到预期",
          checked: false,
        },
        {
          name: "检查结果再判断",
          key: "检查结果再判断",
          checked: false,
        },
        {
          name: "对异常指标不理解",
          key: "对异常指标不理解",
          checked: false,
        },
        {
          name: "其它",
          key: "其它",
          checked: false,
        },
      ],
      inquiryType: "REPORT_INTERPRETATION", //QUICK 快速 EXPERT 专家
      diseaseImgs: [],
      illnessDesc: "",
      testFormatter: (val) => (val.length > 500 ? val.slice(0, 500) : val),
      isPetShow: false,
      petId: "",
      selectPetItem: {},
      petList: [],
      diseaseList: [],
      doctorUserId: "",
      groupId: "",
      upLoadDeletable: true,
      resourceId: "",
      resourceType: "",
      sheetData: "",
      weightData: null,
      checkboxValue: uni.getStorageSync("agreement") ? [""] : [],
      statusBarHeight: 0,
      selectedPet: {}, //选中宠物
      filesShow: true, //宠物档案是否有内容
      petInfoObj: {
        petIds: "1810904736532234242", // 宠物id
        petType: "DOG", // // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
        sex: "1", // 性别: 1-GG, -2MM
        date: "2024-11-01 00:00", // 时间
        drugId: "673c07e54f69c42afb221d71", // 驱虫品牌id
        drugName: "欣宠克", // 驱虫品牌name
        typeId: "6735b0aabbf92b477c533585", // 驱虫/疫苗类型 id
        typeName: "哺乳期", // 驱虫/疫苗类型 name
        weight: "23", // 体重
        specailMark: "", // 特殊时期mark
      },
      doctorShow: false, //连接医生load
      // 宠物时间
      petDate: null,
      // 宠物时间弹窗
      isShowDate: false,
      // 公共疫苗-驱虫类型-驱虫品牌-弹窗
      isShowPop: false,
      // 公共弹层数据
      columns: [],
      // 公共弹窗标题
      secondName: "",
      //宠物档案体重信息
      filesWeight: {
        time: "",
        weight: "",
      },
      //宠物档案疫苗信息
      filesVaccine: {
        vaccine: "", //接种疫苗情况 1：已接种疫苗；2：未接种疫苗
        vaccineType: "", //疫苗类型
        vaccineTypeId: "", //疫苗类型Id
        vaccineTime: "", //接种疫苗时间  "yyyy-MM-dd HH:mm:ss"
      },
      //宠物档案驱虫信息
      filesInsect: {
        expelInsects: "", // 是否驱虫 1：定时驱虫；2：未做驱虫
        expelInsectsType: "", //驱虫类型
        expelInsectsTypId: "", // 驱虫类型Id
        expelInsectsBrand: "", //驱虫品牌
        expelInsectsBrandId: "", //驱虫品牌Id
        expelInsectsTime: "", //驱虫时间 "yyyy-MM-dd HH:mm:ss"
      },
      waitingTimer: null,
      timeOutId: null,
      secondNum: 0,
      petBoxTop: 0, // 选择宠物区域的定位高度
      hasPetBoxStickyClass: false, // 是否开启选择宠物区域样式
      // 大弹窗
      healthPopShow: false,
      insectList: [], //驱虫数据列表
      healthType: null,
      isSubmitting: false, // 防止多次提交
      isAlienPet: false, // 是否异宠
      isScroll: false, // 是否滚动
    };
  },
  computed: {
    ...mapState(["userInfo", "historyPrescription"]),
    allowSubmit() {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d{1,2})?$/;
      const yuAllow = this.yuList.find((y) => y.checked);
      const quAllow = this.quList.find((q) => q.checked);
      const readerAllow = this.readerList.find((i) => i.checked);
      const weightAllow = reg.test(this.weightData) && this.weightData <= 1000;

      // 关于异宠修改校验
      if (!this.isAlienPet) {
        return !!(
          yuAllow &&
          quAllow &&
          readerAllow &&
          this.illnessDesc &&
          this.weightData &&
          weightAllow &&
          this.diseaseImgs.length &&
          this.checkboxValue.length
        );
      } else {
        return !!(
          readerAllow &&
          this.illnessDesc &&
          this.diseaseImgs.length &&
          this.checkboxValue.length
        );
      }
    },
  },
  // mounted() {
  //   getPetList({ userId: this.userInfo.userId }).then((res) => {
  //     const selectPet = res.data.find((i) => i.id == this.petId);

  //     this.selectPetItem = selectPet;
  //     this.petList = res.data;
  //     this.petId = selectPet.id;
  //   });
  // },
  onPageScroll(e) {
    // e.scrollTop 获取页面的滚动高度
    const targetH = 100;
    this.hasPetBoxStickyClass = e.scrollTop > targetH;
    if (e.scrollTop > 30) {
      this.isScroll = true;
    } else {
      this.isScroll = false;
    }
  },
  mounted() {
    //#ifdef MP-WEIXIN
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    // 90 - nav-bar设置的高度
    this.petBoxTop = pxToRpx(getApp().globalData.statusBarHeight) + 90 + "rpx";
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    // 90 - nav-bar设置的高度
    this.petBoxTop =
      pxToRpx(getApp().globalData.h5StatusBarHeight) + 90 + "rpx";
    //#endif
  },
  methods: {
    async inquiryOrderDetailHandler() {
      console.log(
        "********** 获取问诊单详情 ******* ====>",
        this.consultationId
      );
      if (!this.consultationId) {
        return;
      }
      // 针对携带问诊单id的需要查询问诊单详情
      const res = await inquiryOrderDetail({
        id: this.consultationId,
      });
      if (res.data) {
        // 症状类型
        const { symptomType, petInformation } = res.data;
        //      报告    描述爱宠病情    您的解读需求
        const {
          reports,
          illnessDesc,
          interpretationPurpose,
          weight,
          vaccineDetail,
          expelInsectsDetail,
        } = petInformation;
        console.log("res.data", symptomType, illnessDesc, petInformation);
        // 描述爱宠病情赋值
        this.illnessDesc = illnessDesc;
        // 上传症状图片赋值
        this.diseaseImgs = (reports || []).map((url) => {
          return {
            url,
            status: "success",
            message: "",
          };
        });
        // 您的解读需求
        this.readerList.forEach((item) => {
          item.checked = item.key === interpretationPurpose;
        });
        // 已经阅读协议
        this.checkboxValue = [""];
        // 当前体重
        this.weightData = weight;
        // 请选择疫苗接种情况
        if (vaccineDetail.vaccine == 1) {
          this.yuList[0].checked = true;
        } else if (vaccineDetail.vaccine == 0) {
          this.yuList[1].checked = true;
        }
        // 请选择驱虫情况
        if (expelInsectsDetail.expelInsects == 0) {
          this.quList[1].checked = true;
        } else if (expelInsectsDetail.expelInsects == 1) {
          this.quList[0].checked = true;
        }
      }
    },
    getListName(arr) {
      const findData = arr.find((item) => item.checked);
      return findData ? findData.name : "";
    },
    handleChecked(type, item, key = "key", isMulti = false) {
      this[type] = this[type].map((y) => {
        if (y[key] === item[key]) {
          return {
            ...y,
            checked: !y.checked,
          };
        } else if (!isMulti) {
          return {
            ...y,
            checked: false,
          };
        }
        return y;
      });
      action_report({
        action_name: "reportanalysis_submit_purpose_clk",
        module_name: "medical",
      });
    },
    // 获取病症分类
    async _getDiseaseTag() {
      try {
        const { data } = await getTag({
          bizType: "CONSULTATION_SYMPTOM",
        });
        if (data.ALL) {
          this.diseaseList = data.ALL;
        }
      } catch (e) {
        console.error("获取病症分类", e);
      }
    },
    handleChangePet() {
      this.isPetShow = true;
    },
    handlePetPopClose() {
      this.isPetShow = false;
    },
    //上一条问诊单详情
    async lastDetail() {
      const res = await GET_IN_SERVICE_LAST({ petId: this.petId });
      this.sheetData = res.data;
      if (res.data && res.data.petInformation) {
        this.weightData = res.data.petInformation?.weight
      } else {
        this.weightData = ''
      }
    },
    handleSelectPet(item) {
      this.selectPetItem = item;
      this.petId = item.id;
      this.lastDetail();
    },
    handleMessage() {
      if (!this.filesShow && !this.isAlienPet && this.filesWeight.weight <= 0) {
        uni.showToast({
          title: "请输入体重",
          icon: "none",
        });
        return;
      } else if (
        !this.filesShow &&
        !this.isAlienPet &&
        !this.filesVaccine.vaccineType
      ) {
        uni.showToast({
          title: "请选择疫苗接种",
          icon: "none",
        });
        return;
      } else if (
        !this.filesShow &&
        !this.isAlienPet &&
        !this.filesInsect.expelInsectsType
      ) {
        uni.showToast({
          title: "请选择驱虫情况",
          icon: "none",
        });
        return;
      }

      var that = this;
      if (
        (this.weightData < 0 || this.weightData == 0) &&
        !this.isAlienPet &&
        this.filesShow
      ) {
        uni.showToast({
          title: "输入的体重必须大于0",
          icon: "none",
        });
        return;
      }
      if (this.isSubmitting) {
        console.log("请求中");
        return;
      }
      if (this.allowSubmit) {
        const yuAllow = this.yuList.find((y) => y.checked);
        const quAllow = this.quList.find((q) => q.checked);
        const readerAllow = this.readerList.find((i) => i.checked);

        let petType = "OTHER";
        if (this.selectPetItem.petCategoryId === 1) {
          petType = "CAT";
        }
        if (this.selectPetItem.petCategoryId === 50) {
          petType = "DOG";
        }
        const now = dayjs();
        const formatted = now.format("YYYY-MM-DD HH:mm:ss");
        const params = {
          // couponNo: this.couponNo,
          resourceId: this.resourceId,
          resourceType: this.resourceType,
          doctorUserId: this.doctorUserId,
          groupId: this.groupId,
          inquiryType: "REPORT_INTERPRETATION",
          preFilledInfo: {
            gender: this.selectPetItem.sex,
            petId: this.selectPetItem.id,
            ...this.selectPetItem,
            age: this.selectPetItem.guardTime,
            petType,
            // vaccine: this.isAlienPet ? "" : yuAllow.key,
            // expelInsects: this.isAlienPet ? "" : quAllow.key,
            interpretationPurpose: readerAllow.key,
            illnessDesc: this.illnessDesc,
            weight: this.weightData,
            recordWeightTime: this.filesWeight.time
              ? dayjs(this.filesWeight.time).format("YYYY-MM-DD HH:mm:ss")
              : formatted,
            //驱虫详情
            expelInsectsDetail: this.filesInsect,
            //疫苗详情对象
            vaccineDetail: this.filesVaccine,
          },
          source: "WECHAT_XCX",
          lon: uni.getStorageSync("lon") || "", //经度
          lat: uni.getStorageSync("lat") || "", //维度
        };
        if (
          params &&
          params.preFilledInfo &&
          params.preFilledInfo.expelInsectsDetail &&
          params.preFilledInfo.expelInsectsDetail.expelInsectsTime
        ) {
          params.preFilledInfo.expelInsectsDetail.expelInsectsTime = dayjs(
            params.preFilledInfo.expelInsectsDetail.expelInsectsTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (
          params &&
          params.preFilledInfo &&
          params.preFilledInfo.vaccineDetail &&
          params.preFilledInfo.vaccineDetail.vaccineTime
        ) {
          params.preFilledInfo.vaccineDetail.vaccineTime = dayjs(
            params.preFilledInfo.vaccineDetail.vaccineTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (!params.preFilledInfo.expelInsectsDetail.expelInsectsType) {
          params.preFilledInfo.expelInsects = this.isAlienPet
            ? ""
            : quAllow.key;
        } else {
          params.preFilledInfo.expelInsectsDetail.expelInsects = this.isAlienPet
            ? ""
            : quAllow.key;
        }
        if (!params.preFilledInfo.vaccineDetail.vaccineType) {
          params.preFilledInfo.vaccine = this.isAlienPet ? "" : yuAllow.key;
        } else {
          params.preFilledInfo.vaccineDetail.vaccine = this.isAlienPet
            ? ""
            : yuAllow.key;
        }

        //#ifdef H5
        params.source = this.$dsBridge.call("getAppInfo", "os");

        try {
          const local = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
            ? JSON.parse(
                this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
                {}
              )
            : {};
          console.log(local, "localJson");
          const {
            lat = "", // 无定位时默认城市中心点
            lon = "", // 无定位时默认城市中心点
            cityCode = "", // 城市编码
          } = local;
          params.lon = lon ? (lon == "0.0" ? "" : lon) : "";
          params.lat = lat ? (lat == "0.0" ? "" : lat) : ""; //兼容ios空值返回0.0
        } catch (e) {
          console.log("获取定位信息失败");
        }
        // #endif

        action_report({
          action_name: "reportanalysis_submit_confirm_clk",
          module_name: "medical",
        });
        if (this.diseaseImgs.length > 0) {
          params.preFilledInfo.reports = this.handleUploadImg(this.diseaseImgs);
        }

        if (this.inquiryType == "REPORT_INTERPRETATION") {
          this.isSubmitting = true;
          submitMessageQuick(params, "v2")
            .then((res) => {
              // uni.redirectTo({
              //   url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              //     res.data
              //   )}&fromOrigin=new&inquiryType=REPORT_INTERPRETATION`,
              // });
            })
            .finally(() => {
              this.isSubmitting = false;
            });
        }
      }
    },
    renderYuText(type) {
      const types = {
        0: "绝育未知",
        1: "未绝育",
        2: "已绝育",
      };
      if (!type) return types[0];
      return types[type];
    },
    handleUploadImg(imgs) {
      if (typeof imgs !== "object") {
        return imgs;
      }

      if (!Array.isArray(imgs)) {
        return imgs.url;
      }

      const arr = imgs.map((item) => {
        return item.url;
      });
      // console.log("7777777", arr);

      return arr;
    },
    // 删除图片
    deletePic(event) {
      console.log("删除图片", event);
      this.diseaseImgs.splice(event.index, 1);
    },
    //新增图片
    async afterRead(event) {
      try {
        action_report({
          action_name: "reportanalysis_submit_upload_clk",
          module_name: "medical ",
        });
        this.upLoadDeletable = false;
        console.log("新增图片event", event);
        this.diseaseImgs.push({
          status: "uploading",
          message: "上传中",
          ...event.file,
        });

        const length = this.diseaseImgs.length;

        const res = await this._uploadFile(event.file);
        this.diseaseImgs.splice(length - 1, 1, {
          ...event.file,
          status: "success",
          message: "",
          url: res.data,
        });
      } catch (e) {
        console.error("新增图片", e);
      } finally {
        this.upLoadDeletable = true;
      }
    },

    _uploadFile(file) {
      return new Promise((resolve, reject) => {
        const url = process.env.NODE_ENV?.includes("local")
          ? "/api/"
          : BASR_URL;
        uni.uploadFile({
          url: url + "cpp-common-management/v1/file/upload",
          filePath: file.url,
          name: "file",
          header: {
            Authorization: uni.getStorageSync("storage_info").token,
            fromChannel: "MP",
          },
          formData: {
            file: file.url,
          },
          success: (uploadFileRes) => {
            resolve(uploadFileRes);
          },
          fail: (res) => {
            console.log(res);
            reject(res);
          },
        });
      });
    },

    handleGetWeight(weight) {
      this.weightData = weight;
    },
    handleWeightChange(val) {
      // 允许输入数字、小数点和以零开头的情况
      let cleanedValue = val.replace(/[^0-9.]/g, "");

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
        if (cleanedValue !== val) {
          this.weightData = cleanedValue
        } else {

          if (Number(cleanedValue) > 1000) {
            uni.showToast({
              title: "最高输入1000kg",
              icon: "none",
            });
            cleanedValue = "1000";
          }
          this.weightData = cleanedValue
        }
      });

    },
    checkboxChange(n) {
      if (n.length) {
        uni.setStorageSync("agreement", true);
      }
      this.checkboxValue = n.length ? [""] : [];
    },
    goAgreement() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pagesA/webView/index?route=/meow-interface/html/oxygen-pet.html&type=jump&title=隐私协议",
      });
      // #endif
      // #ifdef H5
      const h5Domain = {
        dev: "https://cn-dev02-shareactivity.chongpangpang.com/#",
        jumpdev: "https://cn-dev02-shareactivity.chongpangpang.com",
        // dev: "http://172.16.200.41:3000/#",
        pro: "https://shareactivity.chongpangpang.com/#",
        jumppro: "https://shareactivity.chongpangpang.com",
        pre: "https://cn-test01-shareactivity.chongpangpang.com/#",
        jumppre: "https://cn-test01-shareactivity.chongpangpang.com",
      };
      const jumpEnv =
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
          ? "jumpdev"
          : process.env.NODE_ENV === "pre"
          ? "jumppre"
          : "jumppro";
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${h5Domain[jumpEnv]}/meow-interface/html/oxygen-pet.html`,
      });
      // #endif
    },
    // 跳转添加宠物
    addPetsMethod() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesD/petInfo/index?type=${this.inquiryType}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesD/petInfo/index?nopet=nopet&type=${this.inquiryType}&apptype=add&transparentTopBar=1`,
      });
      // #endif
    },
    // 选中宠物某一项目
    selectItem(item) {
      this.selectedPet = item;
      this.selectPetItem = item;
      this.petId = item.id;
      console.log(item, "889977");
      // 判断是否异宠 清除宠物档案
      if (item.catPet || item.dogPet) {
        this.isAlienPet = false;
        this.getHealthFiles();
      } else {
        this.isAlienPet = true;
        if (!this.consultationId) this.weightData = "";
        this.filesInsect = {};
        this.filesVaccine = {};
      }
    },
    // 获取宠物档案
    getHealthFiles() {
      healthFiles({
        userId: this.$dsBridge && this.$dsBridge.call("getUserId", "getUserId") || this.userInfo.userId,
        petId: this.selectedPet.id,
      }).then((res) => {
        if (res.data.length == 0) {
          this.filesShow = true;
          // 清空本地档案数据
          this.filesVaccine.vaccineType = "";
          this.filesVaccine.vaccineTime = "";
          this.filesVaccine.vaccineTypeId = "";
          this.filesVaccine.vaccine = "";
          this.filesInsect.expelInsectsType = "";
          this.filesInsect.expelInsectsBrand = "";
          this.filesInsect.expelInsectsTime = "";
          this.filesInsect.expelInsects = "";
          this.filesInsect.expelInsectsTypId = "";
          this.filesInsect.expelInsectsBrandId = "";
          this.filesWeight.weight = "";
          this.filesWeight.time = "";
          if (!this.consultationId) this.weightData = "";
          this.yuList[0].checked = false;
          this.quList[0].checked = false;
        } else {
          // 清空本地档案数据
          // this.filesShow = false;
          this.filesData = res.data;
          this.filesVaccine.vaccineType = "";
          this.filesVaccine.vaccineTime = "";
          this.filesVaccine.vaccineTypeId = "";
          this.filesVaccine.vaccine = "";
          this.filesInsect.expelInsectsType = "";
          this.filesInsect.expelInsectsBrand = "";
          this.filesInsect.expelInsectsTime = "";
          this.filesInsect.expelInsects = "";
          this.filesInsect.expelInsectsTypId = "";
          this.filesInsect.expelInsectsBrandId = "";
          this.filesWeight.weight = "";
          this.filesWeight.time = "";
          this.yuList[0].checked = false;
          this.quList[0].checked = false;

          // 有宠物档案数据赋值
          res.data.forEach((element) => {
            if (element.mark == "YI_MIAO") {
              this.filesVaccine.vaccineTypeId = element.vaccineInfo?.typeId;
              this.filesVaccine.vaccineType = element.vaccineInfo?.typeName;
              this.filesVaccine.vaccineTime = element.recordTimeHm;
              this.filesVaccine.vaccine = 1;
              if (this.filesVaccine.vaccineType) {
                this.yuList[0].checked = true;
              }
            }
            if (element.mark == "QU_CHONG") {
              this.filesInsect.expelInsectsType =
                element.anthelminticInfo?.typeName;
              this.filesInsect.expelInsectsBrand =
                element.anthelminticInfo?.drugName;
              this.filesInsect.expelInsectsTime = element.recordTimeHm;
              this.filesInsect.expelInsects = 1;
              this.filesInsect.expelInsectsTypId =
                element.anthelminticInfo?.typeId;
              this.filesInsect.expelInsectsBrandId =
                element.anthelminticInfo?.drugId;
              if (
                this.filesInsect.expelInsectsType &&
                this.filesInsect.expelInsectsBrand
              ) {
                this.quList[0].checked = true;
              }
            }
            if (element.mark == "TI_ZHONG") {
              this.filesWeight.weight = element.weight;
              this.filesWeight.time = element.recordTimeHm;
              this.weightData = element.weight;
            }
          });
          let markList = (res.data || []).map((markItem) => markItem.mark);
          if (
            markList.includes("YI_MIAO") &&
            this.filesVaccine.vaccineType &&
            markList.includes("QU_CHONG") &&
            this.filesInsect.expelInsectsType &&
            markList.includes("TI_ZHONG")
          ) {
            this.filesShow = false;
          } else {
            this.filesShow = true;
          }
        }
      });
    },

    handleNavBack() {
      //#ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
      //#ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      //#endif
    },
    // 获取 宠物健康-元数据（疫苗/驱虫）
    getHealthMetadata(mark, dsc) {
      let petType = "OTHER";
      if (this.selectedPet.petCategoryId === 1) {
        petType = "CAT";
      }
      if (this.selectedPet.petCategoryId === 50) {
        petType = "DOG";
      }
      const params = {
        mark: mark, // 条目标记不能为空
        petType: petType, //"DOG", // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
        sex: this.selectedPet.sex, // "1", // 性别: 1-GG, -2MM
      };
      GET_HEALTH_METADATA(params).then((res) => {
        this.columns = res.data;
        this.isShowPop = true;
      });
    },
    openDatePicker() {
      this.isShowDate = true;
    },
    openCommonPicker(type) {
      //1疫苗 2驱虫类型 3驱虫品牌
      if (type == "2") {
        this.secondName = "驱虫类型";
        this.getHealthMetadata("QU_CHONG_LEI_XING_V2");
      }
      if (type == "3") {
        this.secondName = "驱虫品牌";
        this.getHealthMetadata(this.insectMark);
        // this.isShowPop = true;
      }
    },
    openFiles(type) {
      // 1 疫苗 2 驱虫 3 体重 4 特殊时期
      this.healthType = type;

      console.log(this.selectedPet, "this.selectedPet1111");
      this.healthPopShow = true;

      let petType = "OTHER";
      if (this.selectedPet.petCategoryId === 1) {
        petType = "CAT";
      }
      if (this.selectedPet.petCategoryId === 50) {
        petType = "DOG";
      }
      this.petInfoObj.petIds = this.selectedPet.id; //宠物id
      this.petInfoObj.sex = this.selectedPet.sex; // 性别: 1-GG, -2MM
      this.petInfoObj.petType = petType; // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"

      if (type == "1") {
        this.petInfoObj.date = this.filesVaccine.vaccineTime; // 时间
      }
      if (type == "2") {
        this.petInfoObj.date = this.filesInsect.expelInsectsTime; // 时间
      }
      if (type == "3") {
        this.petInfoObj.date = this.filesWeight.time; // 时间
      }

      this.petInfoObj.drugId = this.filesInsect.expelInsectsBrandId; // 驱虫品牌id
      this.petInfoObj.drugName = this.filesInsect.expelInsectsBrand; // 驱虫品牌name

      if (type == "1") {
        this.petInfoObj.typeId = this.filesVaccine.vaccineTypeId; // 驱虫/疫苗类型 id
        this.petInfoObj.typeName = this.filesVaccine.vaccineType; // 驱虫/疫苗类型 name
      }

      if (type == "2") {
        this.petInfoObj.typeId = this.filesInsect.expelInsectsTypId; // 驱虫/疫苗类型 id
        this.petInfoObj.typeName = this.filesInsect.expelInsectsType; // 驱虫/疫苗类型 name
      }

      this.petInfoObj.weight = this.filesWeight.weight; // 体重
      this.petInfoObj.specailMark = this.insectMark; // 特殊时期mark
      console.log(this.petInfoObj, "this.petInfoObj");
    },
    // 时间选择
    handleDateChange(data) {
      console.log(data, "data");
      this.petDate = data;
      // this.healthData[this.healthType - 1].children.map((item) => {
      //   if (item.id === this.openPopId) {
      //     item.selectedObj = data;
      //     item.name = data;
      //   }
      // });
    },
    // 大弹窗回调
    healthPopComplete(data) {
      console.log(data, "data大");
      if (this.healthType == 1) {
        this.filesVaccine.vaccineType = data.typeName;
        this.filesVaccine.vaccineTypeId = data.typeId;
        this.filesVaccine.vaccineTime = data.date;
        this.yuList[0].checked = true;
      }

      if (this.healthType == 2) {
        this.filesInsect.expelInsectsType = data.typeName;
        this.filesInsect.expelInsectsTypId = data.typeId;
        this.filesInsect.expelInsectsBrand = data.drugName;
        this.filesInsect.expelInsectsBrandId = data.drugId;
        this.filesInsect.expelInsectsTime = data.date;
        this.quList[0].checked = true;
      }
      if (this.healthType == 3) {
        this.filesWeight.time = data.date;
        this.filesWeight.weight = data.weight;
        this.weightData = data.weight;
      }

      // this.petDate = data;
    },
    handlePickerChange(data) {
      console.log(data, "data");
      if (this.secondName == "驱虫类型") {
        this.filesInsect.expelInsectsType = data.name;
        this.filesInsect.expelInsectsTypId = data.id;
        this.filesInsect.expelInsectsBrand = "";
        this.filesInsect.expelInsectsBrandId = "";
        this.insectMark = data.mark; //驱虫品牌
      }
      if (this.secondName == "驱虫品牌") {
        this.filesInsect.expelInsectsBrand = data.name;
        this.filesInsect.expelInsectsBrandId = data.id;
      }
    },
  },
  components: {
    ChangePetPop,
    DatePicker,
    CommonPicker,
    HealthPop,
    ConfirmPop,
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
