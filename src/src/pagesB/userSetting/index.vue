<template>
  <view class="page-wrapper">
    <view class="my-contact-list">
      <view
        class="my-contact-item"
        @click="
          () => {
            handleGoToSetting();
          }
        "
      >
        <view class="left"
          ><image
            src="https://image.henhenchina.com/61ee0fe4f58112000178d924/fe24899e887543769dd2b9eca236ccf1.png"
            mode="scaleToFill"
            class="my-contact-icon"
          ></image>
          <view class="my-contact-text">授权管理</view></view
        >
        <image
          src="https://image.henhenchina.com/61ee0fe4f58112000178d924/f784004082f2411abdbeee795aefe662.png"
          mode="scaleToFill"
          class="my-contact-router"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
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
    handleGoToSetting() {
      uni.openSetting({
        success(res) {
          console.log(res.authSetting);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
