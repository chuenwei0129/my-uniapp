<template>
  <view class="poupp">
    <u-popup
      :show="show"
      :round="10"
      mode="center"
      :customStyle="{
        width: '300px',
      }"
      :safeAreaInsetBottom="false"
    >
      <view class="errorContent">
        <view class="errorInfo">
          非常抱歉，服务出现异常，正在紧急修复中。建议您咨询我们的在线医生~
        </view>
        <view class="skinPeo" @click="goback"> 返回在线问诊 </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    show: {
      typeof: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      pingAn: (state) => state.pingAn,
    }),
  },
  methods: {
    goback() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pagesF/health/index",
      });
      // #endif
      // #ifdef H5

      if (this.pingAn) {
        this.$pinganPlugin.back();
        return;
      }

      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
      // this.$emit("handleEndSheet");
    },
    open() {
      // console.log('open');
    },
    close() {
      this.show = false;
      // console.log('close');
    },
  },
};
</script>
<style lang="scss">
.errorContent {
  padding: 40px 24px 13px;
  .errorInfo {
    text-align: center;
    padding-bottom: 41px;
    border-bottom: 1px solid #e6e6e6;
    font-weight: 400;
    font-size: 14px;
    color: #1f1f1f;
  }
  .skinPeo {
    margin-top: 15px;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    color: #1f1f1f;
  }
}
</style>
