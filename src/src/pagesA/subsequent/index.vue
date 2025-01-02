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
          <view class="title">在线开药</view>
        </view>
      </view>
    </view>

    <!--背景-->
    <view class="top">
      <!-- 文案描述 -->
      <view class="copywriting-box">
        <view class="writing-top">在线开药，处方药品配送到家</view>
        <view class="writing-bottom">正确录入宝贝信息，即可开启服务～</view>
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
          <image
            class="avators"
            :src="selectPetItem.avatarUrl"
            mode="aspectFill"
          />
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
        <view class="prescription">
          <view class="pre-title">
            <view class="name">历史处方</view>
            <view class="choose">
              <view class="icon"></view>
              <view @click="goCheckHistoryPrescription">选择历史处方</view>
            </view>
          </view>
          <view class="pre-content">
            <view
              v-if="!historyPrescription || !historyPrescription.id"
              class="pre-emp"
              >暂无历史处方</view
            >
            <view v-else class="pre-his">
              <view class="title">
                <view class="time">{{ historyPrescription.createTime }}</view>
                <view class="del" @click="clearPrescription"></view>
              </view>
              <view class="diagnose">
                <view class="diagnose-title">诊断：</view>
                <view class="diagnose-content text-line-one">
                  {{ handleMatchDiagnose(historyPrescription) }}
                </view>
              </view>
              <view class="diagnose">
                <view class="diagnose-title"
                  >药品（共{{ historyPrescription.medicines.length }}个)</view
                >
                <view
                  class="medicines-content"
                  v-for="med in historyPrescription.medicines"
                  :key="med.id"
                >
                  <view class="name text-line-one">{{ med.name }}</view>
                  <view class="num"
                    >x{{ med.quantity }} {{ med.quantityUnit }}</view
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="disease-img">
          <view class="quTitle"
            >添加处方单<text
              v-if="!historyPrescription || !historyPrescription.id"
              class="required"
              >*</text
            ></view
          >
          <view
            style="
              font-size: 23rpx;
              color: #2dce80;
              font-weight: 400;
              margin-top: -19rpx;
              margin-bottom: 19rpx;
            "
            >请添加完整处方单，3日内有效</view
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
        <view class="detail" v-if="!historyPrescription.id">
          <view class="quTitle detailTitle"
            >请描述爱宠病情<text class="required">*</text></view
          >
          <view class="desca">
            <u-textarea
              height="135"
              v-model="illnessDesc"
              placeholder="请描述爱宠病情"
              maxlength="500"
              count
              :showConfirmBar="false"
            ></u-textarea>
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
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import ChangePetPop from "@/components/changePetPop/index.vue";
import { mapState, mapMutations } from "vuex";
import {
  getPetList,
  submitMessage,
  getTag,
  submitMessageQuick,
} from "@/api/base";
import { BASR_URL } from "@/utils/http";
import { GET_IN_SERVICE_LAST, getAISheetInfoApi } from "@/api/chat";
import { getPrescriptionList } from "@/api/sheets";
import { action_report } from "@/utils/track";
import { pxToRpx } from "@/utils";
import ConfirmPop from "@/pagesA/diseaseDesc/components/confirmPop/index.vue";
import chatMixins from "@/pagesA/mixins/chatMixins";
import { getPrescriptionDetail } from "@/api/sheets";
import { inquiryOrderDetail } from "@/api/inquiryOrder";

