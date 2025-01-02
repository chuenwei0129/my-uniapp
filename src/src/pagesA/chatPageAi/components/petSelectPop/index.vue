<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
    :safeAreaInsetBottom="false"
  >
    <view class="petPop">
      <view class="header">
        <view class="headPng"></view>
        <view class="close-icon" @click="handleCancel"></view>
        <view class="title">选择宠物</view>
      </view>
      <view class="options-wrapper">
        <view class="select">
          <view class="stitle">
            <view class="stitle-left">
              <view class="stitle">选择宠物</view>
              <view class="xin">*</view>
            </view>
            <view class="stitle-right">
              <view class="stext" @click="handleAddPetInfo()">+新增宠物</view>
            </view>
          </view>
          <view class="pet-list">
            <view v-for="(item, index) in petList" :key="index">
              <view
                class="bg"
                :class="index == selectIndex ? 'bg bg-check' : 'bg'"
              >
                <view class="contents" @click="handleSelectPet(index)">
                  <image
                    class="head"
                    :src="item.avatarUrl"
                    mode="scaleToFill"
                  />
                  <view class="right">
                    <view class="name-sex">
                      <view class="name">{{ item.nickName }}</view>
                      <view
                        class="sex-man iconfont icon-man"
                        v-if="item.sex == 1"
                      ></view>
                      <view
                        class="sex-woman iconfont icon-woman"
                        v-if="item.sex == 2"
                      ></view>
                    </view>
                    <view class="categoryName">{{ item.categoryName }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- {{ keyboardHeight }} -->
        <view v-for="(item, index) in types" :key="index">
          <view class="title-bg">
            <image class="icon" :src="item.icon"></image>
            <view class="title">{{ item.title }}</view>
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

          <view v-if="index == typesEnum.CurrentWeight">
            <view class="widget">
              <view class="diseaseDesc-wight">
                <u--input
                  placeholder="请输入体重"
                  v-model="weightData"
                  class="input1"
                  :customStyle="{ width: '354rpx', height: '62rpx' }"
                  placeholderStyle="fontSize: 25rpx;color: #666666;fontWeight: 400;"
                  :cursorSpacing="20"
                  :formatter="formatter"
                ></u--input>
                <view class="unit">kg</view>
              </view>

              <view
                class="widget-last"
                @click="handleGetWeight(sheetData.petInformation.weight)"
                v-if="
                  sheetData.petInformation.weight &&
                  sheetData.petInformation.weight != 0
                "
              >
                <view class="text">
                  {{ `使用上次：${sheetData.petInformation.weight}kg` }}</view
                >
              </view>
            </view>
          </view>
        </view>

        <!-- <view style="width: 750rpx; height: 460rpx; color: #ffffff"></view> -->
      </view>

      <view class="footers">
        <view class="btn ok" v-if="allowSubmit" @click="handleSave">
          <view class="text ok">下一步</view>
        </view>

        <view class="btn" v-else @click="handleSave">
          <view class="text">下一步</view>
        </view>
      </view>
    </view>

    <u-datetime-picker
      :show="isShowDatePicker"
      v-model="value1"
      mode="date"
      title="出生日期"
      :minDate="-1262332800000"
      :maxDate="new Date().getTime()"
      confirmColor="#14D0B4"
      confirmText="确定"
      @confirm="handleConfirm($event, 'date')"
      @cancel="handleClose"
      :closeOnClickOverlay="true"
      @close="handleClose"
    ></u-datetime-picker>

    <!-- <PhotoPop :show.sync="photoShow" @event="handlePhoto" /> -->

    <PetInfoPop
      :isOpen.sync="isPetInfoPop"
      :categoryId="categoryId"
      :categoryName="categoryName"
      @confirm="handleSPetInfoNewPet"
      @close="handlePetInfoPopClose"
      @clearcategory="handlePetInfoPopClearcategory"
      :inquiryType="petInfoPopInquiryType"
    />

    <DiseaseDescPop
      :isOpen.sync="isDiseaseDescPop"
      :petId="petDesc.petId"
      :petDesc="petDesc"
      :resourceId="resourceId"
      :resourceType="resourceType"
      :selectPetInfo="selectPetInfo"
      inquiryType="QUICK"
      @close="handleDiseaseDescPopClose"
    />
  </u-popup>
</template>

<script>
import { mapState } from "vuex";
// import PhotoPop from "@/pagesD/petInfo/components/photoPop.vue";
import { BASR_URL } from "@/utils/http";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import PetInfoPop from "../petInfoPop/index.vue";
import DiseaseDescPop from "../diseaseDescPop/index.vue";
import { GET_PET_LIST } from "@/api/index";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    petList: {
      type: Array,
      default () {
        return [];
      },
    },
    selectPetId: {
      type: String,
      default: "",
    },
    inquiryType: {
      type: String,
      default: "",
    },
    categoryName: {
      type: String,
      default: "",
    },
    categoryId: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      goMessage: false,
      photoShow: false,
      typesEnum: {
        VaccineSituation: 0, //疫苗情况
        IsItDeworming: 1, //是否驱虫
        CurrentWeight: 2, //当前体重
      },

      types: [
        {
          icon: "https://image.henhenchina.com/61ee0fe4f58112000178d924/bd32bada6781465bb272e9c3a4e960c8.png",
          title: "疫苗情况",
          required: true,
          tagId: 0,
          dataList: [
            {
              tagName: "已接种",
              tagId: 1,
              checked: false,
            },
            {
              tagName: "未接种",
              tagId: 2,
              checked: false,
            },
            {
              tagName: "接种不全",
              tagId: 3,
              checked: false,
            },
            {
              tagName: "接种不详",
              tagId: 4,
              checked: false,
            },
          ],
        },
        {
          icon: "https://image.henhenchina.com/61ee0fe4f58112000178d924/baec4627e7ee4b608a1d555810edcf42.png",
          title: "是否驱虫",
          required: true,
          tagId: 0,
          dataList: [
            {
              tagName: "定时驱虫",
              tagId: 1,
              checked: false,
            },
            {
              tagName: "未定时驱虫",
              tagId: 2,
              checked: false,
            },
            {
              tagName: "未做驱虫",
              tagId: 3,
              checked: false,
            },
          ],
        },
        {
          icon: "https://image.henhenchina.com/61ee0fe4f58112000178d924/cbdc9ea160c146739877124ca3ffb2af.png",
          title: "当前体重",
          required: true,
          dataList: [],
        },
      ],

      diseaseList: [],

      typesBtnCheck: [-1, -1, -1, -1, -1, -1],

      upLoadDeletable: true,
      diseaseImgs: [],
      illnessDesc: "",
      weightData: null,

      sheetData: "",

      doctorUserId: "",
      groupId: "",

      checkboxValue: uni.getStorageSync("agreement") ? [""] : [],

      petListTest: [],

      checked: true,
      selectIndex: "-1",
      enterType: "",
      isPetInfoPop: false,
      isDiseaseDescPop: false,
      resourceId: "",
      resourceType: "",
      selectPetItem: {},
      petDesc: {},
      formatter: (value) => value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"),
    };
  },

  components: {
    // PhotoPop,
    DiseaseDescPop,
    PetInfoPop,
  },
  computed: {
    // ...mapState(["userSelectedPetId"]),
    ...mapState({
      userInfo: (state) => state.userInfo,
      userSelectedPetId: (state) => state.userSelectedPetId,
    }),
    allowSubmit () {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d{1,2})?$/;
      const yuAllow = this.types[0].tagId;
      const quAllow = this.types[1].tagId;
      const weightAllow = reg.test(this.weightData) && this.weightData <= 1000;
      const selectIndexAllow = this.selectIndex != "-1";
      return !!(
        selectIndexAllow &&
        yuAllow &&
        quAllow &&
        this.weightData &&
        weightAllow
      );
    },
  },
  onLoad (options) { },
  onShow () { },
  onReady () { },
  watch: {
    isOpen: {
      handler (newV, oldV) {
        console.log(newV, "-", oldV);
        console.log("this.petList-", this.petList);
        console.log("this.selectPetId-", this.selectPetId);
        console.log("this.inquiryType-", this.inquiryType);
        this.petListTest = [this.petList[0]];
        this.goMessage = false;
        if (newV == true) {
          this.getData();
        } else {
          this.types[0].tagId = "";
          this.types[1].tagId = "";
          this.types[2].tagId = "";
          this.weightData = "";
        }
      },
      immediate: true,
    },
  },
  mounted () {
    console.log("diseaseDescPop mounted mounted mounted  ", this.inquiryType);
  },
  methods: {
    handleOpen () {
      console.log("handleOpen this.selectIndex ", this.selectIndex);
    },

    getData () {
      console.log("mounted this.selectIndex ", this.selectIndex);
      console.log("mounted this.petList ", this.petList);
      if (this.petList.length == 1) {
        this.selectIndex = 0;
        this.lastDetail(this.petList[0].id);
      } else {
        // const ind = this.petList.findIndex((p) => p.id == this.selectPetId);
        // this.selectIndex = ind;
        // this.lastDetail(this.selectPetId);
      }
    },
    handleOpen () { },
    handleCancel () {
      console.log("handleCancel == ");
      this.close();
    },
    close () {
      this.goMessage = false;
      this.selectIndex = "-1";
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },

    handleSelectPet (index) {
      this.selectIndex = index;
      // console.log('this.selectIndex ',this.selectIndex,this.petList[this.selectIndex])

      this.lastDetail(this.petList[this.selectIndex].id);
    },

    isCheck (index, item, tagId) {
      return item.tagId == tagId;
    },

    handleUploadImg (imgs) {
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
    deletePic (event) {
      console.log("删除图片", event);
      this.diseaseImgs.splice(event.index, 1);
    },
    //新增图片
    async afterRead (event) {
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

    _uploadFile (file) {
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

    handleGetWeight (weight) {
      this.weightData = weight;
    },

    //上一条问诊单详情
    async lastDetail (petId) {
      const res = await GET_IN_SERVICE_LAST({ petId: petId });
      this.sheetData = res.data;
      console.log("this.sheetData = ", this.sheetData);
      if (this.sheetData) {
        this.types[0].tagId = this.sheetData.petInformation.expelInsects;
        this.types[1].tagId = this.sheetData.petInformation.vaccine;
        // this.weightData = this.sheetData.petInformation.weight
      } else {
        // this.types[0].tagId = ''
        // this.types[1].tagId = ''
        // this.weightData = ''
      }
    },

    handleCheckBtn (index, item, tagId) {
      item.tagId = tagId;
      console.log(" this.types: ", this.types);
    },

    handleMessage () { },

    handleSave () {
      if (
        this.weightData < 0 ||
        this.weightData == 0 ||
        this.weightData > 1000
      ) {
        uni.showToast({
          title: "输入的体重必须大于0 小于1000",
          icon: "none",
        });
        return;
      }

      if (this.selectIndex == "-1") {
        return;
      }

      console.log("1 this.types: ", this.types);

      this.petDesc.petId = this.petList[this.selectIndex].id;
      this.petDesc.vaccine = this.types[0].tagId;
      this.petDesc.expelInsects = this.types[1].tagId;
      this.petDesc.weight = this.weightData;
      console.log(" this.petDesc: ", this.petDesc);
      const selected = this.petList[this.selectIndex];
      // this.$emit("confirm", selected, petInfo);

      this.isDiseaseDescPop = true;
    },

    handleAddPetInfo () {
      if (this.inquiryType == "AI") {
        // this.$emit("update:isOpen", false);
        // this.$emit("close", false, "AI");
        this.isPetInfoPop = true;
      } else {
        uni.navigateTo({
          url: `/pagesD/petInfo/index?type=taskdesc&transparentTopBar=1`,
        });
      }
    },

    handlePetInfoPopClose () {
      this.$emit("closePetInfoPop");
    },

    handlePetInfoPopClearcategory () {
      this.$emit("closePetInfoPop");
    },

    async handleSPetInfoNewPet (petInfo) {
      console.log("handleSPetInfoNewPet petInfo ", petInfo);
      // this.selectPetItem = item;
      let petId = petInfo.petId;
      //清除已经填写的数据
      this.types[0].tagId = "";
      this.types[1].tagId = "";
      this.types[2].tagId = "";
      this.weightData = "";

      this.$emit("closePetInfoPop");

      try {
        const res = await GET_PET_LIST({
          userId: this.userInfo.userId,
        });
        console.log("chatPageAi : ", res);
        if (!res.data.length) {
          console.log("no pet");
        } else {
          // 展开选择宠物疾病描述逻辑
          this.$emit("setPetList", res.data);
          console.log("res.data ", res.data);
          console.log("this.petList ", this.petList);
          // setTimeout(() => {
          const ind = res.data.findIndex((p) => p.id == petId);
          console.log("this.ind ", ind);
          this.selectIndex = ind;
          this.lastDetail(petId);
          // }, 500)
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleDiseaseDescPopClose () {
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
