<template>
  <view :class="['content', ismore ? 'more' : '']">
    <view class="frame">
      <view class="title">预约须知</view>
      <view class="line"></view>
      <template v-if="isImageUrl">
        <view class="noticecontent">
          <image :src="detail.shopDetail.bizNotice" mode="widthFix" />
        </view>
      </template>
      <template v-else>
        <view v-html="detail.shopDetail.bizNotice" class="noticecontent"></view>
      </template>
      <!-- <view
        class="container"
        :class="[ismore ? 'container-more' : 'container-text']"
      >
        <view class="container-text" v-html="handleTxtMsgToHtml()">
        </view>
      </view> -->
      <!-- <view class="more" @click="handleMore(true)" v-if="!ismore">
        <view class="text">查看更多</view>
        <view class="iconfont icon-outlineArrowDown"></view>
      </view>
      <view class="more" @click="handleMore(false)" v-else>
        <view class="text">收起</view>
        <view class="iconfont icon-outlineArrowUp"></view>
      </view> -->
    </view>
  </view>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
    },
  },
  data() {
    return {
      msg: "1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1",
      ismore: true,
    };
  },

  computed: {
    isImageUrl() {
      console.log(`url: ${this.detail?.shopDetail?.bizNotice}`);
      console.log(
        `is image: ${/^http:\/\/.*/g.test(this.detail?.shopDetail?.bizNotice)}`
      );
      return (
        /^https:\/\/.*/g.test(this.detail?.shopDetail?.bizNotice) ||
        /^http:\/\/.*/g.test(this.detail?.shopDetail?.bizNotice)
      );
    },
  },

  methods: {
    // 换行符处理
    handleTxtMsgToHtml() {
      let content = this.detail?.shopDetail?.bizNotice || "";
      // content = content.replace(/\n/g, (lineStr) => {
      //   return lineStr.slice(1) + "<br />";
      // });
      console.log("handleTxtMsgToHtml ", content);

      return content;
    },
    handleMore(ismore) {
      console.log("handleMore --");
      this.ismore = ismore;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

.content {
  width: 100%;
  height: 423rpx;

  background-color: #ffffff;
  border-radius: 24rpx;
  &.more {
    height: auto;
  }

  .content-more {
    height: 800rpx;
  }

  .frame {
    width: 100%;
    height: 100%;
    padding: 0 30rpx 34rpx;
  }

  .title {
    height: 105rpx;
    font-size: 29rpx;
    font-weight: 500;
    color: #1f1f1f;
    line-height: 105rpx;
  }

  .line {
    height: 2rpx;
    border: 1rpx solid #f8f8f8;
    margin-bottom: 11rpx;
  }

  .container {
    height: 285rpx;
    overflow: hidden;
  }

  .container-more {
    height: auto;
  }

  .more {
    width: 100%;
    height: 50rpx;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .text {
      // width: 100%;
      height: 50rpx;
      font-size: 23rpx;
      font-weight: 400;
      color: #999999;
      line-height: 50rpx;
      text-align: center;
    }
  }
}

.noticecontent {
  width: 100%;
  margin-top: 32rpx;
  color: #666666;
  font-size: 29rpx;
}

.container-text {
  font-size: 26rpx;
}
</style>