export default {
  onLoad(option) {
    console.log("====option====", option);
    this.petId = option.petId;
    this.inquiryType = option.inquiryType || "ONLINE_PRESCRIPTION"; //
    this.sheetId = option.sheetId;
    if (option.sheetId && option.sheetId != "") {
      this.getAISheetInfo(option.sheetId);
    }

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
    if (option.diagnosticId && option.diagnosticId !== "") {
      this.diagnosticId = option.diagnosticId;
      this.getdiagnosticDetail(option.diagnosticId);
    }
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
        this.firstLoading = false;
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

    this.inquiryOrderDetailHandler();
    await this.RYconnectMethod();
  },
  mixins: [chatMixins],
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
      sheetId: "", //引流的问诊单id
      inquiryType: "ONLINE_PRESCRIPTION", //ONLINE_PRESCRIPTION 在线开药
      diseaseImgs: [],
      illnessDesc: "",
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
      formatter: (value) => value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"),
      checkboxValue: uni.getStorageSync("agreement") ? [""] : [],
      statusBarHeight: 0,
      selectedPet: {}, //选中宠物
      petBoxTop: 0, // 选择宠物区域的定位高度
      hasPetBoxStickyClass: false, // 是否开启选择宠物区域样式
      isSubmitting: false, // 防止多次提交
      diagnosticId: "",
      //#ifdef H5
      historyPrescription: {}, // 处方
      //#endif
      firstLoading: false, // 第一次加载
      isScroll: false, // 是否滚动
    };
  },

  computed: {
    //#ifdef MP-WEIXIN
    ...mapState(["userInfo", "historyPrescription", "initPetPrescription"]),
    //#endif
    //#ifdef H5
    ...mapState(["userInfo", "initPetPrescription"]),
    //#endif
    allowSubmit() {
      // let pre = this.diseaseImgs.length || this.historyPrescription.id;
      // return pre && this.illnessDesc && this.checkboxValue;
      if (!this.checkboxValue.length) return false;
      if (this.historyPrescription && this.historyPrescription.id) return true;
      if (this.diseaseImgs.length && this.illnessDesc) return true;
      return false;
    },
  },
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
        //      报告    描述爱宠病情    您的解读需求
        const { userPrescriptions, illnessDesc, interpretationPurpose } =
          petInformation;
        console.log("res.data", symptomType, illnessDesc, petInformation);
        // 描述爱宠病情赋值
        this.illnessDesc = illnessDesc;
        // 上传症状图片赋值
        this.diseaseImgs = (userPrescriptions || []).map((url) => {
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
      }
    },
    async getAISheetInfo(sheetId) {
      const res = await getAISheetInfoApi({ id: sheetId });
      console.log(res);
      this.petId = res.data.petId;
      this.illnessDesc = res.data.illnessDesc || "";
    },
    // 获取历史处方详情
    async getdiagnosticDetail(diagnosticId) {
      const res = await getPrescriptionDetail({ id: diagnosticId });
      this.historyPrescription = res.data;
    },
    setDiagnosticId(id) {
      this.getdiagnosticDetail(id);
    },
    ...mapMutations(["setHistoryPrescription"]),
    clearPrescription() {
      action_report({
        action_name: "prescribe_submit_chosepre_clk",
        module_name: "medical ",
      });

      this.illnessDesc = "";
      // #ifdef MP-WEIXIN
      this.setHistoryPrescription({});
      // #endif
      // #ifdef H5
      this.historyPrescription = {};
      //#endif
    },
    getFirstPrescription() {
      getPrescriptionList({
        diagnosticType: "PRESCRIPTION",
        petId: this.petId,
      }).then((res) => {
        this.setHistoryPrescription(res.data.data[0] || {});
      });
    },
    handleMatchDiagnose(item) {
      //  【拟】
      let diagnoseEnum = {
        1: "待查，需要结合线下进一步诊断",
        2: "用户未及时回复或终止聊天",
        3: "据本次问诊描述，未发现异常",
        5: "无",
      };
      if (item.diagnosisIndex == 4) {
        if (Array.isArray(item.diagnosis) && item.diagnosis.length) {
          let name = item.diagnosis
            .map((i) => {
              return i.name;
            })
            .join("、");
          let remark = item.diagnosisRemarks
            ? `；${item.diagnosisRemarks}`
            : "";
          let res = name + remark;
          return "【拟】" + res;
        } else {
          return item.iagnosisRemarks || "无";
        }
      } else {
        if (item.diagnosisIndex == 5) {
          return item.diagnosisRemarks || "无";
        } else {
          let name = diagnoseEnum[item.diagnosisIndex];
          let remark = item.diagnosisRemarks
            ? `；${item.diagnosisRemarks}`
            : "";
          let res = name + remark;
          return res;
        }
      }
    },
    goCheckHistoryPrescription() {
      action_report({
        action_name: "prescribe_submit_chosepre_clk",
        module_name: "medical ",
      });
      uni.navigateTo({
        url: `/pagesB/historyPrescription/index?petId=${this.petId}`,
      });
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
    },
    handleSelectPet(item) {
      console.log(23343);
      this.selectPetItem = item;
      this.petId = item.id;
      this.getFirstPrescription();
    },
    handleMessage() {
      var that = this;
      if (this.allowSubmit) {
        if (this.isSubmitting) {
          console.log("请求中");
          return;
        }
        let petType = "OTHER";
        if (this.selectPetItem.petCategoryId === 1) {
          petType = "CAT";
        }
        if (this.selectPetItem.petCategoryId === 50) {
          petType = "DOG";
        }
        const params = {
          inquiryType: this.inquiryType,
          preFilledInfo: {
            gender: this.selectPetItem.sex,
            petId: this.selectPetItem.id,
            ...this.selectPetItem,
            age: this.selectPetItem.guardTime,
            petType,
            illnessDesc: this.illnessDesc,
            userPrescriptions: [],
            historyPrescriptionId: this.historyPrescription.id,
            weight: "0",
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
          lon: uni.getStorageSync("lon") || "", //经度
          lat: uni.getStorageSync("lat") || "", //维度
          aiConsultationId: this.sheetId || "",
        };

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
          action_name: "prescribe_submit_confirm_clk",
          module_name: "medical",
          extend: {
            prescription_id: this.historyPrescription.id || "",
          },
        });

        if (this.diseaseImgs.length > 0) {
          params.preFilledInfo.userPrescriptions = this.handleUploadImg(
            this.diseaseImgs
          );
        }

        if (this.inquiryType == "ONLINE_PRESCRIPTION") {
          this.isSubmitting = true;
          submitMessageQuick(params, "v2")
            .then((res) => {
              // uni.redirectTo({
              //   url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              //     res.data
              //   )}&fromOrigin=new&inquiryType=ONLINE_PRESCRIPTION`,
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
          action_name: "prescribe_submit_upload_clk",
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

        // console.log("dfsdfds", {
        //   status: "uploading",
        //   message: "上传中",
        //   ...event.file,
        // });

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
    handleWeightChange(e) {
      if (e > 1000) {
        uni.showToast({
          title: "最高输入1000kg",
        });
      }
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
      if (this.firstLoading) {
        this.historyPrescription = [];
      } else {
        this.firstLoading = true;
      }
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
  },
};
</script>

<style lang="scss" scoped>
@import "index";
</style>
