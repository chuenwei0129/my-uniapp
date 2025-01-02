<template>
  <view class="appraise-card" id="appraiseDetail">
    <view class="content" @click="openAppraisePop">
      <view class="appraise-card-title">
        <view class="title-left">评价({{ commentCount }})</view>
        <view class="title-right">
          <view
            class="text"
            v-if="highQualityList && highQualityList.length > 0"
            >查看全部</view
          >
          <view class="text" v-else>暂无评价</view>
          <i class="iconfont icon-bearingRight"></i>
        </view>
      </view>
      <view
        :class="{
          'appraise-card-content':
            highQualityList && highQualityList.length > 0,
        }"
      >
        <view
          class="comment-card-list"
          v-for="(item, index) in highQualityList"
          :key="index"
        >
          <template v-if="item.medias && item.medias.length > 0">
            <view class="list-left">
              <view class="left-top">
                <view class="avatar">
                  <image
                    v-if="item.anonymousStatus === 1"
                    class="img"
                    :src="anonymityAvatar"
                    mode="aspectFill"
                  />
                  <image
                    v-else
                    class="img"
                    :src="item.memberIcon"
                    mode="aspectFill"
                  />
                </view>
                <view v-if="item.anonymousStatus === 1" class="name"
                  >匿名买家</view
                >
                <view v-else class="name">{{ item.memberName }}</view>
                <view class="sku">
                  <view>已购</view>
                  <view class="skuName">{{ item.skuName }}</view>
                </view>
              </view>
              <view class="left-bottom"> {{ item.commentContent }} </view>
            </view>
            <view
              class="list-right"
              v-if="item.medias && item.medias.length > 0"
            >
              <image
                class="img"
                :src="item.medias[0].mediaUrl"
                mode="aspectFill"
              />
              <view class="count">+{{ item.medias.length }}</view>
            </view>
          </template>
          <template v-else>
            <view class="">
              <view class="left-top">
                <view class="avatar">
                  <image
                    v-if="item.anonymousStatus === 1"
                    class="img"
                    :src="anonymityAvatar"
                    mode="aspectFill"
                  />
                  <image
                    v-else
                    class="img"
                    :src="item.memberIcon"
                    mode="aspectFill"
                  />
                </view>
                <view v-if="item.anonymousStatus === 1" class="name"
                  >匿名买家</view
                >
                <view v-else class="name">{{ item.memberName }}</view>
                <view class="sku">
                  <view>已购</view>
                  <view class="skuName">{{ item.skuName }}</view>
                </view>
              </view>
              <view class="left-bottom">
                {{ item.commentContent }}
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "AppraiseCard",
  props: {
    commentCount: {
      type: [String, Number],
      default: "0",
    },
    highQualityList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      anonymityAvatar:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/anonymity-avatar.png",
    };
  },
  methods: {
    openAppraisePop() {
      this.$emit("openPop");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.appraise-card {
  width: 100vw;
  margin: 15.38rpx 0;
  box-sizing: border-box;
  padding: 0 15.38rpx;
  font-family: PingFangSC, PingFang SC;
  font-style: normal;
  .content {
    width: 100%;
    min-height: 88.46rpx;
    border-radius: 23rpx;
    background-color: #fff;
    padding: 23rpx 15.38rpx 23rpx 23rpx;
    .appraise-card-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title-left {
        font-weight: 500;
        @include textfclaw(31rpx, #333333, left, 42rpx);
      }

      .title-right {
        @include flex();
        .text {
          @include textfclaw(23rpx, #999999, center, 33rpx);
        }
        .iconfont {
          color: #999999;
        }
      }
    }

    .appraise-card-content {
      margin-top: 38rpx;
      padding-right: 8rpx;
      box-sizing: border-box;
      .comment-card-list {
        margin-bottom: 35rpx;
        display: flex;
        justify-content: space-between;
        .list-left {
          width: 483rpx;
        }
        .left-top {
          display: flex;
          align-items: center;
          .avatar {
            width: 33rpx;
            height: 33rpx;
            background-color: #d8d8d8;
            border-radius: 50%;
            overflow: hidden;
            font-size: 0;
            margin-right: 8rpx;
            .img {
              width: 100%;
              height: 100%;
            }
          }
          .name {
            font-weight: 500;
            @include textfclaw(23rpx, #1f1f1f, left, 23rpx);
            margin-right: 15rpx;
          }
          .sku {
            font-weight: 300;
            @include textfclaw(19rpx, #666666, left, 19rpx);
            display: flex;
            align-items: center;
            margin-top: 3rpx;
            .skuName {
              margin-left: 10rpx;
              max-width: 300rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .left-bottom {
          @include textOverflow(2);
          @include textfclaw(25rpx, #1f1f1f, left, 38rpx);
          margin-top: 15rpx;
        }
        .list-right {
          width: 154rpx;
          height: 154rpx;
          font-size: 0;
          background-color: #d8d8d8;
          border-radius: 8rpx;
          overflow: hidden;
          @include flex();
          position: relative;
          .img {
            width: 100%;
            height: 100%;
          }
          .count {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 38rpx;
            height: 38rpx;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 6rpx;
            @include flex();
            font-family: PingFangSC, PingFang SC;
            @include textfclaw(19rpx, #333333, center, 19rpx);
          }
        }
      }
    }
  }
}
</style>
