<template>
  <u-popup
    :show="isOpen"
    mode="center"
    @open="handleOpen"
    @close="close"
    :round="20"
    @touchmove.stop.prevent
    :safeAreaInsetBottom="false"
  >
    <view class="petPop">
      <view class="header">
        <view class="title">取消预约</view>
        <!-- <view class="close-icon" @click="handleCancel"></view> -->
      </view>

      <view class="list">
        <view
          class="item"
          v-for="(item, index) in items"
          :key="index"
          @click="handleSelect(index)"
        >
          <view class="up">
            <view class="text">{{ items[index] }} </view>
            <view class="gou" v-if="index == itemIndex"></view>
            <view class="no-gou" v-else></view>
          </view>
          <view class="down" v-if="items[index] == '其他' && itemIndex == 5">
            <view class="textareaBox">
              <u--textarea
                v-model="inputValue"
                placeholder="请输入退款原因"
                maxlength="30"
                :formatter="limitationNum"
                border="none"
                :showConfirmBar="false"
                height="40"
                @change="symptomChange(inputValue)"
                :customStyle="{
                  color: '#1f1f1f',
                  backgroundColor: '#F7F8FC',
                  borderRadius: '1rpx',
                  padding: '4rpx',
                }"
              ></u--textarea>
              <view class="numBox"
                ><span :class="[inputValue.length > 0 ? 'active' : '']">{{
                  inputValue.length
                }}</span
                >/30</view
              >
            </view>
          </view>
        </view>
      </view>

      <view class="btns">
        <view class="no" @click="handleNo">
          <view class="text"> 再想想 </view>
        </view>
        <view
          v-if="itemIndex == 5"
          :class="[inputValue.length > 0 ? 'ok' : 'no-ok']"
          @click="handleYes"
        >
          <view class="text"> 确定 </view>
        </view>
        <view v-else class="ok" @click="handleYes">
          <view class="text"> 确定 </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { action_report, display_report } from "@/utils/track";
import { GET_RESERVATION_CANCEL } from "@/api/reservation";
const module_name = "store";
export default {
  props: {
    isOpen: {
      type: Boolean,
      // default: false,
    },
    detail: {
      type: Object,
    },
  },
  data() {
    return {
      items: [
        "不需要了",
        "计划有变",
        "太贵了",
        "太远了",
        "有更好的选择",
        "其他",
      ],
      itemIndex: 0,
      inputValue: "",
      canceling: false,
    };
  },

  components: {},
  computed: {
    isAnd() {
      return false; //uni.$u.os() === "android";
    },
  },
  onLoad(options) {},
  onUnload() {},
  onReady() {},
  watch: {},
  mounted() {},
  methods: {
    symptomChange(value) {
      this.inputValue = value.trim();
    },
    handleOpen() {},
    handleCancel() {
      this.close();
    },
    close() {
      console.log("close");
      this.$emit("update:isOpen", false);
      // this.$emit("close", false);
    },

    handleNo() {
      this.close();
    },

    handleYes() {
      console.log("handleYes: ", this.inputValue, this.itemIndex);
      console.log("this.detail.reservationId ", this.detail.id);
      if (this.itemIndex == 5 && this.inputValue == "") {
        uni.showToast({
          title: "请输入其他原因",
          duration: 500,
          icon: "none",
        });
        return;
      }
      if (!this.canceling) {
        this.canceling = true;
        let params = {
          channelSource: 2,
          reason:
            this.itemIndex == 5 ? this.inputValue : this.items[this.itemIndex],
          reservationId: this.detail.id,
        };
        this._reservationCancel(params);
      }
    },

    async _reservationCancel(params) {
      try {
        const res = await GET_RESERVATION_CANCEL(params);

        console.log("res ", res);

        this.close();
        this.canceling = false;

        this.$emit("sendSuccess", {});
      } catch (e) {
        console.error("取消失败", e);
        this.canceling = false;
      }

      action_report({
        action_name: "appointment_cancelorder_clk",
        module_name: module_name,
        extend: {},
      });
    },

    handleSelect(index) {
      this.itemIndex = index;
      console.log("this.itemIndex ", this.itemIndex);
    },

    sendMessText() {
      console.log("sendMessText");
    },

    handleChange() {},
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
