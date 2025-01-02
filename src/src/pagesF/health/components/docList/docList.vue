<template>
  <view class="doc-list-wrapper">
    <view class="list-title">
      <view class="left">问医生</view>
      <view class="right" @click="toDocList(1)"
        >更多
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/arrow-right-tag.png"
          class="arrow"
        />
      </view>
    </view>
    <view class="list-content-wrapper">
      <view
        v-for="(item, index) in docList"
        :key="index"
        class="list-item"
        @click.stop="
          () => {
            toDocDetail(item);
          }
        "
      >
        <view :class="['avatar', item.workStatus == 'ONLINE' ? 'online' : '']">
          <image :src="item.avatarUrl" />
          <view class="online-tag" v-if="item.workStatus == 'ONLINE'"
            >在线</view
          >
        </view>
        <view class="info">
          <view class="first-row">
            <view class="name">{{ item.userName.slice(0, 4) }}</view>
            <view class="pro-tag" v-if="item.title">
              <view class="icon"></view>
              <view class="pro-title">{{ item.title }}</view>
            </view>
          </view>
          <view class="depart">
            <view class="hospitalname">{{
              item.hospitalName && item.hospitalName.slice(0, 7)
            }}</view>
            {{
              item.departmentNames && Array.isArray(item.departmentNames)
                ? item.departmentNames.join("&nbsp;|&nbsp;")
                : ""
            }}
          </view>

          <view class="third-row" v-if="item.tags && item.tags.length">
            <view
              class="tagitem"
              v-for="(v, i) in item.tags.slice(0, 4)"
              :key="i"
            >
              {{ v }}
            </view>
          </view>
          <view class="forth-row" v-if="item.goodDirection">{{
            item.goodDirection
          }}</view>
          <view class="second-row">
            <view class="scoreicon"></view>
            <text class="num margin19">{{ item.avgScore }}</text>
            <text class="name">累计接诊</text>
            <text class="num margin19">{{ item.totalServiceCount }}</text>
            <text class="name">响应时间</text>
            <text class="num">{{
              item.responseTime !== "/"
                ? item.responseTime + "分钟"
                : item.responseTime
            }}</text>
          </view>
        </view>
        <view
          class="itembtn onlinebtn"
          v-if="item.workStatus == 'ONLINE'"
          @click.stop="
            () => {
              toAsk(item);
            }
          "
          >问医生</view
        >
        <view
          class="itembtn busybtn onlinebtn"
          v-if="item.workStatus == 'BUSY'"
          @click.stop="showToast"
          >忙碌中</view
        >
        <view
          class="itembtn offlinebtn"
          v-if="item.workStatus == 'OFFLINE'"
          @click.stop="
            () => {
              return false;
            }
          "
          >离线</view
        >
        <view
          class="itembtn leavebtn"
          v-if="item.workStatus == 'AWAY'"
          @click.stop="
            () => {
              return false;
            }
          "
          >暂时离开</view
        >
      </view>
    </view>
    <view class="morebtn" @click="toDocList(2)">更多医生</view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { action_report } from "@/utils/track";
const module_name = "medical";
export default {
  props: {
    docList: {
      type: Array,
    },
    petList: {
      type: Array,
    },
  },
  computed: {
    ...mapState(["userInfo", "userId", "userPetList"]),
  },
  data() {
    return {
      current: 0,
      tempList: [],
    };
  },
  mounted() {},
  methods: {
    setRouter(url, query) {
      uni.navigateTo({
        url,
      });
    },
    showToast() {
      // this.$refs.uToast.show({
      //   type: "default",
      //   icon: false,
      //   message: "医生忙碌中",
      // });
      this.$emit("showtoast");
    },
    toDocList(type) {
      action_report({
        action_name:
          type == 1
            ? "consultation_main_more_clk"
            : "consultation_main_moredoctor_clk",
        module_name: module_name,
      });
      // if (!this.userInfo.token) {
      //   this.setRouter("/pagesD/login/index");
      //   return;
      // }
      this.setRouter("/pagesA/docList/index");
      // else if (this.petList.length == 1) {
      //   return uni.showToast({
      //     title: "请先添加宠物",
      //     icon: "error",
      //   });
      // } else {
      //   // this.setRouter("/pagesA/docList/index");
      // }
    },
    toAsk(item) {
      if (!this.userInfo.token) {
        this.setRouter("/pagesD/login/index");
        return;
      }
      this.$emit("docAsk", item);
      // if (this.petList.length == 1) {
      //   return uni.showToast({
      //     title: "请先添加宠物",
      //     icon: "error",
      //   });
      // }
    },
    toDocDetail(item) {
      // if (!this.userInfo.token) {
      //   this.setRouter("/pagesD/login/index");
      //   return;
      // }
      // if (this.petList.length == 1) {
      //   return uni.showToast({
      //     title: "请先添加宠物",
      //     icon: "error",
      //   });
      // }
      action_report({
        action_name: "consultation_main_doctorcard_clk",
        module_name: module_name,
        extend: {
          id: item.userId,
        },
      });
      uni.navigateTo({
        url: `/pagesA/docDetail/index?userId=${
          item.userId
        }&cityCode=${uni.getStorageSync("cityCode")}`,
      });
    },
  },
};
</script>

<style lang="scss">
@import "./docList.scss";
</style>
