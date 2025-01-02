<template>
  <!--  消息提示  -->
  <u-popup
    :show="isOpen"
    mode="center"
    bgColor="transparent"
    @close="close"
    @touchmove.stop.prevent
  >
    <view class="content">
      <view class="contentImg"></view>
      <view class="title">{{title}}</view>
      <view class="content-top">
        {{text}}
      </view>
      <view class="content-bottom">
        <view class="know" @click="close">我知道了</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    cancelText: {
      type: String,
      default: '取消',
    },
    confirmText: {
      type: String,
      default: '确定',
    },
  },
  data () {
    return {
      title: '',
      text: '',
      isOpen: false
    }
  },
  methods: {
    openModal ({ title, text }) {
      this.isOpen = true
      this.title = title
      this.text = text
    },
    close () {
      this.isOpen = false
      //#ifdef H5
      // 点击知道了返回上一级
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
    },
    handleClose () {
      this.$emit("update:isOpen", false)
      this.$emit("close", false)
    },
    handleConfirm () {
      this.$emit("update:isOpen", false)
      this.$emit("confirm")
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
