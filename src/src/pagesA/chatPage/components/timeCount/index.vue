<template>
  <view style="margin-top: -5px">
    <view class="page-wrapper" v-if="sheetState == 1">
      <view class="time-zone"
        >本次服务将于：<text>{{ time }}</text
        ><text style="margin-left: 12rpx"></text>后自动结束</view
      >
      <!-- 平安来源问诊不提供主动结束操作 -->
      <view class="button" @click="endSheet" v-if="!ispingAn">结束问诊</view>
    </view>
    <view class="page-wrapper" v-if="sheetState == -1">
      <view class="time-zone"
        >正在为您匹配医生，<view class="sandglass"></view>
        <view class="time">{{ time }}</view>
      </view>
      <view class="button" @click="cancelMatch">取消问诊</view>
    </view>
    <view class="page-wrapper" v-if="sheetState == 5">
      <view class="time-zone">未匹配到医生 </view>
      <view class="button" @click="reMatch">重新匹配</view>
    </view>
    <u-popup
      :show="isShowModal"
      mode="center"
      bgColor="transparent"
      @close="cancel"
      @touchmove.stop.prevent
    >
      <view class="tip-card">
        <view class="pet-icon"></view>
        <view class="content">
          结束服务后将不能再继续与医生交流，确定要结束本次问诊么？
        </view>
        <view class="line"> </view>
        <view class="footer">
          <view class="cancel" @click="cancel">我再想想</view>
          <view class="line2"></view>
          <view class="confirm" @click="confirm">结束问诊</view>
        </view>
      </view>
    </u-popup>
    <u-popup
      :show="isShowModalCancelMatch"
      mode="center"
      bgColor="transparent"
      @close="cancel"
      @touchmove.stop.prevent
    >
      <view class="tip-card">
        <view class="pet-icon"></view>
        <view class="content"> 医生正在赶来的路上</view>
        <view class="line"> </view>
        <view class="footer">
          <view class="cancel" @click="confirmMatch">我要取消</view>
          <view class="line2"></view>
          <view class="confirm" @click="cancel">再等等</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  components: {},
  props: {
    remainingTime: {
      type: Number,
    },
    groupId: {
      type: String,
    },
    sheetState: {
      type: Number,
    },
    ispingAn: {
      type: Boolean,
    },
  },

  data() {
    return {
      time: 0,
      timer: null,
      isShowModal: false,
      // content: "是否提前结束本次服务？",
      content: "结束服务后将不能再继续与医生交流，确定要结束本次问诊么？",
      isShowModalCancelMatch: false,
    };
  },

  mounted() {
    // this.handleTime();
  },
  methods: {
    handleTime(props) {
      let timecount = props;
      let m, s;
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        if (timecount > 1) {
          timecount--;
          m = Math.floor(timecount / 60);
          s = timecount % 60;
          m = m < 10 ? "0" + m : m;
          s = s < 10 ? "0" + s : s;
          this.time = `${m}:${s}`;
        } else {
          //   isShowTime.value = false;
          // emit("timeout");
          clearInterval(this.timer);
        }
      }, 1000);
    },
    endSheet() {
      console.log("点击结束问诊");
      action_report({
        action_name: "IntelligentconsultationIM_EndTheConsultation_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      var that = this;
      this.isShowModal = true;
      this.$emit("showAllSelect", false);
    },
    cancelMatch() {
      this.isShowModalCancelMatch = true;
    },
    confirm() {
      this.$emit("handleEndSheet");
    },
    confirmMatch() {
      this.$emit("handleCancelMatch");
    },
    cancel() {
      this.isShowModal = false;
      this.isShowModalCancelMatch = false;
      this.$emit("showAllSelect", true);
    },
    reMatch() {
      this.$emit("handleReMatch");
    },
  },
  watch: {
    remainingTime: {
      handler: function (val) {
        this.time = 0;
        this.handleTime(this.remainingTime);
      },
      immediate: true,
    },
    time: {
      handler(newVal, oldVal) {
        // console.log("计时器时间监听", newVal, oldVal);
        if (newVal == "00:01") {
          console.log(111);
          this.$emit("handleCancleSheet", false);
          // this.$emit("showAllSelect", false);
        }
      },
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
