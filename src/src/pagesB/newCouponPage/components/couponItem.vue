<template>
  <view class="coupon-wrapper">
    <view :class="['item-bg', status == 10 ? 'act' : '']">
      <view :class="['bq', status == 10 ? 'act' : '']">
        <view class="bq-text">{{ getbqName() }}</view>
      </view>
      <view class="content">
        <view v-if="201 == couponDetail.rightType" class="left">
          <view :class="['price mf', status == 10 ? 'act' : '']">免费 </view>
          <view
            v-if="couponDetail.threshold && couponDetail.threshold != ''"
            :class="['conditions', status == 10 ? 'act' : '']"
            >{{ couponDetail.threshold }}</view
          >
        </view>
        <view v-if="211 == couponDetail.rightType" class="left">
          <view :class="['price', status == 10 ? 'act' : '']"
            >{{ couponDetail.rule.amount }}
            <span :class="['dw', status == 10 ? 'act' : '']">元</span></view
          >
          <view :class="['conditions', status == 10 ? 'act' : '']">{{
            `满${couponDetail.rule.threshold}可用`
          }}</view>
        </view>
      <view v-if="231 == couponDetail.rightType" class="left">
          <view class="un-threshold">无门槛</view>
        </view>
        <view v-if="216 == couponDetail.rightType" class="left">
          <view :class="['price', status == 10 ? 'act' : '']"
            >{{ couponDetail.rule.discount }}
            <span :class="['dw', status == 10 ? 'act' : '']">折</span></view
          >
          <view :class="['conditions', status == 10 ? 'act' : '']">{{
            `满${couponDetail.rule.threshold}可用`
          }}</view>
        </view>
        
        <view class="mid">
          <view :class="['type-name', status == 10 ? 'act' : '']">{{
            couponDetail.promotionName
          }}</view>
          <view :class="['time', status == 10 ? 'act' : '']">{{
            `有效期至 ${couponDetail.expirationEndDate}`
          }}</view>
        </view>
        <view class="right">
          <view class="btn" @click="goMall" v-if="status == 10">
            <view :class="['btn-text']">立即使用</view>
          </view>
          <view v-if="status == 20" :class="['btext']">已使用</view>
          <view v-if="status == 30" :class="['btext']">已过期</view>
        </view>
      </view>
    </view>
    <view
      v-if="couponDetail.description"
      class="bottom-desc"
      :style="{
        height: isUnfold ? '' : '69rpx',
        border: status == 30 ? '2rpx solid #E8E8E8' : '2rpx solid #ffe3d7',
        borderTop: 'none',
      }"
    >
      <view
        :class="[
          'bottom-desc-text',
          showUnFoldButton ? 'show-button' : 'not-show-button',
        ]"
        >{{ couponDetail.description }}</view
      >
      <view
        class="fold-button"
        v-if="showUnFoldButton"
        @click="handleClickUnfold"
      >
        <view class="iconfont icon-outlineArrowDown" v-if="!isUnfold"></view>
        <view class="iconfont icon-outlineArrowUp" v-else></view>
      </view>
    </view>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  components: {},
  props: {
    isPageShow: {
      type: Boolean,
      default: false,
    },
    type: { type: String, default: "normal" },
    couponDetail: {
      type: Object,
    },
    status: {
      type: String,
    },
  },
  data() {
    return {
      info: {},
      showUnFoldButton: false,
      isUnfold: false,
    };
  },
  computed: {},
  watch: {},
  created() {},

  mounted() {
    this.$nextTick(() => {
      this.checkTextLines();
    });
  },
  methods: {
    getbqName() {
      if (201 == this.couponDetail.rightType) {
        return "商品券";
      } else if (211 == this.couponDetail.rightType) {
        return "满减券";
      } else if (216 == this.couponDetail.rightType) {
        return "满折券";
      } else if (231 == this.couponDetail.rightType) {
        return "问诊券";
      }
    },
    goMall() {
      console.log(this.couponDetail, 333333);
      // applyPlatform [] APP: APP, MINI: 小程序,SHOP: 门店, SHOP_ALL:门店-所有, SHOP_PART: 门店-部分, SHOP_NOT_AVAILABLE: 门店-部分不可用
      // #ifdef MP-WEIXIN
      if (
        this.couponDetail?.applyPlatform?.includes("APP") &&
        !this.couponDetail?.applyPlatform?.includes("MINI")
      ) {
        // app-专用券跳引导页
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=5`,
        });
        return;
      }
      // #endif
      uni.navigateTo({
        url: `/pagesC/availableGoods/index?promotionId=${this.couponDetail.promotionId}`,
      });
    },
    checkTextLines() {
      // 获取 <div> 标签的节点信息
      if (this.couponDetail.description) {
        const query = uni.createSelectorQuery().in(this);
        query
          .select(".bottom-desc-text")
          .boundingClientRect((data) => {
            // 获取文本内容的高度
            const height = data.height;
            // 假设行高为31rpx
            const lineHeight = 31;
            // 计算文本行数
            const lines = Math.ceil(height / lineHeight);
            console.log(height, lines);
            // 判断文本行数是否达到了2行
            if (lines >= 2) {
              console.log("文本达到了2行或以上");
              this.showUnFoldButton = true;
            } else {
              this.showUnFoldButton = false;
              console.log("文本没有达到2行");
            }
          })
          .exec();
      }
    },
    handleClickUnfold() {
      this.isUnfold = !this.isUnfold;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";

.coupon-wrapper {
  // width: 692rpx;
  padding-top: 5rpx;
  margin-bottom: 19rpx;
  padding-left: 0rpx;
  padding-right: 0rpx;
}

.item-bg {
  @include bg(
    "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon_bg_1.png"
  );
  height: 151rpx;
  width: 100%;
  position: relative;

  &.act {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon_bg_0.png"
    );
  }

  .bq {
    position: absolute;
    left: 0rpx;
    top: 0rpx;

    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon_jb_1.png"
    );
    height: 31rpx;
    width: 87rpx;

    &.act {
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon_jb_0.png"
      );
    }

    .bq-text {
      height: 31rpx;
      font-size: 21rpx;
      font-weight: 400;
      color: #ffffff;
      line-height: 31rpx;
      text-align: center;
      // &.act {
      //   color: #FE2442;
      // }
    }
  }

  .content {
    padding-top: 25rpx;
    display: flex;
    flex-direction: row;
    height: 127rpx;
    justify-content: center;
    &.act {
      color: #FE2442;
    }
  }

  .left {
    width: 193rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: -30rpx;
  }

  .price {
    height: 65rpx;
    font-size: 54rpx;
    font-weight: 600;
    color: #666666;
    line-height: 65rpx;
    text-align: center;
    font-family: D-DIN-Bold;
    &.act {
      color: #FE2442;
    }
    &.mf {
      font-size: 38rpx;
    }
  }
  .dw {
    height: 33rpx;
    font-size: 23rpx;
    font-weight: 400;
    color: #666666;
    line-height: 33rpx;
    &.act {
      color: #FE2442;
    }
  }

  .conditions {
    height: 35rpx;
    font-size: 25rpx;
    font-weight: 400;
    color: #666666;
    line-height: 35rpx;
    text-align: center;
    &.act {
      color: #FE2442;
    }
  }

  .mid {
    width: 300rpx;
    padding-left: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // padding-top: 6rpx;
  }
  .type-name {
    height: 40rpx;
    font-size: 29rpx;
    font-weight: bold;
    color: #666666;
    line-height: 40rpx;
    padding-bottom: 8rpx;
    margin-top: -20rpx;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;

    &.act {
      color: #1F1F1F;
    }
  }

  .time {
    height: 35rpx;
    font-size: 25rpx;
    font-weight: 400;
    color: #666666;
    line-height: 35rpx;
    padding-top: 22rpx;
    &.act {
      color: #FE2442;
    }
  }

  .right {
    width: 172rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .btn {
      width: 121rpx;
      height: 54rpx;
      background: #FE2442;
      border-radius: 27rpx;
      margin-left: 57rpx;
      .btn-text {
        font-size: 25rpx;
        font-weight: 500;
        color: #ffffff;
        line-height: 35rpx;
        text-align: center;
        padding: 10rpx 21rpx;
      }
    }

    .btext {
      height: 35rpx;
      font-size: 25rpx;
      font-weight: 500;
      color: rgba(102, 102, 102, 0.6);
      line-height: 35rpx;
      text-align: right;
    }
  }
}
.bottom-desc {
  border-radius: 0px 0px 15rpx 15rpx;
  padding: 24rpx 38rpx 12rpx 38rpx;
  margin-top: -15rpx;
  font-size: 21rpx;
  color: #999999;
  overflow: hidden;
  position: relative;
  // z-index: -1;
  .bottom-desc-text {
    line-height: 38rpx;
  }
  .show-button {
    padding-right: 50rpx;
  }
  .fold-button {
    position: absolute;
    right: 38rpx;
    top: 31rpx;
    .iconfont {
      font-size: 25rpx;
    }
  }
}

.un-threshold {
  color: #FE2442;
  text-align: center;
  font-size: 38rpx;
  font-weight: 600;
}
</style>
