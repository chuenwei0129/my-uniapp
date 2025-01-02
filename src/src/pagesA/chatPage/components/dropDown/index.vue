<template>
  <view>
    <view class="pannel">
      <view class="item">
        <view class="title">爱宠名称：</view>
        <view class="content">{{
          (detail.petInformation && detail.petInformation.nickName) || ""
        }}</view>
      </view>
      <view class="item">
        <view class="title">品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种：</view>
        <view class="content"
          >{{ detail.petInformation ? detail.petInformation.age : "" }} &nbsp;
          <text style="padding-left: 8rpx">{{
            detail.petInformation ? detail.petInformation.categoryName : ""
          }}</text></view
        >
      </view>
      <view class="item">
        <view class="title">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</view>
        <view class="content"
          >{{
            detail.petInformation
              ? detail.petInformation.gender == 1
                ? "GG"
                : "MM"
              : ""
          }}
          <text style="padding-left: 8rpx">{{
            detail.petInformation
              ? sterilizationEnum[detail.petInformation.sterilizationStatus]
              : ""
          }}</text></view
        >
      </view>
      <view
        class="item"
        v-if="
          detail.petInformation &&
          detail.petInformation.weight &&
          detail.petInformation.weight != 0
        "
      >
        <view class="title">当前体重：</view>
        <view class="content"
          >{{
            detail.petInformation ? detail.petInformation.weight : ""
          }}kg</view
        >
      </view>
      <view
        class="item"
        v-if="
          detail.petInformation &&
          Array.isArray(detail.petInformation.dietHabit)
        "
      >
        <view class="title">主食习惯：</view>
        <view class="content">
          {{
            Array.isArray(detail.petInformation.dietHabit) &&
            detail.petInformation.dietHabit.join("、")
          }}</view
        >
      </view>
      <view
        class="item"
        v-if="
          detail.petInformation && detail.petInformation.dailyExerciseAmount
        "
      >
        <view class="title"> 运&nbsp;动&nbsp;量：</view>
        <view class="content">{{
          detail.petInformation ? detail.petInformation.dailyExerciseAmount : ""
        }}</view>
      </view>
      <view
        class="item"
        v-if="detail.petInformation && detail.petInformation.medicalDemand"
      >
        <view class="title">问诊诉求：</view>
        <view class="content">{{
          detail.petInformation.medicalDemand.join("、")
        }}</view>
      </view>
      <view
        class="item"
        v-if="
          detail.inquiryType !== 'NUTRITION' &&
          detail.inquiryType !== 'ONLINE_PRESCRIPTION'
        "
      >
        <view class="title">疫苗情况：</view>
        <view class="content">
          {{
            detail.petInformation
              ? vaccineEnum[detail.petInformation.vaccine]
              : ""
          }}</view
        >
      </view>
      <view
        class="item"
        v-if="
          detail.inquiryType !== 'NUTRITION' &&
          detail.inquiryType !== 'ONLINE_PRESCRIPTION'
        "
      >
        <view class="title">是否驱虫：</view>
        <view class="content">{{
          detail.petInformation
            ? ["定时驱虫", "未定时驱虫", "未做驱虫"][
                detail.petInformation.expelInsects - 1
              ] || ""
            : ""
        }}</view>
      </view>
      <view
        class="item"
        v-if="Array.isArray(detail.symptomType) && detail.symptomType.length"
      >
        <view class="title">症状类型：</view>
        <view class="content">
          {{
            detail.symptomType
              .map((i) => {
                return i.tagName;
              })
              .join("、")
          }}</view
        >
      </view>
      <view
        class="item"
        v-if="detail.petInformation && detail.petInformation.symptomDuration"
      >
        <view class="title">症状时长：</view>
        <view class="content">{{
          detail.petInformation ? detail.petInformation.symptomDuration : ""
        }}</view>
      </view>
      <view class="item-img">
        <view class="title">{{
          detail.inquiryType !== "NUTRITION" ? "主诉症状：" : "具体描述："
        }}</view>
        <view class="content">{{
          detail.petInformation ? detail.petInformation.illnessDesc : ""
        }}</view>
      </view>
      <view
        class="item-img"
        v-if="
          detail.petInformation &&
          detail.petInformation.symptomImags &&
          detail.petInformation.symptomImags.length
        "
      >
        <view class="title">症状照片：</view>
        <view class="content img-wrapper">
          <view
            v-for="(item, index) in detail.petInformation.symptomImags"
            :key="index"
          >
            <image
              :src="item"
              mode="scaleToFill"
              @click="
                () => {
                  imgPreview(item);
                }
              "
            />
          </view>
        </view>
      </view>
    </view>
    <view class="drop-up" @click="handleCloseUp"></view>
  </view>
</template>

<script>
import { getSheetsDetail } from "@/api/sheets";

export default {
  components: {},
  props: {
    inquiryType: {
      type: String,
    },
    sheetState: {
      type: Number,
    },
    sheetId: {
      type: String,
    },
  },
  data() {
    return {
      isFold: true,
      detail: {},
      vaccineEnum: {
        0: "",
        1: "已接种",
        2: "未接种",
        3: "接种不全",
        4: "接种不详",
      },
      sterilizationEnum: {
        0: "绝育未知",
        1: "未绝育",
        2: "已绝育",
      },
      genderEnum: {
        1: "GG",
        2: "MM",
        3: "GG",
        4: "MM",
        5: "未知",
      },
      expelInsectsEnum: {
        1: "定时驱虫",
        2: "未定时驱虫",
        3: "未做驱虫",
      },
    };
  },
  computed: {},
  watch: {
    sheetId: {
      handler(newVal, oldVal) {
        this._getSheetsDetail("watch");
      },
      // immediate: true,
    },
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    this._getSheetsDetail();
    // #endif
  },
  mounted() {
    // #ifdef H5
    if (this.sheetId) {
      this._getSheetsDetail();
    }
    // #endif
  },
  methods: {
    async _getSheetsDetail(source) {
      if (this.sheetId) {
        try {
          const res = await getSheetsDetail({
            id: this.sheetId,
          });
          this.detail = res.data;
        } catch (e) {
          console.error("获取详情失败", e);
        }
      } else {
        console.error("获取问诊单详情失败");
      }
    },
    handleCloseUp() {
      this.$emit("closeUp", false);
    },
    imgPreview(url) {
      uni.previewImage({
        urls: [url], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: url, // 当前显示图片的http链接，默认是第一个
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
