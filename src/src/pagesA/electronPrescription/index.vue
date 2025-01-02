<template>
  <view class="page-wrapper" v-if="detail">
    <!-- #ifdef H5 -->
    <NavBar
      v-if="source != 30"
      title=" "
      navColor=""
      :whiteBack="false"
      showBackBtn
      @navBackClickHandle="handleReturn"
      :customback="true"
    >
    </NavBar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="header-top">
      <view class="status-bar" :style="{ height: statusBarHeight }"></view>
      <view class="return" @click="handleReturn"></view>
      <text></text>
    </view>
    <!-- #endif -->
    <view class="color-bg"> </view>
    <!-- <view style="height: 177rpx; width: 100%" v-if="pageScrollState"></view> -->
    <scroll-view
      scroll-y
      @scrolltolower="scrolltolower"
      class="scroll-wrapper"
      :class="[
        'EXPIRED' == detail.diagnosticSheet.prescriptionStatus ||
        detail.diagnosticSheet.medicines == null
          ? 'up'
          : '',
        source == 30 ? 'pingan-scroll-wrapper' : '',
      ]"
      :scroll-top="scrollViewTop"
      @scroll="handleScroll"
      :enhanced="true"
      :bounces="false"
    >
      <view
        class="content-bg"
        :class="[
          'EXPIRED' == detail.diagnosticSheet.prescriptionStatus ||
          detail.diagnosticSheet.medicines == null
            ? 'minup'
            : '',
          source == 30 ? 'pingan-content-bg' : '',
        ]"
      >
        <view class="content-layout-up">
          <view class="content-top">
            <view class="title-and-icon">
              <view class="tai-title">{{
                detail.diagnosticSheet.medicines &&
                detail.diagnosticSheet.medicines.length
                  ? "电子处方笺"
                  : "诊断小结"
              }}</view>
              <view class="tai-icon">
                <image :src="getPrescriptionStatus(detail)"> </image>
              </view>
            </view>

            <view class="doctor-information">
              <span>医师：{{ detail.doctorInfo.userName }}</span>
              <span :style="{ marginLeft: '20rpx' }"
                >兽医资格证：{{
                  detail.doctorInfo.veterinaryCertificateId
                }}</span
              ></view
            >
          </view>

          <image
            class="lineImg"
            src="https://image.henhenchina.com/61ee0fe4f58112000178d924/c3f5ea2806844510984817483fe3110f.png"
          >
          </image>

          <view class="infos">
            <view class="petInfo">
              <view class="petInfo-type">宠物名称</view>
              <view class="petInfo-msg">{{
                detail.petInformation.nickName
              }}</view>
            </view>
            <view class="petInfo">
              <view class="petInfo-type">基础信息</view>
              <view class="petInfo-msg">{{
                [
                  detail.petInformation.age,
                  detail.petInformation.categoryName,
                  detail.petInformation.gender === 1 ? "GG" : "MM",
                  detail.petInformation.hairColor,
                ]
                  .filter(Boolean)
                  .join(" ")
              }}</view>
            </view>
            <view class="petInfo">
              <view class="petInfo-type">当前体重</view>
              <view v-if="weight" class="petInfo-msg">
                {{ weight + "kg" }}
              </view>
              <view v-else class="petInfo-msg"> 0kg </view>
            </view>
            <view class="petInfo">
              <view class="petInfo-type">初步诊断</view>
              <view class="petInfo-msg">{{ handleMatchDiagnose(detail) }}</view>
            </view>
            <view
              class="petInfo"
              v-if="detail.diagnosticSheet.diagnosisRemarks"
            >
              <view class="petInfo-type">备注内容</view>
              <view class="petInfo-msg">{{
                detail.diagnosticSheet.diagnosisRemarks || "无"
              }}</view>
            </view>
          </view>

          <image
            class="lineImg"
            src="https://image.henhenchina.com/61ee0fe4f58112000178d924/c3f5ea2806844510984817483fe3110f.png"
          >
          </image>

          <view
            class="drugs"
            v-if="
              detail.diagnosticSheet.medicines &&
              detail.diagnosticSheet.medicines.length
            "
          >
            <view class="drugs-top">
              <view class="drugs-title">Rp 普通药品处方</view>
              <view class="drugs-btn">
                <view class="drugs-btn-str" @click="handyscf"> 原始处方 </view>
              </view>
            </view>
          </view>
          <view
            class="no-drugs"
            v-if="
              detail.diagnosticSheet.medicines &&
              !detail.diagnosticSheet.medicines.length
            "
          >
            以下空白修改无效
          </view>

          <view class="drugs-bg">
            <view
              v-for="(item, index) in detail.diagnosticSheet.medicines"
              :key="index"
            >
              <view class="drugs-item">
                <view class="item-name-num">
                  <view class="item-name">{{ item.name }}</view>
                  <view class="item-num">{{
                    `x ${item.quantity} ${item.quantityUnit}`
                  }}</view>
                </view>
                <view class="item-usage"
                  >用法用量：{{ item.usageInstructions }}</view
                >
              </view>
            </view>
          </view>

          <!--          <image-->
          <!--            class="lineImg"-->
          <!--            v-if="detail.diagnosticSheet.medicines.length"-->
          <!--            src="https://image.henhenchina.com/61ee0fe4f58112000178d924/c3f5ea2806844510984817483fe3110f.png"-->
          <!--          >-->
          <!--          </image>-->
        </view>
        <view class="content-layout-down">
          <image
            class="lineImg"
            src="https://image.henhenchina.com/61ee0fe4f58112000178d924/c3f5ea2806844510984817483fe3110f.png"
          >
          </image>
          <view class="doctor-suggestions">
            <view class="offline" v-if="detail.diagnosticSheet.offlineAdvice"
              ><span style="font-weight: bold">医嘱：</span>
              {{ detail.diagnosticSheet.offlineAdvice }}</view
            >
            <view
              class="other-suggestions"
              v-if="detail.diagnosticSheet.otherAdvice"
              ><span style="font-weight: bold">其他建议：</span
              >{{ detail.diagnosticSheet.otherAdvice }}</view
            >
            <view class="time"
              ><span style="font-weight: bold">医嘱时间：</span
              >{{ detail.diagnosticSheet.originalTime }}</view
            >
            <view class="time" v-if="detail.diagnosticSheet.createTime"
              ><span style="font-weight: bold">修改时间：</span
              >{{ detail.diagnosticSheet.createTime }}</view
            >
            <!-- <view class="seal">
                        <image
                            src="https://image.henhenchina.com/61ee0fe4f58112000178d924/99471e043d924071b672f495755e95fa.png">
                        </image>
                    </view> -->
          </view>

          <view class="line2bg">
            <image
              class="line2"
              src="https://image.henhenchina.com/61ee0fe4f58112000178d924/2e5ea6cdecef4bee803f7ce94860aa79.png"
            >
            </image>
          </view>
        </view>
      </view>

      <!-- <view class="line-buttom"></view> -->
    </scroll-view>

    <view
      class="content-head"
      :class="source == 30 ? 'pingan-content-head' : ''"
    >
      <image
        src="https://image.henhenchina.com/61ee0fe4f58112000178d924/519fea8dddd94b56aabb90646f2f6814.png"
      >
      </image>
    </view>

    <view
      v-if="
        detail.diagnosticSheet.medicines &&
        detail.diagnosticSheet.medicines.length &&
        'ISSUED' == detail.diagnosticSheet.prescriptionStatus
      "
      class="btn-bg"
      @click="buyingMedicine"
    >
      <view class="buy-drugs-btn">
        <view class="btn-text">按处方购药</view>
      </view>
    </view>

    <view
      v-else-if="
        detail.diagnosticSheet.medicines &&
        detail.diagnosticSheet.medicines.length &&
        'EXECUTED' == detail.diagnosticSheet.prescriptionStatus
      "
      class="btn-bg"
      @click="goOrderDetail(detail.orderInfo)"
    >
      <view class="buy-drugs-btn1">
        <view class="btn-text">查看订单</view>
      </view>
    </view>

    <OutOfStockPop
      v-if="checkMedical"
      :isOpen.sync="isCouponShow"
      @close="handleCouponClose"
      :source="source"
      :inStockProducts="checkMedical.inStockProducts"
      :outOfStockProducts="checkMedical.outOfStockProducts"
      :diagnosticSheetId="detail.diagnosticSheet.id"
    />
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
//import { wxShareMethod } from "@/utils/wxShare";
import NoData from "@/components/noData/index.vue";
import { getSheetsDetail, getCheckMedical } from "@/api/sheets";
import OutOfStockPop from "@/pagesA/electronPrescription/components/outOfStockPop/index.vue";
import { action_report } from "@/utils/track";
import { thirdPartyLoginFun } from "@/utils/config";
import NavBar from "@/components/navBar/index.vue";
/**
 * 区分环境接口请求地址
 */
 const SHARE_BASR_URL =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test" ||
  process.env.NODE_ENV === "development-local"
    ? "https://cn-dev02-shareactivity.chongpangpang.com/"
    : "https://shareactivity.chongpangpang.com/";
