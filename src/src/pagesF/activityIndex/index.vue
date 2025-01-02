<template>
  <view :class="['index-warp', !isHeaderShow ? 'roll-up' : '']">
    <image
      :src="pageActiveSubjectListData[currentValChange].backPicture"
      class="bg"
      mode="scaleToFill"
    />
    <view
      :class="[
        'header',
        !isHeaderShow ? 'header-hide roll-up' : '',
        !isHeaderShow ? 'header roll-up' : '',
      ]"
    >
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="hender-frame" :style="{ height: navBarHeight }">
        <view class="left">
          <view class="iconfont icon-back" @click="toBack"> </view>
          <view class="city" @click="handleSwitchCities">
            <view class="text-center">{{
              cityData.city && cityData.city != "[]" ? cityData.city : "杭州市"
            }}</view>
            <view class="iconfont icon-arrowDown"></view>
          </view>
          <!-- <view
            class="input-btn iconfont icon-search"
            @click="setRouter('/pagesF/search/index')"
          ></view> -->
        </view>
        <!-- <view
          class="title"
          :style="{ height: navBarHeight, lineHeight: navBarHeight }"
          >宠胖胖俱乐部</view
        > -->
        <view class="right"></view>
      </view>

      <active-subject
        class="active-subject"
        v-if="pageActiveSubjectListData && pageActiveSubjectListData.length"
        :info="pageActiveSubjectListData"
        @changeFn="handleChange"
      >
      </active-subject>

      <!-- <advertising-banner
        class="advertising-banner"
        v-if="bannerData && bannerData.length"
        :info="bannerData"
      >
      </advertising-banner> -->
      <!-- tag -->
    </view>
    <!-- 筛选条件 -->
    <!-- 滑动后吸顶头部 -->
    <!-- <view :class="[!isHeaderShow?'fix-padding':'']"></view> -->
    <view
      class="header-fixed"
      :style="{
        position: !isHeaderShow ? 'fixed' : '',
        display: !isHeaderShow ? 'block' : 'none',
      }"
    >
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="hender-frame" :style="{ height: navBarHeight }">
        <view class="left">
          <view class="iconfont icon-back" @click="toBack"> </view>
          <view class="city" @click="handleSwitchCities">
            <view class="text-center">{{
              cityData.city && cityData.city != "[]" ? cityData.city : "杭州市"
            }}</view>
            <view class="iconfont icon-arrowDown"></view>
          </view>
          <!-- <view
            class="input-btn iconfont icon-search"
            @click="setRouter('/pagesF/search/index')"
          ></view> -->
        </view>
        <!-- <view
          class="title"
          :style="{ height: navBarHeight, lineHeight: navBarHeight }"
          >宠胖胖俱乐部</view
        > -->
        <view class="right"></view>
      </view>
    </view>
    <!-- 城市 -->
    <cpp-select-city
      :show="showCity"
      :info="cityData"
      :defaultRegion="defaultRegion"
      :isAddWholeNation="true"
      @close="handleClose"
      @getRegion="handleGetRegion"
      @confirm="handleConfirm"
      @openSetting="handelOpensetting"
      @fetchPosition="handelFetchPosition"
    >
    </cpp-select-city>

    <view
      :class="['list-box', !isHeaderShow ? 'roll-up' : '']"
      v-if="listData && listData.length > 0"
    >
      <activity-list
        :listArr="listData"
        :bannerArr="bannerData"
        :cityCode="cityData.code"
      ></activity-list>
    </view>
    <view class="mt35-box" v-if="refresh && listData.length == 0">
      <NoData
        img="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/myActives/nodata-404.png"
        noDataText="空空如也,胖胖好寂寞..."
      >
      </NoData>
    </view>

    <advertising-pop
      class="advertising-pop"
      v-if="popData && popData.length"
      :showStatus="showPop && popData && popData.length"
      :info="popData"
      @closePop="handleClosePop"
    ></advertising-pop>
    <!-- <PrivacyPop
      :isOpen.sync="isShowPrivacy"
      :protocol="protocol"
      source="act"
      @close="handlePrivacyClose"
    ></PrivacyPop> -->
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
//import { wxShareMethod } from "@/utils/wxShare";
// import { appId, getCode } from "@/utils/config";
import { getProgramLocation } from "@/utils/index";
import NoData from "@/components/noData/index.vue";
import activeSubject from "../components/active-subject/active-subject.vue";
import activityList from "../components/activity-list/activity-list.vue";
import advertisingPop from "../components/advertising-pop/advertising-pop.vue";
// import PrivacyPop from "@/components/privacyPop/index.vue";
import {
  getPopInfo,
  getBanner,
  getPageActiveSubjectList,
  getActivityList,
} from "@/api/activityclube";
import { searchUserLocation } from "@/api/base/index";

