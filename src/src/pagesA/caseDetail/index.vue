<template>
  <view class="page-wrapper">
    <!-- #ifdef MP-WEIXIN -->
    <view :class="[pageScrollState ? 'scroll-state' : 'header-top']">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="return" @click="handleReturn"></view>
      <text>我的宠物</text>
    </view>
    <!-- #endif -->

    <scroll-view
      scroll-y
      @scrolltolower="scrolltolower"
      class="scroll-wrapper"
      :scroll-top="scrollViewTop"
      @scroll="handleScroll"
    >
      <view class="color-bg"> </view>
      <view class="swiper-box" v-if="userPetList">
        <view class="swiper-item normal">
          <view class="content">
            <view class="options"
              ><view class="title">品种：</view>
              <view class="options-content">{{ petInfo.categoryName }}</view>
            </view>
            <view class="options">
              <view class="title">年龄：</view>
              <view class="options-content">{{ petInfo.guardTime }}</view>
            </view>
            <view class="options">
              <view class="title">性别：</view>
              <view class="options-content">{{ petInfo.sexName }}</view>
            </view>
            <view class="options">
              <view class="title">绝育：</view>
              <view class="options-content">{{
                sterMap[petInfo.sterilizationStatus]
              }}</view>
            </view>
            <view class="id-num">
              <view>就诊卡号：</view>
              <view>{{ petInfo.petIdNo || "暂无" }}</view>
            </view>
            <view class="avatar-zone">
              <view class="avatar">
                <image :src="petInfo.avatarUrl" mode="aspectFill" />
              </view>

              <view class="edit" @click="editPet">编辑</view>
              <view
                :class="[petInfo.nickName.length > 5 ? 'name-long' : 'name']"
              >
                {{ petInfo.nickName }}
              </view>
            </view>
          </view>
          <view class="green-bg">
            <view class="change-pet" @click="handleOpenPet"
              ><view class="icon"></view
              ><view class="text">切换宠物</view></view
            >
          </view>
        </view>
      </view>
      <view v-else class="pet_emp" @click="addPet"></view>
      <div class="tab-card">
        <view class="list-title" @click="handleTabChange(1)">
          <div class="text">病例记录</div>
          <div v-show="tabIndex == 1" class="line"></div>
        </view>
        <view class="list-title" @click="handleTabChange(2)">
          <div class="text">美洗记录</div>
          <div v-show="tabIndex == 2" class="line"></div>
        </view>
      </div>
      <div class="list-content" v-if="caseList.length">
        <view class="list-wrapper">
          <view
            class="medical-record-item"
            @click="handleMXDetail(item)"
            v-for="(item, index) in caseList"
            :key="index"
          >
            <template v-if="tabIndex == 1">
              <view class="item-title">
                <view class="time-con">
                  <view class="time-icon-con">
                    <image
                      class="time-icon"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/step-tag.png"
                      mode="scaleToFill"
                    />
                  </view>
                  <span class="time-text">{{ item.createTime }}</span>
                </view>
                <image
                  v-if="index === 0"
                  class="last-time-icon"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/last-case-tag.png"
                  mode="scaleToFill"
                />
              </view>

              <view class="item-header">
                <image
                  class="item-header-img"
                  :src="
                    item.type === 'NUTRITION'
                      ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/nutri-top.png'
                      : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/disease-top.png'
                  "
                  mode="scaleToFill"
                />
              </view>
              <view class="item-body">
                <view class="result">
                  <view class="result-title">{{
                    item.type === "NUTRITION" ? "初步结论" : "诊断结果"
                  }}</view>
                  <view class="result-text">
                    <view class="result-diagnosis text-line-two">
                      {{
                        item.type === "NUTRITION"
                          ? item.conclusion || "暂无"
                          : handleMatchDiagnose(item)
                      }}{{
                        item.diagnosisRemarks && item.diagnosisIndex !== 5
                          ? item.diagnosisRemarks
                          : ""
                      }}
                    </view>
                    <!-- <view
                  class="Remarks"
                  v-if="item.diagnosisRemarks && item.diagnosisIndex !== 5"
                >
                  {{}}
                </view> -->
                  </view>
                </view>

                <view class="result" v-if="item.medicines">
                  <view class="result-title">{{
                    `处\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0方`
                  }}</view>
                  <view class="result-text">
                    <view class="result-diagnosis">
                      {{
                        item.prescriptionStatus == `ISSUED`
                          ? "已开具"
                          : item.prescriptionStatus == `EXECUTED`
                          ? "已执行"
                          : "已过期"
                      }}
                    </view>
                  </view>
                </view>

                <view class="result">
                  <view class="result-title" v-if="item.type === 'NUTRITION'"
                    >营养建议
                  </view>
                  <view class="result-title" v-if="item.type !== 'NUTRITION'">{{
                    `医\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0嘱`
                  }}</view>
                  <view class="result-text">
                    <view class="result-diagnosis">
                      {{
                        item.type === "NUTRITION"
                          ? item.nutritionAdvice || "暂无"
                          : item.offlineAdvice || "暂无"
                      }}
                    </view>
                  </view>
                </view>

                <view class="btn-con">
                  <view class="btn" @click="handleDetail(item)">点击查看</view>
                </view>
              </view>
            </template>
            <template v-if="tabIndex == 2">
              <view class="item-title">
                <view class="time-con">
                  <view class="time-icon-con">
                    <image
                      class="time-icon"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/step-tag.png"
                      mode="scaleToFill"
                    />
                  </view>
                  <span class="time-text">{{ item.createdTime }}</span>
                </view>
              </view>

              <view class="item-header">
                <image
                  class="item-header-img"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/mxheader.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="item-body">
                <view class="result">
                  <view class="result-title">门店服务</view>
                  <view class="result-text">
                    <view class="result-diagnosis text-line-two">
                      {{ item.shopName }}
                    </view>
                  </view>
                </view>
                <view class="result">
                  <view class="result-title">服务项目</view>
                  <view class="result-text">
                    <view class="result-diagnosis text-line-two">
                      {{ item.skuName }}
                    </view>
                  </view>
                </view>
                <view class="result">
                  <view class="result-title">服务人员</view>
                  <view class="result-text">
                    <view class="result-diagnosis text-line-two">
                      {{ item.serviceName }}
                    </view>
                  </view>
                </view>
                <view class="btn-con">
                  <view class="btn" @click="handleMXDetail(item)"
                    >点击查看</view
                  >
                </view>
              </view>
            </template>
          </view>
          <view class="no-more" v-if="pageNo * pageSize >= totalCount">
            <text class="dot"></text>
            没有更多了</view
          >
        </view>
      </div>

      <view style="margin-top: 20%" v-else>
        <NoData
          :noDataText="tabIndex == 1 ? '暂无病例记录' : '暂无美洗记录'"
          img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
        ></NoData>
      </view>
    </scroll-view>
    <ChangePetPop
      :petList="petList"
      :selectPetId="petId"
      :isOpen.sync="isPetShow"
      @confirm="handleSelectPet"
      @close="handlePetPopClose"
    />
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getDocDetail, getUserInfo, getPetList } from "@/api/base/index";
import { GET_PET_DETAIL, GET_CASE_LIST, getMxList } from "@/api/index";
//import { wxShareMethod } from "@/utils/wxShare";
import NoData from "@/components/noData/index.vue";
import ChangePetPop from "@/components/changePetPop";

