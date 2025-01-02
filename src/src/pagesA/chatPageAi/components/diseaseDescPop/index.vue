<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
  >
    <view class="petPop">
      <view class="header">
        <view class="headPng"></view>
        <view class="back-icon" @click="handleBack"></view>
        <view class="close-icon" @click="handleCancel"></view>
        <view class="title">症状描述</view>
      </view>
      <scroll-view class="options-wrapper" scroll-y="true">
        <view v-for="(item, index) in types" :key="index">
          <view class="title-bg">
            <image class="icon" :src="item.icon"></image>
            <view class="title">{{ item.title }}</view>
            <view class="title-dx" v-if="index == typesEnum.Symptom"
              >（多选）</view
            >
            <view class="xin" v-if="item.required">*</view>
          </view>

          <view class="btns" v-if="types[index].dataList.length">
            <view
              class="btn-for"
              v-for="(data, j) in types[index].dataList"
              :key="j"
            >
              <view
                :class="[
                  isCheck(index, item, data.tagId) ? 'btn-check' : 'btn',
                ]"
                @click="handleCheckBtn(index, item, data.tagId)"
              >
                <view class="name">{{ data.tagName }}</view>
              </view>
            </view>
          </view>

          <view v-if="index == typesEnum.DescribeCondition">
            <view class="desca">
              <u-textarea
                height="135rpx"
                width="673rpx"
                v-model="illnessDesc"
                placeholder="请描述爱宠病情，2-500字。"
                maxlength="500"
                count
                :showConfirmBar="false"
              ></u-textarea>
            </view>
          </view>

          <view v-if="index == typesEnum.SymptomImages">
            <view class="disease-img">
              <!-- <view class="quTitle">上传症状图片</view> -->
              <view
                style="
                  height: 33rpx;
                  font-size: 23rpx;
                  font-weight: 400;
                  color: #2dce80;
                  line-height: 33rpx;
                  margin-bottom: 38rpx;
                "
                >请提前上传图片，以便医生给您更好的建议</view
              >
              <u-upload
                :fileList="diseaseImgs"
                @afterRead="afterRead"
                @delete="deletePic"
                :deletable="upLoadDeletable"
                name="1"
                :maxCount="9"
                :width="86"
                :height="86"
              >
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/zhichong/diseaseDesc/upload.png"
                  mode="widthFix"
                  style="width: 172rpx; height: 172rpx"
                ></image>
              </u-upload>
              <view class="last"></view>
            </view>
          </view>
        </view>
        <view style="height: 46rpx; color: #ffffff"></view>
      </scroll-view>
    </view>

    <!-- <view class="footers">
      <view class="btn" @click="handleConfirm">
        <view class="text">保存</view>
      </view>
    </view> -->

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
        </view>
      </view>
      <view
        class="messageText"
        :class="!!allowSubmit ? 'allowMessage' : ''"
        @click="handleMessage"
      >
        开始咨询
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </view>

    <u-datetime-picker
      :show="isShowDatePicker"
      v-model="value1"
      mode="date"
      title="出生日期"
      :minDate="-1262332800000"
      :maxDate="new Date().getTime()"
      confirmColor="#2DCE80"
      confirmText="确定"
      @confirm="handleConfirm($event, 'date')"
      @cancel="handleClose"
      :closeOnClickOverlay="true"
      @close="handleClose"
    ></u-datetime-picker>

    <!-- <PhotoPop :show.sync="photoShow" @event="handlePhoto" /> -->
  </u-popup>
</template>

