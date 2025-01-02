<script>
export default {
  name: "couponDetailPopView",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    pdScore: {
      type: Number,
      default: () => 0,
    },
    pdLevelIndex: {
      type: [String, Number],
      default: () => "",
    },
    upGradeDescObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      safeBottomPadding: 0,
    };
  },
  watch: {},
  computed: {
    vipNum() {
      return Number(this.upGradeDescObj.levelIndex) + 1;
    },
  },
  emits: ["onClose", "onRefresh"],
  methods: {
    close() {
      this.$emit("onClose");
    },
  },
  mounted() {},
};
</script>

<template>
  <root-portal>
    <view class="popup-wrapper">
      <u-popup
        :show="show"
        @close="close"
        mode="bottom"
        :overlay="true"
        :closeOnClickOverlay="true"
        round="38rpx"
        :safeAreaInsetBottom="false"
      >
        <view>
          <view class="header">
            <view class="title"> 购物返胖豆 </view>
            <view class="right">
              <image
                mode="aspectFit"
                :style="{ width: '50rpx', height: '50rpx' }"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/popview_close_icon.png"
                @click="close"
              />
            </view>
          </view>
          <view class="content-paddin">
            <view class="content">
              <view class="title">专属权益</view>
              <view class="infoCard">
                <view class="pdText"> 胖豆 </view>
                <view class="vipText">
                  V{{ pdLevelIndex }}会员购买预计可返<span
                    style="color: #fe2442"
                    >{{ pdScore }}</span
                  >胖豆
                </view>
              </view>
            </view>
            <view class="describe-content" v-if="!upGradeDescObj.isMaxLevel">
              <view class="title">会员升级</view>
              <view class="describe" v-if="upGradeDescObj.num"
                >还差<text class="describe-num">{{ upGradeDescObj.num }}</text
                >成长值升级V{{
                  vipNum
                }}，每实付1元获得1成长值，升级可得更多胖豆，最高30倍。</view
              >
              <view class="describe" v-else
                >您的成长值已满足升级条件，请前往宠胖胖APP解锁升级</view
              >
              <!-- 您的成长值已满足升级条件，请前往宠胖胖APP解锁升级 -->
            </view>
          </view>
          <!-- <view class="bottom-wrapper">
            <view class="bottom-buttons" @click="close"> 关闭</view>
          </view> -->
        </view>
        <!-- <u-safe-bottom></u-safe-bottom> -->
      </u-popup>
    </view>
  </root-portal>
</template>

<style scoped lang="scss">
.header {
  padding: 38rpx 29rpx;
  text-align: center;
  // margin-bottom: 39rpx;
  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 35rpx;
    color: #000000;
    line-height: 38rpx;
    text-align: center;
    font-style: normal;
  }
  .right {
    position: absolute;
    top: 29rpx;
    right: 29rpx;
  }
}
.content-paddin {
  margin-bottom: 85rpx;
  .content {
    // padding: 0 15px;
    padding: 0 15px;
    .title {
      font-weight: 400;
      font-size: 29rpx;
      color: #1f1f1f;
    }
    .infoCard {
      background: #fcf7ee;
      border-radius: 8px;
      border: 1px solid #f9edd3;
      margin-top: 19px;
      height: 44px;
      display: flex;
      align-items: center;
      .pdText {
        font-weight: 500;
        font-size: 15px;
        color: #6e4708;
        width: 54px;
        text-align: center;
        border-right: 1px solid #f9edd3;
        height: 44px;
        line-height: 44px;
      }
      .vipText {
        font-weight: 400;
        font-size: 13px;
        color: #6e4708;
        margin-left: 23rpx;
      }
    }
  }
  .describe-content {
    padding: 0 30rpx;
    margin-top: 38rpx;
    .title {
      font-weight: 400;
      font-size: 29rpx;
      color: #1f1f1f;
    }
    .describe {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: #666666;
      line-height: 35rpx;
      text-align: left;
      font-style: normal;
      margin-top: 19rpx;
      // margin-bottom: 85rpx;
      .describe-num {
        color: #fe2442;
      }
    }
  }
}

.bottom-wrapper {
  margin-top: 56px;
  padding: 0px 20px;
  .bottom-buttons {
    background: #fe2442;
    border-radius: 22px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
  }
}
</style>
