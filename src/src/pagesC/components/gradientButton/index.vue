<script>
export default {
  name: "gradientButton",
  props: {
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "#000",
    },
    color: {
      type: String,
      default: "#FFD41E",
    },
    borderRadius: {
      type: [String, Number],
      default: 36,
    },
    fontSize: {
      type: [String, Number],
      default: 28,
    },
    fontWeight: {
      type: [String, Number],
      default: 500,
    },
  },
  data() {
    return {};
  },
  emits: ["onClick"],
  methods: {
    onClick() {
      this.$emit("onClick");
    },
  },
  computed: {
    commonStyle() {
      return {
        borderRadius: this.$props.borderRadius + "rpx",
      };
    },
    titleStyle() {
      return {
        fontSize: this.$props.fontSize + "rpx",
        color: this.$props.titleColor,
        fontWeight: this.$props.fontWeight,
      };
    },
    buttonStyle() {
      if (this.$props.color.indexOf("gradient") !== -1) {
        return {
          backgroundImage: this.$props.color,
        };
      } else {
        return {
          backgroundColor: this.$props.color,
        };
      }
    },
  },
};
</script>

<template>
  <view
    class="button-wrapper"
    :style="[commonStyle, buttonStyle]"
    @click="onClick"
  >
    <view class="button" :style="[titleStyle]">
      {{ title }}
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
