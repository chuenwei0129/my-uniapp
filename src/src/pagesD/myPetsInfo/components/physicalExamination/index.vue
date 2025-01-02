<template>
  <u-popup :show="isOpen" mode="bottom" @open="handleOpen" @close="close" :round="20" :title="title" :petType="petType"
    @touchmove.stop.prevent>
    <view class="infoPop">
      <view class="header">
        <view class="cancel" @click="handleCancel"></view>
        <view class="title">{{ title }}</view>
        <view class="img" @click="handleCancel"></view>
      </view>
      <view class="item">
        <view :class="['icon', '0' == petType ? 'h_cat1' : 'h_dog1']"></view>
        <view class="right">
          <view class="name">{{ '0' == petType ? '幼年猫' : '幼年犬' }}</view>
          <view class="tw">{{ des1 }}</view>
        </view>
      </view>
      <view class="item">
        <view :class="['icon', '0' == petType ? 'h_cat2' : 'h_dog2']"></view>
        <view class="right">
          <view class="name">{{ '0' == petType ? '成年猫' : '成年犬' }}</view>
          <view class="tw">{{ des2 }}</view>
        </view>
      </view>

      <view class="annotation" v-if="'0' == petType">注：月龄≥1岁的猫咪为成年猫</view>
      <view class="annotation" v-else>注：月龄≥6个月的狗狗为成年犬</view>

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
    petType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    des1: {
      type: String,
      default: ''
    },
    des2: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {},
  onLoad(options) { },
  onReady() { },
  methods: {
    handleOpen() { },
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },

    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
