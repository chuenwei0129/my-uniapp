<template>
  <view class="official-tag" :style="{ color: fontColor, background: bgc }">
    {{ text }}
  </view>
</template>

<script>
export default {
  name: "officialTag",
  props: {
    text: {
      type: String,
    },
    bgc: {
      type: String,
    },
    fontColor: {
      type: String,
      default: "#fff",
    },
  },
  data() {
    return {};
  },
  mounted() {
    // 阿里妈妈字体
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("AlimamaShuHeiTi-Bol");
      },
      fail() {
        console.log("fail load AlimamaShuHeiTi-Bol");
      },
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.official-tag {
  display: inline-block;
  padding: 3.85rpx 9.62rpx;
  border-radius: 8rpx;
  font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
  @include textfclaw(25rpx, #fff, left);
  // background-color: #1f1f1f;
  margin-right: 9.62rpx;
}
</style>
