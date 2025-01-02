<template>
  <view class="dad-wrapper">
    <view class="drop-wrapper">
      <DaDropdownVue2
        ref="DaDropdownRef"
        :dropdownMenu.sync="dropdownMenuList"
        themeColor="#2DCE80"
        textColor="#666666"
        :duration="300"
        :fixedTop="true"
        :menuActiveText="false"
        :syncDataFn="tagList"
        @reset="handleReset"
        @confirm="handleConfirm"
        @close="handleClose"
        @open="handleOpen"
      >
      </DaDropdownVue2>
    </view>
    <scroll-view
      class="doc-list-wrapper"
      :scroll-y="!modalopen"
      @scrolltolower="scrolltolower"
      :scroll-top="scrollTop"
      @scroll="handleScroll"
    >
      <view class="line"></view>
      <view class="list-content-wrapper" v-if="docList.length">
        <view
          v-for="(item, index) in docList"
          class="list-item"
          :key="item.id"
          @click.stop="toDocDetail(item)"
        >
          <view
            :class="['avatar', item.workStatus == 'ONLINE' ? 'online' : '']"
          >
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
              <view class="tagitem" v-for="(v, i) in item.tags.slice(0, 4)">
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
            @click.stop="docAsk(item.userId)"
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
      <view v-else class="no-data">
        <NoData
          noDataText="暂无匹配医生，请重新筛选"
          img="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/emptydata.png"
        ></NoData>
      </view>
    </scroll-view>
    <u-toast ref="uToast"></u-toast>
    <GoToChatPage :show.sync="isShowGoTo"></GoToChatPage>
    <CouponChoosePop
      :isOpen.sync="isCouponShow"
      @close="handleCouponClose"
      :coupon-list="couponCommendList"
      :inquiry-type="inquiryTypeForPop"
      :doctorUserId="doctorUserId"
    />
    <InvitePop :isOpen.sync="isInviteShow" @close="handleCouponClose" />
    <view class="toast-body" v-if="isShowSelfToast">
      {{ toastContent }}
    </view>
  </view>
</template>

