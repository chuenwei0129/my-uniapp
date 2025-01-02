<template>
  <view class="empty-view">
    <slot></slot>
    <view class="empty-view-ico"></view>
    <view class="empty-view-text">购物车是空的，为爱宠挑点东西吧</view>
    <view class="empty-view-btn" v-if="!isLogin">
      <button class="empty-view-btn-text" type="primary" @click="pushHome">
        商城首页
      </button>
      <button class="empty-view-btn-text" type="primary" @click="pushLogin">
        立即登录
      </button>
    </view>
  </view>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      isLogin: false,
    };
  },

  computed: {},

  mounted() {
    const info = uni.getStorageSync("storage_info") || {};
    if (info.token) {
      this.isLogin = true;
    }
  },
  methods: {
    pushLogin() {
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/app/main?locate_main_fragment=2&tab=online`,
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pagesD/login/index",
      });
      //#endif
    },
    pushHome() {
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/app/main?locate_main_fragment=2&tab=online`,
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.switchTab({
        url: "/pages/mall/index",
      });
      //#endif
    },
  },
};
</script>

<!-- <style>
page {
  height: 100%;
  width: 100%;
}
</style> -->

<style scoped lang="scss">
@import "./index.scss";
</style>
