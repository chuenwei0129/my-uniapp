<template>
  <view class="dad-wrapper">
    <!-- #ifdef MP-WEIXIN -->
    <u-sticky bgColor="#fff">
      <view class="tabs-bg">
        <u-tabs
          :list="tagList"
          lineWidth="64"
          lineHeight="6"
          lineColor="#FEE900"
          :scrollable="false"
          :current="current"
          :activeStyle="{
            color: '#1F1F1F',
            fontFamily: 'AlimamaShuHeiTi-Bold',
            transform: 'scale(1.05)',
            zIndex: 2,
          }"
          :inactiveStyle="{
            color: '#1F1F1F',
            transform: 'scale(1)',

            zIndex: 2,
          }"
          itemStyle="padding:0; height: 40px;padding-top: 10px;"
          @click="handleChooseTab"
          @change="handleChangeTab"
        >
        </u-tabs>
      </view>
    </u-sticky>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <view>
      <u-sticky bgColor="#fff">
        <view class="tabs-bg">
          <u-tabs
            :list="tagList"
            lineWidth="64"
            lineHeight="6"
            lineColor="#FEE900"
            :scrollable="false"
            :current="current"
            :activeStyle="{
              color: '#1F1F1F',
              fontFamily: 'AlimamaShuHeiTi-Bold',
              transform: 'scale(1.05)',
              zIndex: 2,
            }"
            :inactiveStyle="{
              color: '#1F1F1F',
              transform: 'scale(1)',

              zIndex: 2,
            }"
            itemStyle="padding:0; height: 40px;padding-top: 10px;"
            @click="handleChooseTab"
            @change="handleChangeTab"
          >
          </u-tabs>
        </view>
      </u-sticky>
    </view>
    <!-- #endif -->
    <!-- 预约美洗 -->
    <view v-if="current === 0">
      <OrderList ref="OrderList" @showbtn="changeBtnStatus" />
      <u-toast ref="uToast"></u-toast>
      <!-- <view class="fix-button" v-if="showBtn">
        <view class="button1" @click="navToReservation">去预约</view></view
      > -->
    </view>

    <!-- 预约看宠 -->
    <view v-else>
      <AppointmentPetsList
        ref="mentPet"
        @showbtn="changePetsBtnStatus"
      ></AppointmentPetsList>
      <u-toast ref="uToast"></u-toast>
      <!-- <view class="fix-button" v-if="showPetsBtn">
        <view class="button1" @click="navToReservation">去预约</view></view
      > -->
    </view>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import { mapState, mapMutations } from "vuex";
import NoData from "@/components/noData/index.vue";
import OrderList from "./components/orderList.vue";
import AppointmentPetsList from "./components/appointmentPetsList.vue";
import { debounce } from "@/utils/index";
import { action_report, display_report } from "@/utils/track";
import zIndex from "uview-ui/libs/config/zIndex";
const module_name = "store";
export default {
  components: {
    NoData,
    OrderList,
    AppointmentPetsList,
  },
  props: {
    isPageShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showBtn: true,
      showPetsBtn: true,
      tagList: [
        {
          name: "预约洗美",
        },
        {
          name: "预约看宠",
        },
      ],
      current: 0,
      // tagList: [
      //   {
      //     name: "全部",
      //   },
      //   {
      //     name: "预约美洗",
      //   },
      //   {
      //     name: "预约挂号",
      //   },
      //   {
      //     name: "预约驱虫",
      //   },
      // ],
    };
  },
  computed: {
    ...mapState({}),
    screenWidth() {
      return uni.getSystemInfoSync().screenWidth;
    },
  },
  created() {
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  onShow() {
    this.getList();

    display_report({
      display_name: "myappointment_list_show",
      object_type: module_name,
    });
  },
  mounted() {
    //结束上一次监听
  },
  methods: {
    handleChangeTab(item) {
      this.current = item.index;
      // this.getList()
    },
    getList() {
      if (this.current === 0) {
        this.$refs.OrderList.getOrderList(true);
      } else {
        this.$nextTick(() => {
          console.log("this.$refs.mentPet", this.$refs.mentPet);
          this.$refs.mentPet.getOrderList(true);
        });
      }
    },
    handleChooseTab(item) {
      console.log(item);
      // uni.$emit("changeTab", item.index);
    },
    goOrder() {
      uni.navigateTo({
        url: `/pagesB/reservationHomePage/index`,
      });
    },

    navToReservation() {
      uni.navigateTo({
        url: `/pagesB/submitReservation/index`,
      });
    },

    changeBtnStatus(type) {
      this.showBtn = type;
    },
    changePetsBtnStatus(type) {
      this.showPetsBtn = type;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
