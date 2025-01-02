<script>
import NavBar from "@/components/navBar/index.vue";
import DebitCard from "@/pagesD/myWallet/components/debitCard.vue";
import SecondaryCard from "@/pagesD/myWallet/components/secondaryCard.vue";
import { action_report } from "@/utils/track";

export default {
  name: "myWallet",
  components: {
    SecondaryCard,
    DebitCard,
    NavBar,
  },
  data() {
    return {
      currentTab: 0,
      titles: [{ name: "储蓄卡" }, { name: "次卡" }],
    };
  },
  onLoad() {},
  methods: {
    tabClick({ index }) {
      this.currentTab = index;
      action_report({
        action_name:
          index === 0 ? "mypage_valuecard_action" : "mypage_timescard_action",
        module_name: "me",
      });
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <NavBar
      title="我的卡包"
      titleColor="#333"
      navColor="#fff"
      :showBackBtn="true"
    />
    <view class="tabs">
      <u-tabs
        :list="titles"
        :lineWidth="currentTab === 0 ? '92rpx' : '43rpx'"
        lineHeight="12rpx"
        lineColor="#FFD41E"
        :activeStyle="{
          color: '#1f1f1f',
          fontWeight: '500',
        }"
        :inactiveStyle="{
          color: '#666666',
          fontWeight: '500',
        }"
        @click="tabClick"
      ></u-tabs>
    </view>
    <template v-if="currentTab === 0">
      <debit-card />
    </template>
    <template v-else>
      <secondary-card />
    </template>
  </view>
</template>
<style>
page {
  background-color: #f5f6f7;
}
</style>
<style scoped lang="scss">
@import "./index.scss";
</style>
