<template>
  <view class="health-list">
    <!-- 驱虫卡片 -->
    <ItemStatics
      title="驱虫"
      type="QU_CHONG"
      :petId="petId"
      :info="data.petGrowthRecordMap && data.petGrowthRecordMap['QU_CHONG']"
      v-if="!ifother"
      @goRecord="goRecord"
    ></ItemStatics>
    <!-- 美洗卡片 -->
    <ItemStatics
      title="美洗"
      type="MEI_XI"
      :petId="petId"
      :info="data.petGrowthRecordMap && data.petGrowthRecordMap['MEI_XI']"
      @goRecord="goRecord"
    ></ItemStatics>
    <!-- 疫苗卡片 -->
    <ItemStatics
      title="疫苗"
      type="YI_MIAO"
      :petId="petId"
      :info="data.petGrowthRecordMap && data.petGrowthRecordMap['YI_MIAO']"
      v-if="!ifother"
      @goRecord="goRecord"
    ></ItemStatics>
    <!-- 体检卡片 -->
    <ItemStatics
      title="体检"
      type="TI_JIAN"
      :petId="petId"
      :info="data.petGrowthRecordMap && data.petGrowthRecordMap['TI_JIAN']"
      @goRecord="goRecord"
    ></ItemStatics>

    <view class="bottom-block">
      <!-- 在线问诊 -->
      <!-- 就诊记录 -->
      <view class="bottom-item online-medical" @click="toOnlineAsk">
        <view class="title-deader">
          <view class="title-icon"></view>
          <view>在线问诊</view>
          <view class="right-arrow"></view>
        </view>
        <view class="total-num"
          ><view class="count">{{ data.onlineConsultationCount || "-" }}</view
          >{{ data.onlineConsultationCount ? "次" : "" }}</view
        >
        <view class="date" v-if="data.recentConsultationTime"
          >最近：{{
            data.recentConsultationTime
              ? data.recentConsultationTime.replaceAll("-", "/")
              : "-"
          }}</view
        >
      </view>
      <view class="bottom-item ask-record" @click="toMedical">
        <view class="title-deader">
          <view class="title-icon"></view>
          <view>病历</view>
          <view class="right-arrow"></view>
        </view>
        <view class="total-num"
          ><view class="count">{{ data.medicalRecordsCount || "-" }}</view
          >{{ data.medicalRecordsCount ? "次" : "" }}</view
        >
        <view class="date" v-if="data.recentMedicalRecordTime"
          >最近：{{
            data.recentMedicalRecordTime
              ? data.recentMedicalRecordTime.replaceAll("-", "/")
              : "-"
          }}</view
        >
      </view>
    </view>
  </view>
</template>
<script>
import { action_report } from "@/utils/track";
import ItemStatics from "./itemstatics.vue";
export default {
  components: {
    ItemStatics,
  },
  props: {
    petId: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      default: {},
    },
    petList: {
      type: Array,
      default: [],
    },
  },
  computed: {
    ifother() {
      return this.petList.filter((item) => item.id == this.petId)[0]?.otherPet;
    },
  },
  methods: {
    goRecord(petId) {
      // #ifdef H5
      this.$dsBridge.call(
        "goPetRecord",
        JSON.stringify({
          petId: petId,
          activeTabIndex: 0,
          petName: this.petList.filter((item) => item.id == petId)[0]?.nickName,
        })
      );
      // #endif
    },
    toMedical() {
      action_report({
        action_name: "petfiles_healthy_medicalrecord_click",
        module_name: "petfiles",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/recordALL/index?activetype=CASE&petId=${this.petId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call(
        "goPetRecordHistoryPage",
        JSON.stringify({
          petId: this.petId,
          tabMark: "CASE",
        })
      );
      // #endif
    },
    toOnlineAsk() {
      action_report({
        action_name: "petfiles_healthy_onlineconsultation_click",
        module_name: "petfiles",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
      console.log('action_name');
      
      //在线问诊
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/sheetList/index`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/medical/inquiry/records`,
      });
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.bottom-block {
  width: 100%;
  padding-bottom: 65rpx;
  display: flex;
  .bottom-item {
    width: 335rpx;
    height: 217rpx;
    display: inline-block;
    background: #ffffff;
    border-radius: 23rpx;
    padding: 31rpx;
    &:nth-child(2n + 1) {
      margin-right: 23rpx;
      margin-left: 29rpx;
    }
    .title-deader {
      display: flex;
      align-items: center;
      margin-bottom: 23rpx;
      font-size: 31rpx;
      font-weight: bold;
      line-height: 42rpx;
      .title-icon {
        width: 38rpx;
        height: 38rpx;
        margin-right: 10rpx;
      }
      .right-arrow {
        margin-left: auto;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/expandicon.png"
        );
        width: 23rpx;
        height: 23rpx;
      }
    }
    .total-num {
      display: flex;
      align-items: center;
      @include textfclaw(25rpx, #666666, $align: left, $lineH: 35rpx);
      margin-bottom: 15rpx;
      .count {
        color: #1f1f1f;
        font-size: 46rpx;
        line-height: 50rpx;
        font-weight: bold;
        font-family: "D-DIN, D-DIN";
        margin-right: 10rpx;
      }
    }
    .date {
      @include textfclaw(23rpx, #999999, $align: left, $lineH: 33rpx);
    }
  }
}
.online-medical {
  .title-deader {
    color: #00b9dc;
  }
  .title-icon {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/medicalicon.png"
    );
  }
}
.ask-record {
  .title-deader {
    color: #ff5b05;
  }
  .title-icon {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/askrecordicon.png"
    );
  }
}
</style>
