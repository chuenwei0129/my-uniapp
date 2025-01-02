<template>
  <view
    :class="['scan', `scan_${color}`]"
    @click.stop.prevent="scanHandleClick"
  ></view>
</template>
<script>
import { mapState } from "vuex";
import { parseShortLink } from "@/api/base/index";
export default {
  name: "scanCode",
  props: {
    color: {
      type: String,
      default: "black",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    scanHandleClick() {
      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      uni.scanCode({
        onlyFromCamera: true,
        success: async function (res) {
          let u = res.result;
          if (!u.includes("?")) {
            //短链
            let r = await parseShortLink(res.result);
            u = r.data?.data?.resultStr;
          }
          const url = `/pagesC/goodsServiceDetail/index?${u.split("?")[1]}`;
          if (u.includes("shareactivity")) {
            uni.navigateTo({
              url,
            });
          } else {
            uni.navigateTo({
              url: "/pagesE/errorLink/index",
            });
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.scan {
  width: 42rpx;
  height: 42rpx;
}
.scan_black {
  background: url("https://frontend-cdn.chongpangpang.com/image/scan/scan_black.png")
    no-repeat center center/100% 100%;
}
.scan_red {
  background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/Scan-icon.png")
    no-repeat center center/100% 100%;
}
</style>
