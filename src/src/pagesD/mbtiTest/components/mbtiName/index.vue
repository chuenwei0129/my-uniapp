<template>
  <u-popup
    :show="isOpen"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="tip-card">
      <view class="content"> 请输入您的宠物名 </view>
      <view class="name">
        <u--input
          placeholder="请输入宠物名 （最多六个字）"
          v-model="name"
          border="none"
          fontSize="31rpx"
          color="#000000"
          maxlength="6"
          placeholderStyle="fontSize: 31rpx;color: #B0B0B0;fontWeight: 400;"
        ></u--input>
      </view>
      <view class="footer">
        <view class="confirm" @click="handleConfirm">立即开始 </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: "",
    };
  },
  onLoad(options) {},
  onReady() {},
  methods: {
    handleConfirm() {
      console.log("name handleConfirm");
      if (this.name == "") {
        uni.showToast({
          icon: "none",
          title: "请输入宠物姓名",
          duration: 1000,
        });
        return;
      }

      this.$emit("update:isOpen", false);
      this.$emit("confirm", this.name);

      this.name = "";
    },
    close() {},
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
