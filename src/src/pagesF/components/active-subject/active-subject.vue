<template>
  <div>
    <view class="all">
      <view class="iconPircture">
        <image
          class="textImg"
          :src="info[currentValChange].titlePicture"
          mode="heightFix"
          @click="goThemePageTitle()"
        />
        <view
          class="icon1 iconfont icon-arrowRight"
          @click="goThemePageTitle()"
        ></view>
      </view>

      <swiper
        class="uni-swiper-wrapper"
        :autoplay="false"
        :circular="false"
        :indicator-dots="false"
        :indicator-position="center"
        :interval="3000"
        :duration="500"
        indicator-color="rgba(255, 255, 255, .4)"
        indicator-active-color="rgba(255, 255, 255, 1.0)"
        :previous-margin="getPreviousMargin()"
        :next-margin="getNextMargin()"
        @change="swiperChange"
      >
        <swiper-item
          v-for="(item, index) in info"
          :key="index"
          @click="goThemePage(item)"
        >
          <view class="item-bg" :class="[info.length == 1 ? 'one' : '']">
            <image
              class="banner-img"
              :class="[info.length == 1 ? 'one' : '']"
              :src="item.mainPicture"
              @click="setRouter(item)"
            />
            <view class="item-info">
              <view class="item-up">
                <image
                  class="tips"
                  v-if="item.iconPicture"
                  :src="item.iconPicture"
                  mode="aspectFit"
                />
                <view class="title">{{ item.subTitle }}</view>
              </view>
              <view class="item-down">
                <view class="icons">
                  <view
                    class="heads"
                    v-if="
                      item.signUpInfo && item.signUpInfo.signUpUserCount > 1
                    "
                    v-for="(headItem, j) in item.signUpInfo.signUpUserInfos"
                    :key="j"
                  >
                    <view class="head-frame" v-if="j < 4">
                      <image
                        class="head-icon"
                        :src="headItem.userHeadUrl"
                        mode="scaleToFill"
                      />
                    </view>
                  </view>
                  <view
                    class="ycyTxt"
                    v-if="item.signUpInfo.signUpUserCount > 10"
                    >已参与{{ item.signUpInfo.signUpUserCount }}</view
                  >
                </view>
                <view class="btn">
                  <view class="txt">去报名</view>
                  <view class="iconfont icon-arrowRight"></view>
                </view>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </div>
</template>

<script>
import { action_report, display_report } from "@/utils/track";
const module_name = "activity";
export default {
  props: {
    info: {
      type: Object | null,
    },
  },

  methods: {
    getPreviousMargin() {
      return this.info.length == 1 ? "25rpx" : "22rpx";
    },
    getNextMargin() {
      return this.info.length == 1 ? "0rpx" : "22rpx";
    },
    setRouter(item) {},
    goThemePage(item) {
      action_report({
        action_name: "xcxdiscover_pet_travel_theme_ip_click",
        module_name: module_name,
        extend: {
          subjectId: item.id,
          subjectName: item.name,
        },
      });
      uni.navigateTo({
        url: `/pagesF/activesThemeList/index?subjectId=${item.id}&subjectName=${item.name}&pic=${item.backDetailPicture}`,
      });
    },

    goThemePageTitle() {
      let item = this.info[this.currentValChange];
      uni.navigateTo({
        url: `/pagesF/activesThemeList/index?subjectId=${item.id}&subjectName=${item.name}&pic=${item.backDetailPicture}`,
      });
    },

    swiperChange(e) {
      console.log("swiperChange");
      this.currentValChange = e.detail.current;
      console.log(this.currentValChange);
      this.$emit(
        "changeFn",
        this.currentValChange,
        this.info[this.currentValChange].backPicture
      );
      if (this.swiperChangeSelect) {
        console.log("swiperChange");
        console.log(e);
      }
    },
  },

  data() {
    return {
      currentValChange: 0,
      swiperChangeSelect: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.uni-swiper-wrapper {
  width: 750rpx;
  height: 558rpx;
  margin: 27rpx 0rpx 19rpx 0rpx;
  // border-radius: 31rpx;
  overflow: hidden;
  transform: translateY(0);

  :deep(.uni-swiper-dots) {
    bottom: 15rpx;
  }
}

// .swiper {
//   width: 688rpx;
//   height: 219rpx;
// }

// .swiper-item {
//   display: block;
//   text-align: center;
// }

.all {
  width: 100%;
  display: flex;
  flex-direction: column;
  .iconPircture {
    width: auto;
    height: 62rpx;
    display: flex;
    flex-direction: row;
    justify-content: start;
    margin-left: 23rpx;
    margin-top: 10rpx;
    align-items: center;

    .textImg {
      width: auto;
      height: 62rpx;
      padding-right: 15rpx;
    }

    .icon1 {
      // width: 24rpx;
      // height: 28rpx;
      font-size: 44rpx;
      line-height: 62rpx;
    }
  }
}

.item-bg {
  width: 694rpx;
  height: 558rpx;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(47, 53, 77, 0.05);
  border-radius: 31rpx;
  // padding-left: 19rpx;
  // padding-right: 19rpx;

  &.one {
    width: 700rpx;
  }

  display: flex;
  flex-direction: column;

  .banner-img {
    width: 694rpx;
    height: 400rpx;
    border-radius: 31rpx 31rpx 0rpx 0rpx;
    // background: red;

    &.one {
      width: 700rpx;
    }
  }

  .item-info {
    display: flex;
    flex-direction: column;
    margin: 21rpx 23rpx;
    .item-up {
      display: flex;
      flex-direction: row;
      justify-content: start;
      margin-bottom: 16rpx;

      .tips {
        width: 42rpx;
        object-fit: cover;
        height: 42rpx;
      }
      .title {
        width: 606rpx;
        height: 40rpx;
        font-size: 29rpx;
        font-weight: bold;
        color: #333333;
        line-height: 40rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .item-down {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-left: 20rpx;
      .icons {
        display: flex;
        flex-direction: row;
        .head-frame {
          width: 54rpx;
          height: 54rpx;
          border: 2rpx solid #ffffff;
          margin-left: -20rpx;
          border-radius: 50%;
          .head-icon {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
          }
        }
        .ycyTxt {
          height: 54rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #666666;
          line-height: 54rpx;
          margin-left: 13rpx;
        }
      }
      .btn {
        width: 158rpx;
        height: 54rpx;
        background: #fee900;
        border-radius: 31rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .txt {
          height: 54rpx;
          font-size: 27rpx;
          font-weight: bold;
          color: #1f1f1f;
          line-height: 54rpx;
        }
        .iconfont {
          color: #1f1f1f;
        }
      }
    }
  }
}
</style>
