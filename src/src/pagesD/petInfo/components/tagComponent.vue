<template>
  <view class="choose-wrap" :class="{ op: disabled }">
    <view
      class="u-border"
      :class="['choose-item', `${item.id == selecetId ? 'selected' : ''}`,`${item.label == '非特殊时期' ? 'cpp-selected' : ''}`]"
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
    },
    disabled:{
      type: Boolean,
      default: false
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
      if(this.disabled){
        return
      }
      this.selecetId = item.id;
      this.$emit('updateSelect', item);
    }
  }
}

  </script>
  <style lang="scss" scoped>
@import "../../../utils/fn.scss";
.choose-wrap {
  // width: 111.54;
  height: 62rpx;
  display: flex;
  align-items: center;
  .choose-item {
    width: 111.54rpx;
    // min-width: 112rpx;
    // padding: 0 23rpx;
    height: 62rpx;
    transform: rotateZ(360deg);
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
  .cpp-selected{
      width: 181rpx !important;
      margin-left: 0 !important;
    }
}
.op{
  opacity: 0.5;
}
</style>
  