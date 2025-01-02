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
          <view class="title">营养咨询</view>
        </view>
      </view>
    </view>

    <!--背景-->
    <view class="top">
      <!-- 文案描述 -->
      <view class="copywriting-box">
        <view class="writing-top">问题清晰描述，快速与医生对话</view>
        <view class="writing-bottom">马上录入你家宠物的营养信息吧~</view>
      </view>
    </view>

    <!-- 宠物切换 -->
    <view
      class="pet-box"
      :class="{ 'pet-box-sticky': hasPetBoxStickyClass }"
      :style="{ top: petBoxTop }"
    >
      <scroll-view scroll-x="true" class="pet-scroll" :scroll-into-view="petScrollToViewData">
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
    <!-- <view class="top"></view> -->
    <view class="content">
      <!-- <view class="petInfo">
        <view class="avator">
          <image class="avators" :src="selectPetItem.avatarUrl"  mode="aspectFill" />
        </view>
        <view class="base">
          <view class="nameCard">
            <text class="name">{{ selectPetItem.nickName }}</text>
            <text class="year">{{ selectPetItem.guardTime }}</text>
          </view>
          <view class="pettype">
            <text class="typeName">{{ selectPetItem.categoryName }}</text>
            <text class="sex">{{ selectPetItem.sexName }}</text>
            <text class="gang">I</text>
            <text class="yu">{{
              renderYuText(selectPetItem.sterilizationStatus)
            }}</text>
            <text v-if="selectPetItem.hairColor" class="gang">I</text>
            <text v-if="selectPetItem.hairColor" class="petColor">{{
              selectPetItem.hairColor
            }}</text>
          </view>
        </view>
        <view class="changePet" @click="handleChangePet">
          <view class="changeText">切换宠物</view>
          <view class="arr"></view>
        </view>
      </view> -->
      <view class="line"></view>
      <view class="qu">
        <!-- 无档案记录 -->
        <view v-if="filesShow && !isAlienPet">
          <view class="weight-zone">
            <view class="quTitle">体重<text class="required">*</text></view>
            <view class="input-wrapper">
              <u--input
                placeholder="请输入体重"
                border="surround"
                shape="circle"
                v-model="weight"
                clearable
                type="digit"
                :customStyle="{ width: '500rpx' }"
                @input="handleWeightChange"
              ></u--input
              ><view>kg</view></view
            >
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
        </view>
        <view class="quone">
          <view class="quTitle"
            >主食习惯（可多选）<text class="required">*</text></view
          >
          <view class="yuList">
            <view
              class="checkItem"
              v-for="yitem in eatHabitListMock"
              :key="yitem.key"
              :class="{
                checked: yitem.checked,
              }"
              @click="
                () => {
                  handleChecked('eatHabitListMock', yitem, 'tagId', true);
                }
              "
            >
              {{ yitem.tagName }}
            </view>
          </view>
        </view>
        <view class="qutwo">
          <view class="quTitle">每日运动量<text class="required">*</text></view>
          <view class="quList">
            <view
              class="checkItem"
              @click="
                () => {
                  handleChecked('sportList', qitem, 'tagId', false);
                }
              "
              v-for="qitem in sportList"
              :key="qitem.tagId"
              :class="{
                checked: qitem.checked,
              }"
            >
              {{ qitem.tagName }}
            </view>
          </view>
        </view>
        <view class="quthree">
          <view class="quTitle"
            >问诊诉求（可多选）<text class="required">*</text></view
          >
          <view class="quList">
            <view
              class="checkItemWidth"
              v-for="qitem in medicalDemandList"
              :key="qitem.tagId"
              :class="{
                checked: qitem.checked,
              }"
              @click="
                () => {
                  handleChecked('medicalDemandList', qitem, 'tagId', true);
                }
              "
            >
              {{ qitem.tagName }}
            </view>
          </view>
        </view>
        <view class="detail">
          <view class="quTitle detailTitle">具体描述</view>
          <view class="desca">
            <u--textarea
              height="135"
              v-model="illnessDesc"
              placeholder="请描述爱宠的营养问题"
              maxlength="500"
              count
              :showConfirmBar="false"
            ></u--textarea>
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
    <ChangePetPop
      :petList="petList"
      :selectPetId="petId"
      :isOpen.sync="isPetShow"
      @confirm="handleSelectPet"
      @close="handlePetPopClose"
    />
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
    <ConfirmPop ref="symptomPopup"></ConfirmPop>
    <HealthPop
      :healthType="healthType"
      type="add"
      :show.sync="healthPopShow"
      :petInfo="petInfoObj"
      @complete="healthPopComplete"
    ></HealthPop>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import ChangePetPop from "@/components/changePetPop";