import { action_report, display_report } from "@/utils/track";
const module_name = "activity";
export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: {
    // ActivityStatusPop,
    // PrivacyPop,
    NoData,
    activeSubject,
    activityList,
    advertisingPop,
  },
  data() {
    return {
      isHeaderShow: true,
      statusBarHeight: "",
      navBarHeight: "",
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
      listData: [],
      // tagList: [
      //   {
      //     tagName: "推荐",
      //     id: "",
      //     img: "https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/a_tag_item_all.png",
      //   },
      // ],
      // tagIndex: 0,
      // tagId: "",
      activedId: "",
      statusList: [
        { text: "全部", id: "", logogram: "全部" },
        { text: "报名中活动", id: "ON", logogram: "报名中" },
        { text: "已结束活动", id: "OFF", logogram: "已结束" },
      ],
      statusIndex: 0,
      showCity: false,
      showPop: false,
      popData: undefined,
      bannerData: undefined,
      cityReceiveData: [],
      openSetting: true,
      defaultRegion: ["330000", "330100"],
      isAndroid: false,
      refresh: false,
      // statusShow: false,
      // activityStatus: 0,
      isShowPrivacy: false,
      protocol:
        "若您确认点击同意，表示您已同意宠胖胖收集你的手机号用于注册登录账号、收集你的微信昵称、头像用于完善用户基础信息、获取你的位置信息，用于优先展示附近活动、使用你的相册（仅写入）权限用于用户报名名片头像、收集你选中的照片或视频信息用于用户头像、咨询、评论等内容相关功能",
      pageActiveSubjectListData: [],
      showpageActiveSubject: true,
      currentValChange: 0,
    };
  },
  computed: {
    ...mapState({
      cityData: (state) => state.city,
    }),
  },
  onLoad(option) {
    // 授权微信不允许，去除
    //   this.fetchPosition();
    // this.getTag();
    this.getPageActivityList();
    // this.getPopInfo();
    this.pageActiveSubjectList();
    this.getBanner();
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    wx.getPrivacySetting({
      success: (res) => {
        console.log(res); // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
        if (res.needAuthorization) {
          // 需要弹出隐私协议
          uni.hideTabBar();
          this.isShowPrivacy = true;
        } else {
          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
          // wx.getUserProfile()
          // wx.chooseMedia()
          // wx.getClipboardData()
          // wx.startRecord()
        }
      },
      fail: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  },
  onReady() {},
  onShow() {
    console.log("000 onShow ");
    // 展示事件
    display_report({
      display_name: "xcxdiscover_pet_travel_page_view",
      object_type: module_name,
    });
    this.getPopInfo();
    const _this = this;
    uni.getSystemInfo({
      success: function (res) {
        if (res.osName == "android") {
          // _this.statusBarHeight = (res.statusBarHeight + 8) + 'px';
          _this.isAndroid = true;
          return;
        }
        // _this.statusBarHeight = (res.statusBarHeight + 5) + 'px';
      },
    });
  },
  onPullDownRefresh() {
    console.log("onPullDownRefresh ==== ");
    // uni.startPullDownRefresh();
    this.tagId = "";
    this.activedId = "";
    // this.tagIndex = 0;
    this.statusIndex = 0;
    this.resetPage();
    this.fetchPosition("pullDown");
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
    this.getBanner();
    this.pageActiveSubjectList();
  },
  onReachBottom() {
    if (this.pageNo == this.totalPage) return;
    this.pageNo++;
    this.getPageActivityList();
  },
  onPageScroll(e) {
    let h = 150;
    if (
      this.pageActiveSubjectListData &&
      this.pageActiveSubjectListData.length
    ) {
    } else {
      h = 10;
    }
    if (e.scrollTop >= h) {
      this.isHeaderShow = false;
      return;
    } else {
      this.isHeaderShow = true;
    }
  },
  methods: {
    ...mapMutations(["setCity", "setUserCity"]),
    setRouter(url, query) {
      uni.navigateTo({
        url,
      });
    },
    toBack() {
      uni.navigateBack({
        delta: 1,
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
      // uni.navigateTo({
      //   url: `/pagesD/disCovery/index`,
      // });
    },
    // 获取位置
    async fetchPosition(type) {
      try {
        const { latitude, longitude } = await getProgramLocation();
        console.log("latitude1 ", latitude);
        console.log("longitude1 ", longitude);
        if (!latitude) {
          return;
        }
        this.openSetting = false;
        const _params = { lat: latitude, lon: longitude };
        searchUserLocation({ data: _params }).then(({ data }) => {
          if (type == "pullDown") {
            this.getPageActivityList();
          } else {
            // this.setCity(data)
            console.log(data, 233);
            this.setUserCity(data);
          }
        });
      } catch (err) {
        this.getPageActivityList();
      }
    },
    resetPage() {
      this.pageNo = 1;
      this.listData = [];
      // console.log("resetPage ====");
    },

    async pageActiveSubjectList() {
      const { data } = await getPageActiveSubjectList({
        pageSize: 100,
        pageNum: 1,
        bizType: "COMMON",
        bizSubType: "COMMON",
      });
      this.pageActiveSubjectListData = data.data;
      display_report({
        display_name: "xcxdiscover_pet_travel_theme_ip_view",
        object_type: module_name,
        extend: {
          subjectId: this.pageActiveSubjectListData[0].id,
          subjectName: this.pageActiveSubjectListData[0].name,
        },
      });
      console.log("getPageActiveSubjectList data : ", data);
    },

    async getPageActivityList() {
      const { latitude, longitude } = uni.getStorageSync(
        "storage_currentPosition"
      );
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        // citySearchType: "NATIONAL",
        lat: latitude,
        lon: longitude,
        cityCode: "330100",
      };

      // if (this.tagId) {
      //   params.tagId = this.tagId;
      // }
      // if (this.activedId) {
      //   params.actived = this.activedId;
      // }
      console.log("latitude ", latitude);
      console.log("longitude ", longitude);
      console.log("this.cityData ", this.cityData);
      if (this.cityData.lat) {
        params.cityCode = this.cityData.code;
        // params.citySearchType = "CITY";
        // params.lat = this.cityData.lat;
        // params.lon = this.cityData.lon;
      }

      const res = await getActivityList(params);
      this.totalPage = res.data.totalPage;
      if (res.data.data.length == 0) {
        this.refresh = true;
      }
      // console.log("resetPage ====1 ", this.listData);
      this.listData = [...this.listData, ...res.data.data];
    },

    // async getTag() {
    //   const { data } = await COMMUNITY_ACTIVITY_TAG();
    //   data.forEach((item, index) => {
    //     if (item.id == "6327e20601397f000157ac21") {
    //       item.img = this.tagImgArr[1];
    //     } else if (item.id == "6327e218f08fb000013d9b32") {
    //       item.img = this.tagImgArr[2];
    //     } else if (item.id == "6327e224f08fb000013d9b33") {
    //       item.img = this.tagImgArr[3];
    //     } else if (item.id == "6327e230f08fb000013d9b34") {
    //       item.img = this.tagImgArr[4];
    //     } else if (item.id == "6327e240f08fb000013d9b35") {
    //       item.img = this.tagImgArr[5];
    //     } else if (item.id == "6327e24ff08fb000013d9b36") {
    //       item.img = this.tagImgArr[6];
    //     } else if (item.id == "6327e262f08fb000013d9b37") {
    //       item.img = this.tagImgArr[7];
    //     } else if (item.id == "6327e26a01397f000157ac22") {
    //       item.img = this.tagImgArr[8];
    //     } else {
    //       item.img = this.tagImgArr[9];
    //     }
    //     // if(index <= 8) {
    //     // 	item.img = this.tagImgArr[index+1]
    //     // }  else {
    //     // 	item.img = this.tagImgArr[9]
    //     // }
    //   });
    //   this.tagList = [...this.tagList, ...data];
    // },

    /**
     * 根据时间戳获取当天0点时间
     * @param offHour 当天几点
     */
    getTodayTime(time, offHour) {
      let cutTime = new Date(time).toLocaleDateString();
      let todayTime = new Date(cutTime).getTime();
      console.log("getTodayTime : ", cutTime, todayTime, offHour);
      if (offHour) {
        todayTime += offHour * 3600 * 1000;
      }

      return todayTime;
    },

    async getPopInfo() {
      const { data } = await getPopInfo({
        key: "POPUP_FRIENDS_CLUB_HOME",
      });
      this.popData = data;
      console.log("getPopInfo data1 : ", data);

      if (this.popData && this.popData.length) {
        let firstData = this.popData[0];
        let lastTime = uni.getStorageSync("storage_pop" + firstData.id);
        let nowTime = new Date().getTime();
        console.log("getPopInfo lastTime : ", lastTime);
        if (lastTime) {
          console.log("getPopInfo lastTime 111 : ");
          if (
            firstData.rule.exposure == "SAME_PROCESS" ||
            firstData.rule.exposure == "ONLY"
          ) {
            this.showPop = false;
          } else if (firstData.rule.exposure == "DAY") {
            let lt = this.getTodayTime(lastTime, 24);
            console.log("getPopInfo lastTime : ", lt);
            console.log("getPopInfo nowTime : ", nowTime);

            if (nowTime > lt) {
              console.log("getPopInfo lastTime 111 : tan ");
              this.showPop = true;
              uni.setStorageSync("storage_pop" + firstData.id, nowTime);
            } else {
              console.log("getPopInfo lastTime 111 : tan guo le ");
            }
          }
        } else {
          console.log("getPopInfo lastTime 000 : ");
          this.showPop = true;
          uni.setStorageSync("storage_pop" + firstData.id, nowTime);
        }
      }
    },

    async getBanner() {
      const { data } = await getBanner({
        key: "CAROUSEL_INTEREST_APPLE",
      });
      this.bannerData = data;
      console.log("getBanner data : ", data);
    },

    // tagSelected(idx, id) {
    //   this.tagIndex = idx;
    //   this.tagId = id;
    //   this.resetPage();
    //   this.getPageActivityList();
    // },

    // handleSetStatus(obj) {
    //   console.log("handleSetStatus ", obj);
    //   this.statusSelected(obj.statusIndex, this.statusList[obj.statusIndex].id);
    //   this.activityStatus = obj.statusIndex;
    // },

    // statusSelected(idx, id) {
    //   this.statusIndex = idx;
    //   this.activedId = id;
    //   this.resetPage();
    //   // this.getPageActivityList();
    // },
    handelOpensetting(e) {
      const {
        detail: { authSetting },
      } = e;
      this.openSetting = authSetting["scope.userLocation"] ? false : true;
      this.fetchPosition();
    },

    handelFetchPosition(e) {
      this.fetchPosition();
    },
    //选择城市
    handleSwitchCities() {
      // const _this = this;
      // if(this.openSetting) {
      // 	return;
      // };
      console.log("handleSwitchCities =======");

      uni.hideTabBar({
        animation: false,
      });
      this.showCity = true;
    },
    handleClose() {
      this.showCity = false;
      setTimeout(() => {
        uni.showTabBar({
          animation: false,
        });
      }, 500);
    },

    handleClosePop() {
      this.showPop = false;
    },

    //选择城市数据回传
    handleGetRegion(data) {
      // console.log(data, 'cun store')
      this.cityReceiveData = data[1] ? data[1] : data[0];
    },
    //选择城市提交改变城市
    handleConfirm() {
      this.handleClose();
      const info = {
        city: this.cityReceiveData.name,
        code: this.cityReceiveData.code,
        lat: this.cityReceiveData.lat,
        lon: this.cityReceiveData.lon,
      };
      this.setCity({ ...this.cityData, ...info });
      console.log(this.cityReceiveData, 2333);
      if (this.cityReceiveData.code > 0) {
        this.defaultRegion = [
          `${this.cityReceiveData.code.slice(0, 2)}0000`,
          this.cityReceiveData.code,
        ];
      } else {
        this.defaultRegion = ["330000", "330100"];
      }
      console.log("this.defaultRegion: ", this.defaultRegion, 66666);

      this.resetPage();
      this.getPageActivityList();
    },

    handleState() {
      // this.statusShow = true;
      // activityStatus: 0
    },
    handlePrivacyClose() {
      uni.showTabBar();
    },
    handleChange(index, imgRes) {
      console.log("handleChange ", index, imgRes);
      display_report({
        display_name: "xcxdiscover_pet_travel_theme_ip_view",
        object_type: module_name,
        extend: {
          subjectId: this.pageActiveSubjectListData[index - 1].id,
          subjectName: this.pageActiveSubjectListData[index - 1].name,
        },
      });
      this.currentValChange = index;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
