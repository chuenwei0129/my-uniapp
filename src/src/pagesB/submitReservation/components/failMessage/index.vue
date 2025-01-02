<template>
  <u-popup class="aa" :show="isOpen" mode="center" @close="handleCancel">
    <div class="message-card">
      <div class="header">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/failheader.png"
          mode="scaleToFill"
        />
      </div>
      <div class="content">{{ failMessage }}</div>
      <div class="btn" @click="handleKonw">知道了</div>
    </div>
  </u-popup>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    failMessage: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {
    isOpen: {
      handler(val, oldVal) {},
      immediate: true,
      deep: true,
    },
  },

  methods: {
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleKonw() {
      this.$emit("confirm");
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
