<script>
import ChoicenessCatTabs from "./customTabs/customTabs.vue";

export default {
  name: "ChoicenessGoodsHeader",
  components: { ChoicenessCatTabs },
  emits: ["onSwitch"],
  props: {
    cats: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      tabIndex: 0,
      tabWidth: 28,
    };
  },
  computed: {
    tabList() {
      return [{ name: "推荐" }].concat(
        this.cats.map((e) => {
          return { name: e.name };
        })
      );
    },
  },
  methods: {
    handleChooseTab(item) {
      const { rect } = item;
      if (rect) {
        this.tabWidth = rect.width - 24 > 28 ? rect.width - 24 : 28;
      }
      this.$emit("onSwitch", item.index);
    },
  },
  mounted() {
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
};
</script>

<template>
  <view class="choiceness-goods-header-wrapper">
    <ChoicenessCatTabs
      :list="tabList"
      line-width="31rpx"
      line-height="2"
      lineColor="#FE2442"
      font-size="14"
      scrollable
      :activeStyle="{
        color: '#000',
        fontFamily: 'AlimamaShuHeiTi-Bold',
        transform: 'scale(1)',
      }"
      :inactiveStyle="{
        color: '#000',
        transform: 'scale(1)',
      }"
      :current="tabIndex"
      @click="handleChooseTab"
    >
    </ChoicenessCatTabs>
  </view>
</template>

<style scoped lang="scss">
.choiceness-goods-header-wrapper {
  width: 100%;
  height: 100%;
}
</style>
