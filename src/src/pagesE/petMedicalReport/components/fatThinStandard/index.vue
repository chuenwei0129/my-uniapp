<template>
  <u-popup :show="isOpen" mode="bottom" @open="handleOpen" @close="close" :round="20" :weightType="weightType"
    :petType="petType" @touchmove.stop.prevent>
    <view class="infoPop" v-if="isOpen">
      <view class="header">
        <view class="cancel" @click="handleCancel"></view>
        <view class="title">{{ `BCS评分示范：${'0' == petType ? '猫' : "狗"}` }}</view>
        <view class="img" @click="handleCancel"></view>
      </view>

      <swiper class="uni-swiper-wrapper" :autoplay="false" :circular="true" :indicator-dots="false"
        :indicator-position="center" :interval="3000" :duration="500" indicator-color="rgba(255, 255, 255, .4)"
        indicator-active-color="rgba(255, 255, 255, 1.0)" previous-margin="75rpx" next-margin="55rpx"
        :current="weightType - 1" @change="swiperChange">
        <!-- :previous-margin="getPreviousMargin()"
        :next-margin="getNextMargin()" -->
        <swiper-item v-for="(item, index) in 5" :key="index">
          <!-- @click="goThemePage(item)" -->

          <view class="item-bg">
            <view :class="['pic', `${'0' == petType ? 'cat' : 'dog'}${index + 1}`]"> </view>
          </view>
        </swiper-item>
      </swiper>
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
    weightType: {
      type: String,
      default: ''
    },
  },
  data() {
    return {};
  },
  computed: {},
  onLoad(options) { },
  onReady() { },
  methods: {
    swiperChange() { },
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
  watch: {
    isOpen: {
      handler(newV, oldV) {
        console.log(newV, "-", oldV);
        if (newV == true) {

        } else {

        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