export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: { NoData, OutOfStockPop, NavBar },

  data() {
    return {
      id: "649b8ed51e82150001442669",
      pageScrollState: false,
      statusBarHeight: "",
      scrollViewTop: 0,
      detail: undefined,
      isCouponShow: false,
      checkMedical: undefined,
      source: null, //PINGAN 平安app
      openId: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
    weight() {
      console.log(
        "weight",
        this.detail?.diagnosticSheet,
        this.detail?.petInformation
      );
      if (
        this.detail?.diagnosticSheet &&
        this.detail?.diagnosticSheet?.weight
      ) {
        return this.detail?.diagnosticSheet?.weight;
      } else {
        return this.detail?.petInformation?.weight;
      }
    },
  },
  onLoad(option) {
    console.log("onLoad", option);

    this.id = option.id;

    if (option.source) {
      this.source = Number(option.source);
    }
    if (option.openId) {
      this.openId = option.openId;
    }
  },
  onReady() {},
  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        console.log("res ", res);
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    if (this.source && this.source == 30 && this.openId) {
      console.log("进入平安1", this.openId);
      // source:''//PINGAN 平安app
      thirdPartyLoginFun(
        {
          openId: this.openId,
          thirdType: Number(this.source),
        },
        () => this._getSheetsDetail()
      );
    } else {
      this._getSheetsDetail();
    }
  },
  onHide() {},
  mounted() {
    // #ifdef H5
    document.title = "电子处方笺";
    // #endif
  },
  // #ifdef H5
  watch: {
    detail: {
      handler(region, oldRegion) {
        document.title =
          this.detail?.diagnosticSheet?.medicines &&
          this.detail?.diagnosticSheet?.medicines?.length
            ? "电子处方笺"
            : "诊断小结";
      },
      immediate: true,
      deep: true,
    },
  },
  // #endif
  methods: {
    ...mapMutations(["setUserInfo"]),

    scrolltolower() {
      console.log("到底");
    },

    handleReturn() {
      console.log("return");
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      // 平安app关闭webview方式
      if(this.source==30){
        const { back } = this.$pinganPlugin;
      console.log(back);
      back();
      }else{
        this.$dsBridge.call("closeCurrentWebview", {}); //关闭webview
      }

      // #endif
    },

    handleScroll(e) {
      // if (e.detail.scrollTop >= 40) {
      //     this.pageScrollState = true;
      // }
      // if (e.detail.scrollTop < 40) {
      //     this.pageScrollState = false;
      //     uni.pageScrollTo({
      //         scrollTop: 0,
      //     });
      // }
    },

    async _getSheetsDetail() {
      console.log(123564);

      console.log("_getSheetsDetail", this.id);
      try {
        const res = await getSheetsDetail({
          id: this.id,
        });
        this.detail = res.data;
        console.log("_getSheetsDetail detail ", this.detail);
      } catch (e) {
        console.error("获取详情失败", e);
      }
    },

    async _getCheckDrug() {
      console.log("_getCheckDrug", this.id);
      try {
        const res = await getCheckMedical({
          diagnosticSheetId: this.detail.diagnosticSheet.id,
        });
        this.checkMedical = res.data;
        console.log("_getCheckDrug ", this.checkMedical);
      } catch (e) {
        console.error("处方药品信息校验接口", e);
      }
    },

    handleMatchDiagnose(detail) {
      console.log("handleMatchDiagnose:", detail);
      if (!detail) {
        return "";
      }
      let diagnoseEnum = {
        1: "待查，需要结合线下进一步诊断",
        2: "用户未及时回复或终止聊天",
        3: "据本次问诊描述，未发现异常",
        5: "无",
      };
      if (detail.diagnosticSheet) {
        if (detail.diagnosticSheet.diagnosisIndex == 4) {
          if (
            Array.isArray(detail.diagnosticSheet.diagnosis) &&
            detail.diagnosticSheet.diagnosis.length
          ) {
            let name = detail.diagnosticSheet.diagnosis
              .map((i) => {
                return i.name;
              })
              .join("、");

            let res = "【拟】" + name;
            return res;
          } else {
            return "";
          }
        } else {
          if (detail.diagnosticSheet.diagnosisIndex == 5) {
            let name = diagnoseEnum[detail.diagnosticSheet.diagnosisIndex];
            let res = name;
            return res;
          } else {
            let name = diagnoseEnum[detail.diagnosticSheet.diagnosisIndex];
            let res = name;
            return res;
          }
        }
      }
    },

    getPrescriptionStatus(detail) {
      //处方单状态 已开具：ISSUED；已执行：EXECUTED；已过期：EXPIRED；
      if (detail) {
        if ("ISSUED" == detail.diagnosticSheet.prescriptionStatus) {
          return "https://image.henhenchina.com/61ee0fe4f58112000178d924/4c698702fdd34412a7e1f5972f430124.png";
        } else if ("EXECUTED" == detail.diagnosticSheet.prescriptionStatus) {
          return "https://image.henhenchina.com/61ee0fe4f58112000178d924/c05f4faff4d64b5abe2e01a69c8fe124.png";
        } else if ("EXPIRED" == detail.diagnosticSheet.prescriptionStatus) {
          return "https://image.henhenchina.com/61ee0fe4f58112000178d924/afacb939d27f4a8cb26de48d62e25a11.png";
        }
      }
    },

    handleCouponClose() {},

    //原始处方
    imgPreviewPrescription(url) {
      uni.previewImage({
        urls: [url], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: url, // 当前显示图片的http链接，默认是第一个
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      });
    },

    handyscf() {
      this.imgPreviewPrescription(
        this.detail.diagnosticSheet.prescriptionImageUrl
      );
    },

    async buyingMedicine() {
      console.log("buyingMedicine = ");
      await this._getCheckDrug();
      action_report({
        action_name: "med_transaction",
        module_name: "transaction",
      });

      if (
        this.checkMedical.outOfStockProducts &&
        this.checkMedical.outOfStockProducts.length
      ) {
        this.isCouponShow = true;
      } else {
        // #ifdef H5
        if(this.source==30){
          uni.navigateTo({
          url: `/pagesA/bussinessOrder/confirmOrderPage/index?diagnosticSheetId=${this.detail.diagnosticSheet.id}&source=${this.source}`,
          });
        }else{
          this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${SHARE_BASR_URL}h5/shareActivity/?random=123#/buyerOrderSubmit?id=${this.detail.diagnosticSheet.id}`,
          });
        }
        // #endif
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesA/bussinessOrder/confirmOrderPage/index?diagnosticSheetId=${this.detail.diagnosticSheet.id}&source=${this.source}`,
        });
        // #endif
      }
    },

    viewOrders() {
      console.log("viewOrders = ");
    },

    goOrderDetail(item) {
      console.log("goOrderDetail", item);
      // #ifdef H5
      if (this.source == 30) {
        this.$pinganPlugin.openPage(
          `${window.location.origin}/crm-medical-h5/#/pagesA/bussinessOrder/orderDetail/index?orderNo=${item.orderNo}&source=${this.source}`
        );
      } else {
        // uni.navigateTo({
        //   url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${item.orderNo}&source=${this.source}`,
        // });
        // https://cn-dev02-shareactivity.chongpangpang.com/h5/shareActivity/?random=123#/buyerOrderDetail/CPP428381880016015361?transparentTopBar=1"
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${SHARE_BASR_URL}h5/shareActivity/?random=123#/buyerOrderDetail/${item.orderNo}?transparentTopBar=1`,
        });
      }
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${item.orderNo}`,
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
