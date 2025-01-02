<template>
  <view>
    <view class="base-content">
      <view class="dt-content" :class="[isHide ? 'one-line' : 'more-line']">
        <view class="content">
          <slot>{{ dt ? dt : "" }}</slot>
        </view>
        <view class="expand-icon" v-if="lines > 1">
          <view class="icon" @click="expandAll" v-if="isHide">
            <view class="iconfont icon-outlineArrowDown"></view>
          </view>
          <view class="icon" @click="expandAll" v-else>
            <view class="iconfont icon-outlineArrowUp"></view>
          </view>
        </view>
      </view>
    </view>
    <view>
      <text class="placeholder">
        {{ placeholder }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: "expandableText",
  data() {
    return {
      // 是否隐藏多余行。初始状态不隐藏
      isHide: true,
      // 全量所占文本高度
      textHeight: 0,
      // 单行文本所占高度
      lineHeight: 1,
      // 占位文本
      placeholder: "占位",
    };
  },
  props: {
    // 展示多少行
    line: {
      type: [Number, String],
      default: 1,
    },
    // 文本
    dt: {
      type: [String],
      default: "",
    },
  },

  watch: {
    dt() {
      let that = this;
      setTimeout(() => {
        let query = uni.createSelectorQuery().in(that);
        // 获取所有文本在html中的高度
        query
          .select(".content")
          .boundingClientRect((data) => {
            that.textHeight = data.height;
            // console.log("textHeight2--------", this.textHeight);
          })
          .exec();
      }, 100);
    },
  },

  mounted() {
    let query = uni.createSelectorQuery().in(this);
    // 获取所有文本在html中的高度
    query
      .select(".content")
      .boundingClientRect((data) => {
        this.textHeight = data.height;
        // console.log("textHeight1--------", this.textHeight);
      })
      .exec();

    // 通过占位元素获取单行文本的高度
    query
      .select(".placeholder")
      .boundingClientRect((data) => {
        this.lineHeight = data.height;
        // console.log("lineHeight--------", this.lineHeight);
      })
      .exec();
    // 获取单行文本高度后，置空占位元素，使其释放占位
    this.placeholder = "";
  },
  computed: {
    // 全文本所占总行数
    lines() {
      return Math.ceil(
        this.textHeight > 0 && this.lineHeight > 0
          ? this.textHeight / this.lineHeight
          : 1
      );
    },
  },
  methods: {
    expandAll() {
      this.isHide = !this.isHide;
    },
  },
};
</script>

<style scoped lang="scss">
.base-content {
  .dt-content {
    position: relative;
    overflow: hidden;
    line-height: 42rpx;
    padding-right: 31rpx;

    .content {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .expand-icon {
      position: absolute;
      right: 8rpx;
      top: 0;
      width: 32rpx;
      height: 42rpx;
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          padding-top: 5rpx;
          width: 32rpx;
          height: 42rpx;
        }
      }
    }
  }
  .one-line {
    height: 42rpx;
  }
  .more-line {
    height: auto;
  }
}
</style>