<script>
import { mapState } from "vuex";
// import PhotoPop from "@/pagesD/petInfo/components/photoPop.vue";
import { getTag, getPetDetail, submitMessageQuick } from "@/api/base";
import { GET_PET_DETAIL } from "@/api/index";
import { BASR_URL } from "@/utils/http";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    petId: {
      type: String,
      default: "",
    },
    petDesc: {
      type: Object,
    },
    inquiryType: {
      type: String,
      default: "",
    },
    resourceId: {
      type: String,
      default: "",
    },
    resourceType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      scrollViewTop: 0,
      goMessage: false,
      photoShow: false,
      typesEnum: {
        Symptom: 0, //症状
        DescribeCondition: 1, //描述病情
        SymptomDuration: 2, //症状时长
        SymptomImages: 3, //症状图片
      },

      types: [
        {
          icon: "https://image.henhenchina.com/61ee0fe4f58112000178d924/f2f04f2af5e6469eb6b35ff559f1c519.png",
          title: "症状",
          required: true,
          tagId: [],
          dataList: [],
        },
        {
          icon: "https://image.henhenchina.com/61ee0fe4f58112000178d924/9550b965043c48c98fc5d2b2ce09dc7f.png",
          title: "描述病情",
          required: true,
          dataList: [],
        },
        {
          icon: "https://image.henhenchina.com/61ee0fe4f58112000178d924/96db8325a9e14c2e9e9b25ceaac17627.png",
          title: "症状出现时长",
          required: false,
          tagId: 0,
          dataList: [
            {
              tagName: "小于3天",
              tagId: "小于3天",
              checked: false,
            },
            {
              tagName: "3-7天",
              tagId: "3-7天",
              checked: false,
            },
            {
              tagName: "1-3周",
              key: "1-3周",
              checked: false,
            },
            {
              tagName: "3周以上",
              tagId: "3周以上",
              checked: false,
            },
          ],
        },
        {
          icon: "https://image.henhenchina.com/61ee0fe4f58112000178d924/bcae769f5c25466fa17d3f7a3011015e.png",
          title: "症状图片",
          required: false,
          dataList: [],
        },
      ],

      diseaseList: [],

      typesBtnCheck: [-1, -1, -1, -1, -1, -1],

      upLoadDeletable: true,
      diseaseImgs: [],
      illnessDesc: "",

      petDetailData: null,

      weightData: null,

      sheetData: "",

      doctorUserId: "",
      groupId: "",

      checkboxValue: uni.getStorageSync("agreement") ? [""] : [],
    };
  },

  components: {
    // PhotoPop,
  },
  computed: {
    ...mapState(["userSelectedPetId"]),
    allowSubmit() {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d{1,2})?$/;
      const tagAllow = this.types[this.typesEnum.Symptom].tagId.length;
      return !!(tagAllow && this.illnessDesc && this.checkboxValue.length);
    },
  },
  onLoad(options) {},
  onShow() {},
  onReady() {},
  watch: {
    isOpen: {
      handler(newV, oldV) {
        console.log(newV, "-", oldV);
        console.log("this.petId-", this.petId);
        this.goMessage = false;
        if (newV == true) {
          this.getData();
        } else {
          this.types[0].tagId = [];
          this.types[1].tagId = "";
          this.types[2].tagId = "";
          this.types[3].tagId = "";
          this.illnessDesc = "";
          this.weightData = "";
          this.diseaseImgs = [];
        }
      },
      immediate: true,
    },
  },
  mounted() {
    console.log(
      "diseaseDescPop mounted mounted mounted  ",
      this.inquiryType,
      this.petId
    );

    // uni.onKeyboardHeightChange((res) => {
    //   if (res.height) {
    //     this.scrollViewTop = 350;
    //   } else {
    //     this.scrollViewTop = 0;
    //   }
    // });
  },
  methods: {
    // handleScrollViewToTop() {
    //   this.scrollViewTop = 0;
    // },
    onscroll({ target: { scrollTop } }) {
      // this.scrollViewTop = scrollTop;
    },
    getData() {
      this.lastDetail();
      this.petDetail();
      this._getDiseaseTag();
    },
    handleOpen() {},
    handleCancel() {
      this.close();
      this.$emit("close", true);
    },
    handleBack() {
      this.goMessage = false;
      this.$emit("update:isOpen", false);
    },
    close() {
      this.goMessage = false;
      this.$emit("update:isOpen", false);
      this.$emit("close", true);
    },

    isCheck(index, item, tagId) {
      if (this.typesEnum.Symptom == index) {
        return item.tagId.indexOf(tagId) > -1;
      } else {
        return item.tagId == tagId;
      }
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

    // 获取病症分类
    async _getDiseaseTag() {
      try {
        const { data } = await getTag({
          bizType: "CONSULTATION_SYMPTOM",
        });
        if (data.ALL) {
          console.log("data.ALL ", data.ALL);
          this.diseaseList = data.ALL;
          this.types[this.typesEnum.Symptom].dataList = this.diseaseList;
        }
      } catch (e) {
        console.error("获取病症分类", e);
      }
    },

    //获取宠物详情
    async petDetail() {
      console.log(" this.petId: ", this.petId);
      const res = await GET_PET_DETAIL({ petId: this.petId });
      this.petDetailData = res.data;
      console.log(" this.petDetailData: ", this.petDetailData);
    },

    //上一条问诊单详情
    async lastDetail() {
      const res = await GET_IN_SERVICE_LAST({ petId: this.petId });
      this.sheetData = res.data;
    },

    handleCheckBtn(index, item, tagId) {
      console.log("handleCheckBtn: ", item, tagId);
      if (this.typesEnum.Symptom == index) {
        let idx = item.tagId.indexOf(tagId);
        if (idx == -1) {
          item.tagId.push(tagId);
        } else {
          item.tagId.splice(idx, 1);
        }
      } else {
        item.tagId = tagId;
      }
      console.log(" this.types: ", this.types);
    },

    getSymptomType() {
      let tab = [];
      let tagIds = this.types[this.typesEnum.Symptom].tagId;
      let dataList = this.types[this.typesEnum.Symptom].dataList;
      if (tagIds.length) {
        for (let index = 0; index < tagIds.length; index++) {
          const tid = tagIds[index];
          for (let j = 0; j < dataList.length; j++) {
            const dlist = dataList[j];
            if (dlist.tagId == tid) {
              tab.push({ tagId: dlist.tagId, tagName: dlist.tagName });
            }
          }
        }
      }
      return tab;
    },

    handleMessage() {
      if (this.goMessage) {
        return;
      }
      this.goMessage = true;
      try {
        var that = this;

        if (this.allowSubmit) {
          const tagAllow = this.getSymptomType();
          const timeAllow = this.types[this.typesEnum.SymptomDuration].tagId;
          let petType = "OTHER";
          if (this.petDetailData.petCategoryId === 1) {
            petType = "CAT";
          }
          if (this.petDetailData.petCategoryId === 50) {
            petType = "DOG";
          }
          const params = {
            // couponNo: this.couponNo,
            resourceId: this.resourceId,
            resourceType: this.resourceType,
            doctorUserId: this.doctorUserId,
            groupId: this.groupId,
            preFilledInfo: {
              gender: this.petDetailData.sex,
              petId: this.petId,
              age: this.petDetailData.guardTime,
              ...this.petDetailData,
              petType,
              vaccine: this.petDesc.vaccine,
              expelInsects: this.petDesc.expelInsects,
              illnessDesc: this.illnessDesc,
              weight: this.petDesc.weight,
            },
            symptomType: tagAllow,
            source: "WECHAT_XCX",
            lon: uni.getStorageSync("lon") || "", //经度
            lat: uni.getStorageSync("lat") || "", //维度
          };

          console.log("this.petDesc ", this.petDesc);
          console.log("params ", params);

          if (timeAllow) {
            params.preFilledInfo.symptomDuration = timeAllow;
          }

          if (this.diseaseImgs.length > 0) {
            params.preFilledInfo.symptomImags = this.handleUploadImg(
              this.diseaseImgs
            );
          }

          params.entrance = "AI";

          if (this.inquiryType == "QUICK") {
            submitMessageQuick(params).then((res) => {
              // that.$uma.trackEvent("pet_pre_ask", {
              //   user_id: uni.getStorageSync("userId"),
              //   type: "QUICK",
              // });
              uni.navigateTo({
                url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
                  res.data
                )}&fromOrigin=new&inquiryType=QUICK`,
              });
              this.close();
              this.goMessage = true;
            });
          } else {
            // submitMessage(params).then((res) => {
            //   that.$uma.trackEvent("pet_pre_ask", {
            //     user_id: uni.getStorageSync("userId"),
            //     type: "EXPERT",
            //   });
            //   uni.redirectTo({
            //     url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
            //       res.data
            //     )}&fromOrigin=new&inquiryType=EXPERT`,
            //   });
            // });
          }
        }
      } catch (error) {
        console.error("handleMessage", error);
        this.goMessage = false;
      }
    },

    checkboxChange(n) {
      if (n.length) {
        uni.setStorageSync("agreement", true);
      }
      this.checkboxValue = n.length ? [""] : [];
    },
    goAgreement() {
      uni.navigateTo({
        url: "/pagesA/webView/index?route=/meow-interface/html/oxygen-pet.html&type=jump&title=隐私协议",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
