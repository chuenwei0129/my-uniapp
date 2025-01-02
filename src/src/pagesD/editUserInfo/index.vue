<template>
  <view class="edit-warp">
    <!-- <text class="top-tips-text" :style="{top: tipTop}">顶部文字提示</text> -->
    <image class="bg-img" mode="aspectFill" :src="userInfo.avatarUrl" />
    <view class="drop-shadow">
      <view class="header">
        <view class="status-bar" :style="{ height: statusBarHeight }"></view>
        <view class="header-title" @click="goBack">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/home/header_left.png"
          />
          <text>编辑个人资料</text>
        </view>
      </view>

      <view class="headPortrait" @click="photoFn">
        <image mode="aspectFill" :src="userInfo.avatarUrl" />
        <view>点击更换头像</view>
      </view>
      <view class="fromList">
        <view
          class="fromItem"
          v-for="(item, index) in userData"
          :key="index"
          @click="handleInfo(item)"
        >
          <text>{{ item.title }}</text>
          <view class="fromItem-value">
            <text :class="item.value ? '' : 'defaule'">
              {{ item.value ? item.value : item.placeholder }}
            </text>
            <!-- src="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/home/bearingRight.png" -->
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/my/my_more.png"
            />
          </view>
        </view>
      </view>
    </view>

    <SexPop :show.sync="sexShow" @confirm="handleSex" :sex="sex" />
    <TimePop :show.sync="timeShow" @confirm="handleTime" :time="time" />
    <PhotoPop :show.sync="photoShow" @event="handlePhoto" />
    <!-- 城市 -->
    <cpp-select-city
      :show="showCity"
      :info="userInfo"
      :splicing="true"
      :defaultRegion="[userInfo.provinceCode, userInfo.cityCode]"
      @close="handleClose"
      @getRegion="handleGetRegion"
      @confirm="handleConfirm"
    >
    </cpp-select-city>
    <petType :show.sync="petShow" @confirm="handlePet" :pet="petNum" />
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
//import { wxShareMethod } from "@/utils/wxShare";
import { GET_USER_INFO_ALL, EDIT_USER_INFO } from "@/api/my";
import { userData, tepList } from "./data/index";
import { BASR_URL } from "@/utils/http";
// import SexPop from "./components/sexPop.vue";
// import TimePop from "./components/timePop.vue";
// import PhotoPop from "./components/photoPop.vue";
import { searchUserLocation } from "@/api/base/index";
import SexPop from "@/pagesD/editUserInfo/components/sexPop.vue";
import TimePop from "@/pagesD/editUserInfo/components/timePop.vue";
import PhotoPop from "@/pagesD/editUserInfo/components/photoPop.vue";
import petType from "./components/petType.vue";