<script>
import GoToChatPage from "@/components/goToChatPage/index.vue";
import CouponChoosePop from "@/components/couponChoosePop/index.vue";
import InvitePop from "@/components/invitePop/index.vue";
import DaDropdownVue2 from "../components/da-dropdown-vue2/index.vue";
import {
  GET_DOC_LIST,
  GET_ONLINE_STATUS,
  CAN_I_ASK_V2,
  GET_COUPON_LIST_IN_POP,
  GET_RESOURCE_LIST_IN_POP,
  GET_DOCTOR_TAGINFO,
} from "@/api/index";
import { mapState, mapMutations } from "vuex";
import NoData from "@/components/noData/index.vue";
import { action_report, display_report } from "@/utils/track";
const module_name = "medical";
export default {
  components: {
    GoToChatPage,
    NoData,
    CouponChoosePop,
    InvitePop,
    DaDropdownVue2,
  },
  data() {
    return {
      current: 0,
      isShowGoTo: false,
      docList: [],
      pageNo: 1,
      pageSize: 20,
      modalopen: false,
      isFinished: false, //无数据,禁止下拉刷新
      sortMap: {
        评分由高到低: 1,
        评分由低到高: 2,
        接诊量由高到低: 3,
        接诊量由低到高: 4,
      },
      isCouponShow: false,
      isInviteShow: false,
      couponCommendList: [],
      inquiryTypeForPop: "EXPERT",
      doctorUserId: "",
      tagList: [],
      departNameMap: {
        DEPARTMENT: "医生科室",
        DOCTOR_TAG: "医生标签",
        TITLE: "医生职称",
      },
      dropdownMenuList: [
        {
          title: "评分由高到低",
          type: "cell",
          prop: "god1",
          // showAll: true,
          // showIcon: true,
          value: "", // 默认内容2
          options: [
            { label: "评分由高到低", value: "评分由高到低" },
            { label: "评分由低到高", value: "评分由低到高" },
            { label: "接诊量由高到低", value: "接诊量由高到低" },
            { label: "接诊量由低到高", value: "接诊量由低到高" },
          ],
          // value: true, // 默认选中
        },
        {
          title: "筛选",
          type: "filter",
          prop: "god2",
          // 默认选中单选2、多选2、3、滑动30
          // value: { ft1: '2', ft2: ['2', '3'], ft3: 30 },
          options: [],
        },
      ],
      activeTabIndex: 0,
      filterAData: 1,
      filterBData: {
        departments: [],
        titles: [],
        tags: [],
      },
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
      toastContent: "",
      isShowSelfToast: false,
    };
  },
  mounted() {
    this.getTagList();
    this.getDocList();
  },
  computed: {
    ...mapState([
      "userInfo",
      "userSelectedPetId",
      "userPetList",
      "serviceSheetsList",
    ]),
  },
  methods: {
    setRouter(url, query) {
      uni.navigateTo({
        url,
      });
    },
    showToast() {
      this.$refs.uToast.show({
        type: "default",
        icon: false,
        message: "医生忙碌中",
      });
    },
    handleScroll(e) {
      this.old.scrollTop = e.detail.scrollTop;
    },
    handleToTop() {
      this.scrollTop = this.old.scrollTop;
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
    },
    async docAsk(userId) {
      if (!this.userInfo.token) {
        this.setRouter("/pagesD/login/index");
        return;
      }
      action_report({
        action_name: "doctor_list_askdoctor_clk",
        module_name: module_name,
        extend: {
          id: userId,
        },
      });
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      return;
      // #endif
      this.doctorUserId = userId;
      if (this.serviceSheetsList.length) {
        // return this.$refs.uToast.show({
        //   type: "default",
        //   icon: false,
        //   message: "当前有问诊单，无法新建咨询",
        // });
        this.isShowGoTo = true;
        return;
      }
      try {
        const res = await GET_ONLINE_STATUS(userId);
        if (res.data) {
          CAN_I_ASK_V2("EXPERT")
            .then((res) => {
              if (res.data == 1) {
                // this.$uma.trackEvent("professional_ask", {
                //   form: "index",
                //   user_id: uni.getStorageSync("userId"),
                // });
                if (this.userPetList.length === 1) {
                  uni.navigateTo({
                    url: `/pagesD/petInfo/index?doctorUserId=${userId}`,
                  });
                  return;
                }
                uni.navigateTo({
                  url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=EXPERT&doctorUserId=${userId}`,
                });
              } else if (res.data == 2) {
                //请求优惠券数据
                GET_RESOURCE_LIST_IN_POP("EXPERT").then((resCoupon) => {
                  this.couponCommendList = resCoupon.data;
                  this.isCouponShow = true;
                });
              } else {
                this.isInviteShow = true;
              }
            })
            .catch((err) => {
              console.log("err", err.message);
              this.toastContent = err.message;
              this.isShowSelfToast = true;
              setTimeout(() => {
                this.isShowSelfToast = false;
              }, 2000);
            });

          // uni.navigateTo({
          //   url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&doctorUserId=${userId}`,
          // });
        } else {
          return this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "当前医生已下班，请更换医生进行问诊",
          });
        }
      } catch (error) {}
    },
    // //展示toast长内容
    // showUToast(params) {
    //   this.$refs.uToast.show({
    //     ...params,
    //   });
    // },
    //获取医生列表
    async getDocList() {
      let params = {
        cityCode: uni.getStorageSync("cityCode") || "",
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sort: this.filterAData,
        ...this.filterBData,
      };
      const res = await GET_DOC_LIST(params);
      console.log(res.data.data);
      if (this.pageNo > 1) {
        this.docList = this.docList.concat(res.data.data);
      } else {
        this.docList = res.data.data;
      }
      if (res.data.data.length === 0) {
        this.isFinished = true;
      }
    },
    //滚动到底
    scrolltolower() {
      console.log("到底");
      if (!this.isFinished) {
        this.pageNo += 1;
        this.getDocList();
      }
    },
    //查看医生详情
    toDocDetail(item) {
      action_report({
        action_name: "doctor_list_doctorcard_clk",
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
    async getTagList() {
      const { data } = await GET_DOCTOR_TAGINFO({ bizType: "MEDICAL_DOCTOR" });
      Object.keys(data).map((key) => {
        let itemobj = {};
        itemobj["title"] = this.departNameMap[key];
        itemobj["type"] = "checkbox";
        itemobj["prop"] = key;
        itemobj["options"] = data[key].map((item, index) => {
          return {
            label: item.tagName,
            value: item.code,
          };
        });
        this.tagList.push(itemobj);
      });
      this.dropdownMenuList[1]["options"] = this.tagList.reverse();
      console.log("menu", this.dropdownMenuList[1]["options"]);
    },
    handleCouponClose() {
      this.isCouponShow = false;
      this.isInviteShow = false;
    },
    handleSwitchChange(event, item, index) {
      console.log("handleSwitchChange ==>", event, item, index);

      // 更新数据及视图
      const curItem = this.dropdownMenuList[index];
      curItem.value = event.detail.value === true ? 1 : 0;
      this.$set(this.dropdownMenuList, index, curItem);
      // 操作完成后关闭弹窗
      this.$refs.DaDropdownRef?.handlePopupHide();
    },
    handleConfirm(v) {
      this.pageNo = 1;
      this.isFinished = false;
      this.handleToTop();
      console.log("handleConfirm ==>", v);
      if (this.activeTabIndex == 0) {
        this.dropdownMenuList[0].title = v["god1"];
        this.filterAData = this.sortMap[v["god1"]];
      } else {
        action_report({
          action_name: "filter_pop_confirm_clk",
          module_name: module_name,
          extend: {
            departments:
              v["god2"]["DEPARTMENT"]?.length &&
              v["god2"]["DEPARTMENT"].join("\\"),
            titles: v["god2"]["TITLE"]?.length && v["god2"]["TITLE"].join("\\"),
            tags:
              v["god2"]["DOCTOR_TAG"]?.length &&
              v["god2"]["DOCTOR_TAG"].join("\\"),
          },
        });
        this.filterBData = {
          departments: v["god2"]["DEPARTMENT"],
          titles: v["god2"]["TITLE"],
          tags: v["god2"]["DOCTOR_TAG"],
        };
      }
      this.getDocList();
    },
    handleClose(v) {
      console.log("handleClose ==>", v);
      this.modalopen = false;
      this.pageNo = 1;
      this.isFinished = false;
      this.handleToTop();
      // this.getDocList();
    },
    handleReset(v) {
      console.log("handle reset", v);
      action_report({
        action_name: "filter_pop_reset_clk",
        module_name: module_name,
      });
    },
    handleOpen(v) {
      console.log("handleOpen ==>", v);
      this.activeTabIndex = v;
      this.modalopen = true;
      if (this.activeTabIndex == 0) {
        action_report({
          action_name: "doctor_list_sort_clk",
          module_name: module_name,
        });
      } else {
        action_report({
          action_name: "doctor_list_filter_clk",
          module_name: module_name,
        });
        display_report({
          display_name: "filter_pop_show",
          object_type: module_name,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
