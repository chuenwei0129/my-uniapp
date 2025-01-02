<template>
  <view class="bar-container">
    <view
      v-for="(item, index) in tabList"
      class="bar-item"
      :class="[activitedIndex == index ? 'act-item' : '']"
      @click="handleClick(index)"
    >
      <text class="tab-text">
        {{ item.name }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: "",
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      tabList: [{ name: "商品" }, { name: "萌宠" }, { name: "活动" }],
      activitedIndex: 0,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {
        console.log("success load ttf 1111");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
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
  methods: {
    handleClick(i) {
      if (i !== this.activitedIndex) {
        this.activitedIndex = i;
        this.$emit("changeIndex", i);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.bar-container {
  height: 77rpx;
  width: 100%rpx;
  display: flex;
  background-color: #fff;
  .bar-item {
    width: 50%;
    font-weight: 400;
    font-size: 31rpx;
    color: #1f1f1f;
    line-height: 42rpx;
    text-align: center;
    padding-top: 27rpx;
    position: relative;

    .tab-text {
      z-index: 9;
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
    }
  }
  .act-item {
    /* font-family: D-DIN-Bold; */
    font-weight: 500;
    font-size: 31rpx;
    color: #1f1f1f;
    line-height: 37rpx;
    position: relative;
    font-family: "AlimamaShuHeiTi-Bold";

    &::after {
      position: absolute;
      content: "";
      width: 62rpx;
      height: 12rpx;
      background-color: rgba(254, 233, 0, 0.7);
      bottom: 20rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }
  }
}
</style>
