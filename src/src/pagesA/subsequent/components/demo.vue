<template>
  <view class="guess"> 事例组件 </view>
</template>

<script>
export default {
  props: {
    isVip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      current: 0,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>
