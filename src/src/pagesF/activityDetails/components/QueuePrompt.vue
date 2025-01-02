<template>
  <view>
    <u-modal
      title="温馨提示"
      :show="show"
      :content="msg"
      cancelColor="#1f1f1f"
      :showCancelButton="true"
      :showConfirmButton="false"
      cancelText="我知道了"
      @cancel="cancel"
    >
    </u-modal>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    msg: {
      type: String,
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel", true);
    },
  },
};
</script>

<style></style>
