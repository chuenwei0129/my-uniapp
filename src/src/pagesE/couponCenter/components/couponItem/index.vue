<template>
  <view>
    <view class="item">
      <view class="type-badge">
        <view class="title">{{ item.rightTypeDesc }}</view>
      </view>
      <view
        v-if="item.limitCount > 0 && item.receivedCount < item.limitCount"
        class="tag"
      >
        {{ item.limitCountDesc }}
      </view>
      <view class="left">
        <view v-if="item.rightType === 216" class="price"
          >{{ handleNum(item.amount * 10) }}<span class="yuan">折</span></view
        >
        <view v-if="item.rightType === 201" class="price-text">免费</view>
        <view v-if="item.rightType === 211" class="price"
          >{{ item.amount }}<span class="yuan">元</span>
        </view>
        <view class="time" v-if="item.rightType !== 201"
          >满{{ item.threshold }}可用</view
        >
      </view>
      <view class="right">
        <view class="info">
          <view class="name">{{ item.promotionName }}</view>
          <view class="time">{{ item.validityTypeDesc }}</view>
        </view>
        <view
          v-if="item.status === 10"
          class="pick-btn-no"
          @tap="$u.throttle(handleUse(item), 500)"
        >
          {{ item.statusDesc }}
        </view>
        <view v-else class="pick-btn" @click="handleReceive(item)">
          {{ item.statusDesc }}
        </view>
      </view>
    </view>
    <view
      v-if="item.description"
      class="bottom-desc"
      @click="handleClickUnfold"
      :style="{
        height: isUnfold ? '' : '69rpx',
      }"
    >
      <view
        :class="[
          'bottom-desc-text',
          showUnFoldButton ? 'show-button' : 'not-show-button',
        ]"
        >{{ item.description }}</view
      >
      <view class="fold-button" v-if="showUnFoldButton">
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
    item: {
      type: Object,
    },
  },
  data() {
    return { showUnFoldButton: false, isUnfold: false };
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
    //去调末尾的0
    handleNum(num) {
      let str = num.toFixed(2) + "";
      return str.replace(/\.?0+$/, "");
    },
    handleUse() {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "coupon_useit_click",
        module_name: "coupon_use",
        extend: {
          user_id: userInfo.userId,
        },
      });
      this.$emit("handleUse");
    },
    handleReceive() {
      this.$emit("handleReceive");
    },
    checkTextLines() {
      if (this.item.description) {
        // 获取 <div> 标签的节点信息
        const query = uni.createSelectorQuery().in(this);
        query
          .select(".bottom-desc-text")
          .boundingClientRect((data) => {
            // 获取文本内容的高度
            const height = data?.height;
            // 假设行高为31rpx
            const lineHeight = 31;
            // 计算文本行数
            const lines = Math.ceil(height / lineHeight);
            // 判断文本行数是否达到了2行
            if (lines >= 2) {
              this.showUnFoldButton = true;
            } else {
              this.showUnFoldButton = false;
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

<style scoped lang="scss">
.item {
  width: 100%;
  height: 154rpx;
  margin-top: 20rpx;
  background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/couponItemBg.png");
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  position: relative;
  .type-badge {
    position: absolute;
    top: 0;
    left: 0;
    height: 31rpx;
    width: 87rpx;
    background: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon_jb_0.png)
      no-repeat top left/100% 100%;
    .title {
      font-size: 21rpx;
      font-weight: 400;
      color: #ffffff;
      line-height: 31rpx;
      text-align: center;
    }
  }
  .tag {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 19rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 27rpx;
    background: #ff5b05;
    border-radius: 0rpx 15rpx 0rpx 15rpx;
    padding: 0 10rpx;
  }
  .left {
    width: 28%;
    text-align: center;
    position: relative;
    .type-badge {
      position: absolute;
      background: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/coupon/coupon_bg_0.png)
        no-repeat top left/100% 100%;
      top: 0;
      left: 0;
      height: 31rpx;
      width: 87rpx;
    }
    .price {
      font-size: 54rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #ff5b05;
      line-height: 50rpx;
      height: 50rpx;
    }
    .price-text {
      font-size: 38rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #ff5b05;
      line-height: 50rpx;
      height: 50rpx;
    }
    .yuan {
      font-size: 23rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #ff5b05;
    }
  }
  .right {
    width: 72%;
    padding: 0 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .info {
      width: 68%;
      .name {
        font-size: 29rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #ff5b05;
        line-height: 50rpx;
        height: 50rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .pick-btn {
      background: #ff5b05;
      border-radius: 27rpx;
      font-size: 25rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 35rpx;
      padding: 10rpx 20rpx;
    }
    .pick-btn-no {
      background: transparent;
      border-radius: 27rpx;
      font-size: 25rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ff5b05;
      line-height: 35rpx;
      padding: 10rpx 18rpx;
      border: 0.96rpx solid #ff5b05;
    }
  }
  .time {
    margin-top: 5rpx;
    font-size: 25rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #ff5b05;
    line-height: 35rpx;
  }
}
.bottom-desc {
  border-radius: 0px 0px 15rpx 15rpx;
  border: 2rpx solid #ffe3d7;
  border-top: none;
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
    top: 30rpx;
    .iconfont {
      font-size: 26rpx;
    }
  }
}
</style>
