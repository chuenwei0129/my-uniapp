<template>
  <view>
    <!-- #ifdef H5 -->
    <NavBar
      :title="'添加备注'"
      navColor="transparent"
      :whiteBack="false"
      showBackBtn
      @navBackClickHandle="handleReturn"
      :customback="true"
    >
    </NavBar>
    <!-- #endif -->
    <view class="page-wrapper">
      <view class="remark-content">
        <u-textarea
          v-model.trim="remark"
          :focus="true"
          :maxlength="maxlength"
          :adjustPosition="true"
          height="300rpx"
          :placeholder="placeholder"
          class="remark-text"
          placeholderClass="remark-hint"
          :showConfirmBar="false"
          border="none"
          :count="true"
        ></u-textarea>
      </view>

      <view class="quick-title">快捷标签</view>
      <view class="quick-wrapper">
        <block v-for="item in tags" :key="item">
          <view class="tag">{{ item }}</view>
        </block>
      </view>

      <view class="bottom-wrapper">
        <view :class="['save-btn']" @click="handleSave()"> 完成 </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      placeholder: "请输入备注",
      maxlength: 50,
      remark: "",
      tags: ["放门口就可以，别敲门谢谢", "可以从地下室上来", "请尽快发货谢谢"],
    };
  },

  onLoad(options) {
    this.maxlength = options.maxlength ?? 50;
    if (options.placeholder) {
      this.placeholder = decodeURIComponent(options.placeholder);
    } else {
      this.placeholder = "点击输入备注，平台商家和快递员均可看到";
    }
    this.remark = decodeURIComponent(options.remark) ?? "";
  },

  computed: {
    hasRemark() {
      return this.remark && this.remark.length > 0;
    },
  },

  methods: {
    handleSave() {
      let marker = this.remark.trim();
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("resultEvent", {
        data: marker,
      });
      uni.navigateBack();
    },

    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style>
page {
  background-color: #f7f8fc;
}
</style>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-flow: column nowrap;

  padding-left: 32rpx;
  padding-right: 32rpx;

  .remark-content {
    font-size: 29px;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
    margin-top: 10rpx;
    background-color: white;
    border-radius: 23rpx;
    ::v-deep .u-textarea {
      border-radius: 23rpx !important;
      caret-color: red;
    }
    ::v-deep .u-textarea__count {
      color: #999999 !important;
    }
    ::v-deep .remark-text {
      font-size: 29rpx;
      color: #1f1f1f;
      padding: 23rpx 26rpx;
      width: 100%;
    }

    ::v-deep .remark-hint {
      font-size: 29rpx;
      color: #999999;
      // padding: 23rpx 26rpx;
      width: 100%;
    }
  }

  .quick-title {
    font-size: 29rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
    margin-top: 38rpx;
    display: none;
  }

  .quick-wrapper {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    display: none;

    .tag {
      font-size: 29rpx;
      font-weight: 400;
      color: #333333;
      line-height: 58rpx;
      padding: 0 23rpx;
      height: 58rpx;
      background: #ffffff;
      border-radius: 29rpx;
      margin-top: 19rpx;
      margin-right: 19rpx;
    }
  }

  .bottom-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;

    .save-btn {
      width: 673rpx;
      height: 85rpx;
      margin-top: 18rpx;
      margin-bottom: 58rpx;
      background: #fe2442;
      border-radius: 42rpx;
      line-height: 85rpx;
      font-size: 31rpx;
      font-weight: bold;
      color: #fff;
      text-align: center;
    }

    .save-btn.disable {
      background: #eeeeee;
      color: #999999;
    }
  }
}

::v-deep .header .navbar-wrapper .title {
  font-weight: 500 !important;
}
</style>
