<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
    @touchmove.stop.prevent
  >
    <view class="petPop">
      <view class="header">
        <view class="title">完善宠物档案</view>
        <view class="close-icon" @click="handleCancel"></view>
      </view>

      <view class="line-up"></view>

      <view class="petType">
        <view v-for="(item, index) in petTypes" :key="index">
          <view class="big-bg" @click="handleCheckNum(index)">
            <img
              class="up-bg-check"
              v-if="index == checkNum"
              :src="item.imgCheck"
            />
            <img class="up-bg" v-else :src="item.img" />
            <view
              class="name"
              :class="[index == checkNum ? 'name c-color' : 'name']"
              >{{ item.name }}</view
            >
            <view
              class="nameEn"
              :class="[index == checkNum ? 'nameEn c-color' : 'nameEn']"
              >{{ item.nameEn }}</view
            >
          </view>
        </view>
      </view>
      <view class="petInfos">
        <view class="info-bg">
          <view class="title">头像</view>
          <image
            class="head"
            @click="handleHead()"
            mode="aspectFill"
            :src="[
              petInfo.avatarUrl.length
                ? petInfo.avatarUrl
                : 'https://image.henhenchina.com/61ee0fe4f58112000178d924/b094eb2c613f4fa58c4c19213b2c4aed.png',
            ]"
          />
        </view>

        <img
          class="line-c"
          src="https://image.henhenchina.com/61ee0fe4f58112000178d924/b0cd6ec75fcd4972b61623bb9d4651fb.png"
        />

        <view class="info-bg">
          <view class="title">昵称</view>
          <!-- <view v-if="nickname != null"> -->
          <input
            class="input input1"
            maxlength="10"
            placeholder-class="placeholder"
            v-model="petInfo.nickName"
            placeholder="请输入"
          />
        </view>

        <img
          class="line-c"
          src="https://image.henhenchina.com/61ee0fe4f58112000178d924/b0cd6ec75fcd4972b61623bb9d4651fb.png"
        />

        <view class="info-bg">
          <view class="title">性别</view>
          <view class="content-right">
            <!-- <view class="iconfont" @click="handleGender(2)" :class="[
              2 == petInfo.sex ? 'icon-radioSelect' : 'icon-radioNormal',
            ]"></view> -->
            <view
              class="content-bg"
              :class="[1 == petInfo.sex ? 'content-bg-check' : '']"
              @click="handleGender(1)"
            >
              <view
                class="content-text"
                :class="[1 == petInfo.sex ? 'content-text-check' : '']"
              >
                弟弟
              </view>
            </view>
            <view style="width: 15rpx"></view>

            <view
              class="content-bg"
              :class="[2 == petInfo.sex ? 'content-bg-check' : '']"
              @click="handleGender(2)"
            >
              <view
                class="content-text"
                :class="[2 == petInfo.sex ? 'content-text-check' : '']"
              >
                妹妹
              </view>
            </view>
          </view>
        </view>

        <view class="info-bg" v-if="2 == checkNum">
          <view class="title">种类</view>
          <view class="content-right">
            <view
              class="iconfont"
              @click="handleSpecies(214)"
              :class="[
                214 == species ? 'icon-radioSelect' : 'icon-radioNormal',
              ]"
            ></view>
            <view
              class="content-text"
              @click="handleSpecies(214)"
              :class="[214 == species ? 'content-text-check' : '']"
            >
              水族
            </view>
            <view
              class="iconfont"
              @click="handleSpecies(460)"
              :class="[
                460 == species ? 'icon-radioSelect' : 'icon-radioNormal',
              ]"
            ></view>
            <view
              class="content-text"
              @click="handleSpecies(460)"
              :class="[460 == species ? 'content-text-check' : '']"
            >
              爬行
            </view>
            <view
              class="iconfont"
              @click="handleSpecies(835)"
              :class="[
                835 == species ? 'icon-radioSelect' : 'icon-radioNormal',
              ]"
            ></view>
            <view
              class="content-text"
              @click="handleSpecies(835)"
              :class="[835 == species ? 'content-text-check' : '']"
            >
              其他
            </view>
          </view>
        </view>

        <view class="info-bg">
          <view class="title">品种</view>
          <view class="content-right" @click="handleBreed()">
            <view class="content-text"
              >{{
                petInfo.categoryName == "" ? "请选择" : petInfo.categoryName
              }}
            </view>
            <img
              class="right-icon"
              src="https://image.henhenchina.com/61ee0fe4f58112000178d924/44d8c65018504f08a35b89f18768a23d.png"
            />
          </view>
        </view>

        <view class="info-bg">
          <view class="title">出生日期</view>
          <view class="content-right" @click="handleBirth()">
            <view class="content-text"
              >{{ petInfo.birth == "" ? "请选择" : petInfo.birth }}
            </view>
            <img
              class="right-icon"
              src="https://image.henhenchina.com/61ee0fe4f58112000178d924/44d8c65018504f08a35b89f18768a23d.png"
            />
          </view>
        </view>

        <view class="info-bg" v-if="2 != checkNum">
          <view class="title">是否绝育</view>
          <view class="content-right">
            <view
              class="content-bg"
              :class="[
                2 == petInfo.sterilizationStatus ? 'content-bg-check' : '',
              ]"
              @click="handleSterilization(2)"
              style="width: 115rpx"
            >
              <view
                class="content-text"
                :class="[
                  2 == petInfo.sterilizationStatus ? 'content-text-check' : '',
                ]"
              >
                是
              </view>
            </view>
            <view style="width: 15rpx"></view>

            <view
              class="content-bg"
              :class="[
                1 == petInfo.sterilizationStatus ? 'content-bg-check' : '',
              ]"
              @click="handleSterilization(1)"
              style="width: 115rpx"
            >
              <view
                class="content-text"
                :class="[
                  1 == petInfo.sterilizationStatus ? 'content-text-check' : '',
                ]"
              >
                否
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="footers">
      <view class="btn ok" v-if="hasValidate()" @click="handleSave">
        <view class="text ok">保存</view>
      </view>

      <view class="btn" v-else>
        <view class="text">保存</view>
      </view>
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
import { GET_PET_DETAIL, EDIT_PET_DETAIL, ADD_PET_DETAIL } from "@/api/index";
import { formatTime } from "@/utils/index.js";
import { BASR_URL } from "@/utils/http";
// import PhotoPop from "@/pagesD/petInfo/components/photoPop.vue";
import { tr } from "@dcloudio/vue-cli-plugin-uni/packages/postcss/tags";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
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
  data() {
    return {
      checkNum: 0,
      //"https://image.henhenchina.com/198967560689463296/3ab714cbda694bd2a0eeb838e63de167.jpeg",
      species: -1,
      petInfo: {
        nickName: "",
        categoryId: "",
        categoryName: "",
        birth: "",
        sex: "",
        // sexName: "",
        sterilizationStatus: "0",
        // sterilizationStatusDesc: "",
        avatarUrl: "",
      },

      petTypes: [
        {
          img: "https://image.henhenchina.com/61ee0fe4f58112000178d924/bdf38bcb4e8c4184b9b0453224f77518.png",
          imgCheck:
            "https://image.henhenchina.com/61ee0fe4f58112000178d924/01f1c23e261c428ebd1a04d939c3aab2.png",
          name: "猫咪",
          nameEn: "CAT",
        },
        {
          img: "https://image.henhenchina.com/61ee0fe4f58112000178d924/eed0fe90a4314b8c8c1cae37ff5fc798.png",
          imgCheck:
            "https://image.henhenchina.com/61ee0fe4f58112000178d924/377a00c860814a6c8a16e7fe25e7be51.png",
          name: "狗狗",
          nameEn: "DOG",
        },
        {
          img: "https://image.henhenchina.com/61ee0fe4f58112000178d924/125f6acc8a8d42a29038efd907667507.png",
          imgCheck:
            "https://image.henhenchina.com/61ee0fe4f58112000178d924/dfac3326a5744a51bc934a26755cf57a.png",
          name: "异宠",
          nameEn: "OTHER",
        },
      ],

      value1: Number(new Date()),
      isShowDatePicker: false,

      photoShow: false,

      isSubmit: false,

      enterType: "",
    };
  },

  components: {
    // PhotoPop,
  },
  computed: {
    // ...mapState(["userSelectedPetId"]),
  },
  onLoad(options) {},
  onUnload() {
    uni.$off("selectPetType");
  },
  onReady() {},
  watch: {
    categoryId: {
      handler(newV, oldV) {
        // this.petInfo.categoryId = newV;
        this.$set(this.petInfo, "categoryId", newV);
      },
      immediate: true,
      deep: true,
    },
    categoryName: {
      handler(newV, oldV) {
        console.log(newV + "---" + oldV);
        // this.petInfo.categoryName = newV;
        this.$set(this.petInfo, "categoryName", newV);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    handleOpen() {
      console.log("handleOpen");
      this.isSubmit = false;
      this.clearData(0);

      this.petInfo = {
        nickName: "",
        categoryId: "",
        categoryName: "",
        birth: "",
        sex: "",
        // sexName: "",
        sterilizationStatus: "0",
        // sterilizationStatusDesc: "",
        avatarUrl: "",
      };
    },
    handleCancel() {
      console.log("handleCancel");
      this.close();
    },
    close() {
      console.log("close");
      this.isSubmit = false;
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      this.$emit("clearcategory", false);
    },

    hasValidate() {
      if (this.checkNum == 2) {
        return (
          this.petInfo.nickName != "" &&
          this.petInfo.categoryId != "" &&
          this.petInfo.categoryName != "" &&
          this.petInfo.birth != "" &&
          this.petInfo.sex != "" &&
          this.petInfo.avatarUrl != ""
        );
      }
      return Object.values(this.petInfo).every((item) => item !== "");
    },

    handleSave() {
      console.log("handleSave : ", this.petInfo);
      if (this.checkNum == 2) {
        this.petInfo.sterilizationStatus = "0";
      }

      if (this.isSubmit) {
        return;
      }

      this.isSubmit = true;
      //新建逻辑
      ADD_PET_DETAIL({ ...this.petInfo })
        .then((res) => {
          uni.showToast({
            title: "添加成功",
            duration: 2000,
          });
          this.$emit("update:isOpen", false);
          this.$emit("confirm", res.data);
          this.isSubmit = false;
        })
        .catch(() => {
          this.isSubmit = false;
        });
    },

    clearData(idx) {
      this.checkNum = idx;
      // this.petInfo = {
      //   nickName: "",
      //   categoryId: "",
      //   categoryName: "",
      //   birth: "",
      //   sex: "",
      //   // sexName: "",
      //   sterilizationStatus: "0",
      //   // sterilizationStatusDesc: "",
      //   avatarUrl: "",
      // };

      this.petInfo.categoryId = "";
      this.petInfo.categoryName = "";

      this.species = -1;
      console.log("handleCheckNum2 ", this.petInfo);
    },

    handleCheckNum(idx) {
      console.log("handleCheckNum1 ", this.checkNum, idx);
      if (this.checkNum != idx) {
        this.checkNum = idx;
        this.clearData(idx);
        this.$emit("clearcategory", false);
      }
    },

    handleHead() {
      this.photoShow = true;
    },

    handleNickname() {},

    handleGender(idx) {
      this.petInfo.sex = idx;
    },

    handleBreed(idx) {
      // this.petInfo.categoryId = idx
      if (this.checkNum == 2 && this.species == -1) {
        return uni.showToast({
          title: "请先选择种类",
          icon: "none",
        });
      }

      let num = 1;
      if (this.checkNum == 0) {
        num = 1;
      } else if (this.checkNum == 1) {
        num = 50;
      } else {
        num = this.species;
      }

      uni.navigateTo({
        url: `/pagesA/selectTypeTwo/index?parentId=${num}&enterType=AI`,
      });
    },

    handleSpecies(idx) {
      this.species = idx;
      this.petInfo.categoryId = "";
      this.petInfo.categoryName = "";
    },

    handleSterilization(idx) {
      this.petInfo.sterilizationStatus = idx;
    },

    handleBirth() {
      this.isShowDatePicker = true;
    },

    handleClose() {
      this.isShowDatePicker = false;
    },

    handleConfirm(e, type) {
      if (type == "date") {
        // this.petInfo = { ...this.petInfo, birth: formatTime(e.value) };
        this.petInfo.birth = formatTime(e.value);
        this.isShowDatePicker = false;
      }
    },

    handlePhoto(data) {
      const that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: data == 1 ? ["camera"] : ["album"],
        success: function (res) {
          const url = process.env.NODE_ENV?.includes("local")
            ? "/api/"
            : BASR_URL;
          // console.log("res resddddddd", res);
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
              // that.setHeadPortrait(uploadFileRes.data || "");
              console.log(uploadFileRes);
              that.petInfo = { ...that.petInfo, avatarUrl: uploadFileRes.data };
              console.log(that.petInfo);
            },
            fail: (res) => {
              console.log(res);
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
