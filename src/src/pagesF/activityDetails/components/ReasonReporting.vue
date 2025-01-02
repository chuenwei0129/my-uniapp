<template>
  <u-popup
    :show="show"
    :safeAreaInsetBottom="false"
    :closeOnClickOverlay="true"
    @close="close"
    round="38"
    mode="center"
    @touchmove.stop.prevent
  >
    <view class="content">
      <u-toast ref="uToast"></u-toast>
      <view class="title">举报原因</view>
      <textarea
        placeholder="请写下您举报的原因"
        placeholder-style="color:#999999"
        class="textarea"
        :cursor-spacing="200"
        :maxlength="40"
        :value="tipsContent"
        @input="handleInput"
      >
      </textarea>
      <view class="tips"> {{ num }}/{{ 40 }} </view>
      <view class="btn" @click="submit">提交</view>
    </view>
  </u-popup>
</template>

<script>
import { ACTIVITY_REPORT } from "@/api/activityclube";
export default {
  props: {
    show: {
      type: Boolean,
    },
    aid: {
      type: String,
    },
  },
  data() {
    return {
      tipsContent: "",
      num: 0,
    };
  },
  methods: {
    async submit() {
      const _this = this;
      if (!this.tipsContent) {
        this.$refs.uToast.show({
          message: "举报内容不能为空",
        });
        return;
      }
      const { data } = await ACTIVITY_REPORT({
        activityId: this.aid,
        tipsContent: this.tipsContent,
      });
      if (data.id) {
        console.log(_this.tipsContent, "_this.tipsContent");
        this.$refs.uToast.show({
          message: "举报成功",
          duration: 1000,
          complete() {
            _this.tipsContent = "";
            _this.$emit("close", "close");
          },
        });
      }
    },
    handleInput(e) {
      if (e.detail.cursor < 40) {
        this.num = e.detail.value.length;
        this.tipsContent = e.detail.value;
      } else {
        this.num = 40;
      }
    },
    close() {
      this.$emit("close", "close");
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 46rpx;
  width: 577rpx;
  height: 469rpx;
  // background: #FFFFFF;
  // border-radius: 38px;
}
.title {
  font-size: 31rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  line-height: 42rpx;
  padding: 31rpx 0 23rpx 0;
  text-align: center;
  position: relative;
}
.textarea {
  width: 100%;
  height: 231rpx;
  background: #f5f6f7;
  border-radius: 38rpx;
  padding: 31rpx 31rpx 15rpx 31rpx;
}
.btn {
  font-size: 31rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fee900;
  line-height: 42rpx;
  padding: 25rpx 0 27rpx 0;
  text-align: center;
  border-top: 1rpx solid #e6e6e6;
  margin-top: 46rpx;
}
.tips {
  position: absolute;
  right: 77rpx;
  bottom: 159rpx;
  z-index: 10;
  font-size: 27rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #999999;
  line-height: 38rpx;
}
</style>