export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: {
    SexPop,
    TimePop,
    PhotoPop,
    petType,
  },
  data() {
    return {
      statusBarHeight: "",
      tipTop: "",
      userInfo: {},
      userData,
      tepList,
      sexShow: false,
      timeShow: false,
      showCity: false,
      photoShow: false,
      sex: 1,
      time: "",
      cityReceiveData: [],
      ctx: {},
      petShow: false,
      petNum: 0,
      backUrl: "",
    };
  },
  computed: {
    // ...mapState({
    //   cityData: state => state.city
    // }),
  },
  onLoad(option) {
    this.backUrl = option.backUrl;
    // this.fetchPosition();
  },
  onReady() {},
  onShow() {
    const that = this;
    uni.getSystemInfo({
      success: function (res) {
        that.statusBarHeight = res.statusBarHeight + "px";
        // header-title: margin-top 10 height 21 间距 25
        that.tipTop = res.statusBarHeight + 10 + 21 + 25 + "px";
      },
    });
    this.getUserInfo();
  },
  methods: {
    // ...mapMutations(["setCity"]),
    async getUserInfo() {
      const { data } = await GET_USER_INFO_ALL();
      console.log("data data", data);
      this.userInfo = data;
      this.userData[0].value = data.nickName || "";
      this.userData[1].value = data.sex == 1 ? "男" : data.sex == 2 ? "女" : "";
      this.userData[2].value = data.birthday || "";
      this.userData[3].value =
        data.province && data.city ? `${data.province} ${data.city}` : "";
      this.userData[4].value = this.tepList[data.petType - 1] || "";
      this.sex = data.sex;
      this.time = data.birthday;
      this.petNum = data.petType;
    },
    // 获取位置
    fetchPosition(type) {
      // const { latitude, longitude } = uni.getStorageSync('storage_currentPosition');
      // searchUserLocation({lat: latitude, lon: longitude}).then(({data}) => {
      //   this.setCity(data)
      // })
    },
    handleInfo(item) {
      if (item.type == "nickName") {
        uni.navigateTo({
          url: "/pagesD/editNick/index",
        });
      } else if (item.type == "sex") {
        this.sexShow = true;
      } else if (item.type == "time") {
        this.timeShow = true;
      } else if (item.type == "city") {
        this.showCity = true;
      } else if (item.type == "pet") {
        this.petShow = true;
      }
    },
    photoFn() {
      this.photoShow = true;
    },
    async handlePet(petType) {
      try {
        const res = await EDIT_USER_INFO({ petType: petType + 1 });
        this.userData[4].value = this.tepList[petType] || "";
      } catch (error) {}
    },
    async handleSex(data) {
      const res = await EDIT_USER_INFO({ sex: data.sex });
      if (res.statusCode == 200) {
        this.userData[1].value =
          data.sex == 1 ? "男" : data.sex == 2 ? "女" : "";
      }
    },
    async handleTime(data) {
      const res = await EDIT_USER_INFO({ birthday: data.time });
      if (res.statusCode == 200) {
        this.userData[2].value = data.time;
      }
    },
    handleClose() {
      this.showCity = false;
    },
    //选择城市数据回传
    handleGetRegion(data) {
      this.cityReceiveData = data;
    },
    //选择城市提交改变城市
    async handleConfirm() {
      this.handleClose();

      console.log("this.cityReceiveData eeeee", this.cityReceiveData);

      const info = {
        city: this.cityReceiveData[1].name,
        cityCode: this.cityReceiveData[1].code,
        province: this.cityReceiveData[0].name,
        provinceCode: this.cityReceiveData[0].code,
        //   code: this.cityReceiveData[1].parentCode,
        //   lat: this.cityReceiveData[1].lat,
        //   lon: this.cityReceiveData[1].lon
      };

      // this.setCity({...this.cityData, ...info})
      const res = await EDIT_USER_INFO(info);
      if (res.statusCode == 200) {
        this.userData[3].value = `${info.province} ${info.city}` || "";
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
          uni.uploadFile({
            url: url + "cpp-common-management/v1/file/upload",
            filePath: res.tempFilePaths[0],
            header: {
              Authorization: uni.getStorageSync("storage_info").token,
              fromChannel: "MP",
            },
            name: "file",
            formData: {
              file: res.tempFilePaths[0],
            },
            success: (uploadFileRes) => {
              that.setHeadPortrait(uploadFileRes.data || "");
              that.userInfo.avatarUrl = uploadFileRes.data;
            },
            fail: (res) => {
              console.log(res);
            },
          });
        },
      });
    },
    goBack() {
      // if (!this.userData[0].value) {
      //   setTimeout(() => {
      //     uni.showToast({
      //       icon: "none",
      //       title: "请选择昵称",
      //       duration: 1000,
      //     });
      //   }, 1000);
      //   return;
      // }
      // if (!this.userData[1].value) {
      //   setTimeout(() => {
      //     uni.showToast({
      //       icon: "none",
      //       title: "请选择性别",
      //       duration: 1000,
      //     });
      //   }, 1000);
      //   return;
      // }
      // if (!this.userData[2].value) {
      //   setTimeout(() => {
      //     uni.showToast({
      //       icon: "none",
      //       title: "请选择生日",
      //       duration: 1000,
      //     });
      //   }, 1000);
      //   return;
      // }
      // if (!this.userData[3].value) {
      //   setTimeout(() => {
      //     uni.showToast({
      //       icon: "none",
      //       title: "请选择当前城市",
      //       duration: 1000,
      //     });
      //   }, 1000);
      //   return;
      // }
      // if (!this.userData[4].value) {
      //   setTimeout(() => {
      //     uni.showToast({
      //       icon: "none",
      //       title: "请选择宠物类型",
      //       duration: 1000,
      //     });
      //   }, 1000);
      //   return;
      // }
      uni.switchTab({ url: "/pages/my/index" });
    },
    async setHeadPortrait(url) {
      const res = await EDIT_USER_INFO({ avatarUrl: url });
      if (res.statusCode == 200) {
        // this.getUserInfo();
      }
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
