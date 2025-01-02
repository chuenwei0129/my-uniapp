<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @close="close"
    :round="20"
    @touchmove.stop.prevent
  >
  <view class="docIntroPop">
    <view class="header">
        <view class="title">医生擅长</view>
        <view class="close-icon" @click="handleCancel"></view>
    </view>
    <view class="introcontent">
      {{ content }}
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
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {

    }
  },
  methods: {
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
  }
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
