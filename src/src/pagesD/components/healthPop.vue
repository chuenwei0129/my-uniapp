<template>
  <view class="health-pop" @touchmove.stop.prevent="stopPrevent">
    <u-popup
      :show="show"
      @close="close"
      round="38rpx"
      mode="bottom"
      @touchmove.stop.prevent
      :safeAreaInsetBottom="false"
    >
      <view class="content">
        <view class="top-nav">
          <view class="title">{{
            healthData[healthType - 1].healthTitle
          }}</view>
          <view class="nav-close" @click="close">
            <image :src="closeIcon" class="close"></image>
          </view>
        </view>

        <view class="content-main">
          <view
            :class="{ 'no-border': index === healthChildren.length - 1 }"
            class="content-main-item"
            v-for="(item, index) in healthChildren"
            :key="index"
            @click.stop.prevent="openSecondPop(item)"
          >
            <template v-if="item.type === 'weight'">
              <view class="item-title">{{ item.label }}</view>
              <view class="item-type" @click.stop.prevent="stopPrevent">
                <u--input
                  v-model="selectedParams.weight"
                  placeholder="请输入"
                  border="none"
                  inputAlign="right"
                  type="digit"
                  @blur="(val) => handleBlurInput(val, item)"
                  @input="(val) => handleInput(val, item)"
                ></u--input>
                <view class="unit">kg</view>
              </view>
            </template>
            <template v-else>
              <view class="item-title">{{ item.label }}</view>
              <view class="item-selected">
                <view class="selected-txt">{{ item.name || "" }}</view>
                <image class="icon" :src="sjIcon" />
              </view>
            </template>
          </view>
          <!-- 备注 -->
          <view class="content-remark" v-if="isShowItem">
            <view class="remark-title">备注</view>
            <view class="remark-textare">
              <textarea
                class="textarea"
                v-model="remark"
                placeholder="又长胖啦，最近吃的太多了"
                count
                maxlength="100"
                placeholderClass="remark-hint"
                @input="changInput"
              ></textarea>
              <view class="remark-count">{{ lang }}/100</view>
            </view>
            <!-- 图片上传 -->
            <view class="upload-box">
              <u-upload
                :fileList="fileList"
                @afterRead="afterRead"
                @delete="deletePic"
                :deletable="upLoadDeletable"
                name="1"
                :maxCount="1"
                width="154rpx"
                height="154rpx"
              >
                <view class="upload">
                  <image class="upload-img" :src="uploadIcon" />
                  <view class="upload-txt">0/1</view>
                </view>
              </u-upload>
            </view>
          </view>
          <!-- 动态 -->
          <view class="content-main-item noborder" v-if="type === 'add'">
            <view class="item-title">同步动态</view>
            <view class="item-selected">
              <u-switch
                space="2"
                v-model="dynamicSwitch"
                activeColor="#FEE900"
                inactiveColor="#E6E6E6"
                @change="switchChange"
              >
              </u-switch>
            </view>
          </view>
        </view>

        <view class="bottom" :class="{ bottomMargin: !isShowItem }">
          <view class="bottom-btn" @click="handleComplete">完成</view>
        </view>
      </view>
    </u-popup>
    <CommonPicker
      v-if="isShowPop"
      :isShowPop.sync="isShowPop"
      :columns="columns"
      :secondName="secondName"
      @onchange="handlePickerChange"
    />

    <DateTimePicker
      v-if="healthType !== 4"
      :isShowPop.sync="isShowDate"
      @onChange="handleDateChange"
    />
    <SpecialLimitedTime
      v-else
      :isShowPop.sync="isShowDate"
      :birthType="recordTime"
      :feedback="selectedParams.date"
      :notLimit="secondType"
      @onChange="secondTypeTimeOnChange"
    ></SpecialLimitedTime>
  </view>
</template>
<script>
import { BASR_URL } from "@/utils/http";
import CommonPicker from "./commonPicker.vue";
import DateTimePicker from "./datePicker.vue";
import DatePicker from "./dateTimePicker.vue";
import SpecialLimitedTime from "./specialLimitedTime.vue";
import {
  UPDATE_DYNAMIC,
  GET_HEALTH_METADATA,
  GET_ITEM_BYTYPE,
  GET_SPECIAL_PERIOD,
} from "@/api/petinfo";

import dayjs from "dayjs";
import { action_report } from "@/utils/track";

