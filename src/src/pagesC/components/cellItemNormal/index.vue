<script>
export default {
  name: "cellItemNormal",
  props: {
    title: {
      type: String,
      default: "",
    },
    titleSize: {
      type: Number,
      default: 25,
    },
    titleLeftPadding: {
      type: Number,
      default: 25,
    },
    oneLine: {
      type: Boolean,
      default: false,
    },
    titleColor: {
      type: String,
      default: "#666666",
    },
    desc: {
      type: String,
      default: "",
    },
    isRight: {
      type: Boolean,
      default: false,
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
    descSize: {
      type: Number,
      default: 25,
    },
    descRightPadding: {
      type: Number,
      default: 25,
    },
    descColor: {
      type: String,
      default: "#333333",
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    iconSize: {
      type: Number,
      default: 27,
    },
    verticalPadding: {
      type: Number,
      default: 25,
    },
    fontWeight: {
      type: [Number, String],
      default: "",
    },
  },
  computed: {
    bottomLineStyle() {
      let style = {};
      if (!this.$props.isLast) {
        style.borderBottom = "1px solid #F9F9F9";
      }
      return style;
    },
    isRightStyle() {
      let style = {};
      if (this.$props.isRight) {
        style.justifyContent = "flex-end";
      }
      return style;
    },
    isRightDescStyle() {
      let style = {};
      if (this.$props.isRight) {
        style.textAlign = "right";
        style.fontWeight = this.fontWeight || "";
      }
      return style;
    },
  },
  emits: ["onItemClick"],
  methods: {
    onItemClick() {
      this.$emit("onItemClick");
    },
  },
};
</script>

<template>
  <view
    class="cell"
    :style="[
      bottomLineStyle,
      isRightStyle,
      {
        paddingLeft: `${titleLeftPadding}rpx`,
        paddingRight: `${descRightPadding}rpx`,
        paddingTop: `${verticalPadding}rpx`,
        paddingBottom: `${verticalPadding}rpx`,
      },
    ]"
    @click="onItemClick"
  >
    <view
      class="cell-title"
      :style="[
        {
          color: titleColor,
          fontSize: `${titleSize}rpx`,
        },
      ]">
        <slot name="title">{{ title }}</slot>
      </view>
    <view
      class="cell-desc"
      :style="[
        isRightDescStyle,
        {
          color: descColor,
          fontSize: `${descSize}rpx`,
        },
      ]"
    >
      <view class="specialtrain" v-if="desc === '专车配送'">
        <img
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/specialtrain.png"
          alt=""
        />
      </view>
      <view v-else>
        <text :class="{ one_line: oneLine }" v-if="desc.length">{{
          desc
        }}</text>
        <slot v-else name="desc"></slot>
      </view>
    </view>
    <image
      v-if="showArrow"
      class="icon"
      mode="widthFix"
      :style="{
        marginLeft: `25rpx`,
        width: `${iconSize}rpx`,
        height: `${iconSize}rpx`,
      }"
      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/arrow-right-tag.png"
    />
  </view>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
