<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @close="handleCancel"
    :round="20"
    class="ppop"
    @touchmove.stop.prevent
  >
    <view class="petPop">
      <view class="header">
        <view class="title">洗护风险责任书</view>
        <image
          class="cancel"
          @click="handleCancel"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/del.png"
          fit="contain"
        />
      </view>
      <div class="word" v-html="signBookWord"></div>
      <view class="footers">
        <view class="new" @click="handleConfirm">
          <view class="text">我已阅读并同意</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { readedSignInBook } from "@/api/reservation";

export default {
  components: {},
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    signBookWord: {
      type: String,
      default() {
        return "";
      },
    },
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    isOpen: {
      handler(val, oldVal) {
        if (val) {
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  onLoad(options) {},
  onReady() {},
  methods: {
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleConfirm() {
      readedSignInBook({ reservationId: this.info.id }).then((res) => {
        this.$emit("confirm");
        this.$emit("update:isOpen", false);
        this.$emit("close", false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
