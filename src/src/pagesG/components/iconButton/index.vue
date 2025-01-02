<script>
export default {
  name: "IconButton",
  props: {
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "#666",
    },
    position: {
      type: String,
      default: "right",
    },
    interval: {
      type: Number,
      default: 8,
    },
    color: {
      type: String,
      default: "transparent",
    },
    borderRadius: {
      type: Number,
      default: 0,
    },
    fontSize: {
      type: Number,
      default: 20,
    },
    iconSize: {
      type: Number,
      default: 20,
    },
    url: {
      type: String,
      default: "",
    },
    fontClass: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    fontClassStyle: {
      type: String,
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
    iconStyle() {
      return {
        width: `${this.$props.iconSize}rpx`,
        height: `${this.$props.iconSize}rpx`,
        mode: "aspectFit",
      };
    },
    positionStyle() {
      if (this.$props.position === "top") {
        return {
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "center",
          alignItems: "center",
        };
      } else if (this.$props.position === "bottom") {
        return {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        };
      } else if (this.$props.position === "left") {
        return {
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          alignItems: "center",
        };
      } else {
        return {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        };
      }
    },
    buttonStyle() {
      if (this.$props.color.indexOf("gradient") !== -1) {
        return {
          backgroundImage: this.$props.color,
          borderRadius: this.$props.borderRadius + "rpx",
          fontSize: this.$props.fontSize + "rpx",
          color: this.$props.titleColor,
          height: this.height + "px",
        };
      } else {
        return {
          backgroundColor: this.$props.color,
          borderRadius: this.$props.borderRadius + "rpx",
          fontSize: this.$props.fontSize + "rpx",
          color: this.$props.titleColor,
          height: this.height + "px",
        };
      }
    },
  },
};
</script>

<template>
  <view
    class="button-wrapper"
    :style="[buttonStyle, positionStyle]"
    @click="onClick"
  >
    <view class="title">
      {{ title }}
    </view>
    <view :style="{ width: `${interval}rpx`, height: `${interval}rpx` }"></view>
    <i
      v-if="fontClass"
      :class="['iconfont', fontClass]"
      :style="fontClassStyle"
    ></i>
    <image v-else :src="url" :style="[iconStyle]" />
  </view>
</template>

<style scoped lang="scss">
.button-wrapper {
  height: 100%;
}
</style>
