<template>
  <view class="ry-content-warp">
    <view class="tip">{{
      ryConnectStatus ? "网络正常": "网络开了个小差"
    }}</view>

    <view v-if="!ryConnectStatus" class="connnect-btn" @click="handleRyConnect"
      >请重试</view
    >
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  RyConnect,
  handleMessages,
  _getSheetsServerList,
} from "@/pagesA/components/rongyunCloud/ryConnect";

export default {
  // #ifdef MP-WEIXIN
  // //...wxShareMethod(),
  // #endif

  data() {
    return {
      isShow: false,
      isPageShow: false,
      DataInfo: {},
      statusBarHeight: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      ryConnectStatus: (state) => state.ryConnectStatus,
    }),
  },
  onLoad(option) {},
  onReady() {},
  onShow() {},

  onHide() {},
  methods: {
    async handleRyConnect() {
      try {
        await RyConnect();
        uni.navigateBack();
      } catch (e) {
        console.error("融云连接失败", e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
