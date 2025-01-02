<script>
import NavBar from "@/components/navBar/index.vue";
import DebitCard from "@/pagesB/myNewWallet/components/debitCard.vue";
import SecondaryCard from "@/pagesB/myNewWallet/components/secondaryCard.vue";
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
  <view class="card-page">
    <view class="tabs">
      <u-tabs
        :list="titles"
        lineHeight="4rpx"
        lineColor="#1F1F1F"
        :scrollable="false"
        :activeStyle="{
          color: '#333',
          fontWeight: '500',
        }"
        :inactiveStyle="{
          color: '#1f1f1f',
          fontWeight: '300',
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
<style scoped lang="scss">
@import "./index.scss";
</style>
