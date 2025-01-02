<template>
  <view class="">
    <u-tabbar
      :value="customTabbarIndex"
      :placeholder="false"
      activeColor="#FE2442"
      :border="false"
      inactiveColor="#1f1f1f"
    >
      <u-tabbar-item
        v-for="(item, index) in list"
        :text="item.text"
        :key="index"
        @click="tabbarClick(index, item)"
      >
        <template #active-icon>
          <image
            :class="[
              item.isMid
                ? 'u-page__item__slot-icon-big'
                : index == 0
                ? 'u-page__item__slot-icon-first'
                : 'u-page__item__slot-icon',
            ]"
            :src="item.selectedIconPath"
          ></image>
        </template>
        <template #inactive-icon>
          <image
            :class="[
              item.isMid
                ? 'u-page__item__slot-icon-big'
                : 'u-page__item__slot-icon',
            ]"
            :src="item.iconPath"
          ></image>
        </template>
      </u-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { action_report } from "@/utils/track";

export default {
  components: {},
  props: {},
  data() {
    return {
      list: [
        {
          pagePath: "pages/home/index",
          iconPath: "/static/images/tabbar/home.png",
          selectedIconPath: "/static/images/tabbar/home_sel.png",
          text: "",
        },
        {
          pagePath: "pages/mall/index",
          iconPath: "/static/images/tabbar/mall.png",
          selectedIconPath: "/static/images/tabbar/mall_sel.png",
          text: "商城",
        },
        {
          pagePath: "pagesE/memberCodePage/index",
          iconPath:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/tab/member-code-icon-V3.png",
          selectedIconPath:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/tab/member-code-icon-V3.png",
          text: "",
          isMid: true,
        },
        {
          pagePath: "pages/service/index",
          iconPath: "/static/images/tabbar/service.png",
          selectedIconPath: "/static/images/tabbar/service_sel.png",
          text: "服务",
        },
        {
          pagePath: "pages/my/index",
          iconPath: "/static/images/tabbar/my.png",
          selectedIconPath: "/static/images/tabbar/my_sel.png",
          text: "我的",
        },
      ],
      tabCollectList: [
        "bottomtab_home_click",
        "bottomtab_shoppingmall_click",
        "menu_membercode_click",
        "bottomtab_store_click",
        "bottomtab_my_click",
      ],
    };
  },
  computed: {
    ...mapState({
      customTabbarIndex: (state) => state.customTabbarIndex,
    }),
  },
  watch: {},
  created() {},
  mounted() {
    this.list = this.list.map((i, index) => {
      if (index == 0) {
        return {
          ...i,
          text: [0, undefined].includes(this.customTabbarIndex) ? "" : "首页",
        };
      } else {
        return { ...i };
      }
    });
  },
  methods: {
    ...mapMutations(["setCustomTabbarIndex"]),
    tabbarClick(index, item) {
      if (this.customTabbarIndex == index) return;
      if (index == 2) {
        uni.navigateTo({
          url: "/" + item.pagePath,
        });
      } else {
        uni.switchTab({
          url: "/" + item.pagePath,
        });
        console.log(uni);
      }
      action_report({
        action_name: this.tabCollectList[index],
        module_name: "home",
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
