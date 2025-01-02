<template>
  <view class="checkbox-wrapper">
    <image
      class="check-ico"
      :src="checkIco"
      mode="aspectFit"
      @click="handleCheckClick"
    >
    </image>
  </view>
</template>

<script>
export default {
  name: "SubmitCheckBox",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    checkIco() {
      return this.value
        ? "https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/choose-selected.png"
        : "https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/choose-noselect.png";
    },
  },

  methods: {
    handleCheckClick() {
      const checked = !this.value;
      this.$emit("input", checked);
      this.$emit("change", checked);
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  height: 42rpx;
  width: 42rpx;

  .check-ico {
    height: 42rpx;
    width: 42rpx;
  }
}
</style>
