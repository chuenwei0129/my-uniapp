<template>
  <view class="appraise-text">
    <view :class="{ review: textType === 2 }">
      <view class="review-box">
        <view :class="[`content-text_${textType}`, { expanded: isExpanded }]">
          <text v-if="isMerchant" class="merchant-text">商家回复：</text>
          <text>{{ appraiseText }} </text>
        </view>
        <view ref="reviewText" :class="['content-text']">
          <text v-if="isMerchant" class="merchant-text">商家回复：</text>
          <text>{{ appraiseText }} </text>
        </view>
        <view
          v-if="textType == 2 && expandButtonVisible"
          class="overflow-show"
          @click="toggleExpand"
          :style="{ bottom: merchantEdit == 1 ? '72rpx' : '22rpx' }"
        >
          {{ expandButtonText }}
        </view>
      </view>
      <view v-if="merchantEdit == 1 && textType == 2" class="merchant-change"
        >商家已修改内容</view
      >
    </view>
  </view>
</template>

<script>
export default {
  name: "appraiseText",
  props: {
    appraiseText: {
      type: String,
      default: "",
    },
    textType: {
      type: Number, // 1: 评价内容，2: 评价回复
    },
    merchantEdit: {
      type: Number,
      default: 0, // 商家是否修改回复内容 0否 1是
    },
  },
  computed: {
    isMerchant() {
      if (this.textType === 2) return true;
      else return false;
    },
  },
  data() {
    return {
      expandButtonVisible: false,
      isExpanded: false,
      expandButtonText: "展开",
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.appraiseText?.length > 0) {
        this.checkOverflow();
      }
    });
  },
  methods: {
    checkOverflow() {
      // 使用条件编译区分平台
      // #ifdef MP-WEIXIN
      // #endif
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".content-text")
        .boundingClientRect((rect) => {
          if (rect) {
            let textHeight = this.textType == 1 ? 40 : 38;
            this.expandButtonVisible = rect.height > textHeight;
          }
        })
        .exec();
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      this.expandButtonText = this.isExpanded ? "收起" : "展开";

      // 使用条件编译区分平台
      // #ifdef MP-WEIXIN
      // #endif
      this.$nextTick(() => {
        this.checkOverflow(); // 小程序中需要再次检查溢出状态
      });

      // #ifdef H5
      // this.$nextTick(() => {
      //   if (this.isExpanded) {
      //     this.$refs.reviewText.style.webkitLineClamp = ""; // 移除行数限制
      //     this.$refs.reviewText.style.overflow = "visible";
      //   } else {
      //     this.$refs.reviewText.style.webkitLineClamp = "2"; // 重新设置行数限制
      //     this.$refs.reviewText.style.overflow = "hidden";
      //   }
      // });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.appraise-text {
  background-color: #fff;
  overflow: hidden;
  font-family: PingFangSC, PingFang SC;
  font-weight: 300;
  font-style: normal;
  white-space: pre-line; /* 允许多行文本 */
  position: relative;
  width: 100%;
  margin-top: 19rpx;
  .review {
    background: #f8f8f8;
    border-radius: 8rpx;
    padding: 23rpx;
    box-sizing: border-box;
  }
  .review-box {
    display: flex;
    align-items: center;
  }
  .merchant-text {
    font-weight: 400;
    @include textfclaw(23rpx, #666, left, 33rpx);
  }
  .content-text {
    width: 688rpx;
    @include textfclaw(23rpx, #1f1f1f, left, 37rpx);
    position: absolute;
    bottom: -100%;
    left: 100%;
    z-index: -999;
  }
  .content-text_1 {
    @include textfclaw(25rpx, #1f1f1f, left, 40rpx);
  }
  .content-text_2 {
    width: 635rpx;
    @include textOverflow(2);
    @include textfclaw(23rpx, #1f1f1f, left, 37rpx);
  }
  .expanded {
    -webkit-line-clamp: unset !important; /* 移除行数限制 */
    overflow: visible !important;
  }
  .merchant-change {
    font-weight: 300;
    margin-top: 19rpx;
    @include textfclaw(23rpx, #ff2442, right, 33rpx);
  }
  .overflow-show {
    position: absolute;
    bottom: 22rpx;
    right: 31rpx;
    width: 77rpx;
    @include textfclaw(23rpx, #238cff, right, 37rpx);
    background: linear-gradient(
      90deg,
      rgba(248, 248, 248, 0.4) 0%,
      #f8f8f8 100%
    );
    border-radius: 6rpx;
  }
}
</style>
