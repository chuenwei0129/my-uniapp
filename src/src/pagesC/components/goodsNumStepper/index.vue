<script>
export default {
  name: "GoodsNumStepper",
  props: {
    num: {
      type: [String, Number],
      default: 1,
    },

    min: {
      type: [String, Number],
      default: 1,
    },

    max: {
      type: [String, Number],
      default: Number.MAX_SAFE_INTEGER,
    },

    color: {
      type: String,
      default: "#1F1F1FFF",
    },

    fontSize: {
      type: Number,
      default: 25,
    },

    fontWeight: {
      type: [String, Number],
      default: 500,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      value: this.num || 1,
      dialogValue: 1,
      showNumDialog: false,
      keyboardHeight: 0,
      lastValidValue: 1,
    };
  },
  watch: {
    num(newVal, oldVal) {
      this.value = newVal;
      this.lastValidValue = newVal ? newVal : 1;
    },
  },
  computed: {
    isMinusDisabled() {
      return this.value <= this.min;
    },

    isPlusDisabled() {
      return this.value >= this.max;
    },
  },
  methods: {
    handleMinusClick() {
      if (this.isMinusDisabled) {
        return;
      }
      this.$emit("change", this.value - 1);
    },
    handlePlusClick() {
      if (this.isPlusDisabled) {
        return;
      }
      this.$emit("change", this.value + 1);
    },
    handleInputClick() {
      this.dialogValue = this.value;
      if (this.isShow) {
        this.showNumDialog = true;
      }
    },
    handleFocus(e) {
      this.keyboardHeight = e.detail.height;
    },
    handleBlur(e) {
      this.keyboardHeight = 0;
    },
    handleEditConfirm() {
      this.close();
      let editValue = Number(this.dialogValue);
      if (editValue > this.max) {
        uni.showToast({
          title: `该商品每人限购${this.max}件`,
          icon: "none",
        });
        editValue = this.max;
      } else if (editValue < this.min) {
        editValue = this.min;
      }
      this.value = editValue;
      this.$emit("change", this.value);
    },
    close() {
      this.showNumDialog = false;
    },
    handleBlurInput(event) {
      const newValue = event.target.value;
      const cleanedValue = newValue.replace(/[^0-9]/g, "");

      // 如果清理后的值与当前值不同，说明输入包含非法字符
      this.$nextTick(() => {
        if (cleanedValue !== newValue) {
          this.dialogValue = this.lastValidValue; // 恢复到上一个有效的值
        } else {
          // 更新上一个有效的值
          this.lastValidValue = cleanedValue;
          this.dialogValue = cleanedValue;
        }
      });
    },
  },
};
</script>

<template>
  <view>
    <view class="goods-num-stepper-wrapper">
      <view
        :class="['minus', isMinusDisabled ? 'disable' : '']"
        @click="handleMinusClick"
      />
      <text
        class="input"
        :style="{
          color: color,
          fontSize: `${fontSize}rpx`,
          fontWeight: `${fontWeight}`,
        }"
        @click="handleInputClick"
      >
        {{ value }}
      </text>
      <view
        :class="['plus', isPlusDisabled ? 'disable' : '']"
        @click="handlePlusClick"
      />
    </view>
    <u-popup
      :show="showNumDialog"
      mode="center"
      :duration="220"
      :closeOnClickOverlay="false"
      @close="close"
      :customStyle="{
        backgroundColor: 'transparent',
        borderRadius: '32rpx',
      }"
    >
      <view
        class="num-dialog"
        :style="{
          marginBottom: `${keyboardHeight / 2}px`,
        }"
      >
        <view class="content">
          <view class="title">请输入数量</view>
          <input
            class="num-input"
            v-model="dialogValue"
            type="number"
            placeholder-class="num-placeholder"
            :auto-blur="true"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleBlurInput"
          />
          <view class="num-confirm" @click="handleEditConfirm">确定</view>
        </view>
        <view class="num-close" @click="close"></view>
      </view>
    </u-popup>
  </view>
</template>

<style scoped lang="scss">
.goods-num-stepper-wrapper {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .minus {
    width: 56rpx;
    height: 56rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/goods_num_box_minus.png);
  }

  .minus.disable {
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/goods_num_box_minus_disable.png);
  }

  .input {
    padding: 0 2px;
    min-width: 82rpx;
    text-align: center;
  }

  .plus {
    width: 56rpx;
    height: 56rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/goods_num_box_plus.png);
  }

  .plus.disable {
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/goods_num_box_plus_disable.png);
  }
}
.num-dialog {
  width: 576rpx;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  .content {
    width: 576rpx;
    height: 413rpx;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-color: white;
    border-radius: 38rpx;

    .title {
      font-size: 31rpx;
      font-weight: bold;
      color: #000000;
      line-height: 42rpx;
      margin-top: 46rpx;
    }

    .num-input {
      width: 485rpx;
      height: 85rpx;
      color: #999999;
      font-size: 35rpx;
      background: #f5f6f7;
      border-radius: 38rpx;
      margin-top: 62rpx;
      text-align: center;
    }

    ::v-deep .num-placeholder {
      font-size: 35rpx;
      color: #999999;
    }

    .num-confirm {
      width: 500rpx;
      height: 85rpx;
      background: #ffd41e;
      border-radius: 42rpx;
      margin-top: 52rpx;
      font-size: 31rpx;
      font-weight: bold;
      color: #1f1f1f;
      line-height: 85rpx;
      text-align: center;
    }
  }

  .num-close {
    height: 62rpx;
    width: 62rpx;
    margin-top: 38rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/goods_num_dialog_close.png);
  }
}
</style>
