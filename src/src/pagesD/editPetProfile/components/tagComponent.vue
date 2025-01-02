<template>
  <view class="choose-wrap">
    <view
      :class="['u-border choose-item', `${item.id == selecetId ? 'selected' : ''}`]"
      v-for="(item, index) in list"
      :key="index"
      @click="changeItem(item, index)"
    >
    {{ item.label }}
    </view>
  </view>
</template>
  <script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    val: {
      type: String | Number
    }
  },
  data () {
    return {
      selecetId: this.val
    }
  },
  watch: {
    val: {
      immediate: true,
      handler (newValue, oldValue) {
        this.selecetId = newValue;
      },
    }
  },
  methods: {
    changeItem (item) {
      this.selecetId = item.id;
      this.$emit('updateSelect', item);
    }
  }
}

  </script>
  <style lang="scss" scoped>
@import "../../../utils/fn.scss";
.choose-wrap {
  height: 62rpx;
  display: flex;
  align-items: center;
  .choose-item {
    min-width: 112rpx;
    // padding: 0 23rpx;
    height: 62rpx;
    background: #ffffff;
    border-radius: 31rpx;
    border: 1rpx solid #e4e4e4;
    @include flex();
    font-size: 25rpx;
    color: #333333;
    font-weight: 400;
    margin-left: 12rpx;
    &.selected {
      font-weight: 500;
      color: #1f1f1f;
      background: #ffeea5;
      border: none;
    }
  }
}
</style>
  