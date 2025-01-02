<template>
  <u-popup
    :show="show"
    :safeAreaInsetBottom="false"
    :closeOnClickOverlay="true"
    @close="close"
    round="38"
    mode="center"
    @touchmove.stop.prevent
  >
    <view class="content">
      <image
        class="img-up"
        src="https://image.henhenchina.com/62691b131fd33e0001bf328e/26edd657d92942ca96a45c311def3f12.png"
      >
      </image>
      <view class="text1"> 恭喜报名成功啦 </view>
      <view class="text2"> 活动实时信息点击下面活动群了解 </view>
      <view class="btns">
        <view class="btncancel" @click="cancel">
          <view class="text">取消</view>
        </view>
        <view class="btnsubmit" @click="submit">
          <view class="text">活动群入口</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { ACTIVITY_REPORT } from "@/api/activityclube";
export default {
  props: {
    show: {
      type: Boolean,
    },
    aid: {
      type: String,
    },
  },
  data() {
    return {
      tipsContent: "",
      num: 0,
    };
  },
  methods: {
    async submit() {
      console.log("123", this.aid);
      uni.navigateTo({
        url: `/pagesF/welfareGroupTrends/index?aid=${this.aid}`,
      });
      this.close();
    },

    close() {
      this.$emit("close", "close");
    },
    cancel() {
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 46rpx;
  width: 577rpx;
  height: 577rpx;
  // background: #FFFFFF;
  // border-radius: 38px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .img-up {
    width: 192rpx;
    height: 192rpx;
    margin: 0 auto;
    margin-bottom: 38rpx;
  }

  .text1 {
    width: 100%;
    // height: 42rpx;
    font-size: 31rpx;
    font-weight: bold;
    color: #000000;
    line-height: 42rpx;
    text-align: center;
    margin-bottom: 19rpx;
  }

  .text2 {
    width: 100%;
    // height: 77rpx;
    font-size: 27rpx;
    font-weight: 400;
    color: #666666;
    line-height: 38rpx;
    text-align: center;
    margin-bottom: 84rpx;
  }

  .btns {
    display: flex;

    .btncancel {
      width: 240rpx;
      height: 85rpx;
      border-radius: 42rpx;
      border: 2rpx solid #e6e6e6;
      margin-right: 19rpx;

      .text {
        width: 100%;
        height: 85rpx;
        font-size: 31rpx;
        font-weight: bold;
        color: #666666;
        line-height: 85rpx;
        text-align: center;
      }
    }

    .btnsubmit {
      width: 240rpx;
      height: 85rpx;
      background: #fee900;
      border-radius: 42rpx;

      .text {
        width: 100%;
        height: 85rpx;
        font-size: 31rpx;
        font-weight: bold;
        color: #1f1f1f;
        line-height: 85rpx;
        text-align: center;
      }
    }
  }
}

.title {
  font-size: 31rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  line-height: 42rpx;
  padding: 31rpx 0 23rpx 0;
  text-align: center;
  position: relative;
}

.textarea {
  width: 100%;
  height: 231rpx;
  background: #f5f6f7;
  border-radius: 38rpx;
  padding: 31rpx 31rpx 15rpx 31rpx;
}

.btn {
  font-size: 31rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fee900;
  line-height: 42rpx;
  padding: 25rpx 0 27rpx 0;
  text-align: center;
  border-top: 1rpx solid #e6e6e6;
  margin-top: 46rpx;
}

.tips {
  position: absolute;
  right: 77rpx;
  bottom: 159rpx;
  z-index: 10;
  font-size: 27rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #999999;
  line-height: 38rpx;
}
</style>
