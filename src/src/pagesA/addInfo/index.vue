<template>
  <view class="add-info">
    1111111
    <view class="info-input">
      <textarea :maxlength="-1" @blur="bindTextAreaBlur" auto-height />

      <button type="default" @click="handleSubmit">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      info: {},
    };
  },

  onShow() {},

  methods: {
    bindTextAreaBlur(e) {
      console.log(11111, e.detail.value);
      const value = e.detail.value;
      console.log("222222", eval("(" + value + ")"));
      const obj = eval("(" + value + ")");
      this.info = obj;
    },
    handleSubmit() {
      uni.setStorageSync("storage_info", this.info || {});
    },
  },
};
</script>

<style lang="scss">
.info-input {
  border: 1px solid #ccc;
}
</style>
