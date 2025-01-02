<script>
import { action_report } from "@/utils/track";
import IconButton from "../iconButton/index.vue";
// #ifdef MP-WEIXIN
/** 七鱼 **/
var myPluginInterface = requirePlugin("myPlugin");
myPluginInterface.__configAppId("wDINR06SbCw"); // 不是微信的appId，ID为七鱼后台该小程序设置的APPID
myPluginInterface._$configAppKey("7b6f2edf2dde2f77ea9916cd58a74d29");

// #endif

export default {
  name: "customerService",
  components: { IconButton },
  props: {
    from: {
      type: String,
    },
  },
  methods: {
    handleService() {
      action_report({
        action_name: "Detailpage_customerservice_click",
        module_name: "shop",
      });
      // #ifdef MP-WEIXIN
      // myPluginInterface._$chat();
      // #endif
    },
  },
};
</script>

<template>
  <view class="page-wrapper" @click="handleService">
    <template v-if="from === 'goodsDetail'">
      <IconButton
        title="客服"
        :fontSize="20"
        position="top"
        :iconSize="44"
        height="44"
        color="transparent"
        :interval="5"
        :fontClassStyle="'color: #1f1f1f; font-size: 42rpx'"
        fontClass="icon-chat"
        style="height: 44px; min-width: 58rpx"
      />
    </template>
    <template v-else>
      <IconButton
        title="客服"
        fontSize="20"
        position="top"
        iconSize="43"
        color="transparent"
        interval="1"
        fontClass="icon-a-kefuxiangqingye3x"
      />
    </template>

    <!--  #ifdef  MP-WEIXIN	 -->
    <navigator
      class="customer-service"
      url="plugin://myPlugin/chat"
    ></navigator>
    <!--  #endif -->
  </view>
</template>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  .customer-service {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    &:hover {
      background-color: transparent;
    }
  }
}
</style>