export default {
  name: "healthPop",
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  components: {
    CommonPicker,
    DateTimePicker,
    DatePicker,
    SpecialLimitedTime,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    healthType: {
      type: Number,
      default: 1, // 1 疫苗 2 驱虫 3 体重 4 特殊时期
    },
    type: {
      type: String,
      default: "", // add 添加  edit 编辑
    },
    enterType: {
      type: String,
      default: "", //是不是智能问诊过来的 AI_INQUIRY代表智能问诊
    },
    petInfo: {
      type: Object,
      default: () => {
        return {
          // petIds: "1810904736532234242", // 宠物id
          // petType: "DOG", // // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
          // sex: "1", // 性别: 1-GG, -2MM
          // date: "2024-11-01 00:00", // 时间
          // drugId: "673c07e54f69c42afb221d71", // 驱虫品牌id
          // drugName: "欣宠克", // 驱虫品牌name
          // typeId: "6735b0aabbf92b477c533585", // 驱虫/疫苗类型 id
          // typeName: "哺乳期", // 驱虫/疫苗类型 name
          // weight: "23", // 体重
          // specailMark: "", // 特殊时期mark
          //           "lactationRecordTime": "" 最近一次哺乳期填写日,
          // "expectedDateRecordTime": "" 最近一次预产期填写日
          //sterilizationStatus性别
        };
      },
    },
    healthyCode: {
      type: String,
    },
  },
  data() {
    return {
      // 关闭 icon
      closeIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/block_close.png",
      // 三角 icon
      sjIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png",
      // 图片上传 icon
      uploadIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/petfile-upload.png",
      // 备注
      remark: "",
      // 同步动态
      dynamicSwitch: false,
      // 文本输入长度
      lang: 0,
      // 上传图片
      fileList: [],
      // 是否可删除
      upLoadDeletable: true,
      // 普通二级弹窗
      isShowPop: false,
      // 时间二级弹窗
      isShowDate: false,
      // 普通二级弹层数据
      columns: [],
      // 二级弹窗标题
      secondName: "",
      // 初始化数据
      healthData: [
        {
          healthTitle: "疫苗",
          healthType: 1,
          children: [
            {
              label: "记录时间",
              name: "",
              id: "3",
              type: "date",
              selectedObj: {},
            },
            {
              label: "疫苗类型",
              name: "",
              id: "1",
              type: "typeId",
              selectedObj: {},
              options: [],
            },
          ],
        },
        {
          healthTitle: "驱虫",
          healthType: 2,
          children: [
            {
              label: "记录时间",
              name: "",
              id: "3",
              type: "date",
              selectedObj: {},
            },
            {
              label: "驱虫类型",
              name: "",
              id: "1",
              type: "typeId",
              selectedObj: {},
              options: [],
            },
            {
              label: "驱虫品牌",
              name: "",
              id: "2",
              type: "typeName",
              selectedObj: {},
              options: [],
            },
          ],
        },
        {
          healthTitle: "体重",
          healthType: 3,
          children: [
            {
              label: "记录时间",
              name: "",
              id: "3",
              type: "date",
              selectedObj: {},
            },
            {
              label: "记录体重",
              name: "",
              id: "1",
              type: "weight",
              selectedObj: {},
              options: [],
            },
          ],
        },
        {
          healthTitle: "特殊时期",
          healthType: 4,
          children: [
            {
              label: "选择时期",
              name: "",
              id: "1",
              type: "typeId",
              selectedObj: {},
              options: [],
            },
            {
              label: "开始时间",
              name: "",
              id: "2",
              type: "date",
              selectedObj: {},
            },
          ],
        },
      ],
      // 打开二级弹窗的id
      openPopId: null,
      openPopType: null,
      // 记录时间
      recordDate: null,
      // 选中用来传参 obj
      selectedParams: {},
      healthEventMark: ["YI_MIAO", "QU_CHONG", "TI_ZHONG"],
      // itemId 用于同步动态传参
      itemId: "",
      oldHealthData: [],
      // 当前时间 年月日 时分
      nowDateTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      buryName: [
        "petfiles_add_vacnote", // 疫苗
        "petfiles_add_killinsect", // 驱虫
        "petfiles_add_weight", // 体重
        "petfiles_add_specialperiod", // 特殊时期
      ],
      notLimit: false,
      specialLimitedTimeShow: false,
      secondType: "",
      recordTime: "",
    };
  },
  computed: {
    healthChildren() {
      return this.healthData[this.healthType - 1]?.children;
    },
    isShowItem() {
      // 特殊时期
      if (this.healthType === 4) return false;
      else return true;
    },
  },
  watch: {
    async show(newVal, oldVal) {
      if (newVal) {
        console.log("show--watch====>", this.petInfo, this.nowDateTime);
        this.selectedParams = {
          typeId: "",
          typeName: "",
          drugId: "",
          drugName: "",
          remark: "",
          fileList: [],
          weight: "",
          specailMark: "",
          date: "",
        };
        // 驱虫 QU_CHONG_LEI_XING_V2
        // 疫苗 YI_MIAO_LEI_XIN_V3
        const mark =
          this.healthType === 1
            ? "YI_MIAO_LEI_XIN_V3"
            : this.healthType === 2
            ? "QU_CHONG_LEI_XING_V2"
            : "";
        if ([1, 2].includes(this.healthType)) {
          this.getHealthMetadata(mark, "type");
          this.getItemInfoByType(this.petInfo.petType);
        }
        console.log("接收数据：：：", this.petInfo);
        this.handleEchoData();
        if (this.healthType == 4) {
          console.log("this.healthType", this.petInfo);
          this.handleSpecialEcho();
          // 特殊时期回显
          if (this.petInfo.specailMark == "TE_SHU_SHI_QI_PRENATAL") {
            // 孕期"TE_SHU_SHI_QI_FEEDING"
            this.recordTime = this.petInfo.expectedDateRecordTime;
            this.secondType = "expectedDate";
          } else if (this.petInfo.specailMark == "TE_SHU_SHI_QI_FEEDING") {
            //  "lactationRecordTime": "" 最近一次哺乳期填写日,
            this.recordTime = this.petInfo.lactationRecordTime;
            this.secondType = "deliveryTime";
          }
          console.log("this.secondType", this.secondType);
        }
      }
    },
  },
  mounted() {},
  methods: {
    stopPrevent() {
      return;
    },
    secondTypeTimeOnChange(data) {
      this.recordDate = data;
      this.selectedParams.date = data;
      this.healthData[this.healthType - 1].children.map((item) => {
        if (item.id === this.openPopId) {
          item.selectedObj = data;
          item.name = data;
        }
      });
      this.specialLimitedTimeShow = false;
    },
    async handleSpecialEcho() {
      const res = await this.getSpecialPeriod();

      res.forEach(async (specialItem, index) => {
        // 特殊时期
        if (specialItem.id === this.petInfo.typeId) {
          const list = ["TE_SHU_SHI_QI_FEEDING", "TE_SHU_SHI_QI_PRENATAL"];
          this.selectedParams.specailMark = specialItem.mark;
          if (!list.includes(specialItem.mark)) {
            // 关闭【开始时间】
            // 清除已选的时间
            this.selectedParams.date = "";
            this.recordDate = "";
            this.healthData[this.healthType - 1].children.splice(1, 1);
          } else {
            this.healthData = this.oldHealthData;
            this.selectedParams.typeName = specialItem.name;
            this.selectedParams.typeId = specialItem.id;
            this.selectedParams.date = this.petInfo.date;
            this.recordDate = this.petInfo.date;
            await this.getSpecialPeriod();
            if (specialItem.mark == list[0]) {
              this.healthData[this.healthType - 1].children[1].label =
                "分娩时间";
              this.secondType = "deliveryTime";
            } else if (specialItem.mark == list[1]) {
              this.secondType = "expectedDate";
              this.healthData[this.healthType - 1].children[1].label = "预产期";
            }
          }
        }
        if (!this.petInfo.typeId && index === 0) {
          this.healthData[3].children[0].name = specialItem.name;
          this.openPopType = "typeId";
          this.handlePickerChange(specialItem);
        }
      });
    },
    async handleEchoData() {
      this.oldHealthData = JSON.parse(JSON.stringify(this.healthData));
      this.healthData[this.healthType - 1].children.map((item) => {
        if (item.type === "date") {
          item.selectedObj = {
            date: this.petInfo.date ?? this.nowDateTime,
          };
          item.name = this.petInfo.date ?? this.nowDateTime;
          this.recordDate = this.petInfo.date || this.nowDateTime;

          if (!this.petInfo.date && this.healthType != 4) {
            this.$set(
              this.healthData[this.healthType - 1].children[0],
              "name",
              this.nowDateTime
            );
          } else if (!this.petInfo.date && this.healthType == 4) {
            item.name = "";
            this.recordDate = "";
            item.selectedObj = {};
          }
        } else if (item.type === "typeId") {
          item.selectedObj = {
            typeId: this.petInfo.typeId,
            typeName: this.petInfo.typeName,
          };
          item.name = this.petInfo.typeName;
        } else if (item.type === "typeName") {
          item.selectedObj = {
            drugId: this.petInfo.drugId,
            drugName: this.petInfo.drugName,
          };
          item.name = this.petInfo.drugName;
        } else if (item.type === "weight") {
          item.selectedObj = {
            weight: this.petInfo.weight,
          };
          item.name = this.petInfo.weight;
        }
      });
      if ([1, 2].includes(this.healthType)) {
        const mark =
          this.healthType === 1
            ? "YI_MIAO_LEI_XIN_V3"
            : this.healthType === 2
            ? "QU_CHONG_LEI_XING_V2"
            : "";
        if (this.healthType === 2) {
          const res = await this.getHealthMetadata(mark, "type");
          res.data.forEach((item) => {
            if (item.id == this.petInfo.typeId) {
              this.getHealthMetadata(item.mark, "name");
            }
          });
        } else {
          this.getHealthMetadata(mark, "type");
        }
      }
      this.selectedParams = {
        typeId: this.petInfo.typeId, // 驱虫类型id/疫苗种类id
        date: this.petInfo.date, // 驱虫日期/接种日期
        typeName: this.petInfo.typeName, // 驱虫名称/疫苗名称
        drugId: this.petInfo.drugId, // 驱虫药物id/疫苗id
        drugName: this.petInfo.drugName, // 驱虫药物名称/疫苗名称
        weight: this.petInfo.weight,
      };
    },
    handleInput(val, data) {
      console.log("🚀 ~ handleInput ~ val:", val);

      // 允许输入数字、小数点和以零开头的情况
      let cleanedValue = val && val.replace(/[^0-9.]/g, "");

      // 确保只有一个零开头
      if (
        cleanedValue.startsWith("0") &&
        cleanedValue.length > 1 &&
        cleanedValue[1] !== "."
      ) {
        cleanedValue = "0" + cleanedValue.slice(1).replace(/^0+/, "");
      }
      if (cleanedValue[0] === ".") {
        cleanedValue = "0" + cleanedValue.slice(0).replace(/^0+/, "0.");
      }
      if (cleanedValue === "0.0") {
        cleanedValue = "0";
      }
      // 确保只有一个小数点
      cleanedValue = cleanedValue.replace(/(\..*)\./g, "$1");

      // 保留一位小数
      cleanedValue = cleanedValue.replace(/(\.\d)\d*/, "$1");
      if (cleanedValue == 0) {
        uni.showToast({
          title: "体重不可输入0kg",
          icon: "none",
        });
        cleanedValue = "";
        return;
      }
      this.$nextTick(() => {
        console.log("体重啊=====>", cleanedValue, val);
        if (cleanedValue !== val) {
          this.healthData[this.healthType - 1].children.map((item) => {
            if (item.id === data.id) {
              item.selectedObj.weight = cleanedValue;
              this.selectedParams.weight = cleanedValue;
              item.name = cleanedValue;
            }
          });
        } else {
          if (Number(cleanedValue) > 1000) {
            uni.showToast({
              title: "最高可输入1000kg",
              icon: "none",
            });
            cleanedValue = "1000";
          }
          this.healthData[this.healthType - 1].children.map((item) => {
            if (item.id === data.id) {
              item.selectedObj.weight = cleanedValue;
              this.selectedParams.weight = cleanedValue;
              item.name = cleanedValue;
            }
          });
        }
      });
    },
    handleBlurInput(val, data) {
      this.healthData[this.healthType - 1].children.map((item) => {
        if (item.id === data.id) {
          item.selectedObj.weight = Math.round(val * 10) / 10;
          this.selectedParams.weight = Math.round(val * 10) / 10;
        }
      });
    },
    openSecondPop(item) {
      if (item.type === "weight") return;
      const list = this.healthData[this.healthType - 1]?.children;
      if (
        this.healthType == 2 &&
        item.type === "typeName" &&
        !this.healthData[1].children[1].name
      ) {
        uni.showToast({
          title: "请先选择类型",
          icon: "none",
        });
        return;
      }
      if (item.type === "date") {
        this.isShowDate = true;
        if (this.healthType == 4) {
          this.notLimit = true;
        }
      } else {
        this.isShowPop = true;
      }
      this.openPopType = item.type;
      this.openPopId = item.id;
      this.columns = item.options;
      this.secondName = item.label;
    },
    // 同步动态开关
    switchChange(bool) {
      if (
        this.recordDate == "" ||
        this.recordDate == null ||
        !this.recordDate
      ) {
        uni.showToast({
          title: "请选择记录时间",
          icon: "none",
        });
        this.dynamicSwitch = !bool;
        return;
      }
    },
    // 同步动态
    updateDynamic(completeParams) {
      const mall_last_search_address_obj = uni.getStorageSync(
        "mall_last_search_address_obj"
      );
      let lonQuery, latQuery, cityCodeQuery, provinceCodeQuery, areaCodeQuery;

      let { provinceCode, cityCode, countyCode, lon, lat } =
        mall_last_search_address_obj;

      let position_provinceCode = uni.getStorageSync("provinceCode");
      let position_cityCode = uni.getStorageSync("cityCode");
      let position_areaCode = uni.getStorageSync("adcode");
      let position_lon = uni.getStorageSync("lon");
      let position_lat = uni.getStorageSync("lat");

      if (
        position_provinceCode &&
        position_cityCode &&
        position_areaCode &&
        position_lon &&
        position_lat
      ) {
        lonQuery = uni.getStorageSync("lon");
        latQuery = uni.getStorageSync("lat");
        cityCodeQuery = uni.getStorageSync("cityCode");
        provinceCodeQuery = uni.getStorageSync("provinceCode");
        areaCodeQuery = uni.getStorageSync("adcode");
        console.log(
          "定位==>",
          lonQuery,
          latQuery,
          cityCodeQuery,
          provinceCodeQuery,
          areaCodeQuery
        );
      } else if (provinceCode && cityCode && countyCode && lon && lat) {
        lonQuery = lon;
        latQuery = lat;
        cityCodeQuery = cityCode;
        provinceCodeQuery = provinceCode;
        areaCodeQuery = countyCode;
        console.log(
          "选中地址==>",
          lonQuery,
          latQuery,
          cityCodeQuery,
          provinceCodeQuery,
          areaCodeQuery
        );
      }
      const params = {
        type: "DAILY", // 驱虫/疫苗/体重 DAILY
        petIds: [this.petInfo.petIds],
        title: this.healthData[this.healthType - 1].healthTitle,
        mark: this.healthEventMark[this.healthType - 1], // TI_ZHONG 体重  YI_MIAO 疫苗 QU_CHONG 驱虫
        itemId: this.itemId,
        recordTime: this.recordDate, // 记录时间/问诊时间
        // recordTimeV2: this.recordDate + ":00", // 记录时间/问诊时间
        desc: this.remark.trim(), // 备注
        imageUrl: this.fileList.map((item) => item.url)[0],
        syncFeedStatus: this.dynamicSwitch, // 是否同步动态
        commemorationDayStatus: false, // 是否同步纪念日
        location: {
          lon: lonQuery || "",
          lat: latQuery || "",
          provinceCode: provinceCodeQuery || "",
          cityCode: cityCodeQuery || "",
          areaCode: areaCodeQuery || "",
        },
      };
      const url = (this.fileList || [])?.map((item) => item.url);
      if (url && url.length > 0 && /^blob:/i.test(url[0])) {
        params.imageUrl = "";
      }

      if (this.healthType == 1) {
        params.vaccineInfo = {
          status: 1, //  0-未接种/1-已接种
          typeId: this.selectedParams.typeId, // 疫苗种类id
          typeName: this.selectedParams.typeName, // 疫苗种类名称
        };
      } else if (this.healthType == 2) {
        params.anthelminticInfo = {
          typeId: this.selectedParams.typeId, // 驱虫类型id
          typeName: this.selectedParams.typeName, // 驱虫类型名称
          drugId: this.selectedParams.drugId, // 驱虫药品名称id
          drugName: this.selectedParams.drugName, // 驱虫药品名称
        };
      } else if (this.healthType == 3) {
        params.weight = this.selectedParams.weight;
      }
      console.log("params==同步动态===>", params, this.selectedParams);
      UPDATE_DYNAMIC(params)
        .then((res) => {
          this.dynamicSwitch = res.data.remindPopUpStatus;
          console.log(
            "🚀 ~同步动态接口返回&传出参数 ~ res:",
            res,
            completeParams
          );
          this.$emit("complete", completeParams);
          this.close();
        })
        .catch((err) => {
          this.dynamicSwitch = false;
          console.log("🚀 ~ UPDATE_DYNAMIC ~ err:", err);
        });
    },
    // 根据记日常mark获取itemInfo---用于同步动态传参
    async getItemInfoByType(petType) {
      try {
        const params = {
          mark: this.healthEventMark[this.healthType - 1],
          // CAT 猫 DOG 狗 OTHER 其他
          petType: petType,
        };
        const res = await GET_ITEM_BYTYPE(params);
        // console.log("🚀 ~ getItemInfoByType ~ res:", res);
        this.itemId = res.data.id;
      } catch (error) {
        console.log("🚀 ~ getItemInfoByType ~ error:", error);
      }
    },
    close() {
      this.healthData = this.oldHealthData;
      this.remark = "";
      this.fileList = [];
      this.dynamicSwitch = false;
      this.notLimit = true;
      this.lang = 0;
      this.$emit("update:show", false);
    },
    // 文本域输入
    changInput(e) {
      let { value } = e.detail;
      this.remark = value.slice(0, 100).trim();
      this.lang = value.length > 100 ? 100 : value.length;
    },
    // 新增图片
    async afterRead(event) {
      try {
        this.upLoadDeletable = false;
        this.fileList.push({
          status: "uploading",
          message: "上传中",
          ...event.file,
        });
        const length = this.fileList.length;

        const res = await this._uploadFile(event.file);
        this.fileList.splice(length - 1, 1, {
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
    // 删除图片
    deletePic(event) {
      console.log("删除图片", event);
      this.fileList.splice(event.index, 1);
    },
    async handleComplete() {
      const params = {
        // status: null, // 0 未接种  1 已接种
        typeId: this.selectedParams.typeId, // 驱虫类型id/疫苗种类id
        date: this.recordDate, // 驱虫日期/接种日期
        typeName: this.selectedParams.typeName, // 驱虫名称/疫苗名称
        drugId: this.selectedParams.drugId, // 驱虫药物id/疫苗id
        drugName: this.selectedParams.drugName, // 驱虫药物名称/疫苗名称
        remark: this.remark.trim(),
        fileList: this.fileList.map((item) => item.url),
        dynamicSwitch: this.dynamicSwitch,
        weight: this.selectedParams.weight,
        specailMark: this.selectedParams.specailMark,
      };

      if (this.validateFile()) {
        return;
      } else {
        console.log("校验通过");
        // 宠物档案埋点
        if (this.healthyCode === "healthyCode") {
          action_report({
            action_name: this.buryName[this.healthType - 1],
            module_name: "Pet",
            extend: {
              // #ifdef H5
              user_id: this.$dsBridge.call("getUserId", "getUserId"),
              // #endif
              // #ifdef MP-WEIXIN
              user_id: uni.getStorageSync("storage_info").userId,
              // #endif
              pet_id: this.petInfo.petIds,
            },
          });
        }
        // 特殊时期不调接口
        if (this.healthType === 4) {
          const markList = ["TE_SHU_SHI_QI_FEEDING", "TE_SHU_SHI_QI_PRENATAL"];
          if (!markList.includes(params.specailMark)) {
            params.date = "";
          } else {
            params.date =
              params.date && dayjs(params.date).format("YYYY-MM-DD");
          }
          console.log("特殊时期不调接口======>", params);
          this.close();
          this.$emit("complete", params);
        } else {
          console.log("999999999999======params=====》", params);
          // 同步动态
          await this.updateDynamic(params);
        }
      }
    },
    // 二级弹窗传值
    handlePickerChange(data) {
      console.log("🚀 ~ handlePickerChange ~ data:", data);
      if ([1, 2].includes(this.healthType)) {
        this.getHealthMetadata(data.mark, "name");
      }
      if (this.openPopType === "typeId") {
        this.selectedParams.typeId = data.id;
        this.selectedParams.typeName = data.name;
        if (this.healthType === 4) {
          this.selectedParams.date = "";
          const list = ["TE_SHU_SHI_QI_FEEDING", "TE_SHU_SHI_QI_PRENATAL"];
          this.selectedParams.specailMark = data.mark;
          if (!list.includes(data.mark)) {
            // 关闭【开始时间】
            // 清除已选的时间

            this.healthData[this.healthType - 1].children.splice(1, 1);
          } else {
            if (this.healthData[3].children.length === 1) {
              this.healthData[3].children.push({
                label: "开始时间",
                name: "",
                id: "2",
                type: "date",
                selectedObj: {},
              });
            }
            if (data.mark == list[0]) {
              this.healthData[this.healthType - 1].children[1].label =
                "分娩时间";
              this.secondType = "deliveryTime";
              this.recordTime = this.petInfo.lactationRecordTime;
            } else if (data.mark == list[1]) {
              this.healthData[this.healthType - 1].children[1].label = "预产期";
              this.secondType = "expectedDate";
              this.recordTime = this.petInfo.expectedDateRecordTime;
            }
            this.selectedParams.date = "";
            this.healthData[3].children[1].name = "";
            this.recordDate = "";
            this.getSpecialPeriod("noInitDate");
          }
        } else if (this.healthType === 2) {
          // 驱虫 - 驱虫类型重新选择，驱虫品牌重置
          this.selectedParams.drugName = "";
          this.selectedParams.drugId = "";
          this.healthData[1].children[2].name = "";
          this.healthData[1].children[2].selectedObj = {};
        }
      } else if (this.openPopType === "typeName") {
        this.selectedParams.drugId = data.id;
        this.selectedParams.drugName = data.name;
      }
      this.healthData[this.healthType - 1].children.map((item) => {
        if (item.id === this.openPopId) {
          item.selectedObj = data;
          item.name = data.name;
        }
      });
    },
    // 时间选择
    handleDateChange(data) {
      this.recordDate = data;
      this.selectedParams.date = data;
      this.healthData[this.healthType - 1].children.map((item) => {
        if (item.id === this.openPopId) {
          item.selectedObj = data;
          item.name = data;
        }
      });
    },
    // 获取 宠物健康-元数据（疫苗/驱虫）
    getHealthMetadata(mark, dsc) {
      const params = {
        mark: mark, // 条目标记不能为空
        petType: this.petInfo.petType, //"DOG", // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
        sex: this.petInfo.sex, // "1", // 性别: 1-GG, -2MM
      };
      return GET_HEALTH_METADATA(params).then((res) => {
        if (dsc === "type") {
          this.healthData.forEach((healthItem, index) => {
            if (healthItem.healthType == this.healthType) {
              healthItem.children[1].options = res.data;
            }
          });
        } else if (dsc === "name") {
          if (this.healthType == 1) return;
          this.healthData.forEach((healthItem, index) => {
            if (healthItem.healthType == this.healthType) {
              healthItem.children[2].options = res.data;
            }
          });
          console.log("this.healthData=======>", this.healthData);
        }

        return res;
      });
    },
    // 获取 特殊时期
    getSpecialPeriod(initType) {
      const params = {
        // 类型 (YI_MIAO_LEI_XIN_V3-疫苗，YAN_YU_FANG_SHI-养育方式，TE_SHU_SHI_QI-特殊时期)
        mark: "TE_SHU_SHI_QI",
        petId: this.petInfo.petIds, // 宠物id
      };
      return GET_SPECIAL_PERIOD(params).then((res) => {
        if (this.petInfo.typeName || this.selectedParams.typeName) {
          this.healthData[this.healthType - 1].children[0].name =
            this.selectedParams.typeName ?? this.petInfo.typeName;
        }
        console.log("88888====>", this.selectedParams.date);
        if (
          (this.petInfo.date || this.selectedParams.date) &&
          initType !== "noInitDate"
        ) {
          const date = this.selectedParams.date || this.petInfo.date;
          this.healthData[this.healthType - 1].children[1].name =
            date && dayjs(date).format("YYYY-MM-DD");
        }
        console.log("特殊时期", res.data, this.petInfo);
        if (this.petInfo.sterilizationStatus == 2 && this.petInfo.sex == 2) {
          // 雌性 已绝育 不展示哺乳期和孕期 发情期
          // 要过滤掉的 mark 值
          const marksToFilterOut = [
            "TE_SHU_SHI_QI_PRENATAL",
            "TE_SHU_SHI_QI_FEEDING",
            "TE_SHU_SHI_QI_RUT",
          ];
          // 使用 filter 方法过滤掉具有特定 mark 的对象
          this.healthData[this.healthType - 1].children[0].options =
            res.data.filter((item) => !marksToFilterOut.includes(item.mark));
        } else if (this.petInfo.sex == 1) {
          //雄性 只展示非特殊时期和 发情期
          const marksToFilterOut = [
            "TE_SHU_SHI_QI_PRENATAL",
            "TE_SHU_SHI_QI_FEEDING",
          ];
          // 使用 filter 方法过滤掉具有特定 mark 的对象
          this.healthData[this.healthType - 1].children[0].options =
            res.data.filter((item) => !marksToFilterOut.includes(item.mark));
        } else {
          this.healthData[this.healthType - 1].children[0].options = res.data;
        }
        return this.healthData[this.healthType - 1].children[0].options;
      });
    },
    validateFile() {
      let toast = "";
      const data = this.healthData[this.healthType - 1].children;
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === "weight" && this.selectedParams.weight == 0) {
          this.selectedParams.weight = "";
          toast = "体重不可输入0kg";
          break;
        } else if (
          !data[i].name ||
          data[i].name == "" ||
          data[i].name == null
        ) {
          toast = data[i].label;
          break;
        }
      }
      console.log("validateFile", !!toast);

      if (this.healthType == 4) {
        if (toast == "分娩时间") {
          uni.showToast({
            title: `请选择${toast}`,
            icon: "none",
          });
          return !!toast;
        }
      } else {
        if (!!toast) {
          const title =
            this.healthType === 3
              ? this.selectedParams.weight == 0
                ? toast
                : `请输入${toast}`
              : `请选择${toast}`;
          uni.showToast({
            title: title,
            icon: "none",
          });
          return !!toast;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.health-pop {
  width: 100vw;
  //height: 100vh;

  .content {
    width: 100%;
    min-height: 700rpx;
    background: #f7f8fc;
    border-radius: 38rpx 38rpx 0rpx 0rpx;
    padding: 0 29rpx;
    box-sizing: border-box;
    overflow: hidden;
    .top-nav {
      width: 100%;
      height: 115rpx;
      border-radius: 38rpx 38rpx 0rpx 0rpx;
      @include flex();
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-style: normal;
      @include textfclaw(35rpx, #000, center, 38rpx);
      position: relative;
      .nav-close {
        background-color: #ecedf1;
        border-radius: 50%;
        @include absNormal(50rpx, 50rpx, 50%, 0rpx, auto, auto);
        transform: translateY(-50%);
        @include flex();
        .close {
          width: 31rpx;
          height: 31rpx;
        }
      }
    }
    .content-main {
      padding: 0 29rpx;
      margin: 19rpx 0 52rpx;
      background-color: #fff;
      border-radius: 23rpx;
      box-sizing: border-box;
      .content-main-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 31rpx 0;
        box-sizing: border-box;
        border-bottom: 0.5px solid #e6e6e6;
        font-size: 31rpx;
        color: #1f1f1f;
        .item-title {
          min-width: 100rpx;
        }
        .item-selected {
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .icon {
            font-size: 0;
            width: 23rpx;
            height: 23rpx;
            margin-left: 4rpx;
          }
        }
        .item-type {
          display: flex;
          align-items: center;
          justify-content: center;
          .unit {
            margin-left: 10rpx;
          }
        }
      }
      .no-border {
        border-bottom: none !important;
      }

      .content-remark {
        width: 100%;
        padding: 31rpx 0;
        box-sizing: border-box;
        border-top: 0.5px solid #e6e6e6; // rgba(230, 230, 230, 0.8);
        font-size: 31rpx;
        color: #1f1f1f;
        .remark-textare {
          margin-top: 31rpx;
        }
        .textarea {
          padding: 0 !important;
          width: 100%;
          height: 135rpx;
          line-height: 40rpx;
        }
        ::v-deep .remark-hint {
          font-size: 27rpx;
          color: #999;
        }
        .remark-count {
          font-family: PingFangSC, PingFang SC;
          font-style: normal;
          margin-top: 23rpx;
          @include textfclaw(27rpx, #999, right, 38rpx);
        }
      }
      .upload-box {
        width: 100%;
        margin-top: 30rpx;
        .upload {
          width: 154rpx;
          height: 154rpx;
          background: #ffffff;
          border-radius: 12rpx;
          border: 2rpx solid #f0f0f0;
          @include flex();
          flex-direction: column;
          .upload-img {
            width: 63rpx;
            height: 63rpx;
            font-size: 0;
          }
          .upload-txt {
            font-family: PingFangSC, PingFang SC;
            font-style: normal;
            @include textfclaw(23rpx, #999, center, 33rpx);
          }
        }
      }
    }
    .noborder {
      border-bottom: none !important;
      border-top: 0.5px solid #e6e6e6;
    }
    .bottom {
      padding: 0 10rpx;
      margin-bottom: 75rpx;
      .bottom-btn {
        width: 100%;
        height: 85rpx;
        background: #fee900;
        border-radius: 40rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-style: normal;
        @include textfclaw(31rpx, #1f1f1f, center, 85rpx);
      }
    }
    .bottomMargin {
      margin-top: 177rpx !important;
    }
  }
  ::v-deep .u-toolbar {
    height: 114rpx !important;
    border-bottom: 0.5px solid #e6e6e6;
    margin: 0 38rpx;
  }
  ::v-deep .u-popup__content {
    border-radius: 38rpx 38rpx 0rpx 0rpx;
  }
  ::v-deep .u-input__content__field-wrapper__field {
    line-height: 20px !important;
  }
}
</style>