export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: { NoData, ChangePetPop },
  data () {
    return {
      pageScrollState: false,

      statusBarHeight: "",
      petInfo: {
        nickName: "",
        categoryId: "",
        categoryName: "",
        birth: "",
        sex: "",
        sexName: "",
        sterilizationStatus: "",
        sterilizationStatusDesc: "",
        avatarUrl: "",
        guardTime: "",
        petIdNo: "",
      },
      sterMap: {
        0: "未知",
        1: "未绝育",
        2: "已绝育",
      },

      caseList: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      isFinished: false,
      petList: [],
      isPetShow: false,
      scrollViewTop: 0,
      tabIndex: 1,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      userPetList: (state) => state.userPetList,
    }),
  },
  onLoad (option) {
    if (option.petId) {
      this.petId = option.petId;
      GET_PET_DETAIL({ petId: option.petId }).then((res) => {
        console.log(res.data);
        const {
          nickName,
          categoryId,
          categoryName,
          birth,
          sex,
          sexName,
          sterilizationStatus,
          sterilizationStatusDesc,
          avatarUrl,
          petStatus,
          parentCategoryId,
          guardTime,
          petIdNo,
        } = res.data;
        this.petStatus = petStatus;
        this.parentCategoryId = parentCategoryId;
        this.petInfo = {
          nickName,
          categoryId,
          categoryName,
          birth,
          sex,
          sexName,
          sterilizationStatus,
          sterilizationStatusDesc,
          avatarUrl,
          guardTime,
          petIdNo,
        };
      });
      GET_CASE_LIST({
        petId: option.petId,
      }).then((res) => {
        this.caseList = res.data.data;
        this.totalCount = res.data.totalCount;
      });
    }
  },
  onReady () { },
  onShow () {
    uni.getSystemInfo({
      success: (res) => {
        console.log("res ", res);
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    getPetList({ userId: this.userInfo.userId }).then((res) => {
      this.petList = res.data;
    });
  },
  onHide () {
    // this.isPageShow = false;
  },
  methods: {
    ...mapMutations(["setUserInfo", "setUserSelectedPetId"]),
    toSheetList () {
      uni.navigateTo({
        url: "/pagesA/sheetList/index",
      });
    },
    editPet () {
      // #ifdef MP-WEIXIN
       uni.navigateTo({
        url: `/pagesD/editPetProfile/index?petId=${this.petId}&type=edit&transparentTopBar=1`,
      });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesD/editPetProfile/index?petId=${this.petId}&type=edit&apptype=emit&transparentTopBar=1`,
        });
        // #endif
   

    },
    addPet () {
       // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesD/petInfo/index`,
      });
          // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesD/petInfo/index?apptype=add&transparentTopBar=1`,
        });
                // #endif
    },
    async _getUserInfo () {
      try {
        const data = await getUserInfo(true);

        const userInfo = {
          ...this.userInfo,
          ...data,
        };
        this.setUserInfo(userInfo);
        this.DataInfo = data;
      } catch (e) {
        console.error("获取用户信息错误", e);
      }
    },

    setRouter (url, query) {
      uni.reLaunch({
        url,
      });
    },
    handleDetail (item) {
      uni.navigateTo({
        url: `/pagesA/sheetDetail/index?id=${item.consultationSheetId}`,
      });
    },
    handleMXDetail (item) {
      if (this.tabIndex == 1) {
        return;
      }
      uni.navigateTo({
        url: `/pagesE/beautyWashing/index?id=${item.id}`,
      });
    },
    handleReturn () {
      console.log("return");
      uni.navigateBack({
        delta: 1,
      });
    },

    handleMatchDiagnose (item) {
      if (item.diagnosisStatus == "UNDIAGNOSED") return "医生诊断开具中…";
      let diagnoseEnum = {
        1: "待查，需要结合线下进一步诊断",
        2: "用户未及时回复或终止聊天",
        3: "据本次问诊描述，未发现异常",
        5: "暂无",
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
          return res;
        } else {
          return item.diagnosisRemarks || "无";
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
    scrolltolower () {
      console.log("到底");
      if (!this.isFinished) {
        this.pageNo += 1;
        this.getCaseList();
      }
    },
    async getCaseList (ischange) {
      let ls = [];
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      if (this.pageNo * this.pageSize > this.totalCount && !ischange) {
        this.isFinished = true;
        return;
      }

      if (this.tabIndex == 2) {
        let lss = await getMxList({
          ...params,
          reservationType: 1,
          userId: uni.getStorageSync("storage_info").userId,
          petId: this.petId,
        });
        ls = lss.data;
      } else {
        ls = await GET_CASE_LIST({
          petId: this.petId,
          ...params,
        });
      }
      // GET_CASE_LIST({
      //   petId: this.petId,
      //   ...params,
      // }).then((res) => {
      //   if (this.pageNo > 1) {
      //     this.caseList = this.caseList.concat(res.data.data);
      //   } else {
      //     this.caseList = res.data.data;
      //   }
      // });
      if (this.pageNo > 1) {
        this.caseList = this.caseList.concat(ls.data.data || []);
      } else {
        this.caseList = ls.data.data;
      }
      console.log("🚀 ~ getCaseList ~ this.caseList:", this.caseList);
    },
    handleSelectPet (item) {
      this.setUserSelectedPetId(item.id);
      this.petId = item.id;
      this.scrollViewTop = 1;
      uni.redirectTo({
        url: `/pagesA/caseDetail/index?petId=${item.id}`,
      });
    },
    handleOpenPet () {
      this.isPetShow = true;
    },
    handlePetPopClose () {
      this.isPetShow = false;
    },

    handleScroll (e) {
      if (e.detail.scrollTop >= 40) {
        this.pageScrollState = true;
      }
      if (e.detail.scrollTop < 40) {
        this.pageScrollState = false;
        uni.pageScrollTo({
          scrollTop: 0,
        });
      }
    },
    handleTabChange (i) {
      this.tabIndex = i;
      this.caseList = [];
      this.pageNo = 1;
      this.pageSize = 10;
      this.isFinished = false;
      this.getCaseList(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