import { mapState, mapMutations } from "vuex";
import {
  getPetList,
  submitMessage,
  getTag,
  submitMessageQuick,
  checkUserQualification,
  healthFiles,
} from "@/api/base";
// import { BASR_URL_NO } from "@/utils/http";
import { pxToRpx } from "@/utils/index";
import chatMixins from "@/pagesA/mixins/chatMixins";
import { cachePaidConsultationInfo } from "@/api/medical";
import ConfirmPop from "@/pagesA/diseaseDesc/components/confirmPop/index.vue";
import HealthPop from "../diseaseDesc/components/healthPop.vue";
import { inquiryOrderDetail } from "@/api/inquiryOrder";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
export default {
  mixins: [chatMixins],
  onLoad(option) {
    console.log("====nutritionDesc====", option);
    this.petId = option.petId;
    this.doctorUserId = option.doctorUserId;
    this.groupId = option.groupId;
    this.inquiryType = option.inquiryType || "EXPERT"; //  QUICK
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
        const resultPetData = this.petId && this.consultationId ? selectPet : res.data[0];
        console.log("设置宠物", resultPetData, selectPet);
        this.selectedPet = resultPetData;
        this.selectItem(this.selectedPet);
        // 滚动到选择的宠物
        this.$nextTick(() => {
          this.petScrollToViewData = `pet_item_${this.selectedPet.id}`;
        })
        if (this.selectPetItem.id) {
          return;
        }

        this.selectPetItem = selectPet;
      }
    });

    const consultationInfo = uni.getStorageSync("submit_consultation_info");
    // 针对submit异常返回可能会丢失消息，需要续接获取历史消息的逻辑
    console.log("获取到续接消息", consultationInfo);
    if (consultationInfo) {
      const { from, consultationId } = consultationInfo;
      this.from = from;
      this.consultationId = consultationId;
      // 赋值完成立刻清除，防止其他异常场景
      uni.removeStorageSync("submit_consultation_info");
    }
    this.$nextTick(() => {
      this.RYconnectMethod();
      this.inquiryOrderDetailHandler();
    });
  },
  data() {
    return {
      petScrollToViewData: '',
      doctorShow: false,
      from: "",
      consultationId: "",
      userGroupId: "",
      deadlineTime: "",
      waitingTimer: null,
      timeOutId: null,
      secondNum: 0,
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
        {
          name: "接种不全",
          key: 3,
          checked: false,
        },
        {
          name: "接种不详",
          key: 4,
          checked: false,
        },
      ],
      sportList: [],
      inquiryType: "EXPERT", //QUICK 快速 EXPERT 专家
      isPetShow: false,
      petId: "",
      selectPetItem: {},
      petList: [],
      medicalDemandList: [],
      doctorUserId: "",
      groupId: "",
      weight: "",
      illnessDesc: "",
      eatHabitListMock: [],
      resourceId: "",
      resourceType: "",
      checkboxValue: [],
      statusBarHeight: 0,
      selectedPet: {}, //选中宠物
      petBoxTop: 0, // 选择宠物区域的定位高度
      hasPetBoxStickyClass: false, // 是否开启选择宠物区域样式
      filesShow: true, //宠物档案是否有内容
      //宠物档案体重信息
      filesWeight: {
        time: "",
        weight: "",
      },
      healthType: "",
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
      // 大弹窗
      healthPopShow: false,
      isSubmitting: false, // 防止多次提交
      isAlienPet: false, // 是否异宠
      isScroll: false, // 是否滚动
    };
  },

  computed: {
    ...mapState(["userInfo"]),
    allowSubmit() {
      //查找必传项
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d{1,2})?$/;
      const weightAllow = reg.test(this.weight) && this.weight <= 1000;
      const dietHabit = this.eatHabitListMock.find((q) => q.checked);
      const dailyExerciseAmount = this.sportList.find((q) => q.checked);
      const medicalDemand = this.medicalDemandList.find((q) => q.checked);

      // 关于异宠修改校验
      if (!this.isAlienPet) {
        return !!(
          dietHabit &&
          dailyExerciseAmount &&
          weightAllow &&
          medicalDemand &&
          this.checkboxValue.length
        );
      } else {
        return !!(
          dietHabit &&
          dailyExerciseAmount &&
          medicalDemand &&
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
        //      主食习惯     每日运动量            问诊诉求         描述爱宠病情
        const {
          dietHabit,
          dailyExerciseAmount,
          medicalDemand,
          illnessDesc,
          weight,
        } = petInformation;
        console.log("res.data", symptomType, illnessDesc, petInformation);
        // 描述爱宠病情赋值
        this.illnessDesc = illnessDesc;
        // 主食习惯
        this.eatHabitListMock.forEach((item) => {
          const findData = (dietHabit || []).find(
            (dietHabitItem) => dietHabitItem === item.tagName
          );
          item.checked = !!findData;
        });
        // 每日运动量
        this.sportList.forEach((item) => {
          item.checked = item.tagName === dailyExerciseAmount;
        });
        // 问诊诉求
        this.medicalDemandList.forEach((item) => {
          const findData = (medicalDemand || []).find(
            (medicalDemandItem) => medicalDemandItem === item.tagName
          );
          item.checked = !!findData;
        });
        // 已经阅读协议
        this.checkboxValue = [""];
        this.weight = weight;
      }
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
    },
    // 获取病症分类
    async _getDiseaseTag() {
      try {
        const { data } = await getTag({
          bizType: "CONSULTATION_NUTRITION",
        });
        //需要渲染taglist
        // if (data.ALL) {
        //   this.diseaseList = data.ALL;
        // }
        const { DAILY_EXERCISE_AMOUNT, DIET_HABIT, MEDICAL_DEMAND } = data;
        this.sportList = DAILY_EXERCISE_AMOUNT;
        this.eatHabitListMock = DIET_HABIT;
        this.medicalDemandList = MEDICAL_DEMAND;
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
    handleSelectPet(item) {
      this.selectPetItem = item;
      this.petId = item.id;
    },
    handleMessage() {
      var that = this;

      if (this.weight < 0 || (this.weight == 0 && !this.isAlienPet)) {
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
        const dietHabit = this.eatHabitListMock
          .filter((q) => q.checked)
          .map((i) => {
            return i.tagName;
          });
        const dailyExerciseAmount = this.sportList.find(
          (q) => q.checked
        ).tagName;
        const medicalDemand = this.medicalDemandList
          .filter((q) => q.checked)
          .map((i) => {
            return i.tagName;
          });
        let petType = "OTHER";
        if (this.selectPetItem.petCategoryId === 1) {
          petType = "CAT";
        }
        if (this.selectPetItem.petCategoryId === 50) {
          petType = "DOG";
        }
        const params = {
          resourceId: this.resourceId,
          resourceType: this.resourceType,
          doctorUserId: this.doctorUserId,
          groupId: this.groupId,
          preFilledInfo: {
            gender: this.selectPetItem.sex,
            petId: this.selectPetItem.id,
            ...this.selectPetItem,
            age: this.selectPetItem.guardTime,
            petType,
            dietHabit,
            dailyExerciseAmount,
            weight: this.weight,
            medicalDemand,
            illnessDesc: this.illnessDesc,
            // 兼容疫苗入参
            vaccineDetail: {
              vaccine: 2,
              vaccineType: 2,
              vaccineTypeId: "",
              vaccineTime: "",
            },
            //宠物档案驱虫信息
            expelInsectsDetail: {
              expelInsects: "", // 是否驱虫 1：定时驱虫；2：未做驱虫
              expelInsectsType: "", //驱虫类型
              expelInsectsTypId: "", // 驱虫类型Id
              expelInsectsBrand: "", //驱虫品牌
              expelInsectsBrandId: "", //驱虫品牌Id
              expelInsectsTime: "", //驱虫时间 "yyyy-MM-dd HH:mm:ss"
            },
          },
          source: "WECHAT_XCX",
          inquiryType: "NUTRITION",
          lon: uni.getStorageSync("lon") || "", //经度
          lat: uni.getStorageSync("lat") || "", //维度
        };

        // #ifdef H5
        params.source = this.$dsBridge.call("getAppInfo", "os");
        // #endif

        // 专家问诊-需要保存填写信息，如果需要付费则是在跳转订单确认创单
        cachePaidConsultationInfo(params, "v2").then(async (res) => {
          // 跳转至确认订单页面 https://dev-cpp.chongpangpang.com/crm-medical-h5/#/pagesD/inquiryOrderSubmit/index?cid=106936185777885184_1732691869868&skuId=1753985499261607937&originalPrice=29&discountedPrice=0.01
          /**
           * 需要兼容老版本指定场景，派单需要走v2
           * */
          const cid = res.data;
          let source = "IOS";
          //#ifdef H5
          source = this.$dsBridge.call("getAppInfo", "os");

          try {
            const local = this.$dsBridge.call(
              "getAddressInfo",
              "getAddressInfo"
            )
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

          /**
           * 查询用户当前问诊单的相关信息
           * @return
           * 那个result含义是这些
           * 问诊资格校验响应结果 1有问诊次数；2有可用问诊卡券；3无问诊资格；4存在服务中问诊单；5收费
           * */
          const checkUserQualificationRes = await checkUserQualification(
            {
              source,
              inquiryType: this.inquiryType,
              checkServiceSheetFlag: false, // 静默不需要查询当前用户是否有问诊单
            },
            "v2"
          );

          /**
           * {
           *  "result":5,
           *  "consultationSheet":null,
           *  "goods": {
           *      "originalPrice":29,
           *      "discountedPrice":0.01,
           *      "skuId":"1753985499261607937",
           *      "discountTypeText":"限时优惠"
           *    }
           *  }
           *
           * */
          console.log(checkUserQualificationRes);

          // 跳转至确认订单页面 https://dev-cpp.chongpangpang.com/crm-medical-h5/#/pagesD/inquiryOrderSubmit/index?cid=106936185777885184_1732691869868&skuId=1753985499261607937&originalPrice=29&discountedPrice=0.01

          const { result, goods } = checkUserQualificationRes.data;
          // 收费场景-跳转至确认订单页面
          if (+result === 5) {
            const { skuId, originalPrice, discountedPrice } = goods;
            uni.redirectTo({
              url: `/pagesD/inquiryOrderSubmit/v2/index?cid=${cid}&skuId=${skuId}&originalPrice=${originalPrice}&discountedPrice=${discountedPrice}`,
            });
          } else {
            //免费场景创单
            this.isSubmitting = true;
            submitMessage(params, "v2").finally(() => {
              this.isSubmitting = false;
            });
          }

          // #ifdef MP-WEIXIN
          // that.$uma.trackEvent("pet_pre_ask", {
          //   user_id: uni.getStorageSync("userId"),
          //   type: "EXPERT",
          // });
          // #endif
          // uni.redirectTo({
          //   url: `/pagesA/bussinessOrder/confirmOrderPage/v2/index?diagnosticSheetId=${consultationId}&fromOrigin=new&inquiryType=EXPERT`,
          // });
        });
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
      return arr;
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
          this.weight = cleanedValue
        } else {
          
          if (Number(cleanedValue) > 1000) {
            uni.showToast({
              title: "最高输入1000kg",
              icon: "none",
            });
            cleanedValue = "1000";
          }
          this.weight = cleanedValue
        }
      });

    },
    // formatter(value) {
    //   const regex = /^(?!0\d)(?!1000)([1-9]\d{0,2}|\d{1,2})(\.\d{1,2})?$/g;
    //   const result = value.replace(regex, (match) => {
    //     const num = parseFloat(match);
    //     const rounded = Math.round(num * 100) / 100; // round to two decimal places
    //     return rounded.toString();
    //   });
    //   return result;
    // },
    checkboxChange(n) {
      // if (n.length) {
      //   uni.setStorageSync("agreement", true);
      // }
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
      // 判断是否异宠 清除宠物档案
      if (item.catPet || item.dogPet) {
        this.isAlienPet = false;
        this.getHealthFiles();
      } else {
        this.isAlienPet = true;
        this.weightData = "";
        this.filesInsect = {};
        this.filesVaccine = {};
      }
    },
    //上一条问诊单详情
    async lastDetail() {
      const res = await GET_IN_SERVICE_LAST({ petId: this.petId });
      if (res.data && res.data.petInformation) {
        this.weight = res.data.petInformation?.weight
      } else {
        this.weight = ''
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
          this.filesWeight.weight = "";
          this.filesWeight.time = "";
          if (!this.consultationId) this.weight = "";
        } else {
          // 清空本地档案数据
          this.filesShow = false;
          this.filesWeight.weight = "";
          this.filesWeight.time = "";

          // 有宠物档案数据赋值
          res.data.forEach((element) => {
            if (element.mark == "TI_ZHONG") {
              this.filesWeight.weight = element.weight;
              this.filesWeight.time = element.recordTimeHm;
              this.weight = element.weight;
            }
          });
        }
      });
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
      if (type == "3") {
        this.petInfoObj.date = this.filesWeight.time; // 时间
      }
      this.petInfoObj.weight = this.filesWeight.weight; // 体重
      this.petInfoObj.specailMark = this.insectMark; // 特殊时期mark
      console.log(this.petInfoObj, "this.petInfoObj");
    },
    // 大弹窗回调
    healthPopComplete(data) {
      console.log(data, "data大");
      if (this.healthType == 3) {
        this.filesWeight.time = data.date;
        this.filesWeight.weight = data.weight;
        this.weight = data.weight;
      }

      // this.petDate = data;
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
  },
  components: {
    ConfirmPop,
    ChangePetPop,
    HealthPop,
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
