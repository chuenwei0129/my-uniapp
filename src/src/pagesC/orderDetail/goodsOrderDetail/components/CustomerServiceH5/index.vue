<template>
  <div>
    <!-- #ifdef H5 -->
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
      @onClick="$u.debounce(handleClickChat, 500)"
    />
    <!-- #endif -->
  </div>
</template>

<script>
import IconButton from "@/pagesC/components/iconButton";
export default {
  name: "CustomerServiceH5",
  components: {
    IconButton,
  },
  methods: {
    // 客服
    handleClickChat() {
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/user/custom/service`,
      });
      // #endif
    },
  },
};
</script>
