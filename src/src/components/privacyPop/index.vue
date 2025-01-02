<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
    :closeOnClickOverlay="false"
    @touchmove.stop.prevent
  >
    <view class="title">隐私保护协议</view>
    <view class="top-text"
      >我们将通过
      <span class="link" @click="handleGoToPrivacy">《隐私政策》</span>
      帮助您了解我们收集、使用、存储和共享个人信息情况。在您使用宠胖胖服务前，请您充分了解隐私政策中的相关条款内容</view
    >
    <view class="protocol">{{ protocol }}</view>
    <view
      class="button button-agree"
      :style="{
        backgroundColor:
          source == 'med' ? 'rgba(45, 206, 128, 1)' : 'rgba(255, 131, 21, 1)',
      }"
      @click="handleConfirm"
    >
      <button
        style="
          border: none;
          outline: none;
          height: 100%;
          width: 100%;
          background-color: transparent;
          color: #fff;
        "
        id="agree-btn"
        open-type="agreePrivacyAuthorization"
        bindagreeprivacyauthorization="handleAgreePrivacyAuthorization"
      >
        同意并继续
      </button>
    </view>
    <view class="button button-disagree" @click="handleCancel">
      <navigator open-type="exit" target="miniProgram">不同意</navigator></view
    >
  </u-popup>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    protocol: {
      type: String,
    },
    source: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["userSelectedPetId"]),
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    handleOpen() {},
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      // this.selectIndex = 0;
    },
    handleConfirm() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleGoToPrivacy() {
      wx.openPrivacyContract();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
